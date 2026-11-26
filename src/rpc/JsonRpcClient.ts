import { ConnectionError, RequestCancelledError } from '../types';

interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error?: Error): void;
}

const noopLogger: Logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};

export interface JsonRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    // Optional server-provided detail (e.g. mobilefleet-client's real capture
    // failure behind a generic "Streaming error").
    data?: unknown;
  };
}

interface WebSocketCloseEvent {
  code: number;
  reason?: string;
}

enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  FAILED = 'failed'
}

interface PendingRequest {
  resolve: (result: any) => void;
  reject: (error: Error) => void;
  timeoutId?: ReturnType<typeof setTimeout>;
  method: string;
}

interface TokenExchangeResponse {
  token: string;
  expiresAt: string;
}

const JSON_RPC_VERSION = '2.0';

// Builds "<message>: <data>" so the server's detail isn't lost behind a generic
// message like "Streaming error".
export function formatJsonRpcError(error: { message?: string; data?: unknown }): string {
  const message = error.message || 'JSON-RPC error';
  if (error.data === undefined || error.data === null || error.data === '') {
    return message;
  }
  const detail = typeof error.data === 'string' ? error.data : JSON.stringify(error.data);
  // Some servers already fold the detail into message; don't print it twice.
  if (message.includes(detail)) {
    return message;
  }
  return `${message}: ${detail}`;
}

const CONNECTION_TIMEOUT_MS = 10000;

// Reconnect attempts after the socket drops, waiting RECONNECT_DELAY_MS times the attempt number
// between them (1s, 2s, ... 5s: about 15s in all) before giving up.
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 1000;

// What a viewer shows the user: the socket dropped and is being retried, came back, or gave up.
export type ReconnectEvent = 'reconnecting' | 'reconnected' | 'failed';

export class JsonRpcClient {

  private idCounter = 1;
  private ws: WebSocket | null = null;
  private wsState: ConnectionState = ConnectionState.DISCONNECTED;
  private pendingRequests = new Map<number, PendingRequest>();
  private reconnectAttempts = 0;
  private isReconnecting = false;
  private isClosedByCaller = false;
  // Set when reconnect() gave up; the next request reconnects and reports it as 'reconnected'.
  private hasGivenUp = false;
  private messageQueue: Array<{ method: string; params: any; id: number }> = [];
  private connectionListeners: Array<(state: ConnectionState) => void> = [];
  private logger: Logger;
  private sessionToken?: string;
  public onReconnectEvent?: (event: ReconnectEvent) => void;

  constructor(public readonly url: string, logger?: Logger, private authToken?: string) {
    this.logger = logger || noopLogger;
    if (!this.authToken) {
      this.authToken = "UNSET";
    }
  }

  private async exchangeTokenForSession(): Promise<void> {
    if (!this.authToken || this.authToken === "UNSET") {
      this.logger.warn('no auth token available for exchange');
      return;
    }

    // JWTs have 3 dot-separated parts — anything else is already a session token
    const isJwt = this.authToken.split('.').length === 3;
    if (!isJwt) {
      this.sessionToken = this.authToken;
      return;
    }

    const url = new URL(this.url);
    const protocol = (url.protocol === 'wss:' || url.protocol === 'https:') ? 'https:' : 'http:';
    const authUrl = `${protocol}//${url.host}/auth/token`;

    this.logger.info(`exchanging token at ${authUrl}`);

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`token exchange failed with status ${response.status}`);
    }

    const data = await response.json() as TokenExchangeResponse;
    this.sessionToken = data.token;
    this.logger.info(`token exchange successful, expires at: ${data.expiresAt}`);
  }

  private getWebSocketUrl(): string {
    const url = new URL(this.url);
    const protocol = (url.protocol === 'https:' || url.protocol === "wss:") ? 'wss:' : 'ws:';
    let wsUrl = `${protocol}//${url.host}/ws`;

    if (this.sessionToken) {
      wsUrl += `?token=${this.sessionToken}`;
    }

    return wsUrl;
  }

  private async connectWebSocket(): Promise<void> {
    if (this.wsState === ConnectionState.CONNECTED) {
      return;
    }

    if (this.wsState === ConnectionState.CONNECTING) {
      return this.waitForConnection();
    }

    if (this.wsState === ConnectionState.FAILED) {
      this.logger.info('retrying websocket connection after previous failure');
      this.wsState = ConnectionState.DISCONNECTED;
    }

    this.wsState = ConnectionState.CONNECTING;

    try {
      await this.exchangeTokenForSession();

      this.ws = new WebSocket(this.getWebSocketUrl());

      this.attachWebSocketHandlers();
      await this.waitForConnection();
      if (this.hasGivenUp) {
        this.hasGivenUp = false;
        this.onReconnectEvent?.('reconnected');
      }
    } catch {
      this.wsState = ConnectionState.FAILED;
      this.ws = null;
      throw new ConnectionError('failed to connect to websocket');
    }
  }

  private waitForConnection(): Promise<void> {
    if (this.wsState === ConnectionState.CONNECTED) return Promise.resolve();
    if (this.wsState === ConnectionState.FAILED) return Promise.reject(new ConnectionError('websocket connection failed'));

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeoutId);
        this.removeConnectionListener(listener);
      };

      const listener = (state: ConnectionState) => {
        if (state === ConnectionState.CONNECTED) {
          cleanup();
          resolve();
        } else if (state === ConnectionState.FAILED) {
          cleanup();
          reject(new ConnectionError('websocket connection failed'));
        }
      };

      const timeoutId = setTimeout(() => {
        this.removeConnectionListener(listener);
        if (this.wsState !== ConnectionState.CONNECTED) {
          this.wsState = ConnectionState.FAILED;
          if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
          reject(new ConnectionError('websocket connection timeout'));
        }
      }, CONNECTION_TIMEOUT_MS);

      this.addConnectionListener(listener);
    });
  }

  private addConnectionListener(listener: (state: ConnectionState) => void): void {
    this.connectionListeners.push(listener);
  }

  private removeConnectionListener(listener: (state: ConnectionState) => void): void {
    this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
  }

  private notifyConnectionListeners(): void {
    for (const listener of this.connectionListeners) {
      listener(this.wsState);
    }
  }

  private attachWebSocketHandlers(): void {
    if (!this.ws) {
      return;
    }

    this.ws.onopen = () => this.handleWebSocketOpen();
    this.ws.onmessage = (event) => this.handleWebSocketMessage(event.data);
    this.ws.onerror = (error) => this.handleWebSocketError(error);
    this.ws.onclose = (event) => this.handleWebSocketClose(event);
  }

  private handleWebSocketOpen(): void {
    this.logger.info('websocket connected');
    this.wsState = ConnectionState.CONNECTED;
    this.notifyConnectionListeners();
    this.reconnectAttempts = 0;
    this.flushMessageQueue();
  }

  private handleWebSocketMessage(data: string): void {
    try {
      const response = JSON.parse(data) as JsonRpcResponse<any>;
      const pending = this.pendingRequests.get(response.id);

      if (pending) {
        this.logger.info(`received response for request id: ${response.id} method: ${pending.method}`);

        if (pending.timeoutId) {
          clearTimeout(pending.timeoutId);
        }

        this.pendingRequests.delete(response.id);

        if (response.error) {
          pending.reject(new Error(formatJsonRpcError(response.error)));
        } else {
          pending.resolve(response.result);
        }
      } else {
        this.logger.warn(`received response for unknown request id: ${response.id}`);
      }
    } catch (error) {
      this.logger.error('error parsing websocket message', error as Error);
    }
  }

  private handleWebSocketError(error: Event): void {
    const errorDetails = (error as any).message || error.type || 'unknown error';
    this.logger.error(`websocket error: ${errorDetails}`);

    if (this.wsState === ConnectionState.CONNECTING) {
      this.wsState = ConnectionState.FAILED;
      this.notifyConnectionListeners();
    }
  }

  private handleWebSocketClose(event: WebSocketCloseEvent): void {
    const reason = event.reason || 'no reason provided';
    this.logger.info(`websocket closed, code: ${event.code}, reason: ${reason}`);

    if (this.wsState === ConnectionState.CONNECTING) {
      this.wsState = ConnectionState.FAILED;
      this.notifyConnectionListeners();
    } else {
      this.wsState = ConnectionState.DISCONNECTED;
      this.ws = null;

      // An unexpected drop (proxy idle timeout, network blip): reconnect right away, so the next
      // tap works instead of failing once and leaving the controls dead.
      if (!this.isClosedByCaller && !this.isReconnecting) {
        void this.reconnect();
      }
    }
  }

  // Retries with a growing delay. Requests sent meanwhile wait in the queue and go out on the
  // new socket; if every attempt fails they are rejected.
  private async reconnect(): Promise<void> {
    this.isReconnecting = true;
    this.reconnectAttempts = 0;
    this.onReconnectEvent?.('reconnecting');

    while (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      this.logger.info(`attempting websocket reconnect (${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY_MS * this.reconnectAttempts));
      if (this.isClosedByCaller) {
        return;
      }

      try {
        await this.connectWebSocket();
        this.isReconnecting = false;
        this.onReconnectEvent?.('reconnected');
        return;
      } catch {
        // next attempt
      }
    }

    this.logger.error('max reconnect attempts reached');
    this.isReconnecting = false;
    this.hasGivenUp = true;
    this.wsState = ConnectionState.FAILED;
    this.messageQueue = [];
    this.failAllPendingRequests(new ConnectionError('websocket connection lost'));
    this.onReconnectEvent?.('failed');
  }

  private failAllPendingRequests(error: Error): void {
    this.pendingRequests.forEach(pending => {
      if (pending.timeoutId) {
        clearTimeout(pending.timeoutId);
      }
      pending.reject(error);
    });
    this.pendingRequests.clear();
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.wsState === ConnectionState.CONNECTED) {
      const msg = this.messageQueue.shift();
      if (msg && this.ws) {
        this.ws.send(JSON.stringify({
          jsonrpc: JSON_RPC_VERSION,
          id: msg.id,
          method: msg.method,
          params: msg.params
        }));
      }
    }
  }

  private async sendViaWebSocket<T>(method: string, params: any, timeoutMs?: number): Promise<T> {
    // While reconnecting, the request is queued below and sent once the new socket opens.
    if (!this.isReconnecting) {
      await this.connectWebSocket();
    }

    const id = this.idCounter++;

    return new Promise<T>((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      if (timeoutMs !== undefined) {
        timeoutId = setTimeout(() => {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }

      this.pendingRequests.set(id, {
        resolve,
        reject,
        timeoutId,
        method
      });

      const message = {
        jsonrpc: JSON_RPC_VERSION,
        id,
        method,
        params
      };

      if (this.ws && this.wsState === ConnectionState.CONNECTED) {
        this.ws.send(JSON.stringify(message));
      } else {
        this.messageQueue.push(message);
      }
    });
  }

  public sendJsonRpcRequest = async <T>(method: string, params: any, timeoutMs?: number): Promise<T> => {
    return this.sendViaWebSocket<T>(method, params, timeoutMs);
  };

  public get isDisconnected(): boolean {
    if (this.isReconnecting) {
      return false;
    }
    return this.wsState === ConnectionState.DISCONNECTED || this.wsState === ConnectionState.FAILED;
  }

  public disconnect(): void {
    this.isClosedByCaller = true;
    this.isReconnecting = false;
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }

    this.wsState = ConnectionState.DISCONNECTED;
    // teardown is not a transport failure, so callers can tell them apart
    this.failAllPendingRequests(new RequestCancelledError());
    this.messageQueue = [];
  }
}

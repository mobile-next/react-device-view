import { ConnectionError } from '../types';

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

export class JsonRpcClient {

  private idCounter = 1;
  private ws: WebSocket | null = null;
  private wsState: ConnectionState = ConnectionState.DISCONNECTED;
  private pendingRequests = new Map<number, PendingRequest>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 0;
  private reconnectDelay = 1000;
  private messageQueue: Array<{ method: string; params: any; id: number }> = [];
  private logger: Logger;
  private sessionToken?: string;

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
    this.logger.info("Converted " + this.url + " => " + wsUrl);

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
    } catch {
      this.wsState = ConnectionState.FAILED;
      this.ws = null;
      throw new ConnectionError('failed to connect to websocket');
    }
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.wsState === ConnectionState.CONNECTED) {
          clearInterval(checkInterval);
          resolve();
        } else if (this.wsState === ConnectionState.FAILED) {
          clearInterval(checkInterval);
          reject(new ConnectionError('websocket connection failed'));
        }
      }, 50);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (this.wsState !== ConnectionState.CONNECTED) {
          this.wsState = ConnectionState.FAILED;
          if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
          reject(new ConnectionError('websocket connection timeout'));
        }
      }, 2000);
    });
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
    this.logger.info(`websocket connected to ${this.getWebSocketUrl()}`);
    this.wsState = ConnectionState.CONNECTED;
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
          pending.reject(new Error(response.error.message || 'JSON-RPC error'));
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
    }
  }

  private handleWebSocketClose(event: WebSocketCloseEvent): void {
    const reason = event.reason || 'no reason provided';
    this.logger.info(`websocket closed, code: ${event.code}, reason: ${reason}`);

    if (this.wsState === ConnectionState.CONNECTING) {
      this.wsState = ConnectionState.FAILED;
    } else {
      this.wsState = ConnectionState.DISCONNECTED;
      this.ws = null;

      if (this.pendingRequests.size > 0 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      }
    }
  }

  private async attemptReconnect(): Promise<void> {
    this.reconnectAttempts++;
    this.wsState = ConnectionState.RECONNECTING;

    this.logger.info(`attempting websocket reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    await new Promise(resolve => setTimeout(resolve, this.reconnectDelay * this.reconnectAttempts));

    try {
      await this.connectWebSocket();
    } catch {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.logger.error('max reconnect attempts reached');
        this.wsState = ConnectionState.FAILED;
        this.failAllPendingRequests();
      }
    }
  }

  private failAllPendingRequests(): void {
    const error = new Error('WebSocket connection failed, please retry');
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
    await this.connectWebSocket();

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
    return this.wsState === ConnectionState.DISCONNECTED || this.wsState === ConnectionState.FAILED;
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.wsState = ConnectionState.DISCONNECTED;
    this.pendingRequests.clear();
    this.messageQueue = [];
  }
}

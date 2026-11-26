import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JsonRpcClient, ReconnectEvent } from './JsonRpcClient';

// A socket that opens on the next tick, unless the server is down, in which case it closes.
class FakeSocket {
  static sockets: FakeSocket[] = [];
  static isServerDown = false;
  onopen: (() => void) | null = null;
  onmessage: unknown = null;
  onerror: unknown = null;
  onclose: ((event: { code: number }) => void) | null = null;
  sent: string[] = [];

  constructor() {
    FakeSocket.sockets.push(this);
    setTimeout(() => {
      if (FakeSocket.isServerDown) {
        this.onclose?.({ code: 1006 });
        return;
      }
      this.onopen?.();
    }, 0);
  }

  send(message: string) { this.sent.push(message); }
  close() {}
}

const latestSocket = () => FakeSocket.sockets[FakeSocket.sockets.length - 1];
const dropConnection = () => latestSocket().onclose?.({ code: 1006 });
const waitSeconds = (seconds: number) => vi.advanceTimersByTimeAsync(seconds * 1000);

function connectedClient(events: ReconnectEvent[]) {
  const client = new JsonRpcClient('ws://localhost:1', undefined, 'token');
  client.onReconnectEvent = (event) => events.push(event);
  void client.sendJsonRpcRequest('device.info', {}).catch(() => {});
  return client;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('WebSocket', FakeSocket);
  FakeSocket.sockets = [];
  FakeSocket.isServerDown = false;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('JsonRpcClient reconnect', () => {
  it('reconnects when the socket drops, even with no request in flight', async () => {
    const events: ReconnectEvent[] = [];
    connectedClient(events);
    await waitSeconds(0.1);

    dropConnection();
    await waitSeconds(2);

    expect(events).toEqual(['reconnecting', 'reconnected']);
    expect(FakeSocket.sockets).toHaveLength(2);
  });

  it('sends a request made while reconnecting on the new socket', async () => {
    const client = connectedClient([]);
    await waitSeconds(0.1);

    dropConnection();
    void client.sendJsonRpcRequest('device.io.tap', { x: 1, y: 2 });
    await waitSeconds(2);

    expect(FakeSocket.sockets).toHaveLength(2);
    expect(latestSocket().sent.join()).toContain('device.io.tap');
  });

  it('gives up after several attempts and fails the waiting requests', async () => {
    const events: ReconnectEvent[] = [];
    const client = connectedClient(events);
    await waitSeconds(0.1);

    FakeSocket.isServerDown = true;
    dropConnection();
    const tap = client.sendJsonRpcRequest('device.io.tap', {});
    const rejection = expect(tap).rejects.toThrow(/connection/i);
    await waitSeconds(60);

    await rejection;
    expect(events).toEqual(['reconnecting', 'failed']);
  });

  it('reconnects on the next request after giving up, and says so', async () => {
    const events: ReconnectEvent[] = [];
    const client = connectedClient(events);
    await waitSeconds(0.1);
    FakeSocket.isServerDown = true;
    dropConnection();
    await waitSeconds(60);

    FakeSocket.isServerDown = false;
    void client.sendJsonRpcRequest('device.io.tap', {});
    await waitSeconds(1);

    expect(events).toEqual(['reconnecting', 'failed', 'reconnected']);
    expect(latestSocket().sent.join()).toContain('device.io.tap');
  });

  it('does not reconnect after disconnect()', async () => {
    const events: ReconnectEvent[] = [];
    const client = connectedClient(events);
    await waitSeconds(0.1);

    client.disconnect();
    dropConnection();
    await waitSeconds(10);

    expect(events).toEqual([]);
    expect(FakeSocket.sockets).toHaveLength(1);
  });
});

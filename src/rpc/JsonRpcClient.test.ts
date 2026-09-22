import { describe, it, expect, vi } from 'vitest';
import { formatJsonRpcError, JsonRpcClient } from './JsonRpcClient';
import { RequestCancelledError } from '../types';

describe('formatJsonRpcError', () => {
  it('appends string data to the message', () => {
    expect(formatJsonRpcError({ message: 'Streaming error', data: 'no decodable video within 10s' }))
      .toBe('Streaming error: no decodable video within 10s');
  });

  it('returns just the message when data is absent', () => {
    expect(formatJsonRpcError({ message: 'Streaming error' })).toBe('Streaming error');
  });

  it('serializes non-string data', () => {
    expect(formatJsonRpcError({ message: 'x', data: { code: 1 } })).toBe('x: {"code":1}');
  });

  it('falls back when message is missing', () => {
    expect(formatJsonRpcError({})).toBe('JSON-RPC error');
  });
});

describe('formatJsonRpcError when the server already folded data into message', () => {
  it('does not repeat the detail', () => {
    expect(formatJsonRpcError({ message: 'device.io.tap failed: busy', data: 'busy' }))
      .toBe('device.io.tap failed: busy');
  });
});

class FakeWebSocket {
  onopen: (() => void) | null = null;
  onmessage: unknown = null;
  onerror: unknown = null;
  onclose: unknown = null;

  constructor() {
    setTimeout(() => this.onopen?.(), 0);
  }

  send() {}
  close() {}
}

const socketToOpen = () => new Promise(resolve => setTimeout(resolve, 10));

describe('JsonRpcClient.disconnect', () => {
  it('rejects pending requests with RequestCancelledError', async () => {
    vi.stubGlobal('WebSocket', FakeWebSocket);
    const client = new JsonRpcClient('ws://localhost:1', undefined, 'token');
    const request = client.sendJsonRpcRequest('device.tap', {});
    const rejection = expect(request).rejects.toBeInstanceOf(RequestCancelledError);

    await socketToOpen();
    client.disconnect();

    await rejection;
    vi.unstubAllGlobals();
  });
});

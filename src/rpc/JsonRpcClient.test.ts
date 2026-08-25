import { describe, it, expect } from 'vitest';
import { formatJsonRpcError } from './JsonRpcClient';

describe('formatJsonRpcError', () => {
  it('appends string data to the message', () => {
    expect(formatJsonRpcError({ message: 'Streaming error', data: 'no decodable video within 10s' })).toBe(
      'Streaming error: no decodable video within 10s',
    );
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

import { describe, it, expect } from 'vitest';
import { isSessionClosedError } from './WebRtcStream';

describe('isSessionClosedError', () => {
  it('is terminal once the server reports the session already closed', () => {
    expect(
      isSessionClosedError(
        'JSON-RPC error: Server error - session sc-28d1298d392946f7 existed but closed 2s ago: reason=ice-closed, publisher lived 5.47s, gotVideo=false',
      ),
    ).toBe(true);
    expect(isSessionClosedError('viewer offer for already-closed session')).toBe(true);
  });

  it('is NOT terminal for the transient "publisher not connected yet" case', () => {
    expect(isSessionClosedError('JSON-RPC error: Server error - client not connected yet, no track available')).toBe(false);
  });

  it('is NOT terminal for arbitrary/unknown errors', () => {
    expect(isSessionClosedError('network timeout')).toBe(false);
  });
});

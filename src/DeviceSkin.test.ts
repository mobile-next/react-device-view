import { describe, it, expect } from 'vitest';
import { toCssPercent } from './DeviceSkin';

describe('toCssPercent', () => {
  it('expresses a value as a percentage of a total', () => {
    expect(toCssPercent(50, 200)).toBe('25%');
    expect(toCssPercent(1080, 1198)).toBe(`${(1080 / 1198) * 100}%`);
  });

  it('returns 0% when the value is zero', () => {
    expect(toCssPercent(0, 1198)).toBe('0%');
  });
});

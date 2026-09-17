import { describe, it, expect } from 'vitest';
import { toScreenCoords } from './screenCoords';

const rect = { left: 100, top: 50, width: 200, height: 400 };
const screen = { width: 400, height: 800 };

describe('toScreenCoords', () => {
  it('scales a point inside the stream to device pixels', () => {
    expect(toScreenCoords(200, 250, rect, screen)).toEqual({ x: 100, y: 200, screenX: 200, screenY: 400 });
  });

  it('clamps a point left of and above the stream to the top-left pixel', () => {
    expect(toScreenCoords(80, 10, rect, screen)).toEqual({ x: 0, y: 0, screenX: 0, screenY: 0 });
  });

  it('clamps a point right of and below the stream to the last pixel', () => {
    expect(toScreenCoords(400, 900, rect, screen)).toEqual({ x: 200, y: 400, screenX: 399, screenY: 799 });
  });
});

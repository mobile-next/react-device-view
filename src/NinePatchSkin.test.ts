import { describe, it, expect } from 'vitest';
import { mapButtonTop, nativeFrameSize, nativeScreenSlot } from './NinePatchSkin';
import { iosNinePatchSkin as skin } from './skins/iosNinePatch';

describe('nativeFrameSize', () => {
  it('reproduces the source image size for the reference screen aspect', () => {
    const frame = nativeFrameSize(skin, { width: 1206, height: 2622, scale: 3 });
    expect(frame.width).toBeCloseTo(640, -1);
    expect(frame.height).toBeCloseTo(1332, -1);
  });

  it('keeps the reference width and shortens for a squatter screen (iPad)', () => {
    const slot = nativeScreenSlot(skin, { width: 1640, height: 2360, scale: 2 });
    expect(slot.width).toBe(592);
    expect(slot.height).toBeCloseTo(592 * 2360 / 1640);
  });

  it('keeps the reference height and narrows for a taller screen', () => {
    const slot = nativeScreenSlot(skin, { width: 1, height: 3, scale: 1 });
    expect(slot.height).toBe(1285);
    expect(slot.width).toBeCloseTo(1285 / 3);
  });

  it('falls back to the reference screen when size is unknown', () => {
    expect(nativeFrameSize(skin, { width: 0, height: 0, scale: 1 })).toEqual({ width: 640, height: 1332 });
  });
});

describe('mapButtonTop', () => {
  const skin = { imageHeight: 1000, slice: 100 } as Parameters<typeof mapButtonTop>[0];

  it('keeps a button in place when the frame matches the image height', () => {
    expect(mapButtonTop(skin, 1000, { top: 300, height: 50 })).toBe(300);
  });

  it('pulls a button inward on a squat frame instead of overflowing it', () => {
    const top = mapButtonTop(skin, 400, { top: 600, height: 50 });
    expect(top).toBeGreaterThanOrEqual(100);
    expect(top + 50).toBeLessThanOrEqual(300);
  });
});

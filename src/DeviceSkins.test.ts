import { describe, it, expect } from 'vitest';
import { getDeviceSkinForDevice, NoDeviceSkin } from './DeviceSkins';
import { DeviceDescriptor, DevicePlatform, DeviceType } from './types';

// The skin is chosen from the device `model` (OS hardware id), independent of
// the user-assigned `name`.
function androidDevice(model: string): DeviceDescriptor {
  return { id: 'x', name: 'TestDeviceName', model, platform: DevicePlatform.ANDROID, type: DeviceType.REAL };
}

function hasFrame(model: string): boolean {
  return getDeviceSkinForDevice(androidDevice(model)) !== NoDeviceSkin;
}

describe('getDeviceSkinForDevice', () => {
  it('gives the Pixel 9 a frame regardless of variant naming', () => {
    expect(hasFrame('Pixel 9')).toBe(true);
    expect(hasFrame('Google Pixel 9')).toBe(true);
    expect(hasFrame('Pixel_9')).toBe(true);
  });

  it('does not confuse Pixel 9 variants for the Pixel 9', () => {
    expect(hasFrame('Pixel 9 Pro')).toBe(false);
    expect(hasFrame('Pixel 9 Pro XL')).toBe(false);
    expect(hasFrame('Pixel 9 Pro Fold')).toBe(false);
    expect(hasFrame('Pixel 9a')).toBe(false);
  });

  it('gives every other device no frame', () => {
    expect(hasFrame('Pixel 8')).toBe(false);
    expect(hasFrame('Pixel 10')).toBe(false);
    expect(hasFrame('')).toBe(false);
    expect(getDeviceSkinForDevice({
      id: 'x', name: 'iPhone', model: 'iPhone 15', platform: DevicePlatform.IOS, type: DeviceType.SIMULATOR,
    })).toBe(NoDeviceSkin);
  });
});

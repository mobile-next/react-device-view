import { describe, it, expect } from 'vitest';
import { getDeviceSkinForDevice, NoDeviceSkin } from './DeviceSkins';
import { DeviceDescriptor, DevicePlatform, DeviceType } from './types';

// The skin is chosen from the device `model` (OS hardware id), independent of
// the user-assigned `name`.
function androidDevice(model: string): DeviceDescriptor {
  return { id: 'x', name: 'TestDeviceName', model, platform: DevicePlatform.ANDROID, type: DeviceType.REAL };
}

function iosDevice(model: string): DeviceDescriptor {
  return { id: 'x', name: 'TestDeviceName', model, platform: DevicePlatform.IOS, type: DeviceType.REAL };
}

function hasFrame(model: string): boolean {
  return getDeviceSkinForDevice(androidDevice(model)) !== NoDeviceSkin;
}

function iosHasFrame(model: string): boolean {
  return getDeviceSkinForDevice(iosDevice(model)) !== NoDeviceSkin;
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

  it('handles a device with no model reported', () => {
    expect(getDeviceSkinForDevice({
      id: 'x', name: 'TestDeviceName', platform: DevicePlatform.ANDROID, type: DeviceType.REAL,
    })).toBe(NoDeviceSkin);
  });

  it('gives the iPhone 16 Pro a frame by marketing name or hardware id', () => {
    expect(iosHasFrame('iPhone 16 Pro')).toBe(true);
    expect(iosHasFrame('iPhone17,3')).toBe(true);
  });

  it('does not confuse it with the Max, the non-Pro, or other model ids', () => {
    expect(iosHasFrame('iPhone 16 Pro Max')).toBe(false);
    expect(iosHasFrame('iPhone 16')).toBe(false);
    expect(iosHasFrame('iPhone 15 Pro')).toBe(false);
    expect(iosHasFrame('iPhone17,4')).toBe(false);
  });

  it('does not apply an iOS skin to an Android device of the same model string', () => {
    expect(hasFrame('iPhone 16 Pro')).toBe(false);
    expect(hasFrame('iPhone17,3')).toBe(false);
  });
});

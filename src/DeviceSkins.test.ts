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

  it('gives Pixel 9 variants the stretchable frame, not the exact Pixel 9 one', () => {
    for (const model of ['Pixel 9 Pro', 'Pixel 9 Pro XL', 'Pixel 9 Pro Fold', 'Pixel 9a']) {
      expect(getDeviceSkinForDevice(androidDevice(model)).ninePatch).toBeDefined();
    }
  });

  it('gives every Android device the stretchable 9-patch frame', () => {
    for (const model of ['Pixel 8', 'Pixel 10', 'Samsung Galaxy S25 Ultra', 'Samsung Galaxy A55', '']) {
      expect(getDeviceSkinForDevice(androidDevice(model)).ninePatch).toBeDefined();
    }
  });

  it('gives an Android device with no model reported the stretchable frame', () => {
    expect(getDeviceSkinForDevice({
      id: 'x', name: 'TestDeviceName', platform: DevicePlatform.ANDROID, type: DeviceType.REAL,
    }).ninePatch).toBeDefined();
  });

  it('gives every iOS device the stretchable 9-patch frame', () => {
    for (const model of ['iPhone 16 Pro', 'iPhone17,3', 'iPhone 16 Pro Max', 'iPhone SE (2022)', 'iPad Pro 12.9"', '']) {
      expect(getDeviceSkinForDevice(iosDevice(model)).ninePatch).toBeDefined();
    }
  });

  it('gives an Android device with an iPhone-looking model the Android frame, not the iOS one', () => {
    expect(getDeviceSkinForDevice(androidDevice('iPhone 16 Pro')).ninePatch?.image)
      .not.toBe(getDeviceSkinForDevice(iosDevice('iPhone 16 Pro')).ninePatch?.image);
  });
});

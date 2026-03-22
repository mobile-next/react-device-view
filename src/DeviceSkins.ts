import { DeviceDescriptor, DevicePlatform } from './types';

interface DeviceSkinInsets {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface DeviceSkin {
  imageFilename: string;
  insets: DeviceSkinInsets;
  borderRadius: number;
}

export const NoDeviceSkin: DeviceSkin = {
  imageFilename: '',
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
  borderRadius: 0,
};

export const iPhoneWithIslandSkin: DeviceSkin = {
  imageFilename: 'iPhone_with_island.png',
  insets: { top: 21, left: 22, right: 22, bottom: 23 },
  borderRadius: 49,
};

export const iPhoneWithNotchSkin: DeviceSkin = {
  imageFilename: 'iPhone_with_notch.png',
  insets: { top: 19, left: 24, right: 24, bottom: 18 },
  borderRadius: 49,
};

export const AndroidDeviceSkin: DeviceSkin = {
  imageFilename: 'android.png',
  insets: { top: 70, left: 70, right: 70, bottom: 75 },
  borderRadius: 170,
};

export const iPadSkin: DeviceSkin = {
  imageFilename: 'iPad_Pro_11.png',
  insets: { top: 110, left: 115, right: 115, bottom: 110 },
  borderRadius: 35,
};

export function getDeviceSkinForDevice(device: DeviceDescriptor): DeviceSkin {
  if (device.platform === DevicePlatform.ANDROID) {
    return AndroidDeviceSkin;
  }

  if (device.platform === DevicePlatform.IOS) {
    if (device.name.includes('iPad')) {
      return iPadSkin;
    }

    if (device.name.startsWith('iPhone X')) {
      return iPhoneWithNotchSkin;
    }

    const m = device.name.match(/iPhone (\d+)/);
    if (m) {
      const modelNumber = parseInt(m[1]);
      if (modelNumber >= 15) {
        return iPhoneWithIslandSkin;
      }
      if (modelNumber >= 12) {
        return iPhoneWithNotchSkin;
      }
    }

    return iPhoneWithNotchSkin;
  }

  return NoDeviceSkin;
}

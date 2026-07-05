import { DeviceDescriptor, DevicePlatform } from './types';
import { pixel9Skin } from './skins/pixel9';

interface DeviceDisplayRect {
  // All values are in the frame image's native pixels.
  x: number;
  y: number;
  width: number;
  height: number;
  // Screen corner radius; rounds the stream so its square corners don't poke
  // past the frame's rounded bezel.
  cornerRadius: number;
}

export interface DeviceSkin {
  // Embedded device frame (data URI): a bezel with a transparent screen hole,
  // rounded corners, and camera. Empty string means "no skin". Drawn behind the
  // stream to size the box, and again on top so the bezel covers any overhang.
  frameImage: string;
  // Native size of frameImage, used to place the display rect proportionally.
  frameWidth: number;
  frameHeight: number;
  // Where the live screen sits inside the frame, in frame pixels.
  display: DeviceDisplayRect;
}

export const NoDeviceSkin: DeviceSkin = {
  frameImage: '',
  frameWidth: 0,
  frameHeight: 0,
  display: { x: 0, y: 0, width: 0, height: 0, cornerRadius: 0 },
};

// ponytail: single hardcoded device for now. iOS + more Android come later,
// each as another embedded skin returned from here. Match on `model` (the OS
// hardware id, e.g. "Pixel 9"), not `name` — `name` is a user-assigned label.
function isPixel9(model: string): boolean {
  const normalized = model.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  // Match "Pixel 9" but not the Pro / Pro XL / Pro Fold / 9a variants — those
  // have their own geometry.
  return /(^|\s)pixel 9(\s|$)/.test(normalized) && !normalized.includes('pixel 9 pro');
}

export function getDeviceSkinForDevice(device: DeviceDescriptor): DeviceSkin {
  if (device.platform === DevicePlatform.ANDROID && isPixel9(device.model ?? '')) {
    return pixel9Skin;
  }

  return NoDeviceSkin;
}

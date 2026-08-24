import { DeviceDescriptor, DevicePlatform } from './types';
import { pixel9Skin } from './skins/pixel9';
import { iosNinePatchSkin } from './skins/iosNinePatch';
import { androidNinePatchSkin } from './skins/androidNinePatch';
import type { NinePatchSkin } from './NinePatchSkin';

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
  // Stretchable frame for devices without a pixel-exact frameImage; when set,
  // the fields above are ignored.
  ninePatch?: NinePatchSkin;
}

// Frozen: it is a shared value handed out by reference, so freezing prevents a
// consumer from mutating the library's singleton.
export const NoDeviceSkin: DeviceSkin = Object.freeze({
  frameImage: '',
  frameWidth: 0,
  frameHeight: 0,
  display: Object.freeze({ x: 0, y: 0, width: 0, height: 0, cornerRadius: 0 }),
});

// Match on `model` (the OS hardware id, e.g. "Pixel 9" / "iPhone 16 Pro"), not
// `name` — `name` is a user-assigned label. Normalize so "_"/"-"/extra spaces
// in AVD-style names don't defeat the match.
function normalizeModel(model: string | undefined): string {
  return (model ?? '').toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// One entry per supported device. To add a device: drop in a skin data module
// and add a row here — the selector is closed to modification.
interface SkinMatch {
  matches: (device: DeviceDescriptor) => boolean;
  skin: DeviceSkin;
}

const SKINS: SkinMatch[] = [
  {
    // "Pixel 9" but not the Pro / Pro XL / Pro Fold / 9a variants.
    matches: (d) => {
      if (d.platform !== DevicePlatform.ANDROID) return false;
      const m = normalizeModel(d.model);
      return /(^|\s)pixel 9(\s|$)/.test(m) && !m.includes('pixel 9 pro');
    },
    skin: pixel9Skin,
  },
  {
    // Every other Android device: stretchable 9-patch frame (Pixel-9-derived).
    matches: (d) => d.platform === DevicePlatform.ANDROID,
    skin: { ...NoDeviceSkin, ninePatch: androidNinePatchSkin },
  },
  {
    // Every iOS device: the 9-patch frame stretches to any screen aspect ratio.
    matches: (d) => d.platform === DevicePlatform.IOS,
    skin: { ...NoDeviceSkin, ninePatch: iosNinePatchSkin },
  },
];

export function getDeviceSkinForDevice(device: DeviceDescriptor): DeviceSkin {
  return SKINS.find((entry) => entry.matches(device))?.skin ?? NoDeviceSkin;
}

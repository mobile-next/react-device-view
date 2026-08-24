import { describe, it, expect } from 'vitest';
import { ANDROID_BOOT_GIF, IOS_BOOT_LOGO } from './skins/bootAssets';

function decodeEmbeddedAsset(dataUri: string): string {
  return atob(dataUri.split(',')[1]);
}

describe('boot screen assets', () => {
  it('android boot animation is a GIF that loops forever', () => {
    const bytes = decodeEmbeddedAsset(ANDROID_BOOT_GIF);
    expect(bytes.startsWith('GIF89a')).toBe(true);
    expect(bytes.includes('NETSCAPE2.0')).toBe(true);
  });

  it('ios boot logo is an SVG', () => {
    expect(decodeEmbeddedAsset(IOS_BOOT_LOGO).includes('<svg')).toBe(true);
  });
});

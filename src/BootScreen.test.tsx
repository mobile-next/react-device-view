import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BootScreen, BootPhase } from './BootScreen';
import { ANDROID_BOOT_GIF, IOS_BOOT_LOGO } from './skins/bootAssets';

function decodeEmbeddedAsset(dataUri: string): string {
  return atob(dataUri.split(',')[1]);
}

function bootScreenMarkup(platform: 'ios' | 'android', phase: BootPhase): string {
  return renderToStaticMarkup(<BootScreen platform={platform} phase={phase} />);
}

function progressBarTiming(markup: string): string | undefined {
  return markup.match(/device-view-boot-progress (\d+s linear \d+s)/)?.[1];
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

describe('boot screen phases', () => {
  it('android progress bar waits 4s, then fills over 30s', () => {
    expect(progressBarTiming(bootScreenMarkup('android', 'allocating'))).toBe('30s linear 4s');
  });

  it('ios progress bar waits 4s, then fills over 140s', () => {
    expect(progressBarTiming(bootScreenMarkup('ios', 'allocating'))).toBe('140s linear 4s');
  });

  it('connecting shows text instead of a progress bar', () => {
    const markup = bootScreenMarkup('android', 'connecting');

    expect(markup).toContain('Starting video stream');
    expect(progressBarTiming(markup)).toBeUndefined();
  });
});

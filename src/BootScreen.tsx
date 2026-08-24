import React from 'react';
import { ANDROID_BOOT_GIF, IOS_BOOT_LOGO } from './skins/bootAssets';

// How long the fake iOS boot progress bar takes to fill.
const IOS_BOOT_DURATION_SECONDS = 180;

export interface BootScreenProps {
  platform: 'ios' | 'android';
}

// A fake boot screen: Android plays the boot animation gif in an endless loop;
// iOS shows the Apple logo with a progress bar that fills over 3 minutes.
export const BootScreen: React.FC<BootScreenProps> = ({ platform }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: platform === 'android' ? '#fff' : '#000', // the android gif has a white background
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7%',
    }}
  >
    {platform === 'android' ? (
      <img src={ANDROID_BOOT_GIF} alt="" style={{ width: '70%' }} />
    ) : (
      <>
        <img src={IOS_BOOT_LOGO} alt="" style={{ width: '22%' }} />
        <div style={{ width: '60%', height: '4px', borderRadius: '2px', background: '#3a3a3c', overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#fff',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              animation: `device-view-boot-progress ${IOS_BOOT_DURATION_SECONDS}s linear forwards`,
            }}
          />
        </div>
        <style>{`@keyframes device-view-boot-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      </>
    )}
  </div>
);

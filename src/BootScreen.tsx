import React from 'react';
import { ANDROID_BOOT_GIF, IOS_BOOT_LOGO } from './skins/bootAssets';

// allocating: the device is still being provisioned, no stream exists yet.
// connecting: the device landed and the video stream is starting.
export type BootPhase = 'allocating' | 'connecting';

// The boot animation plays alone first; the progress bar appears after this.
const PROGRESS_DELAY_SECONDS = 10;
const PROGRESS_REVEAL_SECONDS = 0.3;

// How long the fake progress bar takes to fill once it appears. With the delay,
// android totals ~40s and ios ~150s, matching typical provisioning times.
const PROGRESS_FILL_SECONDS = { android: 30, ios: 140 };

const CONNECTING_MESSAGE = 'Starting video stream';

// The android gif has a white background, so android is dark-on-light.
const COLORS = {
  android: { background: '#fff', track: '#e5e5ea', foreground: '#3a3a3c' },
  ios: { background: '#000', track: '#3a3a3c', foreground: '#fff' },
};

const KEYFRAMES = `
@keyframes device-view-boot-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes device-view-boot-reveal { from { opacity: 0; } to { opacity: 1; } }
`;

export interface BootScreenProps {
  platform: 'ios' | 'android';
  phase?: BootPhase;
}

// A fake boot screen: the android boot gif or the Apple logo. While allocating,
// a progress bar appears after a delay; while connecting, a message replaces it.
export const BootScreen: React.FC<BootScreenProps> = ({ platform, phase = 'allocating' }) => {
  const colors = COLORS[platform];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.background,
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
        <img src={IOS_BOOT_LOGO} alt="" style={{ width: '22%' }} />
      )}

      {phase === 'connecting' ? (
        <p style={{ margin: 0, fontSize: '14px', fontFamily: 'system-ui, sans-serif', color: colors.foreground }}>
          {CONNECTING_MESSAGE}
        </p>
      ) : (
        <div
          style={{
            width: '60%',
            height: '4px',
            borderRadius: '2px',
            background: colors.track,
            overflow: 'hidden',
            opacity: 0,
            animation: `device-view-boot-reveal ${PROGRESS_REVEAL_SECONDS}s linear ${PROGRESS_DELAY_SECONDS}s forwards`,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: colors.foreground,
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              animation: `device-view-boot-progress ${PROGRESS_FILL_SECONDS[platform]}s linear ${PROGRESS_DELAY_SECONDS}s forwards`,
            }}
          />
        </div>
      )}

      <style>{KEYFRAMES}</style>
    </div>
  );
};

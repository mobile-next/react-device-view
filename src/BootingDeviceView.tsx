import React from 'react';
import { NinePatchSkinView } from './NinePatchSkin';
import { iosNinePatchSkin } from './skins/iosNinePatch';
import { androidNinePatchSkin } from './skins/androidNinePatch';
import { DeviceControls } from './DeviceControls';

export interface BootingDeviceViewProps {
  platform: 'ios' | 'android';
  showControls?: boolean;
}

// Only the aspect ratio matters here; a typical 19.5:9 phone.
const PLACEHOLDER_SCREEN_SIZE = { width: 1080, height: 2340, scale: 1 };

const noop = () => {};

// A stand-in for DeviceView while no stream exists yet (device provisioning, or
// device info still loading): the platform's 9-patch skin playing the fake boot
// animation, with the controls sidebar greyed out. Mirrors DeviceInstance's
// layout exactly so nothing shifts when the live view takes over.
export const BootingDeviceView: React.FC<BootingDeviceViewProps> = ({ platform, showControls = true }) => (
  <div
    style={{
      position: 'relative',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
      backgroundColor: '#202224',
      paddingTop: '24px',
      paddingBottom: '24px',
    }}
  >
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
      <NinePatchSkinView skin={platform === 'android' ? androidNinePatchSkin : iosNinePatchSkin} screenSize={PLACEHOLDER_SCREEN_SIZE} isBooting>
        <div style={{ width: '100%', height: '100%', background: '#000' }} />
      </NinePatchSkinView>

      {showControls && (
        <DeviceControls
          disabled
          onTakeScreenshot={noop}
          onDeviceHome={noop}
          onDeviceBack={platform === 'android' ? noop : undefined}
          onAppSwitch={platform === 'android' ? noop : undefined}
          onIncreaseVolume={noop}
          onDecreaseVolume={noop}
          onTogglePower={noop}
        />
      )}
    </div>
  </div>
);

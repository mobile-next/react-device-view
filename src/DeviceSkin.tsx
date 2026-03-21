import React, { RefObject } from 'react';
import { DeviceSkin as DeviceSkinType } from './DeviceSkins';

export interface DeviceSkinProps {
  skinOverlayUri: string;
  deviceSkin: DeviceSkinType;
  skinRatio: number;
  deviceSkinRef: RefObject<HTMLImageElement | null>;
  onSkinLoad: () => void;
  children: React.ReactNode;
}

export const DeviceSkinComponent: React.FC<DeviceSkinProps> = ({
  skinOverlayUri,
  deviceSkin,
  skinRatio,
  deviceSkinRef,
  onSkinLoad,
  children
}) => {
  if (!skinOverlayUri) {
    return (
      <div style={{ position: 'relative', borderRadius: `${deviceSkin.borderRadius}px` }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <img
        ref={deviceSkinRef}
        src={skinOverlayUri}
        alt=""
        style={{
          position: 'relative',
          height: 'calc(100vh - 100px)',
          width: 'auto',
          maxWidth: 'calc(100vw - 2em)'
        }}
        draggable={false}
        onLoad={onSkinLoad}
      />
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: `${deviceSkin.insets.top * skinRatio}px`,
          left: `${deviceSkin.insets.left * skinRatio}px`,
          right: `${deviceSkin.insets.right * skinRatio}px`,
          bottom: `${deviceSkin.insets.bottom * skinRatio}px`,
          borderRadius: `${deviceSkin.borderRadius * skinRatio}px`,
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {children}
      </div>
      <img
        src={skinOverlayUri}
        alt=""
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2
        }}
        draggable={false}
      />
    </div>
  );
};

import React from 'react';
import { DeviceSkin as DeviceSkinType } from './DeviceSkins';
import { ScreenSize } from './types';
import { NinePatchSkinView } from './NinePatchSkin';

export interface DeviceSkinProps {
  deviceSkin: DeviceSkinType;
  screenSize: ScreenSize;
  children: React.ReactNode;
}

export const toCssPercent = (value: number, total: number): string => `${(value / total) * 100}%`;

// Both frame copies use the same intrinsic sizing so they register exactly.
const frameImageStyle: React.CSSProperties = {
  display: 'block',
  height: '100%',
  width: 'auto',
  maxWidth: '100%',
};

export const DeviceSkinComponent: React.FC<DeviceSkinProps> = ({ deviceSkin, screenSize, children }) => {
  if (deviceSkin.ninePatch) {
    return (
      <NinePatchSkinView skin={deviceSkin.ninePatch} screenSize={screenSize}>
        {children}
      </NinePatchSkinView>
    );
  }
  if (!deviceSkin.frameImage) {
    // No frame skin: draw a rounded, padded block at the device's aspect ratio and
    // put the stream (or the connecting spinner) inside it. Because the box is sized
    // from screenSize — known before the stream connects — the device shape shows
    // immediately instead of a bare spinner in empty space.
    const hasSize = screenSize.width > 0 && screenSize.height > 0;
    return (
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            height: '100%',
            aspectRatio: hasSize ? `${screenSize.width} / ${screenSize.height}` : undefined,
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '30px',
            padding: '5px',
            background: '#1b1b1b',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  const { display, frameWidth, frameHeight, frameImage } = deviceSkin;

  // A *circular* corner radius (rx% / ry%) that scales with the element, so the
  // stream's square corners round to the layout's corner_radius and don't poke
  // past the frame's rounded bezel.
  const screenRadius = `${toCssPercent(display.cornerRadius, display.width)} / ${toCssPercent(display.cornerRadius, display.height)}`;

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Frame behind: sizes the box; display:block avoids the inline baseline gap. */}
      <img src={frameImage} alt="" style={frameImageStyle} draggable={false} />

      {/* The live screen, positioned as a percentage of the frame's native size so
          it scales in lockstep with the rendered frame — no measured ratio, no drift. */}
      <div
        style={{
          position: 'absolute',
          left: toCssPercent(display.x, frameWidth),
          top: toCssPercent(display.y, frameHeight),
          width: toCssPercent(display.width, frameWidth),
          height: toCssPercent(display.height, frameHeight),
          borderRadius: screenRadius,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* Same frame on top: its opaque bezel covers any stream overhang and draws
          the rounded corners + camera; its transparent screen hole reveals the
          stream. Identical to the frame behind, so there is no two-image seam. */}
      <img
        src={frameImage}
        alt=""
        draggable={false}
        style={{
          ...frameImageStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  );
};

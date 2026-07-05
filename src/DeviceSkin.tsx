import React from 'react';
import { DeviceSkin as DeviceSkinType } from './DeviceSkins';

export interface DeviceSkinProps {
  deviceSkin: DeviceSkinType;
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

export const DeviceSkinComponent: React.FC<DeviceSkinProps> = ({ deviceSkin, children }) => {
  if (!deviceSkin.frameImage) {
    return (
      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
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
        style={{ ...frameImageStyle, position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 2 }}
      />
    </div>
  );
};

import React from 'react';
import { DeviceSkin as DeviceSkinType } from './DeviceSkins';

export interface DeviceSkinProps {
  deviceSkin: DeviceSkinType;
  children: React.ReactNode;
}

const percent = (value: number, total: number): string => `${(value / total) * 100}%`;

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

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Frame behind: sizes the box; display:block avoids the inline baseline gap. */}
      <img src={frameImage} alt="" style={frameImageStyle} draggable={false} />

      {/* The live screen, positioned as a percentage of the frame's native size so
          it scales in lockstep with the rendered frame — no measured ratio, no drift.
          The two-value border-radius (rx% / ry%) is a *circular* corner_radius that
          also scales with the element, rounding the stream's square corners so they
          don't poke past the frame's rounded bezel. */}
      <div
        style={{
          position: 'absolute',
          left: percent(display.x, frameWidth),
          top: percent(display.y, frameHeight),
          width: percent(display.width, frameWidth),
          height: percent(display.height, frameHeight),
          borderRadius: `${percent(display.cornerRadius, display.width)} / ${percent(display.cornerRadius, display.height)}`,
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

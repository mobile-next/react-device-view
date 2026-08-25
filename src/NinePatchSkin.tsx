import React from 'react';
import { ScreenSize } from './types';
import { BootScreen } from './BootScreen';

// A device frame that stretches to any screen aspect ratio. The bezel image is
// a 9-patch: the four corners are drawn at fixed (scaled) size and the edges are
// stretched — CSS border-image does exactly this natively. The side buttons
// (which must not stretch) are cropped out of the image and drawn back as plain
// CSS shapes. All numbers are in the image's native pixels.
export interface NinePatchSkin {
  platform?: 'ios' | 'android'; // picks the boot animation when isBooting; defaults to 'ios'
  image: string; // data URI, transparent screen hole
  imageWidth: number;
  imageHeight: number;
  slice: number; // 9-patch inset: must cover the rounded corners
  bezel: { top: number; right: number; bottom: number; left: number }; // frame thickness around the screen
  screenCornerRadius: number;
  buttons: { side: 'left' | 'right'; top: number; height: number; depth: number }[];
}

export interface NinePatchSkinProps {
  skin: NinePatchSkin;
  screenSize: ScreenSize; // device pixels; only the aspect ratio is used
  isBooting?: boolean; // show a fake boot screen instead of the children
  children: React.ReactNode;
}

// Screen slot, in native bezel units, for a screen of the given aspect ratio.
// The reference (image) screen is the base; a different aspect shrinks one side,
// so the bezel/buttons keep their size relative to the screen's narrow dimension
// (and squat iPad screens get a relatively thicker bezel — as in real life).
export function nativeScreenSlot(skin: NinePatchSkin, screenSize: ScreenSize): { width: number; height: number } {
  const refW = skin.imageWidth - skin.bezel.left - skin.bezel.right;
  const refH = skin.imageHeight - skin.bezel.top - skin.bezel.bottom;
  const aspect = screenSize.width > 0 && screenSize.height > 0 ? screenSize.width / screenSize.height : refW / refH;
  return aspect < refW / refH ? { width: refH * aspect, height: refH } : { width: refW, height: refW / aspect };
}

// Outer frame size, in native units, for a given screen aspect.
export function nativeFrameSize(skin: NinePatchSkin, screenSize: ScreenSize): { width: number; height: number } {
  const slot = nativeScreenSlot(skin, screenSize);
  return {
    width: slot.width + skin.bezel.left + skin.bezel.right,
    height: slot.height + skin.bezel.top + skin.bezel.bottom,
  };
}

const BUTTON_COLOR = '#2b2b2b';

// Buttons keep their native size but follow the 9-patch stretch: the button's
// center maps through the stretched middle region, clamped inside the frame,
// so buttons never overflow a squat (short) frame.
export function mapButtonTop(skin: NinePatchSkin, frameHeight: number, button: { top: number; height: number }): number {
  const { slice, imageHeight } = skin;
  const f = (frameHeight - 2 * slice) / (imageHeight - 2 * slice);
  const center = slice + (button.top + button.height / 2 - slice) * f;
  return Math.min(Math.max(center - button.height / 2, slice), frameHeight - slice - button.height);
}

export const NinePatchSkinView: React.FC<NinePatchSkinProps> = ({ skin, screenSize, isBooting, children }) => {
  const frame = nativeFrameSize(skin, screenSize);
  const { bezel, slice } = skin;
  // Largest frame that fits the parent while keeping the native aspect; --s is
  // the CSS px per native unit, computed in CSS so no measuring is needed.
  const frameWidth = `min(100cqw, calc(100cqh * ${frame.width} / ${frame.height}))`;
  const px = (n: number) => `calc(${n} * var(--s))`;

  return (
    // Height-driven like the exact-frame path: fills the parent's height and
    // derives its own width from the frame aspect, so content-width parents work.
    <div
      style={{
        height: '100%',
        aspectRatio: `${frame.width} / ${frame.height}`,
        maxWidth: '100%',
        containerType: 'size',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          ['--s' as string]: `calc(${frameWidth} / ${frame.width})`,
          position: 'relative',
          width: frameWidth,
          aspectRatio: `${frame.width} / ${frame.height}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: px(bezel.top),
            left: px(bezel.left),
            right: px(bezel.right),
            bottom: px(bezel.bottom),
            borderRadius: px(skin.screenCornerRadius),
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {isBooting ? <BootScreen platform={skin.platform ?? 'ios'} /> : children}
        </div>
        {/* The 9-patch bezel, on top so it covers any stream overhang. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderStyle: 'solid',
            borderWidth: px(slice),
            borderImage: `url("${skin.image}") ${slice} / ${px(slice)} stretch`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        {skin.buttons.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: px(mapButtonTop(skin, frame.height, b)),
              height: px(b.height),
              width: px(b.depth),
              [b.side]: px(-b.depth),
              background: BUTTON_COLOR,
              borderRadius: b.side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

import { ScreenSize } from './types';

type StreamRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Maps a pointer position to element and device pixels, clamped to the stream so a
// drag that leaves the video never sends coordinates the device rejects.
export function toScreenCoords(clientX: number, clientY: number, rect: StreamRect, screenSize: ScreenSize) {
  const x = clamp(clientX - rect.left, 0, rect.width);
  const y = clamp(clientY - rect.top, 0, rect.height);
  const screenX = clamp(Math.floor((x / rect.width) * screenSize.width), 0, screenSize.width - 1);
  const screenY = clamp(Math.floor((y / rect.height) * screenSize.height), 0, screenSize.height - 1);
  return { x, y, screenX, screenY };
}

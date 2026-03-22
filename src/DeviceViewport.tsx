import React, { Ref, useRef, useState } from 'react';
import { ScreenSize, GesturePoint, StreamRenderMode } from './types';
import { DeviceSkin } from './DeviceSkins';

export enum DeviceState {
  UNKNOWN = "UNKNOWN",
  BOOTING = "BOOTING",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
}

interface ClickAnimation {
  id: number;
  x: number;
  y: number;
}

interface GestureState {
  isGesturing: boolean;
  startTime: number;
  lastTimestamp: number;
  points: Array<GesturePoint>;
  path: Array<[number, number]>;
}

const ViewportSpinner: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#888' }}>
    <div>
      <div style={{
        width: '24px', height: '24px', margin: '0 auto 12px',
        border: '2px solid #333', borderTopColor: '#888', borderRadius: '50%',
        animation: 'device-view-spin 0.6s linear infinite'
      }} />
      <style>{`@keyframes device-view-spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ margin: 0, fontSize: '14px' }}>{message}</p>
    </div>
  </div>
);

const emptyGestureState: GestureState = {
  isGesturing: false,
  startTime: 0,
  lastTimestamp: 0,
  points: [],
  path: []
};

export const DeviceViewport: React.FC<{
  screenSize: ScreenSize;
  onTap: (x: number, y: number) => void;
  onGesture: (points: Array<GesturePoint>) => void;
  connectProgressMessage?: string;
  streamMode?: StreamRenderMode;
  videoRef?: Ref<HTMLVideoElement | null>;
  canvasRef: Ref<HTMLCanvasElement>;
  deviceSkin: DeviceSkin;
  skinRatio: number;
  state: DeviceState;
}> = ({
  screenSize,
  onTap,
  onGesture,
  connectProgressMessage,
  streamMode,
  videoRef,
  canvasRef,
  deviceSkin,
  skinRatio,
  state
}) => {
  const [clicks, setClicks] = useState<ClickAnimation[]>([]);
  const [gestureState, setGestureState] = useState<GestureState>(emptyGestureState);
  const gestureRef = useRef<GestureState>(emptyGestureState);

  const convertToScreenCoords = (clientX: number, clientY: number, element: HTMLCanvasElement | HTMLVideoElement) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const screenX = Math.floor((x / rect.width) * screenSize.width);
    const screenY = Math.floor((y / rect.height) * screenSize.height);
    return { x, y, screenX, screenY };
  };

  const updateGesture = (newState: GestureState) => {
    gestureRef.current = newState;
    setGestureState(newState);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement | HTMLVideoElement>) => {
    const coords = convertToScreenCoords(e.clientX, e.clientY, e.currentTarget);
    const now = Date.now();
    updateGesture({
      isGesturing: false,
      startTime: now,
      lastTimestamp: now,
      points: [{ x: coords.screenX, y: coords.screenY, duration: 0 }],
      path: [[coords.x, coords.y]]
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement | HTMLVideoElement>) => {
    const g = gestureRef.current;
    if (g.points.length === 0) return;
    const coords = convertToScreenCoords(e.clientX, e.clientY, e.currentTarget);
    const now = Date.now();

    if (g.isGesturing || (now - g.startTime) > 100) {
      const duration = now - g.lastTimestamp;
      const newPoint: GesturePoint = { x: coords.screenX, y: coords.screenY, duration };
      updateGesture({
        ...g,
        isGesturing: true,
        points: [...g.points, newPoint],
        path: [...g.path, [coords.x, coords.y]],
        lastTimestamp: now,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement | HTMLVideoElement>) => {
    const g = gestureRef.current;
    if (g.points.length === 0) return;
    const coords = convertToScreenCoords(e.clientX, e.clientY, e.currentTarget);
    const now = Date.now();

    if (g.isGesturing) {
      const duration = now - g.lastTimestamp;
      const finalPoints: Array<GesturePoint> = [...g.points, { x: coords.screenX, y: coords.screenY, duration }];
      onGesture(finalPoints);
    } else {
      const newClick: ClickAnimation = { id: Date.now(), x: coords.x, y: coords.y };
      setClicks(prev => [...prev, newClick]);
      setTimeout(() => { setClicks(prev => prev.filter(c => c.id !== newClick.id)); }, 400);
      onTap(coords.screenX, coords.screenY);
    }

    updateGesture(emptyGestureState);
  };

  const borderRadius = deviceSkin.imageFilename ? `${deviceSkin.borderRadius * skinRatio}px` : undefined;
  const streamStyle: React.CSSProperties = {
    cursor: 'crosshair',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    maxHeight: 'calc(100vh - 100px)',
    maxWidth: 'calc(100vw - 2em)',
    borderRadius
  };

  return (
    <>
      {(state === DeviceState.BOOTING || state === DeviceState.CONNECTING) && (
        <ViewportSpinner message={connectProgressMessage || 'Connecting...'} />
      )}

      {state === DeviceState.CONNECTED && (
        <>
          {streamMode === 'video' ? (
            <video
              ref={videoRef}
              style={streamStyle}
              autoPlay
              playsInline
              muted
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          ) : (
            <canvas
              ref={canvasRef}
              style={streamStyle}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          )}

          {clicks.map(click => (
            <div
              key={click.id}
              style={{
                position: 'absolute',
                left: `${click.x}px`,
                top: `${click.y}px`,
                width: '20px', height: '20px',
                marginLeft: '-10px', marginTop: '-10px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 255, 136, 0.8)',
                pointerEvents: 'none',
                animation: 'device-view-click 0.4s ease-out forwards',
                zIndex: 10
              }}
            />
          ))}
          <style>{`@keyframes device-view-click { from { transform: scale(1); opacity: 1; } to { transform: scale(2); opacity: 0; } }`}</style>

          {gestureState.isGesturing && gestureState.path.length > 1 && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
              <polyline
                points={gestureState.path.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none"
                stroke="rgba(0, 255, 136, 0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </>
      )}
    </>
  );
};

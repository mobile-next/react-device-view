import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { DeviceDescriptor, ScreenSize, GesturePoint, StreamRenderMode } from './types';
import { DeviceSkin } from './DeviceSkins';
import { DeviceSkinComponent } from './DeviceSkin';
import { DeviceControls } from './DeviceControls';
import { DeviceViewport, DeviceState } from './DeviceViewport';

export interface DeviceStreamHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

export interface DeviceStreamProps {
  state: DeviceState;
  connectProgressMessage?: string;
  selectedDevice: DeviceDescriptor;
  screenSize: ScreenSize;
  skinOverlayUri: string;
  deviceSkin: DeviceSkin;
  streamMode?: StreamRenderMode;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onTap: (x: number, y: number) => void;
  onGesture: (points: Array<GesturePoint>) => void;
  onKeyDown: (key: string) => void;
  onRotateDevice?: () => void;
  onTakeScreenshot: () => void;
  onDeviceHome: () => void;
  onDeviceBack?: () => void;
  onAppSwitch?: () => void;
  onIncreaseVolume?: () => void;
  onDecreaseVolume?: () => void;
  onTogglePower?: () => void;
}

export const DeviceInstance = forwardRef<DeviceStreamHandle, DeviceStreamProps>(({
  state,
  connectProgressMessage,
  selectedDevice,
  screenSize,
  skinOverlayUri,
  deviceSkin,
  onTap,
  onGesture,
  onKeyDown,
  onRotateDevice,
  onTakeScreenshot,
  onDeviceHome,
  onDeviceBack,
  onAppSwitch,
  onIncreaseVolume,
  onDecreaseVolume,
  onTogglePower,
  streamMode = 'canvas',
  videoRef,
}, ref) => {
  const [skinRatio, setSkinRatio] = useState<number>(1.0);
  const deviceSkinRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }));

  const calculateSkinRatio = () => {
    if (deviceSkinRef.current) {
      const naturalHeight = deviceSkinRef.current.naturalHeight;
      const renderedHeight = deviceSkinRef.current.height;
      const ratio = renderedHeight / naturalHeight;
      setSkinRatio(ratio);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', calculateSkinRatio);
    return () => { window.removeEventListener('resize', calculateSkinRatio); };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        backgroundColor: '#202224',
        paddingTop: '24px',
        paddingBottom: '24px',
        outline: 'none',
      }}
      tabIndex={0}
      onKeyDown={(e) => onKeyDown(e.key)}
    >
      <div style={{ position: 'relative', overflow: 'visible' }}>
        <div style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <DeviceSkinComponent
                skinOverlayUri={skinOverlayUri}
                deviceSkin={deviceSkin}
                skinRatio={skinRatio}
                deviceSkinRef={deviceSkinRef}
                onSkinLoad={calculateSkinRatio}
              >
                <DeviceViewport
                  screenSize={screenSize}
                  onTap={onTap}
                  onGesture={onGesture}
                  connectProgressMessage={connectProgressMessage}
                  selectedDevice={selectedDevice}
                  streamMode={streamMode}
                  deviceSkin={deviceSkin}
                  canvasRef={canvasRef}
                  videoRef={videoRef}
                  skinRatio={skinRatio}
                  state={state}
                />
              </DeviceSkinComponent>

              <DeviceControls
                onRotateDevice={onRotateDevice}
                onTakeScreenshot={onTakeScreenshot}
                onDeviceHome={onDeviceHome}
                onDeviceBack={selectedDevice.platform === 'android' ? onDeviceBack : undefined}
                onAppSwitch={selectedDevice.platform === 'android' ? onAppSwitch : undefined}
                onIncreaseVolume={onIncreaseVolume}
                onDecreaseVolume={onDecreaseVolume}
                onTogglePower={onTogglePower}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DeviceInstance.displayName = 'DeviceInstance';

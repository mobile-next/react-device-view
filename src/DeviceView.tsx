import React, { useState, useEffect, useRef } from 'react';
import { DeviceViewProps, DeviceDescriptor, DevicePlatform, DeviceType, ScreenSize, ScreenCaptureFormat, StreamRenderMode } from './types';
import { DeviceInstance, DeviceStreamHandle } from './DeviceInstance';
import { DeviceState } from './DeviceViewport';
import { DeviceSkin, getDeviceSkinForDevice, NoDeviceSkin } from './DeviceSkins';
import { JsonRpcClient } from './rpc/JsonRpcClient';
import { DeviceClient, DeviceClientApi, createNoOpDeviceClient } from './rpc/DeviceClient';
import { MjpegStream } from './streams/MjpegStream';
import { AvcStream } from './streams/AvcStream';
import { WebRtcStream, WebRtcSessionInfo } from './streams/WebRtcStream';
import { useDeviceInteraction } from './hooks/useDeviceInteraction';

interface WebRtcScreencaptureResult {
  sessionId: string;
  webrtcServerUrl: string;
  iceServers?: Array<{ urls: string[] | string }>;
}

function isWebRtcResponse(response: unknown): response is WebRtcScreencaptureResult {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof (response as any).sessionId === 'string' &&
    typeof (response as any).webrtcServerUrl === 'string'
  );
}

const Spinner: React.FC<{ message?: string }> = ({ message }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: '100%', backgroundColor: '#202224', color: '#888'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '24px', height: '24px', margin: '0 auto 12px',
        border: '2px solid #333', borderTopColor: '#888', borderRadius: '50%',
        animation: 'device-view-spin 0.6s linear infinite'
      }} />
      <style>{`@keyframes device-view-spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ margin: 0, fontSize: '14px' }}>{message || 'Loading...'}</p>
    </div>
  </div>
);

export const DeviceView: React.FC<DeviceViewProps> = ({
  serverUrl,
  token,
  deviceId,
  skinsUrl,
  onError,
  onConnected,
  onDisconnected,
}) => {
  const [deviceState, setDeviceState] = useState<DeviceState>(DeviceState.UNKNOWN);
  const [connectProgressMessage, setConnectProgressMessage] = useState<string | null>(null);
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);
  const [streamMode, setStreamMode] = useState<StreamRenderMode>('canvas');
  const [webrtcMediaStream, setWebrtcMediaStream] = useState<MediaStream | null>(null);
  const [deviceSkin, setDeviceSkin] = useState<DeviceSkin>(NoDeviceSkin);
  const [selectedDevice, setSelectedDevice] = useState<DeviceDescriptor | null>(null);

  const screenSizeRef = useRef<ScreenSize>({ width: 0, height: 0, scale: 1.0 });
  const mjpegStreamRef = useRef<MjpegStream | null>(null);
  const avcStreamRef = useRef<AvcStream | null>(null);
  const webrtcStreamRef = useRef<WebRtcStream | null>(null);
  const streamReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const streamControllerRef = useRef<AbortController | null>(null);
  const deviceStreamRef = useRef<DeviceStreamHandle>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageBitmapRef = useRef<ImageBitmap | null>(null);
  const streamingDeviceIdRef = useRef<string | null>(null);
  const streamGenerationRef = useRef(0);
  const jsonRpcClientRef = useRef<JsonRpcClient | null>(null);

  const getOrCreateClient = (): JsonRpcClient => {
    if (!jsonRpcClientRef.current || jsonRpcClientRef.current.isDisconnected) {
      jsonRpcClientRef.current = new JsonRpcClient(serverUrl, undefined, token);
    }
    return jsonRpcClientRef.current;
  };

  const getDeviceClient = (): DeviceClientApi => {
    return new DeviceClient(getOrCreateClient(), deviceId);
  };

  // Device interaction hook
  const {
    handleTap, handleGesture, handleKeyDown,
    onHome, onBack, onAppSwitch, onPower,
    onRotateDevice, onIncreaseVolume, onDecreaseVolume, onTakeScreenshot
  } = useDeviceInteraction({
    selectedDevice,
    deviceClient: getDeviceClient()
  });

  // Apply webrtc media stream to video element
  useEffect(() => {
    if (!webrtcMediaStream || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = webrtcMediaStream;
    video.muted = true;
    video.play().catch((error) => {
      console.error('device-view: error playing WebRTC stream:', error);
    });
  }, [webrtcMediaStream]);

  // Render imageBitmap to canvas (MJPEG)
  useEffect(() => {
    if (imageBitmap && deviceStreamRef.current) {
      const canvas = deviceStreamRef.current.getCanvas();
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const currentScreenSize = screenSizeRef.current;
          canvas.width = currentScreenSize.width;
          canvas.height = currentScreenSize.height;
          if (imageBitmap.width > 0 && imageBitmap.height > 0) {
            ctx.drawImage(imageBitmap, 0, 0, currentScreenSize.width, currentScreenSize.height);
          }
        }
      }
    }
  }, [imageBitmap]);

  const onJpegFrame = async (body: Uint8Array) => {
    try {
      const blob = new Blob([body as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' });
      const newImageBitmap = await createImageBitmap(blob);
      setDeviceState(DeviceState.CONNECTED);
      setImageBitmap((prev) => {
        if (prev) prev.close();
        return newImageBitmap;
      });
    } catch (error) {
      console.error('device-view: error displaying MJPEG frame:', error);
    }
  };

  const onJsonFrame = async (body: Uint8Array) => {
    try {
      const bodyText = new TextDecoder().decode(body);
      const jsonData = JSON.parse(bodyText);
      if (jsonData.jsonrpc === '2.0' && jsonData.method === 'notification/message' && jsonData.params?.message) {
        setConnectProgressMessage(jsonData.params.message);
      }
    } catch (error) {
      console.error('device-view: error parsing JSON-RPC notification:', error);
    }
  };

  const onFrame = async (mimeType: string, body: Uint8Array) => {
    if (mimeType === 'image/jpeg') await onJpegFrame(body);
    else if (mimeType === 'application/json') await onJsonFrame(body);
  };

  const onAvcFrame = async (frame: VideoFrame) => {
    try {
      setDeviceState(DeviceState.CONNECTED);
      if (deviceStreamRef.current) {
        const canvas = deviceStreamRef.current.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const currentScreenSize = screenSizeRef.current;
            if (canvas.width !== currentScreenSize.width || canvas.height !== currentScreenSize.height) {
              canvas.width = currentScreenSize.width;
              canvas.height = currentScreenSize.height;
            }
            ctx.drawImage(frame, 0, 0, currentScreenSize.width, currentScreenSize.height);
          }
        }
      }
      frame.close();
    } catch (error) {
      console.error('device-view: error displaying AVC frame:', error);
    }
  };

  const wsUrlToHttpUrl = (wsUrl: string): string => {
    const url = new URL(wsUrl);
    const protocol = url.protocol === 'wss:' ? 'https:' : 'http:';
    return `${protocol}//${url.host}`;
  };

  const startStream = async (devId: string, format: ScreenCaptureFormat) => {
    const generation = streamGenerationRef.current;

    try {
      setDeviceState(DeviceState.CONNECTING);

      const scale = format === 'avc' ? 0.5 : undefined;
      const client = getDeviceClient();
      const response = await client.screenCaptureStart(format, scale);

      // Bail if a newer stream was started while we were waiting
      if (generation !== streamGenerationRef.current) return;

      const handleStreamError = (error: Error) => {
        console.error(`device-view: error from ${format} stream:`, error);
        onError?.(error);
      };

      // WebRTC response
      if (isWebRtcResponse(response)) {
        const result = response;
        const session: WebRtcSessionInfo = {
          sessionId: result.sessionId,
          webrtcServerUrl: result.webrtcServerUrl,
          iceServers: result.iceServers
        };

        setStreamMode('video');
        const webrtcStream = new WebRtcStream(session, {
          onTrack: (stream) => {
            setDeviceState(DeviceState.CONNECTED);
            onConnected?.();
            setWebrtcMediaStream(stream);
          },
          onError: handleStreamError
        });

        webrtcStreamRef.current = webrtcStream;
        await webrtcStream.start();
        return;
      }

      // HTTP stream response
      if (!response.sessionUrl) {
        throw new Error('No sessionUrl in response');
      }

      const httpBaseUrl = wsUrlToHttpUrl(serverUrl);
      const streamUrl = `${httpBaseUrl}${response.sessionUrl}`;

      const streamResponse = await fetch(streamUrl);
      if (!streamResponse.ok) throw new Error(`Stream fetch failed: ${streamResponse.status}`);
      if (!streamResponse.body) throw new Error('ReadableStream not supported');

      const controller = new AbortController();
      const reader = streamResponse.body.getReader();
      streamControllerRef.current = controller;
      streamReaderRef.current = reader;

      if (format === 'avc') {
        const currentScreenSize = screenSizeRef.current;
        const width = scale ? Math.floor((currentScreenSize.width || 1080) * scale) : (currentScreenSize.width || 1080);
        const height = scale ? Math.floor((currentScreenSize.height || 1920) * scale) : (currentScreenSize.height || 1920);

        const stream = new AvcStream(reader, { onFrame: onAvcFrame, onError: handleStreamError, width, height });
        setStreamMode('canvas');
        avcStreamRef.current = stream;
        stream.start();
      } else {
        const stream = new MjpegStream(reader, { onFrame, onError: handleStreamError });
        setStreamMode('canvas');
        mjpegStreamRef.current = stream;
        stream.start();
      }

      onConnected?.();
    } catch (error) {
      console.error(`device-view: error starting ${format} stream:`, error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const stopStream = () => {
    streamGenerationRef.current++;
    streamingDeviceIdRef.current = null;

    if (mjpegStreamRef.current) { mjpegStreamRef.current.stop(); mjpegStreamRef.current = null; }
    if (avcStreamRef.current) { avcStreamRef.current.stop(); avcStreamRef.current = null; }
    if (streamControllerRef.current) { streamControllerRef.current.abort(); streamControllerRef.current = null; }
    if (streamReaderRef.current) { streamReaderRef.current = null; }
    if (webrtcStreamRef.current) { webrtcStreamRef.current.stop(); webrtcStreamRef.current = null; }
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.srcObject = null; }

    setWebrtcMediaStream(null);

    if (imageBitmapRef.current) { imageBitmapRef.current.close(); imageBitmapRef.current = null; }
    setImageBitmap(null);

    onDisconnected?.();
  };

  // Main effect: fetch device info and start streaming
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;

    stopStream();

    // Create a fresh client for this effect — immune to StrictMode cleanup races
    const rpcClient = new JsonRpcClient(serverUrl, undefined, token);
    jsonRpcClientRef.current = rpcClient;
    streamingDeviceIdRef.current = deviceId;

    const client = new DeviceClient(rpcClient, deviceId);

    client.getDeviceInfo().then((result) => {
      if (cancelled || !result?.device) return;

      screenSizeRef.current = result.device.screenSize;

      const descriptor: DeviceDescriptor = {
        id: result.device.id,
        name: result.device.name,
        platform: result.device.platform as DevicePlatform,
        type: result.device.type as DeviceType,
      };

      setSelectedDevice(descriptor);
      setDeviceSkin(getDeviceSkinForDevice(descriptor));

      let format: ScreenCaptureFormat = 'mjpeg';
      if (descriptor.platform === DevicePlatform.ANDROID) {
        format = 'avc';
      } else if (descriptor.platform === DevicePlatform.IOS && descriptor.type === DeviceType.REAL) {
        format = 'avc';
      }

      if (!cancelled) {
        startStream(deviceId, format);
      }
    }).catch((error) => {
      if (cancelled) return;
      console.error('device-view: failed to get device info:', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    });

    return () => {
      cancelled = true;
      stopStream();
      // Disconnect only if this effect's client is still the active one
      if (jsonRpcClientRef.current === rpcClient) {
        rpcClient.disconnect();
        jsonRpcClientRef.current = null;
      }
    };
  }, [deviceId, serverUrl, token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopStream(); };
  }, []);

  if (!selectedDevice) {
    return <Spinner message="Loading device..." />;
  }

  const hasSkins = !!skinsUrl;
  const skinOverlayUri = hasSkins
    ? `${skinsUrl}/${deviceSkin.imageFilename}`
    : '';
  const activeSkin = hasSkins ? deviceSkin : NoDeviceSkin;

  return (
    <DeviceInstance
      ref={deviceStreamRef}
      state={deviceState}
      connectProgressMessage={connectProgressMessage || undefined}
      selectedDevice={selectedDevice}
      screenSize={screenSizeRef.current}
      skinOverlayUri={skinOverlayUri}
      deviceSkin={activeSkin}
      streamMode={streamMode}
      videoRef={videoRef}
      onTap={handleTap}
      onGesture={handleGesture}
      onKeyDown={handleKeyDown}
      onRotateDevice={onRotateDevice}
      onTakeScreenshot={onTakeScreenshot}
      onDeviceHome={onHome}
      onDeviceBack={onBack}
      onAppSwitch={onAppSwitch}
      onIncreaseVolume={onIncreaseVolume}
      onDecreaseVolume={onDecreaseVolume}
      onTogglePower={onPower}
    />
  );
};

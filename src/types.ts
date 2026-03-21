export enum DevicePlatform {
  IOS = "ios",
  ANDROID = "android",
}

export enum DeviceType {
  REAL = "real",
  EMULATOR = "emulator",
  SIMULATOR = "simulator",
}

export interface DeviceDescriptor {
  id: string;
  name: string;
  platform: DevicePlatform;
  type: DeviceType;
  version?: string;
  state?: "online" | "offline";
}

export interface ScreenSize {
  width: number;
  height: number;
  scale: number;
}

export interface DeviceInfo {
  id: string;
  name: string;
  platform: string;
  type: string;
  screenSize: ScreenSize;
}

export interface DeviceInfoResponse {
  device: DeviceInfo;
}

export interface ScreenshotResponse {
  data: string;
}

export interface ScreencaptureResponse {
  format: string;
  streamUrl?: string;
  sessionUrl?: string;
  sessionId?: string;
  webrtcServerUrl?: string;
  iceServers?: Array<{ urls: string[] | string }>;
}

export type ButtonType = 'HOME' | 'BACK' | 'APP_SWITCH' | 'POWER' | 'VOLUME_UP' | 'VOLUME_DOWN';

export type ScreenCaptureFormat = 'mjpeg' | 'avc';

export class ConnectionError extends Error {
  public readonly isConnectionError = true;

  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

export interface DeviceViewProps {
  serverUrl: string;
  token: string;
  deviceId: string;
  skinsUrl?: string;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export interface GesturePoint {
  x: number;
  y: number;
  duration: number;
}

export type StreamRenderMode = 'canvas' | 'video';

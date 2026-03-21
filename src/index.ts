// Main component
export { DeviceView } from './DeviceView';

// Types
export {
  DevicePlatform,
  DeviceType,
  ConnectionError,
} from './types';

export type {
  DeviceViewProps,
  DeviceDescriptor,
  ScreenSize,
  DeviceInfo,
  DeviceInfoResponse,
  GesturePoint,
  StreamRenderMode,
  ButtonType,
  ScreenCaptureFormat,
  ScreencaptureResponse,
  ScreenshotResponse,
} from './types';

// Stream classes (for advanced usage / mobiledeck backend)
export { WebRtcStream } from './streams/WebRtcStream';
export type { WebRtcSessionInfo, WebRtcStreamOptions } from './streams/WebRtcStream';
export { AvcStream } from './streams/AvcStream';
export { MjpegStream } from './streams/MjpegStream';

// RPC client (for advanced usage / mobiledeck backend)
export { JsonRpcClient } from './rpc/JsonRpcClient';
export { DeviceClient, createNoOpDeviceClient } from './rpc/DeviceClient';
export type { DeviceClientApi } from './rpc/DeviceClient';

// Device skins (for custom skin rendering)
export { getDeviceSkinForDevice, NoDeviceSkin } from './DeviceSkins';
export type { DeviceSkin } from './DeviceSkins';

// Sub-components (for custom compositions)
export { DeviceInstance } from './DeviceInstance';
export type { DeviceStreamHandle, DeviceStreamProps } from './DeviceInstance';
export { DeviceViewport, DeviceState } from './DeviceViewport';
export { DeviceControls } from './DeviceControls';

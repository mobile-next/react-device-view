import { JsonRpcClient } from './JsonRpcClient';
import {
  DeviceInfoResponse,
  ScreenshotResponse,
  ScreencaptureResponse,
  ButtonType,
  ScreenCaptureFormat,
} from '../types';

export interface DeviceClientApi {
  getDeviceInfo(): Promise<DeviceInfoResponse>;
  boot(): Promise<void>;
  reboot(): Promise<void>;
  shutdown(): Promise<void>;
  tap(x: number, y: number): Promise<void>;
  gesture(actions: Array<{ type: string; duration?: number; x?: number; y?: number; button?: number }>): Promise<void>;
  inputText(text: string, timeoutMs?: number): Promise<void>;
  pressButton(button: ButtonType): Promise<void>;
  takeScreenshot(): Promise<ScreenshotResponse>;
  screenCaptureStart(format: ScreenCaptureFormat, scale?: number): Promise<ScreencaptureResponse>;
}

export class DeviceClient implements DeviceClientApi {
  constructor(
    private readonly jsonRpcClient: JsonRpcClient,
    private readonly deviceId: string
  ) {}

  private request<T = void>(
    method: string,
    params?: Record<string, any>,
    timeoutMs?: number
  ): Promise<T> {
    const combinedParams = { deviceId: this.deviceId, ...(params || {}) };
    return this.jsonRpcClient.sendJsonRpcRequest<T>(method, combinedParams, timeoutMs);
  }

  async getDeviceInfo(): Promise<DeviceInfoResponse> {
    return this.request<DeviceInfoResponse>('device.info');
  }

  async boot(): Promise<void> {
    return this.request('device.boot');
  }

  async reboot(): Promise<void> {
    return this.request('device.reboot');
  }

  async shutdown(): Promise<void> {
    return this.request('device.shutdown');
  }

  async tap(x: number, y: number): Promise<void> {
    return this.request('device.io.tap', { x, y });
  }

  async gesture(actions: Array<{ type: string; duration?: number; x?: number; y?: number; button?: number }>): Promise<void> {
    return this.request('device.io.gesture', { actions });
  }

  async inputText(text: string, timeoutMs?: number): Promise<void> {
    return this.request('device.io.text', { text }, timeoutMs);
  }

  async pressButton(button: ButtonType): Promise<void> {
    return this.request('device.io.button', { button });
  }

  async takeScreenshot(): Promise<ScreenshotResponse> {
    return this.request<ScreenshotResponse>('device.screenshot');
  }

  async screenCaptureStart(format: ScreenCaptureFormat, scale?: number): Promise<ScreencaptureResponse> {
    return this.request<ScreencaptureResponse>('device.screencapture', { format, scale });
  }
}

class NoOpDeviceClient implements DeviceClientApi {
  async getDeviceInfo(): Promise<DeviceInfoResponse> {
    return { device: { id: '', name: '', platform: '', type: '', screenSize: { width: 0, height: 0, scale: 1.0 } } };
  }
  async boot(): Promise<void> {}
  async reboot(): Promise<void> {}
  async shutdown(): Promise<void> {}
  async tap(_x: number, _y: number): Promise<void> {}
  async gesture(_actions: Array<{ type: string; duration?: number; x?: number; y?: number; button?: number }>): Promise<void> {}
  async inputText(_text: string, _timeoutMs?: number): Promise<void> {}
  async pressButton(_button: ButtonType): Promise<void> {}
  async takeScreenshot(): Promise<ScreenshotResponse> { return { data: '' }; }
  async screenCaptureStart(format: ScreenCaptureFormat, _scale?: number): Promise<ScreencaptureResponse> { return { format }; }
}

const noOpDeviceClient = new NoOpDeviceClient();

export function createNoOpDeviceClient(): DeviceClientApi {
  return noOpDeviceClient;
}

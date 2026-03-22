import { useRef } from 'react';
import { DeviceDescriptor, ButtonType, GesturePoint } from '../types';
import { DeviceClientApi } from '../rpc/DeviceClient';

interface UseDeviceInteractionOptions {
  deviceClient: DeviceClientApi;
  selectedDevice: DeviceDescriptor | null;
}

export function useDeviceInteraction({ deviceClient, selectedDevice }: UseDeviceInteractionOptions) {
  const pendingKeys = useRef("");
  const isFlushingKeys = useRef(false);

  const handleTap = async (x: number, y: number) => {
    await deviceClient.tap(x, y);
  };

  const pointerDown = () => ({ type: "pointerDown", button: 0 });
  const pointerMove = (x: number, y: number, duration: number) => ({ type: "pointerMove", duration, x, y });
  const pointerUp = () => ({ type: "pointerUp", button: 0 });

  const handleGesture = async (points: Array<GesturePoint>) => {
    const actions: Array<{ type: string; duration?: number; x?: number; y?: number; button?: number }> = [];

    if (points.length > 0) {
      actions.push(pointerMove(points[0].x, points[0].y, 0));
      actions.push(pointerDown());

      for (let i = 1; i < points.length; i++) {
        const duration = i < points.length - 1 ? points[i].duration - points[i - 1].duration : 100;
        actions.push(pointerMove(points[i].x, points[i].y, Math.max(duration, 0)));
      }

      actions.push(pointerUp());
      await deviceClient.gesture(actions);
    }
  };

  const flushPendingKeys = async () => {
    if (isFlushingKeys.current) return;

    isFlushingKeys.current = true;
    const keys = pendingKeys.current;
    if (keys === "") {
      isFlushingKeys.current = false;
      return;
    }

    pendingKeys.current = "";
    try {
      await deviceClient.inputText(keys, 3000);
    } catch (error) {
      console.error('device-view: error flushing keys:', error);
    } finally {
      isFlushingKeys.current = false;
    }
  };

  const handleKeyDown = async (key: string) => {
    const keyMap: Record<string, string> = {
      'Enter': '\n',
      'Backspace': '\b',
      'Delete': '\x7F',
      ' ': ' ',
    };

    let text: string;
    if (keyMap[key] !== undefined) {
      text = keyMap[key];
    } else if (key.length === 1) {
      text = key;
    } else {
      return;
    }

    pendingKeys.current += text;
    setTimeout(() => flushPendingKeys(), 500);
  };

  const logButtonError = (error: unknown) => {
    console.error('device-view: error pressing button:', error);
  };

  const pressButton = async (button: ButtonType) => {
    await deviceClient.pressButton(button);
  };

  const onHome = () => { pressButton('HOME').catch(logButtonError); };
  const onBack = () => { pressButton('BACK').catch(logButtonError); };
  const onAppSwitch = () => { pressButton('APP_SWITCH').catch(logButtonError); };
  const onPower = () => { pressButton('POWER').catch(logButtonError); };
  const onRotateDevice = () => { console.log('device-view: rotate device requested'); };
  const onIncreaseVolume = () => { pressButton('VOLUME_UP').catch(logButtonError); };
  const onDecreaseVolume = () => { pressButton('VOLUME_DOWN').catch(logButtonError); };

  const getScreenshotFilename = (device: DeviceDescriptor) => {
    return `screenshot-${device.name}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
  };

  const onTakeScreenshot = async () => {
    try {
      const response = await deviceClient.takeScreenshot();
      const DATA_IMAGE_PNG = "data:image/png;base64,";

      if (response.data && response.data.startsWith(DATA_IMAGE_PNG)) {
        const base64Data = response.data.substring(DATA_IMAGE_PNG.length);
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const url = URL.createObjectURL(blob);

        if (selectedDevice) {
          const a = document.createElement('a');
          a.href = url;
          a.download = getScreenshotFilename(selectedDevice);
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  return {
    handleTap,
    handleGesture,
    handleKeyDown,
    onHome,
    onBack,
    onAppSwitch,
    onPower,
    onRotateDevice,
    onIncreaseVolume,
    onDecreaseVolume,
    onTakeScreenshot
  };
}

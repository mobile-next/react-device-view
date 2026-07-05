# @mobile-next/device-view

React component for remote device streaming, interaction, and control. Renders a live view of an iOS or Android device (WebRTC, AVC, or MJPEG streams) with touch/gesture forwarding, hardware buttons, and optional device skins.

## Install

```bash
npm install github:mobile-next/react-device-view
```

Requires `react` and `react-dom` >= 18 as peer dependencies.

## Usage

```tsx
import { DeviceView } from '@mobile-next/device-view';

<DeviceView
  serverUrl="wss://app.mobilenext.ai/ws"
  token="mob_XXXX..."
  deviceId="your-device-id"
  onConnected={() => console.log('connected')}
  onDisconnected={() => console.log('disconnected')}
  onError={(err) => console.error(err)}
/>
```

The component fills its container, so give the parent element a size.

For advanced usage (custom compositions, raw streams, RPC), see the exports in [`src/index.ts`](src/index.ts) — `DeviceInstance`, `DeviceViewport`, `DeviceControls`, `WebRtcStream`, `JsonRpcClient`, and friends.

## Running locally

```bash
npm install
npm run example
```

This starts a Vite dev server with the example app from [`example/`](example/). Open the printed URL, enter your server URL and API token (`mob_...`), pick an online device, and you'll get a live device view.

Other scripts:

```bash
npm run build       # build the library into dist/ (tsup)
npm run dev         # rebuild on change
npm test            # run tests (vitest)
```

## License

[Apache-2.0](LICENSE)

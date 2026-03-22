import { forwardRef, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// src/DeviceView.tsx

// src/types.ts
var DevicePlatform = /* @__PURE__ */ ((DevicePlatform2) => {
  DevicePlatform2["IOS"] = "ios";
  DevicePlatform2["ANDROID"] = "android";
  return DevicePlatform2;
})(DevicePlatform || {});
var DeviceType = /* @__PURE__ */ ((DeviceType2) => {
  DeviceType2["REAL"] = "real";
  DeviceType2["EMULATOR"] = "emulator";
  DeviceType2["SIMULATOR"] = "simulator";
  return DeviceType2;
})(DeviceType || {});
var ConnectionError = class extends Error {
  isConnectionError = true;
  constructor(message) {
    super(message);
    this.name = "ConnectionError";
  }
};
var DeviceSkinComponent = ({
  skinOverlayUri,
  deviceSkin,
  skinRatio,
  deviceSkinRef,
  onSkinLoad,
  children
}) => {
  if (!skinOverlayUri) {
    return /* @__PURE__ */ jsx("div", { style: { position: "relative" }, children });
  }
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        ref: deviceSkinRef,
        src: skinOverlayUri,
        alt: "",
        style: {
          position: "relative",
          height: "calc(100vh - 100px)",
          width: "auto",
          maxWidth: "calc(100vw - 2em)"
        },
        draggable: false,
        onLoad: onSkinLoad
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: `${deviceSkin.insets.top * skinRatio}px`,
          left: `${deviceSkin.insets.left * skinRatio}px`,
          right: `${deviceSkin.insets.right * skinRatio}px`,
          bottom: `${deviceSkin.insets.bottom * skinRatio}px`,
          borderRadius: `${deviceSkin.borderRadius * skinRatio}px`,
          overflow: "hidden",
          zIndex: 1
        },
        children
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: skinOverlayUri,
        alt: "",
        style: {
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2
        },
        draggable: false
      }
    )
  ] });
};
var CameraIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13", r: "4" })
] });
var HomeIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
  /* @__PURE__ */ jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
] });
var BackIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
  /* @__PURE__ */ jsx("polyline", { points: "12 19 5 12 12 5" })
] });
var AppSwitchIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
  /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
  /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
  /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7" })
] });
var VolumeUpIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
  /* @__PURE__ */ jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
] });
var VolumeDownIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
  /* @__PURE__ */ jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
  /* @__PURE__ */ jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
] });
var PowerIcon = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsx("path", { d: "M12 2v10" }),
  /* @__PURE__ */ jsx("path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" })
] });
var ControlButton = ({ onClick, icon, text, isActive = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  return /* @__PURE__ */ jsx("div", { style: { position: "relative", height: "56px" }, children: /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => {
        setIsHovered(false);
        setIsPressed(false);
      },
      onMouseDown: () => setIsPressed(true),
      onMouseUp: () => setIsPressed(false),
      title: text,
      style: {
        width: isHovered ? "150px" : "56px",
        height: "56px",
        background: isActive ? "linear-gradient(135deg, #00ff88 0%, #00cc6f 100%)" : isHovered ? "#2a2a2a" : "#1a1a1a",
        border: isActive || isHovered ? "1px solid #00ff88" : "1px solid #2a2a2a",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        cursor: "pointer",
        transition: isHovered ? "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
        position: isHovered ? "relative" : "absolute",
        overflow: "hidden",
        padding: "0 16px",
        color: isActive ? "#0a0a0a" : "#888",
        left: 0,
        boxShadow: isHovered ? "0 8px 24px rgba(0, 255, 136, 0.2)" : "none",
        zIndex: isHovered ? 1001 : "auto",
        transform: isPressed ? "translateX(0px) scale(0.98)" : "translateX(0px)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "24px",
          height: "24px",
          color: isActive ? "#0a0a0a" : isHovered ? "#00ff88" : "#888",
          transition: isHovered ? "color 0.3s 0s" : "color 0.3s 0.3s",
          flexShrink: 0
        }, children: icon }),
        /* @__PURE__ */ jsx("span", { style: {
          marginLeft: "12px",
          fontSize: "12px",
          color: isActive ? "#0a0a0a" : "#e0e0e0",
          whiteSpace: "nowrap",
          opacity: isHovered ? 1 : 0,
          transition: isHovered ? "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s" : "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.3s"
        }, children: text })
      ]
    }
  ) });
};
var noop = () => {
};
var ControlSeparator = () => /* @__PURE__ */ jsx("div", { style: { height: "4px", display: "flex", alignItems: "center", position: "relative" }, children: /* @__PURE__ */ jsx("div", { style: { height: "1px", width: "4px", background: "#2a2a2a" } }) });
var DeviceControls = ({
  onRotateDevice,
  onTakeScreenshot,
  onDeviceHome,
  onDeviceBack,
  onAppSwitch,
  onIncreaseVolume,
  onDecreaseVolume,
  onTogglePower
}) => {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    zIndex: 1e3,
    marginLeft: "10px",
    position: "relative",
    width: "56px"
  }, children: [
    /* @__PURE__ */ jsx(ControlButton, { onClick: onTakeScreenshot || noop, icon: /* @__PURE__ */ jsx(CameraIcon, {}), text: "Screenshot" }),
    /* @__PURE__ */ jsx(ControlButton, { onClick: onDeviceHome || noop, icon: /* @__PURE__ */ jsx(HomeIcon, {}), text: "Home" }),
    onDeviceBack && /* @__PURE__ */ jsx(ControlButton, { onClick: onDeviceBack, icon: /* @__PURE__ */ jsx(BackIcon, {}), text: "Back" }),
    onAppSwitch && /* @__PURE__ */ jsx(ControlButton, { onClick: onAppSwitch, icon: /* @__PURE__ */ jsx(AppSwitchIcon, {}), text: "Recents" }),
    /* @__PURE__ */ jsx(ControlSeparator, {}),
    /* @__PURE__ */ jsx(ControlButton, { onClick: onIncreaseVolume || noop, icon: /* @__PURE__ */ jsx(VolumeUpIcon, {}), text: "Volume Up" }),
    /* @__PURE__ */ jsx(ControlButton, { onClick: onDecreaseVolume || noop, icon: /* @__PURE__ */ jsx(VolumeDownIcon, {}), text: "Volume Down" }),
    /* @__PURE__ */ jsx(ControlButton, { onClick: onTogglePower || noop, icon: /* @__PURE__ */ jsx(PowerIcon, {}), text: "Power" })
  ] });
};
var DeviceState = /* @__PURE__ */ ((DeviceState3) => {
  DeviceState3["UNKNOWN"] = "UNKNOWN";
  DeviceState3["BOOTING"] = "BOOTING";
  DeviceState3["CONNECTING"] = "CONNECTING";
  DeviceState3["CONNECTED"] = "CONNECTED";
  return DeviceState3;
})(DeviceState || {});
var ViewportSpinner = ({ message }) => /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#888" }, children: /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("div", { style: {
    width: "24px",
    height: "24px",
    margin: "0 auto 12px",
    border: "2px solid #333",
    borderTopColor: "#888",
    borderRadius: "50%",
    animation: "device-view-spin 0.6s linear infinite"
  } }),
  /* @__PURE__ */ jsx("style", { children: `@keyframes device-view-spin { to { transform: rotate(360deg); } }` }),
  /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "14px" }, children: message })
] }) });
var emptyGestureState = {
  isGesturing: false,
  startTime: 0,
  lastTimestamp: 0,
  points: [],
  path: []
};
var DeviceViewport = ({
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
  const [clicks, setClicks] = useState([]);
  const [gestureState, setGestureState] = useState(emptyGestureState);
  const gestureRef = useRef(emptyGestureState);
  const convertToScreenCoords = (clientX, clientY, element) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const screenX = Math.floor(x / rect.width * screenSize.width);
    const screenY = Math.floor(y / rect.height * screenSize.height);
    return { x, y, screenX, screenY };
  };
  const updateGesture = (newState) => {
    gestureRef.current = newState;
    setGestureState(newState);
  };
  const handleMouseDown = (e) => {
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
  const handleMouseMove = (e) => {
    const g = gestureRef.current;
    if (g.points.length === 0) return;
    const coords = convertToScreenCoords(e.clientX, e.clientY, e.currentTarget);
    const now = Date.now();
    if (g.isGesturing || now - g.startTime > 100) {
      const duration = now - g.lastTimestamp;
      const newPoint = { x: coords.screenX, y: coords.screenY, duration };
      updateGesture({
        ...g,
        isGesturing: true,
        points: [...g.points, newPoint],
        path: [...g.path, [coords.x, coords.y]],
        lastTimestamp: now
      });
    }
  };
  const handleMouseUp = (e) => {
    const g = gestureRef.current;
    if (g.points.length === 0) return;
    const coords = convertToScreenCoords(e.clientX, e.clientY, e.currentTarget);
    const now = Date.now();
    if (g.isGesturing) {
      const duration = now - g.lastTimestamp;
      const finalPoints = [...g.points, { x: coords.screenX, y: coords.screenY, duration }];
      onGesture(finalPoints);
    } else {
      const newClick = { id: Date.now(), x: coords.x, y: coords.y };
      setClicks((prev) => [...prev, newClick]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
      }, 400);
      onTap(coords.screenX, coords.screenY);
    }
    updateGesture(emptyGestureState);
  };
  const borderRadius = deviceSkin.imageFilename ? `${deviceSkin.borderRadius * skinRatio}px` : void 0;
  const streamStyle = {
    cursor: "crosshair",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    maxHeight: "calc(100vh - 100px)",
    maxWidth: "calc(100vw - 2em)",
    borderRadius
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    (state === "BOOTING" /* BOOTING */ || state === "CONNECTING" /* CONNECTING */) && /* @__PURE__ */ jsx(ViewportSpinner, { message: connectProgressMessage || "Connecting..." }),
    state === "CONNECTED" /* CONNECTED */ && /* @__PURE__ */ jsxs(Fragment, { children: [
      streamMode === "video" ? /* @__PURE__ */ jsx(
        "video",
        {
          ref: videoRef,
          style: streamStyle,
          autoPlay: true,
          playsInline: true,
          muted: true,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp
        }
      ) : /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          style: streamStyle,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp
        }
      ),
      clicks.map((click) => /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            position: "absolute",
            left: `${click.x}px`,
            top: `${click.y}px`,
            width: "20px",
            height: "20px",
            marginLeft: "-10px",
            marginTop: "-10px",
            borderRadius: "50%",
            border: "2px solid rgba(0, 255, 136, 0.8)",
            pointerEvents: "none",
            animation: "device-view-click 0.4s ease-out forwards",
            zIndex: 10
          }
        },
        click.id
      )),
      /* @__PURE__ */ jsx("style", { children: `@keyframes device-view-click { from { transform: scale(1); opacity: 1; } to { transform: scale(2); opacity: 0; } }` }),
      gestureState.isGesturing && gestureState.path.length > 1 && /* @__PURE__ */ jsx("svg", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }, children: /* @__PURE__ */ jsx(
        "polyline",
        {
          points: gestureState.path.map(([x, y]) => `${x},${y}`).join(" "),
          fill: "none",
          stroke: "rgba(0, 255, 136, 0.6)",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ) })
    ] })
  ] });
};
var DeviceInstance = forwardRef(({
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
  streamMode = "canvas",
  videoRef
}, ref) => {
  const [skinRatio, setSkinRatio] = useState(1);
  const deviceSkinRef = useRef(null);
  const canvasRef = useRef(null);
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
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
    window.addEventListener("resize", calculateSkinRatio);
    return () => {
      window.removeEventListener("resize", calculateSkinRatio);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "relative",
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        backgroundColor: "#202224",
        paddingTop: "24px",
        paddingBottom: "24px",
        outline: "none"
      },
      tabIndex: 0,
      onKeyDown: (e) => onKeyDown(e.key),
      children: /* @__PURE__ */ jsx("div", { style: { position: "relative", overflow: "visible" }, children: /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", overflow: "visible" }, children: /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "white" }, children: /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          DeviceSkinComponent,
          {
            skinOverlayUri,
            deviceSkin,
            skinRatio,
            deviceSkinRef,
            onSkinLoad: calculateSkinRatio,
            children: /* @__PURE__ */ jsx(
              DeviceViewport,
              {
                screenSize,
                onTap,
                onGesture,
                connectProgressMessage,
                streamMode,
                deviceSkin,
                canvasRef,
                videoRef,
                skinRatio,
                state
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          DeviceControls,
          {
            onRotateDevice,
            onTakeScreenshot,
            onDeviceHome,
            onDeviceBack: selectedDevice.platform === "android" ? onDeviceBack : void 0,
            onAppSwitch: selectedDevice.platform === "android" ? onAppSwitch : void 0,
            onIncreaseVolume,
            onDecreaseVolume,
            onTogglePower
          }
        )
      ] }) }) }) })
    }
  );
});
DeviceInstance.displayName = "DeviceInstance";

// src/DeviceSkins.ts
var NoDeviceSkin = {
  imageFilename: "",
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
  borderRadius: 0
};
var iPhoneWithIslandSkin = {
  imageFilename: "iPhone_with_island.png",
  insets: { top: 21, left: 22, right: 22, bottom: 23 },
  borderRadius: 49
};
var iPhoneWithNotchSkin = {
  imageFilename: "iPhone_with_notch.png",
  insets: { top: 19, left: 24, right: 24, bottom: 18 },
  borderRadius: 49
};
var AndroidDeviceSkin = {
  imageFilename: "android.png",
  insets: { top: 70, left: 70, right: 70, bottom: 75 },
  borderRadius: 170
};
var iPadSkin = {
  imageFilename: "iPad_Pro_11.png",
  insets: { top: 110, left: 115, right: 115, bottom: 110 },
  borderRadius: 35
};
function getDeviceSkinForDevice(device) {
  if (device.platform === "android" /* ANDROID */) {
    return AndroidDeviceSkin;
  }
  if (device.platform === "ios" /* IOS */) {
    if (device.name.includes("iPad")) {
      return iPadSkin;
    }
    if (device.name.startsWith("iPhone X")) {
      return iPhoneWithNotchSkin;
    }
    const m = device.name.match(/iPhone (\d+)/);
    if (m) {
      const modelNumber = parseInt(m[1]);
      if (modelNumber >= 15) {
        return iPhoneWithIslandSkin;
      }
      if (modelNumber >= 12) {
        return iPhoneWithNotchSkin;
      }
    }
    return iPhoneWithNotchSkin;
  }
  return NoDeviceSkin;
}

// src/rpc/JsonRpcClient.ts
var noopLogger = {
  info: () => {
  },
  warn: () => {
  },
  error: () => {
  }
};
var JSON_RPC_VERSION = "2.0";
var JsonRpcClient = class {
  constructor(url, logger, authToken) {
    this.url = url;
    this.authToken = authToken;
    this.logger = logger || noopLogger;
    if (!this.authToken) {
      this.authToken = "UNSET";
    }
  }
  idCounter = 1;
  ws = null;
  wsState = "disconnected" /* DISCONNECTED */;
  pendingRequests = /* @__PURE__ */ new Map();
  reconnectAttempts = 0;
  maxReconnectAttempts = 0;
  reconnectDelay = 1e3;
  messageQueue = [];
  connectionListeners = [];
  logger;
  sessionToken;
  async exchangeTokenForSession() {
    if (!this.authToken || this.authToken === "UNSET") {
      this.logger.warn("no auth token available for exchange");
      return;
    }
    const isJwt = this.authToken.split(".").length === 3;
    if (!isJwt) {
      this.sessionToken = this.authToken;
      return;
    }
    const url = new URL(this.url);
    const protocol = url.protocol === "wss:" || url.protocol === "https:" ? "https:" : "http:";
    const authUrl = `${protocol}//${url.host}/auth/token`;
    this.logger.info(`exchanging token at ${authUrl}`);
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.authToken}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`token exchange failed with status ${response.status}`);
    }
    const data = await response.json();
    this.sessionToken = data.token;
    this.logger.info(`token exchange successful, expires at: ${data.expiresAt}`);
  }
  getWebSocketUrl() {
    const url = new URL(this.url);
    const protocol = url.protocol === "https:" || url.protocol === "wss:" ? "wss:" : "ws:";
    let wsUrl = `${protocol}//${url.host}/ws`;
    if (this.sessionToken) {
      wsUrl += `?token=${this.sessionToken}`;
    }
    return wsUrl;
  }
  async connectWebSocket() {
    if (this.wsState === "connected" /* CONNECTED */) {
      return;
    }
    if (this.wsState === "connecting" /* CONNECTING */) {
      return this.waitForConnection();
    }
    if (this.wsState === "failed" /* FAILED */) {
      this.logger.info("retrying websocket connection after previous failure");
      this.wsState = "disconnected" /* DISCONNECTED */;
    }
    this.wsState = "connecting" /* CONNECTING */;
    try {
      await this.exchangeTokenForSession();
      this.ws = new WebSocket(this.getWebSocketUrl());
      this.attachWebSocketHandlers();
      await this.waitForConnection();
    } catch {
      this.wsState = "failed" /* FAILED */;
      this.ws = null;
      throw new ConnectionError("failed to connect to websocket");
    }
  }
  waitForConnection() {
    if (this.wsState === "connected" /* CONNECTED */) return Promise.resolve();
    if (this.wsState === "failed" /* FAILED */) return Promise.reject(new ConnectionError("websocket connection failed"));
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeoutId);
        this.removeConnectionListener(listener);
      };
      const listener = (state) => {
        if (state === "connected" /* CONNECTED */) {
          cleanup();
          resolve();
        } else if (state === "failed" /* FAILED */) {
          cleanup();
          reject(new ConnectionError("websocket connection failed"));
        }
      };
      const timeoutId = setTimeout(() => {
        this.removeConnectionListener(listener);
        if (this.wsState !== "connected" /* CONNECTED */) {
          this.wsState = "failed" /* FAILED */;
          if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
          reject(new ConnectionError("websocket connection timeout"));
        }
      }, 2e3);
      this.addConnectionListener(listener);
    });
  }
  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
  }
  removeConnectionListener(listener) {
    this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
  }
  notifyConnectionListeners() {
    for (const listener of this.connectionListeners) {
      listener(this.wsState);
    }
  }
  attachWebSocketHandlers() {
    if (!this.ws) {
      return;
    }
    this.ws.onopen = () => this.handleWebSocketOpen();
    this.ws.onmessage = (event) => this.handleWebSocketMessage(event.data);
    this.ws.onerror = (error) => this.handleWebSocketError(error);
    this.ws.onclose = (event) => this.handleWebSocketClose(event);
  }
  handleWebSocketOpen() {
    this.logger.info("websocket connected");
    this.wsState = "connected" /* CONNECTED */;
    this.notifyConnectionListeners();
    this.reconnectAttempts = 0;
    this.flushMessageQueue();
  }
  handleWebSocketMessage(data) {
    try {
      const response = JSON.parse(data);
      const pending = this.pendingRequests.get(response.id);
      if (pending) {
        this.logger.info(`received response for request id: ${response.id} method: ${pending.method}`);
        if (pending.timeoutId) {
          clearTimeout(pending.timeoutId);
        }
        this.pendingRequests.delete(response.id);
        if (response.error) {
          pending.reject(new Error(response.error.message || "JSON-RPC error"));
        } else {
          pending.resolve(response.result);
        }
      } else {
        this.logger.warn(`received response for unknown request id: ${response.id}`);
      }
    } catch (error) {
      this.logger.error("error parsing websocket message", error);
    }
  }
  handleWebSocketError(error) {
    const errorDetails = error.message || error.type || "unknown error";
    this.logger.error(`websocket error: ${errorDetails}`);
    if (this.wsState === "connecting" /* CONNECTING */) {
      this.wsState = "failed" /* FAILED */;
      this.notifyConnectionListeners();
    }
  }
  handleWebSocketClose(event) {
    const reason = event.reason || "no reason provided";
    this.logger.info(`websocket closed, code: ${event.code}, reason: ${reason}`);
    if (this.wsState === "connecting" /* CONNECTING */) {
      this.wsState = "failed" /* FAILED */;
      this.notifyConnectionListeners();
    } else {
      this.wsState = "disconnected" /* DISCONNECTED */;
      this.ws = null;
      if (this.pendingRequests.size > 0 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      }
    }
  }
  async attemptReconnect() {
    this.reconnectAttempts++;
    this.wsState = "reconnecting" /* RECONNECTING */;
    this.logger.info(`attempting websocket reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    await new Promise((resolve) => setTimeout(resolve, this.reconnectDelay * this.reconnectAttempts));
    try {
      await this.connectWebSocket();
    } catch {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.logger.error("max reconnect attempts reached");
        this.wsState = "failed" /* FAILED */;
        this.failAllPendingRequests();
      }
    }
  }
  failAllPendingRequests() {
    const error = new Error("WebSocket connection failed, please retry");
    this.pendingRequests.forEach((pending) => {
      if (pending.timeoutId) {
        clearTimeout(pending.timeoutId);
      }
      pending.reject(error);
    });
    this.pendingRequests.clear();
  }
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.wsState === "connected" /* CONNECTED */) {
      const msg = this.messageQueue.shift();
      if (msg && this.ws) {
        this.ws.send(JSON.stringify({
          jsonrpc: JSON_RPC_VERSION,
          id: msg.id,
          method: msg.method,
          params: msg.params
        }));
      }
    }
  }
  async sendViaWebSocket(method, params, timeoutMs) {
    await this.connectWebSocket();
    const id = this.idCounter++;
    return new Promise((resolve, reject) => {
      let timeoutId;
      if (timeoutMs !== void 0) {
        timeoutId = setTimeout(() => {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }
      this.pendingRequests.set(id, {
        resolve,
        reject,
        timeoutId,
        method
      });
      const message = {
        jsonrpc: JSON_RPC_VERSION,
        id,
        method,
        params
      };
      if (this.ws && this.wsState === "connected" /* CONNECTED */) {
        this.ws.send(JSON.stringify(message));
      } else {
        this.messageQueue.push(message);
      }
    });
  }
  sendJsonRpcRequest = async (method, params, timeoutMs) => {
    return this.sendViaWebSocket(method, params, timeoutMs);
  };
  get isDisconnected() {
    return this.wsState === "disconnected" /* DISCONNECTED */ || this.wsState === "failed" /* FAILED */;
  }
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.wsState = "disconnected" /* DISCONNECTED */;
    this.failAllPendingRequests();
    this.messageQueue = [];
  }
};

// src/rpc/DeviceClient.ts
var DeviceClient = class {
  constructor(jsonRpcClient, deviceId) {
    this.jsonRpcClient = jsonRpcClient;
    this.deviceId = deviceId;
  }
  request(method, params, timeoutMs) {
    const combinedParams = { deviceId: this.deviceId, ...params || {} };
    return this.jsonRpcClient.sendJsonRpcRequest(method, combinedParams, timeoutMs);
  }
  async getDeviceInfo() {
    return this.request("device.info");
  }
  async boot() {
    return this.request("device.boot");
  }
  async reboot() {
    return this.request("device.reboot");
  }
  async shutdown() {
    return this.request("device.shutdown");
  }
  async tap(x, y) {
    return this.request("device.io.tap", { x, y });
  }
  async gesture(actions) {
    return this.request("device.io.gesture", { actions });
  }
  async inputText(text, timeoutMs) {
    return this.request("device.io.text", { text }, timeoutMs);
  }
  async pressButton(button) {
    return this.request("device.io.button", { button });
  }
  async takeScreenshot() {
    return this.request("device.screenshot");
  }
  async screenCaptureStart(format, scale) {
    return this.request("device.screencapture", { format, scale });
  }
};
var NoOpDeviceClient = class {
  async getDeviceInfo() {
    return { device: { id: "", name: "", platform: "", type: "", screenSize: { width: 0, height: 0, scale: 1 } } };
  }
  async boot() {
  }
  async reboot() {
  }
  async shutdown() {
  }
  async tap(_x, _y) {
  }
  async gesture(_actions) {
  }
  async inputText(_text, _timeoutMs) {
  }
  async pressButton(_button) {
  }
  async takeScreenshot() {
    return { data: "" };
  }
  async screenCaptureStart(format, _scale) {
    return { format };
  }
};
var noOpDeviceClient = new NoOpDeviceClient();
function createNoOpDeviceClient() {
  return noOpDeviceClient;
}

// src/streams/MjpegStream.ts
var MjpegStream = class {
  constructor(reader, options) {
    this.reader = reader;
    this.options = options;
  }
  isActive = false;
  start() {
    this.isActive = true;
    this.processMjpegStream().catch((error) => {
      console.error("device-view: unhandled MJPEG stream error:", error);
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
    });
  }
  stop() {
    console.log("device-view: stopping mjpeg stream through stop()");
    this.isActive = false;
    this.reader.cancel().catch(() => {
    });
  }
  async processMjpegStream() {
    const boundary = "--BoundaryString";
    let buffer = new Uint8Array();
    let inImage = false;
    let imageData = new Uint8Array();
    let contentLength = 0;
    let contentType = "";
    let bytesRead = 0;
    console.log("device-view: starting mjpeg stream");
    try {
      while (this.isActive) {
        const { done, value } = await this.reader.read();
        if (done) {
          console.log("device-view: mjpeg stream ended by server");
          break;
        }
        const newBuffer = new Uint8Array(buffer.length + value.length);
        newBuffer.set(buffer);
        newBuffer.set(value, buffer.length);
        buffer = newBuffer;
        let processedData = false;
        while (true) {
          if (!inImage) {
            const bufferString = new TextDecoder().decode(buffer);
            const boundaryIndex = bufferString.indexOf(boundary);
            if (boundaryIndex < 0) {
              break;
            }
            const headerEndIndex = bufferString.indexOf("\r\n\r\n", boundaryIndex);
            if (headerEndIndex < 0) {
              break;
            }
            const headers = bufferString.substring(boundaryIndex + boundary.length, headerEndIndex);
            const contentLengthMatch = headers.match(/Content-Length:\s*(\d+)/i);
            if (contentLengthMatch) {
              contentLength = parseInt(contentLengthMatch[1]);
            }
            const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
            contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "";
            const headerEndBytes = headerEndIndex + 4;
            buffer = buffer.slice(headerEndBytes);
            inImage = true;
            imageData = new Uint8Array();
            bytesRead = 0;
            processedData = true;
          }
          if (inImage) {
            const remainingBytes = contentLength - bytesRead;
            const bytesToRead = Math.min(remainingBytes, buffer.length);
            if (bytesToRead === 0) {
              break;
            }
            const newImageData = new Uint8Array(imageData.length + bytesToRead);
            newImageData.set(imageData);
            newImageData.set(buffer.slice(0, bytesToRead), imageData.length);
            imageData = newImageData;
            bytesRead += bytesToRead;
            buffer = buffer.slice(bytesToRead);
            processedData = true;
            if (bytesRead >= contentLength) {
              this.options.onFrame(contentType, imageData);
              inImage = false;
              imageData = new Uint8Array();
              bytesRead = 0;
            }
          }
        }
        if (processedData) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (err.name === "AbortError") {
        console.log("device-view: mjpeg stream processing aborted with AbortError");
      } else {
        console.error("device-view: mjpeg processing failed with error:", err);
        this.options.onError?.(err);
      }
    }
  }
};

// src/streams/AvcStream.ts
var AvcStream = class {
  constructor(reader, options) {
    this.reader = reader;
    this.options = options;
    this.initializeDecoder();
  }
  isActive = false;
  decoder = null;
  buffer = new Uint8Array();
  sps = null;
  pps = null;
  isConfigured = false;
  frameCount = 0;
  initializeDecoder() {
    if (typeof VideoDecoder === "undefined") {
      const error = new Error("VideoDecoder API not supported in this browser");
      this.options.onError?.(error);
      throw error;
    }
    this.decoder = new VideoDecoder({
      output: (frame) => {
        this.options.onFrame(frame);
      },
      error: (error) => {
        console.error("device-view: VideoDecoder error:", error);
        this.isConfigured = false;
        this.options.onError?.(error);
      }
    });
  }
  start() {
    this.isActive = true;
    this.processAvcStream();
  }
  stop() {
    this.isActive = false;
    this.reader.cancel();
    if (this.decoder) {
      if (this.decoder.state !== "closed") {
        this.decoder.close();
      }
      this.decoder = null;
    }
    this.isConfigured = false;
    this.sps = null;
    this.pps = null;
  }
  parseNalUnit(data) {
    const nalHeader = data[0];
    const nalTypeValue = nalHeader & 31;
    const nalTypeMap = { 7: "sps", 8: "pps", 5: "idr", 1: "non-idr" };
    const type = nalTypeMap[nalTypeValue] || "other";
    return { type, data };
  }
  configureDecoder() {
    if (!this.sps || !this.pps) {
      console.log("device-view: cannot configure - sps:", !!this.sps, "pps:", !!this.pps);
      return;
    }
    if (!this.decoder || this.decoder.state === "closed") {
      console.log("device-view: decoder is closed or missing, reinitializing...");
      this.initializeDecoder();
    }
    if (!this.decoder) {
      console.error("device-view: failed to create decoder");
      return;
    }
    const profileIdc = this.sps[1];
    const constraintSet = this.sps[2];
    const levelIdc = this.sps[3];
    const codec = `avc1.${profileIdc.toString(16).padStart(2, "0")}${constraintSet.toString(16).padStart(2, "0")}${levelIdc.toString(16).padStart(2, "0")}`;
    console.log("device-view: configuring VideoDecoder with codec:", codec, "size:", this.options.width, "x", this.options.height);
    const avcC = this.buildAvcCBox(this.sps, this.pps);
    try {
      this.decoder.configure({
        codec,
        codedWidth: this.options.width || 1080,
        codedHeight: this.options.height || 1920,
        description: avcC,
        optimizeForLatency: true
      });
      this.isConfigured = true;
      console.log("device-view: VideoDecoder configured successfully, state:", this.decoder.state);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("device-view: failed to configure VideoDecoder:", err);
      this.isConfigured = false;
      this.options.onError?.(err);
    }
  }
  buildAvcCBox(sps, pps) {
    const avcCSize = 1 + 1 + 1 + 1 + 1 + 1 + 2 + sps.length + 1 + 2 + pps.length;
    const avcC = new Uint8Array(avcCSize);
    let offset = 0;
    avcC[offset++] = 1;
    avcC[offset++] = sps[1];
    avcC[offset++] = sps[2];
    avcC[offset++] = sps[3];
    avcC[offset++] = 255;
    avcC[offset++] = 225;
    avcC[offset++] = sps.length >> 8 & 255;
    avcC[offset++] = sps.length & 255;
    avcC.set(sps, offset);
    offset += sps.length;
    avcC[offset++] = 1;
    avcC[offset++] = pps.length >> 8 & 255;
    avcC[offset++] = pps.length & 255;
    avcC.set(pps, offset);
    return avcC;
  }
  async decodeFrame(nalUnit) {
    if (!this.decoder || !this.isConfigured || this.decoder.state === "closed") {
      console.log(`device-view: skipping decode - decoder=${!!this.decoder}, configured=${this.isConfigured}, state=${this.decoder?.state}`);
      return;
    }
    const isKeyFrame = nalUnit.type === "idr";
    const timestamp = this.frameCount * 16666;
    try {
      const avccData = new Uint8Array(4 + nalUnit.data.length);
      avccData[0] = nalUnit.data.length >> 24 & 255;
      avccData[1] = nalUnit.data.length >> 16 & 255;
      avccData[2] = nalUnit.data.length >> 8 & 255;
      avccData[3] = nalUnit.data.length & 255;
      avccData.set(nalUnit.data, 4);
      const chunk = new EncodedVideoChunk({
        type: isKeyFrame ? "key" : "delta",
        timestamp,
        data: avccData
      });
      this.decoder.decode(chunk);
      this.frameCount++;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("device-view: error decoding AVC frame:", err);
      this.isConfigured = false;
    }
  }
  async processAvcStream() {
    console.log("device-view: starting AVC stream");
    try {
      while (this.isActive) {
        const { done, value } = await this.reader.read();
        if (done) {
          console.log("device-view: avc stream ended by server");
          break;
        }
        const newBuffer = new Uint8Array(this.buffer.length + value.length);
        newBuffer.set(this.buffer);
        newBuffer.set(value, this.buffer.length);
        this.buffer = newBuffer;
        const startCodes = [];
        for (let i = 0; i < this.buffer.length - 3; i++) {
          if (this.buffer[i] === 0 && this.buffer[i + 1] === 0) {
            let startCodeLength = 0;
            if (i < this.buffer.length - 4 && this.buffer[i + 2] === 0 && this.buffer[i + 3] === 1) {
              startCodeLength = 4;
            } else if (this.buffer[i + 2] === 1) {
              startCodeLength = 3;
            }
            if (startCodeLength > 0) {
              startCodes.push({ index: i, length: startCodeLength });
              i += startCodeLength - 1;
            }
          }
        }
        for (let i = 0; i < startCodes.length - 1; i++) {
          const start = startCodes[i].index + startCodes[i].length;
          const end = startCodes[i + 1].index;
          const nalData = this.buffer.slice(start, end);
          if (nalData.length > 0) {
            const nalUnit = this.parseNalUnit(nalData);
            if (nalUnit.type === "sps") {
              console.log("device-view: received SPS, length:", nalUnit.data.length);
              this.sps = nalUnit.data;
              if (this.pps && !this.isConfigured) {
                this.configureDecoder();
              }
            } else if (nalUnit.type === "pps") {
              console.log("device-view: received PPS, length:", nalUnit.data.length);
              this.pps = nalUnit.data;
              if (this.sps && !this.isConfigured) {
                this.configureDecoder();
              }
            } else if (nalUnit.type === "idr" || nalUnit.type === "non-idr") {
              await this.decodeFrame(nalUnit);
            }
          }
        }
        if (startCodes.length > 0) {
          const lastStartCode = startCodes[startCodes.length - 1];
          this.buffer = this.buffer.slice(lastStartCode.index);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (err.name === "AbortError") {
        console.log("device-view: avc stream processing aborted");
      } else {
        console.error("device-view: avc processing failed:", err);
        this.options.onError?.(err);
      }
    }
  }
};

// src/streams/WebRtcStream.ts
var WebRtcStream = class {
  constructor(session, options) {
    this.session = session;
    this.options = options;
  }
  pc = null;
  pendingIceCandidates = [];
  offerSent = false;
  isActive = false;
  currentStream = null;
  rpcIdCounter = 1;
  async start() {
    try {
      console.log("device-view: starting WebRTC stream, sessionId:", this.session.sessionId);
      this.isActive = true;
      this.createPeerConnection();
      this.setupH264Transceiver();
      await this.createAndSetOffer();
      console.log("device-view: WebRTC offer created, waiting for ICE gathering");
      await this.waitForIceGathering();
      console.log("device-view: ICE gathering complete, sending offer to server");
      const answerSdp = await this.sendOfferToWebrtcServerWithRetry(this.session.webrtcServerUrl, this.session.sessionId);
      console.log("device-view: received WebRTC answer from server");
      this.offerSent = true;
      await this.flushPendingIceCandidates();
      await this.setRemoteAnswerFromSdp(answerSdp);
      console.log("device-view: WebRTC remote description set, waiting for connection");
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("device-view: error starting WebRTC stream:", err);
      this.options.onError?.(err);
      throw err;
    }
  }
  stop() {
    console.log("device-view: stopping WebRTC stream");
    this.isActive = false;
    this.offerSent = false;
    this.pendingIceCandidates = [];
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
    if (this.pc) {
      this.pc.ontrack = null;
      this.pc.onicecandidate = null;
      this.pc.onconnectionstatechange = null;
      this.pc.oniceconnectionstatechange = null;
      this.pc.close();
      this.pc = null;
    }
  }
  createPeerConnection() {
    if (this.pc) {
      this.pc.close();
    }
    const iceServers = this.buildIceServers(this.session.iceServers);
    console.log("device-view: creating peer connection with ICE servers:", JSON.stringify(iceServers));
    this.pc = new RTCPeerConnection({ iceServers });
    this.pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) {
        console.log("device-view: WebRTC got media stream, tracks:", stream.getTracks().length);
        this.currentStream = stream;
        this.options.onTrack(stream);
      }
    };
    this.pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      this.sendIceCandidate(event.candidate).catch((error) => {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("device-view: error sending ICE candidate:", err);
        this.options.onError?.(err);
      });
    };
    this.pc.onconnectionstatechange = () => {
      if (!this.pc) return;
      console.log("device-view: WebRTC connection state:", this.pc.connectionState);
      this.options.onConnectionStateChange?.(this.pc.connectionState);
    };
    this.pc.oniceconnectionstatechange = () => {
      if (!this.pc) return;
      console.log("device-view: WebRTC ICE connection state:", this.pc.iceConnectionState);
      this.options.onIceConnectionStateChange?.(this.pc.iceConnectionState);
    };
  }
  setupH264Transceiver() {
    if (!this.pc) return;
    const transceiver = this.pc.addTransceiver("video", { direction: "recvonly" });
    const codecs = RTCRtpReceiver.getCapabilities("video")?.codecs || [];
    const h264 = codecs.filter((codec) => codec.mimeType === "video/H264");
    if (h264.length > 0) {
      transceiver.setCodecPreferences(h264);
    }
  }
  async createAndSetOffer() {
    if (!this.pc) {
      return;
    }
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
  }
  async waitForIceGathering() {
    if (!this.pc) {
      return;
    }
    const pc = this.pc;
    if (pc.iceGatheringState === "complete") {
      return;
    }
    await new Promise((resolve) => {
      const checkState = () => {
        if (pc.iceGatheringState === "complete") {
          pc.removeEventListener("icegatheringstatechange", checkState);
          resolve();
        }
      };
      pc.addEventListener("icegatheringstatechange", checkState);
    });
  }
  async sendOfferToWebrtcServerWithRetry(url, sessionId, maxRetries = 30, retryIntervalMs = 1e3) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (!this.isActive) {
        throw new Error("WebRTC stream stopped");
      }
      try {
        if (attempt > 1) {
          console.log(`device-view: WebRTC offer retry attempt ${attempt}/${maxRetries}`);
        }
        return await this.sendOfferToWebrtcServer(url, sessionId);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          console.log(`device-view: WebRTC offer attempt ${attempt} failed: ${lastError.message}, retrying`);
          await this.sleep(retryIntervalMs);
        }
      }
    }
    console.error(`device-view: all ${maxRetries} WebRTC offer attempts failed`);
    throw lastError || new Error("Failed to connect to WebRTC server after maximum retries");
  }
  async sendOfferToWebrtcServer(url, sessionId) {
    if (!this.pc || !this.pc.localDescription) {
      throw new Error("Missing local description for WebRTC offer");
    }
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "webrtc.offer",
        params: {
          sessionId,
          role: "viewer",
          sdp: this.pc.localDescription.sdp
        },
        id: this.rpcIdCounter++
      })
    });
    const data = await resp.json();
    if (data?.error) {
      throw new Error(`JSON-RPC error: ${data.error.message} - ${data.error.data}`);
    }
    const sdp = data?.result?.sdp;
    if (!sdp) {
      throw new Error("Missing SDP answer in WebRTC response");
    }
    return sdp;
  }
  async setRemoteAnswerFromSdp(answerSdp) {
    if (!this.pc) return;
    await this.pc.setRemoteDescription({
      type: "answer",
      sdp: answerSdp
    });
  }
  buildIceServers(servers) {
    if (!Array.isArray(servers)) {
      return [];
    }
    return servers.map((server) => ({ urls: server.urls })).filter((server) => server.urls && server.urls.length > 0);
  }
  async sendIceCandidate(candidate) {
    if (!this.isActive) return;
    if (!this.offerSent) {
      this.pendingIceCandidates.push(candidate);
      return;
    }
    await fetch(this.session.webrtcServerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "webrtc.ice",
        params: {
          sessionId: this.session.sessionId,
          role: "viewer",
          candidate
        },
        id: this.rpcIdCounter++
      })
    });
  }
  async flushPendingIceCandidates() {
    while (this.pendingIceCandidates.length > 0) {
      const candidate = this.pendingIceCandidates.shift();
      if (candidate) {
        await this.sendIceCandidate(candidate);
      }
    }
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
function useDeviceInteraction({ deviceClient, selectedDevice }) {
  const pendingKeys = useRef("");
  const isFlushingKeys = useRef(false);
  const handleTap = async (x, y) => {
    await deviceClient.tap(x, y);
  };
  const pointerDown = () => ({ type: "pointerDown", button: 0 });
  const pointerMove = (x, y, duration) => ({ type: "pointerMove", duration, x, y });
  const pointerUp = () => ({ type: "pointerUp", button: 0 });
  const handleGesture = async (points) => {
    const actions = [];
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
      await deviceClient.inputText(keys, 3e3);
    } catch (error) {
      console.error("device-view: error flushing keys:", error);
    } finally {
      isFlushingKeys.current = false;
    }
  };
  const handleKeyDown = async (key) => {
    const keyMap = {
      "Enter": "\n",
      "Backspace": "\b",
      "Delete": "\x7F",
      " ": " "
    };
    let text;
    if (keyMap[key] !== void 0) {
      text = keyMap[key];
    } else if (key.length === 1) {
      text = key;
    } else {
      return;
    }
    pendingKeys.current += text;
    setTimeout(() => flushPendingKeys(), 500);
  };
  const logButtonError = (error) => {
    console.error("device-view: error pressing button:", error);
  };
  const pressButton = async (button) => {
    await deviceClient.pressButton(button);
  };
  const onHome = () => {
    pressButton("HOME").catch(logButtonError);
  };
  const onBack = () => {
    pressButton("BACK").catch(logButtonError);
  };
  const onAppSwitch = () => {
    pressButton("APP_SWITCH").catch(logButtonError);
  };
  const onPower = () => {
    pressButton("POWER").catch(logButtonError);
  };
  const onRotateDevice = () => {
    console.log("device-view: rotate device requested");
  };
  const onIncreaseVolume = () => {
    pressButton("VOLUME_UP").catch(logButtonError);
  };
  const onDecreaseVolume = () => {
    pressButton("VOLUME_DOWN").catch(logButtonError);
  };
  const getScreenshotFilename = (device) => {
    return `screenshot-${device.name}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/:/g, "-")}.png`;
  };
  const onTakeScreenshot = async () => {
    try {
      const response = await deviceClient.takeScreenshot();
      const DATA_IMAGE_PNG = "data:image/png;base64,";
      if (response.data && response.data.startsWith(DATA_IMAGE_PNG)) {
        const base64Data = response.data.substring(DATA_IMAGE_PNG.length);
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        if (selectedDevice) {
          const a = document.createElement("a");
          a.href = url;
          a.download = getScreenshotFilename(selectedDevice);
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error("Error taking screenshot:", error);
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
function isWebRtcResponse(response) {
  return typeof response === "object" && response !== null && typeof response.sessionId === "string" && typeof response.webrtcServerUrl === "string";
}
var Spinner = ({ message }) => /* @__PURE__ */ jsx("div", { style: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "#202224",
  color: "#888"
}, children: /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
  /* @__PURE__ */ jsx("div", { style: {
    width: "24px",
    height: "24px",
    margin: "0 auto 12px",
    border: "2px solid #333",
    borderTopColor: "#888",
    borderRadius: "50%",
    animation: "device-view-spin 0.6s linear infinite"
  } }),
  /* @__PURE__ */ jsx("style", { children: `@keyframes device-view-spin { to { transform: rotate(360deg); } }` }),
  /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "14px" }, children: message || "Loading..." })
] }) });
var DeviceView = ({
  serverUrl,
  token,
  deviceId,
  skinsUrl,
  onError,
  onConnected,
  onDisconnected
}) => {
  const [deviceState, setDeviceState] = useState("UNKNOWN" /* UNKNOWN */);
  const [connectProgressMessage, setConnectProgressMessage] = useState(null);
  const [imageBitmap, setImageBitmap] = useState(null);
  const [streamMode, setStreamMode] = useState("canvas");
  const [webrtcMediaStream, setWebrtcMediaStream] = useState(null);
  const [deviceSkin, setDeviceSkin] = useState(NoDeviceSkin);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const screenSizeRef = useRef({ width: 0, height: 0, scale: 1 });
  const mjpegStreamRef = useRef(null);
  const avcStreamRef = useRef(null);
  const webrtcStreamRef = useRef(null);
  const streamReaderRef = useRef(null);
  const streamControllerRef = useRef(null);
  const deviceStreamRef = useRef(null);
  const videoRef = useRef(null);
  const imageBitmapRef = useRef(null);
  const streamingDeviceIdRef = useRef(null);
  const streamGenerationRef = useRef(0);
  const jsonRpcClientRef = useRef(null);
  const getOrCreateClient = () => {
    if (!jsonRpcClientRef.current || jsonRpcClientRef.current.isDisconnected) {
      jsonRpcClientRef.current = new JsonRpcClient(serverUrl, void 0, token);
    }
    return jsonRpcClientRef.current;
  };
  const getDeviceClient = () => {
    return new DeviceClient(getOrCreateClient(), deviceId);
  };
  const {
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
  } = useDeviceInteraction({
    selectedDevice,
    deviceClient: getDeviceClient()
  });
  useEffect(() => {
    if (!webrtcMediaStream || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = webrtcMediaStream;
    video.muted = true;
    video.play().catch((error) => {
      console.error("device-view: error playing WebRTC stream:", error);
    });
  }, [webrtcMediaStream]);
  useEffect(() => {
    if (imageBitmap && deviceStreamRef.current) {
      const canvas = deviceStreamRef.current.getCanvas();
      if (canvas) {
        const ctx = canvas.getContext("2d");
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
  const onJpegFrame = async (body) => {
    try {
      const blob = new Blob([body], { type: "image/jpeg" });
      const newImageBitmap = await createImageBitmap(blob);
      setDeviceState("CONNECTED" /* CONNECTED */);
      setImageBitmap((prev) => {
        if (prev) prev.close();
        return newImageBitmap;
      });
    } catch (error) {
      console.error("device-view: error displaying MJPEG frame:", error);
    }
  };
  const onJsonFrame = async (body) => {
    try {
      const bodyText = new TextDecoder().decode(body);
      const jsonData = JSON.parse(bodyText);
      if (jsonData.jsonrpc === "2.0" && jsonData.method === "notification/message" && jsonData.params?.message) {
        setConnectProgressMessage(jsonData.params.message);
      }
    } catch (error) {
      console.error("device-view: error parsing JSON-RPC notification:", error);
    }
  };
  const onFrame = async (mimeType, body) => {
    if (mimeType === "image/jpeg") await onJpegFrame(body);
    else if (mimeType === "application/json") await onJsonFrame(body);
  };
  const onAvcFrame = async (frame) => {
    try {
      setDeviceState("CONNECTED" /* CONNECTED */);
      if (deviceStreamRef.current) {
        const canvas = deviceStreamRef.current.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext("2d");
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
      console.error("device-view: error displaying AVC frame:", error);
    }
  };
  const wsUrlToHttpUrl = (wsUrl) => {
    const url = new URL(wsUrl);
    const protocol = url.protocol === "wss:" ? "https:" : "http:";
    return `${protocol}//${url.host}`;
  };
  const startStream = async (devId, format) => {
    const generation = streamGenerationRef.current;
    try {
      setDeviceState("CONNECTING" /* CONNECTING */);
      const scale = format === "avc" ? 0.5 : void 0;
      const client = getDeviceClient();
      const response = await client.screenCaptureStart(format, scale);
      if (generation !== streamGenerationRef.current) return;
      const handleStreamError = (error) => {
        console.error(`device-view: error from ${format} stream:`, error);
        onError?.(error);
      };
      if (isWebRtcResponse(response)) {
        const result = response;
        const session = {
          sessionId: result.sessionId,
          webrtcServerUrl: result.webrtcServerUrl,
          iceServers: result.iceServers
        };
        setStreamMode("video");
        const webrtcStream = new WebRtcStream(session, {
          onTrack: (stream) => {
            setDeviceState("CONNECTED" /* CONNECTED */);
            onConnected?.();
            setWebrtcMediaStream(stream);
          },
          onError: handleStreamError
        });
        webrtcStreamRef.current = webrtcStream;
        await webrtcStream.start();
        return;
      }
      if (!response.sessionUrl) {
        throw new Error("No sessionUrl in response");
      }
      const httpBaseUrl = wsUrlToHttpUrl(serverUrl);
      const streamUrl = `${httpBaseUrl}${response.sessionUrl}`;
      const streamResponse = await fetch(streamUrl);
      if (!streamResponse.ok) throw new Error(`Stream fetch failed: ${streamResponse.status}`);
      if (!streamResponse.body) throw new Error("ReadableStream not supported");
      const controller = new AbortController();
      const reader = streamResponse.body.getReader();
      streamControllerRef.current = controller;
      streamReaderRef.current = reader;
      if (format === "avc") {
        const currentScreenSize = screenSizeRef.current;
        const width = scale ? Math.floor((currentScreenSize.width || 1080) * scale) : currentScreenSize.width || 1080;
        const height = scale ? Math.floor((currentScreenSize.height || 1920) * scale) : currentScreenSize.height || 1920;
        const stream = new AvcStream(reader, { onFrame: onAvcFrame, onError: handleStreamError, width, height });
        setStreamMode("canvas");
        avcStreamRef.current = stream;
        stream.start();
      } else {
        const stream = new MjpegStream(reader, { onFrame, onError: handleStreamError });
        setStreamMode("canvas");
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
    if (mjpegStreamRef.current) {
      mjpegStreamRef.current.stop();
      mjpegStreamRef.current = null;
    }
    if (avcStreamRef.current) {
      avcStreamRef.current.stop();
      avcStreamRef.current = null;
    }
    if (streamControllerRef.current) {
      streamControllerRef.current.abort();
      streamControllerRef.current = null;
    }
    if (streamReaderRef.current) {
      streamReaderRef.current = null;
    }
    if (webrtcStreamRef.current) {
      webrtcStreamRef.current.stop();
      webrtcStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setWebrtcMediaStream(null);
    if (imageBitmapRef.current) {
      imageBitmapRef.current.close();
      imageBitmapRef.current = null;
    }
    setImageBitmap(null);
    onDisconnected?.();
  };
  useEffect(() => {
    if (!deviceId) return;
    let cancelled = false;
    stopStream();
    const rpcClient = new JsonRpcClient(serverUrl, void 0, token);
    jsonRpcClientRef.current = rpcClient;
    streamingDeviceIdRef.current = deviceId;
    const client = new DeviceClient(rpcClient, deviceId);
    client.getDeviceInfo().then((result) => {
      if (cancelled || !result?.device) return;
      screenSizeRef.current = result.device.screenSize;
      const descriptor = {
        id: result.device.id,
        name: result.device.name,
        platform: result.device.platform,
        type: result.device.type
      };
      setSelectedDevice(descriptor);
      setDeviceSkin(getDeviceSkinForDevice(descriptor));
      let format = "mjpeg";
      if (descriptor.platform === "android" /* ANDROID */) {
        format = "avc";
      } else if (descriptor.platform === "ios" /* IOS */ && descriptor.type === "real" /* REAL */) {
        format = "avc";
      }
      if (!cancelled) {
        startStream(deviceId, format);
      }
    }).catch((error) => {
      if (cancelled) return;
      console.error("device-view: failed to get device info:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    });
    return () => {
      cancelled = true;
      stopStream();
      if (jsonRpcClientRef.current === rpcClient) {
        rpcClient.disconnect();
        jsonRpcClientRef.current = null;
      }
    };
  }, [deviceId, serverUrl, token]);
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);
  if (!selectedDevice) {
    return /* @__PURE__ */ jsx(Spinner, { message: "Loading device..." });
  }
  const hasSkins = !!skinsUrl;
  const skinOverlayUri = hasSkins ? `${skinsUrl}/${deviceSkin.imageFilename}` : "";
  const activeSkin = hasSkins ? deviceSkin : NoDeviceSkin;
  return /* @__PURE__ */ jsx(
    DeviceInstance,
    {
      ref: deviceStreamRef,
      state: deviceState,
      connectProgressMessage: connectProgressMessage || void 0,
      selectedDevice,
      screenSize: screenSizeRef.current,
      skinOverlayUri,
      deviceSkin: activeSkin,
      streamMode,
      videoRef,
      onTap: handleTap,
      onGesture: handleGesture,
      onKeyDown: handleKeyDown,
      onRotateDevice,
      onTakeScreenshot,
      onDeviceHome: onHome,
      onDeviceBack: onBack,
      onAppSwitch,
      onIncreaseVolume,
      onDecreaseVolume,
      onTogglePower: onPower
    }
  );
};

export { AvcStream, ConnectionError, DeviceClient, DeviceControls, DeviceInstance, DevicePlatform, DeviceState, DeviceType, DeviceView, DeviceViewport, JsonRpcClient, MjpegStream, NoDeviceSkin, WebRtcStream, createNoOpDeviceClient, getDeviceSkinForDevice };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map
import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
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
var toCssPercent = (value, total) => `${value / total * 100}%`;
var frameImageStyle = {
  display: "block",
  height: "100%",
  width: "auto",
  maxWidth: "100%"
};
var DeviceSkinComponent = ({ deviceSkin, children }) => {
  if (!deviceSkin.frameImage) {
    return /* @__PURE__ */ jsx("div", { style: { position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children });
  }
  const { display, frameWidth, frameHeight, frameImage: frameImage2 } = deviceSkin;
  const screenRadius = `${toCssPercent(display.cornerRadius, display.width)} / ${toCssPercent(display.cornerRadius, display.height)}`;
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", height: "100%" }, children: [
    /* @__PURE__ */ jsx("img", { src: frameImage2, alt: "", style: frameImageStyle, draggable: false }),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          left: toCssPercent(display.x, frameWidth),
          top: toCssPercent(display.y, frameHeight),
          width: toCssPercent(display.width, frameWidth),
          height: toCssPercent(display.height, frameHeight),
          borderRadius: screenRadius,
          overflow: "hidden",
          zIndex: 1
        },
        children
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: frameImage2,
        alt: "",
        draggable: false,
        style: { ...frameImageStyle, position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 2 }
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
  const streamStyle = {
    cursor: "crosshair",
    width: "100%",
    height: "100%",
    // Fill the box the layout hands us and letterbox to aspect ratio. The host
    // app is responsible for bounding that box (see DeviceInstance height:100%);
    // we no longer size off the viewport, so there is no chrome height to guess.
    // Corner rounding / camera cutout are handled by the skin mask, not here.
    objectFit: "contain",
    maxHeight: "100%",
    maxWidth: "100%"
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
  showControls = true,
  streamMode = "canvas",
  videoRef
}, ref) => {
  const canvasRef = useRef(null);
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }));
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "relative",
        flexGrow: 1,
        // height:100% lets this fill the (bounded) box the host gives us, so the
        // definite height propagates all the way down to the video/skin. Without
        // it every wrapper is content-sized and we'd be forced back to viewport units.
        height: "100%",
        // border-box keeps the 24px padding *inside* height:100%. Under the
        // default content-box the padding is added on top, so the element renders
        // 48px taller than the host's box and overflows it — bleeding over the
        // chrome above and pushing the bottom padding out of view.
        boxSizing: "border-box",
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
      children: /* @__PURE__ */ jsx("div", { style: { position: "relative", height: "100%", overflow: "visible" }, children: /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", overflow: "visible" }, children: /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "white" }, children: /* @__PURE__ */ jsxs("div", { style: { position: "relative", height: "100%", display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(DeviceSkinComponent, { deviceSkin, children: /* @__PURE__ */ jsx(
          DeviceViewport,
          {
            screenSize,
            onTap,
            onGesture,
            connectProgressMessage,
            streamMode,
            canvasRef,
            videoRef,
            state
          }
        ) }),
        showControls && /* @__PURE__ */ jsx(
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

// src/skins/pixel9.ts
var frameImage = "data:image/webp;base64,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";
var pixel9Skin = {
  frameImage,
  frameWidth: 1198,
  frameHeight: 2531,
  display: { x: 55, y: 58, width: 1080, height: 2424, cornerRadius: 87 }
};

// src/DeviceSkins.ts
var NoDeviceSkin = Object.freeze({
  frameImage: "",
  frameWidth: 0,
  frameHeight: 0,
  display: Object.freeze({ x: 0, y: 0, width: 0, height: 0, cornerRadius: 0 })
});
function isPixel9(model) {
  const normalized = model.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return /(^|\s)pixel 9(\s|$)/.test(normalized) && !normalized.includes("pixel 9 pro");
}
function getDeviceSkinForDevice(device) {
  if (device.platform === "android" /* ANDROID */ && isPixel9(device.model ?? "")) {
    return pixel9Skin;
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
var CONNECTION_TIMEOUT_MS = 1e4;
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
      }, CONNECTION_TIMEOUT_MS);
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
  statsTimer = null;
  prevStats = null;
  prevStatsTime = 0;
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
    if (this.statsTimer) {
      clearInterval(this.statsTimer);
      this.statsTimer = null;
    }
    this.prevStats = null;
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
      if (this.pc.connectionState === "connected") {
        void this.logSessionIdentity();
        this.startStatsLogging();
      }
      this.options.onConnectionStateChange?.(this.pc.connectionState);
    };
    this.pc.oniceconnectionstatechange = () => {
      if (!this.pc) return;
      console.log("device-view: WebRTC ICE connection state:", this.pc.iceConnectionState);
      this.options.onIceConnectionStateChange?.(this.pc.iceConnectionState);
    };
  }
  // Logs a single correlation line tying the session id to the inbound video
  // SSRC and a UTC timestamp. A Chrome webrtc-internals dump shows the SSRC but
  // not the session id, so this lets a dump be matched to the server logs.
  async logSessionIdentity() {
    try {
      if (!this.pc) return;
      const stats = await this.pc.getStats();
      let ssrc;
      stats.forEach((report) => {
        const r = report;
        if (r.type === "inbound-rtp" && r.kind === "video") {
          ssrc = r.ssrc;
        }
      });
      console.log(
        `device-view: session correlation sessionId=${this.session.sessionId} ssrc=${ssrc ?? "unknown"} utc=${(/* @__PURE__ */ new Date()).toISOString()}`
      );
    } catch (err) {
      console.warn("device-view: failed to log session identity:", err);
    }
  }
  startStatsLogging() {
    if (this.statsTimer) return;
    this.prevStats = null;
    this.prevStatsTime = 0;
    this.statsTimer = setInterval(() => {
      void this.logReceiverStats();
    }, 1e3);
  }
  // Logs receiver-side telemetry every second so the viewer experience is
  // readable as text: jitter-buffer delay (the lag), freezes (the hangs),
  // dropped frames (the missing animation), fps/resolution, RTT, loss.
  async logReceiverStats() {
    try {
      if (!this.pc) return;
      const report = await this.pc.getStats();
      let v;
      let cp;
      report.forEach((s) => {
        const r = s;
        if (r.type === "inbound-rtp" && r.kind === "video") v = r;
        if (r.type === "candidate-pair" && r.nominated) cp = r;
      });
      if (!v) return;
      const now = Date.now();
      const prev = this.prevStats;
      const prevTime = this.prevStatsTime;
      this.prevStats = v;
      this.prevStatsTime = now;
      if (!prev) return;
      const secs = (now - prevTime) / 1e3 || 1;
      const dEmitted = (v.jitterBufferEmittedCount ?? 0) - (prev.jitterBufferEmittedCount ?? 0);
      const jbDelayMs = dEmitted > 0 ? Math.round(((v.jitterBufferDelay ?? 0) - (prev.jitterBufferDelay ?? 0)) / dEmitted * 1e3) : 0;
      const jbTargetMs = dEmitted > 0 ? Math.round(((v.jitterBufferTargetDelay ?? 0) - (prev.jitterBufferTargetDelay ?? 0)) / dEmitted * 1e3) : 0;
      const dFreezes = (v.freezeCount ?? 0) - (prev.freezeCount ?? 0);
      const dFreezeDur = (v.totalFreezesDuration ?? 0) - (prev.totalFreezesDuration ?? 0);
      const dDropped = (v.framesDropped ?? 0) - (prev.framesDropped ?? 0);
      const dLost = (v.packetsLost ?? 0) - (prev.packetsLost ?? 0);
      const dNack = (v.nackCount ?? 0) - (prev.nackCount ?? 0);
      const dPli = (v.pliCount ?? 0) - (prev.pliCount ?? 0);
      const bitrateKbps = Math.round(((v.bytesReceived ?? 0) - (prev.bytesReceived ?? 0)) * 8 / secs / 1e3);
      const rttMs = cp?.currentRoundTripTime != null ? Math.round(cp.currentRoundTripTime * 1e3) : -1;
      console.log(
        `device-view stats: fps=${v.framesPerSecond ?? 0} res=${v.frameWidth ?? 0}x${v.frameHeight ?? 0} jbDelay=${jbDelayMs}ms jbTarget=${jbTargetMs}ms rtt=${rttMs}ms freezes=${v.freezeCount ?? 0}(+${dFreezes},${dFreezeDur.toFixed(1)}s) droppedFrames=+${dDropped} lost=+${dLost} nack=+${dNack} pli=+${dPli} bitrate=${bitrateKbps}kbps`
      );
    } catch (err) {
      console.warn("device-view: failed to log receiver stats:", err);
    }
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
var DeviceView = forwardRef(({
  serverUrl,
  token,
  deviceId,
  showControls = true,
  onError,
  onConnected,
  onDisconnected
}, ref) => {
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
  useImperativeHandle(ref, () => ({
    takeScreenshot: onTakeScreenshot,
    home: onHome,
    volumeUp: onIncreaseVolume,
    volumeDown: onDecreaseVolume
  }), [onTakeScreenshot, onHome, onIncreaseVolume, onDecreaseVolume]);
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
        model: result.device.model,
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
  return /* @__PURE__ */ jsx(
    DeviceInstance,
    {
      ref: deviceStreamRef,
      state: deviceState,
      connectProgressMessage: connectProgressMessage || void 0,
      selectedDevice,
      screenSize: screenSizeRef.current,
      deviceSkin,
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
      onTogglePower: onPower,
      showControls
    }
  );
});
DeviceView.displayName = "DeviceView";

export { AvcStream, ConnectionError, DeviceClient, DeviceControls, DeviceInstance, DevicePlatform, DeviceState, DeviceType, DeviceView, DeviceViewport, JsonRpcClient, MjpegStream, NoDeviceSkin, WebRtcStream, createNoOpDeviceClient, getDeviceSkinForDevice };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map
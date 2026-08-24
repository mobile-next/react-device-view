'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

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
function nativeScreenSlot(skin, screenSize) {
  const refW = skin.imageWidth - skin.bezel.left - skin.bezel.right;
  const refH = skin.imageHeight - skin.bezel.top - skin.bezel.bottom;
  const aspect = screenSize.width > 0 && screenSize.height > 0 ? screenSize.width / screenSize.height : refW / refH;
  return aspect < refW / refH ? { width: refH * aspect, height: refH } : { width: refW, height: refW / aspect };
}
function nativeFrameSize(skin, screenSize) {
  const slot = nativeScreenSlot(skin, screenSize);
  return {
    width: slot.width + skin.bezel.left + skin.bezel.right,
    height: slot.height + skin.bezel.top + skin.bezel.bottom
  };
}
var BUTTON_COLOR = "#2b2b2b";
function mapButtonTop(skin, frameHeight, button) {
  const { slice, imageHeight } = skin;
  const f = (frameHeight - 2 * slice) / (imageHeight - 2 * slice);
  const center = slice + (button.top + button.height / 2 - slice) * f;
  return Math.min(Math.max(center - button.height / 2, slice), frameHeight - slice - button.height);
}
var NinePatchSkinView = ({ skin, screenSize, children }) => {
  const frame = nativeFrameSize(skin, screenSize);
  const { bezel, slice } = skin;
  const frameWidth = `min(100cqw, calc(100cqh * ${frame.width} / ${frame.height}))`;
  const px = (n) => `calc(${n} * var(--s))`;
  return (
    // Height-driven like the exact-frame path: fills the parent's height and
    // derives its own width from the frame aspect, so content-width parents work.
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: "100%", aspectRatio: `${frame.width} / ${frame.height}`, maxWidth: "100%", containerType: "size", display: "grid", placeItems: "center" }, children: /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        style: {
          ["--s"]: `calc(${frameWidth} / ${frame.width})`,
          position: "relative",
          width: frameWidth,
          aspectRatio: `${frame.width} / ${frame.height}`
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: px(bezel.top),
                left: px(bezel.left),
                right: px(bezel.right),
                bottom: px(bezel.bottom),
                borderRadius: px(skin.screenCornerRadius),
                overflow: "hidden",
                zIndex: 1
              },
              children
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                borderStyle: "solid",
                borderWidth: px(slice),
                borderImage: `url("${skin.image}") ${slice} / ${px(slice)} stretch`,
                pointerEvents: "none",
                zIndex: 2
              }
            }
          ),
          skin.buttons.map((b, i) => /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: px(mapButtonTop(skin, frame.height, b)),
                height: px(b.height),
                width: px(b.depth),
                [b.side]: px(-b.depth),
                background: BUTTON_COLOR,
                borderRadius: b.side === "left" ? "2px 0 0 2px" : "0 2px 2px 0",
                pointerEvents: "none"
              }
            },
            i
          ))
        ]
      }
    ) })
  );
};
var toCssPercent = (value, total) => `${value / total * 100}%`;
var frameImageStyle = {
  display: "block",
  height: "100%",
  width: "auto",
  maxWidth: "100%"
};
var DeviceSkinComponent = ({ deviceSkin, screenSize, children }) => {
  if (deviceSkin.ninePatch) {
    return /* @__PURE__ */ jsxRuntime.jsx(NinePatchSkinView, { skin: deviceSkin.ninePatch, screenSize, children });
  }
  if (!deviceSkin.frameImage) {
    const hasSize = screenSize.width > 0 && screenSize.height > 0;
    return /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        style: {
          height: "100%",
          aspectRatio: hasSize ? `${screenSize.width} / ${screenSize.height}` : void 0,
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: "30px",
          padding: "5px",
          background: "#1b1b1b",
          boxSizing: "border-box"
        },
        children
      }
    ) });
  }
  const { display, frameWidth, frameHeight, frameImage: frameImage2 } = deviceSkin;
  const screenRadius = `${toCssPercent(display.cornerRadius, display.width)} / ${toCssPercent(display.cornerRadius, display.height)}`;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { position: "relative", height: "100%" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("img", { src: frameImage2, alt: "", style: frameImageStyle, draggable: false }),
    /* @__PURE__ */ jsxRuntime.jsx(
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
    /* @__PURE__ */ jsxRuntime.jsx(
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
var CameraIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "13", r: "4" })
] });
var HomeIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
  /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
] });
var BackIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
  /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "12 19 5 12 12 5" })
] });
var AppSwitchIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "14", width: "7", height: "7" })
] });
var VolumeUpIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
] });
var VolumeDownIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
  /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
  /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
] });
var InstallIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
] });
var LinkIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
] });
var PowerIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { width: "24px", height: "24px" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 2v10" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" })
] });
var ControlButton = ({ onClick, icon, text, isActive = false }) => {
  const [isHovered, setIsHovered] = react.useState(false);
  const [isPressed, setIsPressed] = react.useState(false);
  return /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "relative", height: "56px" }, children: /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
          width: "24px",
          height: "24px",
          color: isActive ? "#0a0a0a" : isHovered ? "#00ff88" : "#888",
          transition: isHovered ? "color 0.3s 0s" : "color 0.3s 0.3s",
          flexShrink: 0
        }, children: icon }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { style: {
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
var ControlSeparator = () => /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: "4px", display: "flex", alignItems: "center", position: "relative" }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: "1px", width: "4px", background: "#2a2a2a" } }) });
var DeviceControls = ({
  onRotateDevice,
  onTakeScreenshot,
  onDeviceHome,
  onDeviceBack,
  onAppSwitch,
  onIncreaseVolume,
  onDecreaseVolume,
  onTogglePower,
  onInstallApp,
  onOpenUrl
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    zIndex: 1e3,
    marginLeft: "10px",
    position: "relative",
    width: "56px"
  }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onTakeScreenshot || noop, icon: /* @__PURE__ */ jsxRuntime.jsx(CameraIcon, {}), text: "Screenshot" }),
    /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onDeviceHome || noop, icon: /* @__PURE__ */ jsxRuntime.jsx(HomeIcon, {}), text: "Home" }),
    onDeviceBack && /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onDeviceBack, icon: /* @__PURE__ */ jsxRuntime.jsx(BackIcon, {}), text: "Back" }),
    onAppSwitch && /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onAppSwitch, icon: /* @__PURE__ */ jsxRuntime.jsx(AppSwitchIcon, {}), text: "Recents" }),
    /* @__PURE__ */ jsxRuntime.jsx(ControlSeparator, {}),
    /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onIncreaseVolume || noop, icon: /* @__PURE__ */ jsxRuntime.jsx(VolumeUpIcon, {}), text: "Volume Up" }),
    /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onDecreaseVolume || noop, icon: /* @__PURE__ */ jsxRuntime.jsx(VolumeDownIcon, {}), text: "Volume Down" }),
    /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onTogglePower || noop, icon: /* @__PURE__ */ jsxRuntime.jsx(PowerIcon, {}), text: "Power" }),
    (onInstallApp || onOpenUrl) && /* @__PURE__ */ jsxRuntime.jsx(ControlSeparator, {}),
    onInstallApp && /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onInstallApp, icon: /* @__PURE__ */ jsxRuntime.jsx(InstallIcon, {}), text: "Install App" }),
    onOpenUrl && /* @__PURE__ */ jsxRuntime.jsx(ControlButton, { onClick: onOpenUrl, icon: /* @__PURE__ */ jsxRuntime.jsx(LinkIcon, {}), text: "Open URL" })
  ] });
};
var DeviceState = /* @__PURE__ */ ((DeviceState3) => {
  DeviceState3["UNKNOWN"] = "UNKNOWN";
  DeviceState3["BOOTING"] = "BOOTING";
  DeviceState3["CONNECTING"] = "CONNECTING";
  DeviceState3["CONNECTED"] = "CONNECTED";
  return DeviceState3;
})(DeviceState || {});
var ViewportSpinner = ({ message }) => /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#888" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
  /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
    width: "24px",
    height: "24px",
    margin: "0 auto 12px",
    border: "2px solid #333",
    borderTopColor: "#888",
    borderRadius: "50%",
    animation: "device-view-spin 0.6s linear infinite"
  } }),
  /* @__PURE__ */ jsxRuntime.jsx("style", { children: `@keyframes device-view-spin { to { transform: rotate(360deg); } }` }),
  /* @__PURE__ */ jsxRuntime.jsx("p", { style: { margin: 0, fontSize: "14px" }, children: message })
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
  const [clicks, setClicks] = react.useState([]);
  const [gestureState, setGestureState] = react.useState(emptyGestureState);
  const gestureRef = react.useRef(emptyGestureState);
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
    // 'fill' instead of 'contain': the host box is already sized to the
    // device's exact aspect ratio (DeviceSkin computes it from screenSize
    // before the stream even connects), so there's no letterboxing to do —
    // 'fill' is visually identical here but a simpler transform for the
    // browser to composite.
    objectFit: "fill",
    maxHeight: "100%",
    maxWidth: "100%",
    touchAction: "none",
    // Hint eager GPU-layer promotion instead of leaving it to Chromium's lazy
    // default heuristic — the classic translateZ(0)/backface-visibility/
    // will-change trio, applied from first render so the promotion decision
    // isn't made (and locked in) before we get a chance to influence it.
    willChange: "transform",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden"
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    (state === "BOOTING" /* BOOTING */ || state === "CONNECTING" /* CONNECTING */) && /* @__PURE__ */ jsxRuntime.jsx(ViewportSpinner, { message: connectProgressMessage || "Connecting..." }),
    state === "CONNECTED" /* CONNECTED */ && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      streamMode === "video" ? /* @__PURE__ */ jsxRuntime.jsx(
        "video",
        {
          ref: videoRef,
          style: streamStyle,
          autoPlay: true,
          playsInline: true,
          muted: true,
          disableRemotePlayback: true,
          disablePictureInPicture: true,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx(
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
      clicks.map((click) => /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsx("style", { children: `@keyframes device-view-click { from { transform: scale(1); opacity: 1; } to { transform: scale(2); opacity: 0; } }` }),
      gestureState.isGesturing && gestureState.path.length > 1 && /* @__PURE__ */ jsxRuntime.jsx("svg", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }, children: /* @__PURE__ */ jsxRuntime.jsx(
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
var DeviceInstance = react.forwardRef(({
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
  onInstallApp,
  onOpenUrl,
  showControls = true,
  streamMode = "canvas",
  videoRef
}, ref) => {
  const canvasRef = react.useRef(null);
  react.useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }));
  return /* @__PURE__ */ jsxRuntime.jsx(
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
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "relative", height: "100%", overflow: "visible" }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width: "100%", height: "100%", overflow: "visible" }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "white" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { position: "relative", height: "100%", display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(DeviceSkinComponent, { deviceSkin, screenSize, children: /* @__PURE__ */ jsxRuntime.jsx(
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
        showControls && /* @__PURE__ */ jsxRuntime.jsx(
          DeviceControls,
          {
            onRotateDevice,
            onTakeScreenshot,
            onDeviceHome,
            onDeviceBack: selectedDevice.platform === "android" ? onDeviceBack : void 0,
            onAppSwitch: selectedDevice.platform === "android" ? onAppSwitch : void 0,
            onIncreaseVolume,
            onDecreaseVolume,
            onTogglePower,
            onInstallApp,
            onOpenUrl
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

// src/skins/iosNinePatch.ts
var iosNinePatchSkin = {
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAU0CAYAAABIMabOAABfzElEQVR42u396ZNd6WHYab7nnLtvuWBfCiALxQ6pGa4hFRRNSWGSxeKitmPGE25Pj9vtVnfbsuWx3frm7zP/wqjDE2O1ZImSl3CPe6anw26zKLKKlE1TpGRyyqTkEAtVBAr7knnz7ts5Zz4gLwigcG8mEkAVkPk8ERmJTOR6blblD+92osCz7sshhCiEEG8/v/sURVEcQiiEEApxHH/x3neKoug9H+hhr9uNOI4f+v57/XgAPBl5nj/05SzLnsjHe9jrsix7LYQwCyHM8jzPQgj5A0/z1/2SR+jZ5Tf4s+G3H4i8OI7jJM/zUhzH/9m9sXVvdMVxHIrFYiiVSqFUKoVisRiKxWIoFApRsVgMSZKEYrEY4jgOhUIhxHEckiQJcRzf++fo5MmTURzHeQghiuN4YegJQIDnIwAf9vrtKMyzLIuuXLmSZ1mWp2kasiwLWZaF+Z9ns1nIsixMp9OQpmmYTqdhNpvl0+k0TKfTMJlMwmQyCdPp9L7QfPBzZ1n2v0VRNMmyLL0nDOdx+N949ATgQfKb94TePPIqcRz/hQcjq1AohEqlEmq1WqhWq6FarUaVSiVUKpVQLpfD2bNnoyRJokKhEAqFQkjTdCOO4x8mSVKMoqgQRVExiqJCnueFLMuKWZYVQghJnueFEEI8f3n+lOd5HEKI8zxPQghRnudxnufRXv51CMBT/uW9y1meKIryKIqyEEIeRVEaQsi2X07nT3Ecz7ZfP5u/HMfxNIqiWZ7nszzPp3mez9I0nWZZ9tEkSdZns1mYzWYhTdP8woUL+Xg8DqPRKIxGozAcDvPhcBgGg0EYjUZhNpu9JxCzLPuXURSNtuMwu+fpb3h0BeB+8D9uB1Ycx3EpiqK/NP+PNIqiEMdxqFQqodVqhXq9HprNZlSv18O5c+eiYrEYlUqlEELYjOP4R0mSVLMsq6VpWs+yrLr9VE7TNJ7/ay1N07v/grv3X3Xzf/nd++c8z9/z5wf/9bbsX5IAPLtB+OCgwr3P7/0d9OCf5zNE9/55PnOUJMndPxcKhZAkSRbH8TiO42Ecx8MkSfpxHA/SNB1mWfaREMLa9khhfv78+bzf74dut5v3+/3Q6XTCaDS673fQ9u+X/znLssl2DKYhhF/26ArA58E/3A6+JI7jahRFf3H7P66oUCiEVqsVVlZWwsrKStRsNsO5c+fiSqUSoihqFwqFt/M8X5nNZq00TVdms1llNptF20PvYTKZhNlsNh+KD2ma3vf8wQDc6/oPALjXvSH4QADe93x7CVIolUr3vpwXCoVhkiSdQqHQiaJoazabvZjn+epoNArnz5/Put1u2Nrayre2tkKn0wmz2Szkd4Q8z/+XLMtG4c6awzSE8Lc8IgLwWfAPwp1NGPPg+0vzf03VarVobW0trK+vR6urq+EjH/lIXCwWt0ql0p/meb4+m83WptPpynQ6LU0mkzAej8O9z+drLe4NPiNvADzTURFF9wXh/KlUKoVyuXzf82KxOCkWi1uFQmEziqKNyWTyn0yn05Uf/ehHWbvdDhsbG/nm5mYYDAb5PTNV/3OWZcPtGJyFEP6Oqy4A3y//Q7iz67YURdFfnQdfuVyODh8+HA4fPhx99KMfjRqNRlQqlTpRFF2dzWZHJ5PJ6mg0KszXSIxGozAej+8G32QyMWoHwL4Wx/HdjYvlcjmUy+UwX9++/TQrlUrtQqFwI8/zE5PJpNXr9fIf/vCH+a1bt/Jbt26F8Xh8bxD+k+0p41kI4e+5wgLwSfu/hzujfOUoiv5aFEWhUCiElZWV6MiRI+HIkSPRT//0T8flcrkTRdH16XR6fDQatYbDYTwYDO4uhB0Oh2E8Ht9dEAsA3Nn4WC6XQ7VavbsBcnsTZFapVDrFYvFanufHxuNx60/+5E+ymzdv5jdv3gxbW1v59pRxyPP8d7MsG4c7o4O/6qoKwMcKvziOK1EU/dI8+tbX16Pjx4+Hj33sY3G1Wu2Uy+Ufp2l6ejQarQ8Gg0Kv1wv9fj8MBoMwHA7DZDIxdQsAjxInURRKpVKoVquhVquFer0eGo1GqNVqs0qlspEkyaXxePyh4XDY+v73v59du3YtbGxs3BuDv70dg0JQAD6SX4vjuBnH8V8pFAphdXU1HD9+PPqZn/mZuFardUul0tXpdHqy3++v9Hq9aB59/X4/jMfj5yb4drvrd9HrAHg242nR6xY9fx6+p3K5HOr1+t0YbDQaeb1e3yoWi1cmk8mJwWDQ/Pf//t9n165dy9vt9nyD5D/LsqwbQvjv/WQIwIXiOP4HURT99TiOQ61WCydOnIh+9md/Nl5ZWemUSqXLk8nkTL/fb3U6najb7YZerxcGg8EHMqW72yNe5vE2f/385WXHviz7sygEeLZj78HXP+zPDzsWZv7yvTcE2O1RMe+3QqEQarVaaDQaodlshlarldfr9U6pVLo4mUxObW1ttb773e9mV69ezQeDwfx34G9mWWbTiAC8L/z+n3Ec/1KhUIgOHToUzpw5E3384x9ParVadzqdznq93nqn04nnW9SHw2FI0/SpfT15nr/nRPZ7j3eZvzx/u3sD78Fz/R523p94A+BhUfjg+YAPOzdw/jxJkrvP5yF477mB996B6mmONCZJEqrV6t2j1lqtVtZoNDaKxWJhMBg0v/e976UXL17Mb9++HWazWZ5l2ZezLPsVAXiww+/X4zj+a5VKJTpx4kT0qU99Kl5dXe0WCoXN4XB4qtPplNvtdmi3209lpG8ecPecqH73+fxpUQAKOACelYBcFIDzswMfPDNw/ucnHYbzkcHV1dWwuroaWq3WuFqtXp7NZmvtdrv57W9/O7t69Wo+Go3yLMt+N8uyvykAD5AkSYbb07zRmTNnop/7uZ+Lm81mL03TSafTOby5uRm32+3Q6XTCeDx+YrF370HO8z8/LAAFHgD7LRAfFoDzw6PvPUj6SUVhuVwOrVYrrK6uhrW1tazVat1KkqTU7XYb/+7f/bvs4sWL+WAwyLcHWaoC8ACE38rKSnT69OnoU5/6VLyysjIYDAah3W63NjY2wubmZuj3+489xTufvn3wUOd7A9DhzgAc5DC8NwjvPTh6fnj0fBr5MX/3h3q9HrZvzhBWV1c7tVotbG1t1b797W9nly5dyre2tg5cCB6IAIzj+H+I4/hvNJvN6MyZM9EnPvGJ3urq6qXRaHRuc3OzfuvWrbC5uRlGo9Geg2w+nTsej8N0Or37fB6A863pAMDiKJzH4PbdQkK5XL77/HGmjaMoCpVKJaytrYXDhw+HtbW1fqVSOd9ut0//4R/+YePixYt5t9vNsyz7jSzL9v2h0vs+AAuFwrBWq4UzZ87En/zkJ7tra2uXh8PhSxsbG7V5+O11mnc+yje/o8eD0Sf4AODxgvDBGJw/Pc7oYLlcvhuC6+vrg2q1+tbm5uap73znO82LFy9m2+v+9/Vo4L4NwCRJhqVSKZw+fTr67Gc/m6yvrw8Gg0F069at5o0bN8Lm5maYTCaP/HHzPL87wvfg7dye5s5gADjokiR5z23k5iOEexkZLJVKYW1tLRw9ejQcPny4W6vV8o2Njdobb7yRXrp0Kd/+3b4vQzDahz8cwziOw7Fjx6LPfvazydGjR/tpmqa3b99ev379etjY2HjkEb/59O699/EdjUbu3wsAH5D5fYUfuJfwnqaJy+VyWF9fD8eOHQuHDh3aSJIkuXHjRv2NN95Ir1+/vi/XB+6rACwUCsOVlZXw2c9+Njlx4kSvWCwO2u32ievXr8c3b94Mw+HwkT5elmV3R/qGw+HdET8jfQDw7EiS5O6I4Px+wuVy+ZGniKvVajhy5Eg4duxYtrq6enU6ndauXr3aeOONN9Ktra19NS0c7ZMHflAqlaJTp05Ff+7P/bnu+vr6jV6v99L169dLN27cCL1e75FG6maz2d3omz/ZxAEAz3jUbG8iqVard58qlUooFAq7/hhxHIdGoxGOHj0ajh07Nmk0Gm/dvn372L/5N/+mcfny5XwymeRpmtYE4AesUCgM1tbWoldffTU5ceJEP8uy7ObNm+tXrlwJ83sB7sb8nL7hcBgGg0EYDAZG+wDgOTUfFazVaqFWq4VqtfpI5wwWCoWwuroaTp48GY4cObIRx3F89erV+te+9rV0c3Mzn81mz3UERs/xAzsoFovh9OnT8ac//ene6urqZqfT+fDVq1eTGzdu7Hq6dx5+/X7/vvAz2gcAz78oiu4LwXq9/kghWK1Ww9GjR8OJEyfSVqv1TrvdXvvmN7/ZuHTpUj6dTp/b0cDnMgALhcJgZWUl+tznPpecPn26n2VZdv369fXLly+Hra2tXU33zsNvMBiEXq8XBoNBmEwmwm+f/AMBgDu/7lyCn4RgqVQKtVotNBqNUKvVdh2C2zeRCKdOnQrHjh3biOM4vnTpUv3rX/96urW19VyOBj53v+CLxeLg6NGj0ec+97nu0aNHb3a73Y9cvny5+CijfveGX7/ff+7CL47j+85FKhaL4fr162INgKfuyJEj+YN3unqefofOQ7Ber98XgrsxHw08derUtNls/ujGjRtHvv71rzdv3LiRT6fT5yoCn5to2N7oEc6ePRu/8sor/UqlMr558+aJd999N7Tb7V2t1UvTNAyHw9Dr9UKv13ump3qLxeJ8Aesb169ff8X/cgB4Xhw+fDifn57xrK6ln08NNxqN0Gg0QrVaDUmS7KZHwurqanjhhRfCkSNHro5Go/Lrr79ev3DhQrZ9buBzEYLPRQAmSTJoNBrRF7/4xeTMmTODyWQSX758uXnlypXQ6/V2fP88z8N4PA69Xi90u90wHA6fqfP76vV66Pf7RvAA2PfK5XK+1ztwPQ1xHIdqtRqazWZoNBqhXC7valq40WiEkydPhlOnTnVLpVJ28eLF2muvvZb2er3nYl3gMx8dhUJhsL6+Hr3yyivd06dPX+t2uz918eLF4o0bN3Z1J4/ZbHY3/Pr9/q53BT/F7yfMZjOxBwAhhJWVlbzT6XzgM3KFQiHU6/W7IbibaeFSqRSOHj0azpw5M202m//x0qVLx19//fXmxsbGM78u8JkOkWKxODhx4kT06quv9tbW1rq3b9/+0IULF6LNzc0dh5SzLAuj0Sh0Op0PdLo3iqKQ57ngA4BdaDQa+W5m957W7+z5tHCr1QqVSmXHw6STJAlra2vh7Nmz+aFDh368ubnZ/NrXvta4evXqM70u8JkNk2KxODhz5kz8hS98oV+pVKbXrl07dvHixdDtdncMufmoX7vdDoPB4H2f7jXKBwBPLMry93sAJ47jUKvVwurq6q5GA6MoCs1mM5w5cyYcP378+mg0Kn71q1+tX7x4MXtWI/CZjJRKpTJ49dVXk3PnzvVDCNGlS5dWL126FAaDwdL3y/M8jEajsLW1Fbrdbng/1xgkSRLSNBV9ALBPYrBcLodmsxlWVlZCpVLZcW1grVYLp0+fDqdPn26HEPLz58/Xv/a1r6Wj0eiZi8BnLliq1ergi1/8YuHcuXP98XhcvHjxYv3KlSs7xlyapqHf74d2ux36/f77uetI9AHA++99KcEkSUK9Xg+rq6uhXq/vuFO4XC6HkydPhjNnzvTL5fL0/Pnz9ddee202HA6fqQh8ZuIlSZJ+pVKJvvSlLxXOnTs36Ha7lR//+Mfl69evh+l0uvR9J5NJ6HQ6YWtrK4xGo6e+1i+O45BlmfADgA++H/KnPegTRVGoVCphZWUltFqtUCqVlr59sVgMx44dCx/60IfGzWZzdP78+dpXvvKV2Wg0ytM0rQvAe+KvWq1GX/rSlwovvvjicGtrq/LOO++Ubt68uXTX7nzKt91uh263u6tdwfslmAGA96bB0/zgpVIpNJvNsLq6uuOUcKFQCEeOHAkf/vCHJysrK6O33367+pWvfGU2HA6fiQj8wINmHn+vvvpq5yMf+ci7nU7nf/f2228Xb968uXQaN8uyMBgMwubmZuj1ek97ylf4AYAQDEmShEajEdbW1kKtVlu6SzhJknDkyJHw4osvTlut1v/vRz/60Qtf+9rXWs9CBH7gYVOv1we/+Iu/WPjwhz/8/U6n8/G33nqrcPv27aVBl6Zp6PV6YWNjIwwGg6c55Sv8AEAI3h8HURRqtVpYX18PjUZj6brAJEnCoUOHwksvvTRrtVrfe+eddz72r//1v571+/0PdE3gBxo41Wp18Of//J+fT/tW33rrreKtW7eWHtsym81Cp9MJm5ubu773r/ADACH4FDomrK2thVartfSomDiOw+HDh8NLL700XVlZGb799tvVf/Wv/tUHujEk/iDj70tf+lJy7ty5QafTqbz99tvF27dvL42/6XQa2u12uH379lOJv+25fPEHAPtLtJv7/D6q4XAYbt++Hdrt9tINq1mWhdu3b4e333672Ol0KufOnRt86UtfSqrV6uBABWCxWBy8+uqryYsvvjiPv9JOa/4mk0nY3NwMGxsbT+t8v8gdOwBgf9o+q/eJ/54fj8dhY2MjbG5uLt2MmqZpuHnzZnj77bdLnU6n8uKLLw5effXVpFgsfiAR+L4HYLFY7J89ezaan/P34x//uLzb+Nvp4u41/IJRPwA4KJ747/3ddso8An/84x+Xx+Nx8dy5c/2zZ89GxWKxv68DsFAo9E+cOBF/4QtfGGRZFl24cKF+/fr1pUe9zMt6p+HVR/7G7+zaEX4AcHBD8ImZL1PbaaZyNpuF69evhwsXLtSzLIu+8IUvDE6cOBEXCoX3NQLftwBMkqR/6NCh+Atf+EKvXC7PLl26tHr16tWlUTcej8Pm5uYTj78QQuQgZwAQgU8yBOcRuNNI4HQ6DVevXg2XLl1aLZfLsy984Qu9Q4cORUmSvG8R+L4EYJIk/WazGX3uc5/rrKys9K9du3b08uXLSwt5Ppy6tbW1dITwkR5lmzwAgIeH4BMxm83C1tZW2NjYWBqB4/E4XL58OVy7du3oyspK/3Of+1y32Wy+bxH4vgRgqVSKvvjFLxZOnjx549atW2cuXrwYBoPBjgW9tbX1xEb+kiQJNnkAAE87AqfTadja2tpxBnMwGISLFy+G27dvnzl16tSNL37xi4VSqfS+tMpTD8Bisdj/8Ic/HJ85c2bQ6XR+6sKFC1G3292xnJ/wtG+0vfsHAGBZBD6RXrh3MGvZTGa32w0XLlyItra2furMmTODD3/4w/H7sSnkqQZgoVDoHz9+PH7llVf6w+GwcPHixcLm5ubCO3ekaXr3kOcnuNtX+AEA73s7zJezdTqdhaed5HkeNjY2wsWLFwvD4bDwyiuv9I8fP/7UN4U8tQBMkqS/srISfe5zn+uWSqXJlStX6jdv3lx40HOWZXdv7/YEz/kTfwDAB9YQ89NMer3e0ga6efNmuHLlSr1UKk0+97nPdVdWVp7qesCnFoClUin6/Oc/Xzh8+PDtGzduHL9y5crCUb08z8NgMAgbGxthNBqJPwBg30TgaDQKGxsbYTAYLJwFnUwm4cqVK+HGjRvHDx8+fPvVV199qusBn0oAFgqF/unTp6OTJ0/2O53OS++++27o9/tLL8zm5ubSjSHiDwB4XiNwMBiEzc3NpQNd/X4/XLp0KXQ6nZdOnTrVP336dPS0poKfeAAmSdJfX1+PPvOZz/TSNA2XL18ubG1tLXz7yWQS2u126PV6C6tY/AEAz3ME5nkeer1eaLfbS/c5tNvtcPny5UKapuEzn/lMb319/alMBT/xAJxP/bZarc61a9dWb9y4sXDh43zTx7LFkeIPANgPEbib7knTNNy4cSNcu3ZttdVqdT7/+c8/langJxqA21O/8YkTJwZbW1sfunLlysKhznkJP8Gz/sQfAPBMR+D8jMBlM5+j0ShcuXIlbG1tnT1x4kT/9OnTT3xX8BMLwPmu309/+tPd6XSaX716Ne50Ogvffjgchna7/aQ2fYg/AOC5iMDRaBTa7XYYDocL36bT6YSrV68m0+k0fPrTn37iu4KfWAAWi8Xo1VdfLayurt66cePG6o0bNxZud55Op6HT6SzdDSP+AID9GIHz0086nc7CWdAsy8KNGzfCjRs3VldXV2+9+uqrhWKx+MSa54kEYKFQ6B89ejQ6fvx4t9vtnrt69erCkb35eX/dbvdJrPsTfwDAcxeBaZqGbre79HzA0WgUrl69Grrd7rnjx493jx49+sR2BT+RAKxUKtFnPvOZQpIk4+vXrxfb7fbCtx0Oh2Fra+tJHPYs/gCA5zYCx+Nx2NraWjoV3G63w/Xr14tJkow/85nPFCqVyhPpn8cOwEKh0D916lR87Nix3sbGxvFlu36n02nodrtP4rw/8QcAPPcROBgMQrfbXTgVPN8VvLGxcfzYsWO9U6dOPZENIY8VgEmS9FutVvQLv/AL3fF4HF2/fj3q9XoPfds8z0O/3w/dbnfhUCcAwPMmSZI9v2+WZaHb7YZ+v79wX0Sv1wvXr1+PxuNx9Au/8AvdVqv12BtCHisA4zgOL7zwQry+vn7p9u3bK7du3Vq6pbnT6Zj6BQD2lTRNoyjae56Mx+PQ6XSWHp1369atcPv27ZX19fVLL7zwQhzHjzeJu+f3no/+ffKTn+yORqOP3LhxY+EXnqZp6PV6pn4BgH0pz/PHngru9XoLl9GNRqOw3Vof+eQnP/nYo4B7DsA4jsOHPvShuNVqXb9582Z9c3Nz4dsOh8PQ7XbDbDYTfwDAfrXnVpnNZqHb7S7dELK5uRlu3rxZb7Va1z/0oQ891ijgnt5zfujzJz7xid5gMDh38+bNhVO7840fT+jAZwCAZ9bjRNloNAq9Xm/hgNl4PA43b94Mg8Hg3Cc+8Yne4xwOHe/1mzt79mzcaDSu3759u7Lo2Jf5QYf9fv9xN34Y/QMAnnlZlkWP8b6h1+st3RDSbrfD7du3K41G4/rZs2f3PAr4yO81X/v3Mz/zM93hcPjh27dvh8lk8tC3nc1modfrPe7GD/EHADxP9twu4/F46SjgZDIJt2/fDsPh8MM/8zM/s+e1gI8cgFEURS+88ELcarUub2xsVBet/Zsf+/KEbvcGALDv3Tt7uqifNjc3w8bGRrXVal1+4YUX4r1sQX7kAGw0GuFTn/pUMh6PX7p169bC0b/pdBr6/f7Cv3/aBQ0A8AHac8NMJpPQ7/cXHg49mUzCrVu3wng8fulTn/pU0mg0HvlzPFIAFgqF/vHjx+Nms9nb3Nys77T273FG/x7nUEUAgA+8APd4NuBuOqrdbofNzc16s9nsHT9+/JHvDvJIAVgsFqOf//mfTyaTSbqxsbFwbd9sNnvs0b80TY3+AQDPrcc5G3A+CrhsR/DGxkaYTCbpz//8zyfFYvGRPteuAzBJkv7Ro0ejlZWV7tbW1vrm5ubCKh0MBmE4HD7O2j/xBwDsB3tqmjzPw3A4XHgTjTzPw+bmZtja2lpfWVnpHj169JE2g+w6AOM4jl544YU4hNBtt9vRoi9oNpuFwWDwJG75BgBwYI3H4zAYDBaOAg4Gg9But6MQQnf79nC7js1dBeD20S/hox/9aHcwGJzY3NxceK7faDQy+gcA8JhtMx8FXHQzjSzLwubmZhgMBic++tGPdlutVtjtKOCuAjCKoujEiRNxs9l8Z2trq9jpdBZ+IYPBwF0/AACegNFoFAaDwcKBt06nE7a2torNZvOdEydO7PpImF0FYLFYDJ/85CeTyWRyrt1uL9yWPB6Pw3A4fJy7fhj9AwD2oz01TpZlYTgcLr3lbrvdDpPJ5NwnP/nJpFgs7urj7hiASZL019bWokaj0el2u6vLjn5ZNkwJAMCj22l5XbvdDt1ud7XRaHTW1tZ2tRlkxwCMoig6efJkVCgUrnc6nWg4HD707WazWRiNRgtHB59WGQMAPCf21DrT6TSMRqOFm0GGw2HodDpRoVC4fvLkyWg308A7BmCxWAwf//jHk/F4/EKn0wlpmi6tUwAAnqxls6xpmoZOpxPG4/ELH/vYx3Y1Dbw0AJMkGRw5ciSq1Wqdfr/fWLb5YzQa7fnoF3f9AAAOgjiO9/R+4/E4jEajpZtB+v1+o9FodA4fPhwlSTLYcwBGURSOHTsWFwqFm51OZ+EI33xocq+bP9z1AwA4CLIs2/NmkGVL7bangUOSJDePHz8e7zQLvDQAi8ViePnll+PRaHSq2+0uDLzxeOzgZwCAp2hZb2VZFrrdbhiNRqdefvnleKdp4IUBmCTJYHV1NarValuDwaDR7XaXFulj3PfX6B8AcJDsqX0mk8nSGddutxsGg0GjVqttra6uLp0GXhiAURSFo0ePRuVy+d1ut7t0+nc8Hj/O2X8AAOwgy7IwHo+XTgN3u91QLpffPXr06NLNwEsD8OWXX04mk8kLvV5v4e7fyWSy5+nfXR5WDQCwr+x1A+x4PF4465qmaej1emEymbzw8ssvJ3sKwFqtFrVarWg4HK72+w8/TzDP86VfyE7yPFeAAMCBs9cNsPOBt0WHQvf7/TAcDldbrVZUq9WiRwrA+fEvlUplazAYJIsCcDabmf4FAHifzKeBFx0K3e/3w2AwSCqVytaRI0cWrgN8aADGcRwOHz4c5Xm+0e/3F841TyaTPY/+mf4FAA6yQqGwp/db1l/T6TT0+/2Q5/nG4cOHo0XnDi4MwI9+9KPxeDw+vv1BnngAmv4FAA6y2Wy252ngRf2V53no9/thPB4f/+hHPxrvOgCTJBk0m82oVCptjUaj+mDw8B3EWZaFyWSycAgSAICnEo5hMpksXII3GAzCaDSql0qlrWaz+dBp4Idm4erqalStVn84HA6jRQE4nU7DZDJZODoIAMBye1kSl+d5mEwmC5foDQaDMBwOo2q1+sPV1dWHfoL4YV/I2tpaFEXRscFgsHCEbzqdLvzEO2k0Gh5xAODA2+uSuGUdNpvNwmAwCFEUHdtuut0F4E/91E/Fk8nk6HA4XDjC9zgB2Ov1rP8DANijZR2W53kYDodhMpkc/amf+ql4VwFYLpejZrMZxuNxa9HdP7IsC9Pp1Po/AIAPwGw2C9PpdOE6wOFwGMbjcavZbIZyuRwtDcAkSQatViskSbI1Ho+T0Wj00A+apmmYTqd7Wv/n+BcAgJ/Yy3EweZ6H6XS68E5to9EojMfjJEmSre22GywMwCiKwsrKSlQqld7aLseHftDHmf5ttVoeaQCAbXs9DmZZj43H4zAcDkOpVHprZWXlPesA3zMFvLKyEqVpeng0Gi2sytlstufp362tLUOAAACPH44LeyxN0zAajUKWZYdWVlaWTwFHURQajUaUpunaotG/nYoTAICnb6ce275l3Fqj0Vg+ApgkSTh37lw0nU6biwIwy7Iwm80Wjg4CAPD0pWkaZrPZwo0g4/E4TKfT1rlz56IkSRYHYKPRiMrlcjSZTIqLAnD+yfaiXC57tAAAHlCv1/f0fssG5cbjcZhMJsVyuRw1Go3ooQGYJMmgXq9HSZJsLrvHXJqmex79G4/H1v8BADyg3+/vqZGWddm855Ik2dxuvMF7AnB7/V9IkuSd7SHDhaXp/D8AgA/esi6bTqdhPB6HJEneaTQa9x3Fd98UcLPZvLsBZNF88uOMAAIA8OQs67Isy8JkMglpmq41m82HTwFHURRqtVo0m81WFk3/7lSaAAC8f3bqsu2dwCu1Wi1aOAL44osvRrPZrLkoAPM83/MO4Ad3nwAA8BPFYvGR32e+OXfR3dkmk0mYzWbNF1988eEjgIVCISqVSiFN0/Ki9X9pmi6cGt5JpVLxyAIALFCtVvf0flmWLRyc275dXLlUKoVCoRC9JwAbjUYoFovRdDqNFgXgsk/wtL4pAIADEoBv7OX9lg3QbR8WHRWLxajRaIT7AjBJkkGlUonyPN+YzWZPZQfwrVu3HAEDALDA9evXX9nL++20E3h7inijUqncPQomvqc6Q6lU+tPtueKHfpAsy/Y8BQwAwJO3rM9ms1mYTCahVCr96b2zsXEId3YAV6vVKIRQ354rfugHcQQMAMCzF4DL2m17ZrderVbv7gS+bwQwTdPGsileI4AAAM+WnTbpbp/g0njoCGC5XA5pmtaeRgDee+4MAAAPF8fxI7/PTn22HYC1crkc3jMCWCqVoizLqk8jAPdyrg0AwEGzl2baTQBmWVYtlUpRCCG6NwCjs2fPRlmW1ZZtAEnTdOFBgwIQAODxlEqlR36fPM+XTgNvB2Dt7Nmz958DmCRJKBQKIU3T0rL7ye0l/vb6zQAAHDR7HTTL83xhAG5v4i0VCoW7d2aLQwhh+xVRmqbRohHAZR94J4VCwSMKAPCUAnDZQN32GsAoSZJo3mRxCHdu07Y9AhiWjQDuNQBv3rxpFwgAwA6uX7++p2Za1mnzvisUCndvzRsnSTIoFoshTdPby945z/M9TwEDAPD0LOu0ed+laXq7WCyGJEkGcQh3dgAXCoU30zR1FxAAgOfMTncD2R4BfLNYLP5kF3ChUAhxHJeW7SARgAAAz18Azk9yieO4dN8awO0ALJoCBgB4/uxmCjiO4+J8k0kcRVEoFoshiqLishFAAQgA8HwGYJqmIYqi4nbz3T0HMMqyrLhsilcAAgA8fwE4j8Asy4pJktxdAxgVCoWQ57kABADYpwGY53lxew1gdPdOIHmeF5a9owAEAHg+A3D77wv33QkkSZJgChgAYH8G4D1TwHcCMIqi+QhgIgABAPZnAOZ5niRJ8pNNIFEUhRBCYgoYAGD/BeD23yXbzXf3HMAoz/OCEUAAgP0XgNsjgIVCofCTO4HE8Z2lgAIPAGB/BmIIIdluvp8EYJ7npoABAJ7TwNtFx90fgC+88EK0bBOI+AMAeH4jcL4J5IUXXvjJFPA2U8AAAPs0DkMIyfzlu7uA8zyPFwWgEUAAgGc/8nZoufi+XcDbL8QuHQDAvvXeADQCCADw/NrTCOCyAAQA4LmPw/cGYDR/zZMXuewAAB9sO0V3/CQAt8tw6RQwAADPtp2mgOcvx4/7AQEAeHbj72HiOI7nawBdOQCAfRyIURSFOI7vHwEUgQAA+zP+7uXsPwCAAybe3gH8yOUIAMCzYzetNu++WOABABysQIy3X+GsPgCA/R+B7v8LAHAQCUAAgIMcgNYBAgDsP46BAQA44HZ9DAwAAPskAF0CAIADFoB5nlv7BwBwkALQJQAAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCAAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCAAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgCw/wLw5ZdfTiaTSdulAAA4IAHYarU6s9ms61IAABwMhVKpdKhYLB5yKQAADob4Bz/4Qbh165YrAQBwUAKwUqmEJElcCQCAgxKASZKEKIpcCQCAgxKALgEAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAHOgBPnDhxq1qtvu1SAAAcDIVer7dSLBYjlwIA4GCI33zzzaxcLq+6FAAAByQAXQIAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAYMcAfPnll+PJZNJ2KQAADkgANpvNznQ67boUAAAHQ6FcLh8qlUqHXAoAgIMh/sEPfhBu3brlSgAAHJQALJfLIUkSVwIA4KAEYKFQCFEUuRIAAAclAF0CAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEABCAAAPvWeDxuv/zyy0nBpQAAOBiiKBocP348FoAAAAcnAF+YzWamgAEADopbt26FH/7whwIQAOCgSJIklEolAQgAcFBEURQKhYIABAA4aAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCADAkw7AEydO3KpWq2+7FAAAB0Oh1+utFIvFyKUAADgY4jfffDMrl8urLgUAwAEJQJcAAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAMDTD8CXX345nkwmbZcCAOCABGCz2exMp9OuSwEAcDAUyuXyoVKpdMilAAA4GOIf/OAH4datW64EAMBBCcByuRySJHElAAAOSgAWCoUQRZErAQBwUALQJQAAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCAAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCAAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAAEAEAAAgCw7xRcAgCAg6Farb594sSJVnzixIlb1Wr1bZcEAGB/KxaLK71eb6XQ6/VWisVi5JIAAOxv5XJ59c0335zFb775ZlYul1ddEgCAg8EmEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIA8FC5AAQAOGAEIACAAAQAQAACALCvAjB3GQAADlYAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAEAAAgAgAAEAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAgAB0CQAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAlwAAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQg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",
  imageWidth: 640,
  imageHeight: 1332,
  slice: 130,
  bezel: { top: 23, right: 24, bottom: 24, left: 24 },
  screenCornerRadius: 81,
  buttons: [
    { side: "left", top: 234, height: 49, depth: 6 },
    { side: "left", top: 323, height: 93, depth: 6 },
    { side: "left", top: 439, height: 93, depth: 6 },
    { side: "right", top: 384, height: 147, depth: 5 }
  ]
};

// src/skins/androidNinePatch.ts
var androidNinePatchSkin = {
  image: "data:image/png;base64,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KKlWyQ4/INnll+d5XO5Lp4E20hoTFREREXVEWlSSyQfGGFhrrzjvWAN7ByF77+NMBSltpSmNiIiIqCthSlqfZImvrmtkWQbn3BWb93TadCVXkGVZ4/gZDvgkIiKiLpJWKAlW0iollSq5jJaZU3HS53IboDSqcxYVERERdVUaomToubRIST+Vcw42hNAIU7ImKGUsBioiIiLqqnTwufROySHJEriUUrCy3CefkM5aqKqKwz2JiIios9IB6DKnU6ST0q1cOE1aae9UuiWQiIiIqEvSlTqZgpBl2RWzOrU0mg8Gg3jhsizjgM9V4xOIiIiIbmXpOcfp72mfuUxFAJZjE4wx8TyaLMviGiEALvkRERFR56ST0qVnKs1EckiyVLB0Oi6hMUJ92aDemJRORERE1AFpZSqd02mMibM7JT8ByyW/tG9KElhd13EqKBEREVGXtDfr5XkOa23MSLLrL05KAND4R7mSXq/XGJ9ARERE1MVgJUM8ZbefFKFkNQ9YVqi01vEsPylpSbUqrVCxWkVERERdkJ4OU9c1qqpqHEGTFqEALOZQOedQVRWyLItlLe99LG2tunIiIiKiW1naV15VVVzBk6No0tFS2hgTS1hlWcbQJBPTpfkqvWIiIiKiW1163rG0QpVlGUdKpc3psYdKDkVWSsWGdGlQDyEAzFJERETU4WAlVar0yL44NkH6pNKtgWnyinMYApf8iIiIqBtkVU52+snHZOVOeqnisqCUq6qqis3o7eNnuNRHREREXdJugfLex1196QwquZxOp3xK6pIKVfucGiIiIqIuSE+MkeAkVal0aroEKiuflCawxtk0yaGARERERF0j5xtLyMqyLG7cixUqqUg551CWZUxe6fIfERERURdJkErP9ZPG9KIo9prSZYCntbYxBTTP83hl7KEiIiKiLkkLStI3Jbv66rpGlmUYDAYxdDWOnmkf9CfLgPFKmauIiIioA9IeKqlCVVUVK1ayoif95lY+UQ74y/MceZ5jNpvFK9qLa7yDiYiI6NYnkw6AvWU+a208dibdBQgsJ6XLtPRerxeHVcmpylzuIyIioq5Jj50RcvaxZKW6rvea0r33cUtgOiE9yzLIvxERERF1jWzO01rHJnT5ezpmClg2pUtokomfVVVhNptxhx8RERF1NkylS37pUE8JWuk0dS2hKR1c1ev14iel6Qtc/iMi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",
  imageWidth: 596,
  imageHeight: 1265,
  slice: 100,
  bezel: { top: 29, right: 28, bottom: 24, left: 27 },
  screenCornerRadius: 44,
  buttons: [
    { side: "right", top: 344, height: 99, depth: 3 },
    { side: "right", top: 500, height: 181, depth: 3 }
  ]
};

// src/DeviceSkins.ts
var NoDeviceSkin = Object.freeze({
  frameImage: "",
  frameWidth: 0,
  frameHeight: 0,
  display: Object.freeze({ x: 0, y: 0, width: 0, height: 0, cornerRadius: 0 })
});
function normalizeModel(model) {
  return (model ?? "").toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}
var SKINS = [
  {
    // "Pixel 9" but not the Pro / Pro XL / Pro Fold / 9a variants.
    matches: (d) => {
      if (d.platform !== "android" /* ANDROID */) return false;
      const m = normalizeModel(d.model);
      return /(^|\s)pixel 9(\s|$)/.test(m) && !m.includes("pixel 9 pro");
    },
    skin: pixel9Skin
  },
  {
    // Every other Android device: stretchable 9-patch frame (Pixel-9-derived).
    matches: (d) => d.platform === "android" /* ANDROID */,
    skin: { ...NoDeviceSkin, ninePatch: androidNinePatchSkin }
  },
  {
    // Every iOS device: the 9-patch frame stretches to any screen aspect ratio.
    matches: (d) => d.platform === "ios" /* IOS */,
    skin: { ...NoDeviceSkin, ninePatch: iosNinePatchSkin }
  }
];
function getDeviceSkinForDevice(device) {
  return SKINS.find((entry) => entry.matches(device))?.skin ?? NoDeviceSkin;
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
function formatJsonRpcError(error) {
  const message = error.message || "JSON-RPC error";
  if (error.data === void 0 || error.data === null || error.data === "") {
    return message;
  }
  const detail = typeof error.data === "string" ? error.data : JSON.stringify(error.data);
  return `${message}: ${detail}`;
}
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
          pending.reject(new Error(formatJsonRpcError(response.error)));
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
function isSessionClosedError(message) {
  return /existed but closed|already-closed session/i.test(message);
}
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
      console.log("device-view: WebRTC offer created, sending to server");
      const answerSdp = await this.sendOfferToWebrtcServerWithRetry(this.session.webrtcServerUrl, this.session.sessionId);
      console.log("device-view: received WebRTC answer from server");
      this.offerSent = true;
      await this.setRemoteAnswerFromSdp(answerSdp);
      this.flushPendingIceCandidates();
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
        if (isSessionClosedError(lastError.message)) {
          console.error(`device-view: WebRTC session closed, not retrying: ${lastError.message}`);
          throw lastError;
        }
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
  // Fire-and-forget: candidates are independent of each other, so they go out
  // in parallel and never gate the caller's progress.
  flushPendingIceCandidates() {
    const pending = this.pendingIceCandidates;
    this.pendingIceCandidates = [];
    for (const candidate of pending) {
      this.sendIceCandidate(candidate).catch((error) => {
        console.error("device-view: error sending queued ICE candidate:", error);
      });
    }
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
function useDeviceInteraction({ deviceClient, selectedDevice }) {
  const pendingKeys = react.useRef("");
  const isFlushingKeys = react.useRef(false);
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
var Spinner = ({ message }) => /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "#202224",
  color: "#888"
}, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
    width: "24px",
    height: "24px",
    margin: "0 auto 12px",
    border: "2px solid #333",
    borderTopColor: "#888",
    borderRadius: "50%",
    animation: "device-view-spin 0.6s linear infinite"
  } }),
  /* @__PURE__ */ jsxRuntime.jsx("style", { children: `@keyframes device-view-spin { to { transform: rotate(360deg); } }` }),
  /* @__PURE__ */ jsxRuntime.jsx("p", { style: { margin: 0, fontSize: "14px" }, children: message || "Loading..." })
] }) });
var DeviceView = react.forwardRef(({
  serverUrl,
  token,
  deviceId,
  showControls = true,
  onError,
  onConnected,
  onFirstFrame,
  onDisconnected,
  onInstallApp,
  onOpenUrl
}, ref) => {
  const [deviceState, setDeviceState] = react.useState("UNKNOWN" /* UNKNOWN */);
  const [connectProgressMessage, setConnectProgressMessage] = react.useState(null);
  const [imageBitmap, setImageBitmap] = react.useState(null);
  const [streamMode, setStreamMode] = react.useState("canvas");
  const [webrtcMediaStream, setWebrtcMediaStream] = react.useState(null);
  const [deviceSkin, setDeviceSkin] = react.useState(NoDeviceSkin);
  const [selectedDevice, setSelectedDevice] = react.useState(null);
  const screenSizeRef = react.useRef({ width: 0, height: 0, scale: 1 });
  const mjpegStreamRef = react.useRef(null);
  const avcStreamRef = react.useRef(null);
  const webrtcStreamRef = react.useRef(null);
  const streamReaderRef = react.useRef(null);
  const streamControllerRef = react.useRef(null);
  const deviceStreamRef = react.useRef(null);
  const videoRef = react.useRef(null);
  const imageBitmapRef = react.useRef(null);
  const streamingDeviceIdRef = react.useRef(null);
  const streamGenerationRef = react.useRef(0);
  const jsonRpcClientRef = react.useRef(null);
  const firstFrameSeenRef = react.useRef(false);
  const markFirstFrame = () => {
    if (firstFrameSeenRef.current) return;
    firstFrameSeenRef.current = true;
    onFirstFrame?.();
  };
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
  react.useImperativeHandle(ref, () => ({
    takeScreenshot: onTakeScreenshot,
    home: onHome,
    volumeUp: onIncreaseVolume,
    volumeDown: onDecreaseVolume
  }), [onTakeScreenshot, onHome, onIncreaseVolume, onDecreaseVolume]);
  react.useEffect(() => {
    if (!webrtcMediaStream || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = webrtcMediaStream;
    video.muted = true;
    if (typeof video.requestVideoFrameCallback === "function") {
      video.requestVideoFrameCallback(() => markFirstFrame());
    } else {
      video.addEventListener("playing", () => markFirstFrame(), { once: true });
    }
    video.play().catch((error) => {
      console.error("device-view: error playing WebRTC stream:", error);
    });
  }, [webrtcMediaStream]);
  react.useEffect(() => {
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
      markFirstFrame();
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
      markFirstFrame();
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
      firstFrameSeenRef.current = false;
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
  react.useEffect(() => {
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
  react.useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);
  if (!selectedDevice) {
    return /* @__PURE__ */ jsxRuntime.jsx(Spinner, { message: "Loading device..." });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
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
      onInstallApp,
      onOpenUrl,
      showControls
    }
  );
});
DeviceView.displayName = "DeviceView";

exports.AvcStream = AvcStream;
exports.ConnectionError = ConnectionError;
exports.DeviceClient = DeviceClient;
exports.DeviceControls = DeviceControls;
exports.DeviceInstance = DeviceInstance;
exports.DevicePlatform = DevicePlatform;
exports.DeviceState = DeviceState;
exports.DeviceType = DeviceType;
exports.DeviceView = DeviceView;
exports.DeviceViewport = DeviceViewport;
exports.JsonRpcClient = JsonRpcClient;
exports.MjpegStream = MjpegStream;
exports.NinePatchSkinView = NinePatchSkinView;
exports.NoDeviceSkin = NoDeviceSkin;
exports.WebRtcStream = WebRtcStream;
exports.androidNinePatchSkin = androidNinePatchSkin;
exports.createNoOpDeviceClient = createNoOpDeviceClient;
exports.getDeviceSkinForDevice = getDeviceSkinForDevice;
exports.iosNinePatchSkin = iosNinePatchSkin;
exports.mapButtonTop = mapButtonTop;
exports.nativeFrameSize = nativeFrameSize;
exports.nativeScreenSlot = nativeScreenSlot;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
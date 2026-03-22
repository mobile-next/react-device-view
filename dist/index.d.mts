import React, { Ref } from 'react';

declare enum DevicePlatform {
    IOS = "ios",
    ANDROID = "android"
}
declare enum DeviceType {
    REAL = "real",
    EMULATOR = "emulator",
    SIMULATOR = "simulator"
}
interface DeviceDescriptor {
    id: string;
    name: string;
    platform: DevicePlatform;
    type: DeviceType;
    version?: string;
    state?: "online" | "offline";
}
interface ScreenSize {
    width: number;
    height: number;
    scale: number;
}
interface DeviceInfo {
    id: string;
    name: string;
    platform: string;
    type: string;
    screenSize: ScreenSize;
}
interface DeviceInfoResponse {
    device: DeviceInfo;
}
interface ScreenshotResponse {
    data: string;
}
interface ScreencaptureResponse {
    format: string;
    streamUrl?: string;
    sessionUrl?: string;
    sessionId?: string;
    webrtcServerUrl?: string;
    iceServers?: Array<{
        urls: string[] | string;
    }>;
}
type ButtonType = 'HOME' | 'BACK' | 'APP_SWITCH' | 'POWER' | 'VOLUME_UP' | 'VOLUME_DOWN';
type ScreenCaptureFormat = 'mjpeg' | 'avc';
declare class ConnectionError extends Error {
    readonly isConnectionError = true;
    constructor(message: string);
}
interface DeviceViewProps {
    serverUrl: string;
    token: string;
    deviceId: string;
    skinsUrl?: string;
    onError?: (error: Error) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
}
interface GesturePoint {
    x: number;
    y: number;
    duration: number;
}
type StreamRenderMode = 'canvas' | 'video';

declare const DeviceView: React.FC<DeviceViewProps>;

interface WebRtcSessionInfo {
    sessionId: string;
    webrtcServerUrl: string;
    iceServers?: Array<{
        urls: string[] | string;
    }>;
}
interface WebRtcStreamOptions {
    onTrack: (stream: MediaStream) => void;
    onError?: (error: Error) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
}
declare class WebRtcStream {
    private session;
    private options;
    private pc;
    private pendingIceCandidates;
    private offerSent;
    private isActive;
    private currentStream;
    private rpcIdCounter;
    constructor(session: WebRtcSessionInfo, options: WebRtcStreamOptions);
    start(): Promise<void>;
    stop(): void;
    private createPeerConnection;
    private setupH264Transceiver;
    private createAndSetOffer;
    private waitForIceGathering;
    private sendOfferToWebrtcServerWithRetry;
    private sendOfferToWebrtcServer;
    private setRemoteAnswerFromSdp;
    private buildIceServers;
    private sendIceCandidate;
    private flushPendingIceCandidates;
    private sleep;
}

interface AvcFrameCallback {
    (frame: VideoFrame): void;
}
interface AvcErrorCallback {
    (error: Error): void;
}
interface AvcStreamOptions {
    onFrame: AvcFrameCallback;
    onError?: AvcErrorCallback;
    width?: number;
    height?: number;
}
declare class AvcStream {
    private reader;
    private options;
    private isActive;
    private decoder;
    private buffer;
    private sps;
    private pps;
    private isConfigured;
    private frameCount;
    constructor(reader: ReadableStreamDefaultReader<Uint8Array>, options: AvcStreamOptions);
    private initializeDecoder;
    start(): void;
    stop(): void;
    private parseNalUnit;
    private configureDecoder;
    private buildAvcCBox;
    private decodeFrame;
    private processAvcStream;
}

interface MjpegFrameCallback {
    (mimeType: string, body: Uint8Array): void;
}
interface MjpegErrorCallback {
    (error: Error): void;
}
interface MjpegStreamOptions {
    onFrame: MjpegFrameCallback;
    onError?: MjpegErrorCallback;
}
declare class MjpegStream {
    private reader;
    private options;
    private isActive;
    constructor(reader: ReadableStreamDefaultReader<Uint8Array>, options: MjpegStreamOptions);
    start(): void;
    stop(): void;
    private processMjpegStream;
}

interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string, error?: Error): void;
}
declare class JsonRpcClient {
    readonly url: string;
    private authToken?;
    private idCounter;
    private ws;
    private wsState;
    private pendingRequests;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private messageQueue;
    private connectionListeners;
    private logger;
    private sessionToken?;
    constructor(url: string, logger?: Logger, authToken?: string | undefined);
    private exchangeTokenForSession;
    private getWebSocketUrl;
    private connectWebSocket;
    private waitForConnection;
    private addConnectionListener;
    private removeConnectionListener;
    private notifyConnectionListeners;
    private attachWebSocketHandlers;
    private handleWebSocketOpen;
    private handleWebSocketMessage;
    private handleWebSocketError;
    private handleWebSocketClose;
    private attemptReconnect;
    private failAllPendingRequests;
    private flushMessageQueue;
    private sendViaWebSocket;
    sendJsonRpcRequest: <T>(method: string, params: any, timeoutMs?: number) => Promise<T>;
    get isDisconnected(): boolean;
    disconnect(): void;
}

interface DeviceClientApi {
    getDeviceInfo(): Promise<DeviceInfoResponse>;
    boot(): Promise<void>;
    reboot(): Promise<void>;
    shutdown(): Promise<void>;
    tap(x: number, y: number): Promise<void>;
    gesture(actions: Array<{
        type: string;
        duration?: number;
        x?: number;
        y?: number;
        button?: number;
    }>): Promise<void>;
    inputText(text: string, timeoutMs?: number): Promise<void>;
    pressButton(button: ButtonType): Promise<void>;
    takeScreenshot(): Promise<ScreenshotResponse>;
    screenCaptureStart(format: ScreenCaptureFormat, scale?: number): Promise<ScreencaptureResponse>;
}
declare class DeviceClient implements DeviceClientApi {
    private readonly jsonRpcClient;
    private readonly deviceId;
    constructor(jsonRpcClient: JsonRpcClient, deviceId: string);
    private request;
    getDeviceInfo(): Promise<DeviceInfoResponse>;
    boot(): Promise<void>;
    reboot(): Promise<void>;
    shutdown(): Promise<void>;
    tap(x: number, y: number): Promise<void>;
    gesture(actions: Array<{
        type: string;
        duration?: number;
        x?: number;
        y?: number;
        button?: number;
    }>): Promise<void>;
    inputText(text: string, timeoutMs?: number): Promise<void>;
    pressButton(button: ButtonType): Promise<void>;
    takeScreenshot(): Promise<ScreenshotResponse>;
    screenCaptureStart(format: ScreenCaptureFormat, scale?: number): Promise<ScreencaptureResponse>;
}
declare function createNoOpDeviceClient(): DeviceClientApi;

interface DeviceSkinInsets {
    top: number;
    left: number;
    right: number;
    bottom: number;
}
interface DeviceSkin {
    imageFilename: string;
    insets: DeviceSkinInsets;
    borderRadius: number;
}
declare const NoDeviceSkin: DeviceSkin;
declare function getDeviceSkinForDevice(device: DeviceDescriptor): DeviceSkin;

declare enum DeviceState {
    UNKNOWN = "UNKNOWN",
    BOOTING = "BOOTING",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED"
}
declare const DeviceViewport: React.FC<{
    screenSize: ScreenSize;
    onTap: (x: number, y: number) => void;
    onGesture: (points: Array<GesturePoint>) => void;
    connectProgressMessage?: string;
    streamMode?: StreamRenderMode;
    videoRef?: Ref<HTMLVideoElement | null>;
    canvasRef: Ref<HTMLCanvasElement>;
    deviceSkin: DeviceSkin;
    skinRatio: number;
    state: DeviceState;
}>;

interface DeviceStreamHandle {
    getCanvas: () => HTMLCanvasElement | null;
}
interface DeviceStreamProps {
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
declare const DeviceInstance: React.ForwardRefExoticComponent<DeviceStreamProps & React.RefAttributes<DeviceStreamHandle>>;

interface DeviceControlsProps {
    onRotateDevice?: () => void;
    onTakeScreenshot?: () => void;
    onDeviceHome?: () => void;
    onDeviceBack?: () => void;
    onAppSwitch?: () => void;
    onIncreaseVolume?: () => void;
    onDecreaseVolume?: () => void;
    onTogglePower?: () => void;
}
declare const DeviceControls: React.FC<DeviceControlsProps>;

export { AvcStream, type ButtonType, ConnectionError, DeviceClient, type DeviceClientApi, DeviceControls, type DeviceDescriptor, type DeviceInfo, type DeviceInfoResponse, DeviceInstance, DevicePlatform, type DeviceSkin, DeviceState, type DeviceStreamHandle, type DeviceStreamProps, DeviceType, DeviceView, type DeviceViewProps, DeviceViewport, type GesturePoint, JsonRpcClient, MjpegStream, NoDeviceSkin, type ScreenCaptureFormat, type ScreenSize, type ScreencaptureResponse, type ScreenshotResponse, type StreamRenderMode, type WebRtcSessionInfo, WebRtcStream, type WebRtcStreamOptions, createNoOpDeviceClient, getDeviceSkinForDevice };

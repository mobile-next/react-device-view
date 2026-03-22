export interface WebRtcSessionInfo {
	sessionId: string;
	webrtcServerUrl: string;
	iceServers?: Array<{ urls: string[] | string }>;
}

export interface WebRtcStreamOptions {
	onTrack: (stream: MediaStream) => void;
	onError?: (error: Error) => void;
	onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
	onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
}

export class WebRtcStream {
	private pc: RTCPeerConnection | null = null;
	private pendingIceCandidates: RTCIceCandidate[] = [];
	private offerSent: boolean = false;
	private isActive: boolean = false;
	private currentStream: MediaStream | null = null;
	private rpcIdCounter: number = 1;

	constructor(
		private session: WebRtcSessionInfo,
		private options: WebRtcStreamOptions
	) {}

	public async start(): Promise<void> {
		try {
			console.log('device-view: starting WebRTC stream, sessionId:', this.session.sessionId);
			this.isActive = true;
			this.createPeerConnection();
			this.setupH264Transceiver();
			await this.createAndSetOffer();
			console.log('device-view: WebRTC offer created, waiting for ICE gathering');
			await this.waitForIceGathering();
			console.log('device-view: ICE gathering complete, sending offer to server');

			const answerSdp = await this.sendOfferToWebrtcServerWithRetry(this.session.webrtcServerUrl, this.session.sessionId);
			console.log('device-view: received WebRTC answer from server');
			this.offerSent = true;
			await this.flushPendingIceCandidates();
			await this.setRemoteAnswerFromSdp(answerSdp);
			console.log('device-view: WebRTC remote description set, waiting for connection');
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			console.error('device-view: error starting WebRTC stream:', err);
			this.options.onError?.(err);
			throw err;
		}
	}

	public stop(): void {
		console.log('device-view: stopping WebRTC stream');
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

	private createPeerConnection(): void {
		if (this.pc) {
			this.pc.close();
		}

		const iceServers = this.buildIceServers(this.session.iceServers);
		console.log('device-view: creating peer connection with ICE servers:', JSON.stringify(iceServers));
		this.pc = new RTCPeerConnection({ iceServers });
		this.pc.ontrack = (event) => {
			const stream = event.streams[0];
			if (stream) {
				console.log('device-view: WebRTC got media stream, tracks:', stream.getTracks().length);
				this.currentStream = stream;
				this.options.onTrack(stream);
			}
		};

		this.pc.onicecandidate = (event) => {
			if (!event.candidate) return;

			this.sendIceCandidate(event.candidate).catch((error) => {
				const err = error instanceof Error ? error : new Error(String(error));
				console.error('device-view: error sending ICE candidate:', err);
				this.options.onError?.(err);
			});
		};

		this.pc.onconnectionstatechange = () => {
			if (!this.pc) return;
			console.log('device-view: WebRTC connection state:', this.pc.connectionState);
			this.options.onConnectionStateChange?.(this.pc.connectionState);
		};

		this.pc.oniceconnectionstatechange = () => {
			if (!this.pc) return;
			console.log('device-view: WebRTC ICE connection state:', this.pc.iceConnectionState);
			this.options.onIceConnectionStateChange?.(this.pc.iceConnectionState);
		};
	}

	private setupH264Transceiver(): void {
		if (!this.pc) return;

		const transceiver = this.pc.addTransceiver('video', { direction: 'recvonly' });
		const codecs = RTCRtpReceiver.getCapabilities('video')?.codecs || [];
		const h264 = codecs.filter((codec) => codec.mimeType === 'video/H264');
		if (h264.length > 0) {
			transceiver.setCodecPreferences(h264);
		}
	}

	private async createAndSetOffer(): Promise<void> {
		if (!this.pc) {
			return;
		}

		const offer = await this.pc.createOffer();
		await this.pc.setLocalDescription(offer);
	}

	private async waitForIceGathering(): Promise<void> {
		if (!this.pc) {
			return;
		}

		const pc = this.pc;

		if (pc.iceGatheringState === 'complete') {
			return;
		}

		await new Promise<void>((resolve) => {
			const checkState = () => {
				if (pc.iceGatheringState === 'complete') {
					pc.removeEventListener('icegatheringstatechange', checkState);
					resolve();
				}
			};

			pc.addEventListener('icegatheringstatechange', checkState);
		});
	}

	private async sendOfferToWebrtcServerWithRetry(url: string, sessionId: string, maxRetries: number = 30, retryIntervalMs: number = 1000): Promise<string> {
		let lastError: Error | null = null;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			if (!this.isActive) {
				throw new Error('WebRTC stream stopped');
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
		throw lastError || new Error('Failed to connect to WebRTC server after maximum retries');
	}

	private async sendOfferToWebrtcServer(url: string, sessionId: string): Promise<string> {
		if (!this.pc || !this.pc.localDescription) {
			throw new Error('Missing local description for WebRTC offer');
		}

		const resp = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'webrtc.offer',
				params: {
					sessionId,
					role: 'viewer',
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
			throw new Error('Missing SDP answer in WebRTC response');
		}
		return sdp;
	}

	private async setRemoteAnswerFromSdp(answerSdp: string): Promise<void> {
		if (!this.pc) return;

		await this.pc.setRemoteDescription({
			type: 'answer',
			sdp: answerSdp
		});
	}

	private buildIceServers(servers?: Array<{ urls: string[] | string }>): RTCIceServer[] {
		if (!Array.isArray(servers)) {
			return [];
		}
		return servers
			.map((server) => ({ urls: server.urls }))
			.filter((server) => server.urls && server.urls.length > 0);
	}

	private async sendIceCandidate(candidate: RTCIceCandidate): Promise<void> {
		if (!this.isActive) return;

		if (!this.offerSent) {
			this.pendingIceCandidates.push(candidate);
			return;
		}

		await fetch(this.session.webrtcServerUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'webrtc.ice',
				params: {
					sessionId: this.session.sessionId,
					role: 'viewer',
					candidate
				},
				id: this.rpcIdCounter++
			})
		});
	}

	private async flushPendingIceCandidates(): Promise<void> {
		while (this.pendingIceCandidates.length > 0) {
			const candidate = this.pendingIceCandidates.shift();
			if (candidate) {
				await this.sendIceCandidate(candidate);
			}
		}
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

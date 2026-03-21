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

	constructor(
		private session: WebRtcSessionInfo,
		private options: WebRtcStreamOptions
	) {}

	public async start(): Promise<void> {
		try {
			console.log('webrtc: starting stream, sessionId:', this.session.sessionId, 'serverUrl:', this.session.webrtcServerUrl);
			this.isActive = true;
			this.createPeerConnection();
			this.setupH264Transceiver();
			await this.createAndSetOffer();
			console.log('webrtc: offer created, waiting for ICE gathering');
			await this.waitForIceGathering();
			console.log('webrtc: ICE gathering complete, sending offer to server with retry logic');

			const answerSdp = await this.sendOfferToWebrtcServerWithRetry(this.session.webrtcServerUrl, this.session.sessionId);
			console.log('webrtc: received answer from server');
			this.offerSent = true;
			await this.flushPendingIceCandidates();
			console.log('webrtc: flushed pending ICE candidates');
			await this.setRemoteAnswerFromSdp(answerSdp);
			console.log('webrtc: set remote description, waiting for connection');
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			console.error('webrtc: error starting stream:', err);
			this.options.onError?.(err);
			throw err;
		}
	}

	public stop(): void {
		console.log('webrtc: stopping stream');
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
		console.log('webrtc: creating peer connection with ICE servers:', iceServers);
		this.pc = new RTCPeerConnection({ iceServers });
		this.pc.ontrack = (event) => {
			console.log('webrtc: received track, streams:', event.streams.length);
			const stream = event.streams[0];
			if (stream) {
				console.log('webrtc: got media stream, tracks:', stream.getTracks().length);
				this.currentStream = stream;
				this.options.onTrack(stream);
			}
		};

		this.pc.onicecandidate = (event) => {
			if (!event.candidate) {
				console.log('webrtc: ICE candidate gathering finished (null candidate)');
				return;
			}

			console.log('webrtc: new ICE candidate:', event.candidate.candidate);
			this.sendIceCandidate(event.candidate).catch((error) => {
				const err = error instanceof Error ? error : new Error(String(error));
				console.error('webrtc: error sending ICE candidate:', err);
				this.options.onError?.(err);
			});
		};

		this.pc.onconnectionstatechange = () => {
			if (!this.pc) {
				return;
			}

			console.log('webrtc: connection state changed to:', this.pc.connectionState);
			this.options.onConnectionStateChange?.(this.pc.connectionState);
		};

		this.pc.oniceconnectionstatechange = () => {
			if (!this.pc) {
				return;
			}

			console.log('webrtc: ICE connection state changed to:', this.pc.iceConnectionState);
			this.options.onIceConnectionStateChange?.(this.pc.iceConnectionState);
		};
	}

	private setupH264Transceiver(): void {
		if (!this.pc) {
			return;
		}

		console.log('webrtc: setting up H264 transceiver');
		const transceiver = this.pc.addTransceiver('video', { direction: 'recvonly' });
		const codecs = RTCRtpReceiver.getCapabilities('video')?.codecs || [];
		const h264 = codecs.filter((codec) => codec.mimeType === 'video/H264');
		console.log('webrtc: found', h264.length, 'H264 codecs');
		if (h264.length > 0) {
			transceiver.setCodecPreferences(h264);
			console.log('webrtc: set codec preferences to H264');
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
		const startTime = Date.now();

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			if (!this.isActive) {
				console.log('webrtc: stream stopped, aborting retry loop');
				throw new Error('WebRTC stream stopped');
			}

			try {
				if (attempt > 1) {
					console.log(`webrtc: retry attempt ${attempt}/${maxRetries} (elapsed: ${Date.now() - startTime}ms)`);
				} else {
					console.log('webrtc: attempting to send offer to server immediately');
				}

				const sdp = await this.sendOfferToWebrtcServer(url, sessionId);
				console.log(`webrtc: successfully connected on attempt ${attempt}`);
				return sdp;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				if (attempt < maxRetries) {
					console.log(`webrtc: attempt ${attempt} failed: ${lastError.message}, retrying in ${retryIntervalMs}ms`);
					await this.sleep(retryIntervalMs);
				}
			}
		}

		console.error(`webrtc: all ${maxRetries} attempts failed after ${Date.now() - startTime}ms`);
		throw lastError || new Error('Failed to connect to WebRTC server after maximum retries');
	}

	private async sendOfferToWebrtcServer(url: string, sessionId: string): Promise<string> {
		if (!this.pc || !this.pc.localDescription) {
			throw new Error('Missing local description for WebRTC offer');
		}

		console.log('webrtc: sending offer to server:', url);
		console.log('webrtc: offer SDP:', this.pc.localDescription.sdp.substring(0, 200) + '...');

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
				id: 1
			})
		});

		const data = await resp.json();
		console.log('webrtc: received response from server:', data);
		if (data?.error) {
			throw new Error(`JSON-RPC error: ${data.error.message} - ${data.error.data}`);
		}

		const sdp = data?.result?.sdp;
		if (!sdp) {
			throw new Error('Missing SDP answer in WebRTC response');
		}
		console.log('webrtc: answer SDP:', sdp.substring(0, 200) + '...');
		return sdp;
	}

	private async setRemoteAnswerFromSdp(answerSdp: string): Promise<void> {
		if (!this.pc) {
			return;
		}

		console.log('webrtc: setting remote description (answer)');
		await this.pc.setRemoteDescription({
			type: 'answer',
			sdp: answerSdp
		});
		console.log('webrtc: remote description set successfully');
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
		if (!this.isActive) {
			console.log('webrtc: skipping ICE candidate send (not active)');
			return;
		}

		if (!this.offerSent) {
			console.log('webrtc: queueing ICE candidate (offer not sent yet)');
			this.pendingIceCandidates.push(candidate);
			return;
		}

		console.log('webrtc: sending ICE candidate to server');
		const resp = await fetch(this.session.webrtcServerUrl, {
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
				id: 1
			})
		});

		const data = await resp.json();
		console.log('webrtc: ICE candidate response:', data);
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

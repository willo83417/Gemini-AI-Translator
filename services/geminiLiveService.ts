/**
 * Gemini 3.5 Live Translate (gemini-3.5-live-translate-preview) Service
 * Direct pure client-side WebSocket implementation of Google GenAI Live API.
 * This handles real-time microphone stream capture, downsampling to 16kHz PCM,
 * streaming chunks to Gemini over secure WebSocket, parsing the text translation,
 * and queuing/playing back the translated 24kHz PCM audio response in real-time.
 */

export interface GeminiLiveServiceCallbacks {
    onOpen?: () => void;
    onClose?: (reason: string) => void;
    onError?: (error: string) => void;
    onText?: (text: string) => void;
    onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'listening') => void;
    onSpeakingChange?: (isSpeaking: boolean) => void;
    onInputTranscription?: (text: string) => void;
    onOutputTranscription?: (text: string) => void;
    onTurnComplete?: () => void;
}

export class GeminiLiveService {
    private ws: WebSocket | null = null;
    private inputAudioCtx: AudioContext | null = null;
    private outputAudioCtx: AudioContext | null = null;
    private micStream: MediaStream | null = null;
    private workletNode: AudioWorkletNode | null = null;
    private callbacks: GeminiLiveServiceCallbacks;
    
    // Playback state
    private audioQueue: Float32Array[] = [];
    private nextPlayTime: number = 0;
    private isPlayingAudio: boolean = false;
    private activeSources: AudioBufferSourceNode[] = [];
    private playbackSampleRate = 24000; // Gemini Live API output is 24kHz PCM

    constructor(callbacks: GeminiLiveServiceCallbacks) {
        this.callbacks = callbacks;
    }

    /**
     * Start Gemini 3.5 Live Translate session.
     */
    public async start(apiKey: string, targetLangCode: string, voiceName: string = 'Aoede'): Promise<void> {
        if (!apiKey) {
            throw new Error('Gemini API Key is required for Live Translate.');
        }

        this.updateStatus('connecting');

        const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

        try {
            this.ws = new WebSocket(wsUrl);
            this.ws.binaryType = 'blob';

            this.ws.onopen = () => {
                this.updateStatus('connected');
                this.sendSetup(targetLangCode, voiceName);
                this.startMicrophone();
                if (this.callbacks.onOpen) {
                    this.callbacks.onOpen();
                }
            };

            this.ws.onmessage = async (event: MessageEvent) => {
                try {
                    let jsonData: any;
                    if (event.data instanceof Blob) {
                        const text = await event.data.text();
                        jsonData = JSON.parse(text);
                    } else if (typeof event.data === 'string') {
                        jsonData = JSON.parse(event.data);
                    } else {
                        return;
                    }
                    this.handleServerMessage(jsonData);
                } catch (e) {
                    console.error('Error parsing live WS response:', e);
                }
            };

            this.ws.onerror = (err) => {
                console.error('Live WS Error:', err);
                if (this.callbacks.onError) {
                    this.callbacks.onError('WebSocket connection error.');
                }
            };

            this.ws.onclose = (event) => {
                console.log('Live WS Closed:', event.reason);
                this.cleanup();
                this.updateStatus('disconnected');
                if (this.callbacks.onClose) {
                    this.callbacks.onClose(event.reason || 'Closed');
                }
            };

        } catch (e: any) {
            this.cleanup();
            this.updateStatus('disconnected');
            throw e;
        }
    }

    /**
     * Stop and cleanup the active Live Translate session.
     */
    public stop(): void {
        this.cleanup();
        this.updateStatus('disconnected');
    }

    private updateStatus(status: 'disconnected' | 'connecting' | 'connected' | 'listening'): void {
        if (this.callbacks.onStatusChange) {
            this.callbacks.onStatusChange(status);
        }
    }

    private sendSetup(targetLangCode: string, voiceName: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        // Map and sanitize target language code to full regional codes for Gemini Live API
        let resolvedTargetLang = targetLangCode;
        if (resolvedTargetLang === 'zh') {
            resolvedTargetLang = 'zh-Hant';
        } else if (resolvedTargetLang === 'zh-Hans') {
            resolvedTargetLang = 'zh-Hans';
        }
		console.log("國家代碼:", resolvedTargetLang);
        const setupMessage = {
            setup: {
                model: 'models/gemini-3.5-live-translate-preview',
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                generationConfig: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: voiceName
                            }
                        }
                    },
                    translationConfig: {
                        targetLanguageCode: resolvedTargetLang,
                        echoTargetLanguage: true
                    }
                }
            }
        };

        this.ws.send(JSON.stringify(setupMessage));
    }

    private async startMicrophone(): Promise<void> {
        try {
            // 1. Get media stream
            this.micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // 2. Setup AudioContext at 16000Hz (downsampling on capture natively)
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.inputAudioCtx = new AudioContextClass({ sampleRate: 16000 });
            
            const source = this.inputAudioCtx.createMediaStreamSource(this.micStream);
            
            // Define AudioWorkletProcessor inside blob to load dynamically without separate files
            const workletCode = `
                class AudioProcessor extends AudioWorkletProcessor {
                    process(inputs, outputs, parameters) {
                        const input = inputs[0];
                        if (input && input[0]) {
                            const inputData = input[0];
                            this.port.postMessage(inputData);
                        }
                        return true;
                    }
                }
                registerProcessor('audio-processor', AudioProcessor);
            `;

            const blob = new Blob([workletCode], { type: 'application/javascript' });
            const workletUrl = URL.createObjectURL(blob);
            await this.inputAudioCtx.audioWorklet.addModule(workletUrl);
            
            this.workletNode = new AudioWorkletNode(this.inputAudioCtx, 'audio-processor');
            
            this.workletNode.port.onmessage = (event) => {
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

                const inputData = event.data as Float32Array;
                const pcmBuffer = this.floatTo16BitPCM(inputData);
                const base64Audio = this.arrayBufferToBase64(pcmBuffer);

                const audioMessage = {
                    realtimeInput: {
                        mediaChunks: [
                            {
                                mimeType: 'audio/pcm',
                                data: base64Audio
                            }
                        ]
                    }
                };

                try {
                    this.ws.send(JSON.stringify(audioMessage));
                } catch (err) {
                    console.error('Failed to send audio chunk:', err);
                }
            };

            source.connect(this.workletNode);
            this.workletNode.connect(this.inputAudioCtx.destination);
            
            this.updateStatus('listening');

        } catch (err: any) {
            console.error('Microphone error in Live Translate:', err);
            if (this.callbacks.onError) {
                this.callbacks.onError(`Microphone error: ${err.message || err}`);
            }
            this.stop();
        }
    }

    private handleServerMessage(message: any): void {
        const serverContent = message.serverContent;
        if (!serverContent) return;

        // 1. Process Input Transcription (user spoken speech transcribed to text)
        if (serverContent.inputTranscription && serverContent.inputTranscription.text) {
            const inputText = serverContent.inputTranscription.text;
            if (this.callbacks.onInputTranscription) {
                this.callbacks.onInputTranscription(inputText);
            }
        }

        // 2. Process Output Transcription (translated text from Gemini)
        if (serverContent.outputTranscription && serverContent.outputTranscription.text) {
            const outputText = serverContent.outputTranscription.text;
            if (this.callbacks.onOutputTranscription) {
                this.callbacks.onOutputTranscription(outputText);
            }
        }

        // 3. Process normal modelTurn parts (if any)
        const parts = serverContent.modelTurn?.parts;
        if (parts) {
            for (const part of parts) {
                // Process translated text
                if (part.text && this.callbacks.onText) {
                    this.callbacks.onText(part.text);
                }

                // Process audio chunk (Disabled translated audio playback as requested by user)
                /*
                if (part.inlineData && part.inlineData.data) {
                    const mimeType = part.inlineData.mimeType || '';
                    // Update playout sample rate if specified in mimetype, e.g. "audio/pcm;rate=24000"
                    const rateMatch = mimeType.match(/rate=(\d+)/);
                    if (rateMatch) {
                        this.playbackSampleRate = parseInt(rateMatch[1], 10);
                    }

                    const base64Data = part.inlineData.data;
                    const arrayBuffer = this.base64ToArrayBuffer(base64Data);
                    const float32Data = this.pcmToFloat32(arrayBuffer);
                    
                    this.queueAudioChunk(float32Data);
                }
                */
            }
        }

        // 4. Handle turn completion or interruption
        if (serverContent.turnComplete || serverContent.interrupted) {
            if (this.callbacks.onTurnComplete) {
                this.callbacks.onTurnComplete();
            }
        }
    }

    private queueAudioChunk(chunk: Float32Array): void {
        this.audioQueue.push(chunk);
        
        if (!this.isPlayingAudio) {
            if (!this.outputAudioCtx) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                this.outputAudioCtx = new AudioContextClass();
                this.nextPlayTime = this.outputAudioCtx.currentTime;
            }
            this.playNextChunk();
        }
    }

    private playNextChunk(): void {
        if (this.audioQueue.length === 0) {
            this.isPlayingAudio = false;
            if (this.callbacks.onSpeakingChange) {
                this.callbacks.onSpeakingChange(false);
            }
            return;
        }

        this.isPlayingAudio = true;
        if (this.callbacks.onSpeakingChange) {
            this.callbacks.onSpeakingChange(true);
        }

        const chunk = this.audioQueue.shift()!;
        if (!this.outputAudioCtx) return;

        // Create buffer for output (24kHz typically from Gemini)
        const audioBuffer = this.outputAudioCtx.createBuffer(1, chunk.length, this.playbackSampleRate);
        audioBuffer.copyToChannel(chunk, 0);

        const source = this.outputAudioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.outputAudioCtx.destination);

        const now = this.outputAudioCtx.currentTime;
        if (this.nextPlayTime < now) {
            this.nextPlayTime = now + 0.05; // 50ms buffer time for jitter
        }

        source.start(this.nextPlayTime);
        this.activeSources.push(source);

        this.nextPlayTime += audioBuffer.duration;

        source.onended = () => {
            // Remove source from list of active sources
            this.activeSources = this.activeSources.filter(s => s !== source);
            this.playNextChunk();
        };
    }

    /**
     * Stop currently playing translations
     */
    public stopPlayback(): void {
        for (const source of this.activeSources) {
            try {
                source.stop();
            } catch (e) {
                // Ignore errors
            }
        }
        this.activeSources = [];
        this.audioQueue = [];
        this.isPlayingAudio = false;
        if (this.callbacks.onSpeakingChange) {
            this.callbacks.onSpeakingChange(false);
        }
    }

    private cleanup(): void {
        // Stop audio playback
        this.stopPlayback();

        // Close output AudioContext
        if (this.outputAudioCtx) {
            try {
                this.outputAudioCtx.close();
            } catch (e) {}
            this.outputAudioCtx = null;
        }

        // Stop microphone nodes
        if (this.workletNode) {
            try {
                this.workletNode.disconnect();
            } catch (e) {}
            this.workletNode = null;
        }

        if (this.inputAudioCtx) {
            try {
                this.inputAudioCtx.close();
            } catch (e) {}
            this.inputAudioCtx = null;
        }

        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
            this.micStream = null;
        }

        // Close WebSocket
        if (this.ws) {
            try {
                this.ws.close();
            } catch (e) {}
            this.ws = null;
        }
    }

    // --- Audio Utilities ---

    private floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < float32Array.length; i++) {
            let s = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
        return buffer;
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    private pcmToFloat32(arrayBuffer: ArrayBuffer): Float32Array {
        const int16Array = new Int16Array(arrayBuffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768;
        }
        return float32Array;
    }
}

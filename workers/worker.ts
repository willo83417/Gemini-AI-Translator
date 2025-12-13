// workers/worker.ts

	/**
	* Environment Polyfill - MUST be at the very top.
	* This spoofs the environment for MediaPipe's internal checks before the script is loaded.
	*/
	if (typeof (self as any).HTMLImageElement === 'undefined') {
		(self as any).HTMLImageElement = class HTMLImageElement {};
	}
	if (typeof (self as any).Image === 'undefined') {
		(self as any).Image = (self as any).HTMLImageElement;
	}
	if (typeof (self as any).HTMLVideoElement === 'undefined') {
		(self as any).HTMLVideoElement = class HTMLVideoElement {};
	}

	// Per user request, load the library using importScripts for a classic worker environment.
	// @ts-ignore
	(self as any).exports = {};
	importScripts("/public/genai_bundle.js"); //Development and Testing;開發測試
	//importScripts(`${import.meta.env.BASE_URL}genai_bundle.js`); //yarn build is used for packaging.; yarn build 打包用
	const { FilesetResolver, LlmInference } = (self as any).exports;

	const MEDIAPIPE_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@0.10.25/wasm";

	let llmInference: InstanceType<typeof LlmInference> | null = null;
	let currentTaskAbortController: AbortController | null = null;

const handleInit = async (payload: any) => {
    const { modelBlob, modelSource, options } = payload;
    
    if (llmInference) {
        await llmInference.close();
        llmInference = null;
    }

    try {
        if (!('gpu' in navigator)) {
            throw new Error('WebGPU is not supported.');
        }

        if (!modelBlob) {
            throw new Error(`Model data for ${modelSource} not found.`);
        }
        
        const modelUrl = URL.createObjectURL(modelBlob);
        const filesetResolver = await FilesetResolver.forGenAiTasks(MEDIAPIPE_WASM);

        const { 
            maxTokens = 4096, topK = 40, temperature = 0.3, randomSeed = 101, supportAudio = false, maxNumImages = 1
        } = options;
        
        llmInference = await LlmInference.createFromOptions(filesetResolver, {
            baseOptions: { modelAssetPath: modelUrl, delegate: 'GPU' },
            maxTokens, topK, temperature, randomSeed, supportAudio, maxNumImages,
        });
        
        URL.revokeObjectURL(modelUrl);
        self.postMessage({ type: 'init_done', payload: { modelIdentifier: modelSource } });

    } catch (error) {
        llmInference = null;
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error.';
        self.postMessage({ type: 'init_error', payload: { error: errorMessage } });
    }
};

const handleUnload = async () => {
    if (llmInference) {
        await llmInference.close();
        llmInference = null;
    }
    self.postMessage({ type: 'unload_done' });
};

const performTranslation = (text: string, sourceLang: string, targetLang: string, stream: boolean) => {
    if (!llmInference) throw new Error('Offline model is not initialized.');
    
    currentTaskAbortController = new AbortController();
    const signal = currentTaskAbortController.signal;

    return new Promise((resolve, reject) => {
        const handleAbort = () => reject(new DOMException('Translation cancelled.', 'AbortError'));
        signal.addEventListener('abort', handleAbort, { once: true });
        
        try {
            let fullText = "";
            const streamCallback = (partialResult: string, done: boolean) => {
                if (signal.aborted) return;
                fullText += partialResult;
                if (stream) {
                    self.postMessage({ type: 'translation_chunk', payload: { chunk: partialResult } });
                }
                if (done) {
                    signal.removeEventListener('abort', handleAbort);
                    resolve(fullText.trim());
                }
            };

            const sourceInstruction = sourceLang === 'Auto Detect' 
                ? 'auto-detect the source language'
                : `from ${sourceLang}`;
            const prompt = `Translate the following ${sourceInstruction} text into concise ${targetLang}: "${text}". \n Provide *only* the translated text. Do not include any additional explanations, commentary, or greetings.`;

            llmInference.generateResponse(prompt, streamCallback);
        } catch (error) {
            signal.removeEventListener('abort', handleAbort);
            reject(error);
        }
    });
};

const handleExtractText = async (payload: any) => {
    if (!llmInference) {
        return self.postMessage({ type: 'extract_text_error', payload: { error: 'Offline model not initialized.' } });
    }
    
    const { imageBitmap } = payload;
    const prompt = `Extract all text from the following image. Return only the extracted text without any extra comments or explanations.`;
    try {
        // Pass the ImageBitmap object directly to the model, which was transferred from the main thread.
        const response = await llmInference.generateResponse([
            `<start_of_turn>user\n${prompt}\n`, 
            { imageSource: imageBitmap }, 
            `<end_of_turn>\n<start_of_turn>model\n`,
        ]);
        
        // Clean up the bitmap to free up memory.
        imageBitmap.close();

        self.postMessage({ type: 'extract_text_done', payload: { text: response.trim() } });
    } catch (error) {
        console.error('OCR Worker Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Offline image text extraction failed.';
        self.postMessage({ type: 'extract_text_error', payload: { error: errorMessage } });
    }
};

const handleTranscribe = async (payload: any) => {
    if (!llmInference) {
        return self.postMessage({ type: 'transcribe_error', payload: { error: 'Offline model not initialized.' } });
    }
    const { audioUrl, sourceLang } = payload;
    const languageClause = sourceLang === 'Auto Detect' ? 'Auto-detect the language.' : `The language is ${sourceLang}.`;
    const prompt = `Transcribe the following audio. ${languageClause} Return only the transcribed text.`;
    try {
        const response = await llmInference.generateResponse([
            `<start_of_turn>user\n ${prompt} <end_of_turn>\n<start_of_turn>model\n`, 
            { audioSource: audioUrl }
        ]);
        self.postMessage({ type: 'transcribe_done', payload: { text: response.trim(), audioUrl } });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Offline audio transcription failed.';
        self.postMessage({ type: 'transcribe_error', payload: { error: errorMessage, audioUrl } });
    }
};

self.onmessage = async (event: MessageEvent) => {
    const { type, payload } = event.data;
    try {
        switch (type) {
            case 'init':
                await handleInit(payload);
                break;
            case 'unload':
                await handleUnload();
                break;
            case 'translate_stream': {
                const result = await performTranslation(payload.text, payload.sourceLang, payload.targetLang, true);
                self.postMessage({ type: 'translation_done', payload: { result } });
                break;
            }
            case 'translate_full': {
                const result = await performTranslation(payload.text, payload.sourceLang, payload.targetLang, false);
                self.postMessage({ type: 'translation_full_done', payload: { result } });
                break;
            }
            case 'cancel_task':
                currentTaskAbortController?.abort();
                break;
            case 'extractText':
                await handleExtractText(payload);
                break;
            case 'transcribe':
                await handleTranscribe(payload);
                break;
            default:
                console.warn(`Unknown inference worker message type: ${type}`);
        }
    } catch (error) {
        const isAbort = error instanceof DOMException && error.name === 'AbortError';
        const baseType = type.replace('_stream', '').replace('_full', '');
        
        if (isAbort) {
            self.postMessage({ type: 'translation_cancelled' });
        } else {
            const errorMessage = error instanceof Error ? error.message : `Unknown error in ${type}.`;
            self.postMessage({ type: `${baseType}_error`, payload: { error: errorMessage } });
        }
    } finally {
        currentTaskAbortController = null;
    }
};

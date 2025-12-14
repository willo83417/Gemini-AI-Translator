
// workers/offline.worker.ts
// This worker acts as a controller, managing an inference worker
// and handling complex logic like two-step translations.

let inferenceWorker: Worker | null = null;
let twoStepState: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
} | null = null;

// This function attaches the necessary event listeners to the inference worker instance.
const setupInferenceWorkerListeners = () => {
    if (!inferenceWorker) return;

    inferenceWorker.onmessage = (e: MessageEvent) => {
        const { type: msgType, payload: msgPayload } = e.data;
        if (twoStepState && msgType === 'translation_full_done') {
            twoStepState.resolve(msgPayload.result);
            twoStepState = null;
        } else if (twoStepState && (msgType === 'translation_error' || msgType === 'error')) {
            twoStepState.reject(new Error(msgPayload.error));
            twoStepState = null;
        } else {
            // Forward all other messages to the main thread
            self.postMessage(e.data);
        }
    };
    
    inferenceWorker.onerror = (error) => {
        const errorMessage = `Inference worker error: ${error.message}`;
        console.error("Controller received an error from inference worker:", error);
        if (twoStepState) {
            twoStepState.reject(new Error(errorMessage));
            twoStepState = null;
        }
        self.postMessage({ type: 'init_error', payload: { error: errorMessage } });
    };
};

// This function now handles both creation and message forwarding logic
const forwardToInferenceWorker = (event: MessageEvent) => {
    if (!inferenceWorker) {
        console.error("Inference worker does not exist. Cannot process message:", event.data.type);
        self.postMessage({ type: 'error', payload: { error: 'Inference worker is not initialized.' } });
        return;
    }
    
    if (event.data.type === 'extractText' && event.data.payload.imageBitmap) {
        inferenceWorker.postMessage(event.data, [event.data.payload.imageBitmap]);
    } else {
        inferenceWorker.postMessage(event.data);
    }
};

const handleTranslate = async (payload: any) => {
    const { text, sourceLang, targetLang, sourceLangCode, targetLangCode, isTwoStepEnabled } = payload;
    const isJpToCn = sourceLangCode === 'ja' && targetLangCode.startsWith('zh');

    if (isTwoStepEnabled && isJpToCn) {
        try {
            const intermediateEnglishPromise = new Promise((resolve, reject) => {
                twoStepState = { resolve, reject };
                if (!inferenceWorker) throw new Error("Inference worker not available for two-step translation.");
                inferenceWorker.postMessage({
                    type: 'translate_full',
                    payload: { text, sourceLang: 'Japanese', targetLang: 'English' }
                });
            });
            const intermediateEnglish = await intermediateEnglishPromise as string;
            if (!intermediateEnglish?.trim()) throw new Error('Intermediate English translation failed.');
            if (!inferenceWorker) throw new Error("Inference worker not available for second step of translation.");
            inferenceWorker.postMessage({
                type: 'translate_stream',
                payload: { text: intermediateEnglish, sourceLang: 'English', targetLang }
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Two-step translation failed.';
            self.postMessage({ type: 'translation_error', payload: { error: errorMessage } });
            twoStepState = null;
        }
    } else {
        if (!inferenceWorker) {
             self.postMessage({ type: 'translation_error', payload: { error: "Inference worker not ready." } });
             return;
        }
        inferenceWorker.postMessage({ type: 'translate_stream', payload });
    }
};

const handleCancel = () => {
    if (twoStepState) {
        twoStepState.reject(new DOMException('Translation cancelled.', 'AbortError'));
        twoStepState = null;
    }
    if (inferenceWorker) {
        inferenceWorker.postMessage({ type: 'cancel_task' });
    }
};

self.onmessage = async (event: MessageEvent) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'init':
            // The worker is created on-demand here ("lazy initialization").
            // This block handles both the initial creation and re-creation after an 'unload' command.
            if (!inferenceWorker) {
                console.log('Controller: Creating inference worker...');
                // Use the `?url` suffix to tell Vite to provide the asset URL instead of bundling.
                inferenceWorker = new Worker(new URL('./worker.ts?url', import.meta.url), { type: 'classic' });
                setupInferenceWorkerListeners();
            }
            forwardToInferenceWorker(event);
            break;

        case 'unload':
            if (inferenceWorker) {
                console.log('Controller: Received unload command. Terminating inference worker to release VRAM.');
                inferenceWorker.terminate();
                inferenceWorker = null; // CRITICAL: Set to null to release reference and allow re-creation.
            }
            self.postMessage({ type: 'unload_done' });
            break;

        case 'transcribe':
        case 'extractText':
            forwardToInferenceWorker(event);
            break;
            
        case 'translate':
            await handleTranslate(payload);
            break;
            
        case 'cancel_translation':
            handleCancel();
            break;
            
        default:
            console.warn(`Unknown controller worker message type: ${type}`);
    }
};
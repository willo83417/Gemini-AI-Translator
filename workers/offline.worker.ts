
// workers/offline.worker.ts
// This worker acts as a controller, managing an inference worker
// and handling complex logic like two-step translations.

let inferenceWorker: Worker | null = null;
let twoStepState: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
} | null = null;

// This function now handles both creation and message forwarding logic
const forwardToInferenceWorker = (event: MessageEvent) => {
    if (!inferenceWorker) {
        console.error("Inference worker does not exist. Cannot process message:", event.data.type);
        // Optionally, send an error back to the main thread
        self.postMessage({ type: 'error', payload: { error: 'Inference worker is not initialized.' } });
        return;
    }
    
    // For transferable objects like ImageBitmap
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
            // Step 1: Japanese to English
            const intermediateEnglishPromise = new Promise((resolve, reject) => {
                twoStepState = { resolve, reject };
                if (!inferenceWorker) throw new Error("Inference worker not available for two-step translation.");
                inferenceWorker.postMessage({
                    type: 'translate_full',
                    payload: { text, sourceLang: 'Japanese', targetLang: 'English' }
                });
            });

            const intermediateEnglish = await intermediateEnglishPromise as string;

            if (!intermediateEnglish?.trim()) {
                throw new Error('Intermediate English translation failed.');
            }

            // Step 2: English to Chinese
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
        // Standard one-step translation
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
            // Terminate any existing worker to ensure a clean slate
            if (inferenceWorker) {
                inferenceWorker.terminate();
            }
            // Create the worker as a classic script, NOT a module, because worker.ts uses importScripts.
            inferenceWorker = new Worker(new URL('./worker.ts', import.meta.url));

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
                if (twoStepState) {
                    twoStepState.reject(new Error(errorMessage));
                    twoStepState = null;
                }
                self.postMessage({ type: 'init_error', payload: { error: errorMessage } });
            };
            
            // Forward the init message to the newly created worker
            forwardToInferenceWorker(event);
            break;

        case 'unload':
            if (inferenceWorker) {
                inferenceWorker.terminate();
                inferenceWorker = null;
                console.log('Inference worker terminated and resources released.');
            }
            // Confirm to main thread that unload is complete
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

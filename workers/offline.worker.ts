// workers/offline.worker.ts
// This worker acts as a controller, managing an inference worker
// and handling complex logic like two-step translations.

let inferenceWorker: Worker | null = null;
let twoStepState: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
} | null = null;

const initInferenceWorker = () => {
    if (inferenceWorker) return;
    
    // Create the worker as a classic script, NOT a module,
    inferenceWorker = new Worker(new URL('./worker.ts', import.meta.url)); //Development and Testing & Both yarn build and packaging can be used.; yarn build打包 皆可使用
    inferenceWorker.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        // Handle intermediate results for two-step translation (JP -> EN -> CN)
        if (twoStepState && type === 'translation_full_done') {
            twoStepState.resolve(payload.result);
            twoStepState = null;
            return;
        }
        if (twoStepState && (type === 'translation_error' || type === 'error')) {
            twoStepState.reject(new Error(payload.error));
            twoStepState = null;
            return;
        }

        // Forward all other messages to the main thread
        self.postMessage(event.data);
    };

    inferenceWorker.onerror = (error) => {
        const errorMessage = `Inference worker error: ${error.message}`;
        if (twoStepState) {
            twoStepState.reject(new Error(errorMessage));
            twoStepState = null;
        }
        self.postMessage({ type: 'init_error', payload: { error: errorMessage } });
    };
};

const getInferenceWorker = (): Worker => {
    if (!inferenceWorker) initInferenceWorker();
    return inferenceWorker!;
}

const handleTranslate = async (payload: any) => {
    const { text, sourceLang, targetLang, sourceLangCode, targetLangCode, isTwoStepEnabled } = payload;
    const isJpToCn = sourceLangCode === 'ja' && targetLangCode.startsWith('zh');

    if (isTwoStepEnabled && isJpToCn) {
        try {
            // Step 1: Japanese to English
            const intermediateEnglishPromise = new Promise((resolve, reject) => {
                twoStepState = { resolve, reject };
                getInferenceWorker().postMessage({
                    type: 'translate_full',
                    payload: { text, sourceLang: 'Japanese', targetLang: 'English' }
                });
            });

            const intermediateEnglish = await intermediateEnglishPromise as string;

            if (!intermediateEnglish?.trim()) {
                throw new Error('Intermediate English translation failed.');
            }

            // Step 2: English to Chinese
            getInferenceWorker().postMessage({
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
        getInferenceWorker().postMessage({ type: 'translate_stream', payload });
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

    // Initialize worker on first message if not already done
    if (!inferenceWorker) {
        initInferenceWorker();
    }
    
    switch (type) {
        case 'init':
        case 'unload':
        case 'transcribe':
            getInferenceWorker().postMessage(event.data);
            break;
        case 'extractText':
            // Forward the message and explicitly include the imageBitmap in the transfer list
            getInferenceWorker().postMessage(event.data, [payload.imageBitmap]);
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

// workers/offline.worker.ts
// This worker acts as a controller, managing an inference worker
// and handling complex logic like two-step translations.

let inferenceWorker: Worker | null = null;
let twoStepState: {
    originalPayload: any;
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
} | null = null;


const initInferenceWorker = () => {
    if (inferenceWorker) return;
    
    inferenceWorker = new Worker(new URL('/public/worker.js', import.meta.url));

    inferenceWorker.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        // If we are in a two-step translation, check if this is the intermediate result.
        if (twoStepState && type === 'translation_full_done') {
            twoStepState.resolve(payload.result);
            twoStepState = null;
            return;
        }
         if (twoStepState && type === 'translation_error') {
            twoStepState.reject(new Error(payload.error));
            twoStepState = null;
            return;
        }

        // Otherwise, forward the message to the main thread.
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
    initInferenceWorker();
    return inferenceWorker!;
}

const handleTranslate = async (payload: any) => {
    const { text, sourceLang, targetLang, sourceLangCode, targetLangCode, isTwoStepEnabled } = payload;
    const isJpToCn = sourceLangCode === 'ja' && targetLangCode.startsWith('zh');

    if (isTwoStepEnabled && isJpToCn) {
        try {
            // Step 1: Japanese to English (full translation)
            const intermediateEnglishPromise = new Promise((resolve, reject) => {
                twoStepState = { originalPayload: payload, resolve, reject };
                getInferenceWorker().postMessage({
                    type: 'translate_full',
                    payload: { text, sourceLang: 'Japanese', targetLang: 'English' }
                });
            });

            const intermediateEnglish = await intermediateEnglishPromise as string;

            if (!intermediateEnglish?.trim()) {
                throw new Error('Intermediate English translation failed (result was empty).');
            }

            // Step 2: English to Chinese (streamed)
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
    // Forward the cancel request to the inference worker
    if (inferenceWorker) {
        inferenceWorker.postMessage({ type: 'cancel_task' });
    }
};

self.onmessage = async (event: MessageEvent) => {
    const { type, payload } = event.data;

    // Ensure worker is initialized for any task.
    if (type !== 'init' && !inferenceWorker) {
        initInferenceWorker();
    }
    
    switch (type) {
        case 'init':
        case 'unload':
        case 'extractText':
        case 'transcribe':
            // Forward simple messages directly
            getInferenceWorker().postMessage(event.data);
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
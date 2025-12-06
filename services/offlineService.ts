import { LlmInference, FilesetResolver } from '@mediapipe/tasks-genai';
import { downloadManager } from './downloadManager';

let llmInference: LlmInference | null = null;
let currentModelIdentifier: string | null = null;

// A promise chain to serialize all model-related operations (init, unload).
// This prevents race conditions, like trying to unload a model while it's initializing.
let modelTaskQueue: Promise<any> = Promise.resolve();

interface LlmInferenceOptions {
    maxTokens?: number;
    topK?: number;
    temperature?: number;
    randomSeed?: number;
    supportAudio?: boolean;
    maxNumImages?: number;
}

const runExclusive = <T>(task: () => Promise<T>): Promise<T> => {
    // Chain the new task to the end of the queue.
    // The `.then(task, task)` ensures the next task runs even if the previous one fails.
    modelTaskQueue = modelTaskQueue.then(task, task);
    return modelTaskQueue;
};


export const initializeOfflineModel = (modelSource: string, options: LlmInferenceOptions = {}) => {
    return runExclusive(async () => {
        const newModelIdentifier = `${modelSource}-${JSON.stringify(options)}`;

        // If the exact same model with the same config is already loaded, do nothing.
        if (llmInference && currentModelIdentifier === newModelIdentifier) {
            console.log(`Model ${newModelIdentifier} is already initialized.`);
            return;
        }

        // If a different model is loaded, unload it first to free up memory.
        if (llmInference) {
            await llmInference.close();
            llmInference = null;
            currentModelIdentifier = null;
            console.log('Previous offline model unloaded to switch models or apply new settings.');
        }

        try {
            console.log(`Initializing offline model: ${newModelIdentifier}`);

            if (!('gpu' in navigator)) {
              console.warn('WebGPU is not supported in this browser. Falling back to CPU.');
              throw new Error(`WebGPU is not supported in this browser. Falling back to CPU.`);
            }

            const modelBlob = await downloadManager.getModelAsBlob(modelSource);

            if (!modelBlob) {
                throw new Error(`Model data for ${modelSource} not found locally.`);
            }
            const modelUrl = URL.createObjectURL(modelBlob);
            
            // Create a FilesetResolver to correctly load the WASM backend.
            const filesetResolver = await FilesetResolver.forGenAiTasks(
              "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@0.10.25/wasm"
            );

            const { 
                maxTokens = 4096, 
                topK = 40, 
                temperature = 0.3, 
                randomSeed = 101,
                supportAudio = false,
                maxNumImages = 1
            } = options;

            // Create the LlmInference instance using the correct `createFromOptions` method.
            llmInference = await LlmInference.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: modelUrl,
                    delegate: 'GPU',
                },
                maxTokens,
                topK,
                temperature, 
                randomSeed,
                supportAudio,
                maxNumImages,
            });
            
            currentModelIdentifier = newModelIdentifier;
            console.log(`Offline model ${newModelIdentifier} initialized successfully.`);
            URL.revokeObjectURL(modelUrl);

        } catch (error) {
            console.error('Failed to initialize offline model:', error);
            llmInference = null;
            currentModelIdentifier = null;
            // Re-throw to allow the UI to handle the error
            throw error;
        }
    });
};

export const unloadOfflineModel = async () => {
    return runExclusive(async () => {
        if (llmInference) {
            await llmInference.close();
            llmInference = null;
            currentModelIdentifier = null;
            console.log('Offline model unloaded from memory.');
        } else {
            console.log('No offline model was loaded, unload is not needed.');
        }
    });
};

const _performStreamTranslation = (
    text: string,
    sourceLang: string,
    targetLang: string,
    onChunk: (chunk: string) => void,
    signal: AbortSignal
): Promise<string> => {
    if (!llmInference) {
        throw new Error('Offline model is not initialized.');
    }
    if (signal.aborted) {
        return Promise.reject(new DOMException('Translation cancelled before start.', 'AbortError'));
    }

    return new Promise((resolve, reject) => {
        const handleAbort = () => {
            reject(new DOMException('Translation cancelled by user.', 'AbortError'));
        };
        signal.addEventListener('abort', handleAbort, { once: true });

        try {
            let fullText = "";
            const streamCallback = (partialResult: string, done: boolean) => {
                if (signal.aborted) {
                    // The event listener will handle the rejection.
                    // It's important not to proceed further.
                    return;
                }
                fullText += partialResult;
                onChunk(partialResult);
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
            console.error('Offline stream generation failed:', error);
            reject(new Error('Failed to generate response from offline model.'));
        }
    });
};

const _performFullTranslation = async (
    text: string,
    sourceLang: string,
    targetLang: string,
    signal: AbortSignal
): Promise<string> => {
    let fullText = "";
    // Use the streaming function internally but just accumulate the result.
    await _performStreamTranslation(text, sourceLang, targetLang, (chunk) => {
        fullText += chunk;
    }, signal);
    return fullText;
};


export const translateOfflineStream = async (
    text: string, 
    sourceLang: string, 
    targetLang: string, 
    isTwoStepEnabled: boolean,
    onChunk: (chunk: string) => void,
    signal: AbortSignal
): Promise<string> => {
    if (!llmInference) {
        throw new Error('Offline model is not initialized. Please select a model in settings.');
    }

    const isJpToCn = sourceLang === 'Japanese' && (targetLang.startsWith('Chinese'));

    if (isTwoStepEnabled && isJpToCn) {
        try {
            // Step 1: Translate from Japanese to English (no streaming to UI)
            const intermediateEnglish = await _performFullTranslation(text, 'Japanese', 'English', signal);
            
            if (signal.aborted) throw new DOMException('Translation cancelled.', 'AbortError');

            if (!intermediateEnglish?.trim()) {
                throw new Error('Intermediate English translation failed (result was empty). This can happen with very short or unusual text. Try disabling High-Accuracy mode in settings.');
            }
            
            // Step 2: Translate from English to Chinese (with streaming to UI)
            return _performStreamTranslation(intermediateEnglish, 'English', targetLang, onChunk, signal);

        } catch(error) {
            console.error('Two-step offline translation failed:', error);
            if (error instanceof Error) {
                // Re-throw the specific error from the intermediate step or the final step
                throw error;
            }
            throw new Error('Failed during the two-step translation process.');
        }

    } else {
        // Standard one-step translation
        return _performStreamTranslation(text, sourceLang, targetLang, onChunk, signal);
    }
};

export const extractTextFromImageOffline = async (
    imageUrl: string
): Promise<string> => {
    if (!llmInference) {
        throw new Error('Offline model is not initialized or does not support images.');
    }
    
    const prompt = `Extract all text from the following image. Return only the extracted text without any extra comments or explanations.`;
    
    try {
        const response = await llmInference.generateResponse([
            `<start_of_turn>user\n${prompt}\n`,
            { imageSource: imageUrl },
            `<end_of_turn>\n<start_of_turn>model\n`,
        ]);
        return response.trim();
    } catch (error) {
        console.error('Offline image text extraction failed:', error);
        throw new Error('Failed to extract text from image using the offline model.');
    }
};

export const transcribeAudioOffline = async (
    audioUrl: string,
    sourceLang: string,
): Promise<string> => {
    if (!llmInference) {
        throw new Error('Offline model is not initialized or does not support audio.');
    }

    const languageClause = sourceLang === 'Auto Detect' 
        ? 'Auto-detect the language.' 
        : `The language is ${sourceLang}.`;
	const prompt = `Transcribe the following audio. ${languageClause}  Return only the transcribed text.`;
    try {
        const response = await llmInference.generateResponse([

			`<start_of_turn>user\n ${prompt} <end_of_turn>\n<start_of_turn>model\n`,
            { audioSource: audioUrl }
        ]);
		console.log(response.trim());
        return response.trim();
    } catch (error) {
        console.error('Offline audio transcription failed:', error);
        throw new Error('Failed to generate response from offline model with audio.');
    }
};
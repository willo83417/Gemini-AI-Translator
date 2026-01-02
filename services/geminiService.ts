
import { GoogleGenAI, Type } from "@google/genai";

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const translateTextStream = async (
    text: string, 
    sourceLang: string, 
    targetLang: string, 
    apiKey: string,
    modelName: string,
    onChunk: (chunk: string) => void,
    signal: AbortSignal
): Promise<string> => {
    
    if (!apiKey) {
        throw new Error('Gemini API Key is not set. Please add it in the settings.');
    }
    if (!modelName) {
        throw new Error('Model Name is not configured. Please add it in the settings.');
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const sourceLanguageInstruction = sourceLang === 'Auto Detect'
            ? 'First, auto-detect the source language of the following text.'
            : `The source language is ${sourceLang}.`;
        
        const systemInstruction = `${sourceLanguageInstruction} Then, translate the text to ${targetLang}.
Do not add any extra explanations, comments, or annotations. Return only the translated text.`;

        const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: text,
            config: {
                systemInstruction,
                // Disable thinking for faster, lower-latency translation
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        let fullText = '';
        for await (const chunk of responseStream) {
            if (signal.aborted) {
                throw new DOMException('Translation cancelled by user.', 'AbortError');
            }
            const chunkText = chunk.text;
            if (chunkText) {
                fullText += chunkText;
                onChunk(chunkText);
            }
        }
        return fullText.trim();

    } catch (error) {
        console.error('Error translating text:', error);
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
        throw new Error('Gemini API request failed.');
    }
};

export const translateImage = async (
    imageDataUrl: string,
    targetLang: string,
    apiKey: string,
    modelName: string
): Promise<{ sourceText: string, translatedText: string }> => {
    if (!apiKey) {
        throw new Error('Gemini API Key is not set. Please add it in the settings.');
    }

    const ai = new GoogleGenAI({ apiKey });

    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid image data URL format.');
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const imagePart = {
        inlineData: {
            mimeType,
            data: base64Data,
        },
    };

    const textPart = {
        text: `1. First, accurately extract all text from the provided image.
2. Then, translate the extracted text into ${targetLang}.
3. Finally, return a single JSON object with two keys: "sourceText" containing the exact extracted text, and "translatedText" containing the translation. Do not include any other explanations or markdown formatting.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sourceText: {
                            type: Type.STRING,
                            description: 'The text extracted from the image.'
                        },
                        translatedText: {
                            type: Type.STRING,
                            description: 'The translated text.'
                        },
                    },
                    required: ["sourceText", "translatedText"],
                },
            },
        });
        
        const jsonString = response.text?.trim() || "{}";
        const result = JSON.parse(jsonString);

        if (typeof result.sourceText === 'string' && typeof result.translatedText === 'string') {
            return result;
        } else {
            throw new Error('Invalid JSON structure in API response.');
        }

    } catch (error) {
        console.error('Error translating image:', error);
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse the response from the Gemini API. The response was not valid JSON.');
        }
        throw new Error('Gemini API request for image translation failed.');
    }
};

export const transcribeAudioGemini = async (
    audioBlob: Blob,
    language: string,
    apiKey: string,
    modelName: string,
    signal?: AbortSignal
): Promise<string> => {
    if (!apiKey) {
        throw new Error('Gemini API Key is not set. Please add it in the settings.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Audio = await blobToBase64(audioBlob);
    
    // Determine mime type from blob, default to audio/wav or audio/webm
    let mimeType = audioBlob.type;
    if (mimeType.includes(';')) {
        mimeType = mimeType.split(';')[0];
    }
    if (!mimeType) mimeType = 'audio/wav';

    const audioPart = {
        inlineData: {
            mimeType: mimeType,
            data: base64Audio
        }
    };

    const prompt = `Transcribe the following audio. The language is ${language}. Return only the transcribed text.`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: [audioPart, { text: prompt }] }
        });

        if (signal?.aborted) {
            throw new DOMException('Transcription cancelled by user.', 'AbortError');
        }

        return response.text?.trim() || '';

    } catch (error) {
        console.error('Error transcribing audio:', error);
         if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
        throw new Error('Gemini API transcription request failed.');
    }
};

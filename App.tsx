
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TranslationInput from './components/TranslationInput';
import TranslationOutput from './components/TranslationOutput';
import CameraView from './components/CameraView';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import { translateTextStream as translateTextGeminiStream, translateImage as translateImageGemini, transcribeAudioGemini } from './services/geminiService';
import { translateTextStream as translateTextOpenAIStream, translateImage as translateImageOpenAI, transcribeAudioOpenAI } from './services/openaiService';
import { downloadManager, type DownloadProgress } from './services/downloadManager';
import { processAudioForTranscription, checkAsrModelCacheStatus, clearAsrCache } from './services/asrService';
import { useWebSpeech } from './hooks/useWebSpeech';
import { usePaddleOcr } from './hooks/usePaddleOcr';
import type { Language, TranslationHistoryItem, CustomOfflineModel, EsearchOCROutput, EsearchOCRItem } from './types';
import { LANGUAGES, OFFLINE_MODELS, ASR_MODELS, OCR_MODELS } from './constants';

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Helper function to convert AudioBuffer to a mono WAV Blob
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    // Downmix to mono if necessary
    let monoChannel: Float32Array;
    if (buffer.numberOfChannels > 1) {
        monoChannel = new Float32Array(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
            let mixed = 0;
            for (let j = 0; j < buffer.numberOfChannels; j++) {
                mixed += buffer.getChannelData(j)[i];
            }
            monoChannel[i] = mixed / buffer.numberOfChannels;
        }
    } else {
        monoChannel = buffer.getChannelData(0);
    }
    
    const numOfChan = 1; // mono
    const length = monoChannel.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    let pos = 0;

    // Helper functions for writing data
    const setUint16 = (data: number) => {
        view.setUint16(pos, data, true);
        pos += 2;
    };
    const setUint32 = (data: number) => {
        view.setUint32(pos, data, true);
        pos += 4;
    };
    const setString = (str: string) => {
        for(let i = 0; i < str.length; i++) {
            view.setUint8(pos + i, str.charCodeAt(i));
        }
        pos += str.length;
    }
    
    // RIFF header
    setString('RIFF');
    setUint32(length - 8);
    setString('WAVE');

    // fmt chunk
    setString('fmt ');
    setUint32(16); // chunk size
    setUint16(1); // audio format (1 = PCM)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // data chunk
    setString('data');
    setUint32(monoChannel.length * 2);

    // Write PCM data
    for (let i = 0; i < monoChannel.length; i++) {
        let sample = Math.max(-1, Math.min(1, monoChannel[i])); // clamp
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        pos += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
};

// --- OCR Processing Logic ---
type ProcessedItem = EsearchOCRItem & {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    centerX: number;
    centerY: number;
    height: number;
};

const enhanceItem = (item: EsearchOCRItem): ProcessedItem => {
    const xs = item.box.map(p => p[0]);
    const ys = item.box.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return { ...item, minX, maxX, minY, maxY, centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2, height: maxY - minY };
};

const groupAndSortLines = (items: ProcessedItem[]) => {
    const lines: ProcessedItem[][] = [];
    items.sort((a, b) => a.centerY - b.centerY);
    items.forEach(item => {
        const line = lines.find(l => {
            const avgY = l.reduce((acc, i) => acc + i.centerY, 0) / l.length;
            const avgH = l.reduce((acc, i) => acc + i.height, 0) / l.length;
            return Math.abs(item.centerY - avgY) < (avgH * 0.6);
        });
        if (line) {
            line.push(item);
        } else {
            lines.push([item]);
        }
    });
    lines.sort((a, b) => {
        const getLineTopY = (l: ProcessedItem[]) => Math.min(...l.map(i => i.minY));
        return getLineTopY(a) - getLineTopY(b);
    });
    return lines.map(line => {
        line.sort((a, b) => a.minX - b.minX);
        return line.map(i => i.text).join(' ');
    }).join('\n');
};

const detectAndSplitColumns = (rawItems: EsearchOCRItem[]): string => {
    if (!rawItems || rawItems.length === 0) return "";
    const items = rawItems.map(enhanceItem);
    if (items.length < 2) return groupAndSortLines(items);
    const minX = Math.min(...items.map(i => i.minX));
    const maxX = Math.max(...items.map(i => i.maxX));
    const width = maxX - minX;
    const coverage = new Int32Array(Math.ceil(width) + 1);
    items.forEach(item => {
        const start = Math.floor(item.minX - minX);
        const end = Math.ceil(item.maxX - minX);
        for (let i = start; i < end; i++) {
            if (i >= 0 && i < coverage.length) coverage[i]++;
        }
    });
    const searchStart = Math.floor(width * 0.25);
    const searchEnd = Math.floor(width * 0.75);
    let maxGapSize = 0, maxGapCenter = -1, currentGapStart = -1;
    for (let i = searchStart; i <= searchEnd; i++) {
        if (coverage[i] === 0) {
            if (currentGapStart === -1) currentGapStart = i;
        } else {
            if (currentGapStart !== -1) {
                const gapSize = i - currentGapStart;
                if (gapSize > maxGapSize) {
                    maxGapSize = gapSize;
                    maxGapCenter = currentGapStart + (gapSize / 2);
                }
                currentGapStart = -1;
            }
        }
    }
    const hasMultipleColumns = maxGapCenter !== -1 && maxGapSize > 10;
    if (hasMultipleColumns) {
        const splitX = minX + maxGapCenter;
        const leftItems = items.filter(i => i.centerX < splitX);
        const rightItems = items.filter(i => i.centerX >= splitX);
        const leftText = groupAndSortLines(leftItems);
        const rightText = groupAndSortLines(rightItems);
        return `${leftText}\n\n${rightText}`;
    }
    return groupAndSortLines(items);
};

const processOcrResult = (result: EsearchOCROutput) => {
    const rawItems = result.src;
    if (!rawItems || rawItems.length === 0) {
        return result.parragraphs?.map(p => p.text).join('\n') || "";
    }
    return detectAndSplitColumns(rawItems);
};
// --- END OCR ---


interface AppMessage {
    type: 'log' | 'transcription' | 'transcription-partial' | 'loaded' | 'error' | 'progress' | 'unloaded';
    payload: any;
}

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[0]); // Default to Auto Detect
    const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[6]); // Default to Japanese
    const [isLoading, setIsLoading] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    
    const [isRecording, setIsRecording] = useState(false);
    const [isAstRecording, setIsAstRecording] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
    
    // Shared settings
    const [apiKey, setApiKey] = useState('');
    const [modelName, setModelName] = useState('gemini-2.5-flash');

    // Online provider settings
    const [onlineProvider, setOnlineProvider] = useState('gemini');
    const [openaiApiUrl, setOpenaiApiUrl] = useState('');
    
    // Offline settings
    const [huggingFaceApiKey, setHuggingFaceApiKey] = useState('');
    const [offlineModelName, setOfflineModelName] = useState('');
    const [isTwoStepJpCn, setIsTwoStepJpCn] = useState(false);
    const [customModels, setCustomModels] = useState<CustomOfflineModel[]>([]);
    
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingGender, setSpeakingGender] = useState<'female' | 'male' | null>(null);

    // Offline TTS settings
    const [isOfflineTtsEnabled, setIsOfflineTtsEnabled] = useState(false);
    const [offlineTtsVoiceURI, setOfflineTtsVoiceURI] = useState('');
    const [offlineTtsRate, setOfflineTtsRate] = useState(1);
    const [offlineTtsPitch, setOfflineTtsPitch] = useState(1);

    const [isOfflineModeEnabled, setIsOfflineModeEnabled] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadProgress>>({});
    const [isOfflineModelInitializing, setIsOfflineModelInitializing] = useState(false);
    const [isOfflineModelInitialized, setIsOfflineModelInitialized] = useState(false);

    // Offline Model Parameters
    const [offlineMaxTokens, setOfflineMaxTokens] = useState(4096);
    const [offlineTopK, setOfflineTopK] = useState(40);
    const [offlineTemperature, setOfflineTemperature] = useState(0.3);
    const [offlineRandomSeed, setOfflineRandomSeed] = useState(101);
    const [offlineSupportAudio, setOfflineSupportAudio] = useState(false);
    const [offlineMaxNumImages, setOfflineMaxNumImages] = useState(0);

    // ASR State
    const [isWebSpeechApiEnabled, setIsWebSpeechApiEnabled] = useState(true);
    const [isOfflineAsrEnabled, setIsOfflineAsrEnabled] = useState(false);
    const [asrModelId, setAsrModelId] = useState(ASR_MODELS[0].id);
    const [isAsrInitializing, setIsAsrInitializing] = useState(false);
    const [isAsrInitialized, setIsAsrInitialized] = useState(false);
    const [asrModelsCacheStatus, setAsrModelsCacheStatus] = useState<Record<string, boolean>>({});
    const [asrLoadingProgress, setAsrLoadingProgress] = useState({ file: '', progress: 0 });
    const [isNoiseCancellationEnabled, setIsNoiseCancellationEnabled] = useState(false);
    const [audioGainValue, setAudioGainValue] = useState(1.0);

    // Offline recording countdown state
    const [recordingCountdown, setRecordingCountdown] = useState<number | null>(null);
    const [isAwaitingAstTranslation, setIsAwaitingAstTranslation] = useState(false);

    // OCR State
    const { status: ocrEngineStatus, error: ocrEngineError, recognize, initializeOcr } = usePaddleOcr();
    const [selectedOcrModel, setSelectedOcrModel] = useState<keyof typeof OCR_MODELS>('ch_v5');


    type NotificationType = 'error' | 'success' | 'info';
    interface Notification {
        message: string;
        type: NotificationType;
    }
    const [notification, setNotification] = useState<Notification | null>(null);
    const notificationTimerRef = useRef<number | null>(null);

    // MediaPipe Worker (Offline LLM)
    const workerRef = useRef<Worker | null>(null);
    const messageHandlerRef = useRef((event: MessageEvent) => {});

    // Whisper Worker (Offline ASR)
    const asrWorkerRef = useRef<Worker | null>(null);

    const showNotification = useCallback((message: string, type: NotificationType = 'error') => {
        if (notificationTimerRef.current) {
            clearTimeout(notificationTimerRef.current);
        }
        setNotification({ message, type });
        notificationTimerRef.current = window.setTimeout(() => {
            setNotification(null);
        }, 5000);
    }, []);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const astRecognitionRef = useRef<SpeechRecognition | null>(null);
    const transcribedTextRef = useRef('');
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    
    // Countdown timer
    const countdownTimerRef = useRef<number | null>(null);
    // Translation abort controller
    const translationAbortControllerRef = useRef<AbortController | null>(null);
    // Audio abort controller
    const audioAbortControllerRef = useRef<AbortController | null>(null);
    const onStopRecordingCallbackRef = useRef<((blob: Blob) => void) | null>(null);
    // Flag to handle reverse translation logic after ASR
    const isReverseTranslateRef = useRef(false);

    // --- MediaPipe Worker Logic (Offline LLM) ---
    const getOrCreateWorker = useCallback(() => {
        if (workerRef.current) {
            return workerRef.current;
        }
        console.log("Creating offline worker...");
        const worker = new Worker(new URL('./workers/offline.worker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;
    
        const onMessage = (event: MessageEvent) => messageHandlerRef.current(event);
        worker.addEventListener('message', onMessage);
    
        worker.onerror = (error) => {
            console.error('Worker error:', error);
            showNotification(`A critical worker error occurred: ${error.message}`, 'error');
            setIsOfflineModelInitializing(false);
            setIsLoading(false);
        };
        return worker;
    }, [showNotification]);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
                console.log("Offline worker terminated on component unmount.");
            }
        };
    }, []);

    const isModelDownloaded = isOfflineModeEnabled && !!offlineModelName && downloadProgress[offlineModelName]?.status === 'completed';
    const isOfflineModelReady = isModelDownloaded && isOfflineModelInitialized;

    const performTranslate = useCallback(async (textToTranslate: string) => {
        if (!textToTranslate.trim()) {
            setTranslatedText('');
            return;
        }
    
        if (translationAbortControllerRef.current) {
            translationAbortControllerRef.current.abort();
        }
        const controller = new AbortController();
        translationAbortControllerRef.current = controller;
    
        setIsLoading(true);
        setTranslatedText('');
    
        try {
            const sourceLangEn = i18n.t(sourceLang.name, { lng: 'en' });
            const targetLangEn = i18n.t(targetLang.name, { lng: 'en' });

            if (isOfflineModeEnabled) {
                if (!offlineModelName) throw new Error('Please select an offline model in settings.');
                if (isOfflineModelInitializing) throw new Error('Offline model is still initializing.');
                if (!isOfflineModelReady) throw new Error('Selected offline model is not ready.');
                
                const worker = getOrCreateWorker();
                worker.postMessage({
                    type: 'translate',
                    payload: {
                        text: textToTranslate,
                        sourceLang: sourceLangEn,
                        targetLang: targetLangEn,
                        sourceLangCode: sourceLang.code,
                        targetLangCode: targetLang.code,
                        isTwoStepEnabled: isTwoStepJpCn,
                    }
                });
            } else { // Online mode
                if (!isOnline) throw new Error("You are offline. Enable offline mode or connect to the internet.");
    
                let finalResult = '';
                const onChunk = (chunk: string) => {
                    finalResult += chunk;
                    setTranslatedText(prev => prev.length === 0 ? chunk.trimStart() : prev + chunk);
                };
    
                if (onlineProvider === 'openai') {
                    if (!apiKey) throw new Error("OpenAI API Key is not set. Please add it in the settings.");
                    if (!openaiApiUrl) throw new Error("OpenAI API URL is not set. Please add it in the settings.");
                    finalResult = await translateTextOpenAIStream(textToTranslate, sourceLangEn, targetLangEn, apiKey, modelName, openaiApiUrl, onChunk, controller.signal);
                } else { // Gemini is default
                    if (!apiKey) throw new Error("Gemini API Key is not set. Please add it in the settings.");
                    finalResult = await translateTextGeminiStream(textToTranslate, sourceLangEn, targetLangEn, apiKey, modelName, onChunk, controller.signal);
                }
    
                const newHistoryItem: TranslationHistoryItem = {
                    id: Date.now(), inputText: textToTranslate, translatedText: finalResult, sourceLang, targetLang,
                };
                setHistory(prevHistory => {
                    const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                    localStorage.setItem('translation-history', JSON.stringify(updatedHistory));
                    return updatedHistory;
                });
                setIsLoading(false);
            }
    
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log("Translation cancelled by user.");
                setIsLoading(false);
                return;
            }
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showNotification(t('notifications.translationFailed', { errorMessage }), 'error');
            if (err instanceof Error && (err.message.includes('select an offline model') || err.message.includes('API Key is not set') || err.message.includes('API URL is not set'))) {
                setIsSettingsOpen(true);
            }
            console.error(err);
            setIsLoading(false);
        } finally {
            if (!isOfflineModeEnabled && translationAbortControllerRef.current === controller) {
                translationAbortControllerRef.current = null;
            }
        }
    }, [sourceLang, targetLang, apiKey, modelName, isOnline, isOfflineModeEnabled, offlineModelName, isOfflineModelReady, isOfflineModelInitializing, showNotification, onlineProvider, openaiApiUrl, isTwoStepJpCn, t, i18n, getOrCreateWorker]);

    const performReverseTranslate = useCallback(async (textToTranslate: string) => {
        if (!textToTranslate.trim()) {
            setTranslatedText('');
            return;
        }

        if (translationAbortControllerRef.current) {
            translationAbortControllerRef.current.abort();
        }
        const controller = new AbortController();
        translationAbortControllerRef.current = controller;

        setIsLoading(true);
        setTranslatedText('');

        try {
            // SWAPPED LANGUAGES for reverse translation
            const sourceLangEn = i18n.t(targetLang.name, { lng: 'en' });
            const targetLangEn = i18n.t(sourceLang.name, { lng: 'en' });

            if (isOfflineModeEnabled) {
                if (!offlineModelName) throw new Error('Please select an offline model in settings.');
                if (isOfflineModelInitializing) throw new Error('Offline model is still initializing.');
                if (!isOfflineModelReady) throw new Error('Selected offline model is not ready.');
                
                const worker = getOrCreateWorker();
                worker.postMessage({
                    type: 'translate',
                    payload: {
                        text: textToTranslate,
                        sourceLang: sourceLangEn,
                        targetLang: targetLangEn,
                        sourceLangCode: targetLang.code, // SWAPPED
                        targetLangCode: sourceLang.code, // SWAPPED
                        isTwoStepEnabled: isTwoStepJpCn,
                    }
                });
            } else { // Online mode
                if (!isOnline) throw new Error("You are offline. Enable offline mode or connect to the internet.");

                let finalResult = '';
                const onChunk = (chunk: string) => {
                    finalResult += chunk;
                    setTranslatedText(prev => prev.length === 0 ? chunk.trimStart() : prev + chunk);
                };

                if (onlineProvider === 'openai') {
                    if (!apiKey) throw new Error("OpenAI API Key is not set.");
                    if (!openaiApiUrl) throw new Error("OpenAI API URL is not set.");
                    finalResult = await translateTextOpenAIStream(textToTranslate, sourceLangEn, targetLangEn, apiKey, modelName, openaiApiUrl, onChunk, controller.signal);
                } else {
                    if (!apiKey) throw new Error("Gemini API Key is not set.");
                    finalResult = await translateTextGeminiStream(textToTranslate, sourceLangEn, targetLangEn, apiKey, modelName, onChunk, controller.signal);
                }

                const newHistoryItem: TranslationHistoryItem = {
                    id: Date.now(), inputText: textToTranslate, translatedText: finalResult, sourceLang: targetLang, targetLang: sourceLang, // SWAPPED
                };
                setHistory(prevHistory => {
                    const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                    localStorage.setItem('translation-history', JSON.stringify(updatedHistory));
                    return updatedHistory;
                });
                setIsLoading(false);
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log("Reverse translation cancelled.");
                setIsLoading(false);
                return;
            }
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showNotification(t('notifications.translationFailed', { errorMessage }), 'error');
            console.error(err);
            setIsLoading(false);
        } finally {
            if (!isOfflineModeEnabled && translationAbortControllerRef.current === controller) {
                translationAbortControllerRef.current = null;
            }
        }
    }, [targetLang, sourceLang, apiKey, modelName, isOnline, isOfflineModeEnabled, offlineModelName, isOfflineModelReady, isOfflineModelInitializing, showNotification, onlineProvider, openaiApiUrl, isTwoStepJpCn, t, i18n, getOrCreateWorker]);

    useEffect(() => {
        messageHandlerRef.current = (event: MessageEvent) => {
            const { type, payload } = event.data;
            switch(type) {
                case 'init_done':
                    setIsOfflineModelInitialized(true);
                    showNotification(t('notifications.offlineModelInitSuccess', { modelIdentifier: payload.modelIdentifier }), 'success');
                    setIsOfflineModelInitializing(false);
                    break;
                case 'init_error':
                    setIsOfflineModelInitialized(false);
                    showNotification(payload.error || t('notifications.offlineModelInitFailed'), 'error');
                    console.error('Offline model init failed via worker:', payload.error);
                    setIsOfflineModelInitializing(false);
                    break;
                case 'unload_done':
                    setIsOfflineModelInitialized(false);
                    setIsOfflineModelInitializing(false);
                    break;
                case 'translation_chunk':
                    setTranslatedText(prev => prev.length === 0 ? payload.chunk.trimStart() : prev + payload.chunk);
                    break;
                case 'translation_done': {
                    const currentSourceLang = isReverseTranslateRef.current ? targetLang : sourceLang;
                    const currentTargetLang = isReverseTranslateRef.current ? sourceLang : targetLang;
                    const newHistoryItem: TranslationHistoryItem = {
                        id: Date.now(), inputText, translatedText: payload.result, sourceLang: currentSourceLang, targetLang: currentTargetLang,
                    };
                    setHistory(prevHistory => {
                        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                        localStorage.setItem('translation-history', JSON.stringify(updatedHistory));
                        return updatedHistory;
                    });
                    setIsLoading(false);
                    break;
                }
                case 'translation_error':
                    showNotification(t('notifications.translationFailed', { errorMessage: payload.error }), 'error');
                    setIsLoading(false);
                    break;
                case 'translation_cancelled':
                    setIsLoading(false);
                    break;
                case 'extract_text_done':
                    setInputText(payload.text);
                    setTranslatedText('');
                    if (!payload.text.trim()) {
                        showNotification(t('notifications.noTextInImage'), "error");
                    }
                    setIsLoading(false);
                    break;
                case 'extract_text_error':
                    showNotification(t('notifications.imageProcessingFailed', { errorMessage: payload.error }), 'error');
                    setInputText('');
                    setIsLoading(false);
                    break;
                case 'transcribe_done':
                    setIsTranscribing(false);
                    const transcribedText = payload.text?.trim() || '';
                    setIsLoading(false);
                    if (transcribedText) {
                        setInputText(transcribedText);
                        if (isAwaitingAstTranslation) {
                            setIsAwaitingAstTranslation(false);
                            performReverseTranslate(transcribedText);
                        }
                    } else {
                        setInputText(t('notifications.transcriptionFailedEmpty'));
                        setIsAwaitingAstTranslation(false);
                    }
                    break;
                case 'transcribe_error':
                    setIsTranscribing(false);
                    const errorMessage = payload.error || 'Unknown transcription error.';
                    showNotification(t('notifications.transcriptionFailed', { errorMessage }), 'error');
                    setInputText(t('notifications.transcriptionFailed', { errorMessage }));
                    setIsLoading(false);
                    setIsAwaitingAstTranslation(false);
                    break;
            }
        };
    }, [t, showNotification, inputText, sourceLang, targetLang, isAwaitingAstTranslation, performReverseTranslate, isReverseTranslateRef]);
    
    // --- Whisper Worker Logic (Offline ASR) ---
    const checkAllAsrCacheStatus = useCallback(async () => {
        const statuses: Record<string, boolean> = {};
        for (const model of ASR_MODELS) {
            statuses[model.id] = await checkAsrModelCacheStatus(model.id);
        }
        return statuses;
    }, []);

    const onAsrWorkerMessage = useCallback((e: MessageEvent<AppMessage>) => {
        const { type, payload } = e.data;
        switch (type) {
            case 'progress':
                if (payload.status === 'progress' || payload.status === 'download') {
                    setAsrLoadingProgress({ file: payload.file, progress: payload.progress });
                }
                break;
            case 'error':
                showNotification(payload, 'error');
                setInputText(t('notifications.transcriptionFailed', { errorMessage: payload }));
                setIsAsrInitializing(false);
                setIsTranscribing(false);
                break;
            case 'loaded':
                setIsAsrInitialized(true);
                setIsAsrInitializing(false);
                checkAllAsrCacheStatus().then(setAsrModelsCacheStatus);
                break;
            case 'unloaded':
                setIsAsrInitialized(false);
                showNotification(t('notifications.asrModelUnloaded'), 'info');
                break;
            case 'transcription-partial':
                setInputText(payload);
                break;
            case 'transcription':
                setIsTranscribing(false);
                const transcribedText = (payload || '').trim();
                if (transcribedText) {
                    setInputText(transcribedText);
                    if (isReverseTranslateRef.current) {
                        performReverseTranslate(transcribedText);
                        isReverseTranslateRef.current = false;
                    }
                } else {
                    setInputText(t('notifications.transcriptionFailedEmpty'));
                    isReverseTranslateRef.current = false;
                }
                break;
            case 'log':
                console.log('[ASR Worker]:', payload);
                break;
            default:
                break;
        }
    }, [showNotification, checkAllAsrCacheStatus, t, performReverseTranslate]);

    const initializeAsrWorker = useCallback(() => {
        if (asrWorkerRef.current) {
            asrWorkerRef.current.terminate();
        }
        const newWorker = new Worker(new URL('./services/asr.worker.ts', import.meta.url), {
            type: 'module',
        });
        newWorker.addEventListener('message', onAsrWorkerMessage);
        asrWorkerRef.current = newWorker;
        console.log('ASR Worker initialized.');
    }, [onAsrWorkerMessage]);


    // Effect to manage ASR Worker creation and destruction, ensuring listeners are always up-to-date
    useEffect(() => {
        if (isOfflineAsrEnabled) {
            initializeAsrWorker();
        }
        
        // Cleanup function for when the component unmounts or offline ASR is disabled
        return () => {
            if (asrWorkerRef.current) {
                console.log('Cleaning up ASR worker.');
                asrWorkerRef.current.terminate();
                asrWorkerRef.current = null;
                setIsAsrInitialized(false);
                setIsAsrInitializing(false);
            }
        };
    }, [isOfflineAsrEnabled, initializeAsrWorker]);

    // Effect to auto-load a cached ASR model when it's selected and the worker is ready
    useEffect(() => {
        if (isOfflineAsrEnabled && asrWorkerRef.current && asrModelId && !isAsrInitialized && !isAsrInitializing) {
            const loadModel = async () => {
                const isCached = await checkAsrModelCacheStatus(asrModelId);
                if (isCached) {
                    const model = ASR_MODELS.find(m => m.id === asrModelId);
                    if (model) {
                        console.log(`Auto-loading cached ASR model: ${model.id}`);
                        setIsAsrInitializing(true);
                        setAsrLoadingProgress({ file: '', progress: 0 });
                        asrWorkerRef.current.postMessage({
                            type: 'load',
                            payload: { modelId: model.id, quantization: model.quantization }
                        });
                    }
                }
            };
            loadModel();
        }
    }, [isOfflineAsrEnabled, asrModelId, isAsrInitialized, isAsrInitializing]);


    // --- Common Effects ---
    useEffect(() => {
        const fetchStatuses = async () => {
            const statuses: Record<string, DownloadProgress> = {};
            for (const model of OFFLINE_MODELS) {
                if (model.value) {
                     statuses[model.value] = await downloadManager.getStatus(model.value);
                }
            }
            setDownloadProgress(statuses);
        };
        fetchStatuses();
        
        checkAllAsrCacheStatus().then(statuses => {
            setAsrModelsCacheStatus(statuses);
        });

    }, [checkAllAsrCacheStatus]); 

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    useEffect(() => {
        // Load settings from localStorage
        const savedApiKey = localStorage.getItem('api-key');
        if (savedApiKey) setApiKey(savedApiKey);
        
        const savedModelName = localStorage.getItem('model-name');
        if (savedModelName) setModelName(savedModelName);

        const savedProvider = localStorage.getItem('online-provider');
        if (savedProvider) setOnlineProvider(savedProvider);

        const savedUrl = localStorage.getItem('openai-api-url');
        if (savedUrl) setOpenaiApiUrl(savedUrl);

        const savedHfApiKey = localStorage.getItem('hf-api-key');
        if (savedHfApiKey) setHuggingFaceApiKey(savedHfApiKey);
        
        const savedOfflineModel = localStorage.getItem('offline-model-name');
        if (savedOfflineModel) setOfflineModelName(savedOfflineModel);

        const savedOfflineMode = localStorage.getItem('offline-mode-enabled');
        if (savedOfflineMode) setIsOfflineModeEnabled(JSON.parse(savedOfflineMode));
        
        const savedTwoStep = localStorage.getItem('is-two-step-jp-cn-enabled');
        if (savedTwoStep) setIsTwoStepJpCn(JSON.parse(savedTwoStep));
        
        const savedTtsEnabled = localStorage.getItem('tts-enabled');
        if (savedTtsEnabled) setIsOfflineTtsEnabled(JSON.parse(savedTtsEnabled));

        const savedTtsVoice = localStorage.getItem('tts-voice-uri');
        if (savedTtsVoice) setOfflineTtsVoiceURI(savedTtsVoice);

        const savedTtsRate = localStorage.getItem('tts-rate');
        if (savedTtsRate) setOfflineTtsRate(JSON.parse(savedTtsRate));

        const savedTtsPitch = localStorage.getItem('tts-pitch');
        if (savedTtsPitch) setOfflineTtsPitch(JSON.parse(savedTtsPitch));

        const savedMaxTokens = localStorage.getItem('offline-max-tokens');
        if (savedMaxTokens) setOfflineMaxTokens(JSON.parse(savedMaxTokens));

        const savedTopK = localStorage.getItem('offline-top-k');
        if (savedTopK) setOfflineTopK(JSON.parse(savedTopK));

        const savedTemp = localStorage.getItem('offline-temperature');
        if (savedTemp) setOfflineTemperature(JSON.parse(savedTemp));
        
        const savedSeed = localStorage.getItem('offline-random-seed');
        if (savedSeed) setOfflineRandomSeed(JSON.parse(savedSeed));

        const savedAudio = localStorage.getItem('offline-support-audio');
        if (savedAudio) setOfflineSupportAudio(JSON.parse(savedAudio));

        const savedImages = localStorage.getItem('offline-max-num-images');
        if (savedImages) setOfflineMaxNumImages(JSON.parse(savedImages));

        // ASR Settings
        const savedAsrEnabled = localStorage.getItem('is-offline-asr-enabled');
        if (savedAsrEnabled) setIsOfflineAsrEnabled(JSON.parse(savedAsrEnabled));

        const savedWebSpeechEnabled = localStorage.getItem('is-web-speech-api-enabled');
        if (savedWebSpeechEnabled) setIsWebSpeechApiEnabled(JSON.parse(savedWebSpeechEnabled));

        const savedAsrModel = localStorage.getItem('asr-model-id');
        if (savedAsrModel) setAsrModelId(savedAsrModel);

        const savedNoiseCancellation = localStorage.getItem('is-noise-cancellation-enabled');
        if (savedNoiseCancellation) setIsNoiseCancellationEnabled(JSON.parse(savedNoiseCancellation));

        const savedAudioGain = localStorage.getItem('audio-gain-value');
        if (savedAudioGain) setAudioGainValue(JSON.parse(savedAudioGain));

        const savedCustomModels = localStorage.getItem('custom-offline-models');
        if (savedCustomModels) setCustomModels(JSON.parse(savedCustomModels));

        const savedOcrModel = localStorage.getItem('selected-ocr-model');
        if (savedOcrModel && Object.prototype.hasOwnProperty.call(OCR_MODELS, savedOcrModel)) {
            setSelectedOcrModel(savedOcrModel as keyof typeof OCR_MODELS);
        }

        try {
            const savedHistory = localStorage.getItem('translation-history');
            if (savedHistory) setHistory(JSON.parse(savedHistory));
        } catch (err: any) {
            console.error('Failed to load translation history:', err);
        }
    }, []);

    useEffect(() => {
        const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    // Logic to load/unload MediaPipe LLM
    useEffect(() => {
        const modelToLoad = isModelDownloaded ? offlineModelName : null;
    
        if (!isOfflineModeEnabled || !modelToLoad) {
            if ((isOfflineModelInitialized || isOfflineModelInitializing) && workerRef.current) {
                console.log('Requesting offline model unload.');
                workerRef.current.postMessage({ type: 'unload' });
            }
            return;
        }

        const initModel = async () => {
            setIsOfflineModelInitializing(true);
            setIsOfflineModelInitialized(false);
            try {
                const modelBlob = await downloadManager.getModelAsBlob(modelToLoad);
                if (!modelBlob) {
                    throw new Error(`Model blob for ${modelToLoad} not found.`);
                }
                
                const options = {
                    maxTokens: offlineMaxTokens,
                    topK: offlineTopK,
                    temperature: offlineTemperature,
                    randomSeed: offlineRandomSeed,
                    supportAudio: offlineSupportAudio,
                    maxNumImages: offlineMaxNumImages,
                };
                
                const worker = getOrCreateWorker();
                worker.postMessage({
                    type: 'init',
                    payload: { modelBlob, modelSource: modelToLoad, options }
                });

            } catch (err) {
                const message = err instanceof Error ? err.message : t('notifications.offlineModelInitFailed');
                showNotification(message, 'error');
                console.error('Offline model init failed (main thread):', err);
                setIsOfflineModelInitialized(false);
                setIsOfflineModelInitializing(false);
            }
        };
        
        initModel();
    
    }, [
        isModelDownloaded, offlineModelName, isOfflineModeEnabled, 
        showNotification, t, getOrCreateWorker,
        offlineMaxTokens, offlineTopK, offlineTemperature, offlineRandomSeed,
        offlineSupportAudio, offlineMaxNumImages
    ]);


    const handleTranslate = useCallback(() => {
        performTranslate(inputText);
    }, [inputText, performTranslate]);

    const handleCancelTranslation = useCallback(() => {
        if (isOfflineModeEnabled) {
            if (workerRef.current) {
                workerRef.current.postMessage({ type: 'cancel_translation' });
            }
        } else {
            translationAbortControllerRef.current?.abort();
        }
        if (audioAbortControllerRef.current) {
            audioAbortControllerRef.current.abort();
            audioAbortControllerRef.current = null;
        }
    }, [isOfflineModeEnabled]);

    const handleSwapLanguages = useCallback(() => {
        if (sourceLang.code === 'auto') return;
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    }, [sourceLang, targetLang, inputText, translatedText]);

    const handleSpeak = useCallback(async (gender: 'female' | 'male') => {
        if (!translatedText) return;

        // Stop any current speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (isSpeaking && (isOfflineTtsEnabled || speakingGender === gender)) {
                setIsSpeaking(false);
                setSpeakingGender(null);
                return;
            }
        }

        setIsSpeaking(true);
        setSpeakingGender(gender); // Simplified logic for gender UI state

        // Browser/Offline TTS
        if (!('speechSynthesis' in window)) {
             setIsSpeaking(false);
             setSpeakingGender(null);
             return;
        }

        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = targetLang.code;

        if (isOfflineTtsEnabled) {
            const selectedVoice = voices.find(v => v.voiceURI === offlineTtsVoiceURI);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.rate = offlineTtsRate;
            utterance.pitch = offlineTtsPitch;
        } else {
            const langVoices = voices.filter(v => v.lang.startsWith(targetLang.code));
            if (langVoices.length > 0) {
                const femaleVoice = langVoices.find(v => /female|women|girl|mei-jia|zira|ayumi|kyoko/i.test(v.name));
                const maleVoice = langVoices.find(v => /male|men|boy|liang|ichiro/i.test(v.name));
                let selectedVoice: SpeechSynthesisVoice | undefined;
                if (gender === 'female') {
                    selectedVoice = femaleVoice || langVoices.find(v => v !== maleVoice) || langVoices[0];
                } else {
                    selectedVoice = maleVoice || langVoices.find(v => v !== femaleVoice) || langVoices[0];
                }
                utterance.voice = selectedVoice;
            }
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeakingGender(isOfflineTtsEnabled ? null : gender);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingGender(null);
        };
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance.onerror', event);
            showNotification(t('notifications.speechError', { error: event.error }), 'error');
            setIsSpeaking(false);
            setSpeakingGender(null);
        };
        window.speechSynthesis.speak(utterance);
    }, [translatedText, targetLang, voices, isSpeaking, speakingGender, showNotification, isOfflineTtsEnabled, offlineTtsVoiceURI, offlineTtsRate, offlineTtsPitch, t, isOnline, onlineProvider, apiKey]);

    // Recording Logic
    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (audioAbortControllerRef.current) {
            audioAbortControllerRef.current.abort();
            audioAbortControllerRef.current = null;
        }
    };

    const handleStartRecording = (onStop: (audioBlob: Blob) => void) => {
        if (isRecording || isAstRecording) return;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioChunksRef.current = [];
                onStopRecordingCallbackRef.current = onStop;
                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;

                recorder.ondataavailable = event => {
                    if (event.data.size > 0) audioChunksRef.current.push(event.data);
                };

                recorder.onstop = () => {
                    const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    if (onStopRecordingCallbackRef.current) {
                        onStopRecordingCallbackRef.current(audioBlob);
                    }
                    stream.getTracks().forEach(track => track.stop());
                    mediaRecorderRef.current = null;
                    onStopRecordingCallbackRef.current = null;
                    setIsRecording(false);
                    setIsAstRecording(false);
                };

                recorder.onerror = (event: any) => {
                    showNotification(`Recording error: ${event.error.message}`, 'error');
                    setIsRecording(false);
                    setIsAstRecording(false);
                };

                recorder.start();
            })
            .catch(err => {
                showNotification(`Could not start recording: ${err.message}`, 'error');
                setIsRecording(false);
                setIsAstRecording(false);
            });
    };

    // Memoized Callbacks for Web Speech to prevent infinite loops
    const handleWebSpeechResult = useCallback((transcript: string, isFinal: boolean) => {
        setInputText(transcript);
        if (isFinal && isReverseTranslateRef.current) {
            performReverseTranslate(transcript);
            isReverseTranslateRef.current = false;
        }
    }, [performReverseTranslate]);

    const handleWebSpeechError = useCallback((error: string) => {
        showNotification(t('notifications.speechRecognitionError', { error }), 'error');
    }, [showNotification, t]);

    const handleWebSpeechEnd = useCallback(() => {
        setIsRecording(false);
        setIsAstRecording(false);
        isReverseTranslateRef.current = false;
    }, []);

    // Create a stable callback for onStart to prevent infinite loops
    const handleWebSpeechStart = useCallback(() => {
        // No-op or logic if needed
    }, []);

    const webSpeech = useWebSpeech({
        onResult: handleWebSpeechResult,
        onError: handleWebSpeechError,
        onStart: handleWebSpeechStart,
        onEnd: handleWebSpeechEnd,
    });

    const stopAllRecordings = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        } else if (webSpeech.isListening) {
            webSpeech.stopRecognition();
        }
    }, [webSpeech]);

    useEffect(() => {
        if (isRecording || isAstRecording) {
            setRecordingCountdown(30);
            countdownTimerRef.current = window.setInterval(() => {
                setRecordingCountdown(prev => {
                    if (prev !== null && prev <= 1) {
                        if (countdownTimerRef.current) {
                            clearInterval(countdownTimerRef.current);
                            countdownTimerRef.current = null;
                        }
                        stopAllRecordings();
                        return null;
                    }
                    return prev !== null ? prev - 1 : null;
                });
            }, 1000);
        } else {
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
            }
            setRecordingCountdown(null);
        }
        return () => {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        };
    }, [isRecording, isAstRecording, stopAllRecordings]);


    const handleToggleRecording = useCallback(() => {
        const isCurrentlyRecording = isRecording || (!isOfflineAsrEnabled && isWebSpeechApiEnabled && webSpeech.isListening && !isReverseTranslateRef.current);
        if (isCurrentlyRecording) {
            if (isOfflineAsrEnabled || !isWebSpeechApiEnabled) {
                handleStopRecording();
            } else {
                webSpeech.stopRecognition();
            }
        } else {
            if (isAstRecording) handleStopRecording();
            if (sourceLang.code === 'auto' && (isOfflineAsrEnabled || !isWebSpeechApiEnabled)) {
                 showNotification(t('notifications.selectLanguageError'), 'info');
                 return;
            }
            
            setTranslatedText('');
            setIsRecording(true);
            setInputText(t('translationInput.placeholderListening'));

            if (isOfflineAsrEnabled) {
                // Offline ASR Path (Whisper/Sherpa)
                handleStartRecording(async (audioBlob) => {
                    setInputText(t('notifications.transcribing'));
                    setIsTranscribing(true);
                    try {
                        const audioData = await processAudioForTranscription(audioBlob, { noiseSuppression: isNoiseCancellationEnabled, gain: audioGainValue });
                        if (asrWorkerRef.current) {
                            asrWorkerRef.current.postMessage({ 
                                type: 'transcribe', 
                                payload: { 
                                    audio: audioData, 
                                    asrLanguage: sourceLang.asrCode,
                                    promptLanguage: sourceLang.code 
                                } 
                            });
                        } else {
                            throw new Error('ASR Worker is not initialized.');
                        }
                    } catch (err) {
                        console.error(err);
                        setInputText('');
                        setIsTranscribing(false);
                        const message = err instanceof Error ? err.message : 'Transcription failed.';
                        showNotification(message, 'error');
                    }
                });
            } else if (isWebSpeechApiEnabled) { 
                webSpeech.startRecognition(sourceLang.code);
            } else if (isOfflineModeEnabled && offlineSupportAudio) {
                // Gemma 3N Audio Path
                if (isOfflineModelReady) {
                     setInputText(t('notifications.transcribing'));
                     setIsTranscribing(true);
                     handleStartRecording(async (audioBlob) => {
                        const audioData = await processAudioForTranscription(audioBlob); 
                        const tempAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const audioBuffer = tempAudioContext.createBuffer(1, audioData.length, 16000);
                        audioBuffer.copyToChannel(audioData, 0);
                        const pcmWavBlob = audioBufferToWav(audioBuffer);
                        await tempAudioContext.close();
                        
                        const worker = getOrCreateWorker();
                        worker.postMessage({ 
                            type: 'transcribe', 
                            payload: { 
                                audioData: pcmWavBlob, 
                                sourceLang: i18n.t(sourceLang.name, { lng: 'en' })
                            } 
                        });
                     });
                } else {
                     showNotification(t('notifications.offlineModelNotReadyRecording'), 'error');
                     setIsRecording(false);
                }
            } else { 
                // Online Multimodal ASR (OpenAI/Gemini)
                handleStartRecording(async (audioBlob) => {
                    setInputText(t('notifications.transcribingApi'));
                    const controller = new AbortController();
                    audioAbortControllerRef.current = controller;
                    try {
                        let transcribedText = '';
                        if (onlineProvider === 'openai') {
                            const langCode = sourceLang.code.split('-')[0];
                            transcribedText = await transcribeAudioOpenAI(audioBlob, langCode, apiKey, openaiApiUrl, controller.signal);
                        } else {
                            const langName = t(sourceLang.name, { lng: 'en' });
                            transcribedText = await transcribeAudioGemini(audioBlob, langName, apiKey, modelName, controller.signal);
                        }
                        setInputText(transcribedText);
                    } catch (err) {
                        if (err instanceof DOMException && err.name === 'AbortError') return;
                        const message = err instanceof Error ? err.message : 'Transcription failed.';
                        showNotification(message, 'error');
                        setInputText('');
                    } finally {
                        audioAbortControllerRef.current = null;
                    }
                });
            }
        }
    }, [isRecording, isAstRecording, showNotification, t, sourceLang, isOfflineAsrEnabled, webSpeech, isNoiseCancellationEnabled, audioGainValue, isWebSpeechApiEnabled, onlineProvider, apiKey, openaiApiUrl, modelName, isOfflineModeEnabled, isOfflineModelReady, offlineSupportAudio, getOrCreateWorker, i18n]);

    const handleToggleAstRecording = useCallback(() => {
        const isCurrentlyAstRecording = isAstRecording || (!isOfflineAsrEnabled && isWebSpeechApiEnabled && webSpeech.isListening && isReverseTranslateRef.current);

        if (isCurrentlyAstRecording) {
             if (isOfflineAsrEnabled || !isWebSpeechApiEnabled) {
                handleStopRecording();
            } else {
                webSpeech.stopRecognition();
            }
        } else {
            if (isRecording) handleStopRecording();
            if (targetLang.code === 'auto') {
                showNotification(t('notifications.astSelectLanguage'), 'info');
                return;
            }
            
            setInputText('');
            setTranslatedText('');
            setIsAstRecording(true);
            isReverseTranslateRef.current = true;
            
            if (isOfflineAsrEnabled) {
                 handleStartRecording(async (audioBlob) => {
                    setInputText(t('notifications.transcribing'));
                    setIsTranscribing(true);
                    try {
                        const audioData = await processAudioForTranscription(audioBlob, { noiseSuppression: isNoiseCancellationEnabled, gain: audioGainValue });
                        if (asrWorkerRef.current) {
                            asrWorkerRef.current.postMessage({ 
                                type: 'transcribe', 
                                payload: { 
                                    audio: audioData, 
                                    asrLanguage: targetLang.asrCode,
                                    promptLanguage: targetLang.code 
                                } 
                            });
                        } else {
                            throw new Error('ASR Worker is not initialized.');
                        }
                    } catch (err) {
                        console.error(err);
                        setInputText('');
                        setIsTranscribing(false);
                        isReverseTranslateRef.current = false;
                        const message = err instanceof Error ? err.message : 'Transcription failed.';
                        showNotification(message, 'error');
                    }
                });
            } else if (isWebSpeechApiEnabled) {
                webSpeech.startRecognition(targetLang.code);
            } else if (isOfflineModeEnabled && offlineSupportAudio) {
                 if (isOfflineModelReady) {
                    setIsAwaitingAstTranslation(true);
                    setInputText(t('notifications.transcribing'));
                    setIsTranscribing(true);
                    handleStartRecording(async (audioBlob) => {
                       const audioData = await processAudioForTranscription(audioBlob); 
                       const tempAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                       const audioBuffer = tempAudioContext.createBuffer(1, audioData.length, 16000);
                       audioBuffer.copyToChannel(audioData, 0);
                       const pcmWavBlob = audioBufferToWav(audioBuffer);
                       await tempAudioContext.close();
                       
                       const worker = getOrCreateWorker();
                       worker.postMessage({ 
                           type: 'transcribe', 
                           payload: { 
                               audioData: pcmWavBlob, 
                               sourceLang: i18n.t(targetLang.name, { lng: 'en' })
                           } 
                       });
                    });
               } else {
                    showNotification(t('notifications.offlineModelNotReadyRecording'), 'error');
                    setIsAstRecording(false);
                    isReverseTranslateRef.current = false;
               }
            } else {
                 handleStartRecording(async (audioBlob) => {
                    setInputText(t('notifications.transcribingApi'));
                    const controller = new AbortController();
                    audioAbortControllerRef.current = controller;
                    try {
                        let transcribedText = '';
                        if (onlineProvider === 'openai') {
                            const langCode = targetLang.code.split('-')[0];
                            transcribedText = await transcribeAudioOpenAI(audioBlob, langCode, apiKey, openaiApiUrl, controller.signal);
                        } else {
                            const langName = t(targetLang.name, { lng: 'en' });
                            transcribedText = await transcribeAudioGemini(audioBlob, langName, apiKey, modelName, controller.signal);
                        }
                        setInputText(transcribedText);
                        if (transcribedText.trim()) {
                            performReverseTranslate(transcribedText);
                        }
                    } catch (err) {
                        if (err instanceof DOMException && err.name === 'AbortError') return;
                        const message = err instanceof Error ? err.message : 'Transcription failed.';
                        showNotification(message, 'error');
                        setInputText('');
                    } finally {
                        audioAbortControllerRef.current = null;
                        isReverseTranslateRef.current = false;
                    }
                });
            }
        }
    }, [isAstRecording, isRecording, targetLang, showNotification, t, isOfflineAsrEnabled, webSpeech, isNoiseCancellationEnabled, audioGainValue, isWebSpeechApiEnabled, onlineProvider, apiKey, openaiApiUrl, modelName, isOfflineModeEnabled, offlineSupportAudio, isOfflineModelReady, getOrCreateWorker, performReverseTranslate, i18n]);

    const handleImageCaptured = useCallback(async (imageDataUrl: string) => {
        setIsCameraOpen(false);
        setIsLoading(true);
        setInputText(t('notifications.processingImage'));
        setTranslatedText('');
    
        try {
            // Priority 1: Use local OCR if it's initialized and ready.
            if (ocrEngineStatus === 'ready') {
                const image = new Image();
                image.src = imageDataUrl;
                await new Promise<void>((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = (e) => reject(e);
                });
    
                const recognitionData = await recognize(image);
                if (!recognitionData) {
                    throw new Error('OCR recognition returned no data.');
                }
                const extractedText = processOcrResult(recognitionData.result);
                setInputText(extractedText);
    
                if (extractedText.trim()) {
                    await performTranslate(extractedText);
                } else {
                    showNotification(t('notifications.noTextInImage'), 'info');
                    setTranslatedText('');
                    setIsLoading(false);
                }
                return;
            }
    
            // Fallback to other methods
            if (isOfflineModeEnabled) {
                if (!isOfflineModelReady || offlineMaxNumImages < 1) {
                    throw new Error(t('notifications.offlineImageError'));
                }
                const imageBitmap = await new Promise<ImageBitmap>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => createImageBitmap(img).then(resolve).catch(reject);
                    img.onerror = () => reject(new Error('Failed to load image for bitmap.'));
                    img.src = imageDataUrl;
                });
    
                const worker = getOrCreateWorker();
                worker.postMessage({ type: 'extractText', payload: { imageBitmap } }, [imageBitmap]);
    
            } else { // Online mode
                if (!isOnline) throw new Error(t('notifications.offlineImageTranslateError'));
                
                let result: { sourceText: string, translatedText: string };
                const targetLangEn = i18n.t(targetLang.name, { lng: 'en' });
                if (onlineProvider === 'openai') {
                    if (!apiKey) throw new Error("OpenAI API Key is not set.");
                    if (!openaiApiUrl) throw new Error("OpenAI API URL is not set.");
                    result = await translateImageOpenAI(imageDataUrl, targetLangEn, apiKey, modelName, openaiApiUrl);
                } else {
                    if (!apiKey) throw new Error("Gemini API Key is not set.");
                    result = await translateImageGemini(imageDataUrl, targetLangEn, apiKey, modelName);
                }
                
                setInputText(result.sourceText);
                setTranslatedText(result.translatedText);
    
                const newHistoryItem: TranslationHistoryItem = {
                    id: Date.now(), inputText: result.sourceText, translatedText: result.translatedText, sourceLang, targetLang,
                };
                setHistory(prevHistory => {
                    const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                    localStorage.setItem('translation-history', JSON.stringify(updatedHistory));
                    return updatedHistory;
                });
                setIsLoading(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showNotification(t('notifications.imageProcessingFailed', { errorMessage }), 'error');
            setInputText(''); 
            setIsLoading(false);
        }
    }, [isOfflineModeEnabled, isOfflineModelReady, offlineMaxNumImages, isOnline, apiKey, modelName, targetLang, sourceLang, showNotification, onlineProvider, openaiApiUrl, t, i18n, getOrCreateWorker, ocrEngineStatus, recognize, performTranslate]);

    const handleSaveSettings = (
        newApiKey: string, 
        newModelName: string, 
        newHfApiKey: string, 
        newOfflineModel: string,
        newAsrModelId: string, 
        isOfflineEnabled: boolean,
        newIsOfflineAsrEnabled: boolean,
        newIsWebSpeechApiEnabled: boolean,
        newOnlineProvider: string,
        newOpenaiApiUrl: string,
        newIsTtsEnabled: boolean,
        newTtsVoiceURI: string,
        newTtsRate: number,
        newTtsPitch: number,
        newIsTwoStepJpCn: boolean,
        newOfflineMaxTokens: number,
        newOfflineTopK: number,
        newOfflineTemperature: number,
        newOfflineRandomSeed: number,
        newOfflineSupportAudio: boolean,
        newOfflineMaxNumImages: number,
        newIsNoiseCancellationEnabled: boolean,
        newAudioGainValue: number,
        newSelectedOcrModel: keyof typeof OCR_MODELS,
    ) => {
        setApiKey(newApiKey);
        setModelName(newModelName);
        setOnlineProvider(newOnlineProvider);
        setOpenaiApiUrl(newOpenaiApiUrl);
        setHuggingFaceApiKey(newHfApiKey);
        setOfflineModelName(newOfflineModel);
        setAsrModelId(newAsrModelId);
        setIsOfflineModeEnabled(isOfflineEnabled);
        setIsOfflineAsrEnabled(newIsOfflineAsrEnabled);
        setIsWebSpeechApiEnabled(newIsWebSpeechApiEnabled);
        setIsTwoStepJpCn(newIsTwoStepJpCn);
        setIsOfflineTtsEnabled(newIsTtsEnabled);
        setOfflineTtsVoiceURI(newTtsVoiceURI);
        setOfflineTtsRate(newTtsRate);
        setOfflineTtsPitch(newTtsPitch);
        setOfflineMaxTokens(newOfflineMaxTokens);
        setOfflineTopK(newOfflineTopK);
        setOfflineTemperature(newOfflineTemperature);
        setOfflineRandomSeed(newOfflineRandomSeed);
        setOfflineSupportAudio(newOfflineSupportAudio);
        setOfflineMaxNumImages(newOfflineMaxNumImages);
        setIsNoiseCancellationEnabled(newIsNoiseCancellationEnabled);
        setAudioGainValue(newAudioGainValue);
        setSelectedOcrModel(newSelectedOcrModel);
        
        localStorage.setItem('api-key', newApiKey);
        localStorage.setItem('model-name', newModelName);
        localStorage.setItem('online-provider', newOnlineProvider);
        localStorage.setItem('openai-api-url', newOpenaiApiUrl);
        localStorage.setItem('hf-api-key', newHfApiKey);
        localStorage.setItem('offline-model-name', newOfflineModel);
        localStorage.setItem('asr-model-id', newAsrModelId);
        localStorage.setItem('offline-mode-enabled', JSON.stringify(isOfflineEnabled));
        localStorage.setItem('is-offline-asr-enabled', JSON.stringify(newIsOfflineAsrEnabled));
        localStorage.setItem('is-web-speech-api-enabled', JSON.stringify(newIsWebSpeechApiEnabled));
        localStorage.setItem('is-two-step-jp-cn-enabled', JSON.stringify(newIsTwoStepJpCn));
        localStorage.setItem('tts-enabled', JSON.stringify(newIsTtsEnabled));
        localStorage.setItem('tts-voice-uri', newTtsVoiceURI);
        localStorage.setItem('tts-rate', JSON.stringify(newTtsRate));
        localStorage.setItem('tts-pitch', JSON.stringify(newTtsPitch));
        localStorage.setItem('offline-max-tokens', JSON.stringify(newOfflineMaxTokens));
        localStorage.setItem('offline-top-k', JSON.stringify(newOfflineTopK));
        localStorage.setItem('offline-temperature', JSON.stringify(newOfflineTemperature));
        localStorage.setItem('offline-random-seed', JSON.stringify(newOfflineRandomSeed));
        localStorage.setItem('offline-support-audio', JSON.stringify(newOfflineSupportAudio));
        localStorage.setItem('offline-max-num-images', JSON.stringify(newOfflineMaxNumImages));
        localStorage.setItem('is-noise-cancellation-enabled', JSON.stringify(newIsNoiseCancellationEnabled));
        localStorage.setItem('audio-gain-value', JSON.stringify(newAudioGainValue));
        localStorage.setItem('selected-ocr-model', newSelectedOcrModel);
    };

    const handleSelectHistory = (item: TranslationHistoryItem) => {
        setInputText(item.inputText);
        setTranslatedText(item.translatedText);
        setSourceLang(item.sourceLang);
        setTargetLang(item.targetLang);
        setIsHistoryOpen(false);
    };

    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem('translation-history');
    };

    const updateProgress = useCallback((modelName: string, progress: DownloadProgress) => {
        setDownloadProgress(prev => ({ ...prev, [modelName]: progress }));
    }, []);

    const handleStartDownload = useCallback((modelName: string, url: string) => {
        downloadManager.startDownload(modelName, url, huggingFaceApiKey, (p) => updateProgress(modelName, p));
    }, [huggingFaceApiKey, updateProgress]);

    const handleResumeDownload = useCallback((modelName: string, url: string) => {
        downloadManager.resumeDownload(modelName, url, huggingFaceApiKey, (p) => updateProgress(modelName, p));
    }, [huggingFaceApiKey, updateProgress]);
    
    const handlePauseDownload = useCallback((modelName: string) => {
        downloadManager.pauseDownload(modelName);
    }, []);

    const handleDeleteModel = useCallback(async (modelName: string) => {
        await downloadManager.deleteModel(modelName);
        updateProgress(modelName, { downloaded: 0, total: 0, percent: 0, status: 'not_started' });
    }, [updateProgress]);

    const handleDownloadAsrModel = useCallback(async (modelId: string) => {
        if (isAsrInitializing || !asrWorkerRef.current) return;
        
        const model = ASR_MODELS.find(m => m.id === modelId);
        if (!model) {
            showNotification(`ASR model ${modelId} not found.`, 'error');
            return;
        }
        
        setIsAsrInitializing(true);
        setAsrLoadingProgress({ file: '', progress: 0 });
        asrWorkerRef.current.postMessage({
            type: 'load',
            payload: { modelId: model.id, quantization: model.quantization }
        });
    }, [isAsrInitializing, showNotification]);

    const handleClearAsrCache = useCallback(async () => {
        try {
            if (asrWorkerRef.current) {
                asrWorkerRef.current.terminate();
                asrWorkerRef.current = null;
            }
            setIsAsrInitialized(false);
            await clearAsrCache();
            checkAllAsrCacheStatus().then(setAsrModelsCacheStatus);
            showNotification(t('notifications.asrModelDeleted'), 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            showNotification(message, 'error');
        }
    }, [checkAllAsrCacheStatus, showNotification, t]);

    return (
        <div className="bg-slate-100 h-full flex flex-col">
             <div className="w-full h-full max-w-6xl mx-auto flex-grow flex flex-col landscape:flex-row p-2 landscape:p-4 gap-4">
                <main className="flex-1 landscape:h-full flex flex-col min-h-0 min-w-0">
                     <TranslationOutput
                        translatedText={translatedText}
                        targetLang={targetLang}
                        setTargetLang={setTargetLang}
                        isLoading={isLoading}
                        onSpeak={handleSpeak}
                        onSwapLanguages={handleSwapLanguages}
                        onOpenHistory={() => setIsHistoryOpen(true)}
                        onClearText={() => setTranslatedText('')}
                        isOfflineModeEnabled={isOfflineModeEnabled}
                        isOfflineModelInitializing={isOfflineModelInitializing}
                        isOfflineModelReady={isOfflineModelReady}
                        offlineModelName={offlineModelName}
                        isSpeaking={isSpeaking}
                        speakingGender={speakingGender}
                        onlineProvider={onlineProvider}
                        isOfflineTtsEnabled={isOfflineTtsEnabled}
                        isAstRecording={isAstRecording}
                        onToggleAstRecording={handleToggleAstRecording}
                        recordingCountdown={recordingCountdown}
                     />
                </main>
    
                <div className="flex-1 landscape:h-full flex flex-col min-h-0 min-w-0">
                    <TranslationInput
                        inputText={inputText}
                        setInputText={setInputText}
                        sourceLang={sourceLang}
                        setSourceLang={setSourceLang}
                        isLoading={isLoading || isOfflineModelInitializing || isAsrInitializing || ocrEngineStatus === 'initializing' || isTranscribing}
                        onTranslate={handleTranslate}
                        onCancel={handleCancelTranslation}
                        isRecording={isRecording}
                        onToggleRecording={handleToggleRecording}
                        onOpenCamera={() => setIsCameraOpen(true)}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        isOnline={isOnline}
                        isOfflineModeEnabled={isOfflineModeEnabled}
                        isOfflineModelReady={isOfflineModelReady}
                        recordingCountdown={recordingCountdown}
                    />
                </div>
            </div>
            
            {notification && (
                <div 
                    className={`fixed top-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded z-20 shadow-lg text-white ${
                        notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    role="alert"
                >
                    {notification.message}
                </div>
            )}

            {isCameraOpen && <CameraView onClose={() => setIsCameraOpen(false)} onImageCaptured={handleImageCaptured} />}
            
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSaveSettings}
                currentApiKey={apiKey}
                currentModelName={modelName}
                currentOnlineProvider={onlineProvider}
                currentOpenaiApiUrl={openaiApiUrl}
                currentHuggingFaceApiKey={huggingFaceApiKey}
                currentOfflineModelName={offlineModelName}
                currentIsOfflineModeEnabled={isOfflineModeEnabled}
                currentIsTwoStepJpCnEnabled={isTwoStepJpCn}
                downloadProgress={downloadProgress}
                onStartDownload={handleStartDownload}
                onResumeDownload={handleResumeDownload}
                onPauseDownload={handlePauseDownload}
                onDeleteModel={handleDeleteModel}
                isOfflineModelInitializing={isOfflineModelInitializing}
                voices={voices}
                targetLang={targetLang}
                currentIsOfflineTtsEnabled={isOfflineTtsEnabled}
                currentOfflineTtsVoiceURI={offlineTtsVoiceURI}
                currentOfflineTtsRate={offlineTtsRate}
                currentOfflineTtsPitch={offlineTtsPitch}
                currentOfflineMaxTokens={offlineMaxTokens}
                currentOfflineTopK={offlineTopK}
                currentOfflineTemperature={offlineTemperature}
                currentOfflineRandomSeed={offlineRandomSeed}
                currentOfflineSupportAudio={offlineSupportAudio}
                currentOfflineMaxNumImages={offlineMaxNumImages}
                // ASR Props
                currentIsOfflineAsrEnabled={isOfflineAsrEnabled}
                currentIsWebSpeechApiEnabled={isWebSpeechApiEnabled}
                currentAsrModelId={asrModelId}
                currentIsNoiseCancellationEnabled={isNoiseCancellationEnabled}
                currentAudioGainValue={audioGainValue}
                asrModelsCacheStatus={asrModelsCacheStatus}
                isAsrInitializing={isAsrInitializing}
                asrLoadingProgress={asrLoadingProgress}
                onDownloadAsrModel={handleDownloadAsrModel}
                onClearAsrCache={handleClearAsrCache}
                // OCR Props
                ocrEngineStatus={ocrEngineStatus}
                ocrEngineError={ocrEngineError}
                onInitializeOcr={initializeOcr}
                currentSelectedOcrModel={selectedOcrModel}
            />

            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
            />
        </div>
    );
};

export default App;

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TranslationInput from './components/TranslationInput';
import TranslationOutput from './components/TranslationOutput';
import CameraView from './components/CameraView';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import { translateTextStream as translateTextGeminiStream, translateImage as translateImageGemini } from './services/geminiService';
import { translateTextStream as translateTextOpenAIStream, translateImage as translateImageOpenAI } from './services/openaiService';
import { initializeOfflineModel, unloadOfflineModel, translateOfflineStream, transcribeAudioOffline, extractTextFromImageOffline } from './services/offlineService';
import { downloadManager, type DownloadProgress } from './services/downloadManager';
import type { Language, TranslationHistoryItem } from './types';
import { LANGUAGES, OFFLINE_MODELS } from './constants';

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


const App: React.FC = () => {
    const { t } = useTranslation();
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[0]); // Default to Auto Detect
    const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[6]); // Default to Japanese
    const [isLoading, setIsLoading] = useState(false);
    
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

    // Offline recording countdown state
    const [recordingCountdown, setRecordingCountdown] = useState<number | null>(null);

    type NotificationType = 'error' | 'success';
    interface Notification {
        message: string;
        type: NotificationType;
    }
    const [notification, setNotification] = useState<Notification | null>(null);
    const notificationTimerRef = useRef<number | null>(null);

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
    // NOTE: Ref to hold the Web Audio API context for real-time noise reduction.
    const audioProcessingContextRef = useRef<AudioContext | null>(null);
    // Ref for the offline recording countdown timer
    const countdownTimerRef = useRef<number | null>(null);
    // Ref for the translation cancellation controller
    const translationAbortControllerRef = useRef<AbortController | null>(null);


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
    }, []);


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

    const isModelDownloaded = isOfflineModeEnabled && !!offlineModelName && downloadProgress[offlineModelName]?.status === 'completed';
    const isOfflineModelReady = isModelDownloaded && isOfflineModelInitialized;

    useEffect(() => {
        const modelToLoad = isModelDownloaded ? offlineModelName : null;
        const modelIdentifier = offlineModelName;

        if (modelToLoad && !isOfflineModelInitialized && !isOfflineModelInitializing) {
            const initModel = async () => {
                setIsOfflineModelInitializing(true);
                try {
                    await initializeOfflineModel(modelToLoad);
                    setIsOfflineModelInitialized(true);
                    showNotification(t('notifications.offlineModelInitSuccess', { modelIdentifier }), 'success');
                } catch (err) {
                    const message = err instanceof Error ? err.message : t('notifications.offlineModelInitFailed');
                    showNotification(message, 'error');
                    console.error('Offline model init failed', err);
                    setIsOfflineModelInitialized(false);
                } finally {
                    setIsOfflineModelInitializing(false);
                }
            };
            initModel();
        }

        if (!isOfflineModeEnabled || !modelToLoad) {
            if (isOfflineModelInitialized || isOfflineModelInitializing) {
                const unload = async () => {
                    await unloadOfflineModel();
                    setIsOfflineModelInitialized(false);
                    setIsOfflineModelInitializing(false);
                };
                unload();
            }
        }
    }, [isModelDownloaded, offlineModelName, isOfflineModeEnabled, isOfflineModelInitialized, isOfflineModelInitializing, showNotification, t]);


    const performTranslate = useCallback(async (textToTranslate: string) => {
        if (!textToTranslate.trim()) {
            setTranslatedText('');
            return;
        }

        // Cancel any previous, ongoing translation before starting a new one.
        if (translationAbortControllerRef.current) {
            translationAbortControllerRef.current.abort();
        }
        const controller = new AbortController();
        translationAbortControllerRef.current = controller;
    
        setIsLoading(true);
        setTranslatedText(''); // Clear previous translation before streaming
    
        let finalResult = '';
        const onChunk = (chunk: string) => {
            finalResult += chunk;
            setTranslatedText(prev => prev + chunk);
        };
    
        try {
            if (isOfflineModeEnabled) {
                if (!offlineModelName) throw new Error('Please select an offline model in settings.');
                if (isOfflineModelInitializing) throw new Error('Offline model is still initializing.');
                if (!isOfflineModelReady) throw new Error('Selected offline model is not ready.');
                
                finalResult = await translateOfflineStream(textToTranslate, t(sourceLang.name), t(targetLang.name), isTwoStepJpCn, onChunk, controller.signal);
            } else { // Online mode
                if (!isOnline) throw new Error("You are offline. Enable offline mode or connect to the internet.");
    
                if (onlineProvider === 'openai') {
                    if (!apiKey) throw new Error("OpenAI API Key is not set. Please add it in the settings.");
                    if (!openaiApiUrl) throw new Error("OpenAI API URL is not set. Please add it in the settings.");
                    finalResult = await translateTextOpenAIStream(textToTranslate, t(sourceLang.name), t(targetLang.name), apiKey, modelName, openaiApiUrl, onChunk, controller.signal);
                } else { // Gemini is default
                    if (!apiKey) throw new Error("Gemini API Key is not set. Please add it in the settings.");
                    finalResult = await translateTextGeminiStream(textToTranslate, t(sourceLang.name), t(targetLang.name), apiKey, modelName, onChunk, controller.signal);
                }
            }
    
            // After stream is complete, save the final result to history
            const newHistoryItem: TranslationHistoryItem = {
                id: Date.now(), inputText: textToTranslate, translatedText: finalResult, sourceLang, targetLang,
            };
            setHistory(prevHistory => {
                const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                localStorage.setItem('translation-history', JSON.stringify(updatedHistory));
                return updatedHistory;
            });
    
        } catch (err) {
            // Do not show an error notification if the translation was cancelled by the user.
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log("Translation cancelled by user.");
                setTranslatedText(finalResult); // Show partial result
                return;
            }
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showNotification(t('notifications.translationFailed', { errorMessage }), 'error');
            if (err instanceof Error && (err.message.includes('select an offline model') || err.message.includes('API Key is not set') || err.message.includes('API URL is not set'))) {
                setIsSettingsOpen(true);
            }
            console.error(err);
        } finally {
            setIsLoading(false);
            if (translationAbortControllerRef.current === controller) {
                translationAbortControllerRef.current = null;
            }
        }
    }, [sourceLang, targetLang, apiKey, modelName, isOnline, isOfflineModeEnabled, offlineModelName, isOfflineModelReady, isOfflineModelInitializing, showNotification, onlineProvider, openaiApiUrl, isTwoStepJpCn, t]);

    const handleTranslate = useCallback(() => {
        performTranslate(inputText);
    }, [inputText, performTranslate]);

    const handleCancelTranslation = useCallback(() => {
        if (translationAbortControllerRef.current) {
            translationAbortControllerRef.current.abort();
        }
    }, []);

    const handleSwapLanguages = useCallback(() => {
        if (sourceLang.code === 'auto') return;
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    }, [sourceLang, targetLang, inputText, translatedText]);

    const handleSpeak = useCallback((gender: 'female' | 'male') => {
        if (!translatedText || !('speechSynthesis' in window)) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            // If the same button was clicked to stop, don't restart speech.
            if (isSpeaking && (isOfflineTtsEnabled || speakingGender === gender)) {
                return;
            }
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
                } else { // gender === 'male'
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

    }, [translatedText, targetLang, voices, isSpeaking, speakingGender, showNotification, isOfflineTtsEnabled, offlineTtsVoiceURI, offlineTtsRate, offlineTtsPitch, t]);

    useEffect(() => {
        if (!SpeechRecognitionImpl) return;
        const recognition = new SpeechRecognitionImpl();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = sourceLang.code === 'auto' ? 'en-US' : sourceLang.code;
        recognition.onresult = (event) => setInputText(Array.from(event.results).map(r => r[0].transcript).join(''));
        recognition.onerror = (event) => showNotification(t('notifications.speechRecognitionError', { error: event.error }), 'error');
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
        return () => recognition.stop();
    }, [sourceLang.code, showNotification, t]);
    
    useEffect(() => {
        if (!SpeechRecognitionImpl || sourceLang.code === 'auto') return;

        const recognition = new SpeechRecognitionImpl();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = sourceLang.code;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
            transcribedTextRef.current = transcript;
            setInputText(`[Speech] ${transcript}`);
        };

        recognition.onerror = (event) => {
            showNotification(t('notifications.speechRecognitionError', { error: event.error }), 'error');
            setIsAstRecording(false);
        };

        recognition.onend = () => {
            setIsAstRecording(false);
            const finalTranscript = transcribedTextRef.current.trim();
            if (finalTranscript) {
                setInputText(finalTranscript);
                performTranslate(finalTranscript);
            } else {
                setInputText('');
            }
        };
        
        astRecognitionRef.current = recognition;
        return () => recognition.stop();
    }, [sourceLang.code, showNotification, performTranslate, t]);

    const handleOnlineRecordingToggle = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setInputText('');
            setTranslatedText('');
            recognitionRef.current.start();
        }
        setIsRecording(!isRecording);
    }, [isRecording]);

    const handleOfflineRecordingToggle = useCallback(async () => {
        if (isRecording) {
            // Stop recording
            // Clear the countdown timer when manually stopping.
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
            }
            setRecordingCountdown(null);

            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            // Stop the original raw stream tracks.
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            // NOTE: Close the audio processing context to release resources.
            if (audioProcessingContextRef.current && audioProcessingContextRef.current.state !== 'closed') {
                audioProcessingContextRef.current.close();
                audioProcessingContextRef.current = null;
            }
            setIsRecording(false);
        } else {
            // Start recording
            try {
                setInputText('');
                setTranslatedText('');
                // Get the raw audio stream from the microphone.
                const rawStream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // --- START: Real-time Noise Reduction Pipeline ---
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioProcessingContextRef.current = audioContext;
                const source = audioContext.createMediaStreamSource(rawStream);
                const highPassFilter = audioContext.createBiquadFilter();
                highPassFilter.type = 'highpass';
                highPassFilter.frequency.value = 150;
                const compressor = audioContext.createDynamicsCompressor();
                compressor.threshold.value = -50;
                compressor.knee.value = 40;
                compressor.ratio.value = 12;
                compressor.attack.value = 0;
                compressor.release.value = 0.25;
                const destination = audioContext.createMediaStreamDestination();
                source.connect(highPassFilter);
                highPassFilter.connect(compressor);
                compressor.connect(destination);
                const processedStream = destination.stream;
                mediaStreamRef.current = rawStream;
                // --- END: Real-time Noise Reduction Pipeline ---

                if (typeof MediaRecorder === 'undefined') {
                    showNotification(t('notifications.mediaRecorderUnsupported'), 'error');
                    rawStream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                    return;
                }

                // NOTE: Use the processedStream for the MediaRecorder, not the rawStream.
                const recorder = new MediaRecorder(processedStream);
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                recorder.onstop = async () => {
                    setIsLoading(true);
                    setInputText(t('notifications.processingAudio'));
                    setTranslatedText('');
                    
                    if (audioChunksRef.current.length === 0) {
                        setIsLoading(false);
                        setInputText('');
                        showNotification(t('notifications.noAudioRecorded'), 'error');
                        return;
                    }

                    const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
                    audioChunksRef.current = [];

                    let wavUrl: string | null = null;
                    let postProcessingAudioContext: AudioContext | null = null;

                    try {
                        postProcessingAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const arrayBuffer = await audioBlob.arrayBuffer();
                        const originalAudioBuffer = await postProcessingAudioContext.decodeAudioData(arrayBuffer);
                        
                        const TARGET_SAMPLE_RATE = 16000;
                        let finalAudioBuffer = originalAudioBuffer;

                        if (originalAudioBuffer.sampleRate !== TARGET_SAMPLE_RATE) {
                            const frameCount = originalAudioBuffer.length * TARGET_SAMPLE_RATE / originalAudioBuffer.sampleRate;
                            const offlineContext = new OfflineAudioContext(1, frameCount, TARGET_SAMPLE_RATE);
                            const bufferSource = offlineContext.createBufferSource();
                            bufferSource.buffer = originalAudioBuffer;
                            bufferSource.connect(offlineContext.destination);
                            bufferSource.start();
                            finalAudioBuffer = await offlineContext.startRendering();
                        }
                        
                        const wavBlob = audioBufferToWav(finalAudioBuffer);
                        wavUrl = URL.createObjectURL(wavBlob);

                        const result = await transcribeAudioOffline(wavUrl, t(sourceLang.name));
                        setInputText(result);

                    } catch (err) {
                         const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while processing audio.';
                         showNotification(t('notifications.transcriptionFailed', { errorMessage }), 'error');
                         setInputText('');
                    } finally {
                        if (wavUrl) {
                            URL.revokeObjectURL(wavUrl);
                        }
                        if (postProcessingAudioContext && postProcessingAudioContext.state !== 'closed') {
                            postProcessingAudioContext.close();
                        }
                        setIsLoading(false);
                    }
                };
                
                // Start the 30-second countdown timer.
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                setRecordingCountdown(30);
                countdownTimerRef.current = window.setInterval(() => {
                    setRecordingCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
                }, 1000);

                recorder.start();
                setIsRecording(true);
            } catch (err) {
                showNotification(t('notifications.micPermissionError'), 'error');
                console.error('Error starting offline recording:', err);
            }
        }
    }, [isRecording, sourceLang, showNotification, t]);

    // This effect handles the automatic stopping of the recording when the countdown reaches zero.
    useEffect(() => {
        if (recordingCountdown === 0) {
            handleOfflineRecordingToggle();
        }
    }, [recordingCountdown, handleOfflineRecordingToggle]);

    const handleToggleRecording = useCallback(() => {
        if (isOfflineModeEnabled) {
            if (isOfflineModelReady) {
                handleOfflineRecordingToggle();
            } else {
                showNotification(t('notifications.offlineModelNotReadyRecording'), 'error');
            }
        } else {
            if (isOnline) {
                handleOnlineRecordingToggle();
            } else {
                showNotification(t('notifications.offlineSRError'), 'error');
            }
        }
    }, [isOfflineModeEnabled, isOfflineModelReady, isOnline, handleOfflineRecordingToggle, handleOnlineRecordingToggle, showNotification, t]);

    const handleOnlineAstRecordingToggle = useCallback(() => {
        if (!astRecognitionRef.current) return;
        if (isAstRecording) {
            astRecognitionRef.current.stop();
        } else {
            setInputText('');
            setTranslatedText('');
            transcribedTextRef.current = '';
            astRecognitionRef.current.start();
            setIsAstRecording(true);
        }
    }, [isAstRecording]);

    const handleOfflineAstRecordingToggle = useCallback(async () => {
        if (isAstRecording) {
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            if (audioProcessingContextRef.current && audioProcessingContextRef.current.state !== 'closed') {
                audioProcessingContextRef.current.close();
                audioProcessingContextRef.current = null;
            }
            setIsAstRecording(false);
        } else {
            // Start recording
            try {
                setInputText('');
                setTranslatedText('');
                const rawStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioProcessingContextRef.current = audioContext;
                const source = audioContext.createMediaStreamSource(rawStream);
                const highPassFilter = audioContext.createBiquadFilter();
                highPassFilter.type = 'highpass';
                highPassFilter.frequency.value = 150;
                const compressor = audioContext.createDynamicsCompressor();
                compressor.threshold.value = -50; compressor.knee.value = 40; compressor.ratio.value = 12; compressor.attack.value = 0; compressor.release.value = 0.25;
                const destination = audioContext.createMediaStreamDestination();
                source.connect(highPassFilter);
                highPassFilter.connect(compressor);
                compressor.connect(destination);
                const processedStream = destination.stream;
                mediaStreamRef.current = rawStream;

                if (typeof MediaRecorder === 'undefined') {
                    showNotification(t('notifications.mediaRecorderUnsupported'), 'error');
                    rawStream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                    return;
                }

                const recorder = new MediaRecorder(processedStream);
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];
                recorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
                recorder.onstop = async () => {
                    setIsLoading(true);
                    setInputText(t('notifications.processingAudio'));
                    setTranslatedText('');
                    if (audioChunksRef.current.length === 0) {
                        setIsLoading(false);
                        setInputText('');
                        showNotification(t('notifications.noAudioRecorded'), 'error');
                        return;
                    }
                    const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
                    audioChunksRef.current = [];
                    let wavUrl: string | null = null;
                    let postProcessingAudioContext: AudioContext | null = null;

                    try {
                        postProcessingAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const arrayBuffer = await audioBlob.arrayBuffer();
                        const originalAudioBuffer = await postProcessingAudioContext.decodeAudioData(arrayBuffer);
                        const TARGET_SAMPLE_RATE = 16000;
                        let finalAudioBuffer = originalAudioBuffer;
                        if (originalAudioBuffer.sampleRate !== TARGET_SAMPLE_RATE) {
                            const frameCount = originalAudioBuffer.length * TARGET_SAMPLE_RATE / originalAudioBuffer.sampleRate;
                            const offlineContext = new OfflineAudioContext(1, frameCount, TARGET_SAMPLE_RATE);
                            const bufferSource = offlineContext.createBufferSource();
                            bufferSource.buffer = originalAudioBuffer;
                            bufferSource.connect(offlineContext.destination);
                            bufferSource.start();
                            finalAudioBuffer = await offlineContext.startRendering();
                        }
                        const wavBlob = audioBufferToWav(finalAudioBuffer);
                        wavUrl = URL.createObjectURL(wavBlob);

                        const transcript = await transcribeAudioOffline(wavUrl, t(sourceLang.name));
                        setInputText(transcript);
                        performTranslate(transcript);
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during speech translation.';
                        showNotification(t('notifications.astFailed', { errorMessage }), 'error');
                        setInputText('');
                    } finally {
                        if (wavUrl) URL.revokeObjectURL(wavUrl);
                        if (postProcessingAudioContext && postProcessingAudioContext.state !== 'closed') postProcessingAudioContext.close();
                    }
                };
                
                recorder.start();
                setIsAstRecording(true);
            } catch (err) {
                showNotification(t('notifications.micPermissionError'), 'error');
                console.error('Error starting offline AST recording:', err);
            }
        }
    }, [isAstRecording, sourceLang.name, showNotification, performTranslate, t]);

    const handleToggleAstRecording = useCallback(() => {
        if (sourceLang.code === 'auto') {
            showNotification(t('notifications.astSelectLanguage'), 'error');
            return;
        }

        if (isOfflineModeEnabled) {
            if (isOfflineModelReady) {
                handleOfflineAstRecordingToggle();
            } else {
                showNotification(t('notifications.astOfflineModelNotReady'), 'error');
            }
        } else {
            if (isOnline) {
                handleOnlineAstRecordingToggle();
            } else {
                showNotification(t('notifications.astOfflineError'), 'error');
            }
        }
    }, [
        sourceLang.code,
        isOfflineModeEnabled,
        isOfflineModelReady,
        isOnline,
        handleOfflineAstRecordingToggle,
        handleOnlineAstRecordingToggle,
        showNotification,
        t
    ]);

    const handleImageCaptured = useCallback(async (imageDataUrl: string) => {
        setIsCameraOpen(false);
        setIsLoading(true);
        setInputText(t('notifications.processingImage'));
        setTranslatedText('');

        try {
            let result: { sourceText: string, translatedText: string };

            if (isOfflineModeEnabled) {
                if (!isOfflineModelReady) throw new Error(t('notifications.offlineImageError'));
                
                const extractedText = await extractTextFromImageOffline(imageDataUrl);
                setInputText(extractedText);
                setTranslatedText(''); // Clear translation, user must click translate button
                if (!extractedText.trim()) {
                    showNotification(t('notifications.noTextInImage'), "error");
                }
            } else { // Online mode
                if (!isOnline) throw new Error(t('notifications.offlineImageTranslateError'));
                
                if (onlineProvider === 'openai') {
                    if (!apiKey) throw new Error("OpenAI API Key is not set. Please add it in the settings.");
                    if (!openaiApiUrl) throw new Error("OpenAI API URL is not set. Please add it in the settings.");
                    result = await translateImageOpenAI(imageDataUrl, t(targetLang.name), apiKey, modelName, openaiApiUrl);
                } else { // Gemini
                    if (!apiKey) throw new Error("Gemini API Key is not set. Please add it in the settings.");
                    result = await translateImageGemini(imageDataUrl, t(targetLang.name), apiKey, modelName);
                }
                
                setInputText(result.sourceText);
                setTranslatedText(result.translatedText);

                // Add to history
                const newHistoryItem: TranslationHistoryItem = {
                    id: Date.now(),
                    inputText: result.sourceText,
                    translatedText: result.translatedText,
                    sourceLang, // Might not be accurate if auto-detected, but it's the best we have
                    targetLang,
                };
                setHistory(prevHistory => {
                    const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                    localStorage.setItem('translation-history', JSON.stringify(updatedHistory));
                    return updatedHistory;
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showNotification(t('notifications.imageProcessingFailed', { errorMessage }), 'error');
            setInputText(''); // Clear processing message on error
        } finally {
            setIsLoading(false);
        }
    }, [isOfflineModeEnabled, isOfflineModelReady, isOnline, apiKey, modelName, targetLang, sourceLang, showNotification, onlineProvider, openaiApiUrl, t]);

    const handleSaveSettings = (
        newApiKey: string, 
        newModelName: string, 
        newHfApiKey: string, 
        newOfflineModel: string, 
        isOfflineEnabled: boolean,
        newOnlineProvider: string,
        newOpenaiApiUrl: string,
        newIsTtsEnabled: boolean,
        newTtsVoiceURI: string,
        newTtsRate: number,
        newTtsPitch: number,
        newIsTwoStepJpCn: boolean,
    ) => {
        setApiKey(newApiKey);
        setModelName(newModelName);
        setOnlineProvider(newOnlineProvider);
        setOpenaiApiUrl(newOpenaiApiUrl);
        setHuggingFaceApiKey(newHfApiKey);
        setOfflineModelName(newOfflineModel);
        setIsOfflineModeEnabled(isOfflineEnabled);
        setIsTwoStepJpCn(newIsTwoStepJpCn);
        setIsOfflineTtsEnabled(newIsTtsEnabled);
        setOfflineTtsVoiceURI(newTtsVoiceURI);
        setOfflineTtsRate(newTtsRate);
        setOfflineTtsPitch(newTtsPitch);
        
        localStorage.setItem('api-key', newApiKey);
        localStorage.setItem('model-name', newModelName);
        localStorage.setItem('online-provider', newOnlineProvider);
        localStorage.setItem('openai-api-url', newOpenaiApiUrl);
        localStorage.setItem('hf-api-key', newHfApiKey);
        localStorage.setItem('offline-model-name', newOfflineModel);
        localStorage.setItem('offline-mode-enabled', JSON.stringify(isOfflineEnabled));
        localStorage.setItem('is-two-step-jp-cn-enabled', JSON.stringify(newIsTwoStepJpCn));
        localStorage.setItem('tts-enabled', JSON.stringify(newIsTtsEnabled));
        localStorage.setItem('tts-voice-uri', newTtsVoiceURI);
        localStorage.setItem('tts-rate', JSON.stringify(newTtsRate));
        localStorage.setItem('tts-pitch', JSON.stringify(newTtsPitch));
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

    const updateProgress = (modelName: string, progress: DownloadProgress) => {
        setDownloadProgress(prev => ({ ...prev, [modelName]: progress }));
    };

    const handleStartDownload = (modelName: string, url: string) => downloadManager.startDownload(modelName, url, huggingFaceApiKey, (p) => updateProgress(modelName, p));
    const handleResumeDownload = (modelName: string, url: string) => downloadManager.resumeDownload(modelName, url, huggingFaceApiKey, (p) => updateProgress(modelName, p));
    const handlePauseDownload = (modelName: string) => downloadManager.pauseDownload(modelName);
    const handleDeleteModel = async (modelName: string) => {
        await downloadManager.deleteModel(modelName);
        updateProgress(modelName, { downloaded: 0, total: 0, percent: 0, status: 'not_started' });
    };

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
                     />
                </main>
    
                <div className="flex-1 landscape:h-full flex flex-col min-h-0 min-w-0">
                    <TranslationInput
                        inputText={inputText}
                        setInputText={setInputText}
                        sourceLang={sourceLang}
                        setSourceLang={setSourceLang}
                        isLoading={isLoading || isOfflineModelInitializing}
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
                        notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
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

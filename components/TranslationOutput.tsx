import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';
import { LANGUAGES, OFFLINE_MODELS } from '../constants';
import LanguageSelector from './LanguageSelector';
import { FemaleVoiceIcon, MaleVoiceIcon, CopyIcon, HistoryIcon, SwapIcon, FlipScreenIcon, XIcon, SpeakerIcon, MicrophoneIcon } from './icons';

interface TranslationOutputProps {
    translatedText: string;
    targetLang: Language;
    setTargetLang: (lang: Language) => void;
    isLoading: boolean;
    onSpeak: (gender: 'female' | 'male') => void;
    onSwapLanguages: () => void;
    onOpenHistory: () => void;
    onClearText: () => void;
    isOfflineModeEnabled: boolean;
    isOfflineModelInitializing: boolean;
    isOfflineModelReady: boolean;
    offlineModelName: string;
    isSpeaking: boolean;
    speakingGender: 'female' | 'male' | null;
    onlineProvider: string;
    isOfflineTtsEnabled: boolean;
    isAstRecording: boolean;
    onToggleAstRecording: () => void;
}

const TranslationOutput: React.FC<TranslationOutputProps> = ({
    translatedText,
    targetLang,
    setTargetLang,
    isLoading,
    onSpeak,
    onSwapLanguages,
    onOpenHistory,
    onClearText,
    isOfflineModeEnabled,
    isOfflineModelInitializing,
    isOfflineModelReady,
    offlineModelName,
    isSpeaking,
    speakingGender,
    onlineProvider,
    isOfflineTtsEnabled,
    isAstRecording,
    onToggleAstRecording,
}) => {
    const { t } = useTranslation();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCopy = () => {
        if (translatedText) {
            navigator.clipboard.writeText(translatedText);
        }
    };
    
    const handleFlip = () => {
        setIsFlipped(prev => !prev);
    };
    
    const getModeStatus = () => {
        if (!isOfflineModeEnabled) {
            const providerName = onlineProvider.charAt(0).toUpperCase() + onlineProvider.slice(1);
            return t('translationOutput.modeOnline', { provider: providerName });
        }
        
        const model = OFFLINE_MODELS.find(m => m.value === offlineModelName);
        const modelDisplayName = model ? model.name.split(' ')[0] : '';

        if (isOfflineModelInitializing) {
            return t('translationOutput.modeOfflineInitializing', { modelName: modelDisplayName });
        }
        if (isOfflineModelReady) {
            return t('translationOutput.modeOfflineReady', { modelName: modelDisplayName });
        }
        if (offlineModelName) {
            return t('translationOutput.modeOfflineNotReady', { modelName: modelDisplayName });
        }
        return t('translationOutput.modeOfflineNoModel');
    };

    return (
        <div className={`bg-white rounded-xl shadow-md p-4 h-full flex flex-col transition-transform duration-500 ease-in-out ${isFlipped ? 'rotate-180' : ''}`}>
            {/* Header section - fixed height */}
            <div className="flex-shrink-0">
                 <div className="flex justify-between items-center mb-1">
                    <LanguageSelector
                        selectedLang={targetLang}
                        setSelectedLang={setTargetLang}
                        languages={LANGUAGES.filter(l => l.code !== 'auto')}
                    />
                    <button onClick={onSwapLanguages} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <SwapIcon />
                    </button>
                    <div className="flex items-center space-x-4 text-gray-500">
                        <button onClick={handleFlip} className="hover:text-blue-500" aria-label={t('translationOutput.flipScreenAriaLabel')}><FlipScreenIcon /></button>
                        <button onClick={handleCopy} disabled={!translatedText} className="hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed" aria-label={t('translationOutput.copyAriaLabel')}><CopyIcon /></button>
                        <button onClick={onOpenHistory} className="hover:text-blue-500" aria-label={t('translationOutput.historyAriaLabel')}><HistoryIcon /></button>
                        <button onClick={onClearText} disabled={!translatedText} className="hover:text-red-500 disabled:text-gray-300 disabled:cursor-not-allowed" aria-label={t('translationOutput.clearAriaLabel')}><XIcon /></button>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-400 mb-2 px-1">
                    {getModeStatus()}
                </div>
            </div>
            {/* Content section - flexible height and scrollable */}
             <div className="text-2xl text-gray-800 break-words flex-grow overflow-y-auto min-h-0 whitespace-pre-wrap">
                {isLoading && !translatedText ? (
                     <div className="space-y-2 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : (
                    translatedText || <span className="text-gray-400">{t('translationOutput.placeholder')}</span>
                )}
            </div>
            {/* Footer section - fixed height */}
            <div className="flex items-center justify-start mt-4 space-x-2 flex-shrink-0">
                {isOfflineTtsEnabled ? (
                    <button
                        onClick={() => onSpeak('female')} // Gender is ignored but required by function signature
                        disabled={!translatedText}
                        className={`text-white rounded-lg p-3 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${isSpeaking ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                        aria-label={isSpeaking ? t('translationOutput.speakStop') : t('translationOutput.speakCustomVoice')}
                    >
                        <SpeakerIcon />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onSpeak('female')}
                            disabled={!translatedText}
                            className={`text-white rounded-lg p-3 flex items-center justify-center disabled:bg-pink-200 disabled:cursor-not-allowed transition-colors ${isSpeaking && speakingGender === 'female' ? 'bg-pink-600 animate-pulse' : 'bg-pink-400 hover:bg-pink-500'}`}
                            aria-label={isSpeaking && speakingGender === 'female' ? t('translationOutput.speakStop') : t('translationOutput.speakFemale')}
                        >
                            <FemaleVoiceIcon />
                        </button>
                        <button
                            onClick={() => onSpeak('male')}
                            disabled={!translatedText}
                            className={`text-white rounded-lg p-3 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors ${isSpeaking && speakingGender === 'male' ? 'bg-blue-700 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
                            aria-label={isSpeaking && speakingGender === 'male' ? t('translationOutput.speakStop') : t('translationOutput.speakMale')}
                        >
                            <MaleVoiceIcon />
                        </button>
                    </>
                )}
                <button
                    onClick={onToggleAstRecording}
                    disabled={isLoading}
                    className={`text-white rounded-lg p-3 flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                        isAstRecording
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    }`}
                    aria-label={isAstRecording ? t('translationOutput.astStop') : t('translationOutput.astStart')}
                    title={t('translationOutput.astTitle')}
                >
                    <MicrophoneIcon />
                </button>
            </div>
        </div>
    );
};

export default TranslationOutput;
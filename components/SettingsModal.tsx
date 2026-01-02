
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XIcon, TrashIcon } from './icons';
import { DownloadProgress } from '../services/downloadManager';
import { OFFLINE_MODELS, ASR_MODELS } from '../constants';
import type { Language } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        apiKey: string, 
        modelName: string, 
        huggingFaceApiKey: string, 
        offlineModelName: string, 
        asrModelId: string,
        isOfflineEnabled: boolean,
        isOfflineAsrEnabled: boolean,
        isWebSpeechApiEnabled: boolean,
        onlineProvider: string,
        openaiApiUrl: string,
        isOfflineTtsEnabled: boolean,
        offlineTtsVoiceURI: string,
        offlineTtsRate: number,
        offlineTtsPitch: number,
        isTwoStepJpCnEnabled: boolean,
        offlineMaxTokens: number,
        offlineTopK: number,
        offlineTemperature: number,
        offlineRandomSeed: number,
        offlineSupportAudio: boolean,
        offlineMaxNumImages: number,
        isNoiseCancellationEnabled: boolean,
        audioGainValue: number
    ) => void;
    currentApiKey: string;
    currentModelName: string;
    currentOnlineProvider: string;
    currentOpenaiApiUrl: string;
    currentHuggingFaceApiKey: string;
    currentOfflineModelName: string;
    currentIsOfflineModeEnabled: boolean;
    currentIsTwoStepJpCnEnabled: boolean;
    downloadProgress: Record<string, DownloadProgress>;
    onStartDownload: (modelName: string, url: string) => void;
    onResumeDownload: (modelName: string, url: string) => void;
    onPauseDownload: (modelName: string) => void;
    onDeleteModel: (modelName: string) => void;
    isOfflineModelInitializing: boolean;
    voices: SpeechSynthesisVoice[];
    targetLang: Language;
    currentIsOfflineTtsEnabled: boolean;
    currentOfflineTtsVoiceURI: string;
    currentOfflineTtsRate: number;
    currentOfflineTtsPitch: number;
    currentOfflineMaxTokens: number;
    currentOfflineTopK: number;
    currentOfflineTemperature: number;
    currentOfflineRandomSeed: number;
    currentOfflineSupportAudio: boolean;
    currentOfflineMaxNumImages: number;
    // ASR Props
    currentIsOfflineAsrEnabled: boolean;
    currentIsWebSpeechApiEnabled: boolean;
    currentAsrModelId: string;
    currentIsNoiseCancellationEnabled: boolean;
    currentAudioGainValue: number;
    asrModelsCacheStatus: Record<string, boolean>;
    isAsrInitializing: boolean;
    asrLoadingProgress: { file: string; progress: number };
    onDownloadAsrModel: (modelId: string) => void;
    onClearAsrCache: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    currentApiKey,
    currentModelName,
    currentOnlineProvider,
    currentOpenaiApiUrl,
    currentHuggingFaceApiKey,
    currentOfflineModelName,
    currentIsOfflineModeEnabled,
    currentIsTwoStepJpCnEnabled,
    downloadProgress,
    onStartDownload,
    onResumeDownload,
    onPauseDownload,
    onDeleteModel,
    isOfflineModelInitializing,
    voices,
    targetLang,
    currentIsOfflineTtsEnabled,
    currentOfflineTtsVoiceURI,
    currentOfflineTtsRate,
    currentOfflineTtsPitch,
    currentOfflineMaxTokens,
    currentOfflineTopK,
    currentOfflineTemperature,
    currentOfflineRandomSeed,
    currentOfflineSupportAudio,
    currentOfflineMaxNumImages,
    currentIsOfflineAsrEnabled,
    currentIsWebSpeechApiEnabled,
    currentAsrModelId,
    currentIsNoiseCancellationEnabled,
    currentAudioGainValue,
    asrModelsCacheStatus,
    isAsrInitializing,
    asrLoadingProgress,
    onDownloadAsrModel,
    onClearAsrCache,
}) => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('online');
    
    // Main Settings
    const [apiKey, setApiKey] = useState(currentApiKey);
    const [modelName, setModelName] = useState(currentModelName);
    const [onlineProvider, setOnlineProvider] = useState(currentOnlineProvider);
    const [openaiApiUrl, setOpenaiApiUrl] = useState(currentOpenaiApiUrl);
    const [huggingFaceApiKey, setHuggingFaceApiKey] = useState(currentHuggingFaceApiKey);
    const [offlineModelName, setOfflineModelName] = useState(currentOfflineModelName);
    const [isOfflineEnabled, setIsOfflineEnabled] = useState(currentIsOfflineModeEnabled);
    const [isTwoStepJpCnEnabled, setIsTwoStepJpCnEnabled] = useState(currentIsTwoStepJpCnEnabled);

    // ASR Settings
    const [isOfflineAsrEnabled, setIsOfflineAsrEnabled] = useState(currentIsOfflineAsrEnabled);
    const [isWebSpeechApiEnabled, setIsWebSpeechApiEnabled] = useState(currentIsWebSpeechApiEnabled);
    const [asrModelId, setAsrModelId] = useState(currentAsrModelId);
    const [isNoiseCancellationEnabled, setIsNoiseCancellationEnabled] = useState(currentIsNoiseCancellationEnabled);
    const [audioGainValue, setAudioGainValue] = useState(currentAudioGainValue);

    // Offline TTS State
    const [isOfflineTtsEnabled, setIsOfflineTtsEnabled] = useState(currentIsOfflineTtsEnabled);
    const [offlineTtsVoiceURI, setOfflineTtsVoiceURI] = useState(currentOfflineTtsVoiceURI);
    const [offlineTtsRate, setOfflineTtsRate] = useState(currentOfflineTtsRate);
    const [offlineTtsPitch, setOfflineTtsPitch] = useState(currentOfflineTtsPitch);
    const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Offline Model Params State
    const [offlineMaxTokens, setOfflineMaxTokens] = useState(currentOfflineMaxTokens);
    const [offlineTopK, setOfflineTopK] = useState(currentOfflineTopK);
    const [offlineTemperature, setOfflineTemperature] = useState(currentOfflineTemperature);
    const [offlineRandomSeed, setOfflineRandomSeed] = useState(currentOfflineRandomSeed);
    const [offlineSupportAudio, setOfflineSupportAudio] = useState(currentOfflineSupportAudio);
    const [offlineMaxNumImages, setOfflineMaxNumImages] = useState(currentOfflineMaxNumImages);

    useEffect(() => {
        if (isOpen) {
            setApiKey(currentApiKey);
            setModelName(currentModelName);
            setOnlineProvider(currentOnlineProvider);
            setOpenaiApiUrl(currentOpenaiApiUrl);
            setHuggingFaceApiKey(currentHuggingFaceApiKey);
            setOfflineModelName(currentOfflineModelName);
            setIsOfflineEnabled(currentIsOfflineModeEnabled);
            setIsTwoStepJpCnEnabled(currentIsTwoStepJpCnEnabled);
            
            // TTS
            setIsOfflineTtsEnabled(currentIsOfflineTtsEnabled);
            setOfflineTtsVoiceURI(currentOfflineTtsVoiceURI);
            setOfflineTtsRate(currentOfflineTtsRate);
            setOfflineTtsPitch(currentOfflineTtsPitch);
            
            // Params
            setOfflineMaxTokens(currentOfflineMaxTokens);
            setOfflineTopK(currentOfflineTopK);
            setOfflineTemperature(currentOfflineTemperature);
            setOfflineRandomSeed(currentOfflineRandomSeed);
            setOfflineSupportAudio(currentOfflineSupportAudio);
            setOfflineMaxNumImages(currentOfflineMaxNumImages);

            // ASR
            setIsOfflineAsrEnabled(currentIsOfflineAsrEnabled);
            setIsWebSpeechApiEnabled(currentIsWebSpeechApiEnabled);
            setAsrModelId(currentAsrModelId);
            setIsNoiseCancellationEnabled(currentIsNoiseCancellationEnabled);
            setAudioGainValue(currentAudioGainValue);
        }
    }, [
        isOpen, currentApiKey, currentModelName, currentOnlineProvider, currentOpenaiApiUrl, 
        currentHuggingFaceApiKey, currentOfflineModelName, currentIsOfflineModeEnabled, 
        currentIsTwoStepJpCnEnabled, currentIsOfflineTtsEnabled, currentOfflineTtsVoiceURI, 
        currentOfflineTtsRate, currentOfflineTtsPitch, currentOfflineMaxTokens, currentOfflineTopK, 
        currentOfflineTemperature, currentOfflineRandomSeed, currentOfflineSupportAudio, 
        currentOfflineMaxNumImages, currentIsOfflineAsrEnabled, currentIsWebSpeechApiEnabled,
        currentAsrModelId, currentIsNoiseCancellationEnabled, currentAudioGainValue
    ]);
    
    useEffect(() => {
        if (isOpen && voices.length > 0 && targetLang) {
            const langVoices = voices.filter(v => v.lang.startsWith(targetLang.code));
            setFilteredVoices(langVoices);
            if (offlineTtsVoiceURI && !langVoices.some(v => v.voiceURI === offlineTtsVoiceURI)) {
                setOfflineTtsVoiceURI(langVoices[0]?.voiceURI || '');
            }
        }
    }, [isOpen, voices, targetLang, offlineTtsVoiceURI]);

    if (!isOpen) return null;
    
    const handleSave = () => {
        onSave(
            apiKey, modelName, huggingFaceApiKey, offlineModelName, asrModelId, isOfflineEnabled, isOfflineAsrEnabled, isWebSpeechApiEnabled, onlineProvider, openaiApiUrl,
            isOfflineTtsEnabled, offlineTtsVoiceURI, offlineTtsRate, offlineTtsPitch, isTwoStepJpCnEnabled,
            offlineMaxTokens, offlineTopK, offlineTemperature, offlineRandomSeed, offlineSupportAudio, offlineMaxNumImages,
            isNoiseCancellationEnabled, audioGainValue
        );
        onClose();
    };

    const handleClear = () => {
        setApiKey('');
        setModelName('gemini-2.5-flash');
        setOnlineProvider('gemini');
        setOpenaiApiUrl('');
        setHuggingFaceApiKey('');
        setOfflineModelName('');
        setIsOfflineEnabled(false);
        setIsTwoStepJpCnEnabled(false);
        setIsOfflineTtsEnabled(false);
        setOfflineTtsVoiceURI('');
        setOfflineTtsRate(1);
        setOfflineTtsPitch(1);
        setOfflineMaxTokens(4096);
        setOfflineTopK(40);
        setOfflineTemperature(0.3);
        setOfflineRandomSeed(101);
        setOfflineSupportAudio(false);
        setOfflineMaxNumImages(1);
        
        // Clear ASR
        setIsOfflineAsrEnabled(false);
        setIsWebSpeechApiEnabled(true);
        setAsrModelId(ASR_MODELS[0].id);
        setIsNoiseCancellationEnabled(false);
        setAudioGainValue(1.0);
        onClearAsrCache();

        OFFLINE_MODELS.forEach(model => model.value && onDeleteModel(model.value));
        onSave('', 'gemini-2.5-flash', '', '', ASR_MODELS[0].id, false, false, true, 'gemini', '', false, '', 1, 1, false, 4096, 40, 0.3, 101, false, 1, false, 1.0);
    };

    const handleDownloadedModelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOfflineModelName(e.target.value);
    };

    const handleAsrModelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAsrModelId(e.target.value);
    };

    const TabButton: React.FC<{tabName: string; label: string}> = ({tabName, label}) => (
        <button
           onClick={() => setActiveTab(tabName)}
           className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${
               activeTab === tabName
                   ? 'bg-blue-100 text-blue-700'
                   : 'text-gray-500 hover:text-gray-700'
           }`}
           aria-selected={activeTab === tabName}
           role="tab"
       >
           {label}
       </button>
   );
   
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    const renderDownloadControls = (model: { name: string, value: string, url: string }) => {
        const progress = downloadProgress[model.value] || { status: 'not_started', percent: 0, downloaded: 0, total: 0 };
        const isInitializingThisModel = isOfflineModelInitializing && offlineModelName === model.value;

        const ActionButton: React.FC<{ onClick: () => void, text: string, className?: string, disabled?: boolean }> = ({ onClick, text, className = 'bg-blue-500 hover:bg-blue-600', disabled }) => (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`text-white text-xs font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
            >
                {text}
            </button>
        );

        const isProcessing = isInitializingThisModel || progress.status === 'consolidating';
        const statusKey = isProcessing ? progress.status : progress.status;
        const statusText = t(`common.status.${statusKey}`);

        return (
             <div className="flex flex-col space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id={`model-${model.value}`}
                            name="offline-model-selection"
                            value={model.value}
                            checked={offlineModelName === model.value}
                            onChange={handleDownloadedModelSelect}
                            disabled={progress.status !== 'completed' || isProcessing}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                        />
                        <label htmlFor={`model-${model.value}`} className="ml-2 text-sm font-medium text-gray-800">
                            {model.name}
                        </label>
                    </div>
                     <div className="flex items-center space-x-2">
                         {progress.status === 'not_started' && <ActionButton onClick={() => onStartDownload(model.value, model.url)} text={t('settings.download')} /*disabled={!huggingFaceApiKey}*/ />}
                         {progress.status === 'downloading' && <ActionButton onClick={() => onPauseDownload(model.value)} text={t('settings.pause')} className="bg-yellow-500 hover:bg-yellow-600" />}
                         {progress.status === 'paused' && <ActionButton onClick={() => onResumeDownload(model.value, model.url)} text={t('settings.resume')} /*disabled={!huggingFaceApiKey}*/ />}
                         {progress.status === 'error' && <ActionButton onClick={() => onResumeDownload(model.value, model.url)} text={t('settings.retry')} /*disabled={!huggingFaceApiKey}*/ />}
                         {(progress.status !== 'not_started' && progress.status !== 'downloading' && progress.status !== 'consolidating') && (
                            <button onClick={() => onDeleteModel(model.value)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" aria-label={t('settings.deleteModelAriaLabel', { modelName: model.name })}>
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                 {(progress.status !== 'not_started' || isProcessing) && (
                     <div>
                         <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
                             <div className={`h-2 rounded-full ${isProcessing ? 'bg-green-400 w-full animate-pulse' : 'bg-blue-500'}`} style={{ width: `${progress.percent}%` }}></div>
                         </div>
                         <div className="text-xs text-gray-500 mt-1 flex justify-between">
                             <span>{statusText}</span>
                             {progress.status === 'downloading' && !isProcessing && <span>{formatBytes(progress.downloaded)} / {formatBytes(progress.total)} ({Math.round(progress.percent)}%)</span>}
                         </div>
                     </div>
                 )}
                 {progress.status === 'error' && <p className="text-xs text-red-600 mt-1">{t('settings.statusError', { error: progress.error })}</p>}
             </div>
        );
    }

    const Slider: React.FC<{id: string, label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min: number, max: number, step: number}> = ({ id, label, value, onChange, min, max, step }) => (
        <div>
            <label htmlFor={id} className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                <span>{label}</span>
                <span className="text-gray-500 font-normal">{value}</span>
            </label>
            <input
                type="range"
                id={id}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );

    const ToggleSwitch: React.FC<{id: string, isEnabled: boolean, setIsEnabled: (enabled: boolean) => void, title: string, description: string, disabled?: boolean}> = ({ id, isEnabled, setIsEnabled, title, description, disabled }) => (
        <div className="flex items-center justify-between">
            <label htmlFor={id} className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                {title}
                <span className={`block text-xs ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>{description}</span>
            </label>
            <button
                id={id}
                onClick={() => !disabled && setIsEnabled(!isEnabled)}
                disabled={disabled}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={isEnabled}
            >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
        >
            <div className="bg-white rounded-lg shadow-xl h-full w-full max-w-md overflow-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 id="settings-title" className="text-xl font-semibold text-gray-800">{t('settings.title')}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label={t('settings.closeAriaLabel')}>
                            <XIcon />
                        </button>
                    </div>
                    <div>
                        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">{t('settings.languageLabel')}</label>
                        <select
                            id="language-select"
                            value={i18n.language}
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="en">English</option>
                            <option value="zh-TW">繁體中文</option>
                        </select>
                    </div>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="flex space-x-2 p-2 overflow-x-auto" role="tablist" aria-label="Settings tabs">
                       <TabButton tabName="online" label={t('settings.tabOnline')} />
                       <TabButton tabName="offline" label={t('settings.tabOffline')} />
                       <TabButton tabName="speech" label={t('settings.tabSpeech')} />
                       <TabButton tabName="tts" label={t('settings.tabTts')} />
                       <TabButton tabName="offline-params" label={t('settings.tabOfflineParams')} />
                    </nav>
                </div>

                <div className="p-6 space-y-6 min-h-[350px]">
                    {activeTab === 'online' && (
                        <div role="tabpanel" id="online-settings" aria-labelledby="online-tab" className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.providerLabel')}</label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input id="provider-gemini" name="online-provider" type="radio" value="gemini" checked={onlineProvider === 'gemini'} onChange={(e) => setOnlineProvider(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <label htmlFor="provider-gemini" className="ml-2 block text-sm text-gray-900">{t('settings.providerGemini')}</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="provider-openai" name="online-provider" type="radio" value="openai" checked={onlineProvider === 'openai'} onChange={(e) => setOnlineProvider(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <label htmlFor="provider-openai" className="ml-2 block text-sm text-gray-900">{t('settings.providerOpenAI')}</label>
                                    </div>
                                </div>
                            </div>
                            {onlineProvider === 'openai' && (
                                <div>
                                    <label htmlFor="openai-api-url" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('settings.openaiUrlLabel')}
                                    </label>
                                    <input
                                        type="text"
                                        id="openai-api-url"
                                        value={openaiApiUrl}
                                        onChange={(e) => setOpenaiApiUrl(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={t('settings.openaiUrlPlaceholder')}
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('settings.apiKeyLabel')}
                                </label>
                                <input
                                    type="password"
                                    id="api-key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('settings.apiKeyPlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="model-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('settings.modelNameLabel')}
                                </label>
                                <input
                                    type="text"
                                    id="model-name"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    placeholder={onlineProvider === 'gemini' ? t('settings.modelNameGeminiPlaceholder') : t('settings.modelNameOpenAIPlaceholder')}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === 'offline' && (
                        <div role="tabpanel" id="offline-settings" aria-labelledby="offline-tab" className="space-y-6">
                             <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">{t('settings.manageModelsLabel')}</label>
                                {OFFLINE_MODELS.filter(m => m.value).map(model => (
                                    <div key={model.value}>
                                        {renderDownloadControls(model)}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4 pt-2">
                                <ToggleSwitch 
                                    id="offline-toggle"
                                    isEnabled={isOfflineEnabled}
                                    setIsEnabled={setIsOfflineEnabled}
                                    title={t('settings.enableOfflineLabel')}
                                    description={t('settings.enableOfflineDescription')}
                                />
                                <ToggleSwitch 
                                    id="twostep-toggle"
                                    isEnabled={isTwoStepJpCnEnabled}
                                    setIsEnabled={setIsTwoStepJpCnEnabled}
                                    title={t('settings.enableTwoStepLabel')}
                                    description={t('settings.enableTwoStepDescription')}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === 'speech' && (
                         <div role="tabpanel" id="speech-settings" aria-labelledby="speech-tab" className="space-y-6">
                            <ToggleSwitch
                                id="web-speech-toggle"
                                isEnabled={isWebSpeechApiEnabled}
                                setIsEnabled={(enabled) => {
                                    setIsWebSpeechApiEnabled(enabled);
                                    if (enabled) {
                                        // Web Speech API is independent of others, but usually preferred if available online.
                                        // We don't necessarily force disable Whisper, but App.tsx logic prioritizes.
                                    }
                                }}
                                title={t('settings.enableWebSpeechLabel')}
                                description={t('settings.enableWebSpeechDescription')}
                             />
                             <div className="border-t border-gray-200"></div>
                             
                             <ToggleSwitch
                                id="asr-toggle"
                                isEnabled={isOfflineAsrEnabled}
                                setIsEnabled={(enabled) => {
                                    setIsOfflineAsrEnabled(enabled);
                                    if (enabled) {
                                        // Disable Gemma Audio to prevent conflict
                                        setOfflineSupportAudio(false);
                                    }
                                }}
                                title={t('settings.enableOfflineAsrLabel')}
                                description={t('settings.enableOfflineAsrDescription')}
                             />
                            {/* ASR Model Management */}
                            <div className={`space-y-3 transition-opacity ${!isOfflineAsrEnabled ? 'opacity-50' : ''}`}>
                                <label className={`block text-sm font-medium ${!isOfflineAsrEnabled ? 'text-gray-400' : 'text-gray-700'}`}>{t('settings.asrModelLabel')}</label>
                                {ASR_MODELS.map(model => {
                                    const isCached = asrModelsCacheStatus[model.id] || false;
                                    const isLoadingThisModel = isAsrInitializing && asrModelId === model.id;
                                    return (
                                        <div key={model.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={`asr-model-${model.id}`}
                                                        name="asr-model-selection"
                                                        value={model.id}
                                                        checked={asrModelId === model.id}
                                                        onChange={handleAsrModelSelect}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        disabled={!isOfflineAsrEnabled}
                                                    />
                                                    <label htmlFor={`asr-model-${model.id}`} className={`ml-3 text-sm font-medium ${!isOfflineAsrEnabled ? 'text-gray-400' : 'text-gray-800'}`}>
                                                        {model.name} <span className="text-gray-500 font-normal">({model.size})</span>
                                                    </label>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {!isLoadingThisModel && (
                                                        isCached ? (
                                                            <span className="text-sm font-medium text-green-600">{t('settings.modelCached') || 'Cached'}</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => onDownloadAsrModel(model.id)}
                                                                disabled={isAsrInitializing || !isOfflineAsrEnabled}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            >
                                                                {t('settings.modelDownload') || 'Download'}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            {isLoadingThisModel && (
                                                <div className="pt-1 text-center text-sm text-blue-600">
                                                    {asrLoadingProgress.file} ({Math.round(asrLoadingProgress.progress)}%)
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                 <div>
                                    <button
                                        onClick={onClearAsrCache}
                                        disabled={!isOfflineAsrEnabled}
                                        className="w-full flex items-center justify-center space-x-2 text-red-600 font-medium py-2 px-4 rounded-lg border border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span>{t('settings.clearAsrCacheButton')}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200"></div>

                            {/* Audio Processing Settings */}
                             <div className={`space-y-4 transition-opacity ${!isOfflineAsrEnabled ? 'opacity-50' : ''}`}>
                                <label className={`block text-sm font-medium -mb-2 ${!isOfflineAsrEnabled ? 'text-gray-400' : 'text-gray-700'}`}>{t('settings.audioProcessingLabel')}</label>
                                 <ToggleSwitch
                                    id="noise-cancellation-toggle"
                                    isEnabled={isNoiseCancellationEnabled}
                                    setIsEnabled={setIsNoiseCancellationEnabled}
                                    title={t('settings.enableNoiseCancellationLabel')}
                                    description={t('settings.enableNoiseCancellationDescription')}
                                    disabled={!isOfflineAsrEnabled}
                                 />
                                 <div>
                                    <label htmlFor="gain-slider" className={`flex justify-between items-center text-sm font-medium mb-1 ${!isOfflineAsrEnabled ? 'text-gray-400' : 'text-gray-700'}`}>
                                        <span>{t('settings.audioGainLabel')}</span>
                                        <span className="font-normal text-gray-500">{audioGainValue.toFixed(1)}x</span>
                                    </label>
                                    <input
                                        type="range"
                                        id="gain-slider"
                                        min={0.5} max={5} step={0.1}
                                        value={audioGainValue}
                                        onChange={e => setAudioGainValue(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        disabled={!isOfflineAsrEnabled}
                                    />
                                 </div>
                            </div>

                            <div className="border-t border-gray-200"></div>
                            
                            <ToggleSwitch 
                                id="support-audio-toggle" 
                                isEnabled={offlineSupportAudio} 
                                setIsEnabled={(enabled) => {
                                    setOfflineSupportAudio(enabled);
                                    if (enabled) {
                                        // Disable Whisper to prevent conflict
                                        setIsOfflineAsrEnabled(false);
                                        // Suggest enabling offline mode if not already
                                        if (!isOfflineEnabled) {
                                            // Optional: setIsOfflineEnabled(true); 
                                            // But maybe better to just warn or let user handle main toggle
                                        }
                                    }
                                }} 
                                title={t('settings.enableGemmaAudioLabel')} 
                                description={t('settings.enableGemmaAudioDescription')} 
                                disabled={!isOfflineEnabled} // Only allow if offline mode is on, or allow but it won't work
                            />
                            {!isOfflineEnabled && (
                                <p className="text-xs text-amber-600 mt-1 ml-1">
                                    * Requires "Enable Offline Translation" to be ON.
                                </p>
                            )}

                        </div>
                    )}
                    {activeTab === 'tts' && (
                        <div role="tabpanel" id="tts-settings" aria-labelledby="tts-tab" className="space-y-6">
                             <ToggleSwitch
                                id="tts-toggle"
                                isEnabled={isOfflineTtsEnabled}
                                setIsEnabled={setIsOfflineTtsEnabled}
                                title={t('settings.enableCustomTtsLabel')}
                                description={t('settings.enableCustomTtsDescription')}
                             />

                             <div>
                                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">{t('settings.voiceLabel')}</label>
                                <select
                                    id="voice-select"
                                    value={offlineTtsVoiceURI}
                                    onChange={(e) => setOfflineTtsVoiceURI(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    disabled={filteredVoices.length === 0}
                                >
                                    {filteredVoices.length > 0 ? (
                                        filteredVoices.map(voice => (
                                            <option key={voice.voiceURI} value={voice.voiceURI}>
                                                {voice.name} ({voice.lang})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">{t('settings.voicePlaceholder', { languageName: t(targetLang.name) })}</option>
                                    )}
                                </select>
                             </div>

                             <Slider id="rate-slider" label={t('settings.rateLabel')} value={offlineTtsRate} onChange={e => setOfflineTtsRate(parseFloat(e.target.value))} min={0.5} max={2} step={0.1} />
                             <Slider id="pitch-slider" label={t('settings.pitchLabel')} value={offlineTtsPitch} onChange={e => setOfflineTtsPitch(parseFloat(e.target.value))} min={0} max={2} step={0.1} />
                        </div>
                    )}
                     {activeTab === 'offline-params' && (
                        <div role="tabpanel" id="offline-params-settings" aria-labelledby="offline-params-tab" className="space-y-6">
                            <p className="text-sm text-gray-500">{t('settings.offlineParamsDescription')}</p>
                            
                            <Slider id="max-tokens-slider" label={t('settings.maxTokensLabel')} value={offlineMaxTokens} onChange={e => setOfflineMaxTokens(parseInt(e.target.value, 10))} min={256} max={8192} step={256} />

                            <Slider id="top-k-slider" label={t('settings.topKLabel')} value={offlineTopK} onChange={e => setOfflineTopK(parseInt(e.target.value, 10))} min={1} max={100} step={1} />

                            <Slider id="temperature-slider" label={t('settings.temperatureLabel')} value={offlineTemperature} onChange={e => setOfflineTemperature(parseFloat(e.target.value))} min={0} max={1} step={0.05} />

                            <div>
                                <label htmlFor="random-seed" className="block text-sm font-medium text-gray-700 mb-1">{t('settings.randomSeedLabel')}</label>
                                <input type="number" id="random-seed" value={offlineRandomSeed} onChange={e => setOfflineRandomSeed(parseInt(e.target.value, 10))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>

                            <ToggleSwitch id="max-num-images-toggle" isEnabled={offlineMaxNumImages === 1} setIsEnabled={(enabled) => setOfflineMaxNumImages(enabled ? 1 : 0)} title={t('settings.maxNumImagesLabel')} description={t('settings.maxNumImagesDescription')} />
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-between items-center">
                     <button 
                        onClick={handleClear}
                        className="text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        aria-label={t('history.clearAriaLabel')}
                    >
                        {t('settings.clearSettingsButton')}
                    </button>
                    <button 
                        onClick={handleSave}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {t('settings.saveSettingsButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

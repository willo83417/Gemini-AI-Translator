
export interface Language {
    code: string;
    name: string;
    asrCode?: string;
}

export interface TranslationHistoryItem {
    id: number;
    inputText: string;
    translatedText: string;
    sourceLang: Language;
    targetLang: Language;
}

export interface AsrModel {
    id: string;
    name: string;
    quantization: Record<string, string>;
    size: string;
}

export interface CustomOfflineModel {
    name: string;
    value: string;
    url?: string;
    size?: string;
}

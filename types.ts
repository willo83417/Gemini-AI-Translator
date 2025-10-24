
export interface Language {
    code: string;
    name: string;
}

export interface TranslationHistoryItem {
    id: number;
    inputText: string;
    translatedText: string;
    sourceLang: Language;
    targetLang: Language;
}

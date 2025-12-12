import type { Language } from './types';

export const LANGUAGES: Language[] = [
    { code: 'auto', name: 'languages.autoDetect' },
    { code: 'en', name: 'languages.english' },
    { code: 'zh-TW', name: 'languages.chineseTraditional' },
    { code: 'zh-HK', name: 'languages.chineseTraditionalHK' },
    { code: 'zh-CN', name: 'languages.chineseSimplified' },
    { code: 'es', name: 'languages.spanish' },
    { code: 'ja', name: 'languages.japanese' },
    { code: 'fr', name: 'languages.french' },
    { code: 'de', name: 'languages.german' },
    { code: 'ko', name: 'languages.korean' },
    { code: 'ru', name: 'languages.russian' },
    { code: 'pt', name: 'languages.portuguese' },
    { code: 'it', name: 'languages.italian' },
];

export const OFFLINE_MODELS = [
    { 
        name: 'Gemma-3n-E2B (3.04 GB)', 
        value: 'gemma-3n-E2B-it-int4-Web.litertlm', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma-3n-E2B-it-int4-Web.litertlm'
        //url: 'https://huggingface.co/google/gemma-3n-E2B-it-litert-lm/resolve/main/gemma-3n-E2B-it-int4-Web.litertlm'
    },
    { 
        name: 'Gemma-3n-E4B (4.28 GB)', 
        value: 'gemma-3n-E4B-it-int4-Web.litertlm', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma-3n-E4B-it-int4-Web.litertlm'
        //url: 'https://huggingface.co/google/gemma-3n-E4B-it-litert-lm/resolve/main/gemma-3n-E4B-it-int4-Web.litertlm'
    },
];


import type { Language, AsrModel } from './types';

export const LANGUAGES: Language[] = [
    { code: 'auto', name: 'languages.autoDetect' },
    { code: 'en', name: 'languages.english', asrCode: 'en' },
    { code: 'zh-TW', name: 'languages.chineseTraditional', asrCode: 'zh' },
    { code: 'zh-HK', name: 'languages.chineseTraditionalHK', asrCode: 'zh' },
    { code: 'zh-CN', name: 'languages.chineseSimplified', asrCode: 'zh' },
    { code: 'es', name: 'languages.spanish', asrCode: 'es' },
    { code: 'ja', name: 'languages.japanese', asrCode: 'ja' },
    { code: 'fr', name: 'languages.french', asrCode: 'fr' },
    { code: 'de', name: 'languages.german', asrCode: 'de' },
    { code: 'ko', name: 'languages.korean', asrCode: 'ko' },
    { code: 'ru', name: 'languages.russian', asrCode: 'ru' },
    { code: 'it', name: 'languages.italian', asrCode: 'it'  },
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

export const ASR_MODELS: AsrModel[] = [
    {
        id: 'nicky48/whisper-large-v3-turbo-ONNX',
        name: 'whisper-large-v3-turbo (q4f16)',
        quantization: {
            encoder_model: 'q4f16',
            decoder_model_merged: 'q4f16',
        },
        size: '~600 MB'
    },
	{
        id: 'Xenova/whisper-small',
        name: 'Whisper small (q4)',
        quantization: {
            encoder_model: 'q4',
            decoder_model_merged: 'q4',
        },
        size: '~300 MB'
    },
    {
        id: 'Xenova/whisper-base',
        name: 'Whisper Base (q4)',
        quantization: {
            encoder_model: 'q4',
            decoder_model_merged: 'q4',  //decoder_model_with_past: 'q4'
        },
        size: '~150 MB'
    }
];

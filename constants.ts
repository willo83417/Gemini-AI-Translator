import type { Language, AsrModel } from './types';

export const LANGUAGES: Language[] = [
    { code: 'auto', name: 'languages.autoDetect' },
    { code: 'en', name: 'languages.english', asrCode: 'en' },
    { code: 'zh-TW', name: 'languages.chineseTraditional', asrCode: 'zh' },
    { code: 'zh-HK', name: 'languages.chineseTraditionalHK', asrCode: 'zh' },
    { code: 'zh-Hans', name: 'languages.chineseSimplified', asrCode: 'zh' },
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
        name: 'Gemma-4-E2B-it (2 GB)', 
        value: 'gemma-4-E2B-it-web.task', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma-4-E2B-it-web.task'
    },
	{ 
        name: 'Gemma-4-E4B-it (2.9 GB)', 
        value: 'gemma-4-E4B-it-web.task', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma-4-E4B-it-web.task'
    },
    { 
        name: 'Gemma-3n-E2B (3.04 GB)', 
        value: 'gemma-3n-E2B-it-int4-Web.litertlm', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma-3n-E2B-it-int4-Web.litertlm'
    },
    { 
        name: 'Gemma-3n-E4B (4.28 GB)', 
        value: 'gemma-3n-E4B-it-int4-Web.litertlm', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma-3n-E4B-it-int4-Web.litertlm'
    },
	{ 
        name: 'Gemma-3-4B (2.4 GB)', 
        value: 'gemma3-4b-it-int4-web.task', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/gemma3-4b-it-int4-web.task'
    },
	{ 
        name: 'TranslateGemma-4B (3.62 GB)', 
        value: 'translategemma-4b-it-int8-web.task', 
        url: 'https://huggingface.co/willopcbeta/Gemma-3n-Web/resolve/main/translategemma-4b-it-int8-web.task'
    },
];

export const ASR_MODELS: AsrModel[] = [
    {
        id: 'willopcbeta/lite-whisper-large-v3-turbo-ONNX',
        name: 'lite-whisper-large-v3-turbo',
        quantization: {
            encoder_model: 'q4f16',
            decoder_model_merged: 'q4f16',
        },
        size: '~590 MB'
    },
    {
        id: 'willopcbeta/unsloth-whisper-large-v3-turbo-ONNX',
        name: 'unsloth-whisper-large-v3-turbo',
        quantization: {
            encoder_model: 'q4f16',
            decoder_model_merged: 'q4f16',
        },
        size: '~590 MB'
    },
	{
        id: 'willopcbeta/lite-whisper-small-fast-ONNX-v2',
        name: 'lite-whisper-small-fast',
        quantization: {
            encoder_model: 'q4f16',
            decoder_model_merged: 'q4',
        },
        size: '~280 MB'
    },
	{
        id: 'willopcbeta/unsloth-whisper-small-ONNX',
        name: 'unsloth-whisper-small',
        quantization: {
            encoder_model: 'q4f16',
            decoder_model_merged: 'q4',
        },
        size: '~290 MB'
    },
    {
        id: 'Xenova/whisper-base',
        name: 'Whisper Base',
        quantization: {
            encoder_model: 'q4',
            decoder_model_merged: 'q4',  //decoder_model_with_past: 'q4'
        },
        size: '~150 MB'
    }
];

export const OCR_MODELS = {
  ch_v5: {
    name: "ch_PP-OCRv5_mobile",
    description: "Chinese/English/Japanese",
    paths: {
      detPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/onnx/PP-OCRv5/det/ch_PP-OCRv5_mobile_det.onnx',
      recPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/onnx/PP-OCRv5/rec/ch_PP-OCRv5_rec_mobile_infer.onnx',
      dictPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/paddle/PP-OCRv5/rec/ch_PP-OCRv5_rec_mobile_infer/ppocrv5_dict.txt',
    },
  },
    latin_v5: {
    name: "latin_PP-OCRv5_mobile",
    description: "Latin languages (French, German, Spanish, etc.)",
    paths: {
      detPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/onnx/PP-OCRv5/det/ch_PP-OCRv5_mobile_det.onnx',
      recPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/onnx/PP-OCRv5/rec/latin_PP-OCRv5_rec_mobile_infer.onnx',
      dictPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/paddle/PP-OCRv5/rec/latin_PP-OCRv5_rec_mobile_infer/ppocrv5_latin_dict.txt',
    },
  },
  kr_v5: {
    name: "korean_PP-OCRv5_mobile",
    description: "Korean Only",
    paths: {
      detPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/onnx/PP-OCRv5/det/ch_PP-OCRv5_mobile_det.onnx',
      recPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/onnx/PP-OCRv5/rec/korean_PP-OCRv5_rec_mobile_infer.onnx',
      dictPath: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.4.0/paddle/PP-OCRv5/rec/korean_PP-OCRv5_rec_mobile_infer/ppocrv5_korean_dict.txt',
    },
  },
};
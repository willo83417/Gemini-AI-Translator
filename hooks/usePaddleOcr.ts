import { useState, useCallback, useRef, useEffect } from 'react';
import type { OcrEngineStatus, EsearchOCROutput, OcrModelConfig } from '../types';

export const usePaddleOcr = () => {
    const workerRef = useRef<Worker | null>(null);
    const [status, setStatus] = useState<OcrEngineStatus>('uninitialized');
    const [error, setError] = useState<string | null>(null);
    
    // Use refs for callbacks to avoid stale closures in worker event listener
    const pendingResolveRef = useRef<((value: any) => void) | null>(null);
    const pendingRejectRef = useRef<((reason?: any) => void) | null>(null);

    const cleanup = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    const initWorker = useCallback(() => {
        //console.log('[usePaddleOcr] Initializing worker...');
        cleanup();
        const worker = new Worker(new URL('../services/ocr.worker.ts', import.meta.url), { type: 'module' });
        
        worker.onmessage = (e) => {
            const { type, payload } = e.data;
            //console.log(`[usePaddleOcr] Worker message: ${type}`, payload);
            switch (type) {
                case 'status':
                    setStatus(payload);
                    break;
                case 'error':
                    //console.error('[usePaddleOcr] Worker reported error:', payload);
                    setError(payload);
                    setStatus('error');
                    if (pendingRejectRef.current) {
                        pendingRejectRef.current(new Error(payload));
                        pendingRejectRef.current = null;
                        pendingResolveRef.current = null;
                    }
                    break;
                case 'result':
                    if (pendingResolveRef.current) {
                        pendingResolveRef.current(payload);
                        pendingResolveRef.current = null;
                        pendingRejectRef.current = null;
                    }
                    break;
            }
        };

        worker.onerror = (err) => {
            //console.error('[usePaddleOcr] Worker terminal error:', err);
            setError('Worker error: ' + (err.message || 'Unknown error'));
            setStatus('error');
            if (pendingRejectRef.current) {
                pendingRejectRef.current(new Error('Worker crashed'));
                pendingRejectRef.current = null;
                pendingResolveRef.current = null;
            }
        };

        workerRef.current = worker;
        return worker;
    }, [cleanup]);

    const unloadOcr = useCallback(() => {
        //console.log('[usePaddleOcr] Unloading OCR...');
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'unload' });
        }
        setStatus('uninitialized');
        setError(null);
    }, []);

    const initializeOcr = useCallback(async (modelConfig: OcrModelConfig) => {
        //console.log('[usePaddleOcr] initializeOcr called with config:', modelConfig);
        setStatus('initializing');
        const worker = initWorker();
        worker.postMessage({ type: 'load', payload: modelConfig });
    }, [initWorker]);

    const recognize = useCallback(async (image: HTMLImageElement | HTMLCanvasElement): Promise<{ result: EsearchOCROutput, time: number } | null> => {
        //console.log('[usePaddleOcr] recognize called, status:', status);
        if (status !== 'ready' || !workerRef.current) {
            //console.warn('[usePaddleOcr] recognize called but not ready. Status:', status);
            return null;
        }

        try {
            //console.log('[usePaddleOcr] Creating ImageBitmap...');
            const imageBitmap = await createImageBitmap(image);
            //console.log('[usePaddleOcr] ImageBitmap created, sending to worker...');
            
            return new Promise((resolve, reject) => {
                pendingResolveRef.current = resolve;
                pendingRejectRef.current = reject;
                
                const timeoutId = setTimeout(() => {
                    if (pendingResolveRef.current === resolve) {
                        //console.error('[usePaddleOcr] Recognition timed out after 15s');
                        pendingResolveRef.current = null;
                        pendingRejectRef.current = null;
                        reject(new Error('OCR recognition timed out'));
                    }
                }, 15000);

                if (workerRef.current) {
                    workerRef.current.postMessage(
                        { type: 'recognize', payload: { imageBitmap } }, 
                        [imageBitmap]
                    );
                } else {
                    clearTimeout(timeoutId);
                    //console.error('[usePaddleOcr] Worker ref lost during recognize');
                    reject(new Error('Worker not initialized'));
                }
            }).finally(() => {
                // The actual timeout cleanup is handled inside the timeout or message listeners
                // But we can clear it if we tracked it differently. 
                // For simplicity here, the resolve/reject logic inside onmessage handles it.
            });
        } catch (err) {
            //console.error('[usePaddleOcr] Failed to create ImageBitmap or start OCR:', err);
            return null;
        }
    }, [status]);

    return { status, error, recognize, initializeOcr, unloadOcr };
};

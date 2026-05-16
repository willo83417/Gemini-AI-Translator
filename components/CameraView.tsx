
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { XIcon, FlashOnIcon, FlashOffIcon, GalleryIcon } from './icons';

interface CameraViewProps {
    onClose: () => void;
    onImageCaptured: (imageDataUrl: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, onImageCaptured }) => {
    const { t } = useTranslation();
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const isApplyingConstraints = useRef(false);

    // Camera controls state
    const [torchOn, setTorchOn] = useState(false);
    const [torchSupported, setTorchSupported] = useState(false);
    
    // Zoom control (Logarithmic)
    const [zoomPercent, setZoomPercent] = useState(0);
    const [zoomSupported, setZoomSupported] = useState(false);
    const [zoomLimits, setZoomLimits] = useState({ min: 1, max: 1 });

    const getActualZoom = useCallback((percent: number, min: number, max: number) => {
        if (min === max) return min;
        return min * Math.pow(max / min, percent / 100);
    }, []);

    const getPercentFromZoom = useCallback((actual: number, min: number, max: number) => {
        if (min === max) return 0;
        return (Math.log(actual / min) / Math.log(max / min)) * 100;
    }, []);

    const handleUserMedia = useCallback((mediaStream: MediaStream) => {
        setStream(mediaStream);
        const track = mediaStream.getVideoTracks()[0];
        if (!track) return;

        const capabilities = (track.getCapabilities() as any) || {};
        if (capabilities.torch) {
            setTorchSupported(true);
        }
        if (capabilities.zoom) {
            setZoomSupported(true);
            setZoomLimits({ min: capabilities.zoom.min, max: capabilities.zoom.max });
            const currentZoom = (track.getSettings() as any).zoom || capabilities.zoom.min;
            setZoomPercent(getPercentFromZoom(currentZoom, capabilities.zoom.min, capabilities.zoom.max));
        }
    }, [getPercentFromZoom]);

    const handleZoomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!stream || !zoomSupported || isApplyingConstraints.current) return;
        
        const newPercent = parseFloat(e.target.value);
        setZoomPercent(newPercent);
        
        const actualZoom = getActualZoom(newPercent, zoomLimits.min, zoomLimits.max);
        const track = stream.getVideoTracks()[0];
        
        try {
            isApplyingConstraints.current = true;
            await track.applyConstraints({
                advanced: [{ zoom: actualZoom }]
            } as any);
        } catch (err) {
             console.error('Failed to apply zoom:', err);
        } finally {
            isApplyingConstraints.current = false;
        }
    };
    
    const handleToggleTorch = async () => {
        if (!stream || !torchSupported || isApplyingConstraints.current) return;
        
        const newTorchState = !torchOn;
        const track = stream.getVideoTracks()[0];
        
        try {
            isApplyingConstraints.current = true;
            await track.applyConstraints({
                advanced: [{ torch: newTorchState }]
            } as any);
            setTorchOn(newTorchState);
        } catch (err) {
             console.error('Failed to apply torch:', err);
        } finally {
            isApplyingConstraints.current = false;
        }
    };

    const handleCapture = useCallback(() => {
        if (isCapturing || !webcamRef.current) return;

        setIsCapturing(true);
        setError(null);
        
        try {
            const imageDataUrl = webcamRef.current.getScreenshot({ width: 1024, height: 768 });
            if (imageDataUrl) {
                setPreviewImage(imageDataUrl);
            } else {
                throw new Error('Could not get screenshot from camera.');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Capture failed.';
            setError(t('camera.errorCapture', { message }));
        } finally {
            setIsCapturing(false);
        }
    }, [isCapturing, t]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || isCapturing) return;
        setIsCapturing(true);
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target?.result as string;
                if(imageDataUrl) {
                    const img = new Image();
                    img.onload = () => {
                        let { width, height } = img;
                        const maxDimension = 1024;
                        
                        if (width > maxDimension || height > maxDimension) {
                            if (width > height) {
                                height = Math.round((height * maxDimension) / width);
                                width = maxDimension;
                            } else {
                                width = Math.round((width * maxDimension) / height);
                                height = maxDimension;
                            }
                        }
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(img, 0, 0, width, height);
                            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                            setPreviewImage(resizedDataUrl);
                        } else {
                            setPreviewImage(imageDataUrl);
                        }
                        setIsCapturing(false);
                    };
                    img.onerror = () => {
                        setPreviewImage(imageDataUrl);
                        setIsCapturing(false);
                    };
                    img.src = imageDataUrl;
                } else {
                    setIsCapturing(false);
                }
            };
            reader.readAsDataURL(file);
        } catch(err) {
            setError(t('camera.errorLoad', { message: 'File read error' }));
            setIsCapturing(false);
        }
    };

    const onImageCapturedRef = useRef(onImageCaptured);
    useEffect(() => {
        onImageCapturedRef.current = onImageCaptured;
    }, [onImageCaptured]);

    const handleConfirm = useCallback(() => {
        console.log('[CameraView] handleConfirm clicked, previewImage present:', !!previewImage);
        if (previewImage) {
            try {
                // Give React a tick to unmount/update UI before processing
                setTimeout(() => {
                    console.log('[CameraView] timeout fired, calling onImageCapturedRef.current');
                    onImageCapturedRef.current(previewImage);
                }, 50);
            } catch (err) {
                console.error('[CameraView] Error in handleConfirm execution:', err);
            }
        }
    }, [previewImage]); // Removed onImageCaptured dependency to keep handleConfirm stable

    const handleRetake = useCallback(() => {
        setPreviewImage(null);
    }, []);

    const videoConstraints: MediaTrackConstraints = {
        facingMode: 'environment',
        width: { ideal: 1024 },
        height: { ideal: 768 }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden" role="dialog" aria-modal="true">
            <div className="relative w-full h-full flex items-center justify-center">
                {!previewImage ? (
                    <>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            screenshotQuality={0.9}
                            videoConstraints={videoConstraints}
                            onUserMedia={handleUserMedia}
                            onUserMediaError={(err) => setError(t('camera.errorAccess'))}
                            className="w-full h-full object-cover"
                        />
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                        <div className="absolute inset-0 flex flex-col justify-between items-center p-4 z-20 pointer-events-none">
                            <div className="w-full flex justify-between items-start pointer-events-auto">
                                <div className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/10"></div>
                                <button onClick={onClose} className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 border border-white/10 hover:bg-black/60 transition-colors shadow-lg" aria-label={t('camera.closeAriaLabel')}>
                                    <XIcon className="w-8 h-8"/>
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow-xl pointer-events-auto animate-bounce" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="w-full flex flex-col items-center pb-8 space-y-6 pointer-events-auto">
                                {zoomSupported && (
                                    <div className="w-full max-w-xs flex flex-col items-center space-y-2">
                                        <div className="flex justify-between w-full px-2 text-[10px] text-white/70 font-bold uppercase tracking-widest">
                                            <span>1x</span>
                                            <span className="bg-blue-500/80 px-2 py-0.5 rounded text-white">{getActualZoom(zoomPercent, zoomLimits.min, zoomLimits.max).toFixed(1)}x</span>
                                            <span>{zoomLimits.max.toFixed(0)}x</span>
                                        </div>
                                        <div className="w-full h-12 flex items-center px-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={zoomPercent}
                                                onChange={handleZoomChange}
                                                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                aria-label={t('camera.zoomAriaLabel')}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="w-full flex justify-around items-center max-w-sm">
                                     <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg" aria-label={t('camera.galleryAriaLabel')}>
                                        <GalleryIcon className="w-8 h-8" />
                                    </button>

                                    <button 
                                        onClick={handleCapture} 
                                        disabled={isCapturing}
                                        className="group relative w-20 h-20 flex items-center justify-center disabled:opacity-50"
                                        aria-label={t('camera.captureAriaLabel')}
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse group-hover:bg-white/30"></div>
                                        <div className="relative w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90">
                                            {isCapturing && <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" role="status" aria-label={t('camera.processingAriaLabel')}></div>}
                                        </div>
                                    </button>

                                    {torchSupported ? (
                                        <button onClick={handleToggleTorch} className={`p-3 backdrop-blur-md rounded-full border transition-all shadow-lg ${torchOn ? 'bg-yellow-400 border-yellow-500 text-black' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} aria-label={torchOn ? t('camera.flashOnAriaLabel') : t('camera.flashOffAriaLabel')}>
                                            {torchOn ? <FlashOnIcon className="w-8 h-8" /> : <FlashOffIcon className="w-8 h-8" />}
                                        </button>
                                    ) : <div className="w-14 h-14"></div>}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute bottom-8 w-full flex justify-center space-x-12 px-8">
                            <button 
                                onClick={handleRetake} 
                                className="px-6 py-3 bg-gray-600/80 hover:bg-gray-500/80 backdrop-blur-md text-white rounded-full shadow-lg font-medium transition-all"
                            >
                                {t('common.cancel') || 'Retake'}
                            </button>
                            <button 
                                onClick={handleConfirm} 
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 backdrop-blur-md text-white rounded-full shadow-lg font-medium transition-all"
                            >
                                {t('common.confirm') || 'Use Photo'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraView;
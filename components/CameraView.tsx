import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { XIcon, FlashOnIcon, FlashOffIcon, GalleryIcon } from './icons';

interface CameraViewProps {
    onClose: () => void;
    onImageCaptured: (imageDataUrl: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, onImageCaptured }) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // Camera controls state
    const [torchOn, setTorchOn] = useState(false);
    const [torchSupported, setTorchSupported] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [zoomSupported, setZoomSupported] = useState(false);
    const [minZoom, setMinZoom] = useState(1);
    const [maxZoom, setMaxZoom] = useState(1);
    const [stepZoom, setStepZoom] = useState(0.1);

    useEffect(() => {
        let mediaStream: MediaStream | null = null;
        
        const startCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }

                // Check for camera capabilities (torch, zoom)
                const track = mediaStream.getVideoTracks()[0];
                const capabilities = track.getCapabilities() as any;

                if (capabilities.torch) {
                    setTorchSupported(true);
                }
                if (capabilities.zoom) {
                    setZoomSupported(true);
                    setMinZoom(capabilities.zoom.min);
                    setMaxZoom(capabilities.zoom.max);
                    setStepZoom(capabilities.zoom.step || 0.1);
                    setZoom(capabilities.zoom.min);
                }

            } catch (err) {
                console.error("Error accessing camera:", err);
                setError(t('camera.errorAccess'));
            }
        };

        startCamera();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [t]); // Add t to dependency array
    
    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current || isCapturing) return;

        setIsCapturing(true);
        setError(null);
        
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Could not get canvas context.');
            }
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            onImageCaptured(imageDataUrl);

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(t('camera.errorCapture', { message }));
            setIsCapturing(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || isCapturing) return;

        setIsCapturing(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target?.result as string;
                if(imageDataUrl) {
                    onImageCaptured(imageDataUrl);
                } else {
                    throw new Error("Could not read the selected file.");
                }
            };
            reader.onerror = () => {
                throw new Error("Error reading the file.");
            }
            reader.readAsDataURL(file);
        } catch(err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(t('camera.errorLoad', { message }));
            setIsCapturing(false);
        }
    };

    const handleGalleryClick = () => {
        fileInputRef.current?.click();
    };

    const handleToggleTorch = async () => {
        if (!stream || !torchSupported) return;
        const track = stream.getVideoTracks()[0];
        try {
            await track.applyConstraints({
                advanced: [{ torch: !torchOn }]
            } as any);
            setTorchOn(!torchOn);
        } catch (err) {
            console.error('Failed to toggle torch:', err);
        }
    };
    
    const handleZoomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!stream || !zoomSupported) return;
        const newZoom = parseFloat(e.target.value);
        setZoom(newZoom);
        const track = stream.getVideoTracks()[0];
        try {
            await track.applyConstraints({
                advanced: [{ zoom: newZoom }]
            } as any);
        } catch (err) {
             console.error('Failed to apply zoom:', err);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="camera-view-title">
            <div className="relative w-full h-full flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <div className="absolute inset-0 flex flex-col justify-between items-center p-4">
                    <div className="w-full flex justify-end">
                         <h2 id="camera-view-title" className="sr-only">{t('camera.title')}</h2>
                        <button onClick={onClose} className="text-white bg-black bg-opacity-50 rounded-full p-2" aria-label={t('camera.closeAriaLabel')}>
                            <XIcon className="w-8 h-8"/>
                        </button>
                    </div>

                    {error && 
                        <div className="bg-red-500 text-white p-3 rounded-md text-center transition-opacity" role="alert">
                            {error}
                        </div>
                    }

                    <div className="w-full flex flex-col items-center pb-6 space-y-4">
                         {zoomSupported && (
                            <div className="w-full max-w-xs flex items-center justify-center bg-black/30 p-2 rounded-full">
                                <input
                                    type="range"
                                    min={minZoom}
                                    max={maxZoom}
                                    step={stepZoom}
                                    value={zoom}
                                    onChange={handleZoomChange}
                                    className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer"
                                    aria-label={t('camera.zoomAriaLabel')}
                                />
                            </div>
                        )}
                        <div className="w-full flex justify-around items-center">
                            <button onClick={handleGalleryClick} className="text-white" aria-label={t('camera.galleryAriaLabel')}>
                                <GalleryIcon className="w-10 h-10" />
                            </button>

                            <button 
                                onClick={handleCapture} 
                                disabled={isCapturing}
                                className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center transition-all hover:bg-white/50 disabled:opacity-50 ring-4 ring-white/50 focus:ring-white"
                                aria-label={t('camera.captureAriaLabel')}
                            >
                                {isCapturing ? (
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" role="status" aria-label={t('camera.processingAriaLabel')}></div>
                                ) : (
                                    <div className="w-16 h-16 bg-white rounded-full shadow-lg"></div>
                                )}
                            </button>

                             {torchSupported ? (
                                <button onClick={handleToggleTorch} className="text-white" aria-label={torchOn ? t('camera.flashOnAriaLabel') : t('camera.flashOffAriaLabel')}>
                                    {torchOn ? <FlashOnIcon className="w-10 h-10" /> : <FlashOffIcon className="w-10 h-10" />}
                                </button>
                             ) : (
                                <div className="w-10 h-10"></div> // Placeholder for alignment
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraView;
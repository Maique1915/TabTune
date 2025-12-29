import { useRef, useState, useCallback } from 'react';

// Declare html2canvas global type
declare global {
    interface Window {
        html2canvas: any;
    }
}

export interface ScreenRecorderOptions {
    fps?: number;
    videoBitsPerSecond?: number;
}

export interface ScreenRecorderResult {
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    downloadVideo: (blob: Blob, filename?: string) => void;
    error: string | null;
}

/**
 * Hook para gravar a tela de um elemento específico como vídeo
 * Funciona com SVG, Canvas, ou qualquer elemento DOM
 */
export function useScreenRecorder(
    elementRef: React.RefObject<HTMLElement | null>,
    options: ScreenRecorderOptions = {}
): ScreenRecorderResult {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fps = options.fps || 30;
    const frameInterval = 1000 / fps;

    const captureFrame = useCallback(async (canvas: HTMLCanvasElement, element: HTMLElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            // More efficient approach: serialize SVG and draw directly
            const svgElement = element.querySelector('svg');
            if (!svgElement) return;

            // Get playhead element for overlay
            const playheadElement = element.querySelector('.absolute.top-0.bottom-0.w-2.bg-cyan-400') as HTMLElement;

            // Serialize SVG
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // Create image from SVG
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
                img.src = url;
            });

            // Clear and draw background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const bgColor = window.getComputedStyle(element).backgroundColor;
            ctx.fillStyle = bgColor || '#09090b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw SVG
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw playhead overlay if visible
            if (playheadElement && playheadElement.style.left) {
                const leftPercent = parseFloat(playheadElement.style.left);
                const playheadX = (leftPercent / 100) * canvas.width;

                ctx.fillStyle = 'rgba(6, 182, 212, 1)';
                ctx.shadowColor = 'rgba(6, 182, 212, 1)';
                ctx.shadowBlur = 20;
                ctx.fillRect(playheadX, 0, 2 * window.devicePixelRatio, canvas.height);
                ctx.shadowBlur = 0; // Reset shadow
            }

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error capturing frame:', err);
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const element = elementRef.current;
            if (!element) {
                throw new Error('Element not found');
            }

            // Cria um canvas para capturar os frames
            const rect = element.getBoundingClientRect();
            const canvas = document.createElement('canvas');
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            canvasRef.current = canvas;

            // Configura o MediaRecorder
            const stream = canvas.captureStream(fps);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: options.videoBitsPerSecond || 5000000,
            });

            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setError(null);

            // Loop de captura de frames
            let lastFrameTime = performance.now();

            const captureLoop = async () => {
                const now = performance.now();
                const elapsed = now - lastFrameTime;

                if (elapsed >= frameInterval) {
                    await captureFrame(canvas, element);
                    lastFrameTime = now - (elapsed % frameInterval);
                }

                if (mediaRecorderRef.current?.state === 'recording') {
                    animationFrameRef.current = requestAnimationFrame(captureLoop);
                }
            };

            captureLoop();

        } catch (err: any) {
            setError(err.message);
            console.error('Recording error:', err);
        }
    }, [elementRef, fps, frameInterval, options.videoBitsPerSecond, captureFrame]);

    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;
            if (!mediaRecorder) {
                resolve(null);
                return;
            }

            // Para o loop de captura
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                chunksRef.current = [];
                setIsRecording(false);
                canvasRef.current = null;
                resolve(blob);
            };

            mediaRecorder.stop();
        });
    }, []);

    const downloadVideo = useCallback((blob: Blob, filename: string = 'recording.webm') => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording,
        downloadVideo,
        error,
    };
}

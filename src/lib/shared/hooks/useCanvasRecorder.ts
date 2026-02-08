import { useRef, useState, useCallback, useMemo } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export interface CanvasRecorderOptions {
    fps?: number;
    format?: 'webm' | 'mp4';
    quality?: 'low' | 'medium' | 'high';
}

export interface CanvasRecorderResult {
    isRecording: boolean;
    isRendering: boolean;
    isComplete: boolean;
    renderProgress: number;
    estimatedTime: number | null; // seconds remaining
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    renderToFile: (onProgress?: (progress: number) => void) => Promise<Blob | null>;
    convertWebMToMP4: (webmBlob: Blob, onProgress?: (progress: number) => void) => Promise<Blob | null>;
    captureFrame: (canvas: HTMLCanvasElement, index: number) => Promise<void>;
    renderFramesToVideo: (totalFrames: number, onProgress?: (progress: number) => void) => Promise<Blob | null>;
    setRenderProgress: (progress: number) => void;
    setRenderStatus: (status: string | null) => void;
    setIsRendering: (isRendering: boolean) => void;
    setIsComplete: (isComplete: boolean) => void;
    cancelRender: () => void;
    downloadVideo: (blob: Blob, filename?: string) => void;
    error: string | null;
    renderStatus: string | null;
}

const QUALITY_SETTINGS = {
    low: { crf: 28, preset: 'ultrafast', bitrate: 5000000, scale: 0.5 },    // 960x540
    medium: { crf: 22, preset: 'fast', bitrate: 15000000, scale: 0.75 },   // 1440x810
    high: { crf: 12, preset: 'veryfast', bitrate: 45000000, scale: 1 },    // 1920x1080
};

/**
 * Unified canvas recorder hook for both /studio and /tab-editor
 * Supports WebM (fast, real-time) and MP4 (compatible, FFmpeg-based)
 */
export function useCanvasRecorder(
    canvasRef: React.RefObject<HTMLElement | null>,
    options: CanvasRecorderOptions = {}
): CanvasRecorderResult {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const ffmpegLoadPromiseRef = useRef<Promise<void> | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const frameCountRef = useRef(0);
    const isCancelledRef = useRef(false);
    const masterCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);
    const [renderStatus, setRenderStatus] = useState<string | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const renderStartTimeRef = useRef<number | null>(null);

    const {
        fps = 30,
        format = 'webm',
        quality = 'medium'
    } = useMemo(() => options, [options.fps, options.format, options.quality]);

    const loadFFmpeg = useCallback(async () => {
        if (ffmpegRef.current?.loaded) return;
        // If we have a pending load, return it
        if (ffmpegLoadPromiseRef.current) return ffmpegLoadPromiseRef.current;

        ffmpegLoadPromiseRef.current = (async () => {
            // Always create a fresh instance if not loaded/terminated
            const ffmpeg = new FFmpeg();
            ffmpegRef.current = ffmpeg;

            try {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
                setRenderStatus('Iniciando motor de vídeo...');
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
            } catch (err) {
                console.error('FFmpeg load error:', err);
                ffmpegLoadPromiseRef.current = null;
                ffmpegRef.current = null;
                throw err;
            }
        })();

        return ffmpegLoadPromiseRef.current;
    }, []);

    // WebM Recording (real-time, fast)
    const startRecording = useCallback(async () => {
        const container = canvasRef.current;
        if (!container) throw new Error('Container not found');

        setIsRecording(true);
        setError(null);
        chunksRef.current = [];

        try {
            const qualityCfg = (QUALITY_SETTINGS as any)[quality];
            const scaleFactor = qualityCfg.scale;
            const firstCanvas = container.querySelector('canvas');
            const sourceWidth = firstCanvas ? firstCanvas.width : 1920;
            const sourceHeight = firstCanvas ? firstCanvas.height : 1080;

            const targetWidth = Math.round(sourceWidth * scaleFactor);
            const targetHeight = Math.round(sourceHeight * scaleFactor);

            // Create Master Canvas
            if (!masterCanvasRef.current) {
                masterCanvasRef.current = document.createElement('canvas');
            }

            const masterCanvas = masterCanvasRef.current;
            masterCanvas.width = targetWidth;
            masterCanvas.height = targetHeight;

            const masterCtx = masterCanvas.getContext('2d', { alpha: false });
            if (!masterCtx) throw new Error('Failed to get master canvas context');

            // Force high-quality scaling
            masterCtx.imageSmoothingEnabled = true;
            masterCtx.imageSmoothingQuality = 'high';

            // Draw initial frame if background is needed
            masterCtx.fillStyle = '#09090b';
            masterCtx.fillRect(0, 0, targetWidth, targetHeight);

            // Find available mime types
            const mimeTypes = [
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm',
            ];
            const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
            console.log(`Starting ${quality} recording at ${targetWidth}x${targetHeight} (${scaleFactor}x scale)`);

            const stream = masterCanvas.captureStream(fps);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: qualityCfg.bitrate,
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(100); // Collect chunks every 100ms
            mediaRecorderRef.current = mediaRecorder;

            // Start Capture Loop
            const captureLoop = () => {
                const canvases = container.querySelectorAll('canvas');
                if (masterCtx && canvases.length > 0) {
                    // Clear background every frame to prevent smearing/ghosting
                    masterCtx.fillStyle = '#09090b';
                    masterCtx.fillRect(0, 0, targetWidth, targetHeight);

                    // Draw layers sequentially (Notation -> Playhead)
                    canvases.forEach(c => {
                        masterCtx.drawImage(c, 0, 0, targetWidth, targetHeight);
                    });
                }
                animationFrameRef.current = requestAnimationFrame(captureLoop);
            };
            captureLoop();

        } catch (err: any) {
            setError(err.message);
            setIsRecording(false);
            throw err;
        }
    }, [canvasRef, fps, quality]);

    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        // Add a buffer delay to ensure final frames are captured and encoded
        // Also check cancellation
        if (isCancelledRef.current) return null;

        await new Promise(resolve => setTimeout(resolve, 500));

        if (isCancelledRef.current) return null;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;
            if (!mediaRecorder) {
                resolve(null);
                return;
            }

            mediaRecorder.onstop = () => {
                if (isCancelledRef.current) {
                    resolve(null);
                    return;
                }

                const type = mediaRecorder.mimeType || 'video/webm';
                const blob = new Blob(chunksRef.current, { type });
                chunksRef.current = [];
                setIsRecording(false);

                // For WebM, finishing recording is finishing the whole process
                if (format === 'webm') {
                    setIsRendering(false);
                    setIsComplete(true);
                    setRenderProgress(100);
                }

                resolve(blob);
            };

            mediaRecorder.stop();
        });
    }, [format]);

    // Convert WebM to MP4 using FFmpeg
    const convertWebMToMP4 = useCallback(async (webmBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob | null> => {
        try {
            if (isCancelledRef.current) return null;

            console.log('Starting WebM to MP4 conversion...');
            console.log('WebM blob size:', webmBlob.size, 'bytes');
            console.log('WebM blob type:', webmBlob.type);

            // Validate WebM blob
            if (!webmBlob || webmBlob.size === 0) {
                throw new Error('WebM blob is empty or invalid');
            }

            if (webmBlob.size < 1000) {
                console.warn('WebM blob is very small, might be incomplete');
            }

            // Create a fresh FFmpeg instance for this conversion
            // Using loadFFmpeg helper to ensure consistency
            await loadFFmpeg();
            if (isCancelledRef.current || !ffmpegRef.current?.loaded) return null;
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on('log', ({ message }) => {
                console.log('[FFmpeg]:', message);
            });

            if (onProgress) onProgress(5);
            setRenderProgress(Math.max(renderProgress, 5));
            setRenderStatus('Carregando motor...');
            setIsComplete(false);
            renderStartTimeRef.current = Date.now();
            setEstimatedTime(null);

            // FFmpeg is already loaded by loadFFmpeg helper

            if (onProgress) onProgress(10);
            setRenderProgress(10);
            setRenderStatus('Preparando arquivos...');

            // Write WebM file to FFmpeg virtual filesystem
            console.log('Writing WebM to FFmpeg FS...');
            const webmData = await fetchFile(webmBlob);
            console.log('WebM data size:', webmData.byteLength, 'bytes');

            if (isCancelledRef.current) return null;
            try {
                await ffmpeg.writeFile('input.webm', webmData);
                console.log('WebM file written successfully');
            } catch (writeErr) {
                console.error('Error writing WebM file:', writeErr);
                throw new Error(`Failed to write WebM file: ${writeErr}`);
            }

            if (onProgress) onProgress(30);
            setRenderProgress(30);
            setRenderStatus('Convertendo para MP4...');

            // Convert WebM to MP4
            console.log('Starting FFmpeg conversion...');
            const qualitySettings = (QUALITY_SETTINGS as any)[quality];
            const progressHandler = (event: any) => {
                // Robust progress extraction
                let ratio = 0;
                if (typeof event === 'number') {
                    ratio = event;
                } else if (event && typeof event.progress === 'number') {
                    ratio = event.progress;
                } else if (event && typeof event.ratio === 'number') {
                    ratio = event.ratio;
                }

                // Clamp ratio to 0..1 range
                const safeRatio = Math.max(0, Math.min(1, ratio));
                const mappedProgress = 25 + (safeRatio * 70); // 25% to 95%

                setRenderProgress(mappedProgress);
                setRenderStatus(`Convertendo para MP4: ${Math.round(safeRatio * 100)}%...`);

                // Calculate estimated time remaining safely
                if (renderStartTimeRef.current && safeRatio > 0.02) {
                    const elapsed = (Date.now() - renderStartTimeRef.current) / 1000;
                    const totalEstimated = elapsed / safeRatio;
                    const remaining = Math.max(0, totalEstimated - elapsed);

                    // Only update if it's a sensible number (less than 1 hour)
                    if (remaining < 3600) {
                        setEstimatedTime(Math.round(remaining));
                    }
                }

                if (onProgress) onProgress(mappedProgress);
            };

            ffmpeg.on('progress', progressHandler);

            try {
                const ffmpegArgs = [
                    '-i', 'input.webm',
                    '-c:v', 'libx264',
                    '-pix_fmt', (quality as string) === 'ultra' ? 'yuv444p' : 'yuv420p',
                    '-preset', qualitySettings.preset,
                    '-crf', String(qualitySettings.crf),
                    '-tune', 'animation',
                    '-movflags', '+faststart',
                    'output.mp4'
                ];

                if (isCancelledRef.current) return null;
                await ffmpeg.exec(ffmpegArgs);
                console.log('FFmpeg conversion completed');
            } catch (execErr) {
                console.error('FFmpeg exec error:', execErr);
                throw new Error(`FFmpeg conversion failed: ${execErr}`);
            } finally {
                ffmpeg.off('progress', progressHandler);
            }

            if (isCancelledRef.current) return null;

            if (onProgress) onProgress(95);
            setRenderProgress(95);

            // Read output MP4
            console.log('Reading output MP4...');
            const data = await ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });
            console.log('MP4 blob created successfully, size:', mp4Blob.size, 'bytes');

            // Cleanup
            try {
                await ffmpeg.deleteFile('input.webm');
                await ffmpeg.deleteFile('output.mp4');
                console.log('Cleanup completed');
            } catch (cleanupErr) {
                console.warn('Cleanup error (non-fatal):', cleanupErr);
            }

            // We don't terminate here anymore, let the hook management or cancel handle it
            // ensuring we can reuse if needed, or just let it close component unmount.
            // But usually we can keep it alive. Or stick to original behavior:
            try {
                if (ffmpeg.loaded) {
                    ffmpeg.terminate();
                    console.log('FFmpeg instance terminated');
                }
                ffmpegRef.current = null; // Clear ref
            } catch (termErr) {
                console.warn('FFmpeg termination error (non-fatal):', termErr);
            }

            if (onProgress) onProgress(100);
            setRenderProgress(100);
            setRenderStatus('Renderização Concluída');
            setIsComplete(true);
            setEstimatedTime(0);

            return mp4Blob;
        } catch (err: any) {
            if (isCancelledRef.current) return null;
            console.error('WebM to MP4 conversion error:', err);
            setError(err.message || 'Conversion failed');
            setIsRendering(false);
            return null;
        }
    }, [quality, loadFFmpeg]);

    const captureFrame = useCallback(async (canvas: HTMLCanvasElement, index: number) => {
        try {
            if (isCancelledRef.current) return;
            await loadFFmpeg();

            if (isCancelledRef.current || !ffmpegRef.current?.loaded) return;
            const ffmpeg = ffmpegRef.current;

            // Format index as 0000
            const fileName = `frame${String(index).padStart(4, '0')}.png`;

            // Get canvas data as blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png');
            });

            if (isCancelledRef.current) return;

            const data = await fetchFile(blob);

            if (isCancelledRef.current) return;
            await ffmpeg.writeFile(fileName, data);

            // Also keep track of frames needed for conversion
            frameCountRef.current = Math.max(frameCountRef.current, index + 1);
        } catch (err: any) {
            // Ignore errors if cancelled
            if (isCancelledRef.current) return;
            console.error('Frame capture error:', err);
            setError(`Capture failed at frame ${index}: ${err.message}`);
        }
    }, [loadFFmpeg]);

    const renderFramesToVideo = useCallback(async (totalFrames: number, onProgress?: (progress: number) => void): Promise<Blob | null> => {
        try {
            if (isCancelledRef.current) return null;
            await loadFFmpeg();

            if (isCancelledRef.current || !ffmpegRef.current?.loaded) return null;
            const ffmpeg = ffmpegRef.current;

            setIsRendering(true);
            setIsComplete(false);
            renderStartTimeRef.current = Date.now();

            const qualitySettings = (QUALITY_SETTINGS as any)[quality];
            const progressHandler = (event: any) => {
                let ratio = 0;
                if (typeof event === 'number') ratio = event;
                else if (event && typeof event.progress === 'number') ratio = event.progress;

                const safeRatio = Math.max(0, Math.min(1, ratio));
                const mappedProgress = 20 + (safeRatio * 75); // 20% to 95%
                setRenderProgress(mappedProgress);

                const currentFrame = Math.round(safeRatio * totalFrames);
                const percent = Math.round(safeRatio * 100);
                setRenderStatus(`Processando quadro ${currentFrame} de ${totalFrames} (${percent}%)...`);

                if (onProgress) onProgress(mappedProgress);
            };

            ffmpeg.on('progress', progressHandler);

            try {
                // Use yuv444p for Ultra quality to avoid chroma blurring
                const pixFmt = (quality as string) === 'ultra' ? 'yuv444p' : 'yuv420p';

                const ffmpegArgs = [
                    '-framerate', String(fps),
                    '-i', 'frame%04d.png',
                    '-c:v', 'libx264',
                    '-pix_fmt', pixFmt,
                    '-preset', qualitySettings.preset,
                    '-crf', String(qualitySettings.crf),
                    '-tune', 'animation',
                    '-movflags', '+faststart',
                    'output.mp4'
                ];

                if (isCancelledRef.current) return null;
                await ffmpeg.exec(ffmpegArgs);
            } finally {
                ffmpeg.off('progress', progressHandler);
            }

            if (isCancelledRef.current) return null;

            const data = await ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });

            // Cleanup FS
            for (let i = 0; i < totalFrames; i++) {
                try {
                    await ffmpeg.deleteFile(`frame${String(i).padStart(4, '0')}.png`);
                } catch (e) { }
            }
            await ffmpeg.deleteFile('output.mp4');

            setIsComplete(true);
            setRenderProgress(100);
            return mp4Blob;
        } catch (err: any) {
            if (isCancelledRef.current) return null;
            setError(err.message);
            setIsRendering(false);
            return null;
        }
    }, [quality, fps, loadFFmpeg]);

    // MP4 Rendering (record as WebM, then convert to MP4)
    const renderToFile = useCallback(async (onProgress?: (progress: number) => void): Promise<Blob | null> => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not found');

        // For MP4, we record as WebM first, then convert
        // This is handled by the parent component calling startRecording/stopRecording
        // and then calling convertWebMToMP4

        // For now, just start recording
        if (format === 'mp4') {
            setIsRendering(true);
            setIsComplete(false);
            setRenderProgress(0);
            await startRecording();
            return null; // Parent will handle the rest
        }

        // For WebM, use direct recording
        setIsRendering(true);
        setIsComplete(false);
        setRenderProgress(0);
        await startRecording();
        return null;
    }, [canvasRef, format, startRecording]);

    const cancelRender = useCallback(() => {
        isCancelledRef.current = true;

        // Clear promises and refs immediately
        ffmpegLoadPromiseRef.current = null;

        if (ffmpegRef.current) {
            try {
                // Only terminate if loaded to avoid errors
                if (ffmpegRef.current.loaded) {
                    ffmpegRef.current.terminate();
                    console.log('FFmpeg terminated');
                }
            } catch (e) {
                console.warn('Error terminating FFmpeg (safe to ignore):', e);
            }
            // Nullify reference to prevent reuse
            ffmpegRef.current = null;
        }

        setIsRendering(false);
        setIsComplete(false);
        setRenderProgress(0);
        setEstimatedTime(null);

        // Reset cancellation flag after a delay to allow pending ops to abort
        setTimeout(() => {
            isCancelledRef.current = false;
        }, 1000);
    }, []);

    const downloadVideo = useCallback((blob: Blob, filename: string = 'video') => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    return useMemo(() => ({
        isRecording,
        isRendering,
        isComplete,
        renderProgress,
        estimatedTime,
        startRecording,
        stopRecording,
        renderToFile,
        convertWebMToMP4,
        captureFrame,
        renderFramesToVideo,
        setRenderProgress,
        setRenderStatus,
        setIsRendering,
        setIsComplete,
        cancelRender,
        downloadVideo,
        error,
        renderStatus,
    }), [
        isRecording,
        isRendering,
        isComplete,
        renderProgress,
        estimatedTime,
        startRecording,
        stopRecording,
        renderToFile,
        convertWebMToMP4,
        captureFrame,
        renderFramesToVideo,
        setRenderProgress,
        setRenderStatus,
        setIsRendering,
        setIsComplete,
        cancelRender,
        downloadVideo,
        error,
        renderStatus,
    ]);
}

"use client";

import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ScoreStyle, MeasureData } from '@/lib/tab-editor/types';
import { getNoteKeyFromFret } from '@/lib/tab-editor/utils/musicMath';
import { Music, MousePointerClick, MoreHorizontal, MoveLeft, MoveRight, Film, Settings } from 'lucide-react';
import { useCanvasRecorder } from '@/lib/shared/hooks/useCanvasRecorder';
import { VideoRenderSettingsModal, VideoRenderSettings } from '@/components/shared/VideoRenderSettingsModal';
import { RenderProgressModal } from '@/components/shared/RenderProgressModal';

interface ScorePreviewProps {
    code: string; // Kept for interface compatibility but largely unused now
    measures: MeasureData[];
    timeSignature: string;
    playbackPosition: number;
    isPlaying: boolean;
    style: ScoreStyle;
    showControls?: boolean;
    showNotation?: boolean;
    showTablature?: boolean;
    onMeasuresChange?: (measures: MeasureData[]) => void;
    selectedNoteIds?: string[];
    onSelectNote?: (noteId: string, isMulti: boolean) => void;
    onDoubleClickNote?: (noteId: string) => void;
    currentMeasureIndex?: number;
    onPlaybackControl?: (isPlaying: boolean) => void;
    onPlaybackPositionChange?: (position: number) => void;
}

declare global {
    interface Window {
        Vex: any;
        VexTab: any; // Kept to avoid breaking global types if used elsewhere
    }
}



const MeasureThumbnail = memo(({
    measureData,
    measureIndex,
    isActive,
    progress,
    style,
    shouldAnimate,
    timeSignatureStr,
    showNotation,
    showTablature,
    onNoteClick,
    onNoteDoubleClick,
    selectedNoteIds,
    dpr = 1
}: {
    measureData: MeasureData;
    measureIndex: number;
    isActive: boolean;
    progress: number;
    style: ScoreStyle;
    shouldAnimate: boolean;
    timeSignatureStr: string;
    showNotation: boolean;
    showTablature: boolean;
    onNoteClick?: (measureIndex: number, noteIndex: number, isMulti: boolean) => void;
    onNoteDoubleClick?: (noteId: string) => void;
    selectedNoteIds?: string[];
    dpr?: number;
}) => {
    const notationCanvasRef = useRef<HTMLCanvasElement>(null);
    const playheadCanvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenSvgRef = useRef<SVGElement | null>(null);
    const cachedNotationImgRef = useRef<HTMLImageElement | null>(null);
    const [renderError, setRenderError] = useState<string | null>(null);

    // Resolution Constants
    const width = 800;
    const height = 340;

    const hexToRgba = (hex: string, alpha: number) => {
        let c: any;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            c = '0x' + c.join('');
            return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
        }
        return hex;
    };

    const applyStyles = (obj: any, styleDef: any, bg: string = 'transparent') => {
        if (!obj || !styleDef) return;
        const color = typeof styleDef === 'string' ? styleDef : styleDef.color;
        const opacity = typeof styleDef === 'string' ? 1 : (styleDef.opacity ?? 1);
        const shadow = typeof styleDef === 'string' ? false : (styleDef.shadow ?? false);
        const rgbaColor = hexToRgba(color, opacity);

        const styleOpts: any = { fillStyle: rgbaColor, strokeStyle: rgbaColor, backgroundColor: bg };
        if (shadow) {
            styleOpts.shadowColor = typeof styleDef === 'string' ? color : (styleDef.shadowColor || color);
            styleOpts.shadowBlur = typeof styleDef === 'string' ? 10 : (styleDef.shadowBlur ?? 10);
        } else {
            styleOpts.shadowBlur = 0;
        }

        if (obj.setStyle) obj.setStyle(styleOpts);
        if (obj.setStemStyle) obj.setStemStyle({ strokeStyle: rgbaColor });
        if (obj.modifiers) obj.modifiers.forEach((m: any) => applyStyles(m, styleDef, bg));
    };

    const renderStaticNotation = () => {
        if (typeof window === 'undefined' || !window.Vex) return null;

        const host = document.createElement('div');
        const { Renderer, Stave, StaveNote, TabStave, TabNote, Formatter, Dot, Accidental, Articulation } = window.Vex.Flow;
        const renderer = new Renderer(host, Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();

        try {
            const svg = (context as any).svg;
            svg.style.backgroundColor = style.background || '#09090b';

            const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bgRect.setAttribute("width", "100%");
            bgRect.setAttribute("height", "100%");
            bgRect.setAttribute("fill", style.background || '#09090b');
            svg.prepend(bgRect);

            let x = 10;
            const staveWidth = width - 20;
            let notes: any[] = [];
            let stave: any = null;

            if (showNotation) {
                let staveY = 120; // Default single center
                if (showTablature) staveY = 70; // Top position if dual
                stave = new Stave(x, staveY, staveWidth);
                if (measureData.showClef) {
                    const clef = measureData.clef || 'treble';
                    if (clef !== 'tab') stave.addClef(clef);
                }
                if (measureData.showTimeSig) stave.addTimeSignature(timeSignatureStr || '4/4');

                stave.getModifiers().forEach((mod: any) => {
                    const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                    let targetStyle = style.notes;
                    if (category.includes('clef')) targetStyle = style.clefs;
                    else if (category.includes('time')) targetStyle = style.timeSignature;
                    else if (category.includes('key')) targetStyle = style.symbols;
                    else if (category.includes('barline')) targetStyle = style.staffLines;
                    applyStyles(mod, targetStyle, style.background || 'transparent');
                });

                stave.setContext(context);
                const linesColor = hexToRgba(style.staffLines.color, style.staffLines.opacity);
                const linesStyle: any = { strokeStyle: linesColor, fillStyle: linesColor };
                if (style.staffLines.shadow) {
                    linesStyle.shadowColor = style.staffLines.shadowColor || style.staffLines.color;
                    linesStyle.shadowBlur = style.staffLines.shadowBlur || 10;
                }
                stave.setStyle(linesStyle).draw();

                notes = measureData.notes.map((note) => {
                    const isSelected = selectedNoteIds?.includes(note.id);
                    let noteStyle = isSelected ? { color: '#fbbf24', opacity: 1, shadow: true, shadowColor: '#fbbf24', shadowBlur: 15 } : style.notes;

                    if (note.type === 'rest') {
                        const sn = new StaveNote({ keys: ["b/4"], duration: note.duration + "r" });
                        applyStyles(sn, isSelected ? noteStyle : style.rests, style.background || 'transparent');
                        return sn;
                    } else {
                        const key = getNoteKeyFromFret(parseInt(note.fret), parseInt(note.string));
                        const sn = new StaveNote({ keys: [key], duration: note.duration });
                        if (note.decorators?.dot) Dot.buildAndAttach([sn], { all: true });
                        if (note.accidental && note.accidental !== 'none') sn.addModifier(new Accidental(note.accidental));
                        if (note.decorators?.staccato) sn.addModifier(new Articulation('a.'));
                        if (note.decorators?.accent) sn.addModifier(new Articulation('a>'));
                        applyStyles(sn, noteStyle, style.background || 'transparent');
                        return sn;
                    }
                });

                if (notes.length > 0) {
                    const beams = window.Vex.Flow.Beam.generateBeams(notes);
                    beams.forEach((b: any) => applyStyles(b, style.notes, style.background || 'transparent'));
                    Formatter.FormatAndDraw(context, stave, notes);
                    beams.forEach((b: any) => b.setContext(context).draw());
                }
            }

            if (showTablature) {
                let yOffset = 120; // Default single center
                if (showNotation) yOffset = 180; // Bottom position if dual
                const tabStave = new TabStave(x, yOffset, staveWidth);
                if (measureData.showClef) tabStave.addTabGlyph();
                tabStave.getModifiers().forEach((mod: any) => applyStyles(mod, style.clefs, style.background || 'transparent'));

                tabStave.setContext(context);
                const linesColor = hexToRgba(style.staffLines.color, style.staffLines.opacity);
                tabStave.setStyle({ strokeStyle: linesColor, fillStyle: linesColor }).draw();

                const tabNotes = measureData.notes.map((note) => {
                    const isSelected = selectedNoteIds?.includes(note.id);
                    const tabNoteStyle = isSelected ? { color: '#fbbf24', opacity: 1, shadow: true } : (note.type === 'rest' ? style.rests : style.tabNumbers);

                    if (note.type === 'rest') {
                        const tn = new TabNote({ positions: [{ str: 3, fret: 'X' }], duration: note.duration + "r" });
                        applyStyles(tn, tabNoteStyle, style.background || 'transparent');
                        return tn;
                    } else {
                        const tn = new TabNote({ positions: [{ str: parseInt(note.string), fret: parseInt(note.fret) }], duration: note.duration });
                        applyStyles(tn, tabNoteStyle, style.background || 'transparent');
                        return tn;
                    }
                });

                if (tabNotes.length > 0) {
                    Formatter.FormatAndDraw(context, tabStave, tabNotes);
                }
            }

            // --- POST-PROCESS SVG ---
            // Fix white "boxes" behind tab numbers and other elements in dark mode
            const bgHex = style.background || '#09090b';
            const rects = svg.querySelectorAll('rect');
            rects.forEach((rect: any) => {
                const fill = rect.getAttribute('fill');
                const w = parseFloat(rect.getAttribute('width') || '0');
                const h = parseFloat(rect.getAttribute('height') || '0');

                // VexFlow uses white rects for clearance. We theme them to match background.
                // We check w > 2 && h > 2 to avoid hitting thin barlines.
                if ((fill === '#ffffff' || fill === 'white') && w > 2 && h > 2) {
                    rect.setAttribute('fill', bgHex);
                }
            });

            return svg;
        } catch (e: any) {
            console.error("VexFlow Static Render Error", e);
            setRenderError(e.message);
            return null;
        }
    };

    const rasterizeSvg = async () => {
        const svg = offscreenSvgRef.current;
        if (!svg) return;

        try {
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.src = url;

            await new Promise((resolve) => {
                img.onload = () => {
                    cachedNotationImgRef.current = img;
                    URL.revokeObjectURL(url);
                    resolve(null);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve(null);
                };
            });
        } catch (e) {
            console.error('Rasterization failure', e);
        }
    };

    const drawNotation = () => {
        const canvas = notationCanvasRef.current;
        const img = cachedNotationImgRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const drawPlayhead = () => {
        const canvas = playheadCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear only the playhead canvas (it's transparent)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isActive && progress > 0) {
            const playheadX = Math.round((progress / 100) * width);
            const activeColor = style.activeNoteColor || '#06b6d4';
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.globalCompositeOperation = 'screen';
            for (let i = 1; i <= 8; i++) {
                ctx.fillStyle = activeColor;
                ctx.globalAlpha = 0.1 / i;
                ctx.fillRect(playheadX - i, 0, i * 2, height);
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = activeColor;
            ctx.fillRect(playheadX - 0.5, 0, 1.5, height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(playheadX, 0, 0.5, height);
            ctx.restore();
        }
    };

    // Static Update Loop
    useEffect(() => {
        const updateNotation = async () => {
            offscreenSvgRef.current = renderStaticNotation();
            await rasterizeSvg();
            drawNotation();
            drawPlayhead(); // Initial draw
        };
        updateNotation();
    }, [measureData, style, timeSignatureStr, showNotation, showTablature, selectedNoteIds, dpr]);

    // Playback Loop (Synchronous and ultra-fast)
    useEffect(() => {
        drawPlayhead();
    }, [isActive, progress]);

    return (
        <div className="rounded-2xl shadow-[0_80px_160px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5 relative flex items-center justify-center aspect-[800/340] w-full" style={{ backgroundColor: style.background || '#050505' }}>
            <div className="score-canvas-viewport w-full h-full relative" style={{ opacity: renderError ? 0.2 : 1 }}>
                <canvas
                    ref={notationCanvasRef}
                    width={width * dpr}
                    height={height * dpr}
                    className="absolute inset-0 w-full h-full"
                    style={{ imageRendering: 'auto' }}
                />
                <canvas
                    ref={playheadCanvasRef}
                    width={width * dpr}
                    height={height * dpr}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ imageRendering: 'auto' }}
                />
            </div>
        </div>
    );
});

const ScorePreview: React.FC<ScorePreviewProps> = ({
    code,
    playbackPosition,
    isPlaying,
    style,
    measures,
    showControls = true,
    timeSignature,
    showNotation = true,
    showTablature = true,
    onMeasuresChange,
    selectedNoteIds = [],
    onSelectNote,
    onDoubleClickNote,
    currentMeasureIndex: externalMeasureIndex,
    onPlaybackControl,
    onPlaybackPositionChange
}) => {
    // Current Measure Calculation
    const safeMeasures = measures || [];
    const scoreContainerRef = useRef<HTMLElement>(null);


    // Video Render Settings
    const [showSettings, setShowSettings] = useState(false);
    const [renderSettings, setRenderSettings] = useState<VideoRenderSettings>({
        format: 'mp4',
        fps: 30,
        quality: 'medium'
    });
    const [isOfflineRendering, setIsOfflineRendering] = useState(false);
    const [offlinePosition, setOfflinePosition] = useState(0);

    // Unified Canvas Recorder
    const {
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
        cancelRender,
        downloadVideo,
        error: renderError,
        renderStatus,
        setIsRendering,
        setIsComplete
    } = useCanvasRecorder(scoreContainerRef as React.RefObject<HTMLCanvasElement>, renderSettings);

    const handleStartRender = async () => {
        if (!scoreContainerRef.current) {
            console.error('Score container not found');
            return;
        }

        // --- NEW GOLD STANDARD: OFFLINE RENDERING FOR ALL MP4 ---
        if (renderSettings.format === 'mp4') {
            await handleStartRenderOffline();
            return;
        }

        // Fallback for WebM (real-time fast recording)
        if (onPlaybackPositionChange) onPlaybackPositionChange(0);
        if (onPlaybackControl) onPlaybackControl(true);
        await renderToFile();
    };

    const handleStartRenderOffline = async () => {
        setIsRendering(true);
        setIsComplete(false);
        setIsOfflineRendering(true);
        setOfflinePosition(0);
        setRenderProgress(0);

        // Calculate total frames (approximate 2s per measure)
        const fps = 30;
        const secondsPerMeasure = 2;
        const totalDuration = safeMeasures.length * secondsPerMeasure;
        const totalFrames = Math.ceil(totalDuration * fps);

        console.log(`Starting offline render: ${totalFrames} frames`);

        // Find the actual canvas elements
        const viewport = scoreContainerRef.current?.querySelector('.score-canvas-viewport');
        if (!viewport) {
            console.error('Viewport not found for offline render');
            setIsOfflineRendering(false);
            return;
        }

        // Create composite canvas for high-quality export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 800 * currentDPR;
        exportCanvas.height = 340 * currentDPR;
        const exportCtx = exportCanvas.getContext('2d', { alpha: false });

        // Pre-load FFmpeg
        await setRenderProgress(5);

        for (let i = 0; i < totalFrames; i++) {
            const pos = (i / totalFrames) * 100;
            setOfflinePosition(pos);
            setRenderProgress((i / totalFrames) * 20); // 0-20% is capture phase

            // Wait for React to render and VexFlow (async SVG rasterization) to finish
            await new Promise(resolve => setTimeout(resolve, 100));

            // Composite layers
            const canvases = viewport.querySelectorAll('canvas');
            if (exportCtx && canvases.length >= 2) {
                exportCtx.drawImage(canvases[0], 0, 0); // Notation
                exportCtx.drawImage(canvases[1], 0, 0); // Playhead
            }

            // Capture frame
            setRenderStatus(`Capturando quadro ${i + 1} de ${totalFrames}...`);
            await captureFrame(exportCanvas, i);
        }

        // Transition to FFmpeg conversion
        setRenderProgress(20);
        setRenderStatus('Iniciando processamento de vídeo...');
        const mp4Blob = await renderFramesToVideo(totalFrames);

        if (mp4Blob) {
            downloadVideo(mp4Blob, `tab-pro-render-${Date.now()}.mp4`);
        }

        setIsOfflineRendering(false);
        setOfflinePosition(0);
    };

    // Auto-stop recording and convert when playback reaches the end
    useEffect(() => {
        const handleRecordingComplete = async () => {
            if (isRecording && playbackPosition >= 99.9) {
                // Stop playback
                if (onPlaybackControl) {
                    onPlaybackControl(false);
                }

                // Stop recording
                const webmBlob = await stopRecording();

                if (webmBlob) {
                    console.log('Recording complete! WebM blob:', webmBlob.size, 'bytes');

                    // If format is MP4, convert WebM to MP4
                    if (renderSettings.format === 'mp4') {
                        console.log('Starting conversion to MP4...');
                        const mp4Blob = await convertWebMToMP4(webmBlob, (progress) => {
                            console.log('Conversion progress:', progress);
                        });

                        if (mp4Blob) {
                            downloadVideo(mp4Blob, `tab-animation-${Date.now()}.mp4`);
                        }
                    } else {
                        // For WebM, just download directly
                        downloadVideo(webmBlob, `tab-animation-${Date.now()}.webm`);
                    }
                }
            }
        };

        handleRecordingComplete();
    }, [isRecording, playbackPosition, renderSettings.format, stopRecording, convertWebMToMP4, downloadVideo, onPlaybackControl]);

    // Track last progress to avoid infinite loop
    const lastRenderProgressRef = useRef<number>(-1);

    // Update progress during recording phase
    useEffect(() => {
        if (isRecording) {
            // Map playbackPosition (0-100) to renderProgress (0-25)
            // Use Math.round to avoid tiny floating point changes triggering re-renders
            const progress = Math.round((playbackPosition / 100) * 25);
            if (progress !== lastRenderProgressRef.current) {
                setRenderProgress(progress);
                lastRenderProgressRef.current = progress;
            }
        }
    }, [isRecording, playbackPosition, setRenderProgress]);

    const effectivePosition = isOfflineRendering ? offlinePosition : playbackPosition;

    const calculatedMeasureIndex = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const idx = Math.floor((effectivePosition / 100) * safeMeasures.length);
        return Math.min(idx, safeMeasures.length - 1);
    }, [effectivePosition, safeMeasures.length]);


    // When playing, use calculated index from playback; otherwise use external (manual selection)
    const currentMeasureIndex = (isPlaying || isOfflineRendering) ? calculatedMeasureIndex : (externalMeasureIndex !== undefined ? externalMeasureIndex : calculatedMeasureIndex);

    const measureProgress = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const measureWeight = 100 / safeMeasures.length;
        return ((effectivePosition % measureWeight) / measureWeight) * 100;
    }, [effectivePosition, safeMeasures.length]);

    const shouldAnimate = currentMeasureIndex === 0 || currentMeasureIndex === safeMeasures.length - 1;
    const activeMeasureData = safeMeasures[currentMeasureIndex];

    const currentDPR = useMemo(() => {
        const dprSettings = {
            low: 1,
            medium: 1.5,
            high: 2.4,   // 1080p
            ultra: 4.8   // 4K
        };
        return (dprSettings as any)[renderSettings.quality || 'medium'] || 1.5;
    }, [renderSettings.quality]);

    const handleNoteClick = (measureIndex: number, noteIndex: number, isMulti: boolean) => {
        const measure = safeMeasures[measureIndex];
        const note = measure?.notes[noteIndex];
        if (!note || !onSelectNote) return;

        onSelectNote(note.id, isMulti);
    };



    if (!activeMeasureData) return null;

    return (
        <div ref={scoreContainerRef as React.RefObject<HTMLDivElement>} className="w-full h-full flex flex-col bg-[#050505] overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.05)_0%,_transparent_70%)] pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-transparent overflow-hidden relative">
                {/* CRT Monitor Frame */}
                <div className="relative w-full max-w-[800px]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        bg-[#0a0a0a] rounded-3xl border-4 border-[#333] shadow-[0_0_0_2px_#111,0_0_40px_rgba(0,0,0,0.5),0_0_100px_rgba(6,182,212,0.1)] overflow-hidden group z-10">
                    {/* Screen Bezel/Inner Shadow */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/5" />

                    {/* CRT Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,3px_100%]" />

                    {/* Subtle Screen Curved Reflection */}
                    <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 rounded-2xl" />

                    <div className="w-full h-full relative z-10 flex items-center justify-center bg-[#050505]">
                        <div className="relative w-full aspect-[800/340]">
                            {safeMeasures.map((measure, idx) => (
                                idx === currentMeasureIndex && (
                                    <div
                                        key={`${measure.id || idx}-${style.transitionType}-${timeSignature}-${showNotation}-${showTablature}`}
                                        className={`absolute inset-0 w-full ${shouldAnimate ? `score-animation-${style.transitionType}` : ''}`}
                                    >
                                        <MeasureThumbnail
                                            measureData={measure}
                                            measureIndex={idx}
                                            isActive={isPlaying || isOfflineRendering}
                                            progress={measureProgress}
                                            style={style}
                                            shouldAnimate={shouldAnimate}
                                            timeSignatureStr={timeSignature}
                                            showNotation={showNotation}
                                            showTablature={showTablature}
                                            onNoteClick={handleNoteClick}
                                            onNoteDoubleClick={onDoubleClickNote}
                                            selectedNoteIds={selectedNoteIds}
                                            dpr={currentDPR}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-500/30 font-mono text-[10px] uppercase tracking-widest pointer-events-none">Signal: Active</p>
                    </div>
                </div>

                {/* Decorative localized glow under the monitor */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-cyan-500/10 blur-[100px] pointer-events-none z-0" />
            </div>

            {showControls && (
                <div className="h-16 flex items-center justify-between px-6 z-20 bg-black/40 backdrop-blur-xl border-t border-white/5 relative">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            TIMELINE
                        </h2>
                        <div className="flex space-x-1">
                            {safeMeasures.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ${i === currentMeasureIndex ? 'bg-cyan-500 w-8 shadow-[0_0_10px_#06b6d4]' : 'bg-white/10 w-2 hover:bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Section {currentMeasureIndex + 1}</span>
                            <div className="w-px h-3 bg-white/10" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{safeMeasures.length} MEAS</span>
                        </div>

                        {/* Render Button - Standardized with Studio Style */}
                        <button
                            onClick={() => {
                                if (isRendering) {
                                    cancelRender();
                                } else {
                                    setShowSettings(true);
                                }
                            }}
                            className={`
                                h-9 px-4 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 border
                                ${isRendering
                                    ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
                                    : 'bg-black/40 text-slate-300 border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-black/60'
                                }
                            `}
                            title={isRendering ? 'Stop Rendering' : 'Start Rendering'}
                        >
                            {isRendering ? (
                                <>
                                    <Film className="w-3.5 h-3.5 animate-pulse" />
                                    <span>Rendering...</span>
                                </>
                            ) : (
                                <>
                                    <Film className="w-3.5 h-3.5" />
                                    <span>Render</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Video Render Settings Modal */}
            <VideoRenderSettingsModal
                isOpen={showSettings}
                settings={renderSettings}
                onClose={() => setShowSettings(false)}
                onRender={(settings) => {
                    setRenderSettings(settings);
                    setShowSettings(false);
                    // Start render immediately after confirming settings
                    handleStartRender();
                }}
            />

            <RenderProgressModal
                isOpen={isRendering}
                isComplete={isComplete}
                progress={renderProgress}
                status={renderStatus}
                estimatedTime={estimatedTime}
                onCancel={cancelRender}
            />

            <style>{`
        .score-animation-slide { animation: scoreSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .score-animation-fade { animation: scoreFadeIn 0.6s ease-out forwards; }
        @keyframes scoreSlideIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(20px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes scoreFadeIn {
          0% { opacity: 0; filter: blur(15px); }
          100% { opacity: 1; filter: blur(0); }
        }
        /* Canvas rendering styles */
        .score-canvas-viewport canvas { 
          width: 100%; 
          height: auto;
          image-rendering: auto;
        }
      `}</style>
        </div>
    );
};

export default ScorePreview;

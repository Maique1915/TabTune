import { useEffect, useRef, useState, useCallback, useImperativeHandle, ForwardedRef } from "react";
import { type JSAnimation } from "animejs";
import type { ChordWithTiming, ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { TimelineState } from "@/modules/chords/domain/types";
import JSZip from 'jszip';
import { useCanvasRecorder } from "@/lib/shared/hooks/useCanvasRecorder";

export interface BaseStageRef {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    handleRender: (format?: 'mp4' | 'webm' | 'png-sequence', quality?: 'low' | 'medium' | 'high', fileName?: string) => Promise<void>;
    cancelRender: () => void;
    isAnimating: boolean;
    isRendering: boolean;
    isPaused: boolean;
    resetPlayback: () => void;
}

export interface BaseStageProps {
    chords: ChordWithTiming[];
    previewChord?: ChordDiagramProps | null;
    timelineState?: TimelineState;
    width?: number;
    height?: number;
    onFrameCapture?: (frameData: ImageData) => void;
    isRecording?: boolean;
    onAnimationStateChange?: (isAnimating: boolean, isPaused: boolean) => void;
    onRenderProgress?: (progress: number) => void;
    transitionsEnabled?: boolean;
    buildEnabled?: boolean;
    prebufferMs?: number;
    activeChordIndex?: number;
    numStrings?: number;
    showChordName?: boolean;
    capo?: number;
    tuningShift?: number;
    stringNames?: string[];
    numFrets?: number;
    colors?: FretboardTheme;
    animationType?: string;
    // Specific props can be extended in the component interface
}

export interface AnimationState {
    fingerOpacity: number;
    fingerScale: number;
    cardY: number;
    nameOpacity: number;
    chordIndex: number;
    transitionProgress: number;
    buildProgress: number;
    chordProgress?: number;
    currentChordName?: string;
    prevChordName?: string;
    nameTransitionProgress: number;
}

// Minimal interface that all Engines must satisfy
export interface IStageEngine {
    drawSingleFrame: () => void;
    updateOptions: (options: any, state: AnimationState) => void;
    setChords: (chords: ChordWithTiming[]) => void;
    setPreviewChord: (chord: ChordDiagramProps | null) => void;
    drawFrame: (state: AnimationState) => void;
    resize: (width: number, height: number, state: AnimationState) => void;
    getGeometry: () => any;
}

interface UseBaseStageParams extends BaseStageProps {
    engineFactory: (canvas: HTMLCanvasElement) => IStageEngine;
    onDrawBackground: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
    ref: ForwardedRef<BaseStageRef>;
    extraOptions?: Record<string, any>;
}

export const useBaseStage = ({
    chords,
    previewChord,
    width = 1920,
    height = 1080,
    onFrameCapture,
    isRecording = false,
    activeChordIndex,
    onAnimationStateChange,
    onRenderProgress,
    transitionsEnabled = true,
    buildEnabled = true,
    prebufferMs = 0,
    numStrings = 6,
    showChordName = true,
    capo = 0,
    tuningShift = 0,
    stringNames = ["E", "A", "D", "G", "B", "e"],
    numFrets: propNumFrets,
    colors: propsColors,
    animationType: propsAnimationType,
    engineFactory,
    onDrawBackground,
    ref,
    extraOptions
}: UseBaseStageParams) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const stageContainerRef = useRef<HTMLDivElement>(null);

    // Playback Refs
    const playheadStateRef = useRef<{ t: number }>({ t: 0 });
    const playbackRafIdRef = useRef<number | null>(null);
    const playbackStartPerfMsRef = useRef<number>(0);
    const playbackElapsedMsRef = useRef<number>(0);
    const lastProgressEmitMsRef = useRef<number>(0);

    const isRenderCancelledRef = useRef(false);
    const isRenderingRef = useRef(false);

    // Engine & Animation State
    const engineRef = useRef<IStageEngine | null>(null);
    const drawFrameRef = useRef<((state: AnimationState, timeMs: number) => void) | null>(null);

    const animationStateRef = useRef<AnimationState>({
        fingerOpacity: 0,
        fingerScale: 0.5,
        cardY: height,
        nameOpacity: 0,
        chordIndex: 0,
        transitionProgress: 0,
        buildProgress: 1,
        nameTransitionProgress: 1,
        currentChordName: "",
        prevChordName: "",
    });

    const {
        colors: contextColors,
        animationType: contextAnimationType,
        setPlaybackIsPlaying,
        setPlaybackIsPaused,
        setPlaybackProgress,
        setPlaybackTotalDurationMs,
        playbackTotalDurationMs,
        playbackSeekNonce,
        playbackSeekProgress,
    } = useAppContext();

    // Derived values
    const colors = propsColors || contextColors || undefined;
    const animationType = propsAnimationType || contextAnimationType || 'dynamic-fingers';
    const effectiveNumFrets = propNumFrets ?? 5;
    const numFrets = effectiveNumFrets;

    const [isAnimating, setIsAnimating] = useState(false);
    const isAnimatingRef = useRef(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderFormat, setRenderFormat] = useState<'mp4' | 'webm' | 'png-sequence'>('mp4');
    const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high'>('medium');

    // --- Engine Initialization ---
    useEffect(() => {
        if (!canvasRef.current || engineRef.current) return;
        engineRef.current = engineFactory(canvasRef.current);
        engineRef.current.drawSingleFrame();
    }, []); // Run once on mount

    // --- Update Engine Options ---
    useEffect(() => {
        if (engineRef.current) {
            // We pass all props to updateOptions. engines should pick what they need
            // or we construct a generic options object here
            engineRef.current.updateOptions({
                width,
                height,
                numStrings,
                numFrets: effectiveNumFrets,
                colors: colors,
                animationType,
                showChordName,
                transitionsEnabled,
                buildEnabled,
                capo,
                tuning: stringNames,
                ...extraOptions
            }, animationStateRef.current);
        }
    }, [width, height, numStrings, effectiveNumFrets, colors, animationType, showChordName, transitionsEnabled, buildEnabled, capo, stringNames, engineRef, extraOptions]);

    // --- Update Chords ---
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setChords(chords);
        }
    }, [chords]);

    // --- Update Preview Chord ---
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setPreviewChord(previewChord || null);
        }
    }, [previewChord]);

    // --- Resize ---
    useEffect(() => {
        if (engineRef.current && canvasRef.current) {
            engineRef.current.resize(width, height, animationStateRef.current);
        }
    }, [width, height]);

    // --- Background Drawing ---
    useEffect(() => {
        if (!backgroundCanvasRef.current) return;
        const ctx = backgroundCanvasRef.current.getContext('2d');
        if (!ctx) return;
        onDrawBackground(ctx, width, height);
    }, [width, height, onDrawBackground]);

    // --- Drawing Logic ---
    const drawFrame = useCallback((state: AnimationState, timeMs: number) => {
        if (engineRef.current) {
            engineRef.current.drawFrame(state);
        }
    }, []);

    const drawAnimatedChord = useCallback(() => {
        if (!canvasRef.current || !engineRef.current) return;
        drawFrame(animationStateRef.current, playheadStateRef.current.t);
    }, [drawFrame]);

    useEffect(() => {
        drawFrameRef.current = drawFrame;
    }, [drawFrame]);

    // --- Canvas Recorder ---
    const canvasRecorder = useCanvasRecorder(stageContainerRef as any, {
        fps: 30,
        format: renderFormat === 'png-sequence' ? 'webm' : renderFormat,
        quality: renderQuality,
    });

    // --- Timing Logic ---
    const minSegmentSec = 0.1;
    const getSegmentDurationSec = useCallback((chordWithTiming: ChordWithTiming) => {
        const defaultSegmentSec = 2.0;
        const clipSec = (chordWithTiming.duration / 1000) || defaultSegmentSec;
        return Math.max(clipSec, minSegmentSec);
    }, [minSegmentSec]);

    const computeTotalPlaybackDurationMs = useCallback(() => {
        if (!chords || chords.length === 0) return 0;
        let totalMs = 0;
        for (const chordWithTiming of chords) {
            totalMs += getSegmentDurationSec(chordWithTiming) * 1000;
        }
        return Math.max(0, Math.round(totalMs));
    }, [chords, getSegmentDurationSec]);

    const computeStateAtTimeMs = useCallback((timeMs: number) => {
        if (!chords || chords.length === 0) return null;
        const t = Math.max(0, timeMs);

        let cursor = 0;
        const targetTransitionMs = 530;

        for (let i = 0; i < chords.length; i++) {
            const currentDur = Math.max(100, getSegmentDurationSec(chords[i]) * 1000);
            const prevDur = i > 0 ? Math.max(100, getSegmentDurationSec(chords[i - 1]) * 1000) : 0;
            const nextDur = i < chords.length - 1 ? Math.max(100, getSegmentDurationSec(chords[i + 1]) * 1000) : 0;

            const transitionInTotal = i > 0 ? Math.min(targetTransitionMs, currentDur, prevDur) : 0;
            const transitionOutTotal = i < chords.length - 1 ? Math.min(targetTransitionMs, currentDur, nextDur) : 0;

            const inHalf = transitionInTotal / 2;
            const outHalf = transitionOutTotal / 2;
            const staticMs = currentDur - inHalf - outHalf;

            // 1. IN phase
            if (t < cursor + inHalf) {
                return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: 0 };
            }
            cursor += inHalf;

            // 2. STATIC phase
            if (t < cursor + staticMs) {
                return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: 0.5 };
            }
            cursor += staticMs;

            // 3. OUT phase
            if (t < cursor + outHalf) {
                if (i === chords.length - 1) return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: 1 };
                const progress = (t - cursor) / outHalf;
                return { chordIndex: i, transitionProgress: progress, buildProgress: 1, chordProgress: progress };
            }
            cursor += outHalf;
        }
        return { chordIndex: chords.length - 1, transitionProgress: 0, buildProgress: 1, chordProgress: 1 };
    }, [chords, getSegmentDurationSec, transitionsEnabled, animationType]);

    // --- Playback Controls ---
    const stopPlayhead = useCallback(() => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setIsAnimating(false);
        isAnimatingRef.current = false;
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(false);
    }, [setPlaybackIsPlaying, setPlaybackIsPaused]);

    const startPlayhead = useCallback((totalDurationMs: number) => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setPlaybackTotalDurationMs(totalDurationMs);
        setPlaybackIsPlaying(true);
        setPlaybackIsPaused(false);
        setPlaybackProgress(0);
        playheadStateRef.current.t = 0;
        playbackElapsedMsRef.current = 0;
        playbackStartPerfMsRef.current = performance.now();
        lastProgressEmitMsRef.current = 0;
    }, [setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, setPlaybackTotalDurationMs]);

    const startPlaybackRafLoop = useCallback((totalDurationMs: number) => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }

        const tick = () => {
            const now = performance.now();
            const elapsed = Math.max(0, now - playbackStartPerfMsRef.current);
            const clampedElapsed = Math.min(totalDurationMs, elapsed);
            playbackElapsedMsRef.current = clampedElapsed;
            playheadStateRef.current.t = clampedElapsed;

            const state = computeStateAtTimeMs(clampedElapsed);
            if (state && chords) {
                const currentChordData = chords[state.chordIndex];
                animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
                animationStateRef.current.chordIndex = state.chordIndex;
                animationStateRef.current.chordProgress = state.chordProgress;
                animationStateRef.current.transitionProgress = state.transitionProgress;
                animationStateRef.current.buildProgress = state.buildProgress;
                drawAnimatedChord();
            }

            if (now - lastProgressEmitMsRef.current >= 50) {
                lastProgressEmitMsRef.current = now;
                setPlaybackProgress(totalDurationMs > 0 ? clampedElapsed / totalDurationMs : 0);
            }

            if (clampedElapsed >= totalDurationMs) {
                const targetIndex = typeof activeChordIndex === 'number'
                    ? Math.max(0, Math.min((chords?.length || 1) - 1, activeChordIndex))
                    : 0;

                animationStateRef.current.chordIndex = targetIndex;
                animationStateRef.current.chordProgress = 0;
                animationStateRef.current.transitionProgress = 0;
                animationStateRef.current.buildProgress = 1;

                if (chords && chords[targetIndex]) {
                    animationStateRef.current.currentChordName = chords[targetIndex].finalChord?.chordName || "";
                }

                playheadStateRef.current.t = 0;
                playbackElapsedMsRef.current = 0;

                setPlaybackProgress(0);
                setPlaybackIsPlaying(false);
                setPlaybackIsPaused(false);
                setIsAnimating(false);
                isAnimatingRef.current = false;
                setIsPaused(false);
                if (onAnimationStateChange) onAnimationStateChange(false, false);

                drawAnimatedChord();
                stopPlayhead();
                return;
            }
            playbackRafIdRef.current = requestAnimationFrame(tick);
        };
        playbackRafIdRef.current = requestAnimationFrame(tick);
    }, [computeStateAtTimeMs, drawAnimatedChord, onAnimationStateChange, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, stopPlayhead, chords, activeChordIndex]);

    const startAnimation = () => {
        if (!chords || chords.length === 0) return;
        setIsAnimating(true);
        isAnimatingRef.current = true;
        setIsPaused(false);
        if (onAnimationStateChange) onAnimationStateChange(true, false);
        const totalMs = computeTotalPlaybackDurationMs();
        startPlayhead(totalMs);
        startPlaybackRafLoop(totalMs);
    };

    const pauseAnimation = () => {
        if (!isAnimating) return;
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setIsPaused(true);
        setPlaybackIsPaused(true);
        if (onAnimationStateChange) onAnimationStateChange(true, true);
    };

    const resumeAnimation = () => {
        if (!isPaused || !chords || chords.length === 0) return;
        setIsPaused(false);
        setPlaybackIsPaused(false);
        if (onAnimationStateChange) onAnimationStateChange(true, false);
        const totalMs = computeTotalPlaybackDurationMs();
        playbackStartPerfMsRef.current = performance.now() - playbackElapsedMsRef.current;
        startPlaybackRafLoop(totalMs);
    };

    const resetPlayback = () => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setIsAnimating(false);
        setIsPaused(false);
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(false);
        playbackElapsedMsRef.current = 0;
        animationStateRef.current = {
            ...animationStateRef.current,
            chordIndex: 0,
            chordProgress: 0,
            transitionProgress: 0,
            buildProgress: 0,
        };
        setPlaybackProgress(0);
        if (onAnimationStateChange) onAnimationStateChange(false, false);
        drawAnimatedChord();
    };

    // --- Effects for External Control ---
    useEffect(() => {
        const totalMs = computeTotalPlaybackDurationMs();
        if (totalMs !== playbackTotalDurationMs) {
            setPlaybackTotalDurationMs(totalMs);
        }
    }, [computeTotalPlaybackDurationMs, setPlaybackTotalDurationMs, playbackTotalDurationMs]);

    useEffect(() => {
        if (!chords || chords.length === 0 || !playbackSeekNonce) return;
        const clampedProgress = Math.max(0, Math.min(1, playbackSeekProgress));
        const totalMs = computeTotalPlaybackDurationMs();
        const timeMs = clampedProgress * totalMs;
        if (playbackRafIdRef.current !== null && !isPaused) {
            playbackElapsedMsRef.current = timeMs;
            playbackStartPerfMsRef.current = performance.now() - timeMs;
        }
        setIsAnimating(true);
        setIsPaused(true);
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(true);
        setPlaybackProgress(clampedProgress);
        const state = computeStateAtTimeMs(timeMs);
        if (state) {
            animationStateRef.current.chordIndex = state.chordIndex;
            animationStateRef.current.chordProgress = state.chordProgress;
            const currentChordData = chords[state.chordIndex];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;
            drawAnimatedChord();
        }
    }, [chords, computeStateAtTimeMs, computeTotalPlaybackDurationMs, playbackSeekNonce, playbackSeekProgress, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress]);

    // Effect for when chords array changes or activeChordIndex changes (Unified logic)
    useEffect(() => {
        if ((!isAnimating || isPaused) && chords && chords.length > 0 && typeof activeChordIndex === 'number') {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));

            // Only log if explicit prop change (optional)
            // console.log('[useBaseStage] activeChordIndex syncing:', index);

            animationStateRef.current.chordIndex = index;
            animationStateRef.current.chordProgress = 0;
            const currentChordData = chords[index];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;

            if (drawFrameRef.current) {
                drawFrameRef.current(animationStateRef.current, playheadStateRef.current.t);
            }
        }
    }, [chords, isAnimating, isPaused, activeChordIndex]);

    // --- Rendering Logic (Video Export) ---
    const handleRender = useCallback(async (format?: 'mp4' | 'webm' | 'png-sequence', quality?: 'low' | 'medium' | 'high', fileName?: string) => {
        if (!chords || chords.length === 0 || !canvasRef.current) return;
        const targetFormat = format || 'mp4';
        const targetQuality = quality || 'medium';
        const targetFileName = fileName || 'chord-animation';
        setRenderFormat(targetFormat);
        setRenderQuality(targetQuality);

        if (targetFormat === 'png-sequence') {
            try {
                isRenderingRef.current = true;
                canvasRecorder.setIsRendering(true);
                canvasRecorder.setIsComplete(false);
                canvasRecorder.setRenderProgress(0);
                canvasRecorder.setRenderStatus('Preparando imagens...');
                isRenderCancelledRef.current = false;

                const zip = new JSZip();
                const totalChords = chords.length;
                const canvas = canvasRef.current;
                let currentTime = 0;

                for (let i = 0; i < totalChords; i++) {
                    if (isRenderCancelledRef.current) throw new Error("Render cancelled");

                    const chord = chords[i];
                    const captureTime = currentTime + 100;
                    const state = computeStateAtTimeMs(captureTime);

                    if (state && drawFrameRef.current) {
                        animationStateRef.current = { ...animationStateRef.current, ...state, fingerOpacity: 1, fingerScale: 1, cardY: 0, nameOpacity: 1 };
                        drawFrameRef.current(animationStateRef.current, captureTime);
                        await new Promise(resolve => setTimeout(resolve, 50));

                        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                        if (blob) {
                            const chordName = chord.finalChord?.chordName?.replace(/[^a-z0-9]/gi, '_') || `chord_${i + 1}`;
                            zip.file(`${String(i + 1).padStart(2, '0')}_${chordName}.png`, blob);
                        }
                    }
                    currentTime += chord.duration;
                    const progress = ((i + 1) / totalChords) * 100;
                    canvasRecorder.setRenderProgress(progress);
                    canvasRecorder.setRenderStatus(`Capturando acorde ${i + 1} de ${totalChords}...`);
                    if (onRenderProgress) onRenderProgress(progress);
                }

                if (isRenderCancelledRef.current) return;

                canvasRecorder.setRenderStatus('Gerando arquivo ZIP...');
                const zipContent = await zip.generateAsync({ type: "blob" });
                canvasRecorder.downloadVideo(zipContent, `${targetFileName}.zip`);
                canvasRecorder.setIsComplete(true);
                canvasRecorder.setRenderProgress(100);

            } catch (error: any) {
                console.error("ZIP Render error:", error);
                canvasRecorder.setIsRendering(false);
            } finally {
                isRenderingRef.current = false;
            }
            return;
        }

        try {
            isRenderingRef.current = true;
            canvasRecorder.setIsRendering(true);
            canvasRecorder.setIsComplete(false);
            canvasRecorder.setRenderProgress(0);
            canvasRecorder.setRenderStatus('Preparando quadros...');
            isRenderCancelledRef.current = false;
            await new Promise(resolve => setTimeout(resolve, 100));
            const fps = 30;
            const totalDurationMs = computeTotalPlaybackDurationMs();
            const totalFrames = Math.ceil((totalDurationMs / 1000) * fps);
            const msPerFrame = 1000 / fps;
            let globalFrameIndex = 0;

            for (let i = 0; i < totalFrames; i++) {
                if (isRenderCancelledRef.current) throw new Error("Render cancelled");
                const currentTime = i * msPerFrame;
                const state = computeStateAtTimeMs(currentTime);

                if (state && drawFrameRef.current) {
                    animationStateRef.current = { ...animationStateRef.current, ...state, fingerOpacity: 1, fingerScale: 1, cardY: 0, nameOpacity: 1 };
                    drawFrameRef.current(animationStateRef.current, currentTime);
                    if (canvasRef.current) {
                        await canvasRecorder.captureFrame(canvasRef.current, globalFrameIndex++);
                        const progress = (i / totalFrames) * 20;
                        canvasRecorder.setRenderProgress(progress);
                        canvasRecorder.setRenderStatus(`Capturando quadro ${i + 1} de ${totalFrames}...`);
                        if (onRenderProgress) onRenderProgress(progress);
                    }
                }
            }
            canvasRecorder.setRenderStatus('Codificando vídeo...');
            const videoBlob = await canvasRecorder.renderFramesToVideo(globalFrameIndex, (progress) => {
                if (onRenderProgress) onRenderProgress(progress);
            });
            if (videoBlob) {
                const extension = targetFormat === 'webm' ? 'webm' : 'mp4';
                canvasRecorder.downloadVideo(videoBlob, `${targetFileName}.${extension}`);
                canvasRecorder.setIsComplete(true);
            }
        } catch (error: any) {
            if (error.message !== "Render cancelled") console.error('Render error:', error);
            canvasRecorder.cancelRender();
        } finally {
            isRenderingRef.current = false;
            canvasRecorder.setIsRendering(false);
            canvasRecorder.setIsComplete(true); // Should probably set this or clean up
        }
    }, [chords, width, height, numStrings, numFrets, capo, animationType, colors, canvasRecorder, computeTotalPlaybackDurationMs, computeStateAtTimeMs, onRenderProgress]);

    // --- Expose Ref ---
    useImperativeHandle(ref, () => ({
        startAnimation,
        pauseAnimation,
        resumeAnimation,
        handleRender,
        cancelRender: () => {
            console.log("BaseStage cancelRender called via ref!");
            isRenderCancelledRef.current = true;
            canvasRecorder.cancelRender();
        },
        isAnimating: isAnimatingRef.current,
        isRendering: isRenderingRef.current,
        isPaused: isPaused,
        resetPlayback
    }));

    return {
        canvasRef,
        backgroundCanvasRef,
        stageContainerRef,
        colors,
        animationType,
        effectiveNumFrets,
        engine: engineRef.current
    };
};

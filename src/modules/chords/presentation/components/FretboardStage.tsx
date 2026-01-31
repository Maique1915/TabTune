"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { type JSAnimation } from "animejs";
import type { ChordWithTiming, ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { type ChordDrawer, type FingersAnimationDrawer, type FingersAnimationParams } from "@/modules/engine/infrastructure/drawers/ChordDrawer";
import { ShortNeckDrawer } from "@/modules/engine/infrastructure/drawers/ShortNeck";


import { ShortFingersAnimation } from "@/modules/engine/infrastructure/drawers/ShortFingersAnimation";
import { extensions as extensionMap } from "@/modules/core/domain/chord-logic";
import { FretboardEngine } from "@/modules/engine/infrastructure/FretboardEngine";
import { TimelineState } from "@/modules/chords/domain/types";
import { useCanvasRecorder, CanvasRecorderOptions } from "@/lib/shared/hooks/useCanvasRecorder";

export interface FretboardStageRef {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    handleRender: (format?: 'mp4' | 'webm' | 'json', quality?: 'low' | 'medium' | 'high' | 'ultra') => Promise<void>;
    cancelRender: () => void;
    isAnimating: boolean;
    isRendering: boolean;
    isPaused: boolean;
    resetPlayback: () => void;
}

interface FretboardStageProps {
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
    colors?: any; // FretboardTheme
    animationType?: string;
}

interface AnimationState {
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

export const FretboardStage = React.forwardRef<FretboardStageRef, FretboardStageProps>(({
    chords,
    previewChord,
    timelineState,
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
    numFrets: propNumFrets, // Default removed to allow inference
    colors: propsColors,
    animationType: propsAnimationType,
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<JSAnimation | null>(null);
    const playheadAnimationRef = useRef<JSAnimation | null>(null);
    const playheadStateRef = useRef<{ t: number }>({ t: 0 });
    const playbackRafIdRef = useRef<number | null>(null);
    const playbackStartPerfMsRef = useRef<number>(0);
    const playbackElapsedMsRef = useRef<number>(0);
    const playbackSessionIdRef = useRef<number>(0);
    const lastProgressEmitMsRef = useRef<number>(0);

    const frameCacheRef = useRef<{
        startFrameIndex: number;
        bitmaps: Array<ImageBitmap | null>;
        frameMs: number;
    } | null>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
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

    // Derived values logic (Fixed)
    const colors = propsColors || contextColors || undefined;
    const animationType = propsAnimationType || contextAnimationType || 'dynamic-fingers';

    // Determine effective numFrets
    const effectiveNumFrets = propNumFrets ?? 5;
    const numFrets = effectiveNumFrets;

    const [isAnimating, setIsAnimating] = useState(false);
    const isAnimatingRef = useRef(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderFormat, setRenderFormat] = useState<'mp4' | 'webm' | 'json'>('mp4');
    const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('medium');

    const isRenderCancelledRef = useRef(false);
    const isRenderingRef = useRef(false);
    const prevActiveChordIndexRef = useRef<number | undefined>(undefined);

    // State for the engine instance
    const engineRef = useRef<FretboardEngine | null>(null);
    const drawFrameRef = useRef<((state: AnimationState, timeMs: number) => void) | null>(null);

    // Initialize Engine
    useEffect(() => {
        if (!canvasRef.current || engineRef.current) return;

        engineRef.current = new FretboardEngine(canvasRef.current, {
            width,
            height,
            numStrings,
            numFrets: effectiveNumFrets,
            colors: colors as any,
            animationType,
            showChordName,
            transitionsEnabled,
            buildEnabled,
            capo
        });

        // Initial draw
        engineRef.current.drawSingleFrame();

    }, []); // Only run once on mount (or you can add deps if you handle "re-creation" logic, but updates are better)

    // Update Engine Options when props change
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateOptions({
                width,
                height,
                numStrings,
                numFrets: effectiveNumFrets,
                colors: colors as any,
                animationType,
                showChordName,
                transitionsEnabled,
                buildEnabled,
                capo
            });
        }
    }, [width, height, numStrings, effectiveNumFrets, colors, animationType, showChordName, transitionsEnabled, buildEnabled, capo]);

    // Update Chords
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setChords(chords);
        }
    }, [chords]);

    // Update Preview Chord
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setPreviewChord(previewChord || null);
        }
    }, [previewChord]);

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
        // This ref is used by the canvas recorder, so it needs to point to the current drawFrame
        // which now delegates to the engine.
        drawFrameRef.current = drawFrame;
    }, [drawFrame]);

    // Resize handling (if props don't catch it strictly, or pure window resize needed)
    useEffect(() => {
        if (engineRef.current && canvasRef.current) {
            engineRef.current.resize(width, height);
        }
    }, [width, height]);

    // Canvas recorder for video rendering
    const canvasRecorder = useCanvasRecorder(stageContainerRef as any, {
        fps: 30,
        format: renderFormat === 'json' ? 'webm' : renderFormat,
        quality: renderQuality,
    });

    // Define Timing Helpers EARLY to avoid reference errors
    const minSegmentSec = 0.1;
    const getSegmentDurationSec = useCallback((chordWithTiming: ChordWithTiming) => {
        const defaultSegmentSec = 2.0;
        const clipSec = (chordWithTiming.duration / 1000) || defaultSegmentSec;
        return Math.max(clipSec, minSegmentSec);
        // Removed dangling legacy code
    }, [minSegmentSec]);

    useEffect(() => {
        if (!backgroundCanvasRef.current) return;
        const bgCtx = backgroundCanvasRef.current.getContext('2d');
        if (!bgCtx) return;

        bgCtx.clearRect(0, 0, width, height);
        if (colors?.global?.backgroundColor) {
            bgCtx.fillStyle = colors.global.backgroundColor;
            bgCtx.fillRect(0, 0, width, height);
        }

        const effectiveScale = colors?.global?.scale || 1;
        let bgDrawer: ChordDrawer;

        bgDrawer = new ShortNeckDrawer(bgCtx, colors, { width, height }, {
            diagramWidth: width,
            diagramHeight: height,
            diagramX: 0,
            diagramY: 0,
            numStrings: numStrings,
            numFrets: numFrets,
            horizontalPadding: 100,
            stringSpacing: 0,
            fretboardX: 0,
            fretboardY: 0,
            fretboardWidth: width,
            fretboardHeight: height,
            realFretSpacing: 0,
            neckRadius: 35 * effectiveScale,
            stringNamesY: 0,
        }, effectiveScale);

        bgDrawer.setNumStrings(numStrings || 6);
        bgDrawer.setNumFrets(numFrets || 24);
        bgDrawer.setGlobalCapo(capo || 0);
        bgDrawer.setStringNames(stringNames);
        bgDrawer.drawFretboard();
    }, [width, height, animationType, colors, numStrings, numFrets, capo, stringNames]);

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

            // 1. IN phase - just display current chord (no transition)
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
                // Reset to first chord when animation completes
                animationStateRef.current.chordIndex = 0;
                animationStateRef.current.chordProgress = 0;
                animationStateRef.current.transitionProgress = 0;
                animationStateRef.current.buildProgress = 1;
                playheadStateRef.current.t = 0;
                playbackElapsedMsRef.current = 0;

                setPlaybackProgress(0);
                setPlaybackIsPlaying(false);
                setPlaybackIsPaused(false);
                setIsAnimating(false);
                isAnimatingRef.current = false;
                setIsPaused(false);
                if (onAnimationStateChange) onAnimationStateChange(false, false);

                // Redraw to show first chord
                drawAnimatedChord();
                stopPlayhead();
                return;
            }
            playbackRafIdRef.current = requestAnimationFrame(tick);
        };
        playbackRafIdRef.current = requestAnimationFrame(tick);
    }, [computeStateAtTimeMs, drawAnimatedChord, onAnimationStateChange, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, stopPlayhead, chords]);


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

    // Effect for when chords array changes
    useEffect(() => {
        if (!isAnimating && chords && chords.length > 0 && typeof activeChordIndex === 'number') {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));
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
    }, [chords, isAnimating]);

    // Effect for when activeChordIndex changes
    useEffect(() => {
        if (!isAnimating && typeof activeChordIndex === 'number' && chords && chords.length > 0) {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));
            console.log('[FretboardStage] activeChordIndex changed:', {
                activeChordIndex,
                clampedIndex: index,
                totalChords: chords.length,
                chordData: chords[index]?.finalChord
            });

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
    }, [activeChordIndex, isAnimating]);

    const handleRender = useCallback(async (format?: 'mp4' | 'webm' | 'json', quality?: 'low' | 'medium' | 'high' | 'ultra') => {
        if (!chords || chords.length === 0 || !canvasRef.current) return;
        const targetFormat = format || 'mp4';
        const targetQuality = quality || 'medium';
        setRenderFormat(targetFormat);
        setRenderQuality(targetQuality);

        if (targetFormat === 'json') {
            const exportData = {
                chords: chords.map(c => ({
                    chordName: c.finalChord?.chordName || '',
                    fingers: c.finalChord?.fingers || [],
                    avoid: c.finalChord?.avoid || [],
                    duration: c.duration,
                    origin: c.finalChord?.origin || 0,
                })),
                settings: { width, height, numStrings, numFrets, capo, animationType },
                theme: colors,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            canvasRecorder.downloadVideo(blob, 'animation-data.json');
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
                canvasRecorder.downloadVideo(videoBlob, `chord-animation.${extension}`);
                canvasRecorder.setIsComplete(true);
            }
        } catch (error: any) {
            if (error.message !== "Render cancelled") console.error('Render error:', error);
            canvasRecorder.cancelRender();
        } finally {
            isRenderingRef.current = false;
            canvasRecorder.setIsRendering(false);
        }
    }, [chords, width, height, numStrings, numFrets, capo, animationType, colors, canvasRecorder, computeTotalPlaybackDurationMs, computeStateAtTimeMs, onRenderProgress]);

    React.useImperativeHandle(ref, () => ({
        startAnimation,
        pauseAnimation,
        resumeAnimation,
        handleRender,
        cancelRender: () => { isRenderCancelledRef.current = true; canvasRecorder.cancelRender(); },
        isAnimating: isAnimatingRef.current,
        isRendering: isRenderingRef.current,
        isPaused: isPaused,
        resetPlayback
    }));

    return (
        <div ref={stageContainerRef} className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <canvas ref={backgroundCanvasRef} width={width} height={height} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
        </div>
    );
});

FretboardStage.displayName = "FretboardStage";

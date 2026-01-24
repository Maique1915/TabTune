"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { type JSAnimation } from "animejs";
import type { ChordWithTiming, ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { type ChordDrawer } from "@/modules/engine/infrastructure/drawers/ChordDrawer";
import { ShortChord } from "@/modules/engine/infrastructure/drawers/ShortChord";
import { FullChord } from "@/modules/engine/infrastructure/drawers/FullChord";

import { drawStaticFingersAnimation } from "@/modules/engine/infrastructure/drawers/static-fingers-drawer";
import { drawCarouselAnimation } from "@/modules/engine/infrastructure/drawers/carousel-drawer";
import { extensions as extensionMap } from "@/modules/core/domain/chord-logic";

import { TimelineState } from "@/modules/chords/domain/types";
import { useCanvasRecorder, CanvasRecorderOptions } from "@/lib/shared/hooks/useCanvasRecorder";

export interface FretboardStageRef {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    handleRender: () => Promise<void>;
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
    const animationRef = useRef<JSAnimation | null>(null);
    const playheadAnimationRef = useRef<JSAnimation | null>(null);
    const playheadStateRef = useRef<{ t: number }>({ t: 0 });
    const playbackRafIdRef = useRef<number | null>(null);
    const playbackStartPerfMsRef = useRef<number>(0);
    const playbackElapsedMsRef = useRef<number>(0);
    const playbackSessionIdRef = useRef<number>(0);
    const lastProgressEmitMsRef = useRef<number>(0);

    // Need ChordDrawerBase only if re-using some logic, otherwise can likely remove if GuitarFretboardDrawer is self-sufficient.
    // BUT: GuitarFretboardDrawer might not handle text/layout same way. 
    // Let's keep it minimal: GuitarFretboardDrawer IS the main drawer here.

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
    const animationType = propsAnimationType || contextAnimationType || 'guitar-fretboard';

    // Determine effective numFrets
    // If prop provided, use it. If not, default based on animationType.
    // 'guitar-fretboard' implies Full Neck (24), 'static-fingers' usually Short (5).
    const effectiveNumFrets = propNumFrets ?? (animationType === 'guitar-fretboard' ? 24 : 5);
    const numFrets = effectiveNumFrets;

    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const isRenderCancelledRef = useRef(false);
    const prevActiveChordIndexRef = useRef<number | undefined>(undefined);

    const chordDrawerRef = useRef<ChordDrawer | null>(null);

    // Define Timing Helpers EARLY to avoid reference errors
    const minSegmentSec = 0.5; // Faster for fretboard?
    const getSegmentDurationSec = useCallback((chordWithTiming: ChordWithTiming) => {
        const defaultSegmentSec = 2.0;
        const clipSec = (chordWithTiming.duration / 1000) || defaultSegmentSec;
        return Math.max(clipSec, minSegmentSec);
    }, [minSegmentSec]);




    const drawFrame = useCallback((state: AnimationState, timeMs: number) => {
        console.log('[FretboardStage] drawFrame called, capo:', capo, 'animationType:', animationType);
        // Clear canvas before drawing anything
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
            // Se estamos usando animação de transição, limpamos de forma transparente
            // para mostrar o backgroundCanvas embaixo.
            if (animationType === "static-fingers" || animationType === "dynamic-fingers" || animationType === "guitar-fretboard") {
                ctx.clearRect(0, 0, width, height);
            } else {
                ctx.fillStyle = colors.global?.backgroundColor || colors.cardColor || '#000000';
                ctx.fillRect(0, 0, width, height);
            }
        }

        // 1. Draw Fretboard (or Chord Diagram)
        // 1. Draw Fretboard (or Chord Diagram)
        if (animationType === "guitar-fretboard" && chordDrawerRef.current) {
            const drawer = chordDrawerRef.current;

            // Draw Preview Chord if active
            if (previewChord) {
                // Note: Opacity support not yet fully standard in ChordDrawer interface, using standard draw for now.
                drawer.drawFretboard();
                drawer.drawChord(previewChord, 0);
            }

            if (chords && chords.length > 0) {
                const chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
                const currentChordData = chords[chordIndex];
                if (currentChordData) {
                    if (transitionsEnabled) {
                        const nextChordData = (chordIndex < chords.length - 1) ? chords[chordIndex + 1] : null;
                        drawStaticFingersAnimation({
                            drawer: drawer,
                            currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                            nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                            transitionProgress: state.transitionProgress,
                            buildProgress: state.buildProgress,
                            skipFretboard: true
                        });
                    } else {
                        // Background already has the fretboard
                        drawer.drawChord(currentChordData.finalChord, currentChordData.transportDisplay, 0, {
                            skipFretboard: true
                        });
                    }

                    // Synchronized Chord Name Animation
                    if (showChordName) {
                        const tp = state.transitionProgress;
                        const hasNext = (chordIndex < chords.length - 1);

                        if (transitionsEnabled && tp > 0 && hasNext) {
                            const nextChordData = chords[chordIndex + 1];
                            const sameName = currentChordData.finalChord.chordName === nextChordData.finalChord.chordName;

                            if (sameName) {
                                // Just draw once with full opacity
                                if (currentChordData.finalChord.showChordName !== false) {
                                    const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                    drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                                }
                            } else {
                                // Interpolate between current and next chord names
                                const currentOpacity = 1 - tp;
                                const nextOpacity = tp;

                                if (currentChordData.finalChord.showChordName !== false) {
                                    const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                    drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: currentOpacity, extensions: exts });
                                }
                                if (nextChordData && nextChordData.finalChord.showChordName !== false) {
                                    const exts = nextChordData.finalChord.chord?.extension ? nextChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                    drawer.drawChordName(nextChordData.finalChord.chordName || "", { opacity: nextOpacity, extensions: exts });
                                }
                            }
                        } else {
                            // Static display
                            if (currentChordData.finalChord.showChordName !== false) {
                                const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                            }
                        }
                    }
                }
            }
        } else if (chordDrawerRef.current) {
            const drawer = chordDrawerRef.current;
            // drawer.clear(); // Already cleared above

            if (chords && chords.length > 0) {
                const chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
                const currentChordData = chords[chordIndex];

                if (currentChordData) {
                    if (animationType === "static-fingers") {
                        const nextChordData = (chordIndex < chords.length - 1) ? chords[chordIndex + 1] : null;
                        drawStaticFingersAnimation({
                            drawer,
                            currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                            nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                            transitionProgress: state.transitionProgress,
                            buildProgress: state.buildProgress,
                            skipFretboard: true
                        });
                    } else if (animationType === "dynamic-fingers") {
                        // Fallback to static-fingers animation as dynamic-fingers-drawer was removed.
                        const nextChordData = (chordIndex < chords.length - 1) ? chords[chordIndex + 1] : null;
                        drawStaticFingersAnimation({
                            drawer,
                            currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                            nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                            transitionProgress: state.transitionProgress,
                            buildProgress: state.buildProgress,
                            skipFretboard: true
                        });
                    } else if (animationType === "carousel") {
                        const nextChordData = (chordIndex < chords.length - 1) ? chords[chordIndex + 1] : null;

                        // Ensure chords is not undefined (TS Check)
                        const allChordsSafe = chords.map(c => ({
                            finalChord: c.finalChord,
                            transportDisplay: c.transportDisplay
                        }));

                        drawCarouselAnimation({
                            drawer,
                            allChords: allChordsSafe,
                            currentIndex: state.chordIndex,
                            currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                            transitionProgress: state.transitionProgress
                        });
                    } else {
                        // Suppress internal drawing to handle it externally with transitions
                        const chordToDraw = { ...currentChordData.finalChord, showChordName: false };

                        if (buildEnabled && state.buildProgress < 1) {
                            drawer.drawChord(chordToDraw, currentChordData.transportDisplay, 0, { skipFretboard: state.buildProgress > 0.3 });
                        } else {
                            drawer.drawChord(chordToDraw, currentChordData.transportDisplay);
                        }
                    }

                    // Synchronized Chord Name Animation
                    if (showChordName && animationType !== "carousel") {
                        const tp = state.transitionProgress;
                        const hasNext = (chordIndex < chords.length - 1);

                        if (transitionsEnabled && tp > 0 && hasNext) {
                            const nextChordData = chords[chordIndex + 1];
                            const sameName = currentChordData.finalChord.chordName === nextChordData.finalChord.chordName;

                            if (sameName) {
                                if (currentChordData.finalChord.showChordName !== false) {
                                    const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                    drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                                }
                            } else {
                                // Interpolate
                                const currentOpacity = 1 - tp;
                                const nextOpacity = tp;

                                if (currentChordData.finalChord.showChordName !== false) {
                                    const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                    drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: currentOpacity, extensions: exts });
                                }
                                if (nextChordData && nextChordData.finalChord.showChordName !== false) {
                                    const exts = nextChordData.finalChord.chord?.extension ? nextChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                    drawer.drawChordName(nextChordData.finalChord.chordName || "", { opacity: nextOpacity, extensions: exts });
                                }
                            }
                        } else {
                            if (currentChordData.finalChord.showChordName !== false) {
                                const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                            }
                        }
                    }
                }
            } else if (previewChord) {
                drawer.drawFretboard();
                drawer.drawFingers(previewChord);
                // ChordDrawerBase.drawFingers doesn't draw the name, so we draw it here.
                if (showChordName && previewChord.chordName && previewChord.showChordName !== false) {
                    const exts = previewChord.chord?.extension ? previewChord.chord.extension.map(i => extensionMap[i]) : undefined;
                    drawer.drawChordName(previewChord.chordName, { extensions: exts });
                }
            } else {
                drawer.drawFretboard();
            }
        }

        // 2. Score drawing removed as drawer was deleted
    }, [chords, height, timelineState, width, animationType, previewChord, showChordName, capo, buildEnabled, colors]);

    const drawAnimatedChord = useCallback(() => {
        if (!canvasRef.current) return;
        if (!chordDrawerRef.current) return;

        console.log('[FretboardStage] drawAnimatedChord called');
        drawFrame(animationStateRef.current, playheadStateRef.current.t);

        if (isRecording && onFrameCapture) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const imageData = ctx.getImageData(0, 0, width, height);
            onFrameCapture(imageData);
        }
    }, [chords, drawFrame, height, isRecording, onFrameCapture, width]);

    // Initialize Drawers
    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const isGuitarFretboard = animationType === "guitar-fretboard";
        if (isGuitarFretboard) {
            chordDrawerRef.current = new FullChord(ctx, colors, { width, height }, colors.fretboardScale || 1);
        } else {
            chordDrawerRef.current = new ShortChord(ctx, colors, { width, height }, colors.fretboardScale || 1);
        }

        chordDrawerRef.current.setNumStrings(numStrings);
        chordDrawerRef.current.setNumFrets(numFrets);
        chordDrawerRef.current.setGlobalCapo(capo || 0);
        chordDrawerRef.current.setStringNames(stringNames);

        // Handle Rotation
        // GuitarFretboardDrawer was Horizontal (-90 deg equivalent for Vertical drawers).
        // If in 'guitar-fretboard' mode and no specific rotation Set, default to Horizontal (-90).
        // If user Provides rotation, use it.
        let effectiveRotation = colors.global?.rotation || 0;
        if (isGuitarFretboard && !colors.global?.rotation) {
            effectiveRotation = 0;
        }

        chordDrawerRef.current.setTransforms(effectiveRotation as any, colors.global?.mirror || false);

        // Legacy ref cleared

        // scoreDrawerRef removed

        if (!isAnimating) {
            drawAnimatedChord();
        }
    }, [colors, width, height, isAnimating, drawAnimatedChord, previewChord, numStrings, numFrets, stringNames, tuningShift, animationType, capo]);

    // ...

    // Handle Static Background - simplified for Fretboard (maybe just background color)
    useEffect(() => {
        if (!backgroundCanvasRef.current) return;
        const bgCtx = backgroundCanvasRef.current.getContext('2d');
        if (!bgCtx) return;

        // Clear or fill background
        bgCtx.clearRect(0, 0, width, height);
        if (colors?.global?.backgroundColor) {
            bgCtx.fillStyle = colors.global.backgroundColor;
            bgCtx.fillRect(0, 0, width, height);
        }

        // Draw static fretboard on background to decouple it from finger animations
        if (animationType === 'static-fingers' || animationType === 'dynamic-fingers' || animationType === 'default' || !animationType || animationType === 'guitar-fretboard') {
            const isGuitarFretboard = animationType === 'guitar-fretboard';
            let bgDrawer: ChordDrawer;
            if (isGuitarFretboard) {
                bgDrawer = new FullChord(bgCtx, colors, { width, height }, colors.fretboardScale || 1);
            } else {
                bgDrawer = new ShortChord(bgCtx, colors, { width, height }, colors.fretboardScale || 1);
            }

            bgDrawer.setNumStrings(numStrings || 6);
            bgDrawer.setNumFrets(numFrets || 24);
            bgDrawer.setGlobalCapo(capo || 0);
            bgDrawer.setStringNames(stringNames);

            bgDrawer.drawFretboard();
        }
    }, [width, height, animationType, colors, numStrings, numFrets, capo, stringNames]);

    // Timing Logic (Reused from VideoCanvasStage but simplified)
    // ... (Identical timing logic logic omitted for brevity, but needed for playback)
    // I will include the core timing logic to ensure playback works.

    // Timing Helpers Moved to Top
    // Reused timing logic logic omitted for brevity


    const stopPlayhead = useCallback(() => {
        // ... cleanup logic
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(false);
    }, [setPlaybackIsPlaying, setPlaybackIsPaused]);

    // Helper for computing total duration
    const computeTotalPlaybackDurationMs = useCallback(() => {
        if (!chords || chords.length === 0) return 0;
        let totalMs = 0;
        for (const chordWithTiming of chords) {
            totalMs += getSegmentDurationSec(chordWithTiming) * 1000;
        }
        return Math.max(0, Math.round(totalMs));
    }, [chords, getSegmentDurationSec]);

    // State computation (Simplified: just find the chord index)
    const computeStateAtTimeMs = useCallback((timeMs: number) => {
        if (!chords || chords.length === 0) return null;
        let cursor = 0;
        const t = Math.max(0, timeMs);

        const halfTransitionMsBase = 400; // 0.8s total transition for static

        for (let i = 0; i < chords.length; i++) {
            const segmentMs = Math.max(0, getSegmentDurationSec(chords[i]) * 1000);

            if ((animationType === "static-fingers" || animationType === "dynamic-fingers" || animationType === "guitar-fretboard" || animationType === "carousel") && transitionsEnabled) {
                // Aumentamos o tempo de transição para 530ms (aprox 1/3 a menos que 800ms)
                const totalTransitionMs = 530;
                const transitionHalfMs = totalTransitionMs / 2;

                // 1. Saída do acorde anterior (Outgoing)
                // Se estamos no início de um acorde, mas vindo de outro,
                // na verdade a transição começa no FINAL do acorde anterior.
                // Mas a lógica de loop aqui percorre os acordes.
                // Vamos ajustar para que cada acorde tenha sua parte estática e sua parte de transição.

                const currentSegmentTransitionOut = (i < chords.length - 1) ? Math.min(transitionHalfMs, segmentMs / 2) : 0;
                const currentSegmentTransitionIn = (i > 0) ? Math.min(transitionHalfMs, segmentMs / 2) : 0;
                const staticMs = segmentMs - currentSegmentTransitionIn - currentSegmentTransitionOut;

                // Parte 1: In (Entrada vindo do anterior)
                if (t < cursor + currentSegmentTransitionIn) {
                    const p = (t - cursor) / currentSegmentTransitionIn;
                    // p vai de 0 a 1. Na transição completa, isso corresponde a 0.5 -> 1.0
                    return {
                        chordIndex: i - 1,
                        transitionProgress: 0.5 + (0.5 * p),
                        buildProgress: 1,
                        chordProgress: 1
                    };
                }
                cursor += currentSegmentTransitionIn;

                // Parte 2: Static (Acorde parado)
                if (t < cursor + staticMs) {
                    return {
                        chordIndex: i,
                        transitionProgress: 0,
                        buildProgress: 1,
                        chordProgress: 0.5
                    };
                }
                cursor += staticMs;

                // Parte 3: Out (Saída indo para o próximo)
                if (t < cursor + currentSegmentTransitionOut) {
                    const p = (t - cursor) / currentSegmentTransitionOut;
                    // p vai de 0 a 1. Na transição completa, isso corresponde a 0.0 -> 0.5
                    return {
                        chordIndex: i,
                        transitionProgress: 0.5 * p,
                        buildProgress: 1,
                        chordProgress: 1
                    };
                }
                cursor += currentSegmentTransitionOut;
            } else {
                if (t < cursor + segmentMs) {
                    const progress = segmentMs > 0 ? (t - cursor) / segmentMs : 0;
                    return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: progress };
                }
                cursor += segmentMs;
            }
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
        // Stop current loop first
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

            // Draw
            const state = computeStateAtTimeMs(clampedElapsed);
            if (state && chords) {
                // Detect Name Change (Simplified: just update current name for reference)
                const currentChordData = chords[state.chordIndex];
                const newName = currentChordData?.finalChord?.chordName || "";
                animationStateRef.current.currentChordName = newName;

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
                setPlaybackProgress(0);
                setPlaybackIsPlaying(false);
                setPlaybackIsPaused(false);
                setIsAnimating(false);
                setIsPaused(false);
                if (onAnimationStateChange) onAnimationStateChange(false, false);
                stopPlayhead();
                return;
            }

            playbackRafIdRef.current = requestAnimationFrame(tick);
        };

        playbackRafIdRef.current = requestAnimationFrame(tick);
    }, [computeStateAtTimeMs, drawAnimatedChord, onAnimationStateChange, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, stopPlayhead, chords]);

    // Manage animation loop lifecycle - restart loop if closure dependencies change
    useEffect(() => {
        if (isAnimating && !isPaused) {
            const totalMs = computeTotalPlaybackDurationMs();
            startPlaybackRafLoop(totalMs);
        }
        return () => {
            if (playbackRafIdRef.current !== null) {
                cancelAnimationFrame(playbackRafIdRef.current);
                playbackRafIdRef.current = null;
            }
        };
    }, [isAnimating, isPaused, startPlaybackRafLoop, computeTotalPlaybackDurationMs]);


    const startAnimation = () => {
        if (!chords || chords.length === 0) return;

        setIsAnimating(true);
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
        if (!isPaused) return;
        if (!chords || chords.length === 0) return;

        setIsPaused(false);
        setPlaybackIsPaused(false);
        if (onAnimationStateChange) onAnimationStateChange(true, false);

        const totalMs = computeTotalPlaybackDurationMs();
        playbackStartPerfMsRef.current = performance.now() - playbackElapsedMsRef.current;
        startPlaybackRafLoop(totalMs);
    };

    const resetPlayback = () => {
        // Stop current animation
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }

        setIsAnimating(false);
        setIsPaused(false);
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(false);

        // Reset Ref State
        playbackElapsedMsRef.current = 0;
        animationStateRef.current = {
            ...animationStateRef.current,
            chordIndex: 0,
            chordProgress: 0,
            transitionProgress: 0,
            buildProgress: 0,
        };

        // Reset Context State
        setPlaybackProgress(0);

        if (onAnimationStateChange) onAnimationStateChange(false, false);

        // Force Draw Initial Frame
        drawAnimatedChord();
    };


    // Effects for auto-update duration
    useEffect(() => {
        if (playheadAnimationRef.current && !isPaused) return;
        const totalMs = computeTotalPlaybackDurationMs();
        if (totalMs !== playbackTotalDurationMs) {
            setPlaybackTotalDurationMs(totalMs);
        }
    }, [computeTotalPlaybackDurationMs, isPaused, setPlaybackTotalDurationMs, playbackTotalDurationMs]);

    // Seek Logic
    useEffect(() => {
        if (!chords || chords.length === 0) return;
        if (!playbackSeekNonce) return;

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

            // Sync Name immediately for seek
            const currentChordData = chords[state.chordIndex];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;

            drawAnimatedChord();
        }
    }, [chords, computeStateAtTimeMs, computeTotalPlaybackDurationMs, playbackSeekNonce, playbackSeekProgress, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress]);


    // Sync activeChordIndex when not animating (e.g. user clicked timeline or next/prev)
    useEffect(() => {
        // Only run if activeChordIndex CHANGED (user interaction), ignore if just Paused but index didn't change
        if (!isAnimating && typeof activeChordIndex === 'number' && chords && chords.length > 0) {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));
            animationStateRef.current.chordIndex = index;
            animationStateRef.current.chordProgress = 0;

            // Sync Name immediately (no transition for instant jumps)
            const currentChordData = chords[index];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = ""; // Clear prev
            animationStateRef.current.nameTransitionProgress = 1; // Fully visible

            drawAnimatedChord();
        }
    }, [activeChordIndex, chords, isAnimating, drawAnimatedChord]);


    React.useImperativeHandle(ref, () => ({
        startAnimation,
        pauseAnimation,
        resumeAnimation,
        handleRender: async () => { console.warn("Render functionality not implemented."); return Promise.resolve(); }, // Dummy implementation
        cancelRender: () => { console.warn("Render functionality not implemented."); }, // Dummy implementation
        isAnimating,
        isRendering: false, // Always false now
        isPaused,
        resetPlayback
    }));


    return (
        <>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <canvas
                    ref={backgroundCanvasRef}
                    width={width}
                    height={height}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{ zIndex: 0 }}
                />
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="relative w-full h-full object-contain"
                    style={{ zIndex: 1 }}
                />
            </div>
        </>
    );
});

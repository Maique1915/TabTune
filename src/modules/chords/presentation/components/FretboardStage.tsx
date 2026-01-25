"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { type JSAnimation } from "animejs";
import type { ChordWithTiming, ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { type ChordDrawer } from "@/modules/engine/infrastructure/drawers/ChordDrawer";
import { ShortNeckDrawer } from "@/modules/engine/infrastructure/drawers/ShortNeck";
import { FullNeckDrawer } from "@/modules/engine/infrastructure/drawers/FullNeck";

import { FingersAnimationDrawer, FingersAnimationParams } from "@/modules/engine/infrastructure/drawers/static-fingers-drawer";
import { ShortFingersAnimation } from "@/modules/engine/infrastructure/drawers/ShortFingersAnimation";
import { FullFingersAnimation } from "@/modules/engine/infrastructure/drawers/FullFingersAnimation";
import { extensions as extensionMap } from "@/modules/core/domain/chord-logic";

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
    const animationType = propsAnimationType || contextAnimationType || 'guitar-fretboard';

    // Determine effective numFrets
    const effectiveNumFrets = propNumFrets ?? (animationType === 'guitar-fretboard' ? 24 : 5);
    const numFrets = effectiveNumFrets;

    const [isAnimating, setIsAnimating] = useState(false);
    const isAnimatingRef = useRef(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderFormat, setRenderFormat] = useState<'mp4' | 'webm' | 'json'>('mp4');
    const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('medium');

    const isRenderCancelledRef = useRef(false);
    const isRenderingRef = useRef(false);
    const prevActiveChordIndexRef = useRef<number | undefined>(undefined);

    const chordDrawerRef = useRef<ChordDrawer | null>(null);
    const fingersAnimationRef = useRef<FingersAnimationDrawer | null>(null);
    const drawFrameRef = useRef<((state: AnimationState, timeMs: number) => void) | null>(null);

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
    }, [minSegmentSec]);

    const drawFrame = useCallback((state: AnimationState, timeMs: number) => {
        const isRendering = isRenderingRef.current || canvasRecorder.isRendering;

        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (isRendering) {
            ctx.fillStyle = colors.global?.backgroundColor || colors.cardColor || '#000000';
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.clearRect(0, 0, width, height);
        }

        if (chordDrawerRef.current && isRendering) {
            chordDrawerRef.current.drawFretboard();
        }

        if (animationType === "guitar-fretboard" && chordDrawerRef.current) {
            const drawer = chordDrawerRef.current;

            if (previewChord) {
                drawer.drawFretboard();
                drawer.drawChord(previewChord, 0);
            }

            if (chords && chords.length > 0) {
                const chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
                const currentChordData = chords[chordIndex];
                if (currentChordData) {
                    if (transitionsEnabled && fingersAnimationRef.current) {
                        const nextChordData = (chordIndex < chords.length - 1) ? chords[chordIndex + 1] : null;
                        fingersAnimationRef.current.draw({
                            drawer: drawer,
                            currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                            nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                            transitionProgress: state.transitionProgress,
                            buildProgress: state.buildProgress,
                            skipFretboard: true
                        });
                    } else {
                        drawer.drawChord(currentChordData.finalChord, currentChordData.transportDisplay, 0, {
                            skipFretboard: true
                        });
                    }

                    if (showChordName) {
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
                                if (tp < 0.5) {
                                    if (currentChordData.finalChord.showChordName !== false) {
                                        const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                        drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                                    }
                                } else {
                                    if (nextChordData && nextChordData.finalChord.showChordName !== false) {
                                        const exts = nextChordData.finalChord.chord?.extension ? nextChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                        drawer.drawChordName(nextChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                                    }
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
            }
        } else if (chordDrawerRef.current) {
            const drawer = chordDrawerRef.current;
            if (chords && chords.length > 0) {
                const chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
                const currentChordData = chords[chordIndex];

                if (currentChordData) {
                    if (animationType === "static-fingers" || animationType === "dynamic-fingers") {
                        const nextChordData = (chordIndex < chords.length - 1) ? chords[chordIndex + 1] : null;
                        if (fingersAnimationRef.current) {
                            fingersAnimationRef.current.draw({
                                drawer,
                                currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                                nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                                transitionProgress: state.transitionProgress,
                                buildProgress: state.buildProgress,
                                skipFretboard: true
                            });
                        }
                    } else if (animationType === "carousel" && fingersAnimationRef.current) {
                        const allChordsSafe = chords.map(c => ({
                            finalChord: c.finalChord,
                            transportDisplay: c.transportDisplay
                        }));

                        fingersAnimationRef.current.draw({
                            drawer,
                            allChords: allChordsSafe,
                            currentIndex: state.chordIndex,
                            currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                            nextDisplayChord: null, // Not used in carousel mode
                            transitionProgress: state.transitionProgress
                        });
                    } else {
                        const chordToDraw = { ...currentChordData.finalChord, showChordName: false };
                        if (buildEnabled && state.buildProgress < 1) {
                            drawer.drawChord(chordToDraw, currentChordData.transportDisplay, 0, { skipFretboard: state.buildProgress > 0.3 });
                        } else {
                            drawer.drawChord(chordToDraw, currentChordData.transportDisplay);
                        }
                    }

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
                                if (tp < 0.5) {
                                    if (currentChordData.finalChord.showChordName !== false) {
                                        const exts = currentChordData.finalChord.chord?.extension ? currentChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                        drawer.drawChordName(currentChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                                    }
                                } else {
                                    if (nextChordData && nextChordData.finalChord.showChordName !== false) {
                                        const exts = nextChordData.finalChord.chord?.extension ? nextChordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
                                        drawer.drawChordName(nextChordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
                                    }
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
                if (showChordName && previewChord.chordName && previewChord.showChordName !== false) {
                    const exts = previewChord.chord?.extension ? previewChord.chord.extension.map(i => extensionMap[i]) : undefined;
                    drawer.drawChordName(previewChord.chordName, { extensions: exts });
                }
            } else {
                drawer.drawFretboard();
            }
        }
    }, [chords, height, width, animationType, previewChord, showChordName, capo, buildEnabled, colors, transitionsEnabled]);

    const drawAnimatedChord = useCallback(() => {
        if (!canvasRef.current || !chordDrawerRef.current) return;
        drawFrame(animationStateRef.current, playheadStateRef.current.t);
    }, [drawFrame]);

    useEffect(() => {
        drawFrameRef.current = drawFrame;
    }, [drawFrame]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const isGuitarFretboard = animationType === "guitar-fretboard";
        const effectiveScale = colors?.global?.scale || 1;
        if (isGuitarFretboard) {
            chordDrawerRef.current = new FullNeckDrawer(ctx, colors, { width, height }, { numStrings, numFrets }, effectiveScale);
            fingersAnimationRef.current = new FullFingersAnimation();
        } else {
            chordDrawerRef.current = new ShortNeckDrawer(ctx, colors, { width, height }, {
                diagramWidth: width,
                diagramHeight: height,
                diagramX: 0,
                diagramY: 0,
                numStrings: numStrings,
                numFrets: numFrets,
                horizontalPadding: 100, // Studio style padding
                stringSpacing: 0,
                fretboardX: 0,
                fretboardY: 0,
                fretboardWidth: width,
                fretboardHeight: height,
                realFretSpacing: 0,
                neckRadius: 35 * effectiveScale,
                stringNamesY: 0,
            }, effectiveScale);
            fingersAnimationRef.current = new ShortFingersAnimation();
        }

        if (chordDrawerRef.current) {
            chordDrawerRef.current.setNumStrings(numStrings);
            chordDrawerRef.current.setNumFrets(numFrets);
            chordDrawerRef.current.setGlobalCapo(capo || 0);
            chordDrawerRef.current.setStringNames(stringNames);

            let effectiveRotation = colors.global?.rotation || 0;
            if (isGuitarFretboard && !colors.global?.rotation) {
                effectiveRotation = 0;
            }

            chordDrawerRef.current.setTransforms(effectiveRotation as any, colors.global?.mirror || false);
            chordDrawerRef.current.calculateDimensions();
        }

        if (!isAnimating) {
            drawAnimatedChord();
        }
    }, [colors, width, height, isAnimating, drawAnimatedChord, numStrings, numFrets, stringNames, animationType, capo]);

    useEffect(() => {
        if (!backgroundCanvasRef.current) return;
        const bgCtx = backgroundCanvasRef.current.getContext('2d');
        if (!bgCtx) return;

        bgCtx.clearRect(0, 0, width, height);
        if (colors?.global?.backgroundColor) {
            bgCtx.fillStyle = colors.global.backgroundColor;
            bgCtx.fillRect(0, 0, width, height);
        }

        const isGuitarFretboard = animationType === 'guitar-fretboard';
        const effectiveScale = colors?.global?.scale || 1;
        let bgDrawer: ChordDrawer;
        if (isGuitarFretboard) {
            bgDrawer = new FullNeckDrawer(bgCtx, colors, { width, height }, { numStrings, numFrets }, effectiveScale);
        } else {
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
        }

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
                setPlaybackProgress(0);
                setPlaybackIsPlaying(false);
                setPlaybackIsPaused(false);
                setIsAnimating(false);
                isAnimatingRef.current = false;
                setIsPaused(false);
                if (onAnimationStateChange) onAnimationStateChange(false, false);
                stopPlayhead();
                return;
            }
            playbackRafIdRef.current = requestAnimationFrame(tick);
        };
        playbackRafIdRef.current = requestAnimationFrame(tick);
    }, [computeStateAtTimeMs, drawAnimatedChord, onAnimationStateChange, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, stopPlayhead, chords]);

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

    useEffect(() => {
        if (!isAnimating && typeof activeChordIndex === 'number' && chords && chords.length > 0) {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));
            animationStateRef.current.chordIndex = index;
            animationStateRef.current.chordProgress = 0;
            const currentChordData = chords[index];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;
            drawAnimatedChord();
        }
    }, [activeChordIndex, chords, isAnimating, drawAnimatedChord]);

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

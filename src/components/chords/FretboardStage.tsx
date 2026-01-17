"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { type JSAnimation } from "animejs";
import type { ChordWithTiming, ChordDiagramProps } from "@/modules/core/domain/types";
import { useAppContext } from "@/app/context/app--context";
import { ChordDrawerBase } from "@/modules/engine/infrastructure/drawers/chord-drawer-base";
import { GuitarFretboardDrawer } from "@/modules/engine/infrastructure/drawers/guitar-fretboard-drawer";
import { ScoreDrawer } from "@/modules/engine/infrastructure/drawers/score-drawer";
import { TimelineState } from "@/modules/studio/domain/types";
import { useCanvasRecorder, CanvasRecorderOptions } from "@/lib/shared/hooks/useCanvasRecorder";
import { VideoRenderSettingsModal } from "@/components/shared/VideoRenderSettingsModal";
import { RenderProgressModal } from "@/components/shared/RenderProgressModal";

export interface FretboardStageRef {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    handleRender: () => Promise<void>;
    cancelRender: () => void;
    isAnimating: boolean;
    isRendering: boolean;
    isPaused: boolean;
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
    numFrets = 24,
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
        colors,
        animationType,
        setPlaybackIsPlaying,
        setPlaybackIsPaused,
        setPlaybackProgress,
        setPlaybackTotalDurationMs,
        playbackTotalDurationMs,
        playbackSeekNonce,
        playbackSeekProgress,
    } = useAppContext();
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const isRenderCancelledRef = useRef(false);

    const guitarFretboardDrawerRef = useRef<GuitarFretboardDrawer | null>(null);
    const chordDrawerRef = useRef<ChordDrawerBase | null>(null);
    const scoreDrawerRef = useRef<ScoreDrawer | null>(null);

    // Recorder Integration
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [recorderOptions, setRecorderOptions] = useState<CanvasRecorderOptions>({});
    const recorder = useCanvasRecorder(canvasRef, recorderOptions);


    const drawFrame = useCallback((state: AnimationState, timeMs: number) => {
        // Clear canvas before drawing anything
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
            ctx.fillStyle = colors.cardColor;
            ctx.fillRect(0, 0, width, height);
        }

        // 1. Draw Fretboard (or Chord Diagram)
        if (animationType === "guitar-fretboard" && guitarFretboardDrawerRef.current) {
            const drawer = guitarFretboardDrawerRef.current;
            drawer.drawHeadstock();
            drawer.drawBoard(); // Already cleared above
            drawer.drawBoard();

            if (capo > 0) {
                drawer.drawCapo(capo);
            }

            if (previewChord) {
                drawer.drawChord(previewChord, { opacity: 0.7, style: 'ghost' });
            }

            if (chords && chords.length > 0) {
                const chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
                const currentChordData = chords[chordIndex];
                if (currentChordData) {
                    drawer.drawChord(currentChordData.finalChord, {
                        strumming: currentChordData.strumming,
                        effects: currentChordData.effects,
                        progress: state.chordProgress
                    });

                    if (showChordName && currentChordData.finalChord.showChordName !== false) {
                        if (state.nameTransitionProgress < 1 && state.prevChordName) {
                            drawer.drawChordName(state.prevChordName, { opacity: 1 - state.nameTransitionProgress });
                        }
                        if (state.currentChordName) {
                            drawer.drawChordName(state.currentChordName, { opacity: state.nameTransitionProgress });
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
                    if (buildEnabled && state.buildProgress < 1) {
                        drawer.drawChord(currentChordData.finalChord, currentChordData.transportDisplay, 0, { skipFretboard: state.buildProgress > 0.3 });
                    } else {
                        drawer.drawChord(currentChordData.finalChord, currentChordData.transportDisplay);
                    }

                    if (showChordName && currentChordData.finalChord.showChordName !== false) {
                        if (state.nameTransitionProgress < 1 && state.prevChordName) {
                            drawer.drawChordName(state.prevChordName);
                        }
                        if (state.currentChordName) {
                            drawer.drawChordName(state.currentChordName);
                        }
                    }
                }
            } else if (previewChord) {
                drawer.drawFretboard();
                drawer.drawFingers(previewChord);
                if (showChordName && previewChord.chordName) {
                    drawer.drawChordName(previewChord.chordName);
                }
            } else {
                drawer.drawFretboard();
            }
        }

        // 2. Draw Score (Symbols) if available
        if (timelineState && scoreDrawerRef.current) {
            timelineState.tracks.forEach(track => {
                if (track.type !== 'symbol') return;
                const clip = track.clips.find(c => timeMs >= c.start && timeMs < c.start + c.duration);
                if (clip && clip.type === 'symbol') {
                    scoreDrawerRef.current?.draw(width, height, clip);
                }
            });
        }
    }, [chords, height, timelineState, width, animationType, previewChord, showChordName, capo, buildEnabled, colors]);

    const drawAnimatedChord = useCallback(() => {
        if (!canvasRef.current) return;
        if (!chordDrawerRef.current && !guitarFretboardDrawerRef.current) return;

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

        if (animationType === "guitar-fretboard") {
            guitarFretboardDrawerRef.current = new GuitarFretboardDrawer(ctx, colors, {
                width,
                height,
                numFrets: numFrets || 24,
                numStrings: numStrings || 6,
                rotation: colors.rotation,
                mirror: colors.mirror,
                stringNames,
                tuningShift
            });
            chordDrawerRef.current = null;
        } else {
            chordDrawerRef.current = new ChordDrawerBase(ctx, colors, {
                width,
                height
            }, colors.fretboardScale || 1);
            chordDrawerRef.current.setNumStrings(numStrings);
            chordDrawerRef.current.setNumFrets(numFrets);
            guitarFretboardDrawerRef.current = null;
        }

        scoreDrawerRef.current = new ScoreDrawer(canvasRef.current);

        if (!isAnimating) {
            drawAnimatedChord();
        }
    }, [colors, width, height, isAnimating, drawAnimatedChord, previewChord, numStrings, numFrets, stringNames, tuningShift, animationType]);

    // Handle Static Background - simplified for Fretboard (maybe just background color)
    useEffect(() => {
        if (!backgroundCanvasRef.current) return;
        const bgCtx = backgroundCanvasRef.current.getContext('2d');
        if (!bgCtx) return;

        // Clear or fill background
        bgCtx.clearRect(0, 0, width, height);
        // Maybe draw static neck here if optimizing? For now dynamic.
    }, [width, height]);

    // Timing Logic (Reused from VideoCanvasStage but simplified)
    // ... (Identical timing logic logic omitted for brevity, but needed for playback)
    // I will include the core timing logic to ensure playback works.

    const minSegmentSec = 0.5; // Faster for fretboard?
    const getSegmentDurationSec = useCallback((chordWithTiming: ChordWithTiming) => {
        const defaultSegmentSec = 2.0;
        const clipSec = (chordWithTiming.duration / 1000) || defaultSegmentSec;
        return Math.max(clipSec, minSegmentSec);
    }, [minSegmentSec]);

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

        for (let i = 0; i < chords.length; i++) {
            const segmentMs = Math.max(0, getSegmentDurationSec(chords[i]) * 1000);
            if (t < cursor + segmentMs) {
                const progress = segmentMs > 0 ? (t - cursor) / segmentMs : 0;
                return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: progress };
            }
            cursor += segmentMs;
        }
        return { chordIndex: chords.length - 1, transitionProgress: 0, buildProgress: 1, chordProgress: 1 };
    }, [chords, getSegmentDurationSec]);


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
                // Detect Name Change
                const currentChordData = chords[state.chordIndex];
                const newName = currentChordData?.finalChord?.chordName || "";

                if (newName !== animationStateRef.current.currentChordName) {
                    // Start Transition
                    animationStateRef.current.prevChordName = animationStateRef.current.currentChordName;
                    animationStateRef.current.currentChordName = newName;
                    animationStateRef.current.nameTransitionProgress = 0;
                }

                if (animationStateRef.current.nameTransitionProgress < 1) {
                    animationStateRef.current.nameTransitionProgress += 0.05;
                    if (animationStateRef.current.nameTransitionProgress > 1) {
                        animationStateRef.current.nameTransitionProgress = 1;
                    }
                }

                animationStateRef.current.chordIndex = state.chordIndex;
                animationStateRef.current.chordProgress = state.chordProgress;
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


    // Sync with activeChordIndex from props (for editing)
    useEffect(() => {
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
        handleRender: async () => setShowSettingsModal(true),
        cancelRender: () => { isRenderCancelledRef.current = true; recorder.cancelRender(); },
        isAnimating,
        isRendering: recorder.isRendering,
        isPaused
    }));


    return (
        <>
            <div className="relative w-full h-full flex items-center justify-center">
                <canvas
                    ref={backgroundCanvasRef}
                    width={width}
                    height={height}
                    className="absolute top-0 left-0 w-full h-full object-contain -z-10"
                />
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="w-full h-full object-contain"
                />
            </div>

            <VideoRenderSettingsModal
                isOpen={showSettingsModal}
                settings={{ format: 'mp4', fps: 30, quality: 'medium' }}
                onClose={() => setShowSettingsModal(false)}
                onRender={(settings) => {
                    console.log("Render not fully implemented in decoupled stage yet", settings);
                    setShowSettingsModal(false);
                }}
            />

            <RenderProgressModal
                isOpen={recorder.isRendering}
                progress={recorder.renderProgress}
                onCancel={() => {
                    isRenderCancelledRef.current = true;
                    recorder.cancelRender();
                }}
            />
        </>
    );
});

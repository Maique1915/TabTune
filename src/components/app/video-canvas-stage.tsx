"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { animate, type JSAnimation } from "animejs";
import type { ChordWithTiming } from "@/lib/types";
import { useAppContext } from "@/app/context/app--context";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { drawStaticFingersAnimation } from "@/lib/static-fingers-drawer";
import { drawCarouselAnimation } from "@/lib/carousel-drawer";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";
import { FretboardDrawer } from "@/lib/fretboard-drawer";

export interface VideoCanvasStageRef {
  startAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  handleRender: () => Promise<void>;
  cancelRender: () => void;
  isAnimating: boolean;
  isRendering: boolean;
  ffmpegLoaded: boolean;
  isPaused: boolean;
}

interface VideoCanvasStageProps {
  chords: ChordWithTiming[];
  width?: number;
  height?: number;
  onFrameCapture?: (frameData: ImageData) => void;
  isRecording?: boolean;
  onFFmpegLoad?: () => void;
  onAnimationStateChange?: (isAnimating: boolean, isPaused: boolean) => void;
  onRenderProgress?: (progress: number) => void;
  transitionsEnabled?: boolean;
  buildEnabled?: boolean;
  prebufferMs?: number;
}

interface AnimationState {
  fingerOpacity: number;
  fingerScale: number;
  cardY: number;
  nameOpacity: number;
  chordIndex: number;
  transitionProgress: number;
  buildProgress: number;
}

export const VideoCanvasStage = React.forwardRef<VideoCanvasStageRef, VideoCanvasStageProps>(({ 
  chords, 
  width = 1920, 
  height = 1080,
  onFrameCapture,
  isRecording = false,
  onFFmpegLoad,
  onAnimationStateChange,
  onRenderProgress,
  transitionsEnabled = true,
  buildEnabled = true,
  prebufferMs = 0,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<JSAnimation | null>(null);
  const playheadAnimationRef = useRef<JSAnimation | null>(null);
  const playheadStateRef = useRef<{ t: number }>({ t: 0 });
  const playbackRafIdRef = useRef<number | null>(null);
  const playbackStartPerfMsRef = useRef<number>(0);
  const playbackElapsedMsRef = useRef<number>(0);
  const playbackSessionIdRef = useRef<number>(0);
  const lastProgressEmitMsRef = useRef<number>(0);
  const chordDrawerRef = useRef<ChordDrawerBase | null>(null);

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
  });
  const {
    colors,
    animationType,
    setPlaybackIsPlaying,
    setPlaybackIsPaused,
    setPlaybackProgress,
    setPlaybackTotalDurationMs,
    playbackSeekNonce,
    playbackSeekProgress,
  } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [frames, setFrames] = useState<ImageData[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const isRenderCancelledRef = useRef(false);

  const drawFrame = useCallback((state: AnimationState) => {
    if (!chords || chords.length === 0) return;
    if (!chordDrawerRef.current) return; // Ensure drawer is initialized

    // Resolve current/next para cada tipo
    let chordIndex: number;
    let currentChordData: ChordWithTiming;
    let nextChordData: ChordWithTiming | null;

    if (animationType === "carousel") {
      chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
      currentChordData = chords[chordIndex];
      nextChordData = chordIndex < chords.length - 1 ? chords[chordIndex + 1] : null;
    } else {
      chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
      currentChordData = chords[chordIndex];
      const nextChordIndex = Math.min(chords.length - 1, chordIndex + 1);
      nextChordData = chordIndex < chords.length - 1 ? chords[nextChordIndex] : null;
    }

    if (!currentChordData) return;

    if (animationType === "static-fingers") {
      drawStaticFingersAnimation({
        drawer: chordDrawerRef.current,
        currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
        nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
        transitionProgress: state.transitionProgress,
        buildProgress: state.buildProgress,
      });
    } else {
      drawCarouselAnimation({
        drawer: chordDrawerRef.current,
        currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
        nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
        transitionProgress: state.transitionProgress,
      });
    }
  }, [animationType, chords]);

  const drawAnimatedChord = useCallback(() => {
    if (!canvasRef.current || !chords || chords.length === 0) return;
    if (!chordDrawerRef.current) return; // Ensure drawer is initialized

    // drawFrame no longer takes ctx. It uses the ctx managed by chordDrawerRef.current
    drawFrame(animationStateRef.current); 

    // Capturar frame se estiver gravando
    if (isRecording && onFrameCapture) {
      const canvas = canvasRef.current; 
      const ctx = canvas.getContext("2d"); 
      if (!ctx) return; 
      const imageData = ctx.getImageData(0, 0, width, height);
      onFrameCapture(imageData);
    }
  }, [chords, drawFrame, height, isRecording, onFrameCapture, width]);

  // Initialize and update ChordDrawerBase instance
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (!chordDrawerRef.current) {
      // Assuming scaleFactor = 1 for now, will refine if dynamic
      chordDrawerRef.current = new ChordDrawerBase(ctx, colors, { width, height }, 1);
    } else {
      // Update existing instance
      chordDrawerRef.current.setColors(colors);
      chordDrawerRef.current.setDimensions({ width, height });
      // If scaleFactor were dynamic, it would be updated here too
      // chordDrawerRef.current.setScaleFactor(someScaleFactor);
    }

    // Redraw the canvas with the new colors if not currently animating.
    // This ensures that color changes from the settings panel are reflected instantly.
    if (!isAnimating) {
        drawAnimatedChord();
    }
  }, [colors, width, height, isAnimating, drawAnimatedChord]);

  const baseTransitionDurationSec = animationType === "carousel" ? 1.0 : 0.8;
  const transitionDurationSec = transitionsEnabled ? baseTransitionDurationSec : 0;
  const buildDurationSec = 1.0;
  const minSegmentSec = transitionDurationSec * 2;
  const halfTransitionSec = transitionDurationSec / 2;

  // Duração do "segmento" do clip (em segundos). O segmento inclui a transição de saída (se houver).
  // Mantém o tempo das transições fixo e ajusta o hold para caber no tempo do clip.
  const getSegmentDurationSec = useCallback((chordWithTiming: ChordWithTiming) => {
    const defaultSegmentSec = 2.0;
    const clipSec = (chordWithTiming.duration / 1000) || defaultSegmentSec;
    return Math.max(clipSec, minSegmentSec);
  }, [minSegmentSec]);

  const stopPlayhead = useCallback(() => {
    if (playbackRafIdRef.current !== null) {
      cancelAnimationFrame(playbackRafIdRef.current);
      playbackRafIdRef.current = null;
    }
    if (playheadAnimationRef.current) {
      playheadAnimationRef.current.pause();
      playheadAnimationRef.current = null;
    }
    playheadStateRef.current.t = 0;
    playbackElapsedMsRef.current = 0;
    lastProgressEmitMsRef.current = 0;
    if (frameCacheRef.current) {
      frameCacheRef.current.bitmaps.forEach(bitmap => bitmap?.close());
      frameCacheRef.current = null;
    }
    setPlaybackProgress(0);
    setPlaybackIsPlaying(false);
    setPlaybackIsPaused(false);
  }, [setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress]);

  const startPlayhead = useCallback((totalDurationMs: number) => {
    // Mantém compatibilidade (ref) mas o playhead real é driven por RAF
    if (playheadAnimationRef.current) {
      playheadAnimationRef.current.pause();
      playheadAnimationRef.current = null;
    }
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

    const buildMsBase = (buildEnabled ? buildDurationSec : 0) * 1000;
    let cursor = 0;
    const t = Math.max(0, timeMs);

    const halfTransitionMsBase = halfTransitionSec * 1000;

    if (animationType === "static-fingers") {
      for (let i = 0; i < chords.length; i++) {
        const segmentMs = Math.max(0, getSegmentDurationSec(chords[i]) * 1000);
        const incomingHalfMs = i > 0 ? Math.min(halfTransitionMsBase, segmentMs) : 0;
        const outgoingHalfMs = i < chords.length - 1 ? Math.min(halfTransitionMsBase, segmentMs) : 0;
        const staticMs = Math.max(0, segmentMs - incomingHalfMs - outgoingHalfMs);

        // 1) Metade final da transição anterior (progress 0.5 -> 1), no início do clip
        if (incomingHalfMs > 0) {
          if (t < cursor + incomingHalfMs) {
            const p = (t - cursor) / incomingHalfMs;
            return { chordIndex: i - 1, transitionProgress: 0.5 + 0.5 * p, buildProgress: 1 };
          }
          cursor += incomingHalfMs;
        }

        // 2) Parte estática (inclui build apenas no primeiro)
        if (i === 0) {
          const buildMs = Math.min(buildMsBase, staticMs);
          const holdMs = Math.max(0, staticMs - buildMs);

          if (buildMs > 0 && t < cursor + buildMs) {
            return { chordIndex: 0, transitionProgress: 0, buildProgress: (t - cursor) / buildMs };
          }
          cursor += buildMs;

          if (t < cursor + holdMs) {
            return { chordIndex: 0, transitionProgress: 0, buildProgress: 1 };
          }
          cursor += holdMs;
        } else {
          if (t < cursor + staticMs) {
            return { chordIndex: i, transitionProgress: 0, buildProgress: 1 };
          }
          cursor += staticMs;
        }

        // 3) Metade inicial da transição para o próximo (progress 0 -> 0.5), no fim do clip
        if (outgoingHalfMs > 0) {
          if (t < cursor + outgoingHalfMs) {
            const p = (t - cursor) / outgoingHalfMs;
            return { chordIndex: i, transitionProgress: 0.5 * p, buildProgress: 1 };
          }
          cursor += outgoingHalfMs;
        }
      }

      return { chordIndex: chords.length - 1, transitionProgress: 0, buildProgress: 1 };
    }

    // carousel
    for (let i = 0; i < chords.length; i++) {
      const segmentMs = Math.max(0, getSegmentDurationSec(chords[i]) * 1000);
      const incomingHalfMs = i > 0 ? Math.min(halfTransitionMsBase, segmentMs) : 0;
      const outgoingHalfMs = i < chords.length - 1 ? Math.min(halfTransitionMsBase, segmentMs) : 0;
      const staticMs = Math.max(0, segmentMs - incomingHalfMs - outgoingHalfMs);

      if (incomingHalfMs > 0) {
        if (t < cursor + incomingHalfMs) {
          const p = (t - cursor) / incomingHalfMs;
          return { chordIndex: i - 1, transitionProgress: 0.5 + 0.5 * p, buildProgress: 1 };
        }
        cursor += incomingHalfMs;
      }

      if (t < cursor + staticMs) {
        return { chordIndex: i, transitionProgress: 0, buildProgress: 1 };
      }
      cursor += staticMs;

      if (outgoingHalfMs > 0) {
        if (t < cursor + outgoingHalfMs) {
          const p = (t - cursor) / outgoingHalfMs;
          return { chordIndex: i, transitionProgress: 0.5 * p, buildProgress: 1 };
        }
        cursor += outgoingHalfMs;
      }
    }

    return { chordIndex: chords.length - 1, transitionProgress: 0, buildProgress: 1 };
  }, [animationType, buildDurationSec, buildEnabled, chords, getSegmentDurationSec, halfTransitionSec]);

  const prebufferFrames = useCallback(async (totalDurationMs: number, startTimeMs: number) => {
    const bufferMs = Math.max(0, prebufferMs);
    if (bufferMs <= 0) {
      frameCacheRef.current = null;
      return;
    }
    if (typeof createImageBitmap !== "function") {
      frameCacheRef.current = null;
      return;
    }

    const frameMs = 1000 / 30;
    const startFrameIndex = Math.floor(startTimeMs / frameMs);
    const framesToRender = Math.max(0, Math.min(
      Math.ceil(bufferMs / frameMs),
      Math.ceil(Math.max(0, totalDurationMs - startTimeMs) / frameMs)
    ));
    if (framesToRender <= 0) {
      frameCacheRef.current = null;
      return;
    }

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
    const off = offscreenCanvasRef.current;
    off.width = width;
    off.height = height;
    const offCtx = off.getContext("2d");
    if (!offCtx) {
      frameCacheRef.current = null;
      return;
    }

    if (!chordDrawerRef.current) {
      // Handle error or return if drawer not initialized
      return;
    }

    // Store original context and set to offCtx
    const originalChordDrawerCtx = chordDrawerRef.current.ctx;
    chordDrawerRef.current.setCtx(offCtx);

    const cache: { startFrameIndex: number; bitmaps: Array<ImageBitmap | null>; frameMs: number } = {
      startFrameIndex,
      bitmaps: new Array(framesToRender).fill(null),
      frameMs,
    };
    // Close any previous bitmaps if the cache is being re-generated
    if (frameCacheRef.current) {
      frameCacheRef.current.bitmaps.forEach(bitmap => bitmap?.close());
    }
    frameCacheRef.current = cache;

    for (let i = 0; i < framesToRender; i++) {
      const tMs = startTimeMs + i * frameMs;
      const state = computeStateAtTimeMs(tMs);
      if (!state) continue;

      const frameState: AnimationState = {
        ...animationStateRef.current,
        chordIndex: state.chordIndex,
        transitionProgress: Math.max(0, Math.min(1, state.transitionProgress)),
        buildProgress: Math.max(0, Math.min(1, state.buildProgress)),
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: 0,
        nameOpacity: 1,
      };

      drawFrame(frameState); // Call drawFrame without ctx
      cache.bitmaps[i] = await createImageBitmap(off);
    }

    // Restore original context
    chordDrawerRef.current.setCtx(originalChordDrawerCtx);
  }, [computeStateAtTimeMs, drawFrame, height, prebufferMs, width]);

  // Mantém duração total disponível mesmo fora do play (necessário para scrub)
  useEffect(() => {
    // Se a duração total mudar durante o play, o timeline passa a recalcular
    // tempo/pixels com outro denominador e a linha parece não-linear.
    // Então: travar a duração enquanto está tocando (exceto quando pausado).
    if (playheadAnimationRef.current && !isPaused) return;
    const totalMs = computeTotalPlaybackDurationMs();
    setPlaybackTotalDurationMs(totalMs);
  }, [computeTotalPlaybackDurationMs, isPaused, setPlaybackTotalDurationMs]);

  // Seek/Scrub: renderiza o frame correspondente ao progresso solicitado
  useEffect(() => {
    if (!chords || chords.length === 0) return;
    if (!playbackSeekNonce) return;

    const clampedProgress = Math.max(0, Math.min(1, playbackSeekProgress));
    const totalMs = computeTotalPlaybackDurationMs();
    const timeMs = clampedProgress * totalMs;

    // Se estiver tocando (RAF loop), só reposiciona o relógio e mantém tocando.
    if (playbackRafIdRef.current !== null && !isPaused) {
      playbackElapsedMsRef.current = timeMs;
      playbackStartPerfMsRef.current = performance.now() - timeMs;
    }

    // Pausar animações em andamento
    if (animationRef.current) animationRef.current.pause();
    if (playheadAnimationRef.current) playheadAnimationRef.current.pause();

    setIsAnimating(true);
    setIsPaused(true);
    setPlaybackIsPlaying(false);
    setPlaybackIsPaused(true);
    setPlaybackProgress(clampedProgress);

    if (onAnimationStateChange) onAnimationStateChange(true, true);

    const state = computeStateAtTimeMs(timeMs);
    if (!state) return;

    animationStateRef.current = {
      ...animationStateRef.current,
      chordIndex: state.chordIndex,
      transitionProgress: Math.max(0, Math.min(1, state.transitionProgress)),
      buildProgress: Math.max(0, Math.min(1, state.buildProgress)),
      fingerOpacity: 1,
      fingerScale: 1,
      cardY: 0,
      nameOpacity: 1,
    };

    drawAnimatedChord();
  }, [
    chords,
    computeStateAtTimeMs,
    computeTotalPlaybackDurationMs,
    onAnimationStateChange,
    playbackSeekNonce,
    playbackSeekProgress,
    setPlaybackIsPaused,
    setPlaybackIsPlaying,
    setPlaybackProgress,
  ]);

  // Move loadFFmpeg to be accessible by cancelRender
  const loadFFmpeg = useCallback(async () => {
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;
    
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setFFmpegLoaded(true);
      if (onFFmpegLoad) onFFmpegLoad();
      console.log("FFmpeg loaded successfully");
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
    }
  }, [onFFmpegLoad]);

  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);



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

      // Se tiver cache pré-render, usa o bitmap para desenhar rápido.
      const cache = frameCacheRef.current;
      if (cache && canvasRef.current) {
        const frameIndex = Math.floor(clampedElapsed / cache.frameMs);
        const offset = frameIndex - cache.startFrameIndex;
        const bitmap = offset >= 0 && offset < cache.bitmaps.length ? cache.bitmaps[offset] : null;
        if (bitmap) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) ctx.drawImage(bitmap, 0, 0);
        }
      }

      const state = computeStateAtTimeMs(clampedElapsed);
      if (state) {
        animationStateRef.current = {
          ...animationStateRef.current,
          chordIndex: state.chordIndex,
          transitionProgress: Math.max(0, Math.min(1, state.transitionProgress)),
          buildProgress: Math.max(0, Math.min(1, state.buildProgress)),
          fingerOpacity: 1,
          fingerScale: 1,
          cardY: 0,
          nameOpacity: 1,
        };
        // Se não desenhou via cache (ou cache vazio), desenha normal.
        const cache = frameCacheRef.current;
        if (!cache || cache.bitmaps.length === 0) {
          drawAnimatedChord();
        }
      }

      if (now - lastProgressEmitMsRef.current >= 50) {
        lastProgressEmitMsRef.current = now;
        setPlaybackProgress(totalDurationMs > 0 ? clampedElapsed / totalDurationMs : 0);
      }

      if (clampedElapsed >= totalDurationMs) {
        // Ao terminar, volta pro início da timeline.
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
  }, [computeStateAtTimeMs, drawAnimatedChord, onAnimationStateChange, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, stopPlayhead]);

  const startAnimation = () => {
    // Playback linear: usa o mesmo mapeamento de tempo do scrub.
    if (animationRef.current) animationRef.current.pause();
    if (playheadAnimationRef.current) {
      playheadAnimationRef.current.pause();
      playheadAnimationRef.current = null;
    }
    if (playbackRafIdRef.current !== null) {
      cancelAnimationFrame(playbackRafIdRef.current);
      playbackRafIdRef.current = null;
    }

    if (!chords || chords.length === 0) return;

    setIsAnimating(true);
    setIsPaused(false);
    if (onAnimationStateChange) onAnimationStateChange(true, false);

    const totalMs = computeTotalPlaybackDurationMs();
    startPlayhead(totalMs);

    // Pré-renderiza um buffer antes de começar (para ficar mais fluido).
    const sessionId = ++playbackSessionIdRef.current;
    (async () => {
      await prebufferFrames(totalMs, 0);
      if (playbackSessionIdRef.current !== sessionId) return;

      // Re-inicia o relógio para começar após o buffer
      playbackStartPerfMsRef.current = performance.now();
      playbackElapsedMsRef.current = 0;
      playheadStateRef.current.t = 0;
      lastProgressEmitMsRef.current = 0;

      // Frame 0
      const state0 = computeStateAtTimeMs(0);
      if (state0) {
        animationStateRef.current = {
          ...animationStateRef.current,
          chordIndex: state0.chordIndex,
          transitionProgress: Math.max(0, Math.min(1, state0.transitionProgress)),
          buildProgress: Math.max(0, Math.min(1, state0.buildProgress)),
          fingerOpacity: 1,
          fingerScale: 1,
          cardY: 0,
          nameOpacity: 1,
        };
        drawAnimatedChord();
      }

      startPlaybackRafLoop(totalMs);
    })();

    // obs: o loop começa após o prebuffer.
  };

  const pauseAnimation = () => {
    if (!isAnimating) return;
    if (animationRef.current) animationRef.current.pause();
    if (playheadAnimationRef.current) playheadAnimationRef.current.pause();
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

    if (animationRef.current) animationRef.current.play();
    if (playheadAnimationRef.current) playheadAnimationRef.current.play();

    setIsPaused(false);
    setPlaybackIsPaused(false);
    if (onAnimationStateChange) onAnimationStateChange(true, false);

    const totalMs = computeTotalPlaybackDurationMs();
    // Continua a partir do tempo atual
    playbackStartPerfMsRef.current = performance.now() - playbackElapsedMsRef.current;
    startPlaybackRafLoop(totalMs);
  };

  const handleRender = async () => {
    if (!chords || chords.length === 0 || !canvasRef.current || !ffmpegRef.current || !ffmpegLoaded) {
      console.error("Canvas, FFmpeg not ready or not loaded");
      return;
    }

    isRenderCancelledRef.current = false;
    setIsRendering(true);
    const canvas = canvasRef.current;
    const ffmpeg = ffmpegRef.current;
    const fps = 30;
    let frameCount = 0;

    const processFrame = async () => {
      if (isRenderCancelledRef.current) throw new Error("Render cancelled by user");
      await new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const frameData = await fetchFile(blob);
            await ffmpeg.writeFile(`frame${String(frameCount++).padStart(5, "0")}.png`, frameData);
          }
          resolve();
        }, "image/png");
      });
    };

    try {
      // Calculate total frames for progress
      let totalFrames = 0;
      chords.forEach(chord => {
        totalFrames += Math.ceil(getSegmentDurationSec(chord) * fps);
      });

      for (let chordIndex = 0; chordIndex < chords.length; chordIndex++) {
        if (isRenderCancelledRef.current) throw new Error("Render cancelled by user");
        const segmentDuration = getSegmentDurationSec(chords[chordIndex]);
        const incomingHalf = chordIndex > 0 ? halfTransitionSec : 0;
        const outgoingHalf = chordIndex < chords.length - 1 ? halfTransitionSec : 0;
        const staticDuration = Math.max(0, segmentDuration - incomingHalf - outgoingHalf);

        const processSegment = async (duration: number, getProgress: (p: number) => { chordIndex: number; transitionProgress: number; buildProgress: number; }) => {
          const frameCountForSegment = Math.ceil(fps * duration);
          for (let i = 0; i < frameCountForSegment; i++) {
            if (isRenderCancelledRef.current) throw new Error("Render cancelled by user");
            const p = duration > 0 ? i / frameCountForSegment : 1;
            animationStateRef.current = { fingerOpacity: 1, fingerScale: 1, cardY: 0, nameOpacity: 1, ...getProgress(p) };
            drawAnimatedChord();
            await processFrame();
            if (onRenderProgress) {
              const overallProgress = (frameCount / totalFrames) * 90; // Frame generation is 90% of the work
              onRenderProgress(Math.round(overallProgress * 100) / 100);
            }
          }
        };

        if (animationType === "static-fingers") {
          if (incomingHalf > 0) await processSegment(incomingHalf, p => ({ chordIndex: chordIndex - 1, transitionProgress: 0.5 + 0.5 * p, buildProgress: 1 }));
          
          const buildDuration = (buildEnabled && chordIndex === 0) ? Math.min(buildDurationSec, staticDuration) : 0;
          const holdDuration = chordIndex === 0 ? Math.max(0, staticDuration - buildDuration) : staticDuration;
          
          if (buildDuration > 0) await processSegment(buildDuration, p => ({ chordIndex, transitionProgress: 0, buildProgress: p }));
          if (holdDuration > 0) await processSegment(holdDuration, p => ({ chordIndex, transitionProgress: 0, buildProgress: 1 }));
          if (outgoingHalf > 0) await processSegment(outgoingHalf, p => ({ chordIndex, transitionProgress: 0.5 * p, buildProgress: 1 }));

        } else { // Carousel
          if (incomingHalf > 0) await processSegment(incomingHalf, p => ({ chordIndex: chordIndex - 1, transitionProgress: 0.5 + 0.5 * p, buildProgress: 1 }));
          if (staticDuration > 0) await processSegment(staticDuration, p => ({ chordIndex, transitionProgress: 0, buildProgress: 1 }));
          if (outgoingHalf > 0) await processSegment(outgoingHalf, p => ({ chordIndex, transitionProgress: 0.5 * p, buildProgress: 1 }));
        }
      }

      console.log(`Generated and wrote ${frameCount} frames`);
      if (isRenderCancelledRef.current) throw new Error("Render cancelled by user");
      
      // Signal that encoding is starting
      if (onRenderProgress) {
        onRenderProgress(95);
      }

      await ffmpeg.exec([
        "-framerate", String(fps),
        "-i", "frame%05d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-crf", "20",
        "output.mp4"
      ]);

      if (isRenderCancelledRef.current) throw new Error("Render cancelled by user");
      const data = await ffmpeg.readFile("output.mp4");
      const videoBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: "video/mp4" });

      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chords-animation-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("Video rendered successfully");
    } catch (error) {
      if ((error as Error).message.includes("cancelled")) {
        console.log("Render process was cancelled.");
      } else {
        console.error("Render failed:", error);
      }
    } finally {
      setIsRendering(false);
      if (onRenderProgress) onRenderProgress(0); // Reset progress
    }
  };

  const cancelRender = () => {
    isRenderCancelledRef.current = true;
    if (ffmpegRef.current) {
      // FFmpeg.terminate() is a more forceful way to stop
      // This is a workaround since the library doesn't have a clean abort signal for exec
      try {
        ffmpegRef.current.terminate();
        console.log("FFmpeg process terminated at user request.");
        // Reload a fresh FFmpeg instance for the next render
        loadFFmpeg();
      } catch (e) {
        console.error("Could not terminate FFmpeg:", e)
      }
    }
  };

  React.useImperativeHandle(ref, () => ({
    startAnimation,
    pauseAnimation,
    resumeAnimation,
    handleRender,
    cancelRender,
    isAnimating,
    isRendering,
    ffmpegLoaded,
    isPaused
  }));



  // Para renderização contínua durante a gravação
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        drawAnimatedChord();
      }, 1000 / 30); // 30 FPS

      return () => clearInterval(interval);
    }
  }, [isRecording, chords, colors, width, height]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full max-h-full"
        style={{
          aspectRatio: `${width} / ${height}`,
          imageRendering: "pixelated"
        }}
      />
    </div>
  );
});

VideoCanvasStage.displayName = "VideoCanvasStage";
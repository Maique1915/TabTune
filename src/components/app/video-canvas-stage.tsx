"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { animate, type JSAnimation } from "animejs";
import type { ChordWithTiming } from "@/lib/types";
import { useAppContext } from "@/app/context/app--context";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { drawStaticFingersAnimation } from "@/lib/static-fingers-drawer";
import { drawCarouselAnimation } from "@/lib/carousel-drawer";

export interface VideoCanvasStageRef {
  startAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  handleRender: () => Promise<void>;
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
    frameCacheRef.current = null;
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

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, state: AnimationState) => {
    if (!chords || chords.length === 0) return;

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
        ctx,
        currentChord: currentChordData.chord,
        nextChord: nextChordData ? nextChordData.chord : null,
        transitionProgress: state.transitionProgress,
        colors,
        dimensions: { width, height },
        buildProgress: state.buildProgress,
      });
    } else {
      drawCarouselAnimation({
        ctx,
        currentChord: currentChordData.chord,
        nextChord: nextChordData ? nextChordData.chord : null,
        transitionProgress: state.transitionProgress,
        colors,
        dimensions: { width, height },
      });
    }
  }, [animationType, chords, colors, height, width]);

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

    const cache: { startFrameIndex: number; bitmaps: Array<ImageBitmap | null>; frameMs: number } = {
      startFrameIndex,
      bitmaps: new Array(framesToRender).fill(null),
      frameMs,
    };
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

      drawFrame(offCtx, frameState);
      cache.bitmaps[i] = await createImageBitmap(off);
    }
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

  useEffect(() => {
    const loadFFmpeg = async () => {
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
    };

    loadFFmpeg();
  }, []);

  const drawAnimatedChord = () => {
    if (!canvasRef.current || !chords || chords.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawFrame(ctx, animationStateRef.current);

    // Capturar frame se estiver gravando
    if (isRecording && onFrameCapture) {
      const imageData = ctx.getImageData(0, 0, width, height);
      onFrameCapture(imageData);
    }
  };

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

    setIsRendering(true);
    const canvas = canvasRef.current;
    const ffmpeg = ffmpegRef.current;
    const fps = 30;

    try {
      const frames: Blob[] = [];

      for (let chordIndex = 0; chordIndex < chords.length; chordIndex++) {
        const segmentDuration = getSegmentDurationSec(chords[chordIndex]);
        const incomingHalf = chordIndex > 0 ? halfTransitionSec : 0;
        const outgoingHalf = chordIndex < chords.length - 1 ? halfTransitionSec : 0;
        const staticDuration = Math.max(0, segmentDuration - incomingHalf - outgoingHalf);

        if (animationType === "static-fingers") {
          // 1) incoming half (0.5 -> 1)
          if (incomingHalf > 0) {
            const framesIncoming = Math.ceil(fps * incomingHalf);
            for (let i = 0; i < framesIncoming; i++) {
              const p = i / framesIncoming;
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex: chordIndex - 1,
                transitionProgress: 0.5 + 0.5 * p,
                buildProgress: 1,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
            }
          }

          const buildDuration = (buildEnabled && chordIndex === 0) ? Math.min(buildDurationSec, staticDuration) : 0;
          const holdDuration = chordIndex === 0 ? Math.max(0, staticDuration - buildDuration) : staticDuration;

          if (buildDuration > 0) {
            const framesBuild = Math.max(1, Math.ceil(fps * buildDuration));
            for (let i = 0; i < framesBuild; i++) {
              const p = (i + 1) / framesBuild;
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex,
                transitionProgress: 0,
                buildProgress: p,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
            }
          }

          const framesHold = Math.ceil(fps * holdDuration);
          for (let i = 0; i < framesHold; i++) {
            animationStateRef.current = {
              fingerOpacity: 1,
              fingerScale: 1,
              cardY: 0,
              nameOpacity: 1,
              chordIndex,
              transitionProgress: 0,
              buildProgress: 1,
            };
            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
          }

          // 3) outgoing half (0 -> 0.5)
          if (outgoingHalf > 0) {
            const framesOutgoing = Math.ceil(fps * outgoingHalf);
            for (let i = 0; i < framesOutgoing; i++) {
              const p = i / framesOutgoing;
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex,
                transitionProgress: 0.5 * p,
                buildProgress: 1,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
            }
          }
        } else {
          if (incomingHalf > 0) {
            const framesIncoming = Math.ceil(fps * incomingHalf);
            for (let i = 0; i < framesIncoming; i++) {
              const p = i / framesIncoming;
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex: chordIndex - 1,
                transitionProgress: 0.5 + 0.5 * p,
                buildProgress: 1,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
            }
          }

          const framesHold = Math.ceil(fps * staticDuration);
          for (let i = 0; i < framesHold; i++) {
            animationStateRef.current = {
              fingerOpacity: 1,
              fingerScale: 1,
              cardY: 0,
              nameOpacity: 1,
              chordIndex,
              transitionProgress: 0,
              buildProgress: 1,
            };
            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
          }

          if (outgoingHalf > 0) {
            const framesOutgoing = Math.ceil(fps * outgoingHalf);
            for (let i = 0; i < framesOutgoing; i++) {
              const p = i / framesOutgoing;
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex,
                transitionProgress: 0.5 * p,
                buildProgress: 1,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
            }
          }
        }
      }

      console.log(`Generated ${frames.length} frames`);

      for (let i = 0; i < frames.length; i++) {
        const frameData = await fetchFile(frames[i]);
        await ffmpeg.writeFile(`frame${String(i).padStart(4, "0")}.png`, frameData);
      }

      await ffmpeg.exec([
        "-framerate", String(fps),
        "-i", "frame%04d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "slow",
        "-crf", "18",
        "output.mp4"
      ]);

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
      console.error("Render failed:", error);
    } finally {
      setIsRendering(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    startAnimation,
    pauseAnimation,
    resumeAnimation,
    handleRender,
    isAnimating,
    isRendering,
    ffmpegLoaded,
    isPaused
  }));

  useEffect(() => {
    if (chords && chords.length > 0 && !isRecording && !isAnimating) {
      // Para ambas animações, mostrar o último acorde adicionado no centro
      animationStateRef.current = {
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: 0,
        nameOpacity: 1,
        chordIndex: chords.length - 1,
        transitionProgress: 0,
        buildProgress: 1,
      };
      drawAnimatedChord();
    }
  }, [chords, isRecording, colors, height, width, animationType, isAnimating]);

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
    <div className="flex flex-col items-center justify-center w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full max-h-full"
        style={{
          width: "auto",
          height: "100%",
          imageRendering: "crisp-edges"
        }}
      />
    </div>
  );
});

VideoCanvasStage.displayName = "VideoCanvasStage";
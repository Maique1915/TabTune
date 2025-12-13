"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { animate, type JSAnimation } from "animejs";
import type { ChordWithTiming } from "@/lib/types";
import { useAppContext } from "@/app/context/app--context";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { drawChordOnCanvas } from "@/lib/chord-drawer";
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
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<JSAnimation | null>(null);
  const animationStateRef = useRef<AnimationState>({
    fingerOpacity: 0,
    fingerScale: 0.5,
    cardY: height,
    nameOpacity: 0,
    chordIndex: 0,
    transitionProgress: 0,
    buildProgress: 1,
  });
  const { colors, animationType } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [frames, setFrames] = useState<ImageData[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);

  // 🎬 FUNÇÃO HELPER: Retorna os timings de um ChordWithTiming em segundos
  const getChordTimingsInSeconds = useCallback((chordWithTiming: ChordWithTiming) => {
    const defaultHoldDuration = 2.0; // 2 segundos padrão
    const defaultTransitionDuration = animationType === "carousel" ? 1.0 : 0.8;
    const defaultPauseDuration = 0.5;

    // Converte a duração do TimelineClip (ms) para segundos.
    // Usaremos essa como holdDuration primária.
    const holdDuration = (chordWithTiming.duration / 1000) || defaultHoldDuration;

    return {
      holdDuration: holdDuration,
      transitionDuration: defaultTransitionDuration,
      pauseDuration: defaultPauseDuration
    };
  }, [animationType]);

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

    const state = animationStateRef.current;
    if (!chords || chords.length === 0) {
      ctx.fillStyle = colors.cardColor;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Para carousel: durante transição, currentChord é o que está saindo e nextChord é o que está entrando
    // Para static-fingers: currentChord é o índice atual
    let chordIndex: number;
    let currentChordData: ChordWithTiming;
    let nextChordData: ChordWithTiming | null;
    let previousChordData: ChordWithTiming | null = null;

    if (animationType === "carousel") {
      // No carousel, sempre usar o índice base (sem floor durante transição)
      chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
      currentChordData = chords[chordIndex];
      
      // Acorde anterior (sempre visível se existir)
      previousChordData = chordIndex > 0 ? chords[chordIndex - 1] : null;
      
      // Próximo acorde (sempre visível se existir)
      nextChordData = chordIndex < chords.length - 1 ? chords[chordIndex + 1] : null;
    } else {
      // Static fingers
      chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
      currentChordData = chords[chordIndex];
      const nextChordIndex = Math.min(chords.length - 1, chordIndex + 1);
      nextChordData = chordIndex < chords.length - 1 ? chords[nextChordIndex] : null;
    }

    if (!currentChordData) return;

    if (animationType === "static-fingers") {
      // Animação de dedos estáticos
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
      // Animação de carrossel horizontal
      drawCarouselAnimation({
        ctx,
        currentChord: currentChordData.chord,
        nextChord: nextChordData ? nextChordData.chord : null,
        previousChord: previousChordData ? previousChordData.chord : null,
        transitionProgress: state.transitionProgress,
        colors,
        dimensions: { width, height },
      });
    }

    // Capturar frame se estiver gravando
    if (isRecording && onFrameCapture) {
      const imageData = ctx.getImageData(0, 0, width, height);
      onFrameCapture(imageData);
    }
  };

  const startAnimation = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }

    if (!chords || chords.length === 0) return;

    setIsAnimating(true);
    setIsPaused(false);
    setCurrentChordIndex(0);
    if (onAnimationStateChange) onAnimationStateChange(true, false);

    if (animationType === "static-fingers") {
      let currentIndex = 0;

      // Estado inicial
      animationStateRef.current = {
        fingerOpacity: 0,
        fingerScale: 0,
        cardY: 0,
        nameOpacity: 0,
        chordIndex: 0,
        transitionProgress: 0,
        buildProgress: 0,
      };

      const animateNext = () => {
        if (currentIndex >= chords.length) { 
          setIsAnimating(false);
          setIsPaused(false);
          if (onAnimationStateChange) onAnimationStateChange(false, false);
          return;
        }

        const currentChordWithTiming = chords[currentIndex];
        const { holdDuration, transitionDuration, pauseDuration } = getChordTimingsInSeconds(currentChordWithTiming);

        setCurrentChordIndex(currentIndex);

        // Apenas o primeiro acorde tem build-in animation
        if (currentIndex === 0) {
          // Fase 1: Animação build-in (aparecimento do acorde)
          const buildDuration = 1.0; // 1 segundo para build-in
          animationRef.current = animate(animationStateRef.current, {
            chordIndex: currentIndex,
            buildProgress: 1,
            duration: buildDuration * 1000,
            easing: "easeOutCubic",
            onUpdate: () => drawAnimatedChord(),
            onComplete: () => {
              // Fase 2: Hold (acorde fica visível)
              animate(animationStateRef.current, {
                chordIndex: currentIndex,
                duration: Math.max(0, holdDuration - buildDuration) * 1000,
                easing: "linear",
                onUpdate: () => drawAnimatedChord(),
                onComplete: () => {
                  if (currentIndex >= chords.length - 1) {
                    setTimeout(() => {
                      setIsAnimating(false);
                      setIsPaused(false);
                      if (onAnimationStateChange) onAnimationStateChange(false, false);
                    }, 1000);
                    return;
                  }

                  // Fase 3: Transição para o próximo acorde
                  animate(animationStateRef.current, {
                    transitionProgress: 1,
                    duration: transitionDuration * 1000,
                    easing: "easeInOutQuad",
                    onUpdate: () => drawAnimatedChord(),
                    onComplete: () => {
                      currentIndex++;
                      animationStateRef.current.chordIndex = currentIndex;
                      animationStateRef.current.transitionProgress = 0;
                      animationStateRef.current.buildProgress = 1; // Já está construído
                      
                      setTimeout(() => {
                        animateNext();
                      }, pauseDuration * 1000); 
                    }
                  });
                }
              });
            }
          });
        } else {
          // Acordes subsequentes: hold + transição
          animationRef.current = animate(animationStateRef.current, {
            chordIndex: currentIndex,
            transitionProgress: 0,
            duration: holdDuration * 1000,
            easing: "linear",
            onUpdate: () => drawAnimatedChord(),
            onComplete: () => {
              if (currentIndex >= chords.length - 1) {
                setTimeout(() => {
                  setIsAnimating(false);
                  setIsPaused(false);
                  if (onAnimationStateChange) onAnimationStateChange(false, false);
                }, 1000);
                return;
              }

              // Transição para o próximo acorde
              animate(animationStateRef.current, {
                transitionProgress: 1,
                duration: transitionDuration * 1000,
                easing: "easeInOutQuad",
                onUpdate: () => drawAnimatedChord(),
                onComplete: () => {
                  currentIndex++;
                  animationStateRef.current.chordIndex = currentIndex;
                  animationStateRef.current.transitionProgress = 0;
                  
                  setTimeout(() => {
                    animateNext();
                  }, pauseDuration * 1000); 
                }
              });
            }
          });
        }
      };
      animateNext(); // Inicia o primeiro acorde
    } else {
      // Animação de carrossel horizontal
      let currentIndex = 0;

      // Estado inicial
      animationStateRef.current = {
        fingerOpacity: 0,
        fingerScale: 0,
        cardY: 0,
        nameOpacity: 0,
        chordIndex: 0,
        transitionProgress: 0,
      };

      const animateNext = () => {
        if (currentIndex >= chords.length) { 
          setIsAnimating(false);
          setIsPaused(false);
          if (onAnimationStateChange) onAnimationStateChange(false, false);
          return;
        }

        const currentChordWithTiming = chords[currentIndex];
        const { holdDuration, transitionDuration, pauseDuration } = getChordTimingsInSeconds(currentChordWithTiming);

        setCurrentChordIndex(currentIndex);

        // Animação do acorde atual (hold)
        animationRef.current = animate(animationStateRef.current, {
          chordIndex: currentIndex,
          duration: holdDuration * 1000, 
          easing: "linear", 
          onUpdate: () => drawAnimatedChord(),
          onComplete: () => {
            if (currentIndex >= chords.length - 1) {
              setTimeout(() => {
                setIsAnimating(false);
                setIsPaused(false);
                if (onAnimationStateChange) onAnimationStateChange(false, false);
              }, 1000);
              return;
            }

            animate(animationStateRef.current, {
              transitionProgress: 1,
              duration: transitionDuration * 1000,
              easing: "easeInOutCubic",
              onUpdate: () => drawAnimatedChord(),
              onComplete: () => {
                currentIndex++;
                animationStateRef.current.chordIndex = currentIndex;
                animationStateRef.current.transitionProgress = 0;
                
                setTimeout(() => {
                  animateNext();
                }, pauseDuration * 1000); 
              }
            });
          }
        });
      };
      animateNext(); // Inicia o primeiro acorde
    }
  };

  const pauseAnimation = () => {
    if (animationRef.current && isAnimating) {
      animationRef.current.pause();
      setIsPaused(true);
      if (onAnimationStateChange) onAnimationStateChange(true, true);
    }
  };

  const resumeAnimation = () => {
    if (animationRef.current && isPaused) {
      animationRef.current.play();
      setIsPaused(false);
      if (onAnimationStateChange) onAnimationStateChange(true, false);
    }
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

      if (animationType === "static-fingers") {
        let currentFrameChordIndex = 0;
        let accumulatedFrames = 0;

        while (currentFrameChordIndex < chords.length) {
          const currentChordWithTiming = chords[currentFrameChordIndex];
          const { holdDuration, transitionDuration, pauseDuration } = getChordTimingsInSeconds(currentChordWithTiming);

          // Hold do acorde atual
          const framesHold = Math.ceil(fps * holdDuration);
          for (let i = 0; i < framesHold; i++) {
            animationStateRef.current = {
              fingerOpacity: 1,
              fingerScale: 1,
              cardY: 0,
              nameOpacity: 1,
              chordIndex: currentFrameChordIndex,
              transitionProgress: 0,
            };
            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
            accumulatedFrames++;
          }

          // Se não for o último acorde, processa a transição e pausa
          if (currentFrameChordIndex < chords.length - 1) {
            const framesPerTransition = Math.ceil(fps * transitionDuration);
            for (let i = 0; i < framesPerTransition; i++) {
              const progress = i / framesPerTransition;
              const t = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
              
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex: currentFrameChordIndex,
                transitionProgress: t,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
              accumulatedFrames++;
            }

            const framesPause = Math.ceil(fps * pauseDuration);
            for (let i = 0; i < framesPause; i++) {
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex: currentFrameChordIndex + 1, // Já no próximo acorde
                transitionProgress: 0,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
              accumulatedFrames++;
            }
          }
          currentFrameChordIndex++;
        }
      } else { // Carrossel
        let currentFrameChordIndex = 0;
        let accumulatedFrames = 0;

        while (currentFrameChordIndex < chords.length) {
          const currentChordWithTiming = chords[currentFrameChordIndex];
          const { holdDuration, transitionDuration, pauseDuration } = getChordTimingsInSeconds(currentChordWithTiming);

          // Hold do acorde atual
          const framesHold = Math.ceil(fps * holdDuration);
          for (let i = 0; i < framesHold; i++) {
            animationStateRef.current = {
              fingerOpacity: 1,
              fingerScale: 1,
              cardY: 0,
              nameOpacity: 1,
              chordIndex: currentFrameChordIndex,
              transitionProgress: 0,
            };
            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
            accumulatedFrames++;
          }

          // Se não for o último acorde, processa a transição e pausa
          if (currentFrameChordIndex < chords.length - 1) {
            const framesPerTransition = Math.ceil(fps * transitionDuration);
            for (let i = 0; i < framesPerTransition; i++) {
              const progress = i / framesPerTransition;
              const t = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
              
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex: currentFrameChordIndex,
                transitionProgress: t,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
              accumulatedFrames++;
            }

            const framesPause = Math.ceil(fps * pauseDuration);
            for (let i = 0; i < framesPause; i++) {
              animationStateRef.current = {
                fingerOpacity: 1,
                fingerScale: 1,
                cardY: 0,
                nameOpacity: 1,
                chordIndex: currentFrameChordIndex + 1, // Já no próximo acorde
                transitionProgress: 0,
              };
              drawAnimatedChord();
              await new Promise<void>((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) frames.push(blob);
                  resolve();
                }, "image/png");
              });
              accumulatedFrames++;
            }
          }
          currentFrameChordIndex++;
        }
      }

      console.log(`Generated ${frames.length} frames`);

      // Write frames to FFmpeg virtual filesystem
      for (let i = 0; i < frames.length; i++) {
        const frameData = await fetchFile(frames[i]);
        await ffmpeg.writeFile(`frame${String(i).padStart(4, "0")}.png`, frameData);
      }

      // Convert frames to MP4
      await ffmpeg.exec([
        "-framerate", String(fps),
        "-i", "frame%04d.png",
        "-c:v", "libx64",
        "-pix_fmt", "yuv420p",
        "-preset", "slow",
        "-crf", "18",
        "output.mp4"
      ]);

      // Read output file
      const data = await ffmpeg.readFile("output.mp4");
      const videoBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: "video/mp4" });

      // Download video
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
  }, [chords, isRecording, colors, height, width, animationType, drawAnimatedChord, isAnimating]);
  

  // Para renderização contínua durante a gravação
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        drawAnimatedChord();
      }, 1000 / 30); // 30 FPS

      return () => clearInterval(interval);
    }
  }, [isRecording, chords, colors, width, height, drawAnimatedChord]);

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
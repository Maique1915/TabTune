"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, type JSAnimation } from "animejs";
import type { ChordDiagramProps } from "@/lib/types";
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
  chords: ChordDiagramProps[];
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
}

export const VideoCanvasStage = React.forwardRef<VideoCanvasStageRef, VideoCanvasStageProps>(({ 
  chords, 
  width = 1920, 
  height = 1080,
  onFrameCapture,
  isRecording = false,
  onFFmpegLoad,
  onAnimationStateChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<JSAnimation | null>(null);
  const animationStateRef = useRef<AnimationState>({
    fingerOpacity: 0,
    fingerScale: 0.5,
    cardY: height,
    nameOpacity: 0,
    chordIndex: 0,
    transitionProgress: 0
  });
  const { colors, animationType } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [frames, setFrames] = useState<ImageData[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);

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

    // Garante que o índice do acorde é válido
    const chordIndex = Math.max(0, Math.min(chords.length - 1, Math.floor(state.chordIndex)));
    const currentChord = chords[chordIndex];
    if (!currentChord) return;

    const nextChordIndex = Math.min(chords.length - 1, chordIndex + 1);
    const nextChord = chordIndex < chords.length - 1 ? chords[nextChordIndex] : null;

    if (animationType === "static-fingers") {
      // Animação de dedos estáticos
      drawStaticFingersAnimation({
        ctx,
        currentChord,
        nextChord,
        transitionProgress: state.transitionProgress,
        colors,
        dimensions: { width, height },
      });
    } else {
      // Animação de carrossel horizontal
      drawCarouselAnimation({
        ctx,
        currentChord,
        nextChord,
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
      // Animação de dedos estáticos
      let currentIndex = 0;

      // Estado inicial: primeiro acorde já visível
      animationStateRef.current = {
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: 0,
        nameOpacity: 1,
        chordIndex: 0,
        transitionProgress: 0
      };
      drawAnimatedChord();

      const animateNext = () => {
        if (currentIndex >= chords.length - 1) {
          // Pausar no último acorde por 1 segundo
          setTimeout(() => {
            setIsAnimating(false);
            setIsPaused(false);
            if (onAnimationStateChange) onAnimationStateChange(false, false);
          }, 1000);
          return;
        }

        setCurrentChordIndex(currentIndex);

        // Transição para o próximo acorde
        animationRef.current = animate(animationStateRef.current, {
          chordIndex: currentIndex,
          transitionProgress: 1,
          duration: 1000,
          easing: "easeInOutQuad",
          onUpdate: () => drawAnimatedChord(),
          onComplete: () => {
            // Reset transição e ir para o próximo
            currentIndex++;
            animationStateRef.current.chordIndex = currentIndex;
            animationStateRef.current.transitionProgress = 0;
            
            // Pausar 500ms antes da próxima transição
            setTimeout(() => {
              animateNext();
            }, 500);
          }
        });
      };

      // Pausar 1 segundo no primeiro acorde antes de começar
      setTimeout(() => {
        animateNext();
      }, 1000);
    } else {
      // Animação de carrossel horizontal
      let currentIndex = 0;

      // Estado inicial: primeiro acorde já no centro
      animationStateRef.current = {
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: 0,
        nameOpacity: 1,
        chordIndex: 0,
        transitionProgress: 0
      };
      drawAnimatedChord();

      const animateNext = () => {
        if (currentIndex >= chords.length - 1) {
          // Pausar no último acorde por 1 segundo
          setTimeout(() => {
            setIsAnimating(false);
            setIsPaused(false);
            if (onAnimationStateChange) onAnimationStateChange(false, false);
          }, 1000);
          return;
        }

        setCurrentChordIndex(currentIndex);

        // Slide para o próximo acorde (da direita para o centro)
        animationRef.current = animate(animationStateRef.current, {
          chordIndex: currentIndex,
          transitionProgress: 1,
          duration: 800,
          easing: "easeInOutCubic",
          onUpdate: () => drawAnimatedChord(),
          onComplete: () => {
            // Reset transição e ir para o próximo
            currentIndex++;
            animationStateRef.current.chordIndex = currentIndex;
            animationStateRef.current.transitionProgress = 0;
            
            // Pausar 500ms antes da próxima transição
            setTimeout(() => {
              animateNext();
            }, 500);
          }
        });
      };

      // Pausar 1 segundo no primeiro acorde antes de começar
      setTimeout(() => {
        animateNext();
      }, 1000);
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
        // Renderização para animação de dedos estáticos
        const holdDuration = 1.0; // 1s no primeiro acorde
        const transitionDuration = 1.0; // 1s para transição
        const pauseDuration = 0.5; // 0.5s entre transições
        const finalHoldDuration = 1.0; // 1s no último acorde
        
        const framesFirstHold = Math.ceil(fps * holdDuration);
        const framesPerTransition = Math.ceil(fps * transitionDuration);
        const framesPause = Math.ceil(fps * pauseDuration);
        const framesFinalHold = Math.ceil(fps * finalHoldDuration);
        
        const totalFrames = framesFirstHold + 
                           (chords.length - 1) * (framesPerTransition + framesPause) +
                           framesFinalHold;

        let frameCount = 0;

        // Primeiro acorde (hold)
        animationStateRef.current = {
          fingerOpacity: 1,
          fingerScale: 1,
          cardY: 0,
          nameOpacity: 1,
          chordIndex: 0,
          transitionProgress: 0
        };

        for (let i = 0; i < framesFirstHold; i++) {
          drawAnimatedChord();
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) frames.push(blob);
              resolve();
            }, "image/png");
          });
          frameCount++;
        }

        // Transições entre acordes
        for (let chordIndex = 0; chordIndex < chords.length - 1; chordIndex++) {
          // Animação de transição
          for (let i = 0; i < framesPerTransition; i++) {
            const progress = i / framesPerTransition;
            // Easing suave
            const t = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            animationStateRef.current = {
              fingerOpacity: 1,
              fingerScale: 1,
              cardY: 0,
              nameOpacity: 1,
              chordIndex,
              transitionProgress: t
            };

            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
            frameCount++;
          }

          // Pausa no próximo acorde
          animationStateRef.current = {
            fingerOpacity: 1,
            fingerScale: 1,
            cardY: 0,
            nameOpacity: 1,
            chordIndex: chordIndex + 1,
            transitionProgress: 0
          };

          for (let i = 0; i < framesPause; i++) {
            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
            frameCount++;
          }
        }

        // Hold final no último acorde
        for (let i = 0; i < framesFinalHold; i++) {
          drawAnimatedChord();
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) frames.push(blob);
              resolve();
            }, "image/png");
          });
          frameCount++;
        }
      } else {
        // Renderização para animação de carrossel horizontal
        const holdDuration = 1.0; // 1s no primeiro acorde
        const transitionDuration = 0.8; // 0.8s para transição
        const pauseDuration = 0.5; // 0.5s entre transições
        const finalHoldDuration = 1.0; // 1s no último acorde
        
        const framesFirstHold = Math.ceil(fps * holdDuration);
        const framesPerTransition = Math.ceil(fps * transitionDuration);
        const framesPause = Math.ceil(fps * pauseDuration);
        const framesFinalHold = Math.ceil(fps * finalHoldDuration);
        
        let frameCount = 0;

        // Primeiro acorde (hold)
        animationStateRef.current = {
          fingerOpacity: 1,
          fingerScale: 1,
          cardY: 0,
          nameOpacity: 1,
          chordIndex: 0,
          transitionProgress: 0
        };

        for (let i = 0; i < framesFirstHold; i++) {
          drawAnimatedChord();
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) frames.push(blob);
              resolve();
            }, "image/png");
          });
          frameCount++;
        }

        // Transições entre acordes
        for (let chordIndex = 0; chordIndex < chords.length - 1; chordIndex++) {
          // Animação de transição
          for (let i = 0; i < framesPerTransition; i++) {
            const progress = i / framesPerTransition;
            // Easing cubic
            const t = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            animationStateRef.current = {
              fingerOpacity: 1,
              fingerScale: 1,
              cardY: 0,
              nameOpacity: 1,
              chordIndex,
              transitionProgress: t
            };

            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
            frameCount++;
          }

          // Pausa no próximo acorde
          animationStateRef.current = {
            fingerOpacity: 1,
            fingerScale: 1,
            cardY: 0,
            nameOpacity: 1,
            chordIndex: chordIndex + 1,
            transitionProgress: 0
          };

          for (let i = 0; i < framesPause; i++) {
            drawAnimatedChord();
            await new Promise<void>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) frames.push(blob);
                resolve();
              }, "image/png");
            });
            frameCount++;
          }
        }

        // Hold final no último acorde
        for (let i = 0; i < framesFinalHold; i++) {
          drawAnimatedChord();
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) frames.push(blob);
              resolve();
            }, "image/png");
          });
          frameCount++;
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
        "-c:v", "libx264",
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
    if (chords && chords.length > 0 && !isRecording) {
      // Para ambas animações, mostrar o último acorde adicionado no centro
      animationStateRef.current = {
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: 0,
        nameOpacity: 1,
        chordIndex: chords.length - 1,
        transitionProgress: 0
      };
      drawAnimatedChord();
    }
  }, [chords, isRecording, colors, height, width, animationType]);

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

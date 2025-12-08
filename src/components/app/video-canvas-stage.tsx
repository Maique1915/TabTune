"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, type JSAnimation } from "animejs";
import type { ChordDiagramProps } from "@/lib/types";
import { getNome } from "@/lib/chords";
import { useAppContext } from "@/app/context/app--context";
import { Button } from "@/components/ui/button";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

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
  const { colors } = useAppContext();
  const stringNames = ["E", "A", "D", "G", "B", "e"];
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
    const currentChord = chords[Math.floor(state.chordIndex)];
    if (!currentChord) return;
    
    const chordName = getNome(currentChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

    // Limpar canvas
    ctx.fillStyle = colors.cardColor;
    ctx.fillRect(0, 0, width, height);

    // Dimensões do cartão do acorde
    const cardWidth = 260;
    const cardHeight = 360;
    const cardX = (width - cardWidth) / 2;
    const cardY = state.cardY;

    // Desenhar cartão do acorde com fade-in
    ctx.globalAlpha = Math.min(1, state.nameOpacity + 0.3);
    ctx.fillStyle = colors.cardColor;
    ctx.strokeStyle = colors.borderColor;
    ctx.lineWidth = 2;
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    ctx.globalAlpha = 1;

    // Desenhar nome do acorde
    ctx.globalAlpha = state.nameOpacity;
    ctx.fillStyle = colors.textColor;
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(chordName, width / 2, cardY + 40);
    ctx.globalAlpha = 1;

    // Configurações do diagrama
    const diagramX = cardX + 30;
    const diagramY = cardY + 70;
    const diagramWidth = cardWidth - 60;
    const diagramHeight = 200;
    const numStrings = 6;
    const numFrets = 5;
    const stringSpacing = diagramWidth / (numStrings - 1);
    const fretSpacing = diagramHeight / numFrets;

    // Desenhar cordas (verticais)
    ctx.strokeStyle = colors.borderColor;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < numStrings; i++) {
      const x = diagramX + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(x, diagramY);
      ctx.lineTo(x, diagramY + diagramHeight);
      ctx.stroke();
    }

    // Desenhar trastes (horizontais)
    for (let i = 0; i <= numFrets; i++) {
      const y = diagramY + i * fretSpacing;
      ctx.lineWidth = i === 0 ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(diagramX, y);
      ctx.lineTo(diagramX + diagramWidth, y);
      ctx.stroke();
    }

    // Desenhar pestana (barre)
    if (currentChord.barre && currentChord.barre[0] > 0) {
      const fretY = diagramY + (currentChord.barre[0] - 0.5) * fretSpacing;
      const fromX = diagramX + currentChord.barre[1] * stringSpacing;
      const toX = diagramX + (5 - currentChord.barre[1]) * stringSpacing;
      
      ctx.globalAlpha = state.fingerOpacity;
      ctx.strokeStyle = colors.fingerColor;
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(fromX, fretY);
      ctx.lineTo(toX, fretY);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.lineCap = "butt";
      ctx.globalAlpha = 1;
    }

    // Desenhar posições dos dedos com animação
    ctx.globalAlpha = state.fingerOpacity;
    ctx.fillStyle = colors.fingerColor;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(state.fingerScale, state.fingerScale);
    ctx.translate(-width / 2, -height / 2);
    
    Object.entries(currentChord.positions).forEach(([key, [fret]]) => {
      const stringIndex = Number(key) - 1;
      if (fret > 0) {
        const x = diagramX + stringIndex * stringSpacing;
        const y = diagramY + (fret - 0.5) * fretSpacing;
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.restore();
    ctx.globalAlpha = 1;

    // Desenhar X e O no topo
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    Object.entries(currentChord.positions).forEach(([key, [fret]]) => {
      const stringIndex = Number(key) - 1;
      const stringNumber = Number(key);
      const x = diagramX + stringIndex * stringSpacing;
      const y = diagramY - 15;
      
      if (currentChord.avoid?.includes(stringNumber)) {
        ctx.fillStyle = colors.textColor;
        ctx.globalAlpha = state.nameOpacity;
        ctx.fillText("✕", x, y);
        ctx.globalAlpha = 1;
      } else if (fret === 0) {
        ctx.strokeStyle = colors.textColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = state.nameOpacity;
        ctx.beginPath();
        ctx.arc(x, y - 5, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Desenhar número do traste (nut)
    if (currentChord.nut?.pos && currentChord.nut.pos > 1) {
      ctx.fillStyle = colors.textColor;
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.globalAlpha = state.nameOpacity;
      ctx.fillText(`${currentChord.nut.pos}fr`, diagramX - 10, diagramY + fretSpacing / 2);
      ctx.globalAlpha = 1;
    }

    // Desenhar nomes das cordas
    ctx.fillStyle = colors.textColor;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.globalAlpha = state.nameOpacity;
    stringNames.forEach((name, i) => {
      const x = diagramX + i * stringSpacing;
      ctx.fillText(name, x, diagramY + diagramHeight + 25);
    });
    ctx.globalAlpha = 1;

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

    // Duração total: 2s por acorde (1.5s animação + 0.5s hold)
    const animationsPerChord = chords.length;
    const timeline: any[] = [];

    chords.forEach((_, index) => {
      const startTime = index * 2000;
      
      // Reset para cada acorde
      timeline.push({
        targets: animationStateRef.current,
        chordIndex: index,
        fingerOpacity: 0,
        fingerScale: 0.5,
        cardY: height,
        nameOpacity: 0,
        transitionProgress: 0,
        duration: 0,
        delay: startTime,
        onUpdate: () => {
          setCurrentChordIndex(index);
          drawAnimatedChord();
        }
      });

      // Animação de entrada
      timeline.push({
        targets: animationStateRef.current,
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: (height - 360) / 2,
        nameOpacity: 1,
        transitionProgress: 1,
        duration: 1500,
        delay: startTime,
        easing: "outElastic(1, 0.6)",
        onUpdate: () => drawAnimatedChord()
      });
    });

    // Reset animation state
    animationStateRef.current = {
      fingerOpacity: 0,
      fingerScale: 0.5,
      cardY: height,
      nameOpacity: 0,
      chordIndex: 0,
      transitionProgress: 0
    };

    // Executar todas as animações em sequência
    let currentIndex = 0;
    const animateNext = () => {
      if (currentIndex >= chords.length) {
        setIsAnimating(false);
        setIsPaused(false);
        if (onAnimationStateChange) onAnimationStateChange(false, false);
        return;
      }

      // Reset para o próximo acorde
      animationStateRef.current = {
        fingerOpacity: 0,
        fingerScale: 0.5,
        cardY: height,
        nameOpacity: 0,
        chordIndex: currentIndex,
        transitionProgress: 0
      };

      setCurrentChordIndex(currentIndex);

      animationRef.current = animate(animationStateRef.current, {
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: (height - 360) / 2,
        nameOpacity: 1,
        transitionProgress: 1,
        duration: 1500,
        easing: "outElastic(1, 0.6)",
        onUpdate: () => drawAnimatedChord(),
        onComplete: () => {
          // Aguardar 500ms antes do próximo acorde
          setTimeout(() => {
            currentIndex++;
            animateNext();
          }, 500);
        }
      });
    };

    animateNext();
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
    const durationPerChord = 2.0; // 2s por acorde (1.5s animação + 0.5s hold)
    const totalDuration = chords.length * durationPerChord;
    const totalFrames = Math.ceil(fps * totalDuration);

    try {
      // Reset animation state
      animationStateRef.current = {
        fingerOpacity: 0,
        fingerScale: 0.5,
        cardY: height,
        nameOpacity: 0,
        chordIndex: 0,
        transitionProgress: 0
      };

      // Generate all frames
      const frames: Blob[] = [];
      for (let i = 0; i < totalFrames; i++) {
        const timeInSeconds = i / fps;
        const chordIndex = Math.floor(timeInSeconds / durationPerChord);
        const timeInChord = timeInSeconds % durationPerChord;
        const animationDuration = 1.5;
        
        if (chordIndex >= chords.length) break;

        const progress = Math.min(timeInChord / animationDuration, 1);
        
        // Easing function
        const easing = (t: number) => {
          const c4 = (2 * Math.PI) / 3;
          return t === 0
            ? 0
            : t === 1
            ? 1
            : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        };
        
        const t = easing(progress);

        // Update animation state manually
        animationStateRef.current = {
          fingerOpacity: t,
          fingerScale: 0.5 + (0.5 * t),
          cardY: height - (height - (height - 360) / 2) * t,
          nameOpacity: t,
          chordIndex,
          transitionProgress: t
        };

        // Draw frame
        drawAnimatedChord();

        // Capture frame as blob
        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) frames.push(blob);
            resolve();
          }, "image/png");
        });
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
      // Desenhar primeiro frame imediatamente
      animationStateRef.current = {
        fingerOpacity: 1,
        fingerScale: 1,
        cardY: (height - 360) / 2,
        nameOpacity: 1,
        chordIndex: 0,
        transitionProgress: 1
      };
      drawAnimatedChord();
    }
  }, [chords, isRecording]);

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

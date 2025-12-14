
"use client";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  ZoomIn,
  Maximize,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/context/app--context";
import { ChordDiagram } from "./chord-diagram";
import { VideoCanvasStage, type VideoCanvasStageRef } from "./video-canvas-stage";
import { useEffect, useRef, useState } from "react";

export function MainStage() {
  const {
    selectedChords,
    playbackTransitionsEnabled,
    setPlaybackTransitionsEnabled,
    playbackBuildEnabled,
    setPlaybackBuildEnabled,
  } = useAppContext();
  const currentChord = selectedChords[selectedChords.length - 1];
  const hasValidChord = currentChord && currentChord.chord && currentChord.chord.positions && typeof currentChord.chord.positions === 'object';
  const [showVideoCanvas, setShowVideoCanvas] = useState(true);
  const videoCanvasRef = useRef<VideoCanvasStageRef>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Transições/build reativados.
  // (Sem UI de toggle ainda; mantém tudo sincronizado via contexto.)
  useEffect(() => {
    setPlaybackTransitionsEnabled(true);
    setPlaybackBuildEnabled(true);
  }, [setPlaybackBuildEnabled, setPlaybackTransitionsEnabled]);

  const handleAnimate = () => {
    if (videoCanvasRef.current) {
      videoCanvasRef.current.startAnimation();
      setIsAnimating(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (videoCanvasRef.current) {
      videoCanvasRef.current.pauseAnimation();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (videoCanvasRef.current) {
      videoCanvasRef.current.resumeAnimation();
      setIsPaused(false);
    }
  };

  const handleRenderVideo = async () => {
    if (videoCanvasRef.current && selectedChords.length > 0) {
      setIsRendering(true);
      await videoCanvasRef.current.handleRender();
      setIsRendering(false);
    }
  };

  return (
    <div className="flex flex-col bg-toolbar p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <SkipBack />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground hover:bg-primary/50 hover:text-primary-foreground"
            onClick={isPaused ? handleResume : handleAnimate}
            disabled={!hasValidChord || (isAnimating && !isPaused)}
          >
            <Play />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground hover:bg-primary/50 hover:text-primary-foreground"
            onClick={handlePause}
            disabled={!hasValidChord || !isAnimating || isPaused}
          >
            <Pause />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <SkipForward />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <RotateCcw />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <ZoomIn />
          </Button>
          <span>100%</span>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <Maximize />
          </Button>
          <div className="h-8 w-px bg-border mx-2" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground hover:bg-red-600 hover:text-white"
            onClick={() => setShowVideoCanvas(!showVideoCanvas)}
            disabled={!hasValidChord}
            title={showVideoCanvas ? "Voltar para prévia" : "Modo de vídeo"}
          >
            <Video />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap px-4"
            onClick={handleRenderVideo}
            disabled={selectedChords.length === 0 || !ffmpegLoaded || isRendering}
            title={selectedChords.length === 0 ? "Selecione acordes primeiro" : "Renderizar vídeo MP4"}
          >
            {!ffmpegLoaded 
              ? "Carregando FFmpeg..."
              : isRendering 
              ? "Renderizando..." 
              : "Renderizar MP4"}
          </Button>
        </div>
      </div>
      <div className="bg-black rounded-lg flex items-center justify-center p-4 overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {selectedChords.length > 0 ? (
          <VideoCanvasStage 
            ref={videoCanvasRef} 
            chords={selectedChords}
            transitionsEnabled={playbackTransitionsEnabled}
            buildEnabled={playbackBuildEnabled}
            onFFmpegLoad={() => setFFmpegLoaded(true)}
            onAnimationStateChange={(animating, paused) => {
              setIsAnimating(animating);
              setIsPaused(paused);
            }}
          />
        ) : (
          <p className="text-muted-foreground">Select a chord from the library to get started</p>
        )}
      </div>
    </div>
  );
}

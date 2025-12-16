
"use client";

import { useRef, useState, useEffect } from "react";
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { TimelinePanel } from "./timeline-panel";
import { SettingsPanel } from "./settings-panel";
import { useAppContext } from "@/app/context/app--context";
import type { VideoCanvasStageRef } from "./video-canvas-stage";

export function HomePage() {
  const {
    isRendering,
    setIsRendering,
    setRenderProgress,
    renderCancelRequested,
    setRenderCancelRequested,
  } = useAppContext();

  const videoCanvasRef = useRef<VideoCanvasStageRef>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (renderCancelRequested) {
      if (videoCanvasRef.current) {
        videoCanvasRef.current.cancelRender();
      }
      setIsRendering(false);
      setRenderProgress(0);
      setRenderCancelRequested(false);
    }
  }, [renderCancelRequested, setIsRendering, setRenderProgress, setRenderCancelRequested]);

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
    if (videoCanvasRef.current) {
      setIsRendering(true);
      setRenderProgress(0);
      
      await videoCanvasRef.current.handleRender();
      
      if (!renderCancelRequested) {
        setRenderProgress(100);
        setTimeout(() => {
          setIsRendering(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <LibraryPanel />
        <main className="flex flex-1 flex-col overflow-hidden" style={{ display: 'grid', gridTemplateRows: '60% 40%' }}>
          <MainStage 
            ref={videoCanvasRef}
            onFFmpegLoad={() => setFFmpegLoaded(true)}
            onAnimationStateChange={(animating, paused) => {
              setIsAnimating(animating);
              setIsPaused(paused);
            }}
          />
          <TimelinePanel 
            isAnimating={isAnimating}
            isPaused={isPaused}
            ffmpegLoaded={ffmpegLoaded}
            handleAnimate={handleAnimate}
            handlePause={handlePause}
            handleResume={handleResume}
            handleRenderVideo={handleRenderVideo}
          />
        </main>
        <SettingsPanel />
      </div>
    </div>
  );
}

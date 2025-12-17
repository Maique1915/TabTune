"use client";

import { useRef, useState, useEffect } from "react";
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { TimelinePanel } from "./timeline-panel";
import { SettingsPanel } from "./settings-panel";
import { AppHeader } from "./app-header";
import { MobileNav } from "./mobile-nav";
import { useAppContext } from "@/app/context/app--context";
import { useIsMobile } from "@/hooks/use-mobile";
import type { VideoCanvasStageRef } from "./video-canvas-stage";
import { cn } from "@/lib/utils";

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
  
  const isMobile = useIsMobile();
  const [mobilePanel, setMobilePanel] = useState<'studio' | 'library' | 'settings'>('studio');

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

  const handlePanelChange = (panel: 'studio' | 'library' | 'settings') => {
    if (panel === 'studio') {
      setMobilePanel('studio');
    } else {
      setMobilePanel(panel);
    }
  };

  const mainContent = (
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
  );

  if (isMobile) {
    return (
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <AppHeader onSettingsClick={() => handlePanelChange('settings')} />
        <div className="flex-1 overflow-hidden">
          {mobilePanel === 'studio' && mainContent}
        </div>
        <MobileNav activePanel={mobilePanel} onPanelChange={handlePanelChange} />
        
        <LibraryPanel
          isMobile={true}
          isOpen={mobilePanel === 'library'}
          onClose={() => setMobilePanel('studio')}
        />
        <SettingsPanel
          isMobile={true}
          isOpen={mobilePanel === 'settings'}
          onClose={() => setMobilePanel('studio')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <LibraryPanel isMobile={false} />
        {mainContent}
        <SettingsPanel isMobile={false} />
      </div>
    </div>
  );
}
"use client";

import { useRef, useState, useEffect } from "react";
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { TimelinePanel } from "./timeline-panel";
import { SettingsPanel } from "./settings-panel";
import { AppHeader } from "./app-header";
import { MobileNav } from "./mobile-nav";
import { RenderingProgressCard } from "./rendering-progress-card";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isMobile = useIsMobile();
  const [mobilePanel, setMobilePanel] = useState<'studio' | 'library' | 'settings'>('studio');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

      try {
        await videoCanvasRef.current.handleRender();
        if (!renderCancelRequested) {
          setRenderProgress(100);
        }
      } catch (error) {
        console.error("An error occurred during video rendering:", error);
        // Reset progress, but keep the card visible for a moment to show the error state if any
        setRenderProgress(0);
      } finally {
        if (!renderCancelRequested) {
          setTimeout(() => {
            setIsRendering(false);
            setRenderProgress(0); // Final reset
          }, 2000); // Keep card visible for 2s after completion/error
        } else {
          // If cancelled, hide immediately
          setIsRendering(false);
          setRenderProgress(0);
          setRenderCancelRequested(false);
        }
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
        onAnimationStateChange={(animating, paused) => {
          setIsAnimating(animating);
          setIsPaused(paused);
        }}
      />
      <TimelinePanel
        isAnimating={isAnimating}
        isPaused={isPaused}
        ffmpegLoaded={true}
        handleAnimate={handleAnimate}
        handlePause={handlePause}
        handleResume={handleResume}
        handleRenderVideo={handleRenderVideo}
      />
    </main>
  );

  if (!hasMounted) {
    return (
      <div className="flex h-screen w-full flex-col bg-background text-foreground animate-pulse">
        <div className="h-16 border-b border-border bg-muted/20" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading Studio...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <AppHeader onSettingsClick={() => handlePanelChange('settings')} />
        <RenderingProgressCard />        <div className="flex-1 overflow-hidden">
          <div className={cn("h-full", { "hidden": mobilePanel !== 'studio' })}>
            {mainContent}
          </div>
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
      <RenderingProgressCard />
      <div className="flex flex-1 overflow-hidden">
        <LibraryPanel isMobile={false} />
        {mainContent}
        <SettingsPanel isMobile={false} />
      </div>
    </div>
  );
}
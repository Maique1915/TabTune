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
import { cn } from "@/shared/lib/utils";
import { TimelineControls } from "./timeline/TimelineControls";
import { generateClipId } from "@/lib/timeline/utils";

export function HomePage() {
  const {
    isRendering,
    setIsRendering,
    setRenderProgress,
    renderCancelRequested,
    setRenderCancelRequested,
    timelineState,
    setTimelineState,
    playbackTotalDurationMs,
  } = useAppContext();

  const videoCanvasRef = useRef<VideoCanvasStageRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isMobile = useIsMobile();
  const [mobilePanel, setMobilePanel] = useState<'studio' | 'library' | 'settings'>('studio');
  const [hasMounted, setHasMounted] = useState(false);
  const [audioUploaded, setAudioUploaded] = useState(false);

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

  const handleAudioUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) return;
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer as ArrayBuffer);
        const rawData = audioBuffer.getChannelData(0);
        const samples = 100;
        const blockSize = Math.floor(rawData.length / samples);
        const waveform = Array(samples).fill(0).map((_, i) => {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j] || 0);
          }
          return sum / blockSize;
        });
        const durationMs = Math.floor(audioBuffer.duration * 1000);
        const audioClip = {
          id: generateClipId(),
          type: 'audio' as const,
          fileName: file.name,
          audioUrl: URL.createObjectURL(file),
          start: 0,
          duration: durationMs,
          waveform,
        };
        setTimelineState(prev => {
          let audioTrackIndex = prev.tracks.findIndex(t => t.type === 'audio');
          let newTracks = [...prev.tracks];
          if (audioTrackIndex === -1) {
            const newAudioTrack = {
              id: generateClipId(),
              name: 'Áudio',
              type: 'audio' as const,
              clips: [audioClip],
            };
            const chordIndex = prev.tracks.findIndex(t => t.type === 'chord');
            if (chordIndex !== -1) {
              newTracks.splice(chordIndex + 1, 0, newAudioTrack);
            } else {
              newTracks.push(newAudioTrack);
            }
          } else {
            newTracks = newTracks.map((t, idx) =>
              idx === audioTrackIndex
                ? { ...t, clips: [...t.clips, audioClip] }
                : t
            );
          }
          return {
            ...prev,
            tracks: newTracks,
          };
        });
        setAudioUploaded(true);
      } catch (err) {
        alert('Erro ao processar áudio.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleResetPlayback = () => {
    if (videoCanvasRef.current) {
      videoCanvasRef.current.cancelRender();
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
    <main className="flex flex-1 flex-col overflow-hidden min-w-0 bg-black/20" style={{ display: 'grid', gridTemplateRows: '65% 35%' }}>
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* Floating Controls Bar */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex items-center justify-between p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl">
          <TimelineControls
            isAnimating={isAnimating}
            isPaused={isPaused}
            ffmpegLoaded={true}
            handleAnimate={handleAnimate}
            handlePause={handlePause}
            handleResume={handleResume}
            handleRenderVideo={handleRenderVideo}
            isTimelineEmpty={timelineState.tracks.every(t => t.clips.length === 0)}
            onAudioUpload={handleAudioUpload}
            audioUploaded={audioUploaded}
            onResetPlayback={handleResetPlayback}
          />
        </div>

        <MainStage
          ref={videoCanvasRef}
          onAnimationStateChange={(animating, paused) => {
            setIsAnimating(animating);
            setIsPaused(paused);
          }}
        />
      </div>
      <div className="w-full h-full min-w-0 overflow-hidden relative border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <TimelinePanel
          isAnimating={isAnimating}
          isPaused={isPaused}
          ffmpegLoaded={true}
          handleAnimate={handleAnimate}
          handlePause={handlePause}
          handleResume={handleResume}
          handleRenderVideo={handleRenderVideo}
          isTimelineEmpty={false}
        />
      </div>
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
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-[#1a0b2e] via-[#0f0518] to-black text-foreground relative overflow-hidden">
      {/* Retro Grid Background Overlay (Optional subtle effect) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,6px_100%] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <RenderingProgressCard />
        <LibraryPanel isMobile={false} />
        {mainContent}
        <SettingsPanel isMobile={false} />
      </div>
    </div>
  );
}
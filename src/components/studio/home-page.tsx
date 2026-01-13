"use client";

import { useRef, useState, useEffect } from "react";
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { StudioTimeline } from "./StudioTimeline";
import { SettingsPanel } from "./SettingsPanel";
import { AppHeader } from "./app-header";
import { MobileNav, NavItem } from "@/components/shared/MobileNav";
import { MobileHeader } from "@/components/shared/MobileHeader";
import { Music2, Library, Settings } from "lucide-react";
import { RenderingProgressCard } from "./rendering-progress-card";
import { useAppContext } from "@/app/context/app--context";
import { useIsMobile } from "@/hooks/use-mobile";
import type { VideoCanvasStageRef } from "./video-canvas-stage";
import { VideoCanvasStage } from "./video-canvas-stage";
import { cn } from "@/shared/lib/utils";
import { TimelineControls } from "./timeline/TimelineControls";
import { generateClipId } from "@/modules/studio/application/utils";
import { WorkspaceLayout } from "@/components/shared/WorkspaceLayout";
import { EditorGrid } from "@/components/shared/EditorGrid";
import { StageContainer } from "@/components/shared/StageContainer";

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
    selectedChords,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
  } = useAppContext();

  const videoCanvasRef = useRef<VideoCanvasStageRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isMobile = useIsMobile();
  const [activePanel, setActivePanel] = useState<'studio' | 'library' | 'mixer' | 'customize'>('studio');
  const [hasMounted, setHasMounted] = useState(false);
  const [audioUploaded, setAudioUploaded] = useState(false);

  const studioNavItems: NavItem[] = [
    { id: "studio", icon: Music2, label: "Studio" },
    { id: "library", icon: Library, label: "Library" },
    { id: "customize", icon: Settings, label: "Settings" }
  ];

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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const activeElement = document.activeElement;
        const isInput = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).isContentEditable
        );

        if (!isInput) {
          e.preventDefault();
          if (!isAnimating) {
            handleAnimate();
          } else if (isPaused) {
            handleResume();
          } else {
            handlePause();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating, isPaused, handleAnimate, handleResume, handlePause]);

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

  const handlePanelChange = (panel: 'studio' | 'library' | 'mixer' | 'customize') => {
    setActivePanel(panel);
  };

  const handleAddClick = () => {
    // TODO: Implement add functionality
    console.log('Add clicked');
  };

  const floatingControls = (
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

  return (
    <WorkspaceLayout
      isMobile={isMobile}
      header={<AppHeader />}
      mobileHeader={<MobileHeader title="TabTune" showBack={true} />}
      mobileBottomNav={
        <MobileNav
          items={studioNavItems}
          activePanel={activePanel}
          onPanelChange={handlePanelChange}
        />
      }
      leftSidebar={<LibraryPanel isMobile={isMobile} isOpen={activePanel === 'library'} onClose={() => setActivePanel('studio')} />}
      rightSidebar={<SettingsPanel isMobile={isMobile} isOpen={activePanel === 'customize'} onClose={() => setActivePanel('studio')} />}
    >
      {isMobile ? (
        <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
          <div className="absolute w-full h-full max-w-sm bg-primary-mobile/10 blur-[60px] rounded-full pointer-events-none" />

          <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
            <div className="flex-1 relative flex items-center justify-center mb-4">
              <StageContainer title="Studio Canvas">
                <VideoCanvasStage
                  ref={videoCanvasRef}
                  chords={selectedChords}
                  timelineState={timelineState}
                  transitionsEnabled={playbackTransitionsEnabled}
                  buildEnabled={playbackBuildEnabled}
                  onAnimationStateChange={(animating: boolean, paused: boolean) => {
                    setIsAnimating(animating);
                    setIsPaused(paused);
                  }}
                  onRenderProgress={setRenderProgress}
                />
              </StageContainer>
            </div>

            {/* Mobile Controls */}
            <div className="mb-4 px-2">
              {floatingControls}
            </div>

            <div className="h-64 overflow-hidden border-t border-white/10">
              <StudioTimeline
                isAnimating={isAnimating}
                isPaused={isPaused}
                ffmpegLoaded={true}
                handleAnimate={handleAnimate}
                handlePause={handlePause}
                handleResume={handleResume}
                handleRenderVideo={handleRenderVideo}
                isTimelineEmpty={timelineState.tracks.every(t => t.clips.length === 0)}
              />
            </div>
          </div>
        </div>
      ) : (
        <EditorGrid
          topSection={
            <StageContainer title="Studio Canvas" statusLabel="Live Feed">
              <MainStage
                ref={videoCanvasRef}
                onAnimationStateChange={(animating, paused) => {
                  setIsAnimating(animating);
                  setIsPaused(paused);
                }}
              />
            </StageContainer>
          }
          bottomSection={
            <StudioTimeline
              isAnimating={isAnimating}
              isPaused={isPaused}
              ffmpegLoaded={true}
              handleAnimate={handleAnimate}
              handlePause={handlePause}
              handleResume={handleResume}
              handleRenderVideo={handleRenderVideo}
              isTimelineEmpty={timelineState.tracks.every(t => t.clips.length === 0)}
            />
          }
          floatingControls={floatingControls}
        />
      )}
      <RenderingProgressCard />
    </WorkspaceLayout>
  );
}
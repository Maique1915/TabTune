"use client";

import React from "react";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { Pause, Play, StopCircle, Video } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface TimelineControlsProps {
  isAnimating: boolean;
  isPaused: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
  isTimelineEmpty: boolean;
  ffmpegLoaded?: boolean;
  onAudioUpload?: () => void;
  audioUploaded?: boolean;
  onResetPlayback?: () => void;
  currentTime?: number;
  totalDuration?: number;
}

export function TimelineControls({
  isAnimating,
  isPaused,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo,
  isTimelineEmpty,
  ffmpegLoaded = true,
  onResetPlayback,
  currentTime = 0,
  totalDuration = 0
}: TimelineControlsProps) {
  const { isRendering } = useAppContext();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-panel-dark/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(7,182,213,0.15)]">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!isAnimating) handleAnimate();
          else if (isPaused) handleResume();
          else handlePause();
        }}
        className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center text-background-dark hover:scale-105 transition-transform p-0 border-none shadow-none", {
          "opacity-50 cursor-not-allowed": isTimelineEmpty
        })}
        disabled={isTimelineEmpty || isRendering}
      >
        {isAnimating && !isPaused ?
          <span className="material-symbols-outlined text-[20px] fill text-black leading-none">pause</span> :
          <span className="material-symbols-outlined text-[20px] fill text-black leading-none">play_arrow</span>
        }
      </Button>

      {/* Time Display */}
      <div className="flex items-center gap-1.5 px-2">
        <span className="text-[11px] font-mono font-bold text-cyan-400 tabular-nums tracking-tight">
          {formatTime(currentTime)}
        </span>
        <span className="text-[10px] font-mono text-white/30">/</span>
        <span className="text-[11px] font-mono font-medium text-white/50 tabular-nums tracking-tight">
          {formatTime(totalDuration)}
        </span>
      </div>

      <div className="h-4 w-px bg-white/10"></div>

      <Button
        onClick={handleRenderVideo}
        className={cn(
          "bg-primary hover:bg-primary/80 px-4 py-1.5 rounded-lg text-[10px] font-bold text-white shadow-[0_0_15px_rgba(7,182,213,0.2)] flex items-center gap-1.5 h-auto transition-all uppercase tracking-wide",
          {
            "cursor-not-allowed opacity-50": isTimelineEmpty || isRendering || !ffmpegLoaded,
          }
        )}
        disabled={isTimelineEmpty || isRendering || !ffmpegLoaded}
      >
        <span className="material-symbols-outlined text-sm leading-none">movie</span>
        Render
      </Button>
    </div>
  );
}

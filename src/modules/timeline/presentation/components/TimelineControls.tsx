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
  onResetPlayback
}: TimelineControlsProps) {
  const { isRendering } = useAppContext();

  return (
    <div className="flex items-center gap-1 bg-[#09090b] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!isAnimating) handleAnimate();
          else if (isPaused) handleResume();
          else handlePause();
        }}
        className={cn("w-10 h-10 rounded-xl transition-all duration-300", {
          "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]": !isAnimating || isPaused,
          "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400": isAnimating && !isPaused,
          "cursor-not-allowed opacity-50": isTimelineEmpty,
        })}
        disabled={isTimelineEmpty || isRendering}
      >
        {isAnimating && !isPaused ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-0.5" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onResetPlayback}
        className={cn("w-10 h-10 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all", {
          "cursor-not-allowed opacity-50": !isAnimating && !isPaused,
        })}
        disabled={(!isAnimating && !isPaused) || isRendering}
      >
        <StopCircle className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRenderVideo}
        className={cn(
          "w-10 h-10 rounded-xl text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all",
          {
            "cursor-not-allowed opacity-50": isTimelineEmpty || isRendering || !ffmpegLoaded,
          }
        )}
        disabled={isTimelineEmpty || isRendering || !ffmpegLoaded}
      >
        <Video className="w-5 h-5" />
      </Button>
    </div>
  );
}

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
  onAudioUpload?: () => void; // Not used but keeping the signature
  audioUploaded?: boolean; // Not used but keeping the signature
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
    <div className="flex items-center space-x-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/50 shadow-inner">
      <Button
        variant="ghost"
        size="icon"
        onClick={isAnimating && !isPaused ? handlePause : handleResume}
        className={cn("w-9 h-9 text-zinc-400 hover:text-white", {
          "cursor-not-allowed opacity-50": isTimelineEmpty,
        })}
        disabled={isTimelineEmpty || isRendering}
      >
        {isAnimating && !isPaused ? <Pause /> : <Play />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onResetPlayback}
        className={cn("w-9 h-9 text-zinc-400 hover:text-white", {
          "cursor-not-allowed opacity-50": !isAnimating && !isPaused,
        })}
        disabled={(!isAnimating && !isPaused) || isRendering}
      >
        <StopCircle />
      </Button>

      <div className="h-full w-px bg-zinc-800/50" />

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRenderVideo}
        className={cn(
          "w-9 h-9 text-cyan-400 hover:text-cyan-200 border border-transparent hover:border-cyan-500/30",
          {
            "cursor-not-allowed opacity-50": isTimelineEmpty || isRendering || !ffmpegLoaded,
          }
        )}
        disabled={isTimelineEmpty || isRendering || !ffmpegLoaded}
      >
        <Video />
      </Button>
    </div>
  );
}
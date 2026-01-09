"use client";

import React, { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Music, Check } from "lucide-react";
import { useAppContext } from "@/app/context/app--context";
import { UnifiedControls } from "@/components/shared/UnifiedControls";

interface TimelineControlsProps {
  isAnimating: boolean;
  isPaused: boolean;
  ffmpegLoaded: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
  isTimelineEmpty: boolean;
  onAudioUpload: (file: File) => void;
  audioUploaded: boolean;
  onResetPlayback?: () => void;
}

export function TimelineControls({
  isAnimating,
  isPaused,
  ffmpegLoaded,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo,
  isTimelineEmpty,
  onAudioUpload,
  audioUploaded,
  onResetPlayback
}: TimelineControlsProps) {
  const { isRendering } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const leftExtra = (
    <>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            onAudioUpload(file);
          }
        }}
        disabled={audioUploaded}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5 rounded-xl transition-all"
        onClick={() => fileInputRef.current?.click()}
        disabled={audioUploaded}
        title={audioUploaded ? "Audio uploaded" : "Upload audio"}
      >
        {audioUploaded ? <Check className="w-4 h-4 text-green-500" /> : <Music className="w-4 h-4" />}
      </Button>
    </>
  );

  return (
    <UnifiedControls
      isPlaying={isAnimating}
      isPaused={isPaused}
      onPlayPause={() => {
        if (isAnimating && !isPaused) {
          handlePause();
        } else {
          isPaused ? handleResume() : handleAnimate();
        }
      }}
      onSkipBack={onResetPlayback}
      onReset={onResetPlayback}
      isRendering={isRendering}
      onRender={handleRenderVideo}
      leftExtra={leftExtra}
      isTimelineEmpty={isTimelineEmpty}
    />
  );
}
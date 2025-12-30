"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Play, Pause, Film, Music, Upload, Check, SkipBack, RotateCcw } from "lucide-react";
import { useAppContext } from "@/app/context/app--context";

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

  return (
    <div className="w-full flex items-center justify-between px-6 py-2">
      {/* Left: Play/Pause and Transport */}
      <div className="flex items-center gap-4">
        <Button
          className={`
            relative overflow-hidden transition-all duration-300
            font-black text-xs uppercase tracking-widest rounded-xl
            h-10 px-8 flex items-center gap-3
            ${isAnimating && !isPaused
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-600'
              : 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400'
            }
          `}
          onClick={() => {
            if (isAnimating && !isPaused) {
              handlePause();
            } else {
              isPaused ? handleResume() : handleAnimate();
            }
          }}
          disabled={isTimelineEmpty}
        >
          {isAnimating && !isPaused ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>STOP</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY</span>
            </>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5 rounded-xl transition-all"
            onClick={() => onResetPlayback?.()}
            title="Back to Start"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5 rounded-xl transition-all"
            onClick={() => onResetPlayback?.()}
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-white/10 mx-2" />

        {/* Audio upload */}
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
      </div>

      {/* Right: Render */}
      <div className="flex items-center gap-3">
        <Button
          className={`
            h-10 px-6 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 border
            ${isRendering
              ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
              : 'bg-white/5 text-slate-300 border-white/5 hover:border-cyan-500/50 hover:text-white hover:bg-white/10'
            }
          `}
          onClick={handleRenderVideo}
          disabled={isTimelineEmpty || !ffmpegLoaded || isRendering}
        >
          {isRendering ? (
            <>
              <Film className="w-4 h-4 animate-pulse" />
              <span>Recording...</span>
            </>
          ) : (
            <>
              <Film className="w-4 h-4" />
              <span>Export Video</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
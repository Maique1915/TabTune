"use client";

import { useAppContext } from "@/app/context/app--context";
import { VideoCanvasStage, type VideoCanvasStageRef } from "./video-canvas-stage";
import React, { forwardRef, useState } from 'react';
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainStageProps {
  onAnimationStateChange: (isAnimating: boolean, isPaused: boolean) => void;
}

export const VisualEditor = forwardRef<VideoCanvasStageRef, MainStageProps>(({ onAnimationStateChange }, ref) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const isMobile = useIsMobile();
  const {
    selectedChords,
    timelineState,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    setRenderProgress,
  } = useAppContext();

  return (
    <section className={`flex-1 relative flex items-center justify-center bg-transparent overflow-hidden ${isMobile ? 'p-1' : 'p-6'
      }`}>
      {/* CRT Monitor Frame */}
      <div className={`relative w-full aspect-video bg-[#0a0a0a] overflow-hidden group ${isMobile
          ? 'rounded-2xl border-2 border-[#333] shadow-[0_0_0_1px_#111,0_0_20px_rgba(0,0,0,0.5)]'
          : 'max-w-[800px] rounded-3xl border-4 border-[#333] shadow-[0_0_0_2px_#111,0_0_40px_rgba(0,0,0,0.5),0_0_100px_rgba(6,182,212,0.1)]'
        }`}>

        {/* Screen Bezel/Inner Shadow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/5" />

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,3px_100%]" />

        {/* Subtle Screen Curved Reflection */}
        <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 rounded-2xl" />

        <div className="w-full h-full relative z-10 flex items-center justify-center bg-[#050505]">
          <div className="relative w-full h-full flex items-center justify-center">
            <VideoCanvasStage
              ref={ref}
              chords={selectedChords}
              timelineState={timelineState}
              transitionsEnabled={playbackTransitionsEnabled}
              buildEnabled={playbackBuildEnabled}
              onAnimationStateChange={onAnimationStateChange}
              onRenderProgress={setRenderProgress}
            // onVideoReady prop removed as it's not supported by VideoCanvasStage yet
            />
          </div>
          {/* Loading Overlay - manually managed or removed if invalid */}
          {!isVideoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20 pointer-events-none opacity-0">
              {/* Hidden for now since we don't have the callback */}
            </div>
          )}
          <p className="absolute bottom-4 text-cyan-500/30 font-mono text-[10px] uppercase tracking-widest pointer-events-none">Signal: Active</p>
        </div>
      </div>

      {/* Decorative localized glow under the monitor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-cyan-500/10 blur-[100px] pointer-events-none" />
    </section>
  );
});

MainStage.displayName = "MainStage";
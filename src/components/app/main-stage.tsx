"use client";

import { useAppContext } from "@/app/context/app--context";
import { VideoCanvasStage, type VideoCanvasStageRef } from "./video-canvas-stage";
import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";

interface MainStageProps {
  onFFmpegLoad: () => void;
  onAnimationStateChange: (isAnimating: boolean, isPaused: boolean) => void;
}

export const MainStage = forwardRef<VideoCanvasStageRef, MainStageProps>((props, ref) => {
  const {
    selectedChords,
    timelineState,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    setRenderProgress,
  } = useAppContext();

  const isTimelineEmpty = timelineState.tracks.every(track => track.clips.length === 0);

  return (
    <div className="flex flex-col bg-toolbar p-4 overflow-hidden">
      <div className="bg-black rounded-lg flex items-center justify-center p-4 overflow-hidden" style={{ height: '100%' }}>
        <div className={cn("w-full h-full", { "hidden": isTimelineEmpty })}>
          <VideoCanvasStage
            ref={ref}
            chords={selectedChords}
            transitionsEnabled={playbackTransitionsEnabled}
            buildEnabled={playbackBuildEnabled}
            onFFmpegLoad={props.onFFmpegLoad}
            onAnimationStateChange={props.onAnimationStateChange}
            onRenderProgress={setRenderProgress}
          />
        </div>
        <div className={cn({ "hidden": !isTimelineEmpty })}>
          <p className="text-muted-foreground">Select a chord from the library to get started</p>
        </div>
      </div>
    </div>
  );
});

MainStage.displayName = "MainStage";
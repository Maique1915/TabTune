import { useAppContext } from "@/app/context/app--context";
import { VideoCanvasStage, type VideoCanvasStageRef } from "./video-canvas-stage";
import React, { forwardRef } from 'react';


interface MainStageProps {
  onAnimationStateChange: (isAnimating: boolean, isPaused: boolean) => void;
}

export const MainStage = forwardRef<VideoCanvasStageRef, MainStageProps>(({ onAnimationStateChange }, ref) => {
  const {
    selectedChords,
    timelineState,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    setRenderProgress,
  } = useAppContext();

  return (
    <VideoCanvasStage
      ref={ref}
      chords={selectedChords}
      timelineState={timelineState}
      transitionsEnabled={playbackTransitionsEnabled}
      buildEnabled={playbackBuildEnabled}
      onAnimationStateChange={onAnimationStateChange}
      onRenderProgress={setRenderProgress}
    />
  );
});

MainStage.displayName = "MainStage";
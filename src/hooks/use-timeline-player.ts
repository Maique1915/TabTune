import { useRef, useEffect, useCallback, useState } from "react";
import type { TimelineState } from "@/lib/timeline/types";
import type { VideoCanvasStageRef } from "@/components/app/video-canvas-stage";
import { TimelineAudio, TimelineChord, LoopContext, TimelineClipInstance } from "@/lib/timeline/clips";
import type { ChordDiagramColors, AnimationType } from "@/app/context/app--context";
import type { ChordWithTiming } from "@/lib/types";

interface UseTimelinePlayerProps {
  audioContext: AudioContext | null;
  setPlaybackProgress: (progress: number) => void;
  setPlaybackIsPlaying: (isPlaying: boolean) => void;
  setPlaybackIsPaused: (isPaused: boolean) => void;
  isGlobalAudioPlaying: boolean;
  playbackTotalDurationMs: number;
  videoCanvasStageRef: React.RefObject<VideoCanvasStageRef>;
  timelineState: TimelineState;
  colors: ChordDiagramColors; // Nova prop
  animationType: AnimationType; // Nova prop
  transitionsEnabled: boolean; // Nova prop
  buildEnabled: boolean; // Nova prop
  getSegmentDurationSec: (chord: ChordWithTiming) => number; // Nova prop
}

export const useTimelinePlayer = ({
  audioContext,
  setPlaybackProgress,
  setPlaybackIsPlaying,
  setPlaybackIsPaused,
  isGlobalAudioPlaying,
  playbackTotalDurationMs,
  videoCanvasStageRef,
  timelineState,
  colors, // Desestruturar
  animationType, // Desestruturar
  transitionsEnabled, // Desestruturar
  buildEnabled, // Desestruturar
  getSegmentDurationSec, // Desestruturar
}: UseTimelinePlayerProps) => {
  const animationFrameId = useRef<number | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const lastElapsedMsRef = useRef<number>(0);
  const currentAudioClipRef = useRef<TimelineAudio | null>(null);

  const lastSetProgress = useRef<number>(0);
  const PROGRESS_UPDATE_THRESHOLD = 0.0001;

  const stopAllAudioClips = useCallback(() => {
    timelineState.tracks.forEach(track => {
      track.clips.forEach(clip => {
        if (clip.type === 'audio') {
          (clip as TimelineAudio).stop();
        }
      });
    });
    currentAudioClipRef.current = null;
  }, [timelineState.tracks]);

  const stopGlobalAudio = useCallback(() => {
    stopAllAudioClips();
    playbackStartTimeRef.current = 0;
    lastElapsedMsRef.current = 0;
    setPlaybackIsPlaying(false);
    setPlaybackIsPaused(true);
    setPlaybackProgress(0);
    if (videoCanvasStageRef && videoCanvasStageRef.current) {
      // videoCanvasStageRef.current.renderAtTime(0);
    }
  }, [setPlaybackIsPlaying, setPlaybackIsPaused, setPlaybackProgress, stopAllAudioClips, videoCanvasStageRef]);

  const pauseGlobalAudio = useCallback(() => {
    setPlaybackIsPlaying(false);
    setPlaybackIsPaused(true);
    if (currentAudioClipRef.current) {
      currentAudioClipRef.current.pause();
      lastElapsedMsRef.current = currentAudioClipRef.current.currentOffsetMs + currentAudioClipRef.current.start;
    }
  }, [setPlaybackIsPlaying, setPlaybackIsPaused]);

  // loadGlobalAudio agora é uma função 'no-op' pois os clips carregam individualmente
  const loadGlobalAudio = useCallback(async (audioUrl: string) => {
    // No-op, pois cada TimelineAudio instance agora gerencia seu próprio carregamento
  }, []);

  const playGlobalAudio = useCallback((startTimeMs?: number) => {
    setPlaybackIsPlaying(true);
    setPlaybackIsPaused(false);

    playbackStartTimeRef.current = performance.now() - lastElapsedMsRef.current;
    
    if (startTimeMs !== undefined) {
        lastElapsedMsRef.current = startTimeMs;
        playbackStartTimeRef.current = performance.now() - startTimeMs;
    }
  }, [setPlaybackIsPlaying, setPlaybackIsPaused]);

  const seekGlobalAudio = useCallback((progress: number) => {
    const newTimeMs = progress * playbackTotalDurationMs;
    lastElapsedMsRef.current = newTimeMs;

    setPlaybackProgress(progress);
    
    if (videoCanvasStageRef && videoCanvasStageRef.current) {
      videoCanvasStageRef.current.renderAtTime(newTimeMs);
    }

    stopAllAudioClips();
    if (isGlobalAudioPlaying) {
        playbackStartTimeRef.current = performance.now() - newTimeMs;
    }
  }, [isGlobalAudioPlaying, playbackTotalDurationMs, setPlaybackProgress, stopAllAudioClips, videoCanvasStageRef]);

  useEffect(() => {
    const clips = timelineState.tracks.flatMap(track => track.clips);

    const tick = (currentTime: DOMHighResTimeStamp) => {
      if (!isGlobalAudioPlaying) {
          cancelAnimationFrame(animationFrameId.current!);
          animationFrameId.current = null;
          return;
      }

      const elapsedSinceStart = currentTime - playbackStartTimeRef.current;
      let currentPlaybackTimeMs = Math.max(0, elapsedSinceStart);
      lastElapsedMsRef.current = currentPlaybackTimeMs;

      currentPlaybackTimeMs = Math.min(currentPlaybackTimeMs, playbackTotalDurationMs);

      const currentProgress = playbackTotalDurationMs > 0 ? currentPlaybackTimeMs / playbackTotalDurationMs : 0;

      if (Math.abs(currentProgress - lastSetProgress.current) > PROGRESS_UPDATE_THRESHOLD) {
        setPlaybackProgress(currentProgress);
        lastSetProgress.current = currentProgress;
      }

      const loopContext: LoopContext = {
        videoCanvasStageRef: videoCanvasStageRef,
        colors: colors,
        animationType: animationType,
        transitionsEnabled: transitionsEnabled,
        buildEnabled: buildEnabled,
        getSegmentDurationSec: getSegmentDurationSec,
        currentTimeMs: currentPlaybackTimeMs,
        totalTimelineDurationMs: playbackTotalDurationMs,
        isPlaying: isGlobalAudioPlaying,
      };

      clips.forEach(clip => {
        clip.update(loopContext);
        if (clip.type === 'audio' && (clip as TimelineAudio).isPlaying) {
            currentAudioClipRef.current = clip as TimelineAudio;
        }
      });
      
      if (videoCanvasStageRef && videoCanvasStageRef.current) {
        videoCanvasStageRef.current.renderAtTime(currentPlaybackTimeMs);
      }

      if (currentPlaybackTimeMs >= playbackTotalDurationMs) {
        stopGlobalAudio();
        return;
      }

      animationFrameId.current = requestAnimationFrame(tick);
    };

    if (isGlobalAudioPlaying) {
      animationFrameId.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      if (videoCanvasStageRef && videoCanvasStageRef.current) {
        videoCanvasStageRef.current.renderAtTime(lastElapsedMsRef.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      stopAllAudioClips();
    };
  }, [
    isGlobalAudioPlaying,
    playbackTotalDurationMs,
    setPlaybackProgress,
    stopGlobalAudio,
    stopAllAudioClips,
    timelineState.tracks,
    videoCanvasStageRef,
    colors, // Dependência adicionada
    animationType, // Dependência adicionada
    transitionsEnabled, // Dependência adicionada
    buildEnabled, // Dependência adicionada
    getSegmentDurationSec, // Dependência adicionada
  ]);

  // Cleanup do AudioContext no unmount (gerenciado pelo AppProvider)
  useEffect(() => {
    return () => {
      // O AudioContext é fechado no AppProvider, não aqui.
    };
  }, []);

  return {
    isGlobalAudioPlaying,
    globalAudioDurationMs: currentAudioClipRef.current?.duration || 0,
    globalAudioFileUrl: currentAudioClipRef.current?.audioUrl || null,
    loadGlobalAudio,
    playGlobalAudio,
    pauseGlobalAudio,
    stopGlobalAudio,
    seekGlobalAudio,
  };
};
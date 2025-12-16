// src/lib/timeline/hooks.ts
import { useMemo } from "react";
import type { TimelineTrack } from "./types";
import { calculateMaxTrackEndTime } from "./utils";
import { MIN_TIMELINE_DURATION_MS } from "./constants";

interface UseTimelineCalculationsProps {
  tracks: TimelineTrack[];
  playbackTotalDurationMs: number;
}

export const useTimelineCalculations = ({ tracks, playbackTotalDurationMs }: UseTimelineCalculationsProps) => {
  const totalDuration = useMemo(() => {
    const maxTrackEndTime = calculateMaxTrackEndTime(tracks);
    // A duração total é o dobro da duração máxima dos clipes,
    // ou a duração total do playback (do áudio), o que for maior,
    // garantindo um mínimo para a timeline.
    return Math.max(maxTrackEndTime * 2, playbackTotalDurationMs, MIN_TIMELINE_DURATION_MS);
  }, [tracks, playbackTotalDurationMs]);

  return { totalDuration };
};
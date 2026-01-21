/**
 * 🔌 Timeline Adapter
 * Converte TimelineState → ChordTiming[] para o VideoCanvasStage
 */

import type { TimelineState } from "../domain/types";
// TODO: Replace this with the correct import if ChordTiming is exported elsewhere
export type ChordTiming = {
  holdDuration: number;
  transitionDuration: number;
  pauseDuration: number;
};

/**
 * Converte o estado da timeline para array de timings
 * que o VideoCanvasStage entende
 */
export function timelineToChordTimings(
  timeline: TimelineState,
  transitionDuration: number = 0.8,
  pauseDuration: number = 0.3
): ChordTiming[] {
  const track = timeline.tracks[0]; // por enquanto só uma track
  if (!track) return [];

  return track.clips.map(clip => ({
    holdDuration: clip.duration / 1000,      // ms → segundos
    transitionDuration: transitionDuration,   // pode ser customizado por clip no futuro
    pauseDuration: pauseDuration              // pode ser customizado por clip no futuro
  }));
}

/**
 * Calcula a duração total necessária baseada nos clips
 */
export function calculateTotalDuration(timeline: TimelineState): number {
  const track = timeline.tracks[0];
  if (!track || track.clips.length === 0) return 30000; // default 30s

  const lastClip = track.clips.reduce((max, clip) => {
    const clipEnd = clip.start + clip.duration;
    return clipEnd > max ? clipEnd : max;
  }, 0);

  return Math.max(lastClip + 5000, 30000); // +5s de margem, mínimo 30s
}

/**
 * Verifica se há overlap entre clips
 */
export function hasOverlap(timeline: TimelineState): boolean {
  const track = timeline.tracks[0];
  if (!track) return false;

  const sorted = [...track.clips].sort((a, b) => a.start - b.start);
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    
    if (current.start + current.duration > next.start) {
      return true;
    }
  }
  
  return false;
}

/**
 * Ajusta clips para evitar overlap (snap)
 */
export function snapClips(timeline: TimelineState, gap: number = 0): TimelineState {
  const track = timeline.tracks[0];
  if (!track) return timeline;

  const sorted = [...track.clips].sort((a, b) => a.start - b.start);
  const adjusted = sorted.map((clip, index) => {
    if (index === 0) return clip;
    
    const prev = sorted[index - 1];
    const minStart = prev.start + prev.duration + gap;
    
    if (clip.start < minStart) {
      return { ...clip, start: minStart };
    }
    
    return clip;
  });

  return {
    ...timeline,
    tracks: [{
      ...track,
      clips: adjusted
    }]
  };
}

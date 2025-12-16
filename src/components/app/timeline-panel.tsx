"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/app/context/app--context";
import { Timeline } from "@/components/timeline";
import type { TimelineState, TimelineClip, ChordClip } from "@/lib/timeline/types";
import { generateClipId } from "@/lib/timeline/utils";
import { getChordDisplayData } from "@/lib/chord-logic"; // New import
import type { ChordWithTiming } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface TimelinePanelProps {
  isAnimating: boolean;
  isPaused: boolean;
  ffmpegLoaded: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
}

export function TimelinePanel({
  isAnimating,
  isPaused,
  ffmpegLoaded,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo
}: TimelinePanelProps) {
  const {
    selectedChords,
    setSelectedChords,
    timelineState,
    setTimelineState,
    playbackProgress,
    setPlaybackProgress,
    setPlaybackIsScrubbing,
    requestPlaybackSeek,
    playbackTotalDurationMs,
    animationType,
    playbackTransitionsEnabled,
  } = useAppContext();

  const isTimelineEmpty = timelineState.tracks.every(track => track.clips.length === 0);

  const transitionDurationMs = animationType === "carousel" ? 1000 : 800;
  const minClipDurationMs = playbackTransitionsEnabled ? transitionDurationMs * 2 : 0;

  const [isInitializing, setIsInitializing] = useState(true);

  // Sincroniza selectedChords → timeline clips (apenas na inicialização)
  useEffect(() => {
    if (!isInitializing || selectedChords.length === 0) return;

    const clips: ChordClip[] = [];
    let currentStart = 0;
    const defaultDuration = 2000;

    selectedChords.forEach((chordWithTiming, index) => {
      if (chordWithTiming && chordWithTiming.chord) {
        const duration = Math.max(chordWithTiming.duration || defaultDuration, minClipDurationMs);
        const { finalChord, transportDisplay } = getChordDisplayData(chordWithTiming.chord);
        clips.push({
          id: `clip-${index}-${Date.now()}`,
          type: 'chord',
          chord: chordWithTiming.chord, // Keep original chord
          finalChord,                  // Add finalChord
          transportDisplay,            // Add transportDisplay
          start: currentStart,
          duration
        });
        currentStart += duration;
      }
    });

    const totalNeeded = Math.max(currentStart, 1000);
    const totalFromPlayback = playbackTotalDurationMs > 0 ? playbackTotalDurationMs : totalNeeded;
    const totalDuration = Math.max(totalNeeded, totalFromPlayback);

    setTimelineState(prev => ({
      ...prev,
      tracks: [{ ...prev.tracks[0], clips }],
      totalDuration
    }));

    setIsInitializing(false);
  }, [selectedChords, isInitializing, playbackTotalDurationMs, minClipDurationMs, setTimelineState]);

  // Quando selectedChords muda externamente (novo acorde adicionado)
  useEffect(() => {
    if (isInitializing) return;

    const chordTrack = timelineState.tracks.find(t => t.type === 'chord');
    if (!chordTrack) return;

    const currentClipCount = chordTrack.clips.length || 0;

    if (selectedChords.length > currentClipCount) {
      const newClips = [...chordTrack.clips];

      for (let i = currentClipCount; i < selectedChords.length; i++) {
        const chordWithTiming = selectedChords[i];
        if (chordWithTiming && chordWithTiming.chord) {
          const lastClip = newClips[newClips.length - 1];
          const newStart = lastClip ? lastClip.start + lastClip.duration : 0;
          const duration = Math.max(chordWithTiming.duration || 2000, minClipDurationMs);
          const { finalChord, transportDisplay } = getChordDisplayData(chordWithTiming.chord);
          newClips.push({
            id: generateClipId(),
            type: 'chord',
            chord: chordWithTiming.chord, // Keep original chord
            finalChord,                  // Add finalChord
            transportDisplay,            // Add transportDisplay
            start: newStart,
            duration
          });
        }
      }

      const totalNeeded = newClips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0);
      const totalDuration = Math.max(1000, playbackTotalDurationMs, totalNeeded);

      setTimelineState(prev => ({
        ...prev,
        tracks: prev.tracks.map(t => t.id === chordTrack.id ? { ...t, clips: newClips } : t),
        totalDuration
      }));
    }
  }, [selectedChords.length, isInitializing, timelineState.tracks, playbackTotalDurationMs, minClipDurationMs, setTimelineState]);

  useEffect(() => {
    if (isInitializing) return;
    if (!playbackTotalDurationMs) return;
    setTimelineState(prev => ({
      ...prev,
      totalDuration: Math.max(1000, playbackTotalDurationMs)
    }));
  }, [animationType, isInitializing, playbackTotalDurationMs, setTimelineState]);

  const handleTimelineChange = (newTimeline: TimelineState) => {
    setTimelineState(newTimeline);

    const chordTrack = newTimeline.tracks.find(t => t.type === 'chord');
    if (!chordTrack) return;

    const sortedClips = [...chordTrack.clips].sort((a, b) => a.start - b.start);
    const reorderedChordsWithTiming: ChordWithTiming[] = sortedClips
      .filter((clip): clip is ChordClip => clip.type === 'chord')
      .map(clip => ({
        chord: clip.chord,
        duration: Math.max(clip.duration, minClipDurationMs),
        finalChord: clip.finalChord, // Add finalChord
        transportDisplay: clip.transportDisplay, // Add transportDisplay
      } as ChordWithTiming)); // Cast to ChordWithTiming to satisfy type, as optional properties are now required for ChordWithTiming

    setSelectedChords(reorderedChordsWithTiming);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-t border-border bg-muted/30 p-4 flex-1 overflow-hidden flex flex-col">
        <div className="">
          <Timeline
            value={timelineState}
            onChange={handleTimelineChange}
            playheadProgress={playbackProgress}
            playheadTotalDurationMs={playbackTotalDurationMs || timelineState.totalDuration}
            minClipDurationMs={minClipDurationMs}
            showPlayhead
            onPlayheadScrubStart={() => setPlaybackIsScrubbing(true)}
            onPlayheadScrub={(progress) => {
              setPlaybackProgress(progress);
              requestPlaybackSeek(progress);
            }}
            onPlayheadScrubEnd={(progress) => {
              setPlaybackProgress(progress);
              requestPlaybackSeek(0);
            }}
            isAnimating={isAnimating}
            isPaused={isPaused}
            ffmpegLoaded={ffmpegLoaded}
            isTimelineEmpty={isTimelineEmpty}
            handleAnimate={handleAnimate}
            handlePause={handlePause}
            handleResume={handleResume}
            handleRenderVideo={handleRenderVideo}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border-t border-border">
        
      </div>
    </div>
  );
}


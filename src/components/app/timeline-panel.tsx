"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/app--context";
import { Timeline } from "@/components/timeline";
import type { TimelineState, TimelineClip } from "@/lib/timeline/types";
import { generateClipId } from "@/lib/timeline/utils";
import type { ChordWithTiming } from "@/lib/types";

/**
 * Painel que gerencia a timeline de acordes
 * Substitui o SelectedChordsPanel com funcionalidade de timeline
 */
export function TimelinePanel() {
  const {
    selectedChords,
    setSelectedChords,
    playbackProgress,
    setPlaybackProgress,
    setPlaybackIsScrubbing,
    requestPlaybackSeek,
    playbackTotalDurationMs,
    animationType,
    playbackTransitionsEnabled,
  } = useAppContext();

  const transitionDurationMs = animationType === "carousel" ? 1000 : 800;
  const minClipDurationMs = playbackTransitionsEnabled ? transitionDurationMs * 2 : 0;
  
  const [timelineState, setTimelineState] = useState<TimelineState>({
    tracks: [
      {
        id: "chords-track",
        name: "Acordes",
        clips: []
      }
    ],
    totalDuration: 1000,
    zoom: 100 // 100px por segundo
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // Sincroniza selectedChords → timeline clips (apenas na inicialização)
  useEffect(() => {
    if (!isInitializing) return;

    // Converte acordes selecionados para clips na timeline
    const clips: TimelineClip[] = [];
    let currentStart = 0;
    const defaultDuration = 2000; // 2 segundos default por acorde

    selectedChords.forEach((chordWithTiming, index) => {
      // Validar que o acorde tem a estrutura correta
      if (chordWithTiming && chordWithTiming.chord) {
        const duration = Math.max(chordWithTiming.duration || defaultDuration, minClipDurationMs);
        clips.push({
          id: `clip-${index}-${Date.now()}`,
          chord: chordWithTiming.chord,
          start: currentStart,
          duration // Usa a duração do ChordWithTiming (com mínimo) ou default
        });
        currentStart += duration;
      }
    });

    // Calcula duração total necessária (usa a duração real do playback quando disponível)
    const totalNeeded = Math.max(currentStart, 1000);
    const totalFromPlayback = playbackTotalDurationMs > 0 ? playbackTotalDurationMs : totalNeeded;
    const totalDuration = Math.max(totalNeeded, totalFromPlayback);
    
    setTimelineState(prev => ({
      ...prev,
      tracks: [{
        ...prev.tracks[0],
        clips: clips
      }],
      totalDuration
    }));

    setIsInitializing(false);
  }, [selectedChords, isInitializing, playbackTotalDurationMs, minClipDurationMs]);

  // Quando selectedChords muda externamente (novo acorde adicionado)
  useEffect(() => {
    if (isInitializing) return;

    const currentClipCount = timelineState.tracks[0]?.clips.length || 0;
    
    // Se o número de acordes mudou, adicionar novos
    if (selectedChords.length > currentClipCount) {
      const newClips = [...timelineState.tracks[0].clips];
      
      for (let i = currentClipCount; i < selectedChords.length; i++) {
        const chordWithTiming = selectedChords[i];
        // Validar que o acorde tem a estrutura correta
        if (chordWithTiming && chordWithTiming.chord) {
          const lastClip = newClips[newClips.length - 1];
          const newStart = lastClip ? lastClip.start + lastClip.duration : 0;

          const duration = Math.max(chordWithTiming.duration || 2000, minClipDurationMs);
          newClips.push({
            id: generateClipId(),
            chord: chordWithTiming.chord,
            start: newStart,
            duration
          });
        }
      }

      const totalNeeded = Math.max(
        newClips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0),
        1000
      );
      const totalFromPlayback = playbackTotalDurationMs > 0 ? playbackTotalDurationMs : totalNeeded;
      const totalDuration = Math.max(totalNeeded, totalFromPlayback);

      setTimelineState(prev => ({
        ...prev,
        tracks: [{
          ...prev.tracks[0],
          clips: newClips
        }],
        totalDuration
      }));
    }
  }, [selectedChords.length, isInitializing, timelineState.tracks, playbackTotalDurationMs, minClipDurationMs]);

  // Mantém a régua alinhada ao tempo real do playback quando o tipo de animação muda
  useEffect(() => {
    if (isInitializing) return;
    if (!playbackTotalDurationMs) return;

    setTimelineState(prev => ({
      ...prev,
      totalDuration: Math.max(1000, playbackTotalDurationMs)
    }));
  }, [animationType, isInitializing, playbackTotalDurationMs]);

  // Sincroniza timeline → selectedChords (quando ordem muda)
  const handleTimelineChange = (newTimeline: TimelineState) => {
    setTimelineState(newTimeline);

    // Ordena clips por posição (start) e extrai acordes e suas durações
    const sortedClips = [...newTimeline.tracks[0].clips].sort((a, b) => a.start - b.start);
    const reorderedChordsWithTiming: ChordWithTiming[] = sortedClips.map(clip => ({
      chord: clip.chord,
      duration: Math.max(clip.duration, minClipDurationMs)
    }));

    // Atualiza selectedChords com a nova ordem e durações
    setSelectedChords(reorderedChordsWithTiming);
  };

  return (
    <div className="border-t border-border bg-muted/30 p-4 flex-1 overflow-hidden">
      <Timeline 
        value={timelineState}
        onChange={handleTimelineChange}
        playheadProgress={playbackProgress}
        playheadTotalDurationMs={playbackTotalDurationMs || timelineState.totalDuration}
        minClipDurationMs={minClipDurationMs}
        showPlayhead
        onPlayheadScrubStart={() => {
          setPlaybackIsScrubbing(true);
        }}
        onPlayheadScrub={(progress) => {
          setPlaybackProgress(progress);
          requestPlaybackSeek(progress);
        }}
        onPlayheadScrubEnd={(progress) => {
          setPlaybackProgress(progress);
          requestPlaybackSeek(progress);
          setPlaybackIsScrubbing(false);
        }}
      />
    </div>
  );
}


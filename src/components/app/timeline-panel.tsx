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
  const { selectedChords, setSelectedChords } = useAppContext();
  
  const [timelineState, setTimelineState] = useState<TimelineState>({
    tracks: [
      {
        id: "chords-track",
        name: "Acordes",
        clips: []
      }
    ],
    totalDuration: 30000, // 30 segundos default
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
        clips.push({
          id: `clip-${index}-${Date.now()}`,
          chord: chordWithTiming.chord,
          start: currentStart,
          duration: chordWithTiming.duration || defaultDuration // Usa a duração do ChordWithTiming ou default
        });
        currentStart += (chordWithTiming.duration || defaultDuration);
      }
    });

    // Calcula duração total necessária
    const totalNeeded = currentStart + 5000; // +5s de margem
    
    setTimelineState(prev => ({
      ...prev,
      tracks: [{
        ...prev.tracks[0],
        clips: clips
      }],
      totalDuration: Math.max(totalNeeded, 30000)
    }));

    setIsInitializing(false);
  }, [selectedChords, isInitializing]);

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
          
          newClips.push({
            id: generateClipId(),
            chord: chordWithTiming.chord,
            start: newStart,
            duration: chordWithTiming.duration || 2000
          });
        }
      }

      const totalNeeded = newClips.reduce((max, clip) => 
        Math.max(max, clip.start + clip.duration), 0) + 5000;

      setTimelineState(prev => ({
        ...prev,
        tracks: [{
          ...prev.tracks[0],
          clips: newClips
        }],
        totalDuration: Math.max(totalNeeded, 30000)
      }));
    }
  }, [selectedChords.length, isInitializing, timelineState.tracks]);

  // Sincroniza timeline → selectedChords (quando ordem muda)
  const handleTimelineChange = (newTimeline: TimelineState) => {
    setTimelineState(newTimeline);

    // Ordena clips por posição (start) e extrai acordes e suas durações
    const sortedClips = [...newTimeline.tracks[0].clips].sort((a, b) => a.start - b.start);
    const reorderedChordsWithTiming: ChordWithTiming[] = sortedClips.map(clip => ({
      chord: clip.chord,
      duration: clip.duration
    }));

    // Atualiza selectedChords com a nova ordem e durações
    setSelectedChords(reorderedChordsWithTiming);
  };

  return (
    <div className="border-t border-border bg-muted/30 p-4 flex-1 overflow-hidden">
      <Timeline 
        value={timelineState}
        onChange={handleTimelineChange}
      />
    </div>
  );
}


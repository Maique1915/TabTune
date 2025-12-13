"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/app--context";
import { Timeline } from "@/components/timeline";
import type { TimelineState, TimelineClip } from "@/lib/timeline/types";
import { generateClipId, timeToX } from "@/lib/timeline/utils";
import type { ChordDiagramProps } from "@/lib/types";

/**
 * Painel que gerencia a timeline de acordes
 * Substitui o SelectedChordsPanel com funcionalidade de timeline
 */
export function TimelinePanel() {
  const { selectedChords } = useAppContext();
  
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

  // Sincroniza selectedChords → timeline clips
  useEffect(() => {
    // Converte acordes selecionados para clips na timeline
    const clips: TimelineClip[] = [];
    let currentStart = 0;
    const defaultDuration = 2000; // 2 segundos default por acorde

    selectedChords.forEach((chord, index) => {
      clips.push({
        id: `clip-${index}-${Date.now()}`,
        chord: chord,
        start: currentStart,
        duration: defaultDuration
      });
      currentStart += defaultDuration;
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
  }, [selectedChords]);

  return (
    <div className="border-t border-border bg-muted/30 p-4">
      <Timeline 
        value={timelineState}
        onChange={setTimelineState}
      />
    </div>
  );
}

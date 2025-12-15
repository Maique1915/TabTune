"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/app/context/app--context";
import { Timeline } from "@/components/timeline";
import type { TimelineState, TimelineClip, ChordClip } from "@/lib/timeline/types";
import { generateClipId } from "@/lib/timeline/utils";
import type { ChordWithTiming } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

const extractWaveformData = (audioBuffer: AudioBuffer, targetPoints: number): number[] => {
  const rawData = audioBuffer.getChannelData(0);
  const samples = rawData.length;
  const blockSize = Math.floor(samples / targetPoints);
  const waveform = [];
  for (let i = 0; i < targetPoints; i++) {
    const blockStart = blockSize * i;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[blockStart + j]);
    }
    waveform.push(sum / blockSize);
  }
  // Normalize the waveform
  const max = Math.max(...waveform);
  return waveform.map(v => v / max);
};

export function TimelinePanel() {
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        clips.push({
          id: `clip-${index}-${Date.now()}`,
          type: 'chord',
          chord: chordWithTiming.chord,
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
          newClips.push({
            id: generateClipId(),
            type: 'chord',
            chord: chordWithTiming.chord,
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
        duration: Math.max(clip.duration, minClipDurationMs)
      }));

    setSelectedChords(reorderedChordsWithTiming);
  };
  
  const handleAudioFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const audioUrl = URL.createObjectURL(file);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const duration = audioBuffer.duration * 1000;
      const waveform = extractWaveformData(audioBuffer, 400);

      const newAudioTrack = {
        id: `audio-track-${generateClipId()}`,
        name: file.name,
        type: 'audio' as const,
        clips: [
          {
            id: `audio-clip-${generateClipId()}`,
            type: 'audio' as const,
            fileName: file.name,
            audioUrl: audioUrl,
            start: 0,
            duration: duration,
            waveform: waveform
          },
        ],
      };

      setTimelineState(prev => {
        const newTotalDuration = Math.max(prev.totalDuration, duration);
        return {
          ...prev,
          tracks: [...prev.tracks, newAudioTrack],
          totalDuration: newTotalDuration,
        };
      });

    } catch (error) {
      console.error("Error processing audio file:", error);
    }
  };

  const handleAddAudioClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-border bg-muted/30 p-4 flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="outline" size="sm" onClick={handleAddAudioClick}>
          <Music className="h-4 w-4 mr-2" />
          Add Audio
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleAudioFileSelect} 
          accept=".mp3,.wav" 
          style={{ display: 'none' }} 
        />
      </div>
      <div className="flex-1 overflow-hidden">
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
        />
      </div>
    </div>
  );
}


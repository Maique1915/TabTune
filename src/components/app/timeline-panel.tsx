"use client";

import React, { useState, useEffect, useRef } from "react";
import type { TimelineTrack } from "@/lib/timeline/types";

// Utilitário para obter todos os clipes de áudio da timeline
function getAllAudioClips(tracks: TimelineTrack[]) {
  return tracks
    .filter(t => t.type === 'audio')
    .flatMap(t => t.clips);
}
import { useAppContext } from "@/app/context/app--context";
import { Timeline } from "@/components/timeline";
import { TimelineControls } from "@/components/timeline/TimelineControls";
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

      // ...existing code...

      return (
        <div className="flex flex-row w-full h-full">
          {/* Exemplo: Library/Customizer à esquerda */}
          {/* <div className="shrink-0 w-[280px]"> ... </div> */}
          {/* Área central fixa */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-[800px] max-w-[1400px] mx-auto">
            <TimelineControls
              isAnimating={isAnimating}
              isPaused={isPaused}
              ffmpegLoaded={ffmpegLoaded}
              handleAnimate={handleAnimate}
              handlePause={handlePause}
              handleResume={handleResume}
              handleRenderVideo={handleRenderVideo}
              isTimelineEmpty={isTimelineEmpty}
              onAudioUpload={handleAudioUpload}
              audioUploaded={audioUploaded}
            />
            <div className="border-t border-border bg-muted/30 p-4 w-full overflow-hidden flex flex-col">
              {/* Elementos de áudio ocultos para sincronizar com a animação */}
              {getAllAudioClips(timelineState.tracks).map((clip) => {
                if (clip.type !== 'audio') return null;
                const audioKey = clip.id != null ? String(clip.id) : undefined;
                return (
                  <audio
                    key={audioKey}
                    ref={el => {
                      if (audioKey !== undefined) {
                        audioRefs.current[audioKey] = el;
                      }
                    }}
                    src={clip.audioUrl}
                    preload="auto"
                    style={{ display: 'none' }}
                  />
                );
              })}
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
            <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border-t border-border"></div>
            {/* Passa o botão de upload para os controles */}
            <div style={{ display: 'none' }} />
            <div className="absolute">
              {/* O botão é renderizado dentro dos controles, não aqui */}
            </div>
            {/* Substitui os controles para aceitar props extras */}
            <style>{`.timeline-controls-upload { display: none; }`}</style>
          </div>
          {/* Exemplo: Customizer à direita */}
          {/* <div className="shrink-0 w-[280px]"> ... </div> */}
        </div>
      );
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

  // Estado para controlar se o áudio já foi adicionado
  const [audioUploaded, setAudioUploaded] = useState(false);

  // Função para adicionar o clipe de áudio à timeline
  const handleAudioUpload = (file: File) => {
    // Extrai a waveform do arquivo de áudio usando Web Audio API
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) return;
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer as ArrayBuffer);
        // Amostra a waveform para 100 pontos
        const rawData = audioBuffer.getChannelData(0);
        const samples = 100;
        const blockSize = Math.floor(rawData.length / samples);
        const waveform = Array(samples).fill(0).map((_, i) => {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j] || 0);
          }
          return sum / blockSize;
        });
        // Duração real do áudio
        const durationMs = Math.floor(audioBuffer.duration * 1000);
        const audioClip = {
          id: generateClipId(),
          type: 'audio' as const,
          fileName: file.name,
          audioUrl: URL.createObjectURL(file),
          start: 0,
          duration: durationMs,
          waveform,
        };
        setTimelineState(prev => {
          // Procura a track de acordes
          const chordTrack = prev.tracks.find(t => t.type === 'chord');
          // Procura a primeira track de áudio
          let audioTrackIndex = prev.tracks.findIndex(t => t.type === 'audio');
          let newTracks = [...prev.tracks];
          if (audioTrackIndex === -1) {
            // Não existe track de áudio, cria uma nova abaixo da de acordes
            const newAudioTrack = {
              id: generateClipId(),
              name: 'Áudio',
              type: 'audio' as const,
              clips: [audioClip],
            };
            // Insere logo após a track de acordes
            const chordIndex = prev.tracks.findIndex(t => t.type === 'chord');
            if (chordIndex !== -1) {
              newTracks.splice(chordIndex + 1, 0, newAudioTrack);
            } else {
              newTracks.push(newAudioTrack);
            }
          } else {
            // Já existe track de áudio, adiciona nela
            newTracks = newTracks.map((t, idx) =>
              idx === audioTrackIndex
                ? { ...t, clips: [...t.clips, audioClip] }
                : t
            );
          }
          return {
            ...prev,
            tracks: newTracks,
          };
        });
        setAudioUploaded(true);
      } catch (err) {
        alert('Erro ao processar áudio.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col h-full">
       <TimelineControls
        isAnimating={isAnimating}
        isPaused={isPaused}
        ffmpegLoaded={ffmpegLoaded}
        handleAnimate={handleAnimate}
        handlePause={handlePause}
        handleResume={handleResume}
        handleRenderVideo={handleRenderVideo}
        isTimelineEmpty={isTimelineEmpty}
        onAudioUpload={handleAudioUpload}
        audioUploaded={audioUploaded}
      />
      <div className="border-t border-border bg-muted/30 p-4 flex-1 overflow-hidden flex flex-col">
        {/* Elementos de áudio ocultos para sincronizar com a animação */}
        {getAllAudioClips(timelineState.tracks).map((clip) => {
          // Type guard: only render for audio clips
          if (clip.type !== 'audio') return null;          
          
          // Utilitário para obter todos os clipes de áudio da timeline
          function getAllAudioClips(tracks: TimelineTrack[]) {
            return tracks
              .filter(t => t.type === 'audio')
              .flatMap(t => t.clips);
          }
          const audioKey = clip.id != null ? String(clip.id) : undefined;
          return (
            <audio
              key={audioKey}
              ref={el => {
                if (audioKey !== undefined) {
                  audioRefs.current[audioKey] = el;
                }
              }}
              src={clip.audioUrl}
              preload="auto"
              style={{ display: 'none' }}
            />
          );
        })}
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
      <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border-t border-border"></div>
      {/* Passa o botão de upload para os controles */}
      <div style={{ display: 'none' }} />
      <div className="absolute">
        {/* O botão é renderizado dentro dos controles, não aqui */}
      </div>
      {/* Substitui os controles para aceitar props extras */}
      <style>{`.timeline-controls-upload { display: none; }`}</style>
     
    </div>
  );
}


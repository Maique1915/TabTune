"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/app/context/app--context";
import { Timeline } from "@/components/studio/timeline/Timeline";
import { TimelineControls } from "@/components/studio/timeline/TimelineControls";
import type { TimelineState, TimelineClip, ChordClip, TimelineTrack } from "@/lib/timeline/types";
import { generateClipId } from "@/lib/timeline/utils";
import type { ChordWithTiming } from "@/lib/types";

interface FretboardTimelineProps {
    isAnimating: boolean;
    isPaused: boolean;
    ffmpegLoaded: boolean;
    handleAnimate: () => void;
    handlePause: () => void;
    handleResume: () => void;
    handleRenderVideo: () => void;
    isTimelineEmpty: boolean;
}

// Utilitário para obter todos os clipes de áudio da timeline
function getAllAudioClips(tracks: TimelineTrack[]) {
    return tracks
        .filter(t => t.type === 'audio')
        .flatMap(t => t.clips);
}

export function FretboardTimeline({
    isAnimating,
    isPaused,
    ffmpegLoaded,
    handleAnimate,
    handlePause,
    handleResume,
    handleRenderVideo,
    isTimelineEmpty
}: FretboardTimelineProps) {
    const {
        timelineState,
        setTimelineState,
        setSelectedChords,
        minClipDurationMs,
        playbackProgress,
        setPlaybackProgress,
        playbackTotalDurationMs,
        setPlaybackIsScrubbing,
        requestPlaybackSeek,
        audioRefs
    } = useAppContext();

    // Estado para controlar se o áudio já foi adicionado
    const [audioUploaded, setAudioUploaded] = useState(false);

    // Função para adicionar o clipe de áudio à timeline
    const handleAudioUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result;
            if (!arrayBuffer) return;
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer as ArrayBuffer);
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
                    let audioTrackIndex = prev.tracks.findIndex(t => t.type === 'audio');
                    let newTracks = [...prev.tracks];
                    if (audioTrackIndex === -1) {
                        const newAudioTrack = {
                            id: generateClipId(),
                            name: 'Áudio',
                            type: 'audio' as const,
                            clips: [audioClip],
                        };
                        const chordIndex = prev.tracks.findIndex(t => t.type === 'chord');
                        if (chordIndex !== -1) {
                            newTracks.splice(chordIndex + 1, 0, newAudioTrack);
                        } else {
                            newTracks.push(newAudioTrack);
                        }
                    } else {
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

    const handleTimelineChange = (newTimeline: TimelineState) => {
        console.log('[FretboardTimeline] handleTimelineChange triggered', newTimeline);
        setTimelineState(newTimeline);
        // Sync logic for selectedChords
        const chordTrack = newTimeline.tracks.find(t => t.type === 'chord');
        if (!chordTrack) return;
        const sortedClips = [...chordTrack.clips].sort((a, b) => a.start - b.start);
        const reorderedChordsWithTiming: ChordWithTiming[] = sortedClips
            .filter((clip): clip is ChordClip => clip.type === 'chord')
            .map(clip => ({
                chord: clip.chord,
                duration: Math.max(clip.duration, minClipDurationMs),
                finalChord: clip.finalChord,
                transportDisplay: clip.transportDisplay,
            } as ChordWithTiming));
        setSelectedChords(reorderedChordsWithTiming);
    };

    return (
        <div className="flex flex-col w-full h-full bg-black/20 backdrop-blur-xl border-t border-white/5 relative">
            <div className="flex-1 overflow-hidden relative p-4 flex flex-col gap-4">
                {/* Main Timeline Display */}
                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 overflow-hidden relative shadow-inner">
                    {/* Audio Elements */}
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

                    <div className="h-full">
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
            </div>
        </div>
    );
}

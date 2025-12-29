"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { TimelineRuler } from "./TimelineRuler";
import { TimelineTrack } from "./TimelineTrack";
import { Button } from "@/shared/components/ui/button"; // Re-adicionar Importar Button
import { ZoomIn, ZoomOut } from "lucide-react"; // Re-adicionar Importar ícones de zoom
import type { TimelineState, DragState, TimelineClip } from "@/lib/timeline/types";
import { formatTimeMs } from "@/lib/timeline/utils";
import { TimelineControls } from "./TimelineControls"; // Importar o novo componente
import { xDeltaToTime, clamp } from "@/lib/timeline/utils";

interface TimelineProps {
  value: TimelineState;
  onChange: (newState: TimelineState) => void;
  className?: string;
  playheadProgress?: number; // 0..1
  showPlayhead?: boolean;
  playheadTotalDurationMs?: number;
  minClipDurationMs?: number;
  onPlayheadScrubStart?: () => void;
  onPlayheadScrub?: (progress: number) => void;
  onPlayheadScrubEnd?: (progress: number) => void;
  // Novas props para os controles
  isAnimating: boolean;
  isPaused: boolean;
  ffmpegLoaded: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
  isTimelineEmpty: boolean;
  onClipEdit?: (clipId: string) => void;
}

export function StudioTimeline({
  value,
  onChange,
  className,
  playheadProgress = 0,
  showPlayhead = true,
  playheadTotalDurationMs,
  minClipDurationMs = 500,
  onPlayheadScrubStart,
  onPlayheadScrub,
  onPlayheadScrubEnd,
  // Desestruturar as novas props
  isAnimating,
  isPaused,
  ffmpegLoaded,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo,
  isTimelineEmpty,
  onClipEdit
}: TimelineProps) {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [tempPosition, setTempPosition] = useState<number | null>(null);
  const [isPlayheadDragging, setIsPlayheadDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const TRACK_LABEL_WIDTH = 128; // w-32
  const effectiveDurationMs = Math.max(0, playheadTotalDurationMs ?? value.totalDuration);
  const totalWidthPx = (effectiveDurationMs / 1000) * value.zoom;
  const currentTimeMs = Math.round(Math.max(0, Math.min(1, playheadProgress)) * effectiveDurationMs);

  const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

  // Removido bloco JSX solto que estava fora do return
  const playheadMotionRef = useRef({
    targetProgress: 0,
    lastTargetProgress: 0,
    lastTargetPerfMs: 0,
    velocityProgPerMs: 0,
    visualProgress: 0,
    lastTickPerfMs: 0,
  });

  useEffect(() => {
    const now = performance.now();
    const m = playheadMotionRef.current;
    const target = clamp01(playheadProgress);

    if (target === 0) {
      m.targetProgress = 0;
      m.lastTargetProgress = 0;
      m.velocityProgPerMs = 0;
      m.visualProgress = 0;
      m.lastTargetPerfMs = now;
      m.lastTickPerfMs = now;

      const el = playheadRef.current;
      if (el) el.style.transform = "translateX(0px)";
      return;
    }

    const dt = Math.max(1, now - (m.lastTargetPerfMs || now));
    const instVel = Math.max(0, (target - (m.lastTargetProgress ?? target)) / dt);

    m.velocityProgPerMs = m.velocityProgPerMs * 0.8 + instVel * 0.2;
    m.lastTargetProgress = target;
    m.targetProgress = target;
    m.lastTargetPerfMs = now;

    if (!m.lastTickPerfMs) {
      m.visualProgress = target;
      m.lastTickPerfMs = now;
    }
  }, [playheadProgress]);

  useEffect(() => {
    if (!showPlayhead || isPlayheadDragging) return;
    const el = playheadRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const tick = () => {
      const now = performance.now();
      const m = playheadMotionRef.current;
      const dt = Math.max(0, now - (m.lastTickPerfMs || now));
      m.lastTickPerfMs = now;
      m.visualProgress = clamp01(m.visualProgress + m.velocityProgPerMs * dt);
      const error = m.targetProgress - m.visualProgress;
      m.visualProgress = clamp01(m.visualProgress + error * 0.15);
      el.style.transform = `translateX(${totalWidthPx * m.visualProgress}px)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isPlayheadDragging, showPlayhead, totalWidthPx]);

  useEffect(() => {
    const el = playheadRef.current;
    if (!el || !showPlayhead || !isPlayheadDragging) return;
    const target = clamp01(playheadProgress);
    playheadMotionRef.current.visualProgress = target;
    el.style.transform = `translateX(${totalWidthPx * target}px)`;
  }, [isPlayheadDragging, playheadProgress, showPlayhead, totalWidthPx]);

  const eventToPlayheadProgress = useCallback((e: PointerEvent | React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return 0;
    const rect = container.getBoundingClientRect();
    const xInContainer = e.clientX - rect.left;
    const xInContent = xInContainer + container.scrollLeft;
    const xOnTimeline = xInContent - TRACK_LABEL_WIDTH;
    if (totalWidthPx <= 0) return 0;
    return clamp01(xOnTimeline / totalWidthPx);
  }, [totalWidthPx]);

  const handlePlayheadPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlayheadDragging(true);
    onPlayheadScrubStart?.();
    onPlayheadScrub?.(eventToPlayheadProgress(e));
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [eventToPlayheadProgress, onPlayheadScrub, onPlayheadScrubStart]);

  const handlePlayheadPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlayheadDragging) return;
    e.preventDefault();
    e.stopPropagation();
    onPlayheadScrub?.(eventToPlayheadProgress(e));
  }, [eventToPlayheadProgress, isPlayheadDragging, onPlayheadScrub]);

  const handlePlayheadPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlayheadDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setIsPlayheadDragging(false);
    onPlayheadScrubEnd?.(eventToPlayheadProgress(e));
  }, [eventToPlayheadProgress, isPlayheadDragging, onPlayheadScrubEnd]);

  const repackClips = (clips: TimelineClip[]): TimelineClip[] => {
    const sorted = [...clips].sort((a, b) => a.start - b.start);
    let currentStart = 0;
    return sorted.map(clip => {
      const repacked = { ...clip, start: currentStart };
      currentStart += clip.duration;
      return repacked;
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState) return;
    const deltaX = e.clientX - dragState.startX;
    const deltaTime = xDeltaToTime(deltaX, value.zoom);
    const track = value.tracks.find(t => t.id === dragState.trackId);
    if (!track) return;
    const clip = track.clips.find(c => c.id === dragState.clipId);
    if (!clip) return;

    switch (dragState.mode) {
      case 'move': {
        const desiredStart = dragState.initialStart + deltaTime;
        const newStart = clamp(desiredStart, 0, value.totalDuration - clip.duration);
        setTempPosition(newStart);
        const updatedTracks = value.tracks.map(t =>
          t.id !== dragState.trackId ? t : { ...t, clips: t.clips.map(c => c.id === dragState.clipId ? { ...c, start: newStart } : c) }
        );
        onChange({ ...value, tracks: updatedTracks });
        break;
      }
      case 'resize-left': {
        const desiredStart = clamp(dragState.initialStart + deltaTime, 0, dragState.initialStart + dragState.initialDuration - minClipDurationMs);
        const newDuration = dragState.initialDuration - (desiredStart - dragState.initialStart);
        const updatedClip = { ...clip, start: desiredStart, duration: clamp(newDuration, minClipDurationMs, value.totalDuration - desiredStart) };
        const updatedTracks = value.tracks.map(t =>
          t.id !== dragState.trackId ? t : { ...t, clips: t.clips.map(c => c.id === dragState.clipId ? updatedClip : c) }
        );
        onChange({ ...value, tracks: updatedTracks });
        break;
      }
      case 'resize-right': {
        const newDuration = clamp(dragState.initialDuration + deltaTime, minClipDurationMs, value.totalDuration - clip.start);
        const updatedClip = { ...clip, duration: newDuration };
        const updatedTracks = value.tracks.map(t =>
          t.id !== dragState.trackId ? t : { ...t, clips: t.clips.map(c => c.id === dragState.clipId ? updatedClip : c) }
        );
        onChange({ ...value, tracks: updatedTracks });
        break;
      }
    }
  }, [dragState, value, onChange]);

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      const track = value.tracks.find(t => t.id === dragState.trackId);
      if (track) {
        if (dragState.mode === 'move' && tempPosition !== null) {
          const updatedClips = track.clips.map(c => c.id === dragState.clipId ? { ...c, start: tempPosition } : c);
          const repacked = repackClips(updatedClips);
          onChange({ ...value, tracks: value.tracks.map(t => t.id === dragState.trackId ? { ...t, clips: repacked } : t) });
        } else if (dragState.mode.startsWith('resize')) {
          const repacked = repackClips(track.clips);
          onChange({ ...value, tracks: value.tracks.map(t => t.id === dragState.trackId ? { ...t, clips: repacked } : t) });
        }
      }
    }
    setDragState(null);
    setTempPosition(null);
  }, [dragState, value, onChange, tempPosition, repackClips]);

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  const handleClipDelete = (clipId: string) => {
    const newTracks = value.tracks.map(track => {
      if (track.clips.some(c => c.id === clipId)) {
        const filteredClips = track.clips.filter(c => c.id !== clipId);
        const repackedClips = repackClips(filteredClips);
        return { ...track, clips: repackedClips };
      }
      return track;
    });

    onChange({ ...value, tracks: newTracks });

    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  // Zoom
  const handleZoomIn = () => {
    onChange({
      ...value,
      zoom: Math.min(value.zoom * 1.5, 400)
    });
  };

  const handleZoomOut = () => {
    onChange({
      ...value,
      zoom: Math.max(value.zoom / 1.5, 30)
    });
  };

  // NEW: Handle adding clips from drag and drop
  const handleAddClip = (trackId: string, time: number, item: any) => {
    // Find the track
    const trackIndex = value.tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return;

    const track = value.tracks[trackIndex];

    // Generate ID manually here since we can't easily import generateClipId if it's not exported or if we want to keep it simple
    // Actually we should use a util or UUID. I'll use a simple Math.random for now or import uuid if available.
    // Better to check context or utils.
    // I'll assume we can use Date.now() + random string for ID.
    const newId = `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create new clip
    const newClip: TimelineClip = {
      id: newId,
      start: time,
      duration: 1000, // Default duration, maybe get from item or context
      type: 'symbol',
      name: item.name,
      vexFlowProps: item.vexFlowProps
    };

    // Add to track
    const newTracks = [...value.tracks];
    newTracks[trackIndex] = {
      ...track,
      clips: repackClips([...track.clips, newClip])
    };

    onChange({
      ...value,
      tracks: newTracks
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2 px-2">
        {/* Controles da timeline agora são renderizados pelo TimelinePanel */}
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatTimeMs(currentTimeMs)} / {formatTimeMs(effectiveDurationMs)}
        </span>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {Math.round(value.zoom)}px/s
        </span>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div ref={containerRef} className="relative border border-white/10 rounded-lg overflow-x-auto bg-[#0a0a0a]">
        <div
          className="relative w-max min-w-full"
          style={{ width: `${Math.max(0, totalWidthPx) + TRACK_LABEL_WIDTH}px` }}
        >
          {showPlayhead && (
            <div
              className="absolute top-0 bottom-0 z-50 pointer-events-none"
              style={{
                left: `${TRACK_LABEL_WIDTH - 6}px`,
                width: "12px",
                transform: `translateX(${totalWidthPx * clamp01(playheadProgress)}px)`,
                willChange: "transform",
                touchAction: "none",
              }}
            >
              {/* Playhead Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              {/* Playhead Handle */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-3 h-3 bg-cyan-400 rotate-45 -mt-1.5 shadow-[0_0_5px_rgba(34,211,238,0.8)] cursor-ew-resize pointer-events-auto"
                ref={playheadRef}
                onPointerDown={handlePlayheadPointerDown}
                onPointerMove={handlePlayheadPointerMove}
                onPointerUp={handlePlayheadPointerUp}
              />
            </div>
          )}

          <TimelineRuler totalDuration={effectiveDurationMs} zoom={value.zoom} />

          {value.tracks
            .filter(t => t.type !== 'score')
            .map(track => (
              <TimelineTrack
                key={track.id}
                track={track}
                zoom={value.zoom}
                selectedClipId={selectedClipId}
                onClipSelect={setSelectedClipId}
                onDragStart={setDragState}
                onClipDelete={handleClipDelete}
                onAddClip={handleAddClip}
                onClipEdit={onClipEdit}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

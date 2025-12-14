"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { TimelineRuler } from "./TimelineRuler";
import { TimelineTrack } from "./TimelineTrack";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { TimelineState, DragState, TimelineClip } from "@/lib/timeline/types";
import { xDeltaToTime, clamp } from "@/lib/timeline/utils";
import { formatTimeMs } from "@/lib/timeline/utils";

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
}

export function Timeline({
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

  // Suaviza o playhead sem depender do ritmo de re-render do React.
  // Mantém velocidade praticamente constante (estimada e filtrada) + correção suave pro alvo.
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

    // Reset instantâneo quando o playback volta ao início.
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

    // Low-pass filter para evitar "sobe/desce" em intervalos irregulares
    m.velocityProgPerMs = m.velocityProgPerMs * 0.8 + instVel * 0.2;
    m.lastTargetProgress = target;
    m.targetProgress = target;
    m.lastTargetPerfMs = now;

    // Se for o primeiro update, inicializa
    if (!m.lastTickPerfMs) {
      m.visualProgress = target;
      m.lastTickPerfMs = now;
    }
  }, [playheadProgress]);

  useEffect(() => {
    if (!showPlayhead) return;
    if (isPlayheadDragging) return;
    const el = playheadRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const tick = () => {
      const now = performance.now();
      const m = playheadMotionRef.current;
      const dt = Math.max(0, now - (m.lastTickPerfMs || now));
      m.lastTickPerfMs = now;

      // Avança visual com a velocidade estimada
      m.visualProgress = clamp01(m.visualProgress + m.velocityProgPerMs * dt);

      // Correção suave pro alvo (evita drift sem dar "tranco")
      const error = m.targetProgress - m.visualProgress;
      m.visualProgress = clamp01(m.visualProgress + error * 0.15);

      const xPx = totalWidthPx * m.visualProgress;
      el.style.transform = `translateX(${xPx}px)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isPlayheadDragging, showPlayhead, totalWidthPx]);

  // Se estiver arrastando, posiciona exatamente no alvo.
  useEffect(() => {
    const el = playheadRef.current;
    if (!el) return;
    if (!showPlayhead) return;
    if (!isPlayheadDragging) return;
    const target = clamp01(playheadProgress);
    playheadMotionRef.current.visualProgress = target;
    const xPx = totalWidthPx * target;
    el.style.transform = `translateX(${xPx}px)`;
  }, [isPlayheadDragging, playheadProgress, showPlayhead, totalWidthPx]);

  const eventToPlayheadProgress = useCallback((e: PointerEvent | React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return 0;

    const rect = container.getBoundingClientRect();
    const xInContainer = ("clientX" in e ? e.clientX : 0) - rect.left;
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

    const progress = eventToPlayheadProgress(e);
    onPlayheadScrub?.(progress);

    e.currentTarget.setPointerCapture(e.pointerId);
  }, [eventToPlayheadProgress, onPlayheadScrub, onPlayheadScrubStart]);

  const handlePlayheadPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlayheadDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const progress = eventToPlayheadProgress(e);
    onPlayheadScrub?.(progress);
  }, [eventToPlayheadProgress, isPlayheadDragging, onPlayheadScrub]);

  const handlePlayheadPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlayheadDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const progress = eventToPlayheadProgress(e);
    setIsPlayheadDragging(false);
    onPlayheadScrubEnd?.(progress);
  }, [eventToPlayheadProgress, isPlayheadDragging, onPlayheadScrubEnd]);

  // Helper: Reorganiza clips sequencialmente (sem gaps)
  const repackClips = (clips: TimelineClip[]): TimelineClip[] => {
    const sorted = [...clips].sort((a, b) => a.start - b.start);
    let currentStart = 0;
    
    return sorted.map(clip => {
      const repacked = { ...clip, start: currentStart };
      currentStart += clip.duration;
      return repacked;
    });
  };



  // Drag & Drop
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
        // Apenas guardar posição temporária visual
        const desiredStart = dragState.initialStart + deltaTime;
        const newStart = clamp(desiredStart, 0, value.totalDuration - clip.duration);
        setTempPosition(newStart);
        
        // Atualizar visualmente
        const updatedTracks = value.tracks.map(t => {
          if (t.id !== dragState.trackId) return t;
          return {
            ...t,
            clips: t.clips.map(c => 
              c.id === dragState.clipId ? { ...c, start: newStart } : c
            )
          };
        });

        onChange({
          ...value,
          tracks: updatedTracks
        });
        break;
      }

      case 'resize-left': {
        const desiredStart = clamp(
          dragState.initialStart + deltaTime,
          0,
          dragState.initialStart + dragState.initialDuration - minClipDurationMs
        );
        const newDuration = dragState.initialDuration - (desiredStart - dragState.initialStart);
        
        const updatedClip = {
          ...clip,
          start: desiredStart,
          duration: clamp(newDuration, minClipDurationMs, value.totalDuration - desiredStart)
        };

        const updatedTracks = value.tracks.map(t => {
          if (t.id !== dragState.trackId) return t;
          return {
            ...t,
            clips: t.clips.map(c => c.id === dragState.clipId ? updatedClip : c)
          };
        });

        onChange({
          ...value,
          tracks: updatedTracks
        });
        break;
      }

      case 'resize-right': {
        const newDuration = clamp(
          dragState.initialDuration + deltaTime,
          minClipDurationMs,
          value.totalDuration - clip.start
        );
        
        const updatedClip = {
          ...clip,
          duration: newDuration
        };

        const updatedTracks = value.tracks.map(t => {
          if (t.id !== dragState.trackId) return t;
          return {
            ...t,
            clips: t.clips.map(c => c.id === dragState.clipId ? updatedClip : c)
          };
        });

        onChange({
          ...value,
          tracks: updatedTracks
        });
        break;
      }
    }
  }, [dragState, value, onChange]);

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      const track = value.tracks.find(t => t.id === dragState.trackId);
      
      if (track) {
        if (dragState.mode === 'move' && tempPosition !== null) {
          // Atualiza a posição inicial (start) do clip arrastado para a posição final de drop
          const updatedClipsWithTempStart = track.clips.map(c => 
            c.id === dragState.clipId ? { ...c, start: tempPosition } : c
          );
          
          // Ordena os clips pela nova posição 'start' e, em seguida, reempacota
          const sortedAndRepackedClips = repackClips([...updatedClipsWithTempStart].sort((a, b) => a.start - b.start));
          
          const updatedTracks = value.tracks.map(t => {
            if (t.id !== dragState.trackId) return t;
            return {
              ...t,
              clips: sortedAndRepackedClips
            };
          });

          onChange({
            ...value,
            tracks: updatedTracks
          });
        } else if (dragState.mode === 'resize-left' || dragState.mode === 'resize-right') {
          // Após resize, reorganizar para remover gaps
          const repackedClips = repackClips(track.clips);
          
          const updatedTracks = value.tracks.map(t => {
            if (t.id !== dragState.trackId) return t;
            return {
              ...t,
              clips: repackedClips
            };
          });

          onChange({
            ...value,
            tracks: updatedTracks
          });
        }
      }
    }
    
    setDragState(null);
    setTempPosition(null);
  }, [dragState, value, onChange, tempPosition, repackClips]); // getNewOrder removido

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

  // Delete clip
  const handleClipDelete = (clipId: string) => {
    const updatedTracks = value.tracks.map(track => ({
      ...track,
      clips: track.clips.filter(c => c.id !== clipId)
    }));

    onChange({
      ...value,
      tracks: updatedTracks
    });

    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  return (
    <div className={className}>
      {/* Controles */}
      <div className="flex items-center gap-2 mb-2 px-2">
        <span className="text-sm text-muted-foreground">Timeline</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatTimeMs(currentTimeMs)} / {formatTimeMs(effectiveDurationMs)}
        </span>
        <div className="flex-1" />
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

      {/* Container da timeline */}
      <div 
        ref={containerRef}
        className="relative border border-border rounded-lg overflow-auto bg-background h-full"
      >
        {/* Playhead (barra de progresso) */}
        {showPlayhead && (
          <div
            className="absolute top-0 bottom-0 z-50"
            style={{
              left: `${TRACK_LABEL_WIDTH - 6}px`,
              width: "12px",
              transform: `translateX(${totalWidthPx * clamp01(playheadProgress)}px)`,
              willChange: "transform",
              touchAction: "none",
              cursor: "ew-resize",
            }}
            ref={playheadRef}
            onPointerDown={handlePlayheadPointerDown}
            onPointerMove={handlePlayheadPointerMove}
            onPointerUp={handlePlayheadPointerUp}
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-primary rounded-full" />
          </div>
        )}

        {/* Régua */}
        <TimelineRuler 
          totalDuration={effectiveDurationMs} 
          zoom={value.zoom} 
        />

        {/* Tracks */}
        {value.tracks.map(track => (
          <TimelineTrack
            key={track.id}
            track={track}
            zoom={value.zoom}
            selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onDragStart={setDragState}
            onClipDelete={handleClipDelete}
          />
        ))}
      </div>
    </div>
  );
}

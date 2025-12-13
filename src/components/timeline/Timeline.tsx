"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { TimelineRuler } from "./TimelineRuler";
import { TimelineTrack } from "./TimelineTrack";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { TimelineState, DragState, TimelineClip } from "@/lib/timeline/types";
import { xToTime, clamp } from "@/lib/timeline/utils";

interface TimelineProps {
  value: TimelineState;
  onChange: (newState: TimelineState) => void;
  className?: string;
}

export function Timeline({ value, onChange, className }: TimelineProps) {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [tempPosition, setTempPosition] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const deltaTime = xToTime(deltaX, value.zoom);

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
        const desiredStart = clamp(dragState.initialStart + deltaTime, 0, dragState.initialStart + dragState.initialDuration - 500);
        const newDuration = dragState.initialDuration - (desiredStart - dragState.initialStart);
        
        const updatedClip = {
          ...clip,
          start: desiredStart,
          duration: clamp(newDuration, 500, value.totalDuration - desiredStart)
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
        const newDuration = clamp(dragState.initialDuration + deltaTime, 500, value.totalDuration - clip.start);
        
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
        className="border border-border rounded-lg overflow-auto bg-background h-full"
      >
        {/* Régua */}
        <TimelineRuler 
          totalDuration={value.totalDuration} 
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

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag & Drop
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaTime = xToTime(deltaX, value.zoom);

    const track = value.tracks.find(t => t.id === dragState.trackId);
    if (!track) return;

    const clip = track.clips.find(c => c.id === dragState.clipId);
    if (!clip) return;

    let updatedClip: TimelineClip;

    switch (dragState.mode) {
      case 'move':
        updatedClip = {
          ...clip,
          start: clamp(dragState.initialStart + deltaTime, 0, value.totalDuration - clip.duration)
        };
        break;

      case 'resize-left':
        const newStart = clamp(dragState.initialStart + deltaTime, 0, dragState.initialStart + dragState.initialDuration - 500);
        const newDuration = dragState.initialDuration - (newStart - dragState.initialStart);
        updatedClip = {
          ...clip,
          start: newStart,
          duration: clamp(newDuration, 500, value.totalDuration - newStart)
        };
        break;

      case 'resize-right':
        updatedClip = {
          ...clip,
          duration: clamp(dragState.initialDuration + deltaTime, 500, value.totalDuration - clip.start)
        };
        break;

      default:
        return;
    }

    // Atualiza o state
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
  }, [dragState, value, onChange]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

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
        className="border border-border rounded-lg overflow-auto bg-background"
        style={{ height: '200px' }}
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

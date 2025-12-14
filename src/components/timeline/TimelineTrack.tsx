"use client";

import React from "react";
import { TimelineClip } from "./TimelineClip";
import type { TimelineTrack as TimelineTrackType, DragState } from "@/lib/timeline/types";

interface TimelineTrackProps {
  track: TimelineTrackType;
  zoom: number;
  selectedClipId: string | null;
  onClipSelect: (clipId: string) => void;
  onDragStart: (dragState: DragState) => void;
  onClipDelete: (clipId: string) => void;
}

export function TimelineTrack({
  track,
  zoom,
  selectedClipId,
  onClipSelect,
  onDragStart,
  onClipDelete
}: TimelineTrackProps) {
  return (
    <div className="relative h-16 bg-background border-b border-border overflow-hidden">
      {/* Nome da track */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-muted/50 border-r border-border flex items-center px-3">
        <span className="text-sm font-medium">{track.name}</span>
      </div>

      {/* Área de clips */}
      <div className="absolute left-32 right-0 top-0 bottom-0 overflow-hidden">
        {track.clips.map((clip) => (
          <TimelineClip
            key={clip.id}
            clip={clip}
            zoom={zoom}
            isSelected={clip.id === selectedClipId}
            onMouseDown={(e) => {
              e.preventDefault();
              onClipSelect(clip.id);
              onDragStart({
                clipId: clip.id,
                trackId: track.id,
                startX: e.clientX,
                initialStart: clip.start,
                initialDuration: clip.duration,
                mode: 'move'
              });
            }}
            onResizeLeftStart={(e) => {
              e.preventDefault();
              onClipSelect(clip.id);
              onDragStart({
                clipId: clip.id,
                trackId: track.id,
                startX: e.clientX,
                initialStart: clip.start,
                initialDuration: clip.duration,
                mode: 'resize-left'
              });
            }}
            onResizeRightStart={(e) => {
              e.preventDefault();
              onClipSelect(clip.id);
              onDragStart({
                clipId: clip.id,
                trackId: track.id,
                startX: e.clientX,
                initialStart: clip.start,
                initialDuration: clip.duration,
                mode: 'resize-right'
              });
            }}
            onDelete={() => onClipDelete(clip.id)}
          />
        ))}
      </div>
    </div>
  );
}

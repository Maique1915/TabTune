"use client";

import React from "react";
import { TimelineClip } from "./TimelineClip";
import type { TimelineTrack as TimelineTrackType, DragState } from "@/lib/timeline/types";
import { xDeltaToTime } from "@/lib/timeline/utils";

interface TimelineTrackProps {
  track: TimelineTrackType;
  zoom: number;
  selectedClipId: string | null;
  onClipSelect: (clipId: string) => void;
  onDragStart: (dragState: DragState) => void;
  onClipDelete: (clipId: string) => void;
  onAddClip?: (trackId: string, time: number, item: any) => void;
  onClipEdit?: (clipId: string) => void;
}

export function TimelineTrack({
  track,
  zoom,
  selectedClipId,
  onClipSelect,
  onDragStart,
  onClipDelete,
  onAddClip,
  onClipEdit
}: TimelineTrackProps) {

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "symbol" && onAddClip) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - 128; // 128 is label width
        const time = Math.max(0, (x / zoom) * 1000);
        onAddClip(track.id, time, parsed.item);
      }
    } catch (err) {
      console.error("Drop failed", err);
    }
  };

  return (
    <div
      className="relative h-16 bg-transparent border-b border-white/5 overflow-hidden group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Nome da track */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-black/20 border-r border-white/5 flex items-center px-3 z-10 backdrop-blur-sm">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{track.name}</span>
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
            onEdit={() => onClipEdit?.(clip.id)}
          />
        ))}
      </div>
    </div>
  );
}

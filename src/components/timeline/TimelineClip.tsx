"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TimelineClip as TimelineClipType } from "@/lib/timeline/types";
import { formatTimeMs } from "@/lib/timeline/utils";
import { getNome } from "@/lib/chords";
import { Music } from "lucide-react";
import { AudioClipVisual } from "./AudioClipVisual";

interface TimelineClipProps {
  clip: TimelineClipType;
  zoom: number;
  isSelected?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeLeftStart: (e: React.MouseEvent) => void;
  onResizeRightStart: (e: React.MouseEvent) => void;
  onDelete?: () => void;
}

export function TimelineClip({
  clip,
  zoom,
  isSelected = false,
  onMouseDown,
  onResizeLeftStart,
  onResizeRightStart,
  onDelete
}: TimelineClipProps) {
  const left = (clip.start / 1000) * zoom;
  const width = (clip.duration / 1000) * zoom;

  let clipContent;
  let clipBgColor = "bg-primary/20 border-primary/50 hover:bg-primary/30";
  let visualContent = null;
  
  if (clip.type === 'chord') {
    const chordName = clip.chord?.chord 
      ? getNome(clip.chord.chord).replace(/#/g, "♯").replace(/b/g, "♭")
      : 'Chord';
    clipContent = <span className="text-sm font-semibold truncate">{chordName}</span>;
  } else if (clip.type === 'audio') {
    visualContent = (
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <AudioClipVisual waveform={clip.waveform} />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-0.5 flex items-center gap-1 rounded-b-md">
          <Music className="h-3 w-3 shrink-0 opacity-80" />
          <span className="truncate">{clip.fileName}</span>
        </div>
      </div>
    );
    clipContent = null;
    clipBgColor = "bg-green-500/20 border-green-500/50 hover:bg-green-500/30";
  }

  return (
    <div
      className={cn(
        "absolute top-2 h-12 rounded-md border-2 transition-all",
        "flex items-center justify-between px-2 gap-2",
        "select-none cursor-move",
        isSelected 
          ? "bg-blue-500/30 border-blue-500 z-20" 
          : clipBgColor
      )}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 10)}px`,
      }}
      onMouseDown={onMouseDown}
    >
      {/* Visual do clipe (waveform + label para áudio) */}
      {visualContent}
      {/* Handle resize esquerdo */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 z-30"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeLeftStart(e);
        }}
      />

      {/* Conteúdo do clip */}
      {clipContent && (
        <div className="relative z-10 flex-1 flex items-center justify-between overflow-hidden pointer-events-none">
          {clipContent}
          <span className="text-xs opacity-70 whitespace-nowrap ml-2">
            {formatTimeMs(clip.duration)}
          </span>
        </div>
      )}

      {/* Botão deletar (aparece quando selecionado) */}
      {isSelected && onDelete && (
        <button
          className="relative z-10 text-xs opacity-70 hover:opacity-100 hover:text-red-500 transition-all px-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Remover clip"
        >
          ×
        </button>
      )}

      {/* Handle resize direito */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 z-30"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeRightStart(e);
        }}
      />
    </div>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TimelineClip as TimelineClipType } from "@/lib/timeline/types";
import { formatTimeMs } from "@/lib/timeline/utils";
import { getNome } from "@/lib/chords";

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

  const chordName = clip.chord?.chord 
    ? getNome(clip.chord.chord).replace(/#/g, "♯").replace(/b/g, "♭")
    : 'Acorde';

  return (
    <div
      className={cn(
        "absolute top-2 h-12 rounded-md border-2 transition-all",
        "flex items-center justify-between px-2 gap-2",
        "select-none cursor-move",
        isSelected 
          ? "bg-blue-500/30 border-blue-500 z-20" 
          : "bg-primary/20 border-primary/50 hover:bg-primary/30"
      )}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 60)}px`, // largura mínima
      }}
      onMouseDown={onMouseDown}
    >
      {/* Handle resize esquerdo */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 z-30"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeLeftStart(e);
        }}
      />

      {/* Conteúdo do clip */}
      <div className="flex-1 flex items-center justify-between overflow-hidden">
        <span className="text-sm font-semibold truncate">
          {chordName}
        </span>
        <span className="text-xs opacity-70 whitespace-nowrap ml-2">
          {formatTimeMs(clip.duration)}
        </span>
      </div>

      {/* Botão deletar (aparece quando selecionado) */}
      {isSelected && onDelete && (
        <button
          className="text-xs opacity-70 hover:opacity-100 hover:text-red-500 transition-all px-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Remover acorde"
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

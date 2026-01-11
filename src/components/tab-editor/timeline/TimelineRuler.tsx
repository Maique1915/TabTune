"use client";

import React from "react";
import { formatTimeMs } from "@/lib/timeline/utils";

interface TimelineRulerProps {
  totalDuration: number; // em ms
  zoom: number;          // px por segundo
}

export function TimelineRuler({ totalDuration, zoom }: TimelineRulerProps) {
  // Use a slightly larger interval to match the "clean" look
  const getInterval = () => {
    if (zoom < 50) return 5000;
    if (zoom < 100) return 2000;
    if (zoom < 200) return 1000;
    return 500;
  };

  const interval = getInterval();
  const marks: number[] = [];

  // Extend slightly beyond total duration for better visual
  for (let time = 0; time <= totalDuration + 1000; time += interval) {
    marks.push(time);
  }

  const TRACK_LABEL_WIDTH = 128;

  return (
    <div className="relative h-8 bg-black/40 border-b border-white/5 select-none overflow-hidden sticky top-0 z-20 backdrop-blur-sm">
      {/* Label Area Background */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-black/20 border-r border-white/5 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]" />

      {marks.map((time) => {
        const x = TRACK_LABEL_WIDTH + (time / 1000) * zoom;
        const isSecond = time % 1000 === 0;

        return (
          <div
            key={time}
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${x}px` }}
          >
            {/* Tick Mark */}
            <div
              className={`absolute top-0 w-px bg-white/20 ${isSecond ? 'h-3' : 'h-1.5'}`}
            />

            {/* Time Label */}
            {isSecond && (
              <span className="absolute top-4 text-[10px] font-mono text-gray-500 font-medium -translate-x-1/2 whitespace-nowrap">
                {formatTimeMs(time)}
              </span>
            )}

            {/* Grid Line (subtle) */}
            {isSecond && (
              <div className="absolute top-8 w-px h-[1000px] bg-white/5 -z-10" />
            )}
          </div>
        );
      })}
    </div>
  );
}

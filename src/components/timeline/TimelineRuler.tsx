"use client";

import React from "react";
import { formatTimeMs } from "@/lib/timeline/utils";

interface TimelineRulerProps {
  totalDuration: number; // em ms
  zoom: number;          // px por segundo
}

export function TimelineRuler({ totalDuration, zoom }: TimelineRulerProps) {
  const totalWidth = (totalDuration / 1000) * zoom;
  
  // Define intervalo de marcações baseado no zoom
  const getInterval = () => {
    if (zoom < 50) return 5000;  // 5s
    if (zoom < 100) return 2000; // 2s
    if (zoom < 200) return 1000; // 1s
    return 500; // 0.5s
  };

  const interval = getInterval();
  const marks: number[] = [];
  
  for (let time = 0; time <= totalDuration; time += interval) {
    marks.push(time);
  }

  return (
    <div className="relative h-8 bg-muted/30 border-b border-border">
      {marks.map((time) => {
        const x = (time / 1000) * zoom;
        const isSecond = time % 1000 === 0;
        
        return (
          <div
            key={time}
            className="absolute top-0 bottom-0 flex flex-col items-start justify-end"
            style={{ left: `${x}px` }}
          >
            {/* Linha vertical */}
            <div 
              className={`w-px bg-border ${isSecond ? 'h-full' : 'h-2'}`}
            />
            
            {/* Label de tempo (só nos segundos) */}
            {isSecond && (
              <span className="absolute -top-1 text-[10px] text-muted-foreground -translate-x-1/2 left-0">
                {formatTimeMs(time)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

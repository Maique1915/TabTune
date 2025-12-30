
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ScoreData, NoteData, RenderConfig } from '../types';

interface PianoRollProps {
  score: ScoreData;
  isPlaying: boolean;
  currentTime: number; // Current playback time in ticks
  onSeek: (ticks: number) => void;
}

const PianoRoll: React.FC<PianoRollProps> = ({ score, isPlaying, currentTime, onSeek }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Configuration for rendering
  const config: RenderConfig = useMemo(() => {
    const pitches = score.notes.map(n => n.pitch);
    const minPitch = Math.max(0, Math.min(...pitches) - 5);
    const maxPitch = Math.min(127, Math.max(...pitches) + 5);
    
    return {
      pixelsPerTick: 0.5, // How "stretched" the time axis is
      pixelsPerPitch: 12, // Height of each note
      minPitch,
      maxPitch
    };
  }, [score]);

  const viewWidth = score.totalTicks * config.pixelsPerTick + 200;
  const viewHeight = (config.maxPitch - config.minPitch + 1) * config.pixelsPerPitch;

  // Draw static elements (the notes background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = viewWidth;
    canvas.height = viewHeight;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Draw pitch lines (piano keys background)
    for (let p = config.minPitch; p <= config.maxPitch; p++) {
      const isBlackKey = [1, 3, 6, 8, 10].includes(p % 12);
      ctx.fillStyle = isBlackKey ? '#1e293b' : '#0f172a';
      const y = (config.maxPitch - p) * config.pixelsPerPitch;
      ctx.fillRect(0, y, viewWidth, config.pixelsPerPitch);
      
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(viewWidth, y);
      ctx.stroke();
    }

    // Draw measure lines
    const ticksPerMeasure = score.divisions * 4;
    for (let t = 0; t <= score.totalTicks; t += ticksPerMeasure) {
      const x = t * config.pixelsPerTick;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, viewHeight);
      ctx.stroke();
    }

    // Draw notes
    score.notes.forEach(note => {
      const x = note.startTime * config.pixelsPerTick;
      const y = (config.maxPitch - note.pitch) * config.pixelsPerPitch;
      const w = note.duration * config.pixelsPerTick;
      const h = config.pixelsPerPitch - 2;

      // Color based on pitch or staff
      const hue = (note.pitch * 137.5) % 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.5)`;
      
      // Rounded rect for notes
      ctx.beginPath();
      ctx.roundRect(x, y + 1, w, h, 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

  }, [score, config, viewWidth, viewHeight]);

  // Handle auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      const x = currentTime * config.pixelsPerTick;
      const containerWidth = containerRef.current.clientWidth;
      const scrollPos = x - containerWidth / 3;
      containerRef.current.scrollLeft = Math.max(0, scrollPos);
    }
  }, [currentTime, config.pixelsPerTick]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const ticks = clickX / config.pixelsPerTick;
    onSeek(Math.max(0, Math.min(score.totalTicks, ticks)));
  };

  const playheadX = currentTime * config.pixelsPerTick;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
      {/* Header with Title */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center z-10">
        <div>
          <h2 className="text-xl font-bold text-blue-400">{score.title}</h2>
          <p className="text-sm text-slate-400">{score.composer}</p>
        </div>
        <div className="text-right">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Playback Progress</span>
            <div className="text-lg font-mono text-blue-300">
                {Math.floor(currentTime / score.divisions)} : {Math.floor((currentTime % score.divisions) / (score.divisions/4))}
            </div>
        </div>
      </div>

      {/* Main Piano Roll Area */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-auto relative cursor-crosshair"
        onClick={handleContainerClick}
      >
        <div 
          className="relative" 
          style={{ width: viewWidth, height: viewHeight }}
        >
          {/* Static Background Canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0"
          />

          {/* Animated Playhead Overlay */}
          <div 
            className="absolute top-0 w-0.5 h-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] z-20 pointer-events-none transition-transform duration-75 ease-linear"
            style={{ 
              transform: `translateX(${playheadX}px)`,
            }}
          >
             <div className="absolute top-0 -left-1.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-slate-900 shadow-lg" />
          </div>

          {/* Active Note Highlights (Notes being played right now) */}
          {score.notes
            .filter(n => currentTime >= n.startTime && currentTime <= n.startTime + n.duration)
            .map((note, i) => {
                const x = note.startTime * config.pixelsPerTick;
                const y = (config.maxPitch - note.pitch) * config.pixelsPerPitch;
                const w = note.duration * config.pixelsPerTick;
                const h = config.pixelsPerPitch - 2;
                return (
                    <div 
                        key={i}
                        className="absolute bg-white/40 ring-2 ring-white/60 rounded-sm pointer-events-none z-10"
                        style={{
                            left: x,
                            top: y + 1,
                            width: w,
                            height: h
                        }}
                    />
                );
            })
          }
        </div>
      </div>

      {/* Mini Progress Bar at bottom */}
      <div className="h-1 bg-slate-800 w-full relative group cursor-pointer" onClick={handleContainerClick}>
          <div 
            className="h-full bg-blue-500 transition-all duration-100" 
            style={{ width: `${(currentTime / score.totalTicks) * 100}%` }}
          />
      </div>
    </div>
  );
};

export default PianoRoll;

"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Play, Pause, Film, Music, Upload, Check } from "lucide-react";
import { useAppContext } from "@/app/context/app--context";

interface TimelineControlsProps {
  isAnimating: boolean;
  isPaused: boolean;
  ffmpegLoaded: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
  isTimelineEmpty: boolean;
  onAudioUpload: (file: File) => void;
  audioUploaded: boolean;
}

export function TimelineControls({
  isAnimating,
  isPaused,
  ffmpegLoaded,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo,
  isTimelineEmpty,
  onAudioUpload,
  audioUploaded
}: TimelineControlsProps) {
  const { isRendering } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex items-center justify-between gap-4">
      {/* Esquerda: Play/Pause e Áudio */}
      <div className="flex items-center gap-2">
        {/* Botão Play/Pause */}
        <Button
          className={`
            relative overflow-hidden transition-all duration-300
            font-black text-[10px] uppercase tracking-wider rounded-lg
            h-9 px-6 flex items-center gap-2
            ${isAnimating && !isPaused
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
              : 'bg-cyan-500 text-black border border-cyan-400 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
            }
          `}
          onClick={() => {
            if (isAnimating && !isPaused) {
              handlePause();
            } else {
              isPaused ? handleResume() : handleAnimate();
            }
          }}
          disabled={isTimelineEmpty}
        >
          {isAnimating && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </>
          )}
        </Button>

        {/* Botão de upload de áudio */}
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              onAudioUpload(file);
            }
          }}
          disabled={audioUploaded}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10 rounded-lg transition-all flex items-center justify-center p-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={audioUploaded}
          title={audioUploaded ? "Áudio já adicionado" : "Adicionar áudio à timeline"}
        >
          {audioUploaded ? <Check className="w-4 h-4 text-green-500" /> : <Music className="w-4 h-4" />}
        </Button>

      </div>

      <Button
        className="h-9 px-4 bg-black/40 hover:bg-black/60 text-slate-300 border border-white/10 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all hover:border-cyan-500/50 hover:text-cyan-400 flex items-center gap-2"
        onClick={handleRenderVideo}
        disabled={isTimelineEmpty || !ffmpegLoaded || isRendering}
        title={isTimelineEmpty ? "Adicione clips na timeline primeiro" : "Renderizar vídeo MP4"}
      >
        <Film className="w-3 h-3" />
        {!ffmpegLoaded
          ? "Carregando..."
          : isRendering
            ? "Renderizando..."
            : "Render"}
      </Button>
    </div >
  );
}
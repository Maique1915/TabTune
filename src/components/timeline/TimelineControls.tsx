"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Film } from "lucide-react";
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
}

  isAnimating,
  isPaused,
  ffmpegLoaded,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo,
  isTimelineEmpty,
}: TimelineControlsProps) {
  const { isRendering } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-foreground hover:bg-primary/50 hover:text-primary-foreground"
        onClick={() => {
          if (isAnimating && !isPaused) {
            handlePause();
          } else {
            isPaused ? handleResume() : handleAnimate();
          }
        }}
        disabled={isTimelineEmpty}
      >
        {isAnimating && !isPaused ? <Pause /> : <Play />}
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
        size="sm"
        className="whitespace-nowrap"
        onClick={() => fileInputRef.current?.click()}
        disabled={audioUploaded}
        title={audioUploaded ? "Áudio já adicionado" : "Adicionar áudio à timeline"}
      >
        {audioUploaded ? "Áudio adicionado" : "Adicionar áudio"}
      </Button>

      <Button 
        variant="default" 
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap px-4"
        onClick={handleRenderVideo}
        disabled={isTimelineEmpty || !ffmpegLoaded || isRendering}
        title={isTimelineEmpty ? "Adicione clips na timeline primeiro" : "Renderizar vídeo MP4"}
      >
        {!ffmpegLoaded 
          ? "Carregando FFmpeg..."
          : isRendering 
          ? "Renderizando..." 
          : "Renderizar MP4"}
      </Button>
    </div>
  );
}
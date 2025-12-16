// src/lib/timeline/clips.ts
import type { ChordDiagramProps, ChordWithTiming } from "@/lib/types";
import type { TimelineClip as TimelineClipType, AudioClip, ChordClip } from "./types";
import type { VideoCanvasStageRef } from "@/components/app/video-canvas-stage"; // Para tipagem da ref
import { drawStaticFingersAnimation } from "@/lib/static-fingers-drawer";
import { drawCarouselAnimation } from "@/lib/carousel-drawer";
import type { ChordDiagramColors, AnimationType } from "@/app/context/app--context";

// Interfaces para os contextos que as classes de clipe podem precisar
export interface LoopContext {
  videoCanvasStageRef?: React.RefObject<VideoCanvasStageRef>;
  // Adicione outras propriedades que o loop principal pode passar para os clipes
  // Ex: globalAudioDurationMs, playGlobalAudio, etc.
  // Por enquanto, vamos manter simples e passar explicitamente o que VideoCanvasStage precisa.
  colors: ChordDiagramColors;
  animationType: AnimationType;
  transitionsEnabled: boolean;
  buildEnabled: boolean;
  getSegmentDurationSec: (chord: ChordWithTiming) => number; // Função para calcular a duração do segmento de acorde
  currentTimeMs: number; // O tempo atual do loop principal
  totalTimelineDurationMs: number; // Duração total da timeline
  isPlaying: boolean; // NOVO: Estado global de reprodução
}

export interface TimelineClipInstance extends TimelineClipType {
  update(loopContext: LoopContext): void;
  // Adicione quaisquer outros métodos ou propriedades que você considere comuns ou necessários
}

export class TimelineChord implements TimelineClipInstance {
  id: string;
  start: number;
  duration: number;
  type: 'chord';
  chord: ChordDiagramProps;
  chordWithTiming: ChordWithTiming;

  constructor(clip: ChordClip, chordWithTiming: ChordWithTiming) {
    this.id = clip.id;
    this.start = clip.start;
    this.duration = clip.duration;
    this.type = clip.type;
    this.chord = clip.chord;
    this.chordWithTiming = chordWithTiming;
  }

  update(loopContext: LoopContext): void {
    const { videoCanvasStageRef, colors, animationType, transitionsEnabled, buildEnabled, getSegmentDurationSec, currentTimeMs, totalTimelineDurationMs } = loopContext;

    // Se o clipe de acorde estiver no período de exibição na timeline
    if (currentTimeMs >= this.start && currentTimeMs <= this.start + this.duration) {
      const elapsedSinceClipStart = currentTimeMs - this.start;
      
      // Lógica de cálculo de estado da animação (copiada do VideoCanvasStage.computeStateAtTimeMs)
      // Esta parte da lógica está duplicada. Idealmente, o VideoCanvasStage faria o computeStateAtTimeMs
      // e o TimelineChord apenas fornecería os dados para o VideoCanvasStage.renderAtTime
      // Por enquanto, para fazer o renderAtTime do videoCanvasStageRef funcionar, precisamos simular.
      if (!videoCanvasStageRef?.current?.canvasRef?.current) return;

      const canvas = videoCanvasStageRef.current.canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Limpar o canvas antes de desenhar o frame do acorde atual
      ctx.clearRect(0, 0, width, height);


      const buildDurationSec = 1.0; // Hardcoded por enquanto, pode vir de constantes ou props
      const halfTransitionSec = (animationType === "carousel" ? 1.0 : 0.8) / 2; // Hardcoded por enquanto

      const buildMsBase = (buildEnabled ? buildDurationSec : 0) * 1000;
      let cursor = 0;
      const t = Math.max(0, elapsedSinceClipStart); // Tempo relativo ao início do clipe

      let animationState = null;

      if (animationType === "static-fingers") {
        const segmentMs = this.duration; // Duração do próprio clipe
        const incomingHalfMs = 0; // Não há transição "incoming" para um clipe individual
        const outgoingHalfMs = 0; // Não há transição "outgoing" para um clipe individual
        const staticMs = segmentMs; // O clipe inteiro é estático
        
        // No contexto de um clipe individual, a animação de build acontece no início
        const buildMs = Math.min(buildMsBase, staticMs);
        const holdMs = Math.max(0, staticMs - buildMs);

        if (buildMs > 0 && t < cursor + buildMs) {
          animationState = { chordIndex: 0, transitionProgress: 0, buildProgress: (t - cursor) / buildMs };
        } else if (t < cursor + holdMs) {
          animationState = { chordIndex: 0, transitionProgress: 0, buildProgress: 1 };
        } else {
          animationState = { chordIndex: 0, transitionProgress: 0, buildProgress: 1 };
        }

      } else { // Carousel (ou outros)
        animationState = { chordIndex: 0, transitionProgress: 0, buildProgress: 1 }; // Renderizar estaticamente por enquanto
      }

      if (animationState) {
        // Mapear o chordIndex do clipe para um array de um único elemento
        const chordsArray = [this.chordWithTiming];
        const currentChordData = chordsArray[0];

        if (animationType === "static-fingers") {
          drawStaticFingersAnimation({
            ctx,
            currentChord: currentChordData.chord,
            nextChord: null, // Sem próximo acorde para um clipe individual
            transitionProgress: animationState.transitionProgress,
            colors,
            dimensions: { width, height },
            buildProgress: animationState.buildProgress,
          });
        } else {
          drawCarouselAnimation({
            ctx,
            currentChord: currentChordData.chord,
            nextChord: null, // Sem próximo acorde para um clipe individual
            transitionProgress: animationState.transitionProgress,
            colors,
            dimensions: { width, height },
          });
        }
      }
    } else {
        // Se o clipe não estiver no período atual, garantir que o canvas não o mostre
        // Isso pode ser feito de forma mais inteligente limpando apenas a área do clipe
        // ou deixando o VideoCanvasStage gerenciar o `clearRect` principal.
        // Por enquanto, vamos supor que o VideoCanvasStage fará um clear completo a cada frame.
    }
  }
}

export class TimelineAudio implements TimelineClipInstance {
  id: string;
  start: number;
  duration: number;
  type: 'audio';
  fileName: string;
  audioUrl: string;
  waveform: number[];
  
  private _audioContext: AudioContext;
  private _audioBuffer: AudioBuffer | null = null;
  private _sourceNode: AudioBufferSourceNode | null = null;
  private _offset: number = 0; // Posição atual em segundos no clipe
  private _startedAt: number = 0; // Timestamp do contexto de áudio quando começou a tocar
  private _isPlaying: boolean = false;


  constructor(
    clip: AudioClip, 
    audioContext: AudioContext, // Receber o AudioContext do useTimelinePlayer
  ) {
    this.id = clip.id;
    this.start = clip.start;
    this.duration = clip.duration;
    this.type = clip.type;
    this.fileName = clip.fileName;
    this.audioUrl = clip.audioUrl;
    this.waveform = clip.waveform;
    this._audioContext = audioContext;
    this._loadAudioBuffer(clip.audioUrl);
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get currentOffsetMs(): number {
    if (this._isPlaying && this._audioContext) {
      return (this._audioContext.currentTime - this._startedAt) * 1000;
    }
    return this._offset * 1000;
  }

  private async _loadAudioBuffer(audioUrl: string): Promise<void> {
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      this._audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("Error loading audio buffer for TimelineAudio:", error);
      this._audioBuffer = null;
    }
  }

  play(startTimeMs?: number): void {
    if (!this._audioBuffer) {
      console.warn("No audio buffer loaded for this TimelineAudio instance.");
      return;
    }

    this.stop(); // Parar qualquer reprodução anterior

    this._sourceNode = this._audioContext.createBufferSource();
    this._sourceNode.buffer = this._audioBuffer;
    this._sourceNode.connect(this._audioContext.destination);

    const startOffsetSeconds = startTimeMs !== undefined ? startTimeMs / 1000 : this._offset;
    this._sourceNode.start(0, startOffsetSeconds);
    this._startedAt = this._audioContext.currentTime - startOffsetSeconds;
    this._isPlaying = true;
    console.log(`TimelineAudio ${this.id} playing from offset ${startOffsetSeconds}`);

    this._sourceNode.onended = () => {
      this.stop();
      console.log(`TimelineAudio ${this.id} ended.`);
    };
  }

  pause(): void {
    if (this._isPlaying && this._audioContext && this._sourceNode) {
      this._sourceNode.stop();
      this._offset = this._audioContext.currentTime - this._startedAt; // Salva o offset em segundos
      this._isPlaying = false;
      console.log(`TimelineAudio ${this.id} paused at offset ${this._offset}`);
    }
  }

  stop(): void {
    if (this._sourceNode) {
      this._sourceNode.stop();
      this._sourceNode.disconnect();
      this._sourceNode = null;
    }
    this._offset = 0;
    this._startedAt = 0;
    this._isPlaying = false;
    console.log(`TimelineAudio ${this.id} stopped.`);
  }

  seek(progress: number): void {
    if (!this._audioBuffer) return;
    const newOffsetSeconds = this._audioBuffer.duration * progress;
    this._offset = newOffsetSeconds;
    console.log(`TimelineAudio ${this.id} seeked to progress ${progress} (${newOffsetSeconds}s).`);

    if (this._isPlaying) {
      this.play(newOffsetSeconds * 1000);
    }
  }

  update(loopContext: LoopContext): void {
    const { currentTimeMs, isPlaying: globalIsPlaying } = loopContext;

    const clipEndTimeMs = this.start + this.duration;

    // Se o player global está tocando
    if (globalIsPlaying) {
      // Se o tempo atual está dentro dos limites deste clipe de áudio
      if (currentTimeMs >= this.start && currentTimeMs < clipEndTimeMs) {
        const expectedOffsetMs = currentTimeMs - this.start;
        const actualOffsetMs = this.currentOffsetMs;

        // Se o clipe não estiver tocando ou estiver fora de sincronia (>100ms)
        if (!this._isPlaying || Math.abs(expectedOffsetMs - actualOffsetMs) > 100) {
          console.log(`TimelineAudio ${this.id} (re)playing to sync. Expected: ${expectedOffsetMs}, Actual: ${actualOffsetMs}`);
          this.play(expectedOffsetMs);
        }
      } else if (this._isPlaying) {
        // Se o clipe estava tocando mas o tempo atual saiu do seu range
        console.log(`TimelineAudio ${this.id} stopping as current time ${currentTimeMs} is out of clip range (${this.start}-${clipEndTimeMs}).`);
        this.stop();
      }
    } else {
      // Se o player global não está tocando, garantir que este clipe de áudio esteja parado
      if (this._isPlaying) {
        console.log(`TimelineAudio ${this.id} pausing as global player is not playing.`);
        this.pause();
      }
    }
  }
}

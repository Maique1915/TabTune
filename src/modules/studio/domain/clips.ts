// src/lib/timeline/clips.ts
import type { ChordDiagramProps, ChordWithTiming } from "@/modules/core/domain/types";
import type { TimelineClip as TimelineClipType, AudioClip, ChordClip } from "./types";
import { drawStaticFingersAnimation } from "@/modules/engine/infrastructure/drawers/static-fingers-drawer";
import { drawCarouselAnimation } from "@/modules/engine/infrastructure/drawers/carousel-drawer";
import type { ChordDiagramColors, AnimationType } from "@/app/context/app--context";

// Interfaces para os contextos que as classes de clipe podem precisar
export interface LoopContext {
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

export type TimelineClipInstance = TimelineClipType & {
  update(loopContext: LoopContext): void;
  // Adicione quaisquer outros métodos ou propriedades que você considere comuns ou necessários
};

export class TimelineChord {
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
    // A lógica de renderização do acorde agora é centralizada no VideoCanvasStage.renderAtTime.
    // O método update do clipe de acorde não precisa fazer nada no loop principal,
    // pois sua representação visual é totalmente determinada pelo tempo.
  }
}

export class TimelineAudio {
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

/**
 * 🎬 Timeline Types
 * Sistema de timeline horizontal para controle de tempo dos acordes
 */

import type { ChordDiagramProps } from "@/lib/types";

export type ClipType = 'chord' | 'audio' | 'symbol' | 'score';

export interface ScoreNote {
  keys: string[]; // e.g., ["c/4"]
  duration: string; // "w", "h", "q", "8", "16"
  positions?: { str: number; fret: number }[]; // For tablature
  dots?: number;
  clef?: string;
  isRest?: boolean;
}

export interface ScoreClip extends BaseClip {
  type: 'score';
  name?: string;
  notes: ScoreNote[];
  clef?: string;
  timeSignature?: string;
  keySignature?: string;
}

/**
 * Base interface for all timeline clips
 */
export interface BaseClip {
  id: string;
  start: number;    // tempo de início em ms
  duration: number; // duração em ms
}

/**
 * Represents a musical symbol clip (notes, clefs, etc.)
 */
export interface SymbolClip extends BaseClip {
  type: 'symbol';
  name: string; // e.g., "Treble Clef"
  vexFlowProps: any; // Props to pass to VexFlowIcon
}

/**
 * Represents a chord clip on the timeline
 */
export interface ChordClip extends BaseClip {
  type: 'chord';
  chord: ChordDiagramProps;
  finalChord?: ChordDiagramProps; // Pre-calculated transposed chord
  transportDisplay?: number;    // Pre-calculated transpose display value
}

/**
 * Represents an audio clip on the timeline
 */
export interface AudioClip extends BaseClip {
  type: 'audio';
  fileName: string;
  audioUrl: string;
  waveform: number[];
}

// A clip can be one of the defined types
export type TimelineClip = ChordClip | AudioClip | SymbolClip | ScoreClip;

/**
 * Representa uma track (faixa/layer) na timeline
 */
export interface TimelineTrack {
  id: string;
  name: string;
  type: ClipType; // Tracks are typed now
  clips: TimelineClip[];
}

/**
 * Estado completo da timeline
 */
export interface TimelineState {
  tracks: TimelineTrack[];
  totalDuration: number; // duração total em ms
  zoom: number;          // nível de zoom (px por segundo)
}

/**
 * Informações sobre o clip sendo arrastado/redimensionado
 */
export interface DragState {
  clipId: string;
  trackId: string;
  startX: number;
  initialStart: number;
  initialDuration: number;
  mode: 'move' | 'resize-left' | 'resize-right';
}

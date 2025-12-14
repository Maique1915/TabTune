/**
 * 🎬 Timeline Types
 * Sistema de timeline horizontal para controle de tempo dos acordes
 */

import type { ChordDiagramProps } from "@/lib/types";

export type ClipType = 'chord' | 'audio';

/**
 * Base interface for all timeline clips
 */
export interface BaseClip {
  id: string;
  start: number;    // tempo de início em ms
  duration: number; // duração em ms
}

/**
 * Represents a chord clip on the timeline
 */
export interface ChordClip extends BaseClip {
  type: 'chord';
  chord: ChordDiagramProps;
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
export type TimelineClip = ChordClip | AudioClip;

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

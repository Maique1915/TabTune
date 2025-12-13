/**
 * 🎬 Timeline Types
 * Sistema de timeline horizontal para controle de tempo dos acordes
 */

import type { ChordDiagramProps } from "@/lib/types";

/**
 * Representa um clip (bloco) de acorde na timeline
 */
export interface TimelineClip {
  id: string;
  chord: ChordDiagramProps;
  start: number;    // tempo de início em ms
  duration: number; // duração em ms (tempo que fica fixo)
}

/**
 * Representa uma track (faixa/layer) na timeline
 */
export interface TimelineTrack {
  id: string;
  name: string;
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

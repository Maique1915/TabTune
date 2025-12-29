
export type Duration = 'w' | 'h' | 'q' | '8' | '16' | '32';
export type Accidental = 'none' | '#' | '##' | 'b' | 'bb' | 'n';

export interface NoteDecorator {
  staccato?: boolean;
  accent?: boolean;
  marcato?: boolean;
  tenuto?: boolean;
  dot?: boolean;
}

export interface NoteData {
  id: string;
  fret: string;
  string: string;
  duration: Duration;
  accidental?: Accidental;
  type: 'note' | 'rest';
  decorators: NoteDecorator;
  technique?: string; // h, p, s, b, v, etc.
  slideTargetId?: string; // Explicitly link to another note for techniques
  tuplet?: string;
  isSlurred?: boolean;
}

export interface MeasureData {
  id: string;
  notes: NoteData[];
  isCollapsed?: boolean;
  showClef?: boolean;
  showTimeSig?: boolean;
}

export interface GlobalSettings {
  clef: 'treble' | 'bass' | 'alto' | 'tenor';
  key: string;
  time: string;
  bpm: number;
  showNotation: boolean;
  showTablature: boolean;
}

export type TransitionType = 'snap' | 'slide' | 'fade' | 'assemble';

export interface ScoreStyle {
  paperColor: string;
  inkColor: string; // Used as base/fallback
  lineColor: string;
  shadowIntensity: number;
  glowEffect: boolean;
  scale: number;
  staveSpace: number;
  // Component colors
  clefColor: string;
  timeSigColor: string;
  noteColor: string;
  restColor: string;
  // Animation settings
  playheadColor: string;
  activeNoteColor: string;
  transitionType: TransitionType;
}

export const DEFAULT_SCORE_STYLE: ScoreStyle = {
  paperColor: '#ffffff',
  inkColor: '#334155',
  lineColor: '#cbd5e1',
  shadowIntensity: 10,
  glowEffect: true,
  scale: 1.0,
  staveSpace: 20,
  clefColor: '#0f172a',
  timeSigColor: '#0f172a',
  noteColor: '#0f172a',
  restColor: '#64748b',
  playheadColor: '#06b6d4',
  activeNoteColor: '#22d3ee',
  transitionType: 'assemble'
};

export interface ScoreState {
  measures: MeasureData[];
  selectedNoteIds: string[];
  settings: GlobalSettings;
  style: ScoreStyle;
}


export interface ScoreTheme {
  clefs: string;
  timeSignature: string;
  notes: string;
  rests: string;
  tabNumbers: string;
  symbols: string;
  staffLines: string;
  background: string;
}

export type Duration = 'w' | 'h' | 'q' | '8' | '16' | '32';
export type Clef = 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';

export interface NoteData {
  id: string;
  keys: string[];
  duration: Duration;
  isRest: boolean;
  tabPositions?: { str: number; fret: number }[];
}

export interface Measure {
  id: string;
  notes: NoteData[];
  clef: Clef;
  timeSignature: string;
}

export interface ScoreData {
  measures: Measure[];
}

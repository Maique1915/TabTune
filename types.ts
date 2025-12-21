
export interface ChordPosition {
  string: number; // 1-6 (E to e)
  fret: number;   // 0-24
  finger?: number; // 1-4
}

export interface Chord {
  id: string;
  name: string;
  positions: ChordPosition[];
  barre?: {
    fret: number;
    startString: number;
    endString: number;
  };
  startFret?: number;
}

export interface TimelineEvent {
  id: string;
  chordId: string;
  startTime: number; // in seconds
  duration: number; // in seconds
}

export enum AnimationStyle {
  CAROUSEL = 'CAROUSEL',
  STATIC = 'STATIC'
}

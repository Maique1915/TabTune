import data from './chords.json';

export type Fingering = {
  stringIndex: number;
  fretIndex: number;
  finger?: string;
};

export type Chord = {
  id: string;
  name: string;
  fingerings: Fingering[];
};

export const CHORDS: Chord[] = data.chords;

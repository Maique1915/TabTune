
export interface FretboardTheme {
  cardColor: string;
  fretboardColor: string;
  fretColor: string;
  borderColor: string;
  textColor: string;
  fingerColor: string;
  fingerTextColor: string;
  fingerBorderColor: string;
  fingerBorderWidth: number;
  fingerBackgroundAlpha: number;
  chordNameColor: string;
  accentColor: string;
  rotation?: number;
  mirror?: boolean;
}

export interface FingerPosition {
  string: number;
  fret: number;
  finger?: number | string;
  endString?: number;
}

export interface ChordDiagramProps {
  chord?: string;
  fingers: FingerPosition[];
  avoid?: number[];
  stringNames?: string[];
}

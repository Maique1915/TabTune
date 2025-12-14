export interface BarreInfo {
  fret: number;
  fromString: number;
  toString: number;
  finger?: number;
}

export interface ChordWithTiming {
  chord: ChordDiagramProps;
  duration: number; // duração em ms
}

export interface Achord {
  note: number;
  complement: number;
  bass: number;
}

export type Position = { [key: number]: [number, number, number] };

export interface nutForm {
  vis: boolean;
  str: [number, number];
  pos: number;
  fin: number;
  add: boolean;
  trn: number;
}

export interface ChordDiagramProps {
  chord: Achord;
  origin: number;
  positions: Position;
  barre?: [number, number];
  avoid: number[];
  scale?: number;
  transport?: number;
  nut: nutForm;
  add?: Position;
  list?: boolean;
  ffinger?: number;
  flat?: boolean;
  transition?: number;
}
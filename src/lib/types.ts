export interface BarreInfo {
  fret: number;
  fromString: number;
  toString: number;
  finger?: number;
}

export interface ChordWithTiming {
  chord: ChordDiagramProps; // Original chord data
  duration: number; // in ms
  finalChord: ChordDiagramProps; // Pre-calculated transposed chord for display
  transportDisplay: number;    // Pre-calculated transpose display value
}

export interface Achord {
  note: number;
  complement: number;
  bass: number;
}

export type Position = { [key: number]: [number, number, number] };

export interface nutForm {
  vis: boolean; // Se a pestana é visível
  str: [number, number]; // Cordas que a pestana abrange (ex: [1, 5] para cordas 1 a 5)
  pos: number; // Posição do traste (casa) onde a pestana está
  fin: number; // Dedo usado para a pestana
  add: boolean; // Informação adicional (uso específico não claro)
  trn: number; // Transposição
}

export interface ChordDiagramProps {
  chord: Achord;
  origin: number;
  positions: Position;
  avoid: number[];
  scale?: number;
  transport?: number;
  nut: nutForm; // Define a pestana (barre) do acorde.
  add?: Position;
  list?: boolean;
  ffinger?: number;
  flat?: boolean;
  transition?: number;
}
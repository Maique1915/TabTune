
export interface NoteData {
  type: 'note' | 'rest';
  pitch: number;
  startTime: number; // in ticks
  duration: number; // in ticks
  staff: number;
  voice: number;
  measureIndex: number;
  accidental?: string;
  articulations?: string[];
  isDotted?: boolean;
  tupletId?: string; // Para identificar notas de uma mesma tercina
  slurIds?: { id: number; type: 'start' | 'stop' }[];
}

export interface ScoreData {
  title: string;
  composer: string;
  notes: NoteData[];
  totalTicks: number;
  tempo: number; 
  divisions: number; 
  timeSignature: { num: number; den: number };
}

export interface RenderConfig {
  pixelsPerTick: number;
  pixelsPerPitch: number;
  minPitch: number;
  maxPitch: number;
}

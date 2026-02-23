
export type NoteType = 'normal' | 'ghost' | 'diamond' | 'square';
export type Articulation = 'none' | 'hammer' | 'pull' | 'slide' | 'bend' | 'bend-release' | 'tap' | 'vibrato';

export interface NotePosition {
    stringIndex: number; // 0 (High E) to 5 (Low E)
    fret: number;
    articulation?: Articulation;
}

export interface Note {
    id: string;
    positions: NotePosition[];
    time: number; // in seconds
    duration: number; // in seconds
    type?: NoteType;
    articulation?: Articulation;
}

export interface Song {
    title: string;
    bpm: number;
    notes: Note[];
    duration: number;
}

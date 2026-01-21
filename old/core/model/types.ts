
export type InstrumentType = 'guitar' | 'bass' | 'ukulele' | 'custom';

export interface Note {
    fret: number;
    string: number; // 1-indexed (1 is high E)
    duration: number; // in beats
    velocity?: number;
    effect?: string; // e.g., 'slide', 'bend'
}

export interface Clip {
    id: string;
    start: number; // start time in beats
    duration: number; // duration in beats
    data: Note[];
    type: 'midi' | 'tab';
}

export interface Track {
    id: string;
    name: string;
    type: InstrumentType | 'text' | 'backing-track';
    clips: Clip[];
    settings: {
        tuning?: number[]; // Open string MIDI notes
        capo?: number;
        color?: string;
    };
}

export interface ProjectData {
    id: string;
    name: string;
    bpm: number;
    timeSignature: [number, number];
    tracks: Track[];
    duration: number; // total duration in seconds or beats
}

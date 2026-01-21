// Standardized Position for all contexts
export interface StandardPosition {
    string: number; // 1-based start string
    endString?: number; // 1-based end string (if different from 'string', it's a barre)
    fret: number;
    finger?: number | string; // 0 = unknown/open, 1-4 = fingers, T = thumb
}

export interface BarreData {
    fret: number;
    startString: number;
    endString: number;
    finger?: number | string;
}

export interface ManualChordData {
    root: string;
    quality: string;
    bass?: string;
    extensions?: string[];
}

// Master Entity that represents a "Vertical Slice" of music on the fretboard
export interface MusicalEvent {
    id: string;
    // Rhythmic context
    duration?: string; // 'w', 'h', 'q', etc.
    type: 'note' | 'rest';

    // Harmonic identity
    chordName?: string;
    showChordName?: boolean; // Per-event control for chord name visibility

    // Physical Execution
    positions: StandardPosition[];

    // Techniques
    technique?: string;
}

// === LEGACY / THEORY TYPES ===

export interface Achord {
    note: number; // Nota do acorde
    complement: number; // Complemento do acorde
    extension: number[]; // Extensão do acorde
    bass: number; // Basso do acorde
}

export type Position = {
    [key: number]: [
        number, // finger
        number, // string
        number? // fret
    ]
};

export interface nutForm {
    vis: boolean; // Se a pestana é visível
    str: [number, number]; // Cordas que a pestana abrange (ex: [1, 5] para cordas 1 a 5)
    pos: number; // Posição do traste (casa) onde a pestana está
    fin: number; // Dedo usado para a pestana
    trn: number; // Transposição no dedo
}

export interface BarreInfo extends BarreData { }

export interface TabEffect {
    type: 'slide' | 'bend' | 'hammer' | 'pull' | 'vibrato' | 'tap';
    fromFret?: number;
    toFret?: number;
    string: number;
    duration?: number;
}

export interface ChordDiagramProps {
    chord: Achord;
    origin: number;
    fingers: StandardPosition[];
    avoid: number[];
    scale?: number;
    transport?: number;
    unique?: boolean;
    list?: boolean;
    stringNames?: string[];
    chordName?: string;
    showChordName?: boolean;
    capo?: number; // Visual Capo Fret (0 = none)
    extends?: any; // Extra data for interoperability (Fretboard/Editor specific properties)
}

export interface ChordWithTiming {
    chord: ChordDiagramProps; // Original chord data
    duration: number; // in ms
    finalChord: ChordDiagramProps; // Pre-calculated transposed chord for display
    transportDisplay: number;    // Pre-calculated transpose display value
    strumming?: 'down' | 'up' | 'pluck' | 'mute';
    effects?: TabEffect[];
}

export interface TabData {
    fret: number;
    str: number;
}

export interface MusicalNote {
    id: string;
    keys: string[];
    duration: string;
    type: 'note' | 'rest';
    ticks: number;
    startTime: number;
    accidentals: (string | null)[];
    dots: number;
    tabData?: TabData[];
}

export interface MusicalMeasure {
    number: number;
    notes: MusicalNote[];
    clef: string;
    keySignature: string;
    timeSignature: {
        numerator: number;
        denominator: number;
    };
    totalTicks: number;
    chordName?: string;
}


export interface ScoreData {
    title: string;
    composer: string;
    measures: MusicalMeasure[];
    tempo: number;
}

export interface FretboardTheme {
    cardColor: string;
    fingerColor: string;
    fretboardColor: string;
    fretboardShadow: boolean;
    fretboardShadowColor: string;
    borderColor: string;
    fretColor: string;
    textColor: string;
    chordNameColor: string;
    chordNameOpacity: number;
    chordNameShadow: boolean;
    chordNameShadowColor: string;
    chordNameShadowBlur: number;
    chordNameStrokeColor: string;
    chordNameStrokeWidth: number;
    borderWidth: number;
    stringThickness: number;
    fingerTextColor: string;
    fingerBorderColor: string;
    fingerBorderWidth: number;
    fingerBoxShadowHOffset: number;
    fingerBoxShadowVOffset: number;
    fingerBoxShadowBlur: number;
    fingerBoxShadowSpread: number;
    fingerBoxShadowColor: string;
    fingerBackgroundAlpha: number;
    fretboardScale: number;
    rotation: 0 | 90 | 270;
    mirror: boolean;
    // Capo Settings
    capoColor: string;
    capoBorderColor: string;
    capoShadow: boolean;
    capoShadowColor: string;
}

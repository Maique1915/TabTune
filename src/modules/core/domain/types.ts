// Standardized Position for all contexts
export interface StandardPosition {
    string: number; // 1-based start string
    endString?: number; // 1-based end string (if different from 'string', it's a barre)
    fret: number;
    finger?: number | string; // 0 = unknown/open, 1-4 = fingers, T = thumb
    avoid?: boolean;
}

export interface TimeSignature {
    numerator: number;
    denominator: number;
    bpm?: number;
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
    strumming?: 'down' | 'up' | 'pluck' | 'mute' | 'pause';
    strumMode?: 'strum' | 'hit' | 'mute';
    isStrong?: boolean;
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

// === THEME INTERFACES ===

export interface BorderStyle {
    color: string;
    width?: number;
}

export interface ElementStyle {
    color: string;
    border?: BorderStyle;
    opacity?: number;
    shadow?: {
        enabled?: boolean;
        color?: string;
        blur?: number;
        offsetX?: number;
        offsetY?: number;
    };
}

export interface TextStyle extends ElementStyle {
    stroke?: {
        color: string;
        width: number;
    };
    textColor?: string; // For things that have background + text (like fingers)
}

export interface FingersStyle extends TextStyle {
    radius: number;
    fontSize: number;
    barreWidth: number; // specialized for barres
    barreFingerRadius: number; // specialized for barres
}

export interface CapoStyle extends ElementStyle {
    textColor: string;
}

export interface ChordNameStyle extends TextStyle {
    fontSize: number;
    extSize: number;
}

export interface AvoidStyle extends ElementStyle {
    size: number;
    lineWidth: number;
}

export interface FretboardTheme {
    global: {
        backgroundColor: string; // was cardColor
        primaryTextColor: string; // was textColor
        scale: number;
        rotation: 0 | 90 | 270;
        mirror: boolean;
    };
    fretboard: {
        neck: ElementStyle; // fretboardColor
        frets: ElementStyle & { thickness?: number };
        strings: ElementStyle & { thickness: number }; // borderColor -> color
        board?: {
            inlays?: ElementStyle;
        };
    };
    fingers: FingersStyle; // color, border, shadow, textColor, opacity (backgroundAlpha)
    arrows?: TextStyle; // New property for dedicated arrow styling
    chordName: ChordNameStyle; // color, opacity, shadow, stroke
    capo: ElementStyle & {
        textColors: {
            name: string;
            number: string;
        };
    };
    avoid: AvoidStyle;
    head: ElementStyle & {
        textColors: {
            name: string;
        };
    };
}

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

export interface FretboardTimelineEvent {
    startTime: number;
    duration: number;
    chordName: string;
    positions: {
        string: number;
        fret: number;
        finger: number;
    }[];
    tuning?: string[];
    capo?: number;
}

export interface FretboardHistoryFile {
    version: number;
    settings: {
        tuning: string[];
        capo: number;
        numStrings: number;
        tuningShift?: number;
        bpm?: number;
        time?: {
            numerator: number;
            denominator: number;
        };
    };
    timeline: FretboardTimelineEvent[];
}

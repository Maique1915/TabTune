export interface BarreInfo {
    fret: number;
    fromString: number;
    toString: number;
    finger?: number;
}

export interface TabEffect {
    type: 'slide' | 'bend' | 'hammer' | 'pull' | 'vibrato' | 'tap';
    fromFret?: number;
    toFret?: number; // Target fret for slide/bend
    string: number;
    duration?: number; // relative duration within the chord 0-1
}

export interface ChordWithTiming {
    chord: ChordDiagramProps; // Original chord data
    duration: number; // in ms
    finalChord: ChordDiagramProps; // Pre-calculated transposed chord for display
    transportDisplay: number;    // Pre-calculated transpose display value
    strumming?: 'down' | 'up' | 'pluck' | 'mute';
    effects?: TabEffect[];
}

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

export interface ChordDiagramProps {
    chord: Achord; // Acorde original, sem transposição
    origin: number; // Transposição original
    positions: Position; // Posições dos dedos no acorde
    avoid: number[]; // Cordas a evitar
    scale?: number; // Escala
    nut?: nutForm; // Define a pestana (barre) do acorde.
    transport?: number; // Transposição
    unique?: boolean; // se o acord pode ser tranposto ou só funciona na posição original
    list?: boolean;
    stringNames?: string[]; // Custom names for strings (e.g., ["B", "E", "A", "D", "G", "C"])
    chordName?: string; // Manually or automatically named chord (e.g. "Cmaj7")
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
}

export interface ScoreData {
    title: string;
    composer: string;
    measures: MusicalMeasure[];
    tempo: number;
}

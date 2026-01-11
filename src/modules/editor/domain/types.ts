
export type { ManualChordData } from "@/modules/core/domain/types";
import { MusicalEvent, StandardPosition, BarreData, ManualChordData } from "@/modules/core/domain/types";

export type Duration = 'w' | 'h' | 'q' | '8' | '16' | '32';
export type Accidental = 'none' | '#' | '##' | 'b' | 'bb' | 'n';

export interface NoteDecorator {
    staccato?: boolean;       // a.
    staccatissimo?: boolean;   // av
    accent?: boolean;          // a>
    tenuto?: boolean;          // a-
    marcato?: boolean;         // a^
    pizzicato?: boolean;       // a+ (Left Hand)
    snapPizzicato?: boolean;   // ao
    fermataUp?: boolean;       // a@a (Up)
    fermataDown?: boolean;     // a@u (Down)
    bowUp?: boolean;           // a|
    bowDown?: boolean;         // am
    openNote?: boolean;            // ah
    dot?: boolean;
}

// NoteData now aligns with MusicalEvent
export interface NoteData extends Omit<MusicalEvent, 'type'> {
    // ID inherited

    // Editor specific duration (enum vs string)
    duration: Duration;

    // Type inherited but strictly typed here
    type: 'note' | 'rest';

    // Positions inherited (StandardPosition[])

    // Editor specifics
    accidental?: Accidental;
    decorators: NoteDecorator;
    noteHead?: 'standard' | 'x' | 'diamond' | 'square' | 'triangle' | 'slash' | 'cross' | 'circle' | 'triangle_inv' | 'arrow_down' | 'arrow_up' | 'slashed';

    slideTargetId?: string; // Explicitly link to another note for techniques
    tuplet?: string;
    isSlurred?: boolean;
    annotation?: string; // Text above/below note

    // Chord Identity (inherited chordName)
    manualChord?: ManualChordData; // The definition (root, quality, etc)

    // Barre (inherited from MusicalEvent as BarreData: all numbers)
}

export interface MeasureData {
    id: string;
    notes: NoteData[];
    isCollapsed?: boolean;
    showClef?: boolean;
    clef?: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
    showTimeSig?: boolean;
    // chord data moved to specific notes for granularity
}

export interface GlobalSettings {
    bpm: number;
    time: string;
    key: string;
    clef: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
    showNotation: boolean;
    showTablature: boolean;
    displayMode?: 'tab' | 'score' | 'both';
    numStrings?: number;
    tuning?: string[]; // Optional tuning array
    instrumentId?: string;
    tuningIndex?: number;
}

export type TransitionType = 'snap' | 'slide' | 'fade' | 'assemble';

// Adapted from NoteForge ScoreTheme
export interface ElementStyle {
    color: string;
    opacity: number;
    shadow: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    strokeColor?: string;
    strokeWidth?: number;
}

export interface ScoreStyle {
    // Core NoteForge properties (Refactored to ElementStyle)
    clefs: ElementStyle;
    timeSignature: ElementStyle;
    notes: ElementStyle;
    rests: ElementStyle;
    tabNumbers: ElementStyle;
    symbols: ElementStyle;
    staffLines: ElementStyle;

    background: string; // Used for "paperColor"

    // Legacy/Animation properties kept for App compatibility
    shadowIntensity: number;
    glowEffect: boolean;
    scale: number;
    transitionType: TransitionType;
    playheadColor: string;
    activeNoteColor: string;
    chordName: ElementStyle;

    // Legacy mapping (optional, or removed later)
    width?: number;
    staveSpace?: number;

    // View Transforms
    rotation?: 0 | 90 | 270;
    mirror?: boolean;
}

export const DEFAULT_SCORE_STYLE: ScoreStyle = {
    clefs: { color: '#ff9823ff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 10 },
    timeSignature: { color: '#ff9823ff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 10 },
    notes: { color: '#ffffffff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 12 },
    rests: { color: '#ffffffff', opacity: 0.8, shadow: false },
    tabNumbers: { color: '#ffffffff', opacity: 1, shadow: false },
    symbols: { color: '#ffffffff', opacity: 1, shadow: false },
    staffLines: { color: '#ffffffff', opacity: 0.4, shadow: false },
    chordName: {
        color: '#22d3ee',
        opacity: 1,
        shadow: true,
        shadowColor: '#22d3ee',
        shadowBlur: 10,
        strokeColor: '#000000',
        strokeWidth: 3
    },
    background: '#000000',
    playheadColor: '#ffffffff',
    activeNoteColor: '#ffffffff',
    shadowIntensity: 10,
    glowEffect: true,
    scale: 1,
    transitionType: 'snap',
    rotation: 0,
    mirror: false
};

export interface ScoreState {
    measures: MeasureData[];
    selectedNoteIds: string[];
    settings: GlobalSettings;
    style: ScoreStyle;
}

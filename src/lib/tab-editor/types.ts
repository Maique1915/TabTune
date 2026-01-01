
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

export interface NotePosition {
    fret: string;
    string: string;
}

export interface NoteData {
    id: string;
    positions: NotePosition[];
    duration: Duration;
    accidental?: Accidental;
    type: 'note' | 'rest';
    decorators: NoteDecorator;
    noteHead?: 'standard' | 'x' | 'diamond' | 'square' | 'triangle';
    technique?: string; // h, p, s, b, v, t, l (l = pure slur/tie without label)
    slideTargetId?: string; // Explicitly link to another note for techniques
    tuplet?: string;
    isSlurred?: boolean;
    annotation?: string; // Text above/below note
    chord?: string;      // Simple chord name above note
}

export interface MeasureData {
    id: string;
    notes: NoteData[];
    isCollapsed?: boolean;
    showClef?: boolean;
    clef?: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
    showTimeSig?: boolean;
}

export interface GlobalSettings {
    bpm: number;
    time: string;
    key: string;
    clef: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
    showNotation: boolean;
    showTablature: boolean;
}

export type TransitionType = 'snap' | 'slide' | 'fade' | 'assemble';

// Adapted from NoteForge ScoreTheme
export interface ElementStyle {
    color: string;
    opacity: number;
    shadow: boolean;
    shadowColor?: string;
    shadowBlur?: number;
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

    // Legacy mapping (optional, or removed later)
    width?: number;
    staveSpace?: number;
}

export const DEFAULT_SCORE_STYLE: ScoreStyle = {
    clefs: { color: '#ff9823ff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 10 },
    timeSignature: { color: '#ff9823ff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 10 },
    notes: { color: '#ffffffff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 12 },
    rests: { color: '#ffffffff', opacity: 0.8, shadow: false },
    tabNumbers: { color: '#ffffffff', opacity: 1, shadow: false },
    symbols: { color: '#ffffffff', opacity: 1, shadow: false },
    staffLines: { color: '#ffffffff', opacity: 0.4, shadow: false },
    background: '#020617',
    playheadColor: '#ffffffff',
    activeNoteColor: '#ffffffff',
    shadowIntensity: 10,
    glowEffect: true,
    scale: 1,
    transitionType: 'snap'
};

export interface ScoreState {
    measures: MeasureData[];
    selectedNoteIds: string[];
    settings: GlobalSettings;
    style: ScoreStyle;
}

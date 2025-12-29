
export type Duration = 'w' | 'h' | 'q' | '8' | '16' | '32';
export type Accidental = 'none' | '#' | '##' | 'b' | 'bb' | 'n';

export interface NoteDecorator {
    staccato?: boolean;
    accent?: boolean;
    marcato?: boolean;
    tenuto?: boolean;
    dot?: boolean;
}

export interface NoteData {
    id: string;
    fret: string;
    string: string;
    duration: Duration;
    accidental?: Accidental;
    type: 'note' | 'rest';
    decorators: NoteDecorator;
    technique?: string; // h, p, s, b, v, etc.
    slideTargetId?: string; // Explicitly link to another note for techniques
    tuplet?: string;
    isSlurred?: boolean;
}

export interface MeasureData {
    id: string;
    notes: NoteData[];
    isCollapsed?: boolean;
    showClef?: boolean;
    showTimeSig?: boolean;
}

export interface GlobalSettings {
    clef: 'treble' | 'bass' | 'alto' | 'tenor';
    key: string;
    time: string;
    bpm: number;
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
}

export const DEFAULT_SCORE_STYLE: ScoreStyle = {
    // NoteForge Defaults
    clefs: { color: '#ffffff', opacity: 1, shadow: false, shadowColor: '#ffffff', shadowBlur: 10 },
    timeSignature: { color: '#ffffff', opacity: 1, shadow: false, shadowColor: '#ffffff', shadowBlur: 10 },
    notes: { color: '#00e5ff', opacity: 1, shadow: true, shadowColor: '#00e5ff', shadowBlur: 15 },
    rests: { color: '#00e5ff', opacity: 1, shadow: false, shadowColor: '#00e5ff', shadowBlur: 10 },
    tabNumbers: { color: '#00e5ff', opacity: 1, shadow: false, shadowColor: '#00e5ff', shadowBlur: 10 },
    symbols: { color: '#ffffff', opacity: 1, shadow: false, shadowColor: '#ffffff', shadowBlur: 10 },
    staffLines: { color: '#3f3f46', opacity: 1, shadow: false, shadowColor: '#3f3f46', shadowBlur: 5 },

    background: '#09090b',

    // App Defaults
    shadowIntensity: 10,
    glowEffect: true,
    scale: 1.0,
    transitionType: 'assemble',
    playheadColor: '#06b6d4',
    activeNoteColor: '#22d3ee'
};

export interface ScoreState {
    measures: MeasureData[];
    selectedNoteIds: string[];
    settings: GlobalSettings;
    style: ScoreStyle;
}

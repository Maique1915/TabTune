
import { Chord } from "@tonaljs/tonal";
import { NoteData } from "@/modules/editor/domain/types";
export const STRING_BASES = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface Pitch {
    name: string;
    accidental: string;
    octave: number;
}

export function getMidiFromPosition(fret: number, stringIdx: number): number {
    const base = STRING_BASES[stringIdx - 1] || STRING_BASES[0];
    return base + (isNaN(fret) ? 0 : fret);
}

export function getPitchFromMidi(midi: number): Pitch {
    if (isNaN(midi)) return { name: 'C', accidental: '', octave: 4 };
    const octave = Math.floor(midi / 12) - 1;
    const noteIdx = ((midi % 12) + 12) % 12;
    const fullName = NOTE_NAMES[noteIdx] || 'C';
    const name = fullName[0];
    const accidental = fullName.length > 1 ? fullName[1] : '';
    return { name, accidental, octave };
}

export function getNoteKeyFromFret(fret: number, stringIdx: number): string {
    const midi = getMidiFromPosition(fret, stringIdx);
    const { name, accidental, octave } = getPitchFromMidi(midi);
    return `${name.toLowerCase()}${accidental}/${octave}`;
}

export function getMidiFromPitch(name: string, accidental: string, octave: number): number {
    let noteIdx = NOTE_NAMES.indexOf(name);
    if (accidental === '#') noteIdx = NOTE_NAMES.indexOf(name + '#');
    if (accidental === 'b') {
        const flatMap: Record<string, number> = { 'Cb': 11, 'Db': 1, 'Eb': 3, 'Fb': 4, 'Gb': 6, 'Ab': 8, 'Bb': 10 };
        noteIdx = flatMap[name + accidental] ?? noteIdx - 1;
    }
    return (octave + 1) * 12 + noteIdx;
}

export function findBestFretForPitch(midi: number, preferredString: number): { fret: number; string: number } {
    const basePreferred = STRING_BASES[preferredString - 1];
    const fretPreferred = midi - basePreferred;

    if (fretPreferred >= 0 && fretPreferred <= 24) {
        return { fret: fretPreferred, string: preferredString };
    }

    for (let i = 0; i < STRING_BASES.length; i++) {
        const stringNum = i + 1;
        const fret = midi - STRING_BASES[i];
        if (fret >= 0 && fret <= 24) {
            return { fret, string: stringNum };
        }
    }

    return { fret: Math.max(0, fretPreferred), string: preferredString };
}

export const DURATION_VALUES: Record<string, number> = {
    'w': 1.0,
    'h': 0.5,
    'q': 0.25,
    '8': 0.125,
    '16': 0.0625,
    '32': 0.03125
};

export const VALUE_TO_DURATION: Record<number, string> = {
    1.0: 'w',
    0.5: 'h',
    0.25: 'q',
    0.125: '8',
    0.0625: '16',
    0.03125: '32'
};

export function getNoteDurationValue(duration: string, isDotted: boolean): number {
    const base = DURATION_VALUES[duration] || 0.25;
    return isDotted ? base * 1.5 : base;
}

export function getMeasureCapacity(timeSignature: string): number {
    const [num, den] = timeSignature.split('/').map(Number);
    if (!num || !den) return 1.0;
    return num * (1 / den);
}

/**
 * Decompõe um valor decimal de tempo em uma sequência de durações padrão.
 * Ex: 0.375 -> ['q', '8']
 */
export function decomposeValue(value: number): { duration: string, dotted: boolean }[] {
    const result: { duration: string, dotted: boolean }[] | any = [];
    let remaining = value;
    const sortedDurations = Object.entries(DURATION_VALUES).sort((a, b) => b[1] - a[1]);

    while (remaining > 0.01) {
        let found = false;
        // Tenta primeiro com ponto (valor * 1.5)
        for (const [dur, val] of sortedDurations) {
            if (val * 1.5 <= remaining + 0.001) {
                result.push({ duration: dur, dotted: true });
                remaining -= val * 1.5;
                found = true;
                break;
            }
        }
        if (found) continue;
        // Tenta sem ponto
        for (const [dur, val] of sortedDurations) {
            if (val <= remaining + 0.001) {
                result.push({ duration: dur, dotted: false });
                remaining -= val;
                found = true;
                break;
            }
        }
        if (!found) break; // Evita loop infinito se sobrar algo minúsculo
    }
    return result;
}



/**
 * Detects the chord name from the notes in a measure.
 * Aggregates all pitches found in the measure to infer the harmony.
 */
export function detectChordFromMeasure(notes: NoteData[]): string | null {
    if (!notes || notes.length === 0) return null;

    const pitches: string[] = [];
    notes.forEach(n => {
        if (n.type === 'rest') return;
        n.positions.forEach(pos => {
            const midi = getMidiFromPosition(pos.fret, pos.string);
            const { name, accidental } = getPitchFromMidi(midi);
            pitches.push(name + accidental);
        });
    });

    // Remove duplicates
    const uniquePitches = Array.from(new Set(pitches));

    if (uniquePitches.length < 2) return null;

    // Use Tonal to detect
    const detected = Chord.detect(uniquePitches);
    if (detected && detected.length > 0) {
        // Return the first candidate (usually the most simple)
        return detected[0];
    }
    return null;
}

/**
 * Transposes a chord name by a given number of semitones.
 * Example: transposeChordName("C", 2) => "D"
 *          transposeChordName("Am7", -1) => "G#m7"
 */
export function transposeChordName(chordName: string | undefined, semitones: number): string {
    if (!chordName || semitones === 0) return chordName || '';

    // Parse the chord name to extract root note
    // Support standard #/b and musical ♯/♭
    const match = chordName.match(/^([A-G][#b♯♭]?)(.*)/);
    if (!match) return chordName;

    const [, root, suffix] = match;

    // Find the current note index
    let noteIndex = NOTE_NAMES.indexOf(root);

    // Handle flats and musical symbols by converting to sharp equivalent
    if (noteIndex === -1) {
        const altToSharp: Record<string, string> = {
            'Cb': 'B', 'Db': 'C#', 'Eb': 'D#', 'Fb': 'E',
            'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
            'C♯': 'C#', 'D♯': 'D#', 'F♯': 'F#', 'G♯': 'G#', 'A♯': 'A#',
            'C♭': 'B', 'D♭': 'C#', 'E♭': 'D#', 'F♭': 'E',
            'G♭': 'F#', 'A♭': 'G#', 'B♭': 'A#'
        };
        const sharpEquiv = altToSharp[root];
        if (sharpEquiv) {
            noteIndex = NOTE_NAMES.indexOf(sharpEquiv);
        }
    }

    if (noteIndex === -1) return chordName;

    // Transpose
    let newIndex = (noteIndex + semitones) % 12;
    if (newIndex < 0) newIndex += 12;

    const newRoot = NOTE_NAMES[newIndex];
    return newRoot + suffix;
}

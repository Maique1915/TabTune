
export const STRING_BASES = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface Pitch {
    name: string;
    accidental: string;
    octave: number;
}

export function getMidiFromPosition(fret: number, stringIdx: number): number {
    const base = STRING_BASES[stringIdx - 1];
    return base + fret;
}

export function getPitchFromMidi(midi: number): Pitch {
    const octave = Math.floor(midi / 12) - 1;
    const noteIdx = midi % 12;
    const fullName = NOTE_NAMES[noteIdx];
    const name = fullName[0];
    const accidental = fullName.length > 1 ? fullName[1] : '';
    return { name, accidental, octave };
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

// Helper for VexFlow note keys
export const getNoteKeyFromFret = (string: number, fret: number): string => {
    // Standard Tuning (E A D G B E - low to high)
    // Strings are 1-based index from high E (1) to low E (6) in VexFlow usually, 
    // but often 6 is low E. Let's assume standard VexFlow TabNote convention:
    // String 1 = High E (E4)
    // String 2 = B (B3)
    // String 3 = G (G3)
    // String 4 = D (D3)
    // String 5 = A (A2)
    // String 6 = Low E (E2)

    // MIDI note numbers for open strings (using standard guitar tuning)
    const stringBaseNotes: Record<number, number> = {
        1: 64, // E4
        2: 59, // B3
        3: 55, // G3
        4: 50, // D3
        5: 45, // A2
        6: 40  // E2
    };

    const baseNote = stringBaseNotes[string];
    if (baseNote === undefined) return "b/4"; // Default fallback

    const noteValue = baseNote + fret;

    // Convert MIDI note value to VexFlow key string (e.g., "c/4", "f#/5")
    const notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const octave = Math.floor(noteValue / 12) - 1;
    const noteIndex = noteValue % 12;
    const noteName = notes[noteIndex];

    return `${noteName}/${octave}`;
};

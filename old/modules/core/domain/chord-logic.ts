import type { Achord, ChordDiagramProps, Position, nutForm } from './types';

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const complements = ['Major', 'm', '°'];
export const basses = ['Tonica', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9', '/10', '/11', '/12'];
export const extensions = [
    'sus2', 'sus4', 'aug',
    '5', 'b5', '#5',
    '6', 'b6', '#6',
    '7', 'b7', '#7',
    '7+', 'b7+', '#7+',
    '9', 'b9', '#9',
    '11', 'b11', '#11',
    '13', 'b13', '#13'
];

export const getExtension = (value: string): number => { return extensions.indexOf(value) }
export const getNote = (value: string): number => { return notes.indexOf(value) }
export const getComplement = (value: string): number => { return complements.indexOf(value) }
export const getBasse = (value: string): number => { return basses.indexOf(value) }

export const formatNoteName = (note: string): string => {
    return note.replace(/#/g, '♯').replace(/b/g, '♭');
};

export const getNome = ({ note, complement, extension, bass }: Achord): string => {
    const complementStr = complements[complement] === 'Major' ? '' : complements[complement] || '';
    const extensionStr = extension ? extension.map(ext => extensions[ext]).join('') : '';
    const bassStr = bass > 0 ? basses[bass] : '';
    return notes[note] + complementStr + extensionStr + bassStr;
}

export const getFormattedNome = (chord: Achord): string => {
    return getNome(chord).replace(/#/g, '♯').replace(/b/g, '♭');
};

export const getScaleNotes = (selectedScale: string): string[] => {
    const scaleIndex = notes.indexOf(selectedScale);
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    return majorScaleIntervals.map((interval) => notes[(scaleIndex + interval) % 12]);
};

export const getBassNotes = (selectedScale: string): string[] => {
    const scaleIndex = notes.indexOf(selectedScale);
    return ["Root", ...Array.from({ length: 11 }, (_, i) => `/${formatNoteName(notes[(scaleIndex + i + 1) % 12])}`)];
};

export const transpose = (chord: ChordDiagramProps, newAchord: Achord): ChordDiagramProps => {
    let nut: nutForm = JSON.parse(JSON.stringify(chord.nut));

    // Calculate semitone shift from shape origin to target note
    let shift = newAchord.note - chord.origin;
    while (shift < 0) shift += 12;
    shift = shift % 12;

    if (shift === 0) {
        nut.vis = chord.nut?.vis || false;
        nut.pos = chord.nut?.pos || 0;
    } else {
        nut.vis = true;
        nut.pos = (chord.nut?.pos || 0) + shift;
    }

    const entries = Object.entries(chord.positions).map(([str, [fret, finger]]) => {
        const stringNum = parseInt(str);
        let newFret = fret;

        // If it's a fretted note or an open string that's not avoided, shift it
        if (fret > 0 || (!chord.avoid.includes(stringNum))) {
            newFret = fret + shift;
        }

        return [str, [newFret, finger]] as [string, [number, number]];
    });

    const position = Object.fromEntries(entries) as Position;

    return { ...chord, chord: newAchord, positions: position, nut: nut, transport: 0, stringNames: chord.stringNames };
};

export const getFilteredChords = (
    chordData: ChordDiagramProps[],
    selectedNote: string,
    selectedQuality: string,
    selectedExtensions: string[],
    selectedBass: string,
    tuning?: string[]
): ChordDiagramProps[] => {
    // First, filter by exact tuning match
    let baseChords = chordData;
    if (tuning && tuning.length > 0) {
        baseChords = chordData.filter(chord => {
            const chordTuning = chord.stringNames || [];
            // Check if tunings match exactly
            if (chordTuning.length !== tuning.length) return false;
            return chordTuning.every((note, index) => note === tuning[index]);
        });
    }

    let transposableChords: ChordDiagramProps[] = baseChords;

    if (selectedNote !== "all") {
        transposableChords = [];
        const targetNoteIndex = notes.indexOf(selectedNote);

        baseChords.forEach((chordItem) => {
            if (!chordItem.chord) return; // Skip invalid chords

            if (chordItem.unique) {
                if (notes[chordItem.chord.note] === selectedNote) {
                    transposableChords.push(chordItem);
                }
            } else {
                const interval = targetNoteIndex - chordItem.origin;
                const newNoteIndex = (chordItem.chord.note + interval + 12) % 12;
                const transposed = transpose(chordItem, { ...chordItem.chord, note: newNoteIndex, extension: chordItem.chord.extension, bass: chordItem.chord.bass });
                transposableChords.push(transposed);
            }
        });
    }

    let filtered = transposableChords;
    if (selectedQuality !== "all") {
        filtered = filtered.filter((chord) => {
            if (!chord.chord) return false;
            const comp = complements[chord.chord.complement];
            if (selectedQuality === "major") return ["Major"].includes(comp);
            if (selectedQuality === "minor") return comp === "m";
            if (selectedQuality === "dim") return comp === "°";
            return true;
        });
    }
    if (selectedExtensions.length > 0) {
        filtered = filtered.filter((chord) => {
            if (!chord.chord) return false;
            const chordExtensions = chord.chord.extension.map(ext => extensions[ext]);
            return selectedExtensions.every((ext) => chordExtensions.includes(ext));
        });
    }
    if (selectedBass !== "all") {
        const bassIndex = basses.indexOf(selectedBass);
        filtered = filtered.filter((chord) => chord.chord && chord.chord.bass === bassIndex);
    }
    return filtered;
}

const findMinNonZeroNote = (positions: Position, avoid: number[], nut?: nutForm): [number, number] => {
    let min = Infinity;
    let max = 0;

    if (nut && nut.vis) {
        min = nut.pos;
        max = nut.pos;
    } else {
        min = 0;
    }

    Object.entries(positions).forEach(([str, [fret, _]]) => {
        const stringNumber = parseInt(str);
        if (!avoid.includes(stringNumber) && fret > 0) {
            if (fret < min) {
                min = fret;
            }
            if (fret > max) {
                max = fret;
            }
        }
    });

    return [min === Infinity ? 0 : min, max];
};

/**
 * Calculates the chord data adjusted for display, including transposition for higher frets.
 */
export const getChordDisplayData = (originalChord: ChordDiagramProps): { finalChord: ChordDiagramProps; transportDisplay: number } => {
    const { positions, nut, avoid } = originalChord;
    let finalChord: ChordDiagramProps;

    const baseTransportDisplay = originalChord.transport && originalChord.transport > 0 ? originalChord.transport : 1;

    const [minFret, maxFret] = findMinNonZeroNote(positions, avoid || [], nut);

    if (maxFret <= 4 && (!nut || !nut.vis || nut.pos <= 4)) {
        finalChord = originalChord;
        return { finalChord, transportDisplay: baseTransportDisplay };
    }

    const transposition = (nut && nut.vis) ? nut.pos - 1 : minFret > 0 ? minFret - 1 : 0;

    const newPositions: Position = {};
    for (const string in positions) {
        const [fret, finger] = positions[string];
        let newFret = fret > 0 ? fret - transposition : 0;
        newPositions[string] = [newFret, finger];
    }

    let newNut = nut;
    if (nut && nut.vis) {
        const transposedPos = nut.pos > 0 ? nut.pos - transposition : 0;
        newNut = { ...nut, pos: transposedPos };
    }

    finalChord = { ...originalChord, positions: newPositions, nut: newNut };
    return { finalChord, transportDisplay: baseTransportDisplay + transposition };
};

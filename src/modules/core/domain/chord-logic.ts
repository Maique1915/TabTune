import type { Achord, ChordDiagramProps, StandardPosition } from './types';

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
    // Calculate semitone shift from shape origin to target note
    let shift = newAchord.note - (chord.origin || 0); // Use 0 as default if origin is undefined

    // Ensure shift is within a 12-semitone range
    shift = ((shift % 12) + 12) % 12;

    const newFingers = chord.fingers.map(fingerPos => {
        let newFret = fingerPos.fret;
        // Only shift fretted notes (fret > 0)
        if (newFret > 0) {
            newFret = newFret + shift;
        }
        return { ...fingerPos, fret: newFret };
    });

    // Adjust capo if present and still relevant (this is more for visual adjustment now)
    const newCapo = (chord.capo || 0) + shift;

    return {
        ...chord,
        chord: newAchord,
        fingers: newFingers,
        capo: newCapo >= 0 ? newCapo : 0, // Capo cannot be negative
        origin: newAchord.note // Update origin to new root note
    };
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
                const newAchord = { ...chordItem.chord, note: targetNoteIndex }; // Create new Achord with target note
                const transposed = transpose(chordItem, newAchord); // Call transpose with the correct signature
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

const findMinNonZeroNote = (fingers: StandardPosition[], avoid: number[]): [number, number] => {
    let min = Infinity;
    let max = 0;

    fingers.forEach(fingerPos => {
        const stringNumber = fingerPos.string;
        const fret = fingerPos.fret;

        // Only consider fretted notes (fret > 0) that are not in the 'avoid' list
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
 * This primarily adjusts the 'fingers' (StandardPosition[]) for visual display purposes.
 */
export const getChordDisplayData = (originalChord: ChordDiagramProps): { finalChord: ChordDiagramProps; transportDisplay: number } => {
    const { fingers, avoid, capo } = originalChord;
    let finalChord: ChordDiagramProps;

    // TransportDisplay is now based on capo or minimum fret
    let transportDisplay = (capo || 0) + 1; // Default to 1-based capo position

    const [minFret, maxFret] = findMinNonZeroNote(fingers, avoid || []); // Updated call

    // If all notes are within the first 4 frets (and no capo), no transposition is needed for display
    if (maxFret <= 4 && (capo || 0) === 0) {
        finalChord = originalChord;
        return { finalChord, transportDisplay: 1 }; // Display at position 1
    }

    // Determine actual transposition needed for display
    // If capo is active, transposition starts from capo position
    // Otherwise, it's relative to the lowest fretted note
    const effectiveCapo = capo || 0;
    const transpositionBase = effectiveCapo > 0 ? effectiveCapo : (minFret > 0 ? minFret - 1 : 0);

    const newFingers = fingers.map(fingerPos => {
        let newFret = fingerPos.fret;
        if (newFret > 0) { // Only shift fretted notes
            newFret = newFret - transpositionBase;
            // Ensure fret doesn't go below 0 (open string)
            if (newFret < 0) newFret = 0;
        }
        return { ...fingerPos, fret: newFret };
    });

    // Adjust transportDisplay based on the transposition applied
    transportDisplay = (capo || 0) + (minFret > 0 ? minFret - 1 : 0) + 1;
    if (capo && capo > 0) transportDisplay = capo + 1; // If capo, display starts from capo's position + 1

    finalChord = { ...originalChord, fingers: newFingers, capo: effectiveCapo };
    return { finalChord, transportDisplay };
};

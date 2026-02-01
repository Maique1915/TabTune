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

// ... existing imports
import { BarreInfo } from './types'; // Ensure BarreInfo is imported or defined

// ... existing code ...

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
 * Detects the best barre candidate from finger positions.
 */
export const detectBarre = (fingers: StandardPosition[]): BarreInfo | null => {
    if (!fingers || fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxStrings = 1;

    fingers.forEach(f => {
        // A barre is defined by a finger crossing multiple strings (endString !== string)
        const isBarre = f.endString !== undefined && f.endString !== f.string;
        if (isBarre) {
            const start = Math.min(f.string, f.endString!);
            const end = Math.max(f.string, f.endString!);
            const span = end - start + 1;

            // Prioritize wider barres
            if (span > maxStrings) {
                maxStrings = span;
                bestBarre = {
                    fret: f.fret,
                    finger: f.finger ?? 1,
                    startString: start,
                    endString: end
                };
            }
        }
    });

    return bestBarre;
};

export interface VisualChordState {
    finalChord: ChordDiagramProps;
    startFret: number;
    barre: BarreInfo | null;
    formattedName: string;
    capoConfig: { isActive: boolean; fret: number; showNut: boolean };
    transposeConfig: { isActive: boolean; fret: number; showNut: boolean };
    visualStartFret: number; // The actual lowest fret number shown on the side
}

/**
 * Prepares all visual data needed to draw a Short Chord diagram.
 * Extracts logic (auto-transpose, barre, name) from the drawer class.
 */
export const prepareShortChordVisuals = (
    chord: ChordDiagramProps,
    numFrets: number,
    globalCapo: number = 0,
    forceTransportDisplay: number = 1
): VisualChordState => {

    // 1. Auto-Transpose Logic
    let finalChord = { ...chord };
    let startFret = forceTransportDisplay;

    // Calculate frets stats
    const frets = chord.fingers
        .filter(f => f.fret > 0)
        .map(f => f.fret);

    const maxFret = frets.length > 0 ? Math.max(...frets) : 0;
    const minFret = frets.length > 0 ? Math.min(...frets) : 0;

    // Check overflow logic (same as was in ShortChord)
    // If chords exceed the visible number of frets, we shift them.
    if (frets.length > 0 && maxFret > numFrets) {
        // Auto-transpose trigger
        startFret = minFret;

        // Apply shift
        const offset = startFret - 1;
        finalChord = {
            ...chord,
            fingers: chord.fingers.map(f => ({
                ...f,
                fret: f.fret > 0 ? f.fret - offset : 0
            }))
        };
    } else if (forceTransportDisplay > 1) {
        // Manual override case (if provided via props)
        const offset = forceTransportDisplay - 1;
        finalChord = {
            ...chord,
            fingers: chord.fingers.map(f => ({
                ...f,
                fret: f.fret > 0 ? f.fret - offset : 0
            }))
        };
    }

    // 2. Barre Detection
    const barre = detectBarre(finalChord.fingers);

    // 3. Name Formatting
    const formattedName = formatNoteName(finalChord.chordName || "");

    // 4. Capo / Transpose Configs
    const capoConfig = {
        isActive: globalCapo > 0,
        fret: globalCapo,
        showNut: globalCapo === 0 // Show nut only if no global capo
    };

    const transposeConfig = {
        isActive: startFret > 1,
        fret: startFret,
        showNut: startFret === 1 // If transposed, nut is hidden relative to the shift
    };

    console.log("transposeConfig", transposeConfig);

    // Visual start fret for the indicator (the number drawn)
    // Simply startFret, but we might want to align it with the top finger visually?
    // The previous code calculated 'minVisualFret' from the shifted chord for ALIGNMENT.
    // The NUMBER itself is `startFret`.

    return {
        finalChord,
        startFret,
        barre,
        formattedName,
        capoConfig,
        transposeConfig,
        visualStartFret: startFret
    };
};

/**
 * Legacy/Utility: Prepares chord display data for the timeline and other views.
 */
export const getChordDisplayData = (chord: ChordDiagramProps, numFrets: number = 4) => {
    const visuals = prepareShortChordVisuals(chord, numFrets);
    return {
        finalChord: visuals.finalChord,
        transportDisplay: visuals.startFret
    };
};
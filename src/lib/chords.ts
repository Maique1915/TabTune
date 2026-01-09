import type { ChordDiagramProps, Achord } from './types';
import { transpose as transposeChord } from "@/lib/chord-logic";

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const complements = ['Major', 'm', '°'];
export const basses = ['Tonica', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9', '/10', '/11', '/12'];
export const extensions = ['sus2', 'sus4', 'aug', '5', "6", "7", "7+", "9", "11", "13", "(#5)", "(b5)"];

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
            if (chordItem.unique) {
                if (notes[chordItem.chord.note] === selectedNote) {
                    transposableChords.push(chordItem);
                }
            } else {
                const interval = targetNoteIndex - chordItem.origin;
                const newNoteIndex = (chordItem.chord.note + interval + 12) % 12;
                const transposed = transposeChord(chordItem, { ...chordItem.chord, note: newNoteIndex, extension: chordItem.chord.extension, bass: chordItem.chord.bass });
                transposableChords.push(transposed);
            }
        });
    }

    let filtered = transposableChords;
    if (selectedQuality !== "all") {
        filtered = filtered.filter((chord) => {
            const comp = complements[chord.chord.complement];
            if (selectedQuality === "major") return ["Major"].includes(comp);
            if (selectedQuality === "minor") return comp === "m";
            if (selectedQuality === "dim") return comp === "°";
            return true;
        });
    }
    if (selectedExtensions.length > 0) {
        filtered = filtered.filter((chord) => {
            const chordExtensions = chord.chord.extension.map(ext => extensions[ext]);
            return selectedExtensions.every((ext) => chordExtensions.includes(ext));
        });
    }
    if (selectedBass !== "all") {
        const bassIndex = basses.indexOf(selectedBass);
        filtered = filtered.filter((chord) => chord.chord.bass === bassIndex);
    }
    return filtered;
}

export const chordData: ChordDiagramProps[] = [
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 2: [2, 2], 3: [2, 3], 4: [1, 1] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('E'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 2: [2, 2], 3: [2, 3], 4: [1, 1], 5: [3, 4] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('E'),
        unique: true,
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 2: [2, 2], 4: [1, 1], 5: [3, 4] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('E'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('B'), complement: getComplement('m'), extension: [getExtension('7'), getExtension('9')], bass: 0 },
        positions: { 2: [2, 2], 4: [2, 3], 5: [2, 4] },
        avoid: [1, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('B'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('E'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 2: [2, 2] },
        avoid: [],
        nut: { vis: true, str: [1, 6], pos: 0, fin: 1, trn: 0 },
        origin: getNote('E'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('E'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 2: [2, 2], 3: [2, 3], 5: [3, 4] },
        avoid: [],
        nut: { vis: true, str: [1, 6], pos: 0, fin: 1, trn: 0 },
        origin: getNote('E'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('m'), extension: [getExtension('7'), getExtension('b5')], bass: 0 },
        positions: { 3: [1, 2], 4: [0, 1], 5: [1, 3] },
        avoid: [1, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 4: [6, 1], 5: [8, 3], 6: [9, 4] },
        avoid: [1, 3],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('F'), complement: getComplement('m'), extension: [getExtension('6')], bass: 0 },
        positions: { 1: [1, 2], 4: [1, 3], 5: [1, 4] },
        avoid: [2, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('F'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('F'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 1: [1, 1], 3: [1, 2], 4: [1, 3], 5: [1, 4] },
        avoid: [2, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('F'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A#'), complement: getComplement('m'), extension: [getExtension('7'), getExtension('b5')], bass: 0 },
        positions: { 2: [1, 2], 4: [1, 3], 5: [2, 4], 6: [0, 1] },
        avoid: [1, 3],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A#'),
    }, {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('E'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 4: [1, 1] },
        avoid: [2, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('E'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 3: [2, 2], 4: [2, 3], 5: [2, 1] },
        avoid: [1],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('D'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 4: [2, 1], 5: [3, 3], 6: [2, 2] },
        avoid: [1, 2],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('D'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('G'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 1: [3, 3], 2: [2, 2], 6: [3, 4] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('G'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('F'), complement: getComplement('°'), extension: [], bass: 0 },
        positions: { 1: [1, 1], 3: [1, 2], 5: [1, 3] },
        avoid: [2, 4, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('F'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('°'), extension: [], bass: 0 },
        positions: { 2: [1, 1], 4: [2, 2], 6: [1, 3] },
        avoid: [1, 3, 5],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('D'), complement: getComplement('°'), extension: [], bass: 0 },
        positions: { 1: [1, 1], 3: [2, 2], 5: [1, 3] },
        avoid: [2, 4, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('D'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('m'), extension: [], bass: 0 },
        positions: { 2: [1, 1], 3: [2, 2], 4: [2, 3] },
        avoid: [6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('Major'), extension: [getExtension('sus2')], bass: 0 },
        positions: { 3: [2, 2], 4: [2, 1] },
        avoid: [6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    },
    {
        stringNames: ["E", "A", "D", "G", "B", "e"],
        chord: { note: getNote('A'), complement: getComplement('Major'), extension: [getExtension('sus4')], bass: 0 },
        positions: { 2: [3, 3], 3: [2, 2], 4: [2, 1] },
        avoid: [6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 1: [0, 0], 2: [2, 1], 3: [2, 2] }, // Bass E Major
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('E'),
        stringNames: ["E", "A", "D", "G"]
    },
    {
        chord: { note: getNote('D'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 4: [0, 0], 5: [3, 2], 6: [2, 1] }, // Drop D tuning test
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, trn: 1 },
        origin: getNote('D'),
        stringNames: ["D", "A", "D", "G", "B", "e"]
    }
];
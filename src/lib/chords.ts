import type { ChordDiagramProps, Achord } from './types';

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

import { transpose as transposeChord } from "@/lib/chord-logic";

export const getFilteredChords = (
    chordData: ChordDiagramProps[],
    selectedNote: string,
    selectedQuality: string,
    selectedExtensions: string[],
    selectedBass: string
): ChordDiagramProps[] => {
    let transposableChords: ChordDiagramProps[] = chordData;

    if (selectedNote !== "all") {
        transposableChords = [];
        const targetNoteIndex = notes.indexOf(selectedNote);

        chordData.forEach((chordItem) => {
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
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 2: [2, 2, 1], 3: [2, 3, 1], 4: [1, 1, 1] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('E'),
    }, {
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 2: [2, 2, 1], 3: [2, 3, 1], 4: [1, 1, 1], 5: [3, 4, 1] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('E'),
        unique: true,
    }, {
        chord: { note: getNote('E'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 2: [2, 2, 1], 4: [1, 1, 1], 5: [3, 4, 1] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('E'),
    }, {
        chord: { note: getNote('B'), complement: getComplement('m'), extension: [getExtension('7'), getExtension('9')], bass: 0 },
        positions: { 2: [2, 2, 1], 4: [2, 3, 1], 5: [2, 4, 1] },
        avoid: [1, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('B'),
    }, {
        chord: { note: getNote('E'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 2: [2, 2, 0] },
        avoid: [],
        nut: { vis: true, str: [1, 6], pos: 0, fin: 1, add: true, trn: 0 },
        origin: getNote('E'),
    }, {
        chord: { note: getNote('E'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 2: [2, 2, 0], 3: [2, 3, 0], 5: [3, 4, 0] },
        avoid: [],
        nut: { vis: true, str: [1, 6], pos: 0, fin: 1, add: true, trn: 0 },
        origin: getNote('E'),
    }, {
        chord: { note: getNote('A'), complement: getComplement('m'), extension: [getExtension('7'), getExtension('b5')], bass: 0 },
        positions: { 3: [1, 2, 1], 4: [0, 1, 0], 5: [1, 3, 1] },
        avoid: [1, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    }, {
        chord: { note: getNote('A'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 4: [6, 1, 1], 5: [8, 3, 1], 6: [9, 4, 1] },
        avoid: [1, 3],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    }, {
        chord: { note: getNote('F'), complement: getComplement('m'), extension: [getExtension('6')], bass: 0 },
        positions: { 1: [1, 2, 1], 4: [1, 3, 1], 5: [1, 4, 1] },
        avoid: [2, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('F'),
    }, {
        chord: { note: getNote('F'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 1: [1, 1, 0], 3: [1, 2, 0], 4: [1, 3, 0], 5: [1, 4, 0] },
        avoid: [2, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('F'),
    }, {
        chord: { note: getNote('A#'), complement: getComplement('m'), extension: [getExtension('7'), getExtension('b5')], bass: 0 },
        positions: { 2: [1, 2, 1], 4: [1, 3, 1], 5: [2, 4, 1], 6: [0, 1, 0] },
        avoid: [1, 3],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A#'),
    }, {
        chord: { note: getNote('E'), complement: getComplement('m'), extension: [getExtension('7')], bass: 0 },
        positions: { 1: [0, -2, 0], 3: [0, -1, 0], 4: [1, 1, 1], 5: [0, 0, 0] },
        avoid: [2, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('E'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 3: [2, 2, 1], 4: [2, 3, 1], 5: [2, 1, 1] },
        avoid: [1],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('D'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 4: [2, 1, 1], 5: [3, 3, 1], 6: [2, 2, 1] },
        avoid: [1, 2],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('D'),
    },
    {
        chord: { note: getNote('G'), complement: getComplement('Major'), extension: [], bass: 0 },
        positions: { 1: [3, 3, 1], 2: [2, 2, 1], 6: [3, 4, 1] },
        avoid: [],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('G'),
    },
    {
        chord: { note: getNote('F'), complement: getComplement('°'), extension: [], bass: 0 },
        positions: { 1: [1, 1, 1], 3: [1, 2, 1], 5: [1, 3, 1] },
        avoid: [2, 4, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('F'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('°'), extension: [], bass: 0 },
        positions: { 2: [1, 1, 1], 4: [2, 2, 1], 6: [1, 3, 1] },
        avoid: [1, 3, 5],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('D'), complement: getComplement('°'), extension: [], bass: 0 },
        positions: { 1: [1, 1, 1], 3: [2, 2, 1], 5: [1, 3, 1] },
        avoid: [2, 4, 6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('D'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('m'), extension: [], bass: 0 },
        positions: { 2: [1, 1, 1], 3: [2, 2, 1], 4: [2, 3, 1] },
        avoid: [6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('Major'), extension: [getExtension('sus2')], bass: 0 },
        positions: { 3: [2, 2, 1], 4: [2, 1, 1] },
        avoid: [6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('Major'), extension: [getExtension('sus4')], bass: 0 },
        positions: { 2: [3, 3, 1], 3: [2, 2, 1], 4: [2, 1, 1] },
        avoid: [6],
        nut: { vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1 },
        origin: getNote('A'),
    }
];
import type { ChordDiagramProps, Achord } from './types';

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const complements = ['Major', 'm', '7', 'm7', '7+', 'm7(b5)', '6', 'm6', 'm7(9)', '7(#5)', '°'];
export const basses = ['Tonica', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9', '/10', '/11', '/12'];

export const getNote = (value: string): number => { return notes.indexOf(value) }
export const getComplement = (value: string): number => { return complements.indexOf(value) }
export const getBasse = (value: string): number => { return basses.indexOf(value) }

export const getNome = ({note, complement, bass}: Achord): string => {
    return notes[note] + (complements[complement] || '') + (bass > 0 ? basses[bass] : '')
}


export const chordData: ChordDiagramProps[] = [
    {
        chord: { note: getNote('E'), complement: getComplement('Major'), bass: 0 },
        positions: { 2: [2, 2, 1], 3: [2, 3, 1], 4: [1, 1, 1] },
        avoid: [],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('E'),
    }, {
        chord: { note: getNote('B'), complement: getComplement('m7(9)'), bass: 0 },
        positions: { 2: [2, 2, 1], 4: [2, 3, 1] , 5: [2, 4, 1] },
        avoid: [1, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('B'),
    }, {
        chord: { note: getNote('E'), complement: getComplement('m7'), bass: 0 },
        positions: {2: [2, 2, 0]},
        avoid: [],
        nut: {vis: true, str: [1, 6], pos: 0, fin: 1, add: true, trn: 0},
        origin: getNote('E'),
    }, {
        chord: { note: getNote('A'), complement: getComplement('m7(b5)'), bass: 0 },
        positions: { 3: [1, 2, 1],  4: [0, 1, 0],  5: [1, 3, 1]},
        avoid: [1, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('A'),
    },{
        chord: { note: getNote('A'), complement: getComplement('7'), bass: 0 },
        positions: { 4: [6, 1, 1],  5: [8, 3, 1], 6: [9, 4, 1]},
        avoid: [1, 3],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('A'),
    },{
        chord: { note: getNote('F'), complement: getComplement('m6'), bass: 0 },
        positions: { 1: [1, 2, 1],  4: [1, 3, 1], 5: [1, 4, 1]},
        avoid: [2, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('F'),
    },{
        chord: { note: getNote('F'), complement: getComplement('m7'), bass: 0 },
        positions: { 1: [1, 1, 0],  3: [1, 2, 0], 4: [1, 3, 0], 5: [1, 4, 0]},
        avoid: [2, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('F'),
    },{
        chord: { note: getNote('A#'), complement: getComplement('m7(b5)'), bass: 0 },
        positions: { 2: [1, 2, 1], 4: [1, 3, 1], 5: [2, 4, 1], 6: [0, 1, 0]},
        avoid: [1, 3],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('A#'),
    },{
        chord: { note: getNote('E'), complement: getComplement('7'), bass: 0 },
        positions: {1: [0, -2, 0], 3: [0, -1, 0], 4: [1, 1, 1], 5: [0, 0, 0]},
        avoid: [2, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('E'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('Major'), bass: 0 },
        positions: { 3: [2, 2, 1], 4: [2, 3, 1], 5: [2, 1, 1] },
        avoid: [1],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('D'), complement: getComplement('Major'), bass: 0 },
        positions: { 4: [2, 1, 1], 5: [3, 3, 1], 6: [2, 2, 1] },
        avoid: [1, 2],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('D'),
    },
    {
        chord: { note: getNote('G'), complement: getComplement('Major'), bass: 0 },
        positions: { 1: [3, 3, 1], 2: [2, 2, 1], 6: [3, 4, 1] },
        avoid: [],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('G'),
    },
    {
        chord: { note: getNote('F'), complement: getComplement('°'), bass: 0 },
        positions: { 1: [1, 1, 1], 3: [1, 2, 1], 5: [1, 3, 1] },
        avoid: [2, 4, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('F'),
    },
    {
        chord: { note: getNote('A'), complement: getComplement('°'), bass: 0 },
        positions: { 2: [1, 1, 1], 4: [2, 2, 1], 6: [1, 3, 1] },
        avoid: [1, 3, 5],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('A'),
    },
    {
        chord: { note: getNote('D'), complement: getComplement('°'), bass: 0 },
        positions: { 1: [1, 1, 1], 3: [2, 2, 1], 5: [1, 3, 1] },
        avoid: [2, 4, 6],
        nut: {vis: false, str: [0, 0], pos: 0, fin: 0, add: false, trn: 1},
        origin: getNote('D'),
    }
];

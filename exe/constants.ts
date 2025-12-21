
import { Chord } from './types';

export const CHORD_LIBRARY: Chord[] = [
  {
    id: 'e-maj',
    name: 'E',
    positions: [
      { string: 3, fret: 1, finger: 1 },
      { string: 5, fret: 2, finger: 2 },
      { string: 4, fret: 2, finger: 3 }
    ],
    startFret: 1
  },
  {
    id: 'bm7-9',
    name: 'Bm7(9)',
    positions: [
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 0, finger: 0 },
      { string: 3, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 3 },
      { string: 1, fret: 2, finger: 4 }
    ],
    startFret: 1
  },
  {
    id: 'em7',
    name: 'Em7',
    positions: [
      { string: 5, fret: 2, finger: 2 },
      { string: 2, fret: 3, finger: 3 }
    ],
    startFret: 1
  },
  {
    id: 'am7-b5',
    name: 'Am7(b5)',
    positions: [
      { string: 5, fret: 0, finger: 0 },
      { string: 4, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 2, fret: 1, finger: 3 },
      { string: 1, fret: 0, finger: 0 }
    ],
    startFret: 1
  },
  {
    id: 'a7',
    name: 'A7',
    positions: [
      { string: 4, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 3 }
    ],
    startFret: 1
  },
  {
    id: 'fm6',
    name: 'Fm6',
    positions: [
      { string: 6, fret: 1, finger: 1 },
      { string: 4, fret: 0, finger: 0 },
      { string: 3, fret: 1, finger: 2 },
      { string: 2, fret: 1, finger: 3 }
    ],
    startFret: 1
  },
  {
    id: 'fm7',
    name: 'Fm7',
    positions: [
      { string: 6, fret: 1, finger: 1 },
      { string: 5, fret: 3, finger: 3 },
      { string: 4, fret: 1, finger: 1 },
      { string: 3, fret: 1, finger: 1 },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 1, finger: 1 }
    ],
    startFret: 1
  }
];

export const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];

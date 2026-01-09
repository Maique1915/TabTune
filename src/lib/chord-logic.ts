import type { ChordDiagramProps, Achord, nutForm, Position, BarreInfo } from './types'; // Add BarreInfo import

const findOpenStrings = (positions: Position, avoid: number[]): number[] => {
  const allStrings = [1, 2, 3, 4, 5, 6];
  const pressedStrings = Object.keys(positions).map(Number);
  return allStrings.filter(
    str => !pressedStrings.includes(str) && !avoid.includes(str)
  );
};

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

/**
 * Calculates the chord data adjusted for display, including transposition for higher frets.
 * This logic was previously in ChordDrawerBase.transposeForDisplay.
 */
export const getChordDisplayData = (originalChord: ChordDiagramProps): { finalChord: ChordDiagramProps; transportDisplay: number } => {
  const { positions, nut, avoid } = originalChord;
  let finalChord: ChordDiagramProps;

  // Some flows (e.g., `src/lib/chord-logic.ts`) already normalize the shape to fit the diagram
  // and expose the original fret in `chord.transport`.
  const baseTransportDisplay = originalChord.transport && originalChord.transport > 0 ? originalChord.transport : 1;

  const [minFret, maxFret] = findMinNonZeroNote(positions, avoid || [], nut); // Pass empty array if avoid is undefined

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

  // Transpose nut.pos if visible
  let newNut = nut;
  if (nut && nut.vis) {
    const transposedPos = nut.pos > 0 ? nut.pos - transposition : 0;
    newNut = { ...nut, pos: transposedPos };
  }

  finalChord = { ...originalChord, positions: newPositions, nut: newNut };
  return { finalChord, transportDisplay: baseTransportDisplay + transposition };
};
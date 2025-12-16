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
    let minNoteArr = findMinNonZeroNote(chord.positions, chord.avoid, chord.nut);
    let minNote = minNoteArr[0]
    let entries: [string, [number, number, number]][];
    let aux = 0;
    let nut: nutForm = JSON.parse(JSON.stringify(chord.nut)); // Deep copy

    let newPos = 0;

    if (chord.origin === newAchord.note) {
        if(chord.origin === chord.chord.note) return chord;
        nut.vis = chord.origin !== chord.chord.note && nut.add
        if (chord.origin !== chord.chord.note) aux = -1
    } else {
        newPos = minNote + newAchord.note - chord.origin;
        newPos += (newPos < 0) ?  12: 0
        if (chord.origin === chord.chord.note) {
            const openStrings = findOpenStrings(chord.positions, chord.avoid);
            const newStr1 = openStrings[0] || 1;
            const newStr2 = (chord.avoid.length >= 2) ? newStr1 : 6;
            nut.str = [newStr1, newStr2];
            nut.vis = true;
            aux = 1
        } else {
            aux = 1;
            nut.vis = newAchord.note !== chord.chord.note || nut.add
        }
    }
    
    nut.pos += newPos;

    entries = Object.entries(chord.positions).map(([str, [fret, finger, add]]) => {
        if (fret > 0) {
           fret += newPos - minNote;
        }
        return [str, [fret, finger + aux*add, add]] as [string, [number, number, number]];
    });
    
    let position = Object.fromEntries(entries) as Position;

    const finalMinNote = findMinNonZeroNote(position, chord.avoid, nut)[0]
    let transport = 0
    if (finalMinNote > 5) {
        transport = nut.vis ? nut.pos : finalMinNote
        const offset = transport - 1;
        if(nut.vis) nut.pos = 1;

        entries = Object.entries(position).map(([str, [fret, finger, add]]) => {
            if(fret > 0) fret -= offset;
            return [str, [fret, finger, add]] as [string, [number, number, number]];
        });
        position = Object.fromEntries(entries) as Position;
    }


    return { ...chord, chord: newAchord, positions: position, nut: nut, transport };
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
    const [fret, finger, add] = positions[string];
    let newFret = fret > 0 ? fret - transposition : 0;
    let newFinger = finger;

    // Apply trn to finger number if transposition occurred and trn is set
    if (transposition > 0 && nut && nut.vis && nut.trn > 0 && newFinger > 0) {
      newFinger = finger + nut.trn;
    }
    newPositions[string] = [newFret, newFinger, add];
  }
  
  // Transpose nut.pos if visible
  let newNut = nut;
  if (nut && nut.vis) {
    const transposedPos = nut.pos > 0 ? nut.pos - transposition : 0;
    let transposedFin = nut.fin;
    // Apply trn to barre finger if transposition occurred and trn is set
    if (transposition > 0 && nut.trn > 0) { // Removed transposedFin > 0 check
      transposedFin = nut.fin + nut.trn;
    }
    newNut = { ...nut, pos: transposedPos, fin: transposedFin };
  }

  finalChord = { ...originalChord, positions: newPositions, nut: newNut };
  return { finalChord, transportDisplay: baseTransportDisplay + transposition };
};
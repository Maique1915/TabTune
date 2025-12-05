import type { ChordDiagramProps, Achord, nutForm, Position } from './types';

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


    return { ...chord, positions: position, nut: nut, transport };
};

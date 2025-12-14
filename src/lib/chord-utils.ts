import type { ChordDiagramProps } from "@/lib/types";

export interface BarreInfo {
  fret: number;
  fromString: number;
  toString: number;
  finger?: number;
}

// Helper to convert string key to number
type PositionKey = number | string;

export function detectBarre(chord: ChordDiagramProps): BarreInfo | null {
  // Helper to find the last string covered on a given fret by the barre finger
  const findToStringAndFinger = (fret: number, fromString: number, positions: Position): { toString: number; finger?: number } => {
    let toString = fromString;
    let finger: number | undefined;
    for (const stringKey in positions) {
      const stringNumber = parseInt(stringKey);
      const [posFret, posFinger] = positions[stringKey];
      if (posFret === fret && stringNumber >= fromString) {
        if (stringNumber > toString) {
          toString = stringNumber;
        }
        if (stringNumber === fromString && posFinger) {
          finger = posFinger;
        }
      }
    }
    return { toString, finger };
  };

  // 1. Prioritize explicit `chord.barre` property (the [number, number] tuple)
  if (chord.barre && chord.barre.length === 2) {
    const fret = chord.barre[0];
    const fromString = chord.barre[1];
    const { toString, finger } = findToStringAndFinger(fret, fromString, chord.positions);

    return {
      fret: fret,
      fromString: fromString,
      toString: toString,
      finger: finger,
    };
  }

  // 2. Fallback to `chord.nut`
  if (chord.nut && chord.nut.vis) {
    return {
      fret: chord.nut.pos,
      fromString: chord.nut.str[0],
      toString: chord.nut.str[1],
      finger: chord.nut.fin,
    };
  }

  // 3. Fallback to inferring barre from `chord.positions`
  if (!chord.positions) return null;

  const byFret: Record<number, number[]> = {}; // Map fret to list of strings pressed on that fret

  for (const stringKey in chord.positions) {
    const stringNumber = parseInt(stringKey); // Convert string key to number
    const [fret, finger] = chord.positions[stringKey];

    if (fret > 0 && finger > 0) { // Only consider fretted fingers
      if (!byFret[fret]) {
        byFret[fret] = [];
      }
      byFret[fret].push(stringNumber);
    }
  }

  for (const fretStr in byFret) {
    const fret = Number(fretStr);
    const strings = byFret[fret];

    if (strings.length >= 2) {
      let barreFinger: number | undefined;
      const minString = Math.min(...strings);
      for (const stringKey in chord.positions) {
        if (parseInt(stringKey) === minString) {
          barreFinger = chord.positions[stringKey][1];
          break;
        }
      }

      return {
        fret: fret,
        fromString: Math.min(...strings),
        toString: Math.max(...strings),
        finger: barreFinger,
      };
    }
  }

  return null;
}

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
  // 1. Prioritize explicit `chord.barre` property
  if (chord.barre && chord.barre.length === 2) {
    const fret = chord.barre[0];
    const fromString = chord.barre[1];
    let toString = fromString; // Initialize with fromString
    let barreFinger: number | undefined;

    // Find the max string covered and the finger used for the barre
    for (const stringKey in chord.positions) {
      const stringNumber = parseInt(stringKey);
      const [posFret, finger] = chord.positions[stringKey];

      if (posFret === fret && stringNumber >= fromString) {
        if (stringNumber > toString) {
          toString = stringNumber;
        }
        if (stringNumber === fromString && finger) {
          barreFinger = finger; // Get the finger from the starting string of the barre
        }
      }
    }

    return {
      fret: fret,
      fromString: fromString,
      toString: toString,
      finger: barreFinger,
    };
  }

  // 2. Fallback to inferring barre from `chord.positions`
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

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

    // A barre requires at least two strings pressed on the same fret by the same finger
    // To simplify, we'll assume any two or more strings on the same fret constitute a barre for detection.
    // The finger information for the barre will be derived from the first finger found on that fret.
    if (strings.length >= 2) {
      // Find the finger associated with this barre.
      // This is a simplification; a real barre might involve multiple fingers for different string groups.
      // For now, we take the finger of the lowest string that is part of the barre.
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

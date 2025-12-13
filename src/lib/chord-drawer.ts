import type { ChordDiagramProps, Position } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";

interface DrawChordParams {
  ctx: CanvasRenderingContext2D;
  chord: ChordDiagramProps;
  animationState: {
    fingerOpacity: number;
    fingerScale: number;
    cardY: number;
    nameOpacity: number;
  };
  colors: ChordDiagramColors;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Converte uma cor no formato hexadecimal para RGBA com um alfa (opacidade) específico.
 */
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const transposeForDisplay = (chordToTranspose: ChordDiagramProps): { finalChord: ChordDiagramProps, transportDisplay: number } => {
    const { positions, nut, avoid } = chordToTranspose;

    const findMinNonZeroNote = (): [number, number] => {
      let min = Infinity;
      let max = 0;

      if (nut && nut.vis) {
        min = nut.pos;
      }

      Object.entries(positions).forEach(([str, [fret]]) => {
        const stringNumber = parseInt(str);
        if (fret > 0 && !(avoid?.includes(stringNumber))) {
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

    const [minFret, maxFret] = findMinNonZeroNote();

    if (maxFret <= 5 && (!nut || !nut.vis || nut.pos <= 5)) {
      return { finalChord: chordToTranspose, transportDisplay: 1 };
    }
    
    const transposition = (nut && nut.vis) ? nut.pos -1 : minFret > 0 ? minFret -1 : 0;
    
    const newPositions: Position = {};
    for (const string in positions) {
      const [fret, finger, add] = positions[string];
      newPositions[string] = [fret > 0 ? fret - transposition : 0, finger, add];
    }
    
    const newBarre = chordToTranspose.barre ? [chordToTranspose.barre[0] - transposition, chordToTranspose.barre[1]] as [number, number] : undefined;

    const finalChord = { ...chordToTranspose, positions: newPositions, barre: newBarre };

    return { finalChord, transportDisplay: transposition + 1 };
};

export function drawChordOnCanvas(params: DrawChordParams) {
  
}
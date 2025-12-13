import type { ChordDiagramProps, Position } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";

export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const transposeForDisplay = (chordToTranspose: ChordDiagramProps): { finalChord: ChordDiagramProps, transportDisplay: number } => {
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

  if (maxFret <= 4 && (!nut || !nut.vis || nut.pos <= 4)) {
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

/**
 * Desenha o braço do violão (fretboard) com estilo padrão
 */
export function drawFretboard(
  ctx: CanvasRenderingContext2D,
  colors: ChordDiagramColors,
  config: {
    diagramX: number;
    diagramY: number;
    diagramWidth: number;
    diagramHeight: number;
    horizontalPadding: number;
    stringSpacing: number;
    numStrings: number;
  }
) {
  const { diagramX, diagramY, diagramWidth, diagramHeight, horizontalPadding, stringSpacing, numStrings } = config;
  const stringNames = ["E", "A", "D", "G", "B", "e"];

  // Braço com cantos arredondados
  const neckRadius = 30;
  const neckX = diagramX;
  const neckY = diagramY;
  const neckWidth = diagramWidth;
  const neckHeight = diagramHeight;

  ctx.fillStyle = colors.fretboardColor;
  ctx.beginPath();
  ctx.moveTo(neckX + neckRadius, neckY);
  ctx.lineTo(neckX + neckWidth - neckRadius, neckY);
  ctx.quadraticCurveTo(neckX + neckWidth, neckY, neckX + neckWidth, neckY + neckRadius);
  ctx.lineTo(neckX + neckWidth, neckY + neckHeight - neckRadius);
  ctx.quadraticCurveTo(neckX + neckWidth, neckY + neckHeight, neckX + neckWidth - neckRadius, neckY + neckHeight);
  ctx.lineTo(neckX + neckRadius, neckY + neckHeight);
  ctx.quadraticCurveTo(neckX, neckY + neckHeight, neckX, neckY + neckHeight - neckRadius);
  ctx.lineTo(neckX, neckY + neckRadius);
  ctx.quadraticCurveTo(neckX, neckY, neckX + neckRadius, neckY);
  ctx.closePath();
  ctx.fill();

  // Nomes das cordas
  ctx.fillStyle = colors.textColor;
  ctx.font = "bold 35px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const stringNamesY = neckY + 35;
  stringNames.forEach((name, i) => {
    const x = neckX + horizontalPadding + i * stringSpacing;
    ctx.fillText(name, x, stringNamesY);
  });

  // Área do fretboard
  const fretboardX = neckX;
  const fretboardY = neckY + 75;
  const fretboardWidth = neckWidth;
  const fretboardHeight = neckHeight - 75;
  const numFrets = 4;
  const realFretSpacing = fretboardHeight / (1 + numFrets);


  // Trastes (com cabeça grossa e cor específica)
  ctx.strokeStyle = colors.fretColor;
  for (let i = 0; i <= 4; i++) {
    const y = fretboardY + i * realFretSpacing;
    ctx.lineWidth = i === 0 ? (colors.borderWidth * 8) : colors.borderWidth;
    ctx.beginPath();
    ctx.moveTo(fretboardX, y);
    ctx.lineTo(fretboardX + fretboardWidth, y);
    ctx.stroke();
  }

    // Cordas
  if (colors.borderWidth > 0) {
    ctx.strokeStyle = colors.borderColor;
    ctx.lineWidth = colors.stringThickness;
    for (let i = 0; i < numStrings; i++) {
      const x = fretboardX + horizontalPadding + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(x, fretboardY);
      ctx.lineTo(x, fretboardY + fretboardHeight);
      ctx.stroke();
    }
  }


  return {
    fretboardX,
    fretboardY,
    fretboardWidth,
    fretboardHeight,
    realFretSpacing,
    numFrets
  };
}

/**
 * Desenha pestana (barre)
 */
export function drawBarre(
  ctx: CanvasRenderingContext2D,
  barre: [number, number],
  colors: ChordDiagramColors,
  config: {
    fretboardX: number;
    fretboardY: number;
    realFretSpacing: number;
    horizontalPadding: number;
    stringSpacing: number;
    numStrings: number;
  }
) {
  const { fretboardX, fretboardY, realFretSpacing, horizontalPadding, stringSpacing, numStrings } = config;
  
  const fretY = fretboardY + (barre[0] - 0.5) * realFretSpacing;
  const fromX = fretboardX + horizontalPadding + barre[1] * stringSpacing;
  const toX = fretboardX + horizontalPadding + (numStrings - 1 - barre[1]) * stringSpacing;

  ctx.strokeStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
  ctx.lineWidth = 90;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(fromX, fretY);
  ctx.lineTo(toX, fretY);
  ctx.stroke();
  ctx.lineCap = "butt";
}

/**
 * Desenha dedos em posições específicas
 */
export function drawFingers(
  ctx: CanvasRenderingContext2D,
  positions: Position,
  colors: ChordDiagramColors,
  config: {
    fretboardX: number;
    fretboardY: number;
    realFretSpacing: number;
    horizontalPadding: number;
    stringSpacing: number;
  }
) {
  const { fretboardX, fretboardY, realFretSpacing, horizontalPadding, stringSpacing } = config;

  Object.entries(positions).forEach(([key, [fret, finger]]) => {
    const stringIndex = Number(key) - 1;
    if (fret > 0) {
      const x = fretboardX + horizontalPadding + stringIndex * stringSpacing;
      const y = fretboardY + (fret - 0.5) * realFretSpacing;

      ctx.beginPath();
      ctx.fillStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
      ctx.arc(x, y, 45, 0, Math.PI * 2);
      ctx.fill();

      if (colors.fingerBorderWidth > 0) {
        ctx.strokeStyle = colors.fingerBorderColor;
        ctx.lineWidth = colors.fingerBorderWidth;
        ctx.stroke();
      }

      if (finger) {
        ctx.fillStyle = colors.fingerTextColor;
        ctx.font = "bold 60px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(finger), x, y);
      }
    }
  });
}

/**
 * Desenha X nas cordas evitadas
 */
export function drawAvoidedStrings(
  ctx: CanvasRenderingContext2D,
  avoid: number[] | undefined,
  colors: ChordDiagramColors,
  config: {
    diagramY: number;
    diagramHeight: number;
    fretboardX: number;
    horizontalPadding: number;
    stringSpacing: number;
    numStrings: number;
  }
) {
  if (!avoid) return;

  const { diagramY, diagramHeight, fretboardX, horizontalPadding, stringSpacing, numStrings } = config;

  ctx.font = "bold 50px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  for (let i = 0; i < numStrings; i++) {
    const stringNumber = i + 1;
    if (avoid.includes(stringNumber)) {
      const y = diagramY + diagramHeight + 50;
      const x = fretboardX + horizontalPadding + i * stringSpacing;
      ctx.fillStyle = colors.textColor;
      ctx.fillText("x", x, y);
    }
  }
}

/**
 * Desenha indicador de transposição
 */
export function drawTransposeIndicator(
  ctx: CanvasRenderingContext2D,
  transportDisplay: number,
  colors: ChordDiagramColors,
  config: {
    fretboardX: number;
    fretboardY: number;
    realFretSpacing: number;
  }
) {
  if (transportDisplay <= 1) return;

  const { fretboardX, fretboardY, realFretSpacing } = config;

  ctx.fillStyle = colors.textColor;
  ctx.font = "bold 50px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${transportDisplay}ª`, fretboardX - realFretSpacing, fretboardY + (realFretSpacing / 2));
}

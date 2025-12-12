import type { ChordDiagramProps, Position } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";

interface DrawCarouselParams {
  ctx: CanvasRenderingContext2D;
  currentChord: ChordDiagramProps;
  nextChord: ChordDiagramProps | null;
  transitionProgress: number;
  colors: ChordDiagramColors;
  dimensions: {
    width: number;
    height: number;
  };
}

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

function drawSingleChord(
  ctx: CanvasRenderingContext2D,
  chord: ChordDiagramProps,
  offsetX: number,
  opacity: number,
  colors: ChordDiagramColors,
  dimensions: { width: number; height: number }
) {
  const { width, height } = dimensions;
  const stringNames = ["E", "A", "D", "G", "B", "e"];

  const { finalChord, transportDisplay } = transposeForDisplay(chord);
  const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

  const diagramWidth = 500;
  const diagramHeight = diagramWidth + (diagramWidth * 1 / 3);
  const diagramX = (width / 2) - (diagramWidth / 2) + offsetX;
  const diagramY = (height - diagramHeight) / 2 - 50;
  const numStrings = 6;
  const numFrets = 5;
  const horizontalPadding = 40;
  const stringAreaWidth = diagramWidth - (horizontalPadding * 2);
  const stringSpacing = stringAreaWidth / (numStrings - 1);

  ctx.save();
  ctx.globalAlpha = opacity;

  ctx.fillStyle = colors.chordNameColor;
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chordName, width / 2 + offsetX, diagramY - 30);

  const neckRadius = 15;
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

  if (colors.borderWidth > 0) {
    ctx.strokeStyle = colors.borderColor;
    ctx.lineWidth = colors.borderWidth;
    ctx.stroke();
  }

  ctx.fillStyle = colors.textColor;
  ctx.font = "bold 25px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const stringNamesY = neckY + 25;
  stringNames.forEach((name, i) => {
    const x = neckX + horizontalPadding + i * stringSpacing;
    ctx.fillText(name, x, stringNamesY);
  });

  const fretboardX = neckX;
  const fretboardY = neckY + 50;
  const fretboardWidth = neckWidth;
  const fretboardHeight = neckHeight - 50;
  const realFretSpacing = fretboardHeight / numFrets;

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

  for (let i = 0; i <= numFrets; i++) {
    const y = fretboardY + i * realFretSpacing;
    ctx.lineWidth = i === 0 ? (colors.borderWidth * 4) : colors.borderWidth;
    ctx.beginPath();
    ctx.moveTo(fretboardX, y);
    ctx.lineTo(fretboardX + fretboardWidth, y);
    ctx.stroke();
  }

  if (finalChord.barre && finalChord.barre[0] > 0) {
    const fretY = fretboardY + (finalChord.barre[0] - 0.5) * realFretSpacing;
    const fromX = fretboardX + horizontalPadding + finalChord.barre[1] * stringSpacing;
    const toX = fretboardX + horizontalPadding + (numStrings - 1 - finalChord.barre[1]) * stringSpacing;

    ctx.strokeStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fretY);
    ctx.lineTo(toX, fretY);
    ctx.stroke();
    ctx.lineCap = "butt";
  }

  Object.entries(finalChord.positions).forEach(([key, [fret, finger]]) => {
    const stringIndex = Number(key) - 1;
    if (fret > 0) {
      const x = fretboardX + horizontalPadding + stringIndex * stringSpacing;
      const y = fretboardY + (fret - 0.5) * realFretSpacing;

      ctx.beginPath();
      ctx.fillStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      if (colors.fingerBorderWidth > 0) {
        ctx.strokeStyle = colors.fingerBorderColor;
        ctx.lineWidth = colors.fingerBorderWidth;
        ctx.stroke();
      }

      if (finger) {
        ctx.fillStyle = colors.fingerTextColor;
        ctx.font = "bold 25px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(finger), x, y);
      }
    }
  });

  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < numStrings; i++) {
    const stringNumber = i + 1;
    if (finalChord.avoid?.includes(stringNumber)) {
      const y = neckY + neckHeight + 25;
      const x = fretboardX + horizontalPadding + i * stringSpacing;
      ctx.fillStyle = colors.textColor;
      ctx.fillText("x", x, y);
    }
  }

  if (transportDisplay > 1) {
    ctx.fillStyle = colors.textColor;
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${transportDisplay}ª`, fretboardX - realFretSpacing, fretboardY + (realFretSpacing / 2));
  }

  ctx.restore();
}

export function drawCarouselAnimation(params: DrawCarouselParams) {
  const { ctx, currentChord, nextChord, transitionProgress, colors, dimensions } = params;
  const { width, height } = dimensions;

  if (!currentChord) return;

  ctx.fillStyle = colors.cardColor;
  ctx.fillRect(0, 0, width, height);

  const currentOffsetX = -width * transitionProgress;
  const currentOpacity = 1 - transitionProgress;

  const nextOffsetX = width * (1 - transitionProgress);
  const nextOpacity = transitionProgress;

  drawSingleChord(ctx, currentChord, currentOffsetX, currentOpacity, colors, dimensions);

  if (nextChord) {
    drawSingleChord(ctx, nextChord, nextOffsetX, nextOpacity, colors, dimensions);
  }
}

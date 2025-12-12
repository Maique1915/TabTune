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
  const { ctx, chord: originalChord, animationState: state, colors, dimensions } = params;
  const { width, height } = dimensions;
  const stringNames = ["E", "A", "D", "G", "B", "e"];

  if (!originalChord) return;
  
  const { finalChord: currentChord, transportDisplay } = transposeForDisplay(originalChord);

  const chordName = getNome(currentChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

  // Limpar canvas
  ctx.fillStyle = colors.cardColor;
  ctx.fillRect(0, 0, width, height);

  // Configurações do cartão e diagrama
  const cardWidth = 500;
  const diagramWidth = cardWidth - 80;
  const diagramHeight = diagramWidth + (diagramWidth * 1 / 3);
  const cardHeight = 100 + diagramHeight + 60;
  const cardX = (width - cardWidth) / 2;
  const cardY = state.cardY;
  const diagramX = cardX + 40;
  const numStrings = 6;
  const numFrets = 5;
  const horizontalPadding = 20;
  const stringAreaWidth = diagramWidth - (horizontalPadding * 2);
  const stringSpacing = stringAreaWidth / (numStrings - 1);

  // Nome do acorde
  ctx.globalAlpha = state.nameOpacity;
  ctx.fillStyle = colors.chordNameColor;
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chordName, width / 2, cardY + 50);
  ctx.globalAlpha = 1;

  // Desenha o braço (fretboard) e o headstock como uma forma única
  const neckRadius = 15;
  const neckX = diagramX;
  const neckY = cardY + 100;
  const neckWidth = diagramWidth;
  const neckHeight = diagramHeight;

  let currentNeckX = neckX;
  let currentNeckY = neckY;
  let currentNeckWidth = neckWidth;
  let currentNeckHeight = neckHeight;

  // Adjust dimensions to hide anti-aliasing artifact if no border is desired
  const insetAmount = 1; // Inset by 1 pixel on each side
  if (colors.borderWidth === 0) {
      currentNeckX += insetAmount;
      currentNeckY += insetAmount;
      currentNeckWidth -= 2 * insetAmount;
      currentNeckHeight -= 2 * insetAmount;
  }

  ctx.globalAlpha = state.nameOpacity;
  ctx.fillStyle = colors.fretboardColor;

  ctx.beginPath();
  ctx.moveTo(currentNeckX + neckRadius, currentNeckY);
  ctx.lineTo(currentNeckX + currentNeckWidth - neckRadius, currentNeckY);
  ctx.quadraticCurveTo(currentNeckX + currentNeckWidth, currentNeckY, currentNeckX + currentNeckWidth, currentNeckY + neckRadius);
  ctx.lineTo(currentNeckX + currentNeckWidth, currentNeckY + currentNeckHeight - neckRadius);
  ctx.quadraticCurveTo(currentNeckX + currentNeckWidth, currentNeckY + currentNeckHeight, currentNeckX + currentNeckWidth - neckRadius, currentNeckY + currentNeckHeight);
  ctx.lineTo(currentNeckX + neckRadius, currentNeckY + currentNeckHeight);
  ctx.quadraticCurveTo(currentNeckX, currentNeckY + currentNeckHeight, currentNeckX, currentNeckY + currentNeckHeight - neckRadius);
  ctx.lineTo(currentNeckX, currentNeckY + neckRadius);
  ctx.quadraticCurveTo(currentNeckX, currentNeckY, currentNeckX + neckRadius, currentNeckY);
  ctx.closePath();
  ctx.fill();

  if (colors.borderWidth > 0) {
    ctx.strokeStyle = colors.borderColor;
    ctx.lineWidth = colors.borderWidth;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Nomes das cordas na cabeça
  ctx.fillStyle = colors.textColor;
  ctx.font = "bold 25px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const stringNamesY = neckY + 25;
  stringNames.forEach((name, i) => {
    const x = neckX + horizontalPadding + i * stringSpacing;
    ctx.fillText(name, x, stringNamesY);
  });

  // Posições do diagrama real (cordas e trastes)
  const fretboardX = neckX;
  const fretboardY = neckY + 50;
  const fretboardWidth = neckWidth;
  const fretboardHeight = neckHeight - 50;
  const realFretSpacing = fretboardHeight / numFrets;

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

  // Trastes
  for (let i = 0; i <= numFrets; i++) {
    const y = fretboardY + i * realFretSpacing;
    ctx.lineWidth = i === 0 ? (colors.borderWidth * 4) : colors.borderWidth;
    ctx.beginPath();
    ctx.moveTo(fretboardX, y);
    ctx.lineTo(fretboardX + fretboardWidth, y);
    ctx.stroke();
  }

  // Pestana (barre)
  if (currentChord.barre && currentChord.barre[0] > 0) {
    const fretY = fretboardY + (currentChord.barre[0] - 0.5) * realFretSpacing;
    const fromX = fretboardX + horizontalPadding + currentChord.barre[1] * stringSpacing;
    const toX = fretboardX + horizontalPadding + (numStrings - 1 - currentChord.barre[1]) * stringSpacing;

    ctx.strokeStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fretY);
    ctx.lineTo(toX, fretY);
    ctx.stroke();
    ctx.lineCap = "butt";
  }

  // Dedos animados
  ctx.globalAlpha = state.fingerOpacity;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(state.fingerScale, state.fingerScale);
  ctx.translate(-width / 2, -height / 2);

  Object.entries(currentChord.positions).forEach(([key, [fret, finger]]) => {
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

  ctx.restore();
  ctx.globalAlpha = 1;

  // X para cordas bloqueadas
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < numStrings; i++) {
    const stringNumber = i + 1;
    if (currentChord.avoid?.includes(stringNumber)) {
      const y = neckY + neckHeight + 25;
      const x = fretboardX + horizontalPadding + i * stringSpacing;
      ctx.fillStyle = colors.textColor;
      ctx.globalAlpha = state.nameOpacity;
      ctx.fillText("x", x, y);
      ctx.globalAlpha = 1;
    }
  }


  // Número do traste inicial
  if (transportDisplay > 1) {
    ctx.fillStyle = colors.textColor;
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "right";
    ctx.globalAlpha = state.nameOpacity;
    ctx.fillText(`${transportDisplay}ª`, fretboardX - realFretSpacing, fretboardY + (realFretSpacing / 2));
    ctx.globalAlpha = 1;
  }
}
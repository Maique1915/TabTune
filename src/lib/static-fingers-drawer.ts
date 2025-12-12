import type { ChordDiagramProps, Position } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";

interface FingerPosition {
  x: number;
  y: number;
  finger: number;
  string: number;
  fret: number;
  opacity: number;
  scale: number;
}

interface DrawStaticFingersParams {
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

export function drawStaticFingersAnimation(params: DrawStaticFingersParams) {
  const { ctx, currentChord: originalCurrent, nextChord: originalNext, transitionProgress, colors, dimensions } = params;
  const { width, height } = dimensions;
  const stringNames = ["E", "A", "D", "G", "B", "e"];

  if (!originalCurrent) return;

  const { finalChord: currentChord, transportDisplay } = transposeForDisplay(originalCurrent);
  const nextTransposed = originalNext ? transposeForDisplay(originalNext) : null;
  const nextChord = nextTransposed?.finalChord || null;

  const chordName = getNome(currentChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

  // Limpar canvas
  ctx.fillStyle = colors.cardColor;
  ctx.fillRect(0, 0, width, height);

  // Configurações do diagrama (centralizado)
  const diagramWidth = 500;
  const diagramHeight = diagramWidth + (diagramWidth * 1 / 3);
  const diagramX = (width - diagramWidth) / 2;
  const diagramY = (height - diagramHeight) / 2 - 50;
  const numStrings = 6;
  const numFrets = 5;
  const horizontalPadding = 40;
  const stringAreaWidth = diagramWidth - (horizontalPadding * 2);
  const stringSpacing = stringAreaWidth / (numStrings - 1);

  // Nome do acorde (fade durante transição)
  const nextChordName = nextChord ? getNome(nextChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "";
  
  // Fade out do nome atual
  ctx.globalAlpha = 1 - transitionProgress;
  ctx.fillStyle = colors.chordNameColor;
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chordName, width / 2, diagramY - 30);
  
  // Fade in do próximo nome
  if (nextChordName) {
    ctx.globalAlpha = transitionProgress;
    ctx.fillText(nextChordName, width / 2, diagramY - 30);
  }
  ctx.globalAlpha = 1;

  // Desenha o braço (fretboard) - sempre estático no centro
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

  // Nomes das cordas
  ctx.fillStyle = colors.textColor;
  ctx.font = "bold 25px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const stringNamesY = neckY + 25;
  stringNames.forEach((name, i) => {
    const x = neckX + horizontalPadding + i * stringSpacing;
    ctx.fillText(name, x, stringNamesY);
  });

  // Posições do diagrama
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

  // Pestana (barre) - transição entre acordes
  if (currentChord.barre && currentChord.barre[0] > 0) {
    const barreOpacity = 1 - transitionProgress;
    const fretY = fretboardY + (currentChord.barre[0] - 0.5) * realFretSpacing;
    const fromX = fretboardX + horizontalPadding + currentChord.barre[1] * stringSpacing;
    const toX = fretboardX + horizontalPadding + (numStrings - 1 - currentChord.barre[1]) * stringSpacing;

    ctx.globalAlpha = barreOpacity;
    ctx.strokeStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fretY);
    ctx.lineTo(toX, fretY);
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.globalAlpha = 1;
  }

  if (nextChord?.barre && nextChord.barre[0] > 0) {
    const barreOpacity = transitionProgress;
    const fretY = fretboardY + (nextChord.barre[0] - 0.5) * realFretSpacing;
    const fromX = fretboardX + horizontalPadding + nextChord.barre[1] * stringSpacing;
    const toX = fretboardX + horizontalPadding + (numStrings - 1 - nextChord.barre[1]) * stringSpacing;

    ctx.globalAlpha = barreOpacity;
    ctx.strokeStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fretY);
    ctx.lineTo(toX, fretY);
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.globalAlpha = 1;
  }

  // Calcular posições dos dedos
  const getFingerPositions = (chord: ChordDiagramProps): Map<number, FingerPosition> => {
    const positions = new Map<number, FingerPosition>();
    Object.entries(chord.positions).forEach(([key, [fret, finger]]) => {
      if (fret > 0 && finger) {
        const stringIndex = Number(key) - 1;
        const x = fretboardX + horizontalPadding + stringIndex * stringSpacing;
        const y = fretboardY + (fret - 0.5) * realFretSpacing;
        positions.set(finger, {
          x,
          y,
          finger,
          string: stringIndex,
          fret,
          opacity: 1,
          scale: 1
        });
      }
    });
    return positions;
  };

  const currentFingers = getFingerPositions(currentChord);
  const nextFingers = nextChord ? getFingerPositions(nextChord) : new Map();

  // Desenhar dedos com animação
  const allFingerNumbers = new Set([...currentFingers.keys(), ...nextFingers.keys()]);

  allFingerNumbers.forEach((fingerNum) => {
    const current = currentFingers.get(fingerNum);
    const next = nextFingers.get(fingerNum);

    let x: number, y: number, opacity: number, scale: number;

    if (current && next) {
      // Dedo existe em ambos - interpolar posição
      x = current.x + (next.x - current.x) * transitionProgress;
      y = current.y + (next.y - current.y) * transitionProgress;
      opacity = 1;
      scale = 1;
    } else if (current && !next) {
      // Dedo desaparece - fade out e escala
      x = current.x;
      y = current.y;
      opacity = 1 - transitionProgress;
      scale = 1 - (transitionProgress * 0.5);
    } else if (!current && next) {
      // Dedo aparece - fade in e escala
      x = next.x;
      y = next.y;
      opacity = transitionProgress;
      scale = 0.5 + (transitionProgress * 0.5);
    } else {
      return;
    }

    ctx.globalAlpha = opacity;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.fillStyle = hexToRgba(colors.fingerColor, colors.fingerBackgroundAlpha);
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    if (colors.fingerBorderWidth > 0) {
      ctx.strokeStyle = colors.fingerBorderColor;
      ctx.lineWidth = colors.fingerBorderWidth;
      ctx.stroke();
    }

    ctx.fillStyle = colors.fingerTextColor;
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(fingerNum), 0, 0);

    ctx.restore();
    ctx.globalAlpha = 1;
  });

  // X para cordas bloqueadas - com transição
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  const currentAvoid = currentChord.avoid || [];
  const nextAvoid = nextChord?.avoid || [];
  const allAvoidStrings = new Set([...currentAvoid, ...nextAvoid]);

  allAvoidStrings.forEach((stringNumber) => {
    const inCurrent = currentAvoid.includes(stringNumber);
    const inNext = nextAvoid.includes(stringNumber);
    const i = stringNumber - 1;
    const y = neckY + neckHeight + 25;
    const x = fretboardX + horizontalPadding + i * stringSpacing;

    let opacity = 0;
    if (inCurrent && inNext) {
      opacity = 1;
    } else if (inCurrent && !inNext) {
      opacity = 1 - transitionProgress;
    } else if (!inCurrent && inNext) {
      opacity = transitionProgress;
    }

    ctx.fillStyle = colors.textColor;
    ctx.globalAlpha = opacity;
    ctx.fillText("x", x, y);
  });
  ctx.globalAlpha = 1;

  // Número do traste inicial
  if (transportDisplay > 1) {
    ctx.fillStyle = colors.textColor;
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${transportDisplay}ª`, fretboardX - realFretSpacing, fretboardY + (realFretSpacing / 2));
  }
}

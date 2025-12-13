import type { ChordDiagramProps } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";
import {
  hexToRgba,
  transposeForDisplay,
  drawFretboard,
  drawBarre,
  drawAvoidedStrings,
  drawTransposeIndicator
} from "./chord-drawer-base";

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

export function drawStaticFingersAnimation(params: DrawStaticFingersParams) {
  const { ctx, currentChord: originalCurrent, nextChord: originalNext, transitionProgress, colors, dimensions } = params;
  const { width, height } = dimensions;

  if (!originalCurrent) return;

  const { finalChord: currentChord, transportDisplay } = transposeForDisplay(originalCurrent);
  const nextTransposed = originalNext ? transposeForDisplay(originalNext) : null;
  const nextChord = nextTransposed?.finalChord || null;

  const chordName = getNome(currentChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

  // Limpar canvas
  ctx.fillStyle = colors.cardColor;
  ctx.fillRect(0, 0, width, height);

  // Configurações do diagrama (centralizado) - MESMO ESTILO DO CAROUSEL
  const diagramWidth = 600;
  const diagramHeight = diagramWidth + (diagramWidth * 2/ 5);
  const diagramX = (width - diagramWidth) / 2;
  const diagramY = (height - diagramHeight) / 2;
  const numStrings = 6;
  const horizontalPadding = 40;
  const stringAreaWidth = diagramWidth - (horizontalPadding * 2);
  const stringSpacing = stringAreaWidth / (numStrings - 1);

  // Nome do acorde (fade durante transição)
  const nextChordName = nextChord ? getNome(nextChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "";
  
  // Fade out do nome atual
  ctx.globalAlpha = 1 - transitionProgress;
  ctx.fillStyle = colors.chordNameColor;
  ctx.font = "bold 70px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chordName, width / 2, diagramY - 80);
  
  // Fade in do próximo nome
  if (nextChordName) {
    ctx.globalAlpha = transitionProgress;
    ctx.fillText(nextChordName, width / 2, diagramY - 80);
  }
  ctx.globalAlpha = 1;

  // Desenha o braço do violão - MESMO ESTILO DO CAROUSEL
  const fretboardConfig = drawFretboard(ctx, colors, {
    diagramX,
    diagramY,
    diagramWidth,
    diagramHeight,
    horizontalPadding,
    stringSpacing,
    numStrings
  });

  const { fretboardX, fretboardY, realFretSpacing } = fretboardConfig;

  // Pestana (barre) - transição entre acordes
  if (currentChord.barre || nextChord?.barre) {
    const currentBarre = currentChord.barre;
    const nextBarre = nextChord?.barre;

    if (currentBarre && nextBarre) {
      // Interpolar entre pestanas
      const fret = currentBarre[0] + (nextBarre[0] - currentBarre[0]) * transitionProgress;
      const fromString = currentBarre[1] + (nextBarre[1] - currentBarre[1]) * transitionProgress;
      
      drawBarre(ctx, [fret, fromString], colors, {
        fretboardX,
        fretboardY,
        realFretSpacing,
        horizontalPadding,
        stringSpacing,
        numStrings
      });
    } else if (currentBarre && !nextBarre) {
      // Fade out da pestana
      ctx.globalAlpha = 1 - transitionProgress;
      drawBarre(ctx, currentBarre, colors, {
        fretboardX,
        fretboardY,
        realFretSpacing,
        horizontalPadding,
        stringSpacing,
        numStrings
      });
      ctx.globalAlpha = 1;
    } else if (!currentBarre && nextBarre) {
      // Fade in da pestana
      ctx.globalAlpha = transitionProgress;
      drawBarre(ctx, nextBarre, colors, {
        fretboardX,
        fretboardY,
        realFretSpacing,
        horizontalPadding,
        stringSpacing,
        numStrings
      });
      ctx.globalAlpha = 1;
    }
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
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();

    if (colors.fingerBorderWidth > 0) {
      ctx.strokeStyle = colors.fingerBorderColor;
      ctx.lineWidth = colors.fingerBorderWidth;
      ctx.stroke();
    }

    ctx.fillStyle = colors.fingerTextColor;
    ctx.font = "bold 50px sans-serif";
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
    const y = diagramY + diagramHeight + 25;
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

  // Número do traste inicial (com animação durante transição)
  const nextTransportDisplay = nextTransposed?.transportDisplay || 1;
  
  // Fade out do texto atual
  if (transportDisplay > 1) {
    ctx.globalAlpha = 1 - transitionProgress;
    drawTransposeIndicator(ctx, transportDisplay, colors, {
      fretboardX,
      fretboardY,
      realFretSpacing
    });
  }
  
  // Fade in do próximo texto (se houver transição)
  if (nextTransportDisplay > 1 && transitionProgress > 0) {
    ctx.globalAlpha = transitionProgress;
    drawTransposeIndicator(ctx, nextTransportDisplay, colors, {
      fretboardX,
      fretboardY,
      realFretSpacing
    });
  }
  
  ctx.globalAlpha = 1;
}

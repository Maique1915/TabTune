import type { ChordDiagramProps } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";
import {
  transposeForDisplay,
  drawFretboard,
  drawBarre,
  drawFingers,
  drawAvoidedStrings,
  drawTransposeIndicator
} from "./chord-drawer-base";

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

function drawSingleChord(
  ctx: CanvasRenderingContext2D,
  chord: ChordDiagramProps,
  offsetX: number,
  opacity: number,
  colors: ChordDiagramColors,
  dimensions: { width: number; height: number }
) {
  const { width, height } = dimensions;

  const { finalChord, transportDisplay } = transposeForDisplay(chord);
  const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

  const diagramWidth = 600;
  const diagramHeight = diagramWidth + (diagramWidth * 2/ 5);
  const diagramX = (width / 2) - (diagramWidth / 2) + offsetX;
  const diagramY = (height - diagramHeight) / 2;
  const numStrings = 6;
  const horizontalPadding = 40;
  const stringAreaWidth = diagramWidth - (horizontalPadding * 2);
  const stringSpacing = stringAreaWidth / (numStrings - 1);

  ctx.save();
  ctx.globalAlpha = opacity;

  // Nome do acorde
  ctx.fillStyle = colors.chordNameColor;
  ctx.font = "bold 70px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chordName, width / 2 + offsetX, diagramY - 80);

  // Desenha o braço do violão
  const fretboardConfig = drawFretboard(ctx, colors, {
    diagramX,
    diagramY,
    diagramWidth,
    diagramHeight,
    horizontalPadding,
    stringSpacing,
    numStrings
  });

  // Desenha pestana (barre) se houver
  if (finalChord.barre && finalChord.barre[0] > 0) {
    drawBarre(ctx, finalChord.barre, colors, {
      ...fretboardConfig,
      horizontalPadding,
      stringSpacing,
      numStrings
    });
  }

  // Desenha dedos
  drawFingers(ctx, finalChord.positions, colors, {
    ...fretboardConfig,
    horizontalPadding,
    stringSpacing
  });

  // Desenha X nas cordas evitadas
  drawAvoidedStrings(ctx, finalChord.avoid, colors, {
    diagramY,
    diagramHeight,
    fretboardX: fretboardConfig.fretboardX,
    horizontalPadding,
    stringSpacing,
    numStrings
  });

  // Desenha indicador de transposição
  drawTransposeIndicator(ctx, transportDisplay, colors, {
    fretboardX: fretboardConfig.fretboardX,
    fretboardY: fretboardConfig.fretboardY,
    realFretSpacing: fretboardConfig.realFretSpacing
  });

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

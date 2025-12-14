import type { ChordDiagramProps } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";

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
  allChords?: ChordDiagramProps[];
  index?: number;
}

function drawChordAtPosition(
  drawer: ChordDrawerBase,
  chord: ChordDiagramProps,
  offsetX: number,
  opacity: number
) {
  const ctx = drawer.ctx;
  ctx.save();
  ctx.globalAlpha = opacity;

  // Transpor acorde
  const { finalChord, transportDisplay } = drawer.transposeForDisplay(chord);
  const chordName = getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭");

  // Aplicar centralização base
  const baseOffset = drawer.applyCentering();
  
  // Adicionar offset do carrossel
  ctx.translate(offsetX, 0);

  // Desenhar nome do acorde
  drawer.drawChordName(chordName);
  
  // Desenhar fretboard
  drawer.drawFretboard();

  // Desenhar pestana
  if (finalChord.barre) {
    drawer.drawBarre(finalChord.barre);
  }

  // Desenhar dedos
  drawer.drawFingers(finalChord.positions);

  // Desenhar cordas evitadas (X)
  drawer.drawAvoidedStrings(finalChord.avoid || []);

  // Indicador de transposição
  drawer.drawTransposeIndicator(transportDisplay);

  // Remover translate de offset do carrossel
  ctx.translate(-offsetX, 0);
  
  // Remover centralização base
  drawer.removeCentering(baseOffset);
  
  ctx.restore();
}

export function drawCarouselAnimation(params: DrawCarouselParams) {
  const { ctx, currentChord, nextChord, transitionProgress, colors, dimensions } = params;

  if (!currentChord) return;

  // Criar drawer
  const drawer = new ChordDrawerBase(ctx, colors, dimensions);
  
  // Limpar canvas
  drawer.clearCanvas();

  // Calcular offsets para animação de slide
  const currentOffsetX = -dimensions.width * transitionProgress;
  const currentOpacity = 1 - transitionProgress;

  const nextOffsetX = dimensions.width * (1 - transitionProgress);
  const nextOpacity = transitionProgress;

  // Desenhar acorde atual (saindo para a esquerda)
  drawChordAtPosition(drawer, currentChord, currentOffsetX, currentOpacity);

  // Desenhar próximo acorde (entrando pela direita)
  if (nextChord) {
    drawChordAtPosition(drawer, nextChord, nextOffsetX, nextOpacity);
  }
}
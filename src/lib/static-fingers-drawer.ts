import type { ChordDiagramProps } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { getNome } from "@/lib/chords";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";

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
  buildProgress?: number;
}

export function drawStaticFingersAnimation(params: DrawStaticFingersParams) {
  const { ctx, currentChord: originalCurrent, nextChord: originalNext, transitionProgress, colors, dimensions, buildProgress } = params;

  if (!originalCurrent) return;

  // Criar instância do drawer
  const drawer = new ChordDrawerBase(ctx, colors, dimensions);
  
  // Limpar canvas
  drawer.clearCanvas();

  const centeringOffset = drawer.applyCentering();

  // Se buildProgress está definido e < 1, usar animação build-in
  if (buildProgress !== undefined && buildProgress < 1) {
    drawer.drawChordWithBuildAnimation(originalCurrent, buildProgress);
  } else if (originalNext && transitionProgress > 0) {
    // Se há próximo acorde e transição em andamento, usar animação de transição
    drawer.drawChordWithTransition(originalCurrent, originalNext, transitionProgress);
  } else {
    // Sem transição, desenhar acorde estático
    drawer.drawChord(originalCurrent);
  }
  
  drawer.removeCentering(centeringOffset);
}


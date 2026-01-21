import type { ChordDiagramProps } from "@/modules/core/domain/types";
import { ChordDrawerBase } from "@/modules/engine/infrastructure/drawers/chord-drawer-base";

/**
 * Especialista em desenhar acordes com animação de "dedos estáticos"
 * (Transição direta entre posições dos dedos sem interpolar trastes absolutos)
 */
export function drawStaticFingersAnimation({
  drawer,
  currentDisplayChord,
  nextDisplayChord,
  transitionProgress,
  skipFretboard = false
}: {
  drawer: ChordDrawerBase;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number };
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number } | null;
  transitionProgress: number;
  buildProgress?: number;
  skipFretboard?: boolean;
}): void {
  const { finalChord: currentFinalChord, transportDisplay: currentTransportDisplay } = currentDisplayChord;
  const { finalChord: nextFinalChord, transportDisplay: nextTransportDisplay } = nextDisplayChord || { finalChord: null, transportDisplay: null };

  const drawOptions = { skipFretboard };

  const centeringOffset = drawer.applyCentering();

  // Se não há próximo acorde ou o progresso é 0, desenha o atual estático
  if (!nextDisplayChord || transitionProgress <= 0) {
    console.log('🎵 Drawing static chord (no transition)');
    drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, drawOptions);
  } else if (nextDisplayChord && transitionProgress > 0) {
    if (nextFinalChord && nextTransportDisplay != null) { // Use != to check both null and undefined
      console.log('🔄 Drawing TRANSITION animation', transitionProgress);
      drawer.drawChordWithTransition(currentFinalChord, currentTransportDisplay, nextFinalChord, nextTransportDisplay, transitionProgress, 0, drawOptions);
    } else {
      console.log('🎵 Drawing static chord (no next)', { nextFinalChord: !!nextFinalChord, nextTransportDisplay });
      drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, drawOptions);
    }
  } else {
    console.log('🎵 Drawing static chord (fallback)');
    drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, drawOptions);
  }

  drawer.removeCentering(centeringOffset);
}

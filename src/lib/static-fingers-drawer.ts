import type { ChordDiagramProps } from "@/lib/types";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";

interface DrawStaticFingersParams {
  drawer: ChordDrawerBase;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; };
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; } | null;
  transitionProgress: number;
  buildProgress?: number;
  skipFretboard?: boolean;
}

export function drawStaticFingersAnimation(params: DrawStaticFingersParams) {
  const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress, buildProgress, skipFretboard } = params;

  if (!currentDisplayChord) return;

  // Clear canvas
  if (skipFretboard) {
    // If skipping fretboard (layered mode), we clear to transparent
    const { width, height } = drawer.dimensions;
    drawer.ctx.clearRect(0, 0, width, height);
  } else {
    // Normal mode: fill with background color
    drawer.clearCanvas();
  }

  const centeringOffset = drawer.applyCentering();

  const currentFinalChord = currentDisplayChord.finalChord;
  const currentTransportDisplay = currentDisplayChord.transportDisplay;
  const nextFinalChord = nextDisplayChord?.finalChord || null;
  const nextTransportDisplay = nextDisplayChord?.transportDisplay || null;

  const drawOptions = { skipFretboard };

  if (buildProgress !== undefined && buildProgress < 1) {
    drawer.drawChordWithBuildAnimation(currentFinalChord, currentTransportDisplay, buildProgress, 0, drawOptions);
  } else if (nextDisplayChord && transitionProgress > 0) {
    if (nextFinalChord && nextTransportDisplay !== null) {
      drawer.drawChordWithTransition(currentFinalChord, currentTransportDisplay, nextFinalChord, nextTransportDisplay, transitionProgress, 0, drawOptions);
    } else {
      drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, drawOptions);
    }
  } else {
    drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, drawOptions);
  }

  drawer.removeCentering(centeringOffset);
}



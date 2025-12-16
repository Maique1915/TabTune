import type { ChordDiagramProps } from "@/lib/types";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";

interface DrawStaticFingersParams {
  drawer: ChordDrawerBase;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; }; // Changed
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; } | null; // Changed
  transitionProgress: number;
  buildProgress?: number;
}

export function drawStaticFingersAnimation(params: DrawStaticFingersParams) {
  const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress, buildProgress } = params; // Changed

  if (!currentDisplayChord) return; // Still check for existence

  // Limpar canvas
  drawer.clearCanvas();

  const centeringOffset = drawer.applyCentering();

  const currentFinalChord = currentDisplayChord.finalChord;
  const currentTransportDisplay = currentDisplayChord.transportDisplay;
  const nextFinalChord = nextDisplayChord?.finalChord || null;
  const nextTransportDisplay = nextDisplayChord?.transportDisplay || null; // Will need to handle null for next

  if (buildProgress !== undefined && buildProgress < 1) {
    drawer.drawChordWithBuildAnimation(currentFinalChord, currentTransportDisplay, buildProgress); // Updated params
  } else if (nextDisplayChord && transitionProgress > 0) { // Check for nextDisplayChord existence
    // If there is a next chord and transition is in progress, use transition animation
    // nextTransportDisplay might be null if nextDisplayChord is null. Need to check
    if (nextFinalChord && nextTransportDisplay !== null) { // Additional null check
      drawer.drawChordWithTransition(currentFinalChord, currentTransportDisplay, nextFinalChord, nextTransportDisplay, transitionProgress); // Updated params
    } else {
      drawer.drawChord(currentFinalChord, currentTransportDisplay); // Fallback if next is somehow invalid
    }
  } else {
    // No transition, draw static chord
    drawer.drawChord(currentFinalChord, currentTransportDisplay); // Updated params
  }
  
  drawer.removeCentering(centeringOffset);
}



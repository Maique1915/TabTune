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

export function drawCarouselAnimation(params: DrawCarouselParams) {
  const { ctx, currentChord, nextChord, transitionProgress, colors, dimensions } = params;

  if (!currentChord) return;

  // Criar drawer
  const drawer = new ChordDrawerBase(ctx, colors, dimensions);
  
  // Limpar canvas
  drawer.clearCanvas();

  // If there's a next chord, we are in a transition animation
  if (nextChord) {
    // drawer.drawChordWithTransition already handles the offsets internally
    // We just need to calculate the main offsetX for the carousel
    const offsetX = -dimensions.width * transitionProgress;
    drawer.calculateWithOffset(offsetX); // Set the base offset for the drawer
    drawer.drawChordWithTransition(currentChord, nextChord, transitionProgress, offsetX);
  } else {
    // If no next chord, it's a static display of the current chord
    // or the end state of a transition (where progress would be 1)
    // Here we can simply call drawChord or drawChordWithBuildAnimation
    // For simplicity, let's call drawChord. If animations are desired for static,
    // that logic needs to be handled in the caller (e.g., progress from 0 to 1)
    drawer.drawChord(currentChord);
  }
}
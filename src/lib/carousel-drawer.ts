import type { ChordDiagramProps } from "@/lib/types";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";
import { easeInOutQuad } from "@/lib/animacao";

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

  // Create a new drawer for each frame to ensure clean state
  const drawer = new ChordDrawerBase(ctx, colors, dimensions);
  drawer.clearCanvas();

  const centerAndDraw = (chord: ChordDiagramProps, offsetX: number = 0) => {
    const chordDrawer = new ChordDrawerBase(ctx, colors, dimensions);
    chordDrawer.calculateWithOffset(offsetX);
    chordDrawer.drawChord(chord);
  };

  if (nextChord) {
    const easedProgress = easeInOutQuad(transitionProgress);

    // 1. Draw current chord sliding out to the left
    const currentOffsetX = -easedProgress * (dimensions.width);
    centerAndDraw(currentChord, currentOffsetX);

    // 2. Draw next chord sliding in from the right
    const nextOffsetX = dimensions.width - (easedProgress * dimensions.width);
    centerAndDraw(nextChord, nextOffsetX);

  } else {
    // Static display of the current chord, perfectly centered
    centerAndDraw(currentChord, 0);
  }
}
import type { ChordDiagramProps } from "@/lib/types";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";
import { easeInOutQuad } from "@/lib/animacao";

interface DrawCarouselParams {
  drawer: ChordDrawerBase;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; };
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; } | null;
  transitionProgress: number;
  allChords?: ChordDiagramProps[];
  index?: number;
}

export function drawCarouselAnimation(params: DrawCarouselParams) {
  const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress } = params;

  if (!currentDisplayChord) return;

  drawer.clearCanvas();

  const currentFinalChord = currentDisplayChord.finalChord;
  const currentTransportDisplay = currentDisplayChord.transportDisplay;
  const nextFinalChord = nextDisplayChord?.finalChord || null;
  const nextTransportDisplay = nextDisplayChord?.transportDisplay || null;

  const centerAndDraw = (finalChord: ChordDiagramProps, transportDisplay: number, offsetX: number = 0) => {
    drawer.calculateWithOffset(offsetX);
    drawer.drawChord(finalChord, transportDisplay, offsetX);
  };

  if (nextDisplayChord) { // Check for nextDisplayChord existence
    const easedProgress = easeInOutQuad(transitionProgress);

    // 1. Draw current chord sliding out to the left
    const currentOffsetX = -easedProgress * (drawer.dimensions.width);
    centerAndDraw(currentFinalChord, currentTransportDisplay, currentOffsetX);

    // 2. Draw next chord sliding in from the right
    const nextOffsetX = drawer.dimensions.width - (easedProgress * drawer.dimensions.width);
    if (nextFinalChord && nextTransportDisplay !== null) {
      centerAndDraw(nextFinalChord, nextTransportDisplay, nextOffsetX);
    }

  } else {
    // Static display of the current chord, perfectly centered
    centerAndDraw(currentFinalChord, currentTransportDisplay, 0);
  }
}
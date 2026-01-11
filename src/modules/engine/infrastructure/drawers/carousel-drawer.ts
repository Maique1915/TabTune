import type { ChordDiagramProps } from "@/modules/core/domain/types";
import { ChordDrawerBase } from "@/lib/chord-drawer-base";
import { easeInOutQuad } from "../utils/animacao";

interface DrawCarouselParams {
  drawer: ChordDrawerBase;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; }; // Used for transition/focus details
  transitionProgress: number; // 0 to 1
  allChords: { finalChord: ChordDiagramProps; transportDisplay: number }[]; // Full list
  currentIndex: number; // Index of the 'current' chord (the one leaving or staying)
}

export function drawCarouselAnimation(params: DrawCarouselParams) {
  const { drawer, transitionProgress, allChords, currentIndex } = params;

  if (!allChords || allChords.length === 0 || currentIndex < 0 || currentIndex >= allChords.length) return;

  drawer.clearCanvas();

  const centerAndDraw = (finalChord: ChordDiagramProps, transportDisplay: number, offsetX: number = 0, opacity: number = 1.0) => {
    // Optimization: Don't draw if completely off-screen
    // The chord width is roughly drawer.diagramWidth.
    // Width of visible area is roughly drawer.dimensions.width
    // Center is 0. Visible range is [-width/2, +width/2].
    // We add diagramWidth to threshold to ensure partially visible chords are drawn.
    const threshold = (drawer.dimensions.width / 2) + (drawer.diagramWidth);
    if (offsetX < -threshold || offsetX > threshold) return;

    drawer.ctx.save();
    drawer.ctx.globalAlpha = opacity;
    drawer.calculateWithOffset(offsetX);
    drawer.drawChord(finalChord, transportDisplay, offsetX);
    drawer.ctx.restore();
  };

  const easedProgress = easeInOutQuad(transitionProgress);

  // Spacing between chords: diagramWidth + some padding. 
  // User wanted them "closer", so 1.4x diagramWidth is a good starting point for visibility.
  const spacing = drawer.diagramWidth * 1.4;

  // Opacity constants
  const ACTIVE_OPACITY = 1.0;
  const INACTIVE_OPACITY = 0.4;

  // The base offset shifts everything to the left as progress goes 0 -> 1
  const baseShift = -easedProgress * spacing;

  // Direction: Right (Nexts) including Current
  for (let i = currentIndex; i < allChords.length; i++) {
    const relIndex = i - currentIndex;
    const offset = (relIndex * spacing) + baseShift;

    // Optimization: Break early if we go too far right
    const threshold = (drawer.dimensions.width / 2) + drawer.diagramWidth;
    if (offset > threshold) break;

    // Calculate opacity
    let opacity = INACTIVE_OPACITY; // Default
    if (i === currentIndex) {
      // Current chord fading OUT (1.0 -> 0.4)
      opacity = ACTIVE_OPACITY + (INACTIVE_OPACITY - ACTIVE_OPACITY) * easedProgress;
    } else if (i === currentIndex + 1) {
      // Next chord fading IN (0.4 -> 1.0)
      opacity = INACTIVE_OPACITY + (ACTIVE_OPACITY - INACTIVE_OPACITY) * easedProgress;
    }

    centerAndDraw(allChords[i].finalChord, allChords[i].transportDisplay, offset, opacity);
  }

  // Direction: Left (Previouses)
  for (let i = currentIndex - 1; i >= 0; i--) {
    const relIndex = i - currentIndex;
    const offset = (relIndex * spacing) + baseShift;

    // Optimization: Break early if we go too far left
    const threshold = (drawer.dimensions.width / 2) + drawer.diagramWidth;
    if (offset < -threshold) break;

    // Previous chords are always inactive/faded
    centerAndDraw(allChords[i].finalChord, allChords[i].transportDisplay, offset, INACTIVE_OPACITY);
  }
}
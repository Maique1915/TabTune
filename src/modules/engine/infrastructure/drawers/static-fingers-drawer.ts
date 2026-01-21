import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";
import { ChordDrawer } from "./ChordDrawer";
import { easeInOutQuad, withCanvasTransformAtPoint, withCanvasTransformAround } from "../utils/animacao";
import { getNome } from "@/modules/core/domain/chord-logic";

interface DrawStaticFingersParams {
  drawer: ChordDrawer;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; };
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; } | null;
  transitionProgress: number;
  buildProgress?: number;
  skipFretboard?: boolean;
}

/**
 * Detects the primary barre in a chord (Logic adapted from ShortNeckDrawer)
 */
function detectBarre(fingers: StandardPosition[]): BarreInfo | null {
  if (!fingers || fingers.length === 0) return null;

  let bestBarre: BarreInfo | null = null;
  let maxStrings = 1;

  fingers.forEach(f => {
    const isBarre = f.endString !== undefined && f.endString !== f.string;
    if (isBarre) {
      const start = Math.min(f.string, f.endString!);
      const end = Math.max(f.string, f.endString!);
      const span = end - start + 1;

      if (span > maxStrings) {
        maxStrings = span;
        bestBarre = {
          fret: f.fret,
          finger: f.finger ?? 1,
          startString: start,
          endString: end
        };
      }
    }
  });

  return bestBarre;
}

export function drawStaticFingersAnimation(params: DrawStaticFingersParams) {
  const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress, buildProgress, skipFretboard } = params;

  if (!currentDisplayChord) return;
  const ctx = drawer.ctx;

  // 1. Clear Canvas
  if (skipFretboard) {
    const { width, height } = drawer.dimensions;
    ctx.clearRect(0, 0, width, height);
  } else {
    drawer.clear();
  }

  // 2. Apply Centering (if any)
  // const centeringOffset = drawer.applyCentering();

  const currentFinalChord = currentDisplayChord.finalChord;
  const currentTransportDisplay = currentDisplayChord.transportDisplay;

  // 3. Draw Logic
  if (buildProgress !== undefined && buildProgress < 1) {
    // Intro Animation
    drawer.drawChordWithBuildAnimation(
      currentFinalChord,
      currentTransportDisplay,
      buildProgress,
      0
    );
  } else if (nextDisplayChord && transitionProgress > 0) {
    // Custom Transition Animation
    // BUFFER: Pre-calculate the VISUAL state (relative frets + offset) for both chords
    // This prevents the animation from interpolating absolute frets (e.g. 6->5) and instead
    // interpolates relative frets (e.g. 1->1) + applies transport text change.
    const currentVisual = drawer.transposeForDisplay(
      currentDisplayChord.finalChord,
      currentDisplayChord.transportDisplay
    );
    const nextVisual = drawer.transposeForDisplay(
      nextDisplayChord.finalChord,
      nextDisplayChord.transportDisplay
    );

    // Pass the PRE-TRANSPOSED visual chords to drawTransition
    drawTransition(drawer, { finalChord: currentVisual.finalChord, transportDisplay: currentVisual.transportDisplay }, { finalChord: nextVisual.finalChord, transportDisplay: nextVisual.transportDisplay }, transitionProgress, skipFretboard);
  } else {
    // Static Draw
    drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
  }

  // drawer.removeCentering(centeringOffset);
}

function drawTransition(
  drawer: ChordDrawer,
  current: { finalChord: ChordDiagramProps; transportDisplay: number; },
  next: { finalChord: ChordDiagramProps; transportDisplay: number; },
  progress: number,
  skipFretboard?: boolean
) {
  const ctx = drawer.ctx;
  const eased = easeInOutQuad(progress);

  const curChord = current.finalChord;
  const nxtChord = next.finalChord;

  // --- 1. Draw Chord Name (Cross-Fade/Slide) ---
  const currentName = curChord.chordName || (curChord.chord ? getNome(curChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "");
  const nextName = nxtChord.chordName || (nxtChord.chord ? getNome(nxtChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "");

  // Use helper if accessible, otherwise implement manually. 
  // ChordDrawerBase has `drawChordName`. We can't interpolate nicely with it.
  // We'll implement a simple cross-fade/slide for name here.
  // Assuming drawer has public properties for positioning (it does via getters)
  ctx.save();
  const nameY = drawer.diagramY - 40 * drawer.scaleFactor; // Approximate, or expose getLabelPosition
  const centerX = drawer.diagramX + drawer.diagramWidth / 2;

  // Draw Current Name (Slide Up & Fade Out)
  ctx.globalAlpha = 1 - eased;
  const curY = nameY - (eased * 20 * drawer.scaleFactor);
  drawer.drawChordName(currentName, { opacity: 1 - eased }); // Reuse base drawer for consistent style if possible
  // Actually, drawChordName doesn't take Y. 
  // We will let the drawer handle static or implement custom.
  // Let's rely on `ShortNeckDrawer` helpers if possible, but `drawChordWithTransition` does specific text transforms.
  // We'll implement custom text drawing here for control.
  ctx.restore();

  // We need to replicate some text drawing logic or expose it.
  // Ideally, we'd add methods to ChordDrawerBase, but we are editing this file.
  // We'll skip complex name animation here to focus on FINGERS as requested, 
  // OR we call the base `drawChordWithTransition` ONLY for the non-finger parts?
  // No, that draws everything.
  // We'll reproduce the finger logic here.

  // --- 2. Shared/Static Elements (Avoided strings, Transpose) ---
  // For simplicity in this "Finger" focused request, we'll draw matching Avoids and Transpose.
  // But let's focus on the FINGERS first.

  const curFingers = curChord.fingers || [];
  const nxtFingers = nxtChord.fingers || [];

  const curBarre = detectBarre(curFingers);
  const nxtBarre = detectBarre(nxtFingers);

  // Map "Loose" fingers (fingers that are NOT part of the barre)
  const getLooseFingers = (allFingers: StandardPosition[], barre: BarreInfo | null) => {
    const map = new Map<number, StandardPosition>();
    allFingers.forEach(f => {
      const rawId = f.finger ?? 1;
      const fingerId = rawId === 'T' ? 0 : (Number(rawId) || 1);

      // If this finger matches the barre definition, skip it
      if (barre) {
        const barreId = barre.finger === 'T' ? 0 : (Number(barre.finger) || 1);
        if (fingerId === barreId) return;
      }

      const isBarreNote = f.endString !== undefined && f.endString !== f.string;
      if (isBarreNote) return;

      if (f.fret > 0) {
        map.set(fingerId, f);
      }
    });
    return map;
  };

  const curLoose = getLooseFingers(curFingers, curBarre);
  const nxtLoose = getLooseFingers(nxtFingers, nxtBarre);

  // Set of all Loose Finger IDs involved
  const allFingerIds = new Set([...curLoose.keys(), ...nxtLoose.keys()]);

  // --- DRAWING ---

  // Helper for finger number parsing
  const getFin = (f: any) => (f === 'T' ? 0 : Number(f) || 1);

  // A. BARRE TRANSITIONS
  if (curBarre && nxtBarre) {
    // Barre -> Barre (Morph/Move)
    drawInterpolatedBarre(drawer, curBarre, nxtBarre, eased, getFin);
  } else if (curBarre && !nxtBarre) {
    // Barre -> ?
    const currFingerNum = getFin(curBarre.finger);
    // Check if Barre matched a Loose finger in Next
    const matchedFinger = nxtLoose.get(currFingerNum);
    // Also try matching by string usage if ID not found? (Simplified for now: strict ID match)

    if (matchedFinger) {
      // Morph Barre -> Finger
      drawMorphBarreToFinger(drawer, curBarre, matchedFinger, eased);
      nxtLoose.delete(currFingerNum); // Handled
    } else {
      // Fade Out Barre
      drawFadingBarre(drawer, curBarre, 1 - eased);
    }
  } else if (!curBarre && nxtBarre) {
    // ? -> Barre
    const nextFingerNum = getFin(nxtBarre.finger);
    // Check if Loose finger in Current matches Barre
    const matchedFinger = curLoose.get(nextFingerNum);

    if (matchedFinger) {
      // Morph Finger -> Barre
      drawMorphFingerToBarre(drawer, matchedFinger, nxtBarre, eased);
      curLoose.delete(nextFingerNum); // Handled
    } else {
      // Fade In Barre
      drawFadingBarre(drawer, nxtBarre, eased);
    }
  }

  // B. FINGER TRANSITIONS
  allFingerIds.forEach(id => {
    const c = curLoose.get(id);
    const n = nxtLoose.get(id);

    if (c && n) {
      // Move (Interpolate Position)
      const cPos = getFingerVisualPos(drawer, c);
      const nPos = getFingerVisualPos(drawer, n);
      const x = cPos.x + (nPos.x - cPos.x) * eased;
      const y = cPos.y + (nPos.y - cPos.y) * eased;

      // Draw at interpolated pos
      withCanvasTransformAtPoint(ctx, { x, y, opacity: 1, scale: 1 }, () => {
        // Cast id to any to avoid TS union type issues if definition is strict
        drawManualFinger(drawer, id as any);
      });
    } else if (c && !n) {
      // Fade Out
      const pos = getFingerVisualPos(drawer, c);
      withCanvasTransformAtPoint(ctx, { ...pos, opacity: 1 - eased, scale: 1 - (eased * 0.3) }, () => {
        drawManualFinger(drawer, id as any);
      });
    } else if (!c && n) {
      // Fade In
      const pos = getFingerVisualPos(drawer, n);
      withCanvasTransformAtPoint(ctx, { ...pos, opacity: eased, scale: 0.7 + (eased * 0.3) }, () => {
        drawManualFinger(drawer, id as any);
      });
    }
  });

  // C. TRANSPOSE INDICATOR TRANSITION
  // Animates the fret number (e.g. 6ª -> 5ª)
  drawer.drawTransposeIndicatorWithTransition(
    current.transportDisplay,
    next.transportDisplay,
    curBarre,
    nxtBarre,
    progress
  );

  // Helper to draw Chord Name simply (Static for now to avoid complexity, or simple fade)
  if (!skipFretboard) {
    // If we are responsible for the whole frame (not skipped), we might need to draw strings/names?
    // But skipFretboard=true usually means background is handled.
    // Chord name is usually dynamic.
    // Let's replicate the basic name check from base
    if (current.finalChord.showChordName !== false) {
      // drawer.drawChordName(currentName); // Just draw static for now to ensure visibility
    }
  }
}

// --- HELPERS ---

function getScreenX(drawer: ChordDrawer, stringNum: number): number {
  const visualIndex = drawer.numStrings - stringNum;
  return drawer.fretboardX + drawer.horizontalPadding + visualIndex * drawer.stringSpacing;
}

function getFingerVisualPos(drawer: ChordDrawer, pos: StandardPosition) {
  const fretY = drawer.fretboardY + (pos.fret - 0.5) * drawer.realFretSpacing;
  const stringX = getScreenX(drawer, pos.string);
  return { x: stringX, y: fretY };
}

function drawInterpolatedBarre(drawer: ChordDrawer, from: BarreInfo, to: BarreInfo, progress: number, getFin: (f: any) => number) {
  const ctx = drawer.ctx;

  // Interpolate Logic
  const fret = from.fret + (to.fret - from.fret) * progress;
  const startStr = from.startString + (to.startString - from.startString) * progress;
  const endStr = from.endString + (to.endString - from.endString) * progress;

  const y = drawer.fretboardY + (fret - 0.5) * drawer.realFretSpacing;
  const startX = getScreenX(drawer, startStr);
  const endX = getScreenX(drawer, endStr);

  // Adjust for visual width (radius padding)
  // Ensure left/right correctness regardless of string order (logic inversion)
  const realLeftX = Math.min(startX, endX) - drawer.fingerRadius;
  const realRightX = Math.max(startX, endX) + drawer.fingerRadius;
  const width = realRightX - realLeftX;
  const centerX = realLeftX + width / 2;

  ctx.save();
  ctx.translate(centerX, y);

  // Custom draw or use private helper if we could (we can't easily accesses private _drawBarreShapeAtPosition)
  // implementing manual barre draw
  const color = drawer.colors.fingers.color;
  const opacity = drawer.colors.fingers.opacity ?? 1;
  const borderColor = drawer.colors.fingers.border?.color;
  const borderWidth = drawer.colors.fingers.border?.width || 0;

  ctx.fillStyle = hexToRgba(color, opacity);

  const height = drawer.fingerRadius * 2;
  const radius = drawer.neckRadius; // Approximation

  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, height, radius);
  ctx.fill();

  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor || '#000000';
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  // Number
  const fromFin = getFin(from.finger);
  const toFin = getFin(to.finger);
  const id = Math.round(fromFin + (toFin - fromFin) * progress);
  // Revert 0 to T if needed, or just pass number
  drawFingerNumber(drawer, id === 0 ? 'T' : id);

  ctx.restore();
}

function drawFadingBarre(drawer: ChordDrawer, barre: BarreInfo, opacityVal: number) {
  const ctx = drawer.ctx;
  ctx.save();
  ctx.globalAlpha = opacityVal;
  // Assuming barre doesn't move, interpolate to itself
  const getFin = (f: any) => (f === 'T' ? 0 : Number(f) || 1);
  drawInterpolatedBarre(drawer, barre, barre, 0, getFin);
  ctx.restore();
}

function drawMorphBarreToFinger(drawer: ChordDrawer, barre: BarreInfo, finger: StandardPosition, progress: number) {
  // Morph Rect -> Circle
  // Just interpolate dimensions towards the finger's circle
  const ctx = drawer.ctx;

  const startFretY = drawer.fretboardY + (barre.fret - 0.5) * drawer.realFretSpacing;
  const endFretY = drawer.fretboardY + (finger.fret - 0.5) * drawer.realFretSpacing;
  const curY = startFretY + (endFretY - startFretY) * progress;

  const bStartX = getScreenX(drawer, barre.startString) - drawer.fingerRadius;
  // NOTE: getScreenX inverts, so startString (e.g. 1) -> Right, endString (e.g. 6) -> Left.
  // We need to properly calculate coordinates.
  const bX1 = getScreenX(drawer, barre.startString);
  const bX2 = getScreenX(drawer, barre.endString);
  const bLeft = Math.min(bX1, bX2) - drawer.fingerRadius;
  const bRight = Math.max(bX1, bX2) + drawer.fingerRadius;
  const bWidth = bRight - bLeft;
  const bCenterX = bLeft + bWidth / 2;

  const fX = getScreenX(drawer, finger.string);
  const fWidth = drawer.fingerRadius * 2;

  const curCenterX = bCenterX + (fX - bCenterX) * progress;
  const curWidth = bWidth + (fWidth - bWidth) * progress;

  ctx.save();
  ctx.translate(curCenterX, curY);

  const color = drawer.colors.fingers.color;
  const opacity = drawer.colors.fingers.opacity ?? 1;

  ctx.fillStyle = hexToRgba(color, opacity);
  const height = drawer.fingerRadius * 2;

  ctx.beginPath();
  ctx.roundRect(-curWidth / 2, -height / 2, curWidth, height, drawer.fingerRadius);
  ctx.fill();

  // Border...

  drawFingerNumber(drawer, barre.finger ?? 1);
  ctx.restore();
}

function drawMorphFingerToBarre(drawer: ChordDrawer, finger: StandardPosition, barre: BarreInfo, progress: number) {
  // Inverse of above
  // Interpolate FROM finger TO barre
  // Using logic similar to above:
  const ctx = drawer.ctx;

  const startFretY = drawer.fretboardY + (finger.fret - 0.5) * drawer.realFretSpacing;
  const endFretY = drawer.fretboardY + (barre.fret - 0.5) * drawer.realFretSpacing;
  const curY = startFretY + (endFretY - startFretY) * progress;

  const fCenterX = getScreenX(drawer, finger.string);
  const fWidth = drawer.fingerRadius * 2;

  const bX1 = getScreenX(drawer, barre.startString);
  const bX2 = getScreenX(drawer, barre.endString);
  const bLeft = Math.min(bX1, bX2) - drawer.fingerRadius;
  const bRight = Math.max(bX1, bX2) + drawer.fingerRadius;
  const bWidth = bRight - bLeft;
  const bCenterX = bLeft + bWidth / 2;

  const curCenterX = fCenterX + (bCenterX - fCenterX) * progress;
  const curWidth = fWidth + (bWidth - fWidth) * progress;

  ctx.save();
  ctx.translate(curCenterX, curY);

  ctx.fillStyle = hexToRgba(drawer.colors.fingers.color, drawer.colors.fingers.opacity ?? 1);
  const height = drawer.fingerRadius * 2;

  ctx.beginPath();
  ctx.roundRect(-curWidth / 2, -height / 2, curWidth, height, drawer.fingerRadius);
  ctx.fill();

  drawFingerNumber(drawer, barre.finger ?? 1);
  ctx.restore();
}

function drawFingerNumber(drawer: ChordDrawer, num: number | string) {
  const ctx = drawer.ctx;
  ctx.fillStyle = drawer.colors.fingers.textColor || '#ffffff';
  // Simplified font
  ctx.font = `bold ${45 * (drawer.scaleFactor || 1)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.save();
  // Assuming direct drawing without mirror/rotation for simplicity in this specific fix
  // as rotation getter was just added, we can use it if we want perfect compliance
  if (drawer.mirror) ctx.scale(-1, 1);
  // rotation usually handled by canvas transform before this function is called in base, 
  // but here we are drawing text on top of a shape that might be rotated?
  // Actually we are inside a translated context (centerX, centerY).
  // Text should be upright relative to the screen usually? or relative to finger?
  // If finger rotates, text rotates.
  // Base drawer counter-rotates text to keep it upright.
  if (drawer.rotation) ctx.rotate((-drawer.rotation * Math.PI) / 180);

  ctx.fillText(String(num), 0, 0);
  ctx.restore();
}

function drawManualFinger(drawer: ChordDrawer, id: number) {
  const ctx = drawer.ctx;
  const radius = drawer.fingerRadius;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = hexToRgba(drawer.colors.fingers.color, drawer.colors.fingers.opacity ?? 1);
  ctx.fill();

  if ((drawer.colors.fingers.border?.width || 0) > 0) {
    ctx.lineWidth = drawer.colors.fingers.border?.width || 0;
    ctx.strokeStyle = drawer.colors.fingers.border?.color || '#000000';
    ctx.stroke();
  }

  drawFingerNumber(drawer, id);
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex || hex[0] !== '#') return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

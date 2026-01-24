import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";
import { ChordDrawer } from "./ChordDrawer";
import { easeInOutQuad, withCanvasTransformAtPoint } from "../utils/animacao";
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
 * Detects the primary barre in a chord
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

function d(drawer: ChordDrawer): any {
  return drawer as any;
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

  const currentFinalChord = currentDisplayChord.finalChord;
  const currentTransportDisplay = currentDisplayChord.transportDisplay;

  // 3. Draw Logic
  if (buildProgress !== undefined && buildProgress < 1) {
    drawer.drawChordWithBuildAnimation(
      currentFinalChord,
      currentTransportDisplay,
      buildProgress,
      0
    );
  } else if (nextDisplayChord && transitionProgress > 0) {
    const currentVisual = drawer.transposeForDisplay(
      currentDisplayChord.finalChord,
      currentDisplayChord.transportDisplay
    );
    const nextVisual = drawer.transposeForDisplay(
      nextDisplayChord.finalChord,
      nextDisplayChord.transportDisplay
    );

    const normalizeFingers = (fingers: StandardPosition[]) => {
      return fingers.map(f => ({
        fret: f.fret,
        string: f.string,
        endString: f.endString,
        finger: (f.finger === 'T' ? 0 : (Number(f.finger) || 1))
      })).sort((a, b) => (a.string - b.string) || (a.fret - b.fret));
    };

    const currentNorm = normalizeFingers(currentVisual.finalChord.fingers);
    const nextNorm = normalizeFingers(nextVisual.finalChord.fingers);

    const isIdentical = JSON.stringify(currentNorm) === JSON.stringify(nextNorm) &&
      currentVisual.transportDisplay === nextVisual.transportDisplay;

    if (isIdentical) {
      drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard, skipChordName: true });
    } else {
      drawTransition(drawer, { finalChord: currentVisual.finalChord, transportDisplay: currentVisual.transportDisplay }, { finalChord: nextVisual.finalChord, transportDisplay: nextVisual.transportDisplay }, transitionProgress, skipFretboard);
    }
  } else {
    drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
  }
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

  // IMPORTANT: Apply global transforms once for the whole transition frame
  ctx.save();

  if (!skipFretboard) {
    drawer.drawFretboard();
  }

  d(drawer).applyTransforms();

  // Fingers Logic
  const curFingers = curChord.fingers || [];
  const nxtFingers = nxtChord.fingers || [];

  const curBarre = detectBarre(curFingers);
  const nxtBarre = detectBarre(nxtFingers);

  const getLooseFingers = (allFingers: StandardPosition[], barre: BarreInfo | null) => {
    const map = new Map<string, StandardPosition>();
    allFingers.forEach((f, idx) => {
      const rawId = f.finger ?? 1;
      const fingerNum = rawId === 'T' ? 0 : (Number(rawId) || 1);

      if (barre) {
        const barreId = barre.finger === 'T' ? 0 : (Number(barre.finger) || 1);
        if (fingerNum === barreId) return;
      }

      const isBarreNote = f.endString !== undefined && f.endString !== f.string;
      if (isBarreNote) return;

      if (f.fret > 0) {
        // Use composite key to avoid collisions when multiple notes share a finger number or have none
        const key = `f-${fingerNum}-s-${f.string}-f-${f.fret}`;
        map.set(key, f);
      }
    });
    return map;
  };

  const curLoose = getLooseFingers(curFingers, curBarre);
  const nxtLoose = getLooseFingers(nxtFingers, nxtBarre);
  const allFingerIds = new Set([...curLoose.keys(), ...nxtLoose.keys()]);

  const getFin = (f: any) => (f === 'T' ? 0 : Number(f) || 1);

  const findAndRemoveFingerByNum = (map: Map<string, StandardPosition>, fingerNum: number): StandardPosition | null => {
    for (const [key, f] of map.entries()) {
      if (getFin(f.finger) === fingerNum) {
        map.delete(key);
        return f;
      }
    }
    return null;
  };

  // A. BARRE TRANSITIONS
  if (curBarre && nxtBarre) {
    drawInterpolatedBarre(drawer, curBarre, nxtBarre, eased, getFin);
  } else if (curBarre && !nxtBarre) {
    const currFingerNum = getFin(curBarre.finger);
    const matchedFinger = findAndRemoveFingerByNum(nxtLoose, currFingerNum);
    if (matchedFinger) {
      drawMorphBarreToFinger(drawer, curBarre, matchedFinger, eased);
    } else {
      drawFadingBarre(drawer, curBarre, 1 - eased);
    }
  } else if (!curBarre && nxtBarre) {
    const nextFingerNum = getFin(nxtBarre.finger);
    const matchedFinger = findAndRemoveFingerByNum(curLoose, nextFingerNum);
    if (matchedFinger) {
      drawMorphFingerToBarre(drawer, matchedFinger, nxtBarre, eased);
    } else {
      drawFadingBarre(drawer, nxtBarre, eased);
    }
  }

  // B. FINGER TRANSITIONS
  allFingerIds.forEach(id => {
    const c = curLoose.get(id);
    const n = nxtLoose.get(id);

    if (c && n) {
      const cPos = drawer.getFingerPosition(c.fret, c.string);
      const nPos = drawer.getFingerPosition(n.fret, n.string);
      const x = cPos.x + (nPos.x - cPos.x) * eased;
      const y = cPos.y + (nPos.y - cPos.y) * eased;
      withCanvasTransformAtPoint(ctx, { x, y, opacity: 1, scale: 1 }, () => {
        const rawId = n.finger ?? 1;
        const displayId = rawId === 'T' ? 'T' : (Number(rawId) || 1);
        drawManualFinger(drawer, displayId);
      });
    } else if (c && !n) {
      const pos = drawer.getFingerPosition(c.fret, c.string);
      withCanvasTransformAtPoint(ctx, { ...pos, opacity: 1 - eased, scale: 1 }, () => {
        const rawId = c.finger ?? 1;
        const displayId = rawId === 'T' ? 'T' : (Number(rawId) || 1);
        drawManualFinger(drawer, displayId);
      });
    } else if (!c && n) {
      const pos = drawer.getFingerPosition(n.fret, n.string);
      withCanvasTransformAtPoint(ctx, { ...pos, opacity: eased, scale: 1 }, () => {
        const rawId = n.finger ?? 1;
        const displayId = rawId === 'T' ? 'T' : (Number(rawId) || 1);
        drawManualFinger(drawer, displayId);
      });
    }
  });

  // C. TRANSPOSE INDICATOR
  drawer.drawTransposeIndicatorWithTransition(
    current.transportDisplay,
    next.transportDisplay,
    curBarre ? getMinFret(curChord.fingers) : 1,
    nxtBarre ? getMinFret(nxtChord.fingers) : 1,
    progress
  );

  ctx.restore();
}

// Helpers

function getMinFret(fingers: any[]) {
  const visible = fingers.filter(f => f.fret > 0).map(f => f.fret);
  return visible.length > 0 ? Math.min(...visible) : 1;
}

function drawInterpolatedBarre(drawer: ChordDrawer, from: BarreInfo, to: BarreInfo, progress: number, getFin: (f: any) => number) {
  const ctx = drawer.ctx;
  const scale = drawer.scaleFactor || 1;
  const neckRadius = d(drawer).neckRadius;
  const colors = d(drawer)._colors.fingers;

  // Interpolate state
  const curFret = from.fret + (to.fret - from.fret) * progress;
  const curStartStr = from.startString + (to.startString - from.startString) * progress;
  const curEndStr = from.endString + (to.endString - from.endString) * progress;

  const rect = drawer.getBarreRect(curFret, curStartStr, curEndStr);

  ctx.save();
  ctx.translate(rect.x, rect.y);

  // Style
  d(drawer).applyShadow(colors.shadow);

  ctx.fillStyle = d(drawer).hexToRgba(colors.color || "#1a1a1a", colors.opacity ?? 1);
  ctx.strokeStyle = colors.border?.color || "#ffffff";
  ctx.lineWidth = (colors.border?.width || 3) * scale;

  ctx.beginPath();
  ctx.roundRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height, rect.radius);
  ctx.fill();
  d(drawer).applyShadow(undefined);

  d(drawer).applyShadow(undefined);
  ctx.stroke();

  // Number
  const fromFin = getFin(from.finger);
  const toFin = getFin(to.finger);
  const id = Math.round(fromFin + (toFin - fromFin) * progress);
  drawFingerNumber(drawer, id === 0 ? 'T' : id);

  ctx.restore();
}

function drawFadingBarre(drawer: ChordDrawer, barre: BarreInfo, opacityVal: number) {
  const ctx = drawer.ctx;
  ctx.save();
  ctx.globalAlpha = opacityVal;
  const getFin = (f: any) => (f === 'T' ? 0 : Number(f) || 1);
  drawInterpolatedBarre(drawer, barre, barre, 0, getFin);
  ctx.restore();
}

function drawMorphBarreToFinger(drawer: ChordDrawer, barre: BarreInfo, finger: StandardPosition, progress: number) {
  const ctx = drawer.ctx;
  const scale = drawer.scaleFactor || 1;
  const fingerRadius = d(drawer).fingerRadius;
  const neckRadius = d(drawer).neckRadius;
  const colors = d(drawer)._colors.fingers;

  const bRect = drawer.getBarreRect(barre.fret, barre.startString, barre.endString);
  const fPos = drawer.getFingerPosition(finger.fret, finger.string);

  const curX = bRect.x + (fPos.x - bRect.x) * progress;
  const curY = bRect.y + (fPos.y - bRect.y) * progress;
  const curWidth = bRect.width + (fingerRadius * 2 - bRect.width) * progress;
  const curHeight = bRect.height + (fingerRadius * 2 - bRect.height) * progress;

  ctx.save();
  ctx.translate(curX, curY);
  d(drawer).applyShadow(colors.shadow);

  ctx.fillStyle = d(drawer).hexToRgba(colors.color || "#1a1a1a", colors.opacity ?? 1);
  ctx.strokeStyle = colors.border?.color || "#ffffff";
  ctx.lineWidth = (colors.border?.width || 3) * scale;

  ctx.beginPath();
  ctx.roundRect(-curWidth / 2, -curHeight / 2, curWidth, curHeight, neckRadius);
  ctx.fill();
  d(drawer).applyShadow(undefined);
  ctx.stroke();

  drawFingerNumber(drawer, barre.finger ?? 1);
  ctx.restore();
}

function drawMorphFingerToBarre(drawer: ChordDrawer, finger: StandardPosition, barre: BarreInfo, progress: number) {
  const ctx = drawer.ctx;
  const scale = drawer.scaleFactor || 1;
  const fingerRadius = d(drawer).fingerRadius;
  const neckRadius = d(drawer).neckRadius;
  const colors = d(drawer)._colors.fingers;

  const bRect = drawer.getBarreRect(barre.fret, barre.startString, barre.endString);
  const fPos = drawer.getFingerPosition(finger.fret, finger.string);

  const curX = fPos.x + (bRect.x - fPos.x) * progress;
  const curY = fPos.y + (bRect.y - fPos.y) * progress;
  const curWidth = (fingerRadius * 2) + (bRect.width - (fingerRadius * 2)) * progress;
  const curHeight = (fingerRadius * 2) + (bRect.height - (fingerRadius * 2)) * progress;

  ctx.save();
  ctx.translate(curX, curY);
  d(drawer).applyShadow(colors.shadow);

  ctx.fillStyle = d(drawer).hexToRgba(colors.color || "#1a1a1a", colors.opacity ?? 1);
  ctx.strokeStyle = colors.border?.color || "#ffffff";
  ctx.lineWidth = (colors.border?.width || 3) * scale;

  ctx.beginPath();
  ctx.roundRect(-curWidth / 2, -curHeight / 2, curWidth, curHeight, neckRadius);
  ctx.fill();
  d(drawer).applyShadow(undefined);
  ctx.stroke();

  drawFingerNumber(drawer, barre.finger ?? 1);
  ctx.restore();
}

function drawFingerNumber(drawer: ChordDrawer, num: number | string) {
  const ctx = drawer.ctx;
  const colors = d(drawer)._colors.fingers;
  d(drawer).applyShadow(undefined);
  ctx.fillStyle = colors.textColor || '#ffffff';

  const fontSize = 30 * (drawer.scaleFactor || 1);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.save();
  if (drawer.mirror) ctx.scale(-1, 1);
  if (drawer.rotation) ctx.rotate((-drawer.rotation * Math.PI) / 180);

  // Optical correction for baseline centering
  const opticalCorrection = fontSize * 0.06;
  ctx.fillText(String(num), 0, opticalCorrection);
  ctx.restore();
}

function drawManualFinger(drawer: ChordDrawer, displayId: number | string) {
  const ctx = drawer.ctx;
  const fingerRadius = d(drawer).fingerRadius;
  const scale = drawer.scaleFactor || 1;
  const colors = d(drawer)._colors.fingers;

  ctx.save();
  d(drawer).applyShadow(colors.shadow);

  ctx.beginPath();
  ctx.arc(0, 0, fingerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = d(drawer).hexToRgba(colors.color || "#1a1a1a", colors.opacity ?? 1);
  ctx.fill();
  d(drawer).applyShadow(undefined);

  d(drawer).applyShadow(undefined);
  ctx.strokeStyle = colors.border?.color || "#ffffff";
  ctx.lineWidth = (colors.border?.width || 3) * scale;
  ctx.stroke();

  ctx.restore();

  drawFingerNumber(drawer, displayId);
}

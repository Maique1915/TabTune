
import { GuitarFretboardDrawer } from "./guitar-fretboard-drawer";
import { ChordDiagramProps, StandardPosition } from "@/modules/core/domain/types";

interface BarreInfo {
    fret: number;
    finger: number | string;
    startString: number;
    endString: number;
}

export interface GuitarFretboardAnimationProps {
    drawer: GuitarFretboardDrawer;
    currentDisplayChord: { finalChord: ChordDiagramProps, transportDisplay?: any };
    nextDisplayChord: { finalChord: ChordDiagramProps, transportDisplay?: any } | null;
    transitionProgress: number; // 0 to 1
    buildProgress?: number;
    skipFretboard?: boolean;
}

// --- HELPERS ---

function getFingerPos(drawer: GuitarFretboardDrawer, pos: StandardPosition) {
    const geo = drawer.geometry;
    const visualIndex = geo.numStrings - pos.string;
    const y = geo.boardY + geo.stringMargin + (visualIndex * geo.stringSpacing);

    let x = geo.paddingX + (Math.max(0, pos.fret) - 0.5) * geo.fretWidth;
    if (pos.fret === 0) {
        x = geo.paddingX - (geo.fretWidth * 0.3);
    }

    return { x, y };
}

function detectBarre(chord: ChordDiagramProps): BarreInfo | null {
    const { fingers } = chord;
    if (!fingers || fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxSpan = 0;

    fingers.forEach(f => {
        if (f.endString !== undefined && f.endString !== f.string) {
            const span = Math.abs(f.endString - f.string);
            if (span > maxSpan) {
                maxSpan = span;
                bestBarre = {
                    fret: f.fret,
                    finger: f.finger ?? 1,
                    startString: f.string,
                    endString: f.endString
                };
            }
        }
    });

    return bestBarre;
}

function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// --- DRAWING FUNCTIONS ---

function drawInterpolatedFinger(drawer: GuitarFretboardDrawer, from: StandardPosition, to: StandardPosition, progress: number) {
    // Interpolate Fret, String (visual Y), and X
    // Fingers morph from Pos A to Pos B

    const fromPos = getFingerPos(drawer, from);
    const toPos = getFingerPos(drawer, to);

    const x = fromPos.x + (toPos.x - fromPos.x) * progress;
    const y = fromPos.y + (toPos.y - fromPos.y) * progress;

    const finger = from.finger ?? to.finger ?? 1;

    drawer.drawRawFinger(x, y, finger, (drawer as any).colors.fingers.color);
    // Typescript might complain about private access to colors if not using public getter, 
    // but drawer usually has public setColors. 
    // Actually GuitarFretboardDrawer has private colors.
    // I need to use the method provided or I can't access color.
    // Wait, I updated drawRawFinger to take color.
    // How to get the color? 
    // drawer.colors is private.
    // I should add a getter for colors in drawer or pass it to animations.
    // I'll assume I can access it or I'll hack it with (drawer as any).colors for now, 
    // or add a getter in the previous step? 
    // I'll add a getter for colors in the next step if needed, or rely on 'any'. 
    // Since I can't edit previous step easily, I'll use 'any' cast as I know the structure.
}

function drawInterpolatedBarre(drawer: GuitarFretboardDrawer, from: BarreInfo, to: BarreInfo, progress: number) {
    // Interpolate Barre
    const fromFretPos = getFingerPos(drawer, { string: 1, fret: from.fret }); // Only fret matters for X
    const toFretPos = getFingerPos(drawer, { string: 1, fret: to.fret });

    const x = fromFretPos.x + (toFretPos.x - fromFretPos.x) * progress;

    // Y coords (Strings)
    const geo = drawer.geometry;

    // From Strings
    const fromStartVis = geo.numStrings - from.startString;
    const fromEndVis = geo.numStrings - from.endString;
    const fromY1 = geo.boardY + geo.stringMargin + fromStartVis * geo.stringSpacing;
    const fromY2 = geo.boardY + geo.stringMargin + fromEndVis * geo.stringSpacing;
    const fromTopY = Math.min(fromY1, fromY2);
    const fromHeight = Math.abs(fromY2 - fromY1);

    // To Strings
    const toStartVis = geo.numStrings - to.startString;
    const toEndVis = geo.numStrings - to.endString;
    const toY1 = geo.boardY + geo.stringMargin + toStartVis * geo.stringSpacing;
    const toY2 = geo.boardY + geo.stringMargin + toEndVis * geo.stringSpacing;
    const toTopY = Math.min(toY1, toY2);
    const toHeight = Math.abs(toY2 - toY1);

    // Interpolate Top Y and Height
    const topY = fromTopY + (toTopY - fromTopY) * progress;
    const height = fromHeight + (toHeight - fromHeight) * progress;
    const centerY = topY + height / 2;

    const finger = from.finger ?? to.finger ?? 1;

    // Determine Radius Scale? (Usually fixed for barres)
    // Width is usually fixed
    const radius = geo.stringSpacing * 0.45;
    const width = radius * 2;

    // Adjust Height to include padding/radius as expected by visual
    // drawRawBarre expects "height" to be the visual box height?
    // In drawer.drawBarre: rectHeight = height + (radius * 2);
    // So if I pass raw 'height' (string to string), I need to add radius * 2 inside drawRawBarre?
    // Let's check drawRawBarre:
    // ctx.roundRect(centerX - width/2, centerY - height/2, width, height, radius);
    // It draws a box of size 'width' x 'height'.
    // So I need to compute the full visual height here.

    const visualHeight = height + (radius * 2);

    drawer.drawRawBarre(x, centerY, width, visualHeight, finger, (drawer as any).colors.fingers.color);
}

function drawFadingBarre(drawer: GuitarFretboardDrawer, barre: BarreInfo, opacity: number) {
    const geo = drawer.geometry;
    const fretPos = getFingerPos(drawer, { string: 1, fret: barre.fret });
    const x = fretPos.x;

    const startVis = geo.numStrings - barre.startString;
    const endVis = geo.numStrings - barre.endString;
    const y1 = geo.boardY + geo.stringMargin + startVis * geo.stringSpacing;
    const y2 = geo.boardY + geo.stringMargin + endVis * geo.stringSpacing;

    const topY = Math.min(y1, y2);
    const height = Math.abs(y2 - y1);
    const radius = geo.stringSpacing * 0.45;
    const visualHeight = height + (radius * 2);
    const centerY = topY + height / 2;
    const width = radius * 2;

    drawer.drawRawBarre(x, centerY, width, visualHeight, barre.finger, (drawer as any).colors.fingers.color, opacity);
}

function drawMorphBarreToFinger(drawer: GuitarFretboardDrawer, barre: BarreInfo, finger: StandardPosition, progress: number) {
    // Morph Barre (Rectangle) to Finger (Circle)
    // Interpolate Center X, Center Y, Width, Height

    // Barre Geometry
    const geo = drawer.geometry;
    const bFretPos = getFingerPos(drawer, { string: 1, fret: barre.fret });
    const bX = bFretPos.x;

    const startVis = geo.numStrings - barre.startString;
    const endVis = geo.numStrings - barre.endString;
    const bY1 = geo.boardY + geo.stringMargin + startVis * geo.stringSpacing;
    const bY2 = geo.boardY + geo.stringMargin + endVis * geo.stringSpacing;
    const bTopY = Math.min(bY1, bY2);
    const bHeight = Math.abs(bY2 - bY1);
    const bRadius = geo.stringSpacing * 0.45;
    const bVisualHeight = bHeight + (bRadius * 2);
    const bCenterY = bTopY + bHeight / 2;
    const bWidth = bRadius * 2;

    // Finger Geometry
    const fPos = getFingerPos(drawer, finger);
    const fX = fPos.x;
    const fY = fPos.y;
    // Finger visually is a circle, which can be seen as a rounded rect with width=height=diameter
    const fDiameter = bRadius * 2;

    // Interpolate
    const curX = bX + (fX - bX) * progress;
    const curY = bCenterY + (fY - bCenterY) * progress;
    const curWidth = bWidth + (fDiameter - bWidth) * progress; // Likely unchanged
    const curHeight = bVisualHeight + (fDiameter - bVisualHeight) * progress; // Shrinks

    drawer.drawRawBarre(curX, curY, curWidth, curHeight, barre.finger ?? 1, (drawer as any).colors.fingers.color);
}

function drawMorphFingerToBarre(drawer: GuitarFretboardDrawer, finger: StandardPosition, barre: BarreInfo, progress: number) {
    // Inverse of above
    // Finger Geometry
    const geo = drawer.geometry;
    const fPos = getFingerPos(drawer, finger);
    const fX = fPos.x;
    const fY = fPos.y;
    const bRadius = geo.stringSpacing * 0.45;
    const fDiameter = bRadius * 2;

    // Barre Geometry
    const bFretPos = getFingerPos(drawer, { string: 1, fret: barre.fret });
    const bX = bFretPos.x;
    const startVis = geo.numStrings - barre.startString;
    const endVis = geo.numStrings - barre.endString;
    const bY1 = geo.boardY + geo.stringMargin + startVis * geo.stringSpacing;
    const bY2 = geo.boardY + geo.stringMargin + endVis * geo.stringSpacing;
    const bTopY = Math.min(bY1, bY2);
    const bHeight = Math.abs(bY2 - bY1);
    const bVisualHeight = bHeight + (bRadius * 2);
    const bCenterY = bTopY + bHeight / 2;
    const bWidth = bRadius * 2;

    // Interpolate
    const curX = fX + (bX - fX) * progress;
    const curY = fY + (bCenterY - fY) * progress;
    const curWidth = fDiameter + (bWidth - fDiameter) * progress;
    const curHeight = fDiameter + (bVisualHeight - fDiameter) * progress; // Grows

    drawer.drawRawBarre(curX, curY, curWidth, curHeight, barre.finger ?? 1, (drawer as any).colors.fingers.color);
}

export function drawGuitarFretboardAnimation({
    drawer,
    currentDisplayChord,
    nextDisplayChord,
    transitionProgress,
    buildProgress = 1,
    skipFretboard = true
}: GuitarFretboardAnimationProps) {

    if (!skipFretboard) {
        drawer.drawBoard();
        drawer.drawHeadstock();
        // drawer.drawCapo? 
    }

    // Identify Barres
    const currentBarre = detectBarre(currentDisplayChord.finalChord);
    const nextBarre = nextDisplayChord ? detectBarre(nextDisplayChord.finalChord) : null;

    // Identify Fingers (Map key=fingerNum)
    const currentFingers = new Map<number | string, StandardPosition>();
    currentDisplayChord.finalChord.fingers?.forEach(f => {
        const fingerNum = f.finger ?? 1;
        // Skip if part of barre
        if (currentBarre && f.fret === currentBarre.fret && fingerNum === currentBarre.finger &&
            f.string >= Math.min(currentBarre.startString, currentBarre.endString) &&
            f.string <= Math.max(currentBarre.startString, currentBarre.endString)) return;

        if (f.fret > 0) currentFingers.set(fingerNum, f);
    });

    const nextFingers = new Map<number | string, StandardPosition>();
    if (nextDisplayChord) {
        nextDisplayChord.finalChord.fingers?.forEach(f => {
            const fingerNum = f.finger ?? 1;
            // Skip if part of barre
            if (nextBarre && f.fret === nextBarre.fret && fingerNum === nextBarre.finger &&
                f.string >= Math.min(nextBarre.startString, nextBarre.endString) &&
                f.string <= Math.max(nextBarre.startString, nextBarre.endString)) return;

            if (f.fret > 0) nextFingers.set(fingerNum, f);
        });
    }

    const easedProgress = easeInOutQuad(transitionProgress);

    // 1. Draw Barre Transitions
    if (currentBarre && nextBarre && currentBarre.finger === nextBarre.finger) {
        // Barre to Barre
        drawInterpolatedBarre(drawer, currentBarre, nextBarre, easedProgress);
    } else {
        // Handle mismatched barres
        if (currentBarre) {
            // Is it becoming a finger?
            const nextFinger = nextFingers.get(currentBarre.finger);
            if (nextFinger) {
                // Morph Barre -> Finger
                drawMorphBarreToFinger(drawer, currentBarre, nextFinger, easedProgress);
                nextFingers.delete(currentBarre.finger); // Handled
            } else {
                // Fade Out
                drawFadingBarre(drawer, currentBarre, 1 - easedProgress);
            }
        }
        if (nextBarre) {
            // Did it come from a finger?
            const prevFinger = currentFingers.get(nextBarre.finger);
            if (prevFinger) {
                // Morph Finger -> Barre
                drawMorphFingerToBarre(drawer, prevFinger, nextBarre, easedProgress);
                currentFingers.delete(nextBarre.finger); // Handled
            } else {
                // Fade In
                drawFadingBarre(drawer, nextBarre, easedProgress);
            }
        }
    }

    // 2. Draw Finger Transitions
    const allFingerKeys = new Set([...Array.from(currentFingers.keys()), ...Array.from(nextFingers.keys())]);

    allFingerKeys.forEach(key => {
        const cur = currentFingers.get(key);
        const nxt = nextFingers.get(key);

        if (cur && nxt) {
            // Move
            drawInterpolatedFinger(drawer, cur, nxt, easedProgress);
        } else if (cur && !nxt) {
            // Fade Out
            const pos = getFingerPos(drawer, cur);
            drawer.drawRawFinger(pos.x, pos.y, key, (drawer as any).colors.fingers.color, 1 - easedProgress);
        } else if (!cur && nxt) {
            // Fade In
            const pos = getFingerPos(drawer, nxt);
            drawer.drawRawFinger(pos.x, pos.y, key, (drawer as any).colors.fingers.color, easedProgress);
        }
    });
}

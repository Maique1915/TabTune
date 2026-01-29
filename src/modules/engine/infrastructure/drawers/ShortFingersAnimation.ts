import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";
import { FingersAnimationDrawer, FingersAnimationParams } from "./ChordDrawer";
import { easeInOutQuad } from "../utils/animacao";
import { detectBarreFromChord } from "./utils/barre-detection";
import { getFinNum } from "./utils/fingers-utils";
import { FingerComponent } from "./components/FingerComponent";
import { AvoidComponent } from "./components/AvoidComponent";
import { TransposeIndicatorComponent } from "./components/TransposeIndicatorComponent";
import { NeckType } from "./components/NeckType";

export class ShortFingersAnimation implements FingersAnimationDrawer {
    private fingerComponents: FingerComponent[] = [];
    private barreComponent: FingerComponent | null = null;
    private transposeComponent: TransposeIndicatorComponent | null = null;
    private avoidComponents: AvoidComponent[] = [];
    private lastChordId: string = "";

    public draw(params: FingersAnimationParams): void {
        const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress, buildProgress, skipFretboard, allChords, currentIndex } = params;

        if (allChords && currentIndex !== undefined) {
            this.drawCarousel(params);
            return;
        }

        if (!currentDisplayChord) return;
        const ctx = drawer.ctx;
        const geometry = (drawer as any).getGeometry?.();

        if (!skipFretboard) {
            drawer.clear();
        }

        const currentFinalChord = currentDisplayChord.finalChord;
        const currentTransportDisplay = currentDisplayChord.transportDisplay;

        if (buildProgress !== undefined && buildProgress < 1) {
            drawer.drawChordWithBuildAnimation(
                currentFinalChord,
                currentTransportDisplay,
                buildProgress,
                0
            );
            return;
        }

        if (!geometry) {
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
            return;
        }

        // Prepare components
        this.ensureComponents(drawer, currentDisplayChord, nextDisplayChord || currentDisplayChord, geometry);




        if (nextDisplayChord && transitionProgress > 0) {
            const eased = easeInOutQuad(transitionProgress);

            // Draw Barre
            if (this.barreComponent) {
                this.barreComponent.update(eased);
                this.barreComponent.draw(ctx);
            }

            // Draw Fingers
            this.fingerComponents.forEach(f => {
                f.update(eased);
                f.draw(ctx);
            });

            // Draw Transpose Indicator
            if (this.transposeComponent) {
                this.transposeComponent.update(eased);
                this.transposeComponent.draw(ctx);
            }

            // Update & Draw Avoids
            this.avoidComponents.forEach(avoid => {
                avoid.update(eased);
                avoid.draw(ctx);
            });
        } else {
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
        }
    }

    private drawCarousel(params: FingersAnimationParams): void {
        const { drawer, transitionProgress, allChords, currentIndex } = params;
        if (!allChords || allChords.length === 0 || currentIndex === undefined) return;

        const ctx = drawer.ctx;
        const diagramWidth = (drawer as any)._diagramWidth || drawer.dimensions.width;
        const spacing = diagramWidth * 1.4;
        const easedProgress = easeInOutQuad(transitionProgress);
        const baseShift = -easedProgress * spacing;

        const ACTIVE_OPACITY = 1.0;
        const INACTIVE_OPACITY = 0.4;

        drawer.clear();
        // Background fretboard should be drawn once or per chord?
        // In carousel, we draw the background for the central focus, or one big background?
        // Usually, the background is per-chord if they are disjoint.
        // But drawer.drawFretboard() might be enough.

        const drawItem = (chord: ChordDiagramProps, transport: number, offset: number, opacity: number) => {
            const threshold = (drawer.dimensions.width / 2) + diagramWidth;
            if (offset < -threshold || offset > threshold) return;

            ctx.save();
            ctx.translate(offset, 0);
            ctx.globalAlpha = opacity;

            // Draw fretboard for this specific item if needed
            drawer.drawFretboard();
            drawer.drawChord(chord, transport, 0, { skipFretboard: true });

            ctx.restore();
        };

        // Right side (Next + Current)
        for (let i = currentIndex; i < allChords.length; i++) {
            const relIndex = i - currentIndex;
            const offset = (relIndex * spacing) + baseShift;

            let opacity = INACTIVE_OPACITY;
            if (i === currentIndex) {
                opacity = ACTIVE_OPACITY + (INACTIVE_OPACITY - ACTIVE_OPACITY) * easedProgress;
            } else if (i === currentIndex + 1) {
                opacity = INACTIVE_OPACITY + (ACTIVE_OPACITY - INACTIVE_OPACITY) * easedProgress;
            }

            drawItem(allChords[i].finalChord, allChords[i].transportDisplay, offset, opacity);
        }

        // Left side (Previous)
        for (let i = currentIndex - 1; i >= 0; i--) {
            const relIndex = i - currentIndex;
            const offset = (relIndex * spacing) + baseShift;
            drawItem(allChords[i].finalChord, allChords[i].transportDisplay, offset, INACTIVE_OPACITY);
        }
    }

    private ensureComponents(drawer: any, current: any, next: any, geometry: any): void {
        const nextId = (next.finalChord.chordName || "") + JSON.stringify(next.finalChord.fingers) + next.transportDisplay;
        const curId = (current.finalChord.chordName || "") + JSON.stringify(current.finalChord.fingers) + current.transportDisplay;

        // Include geometry in ID
        const geometryId = `${drawer.fretboardX}_${drawer.fretboardWidth}_${drawer.scaleFactor}`;
        const transitionId = `${curId}_to_${nextId}_geo_${geometryId}`;

        if (this.lastChordId === transitionId) return;

        const curVisual = drawer.transposeForDisplay(current.finalChord, current.transportDisplay);
        const nxtVisual = drawer.transposeForDisplay(next.finalChord, next.transportDisplay);

        // We use the RAW chord for fingers/barre, and pass the transport separately
        const curRawF = current.finalChord.fingers;
        const nxtRawF = next.finalChord.fingers;

        const curB = detectBarreFromChord({ fingers: curRawF } as any);
        const nxtB = detectBarreFromChord({ fingers: nxtRawF } as any);

        const buildLoose = (fingers: StandardPosition[], barre: BarreInfo | null) => {
            return fingers.filter(f => {
                if (f.fret <= 0) return false;
                if (barre && f.fret === barre.fret) {
                    const sMin = Math.min(barre.startString, barre.endString);
                    const sMax = Math.max(barre.startString, barre.endString);
                    if (f.string >= sMin && f.string <= sMax) return false;
                }
                return true;
            });
        };

        const cL = buildLoose(curRawF, curB);
        const nL = buildLoose(nxtRawF, nxtB);

        const curT = FingerComponent.calculateEffectiveTransport(current.finalChord.fingers, drawer.numFrets, current.transportDisplay);
        const nxtT = FingerComponent.calculateEffectiveTransport(next.finalChord.fingers, drawer.numFrets, next.transportDisplay);

        // Create a derived style
        const derivedStyle = {
            ...drawer.colors.fingers,
            radius: drawer.fingerRadius / drawer.scaleFactor,
            barreWidth: drawer.barreWidth / drawer.scaleFactor,
            fontSize: (drawer as any)._baseFontSize || drawer.colors.fingers.fontSize || 35
        };

        // 1. Barre
        if (curB || nxtB) {
            if (!this.barreComponent) {
                // Try to use nxtB first if it exists for the initial component so it has the right endString
                const initB = curB || nxtB;
                const initT = curB ? curT : nxtT;
                this.barreComponent = new FingerComponent(initB!.fret, initB!.startString, initB!.finger ?? 1, derivedStyle, geometry, initT, initB!.endString);
            }

            if (this.barreComponent) {
                // If it was newly created and there's no curB, start at 0 opacity
                if (!curB && nxtB && (this.barreComponent as any).sOpacity === 1) {
                    (this.barreComponent as any).sOpacity = 0;
                    (this.barreComponent as any).vOpacity = 0;
                }

                const tF = nxtB ? nxtB.fret : (curB ? curB.fret : 0);
                const tS = nxtB ? nxtB.startString : (curB ? curB.startString : 0);
                const tE = nxtB ? nxtB.endString : (curB ? curB.endString : 0);
                const tO = (curB && nxtB) ? 1 : (nxtB ? 1 : 0);
                (this.barreComponent as any).setTarget(tF, tS, tO, nxtB?.finger ?? curB?.finger ?? 1, nxtT, tE);
                this.barreComponent.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            }
        } else {
            this.barreComponent = null;
        }

        // 2. Fingers - IMPROVED MAPPING
        this.fingerComponents = [];

        // Map by finger number if available, otherwise by index
        const mappedPairs: Array<{ cur?: StandardPosition, nxt?: StandardPosition }> = [];
        const usedNxtByIndex = new Set<number>();

        // First, match by finger ID/Number
        cL.forEach(cur => {
            const nxtIdx = nL.findIndex((n, idx) => !usedNxtByIndex.has(idx) && n.finger === cur.finger && cur.finger !== undefined && cur.finger !== 0);
            if (nxtIdx !== -1) {
                mappedPairs.push({ cur, nxt: nL[nxtIdx] });
                usedNxtByIndex.add(nxtIdx);
            } else {
                // Keep for later matching by index
                mappedPairs.push({ cur });
            }
        });

        // Fill remaining nxt that were not matched by ID
        nL.forEach((nxt, idx) => {
            if (usedNxtByIndex.has(idx)) return;
            // Try to find a pair that only has cur (no nxt yet)
            const emptyPair = mappedPairs.find(p => p.cur && !p.nxt);
            if (emptyPair) {
                emptyPair.nxt = nxt;
            } else {
                mappedPairs.push({ nxt });
            }
        });

        mappedPairs.forEach(pair => {
            let fComp: FingerComponent;
            if (pair.cur) {
                fComp = new FingerComponent(pair.cur.fret, pair.cur.string, pair.cur.finger ?? 1, derivedStyle, geometry, curT);
                const tO = pair.nxt ? 1 : 0;
                const tF = pair.nxt ? pair.nxt.fret : pair.cur.fret;
                const tS = pair.nxt ? pair.nxt.string : pair.cur.string;
                const tL = pair.nxt ? pair.nxt.finger : pair.cur.finger;
                fComp.setTarget(tF, tS, tO, tL ?? 1, nxtT);
            } else if (pair.nxt) {
                fComp = new FingerComponent(pair.nxt.fret, pair.nxt.string, pair.nxt.finger ?? 1, derivedStyle, geometry, nxtT);
                (fComp as any).sOpacity = 0;
                (fComp as any).vOpacity = 0;
                fComp.setTarget(pair.nxt.fret, pair.nxt.string, 1, pair.nxt.finger ?? 1, nxtT);
            } else {
                return;
            }
            fComp.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            this.fingerComponents.push(fComp);
        });

        // 3. Transpose Indicator
        const getMinFret = (fingers: StandardPosition[]) => {
            let minFret = Infinity;
            for (let i = 0; i < fingers.length; i++) {
                if (fingers[i].fret > 0 && fingers[i].fret < minFret) {
                    minFret = fingers[i].fret;
                }
            }
            return minFret === Infinity ? 1 : minFret;
        };

        const minVisualFret = getMinFret(nxtVisual.fingers || []);
        const tText = nxtT;
        const tFretVisual = tText > 1 ? minVisualFret : 1;

        const indicatorColor = (drawer.colors.head?.textColors as any)?.name
            || drawer.colors.global.primaryTextColor
            || "#ffffff";

        if (!this.transposeComponent) {
            this.transposeComponent = new TransposeIndicatorComponent(
                NeckType.SHORT,
                tText,
                tFretVisual,
                { color: indicatorColor, fontSize: 35 },
                geometry
            );
        }

        if (this.transposeComponent) {
            const tOpacity = tText > 1 ? 1 : 0;
            this.transposeComponent.setTarget(tText, tFretVisual, tOpacity);
            this.transposeComponent.setRotation((drawer as any).rotation, (drawer as any).mirror);
        }

        // 4. Setup Avoids
        this.avoidComponents = [];
        const curAvoid = current.finalChord.avoid || [];
        const nxtAvoid = next.finalChord.avoid || [];

        const curSet = new Set(curAvoid as number[]);
        const nxtSet = new Set(nxtAvoid as number[]);
        const allStrings = new Set([...curSet, ...nxtSet]);

        allStrings.forEach(stringNum => {
            const isCur = curSet.has(stringNum);
            const isNxt = nxtSet.has(stringNum);

            const style = drawer.colors.avoid;
            const comp = new AvoidComponent(stringNum, { ...style, opacity: isCur ? 1 : 0 }, geometry);
            comp.setTargetOpacity(isNxt ? 1 : 0);
            this.avoidComponents.push(comp);
        });

        this.lastChordId = transitionId;
    }
}

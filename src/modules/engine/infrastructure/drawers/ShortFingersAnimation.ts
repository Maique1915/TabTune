import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";
import { FingersAnimationDrawer, FingersAnimationParams } from "./static-fingers-drawer";
import { easeInOutQuad } from "../utils/animacao";
import { detectBarreFromChord } from "./utils/barre-detection";
import { getFinNum } from "./utils/fingers-utils";
import { FingerComponent } from "./components/FingerComponent";
import { AvoidsAnimation } from "./AvoidsAnimation";
import { TransposeIndicatorComponent } from "./components/TransposeIndicatorComponent";
import { NeckType } from "./components/NeckType";

export class ShortFingersAnimation implements FingersAnimationDrawer {
    private fingerComponents: FingerComponent[] = [];
    private barreComponent: FingerComponent | null = null;
    private transposeComponent: TransposeIndicatorComponent | null = null;
    private avoidsAnimation: AvoidsAnimation = new AvoidsAnimation();
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
            ctx.save();
            if (!skipFretboard) {
                drawer.drawFretboard();
            }

            const { finalChord: visualChordCurrent } = drawer.transposeForDisplay(currentDisplayChord.finalChord, currentDisplayChord.transportDisplay);
            const { finalChord: visualChordNext } = drawer.transposeForDisplay(nextDisplayChord.finalChord, nextDisplayChord.transportDisplay);

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
            this.avoidsAnimation.draw({
                ctx,
                currentAvoid: visualChordCurrent.avoid || [],
                nextAvoid: visualChordNext.avoid || [],
                progress: transitionProgress,
                geometry,
                style: drawer.colors.avoid
            });

            ctx.restore();
        } else {
            const { finalChord: visualChord } = drawer.transposeForDisplay(currentDisplayChord.finalChord, currentDisplayChord.transportDisplay);

            ctx.save();
            if (!skipFretboard) {
                drawer.drawFretboard();
            }

            if (this.barreComponent) {
                this.barreComponent.update(1);
                this.barreComponent.draw(ctx);
            }

            this.fingerComponents.forEach(f => {
                f.update(1);
                f.draw(ctx);
            });

            if (this.transposeComponent) {
                this.transposeComponent.update(1);
                this.transposeComponent.draw(ctx);
            }

            this.avoidsAnimation.draw({
                ctx,
                currentAvoid: visualChord.avoid || [],
                nextAvoid: visualChord.avoid || [],
                progress: 1,
                geometry,
                style: drawer.colors.avoid
            });

            ctx.restore();
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
            const loose = fingers.filter(f => {
                if (f.fret <= 0) return false;
                if (barre && f.fret === barre.fret) {
                    const sMin = Math.min(barre.startString, barre.endString);
                    const sMax = Math.max(barre.startString, barre.endString);
                    if (f.string >= sMin && f.string <= sMax) return false;
                }
                return true;
            });
            return loose.sort((a, b) => getFinNum(a.finger) - getFinNum(b.finger));
        };

        const cL = buildLoose(curRawF, curB);
        const nL = buildLoose(nxtRawF, nxtB);

        const curT = FingerComponent.calculateEffectiveTransport(current.finalChord.fingers, drawer.numFrets, current.transportDisplay);
        const nxtT = FingerComponent.calculateEffectiveTransport(next.finalChord.fingers, drawer.numFrets, next.transportDisplay);

        // 1. Barre
        if (curB || nxtB) {
            if (!this.barreComponent && curB) {
                this.barreComponent = new FingerComponent(curB.fret, curB.startString, curB.finger ?? 1, drawer.colors.fingers, geometry, curT, curB.endString) as any;
            } else if (!this.barreComponent && nxtB) {
                this.barreComponent = new FingerComponent(nxtB.fret, nxtB.startString, nxtB.finger ?? 1, { ...drawer.colors.fingers, opacity: 1 }, geometry, nxtT, nxtB.endString) as any;
            }

            if (this.barreComponent) {
                const tF = nxtB ? nxtB.fret : (curB ? curB.fret : 0);
                const tS = nxtB ? nxtB.startString : (curB ? curB.startString : 0);
                const tE = nxtB ? nxtB.endString : (curB ? curB.endString : 0);
                const tO = 1;
                (this.barreComponent as any).setTarget(tF, tS, tO, nxtB?.finger ?? curB?.finger ?? 1, nxtT, tE);
                this.barreComponent.setRotation(drawer.rotation, drawer.mirror);
            }
        } else {
            this.barreComponent = null;
        }

        // 2. Fingers
        this.fingerComponents = [];
        const max = Math.max(cL.length, nL.length);
        for (let i = 0; i < max; i++) {
            const cur = cL[i];
            const nxt = nL[i];

            let fComp: FingerComponent;
            if (cur) {
                fComp = new FingerComponent(cur.fret, cur.string, cur.finger ?? 1, drawer.colors.fingers, geometry, curT);
                const tO = 1;
                const tF = nxt ? nxt.fret : cur.fret;
                const tS = nxt ? nxt.string : cur.string;
                const tL = nxt ? nxt.finger : cur.finger;
                fComp.setTarget(tF, tS, tO, tL ?? 1, nxtT);
            } else if (nxt) {
                fComp = new FingerComponent(nxt.fret, nxt.string, nxt.finger ?? 1, { ...drawer.colors.fingers, opacity: 1 }, geometry, nxtT);
                fComp.setTarget(nxt.fret, nxt.string, 1, nxt.finger ?? 1, nxtT);
            } else {
                continue;
            }
            fComp.setRotation(drawer.rotation, drawer.mirror);
            this.fingerComponents.push(fComp);
        }

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

        const tText = nxtT; // Use the calculated transport as the display text
        const tFretVisual = tText > 1 ? 1 : 1; // Always 1 when transposing to the nut area

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
            this.transposeComponent.setRotation(drawer.rotation, drawer.mirror);
        }

        this.lastChordId = transitionId;
    }
}

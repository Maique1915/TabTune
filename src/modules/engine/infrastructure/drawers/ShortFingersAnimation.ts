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
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard, skipChordName: true });
            return;
        }

        // Prepare components
        this.ensureComponents(drawer, currentDisplayChord, nextDisplayChord || currentDisplayChord, geometry);

        if (nextDisplayChord && transitionProgress > 0) {
            const eased = easeInOutQuad(transitionProgress);

            ctx.save();
            drawer.applyTransforms();

            // Draw Barre (Historically separate, but now barre might be inside fingerComponents if unified)
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

            ctx.restore();
        } else {
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard, skipChordName: true });
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

        const drawItem = (chord: ChordDiagramProps, transport: number, offset: number, opacity: number) => {
            const threshold = (drawer.dimensions.width / 2) + diagramWidth;
            if (offset < -threshold || offset > threshold) return;

            ctx.save();
            ctx.translate(offset, 0);
            ctx.globalAlpha = opacity;

            // Draw the complete chord including its own fretboard
            drawer.drawChord(chord, transport, 0);

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

        // MATCH DRAWER LOGIC: Calculate actual transports used for static drawing
        const curT = FingerComponent.calculateEffectiveTransport(current.finalChord.fingers, drawer.numFrets, current.transportDisplay);
        const nxtT = FingerComponent.calculateEffectiveTransport(next.finalChord.fingers, drawer.numFrets, next.transportDisplay);

        const curV = drawer.transposeForDisplay(current.finalChord, curT).finalChord;
        const nxtV = drawer.transposeForDisplay(next.finalChord, nxtT).finalChord;

        // Unified Component Pools
        this.fingerComponents = [];
        this.barreComponent = null;

        const derivedStyle = {
            ...drawer.colors.fingers,
            radius: drawer.fingerRadius / drawer.scaleFactor,
            barreWidth: drawer.barreWidth / drawer.scaleFactor,
            fontSize: (drawer as any)._baseFontSize || drawer.colors.fingers.fontSize || 35
        };

        // Step 1: Extract all "Actors" from current and next chords
        // An Actor is either a Barre or a Loose Finger
        const getActors = (chord: ChordDiagramProps) => {
            const barre = detectBarreFromChord(chord);
            const loose = chord.fingers.filter(f => {
                if (f.fret <= 0) return false;
                if (barre && f.fret === barre.fret) {
                    const sMin = Math.min(barre.startString, barre.endString);
                    const sMax = Math.max(barre.startString, barre.endString);
                    if (f.string >= sMin && f.string <= sMax) return false;
                }
                return true;
            });
            return { barre, loose };
        };

        const curA = getActors(curV);
        const nxtA = getActors(nxtV);

        // Map by finger ID
        const componentsMap = new Map<number | string, FingerComponent>();

        // 1. Resolve Barre (if any finger ID 1 is usually used for barre, we check mapping)
        // Note: For simplicity, we assume there's only one "Major Barre" per chord for now.
        // But we map it by its finger ID to allow transformations.

        if (curA.barre || nxtA.barre) {
            const fingerId = curA.barre?.finger ?? nxtA.barre?.finger ?? 1;
            const initB = curA.barre || nxtA.barre;

            this.barreComponent = new FingerComponent(initB!.fret, initB!.startString, fingerId, derivedStyle, geometry, 1, initB!.endString);

            if (!curA.barre && nxtA.barre) {
                // Fading in
                (this.barreComponent as any).sOpacity = 0;
                (this.barreComponent as any).vOpacity = 0;
                this.barreComponent.setTarget(nxtA.barre.fret, nxtA.barre.startString, 1, fingerId, 1, nxtA.barre.endString);
            } else if (curA.barre && nxtA.barre) {
                // Moving/Transforming
                this.barreComponent.setTarget(nxtA.barre.fret, nxtA.barre.startString, 1, fingerId, 1, nxtA.barre.endString);
            } else if (curA.barre && !nxtA.barre) {
                // Disappearing OR transforming into a loose finger
                const nextLooseWithSameId = nxtA.loose.find(f => f.finger === fingerId);
                if (nextLooseWithSameId) {
                    // TRANSFORM into loose finger
                    this.barreComponent.setTarget(nextLooseWithSameId.fret, nextLooseWithSameId.string, 1, fingerId, 1, undefined);
                } else {
                    // Fading out
                    this.barreComponent.setTarget(curA.barre.fret, curA.barre.startString, 0, fingerId, 1, curA.barre.endString);
                }
            }
            this.barreComponent.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            componentsMap.set(fingerId, this.barreComponent);
        }

        // 2. Resolve Loose Fingers
        const usedNxtLoose = new Set<number>();

        // Match existing/new loose fingers
        curA.loose.forEach(curF => {
            if (componentsMap.has(curF.finger ?? 'none')) return; // Already handled by barre transformation

            const nxtFIdx = nxtA.loose.findIndex((f, idx) => !usedNxtLoose.has(idx) && f.finger === curF.finger && f.finger !== undefined && f.finger !== 0);
            const comp = new FingerComponent(curF.fret, curF.string, curF.finger ?? 1, derivedStyle, geometry, 1);

            if (nxtFIdx !== -1) {
                const nxtF = nxtA.loose[nxtFIdx];
                comp.setTarget(nxtF.fret, nxtF.string, 1, nxtF.finger ?? 1, 1);
                usedNxtLoose.add(nxtFIdx);
            } else {
                // Check if this finger becomes a Barre in next chord
                if (nxtA.barre && nxtA.barre.finger === curF.finger) {
                    // TRANSFORM into barre
                    comp.setTarget(nxtA.barre.fret, nxtA.barre.startString, 1, nxtA.barre.finger ?? 1, 1, nxtA.barre.endString);
                } else {
                    // Fade out
                    comp.setTarget(curF.fret, curF.string, 0, curF.finger ?? 1, 1);
                }
            }

            comp.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            this.fingerComponents.push(comp);
            if (curF.finger) componentsMap.set(curF.finger, comp);
        });

        // Add remaining loose fingers from nxt
        nxtA.loose.forEach((nxtF, idx) => {
            if (usedNxtLoose.has(idx)) return;
            if (componentsMap.has(nxtF.finger ?? 'none')) return;

            const comp = new FingerComponent(nxtF.fret, nxtF.string, nxtF.finger ?? 1, derivedStyle, geometry, 1);
            (comp as any).sOpacity = 0;
            (comp as any).vOpacity = 0;
            comp.setTarget(nxtF.fret, nxtF.string, 1, nxtF.finger ?? 1, 1);

            comp.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            this.fingerComponents.push(comp);
        });

        // 3. Transpose Indicator
        const getMinFret = (fingers: StandardPosition[]) => {
            let minFret = Infinity;
            for (let i = 0; i < fingers.length; i++) {
                if (fingers[i].fret > 0 && fingers[i].fret < minFret) { minFret = fingers[i].fret; }
            }
            return minFret === Infinity ? 1 : minFret;
        };

        const minVisualFret = getMinFret(nxtV.fingers || []);
        const tText = nxtT;
        const tFretVisual = tText > 1 ? minVisualFret : 1;

        if (!this.transposeComponent) {
            const color = (drawer.colors.head?.textColors as any)?.name || drawer.colors.global.primaryTextColor || "#ffffff";
            this.transposeComponent = new TransposeIndicatorComponent(NeckType.SHORT, tText, tFretVisual, { color, fontSize: 35 }, geometry);
        }
        if (this.transposeComponent) {
            this.transposeComponent.setTarget(tText, tFretVisual, tText > 1 ? 1 : 0);
            this.transposeComponent.setRotation((drawer as any).rotation, (drawer as any).mirror);
        }

        // 4. Avoids
        this.avoidComponents = [];
        const curAvoid = current.finalChord.avoid || [];
        const nxtAvoid = next.finalChord.avoid || [];
        const allStrings = new Set([...(curAvoid as number[]), ...(nxtAvoid as number[])]);

        allStrings.forEach(s => {
            const style = drawer.colors.avoid;
            const comp = new AvoidComponent(s, { ...style, opacity: (curAvoid as number[]).includes(s) ? 1 : 0 }, geometry);
            comp.setTargetOpacity((nxtAvoid as number[]).includes(s) ? 1 : 0);
            this.avoidComponents.push(comp);
        });

        this.lastChordId = transitionId;
    }
}

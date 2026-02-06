import type { ChordDiagramProps, BarreInfo, StandardPosition, CapoStyle } from "@/modules/core/domain/types";
import { FingersAnimationDrawer, FingersAnimationParams } from "./ChordDrawer";
import { easeInOutQuad } from "../utils/animacao";
import { detectBarreFromChord } from "./utils/barre-detection";
import { getFinNum } from "./utils/fingers-utils";
import { FingerComponent } from "./components/FingerComponent";
import { CapoComponent } from "./components/CapoComponent";
import { AvoidComponent } from "./components/AvoidComponent";
import { NeckType } from "./components/NeckType";
import { detectBarreFromChord as detectBarre } from "./utils/barre-detection";

/**
 * Specialized animation orchestrator for the Full Cinematic Neck.
 * Components handle their own interpolation; this class manages their lifecycle.
 */
export class FullFingersAnimation implements FingersAnimationDrawer {
    private fingerComponents: FingerComponent[] = [];
    private barreComponent: FingerComponent | null = null;
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
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
            return;
        }

        if (!geometry) {
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
            return;
        }

        this.ensureComponents(drawer, currentDisplayChord, nextDisplayChord || currentDisplayChord, geometry);

        ctx.save();
        if (!skipFretboard) drawer.drawFretboard(currentDisplayChord.transportDisplay);
        drawer.applyTransforms();

        const eased = transitionProgress > 0 ? easeInOutQuad(transitionProgress) : 0;

        if (this.barreComponent) {
            this.barreComponent.update(eased);
            this.barreComponent.draw(ctx);
        }

        this.fingerComponents.forEach(f => {
            f.update(eased);
            f.draw(ctx);
        });

        this.avoidComponents.forEach(avoid => {
            avoid.update(eased);
            avoid.draw(ctx);
        });

        ctx.restore();
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
        const geometryId = `${drawer.fretboardX}_${drawer.fretboardWidth}_${drawer.scaleFactor}`;
        const transitionId = `${curId}_to_${nextId}_geo_${geometryId}`;

        if (this.lastChordId === transitionId) return;

        const curT = FingerComponent.calculateEffectiveTransport(current.finalChord.fingers, drawer.numFrets, current.transportDisplay);
        const nxtT = FingerComponent.calculateEffectiveTransport(next.finalChord.fingers, drawer.numFrets, next.transportDisplay);
        const curV = drawer.transposeForDisplay(current.finalChord, curT).finalChord;
        const nxtV = drawer.transposeForDisplay(next.finalChord, nxtT).finalChord;

        this.fingerComponents = [];
        this.barreComponent = null;

        const derivedStyle = {
            ...drawer.colors.fingers,
            radius: drawer.fingerRadius / drawer.scaleFactor,
            barreWidth: drawer.barreWidth / drawer.scaleFactor,
            fontSize: (drawer as any)._baseFontSize || drawer.colors.fingers.fontSize || 35
        };

        // Access global capo from drawer (FullNeckDrawer has it)
        const globalCapo = (drawer as any)._globalCapo || 0;

        const getActors = (chord: ChordDiagramProps) => {
            let barre = detectBarreFromChord(chord);
            if (barre && globalCapo > 0 && barre.fret === globalCapo) {
                barre = null;
            }
            const loose = chord.fingers.filter(f => {
                if (f.fret <= 0) return false;
                if (globalCapo > 0 && f.fret === globalCapo) return false;
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
        const componentsMap = new Map<number | string, FingerComponent>();

        // 1. Barre logic

        // Use the visually transposed actors for barre logic
        // 1. Barre logic
        let nxtBarre = nxtA.barre;
        let curBarre = curA.barre;

        // 1. Barre logic
        if (curBarre || nxtBarre) {
            if (globalCapo > 0 && (curBarre?.fret === globalCapo || nxtBarre?.fret === globalCapo)) {
                curBarre = null;
                nxtBarre = null;
            }
        }
        if (curBarre || nxtBarre) {
            const fingerId = curBarre?.finger ?? nxtBarre?.finger ?? 1;
            const initB = curBarre || nxtBarre;
            this.barreComponent = new FingerComponent(initB!.fret, initB!.startString, fingerId, derivedStyle, geometry, 1, initB!.endString);

            if (curBarre && nxtBarre) {
                this.barreComponent.setTarget(nxtBarre.fret, nxtBarre.startString, 1, fingerId, 1, nxtBarre.endString);
            } else if (!curBarre && nxtBarre) {
                (this.barreComponent as any).sOpacity = 0;
                (this.barreComponent as any).vOpacity = 0;
                this.barreComponent.setTarget(nxtBarre.fret, nxtBarre.startString, 1, fingerId, 1, nxtBarre.endString);
            } else if (curBarre) {
                const nextLooseWithSameId = nxtA.loose.find(f => f.finger === fingerId);
                if (nextLooseWithSameId) this.barreComponent.setTarget(nextLooseWithSameId.fret, nextLooseWithSameId.string, 1, fingerId, 1, undefined);
                else this.barreComponent.setTarget(curBarre.fret, curBarre.startString, 0, fingerId, 1, curBarre.endString);
            }
            this.barreComponent.setRotation(drawer.rotation, drawer.mirror, drawer.dimensions);
            componentsMap.set(fingerId, this.barreComponent);
        }

        // 2. Loose fingers logic
        const usedNxtLoose = new Set<number>();
        curA.loose.forEach(curF => {
            if (componentsMap.has(curF.finger ?? 'none')) return;
            const nxtFIdx = nxtA.loose.findIndex((f, idx) => !usedNxtLoose.has(idx) && f.finger === curF.finger && f.finger !== undefined && f.finger !== 0);
            const comp = new FingerComponent(curF.fret, curF.string, curF.finger ?? 1, derivedStyle, geometry, 1);
            if (nxtFIdx !== -1) {
                const nxtF = nxtA.loose[nxtFIdx];
                comp.setTarget(nxtF.fret, nxtF.string, 1, nxtF.finger ?? 1, 1);
                usedNxtLoose.add(nxtFIdx);
            } else {
                if (nxtBarre && nxtBarre.finger === curF.finger) comp.setTarget(nxtBarre.fret, nxtBarre.startString, 1, nxtBarre.finger ?? 1, 1, nxtBarre.endString);
                else comp.setTarget(curF.fret, curF.string, 0, curF.finger ?? 1, 1);
            }
            comp.setRotation(drawer.rotation, drawer.mirror, drawer.dimensions);
            this.fingerComponents.push(comp);
            if (curF.finger) componentsMap.set(curF.finger, comp);
        });

        nxtA.loose.forEach((nxtF, idx) => {
            if (usedNxtLoose.has(idx)) return;
            if (componentsMap.has(nxtF.finger ?? 'none')) return;
            const comp = new FingerComponent(nxtF.fret, nxtF.string, nxtF.finger ?? 1, derivedStyle, geometry, 1);
            (comp as any).sOpacity = 0;
            (comp as any).vOpacity = 0;
            comp.setTarget(nxtF.fret, nxtF.string, 1, nxtF.finger ?? 1, 1);
            comp.setRotation(drawer.rotation, drawer.mirror, drawer.dimensions);
            this.fingerComponents.push(comp);
        });

        // 4. Setup Avoids
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

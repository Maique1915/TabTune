import type { ChordDiagramProps, BarreInfo, StandardPosition, CapoStyle } from "@/modules/core/domain/types";
import { FingersAnimationDrawer, FingersAnimationParams } from "./ChordDrawer";
import { easeInOutQuad } from "../utils/animacao";
import { detectBarreFromChord } from "./utils/barre-detection";
import { getFinNum } from "./utils/fingers-utils";
import { FingerComponent } from "./components/FingerComponent";
import { CapoComponent } from "./components/CapoComponent";
import { AvoidComponent } from "./components/AvoidComponent";
import { NeckType } from "./components/NeckType";

/**
 * Specialized animation orchestrator for the Full Cinematic Neck.
 * Components handle their own interpolation; this class manages their lifecycle.
 */
export class FullFingersAnimation implements FingersAnimationDrawer {
    private fingerComponents: FingerComponent[] = [];
    private barreComponent: FingerComponent | null = null;
    private capoComponent: CapoComponent | null = null;
    private avoidComponents: AvoidComponent[] = [];
    private lastChordId: string = "";

    public draw(params: FingersAnimationParams): void {
        const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress, buildProgress, skipFretboard } = params;
        if (!currentDisplayChord) return;

        const ctx = drawer.ctx;
        const geometry = (drawer as any).getGeometry?.();

        if (!skipFretboard) {
            drawer.clear();
        }

        if (buildProgress !== undefined && buildProgress < 1) {
            // Static build fallback
            drawer.drawChord(currentDisplayChord.finalChord, currentDisplayChord.transportDisplay, 0, { skipFretboard });
            return;
        }

        if (!geometry) {
            // Fallback for missing geometry
            drawer.drawChord(currentDisplayChord.finalChord, currentDisplayChord.transportDisplay, 0, { skipFretboard });
            return;
        }

        // Prepare components
        this.ensureComponents(drawer, currentDisplayChord, nextDisplayChord || currentDisplayChord, geometry);

        // Apply global transforms to components
        const dims = drawer.dimensions;
        const rot = (drawer as any).rotation;
        const mir = (drawer as any).mirror;

        if (this.barreComponent) this.barreComponent.setRotation(rot, mir, dims);
        this.fingerComponents.forEach(f => f.setRotation(rot, mir, dims));


        // Orchestrate State Changes
        if (nextDisplayChord && transitionProgress > 0) {

            ctx.save();
            if (!skipFretboard) drawer.drawFretboard();

            const eased = easeInOutQuad(transitionProgress);

            // Update & Draw Barre
            if (this.barreComponent) {
                this.barreComponent.update(eased);
                this.barreComponent.draw(ctx);
            }

            // Update & Draw Capo
            if (this.capoComponent) {
                this.capoComponent.update(eased);
                this.capoComponent.draw(ctx);
            }

            // Update & Draw Fingers
            this.fingerComponents.forEach(f => {
                f.update(eased);
                f.draw(ctx);
            });

            // Update & Draw Avoids
            this.avoidComponents.forEach(avoid => {
                avoid.update(eased);
                avoid.draw(ctx);
            });

            ctx.restore();
        } else {
            // Static Draw - Using components for consistency
            ctx.save();
            if (!skipFretboard) drawer.drawFretboard();

            if (this.barreComponent) {
                this.barreComponent.update(1);
                this.barreComponent.draw(ctx);
            }

            if (this.capoComponent) {
                this.capoComponent.update(1);
                this.capoComponent.draw(ctx);
            }

            this.fingerComponents.forEach(f => {
                f.update(1);
                f.draw(ctx);
            });

            this.avoidComponents.forEach(avoid => {
                avoid.update(1);
                avoid.draw(ctx);
            });

            ctx.restore();
        }
    }

    private ensureComponents(drawer: any, current: any, next: any, geometry: any): void {
        const nextId = (next.finalChord.chordName || "") + JSON.stringify(next.finalChord.fingers) + next.transportDisplay;
        const curId = (current.finalChord.chordName || "") + JSON.stringify(current.finalChord.fingers) + current.transportDisplay;

        // Include geometry in ID
        const geometryId = `${drawer.fretboardX}_${drawer.fretboardWidth}_${drawer.scaleFactor}`;
        const transitionId = `${curId}_to_${nextId}_geo_${geometryId}`;

        console.log('[FullFingersAnimation] Checking transition:', {
            lastChordId: this.lastChordId,
            transitionId,
            curFingers: current.finalChord.fingers,
            nxtFingers: next.finalChord.fingers
        });

        if (this.lastChordId === transitionId) return; // Already setup for this specific transition

        const curF = current.finalChord.fingers;
        const nxtF = next.finalChord.fingers;

        const curB = detectBarreFromChord({ fingers: curF } as any);
        const nxtB = detectBarreFromChord({ fingers: nxtF } as any);

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

        const cL = buildLoose(curF, curB);
        const nL = buildLoose(nxtF, nxtB);

        const curT = current.transportDisplay || 1;
        const nxtT = next.transportDisplay || 1;

        // 1. Setup Barre
        if (curB || nxtB) {
            if (!this.barreComponent && curB) {
                this.barreComponent = new FingerComponent(curB.fret, curB.startString, curB.finger ?? 1, drawer.colors.fingers, geometry, curT, curB.endString);
            } else if (!this.barreComponent && nxtB) {
                this.barreComponent = new FingerComponent(nxtB.fret, nxtB.startString, nxtB.finger ?? 1, { ...drawer.colors.fingers, opacity: 0 }, geometry, nxtT, nxtB.endString);
            }

            if (this.barreComponent) {
                const tF = nxtB ? nxtB.fret : (curB ? curB.fret : 0);
                const tS = nxtB ? nxtB.startString : (curB ? curB.startString : 0);
                const tE = nxtB ? nxtB.endString : (curB ? curB.endString : 0);
                const tO = nxtB ? 1 : 0; // Fix: Opacity target based on existence of next
                this.barreComponent.setTarget(tF, tS, tO, nxtB?.finger ?? curB?.finger ?? 1, nxtT, tE);
            }
        } else {
            this.barreComponent = null;
        }

        // 2. Setup Fingers (ID-based matching for Zoom transitions)
        this.fingerComponents = [];

        const curMap = new Map<number, any>();
        cL.forEach(f => curMap.set(getFinNum(f.finger), f));

        const nxtMap = new Map<number, any>();
        nL.forEach(f => nxtMap.set(getFinNum(f.finger), f));

        const allIds = new Set([...curMap.keys(), ...nxtMap.keys()]);

        allIds.forEach(id => {
            const cur = curMap.get(id);
            const nxt = nxtMap.get(id);

            let fComp: FingerComponent;

            if (cur && nxt) {
                // Move: Transition position
                fComp = new FingerComponent(cur.fret, cur.string, cur.finger ?? 1, drawer.colors.fingers, geometry, curT);
                fComp.setTarget(nxt.fret, nxt.string, 1, nxt.finger ?? 1, nxtT, undefined, 1);
            } else if (cur && !nxt) {
                // Disappear: Zoom Out (Scale 1 -> 0)
                fComp = new FingerComponent(cur.fret, cur.string, cur.finger ?? 1, drawer.colors.fingers, geometry, curT);
                fComp.setTarget(cur.fret, cur.string, 0, cur.finger ?? 1, nxtT, undefined, 0); // Opacity 0 + Scale 0
            } else if (!cur && nxt) {
                // Appear: Zoom In (Scale 0 -> 1)
                fComp = new FingerComponent(nxt.fret, nxt.string, nxt.finger ?? 1, drawer.colors.fingers, geometry, nxtT);
                fComp.setScale(0); // Initialize at scale 0
                fComp.setTarget(nxt.fret, nxt.string, 1, nxt.finger ?? 1, nxtT, undefined, 1);
            } else {
                return;
            }
            this.fingerComponents.push(fComp);
        });

        // 3. Setup Capo
        const curCapo = (drawer as any)._globalCapo || 0;
        if (curCapo > 0) {
            if (!this.capoComponent) {
                const style: CapoStyle = {
                    color: drawer.colors.capo?.color || "#2D2D2D",
                    border: drawer.colors.capo?.border || { color: "#4A4A4A", width: 1 },
                    textColor: drawer.colors.capo?.textColors?.name || "#FFFFFF",
                    opacity: 1
                };
                this.capoComponent = new CapoComponent(curCapo, style, geometry);
            }
            this.capoComponent.setTarget(curCapo, 1);
        } else {
            this.capoComponent = null;
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


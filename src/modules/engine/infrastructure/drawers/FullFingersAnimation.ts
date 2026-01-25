import type { ChordDiagramProps, BarreInfo, StandardPosition, CapoStyle } from "@/modules/core/domain/types";
import { FingersAnimationDrawer, FingersAnimationParams } from "./static-fingers-drawer";
import { easeInOutQuad } from "../utils/animacao";
import { detectBarreFromChord } from "./utils/barre-detection";
import { getFinNum } from "./utils/fingers-utils";
import { FingerComponent } from "./components/FingerComponent";
import { CapoComponent } from "./components/CapoComponent";
import { AvoidsAnimation } from "./AvoidsAnimation";
import { NeckType } from "./components/NeckType";

/**
 * Specialized animation orchestrator for the Full Cinematic Neck.
 * Components handle their own interpolation; this class manages their lifecycle.
 */
export class FullFingersAnimation implements FingersAnimationDrawer {
    private fingerComponents: FingerComponent[] = [];
    private barreComponent: FingerComponent | null = null;
    private capoComponent: CapoComponent | null = null;
    private avoidsAnimation: AvoidsAnimation = new AvoidsAnimation();
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
        const rot = drawer.rotation;
        const mir = drawer.mirror;

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
            this.avoidsAnimation.draw({
                ctx,
                currentAvoid: currentDisplayChord.finalChord.avoid || [],
                nextAvoid: nextDisplayChord.finalChord.avoid || [],
                progress: transitionProgress,
                geometry,
                style: drawer.colors.avoid
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

            this.avoidsAnimation.draw({
                ctx,
                currentAvoid: currentDisplayChord.finalChord.avoid || [],
                nextAvoid: currentDisplayChord.finalChord.avoid || [],
                progress: 1,
                geometry,
                style: drawer.colors.avoid
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
                this.barreComponent = new FingerComponent(nxtB.fret, nxtB.startString, nxtB.finger ?? 1, { ...drawer.colors.fingers, opacity: 1 }, geometry, nxtT, nxtB.endString);
            }

            if (this.barreComponent) {
                const tF = nxtB ? nxtB.fret : (curB ? curB.fret : 0);
                const tS = nxtB ? nxtB.startString : (curB ? curB.startString : 0);
                const tE = nxtB ? nxtB.endString : (curB ? curB.endString : 0);
                const tO = 1;
                this.barreComponent.setTarget(tF, tS, tO, nxtB?.finger ?? curB?.finger ?? 1, nxtT, tE);
            }
        } else {
            this.barreComponent = null;
        }

        // 2. Setup Fingers
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
            this.fingerComponents.push(fComp);
        }

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

        this.lastChordId = transitionId;
    }
}


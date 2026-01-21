import { AbstractChordDrawer } from "./AbstractChordDrawer"; // Will keep shared geometry/math
import { ShortNeckDrawer } from "./ShortNeck";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps, BarreInfo } from "@/modules/core/domain/types";
import { getNome } from "@/modules/core/domain/chord-logic";
import { easeInOutQuad } from "../utils/animacao";
import { ChordDrawer } from "./ChordDrawer";

export class ShortChord extends AbstractChordDrawer implements ChordDrawer {
    public fretboardDrawer: FretboardDrawer;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);

        this.calculateDimensions();

        this.fretboardDrawer = new ShortNeckDrawer(ctx, colors, dimensions, {
            diagramWidth: this.diagramWidth,
            diagramHeight: this._diagramHeight,
            diagramX: this._diagramX,
            diagramY: this._diagramY,
            numStrings: this._numStrings,
            numFrets: this._numFrets,
            horizontalPadding: this.horizontalPadding,
            stringSpacing: this._stringSpacing,
            fretboardX: this._fretboardX,
            fretboardY: this._fretboardY,
            fretboardWidth: this._fretboardWidth,
            fretboardHeight: this._fretboardHeight,
            realFretSpacing: this._realFretSpacing,
            neckRadius: this.neckRadius,
            stringNamesY: this._stringNamesY,
        }, this._scaleFactor);

        this.fretboardDrawer.setTransforms(this._rotation as any, this._mirror);
    }

    // ============ DRAWING METHODS ============



    private _drawShapeAndFingerNumber(
        centerX: number,
        centerY: number,
        finger: number | string,
        isBarre: boolean,
        barreVisualWidth: number
    ): void {
        this._ctx.save();

        this._ctx.shadowColor = "rgba(0,0,0,0.5)";
        this._ctx.shadowBlur = 5;

        this._ctx.fillStyle = "#1a1a1a";
        this._ctx.beginPath();

        if (isBarre) {
            this._ctx.roundRect(centerX - barreVisualWidth / 2, centerY - (this.barreWidth / 2), barreVisualWidth, this.barreWidth, this.neckRadius);
        } else {
            this._ctx.arc(centerX, centerY, this.fingerRadius, 0, Math.PI * 2);
        }
        this._ctx.fill();

        this._ctx.strokeStyle = "#ffffff";
        this._ctx.lineWidth = 3 * this._scaleFactor;
        this._ctx.stroke();

        if (finger !== undefined && finger !== null && finger !== -2) {
            this._ctx.fillStyle = "#ffffff";
            const fontSize = 35 * this._scaleFactor;
            this._ctx.font = `bold ${fontSize}px sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";

            const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

            this._ctx.save();
            this._ctx.translate(centerX, centerY);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText(displayText, 0, 0);
            this._ctx.restore();
        }

        this._ctx.restore();
    }

    private _drawAnimatedShapeAndFingerNumber(
        finger: number | string,
        isBarre: boolean,
        barreVisualWidth: number
    ): void {
        this._ctx.fillStyle = this.hexToRgba(this._colors.fingers.color, this._colors.fingers.opacity ?? 1);
        this._ctx.beginPath();

        if (isBarre) {
            this._ctx.roundRect(
                -barreVisualWidth / 2,
                -(this.barreWidth / 2),
                barreVisualWidth,
                this.barreWidth,
                this.neckRadius * 2
            );
        } else {
            this._ctx.arc(0, 0, this.fingerRadius, 0, Math.PI * 2);
        }
        this._ctx.fill();

        const borderWidth = this._colors.fingers.border?.width ?? 0;
        if (borderWidth > 0) {
            this._ctx.strokeStyle = this._colors.fingers.border?.color || "#000000";
            this._ctx.lineWidth = borderWidth;
            this._ctx.stroke();
        }

        if (finger !== undefined && finger !== null && finger !== -2) {
            this._ctx.fillStyle = this._colors.fingers.textColor || "#ffffff";
            const fontSize = 45 * this._scaleFactor;
            this._ctx.font = `bold ${fontSize}px sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";

            const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

            this._ctx.save();
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText(displayText, 0, 0);
            this._ctx.restore();
        }
    }

    private _drawBarreShapeAtPosition(finger: number | string, barreVisualWidth: number): void {
        this._drawAnimatedShapeAndFingerNumber(finger, true, barreVisualWidth);
    }

    private _getCapoConfig(): { isActive: boolean; fret: number; showNut: boolean } {
        if (this._globalCapo > 0) return { isActive: true, fret: this._globalCapo, showNut: false };
        return { isActive: false, fret: 0, showNut: true };
    }

    private _getTransposeConfig(transportDisplay: number): { isActive: boolean; fret: number; showNut: boolean } {
        if (transportDisplay > 1) return { isActive: true, fret: transportDisplay, showNut: false };
        return { isActive: false, fret: 1, showNut: true };
    }

    private _prepareFretboardDrawer(customStringNames: string[] | undefined = undefined, showNut: boolean | undefined = undefined): void {
        const capoConfig = this._getCapoConfig();
        // Just use capo config for drawFretboard simple calls? or assume transition logic is irrelevant there?
        // For drawFretboard (background), we usually want the global state.

        let shouldShowNut = showNut;
        if (shouldShowNut === undefined) {
            shouldShowNut = capoConfig.showNut;
        }

        const yOffset = this._globalCapo > 0 ? -50 * this._scaleFactor : 0;

        this.fretboardDrawer.setHeadstockGap(yOffset);
        // Force headstock background to be visible even if nut is hidden (capo case)
        this.fretboardDrawer.setConditionalFlags(shouldShowNut, true);

        if (customStringNames) {
            this.fretboardDrawer.setStringNames(1, customStringNames);
        }

        this.fretboardDrawer.setCapo(capoConfig.isActive, capoConfig.fret);
    }

    public drawFretboard(): void {
        this._prepareFretboardDrawer();
        this.fretboardDrawer.drawFretboard();
    }

    // ...

    drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
        const { finalChord, transportDisplay } = this.transposeForDisplay(inputChord, inputTransportDisplay);
        this._applyChordSettings(finalChord);
        const chordName = finalChord.chordName || (finalChord.chord ? getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "");
        const barreInfo = this._detectBarre(finalChord);

        if (finalChord.showChordName !== false) this.drawChordName(chordName);

        // const yOffset = this._globalCapo > 0 ? -50 * this._scaleFactor : 0; // Handled in prepare

        this._ctx.save();
        this.applyTransforms();

        if (!options.skipFretboard) {
            this._skipFretboard = false;
            const capoConfig = this._getCapoConfig();
            const transposeConfig = this._getTransposeConfig(transportDisplay);
            const showNut = capoConfig.showNut && transposeConfig.showNut;

            const stringNames = (finalChord.stringNames && finalChord.stringNames.length > 0) ? finalChord.stringNames : ["E", "A", "D", "G", "B", "e"];

            this._prepareFretboardDrawer(stringNames, showNut);

            // Overwrite setCapo from prepare if needed? No, prepare uses globalCapo which is correct for "physically" drawing the capo.
            // Transpose affects where fingers are drawn, but the capo itself stays at _globalCapo position usually?
            // Wait, if transportDisplay > 1, does it imply a capo?
            // The original code had logic:
            // this.fretboardDrawer.setCapo(capoConfig.isActive, capoConfig.fret);
            // And transposeConfig was handled by drawing an indicator, NOT by moving the capo?
            // Actually, if transportDisplay changes, does the capo move?
            // "transposeConfig" logic: if transport > 1, showNut = false.

            this.fretboardDrawer.drawFretboard();

            if (transposeConfig.isActive) this.drawTransposeIndicator(transposeConfig.fret, barreInfo);
        }

        this._drawFingersInternal(finalChord);
        this.drawAvoidedStrings(finalChord.avoid);
        this._ctx.restore();
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const { finalChord } = this.transposeForDisplay(chord, 1);
        this._ctx.save();
        this.applyTransforms();
        this._drawFingersInternal(finalChord);
        this.drawAvoidedStrings(finalChord.avoid);
        this._ctx.restore();
    }

    protected _drawFingersInternal(chord: ChordDiagramProps, opacity: number = 1): void {
        chord.fingers.forEach(f => {
            if (f.fret <= 0) return;
            this.drawFretPosition(f.fret, f.finger ?? 1, this._numStrings - f.string, this._numStrings - (f.endString ?? f.string));
        });
    }

    drawAvoidedStrings(avoid: number[] | undefined): void {
        if (!avoid) return;
        this._ctx.fillStyle = this._colors.global.primaryTextColor;
        const fontSize = 45 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        avoid.forEach(sNum => {
            const x = this._fretboardX + this.horizontalPadding + (this._numStrings - sNum) * this._stringSpacing;
            const y = this._fretboardY + this._fretboardHeight + this._realFretSpacing * 0.4;
            this._ctx.save();
            this._ctx.translate(x, y);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText("x", 0, 0);
            this._ctx.restore();
        });
    }

    public drawTransposeIndicator(text: string | number, barreInfo: BarreInfo | null = null): void {
        if (!text || Number(text) <= 1) return;
        const pos = this._getLabelPosition('transpose');
        let localY = pos.y;
        if (barreInfo) localY = this._fretboardY + (barreInfo.fret - 0.5) * this._realFretSpacing;

        this._ctx.save();
        this._ctx.translate(pos.x, localY);
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

        const fontSize = 45 * (this._diagramHeight / 750);
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillStyle = this._colors.global.primaryTextColor;
        this._ctx.fillText(`${text}ª`, -60 * (this._diagramHeight / 750), 0);
        this._ctx.restore();
    }

    // Additional drawing methods (Name, Animations)

    drawChordName(chordName: string, options?: { opacity?: number }): void {
        const themeOpacity = this._colors.chordName.opacity ?? 1;
        const transitionOpacity = options?.opacity ?? 1;
        const finalOpacity = themeOpacity * transitionOpacity;

        this._ctx.fillStyle = this.hexToRgba(this._colors.chordName.color, finalOpacity);

        const fontSize = 75 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        const pos = this._getLabelPosition('name');

        this._ctx.save();
        this._ctx.translate(pos.x, pos.y);
        // Removed mirror scaling so text reads correctly
        // if (this._mirror) this._ctx.scale(-1, 1);
        // Removed rotation so text stays upright relative to screen
        // if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText(chordName, 0, 0);
        this._ctx.restore();
    }

    // Animation Methods Implementation (Simplified Copy)

    drawChordWithBuildAnimation(
        chord: ChordDiagramProps,
        transportDisplay: number,
        progress: number,
        offsetX: number = 0
    ): void {
        if (offsetX !== 0) this.calculateWithOffset(offsetX);

        const { finalChord, transportDisplay: finalTransport } = this.transposeForDisplay(chord, transportDisplay);
        this._applyChordSettings(finalChord);

        const easedProgress = easeInOutQuad(progress);
        const chordName = finalChord.chordName || (finalChord.chord ? getNome(finalChord.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "");

        if (finalChord.showChordName !== false) {
            this.drawChordName(chordName, { opacity: easedProgress });
        }

        this._ctx.save();
        this.applyTransforms();

        if (!this._fretboardCache) this._updateFretboardCache();

        if (this._fretboardCache && !this._skipFretboard) {
            this._ctx.save();
            this._ctx.globalAlpha = easedProgress;
            this._ctx.drawImage(this._fretboardCache, this._diagramX, this._diagramY);
            this._ctx.restore();
        }

        if (progress >= 1) {
            this._skipFretboard = true;
        }

        const barreInfo = this._detectBarre(finalChord);
        this._drawFogProgressive(finalChord, progress);

        if (finalTransport > 1) {
            this.drawTransposeIndicator(finalTransport, barreInfo);
        }

        this._ctx.restore();
    }

    private _drawFogProgressive(chord: ChordDiagramProps, progress: number): void {
        const fingersToDraw = Math.floor(progress * chord.fingers.length);
        for (let i = 0; i <= fingersToDraw; i++) {
            const f = chord.fingers[i];
            if (!f || f.fret <= 0) continue;

            let alpha = 1;
            if (i === fingersToDraw) {
                alpha = (progress * chord.fingers.length) - fingersToDraw;
            }

            this._ctx.save();
            this._ctx.globalAlpha = alpha;
            this.drawFretPosition(f.fret, f.finger ?? 1, this._numStrings - f.string, this._numStrings - (f.endString ?? f.string));
            this._ctx.restore();
        }
    }

    drawChordWithTransition(
        currentFinalChord: ChordDiagramProps,
        currentTransportDisplay: number,
        nextFinalChord: ChordDiagramProps,
        nextTransportDisplay: number,
        originalProgress: number,
        offsetX: number = 0,
        options: { skipFretboard?: boolean } = {}
    ): void {
        if (offsetX !== 0) this.calculateWithOffset(offsetX);

        this._applyChordSettings(nextFinalChord);

        const { finalChord: current, transportDisplay: currentTransport } = this.transposeForDisplay(currentFinalChord, currentTransportDisplay);
        const { finalChord: next, transportDisplay: nextTransport } = this.transposeForDisplay(nextFinalChord, nextTransportDisplay);

        const currentBarreInfo = this._detectBarre(current);
        const nextBarreInfo = this._detectBarre(next);

        const currentName = current.chord ? getNome(current.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "";
        const nextName = next.chord ? getNome(next.chord).replace(/#/g, "♯").replace(/b/g, "♭") : "";

        const easedProgress = easeInOutQuad(originalProgress);
        const namePos = this._getLabelPosition('name');
        const centerX = namePos.x;
        const centerY = namePos.y;

        // Chord Name Transition
        const scaleOut = 1 - (easedProgress * 0.2);
        const currentNameTranslateY = -easedProgress * (20 * this._scaleFactor);
        this._drawTextWithTransform(currentName, 1 - easedProgress, scaleOut, currentNameTranslateY, centerX, centerY);

        const scaleIn = 0.8 + (easedProgress * 0.2);
        const nextNameTranslateY = (1 - easedProgress) * (20 * this._scaleFactor);
        this._drawTextWithTransform(nextName, easedProgress, scaleIn, nextNameTranslateY, centerX, centerY);

        this._ctx.save();
        this.applyTransforms();

        if (!this._fretboardCache) this._updateFretboardCache();

        if (!this._skipFretboard && !options.skipFretboard) {
            // NOTE: `drawStringNames` implementation in `FretboardDrawer` might vary.
            this.fretboardDrawer.drawStringNames(easedProgress, next.stringNames);
            this.fretboardDrawer.drawFretboard();
        }

        if (originalProgress >= 1) {
            this._skipFretboard = true;
        } else {
            this._skipFretboard = false;
        }

        // Helper transitions
        this.drawBarreWithTransition(currentBarreInfo, nextBarreInfo, current.fingers, next.fingers, originalProgress);
        this.drawFingersWithTransition(current.fingers, next.fingers, currentBarreInfo, nextBarreInfo, originalProgress);
        this.drawAvoidedStringsWithTransition(current.avoid, next.avoid, originalProgress);
        this.drawTransposeIndicatorWithTransition(currentTransport, nextTransport, currentBarreInfo, nextBarreInfo, originalProgress);

        this._ctx.restore();
    }

    drawBarreWithTransition(cBarre: BarreInfo | null, nBarre: BarreInfo | null, cFingers: any[], nFingers: any[], progress: number): void {
        if (cBarre) {
            this._drawBarreShapeAtPosition(cBarre.finger ?? 1, (1 - progress) * this.barreWidth);
            this._ctx.save();
            this._ctx.globalAlpha = 1 - progress;
            this._ctx.restore();
        }
    }

    drawFingersWithTransition(cFingers: any[], nFingers: any[], cBarre: BarreInfo | null, nBarre: BarreInfo | null, progress: number): void {
        this._drawFingersInternal({ fingers: nFingers } as any, progress);
    }

    drawAvoidedStringsWithTransition(cAvoid: number[] | undefined, nAvoid: number[] | undefined, progress: number): void {
        // Stub
    }

    drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cBarre: BarreInfo | null, nBarre: BarreInfo | null, progress: number): void {
        if (nTransport > 1) {
            this._ctx.save();
            this._ctx.globalAlpha = progress;
            this.drawTransposeIndicator(nTransport, nBarre);
            this._ctx.restore();
        }
    }

    // Helper from abstract
    protected _drawTextWithTransform(
        text: string,
        opacity: number,
        scale: number,
        translateY: number,
        centerX: number,
        centerY: number
    ): void {
        if (opacity <= 0 || !text) return;

        this._ctx.save();
        this._ctx.translate(centerX, centerY);

        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

        this._ctx.translate(0, translateY);
        this._ctx.scale(scale, scale);

        const fontSize = 75 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillStyle = this.hexToRgba(this._colors.chordName.color, opacity);
        this._ctx.fillText(text, 0, 0);

        this._ctx.restore();
    }

    private _applyChordSettings(chord: ChordDiagramProps): void {
        const chordNumStrings = chord.stringNames?.length ?? 6;
        if (chordNumStrings !== this._numStrings) {
            this.setNumStrings(chordNumStrings);
            this.fretboardDrawer.setNumStrings(this._numStrings);
            this.fretboardDrawer.setStringSpacing(this._stringSpacing);
            this.fretboardDrawer.setFretboardWidth(this._fretboardWidth);
            this.fretboardDrawer.setHorizontalPadding(this.horizontalPadding);
            this._fretboardCache = null;
        }
    }

    // Needed for drawTranspsoeIndicator
    drawFretPosition(
        fret: number,
        finger: number | string,
        fromStringIndex: number,
        toStringIndex: number
    ): void {
        const fretY = this._fretboardY + (fret - 0.5) * this._realFretSpacing;
        const isBarre = fromStringIndex !== toStringIndex;
        let centerX: number;
        let barreVisualWidth: number = 0;

        if (isBarre) {
            const leftIdx = Math.min(fromStringIndex, toStringIndex);
            const rightIdx = Math.max(fromStringIndex, toStringIndex);
            let fromX = this._fretboardX + this.horizontalPadding + leftIdx * this._stringSpacing;
            let toX = this._fretboardX + this.horizontalPadding + rightIdx * this._stringSpacing;
            fromX -= this.fingerRadius;
            toX += this.fingerRadius;
            barreVisualWidth = toX - fromX;
            centerX = fromX + barreVisualWidth / 2;
        } else {
            centerX = this._fretboardX + this.horizontalPadding + fromStringIndex * this._stringSpacing;
        }

        this._drawShapeAndFingerNumber(centerX, fretY, finger, isBarre, barreVisualWidth);
    }
}

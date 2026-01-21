import { AbstractChordDrawer } from "./AbstractChordDrawer"; // Will keep shared geometry/math
import { ShortNeckDrawer } from "./ShortNeck";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps, BarreInfo } from "@/modules/core/domain/types";
import { getNome, prepareShortChordVisuals } from "@/modules/core/domain/chord-logic";
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

    // ============ LOGIC OVERRIDES ============

    public transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        // 1. Calculate min and max frets (ignoring open strings/muted)
        const frets = chord.fingers
            .filter(f => f.fret > 0)
            .map(f => f.fret);

        // If all open/muted, standard behavior
        if (frets.length === 0) {
            return super.transposeForDisplay(chord, transportDisplay);
        }

        const maxFret = Math.max(...frets);
        const minFret = Math.min(...frets);

        console.log(`[AutoTranspose] Frets: ${frets}, Max: ${maxFret}, NumFrets: ${this._numFrets}, Min: ${minFret}`);

        // 2. Check overflow
        // If the highest fret exceeds or touches the limit of available frets (usually 5 for short neck),
        // we force auto-transposition to ensure chords near the bottom are normalized to the top.
        // Changed to >= to catch chords that hit the very bottom edge too.
        if (maxFret >= this._numFrets) {
            // "Lock to first fret": verify checks if any note passed the limit.
            // If yes, we set the transport display (the side number) to the lowest fret of the shape.
            // visualFret = actualFret - (minFret - 1).
            // This effectively places the lowest note at Visual Fret 1.
            const autoTransportDisplay = minFret;
            console.log(`[AutoTranspose] Triggered. New Transport: ${autoTransportDisplay}`);
            return super.transposeForDisplay(chord, autoTransportDisplay);
        }

        // Default behavior if fits in neck
        return super.transposeForDisplay(chord, transportDisplay);
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

    public drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
        // Use external logic
        const visuals = prepareShortChordVisuals(
            inputChord,
            this._numFrets,
            this._globalCapo,
            inputTransportDisplay
        );

        const { finalChord, startFret, barre, formattedName, capoConfig, transposeConfig } = visuals;

        this._applyChordSettings(finalChord);

        if (finalChord.showChordName !== false) this.drawChordName(formattedName);

        this._ctx.save();
        this.applyTransforms();

        if (!options.skipFretboard) {
            this._skipFretboard = false;
            const showNut = capoConfig.showNut && transposeConfig.showNut;
            const stringNames = (finalChord.stringNames && finalChord.stringNames.length > 0) ? finalChord.stringNames : ["E", "A", "D", "G", "B", "e"];
            this._prepareFretboardDrawer(stringNames, showNut);
            this.fretboardDrawer.drawFretboard();
        }

        if (transposeConfig.isActive) {
            // Find minimum visual fret to align the indicator
            const visibleFrets = finalChord.fingers.filter(f => f.fret > 0).map(f => f.fret);
            const minVisualFret = visibleFrets.length > 0 ? Math.min(...visibleFrets) : 1;
            this.drawTransposeIndicator(transposeConfig.fret, minVisualFret);
        }

        this._drawFingersInternal(finalChord);
        this.drawAvoidedStrings(finalChord.avoid);
        this._ctx.restore();
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const visuals = prepareShortChordVisuals(chord, this._numFrets, this._globalCapo, 1);
        this._ctx.save();
        this.applyTransforms();
        this._drawFingersInternal(visuals.finalChord);
        this.drawAvoidedStrings(visuals.finalChord.avoid);
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

    public drawTransposeIndicator(text: string | number, alignFret: number = 1): void {
        if (!text || Number(text) <= 1) return;

        // Match CapoFretNumber position logic from ShortNeck.ts for consistency
        const xOffsets = 30 * this._scaleFactor;
        const x = this._fretboardX - xOffsets;

        // Position: Vertically aligned with the center of the specific fret space (+ optical correction)
        const opticalOffsetY = 15 * this._scaleFactor;
        const y = this._fretboardY + (alignFret - 0.5) * this._realFretSpacing + opticalOffsetY;

        this._ctx.save();

        // Move to the target point
        this._ctx.translate(x, y);

        // Counter-rotations to keep text upright and correct direction
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

        const fontSize = 45 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        // Use theme color for numbers or Orange fallback
        const color = this._colors.capo?.textColors?.number || '#e67e22';
        this._ctx.fillStyle = color;

        // Center horizontally within the margin (30px margin -> 15px center offset)
        const offsetVal = 15 * this._scaleFactor;

        // Determine direction based on rotation
        const isHorizontal = this._rotation === 90 || this._rotation === 270;
        const sign = isHorizontal ? 1 : -1;

        this._ctx.fillText(`${text}ª`, sign * offsetVal, 0);
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

        const visuals = prepareShortChordVisuals(chord, this._numFrets, this._globalCapo, transportDisplay);
        const { finalChord, startFret, barre, formattedName, transposeConfig } = visuals;

        this._applyChordSettings(finalChord);

        const easedProgress = easeInOutQuad(progress);

        if (finalChord.showChordName !== false) {
            this.drawChordName(formattedName, { opacity: easedProgress });
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

        this._drawFogProgressive(finalChord, progress);

        if (transposeConfig.isActive) {
            const visibleFrets = finalChord.fingers.filter(f => f.fret > 0).map(f => f.fret);
            const minVisualFret = visibleFrets.length > 0 ? Math.min(...visibleFrets) : 1;
            this.drawTransposeIndicator(transposeConfig.fret, minVisualFret);
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

        // Pre-calculate both states
        const cVisuals = prepareShortChordVisuals(currentFinalChord, this._numFrets, this._globalCapo, currentTransportDisplay);
        const nVisuals = prepareShortChordVisuals(nextFinalChord, this._numFrets, this._globalCapo, nextTransportDisplay);

        this._applyChordSettings(nVisuals.finalChord);

        const easedProgress = easeInOutQuad(originalProgress);
        const namePos = this._getLabelPosition('name');
        const centerX = namePos.x;
        const centerY = namePos.y;

        // Chord Name Transition
        const scaleOut = 1 - (easedProgress * 0.2);
        const currentNameTranslateY = -easedProgress * (20 * this._scaleFactor);
        this._drawTextWithTransform(cVisuals.formattedName, 1 - easedProgress, scaleOut, currentNameTranslateY, centerX, centerY);

        const scaleIn = 0.8 + (easedProgress * 0.2);
        const nextNameTranslateY = (1 - easedProgress) * (20 * this._scaleFactor);
        this._drawTextWithTransform(nVisuals.formattedName, easedProgress, scaleIn, nextNameTranslateY, centerX, centerY);

        this._ctx.save();
        this.applyTransforms();

        if (!this._fretboardCache) this._updateFretboardCache();

        if (!this._skipFretboard && !options.skipFretboard) {
            // NOTE: `drawStringNames` implementation in `FretboardDrawer` might vary.
            this.fretboardDrawer.drawStringNames(easedProgress, nVisuals.finalChord.stringNames);
            this.fretboardDrawer.drawFretboard();
        }

        if (originalProgress >= 1) {
            this._skipFretboard = true;
        } else {
            this._skipFretboard = false;
        }

        // Calculate min frets for transition alignment
        const getMinFret = (c: ChordDiagramProps) => {
            const visible = c.fingers.filter(f => f.fret > 0).map(f => f.fret);
            return visible.length > 0 ? Math.min(...visible) : 1;
        };

        const cMinFret = getMinFret(cVisuals.finalChord);
        const nMinFret = getMinFret(nVisuals.finalChord);

        // Helper transitions
        this.drawBarreWithTransition(null, null, cVisuals.finalChord.fingers, nVisuals.finalChord.fingers, originalProgress);
        this.drawFingersWithTransition(cVisuals.finalChord.fingers, nVisuals.finalChord.fingers, null, null, originalProgress);
        this.drawAvoidedStringsWithTransition(cVisuals.finalChord.avoid, nVisuals.finalChord.avoid, originalProgress);

        // Transpose indicator transition - using logic from configs
        const cTrans = cVisuals.transposeConfig.isActive ? cVisuals.transposeConfig.fret : 1;
        const nTrans = nVisuals.transposeConfig.isActive ? nVisuals.transposeConfig.fret : 1;

        this.drawTransposeIndicatorWithTransition(cTrans, nTrans, cMinFret, nMinFret, originalProgress);

        this._ctx.restore();
    }

    drawBarreWithTransition(cBarre: BarreInfo | null, nBarre: BarreInfo | null, cFingers: any[], nFingers: any[], progress: number): void {
        const cDetected = this._detectBarre({ fingers: cFingers } as any);
        if (cDetected) {
            this._drawBarreShapeAtPosition(cDetected.finger ?? 1, (1 - progress) * this.barreWidth);
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

    drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void {
        if (nTransport > 1) {
            this._ctx.save();
            this._ctx.globalAlpha = progress;
            this.drawTransposeIndicator(nTransport, nAlignedFret);
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
        // Optical correction to center vertically in fret space
        const opticalOffsetY = 15 * this._scaleFactor;
        const fretY = this._fretboardY + (fret - 0.5) * this._realFretSpacing + opticalOffsetY;
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

import { AbstractChordDrawer } from "./AbstractChordDrawer";
import { FullNeckDrawer } from "./FullNeck";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps, BarreInfo } from "@/modules/core/domain/types";
import { getNome, extensions as extensionMap } from "@/modules/core/domain/chord-logic";
import { easeInOutQuad } from "../utils/animacao";
import { ChordDrawer } from "./ChordDrawer";
import { detectBarreFromChord } from "./utils/barre-detection";
import { drawAvoidedStrings, AvoidedStringsContext } from "./utils/avoided-strings-utils";

/**
 * FullChord draws a chord diagram over a horizontal FullNeckDrawer.
 * Implements a premium aesthetic matching the request.
 */
export class FullChord extends AbstractChordDrawer implements ChordDrawer {
    public fretboardDrawer: FretboardDrawer;
    public override isHorizontal: boolean = true;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);

        this.calculateDimensions();

        this.fretboardDrawer = new FullNeckDrawer(ctx, colors, dimensions, {
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
        this.fretboardDrawer.setSkipGlobalTransform(true);
    }

    public calculateDimensions(): void {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;

        // For Full Horizontal view, we want to maximize the width
        this._diagramWidth = CW * 0.9;
        this._diagramHeight = CH * 0.4; // The neck is not very tall

        this._diagramX = (CW - this._diagramWidth) / 2;
        this._diagramY = (CH - this._diagramHeight) / 2;

        this._fretboardX = this._diagramX;
        this._fretboardY = this._diagramY;
        this._fretboardWidth = this._diagramWidth;
        this._fretboardHeight = this._diagramHeight;

        this._numFrets = 24;
        this._numStrings = 6;

        // Base relative sizes
        this._baseFingerRadius = 22;
        this._baseBarreWidth = 48;
        this._baseNeckRadius = 16;

        // Horizontal spacing depends on numFrets
        this._realFretSpacing = this._fretboardWidth / this._numFrets;
        this._stringSpacing = this._fretboardHeight / (this._numStrings + 1); // rough estimate
    }

    protected applyTransforms(): void {
        const centerX = this._dimensions.width / 2;
        const centerY = this._dimensions.height / 2;
        this._ctx.translate(centerX, centerY);
        if (this._mirror) this._ctx.scale(-1, 1);
        // Explicitly SKIP rotation for horizontal layout logic in FullChord
        this._ctx.translate(-centerX, -centerY);

        // Match FullNeck offset
        const headstockOffset = 30 * this._scaleFactor;
        this._ctx.translate(headstockOffset, 0);
    }

    public override transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        const capoOffset = this._globalCapo || 0;

        let finalChord = { ...chord };

        // For Cinematic (Full) mode, Capo shifts the shape forward
        if (capoOffset > 0) {
            finalChord = {
                ...chord,
                fingers: chord.fingers.map(f => ({
                    ...f,
                    fret: f.fret > 0 ? f.fret + capoOffset : 0
                }))
            };
        }

        return { finalChord, transportDisplay };
    }

    public drawFretboard(): void {
        this.fretboardDrawer.drawFretboard();
    }

    public getFingerPosition(fret: number, string: number): { x: number, y: number } {
        const fd = this.fretboardDrawer as FullNeckDrawer;

        // X is fret based
        const x = fd.fretboardX + (fret - 0.5) * fd.fretWidth;

        // Y is string based (Mi Grave / string 6 at top = index 0)
        const visualIdx = this._numStrings - string;
        const y = fd.boardY + fd.stringMargin + visualIdx * fd.stringSpacing;

        return { x, y };
    }

    public getBarreRect(fret: number, startString: number, endString: number): { x: number, y: number, width: number, height: number, radius: number } {
        const p1 = this.getFingerPosition(fret, startString);
        const p2 = this.getFingerPosition(fret, endString);

        const topY = Math.min(p1.y, p2.y) - this.fingerRadius;
        const bottomY = Math.max(p1.y, p2.y) + this.fingerRadius;

        const height = bottomY - topY;
        const width = this.barreWidth;
        const centerX = p1.x;
        const centerY = topY + height / 2;

        return { x: centerX, y: centerY, width, height, radius: this.neckRadius };
    }

    private _drawShapeAndFingerNumber(
        centerX: number,
        centerY: number,
        finger: number | string,
        isBarre: boolean,
        barreVisualHeight: number
    ): void {
        this._ctx.save();

        // Shadow for depth
        this.applyShadow(this._colors.fingers.shadow);

        // Finger color - Standard Premium Dark/White
        this._ctx.fillStyle = this.hexToRgba(this._colors.fingers.color || "#1a1a1a", this._colors.fingers.opacity ?? 1);

        this._ctx.beginPath();
        if (isBarre) {
            this._safeRoundRect(centerX - (this.barreWidth / 2), centerY - barreVisualHeight / 2, this.barreWidth, barreVisualHeight, this.neckRadius);
        } else {
            this._ctx.arc(centerX, centerY, this.fingerRadius, 0, Math.PI * 2);
        }
        this._ctx.fill();
        this.applyShadow(undefined);

        // Border
        this._ctx.strokeStyle = this._colors.fingers.border?.color || "#ffffff";
        this._ctx.lineWidth = (this._colors.fingers.border?.width || 2.5) * this._scaleFactor;
        this._ctx.stroke();

        // Finger Number (Text)
        if (finger !== undefined && finger !== null && finger !== -2) {
            this._ctx.fillStyle = this._colors.fingers.textColor || "#ffffff";
            const fontSize = 30 * this._scaleFactor;
            this._ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";
            const displayText = (finger === 0 || finger === -1 || finger === 'T') ? 'T' : String(finger);

            this._ctx.save();
            this._ctx.translate(centerX, centerY);
            // Counter-mirror text to keep it from being backwards
            if (this._mirror) this._ctx.scale(-1, 1);
            // We SKIP counter-rotation here because FullChord explicitly skips view rotation in applyTransforms
            // if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);

            // Optical correction for baseline centering
            const opticalCorrection = fontSize * 0.06;
            this._ctx.fillText(displayText, 0, opticalCorrection);
            this._ctx.restore();
        }
        this._ctx.restore();
    }

    public drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
        const { finalChord } = this.transposeForDisplay(inputChord, inputTransportDisplay);
        this._applyChordSettings(finalChord);

        this._ctx.save();

        if (!options.skipFretboard) {
            this.fretboardDrawer.setConditionalFlags(true, true);
            this.fretboardDrawer.setCapo(this._globalCapo > 0, this._globalCapo);
            const defaultNames = ["E", "A", "D", "G", "B", "e"];
            const chordNames = (finalChord.stringNames && finalChord.stringNames.length > 0)
                ? finalChord.stringNames
                : defaultNames;
            this.fretboardDrawer.setStringNames(chordNames);
            this.fretboardDrawer.drawFretboard();
        }

        // Apply global logic transforms for fingers
        this.applyTransforms();

        this._drawFingersInternal(finalChord);
        this._drawAvoidedStrings(finalChord.avoid);

        this._ctx.restore();
    }

    protected _drawFingersInternal(chord: ChordDiagramProps, opacity: number = 1): void {
        chord.fingers.forEach(f => {
            if (f.fret <= 0) return;
            // Map f.string (1=e, 6=E) to visual index where E is at top (index 0)
            const fromIdx = this._numStrings - f.string;
            const toIdx = this._numStrings - (f.endString ?? f.string);
            this.drawFretPosition(f.fret, f.finger ?? 1, fromIdx, toIdx);
        });
    }

    private _drawAvoidedStrings(avoid: number[] | undefined): void {
        if (!avoid) return;

        const fd = this.fretboardDrawer as FullNeckDrawer;
        const context: AvoidedStringsContext = {
            ctx: this._ctx,
            // FullNeck uses horizontal logic
            fretboardX: fd.fretboardX,
            fretboardY: fd.fretboardY,
            fretboardHeight: fd.fretboardHeight,
            horizontalPadding: 0, // not used in horizontal mode same way
            stringSpacing: fd.stringSpacing,
            realFretSpacing: fd.realFretSpacing,
            numStrings: this._numStrings,
            scaleFactor: this._scaleFactor,
            textColor: "#ffffff",
            mirror: this._mirror,
            rotation: 0 // Avoided strings in horizontal mode are usually static
        };

        // We override the DRAW logic for horizontal avoided strings manually here for better look
        this._ctx.save();
        this._ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
        this._ctx.font = `bold ${24 * this._scaleFactor}px "Inter", sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        avoid.forEach(stringNum => {
            // Map f.string (1=e, 6=E) to visual index where E is at top (index 0)
            const visualIdx = this._numStrings - stringNum;
            const x = fd.fretboardX - 25 * this._scaleFactor;
            const y = fd.boardY + fd.stringMargin + visualIdx * fd.stringSpacing;
            this._ctx.fillText("×", x, y);
        });
        this._ctx.restore();
    }

    /**
     * Draws the chord name in a PREMIUM vertical style as seen in the image.
     */
    public drawChordName(chordName: string, options?: { opacity?: number, extensions?: string[] }): void {
        if (!chordName) return;

        this._ctx.save();

        const fd = this.fretboardDrawer as FullNeckDrawer;
        // Position name above the fretboard, centered horizontally
        const nameX = fd.fretboardX + fd.fretboardWidth / 2;
        const nameY = fd.boardY - 70 * this._scaleFactor;

        this._ctx.translate(nameX, nameY);

        // NO ROTATION - Horizontal layout above the neck

        const extensions = options?.extensions || [];

        // Split name into Root+Type and Bass
        let baseName = chordName.replace(/#/g, "♯").replace(/b/g, "♭");
        let bass = "";
        const bassIdx = baseName.indexOf("/");
        if (bassIdx !== -1) {
            bass = baseName.substring(bassIdx);
            baseName = baseName.substring(0, bassIdx);
        }

        // Sizes
        const nameSize = 65 * this._scaleFactor;
        const extSize = 30 * this._scaleFactor;
        const bassSize = 65 * this._scaleFactor;

        this.applyShadow(this._colors.chordName.shadow);

        this._ctx.fillStyle = this._colors.chordName.color || "#ffffff";
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        // Calculate layout
        this._ctx.font = `900 ${nameSize}px "Inter", sans-serif`;
        const nameWidth = this._ctx.measureText(baseName).width;

        this._ctx.font = `bold ${extSize}px "Inter", sans-serif`;
        let maxExtWidth = 0;
        extensions.forEach(ext => {
            const w = this._ctx.measureText(ext).width;
            if (w > maxExtWidth) maxExtWidth = w;
        });

        this._ctx.font = `900 ${bassSize}px "Inter", sans-serif`;
        const bassWidth = bass ? this._ctx.measureText(bass).width : 0;

        const totalWidth = nameWidth + (extensions.length > 0 ? maxExtWidth + 10 : 0) + bassWidth;
        let currentX = -totalWidth / 2;

        // 1. Draw Root + Quality
        this._ctx.font = `900 ${nameSize}px "Inter", sans-serif`;
        this._ctx.textAlign = "left";
        this._ctx.fillText(baseName, currentX, 0);
        currentX += nameWidth + 5 * this._scaleFactor;

        // 2. Draw Stacked Extensions
        if (extensions.length > 0) {
            this._ctx.font = `bold ${extSize}px "Inter", sans-serif`;
            const lineHeight = extSize * 0.9;
            const stackHeight = (extensions.length - 1) * lineHeight;
            let startY = -stackHeight / 2;

            extensions.forEach((ext, i) => {
                this._ctx.fillText(ext, currentX, startY + i * lineHeight);
            });
            currentX += maxExtWidth + 5 * this._scaleFactor;
        }

        // 3. Draw Bass
        if (bass) {
            this._ctx.font = `900 ${bassSize}px "Inter", sans-serif`;
            this._ctx.fillText(bass, currentX, 0);
        }

        this.applyShadow(undefined);
        this._ctx.restore();
    }

    public drawFretPosition(fret: number, finger: number | string, fromStringIndex: number, toStringIndex: number): void {
        const fd = this.fretboardDrawer as FullNeckDrawer;
        const fretX = fd.paddingX + (fret - 0.5) * fd.fretWidth;
        const isBarre = fromStringIndex !== toStringIndex;

        let centerY: number;
        let barreVisualHeight: number = 0;

        if (isBarre) {
            const topIdx = Math.min(fromStringIndex, toStringIndex);
            const bottomIdx = Math.max(fromStringIndex, toStringIndex);
            let fromY = fd.boardY + fd.stringMargin + topIdx * fd.stringSpacing;
            let toY = fd.boardY + fd.stringMargin + bottomIdx * fd.stringSpacing;

            fromY -= this.fingerRadius;
            toY += this.fingerRadius;

            barreVisualHeight = toY - fromY;
            centerY = fromY + barreVisualHeight / 2;
        } else {
            centerY = fd.boardY + fd.stringMargin + fromStringIndex * fd.stringSpacing;
        }

        this._drawShapeAndFingerNumber(fretX, centerY, finger, isBarre, barreVisualHeight);
    }

    private _applyChordSettings(chord: ChordDiagramProps): void {
        const chordNumStrings = chord.stringNames?.length ?? 6;
        if (chordNumStrings !== this._numStrings) {
            this.setNumStrings(chordNumStrings);
            this.fretboardDrawer.setNumStrings(this._numStrings);
            this._fretboardCache = null;
        }
    }

    // Stubs for transition methods
    public drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX: number = 0): void {
        this.drawChord(chord, transportDisplay, offsetX);
    }

    public drawChordWithTransition(currentFinalChord: ChordDiagramProps, currentTransportDisplay: number, nextFinalChord: ChordDiagramProps, nextTransportDisplay: number, originalProgress: number, offsetX: number = 0, options: { skipFretboard?: boolean } = {}): void {
        const prog = easeInOutQuad(originalProgress);
        if (prog < 0.5) {
            this.drawChord(currentFinalChord, currentTransportDisplay, offsetX, options);
        } else {
            this.drawChord(nextFinalChord, nextTransportDisplay, offsetX, options);
        }
    }

    public drawFingers(chord: ChordDiagramProps): void {
        this._drawFingersInternal(chord);
    }

    public drawTransposeIndicator(text: string | number, alignFret: number = 1): void {
        // No-op for full neck view
    }

    public drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void {
        // No-op for full neck view
    }
}

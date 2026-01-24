import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps } from "@/modules/core/domain/types";

export class FullNeckDrawer extends BaseDrawer implements FretboardDrawer {
    /**
     * Validates if a chord + capo configuration exceeds the 24-fret limit.
     * Used by the UI to prevent increments that would push notes off the board.
     */
    public static validateFretLimit(chord: ChordDiagramProps, capo: number): boolean {
        if (capo > 24) return false;

        const frets = chord.fingers
            .filter(f => f.fret > 0)
            .map(f => f.fret + capo);

        const maxFret = frets.length > 0 ? Math.max(...frets) : capo;
        return maxFret <= 24;
    }

    // Properties specific to horizontal layout
    protected _paddingX: number = 90;
    protected _boardY: number = 0;
    protected _stringMargin: number = 0;
    protected _fretWidth: number = 0;

    // Properties from interface kept for compatibility but usage changes
    protected _neckRadius: number = 0;
    protected _stringNamesY: number = 0;
    protected _showNut: boolean = true;
    protected _showHeadBackground: boolean = true; // Still used for headstock shape
    public override isHorizontal: boolean = true;

    // Capo properties
    protected _showCapo: boolean = false;
    protected _capoFret: number = 0;
    protected _hideCapoTitle: boolean = false;

    // Interface properties
    protected _headstockGap: number = 10;

    // Additional properties from GuitarFretboardDrawer logic
    protected _tuningShift: number = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        diagramSettings: {
            diagramWidth: number;
            diagramHeight: number;
            diagramX: number;
            diagramY: number;
            numStrings: number;
            numFrets: number;
            horizontalPadding: number;
            stringSpacing: number;
            fretboardX: number;
            fretboardY: number;
            fretboardWidth: number;
            fretboardHeight: number;
            realFretSpacing: number;
            neckRadius: number;
            stringNamesY: number;
        },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);

        // Initial setup from arguments, but we will recalculate in updateGeometry/calculateDimensions
        this._numStrings = diagramSettings.numStrings;
        this._numFrets = diagramSettings.numFrets >= 12 ? diagramSettings.numFrets : 12; // Enforce min 12 for full neck?
        this.calculateDimensions();
    }

    public calculateDimensions(): void {
        this.updateGeometry(
            this._dimensions.width,
            this._dimensions.height,
            this._numStrings,
            this._numFrets,
            this._scaleFactor
        );
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public updateGeometry(
        width: number,
        height: number,
        numStrings: number,
        numFrets: number,
        scaleFactor: number
    ): void {
        this._scaleFactor = scaleFactor;
        this._numStrings = numStrings;
        this._numFrets = numFrets;

        this._paddingX = 120 * scaleFactor;
        const availableWidth = width - (this._paddingX * 2);

        // Frets along X
        this._fretWidth = availableWidth / numFrets;
        this._realFretSpacing = this._fretWidth; // Map to interface property
        this._fretboardX = this._paddingX;

        // Height Strategy: Constant Finger Size (from GuitarFretboardDrawer)
        const referenceNumStrings = 6;
        const referenceMaxHeight = 340 * scaleFactor;
        const stringSpanRatio = 0.75;

        const referenceStringSpan = referenceMaxHeight * stringSpanRatio;
        const referenceGaps = referenceNumStrings - 1;
        const constantStringSpacing = referenceStringSpan / referenceGaps;

        this._stringSpacing = constantStringSpacing; // Map to interface property

        const actualGaps = Math.max(1, numStrings - 1);
        const actualStringSpan = constantStringSpacing * actualGaps;

        const requiredHeight = actualStringSpan / stringSpanRatio;
        this._fretboardHeight = requiredHeight;
        this._fretboardWidth = availableWidth; // Visual width of the wood

        const totalMargin = this._fretboardHeight - actualStringSpan;
        this._stringMargin = totalMargin / 2;

        // Center vertically in canvas
        this._boardY = (height - this._fretboardHeight) / 2;
        this._fretboardY = this._boardY; // Map to interface property
        this._fretboardX = this._paddingX; // Map to interface property

        this._neckRadius = 16 * scaleFactor; // Slightly less rounded for a premium look
    }

    // Setters
    public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
        this._showNut = showNut;
        this._showHeadBackground = showHeadBackground;
    }
    public setHeadstockGap(gap: number): void { this._headstockGap = gap; }
    public setCapo(show: boolean, fret: number = 0): void {
        this._showCapo = show;
        this._capoFret = fret;
    }
    public setHideCapoTitle(hide: boolean): void { this._hideCapoTitle = hide; }
    public setStringNames(arg1: number | string[] | undefined, arg2?: string[]): void {
        if (Array.isArray(arg1)) this._stringNames = arg1;
        else if (arg2) this._stringNames = arg2;
    }

    public get paddingX(): number { return this._paddingX; }
    public get boardY(): number { return this._boardY; }
    public get stringMargin(): number { return this._stringMargin; }
    public get fretWidth(): number { return this._fretWidth; }
    // Stub setters for compatibility if needed, though updateGeometry handles most
    public setDiagramX(x: number) { this._diagramX = x; } // Unused in horizontal logic mostly
    public setDiagramY(y: number) { this._diagramY = y; }
    public setFretboardWidth(w: number) { this._fretboardWidth = w; }
    public setFretboardHeight(h: number) { this._fretboardHeight = h; }
    public setFretSpacing(s: number) { this._realFretSpacing = s; }
    public setHorizontalPadding(p: number) { this._horizontalPadding = p; }
    public setStringSpacing(s: number) { this._stringSpacing = s; }
    public setNumStrings(n: number) {
        this._numStrings = n;
        this.calculateDimensions(); // Re-calc if changed
    }
    public setRotation(rotation: number): void {
        this._rotation = rotation;
    }

    // Override applyTransforms to ignore rotation for the body/geometry
    protected applyTransforms(): void {
        const centerX = this._dimensions.width / 2;
        const centerY = this._dimensions.height / 2;
        this._ctx.translate(centerX, centerY);
        if (this._mirror) this._ctx.scale(-1, 1);
        // Explicitly SKIP rotation: if (this._rotation) ...
        this._ctx.translate(-centerX, -centerY);

        // Center the Visual Assembly (Headstock + Neck) matching FullChord logic
        const headstockOffset = 30 * this._scaleFactor;
        this._ctx.translate(headstockOffset, 0);
    }

    public drawFretboard(): void {
        this.drawNeck();
        this.drawHeadstock();
        this.drawFrets();
        this.drawStrings();
        this.drawInlays();
        this.drawStringNames();
        // Capo if needed
        if (this._showCapo) this.drawCapo();
    }

    public drawNeck(progress: number = 1): void {
        this._ctx.save();
        this.applyTransforms();

        // Apply Shadow for Neck
        this.applyShadow(this._colors.fretboard.neck.shadow);

        // 1. Draw Fretboard Background - Dark Charcoal like in the image
        this._ctx.fillStyle = this._colors.fretboard.neck.color || "#1a1a1c";
        this._ctx.fillRect(this._fretboardX, this._boardY, this._fretboardWidth, this._fretboardHeight);

        this._ctx.restore();
    }

    public drawHeadstock(): void {
        const ctx = this._ctx;
        ctx.save();
        this.applyTransforms();

        const headstockWidth = 45 * this._scaleFactor;
        const headstockGap = 2 * this._scaleFactor; // Minimal gap to look like a nut
        const headstockX = this._paddingX - headstockWidth - headstockGap;
        const headstockHeight = this._fretboardHeight;
        const headstockY = this._boardY;
        const radius = 10 * this._scaleFactor;

        // Apply Shadow for Headstock
        this.applyShadow(this._colors.head?.shadow);

        // Nut/Headstock background
        ctx.fillStyle = this._colors.head?.color || "#1e1e22";
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(headstockX, headstockY, headstockWidth, headstockHeight, [radius, 0, 0, radius]);
        } else {
            ctx.rect(headstockX, headstockY, headstockWidth, headstockHeight);
        }
        ctx.fill();

        // Optional border for headstock
        if (this._colors.head?.border?.width && this._colors.head.border.width > 0) {
            ctx.lineWidth = this._colors.head.border.width * this._scaleFactor;
            ctx.strokeStyle = this._colors.head.border.color || 'transparent';
            ctx.stroke();
        }

        ctx.restore();
    }

    public drawFrets(progress: number = 1): void {
        this._ctx.save();
        this.applyTransforms();

        // Apply Shadow for Frets
        this.applyShadow(this._colors.fretboard.frets.shadow);

        // Standard frets
        this._ctx.strokeStyle = this._colors.fretboard.frets.color || "rgba(255, 255, 255, 0.12)";
        this._ctx.lineWidth = 1.5 * this._scaleFactor;
        this._ctx.beginPath();

        for (let i = 1; i <= this._numFrets; i++) {
            const x = this._paddingX + i * this._fretWidth;
            this._ctx.moveTo(x, this._boardY);
            this._ctx.lineTo(x, this._boardY + this._fretboardHeight);
        }
        this._ctx.stroke();

        // The Nut (Zero Fret) - Thicker and more prominent
        if (this._showNut) {
            this._ctx.strokeStyle = this._colors.fretboard.frets.color || "rgba(255, 255, 255, 0.4)";
            this._ctx.lineWidth = 4 * this._scaleFactor;
            this._ctx.beginPath();
            this._ctx.moveTo(this._paddingX, this._boardY);
            this._ctx.lineTo(this._paddingX, this._boardY + this._fretboardHeight);
            this._ctx.stroke();
        }

        this._ctx.restore();
    }

    public drawStrings(progress: number = 1): void {
        this._ctx.save();
        this.applyTransforms();

        // Apply Shadow for Strings
        this.applyShadow(this._colors.fretboard.strings.shadow);

        for (let i = 0; i < this._numStrings; i++) {
            const y = this._boardY + this._stringMargin + (i * this._stringSpacing);
            // Thick to thin string effect
            const thickness = (1.2 + ((this._numStrings - 1 - i) * 0.4)) * this._scaleFactor;

            this._ctx.beginPath();
            this._ctx.lineWidth = thickness;
            this._ctx.strokeStyle = this._colors.fretboard.strings.color || "rgba(255, 255, 255, 0.85)";
            this._ctx.moveTo(this._paddingX, y);
            this._ctx.lineTo(this._paddingX + this._fretboardWidth, y);
            this._ctx.stroke();
        }

        this._ctx.restore();
    }

    public drawInlays(): void {
        const inlayFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        this._ctx.save();
        this.applyTransforms();

        // Apply Shadow for Inlays
        this.applyShadow(this._colors.fretboard.board?.inlays?.shadow);

        // Discrete dots for inlays
        this._ctx.fillStyle = this._colors.fretboard.board?.inlays?.color || "rgba(0, 0, 0, 0.35)";

        inlayFrets.forEach(fret => {
            if (fret > this._numFrets) return;
            const x = this._paddingX + (fret - 0.5) * this._fretWidth;
            const centerY = this._boardY + this._fretboardHeight / 2;
            const radius = 12 * this._scaleFactor;

            if (fret === 12 || fret === 24) {
                // Double dots
                const offset = this._stringSpacing * 1.0;
                this._ctx.beginPath();
                this._ctx.arc(x, centerY - offset, radius, 0, Math.PI * 2);
                this._ctx.fill();
                this._ctx.beginPath();
                this._ctx.arc(x, centerY + offset, radius, 0, Math.PI * 2);
                this._ctx.fill();
            } else {
                // Single dot
                this._ctx.beginPath();
                this._ctx.arc(x, centerY, radius, 0, Math.PI * 2);
                this._ctx.fill();
            }
        });

        this._ctx.restore();
    }

    public drawStringNames(progress?: number): void {
        this._ctx.save();
        this.applyTransforms();

        this.applyShadow(undefined);

        const headstockWidth = 45 * this._scaleFactor;
        const headstockX = this._paddingX - headstockWidth - (2 * this._scaleFactor);
        const centerX = headstockX + (headstockWidth / 2);

        this._ctx.fillStyle = this._colors.head?.textColors?.name || "#ff9800";
        this._ctx.font = `bold ${18 * this._scaleFactor}px "Inter", sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        for (let i = 0; i < this._numStrings; i++) {
            const name = this._stringNames[i] || "";
            const y = this._boardY + this._stringMargin + (i * this._stringSpacing);

            this._ctx.save();
            this._ctx.translate(centerX, y);

            // Counter-mirror text to keep it from being backwards
            if (this._mirror) this._ctx.scale(-1, 1);

            // Text should remain upright; since FullNeckDrawer skips rotation, 
            // we don't need to counter-rotate here.

            this._ctx.fillText(name, 0, 0);
            this._ctx.restore();
        }

        this._ctx.restore();
    }

    public drawCapo(): void {
        if (!this._showCapo && this._capoFret === 0) return;

        const fret = this._capoFret;
        if (fret <= 0 || fret > this._numFrets) return;

        this._ctx.save();
        this.applyTransforms();

        const x = this._paddingX + (fret - 0.5) * this._fretWidth;
        const overhang = this._stringSpacing * 0.4;
        const rectY = this._boardY - overhang;
        const rectHeight = this._fretboardHeight + (overhang * 2);

        const width = this._fretWidth * 0.55;
        const rectX = x - (width / 2);

        // Apply Shadow for Capo Body
        this.applyShadow(this._colors.capo?.shadow);

        // Draw Capo Body
        this._ctx.fillStyle = this._colors.capo?.color || "#2D2D2D";
        this._ctx.beginPath();
        if (typeof this._ctx.roundRect === 'function') {
            this._ctx.roundRect(rectX, rectY, width, rectHeight, 8 * this._scaleFactor);
        } else {
            this._ctx.rect(rectX, rectY, width, rectHeight);
        }
        this._ctx.fill();

        this._ctx.strokeStyle = this._colors.capo?.border?.color || "#4A4A4A";
        this._ctx.lineWidth = 2 * this._scaleFactor;
        this._ctx.stroke();

        // RESET SHADOW for Text
        this.applyShadow(undefined);

        // Text
        this._ctx.fillStyle = this._colors.capo?.textColors?.name || "#FFFFFF";
        this._ctx.font = `900 ${width * 0.5}px "Inter", sans-serif`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        const segmentHeight = rectHeight / 4;
        const letters = ["C", "A", "P", "O"];
        letters.forEach((char, i) => {
            const resultY = rectY + (i * segmentHeight) + (segmentHeight / 2);
            if (i > 0) {
                this._ctx.beginPath();
                const lineY = rectY + (i * segmentHeight);
                this._ctx.moveTo(rectX, lineY);
                this._ctx.lineTo(rectX + width, lineY);
                this._ctx.strokeStyle = "rgba(255,255,255,0.15)";
                this._ctx.lineWidth = 2 * this._scaleFactor;
                this._ctx.stroke();
            }
            this._ctx.fillText(char, x, resultY);
        });

        this._ctx.restore();
    }

    // Stub for animated - standard behavior
    public drawAnimatedFretboard(phases: any) {
        if (phases.neckProgress > 0) this.drawNeck(phases.neckProgress);
    }

    // Helpers
    public drawNeckProgressive(p: number) { this.drawNeck(p); }
    public drawStringsProgressive(p: number) { this.drawStrings(p); }
    public drawFretsProgressive(p: number) { this.drawFrets(p); }
    public drawNut() { /* Included in frets or skipped */ }

    protected _drawNeckBody(p: number) { /* unused */ }
}

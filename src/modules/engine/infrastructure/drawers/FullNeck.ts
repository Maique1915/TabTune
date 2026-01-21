import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme } from "@/modules/core/domain/types";

export class FullNeckDrawer extends BaseDrawer implements FretboardDrawer {
    // Specialized settings for full neck
    protected _showNut: boolean = true;
    protected _showHeadBackground: boolean = true;
    protected _headstockGap: number = 0;
    protected _showCapo: boolean = false;
    protected _capoFret: number = 0;
    protected _hideCapoTitle: boolean = false;

    // Properties inherited conceptually from old FretboardDrawer
    protected _neckRadius: number = 0;
    protected _stringNamesY: number = 0;

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

        this._diagramWidth = diagramSettings.diagramWidth;
        this._diagramHeight = diagramSettings.diagramHeight;
        this._diagramX = diagramSettings.diagramX;
        this._diagramY = diagramSettings.diagramY;
        this._numStrings = diagramSettings.numStrings;
        this._numFrets = diagramSettings.numFrets;
        this._horizontalPadding = diagramSettings.horizontalPadding;
        this._stringSpacing = diagramSettings.stringSpacing;
        this._fretboardX = diagramSettings.fretboardX;
        this._fretboardY = diagramSettings.fretboardY;
        this._fretboardWidth = diagramSettings.fretboardWidth;
        this._fretboardHeight = diagramSettings.fretboardHeight;
        this._realFretSpacing = diagramSettings.realFretSpacing;
        this._neckRadius = diagramSettings.neckRadius;
        this._stringNamesY = diagramSettings.stringNamesY;
    }

    public calculateDimensions(): void {
        this.updateGeometry(
            this._diagramWidth,
            this._diagramHeight,
            this._numStrings,
            this._numFrets,
            this._scaleFactor
        );
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    // Interface Methods Implementation

    public updateGeometry(
        width: number,
        height: number,
        numStrings: number,
        numFrets: number,
        scaleFactor: number
    ): void {
        this._scaleFactor = scaleFactor;
        this._diagramWidth = width;
        this._diagramHeight = height;
        this._fretboardWidth = width;
        this._fretboardHeight = height;
        this._fretboardX = 0;
        this._fretboardY = 0;
        this._stringSpacing = this._fretboardWidth / (numStrings - 1);
        this._realFretSpacing = this._fretboardHeight / numFrets;

        // Helpers for specific elements based on reference offsets
        this._neckRadius = 24 * scaleFactor;

        // String names Y position for FullNeck might need adjustment? 
        // Original code had this logic in Base abstract class:
        this._stringNamesY = this._fretboardY - (40 * scaleFactor);
    }

    public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
        this._showNut = showNut;
        this._showHeadBackground = showHeadBackground;
    }

    public setHeadstockGap(gap: number): void {
        this._headstockGap = gap;
    }

    public setCapo(show: boolean, fret: number = 0): void {
        this._showCapo = show;
        this._capoFret = fret;
    }

    public setHideCapoTitle(hide: boolean): void {
        this._hideCapoTitle = hide;
    }

    public setStringNames(arg1: number | string[] | undefined, arg2?: string[]): void {
        if (Array.isArray(arg1)) {
            this._stringNames = arg1;
        } else if (arg2) {
            this._stringNames = arg2;
        }
    }

    // Setters
    public setDiagramX(diagramX: number): void {
        this._diagramX = diagramX;
        this._fretboardX = diagramX;
    }

    public setDiagramY(diagramY: number): void {
        this._diagramY = diagramY;
        this._fretboardY = this._diagramY + (0 * this._scaleFactor); // FullNeck typically 0 header height offset from Base?
        // Original FretboardDrawer Base had getHeaderHeight() returning 0. So 0.
        this._stringNamesY = this._diagramY + (40 * this._scaleFactor);
    }

    public setFretboardWidth(width: number): void {
        this._fretboardWidth = width;
        this._diagramWidth = width;
    }

    public setFretboardHeight(height: number): void {
        this._fretboardHeight = height;
        this._diagramHeight = height + (0 * this._scaleFactor); // Footer 0 in Base
    }

    public setFretSpacing(spacing: number): void {
        this._realFretSpacing = spacing;
    }

    public setHorizontalPadding(padding: number): void {
        this._horizontalPadding = Math.max(padding, 100);
    }

    public setStringSpacing(spacing: number): void {
        this._stringSpacing = spacing;
    }

    public setNumStrings(num: number): void {
        this._numStrings = num;
    }

    // Drawing

    public drawFretboard(): void {
        this.drawNeck();
        this.drawStringNames(1);
        this.drawFrets();
        this.drawStrings();
    }

    public drawNeck(progress: number = 1): void {
        this._ctx.save();

        if (progress < 1) {
            this._ctx.globalAlpha = progress;
        }

        const easedProgress = this.easeInOutQuad(progress);
        this._ctx.save();
        this.applyTransforms();
        this._drawNeckBody(easedProgress);
        this._ctx.restore();

        this._ctx.save();
        this.applyTransforms();
        if (this._showCapo || this._capoFret > 0) {
            this.drawCapo();
        } else if (this._showNut) {
            this.drawNut();
        }
        this._ctx.restore();

        this._ctx.restore();
    }

    protected _drawNeckBody(easedProgress: number): void {
        this._ctx.fillStyle = this._colors.fretboard.neck.color;

        // Generic neck body
        this._safeRoundRect(
            this._fretboardX,
            this._fretboardY,
            this._fretboardWidth,
            this._fretboardHeight * easedProgress,
            this._neckRadius,
            true,
            false
        );
    }

    public drawNut(): void {
        const nutHeight = 15 * this._scaleFactor;
        const nutY = this._fretboardY - nutHeight;
        const nutX = this._diagramX;
        const nutWidth = this._diagramWidth;

        this._ctx.save();
        this._ctx.fillStyle = this._colors.fretboard.frets.color || "#FFFFFF";
        this._ctx.fillRect(nutX, nutY, nutWidth, nutHeight);

        this._ctx.strokeStyle = "rgba(0,0,0,0.3)";
        this._ctx.lineWidth = 1 * this._scaleFactor;
        this._ctx.beginPath();
        this._ctx.moveTo(nutX, nutY + nutHeight);
        this._ctx.lineTo(nutX + nutWidth, nutY + nutHeight);
        this._ctx.stroke();
        this._ctx.restore();
    }

    public drawCapo(): void {
        if (!this._showCapo && this._capoFret === 0) return;

        this._ctx.save();

        const extension = 25 * this._scaleFactor;
        const capoWidth = this._fretboardWidth + (extension * 2);
        const capoX = this._diagramX + (this._diagramWidth - capoWidth) / 2;

        let capoY = this._stringNamesY - (this._headstockGap / 2);
        let capoHeight = 40 * this._scaleFactor;
        let cornerRadius = 12 * this._scaleFactor;

        this._ctx.shadowColor = "rgba(0,0,0,0.4)";
        this._ctx.shadowBlur = 10;
        this._ctx.shadowOffsetY = 3;

        this._ctx.fillStyle = this._colors.capo.color;
        this._safeRoundRect(capoX, capoY - capoHeight / 2, capoWidth, capoHeight, cornerRadius);

        this._ctx.shadowBlur = 0;
        this._ctx.shadowOffsetY = 0;
        this._ctx.strokeStyle = "rgba(0,0,0,0.5)";
        this._ctx.lineWidth = 2 * this._scaleFactor;
        this._ctx.stroke();

        if (!this._hideCapoTitle || this._capoFret >= 1) {
            const color = this._colors.capo.textColors?.name || "#FFFFFF";
            const font = `bold ${24 * this._scaleFactor}px sans-serif`;
            const text = this._capoFret >= 1 ? `${this._capoFret}` : "CAPO";
            this._drawText(text, capoX + (capoWidth / 2), capoY, font, color);
        }

        this._ctx.restore();
    }

    public drawStrings(progress: number = 1): void {
        if (this._colors.fretboard.strings.thickness <= 0) return;

        this._ctx.save();
        this.applyTransforms();

        const easedProgress = this.easeInOutQuad(progress);
        const currentHeight = this._fretboardHeight * easedProgress;

        const thickness = this._colors.fretboard.strings.thickness;
        const color = this._colors.fretboard.strings.color;

        for (let i = 0; i < this._numStrings; i++) {
            const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
            this._drawLine(x, this._fretboardY, x, this._fretboardY + currentHeight, color, thickness);
        }
        this._ctx.restore();
    }

    public drawFrets(progress: number = 1): void {
        const easedProgress = this.easeInOutQuad(progress);
        const numFretsTotal = this._numFrets + 1;
        const fretsToDrawIndex = Math.floor(easedProgress * numFretsTotal);
        const baseColor = this._colors.fretboard.frets.color;

        this._ctx.save();
        this.applyTransforms();

        for (let i = 0; i <= this._numFrets; i++) {
            if (progress < 1 && i > fretsToDrawIndex) break;

            const y = this._fretboardY + i * this._realFretSpacing;
            let width = this._colors.fingers.border?.width || 3;

            if (i === 0 && this._showNut) {
                width = width * 4;
            }

            let alpha = 1;
            let yOffset = 0;
            if (progress < 1 && i === fretsToDrawIndex) {
                const partial = (easedProgress * numFretsTotal) - fretsToDrawIndex;
                alpha = partial;
                yOffset = (1 - partial) * (-5 * this._scaleFactor);
            }

            this._ctx.save();
            this._ctx.globalAlpha = alpha;
            this._drawLine(this._fretboardX, y + yOffset, this._fretboardX + this._fretboardWidth, y + yOffset, baseColor, width);
            this._ctx.restore();
        }
        this._ctx.restore();
    }

    public drawStringNames(progress: number = 1, customNames?: string[]): void {
        const easedProgress = this.easeInOutQuad(progress);
        const namesToDraw = customNames || this._stringNames;

        this._ctx.save();
        this.applyTransforms();
        const translateY = (1 - easedProgress) * (-10 * this._scaleFactor);
        const color = this._colors.global.primaryTextColor;
        const fontSize = 40 * this._scaleFactor;
        const font = `bold ${fontSize}px sans-serif`;

        namesToDraw.forEach((name, i) => {
            if (i >= this._numStrings) return;

            const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
            // Full implementation uses _headstockGap
            const y = this._stringNamesY + translateY - this._headstockGap;

            this._drawText(name, x, y, font, color);
        });

        this._ctx.restore();
    }

    // Progressive Wrappers
    public drawNeckProgressive(progress: number): void {
        this.drawNeck(progress);
    }

    public drawStringsProgressive(progress: number): void {
        this.drawStrings(progress);
    }

    public drawFretsProgressive(progress: number): void {
        this.drawFrets(progress);
    }

    public drawAnimatedFretboard(phases: {
        neckProgress: number;
        stringNamesProgress: number;
        stringsProgress: number;
        fretsProgress: number;
        nutProgress: number;
    }): void {
        if (phases.neckProgress > 0) {
            this.drawNeckProgressive(phases.neckProgress);
        }
        if (phases.stringNamesProgress > 0) {
            this.drawStringNames(phases.stringNamesProgress);
        }
        if (phases.fretsProgress > 0) {
            this.drawFretsProgressive(phases.fretsProgress);
        }
        if (phases.stringsProgress > 0) {
            this.drawStringsProgressive(phases.stringsProgress);
        }
    }

    // Internal Helpers duplicate if needed
    protected _drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
        this._ctx.save();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = width;
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.stroke();
        this._ctx.restore();
    }

    protected _drawText(
        text: string,
        x: number,
        y: number,
        font: string,
        color: string,
        align: CanvasTextAlign = "center",
        baseline: CanvasTextBaseline = "middle",
        shadow: boolean = false
    ): void {
        this._ctx.save();
        this._ctx.fillStyle = color;
        this._ctx.font = font;
        this._ctx.textAlign = align;
        this._ctx.textBaseline = baseline;

        if (shadow) {
            this._ctx.shadowColor = "rgba(0,0,0,0.5)";
            this._ctx.shadowBlur = 4;
            this._ctx.shadowOffsetY = 1;
        }

        // Apply global transform (center pivot) then additional if needed?
        // BaseDrawer applyTransforms handled global.
        // FretboardDrawer's _drawText did _applyTransform(x,y).
        // Here we just use what we have available.
        // Since we are inside applyTransforms() scope when calling helpers usually, we should be careful.
        // But drawStringNames calls applyTransforms() THEN loops and calls drawText.
        // So global transform is active.
        // However, FretboardDrawer's _drawText RE-applied transform? No, it used _applyTransform which was distinct.
        // Let's implement local text transform logic here to match behavior.

        this._ctx.save();
        this._ctx.translate(x, y);
        if (this._mirror) this._ctx.scale(-1, 1);
        if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
        this._ctx.fillText(text, 0, 0);
        this._ctx.restore();

        this._ctx.restore();
    }
}

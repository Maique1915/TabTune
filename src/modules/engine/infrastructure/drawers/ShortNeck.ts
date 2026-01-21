import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme } from "@/modules/core/domain/types";
import { easeInOutQuad } from "../utils/animacao";

export class ShortNeckDrawer extends BaseDrawer implements FretboardDrawer {
    protected _neckRadius: number = 0;
    protected _stringNamesY: number = 0;
    protected _showHeadBackground: boolean = true;

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
        // Implementation kept for BaseDrawer interface compliance,
        // but dimensions are primarily injected via constructor in this context.
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
        this._showHeadBackground = showHeadBackground;
    }

    protected _headstockYOffset: number = 0;

    public setHeadstockGap(gap: number): void {
        this._headstockYOffset = gap;
    }

    protected _capoFret: number = 0;

    public setCapo(show: boolean, fret: number): void {
        this._capoFret = show ? fret : 0;
    }

    public setHideCapoTitle(hide: boolean): void {
        // No-op for ShortNeck
    }

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

        // Dont reset X/Y to 0 here, assume caller handles positioning via setDiagramX/Y
        // this._fretboardX = 0; 
        // this._fretboardY = 0; 

        // Recalculate internals relative to current position or generic?
        // Ideally updateGeometry should just scale sizes. 
        // We'll leave X/Y alone so settters can control them.

        // Recalculate internals relative to current position or generic?
        // Ideally updateGeometry should just scale sizes. 
        // We'll leave X/Y alone so settters can control them.

        const availableWidth = this._fretboardWidth - (this._horizontalPadding * 2);
        this._stringSpacing = availableWidth / (Math.max(1, numStrings - 1));
        this._realFretSpacing = this._fretboardHeight / numFrets;
        this._neckRadius = 35 * scaleFactor; // Studio Style
        // Header height adaptation
        // We need to ensure _stringNamesY and _fretboardY are mutually consistent if we were calculating them here.
        // But ChordDrawer sets them explicitly. 
        // Let's rely on setDiagramY to update _stringNamesY if needed.
    }

    // Stub methods to satisfy any remaining loose coupling or if ChordDrawer tries to call them
    // (Though we cleaned ChordDrawer, it's safer to have them if the interface expects them in spirit)
    public setCanvasDimensions(dimensions: { width: number; height: number }): void {
        this.setDimensions(dimensions);
    }

    // Properties setters
    public setDiagramX(diagramX: number): void {
        this._diagramX = diagramX;
        this._fretboardX = diagramX;
    }
    public setDiagramY(diagramY: number): void {
        this._diagramY = diagramY;
        this._fretboardY = this._diagramY + (75 * this._scaleFactor); // Hardcoded header height from original ShortNeck logic
        this._stringNamesY = this._diagramY + (40 * this._scaleFactor);
    }
    public setFretboardHeight(height: number): void {
        this._fretboardHeight = height;
        // Footer height is 140 scaleFactor in original ShortNeck
        this._diagramHeight = height + (140 * this._scaleFactor);
    }
    public setFretSpacing(spacing: number): void {
        this._realFretSpacing = spacing;
    }
    public setNumStrings(num: number): void {
        this._numStrings = num;
        // Recalculate horizontal spacing if needed, or rely on caller to set it.
        // BaseDrawer has setNumStrings but doesn't auto-recalc geometry without calculateDimensions impl.
    }
    public setStringSpacing(spacing: number): void {
        this._stringSpacing = spacing;
    }
    public setFretboardWidth(width: number): void {
        this._fretboardWidth = width;
        this._diagramWidth = width;
    }
    public setHorizontalPadding(padding: number): void {
        this._horizontalPadding = Math.max(padding, 100);
    }
    // Support flexible signature to match ChordDrawer calls [index, names] or [names]
    public setStringNames(arg1: number | string[] | undefined, arg2?: string[]): void {
        if (Array.isArray(arg1)) {
            this._stringNames = arg1;
        } else if (arg2) {
            this._stringNames = arg2;
        }
    }

    // Drawing Methods

    public drawFretboard(): void {
        this.drawNeck();
        this.drawStringNames(1);
        this.drawFrets();
        this.drawStrings();
        this.drawCapo();
        this.drawCapoFretNumber();
    }

    public drawNeck(progress: number = 1): void {
        const easedProgress = easeInOutQuad(progress);

        // 1. Desenha o fundo do braço (o retângulo cinza arredondado)
        this._ctx.save();
        this.applyTransforms();

        // Desenha a madeira (Neck)
        this._ctx.fillStyle = this._colors.fretboard.neck.color;
        this._safeRoundRect(
            this._fretboardX,
            this._fretboardY,
            this._fretboardWidth,
            this._fretboardHeight * easedProgress,
            [0, 0, this._neckRadius, this._neckRadius], // Arredonda só embaixo
            true
        );

        if (this._showHeadBackground) {
            // Se tiver capo, desloca a cabeça pra cima para indicar "quebra" no desenho ou só estética
            // const yOffset = this._capoFret > 0 ? (50 * this._scaleFactor) : 0;

            // Altura do headstock baseada na posição Y das stringsNames ou fixo?
            // No ShortChord/Neck original parecia ser algo fixo ou calculado.
            // Vamos usar a lógica do reference: headstockHeight = (this._fretboardY - this._stringNamesY) * 2;
            // Mas aqui temos _diagramY. Vamos manter compatível com o que estava mas aplicando o offset.

            const headstockHeight = (this._fretboardY - this._diagramY);

            // 2. Desenha o Header (faixa onde ficam as notas E A D G B E)
            this._ctx.fillStyle = "#3a3a3e"; // Um tom levemente mais claro

            const headStartY = this._diagramY + this._headstockYOffset;

            this._safeRoundRect(
                this._fretboardX,
                headStartY,
                this._fretboardWidth,
                headstockHeight,
                [this._neckRadius, this._neckRadius, 0, 0], // Arredonda só em cima
                true
            );
        }

        this._ctx.restore();
    }

    public drawStringNames(progress: number = 1, customNames?: string[]): void {
        if (!this._showHeadBackground) return;

        const easedProgress = easeInOutQuad(progress);
        const namesToDraw = customNames || this._stringNames;

        this._ctx.save();
        this.applyTransforms();
        const translateY = (1 - easedProgress) * (-10 * this._scaleFactor);
        // const yOffset = this._capoFret > 0 ? (50 * this._scaleFactor) : 0;

        const color = this._colors.global.primaryTextColor;
        const fontSize = 40 * this._scaleFactor;
        const font = `bold ${fontSize}px sans-serif`;

        namesToDraw.forEach((name, i) => {
            if (i >= this._numStrings) return;

            const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
            const y = this._stringNamesY + translateY + this._headstockYOffset;

            this._drawText(name, x, y, font, color, "center", "middle", true);
        });

        this._ctx.restore();
    }

    public drawStrings(): void {
        if (this._colors.fretboard.strings.thickness <= 0) return;

        this._ctx.save();
        this.applyTransforms();

        const currentHeight = this._fretboardHeight; // Full progress assumed for simple draw
        const thickness = 2 * this._scaleFactor;
        const color = this._colors.fretboard.strings.color;

        for (let i = 0; i < this._numStrings; i++) {
            const x = this._fretboardX + this._horizontalPadding + i * this._stringSpacing;
            this._drawLine(x, this._fretboardY, x, this._fretboardY + currentHeight, color, thickness);
        }
        this._ctx.restore();
    }

    public drawFrets(): void {
        const baseColor = this._colors.fretboard.frets.color;

        this._ctx.save();
        this.applyTransforms();

        for (let i = 0; i <= this._numFrets; i++) {
            const y = this._fretboardY + i * this._realFretSpacing;
            const width = 2 * this._scaleFactor;

            this._drawLine(this._fretboardX, y, this._fretboardX + this._fretboardWidth, y, baseColor, width);
        }
        this._ctx.restore();
    }

    // Progressive Wrappers
    public drawNeckProgressive(progress: number): void {
        this.drawNeck(progress);
    }

    public drawStringsProgressive(progress: number): void {
        this.drawStrings();
    }

    public drawFretsProgressive(progress: number): void {
        this.drawFrets();
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

    private drawCapo(): void {
        if (this._capoFret <= 0) return;
        this._ctx.save();
        this.applyTransforms();

        const capoHeight = 35 * this._scaleFactor;
        // User requested adjustment: + 27 + headstockYOffset
        const capoY = this._fretboardY - (capoHeight / 2) - (2 * this._scaleFactor) + 27 + this._headstockYOffset;

        // Draw capo bar
        this._ctx.fillStyle = '#c0c0c0';
        this._ctx.strokeStyle = '#808080';
        this._ctx.lineWidth = 1 * this._scaleFactor;

        this._ctx.beginPath();
        this._safeRoundRect(this._fretboardX - 5 * this._scaleFactor, capoY, this._fretboardWidth + 10 * this._scaleFactor, capoHeight, 5 * this._scaleFactor);
        this._ctx.fill();
        this._ctx.stroke();

        // Draw highlight
        this._ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this._ctx.fillRect(this._fretboardX - 4 * this._scaleFactor, capoY + 2 * this._scaleFactor, this._fretboardWidth + 8 * this._scaleFactor, 2 * this._scaleFactor);

        // Draw "CAPO" text distributed
        const text = "CAPO";
        const fontSize = 16 * this._scaleFactor;
        const font = `bold ${fontSize}px sans-serif`;
        const color = '#2c2c2c';

        // Distribute C-A-P-O across the 4 middle string positions if enough strings, or evenly
        // Using string spacing for consistency with string names
        const centerY = capoY + capoHeight / 2;

        // Center index logic:
        // C at -1.5 spacing from center
        // A at -0.5 spacing
        // P at +0.5 spacing
        // O at +1.5 spacing
        const gridCenter = this._fretboardX + this._horizontalPadding + ((this._numStrings - 1) * this._stringSpacing) / 2;
        const offsets = [-1.5, -0.5, 0.5, 1.5];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            // If we have less than 4 strings (ukulele?), this might look wide, but usually fine.
            const x = gridCenter + (offsets[i] * this._stringSpacing);
            // Enable counterRotate to keep letters upright like string names
            this._drawText(char, x, centerY, font, color, "center", "middle", true);
        }

        this._ctx.restore();
    }

    private drawCapoFretNumber(): void {
        if (this._capoFret <= 0) return;
        this._ctx.save();
        this.applyTransforms(); // Apply transforms so it moves with the neck

        const capoHeight = 35 * this._scaleFactor;
        // User requested adjustment: + 27 + headstockYOffset
        const capoY = this._fretboardY - (capoHeight / 2) - (2 * this._scaleFactor) + 27 + this._headstockYOffset;

        const x = this._fretboardX - 30 * this._scaleFactor;
        const y = capoY + capoHeight / 2;

        const text = this._capoFret.toString();
        const font = `bold ${32 * this._scaleFactor}px sans-serif`;
        const color = this._colors.global.primaryTextColor;

        // Enable counterRotate so number stays upright
        this._drawText(text, x, y, font, color, "center", "middle", true);

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
        counterRotate: boolean = false
    ): void {
        this._ctx.save();
        this._ctx.fillStyle = color;
        this._ctx.font = font;
        this._ctx.textAlign = align;
        this._ctx.textBaseline = baseline;

        if (counterRotate) {
            this._ctx.save();
            this._ctx.translate(x, y);
            if (this._mirror) this._ctx.scale(-1, 1);
            if (this._rotation) this._ctx.rotate((-this._rotation * Math.PI) / 180);
            this._ctx.fillText(text, 0, 0);
            this._ctx.restore();
        } else {
            this._ctx.fillText(text, x, y);
        }
        this._ctx.restore();
    }
}
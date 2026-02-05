import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface StringsStyle {
    color: string;
    thickness: number;
    shadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
}

/**
 * StringsComponent - Draws the strings for both FULL and SHORT orientations
 */
export class StringsComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: StringsStyle;
    private geometry: GeometryProvider;
    private horizontalPadding: number;

    constructor(
        neckType: NeckType,
        style: StringsStyle,
        geometry: GeometryProvider,
        options: {
            horizontalPadding?: number;
        } = {}
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;
        this.horizontalPadding = options.horizontalPadding ?? 0;
    }

    public validate(): boolean {
        return true;
    }

    public update(progress: number): void {
        // Animation support
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.style.thickness <= 0) return;

        this.drawShortStrings(ctx);
    }



    private drawShortStrings(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const fretboardY = settings.fretboardY;
        const stringSpacing = settings.stringSpacing;
        const fretboardHeight = settings.fretboardHeight;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        const thickness = this.style.thickness * scaleFactor;

        // Draw vertical strings
        for (let i = 0; i < numStrings; i++) {
            const x = fretboardX + this.horizontalPadding + i * stringSpacing;

            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = this.style.color;
            ctx.moveTo(x, fretboardY);
            ctx.lineTo(x, fretboardY + fretboardHeight);
            ctx.stroke();
        }

        ctx.restore();
    }

    public getBounds() {
        const settings = (this.geometry as any).settings;
        return {
            x: settings.fretboardX,
            y: settings.fretboardY,
            width: settings.fretboardWidth,
            height: settings.fretboardHeight
        };
    }
}

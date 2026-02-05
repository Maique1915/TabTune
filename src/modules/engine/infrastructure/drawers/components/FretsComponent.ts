import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface FretsStyle {
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
 * FretsComponent - Draws the frets for both FULL and SHORT orientations
 */
export class FretsComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: FretsStyle;
    private geometry: GeometryProvider;
    private showNut: boolean;

    constructor(
        neckType: NeckType,
        style: FretsStyle,
        geometry: GeometryProvider,
        options: {
            showNut?: boolean;
        } = {}
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;
        this.showNut = options.showNut ?? true;
    }

    public validate(): boolean {
        return true;
    }

    public update(progress: number): void {
        // Animation support
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.drawShortFrets(ctx);
    }



    private drawShortFrets(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const fretboardY = settings.fretboardY;
        const fretboardWidth = settings.fretboardWidth;
        const realFretSpacing = settings.realFretSpacing;
        const numFrets = settings.numFrets;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        ctx.strokeStyle = this.style.color;
        ctx.lineWidth = this.style.thickness * scaleFactor;

        // Draw horizontal fret lines
        for (let i = 0; i < numFrets; i++) {
            const y = fretboardY + i * realFretSpacing;

            ctx.beginPath();
            ctx.moveTo(fretboardX, y);
            ctx.lineTo(fretboardX + fretboardWidth, y);
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

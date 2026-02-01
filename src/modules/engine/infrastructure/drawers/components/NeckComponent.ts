import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface NeckStyle {
    color: string;
    shadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    headColor?: string;
    headShadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    headBorder?: {
        color: string;
        width: number;
    };
}

/**
 * NeckComponent - Draws the fretboard neck for both FULL and SHORT orientations
 */
export class NeckComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: NeckStyle;
    private geometry: GeometryProvider;
    private showHeadBackground: boolean;
    private neckRadius: number;
    private headstockYOffset: number;

    // For SHORT neck
    private diagramY?: number;
    private stringNamesY?: number;
    private headWidth?: number;

    constructor(
        neckType: NeckType,
        style: NeckStyle,
        geometry: GeometryProvider,
        options: {
            showHeadBackground?: boolean;
            neckRadius?: number;
            headstockYOffset?: number;
            diagramY?: number;
            stringNamesY?: number;
            headWidth?: number;
        } = {}
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;
        this.showHeadBackground = options.showHeadBackground ?? true;
        this.neckRadius = options.neckRadius ?? (neckType === NeckType.FULL ? 16 : 35);
        this.headstockYOffset = options.headstockYOffset ?? 0;
        this.diagramY = options.diagramY;
        this.stringNamesY = options.stringNamesY;
        this.headWidth = options.headWidth;
    }

    public validate(): boolean {
        return true; // Neck is always valid
    }

    public update(progress: number): void {
        // Animation support - can be implemented later
    }

    public draw(ctx: CanvasRenderingContext2D, progress: number = 1): void {
        if (this.neckType === NeckType.FULL) {
            this.drawFullNeck(ctx, progress);
        } else {
            this.drawShortNeck(ctx, progress);
        }
    }

    private drawFullNeck(ctx: CanvasRenderingContext2D, progress: number): void {
        // Get geometry settings
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const boardY = settings.boardY;
        const fretboardWidth = settings.fretboardWidth;
        const fretboardHeight = settings.fretboardHeight;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        // Draw neck
        ctx.fillStyle = this.style.color;
        ctx.fillRect(fretboardX, boardY, fretboardWidth, fretboardHeight * progress);

        ctx.restore();

        // Draw headstock if enabled
        if (this.showHeadBackground) {
            this.drawFullHeadstock(ctx, fretboardX, boardY, fretboardHeight, scaleFactor);
        }
    }

    private drawFullHeadstock(ctx: CanvasRenderingContext2D, fretboardX: number, boardY: number, fretboardHeight: number, scaleFactor: number): void {
        ctx.save();

        // For FULL neck, use provided headWidth if possible, else fallback to consistent 45
        const headWidth = this.headWidth ?? (this.geometry.realFretSpacing || 45 * scaleFactor);
        const headX = fretboardX - headWidth - 2 * scaleFactor;

        // Apply shadow
        if (this.style.headShadow?.enabled) {
            ctx.shadowColor = this.style.headShadow.color;
            ctx.shadowBlur = this.style.headShadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.headShadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.headShadow.offsetY * scaleFactor;
        }

        ctx.fillStyle = this.style.headColor || "#1e1e22";
        ctx.beginPath();

        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(headX, boardY, headWidth, fretboardHeight, [10 * scaleFactor, 0, 0, 10 * scaleFactor]);
        } else {
            ctx.rect(headX, boardY, headWidth, fretboardHeight);
        }

        ctx.fill();

        // Optional border for head
        if (this.style.headBorder && this.style.headBorder.width > 0) {
            ctx.lineWidth = this.style.headBorder.width * scaleFactor;
            ctx.strokeStyle = this.style.headBorder.color;
            ctx.stroke();
        }

        ctx.restore();
    }

    private drawShortNeck(ctx: CanvasRenderingContext2D, progress: number): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const fretboardY = settings.fretboardY;
        const fretboardWidth = settings.fretboardWidth;
        const fretboardHeight = settings.fretboardHeight;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        // Draw neck with rounded bottom corners
        ctx.fillStyle = this.style.color;
        ctx.beginPath();

        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(
                fretboardX,
                fretboardY,
                fretboardWidth,
                fretboardHeight * progress,
                [0, 0, this.neckRadius * scaleFactor, this.neckRadius * scaleFactor]
            );
        } else {
            ctx.rect(fretboardX, fretboardY, fretboardWidth, fretboardHeight * progress);
        }

        ctx.fill();

        ctx.restore();

        // Draw headstock if enabled
        if (this.showHeadBackground && this.diagramY !== undefined) {
            this.drawShortHeadstock(ctx, fretboardX, fretboardY, fretboardWidth, scaleFactor);
        }
    }

    private drawShortHeadstock(ctx: CanvasRenderingContext2D, fretboardX: number, fretboardY: number, fretboardWidth: number, scaleFactor: number): void {
        if (this.diagramY === undefined) return;

        ctx.save();

        const headstockHeight = fretboardY - this.diagramY;
        const headStartY = this.diagramY + this.headstockYOffset;

        // Apply shadow
        if (this.style.headShadow?.enabled) {
            ctx.shadowColor = this.style.headShadow.color;
            ctx.shadowBlur = this.style.headShadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.headShadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.headShadow.offsetY * scaleFactor;
        }

        ctx.fillStyle = this.style.headColor || "#3a3a3e";
        ctx.beginPath();

        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(
                fretboardX,
                headStartY,
                fretboardWidth,
                headstockHeight,
                [this.neckRadius * scaleFactor, this.neckRadius * scaleFactor, 0, 0]
            );
        } else {
            ctx.rect(fretboardX, headStartY, fretboardWidth, headstockHeight);
        }

        ctx.fill();

        // Draw border if specified
        if (this.style.headBorder && this.style.headBorder.width > 0) {
            ctx.lineWidth = this.style.headBorder.width * scaleFactor;
            ctx.strokeStyle = this.style.headBorder.color;
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

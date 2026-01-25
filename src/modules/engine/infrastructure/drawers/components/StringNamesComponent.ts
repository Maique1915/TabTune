import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface StringNamesStyle {
    color: string;
    fontSize: number;
}

/**
 * StringNamesComponent - Draws string names (E, A, D, G, B, e) for both FULL and SHORT orientations
 */
export class StringNamesComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: StringNamesStyle;
    private geometry: GeometryProvider;
    private stringNames: string[];
    private horizontalPadding: number;

    // For FULL neck
    private headWidth?: number;

    // For SHORT neck
    private stringNamesY?: number;
    private headstockYOffset?: number;

    constructor(
        neckType: NeckType,
        stringNames: string[],
        style: StringNamesStyle,
        geometry: GeometryProvider,
        options: {
            horizontalPadding?: number;
            headWidth?: number;
            stringNamesY?: number;
            headstockYOffset?: number;
        } = {}
    ) {
        this.neckType = neckType;
        this.stringNames = stringNames;
        this.style = style;
        this.geometry = geometry;
        this.horizontalPadding = options.horizontalPadding ?? 0;
        this.headWidth = options.headWidth;
        this.stringNamesY = options.stringNamesY;
        this.headstockYOffset = options.headstockYOffset ?? 0;
    }

    public validate(): boolean {
        return true;
    }

    public update(progress: number): void {
        // Animation support
    }

    public draw(ctx: CanvasRenderingContext2D, progress: number = 1): void {
        if (this.neckType === NeckType.FULL) {
            this.drawFullStringNames(ctx);
        } else {
            this.drawShortStringNames(ctx, progress);
        }
    }

    private drawFullStringNames(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const boardY = settings.boardY;
        const stringMargin = settings.stringMargin;
        const stringSpacing = settings.stringSpacing;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        const headWidth = this.headWidth ?? (45 * scaleFactor);
        const centerX = fretboardX - headWidth / 2 - 2 * scaleFactor;

        ctx.save();
        ctx.fillStyle = this.style.color;
        ctx.font = `bold ${this.style.fontSize * scaleFactor}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < numStrings; i++) {
            const y = boardY + stringMargin + i * stringSpacing;
            const name = this.stringNames[i] || "";
            ctx.fillText(name, centerX, y);
        }

        ctx.restore();
    }

    private drawShortStringNames(ctx: CanvasRenderingContext2D, progress: number): void {
        if (this.stringNamesY === undefined) return;

        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const stringSpacing = settings.stringSpacing;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        const easedProgress = this.easeInOutQuad(progress);
        const translateY = (1 - easedProgress) * (-10 * scaleFactor);

        ctx.save();
        ctx.fillStyle = this.style.color;
        ctx.font = `bold ${this.style.fontSize * scaleFactor}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        this.stringNames.forEach((name, i) => {
            if (i >= numStrings) return;

            const x = fretboardX + this.horizontalPadding + i * stringSpacing;
            const y = this.stringNamesY! + translateY + (this.headstockYOffset ?? 0);

            ctx.fillText(name, x, y);
        });

        ctx.restore();
    }

    private easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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

    public setStringNames(names: string[]): void {
        this.stringNames = names;
    }
}

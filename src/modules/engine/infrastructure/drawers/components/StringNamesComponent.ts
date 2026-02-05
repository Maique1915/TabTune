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

    private rotation: number = 0;
    private mirror: boolean = false;

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

    public setRotation(rotation: number, mirror: boolean): void {
        this.rotation = rotation;
        this.mirror = mirror;
    }

    public draw(ctx: CanvasRenderingContext2D, progress: number = 1): void {
        this.drawShortStringNames(ctx, progress);
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

            if (this.rotation !== 0 || this.mirror) {
                // Counter-rotate logic to keep text upright
                ctx.save();
                ctx.translate(x, y);
                if (this.mirror) ctx.scale(-1, 1);
                if (this.rotation !== 0) ctx.rotate((-this.rotation * Math.PI) / 180);

                ctx.fillText(name, 0, 0);
                ctx.restore();
            } else {
                ctx.fillText(name, x, y);
            }
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

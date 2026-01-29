import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface TransposeIndicatorStyle {
    color: string;
    fontSize: number;
}

/**
 * TransposeIndicatorComponent - Draws the transpose indicator (e.g., "7ª") for SHORT orientation
 */
export class TransposeIndicatorComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: TransposeIndicatorStyle;
    private geometry: GeometryProvider;

    // Animation/State
    private sText: string | number = 0;
    private tText: string | number = 0;
    private sFret: number = 1;
    private tFret: number = 1;
    private sOpacity: number = 0;
    private tOpacity: number = 0;

    // Visuals
    private vText: string | number = 0;
    private vFret: number = 1;
    private vOpacity: number = 0;

    constructor(
        neckType: NeckType,
        text: string | number,
        alignFret: number,
        style: TransposeIndicatorStyle,
        geometry: GeometryProvider
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;

        const opacity = Number(text) > 1 ? 1 : 0;
        this.vText = this.sText = this.tText = text;
        this.vFret = this.sFret = this.tFret = alignFret;
        this.vOpacity = this.sOpacity = this.tOpacity = opacity;
    }

    public setTarget(text: string | number, alignFret: number, opacity: number): void {
        this.sText = this.vText;
        this.sFret = this.vFret;
        this.sOpacity = this.vOpacity;

        this.tText = text;
        this.tFret = alignFret;
        this.tOpacity = opacity;
    }

    public validate(): boolean {
        return Number(this.vText) > 1;
    }

    public update(progress: number): void {
        this.vFret = this.sFret + (this.tFret - this.sFret) * progress;
        this.vOpacity = this.sOpacity + (this.tOpacity - this.sOpacity) * progress;
        this.vText = progress < 0.5 ? this.sText : this.tText;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.validate() || this.vOpacity <= 0) return;

        if (this.neckType === NeckType.SHORT) {
            this.drawShortTransposeIndicator(ctx);
        }
    }

    private rotation: number = 0;
    private mirror: boolean = false;
    private canvasDimensions?: { width: number; height: number };

    public setRotation(angle: number, mirror: boolean, canvasDimensions?: { width: number; height: number }): void {
        this.rotation = angle;
        this.mirror = mirror;
        if (canvasDimensions) this.canvasDimensions = canvasDimensions;
    }

    private drawShortTransposeIndicator(ctx: CanvasRenderingContext2D): void {
        const scaleFactor = this.geometry.scaleFactor;

        const fretboardX = this.geometry.fretboardX;
        const fretboardY = this.geometry.fretboardY;
        const realFretSpacing = this.geometry.realFretSpacing;

        // Final refined position: 50px to the left of the neck
        const x = fretboardX - (50 * scaleFactor);
        const y = fretboardY + (this.vFret - 0.5) * realFretSpacing;

        ctx.save();

        // Note: Global transformation is now applied by the Drawer

        ctx.globalAlpha = this.vOpacity;

        const fontSize = (this.style.fontSize || 35) * scaleFactor;
        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.style.color || "#ffffff";

        // Soft shadow for premium feel
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4 * scaleFactor;
        ctx.shadowOffsetX = 1 * scaleFactor;
        ctx.shadowOffsetY = 1 * scaleFactor;

        const displayText = `${this.vText}ª`;

        if (!isNaN(x) && !isNaN(y)) {
            ctx.save();
            ctx.translate(x, y);
            if (this.mirror) ctx.scale(-1, 1);
            if (this.rotation) ctx.rotate((-this.rotation * Math.PI) / 180);
            ctx.fillText(displayText, 0, 0);
            ctx.restore();
        }

        ctx.restore();
    }

    public getBounds() {
        const scaleFactor = this.geometry.scaleFactor;
        return {
            x: this.geometry.fretboardX - 80 * scaleFactor,
            y: this.geometry.fretboardY + (this.vFret - 1) * this.geometry.realFretSpacing,
            width: 80 * scaleFactor,
            height: this.geometry.realFretSpacing
        };
    }
}

import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { CapoStyle } from "@/modules/core/domain/types";
import { NeckType } from "./NeckType";

export class CapoComponent implements IFretboardComponent {
    private fret: number;
    private style: CapoStyle;
    private geometry: GeometryProvider;

    // Animation states
    private sFret: number;
    private tFret: number;
    private sOpacity: number;
    private tOpacity: number;

    // Visuals
    private vFret: number = 0;
    private vOpacity: number = 1;

    constructor(fret: number, style: CapoStyle, geometry: GeometryProvider) {
        this.fret = this.sFret = this.tFret = fret;
        this.style = style;
        this.geometry = geometry;
        this.sOpacity = this.tOpacity = style.opacity ?? 1;

        this.validate();
        this.syncVisuals(0);
    }

    public setTarget(fret: number, opacity: number): void {
        this.sFret = this.fret;
        this.sOpacity = this.vOpacity;
        this.tFret = fret;
        this.tOpacity = opacity;
    }

    public validate(): boolean {
        if (this.tFret <= 0 || !this.geometry.validate(this.tFret, 1)) {
            console.warn(`[CapoComponent] Invalid position: fret ${this.tFret}`);
            return false;
        }
        return true;
    }

    private syncVisuals(progress: number): void {
        this.vFret = this.sFret + (this.tFret - this.sFret) * progress;
        this.vOpacity = this.sOpacity + (this.tOpacity - this.sOpacity) * progress;

        if (progress >= 1) {
            this.fret = this.tFret;
        }
    }

    public update(progress: number): void {
        this.syncVisuals(progress);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const isFull = this.geometry.neckType === NeckType.FULL;
        const p1 = this.geometry.getFingerCoords(this.vFret, this.geometry.numStrings);
        const p2 = this.geometry.getFingerCoords(this.vFret, 1);

        const overhang = 25 * this.geometry.scaleFactor;
        const thickness = 35 * this.geometry.scaleFactor;

        ctx.save();
        ctx.globalAlpha = this.vOpacity;

        let rectX, rectY, rectW, rectH;

        if (isFull) {
            rectX = p1.x - thickness / 2;
            rectY = Math.min(p1.y, p2.y) - overhang;
            rectW = thickness;
            rectH = Math.abs(p1.y - p2.y) + overhang * 2;
        } else {
            // Vertical - Capo is horizontal bar
            rectX = Math.min(p1.x, p2.x) - overhang;
            rectY = p1.y - thickness / 2;
            rectW = Math.abs(p1.x - p2.x) + overhang * 2;
            rectH = thickness;
        }

        ctx.fillStyle = this.style.color;
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(rectX, rectY, rectW, rectH, 8 * this.geometry.scaleFactor);
        } else {
            ctx.rect(rectX, rectY, rectW, rectH);
        }
        ctx.fill();

        ctx.strokeStyle = this.style.border?.color || "#000000";
        ctx.lineWidth = (this.style.border?.width || 2) * this.geometry.scaleFactor;
        ctx.stroke();

        ctx.fillStyle = this.style.textColor || "#ffffff";
        ctx.font = `900 ${thickness * 0.45}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const letters = ["C", "A", "P", "O"];
        if (isFull) {
            const segmentHeight = rectH / 4;
            letters.forEach((char, i) => {
                ctx.fillText(char, p1.x, rectY + (i * segmentHeight) + (segmentHeight / 2));
            });
        } else {
            const segmentWidth = rectW / 4;
            letters.forEach((char, i) => {
                ctx.fillText(char, rectX + (i * segmentWidth) + (segmentWidth / 2), p1.y);
            });
        }

        ctx.restore();
    }

    public getBounds() {
        const p1 = this.geometry.getFingerCoords(this.vFret, this.geometry.numStrings);
        const p2 = this.geometry.getFingerCoords(this.vFret, 1);
        const overhang = 25 * this.geometry.scaleFactor;
        const thickness = 35 * this.geometry.scaleFactor;

        if (this.geometry.neckType === NeckType.FULL) {
            return {
                x: p1.x - thickness / 2,
                y: Math.min(p1.y, p2.y) - overhang,
                width: thickness,
                height: Math.abs(p1.y - p2.y) + overhang * 2
            };
        } else {
            return {
                x: Math.min(p1.x, p2.x) - overhang,
                y: p1.y - thickness / 2,
                width: Math.abs(p1.x - p2.x) + overhang * 2,
                height: thickness
            };
        }
    }

    public setFret(fret: number) { this.fret = this.sFret = this.tFret = fret; this.syncVisuals(1); }
}

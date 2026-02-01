import { AvoidStyle } from "@/modules/core/domain/types";
import { NeckType } from "./NeckType";

export interface IGeometryProvider {
    getFingerCoords(fret: number, string: number): { x: number; y: number };
    scaleFactor: number;
    isHorizontal: boolean;
    numFrets: number;
    fingerRadius: number;
}

export class AvoidComponent {
    private string: number;
    private geometry: IGeometryProvider;
    private style: AvoidStyle;
    private currentOpacity: number;
    private targetOpacity: number;
    private isHorizontal: boolean;
    private neckType: NeckType;

    constructor(string: number, style: AvoidStyle, geometry: IGeometryProvider, neckType?: NeckType) {
        this.string = string;
        this.style = style;
        this.geometry = geometry;
        this.currentOpacity = style.opacity ?? 1;
        this.targetOpacity = style.opacity ?? 1;
        this.isHorizontal = geometry.isHorizontal;
        this.neckType = neckType ?? NeckType.SHORT;
    }

    public update(progress: number): void {
        const baseOpacity = this.style.opacity ?? 1;
        this.currentOpacity = baseOpacity + (this.targetOpacity - baseOpacity) * progress;
    }

    public setOpacity(opacity: number): void {
        this.currentOpacity = opacity;
    }

    public setTargetOpacity(opacity: number): void {
        this.targetOpacity = opacity;
    }

    private getAvoidCoords(): { x: number; y: number } {
        // Draw on the opposite side of the headstock (fret 0).
        // Using +1 fret beyond the last visible fret to simulate the "next fret space"
        const fretPos = this.geometry.numFrets ? this.geometry.numFrets + 1 : 25;
        const coords = this.geometry.getFingerCoords(fretPos, this.string);

        return coords;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.currentOpacity <= 0) return;

        const { x, y } = this.getAvoidCoords();
        const size = this.geometry.fingerRadius / 4;

        ctx.save();
        ctx.globalAlpha = this.currentOpacity;
        ctx.lineCap = 'round';

        // 1. Draw Border (outer thicker cross)
        if (this.style.border) {
            ctx.strokeStyle = this.style.border.color;
            ctx.lineWidth = (this.style.lineWidth + (this.style.border.width || 0) * 2) * this.geometry.scaleFactor;
            this.drawCross(ctx, x, y, size);
        }

        // 2. Draw Main Cross
        ctx.strokeStyle = this.style.color || "#ffffff";
        ctx.lineWidth = (this.style.lineWidth || 6) * this.geometry.scaleFactor;
        this.drawCross(ctx, x, y, size);

        ctx.restore();
    }

    private drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
        ctx.beginPath();
        ctx.moveTo(x - size, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + size, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.stroke();
    }
}

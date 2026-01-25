import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { ChordNameStyle } from "@/modules/core/domain/types";

export class ChordNameComponent implements IFretboardComponent {
    private chordName: string;
    private extensions: string[];
    private style: ChordNameStyle;
    private geometry: GeometryProvider;
    private x: number = 0;
    private y: number = 0;

    constructor(
        chordName: string,
        extensions: string[],
        style: ChordNameStyle,
        geometry: GeometryProvider
    ) {
        this.chordName = chordName;
        this.extensions = extensions;
        this.style = style;
        this.geometry = geometry;
        this.validate();
    }

    public validate(): boolean {
        return !!this.chordName;
    }

    public setAnchor(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public update(progress: number): void {
        // Local animation logic
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.validate()) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.style.opacity ?? 1;

        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color || "rgba(0,0,0,0.5)";
            ctx.shadowBlur = this.style.shadow.blur ?? 0;
            ctx.shadowOffsetX = this.style.shadow.offsetX ?? 0;
            ctx.shadowOffsetY = this.style.shadow.offsetY ?? 0;
        }

        let baseName = this.chordName.replace(/#/g, "♯").replace(/b/g, "♭");
        let bass = "";
        const bassIdx = baseName.indexOf("/");
        if (bassIdx !== -1) {
            bass = baseName.substring(bassIdx);
            baseName = baseName.substring(0, bassIdx);
        }

        const nameSize = this.style.fontSize * this.geometry.scaleFactor;
        const extSize = this.style.extSize * this.geometry.scaleFactor;

        ctx.fillStyle = this.style.color || "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 1. Measure layout
        ctx.font = `900 ${nameSize}px "Inter", sans-serif`;
        const nameWidth = ctx.measureText(baseName).width;

        ctx.font = `bold ${extSize}px "Inter", sans-serif`;
        let maxExtWidth = 0;
        this.extensions.forEach(ext => {
            const w = ctx.measureText(ext).width;
            if (w > maxExtWidth) maxExtWidth = w;
        });

        ctx.font = `900 ${nameSize}px "Inter", sans-serif`;
        const bassWidth = bass ? ctx.measureText(bass).width : 0;

        const totalWidth = nameWidth + (this.extensions.length > 0 ? maxExtWidth + 10 : 0) + bassWidth;
        let currentX = -totalWidth / 2;

        // 2. Draw
        ctx.font = `900 ${nameSize}px "Inter", sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText(baseName, currentX, 0);
        currentX += nameWidth + 5 * this.geometry.scaleFactor;

        if (this.extensions.length > 0) {
            ctx.font = `bold ${extSize}px "Inter", sans-serif`;
            const lineHeight = extSize * 0.9;
            const stackHeight = (this.extensions.length - 1) * lineHeight;
            let startY = -stackHeight / 2;
            this.extensions.forEach((ext, i) => {
                ctx.fillText(ext, currentX, startY + i * lineHeight);
            });
            currentX += maxExtWidth + 5 * this.geometry.scaleFactor;
        }

        if (bass) {
            ctx.font = `900 ${nameSize}px "Inter", sans-serif`;
            ctx.fillText(bass, currentX, 0);
        }

        ctx.restore();
    }

    public getBounds() {
        return { x: this.x - 100, y: this.y - 50, width: 200, height: 100 }; // Rough estimate
    }
}

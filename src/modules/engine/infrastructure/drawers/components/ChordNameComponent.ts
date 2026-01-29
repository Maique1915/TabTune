import { IFretboardComponent } from "./IFretboardComponent";

export interface ChordNameStyle {
    color: string;
    fontSize: number;
    fontFamily: string;
    opacity: number;
}

export class ChordNameComponent implements IFretboardComponent {
    private text: string;
    private x: number;
    private y: number;
    private style: ChordNameStyle;
    private scaleFactor: number;

    constructor(
        text: string,
        x: number,
        y: number,
        style: Partial<ChordNameStyle>,
        scaleFactor: number
    ) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.scaleFactor = scaleFactor;

        this.style = {
            color: style.color || "#ffffff",
            fontSize: style.fontSize || 60,
            fontFamily: style.fontFamily || '"Inter", sans-serif',
            opacity: style.opacity ?? 1
        };
    }

    public validate(): boolean {
        return !!this.text;
    }

    public update(progress: number): void {
        // Animation if needed (fade in/out?)
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.text) return;

        ctx.save();
        ctx.globalAlpha = this.style.opacity;
        ctx.fillStyle = this.style.color;

        const fontSize = this.style.fontSize * this.scaleFactor;
        ctx.font = `900 ${fontSize}px ${this.style.fontFamily}`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        const fontSize = this.style.fontSize * this.scaleFactor;
        // Rough estimation since we don't have measureText context easily without dirtying state or requiring ctx here
        const width = this.text.length * (fontSize * 0.6);
        return {
            x: this.x - width / 2,
            y: this.y - fontSize / 2,
            width: width,
            height: fontSize
        };
    }
}

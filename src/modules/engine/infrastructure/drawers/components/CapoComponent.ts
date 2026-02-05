import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { CapoStyle } from "@/modules/core/domain/types";
import { NeckType } from "./NeckType";

export class CapoComponent implements IFretboardComponent {
    private fret: number;
    private style: CapoStyle;
    private geometry: GeometryProvider;
    private transport: number = 1;

    // Animation states
    private sFret: number;
    private tFret: number;
    private sOpacity: number;
    private tOpacity: number;
    private paddingCapo: number;
    private sScale: number = 1;
    private tScale: number = 1;
    private sTransport: number = 1;
    private tTransport: number = 1;

    // Visuals
    private vFret: number = 0;
    private vOpacity: number = 1;
    private vScale: number = 1;

    private options?: {
        neckAppearance?: { backgroundColor: string; stringColor: string };
        displayFret?: number;
    };

    constructor(
        fret: number,
        style: CapoStyle,
        geometry: GeometryProvider,
        options?: {
            neckAppearance?: { backgroundColor: string; stringColor: string };
            displayFret?: number;
            transport?: number;
        }
    ) {
        this.fret = this.sFret = this.tFret = fret;
        this.style = style;
        this.geometry = geometry;
        this.options = options;
        this.transport = this.sTransport = this.tTransport = options?.transport ?? 1;
        this.sOpacity = this.tOpacity = style.opacity ?? 1;
        this.paddingCapo = this.geometry.capoPaddingY ?? 66 * geometry.scaleFactor;

        this.validate();
        this.syncVisuals(0);
    }

    public setTarget(fret: number, opacity: number, transport: number = 1, scale: number = 1): void {
        this.sFret = this.fret;
        this.sOpacity = this.vOpacity;
        this.sScale = this.vScale;
        this.sTransport = this.transport;

        this.tFret = fret;
        this.tOpacity = opacity;
        this.tScale = scale;
        this.tTransport = transport;

        this.syncVisuals(0);
    }

    public validate(): boolean {
        // Allow fret 0 explicitly for visual Capo at Nut
        if (this.tFret < 0 || (this.tFret > 0 && !this.geometry.validate(this.tFret, 1))) {
            return false;
        }
        return true;
    }

    private syncVisuals(progress: number): void {
        const getVisualFret = (fret: number, transport: number) => {
            // If transport > 1, it means we are in a transposing view (ShortNeck)
            if (transport > 1 && fret > 0) {
                return fret - (transport - 1);
            }
            return fret;
        };

        const vFretStart = getVisualFret(this.sFret, this.sTransport);
        const vFretTarget = getVisualFret(this.tFret, this.tTransport);

        this.vFret = vFretStart + (vFretTarget - vFretStart) * progress;
        this.vOpacity = this.sOpacity + (this.tOpacity - this.sOpacity) * progress;
        this.vScale = this.sScale + (this.tScale - this.sScale) * progress;

        if (progress >= 1) {
            this.fret = this.tFret;
            this.transport = this.tTransport;
            this.vScale = this.tScale;
        }
    }

    public update(progress: number): void {
        this.syncVisuals(progress);
    }

    private rotation: number = 0;
    private mirror: boolean = false;

    public setRotation(rotation: number, mirror: boolean): void {
        this.rotation = rotation;
        this.mirror = mirror;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.drawShort(ctx);
    }

    private drawShort(ctx: CanvasRenderingContext2D): void {
        const fretboardY = this.geometry.fretboardY;
        const headstockYOffset = this.geometry.headstockYOffset;
        const scaleFactor = this.geometry.scaleFactor;
        const fretboardX = this.geometry.fretboardX;
        const fretboardWidth = this.geometry.fretboardWidth;

        const capoHeight = 35 * scaleFactor;
        const capoY = fretboardY - (capoHeight / 2) - (2 * scaleFactor) + 32;


        // Theme colors
        const capoColor = this.style.color || '#c0c0c0';
        const borderColor = this.style.border?.color || '#808080';
        const borderWidth = (this.style.border?.width || 1) * scaleFactor;
        const textColor = this.style.textColor || '#2c2c2c';

        ctx.save();
        ctx.globalAlpha = this.vOpacity;

        // Draw pseudo neck first
        this.pseudoNeck(ctx, fretboardX, capoY, fretboardWidth, capoHeight, scaleFactor);

        // Draw capo bar
        ctx.fillStyle = capoColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;

        // Shadow handling
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color || 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = (this.style.shadow.blur ?? 10) * scaleFactor;
            ctx.shadowOffsetX = (this.style.shadow.offsetX ?? 0) * scaleFactor;
            ctx.shadowOffsetY = (this.style.shadow.offsetY ?? 0) * scaleFactor;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(fretboardX - 5 * scaleFactor, capoY - this.paddingCapo, fretboardWidth + 10 * scaleFactor, capoHeight, 5 * scaleFactor);
        } else {
            ctx.rect(fretboardX - 5 * scaleFactor, capoY - this.paddingCapo, fretboardWidth + 10 * scaleFactor, capoHeight);
        }
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        if (borderWidth > 0) {
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(fretboardX - 4 * scaleFactor, capoY - this.paddingCapo + 2 * scaleFactor, fretboardWidth + 8 * scaleFactor, 2 * scaleFactor);

        // Draw "CAPO" aligned center
        const centerX = fretboardX + fretboardWidth / 2;
        const centerY = capoY - this.paddingCapo + capoHeight / 2;
        const fontSize = 16 * scaleFactor;
        const font = `bold ${fontSize}px sans-serif`;

        this.drawText(ctx, "C  A  P  O", centerX, centerY, font, textColor, "center", "middle", false, this.rotation, this.mirror);

        // Draw Number
        const displayFret = this.options?.displayFret ?? this.fret;
        if (displayFret > 0) {
            const numX = fretboardX - 35 * scaleFactor;
            const numY = centerY;
            const numFont = `bold ${32 * scaleFactor}px sans-serif`;
            // Use numberColor if available, else fall back to textColor (resolved) or main color
            const resolvedTextColor = this.style.textColor || '#2c2c2c';
            const numColor = (this.style as any).numberColor || resolvedTextColor || this.style.color;
            this.drawText(ctx, displayFret.toString(), numX, numY, numFont, numColor, "right", "middle", true, this.rotation, this.mirror);
        }

        ctx.restore();
    }

    private drawText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        font: string,
        color: string,
        align: CanvasTextAlign,
        baseline: CanvasTextBaseline,
        counterRotate: boolean,
        rotation: number,
        mirror: boolean
    ): void {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;

        if (counterRotate) {
            ctx.save();
            ctx.translate(x, y);
            if (mirror) ctx.scale(-1, 1);
            if (rotation) ctx.rotate((-rotation * Math.PI) / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        } else {
            ctx.fillText(text, x, y);
        }
        ctx.restore();
    }

    private pseudoNeck(ctx: CanvasRenderingContext2D, fretboardX: number, capoY: number, fretboardWidth: number, capoHeight: number, scaleFactor: number): void {
        ctx.save();
        const startY = capoY - this.paddingCapo;
        const width = fretboardWidth + 10 * scaleFactor;
        const left = fretboardX - 5 * scaleFactor;
        const wallHeight = 40 * scaleFactor;
        const roofHeight = 35 * scaleFactor;

        ctx.rect(left, startY - capoHeight / 2, width, 2 * capoHeight);


        ctx.fillStyle = this.options?.neckAppearance?.backgroundColor || this.style.color || '#c0c0c0';
        ctx.fill();

        // Reset shadow for lines
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.lineWidth = (this.style.border?.width || 1) * scaleFactor;
        if (ctx.lineWidth > 0) {
            ctx.strokeStyle = this.style.border?.color || '#808080';
            ctx.stroke();
        }

        // Strings
        ctx.beginPath();
        for (let i = 1; i <= this.geometry.numStrings; i++) {
            const p = this.geometry.getFingerCoords(this.fret, i);
            const rangeX = p.x;
            ctx.moveTo(rangeX, startY - capoHeight / 2);
            ctx.lineTo(rangeX, startY + 3 * capoHeight / 2);
        }

        // Make strings slightly distinct or reuse border
        ctx.strokeStyle = this.options?.neckAppearance?.stringColor || this.style.border?.color || '#555';
        ctx.lineWidth = 1.5 * scaleFactor;
        ctx.stroke();

        ctx.restore();
    }

    private drawRotatedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, color: string): void {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Counter-rotate logic to keep text upright
        ctx.translate(x, y);
        if (this.mirror) ctx.scale(-1, 1);
        if (this.rotation) ctx.rotate((-this.rotation * Math.PI) / 180);

        ctx.fillText(text, 0, 0);
        ctx.restore();
    }



    public getBounds() {
        const fretboardWidth = this.geometry.fretboardWidth;
        const scaleFactor = this.geometry.scaleFactor;
        const fretboardX = this.geometry.fretboardX;
        const fretboardY = this.geometry.fretboardY;
        const capoHeight = 35 * scaleFactor;
        const capoY = fretboardY - (capoHeight / 2) - (2 * scaleFactor) + 27;

        return {
            x: fretboardX - 5 * scaleFactor,
            y: capoY,
            width: fretboardWidth + 10 * scaleFactor,
            height: capoHeight
        };
    }

    public setFret(fret: number) { this.fret = this.sFret = this.tFret = fret; this.syncVisuals(1); }
}

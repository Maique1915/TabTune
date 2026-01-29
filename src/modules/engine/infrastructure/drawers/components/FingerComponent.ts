import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { FingersStyle, StandardPosition } from "@/modules/core/domain/types";
import { NeckType } from "./NeckType";

/**
 * FingerComponent - Handles rendering of both individual fingers and barre chords.
 * Now centralizes transposition logic for vertical (SHORT) neck diagrams.
 */
export class FingerComponent implements IFretboardComponent {
    // Basic properties
    private fret: number;
    private string: number;
    private finger: number | string;
    private isBarre: boolean = false;
    private barreEndString?: number;

    private style: FingersStyle;
    private geometry: GeometryProvider;
    private transport: number = 1;

    // Animation states
    private sFret: number;
    private sString: number;
    private sEndString?: number;
    private sOpacity: number;
    private sLabel: number | string;
    private sTransport: number = 1;
    private sScale: number = 1;

    private tFret: number;
    private tString: number;
    private tEndString?: number;
    private tOpacity: number;
    private tLabel: number | string;
    private tTransport: number = 1;
    private tScale: number = 1;

    // Runtime visual state
    private vRect: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 };
    private vOpacity: number = 1;
    private vLabel: number | string = "";
    private vScale: number = 1;

    constructor(
        fret: number,
        string: number,
        finger: number | string,
        style: FingersStyle,
        geometry: GeometryProvider,
        transport: number = 1,
        barreEndString?: number
    ) {
        this.fret = this.sFret = this.tFret = fret;
        this.string = this.sString = this.tString = string;
        this.finger = this.sLabel = this.tLabel = finger;
        this.barreEndString = this.sEndString = this.tEndString = barreEndString;
        this.isBarre = !!barreEndString;

        this.style = style;
        this.geometry = geometry;
        this.transport = this.sTransport = this.tTransport = transport;

        this.sOpacity = this.tOpacity = 1;
        this.syncVisuals(0);
    }

    /**
     * static calculateEffectiveTransport
     * Implementation of the logic: if any finger exceeds the numFrets limit,
     * transpose the chord so it starts at the first visual fret.
     */
    public static calculateEffectiveTransport(fingers: StandardPosition[], numFrets: number, forcedTransport: number = 0): number {
        if (forcedTransport > 1) return forcedTransport;

        const activeFrets = fingers.filter(f => f.fret > 0).map(f => f.fret);
        if (activeFrets.length === 0) return 1;

        const maxFret = Math.max(...activeFrets);
        const minFret = Math.min(...activeFrets);

        // If any finger exceeds the visible area, we shift to the minimum fret used.
        if (maxFret > numFrets) {
            const transport = minFret;

            // IDEMPOTENCY CHECK:
            // If applying this transport would result in any finger having a negative visual fret,
            // it means the input is PROBABLY already transposed.
            const wouldHaveNegativeFrets = fingers.some(f => f.fret > 0 && (f.fret - (transport - 1)) < 0);
            if (wouldHaveNegativeFrets) return 1;

            return transport;
        }

        return 1;
    }

    public setTarget(fret: number, string: number, opacity: number, label: number | string, transport: number = 1, barreEnd?: number, scale: number = 1): void {
        this.sFret = this.fret;
        this.sString = this.string;
        this.sEndString = this.barreEndString;
        this.sOpacity = this.vOpacity;
        this.sLabel = this.vLabel;
        this.sTransport = this.transport;
        this.sScale = this.vScale;

        this.tFret = fret;
        this.tString = string;
        this.tEndString = barreEnd;
        this.tOpacity = opacity;
        this.tLabel = label;
        this.tTransport = transport;
        this.tScale = scale;

        this.syncVisuals(0);
    }

    public update(progress: number): void {
        this.syncVisuals(progress);
    }

    public setScale(scale: number) {
        // Immediate set for construction if needed, implies current state
        this.sScale = this.tScale = this.vScale = scale;
    }

    private syncVisuals(progress: number): void {
        const isShort = this.geometry.neckType === NeckType.SHORT;

        const getVisualFret = (fret: number, transport: number) => {
            if (isShort && fret > 0 && transport > 1) {
                return fret - (transport - 1);
            }
            return fret;
        };

        const vFretStart = getVisualFret(this.sFret, this.sTransport);
        const vFretTarget = getVisualFret(this.tFret, this.tTransport);

        // Interpolated logical state for coordinate retrieval
        const curF = vFretStart + (vFretTarget - vFretStart) * progress;
        const curS1 = this.sString + (this.tString - this.sString) * progress;

        this.vOpacity = this.sOpacity + (this.tOpacity - this.sOpacity) * progress;
        this.vLabel = progress < 0.5 ? this.sLabel : this.tLabel;
        this.vScale = this.sScale + (this.tScale - this.sScale) * progress;

        if (this.isBarre || this.tEndString) {
            const sEnd = this.sEndString || this.sString;
            const tEnd = this.tEndString || this.tString;
            const curS2 = sEnd + (tEnd - sEnd) * progress;

            const bWidth = (this.style.barreWidth || 56) * this.geometry.scaleFactor * this.vScale;
            const fRadius = (this.style.radius || 28) * this.geometry.scaleFactor * this.vScale;

            this.vRect = this.geometry.getBarreRect(curF, curS1, curS2, bWidth, fRadius);
        } else {
            const coords = this.geometry.getFingerCoords(curF, curS1);
            const r = (this.style.radius || 28) * this.geometry.scaleFactor * this.vScale;

            // In SHORT neck, we represent fingers as square-shaped rounded rects if they might become barres
            // To be safe and smooth, we'll use a rect of size 2r x 2r
            this.vRect = {
                x: coords.x - r,
                y: coords.y - r,
                width: r * 2,
                height: r * 2
            };
        }

        if (progress >= 1) {
            this.fret = this.tFret;
            this.string = this.tString;
            this.barreEndString = this.tEndString;
            this.finger = this.tLabel;
            this.transport = this.tTransport;
            this.isBarre = !!this.barreEndString;
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

    private hexToRgba(hex: string, alpha: number): string {
        if (!hex) return `rgba(0, 0, 0, ${alpha})`;
        if (hex.startsWith('rgba')) return hex;

        let c = hex.substring(1).split('');
        if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];

        const r = parseInt(c[0] + c[1], 16);
        const g = parseInt(c[2] + c[3], 16);
        const b = parseInt(c[4] + c[5], 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.vOpacity <= 0) return;

        ctx.save();

        // Apply global transform if dimensions are available
        if (this.canvasDimensions && (this.rotation || this.mirror)) {
            const cx = this.canvasDimensions.width / 2;
            const cy = this.canvasDimensions.height / 2;
            ctx.translate(cx, cy);
            if (this.rotation) ctx.rotate((this.rotation * Math.PI) / 180);
            if (this.mirror) ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);
        }

        // Global Alpha handles visibility transitions (fade in/out), NOT stylistic opacity
        // Multiply with existing alpha to support nested transparency (e.g. from Carousel)
        ctx.globalAlpha = ctx.globalAlpha * this.vOpacity;

        const radius = (this.isBarre ? (this.style.barreFingerRadius || 28) : (this.style.radius || 28)) * this.geometry.scaleFactor;

        // Shadow Logic
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color || "rgba(0,0,0,0.5)";
            ctx.shadowBlur = (this.style.shadow.blur ?? 5) * this.geometry.scaleFactor;
            ctx.shadowOffsetX = (this.style.shadow.offsetX ?? 0) * this.geometry.scaleFactor;
            ctx.shadowOffsetY = (this.style.shadow.offsetY ?? 0) * this.geometry.scaleFactor;
        } else {
            ctx.shadowColor = 'transparent';
        }

        ctx.beginPath();
        // UNIFIED SHAPE: In SHORT neck, always use rounded rect for smooth transitions
        if (this.geometry.neckType === NeckType.SHORT) {
            const thickness = Math.min(this.vRect.width, this.vRect.height);
            const cornerRadius = thickness / 2;
            if (typeof (ctx as any).roundRect === 'function') {
                (ctx as any).roundRect(this.vRect.x, this.vRect.y, this.vRect.width, this.vRect.height, cornerRadius);
            } else {
                ctx.rect(this.vRect.x, this.vRect.y, this.vRect.width, this.vRect.height);
            }
        } else {
            // FULL Neck still uses hard switch for performance/looks if needed, 
            // but we could unify here too if transitions are added to FULL.
            if (this.isBarre) {
                const cornerRadius = this.vRect.width / 2;
                if (typeof (ctx as any).roundRect === 'function') {
                    (ctx as any).roundRect(this.vRect.x, this.vRect.y, this.vRect.width, this.vRect.height, cornerRadius);
                } else {
                    ctx.rect(this.vRect.x, this.vRect.y, this.vRect.width, this.vRect.height);
                }
            } else {
                const centerX = this.vRect.x + this.vRect.width / 2;
                const centerY = this.vRect.y + this.vRect.height / 2;
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            }
        }

        // Apply BG Opacity ONLY to the fill
        const bgOpacity = this.style.opacity ?? 1;
        ctx.fillStyle = this.hexToRgba(this.style.color || "#000000", bgOpacity);
        ctx.fill();

        // Remove shadow for subsequent strokes/text
        ctx.shadowColor = 'transparent';

        if (this.style.border) {
            ctx.strokeStyle = this.style.border.color;
            ctx.lineWidth = (this.style.border.width || 1) * this.geometry.scaleFactor;
            ctx.stroke();
        }

        if (this.vLabel) {
            const centerX = this.vRect.x + this.vRect.width / 2;
            const centerY = this.vRect.y + this.vRect.height / 2;
            ctx.fillStyle = this.style.textColor || "#ffffff";
            const fontSize = (this.style.fontSize || 35) * this.geometry.scaleFactor;
            ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.save();
            ctx.translate(centerX, centerY);

            if (this.mirror) ctx.scale(-1, 1);

            const rot = this.rotation || 0;
            ctx.rotate((-rot * Math.PI) / 180);

            ctx.fillText(this.vLabel.toString(), 0, 0);
            ctx.restore();
        }

        ctx.restore();
    }

    public getBounds() { return this.vRect; }
    public validate(): boolean {
        return this.geometry.validate(this.tFret, this.tString);
    }
}

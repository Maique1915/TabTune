import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps } from "@/modules/core/domain/types";
import { easeInOutQuad } from "../utils/animacao";
import { GeometryProvider, GeometrySettings } from "./components/GeometryProvider";
import { CapoComponent } from "./components/CapoComponent";
import { ChordDrawer } from "./ChordDrawer";
import { detectBarreFromChord as detectBarre } from "./utils/barre-detection";
import { NeckType } from "./components/NeckType";

export class FullNeckDrawer extends BaseDrawer implements FretboardDrawer, ChordDrawer {
    protected _boardY: number = 0;
    protected _stringMargin: number = 0;
    protected _showHeadBackground: boolean = true;
    protected _headstockWidth: number = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        config: { numStrings: number; numFrets: number },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);
        this._numStrings = config.numStrings;
        this._numFrets = config.numFrets;
        this.isHorizontal = true;
        this._geometry = new GeometryProvider(this._getGeometrySettings());
        this.calculateDimensions();
    }

    protected _getGeometrySettings(): GeometrySettings {
        return {
            fretboardX: this._fretboardX,
            fretboardY: this._fretboardY,
            fretboardWidth: this._fretboardWidth,
            fretboardHeight: this._fretboardHeight,
            numStrings: this._numStrings,
            numFrets: this._numFrets,
            stringSpacing: this._stringSpacing,
            realFretSpacing: this._realFretSpacing,
            paddingX: this._horizontalPadding,
            boardY: this._boardY,
            stringMargin: this._stringMargin,
            scaleFactor: this._scaleFactor,
            neckType: NeckType.FULL,
            fingerRadius: this._baseFingerRadius * this._scaleFactor,
            barreWidth: this._baseBarreWidth * this._scaleFactor
        };
    }

    public calculateDimensions(): void {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;
        this._fretboardWidth = CW * 0.82; // Reduced slightly to ensure headstock fits well
        this._fretboardHeight = 350 * this._scaleFactor;

        this._realFretSpacing = this._fretboardWidth / this._numFrets;
        this._headstockWidth = this._realFretSpacing;

        // Horizontal centering considering the headstock
        const totalVisualWidth = this._fretboardWidth + this._headstockWidth;
        const startX = (CW - totalVisualWidth) / 2;
        this._fretboardX = startX + this._headstockWidth;

        // Vertical centering
        this._fretboardY = (CH - this._fretboardHeight) / 2;

        this._stringSpacing = this._fretboardHeight / (this._numStrings + 1);
        this._stringMargin = this._stringSpacing;
        this._boardY = this._fretboardY;

        if (this._geometry) this._geometry.update(this._getGeometrySettings());
    }

    public updateGeometry(w: number, h: number, ns: number, nf: number, sf: number): void {
        this._dimensions = { width: w, height: h };
        this._numStrings = ns;
        this._numFrets = nf;
        this._scaleFactor = sf;
        this.calculateDimensions();
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public drawFretboard(): void {
        this.clear();
        this.drawNeck();
        this.drawFrets();
        this.drawStrings();
        this.drawStringNames(1);
        this.drawCapo();
    }

    public drawNeck(progress: number = 1): void {
        this._ctx.save();
        this.applyTransforms();

        const radius = 20 * this._scaleFactor;

        // Draw Headstock
        if (this._showHeadBackground) {
            this._ctx.save();
            this.applyShadow(this._colors.head?.shadow);
            this._ctx.fillStyle = this._colors.head?.color || "#3a3a3e";

            const headX = this._fretboardX - this._headstockWidth;

            // Rounded corners on the left [TL, TR, BR, BL] -> [radius, 0, 0, radius]
            this._safeRoundRect(
                headX,
                this._fretboardY,
                this._headstockWidth,
                this._fretboardHeight,
                [radius, 0, 0, radius], // Left side rounded
                true
            );

            // Border
            if (this._colors.head?.border?.width && this._colors.head.border.width > 0) {
                this.applyShadow(undefined); // Remove shadow for border to avoid artifact
                this._ctx.lineWidth = this._colors.head.border.width * this._scaleFactor;
                this._ctx.strokeStyle = this._colors.head.border.color || 'transparent';
                this._ctx.stroke();
            }
            this._ctx.restore();
        }

        // Draw Fretboard Neck
        this.applyShadow(this._colors.fretboard.neck.shadow);
        this._ctx.fillStyle = this._colors.fretboard.neck.color || "#1a1a1a";

        // Flat on left to join with headstock: [0, radius, radius, 0]
        const neckRadii = this._showHeadBackground ? [0, radius, radius, 0] : radius;

        this._safeRoundRect(
            this._fretboardX,
            this._fretboardY,
            this._fretboardWidth,
            this._fretboardHeight,
            neckRadii
        );

        this._ctx.restore();
    }

    public drawFrets(): void {
        this._ctx.save();
        this.applyTransforms();
        const color = this._colors.fretboard.frets.color || "#555555";
        const thickness = (this._colors.fretboard.frets.thickness || 3) * this._scaleFactor;
        for (let i = 0; i < this._numFrets; i++) {
            const x = this._fretboardX + i * this._realFretSpacing;
            this._drawLine(x, this._fretboardY, x, this._fretboardY + this._fretboardHeight, color, thickness);
        }
        this._ctx.restore();
    }

    public drawStrings(): void {
        this._ctx.save();
        this.applyTransforms();
        const color = this._colors.fretboard.strings.color || "#cccccc";
        const thickness = (this._colors.fretboard.strings.thickness || 2) * this._scaleFactor;
        for (let i = 1; i <= this._numStrings; i++) {
            const { y } = this.getFingerCoords(0, i);
            this._drawLine(this._fretboardX, y, this._fretboardX + this._fretboardWidth, y, color, thickness);
        }
        this._ctx.restore();
    }

    public drawStringNames(arg: number | string[] | undefined, arg2?: string[]): void {
        if (Array.isArray(arg)) this._stringNames = arg;
        else if (arg2) this._stringNames = arg2;
        this._ctx.save();
        this.applyTransforms();
        const fontSize = 24 * this._scaleFactor;
        this._ctx.font = `bold ${fontSize}px sans-serif`;
        this._ctx.fillStyle = this._colors.global.primaryTextColor || "#ffffff";
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        // Calculate X position: Center of headstock if shown, else slight offset
        const xOffset = this._showHeadBackground ? (this._headstockWidth / 2) : (20 * this._scaleFactor);
        const baseX = this._fretboardX - xOffset;

        for (let i = 1; i <= this._numStrings; i++) {
            const { y } = this.getFingerCoords(0, i);
            const name = this._stringNames[this._numStrings - i] || "";

            this._ctx.save();
            this._ctx.translate(baseX, y);
            if (this._mirror) {
                this._ctx.scale(-1, 1);
                // Center align works for mirror too if we just flip scale at the point
            }
            this._ctx.fillText(name, 0, 0);
            this._ctx.restore();
        }
        this._ctx.restore();
    }

    private drawCapo(): void {
        if (this._globalCapo <= 0) return;
        new CapoComponent(this._globalCapo, {
            color: this._colors.capo?.color || '#c0c0c0',
            border: this._colors.capo?.border || { color: '#808080', width: 2 },
            textColor: this._colors.capo?.textColors?.name || '#2c2c2c',
            opacity: 1
        }, this._geometry).draw(this._ctx);
    }

    protected _drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = width;
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.stroke();
        this._ctx.restore();
    }

    public drawChord(chord: ChordDiagramProps, transport: number, offsetX?: number, options?: any): void {
        if (!options?.skipFretboard) this.drawFretboard();
        const { finalChord } = this.transposeForDisplay(chord, transport);
        this.drawFingers(finalChord);
        this.drawAvoidedStrings(chord.avoid);
        if (finalChord.chordName && !options?.skipChordName) this.drawChordName(finalChord.chordName);
    }

    public drawChordName(name: string, options?: any): void {
        this._ctx.save();
        this.applyTransforms();
        const fontSize = 48 * this._scaleFactor;
        this._ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
        this._ctx.fillStyle = this._colors.global.primaryTextColor || "#ffffff";
        this._ctx.textAlign = "center";
        this._ctx.globalAlpha = options?.opacity ?? 1;
        const x = this._dimensions.width / 2;
        const y = this._fretboardY - 60 * this._scaleFactor;

        this._ctx.save();
        this._ctx.translate(x, y);
        if (this._mirror) this._ctx.scale(-1, 1);
        this._ctx.fillText(name, 0, 0);
        this._ctx.restore();

        this._ctx.restore();
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const barre = detectBarre(chord);
        if (barre) this.drawBarre(barre.fret, barre.startString, barre.endString, barre.finger || 1);
        chord.fingers.forEach(f => {
            if (f.fret > 0) {
                if (barre && f.fret === barre.fret && f.string >= Math.min(barre.startString, barre.endString) && f.string <= Math.max(barre.startString, barre.endString)) return;
                this.drawFinger(f.fret, f.string, f.finger || 1);
            }
        });
    }

    public getFingerCoords(fret: number, string: number) { return this._geometry.getFingerCoords(fret, string); }
    public getBarreCoords(fret: number, startString: number, endString: number) {
        return this._geometry.getBarreRect(fret, startString, endString) as any;
    }
    public validatePosition(fret: number, string: number): boolean { return this._geometry.validate(fret, string); }
    public getChordNameCoords() { return { x: this._dimensions.width / 2, y: this._fretboardY - 100 * this._scaleFactor }; }

    public transposeForDisplay(chord: ChordDiagramProps, transport: number) {
        if (transport <= 1) return { finalChord: chord, transportDisplay: transport };
        return {
            finalChord: { ...chord, fingers: chord.fingers.map(f => ({ ...f, fret: f.fret > 0 ? f.fret - (transport - 1) : 0 })) },
            transportDisplay: transport
        };
    }

    public setGlobalCapo(capo: number) { this._globalCapo = capo; }
    public setStringNames(names: string[] | number | undefined, arg2?: string[]) {
        if (Array.isArray(names)) this._stringNames = names;
        else if (arg2) this._stringNames = arg2;
    }
    public calculateWithOffset(offsetX: number): void { }
    public drawChordWithBuildAnimation(chord: ChordDiagramProps, transport: number, progress: number): void { }
    public drawChordWithTransition(c: ChordDiagramProps, ct: number, n: ChordDiagramProps, nt: number, p: number, ox?: number, opt?: any): void { }
    public drawTransposeIndicator(text: string | number, alignFret?: number): void { }
    public drawTransposeIndicatorWithTransition(cT: number, nT: number, cA: number, nA: number, p: number): void { }

    public drawNeckProgressive(p: number) { this.drawNeck(p); }
    public drawStringsProgressive(p: number) { this.drawStrings(); }
    public drawFretsProgressive(p: number) { this.drawFrets(); }
    public drawAnimatedFretboard(phases: any) { this.drawFretboard(); }

    public setConditionalFlags(sN: boolean, sH: boolean) {
        this._showHeadBackground = sH;
    }
    public setHeadstockGap(g: number) { }
    public setCapo(s: boolean, f: number) { if (s) this._globalCapo = f; }
    public setHideCapoTitle(h: boolean) { }
    public setDiagramX(x: number) { this._fretboardX = x; this.calculateDimensions(); }
    public setDiagramY(y: number) { this._fretboardY = y; this.calculateDimensions(); }
    public setFretboardWidth(w: number) { this._fretboardWidth = w; this.calculateDimensions(); }
    public setFretboardHeight(h: number) { this._fretboardHeight = h; this.calculateDimensions(); }
    public setFretSpacing(s: number) { this._realFretSpacing = s; this.calculateDimensions(); }
    public setHorizontalPadding(p: number) { this._horizontalPadding = p; this.calculateDimensions(); }
    public setStringSpacing(s: number) { this._stringSpacing = s; this.calculateDimensions(); }

    public getGeometry(): GeometryProvider { return this._geometry; }

    public static validateFretLimit(chord: ChordDiagramProps, shift: number): boolean {
        const MAX_FRET = 24;
        if (!chord?.fingers) return true;

        return chord.fingers.every(f => {
            if (f.fret === undefined || f.fret < 0) return true;
            return (f.fret + shift) <= MAX_FRET;
        });
    }
}

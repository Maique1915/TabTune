import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps } from "@/modules/core/domain/types";
import { easeInOutQuad } from "../utils/animacao";
import { GeometryProvider, GeometrySettings } from "./components/GeometryProvider";
import { CapoComponent } from "./components/CapoComponent";
import { ChordDrawer } from "./ChordDrawer";
import { detectBarreFromChord as detectBarre } from "./utils/barre-detection";
import { NeckType } from "./components/NeckType";
import { FullNeckComponent } from "./components/FullNeckComponent";
import { ChordNameComponent } from "./components/ChordNameComponent";

export class FullNeckDrawer extends BaseDrawer implements FretboardDrawer, ChordDrawer {
    protected _boardY: number = 0;
    protected _stringMargin: number = 0;
    protected _showHeadBackground: boolean = true;
    protected _headstockWidth: number = 0;
    protected _fullNeckComp!: FullNeckComponent;

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

        if (!this._fullNeckComp) {
            this._fullNeckComp = new FullNeckComponent(this._geometry, this._colors);
        } else {
            this._fullNeckComp.update(this._geometry, this._colors);
        }
        if (this._stringNames) this._fullNeckComp.setStringNames(this._stringNames);
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
        this._ctx.save();
        this.applyTransforms();
        this._fullNeckComp.draw(this._ctx);
        // Draw Capo separately or included? FullNeckComponent includes drawCapo method but draw() doesn't call it unless I added it?
        // My FullNeckComponent implementation definitely has drawCapo but draw() does NOT call it.
        // So I must call it explicitly.
        this._fullNeckComp.drawCapo(this._ctx, this._globalCapo);
        this._ctx.restore();
    }

    public drawNeck(progress: number = 1): void {
        // Stub: logic moved to Main Component. Use drawFretboard for full redraw.
    }

    public drawFrets(): void {
        // Stub: logic moved.
    }

    public drawStrings(): void {
        // Stub: logic moved.
    }

    public drawInlays(start: number, end: number): void {
        // Stub: logic moved.
    }

    public drawStringNames(arg: number | string[] | undefined, arg2?: string[]): void {
        // Stub: logic moved.
    }

    private drawCapo(): void {
        this._ctx.save();
        this.applyTransforms();
        this._fullNeckComp.drawCapo(this._ctx, this._globalCapo);
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
        const component = new ChordNameComponent(
            name,
            this._dimensions.width / 2,
            this._fretboardY - 60 * this._scaleFactor,
            {
                color: options?.color || this.colors.global.primaryTextColor,
                fontSize: 48,
                opacity: options?.opacity
            },
            this._scaleFactor
        );

        this._ctx.save();
        this.applyTransforms();
        // ChordNameComponent draws at x,y given. getChordNameCoords for FullNeck was centered?
        // FullNeck uses _dimensions.width/2 and _fretboardY - offset.
        // And it applies transforms `this.applyTransforms()`.

        component.draw(this._ctx);
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

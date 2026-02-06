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
import { transposeStringNames } from "./utils/tuning-utils";

export class FullNeckDrawer extends BaseDrawer implements FretboardDrawer, ChordDrawer {
    protected _boardY: number = 0;
    protected _stringMargin: number = 0;
    protected _showHeadBackground: boolean = true;
    protected _headstockWidth: number = 0;
    protected _fullNeckComp!: FullNeckComponent;
    protected _baseStringNames: string[] = ["E", "A", "D", "G", "B", "e"];
    protected override _baseFingerRadius: number = 24;

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
        this._baseBarreWidth = this._baseFingerRadius * 2;
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

    public drawFretboard(transport: number = 1): void {
        this.clear();
        this._ctx.save();
        this.applyTransforms();
        this._fullNeckComp.draw(this._ctx);

        // For FULL neck, we only draw Capo if it's positive.
        // If it's positive, it moves UP the neck.
        if (this._globalCapo > 0) {
            this._fullNeckComp.drawCapo(this._ctx, this._globalCapo, 1); // Draw at absolute fret
        }

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

    private drawCapo(transport: number = 1): void {
        this._ctx.save();
        this.applyTransforms();
        const capoTransport = transport + (this._globalCapo > 0 ? this._globalCapo : 0);
        this._fullNeckComp.drawCapo(this._ctx, this._globalCapo, capoTransport);
        this._ctx.restore();
    }

    public drawChord(chord: ChordDiagramProps, transport: number, offsetX?: number, options?: any): void {
        if (!options?.skipFretboard) this.drawFretboard(transport);
        const { finalChord } = this.transposeForDisplay(chord, transport);
        this.drawFingers(finalChord);
        this.drawAvoidedStrings(chord.avoid);
        if (finalChord.chordName && !options?.skipChordName) this.drawChordName(finalChord.chordName);
    }

    public drawChordName(name: string, options?: any): void {
        const finalColor = options?.color || this._colors.chordName?.color || this._colors.global.primaryTextColor;

        // Consistent offset similar to ShortNeck logic but adapted for Horizontal view
        // FullNeck uses _fretboardY as top of board.
        const component = new ChordNameComponent(
            name,
            this._dimensions.width / 2,
            this._fretboardY - 60 * this._scaleFactor,
            {
                color: finalColor,
                fontSize: 48,
                opacity: options?.opacity ?? this._colors.chordName?.opacity ?? 1
            },
            this._scaleFactor
        );

        this._ctx.save();
        // Removed applyTransforms() to ensure chord name stays centered and upright relative to screen, not scaled/rotated with neck
        component.draw(this._ctx);
        this._ctx.restore();
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const barre = detectBarre(chord);
        // Hide barre if:
        // 1. It's at fret 0 (Nut)
        // 2. It's at the same fret as the Global Capo (Capo replaces the barre)
        const isAtNut = barre && barre.fret <= 0;
        const isAtCapo = barre && this._globalCapo > 0 && barre.fret === this._globalCapo;
        const shouldDrawBarre = barre && !isAtNut && !isAtCapo;

        if (shouldDrawBarre) this.drawBarre(barre.fret, barre.startString, barre.endString, barre.finger || 1);
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

    public override transposeForDisplay(chord: ChordDiagramProps, transport: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        // No transpose logic for Full Neck - just return the chord as-is
        return { finalChord: chord, transportDisplay: transport };
    }

    public setGlobalCapo(capo: number) {
        this._globalCapo = capo;

        // Update string names if it's a DOWN logic (negative)
        if (capo < 0) {
            const transposed = transposeStringNames(this._baseStringNames, capo);
            this.setStringNames(transposed);
        } else {
            // Restore base names if we go back to Standard or Capo
            this.setStringNames(this._baseStringNames);
        }

        this.calculateDimensions();
    }

    public setColors(colors: FretboardTheme): void {
        super.setColors(colors);
        this.calculateDimensions();
    }

    public setTransforms(rotation: 0 | 90 | 180 | 270, mirror: boolean): void {
        // Map Full view to mirror the Short view behavior:
        // 90° => 0° (normal), 270° => 180° (mirror), 180° => mirror
        let mappedRotation: 0 | 90 | 180 | 270 = rotation;
        let mappedMirror = mirror;

        if (rotation === 90) {
            mappedRotation = 0;
            mappedMirror = false;
        } else if (rotation === 270 || rotation === 180) {
            mappedRotation = 0;
            mappedMirror = true;
        }

        super.setTransforms(mappedRotation, mappedMirror);
        this.calculateDimensions();
    }
    public setStringNames(names: string[] | number | undefined, arg2?: string[]) {
        if (Array.isArray(names)) {
            this._stringNames = names;
            // Also update base if it's a direct set and not a shift
            if (this._globalCapo >= 0) {
                this._baseStringNames = [...names];
            }
        }
        else if (arg2) {
            this._stringNames = arg2;
            if (this._globalCapo >= 0) {
                this._baseStringNames = [...arg2];
            }
        }

        if (this._fullNeckComp) {
            this._fullNeckComp.setStringNames(this._stringNames);
        }
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

    public validateFit(chords: ChordDiagramProps[], newCapo: number): boolean {
        // Only positive capo moves fingers up the neck
        const capoShift = newCapo > 0 ? newCapo : 0;

        // Check Capo limit per se
        if (newCapo > 0 && newCapo > this._numFrets) return false;

        return chords.every(chord => {
            if (!chord.fingers) return true;
            return chord.fingers.every(f => {
                if (f.fret === undefined || f.fret <= 0) return true;

                // Finger Fret + Capo Shift
                // Note: We don't have transport info here for each chord unless passed.
                // Assuming standard transport=1 for this validation or that chords are raw.
                // If the user means "chords in timeline", they might have individual transports?
                // Usually validation is done against the raw chord at transport 1.

                const finalFret = f.fret + capoShift;
                return finalFret <= this._numFrets;
            });
        });
    }

    public static validateFretLimit(chord: ChordDiagramProps, shift: number): boolean {
        const MAX_FRET = 24;
        if (!chord?.fingers) return true;

        return chord.fingers.every(f => {
            if (f.fret === undefined || f.fret < 0) return true;
            return (f.fret + shift) <= MAX_FRET;
        });
    }
}
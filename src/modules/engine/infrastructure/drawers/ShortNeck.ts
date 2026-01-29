import { BaseDrawer } from "./BaseDrawer";
import { FretboardDrawer } from "./FretboardDrawer";
import type { FretboardTheme, ChordDiagramProps } from "@/modules/core/domain/types";
import { easeInOutQuad } from "../utils/animacao";
import { GeometryProvider, GeometrySettings } from "./components/GeometryProvider";
import { CapoComponent } from "./components/CapoComponent";
import { ChordDrawer } from "./ChordDrawer";
import { detectBarreFromChord as detectBarre } from "./utils/barre-detection";
import { NeckType } from "./components/NeckType";
import { FingerComponent } from "./components/FingerComponent";
import { TransposeIndicatorComponent } from "./components/TransposeIndicatorComponent";
import { ShortNeckComponent } from "./components/ShortNeckComponent";
import { ChordNameComponent } from "./components/ChordNameComponent";

export class ShortNeckDrawer extends BaseDrawer implements FretboardDrawer, ChordDrawer {
    protected _neckRadius: number = 0;
    protected _stringNamesY: number = 0;
    protected _showHeadBackground: boolean = true;

    protected override _baseNeckRadius: number = 35;
    protected override _baseFingerRadius: number = 32;
    protected override _baseFontSize: number = 42;
    protected override _baseBarreWidth: number = 64;
    protected _capoComp: CapoComponent | null = null;
    protected _shortNeckComp!: ShortNeckComponent;

    protected _effectiveNumFrets: number = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        diagramSettings: {
            diagramWidth: number;
            diagramHeight: number;
            diagramX: number;
            diagramY: number;
            numStrings: number;
            numFrets: number;
            horizontalPadding: number;
            stringSpacing: number;
            fretboardX: number;
            fretboardY: number;
            fretboardWidth: number;
            fretboardHeight: number;
            realFretSpacing: number;
            neckRadius: number;
            stringNamesY: number;
        },
        scaleFactor: number = 1
    ) {
        super(ctx, colors, dimensions, scaleFactor);

        this._diagramWidth = diagramSettings.diagramWidth;
        this._diagramHeight = diagramSettings.diagramHeight;
        this._diagramX = diagramSettings.diagramX;
        this._diagramY = diagramSettings.diagramY;
        this._numStrings = diagramSettings.numStrings || 6;
        this._numFrets = diagramSettings.numFrets || 5;
        this._effectiveNumFrets = this._numFrets; // Initialize
        this._horizontalPadding = diagramSettings.horizontalPadding;
        this._stringSpacing = diagramSettings.stringSpacing;
        this._fretboardX = diagramSettings.fretboardX;
        this._fretboardY = diagramSettings.fretboardY;
        this._fretboardWidth = diagramSettings.fretboardWidth;
        this._fretboardHeight = diagramSettings.fretboardHeight;
        this._realFretSpacing = diagramSettings.realFretSpacing;
        this._neckRadius = diagramSettings.neckRadius;
        this._stringNamesY = diagramSettings.stringNamesY;

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
            numFrets: this._effectiveNumFrets, // Use effective
            stringSpacing: this._stringSpacing,
            realFretSpacing: this._realFretSpacing,
            paddingX: this._horizontalPadding,
            boardY: this._diagramY,
            stringMargin: 0,
            scaleFactor: this._scaleFactor,
            neckType: NeckType.SHORT,
            fingerRadius: this._baseFingerRadius * this._scaleFactor,
            barreWidth: this._baseBarreWidth * this._scaleFactor,
            headstockYOffset: this._headstockYOffset,
            stringNamesY: this._stringNamesY
        };
    }

    public calculateDimensions(): void {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;

        const diagramScale = 0.6;
        this._diagramHeight = CH * diagramScale;

        const baseWidth = (this._diagramHeight * 0.7) / this._scaleFactor;
        const localW = baseWidth * this._scaleFactor;
        const localH = this._diagramHeight;

        // Center vertically, accounting for capo visual extension (80px)
        const capoOffset = this._capoFret > 0 ? 80 : 0;
        this._diagramX = (CW / 2) - (localW / 2);
        this._diagramY = ((CH - localH) / 2) + (capoOffset / 2);

        const headerHeight = 75 * this._scaleFactor;

        this._fretboardX = this._diagramX;
        this._fretboardY = this._diagramY + headerHeight;
        this._fretboardWidth = localW;
        this._fretboardHeight = localH - headerHeight;

        this._horizontalPadding = 30 * this._scaleFactor;
        const fretUsableWidth = this._fretboardWidth - (this._horizontalPadding * 2);

        this._stringSpacing = fretUsableWidth / Math.max(1, this._numStrings - 1);

        // Calculate effective frets based on capo presence
        this._effectiveNumFrets = this._numFrets;
        this._realFretSpacing = this._fretboardHeight / this._effectiveNumFrets;

        this._stringNamesY = this._diagramY + (headerHeight / 2);
        this._neckRadius = 35 * this._scaleFactor;

        // Auto-adjust headstock gap if capo is present
        this._headstockYOffset = this._capoFret > 0 ? -60 * this._scaleFactor : 0;

        if (this._geometry) {
            this._geometry.update(this._getGeometrySettings());
        }

        if (!this._shortNeckComp) {
            this._shortNeckComp = new ShortNeckComponent(this._geometry, this._colors);
        } else {
            this._shortNeckComp.update(this._geometry, this._colors);
        }
        if (this._stringNames) {
            this._shortNeckComp.setStringNames(this._stringNames);
        }
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
        this._showHeadBackground = showHeadBackground;
        // Should update component too if it respects this flag
        // Current ShortNeckComponent implementation always passes showHeadBackground: true or defaults.
        // We might need to expose a setter in component.
        // For now, this property is used by `drawNeck` in original.
        // But `drawNeck` now delegates.
        // We need to update component!
        // this._shortNeckComp.setConditionalFlags(...) // If exists
    }

    protected _headstockYOffset: number = 0;

    public setHeadstockGap(gap: number): void {
        this._headstockYOffset = gap;
        this.calculateDimensions(); // Re-calc triggers component update
    }

    protected _capoFret: number = 0;

    public setCapo(show: boolean, fret: number): void {
        this._capoFret = show ? fret : 0;
        this.calculateDimensions();
    }

    public setHideCapoTitle(hide: boolean): void {
        // No-op for ShortNeck
    }

    public updateGeometry(
        width: number,
        height: number,
        numStrings: number,
        numFrets: number,
        scaleFactor: number
    ): void {
        this._scaleFactor = scaleFactor;
        this.setDimensions({ width, height });
        this.setNumStrings(numStrings);
        this.setNumFrets(numFrets);
        this.calculateDimensions();
    }

    // Stub methods for ChordDrawer compatibility
    public setCanvasDimensions(dimensions: { width: number; height: number }): void {
        this.setDimensions(dimensions);
    }

    // Properties setters
    public setDiagramX(diagramX: number): void {
        this._diagramX = diagramX;
        this.calculateDimensions();
    }
    public setDiagramY(diagramY: number): void {
        this._diagramY = diagramY;
        this.calculateDimensions();
    }
    public setFretboardHeight(height: number): void {
        this._fretboardHeight = height;
        this.calculateDimensions();
    }
    public setFretSpacing(spacing: number): void {
        this._realFretSpacing = spacing;
        this.calculateDimensions();
    }
    public setNumStrings(num: number): void {
        this._numStrings = num;
        this.calculateDimensions();
    }
    public setNumFrets(num: number): void {
        this._numFrets = num;
        this.calculateDimensions();
    }
    public setStringSpacing(spacing: number): void {
        this._stringSpacing = spacing;
        this.calculateDimensions();
    }
    public setFretboardWidth(width: number): void {
        this._fretboardWidth = width;
        this.calculateDimensions();
    }
    public setHorizontalPadding(padding: number): void {
        this._horizontalPadding = padding;
        this.calculateDimensions();
    }
    // Support flexible signature to match ChordDrawer calls [index, names] or [names]
    public setStringNames(arg1: number | string[] | undefined, arg2?: string[]): void {
        if (Array.isArray(arg1)) {
            this._stringNames = arg1;
        } else if (arg2) {
            this._stringNames = arg2;
        }
        if (this._shortNeckComp && this._stringNames) {
            this._shortNeckComp.setStringNames(this._stringNames);
        }
    }

    public setGlobalCapo(capo: number) {
        this._globalCapo = capo;
        this.setCapo(capo > 0, capo);
    }

    public getChordNameCoords(): { x: number; y: number } {
        const visualHeight = this._fretboardHeight + (75 * this._scaleFactor); // Including header
        const offsetN = 100 * this._scaleFactor;

        return {
            x: this._dimensions.width / 2,
            y: (this._dimensions.height / 2) - (visualHeight / 2) - offsetN
        };
    }

    public transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        let finalChord = { ...chord };
        let effectiveTransport = transportDisplay;

        // Auto-transpose for ShortNeck if no transport is provided and fingers are high
        effectiveTransport = FingerComponent.calculateEffectiveTransport(chord.fingers, this._numFrets, transportDisplay);

        if (effectiveTransport > 1) {
            // IDEMPOTENCY CHECK:
            // If any finger (with fret > 0) would result in a negative visual fret,
            // it means the input chord's fingers are PROBABLY already transposed.
            // We only apply transposition if all visual frets remain >= 0.
            const wouldHaveNegativeFrets = chord.fingers.some(f => f.fret > 0 && (f.fret - (effectiveTransport - 1)) < 0);

            if (!wouldHaveNegativeFrets) {
                finalChord = {
                    ...chord,
                    fingers: chord.fingers.map(f => ({
                        ...f,
                        fret: f.fret > 0 ? f.fret - (effectiveTransport - 1) : 0
                    }))
                };
            }
        }
        return { finalChord, transportDisplay: effectiveTransport };
    }

    // Drawing Methods

    public drawFretboard(): void {
        this.drawNeck();
        this.drawStringNames(1);
        this.drawFrets();
        this.drawStrings();
        this.drawCapo();
    }

    public drawNeck(progress: number = 1): void {
        this._ctx.save();
        this.applyTransforms();
        this._shortNeckComp.draw(this._ctx, { neckProgress: progress }, this._rotation, this._mirror);
        this._ctx.restore();
    }

    public drawStringNames(progress: number = 1, customNames?: string[]): void {
        this._ctx.save();
        this.applyTransforms();
        if (customNames) {
            this._shortNeckComp.setStringNames(customNames);
            this._shortNeckComp.draw(this._ctx, { stringNamesProgress: progress }, this._rotation, this._mirror);
            if (this._stringNames) this._shortNeckComp.setStringNames(this._stringNames);
        } else {
            this._shortNeckComp.draw(this._ctx, { stringNamesProgress: progress }, this._rotation, this._mirror);
        }
        this._ctx.restore();
    }

    public drawStrings(): void {
        this._ctx.save();
        this.applyTransforms();
        this._shortNeckComp.draw(this._ctx, { stringsProgress: 1 }, this._rotation, this._mirror);
        this._ctx.restore();
    }

    public drawFrets(): void {
        this._ctx.save();
        this.applyTransforms();
        this._shortNeckComp.draw(this._ctx, { fretsProgress: 1 }, this._rotation, this._mirror);
        this._ctx.restore();
    }

    // Progressive Wrappers
    public drawNeckProgressive(progress: number): void {
        this.drawNeck(progress);
    }

    public drawStringsProgressive(progress: number): void {
        this._ctx.save();
        this.applyTransforms();
        this._shortNeckComp.draw(this._ctx, { stringsProgress: progress }, this._rotation, this._mirror);
        this._ctx.restore();
    }

    public drawFretsProgressive(progress: number): void {
        this.drawFrets();
    }

    public drawAnimatedFretboard(phases: {
        neckProgress: number;
        stringNamesProgress: number;
        stringsProgress: number;
        fretsProgress: number;
        nutProgress?: number;
    }): void {
        if (phases.neckProgress > 0) {
            this.drawNeckProgressive(phases.neckProgress);
        }
        if (phases.stringNamesProgress > 0) {
            this.drawStringNames(phases.stringNamesProgress);
        }
        if (phases.fretsProgress > 0) {
            this.drawFretsProgressive(phases.fretsProgress);
        }
        if (phases.stringsProgress > 0) {
            this.drawStringsProgressive(phases.stringsProgress);
        }
    }



    private drawCapo(): void {
        this._ctx.save();
        this.applyTransforms();
        this._shortNeckComp.drawCapo(this._ctx, this._capoFret, this._rotation, this._mirror);
        this._ctx.restore();
    }



    // ChordDrawer interface stubs
    public drawChord(chord: ChordDiagramProps, transportDisplay: number, offsetX?: number, options?: any): void {
        // Handle optional arguments overloading if needed, but matching interface is better
        // The interface defines: drawChord(chord, transport, offsetX?, options?)

        let opts = options;
        if (typeof offsetX === 'object' && offsetX !== null && options === undefined) {
            // If called as (chord, transport, options), shift args
            opts = offsetX;
        }

        if (!opts?.skipFretboard) {
            this.drawFretboard();
        }

        const { finalChord, transportDisplay: effectiveTransport } = this.transposeForDisplay(chord, transportDisplay);
        this.drawFingers(finalChord);

        const curFingers = finalChord.fingers || [];
        const getMinFret = (fingers: any[]) => {
            let minFret = Infinity;
            for (let i = 0; i < fingers.length; i++) {
                if (fingers[i].fret > 0 && fingers[i].fret < minFret) {
                    minFret = fingers[i].fret;
                }
            }
            return minFret === Infinity ? 1 : minFret;
        };

        this.drawTransposeIndicator(effectiveTransport, getMinFret(curFingers));
        this.drawAvoidedStrings(chord.avoid);

        if (finalChord.chordName && !opts?.skipChordName) {
            this.drawChordName(finalChord.chordName);
        }
    }
    public drawTransposeIndicator(transportDisplay: number, alignFret?: number): void {
        if (transportDisplay <= 1) return;

        const indicatorColor = (this._colors.head?.textColors as any)?.name
            || this._colors.global.primaryTextColor
            || "#ffffff";

        const comp = new TransposeIndicatorComponent(
            NeckType.SHORT,
            transportDisplay,
            alignFret || 1,
            { color: indicatorColor, fontSize: 35 },
            this._geometry
        );
        comp.setRotation(this._rotation, this._mirror, this._dimensions);
        comp.update(1);
        comp.draw(this._ctx);
    }

    public drawTransposeIndicatorWithTransition(curT: number, nxtT: number, curA: number, nxtA: number, progress: number): void {
        const indicatorColor = (this._colors.head?.textColors as any)?.name
            || this._colors.global.primaryTextColor
            || "#ffffff";

        const comp = new TransposeIndicatorComponent(
            NeckType.SHORT,
            curT,
            curA,
            { color: indicatorColor, fontSize: 35 },
            this._geometry
        );
        comp.setRotation(this._rotation, this._mirror, this._dimensions);

        const opacity = Number(progress < 0.5 ? curT : nxtT) > 1 ? 1 : 0;
        comp.setTarget(nxtT, nxtA, opacity);
        comp.update(progress);
        comp.draw(this._ctx);
    }

    public drawChordName(chordName: string, options?: any): void {
        if (!chordName) return;

        const { x, y } = this.getChordNameCoords();
        const component = new ChordNameComponent(
            chordName,
            x,
            y,
            {
                color: options?.color || this._colors.global.primaryTextColor,
                fontSize: options?.fontSize,
                opacity: options?.opacity
            },
            this._scaleFactor
        );

        // Ensure context is clean of transforms for absolute positioning if needed, 
        // or apply transforms if getChordNameCoords expects it.
        // BaseDrawer getChordNameCoords returns center coordinates.
        // ChordNameComponent expects absolute coordinates if we don't translate.
        // ShortNeck.drawChordName previously did NOT apply transforms.

        component.draw(this._ctx);
    }

    public drawFingers(chord: ChordDiagramProps): void {
        const barre = detectBarre(chord);
        if (barre) {
            this.drawBarre(barre.fret, barre.startString, barre.endString, barre.finger || 1);
        }

        chord.fingers.forEach(f => {
            if (f.fret > 0) {
                if (barre && f.fret === barre.fret && f.string >= Math.min(barre.startString, barre.endString) && f.string <= Math.max(barre.startString, barre.endString)) {
                    return;
                }
                this.drawFinger(f.fret, f.string, f.finger || 1);
            }
        });
    }

    public calculateWithOffset(offsetX: number): void { }
    public drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void {
        this.drawChord(chord, transportDisplay, { ...arguments[3], buildProgress: progress });
    }
    public drawChordWithTransition(current: ChordDiagramProps, cTrans: number, next: ChordDiagramProps, nTrans: number, progress: number, offsetX?: number, options?: any): void {
        // Simple transition implementation for fallback
        if (progress < 0.5) {
            this.drawChord(current, cTrans, { ...options, opacity: 1 - progress * 2 });
        } else {
            this.drawChord(next, nTrans, { ...options, opacity: (progress - 0.5) * 2 });
        }
    }
}
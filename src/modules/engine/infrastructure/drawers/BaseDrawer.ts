import type { FretboardTheme, ChordDiagramProps, FingersStyle } from "@/modules/core/domain/types";
import { AvoidComponent } from "./components/AvoidComponent";
import { GeometryProvider, GeometrySettings } from "./components/GeometryProvider";
import { FingerComponent } from "./components/FingerComponent";

/**
 * Base abstract class for all fretboard-related drawers.
 * Centralizes canvas state, color themes, common dimensions, and utility methods.
 */
export abstract class BaseDrawer {
    protected _ctx: CanvasRenderingContext2D;
    protected _colors: FretboardTheme;
    protected _dimensions: { width: number; height: number };
    protected _scaleFactor: number;

    protected _rotation: number = 0;
    protected _mirror: boolean = false;
    protected _skipGlobalTransform: boolean = false;
    public isHorizontal: boolean = false;

    protected _numStrings: number = 6;
    protected _numFrets: number = 5;

    protected _diagramWidth: number = 0;
    protected _diagramHeight: number = 0;
    protected _diagramX: number = 0;
    protected _diagramY: number = 0;

    protected _fretboardWidth: number = 0;
    protected _fretboardHeight: number = 0;
    protected _fretboardX: number = 0;
    protected _fretboardY: number = 0;

    protected _stringSpacing: number = 0;
    protected _realFretSpacing: number = 0;
    protected _horizontalPadding: number = 40;
    protected _stringNamesY: number = 0;

    protected _geometry!: GeometryProvider; // Initialized by sub-classes

    // Constants and base values
    public static readonly BASE_WIDTH: number = 750;

    protected _baseNeckRadius: number = 24;
    protected _baseFingerRadius: number = 28;
    protected _baseFontSize: number = 26;
    protected _baseBarreWidth: number = 56;

    protected _globalCapo: number = 0;
    protected _stringNames: string[] = ["E", "A", "D", "G", "B", "e"];

    public getFingerCoords(fret: number, string: number) { return this._geometry.getFingerCoords(fret, string); }
    public getBarreCoords(fret: number, startString: number, endString: number) {
        return this._geometry.getBarreRect(fret, startString, endString) as any;
    }
    public validatePosition(fret: number, string: number): boolean { return this._geometry.validate(fret, string); }
    public abstract getChordNameCoords(): { x: number; y: number };

    public getPosition(fret: number, string: number): { x: number; y: number } {
        return this.getFingerCoords(fret, string);
    }

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        dimensions: { width: number; height: number },
        scaleFactor: number = 1
    ) {
        this._ctx = ctx;
        this._colors = colors;
        this._dimensions = dimensions;
        this._scaleFactor = scaleFactor;
        this._rotation = colors.global.rotation || 0;
        this._mirror = colors.global.mirror || false;
    }

    // ============ CORE INTERFACE ============

    public abstract calculateDimensions(): void;
    public abstract clear(): void;

    // ============ GETTERS ============

    public get ctx(): CanvasRenderingContext2D { return this._ctx; }
    public get colors(): FretboardTheme { return this._colors; }
    public get dimensions(): { width: number; height: number } { return this._dimensions; }
    public get scaleFactor(): number { return this._scaleFactor; }

    public get rotation(): number { return this._rotation; }
    public get mirror(): boolean { return this._mirror; }
    public get fingerRadius(): number { return this._baseFingerRadius * this._scaleFactor; }
    public get barreWidth(): number { return this._baseBarreWidth * this._scaleFactor; }
    public get neckRadius(): number { return this._baseNeckRadius * this._scaleFactor; }

    public get numStrings(): number { return this._numStrings; }
    public get numFrets(): number { return this._numFrets; }

    public get diagramWidth(): number { return this._diagramWidth; }
    public get diagramHeight(): number { return this._diagramHeight; }
    public get diagramX(): number { return this._diagramX; }
    public get diagramY(): number { return this._diagramY; }

    public get fretboardWidth(): number { return this._fretboardWidth; }
    public get fretboardHeight(): number { return this._fretboardHeight; }
    public get fretboardX(): number { return this._fretboardX; }
    public get fretboardY(): number { return this._fretboardY; }

    public get stringSpacing(): number { return this._stringSpacing; }
    public get realFretSpacing(): number { return this._realFretSpacing; }
    public get horizontalPadding(): number { return this._horizontalPadding; }
    public get stringNamesY(): number { return this._stringNamesY; }

    public transposeForDisplay(chord: ChordDiagramProps, transport: number): { finalChord: ChordDiagramProps, transportDisplay: number } {
        if (transport <= 1) return { finalChord: chord, transportDisplay: transport };
        return {
            finalChord: {
                ...chord,
                fingers: chord.fingers.map(f => ({
                    ...f,
                    fret: f.fret > 0 ? f.fret - (transport - 1) : 0
                }))
            },
            transportDisplay: transport
        };
    }

    public getGeometry(): GeometryProvider { return this._geometry; }

    // ============ SHARED SETTERS ============

    public setCtx(ctx: CanvasRenderingContext2D): void {
        this._ctx = ctx;
    }

    public setColors(colors: FretboardTheme): void {
        this._colors = colors;
        this._rotation = colors.global.rotation || 0;
        this._mirror = colors.global.mirror || false;
    }

    public setDimensions(dimensions: { width: number; height: number }): void {
        this._dimensions = dimensions;
        this.calculateDimensions();
    }

    public setScaleFactor(scale: number): void {
        this._scaleFactor = scale;
        this.calculateDimensions();
    }

    public setTransforms(rotation: 0 | 90 | 180 | 270, mirror: boolean): void {
        this._rotation = rotation || 0;
        this._mirror = mirror || false;
    }

    public setSkipGlobalTransform(skip: boolean): void {
        this._skipGlobalTransform = skip;
    }

    public setNumStrings(num: number): void {
        this._numStrings = num;
        this.calculateDimensions();
    }

    public setNumFrets(num: number): void {
        this._numFrets = num;
        this.calculateDimensions();
    }

    // ============ SHARED UTILITIES ============

    protected hexToRgba(hex: string, alpha: number): string {
        if (!hex || hex[0] !== '#') return hex;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    protected easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    public applyTransforms(): void {
        const centerX = this._dimensions.width / 2;
        const centerY = this._dimensions.height / 2;

        if (this._skipGlobalTransform) return;

        this._ctx.translate(centerX, centerY);
        if (this._rotation) {
            this._ctx.rotate((this._rotation * Math.PI) / 180);
        }
        if (this._mirror) {
            this._ctx.scale(-1, 1);
        }
        this._ctx.translate(-centerX, -centerY);
    }

    protected _safeRoundRect(
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number | number[],
        fill: boolean = true,
        stroke: boolean = false
    ): void {
        this._ctx.beginPath();
        if (typeof this._ctx.roundRect === 'function') {
            try {
                this._ctx.roundRect(x, y, width, height, radius);
            } catch (e) {
                this._ctx.rect(x, y, width, height);
            }
        } else {
            this._ctx.rect(x, y, width, height);
        }
        if (fill) this._ctx.fill();
        if (stroke) this._ctx.stroke();
    }

    protected applyShadow(shadow?: { enabled?: boolean; color?: string; blur?: number; offsetX?: number; offsetY?: number }): void {
        if (shadow?.enabled) {
            this._ctx.shadowColor = shadow.color || "rgba(0,0,0,0.5)";
            this._ctx.shadowBlur = (shadow.blur || 0) * this._scaleFactor;
            this._ctx.shadowOffsetX = (shadow.offsetX || 0) * this._scaleFactor;
            this._ctx.shadowOffsetY = (shadow.offsetY || 0) * this._scaleFactor;
        } else {
            this._ctx.shadowColor = "transparent";
            this._ctx.shadowBlur = 0;
            this._ctx.shadowOffsetX = 0;
            this._ctx.shadowOffsetY = 0;
        }
    }

    /**
     * UNIFIED DRAWING:
     * We use FingerComponent even for static drawing to ensure visual consistency.
     */
    public drawFinger(fret: number, string: number, finger: number | string, color?: string, opacity: number = 1, transport: number = 1): void {
        if (!this.validatePosition(fret, string)) return;
        if (this._globalCapo > 0 && fret === this._globalCapo) return;

        const style: FingersStyle = {
            ...this._colors.fingers,
            radius: this._baseFingerRadius,
            fontSize: this._baseFontSize,
            color: color || this._colors.fingers.color,
            opacity: (this._colors.fingers.opacity ?? 1) * opacity
        };

        const comp = new FingerComponent(fret, string, finger, style, this._geometry, transport);
        comp.setRotation(this._rotation, this._mirror, this._dimensions);
        comp.update(1); // Ensure final static position
        comp.draw(this._ctx);
    }

    public drawBarre(fret: number, startString: number, endString: number, finger: number | string, color?: string, opacity: number = 1, transport: number = 1): void {
        if (fret <= 0) return;
        if (this._globalCapo > 0 && fret === this._globalCapo) return;
        if (!this.validatePosition(fret, startString) || !this.validatePosition(fret, endString)) return;

        const style: FingersStyle = {
            ...this._colors.fingers,
            radius: this._baseFingerRadius,
            fontSize: this._baseFontSize,
            barreWidth: this._baseBarreWidth,
            color: color || this._colors.fingers.color,
            opacity: (this._colors.fingers.opacity ?? 1) * opacity
        };

        const comp = new FingerComponent(fret, startString, finger, style, this._geometry, transport, endString);
        comp.setRotation(this._rotation, this._mirror, this._dimensions);
        comp.update(1);
        comp.draw(this._ctx);
    }

    /**
     * DEPRECATED: use drawFinger or drawBarre
     */
    public drawRawFinger(x: number, y: number, fingerNum: number | string, color: string, opacity: number = 1, radiusScale: number = 1): void {
        // Fallback for very raw drawing if still needed, but discouraged
        this._ctx.save();
        this.applyShadow(this._colors.fingers.shadow);
        this._ctx.fillStyle = this.hexToRgba(color, (this._colors.fingers.opacity ?? 1) * opacity);
        const radius = (this._baseFingerRadius * this._scaleFactor) * radiusScale;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2);
        this._ctx.fill();
        this.applyShadow(undefined);
        this._ctx.strokeStyle = this._colors.fingers.border?.color || '#ffffff';
        this._ctx.lineWidth = (this._colors.fingers.border?.width || 3) * this._scaleFactor;
        this._ctx.stroke();
        this._ctx.restore();
    }

    public drawAvoidedString(string: number): void {
        const comp = new AvoidComponent(string, this._colors.avoid, this._geometry);
        comp.draw(this._ctx);
    }

    public drawAvoidedStrings(avoid?: number[]): void {
        if (!avoid) return;
        avoid.forEach(s => this.drawAvoidedString(s));
    }

    public drawInlays(startFret: number = 0, endFret: number = 24): void {
        // Standard guitar inlay positions
        const inlays = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        const doubleInlays = [12, 24];

        // Safe access to colors
        const style = this._colors.fretboard.board?.inlays || { color: '#555555', opacity: 0.5, shadow: { enabled: false } };

        // Don't draw if fully transparent
        if ((style.opacity ?? 1) <= 0) return;

        this._ctx.save();
        this.applyTransforms();
        this.applyShadow(style.shadow);

        // Use hexToRgba helper or fallback
        this._ctx.fillStyle = this.hexToRgba(style.color || '#555555', style.opacity ?? 0.5);

        // Size of the dot
        const radius = (this._baseFingerRadius * 0.5) * this._scaleFactor;

        // Center string calculation (e.g. 3.5 for 6 strings)
        const centerString = (this._numStrings + 1) / 2;

        inlays.forEach(fret => {
            // Check visibility range
            if (fret < startFret || fret > endFret) return;

            if (doubleInlays.includes(fret)) {
                // Draw double dots
                const spacing = 1.5; // String spacing units
                const topString = Math.max(1, centerString - spacing);
                const bottomString = Math.min(this._numStrings, centerString + spacing);

                const p1 = this.getFingerCoords(fret, topString);
                const p2 = this.getFingerCoords(fret, bottomString);

                this._ctx.beginPath();
                this._ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
                this._ctx.arc(p2.x, p2.y, radius, 0, Math.PI * 2);
                this._ctx.fill();

            } else {
                // Draw single dot
                const p = this.getFingerCoords(fret, centerString);
                this._ctx.beginPath();
                this._ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                this._ctx.fill();
            }
        });

        this._ctx.restore();
    }
}


import { NeckType } from "./NeckType";

export interface GeometrySettings {
    fretboardX: number;
    fretboardY: number;
    fretboardWidth: number;
    fretboardHeight: number;
    numStrings: number;
    numFrets: number;
    stringSpacing: number;
    realFretSpacing: number;
    paddingX: number;
    boardY: number;
    stringMargin: number;
    scaleFactor: number;
    fingerRadius: number;
    barreWidth: number;
    headstockYOffset?: number;
    stringNamesY?: number;
    capoPaddingY?: number;
    neckRadius?: number;
}

/**
 * Handles the conversion between fret/string logical positions and pixel coordinates.
 */
export class GeometryProvider {
    private settings: GeometrySettings;

    constructor(settings: GeometrySettings) {
        this.settings = settings;
    }

    public update(settings: GeometrySettings): void {
        this.settings = settings;
    }

    public getFingerCoords(fret: number, string: number): { x: number; y: number } {
        // Vertical logic (ShortNeck style)
        // Reverse string order: Index 0 (Left) = String 6, Index 5 (Right) = String 1
        const visualIdx = this.settings.numStrings - string;
        const x = this.settings.fretboardX + this.settings.paddingX + visualIdx * this.settings.stringSpacing;
        const y = this.settings.fretboardY + (fret - 0.5) * this.settings.realFretSpacing;
        return { x, y };
    }

    public getBarreRect(fret: number, startString: number, endString: number, barreWidth?: number, fingerRadius?: number): { x: number; y: number; width: number; height: number } {
        const p1 = this.getFingerCoords(fret, startString);
        const p2 = this.getFingerCoords(fret, endString);

        const bWidth = barreWidth || this.settings.barreWidth;
        const fRadius = fingerRadius || this.settings.fingerRadius;

        // Barre is horizontal in coordinate system (spans across strings in SHORT neck)
        const leftX = Math.min(p1.x, p2.x);
        const rightX = Math.max(p1.x, p2.x);
        const spanWidth = Math.abs(rightX - leftX) + (fRadius * 2);

        return {
            x: leftX - fRadius,
            y: p1.y - bWidth / 2,
            width: spanWidth,
            height: bWidth
        };
    }

    public validate(fret: number, string: number): boolean {
        if (fret < 0 || fret > this.settings.numFrets) return false;
        if (string < 1 || string > this.settings.numStrings) return false;
        return true;
    }

    public get scaleFactor(): number { return this.settings.scaleFactor; }
    public get fingerRadius(): number { return this.settings.fingerRadius; }
    public get barreWidth(): number { return this.settings.barreWidth; }
    public get numStrings(): number { return this.settings.numStrings; }
    public get numFrets(): number { return this.settings.numFrets; }
    public get isHorizontal(): boolean { return false; }
    public get fretboardX(): number { return this.settings.fretboardX; }
    public get fretboardY(): number { return this.settings.fretboardY; }
    public get fretboardWidth(): number { return this.settings.fretboardWidth; }
    public get fretboardHeight(): number { return this.settings.fretboardHeight; }
    public get realFretSpacing(): number { return this.settings.realFretSpacing; }
    public get headstockYOffset(): number { return this.settings.headstockYOffset || 0; }
    public get paddingX(): number { return this.settings.paddingX; }
    public get stringSpacing(): number { return this.settings.stringSpacing; }
    public get capoPaddingY(): number | undefined { return this.settings.capoPaddingY; }
    public get neckRadius(): number | undefined { return this.settings.neckRadius; }
    public get boardY(): number { return this.settings.boardY; }
    public get stringMargin(): number { return this.settings.stringMargin; }
    public get stringNamesY(): number | undefined { return this.settings.stringNamesY; }
}

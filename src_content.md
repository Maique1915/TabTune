--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/StringsComponent.ts ---
import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface StringsStyle {
    color: string;
    thickness: number;
    shadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
}

/**
 * StringsComponent - Draws the strings for both FULL and SHORT orientations
 */
export class StringsComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: StringsStyle;
    private geometry: GeometryProvider;
    private horizontalPadding: number;

    constructor(
        neckType: NeckType,
        style: StringsStyle,
        geometry: GeometryProvider,
        options: {
            horizontalPadding?: number;
        } = {}
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;
        this.horizontalPadding = options.horizontalPadding ?? 0;
    }

    public validate(): boolean {
        return true;
    }

    public update(progress: number): void {
        // Animation support
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.style.thickness <= 0) return;

        if (this.neckType === NeckType.FULL) {
            this.drawFullStrings(ctx);
        } else {
            this.drawShortStrings(ctx);
        }
    }

    private drawFullStrings(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const boardY = settings.boardY;
        const stringMargin = settings.stringMargin;
        const stringSpacing = settings.stringSpacing;
        const fretboardWidth = settings.fretboardWidth;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        // Draw horizontal strings
        for (let i = 0; i < numStrings; i++) {
            const y = boardY + stringMargin + i * stringSpacing;
            const thickness = (1.2 + (numStrings - 1 - i) * 0.4) * scaleFactor;

            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = this.style.color;
            ctx.moveTo(fretboardX, y);
            ctx.lineTo(fretboardX + fretboardWidth, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    private drawShortStrings(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const fretboardY = settings.fretboardY;
        const stringSpacing = settings.stringSpacing;
        const fretboardHeight = settings.fretboardHeight;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        const thickness = this.style.thickness * scaleFactor;

        // Draw vertical strings
        for (let i = 0; i < numStrings; i++) {
            const x = fretboardX + this.horizontalPadding + i * stringSpacing;

            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = this.style.color;
            ctx.moveTo(x, fretboardY);
            ctx.lineTo(x, fretboardY + fretboardHeight);
            ctx.stroke();
        }

        ctx.restore();
    }

    public getBounds() {
        const settings = (this.geometry as any).settings;
        return {
            x: settings.fretboardX,
            y: settings.fretboardY,
            width: settings.fretboardWidth,
            height: settings.fretboardHeight
        };
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/FretboardEngine.ts ---
import { ChordDrawer, FingersAnimationDrawer } from "./drawers/ChordDrawer";
import { ShortNeckDrawer } from "./drawers/ShortNeck";
import { ShortFingersAnimation } from "./drawers/ShortFingersAnimation";
import { ChordWithTiming, ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { extensions as extensionMap } from "@/modules/core/domain/chord-logic";

export interface EngineOptions {
    width: number;
    height: number;
    numStrings?: number;
    numFrets?: number;
    colors?: FretboardTheme;
    animationType?: string;
    showChordName?: boolean;
    transitionsEnabled?: boolean;
    buildEnabled?: boolean;
    capo?: number;
    tuning?: string[];
}

export interface AnimationState {
    chordIndex: number;
    transitionProgress: number;
    buildProgress: number;
    // Add other state properties as needed
}

export class FretboardEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Drawers
    private chordDrawer: ChordDrawer | null = null;
    private fingersAnimation: FingersAnimationDrawer | null = null;

    // State
    private dimensions: { width: number; height: number };
    private options: EngineOptions;
    private chords: ChordWithTiming[] = [];
    private previewChord: ChordDiagramProps | null = null;

    private isRunning: boolean = false;
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2D context");
        this.ctx = ctx;
        this.options = options;
        this.dimensions = { width: options.width, height: options.height };

        this.initDrawers();
    }

    private initDrawers() {
        // Currently hardcoded to ShortNeck as per cleanup, but extensive enough to swap if needed
        const drawer = new ShortNeckDrawer(
            this.ctx,
            this.options.colors as any, // Type cast might be needed depending on strictness
            this.dimensions,
            {
                diagramWidth: this.dimensions.width,
                diagramHeight: this.dimensions.height,
                diagramX: 0,
                diagramY: 0,
                numStrings: this.options.numStrings || 6,
                numFrets: this.options.numFrets || 5,
                horizontalPadding: 100,
                stringSpacing: 0, // Calculated internally
                fretboardX: 0,
                fretboardY: 0,
                fretboardWidth: this.dimensions.width,
                fretboardHeight: this.dimensions.height,
                realFretSpacing: 0,
                neckRadius: 0,
                stringNamesY: 0
            }
        );

        if (this.options.tuning) {
            drawer.setStringNames(this.options.tuning);
        }

        if (this.options.capo !== undefined) {
            drawer.setGlobalCapo(this.options.capo);
        }

        this.chordDrawer = drawer;

        this.fingersAnimation = new ShortFingersAnimation();
    }

    public resize(width: number, height: number) {
        this.dimensions = { width, height };
        this.canvas.width = width;
        this.canvas.height = height;
        // Re-init drawers with new dimensions
        this.initDrawers();
        this.drawSingleFrame(); // Force redraw
    }

    public updateOptions(newOptions: Partial<EngineOptions>) {
        this.options = { ...this.options, ...newOptions };
        this.initDrawers(); // Re-init to apply potential theme/layout changes
        if (!this.isRunning) {
            this.drawSingleFrame();
        }
    }

    public setChords(chords: ChordWithTiming[]) {
        this.chords = chords;
        if (!this.isRunning) {
            this.drawSingleFrame();
        }
    }

    public setPreviewChord(chord: ChordDiagramProps | null) {
        this.previewChord = chord;
        if (!this.isRunning) {
            this.drawSingleFrame();
        }
    }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;
        // The loop is expected to be driven externally by drawFrame calls from the React component's raf loop
        // OR we can move the loop here. 
        // For this refactor step, we will expose a draw method that the existing loop calls.
    }

    public stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * The main render function. 
     * @param state The current animation state (calculated externally for now or passed in)
     */
    public drawFrame(state: AnimationState) {
        if (!this.chordDrawer) return;

        // Clear canvas
        this.ctx.fillStyle = this.options.colors?.global?.backgroundColor || '#000000';
        this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);

        this.chordDrawer.drawFretboard();

        if (this.chords && this.chords.length > 0) {
            this.drawChords(state);
        } else if (this.previewChord) {
            this.drawPreviewChord();
        }
    }

    // Allow drawing a single frame without full state (defaults)
    public drawSingleFrame() {
        this.drawFrame({
            chordIndex: 0,
            transitionProgress: 0,
            buildProgress: 1
        });
    }

    private drawChords(state: AnimationState) {
        if (!this.chordDrawer) return;

        const drawer = this.chordDrawer;
        const chordIndex = Math.max(0, Math.min(this.chords.length - 1, Math.floor(state.chordIndex)));
        const currentChordData = this.chords[chordIndex];

        if (!currentChordData) return;

        const animationType = this.options.animationType || 'dynamic-fingers';
        const nextChordData = (chordIndex < this.chords.length - 1) ? this.chords[chordIndex + 1] : null;

        if (animationType === "carousel" && this.fingersAnimation) {
            const allChordsSafe = this.chords.map(c => ({
                finalChord: c.finalChord,
                transportDisplay: c.transportDisplay
            }));

            this.fingersAnimation.draw({
                drawer,
                allChords: allChordsSafe,
                currentIndex: state.chordIndex,
                currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                nextDisplayChord: null, // Not used in carousel mode
                transitionProgress: state.transitionProgress
            });
        } else if (this.fingersAnimation) {
            // Default: static-fingers or dynamic-fingers
            this.fingersAnimation.draw({
                drawer,
                currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                transitionProgress: state.transitionProgress,
                buildProgress: state.buildProgress,
                skipFretboard: true
            });
        } else {
            // Fallback if no animation drawer
            const chordToDraw = { ...currentChordData.finalChord, showChordName: false };
            drawer.drawChord(chordToDraw, currentChordData.transportDisplay);
        }

        // Draw Chord Name
        if (this.options.showChordName && animationType !== "carousel") {
            this.drawChordName(state, currentChordData, nextChordData, chordIndex);
        }
    }

    private drawChordName(state: AnimationState, currentChordData: ChordWithTiming, nextChordData: ChordWithTiming | null, chordIndex: number) {
        if (!this.chordDrawer) return;

        const tp = state.transitionProgress;
        const hasNext = (chordIndex < this.chords.length - 1);
        const transitionsEnabled = this.options.transitionsEnabled ?? true;

        if (transitionsEnabled && tp > 0 && hasNext && nextChordData) {
            const sameName = currentChordData.finalChord.chordName === nextChordData.finalChord.chordName;

            if (sameName) {
                this.drawSingleName(currentChordData);
            } else {
                if (tp < 0.5) {
                    this.drawSingleName(currentChordData);
                } else {
                    this.drawSingleName(nextChordData);
                }
            }
        } else {
            this.drawSingleName(currentChordData);
        }
    }

    private drawSingleName(chordData: ChordWithTiming) {
        if (chordData.finalChord.showChordName !== false && this.chordDrawer) {
            const exts = chordData.finalChord.chord?.extension
                ? chordData.finalChord.chord.extension.map(i => extensionMap[i]).filter((e): e is string => !!e)
                : undefined;
            this.chordDrawer.drawChordName(chordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
        }
    }

    private drawPreviewChord() {
        if (!this.previewChord || !this.chordDrawer) return;

        this.chordDrawer.drawFingers(this.previewChord);
        if (this.options.showChordName && this.previewChord.chordName && this.previewChord.showChordName !== false) {
            const exts = this.previewChord.chord?.extension
                ? this.previewChord.chord.extension.map(i => extensionMap[i]).filter((e): e is string => !!e)
                : undefined;
            this.chordDrawer.drawChordName(this.previewChord.chordName, { extensions: exts });
        }
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/ShortNeck.ts ---
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
import { transposeStringNames } from "./utils/tuning-utils";

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
    protected _transformationIndex: 1 | 2 | 3 = 1;

    protected _baseStringNames: string[] = ["E", "A", "D", "G", "B", "e"];

    protected _effectiveNumFrets: number = 0;
    protected _capoPaddingY: number = 66;

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
            numFrets: this._effectiveNumFrets,
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
            stringNamesY: this._stringNamesY,
            neckRadius: this._neckRadius,
            capoPaddingY: this._capoPaddingY * this._scaleFactor
        };
    }

    public calculateDimensions(): void {
        const CW = this._dimensions.width;
        const CH = this._dimensions.height;

        const diagramScale = 0.6;
        this._diagramHeight = CH * diagramScale;

        // Dynamic Width Calculation based on String Count
        // Standard ratio 0.7 is ideal for 6 strings (5 gaps).
        // specificRatio = 0.7 / 5 = 0.14 per gap.
        const ratioPerGap = 0.14;
        const effectiveGaps = Math.max(1, this._numStrings - 1);
        const effectiveRatio = ratioPerGap * effectiveGaps;

        // Apply a small base width for the "neck" itself plus the gaps
        // Or simply scale strictly:
        const baseWidth = (this._diagramHeight * effectiveRatio) / this._scaleFactor;

        const localW = baseWidth * this._scaleFactor;
        const localH = this._diagramHeight;

        // Stable diagram centering
        this._diagramX = (CW / 2) - (localW / 2);
        this._diagramY = (CH - localH) / 2;

        const headerHeight = 75 * this._scaleFactor;

        this._fretboardX = this._diagramX;
        this._fretboardY = this._diagramY + headerHeight;
        this._fretboardWidth = localW;
        this._fretboardHeight = localH - headerHeight;

        this._horizontalPadding = 30 * this._scaleFactor;
        const fretUsableWidth = this._fretboardWidth - (this._horizontalPadding * 2);
        this._stringSpacing = fretUsableWidth / Math.max(1, this._numStrings - 1);

        this._effectiveNumFrets = this._numFrets;
        this._realFretSpacing = this._fretboardHeight / this._effectiveNumFrets;

        this._stringNamesY = this._diagramY + (headerHeight / 2);
        this._neckRadius = 35 * this._scaleFactor;

        // Move headstock up if capo is present
        if (this._capoFret > 0) {
            this._headstockYOffset = -this._capoPaddingY * this._scaleFactor;
        } else {
            this._headstockYOffset = 0;
        }

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

    public override applyTransforms(): void {
        // Explicitly handle the three transformation views
        if (this._transformationIndex === 1) {
            // Case 1: Vertical (Normal)
            if (this._rotation !== 0 || this._mirror) {
                super.applyTransforms();
            }
        } else {
            // Case 2 & 3: Horizontal views
            super.applyTransforms();
        }
    }

    public clear(): void {
        this._ctx.fillStyle = this._colors.global.backgroundColor || "#000000";
        this._ctx.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
    }

    public setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void {
        this._showHeadBackground = showHeadBackground;
    }

    protected _headstockYOffset: number = 0;

    public setHeadstockGap(gap: number): void {
        this._headstockYOffset = gap;
        this.calculateDimensions();
    }

    protected _capoFret: number = 0;

    public setTransforms(rotation: 0 | 90 | 180 | 270, mirror: boolean): void {
        super.setTransforms(rotation, mirror);

        if (rotation === 0 || rotation === 180) {
            this._transformationIndex = 1;
        } else if (rotation === 90) {
            this._transformationIndex = 3;
        } else if (rotation === 270) {
            this._transformationIndex = 2;
        }

        this.calculateDimensions();
    }

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

    public setCanvasDimensions(dimensions: { width: number; height: number }): void {
        this.setDimensions(dimensions);
    }

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
        this._effectiveNumFrets = num;
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

    public setStringNames(arg1: number | string[] | undefined, arg2?: string[]): void {
        let names: string[] | undefined;

        if (Array.isArray(arg1)) {
            names = arg1;
        } else if (arg2) {
            names = arg2;
        }

        if (names) {
            // Always set as base, because this method is the entry point for tuning changes
            this._baseStringNames = [...names];
            this._stringNames = names;
        }

        // If we have a negative capo, re-apply transposition from the BASE
        if (this._globalCapo < 0 && this._baseStringNames) {
            const transposed = transposeStringNames(this._baseStringNames, this._globalCapo);
            this._stringNames = transposed;
        } else if (this._globalCapo >= 0 && this._baseStringNames) {
            // Ensure we are using base names if capo is positive/zero
            this._stringNames = [...this._baseStringNames];
        }

        if (this._shortNeckComp && this._stringNames) {
            this._shortNeckComp.setStringNames(this._stringNames);
        }
    }

    public setGlobalCapo(capo: number) {
        this._globalCapo = capo;
        this.setCapo(capo > 0, capo);

        // Refresh string names using the current base and new capo
        if (this._baseStringNames) {
            this.setStringNames(this._baseStringNames);
        }
    }

    public getChordNameCoords(): { x: number; y: number } {
        const visualHeight = this._fretboardHeight + (75 * this._scaleFactor);
        const offsetN = 100 * this._scaleFactor;

        return {
            x: this._dimensions.width / 2,
            y: (this._dimensions.height / 2) - (visualHeight / 2) - offsetN
        };
    }

    public override transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps; transportDisplay: number } {
        let finalChord = chord;

        // Calculate effective transport if not explicitly provided (or default 1)
        // This ensures that if a chord exceeds the visual neck length (numFrets), 
        // it gets visually transported to start from fret 1.
        const effectiveTransport = FingerComponent.calculateEffectiveTransport(
            chord.fingers,
            this._effectiveNumFrets,
            transportDisplay
        );

        if (effectiveTransport > 1) {
            finalChord = {
                ...chord,
                fingers: chord.fingers.map(f => ({
                    ...f,
                    fret: f.fret > 0 ? f.fret - (effectiveTransport - 1) : 0
                }))
            };
        }
        return { finalChord, transportDisplay: effectiveTransport };
    }

    // Drawing Methods

    public drawFretboard(transport: number = 1): void {
        this.drawNeck();
        this.drawStringNames(1);
        this.drawFrets();
        this.drawStrings();
        if (this._capoFret > 0) {
            this.drawCapo(this._capoFret);
        }
    }

    public drawNeck(progress: number = 1): void {
        this._shortNeckComp.draw(this._ctx, { neckProgress: progress }, this._rotation, this._mirror);
    }

    public drawStringNames(progress: number = 1, customNames?: string[]): void {
        if (customNames) {
            this._shortNeckComp.setStringNames(customNames);
            this._shortNeckComp.draw(this._ctx, { stringNamesProgress: progress }, this._rotation, this._mirror);
            if (this._stringNames) this._shortNeckComp.setStringNames(this._stringNames);
        } else {
            this._shortNeckComp.draw(this._ctx, { stringNamesProgress: progress }, this._rotation, this._mirror);
        }
    }

    public drawStrings(): void {
        this._shortNeckComp.draw(this._ctx, { stringsProgress: 1 }, this._rotation, this._mirror);
    }

    public drawFrets(): void {
        this._shortNeckComp.draw(this._ctx, { fretsProgress: 1 }, this._rotation, this._mirror);
    }

    public drawCapo(capoFret: number): void {
        this._shortNeckComp.drawCapo(this._ctx, capoFret, this._rotation, this._mirror);
    }

    public drawNeckProgressive(progress: number): void {
        this.drawNeck(progress);
    }

    public drawStringsProgressive(progress: number): void {
        this._shortNeckComp.draw(this._ctx, { stringsProgress: progress }, this._rotation, this._mirror);
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
        if (phases.neckProgress > 0) this.drawNeckProgressive(phases.neckProgress);
        if (phases.stringNamesProgress > 0) this.drawStringNames(phases.stringNamesProgress);
        if (phases.fretsProgress > 0) this.drawFretsProgressive(phases.fretsProgress);
        if (phases.stringsProgress > 0) this.drawStringsProgressive(phases.stringsProgress);
    }

    public drawChord(chord: ChordDiagramProps, transportDisplay: number, offsetX?: number, options?: any): void {
        let opts = options;
        if (typeof offsetX === 'object' && offsetX !== null && options === undefined) {
            opts = offsetX;
        }

        const { finalChord, transportDisplay: effectiveTransport } = this.transposeForDisplay(chord, transportDisplay);
        this._ctx.save();

        // CONDITIONAL FOR EACH TRANSFORMATION
        if (this._transformationIndex === 1) {
            if (this._rotation !== 0 || this._mirror) {
                this.applyTransforms();
            }
        } else {
            this.applyTransforms();
        }

        if (!opts?.skipFretboard) {
            this.drawFretboard();
        }

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

        this._ctx.restore();

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

    public drawBarre(fret: number, startString: number, endString: number, finger: number | string, color?: string, opacity: number = 1, transport: number = 1): void {
        const style = {
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

    public drawFinger(fret: number, string: number, finger: number | string, color?: string, opacity: number = 1, transport: number = 1): void {
        const style = {
            ...this._colors.fingers,
            radius: this._baseFingerRadius,
            fontSize: this._baseFontSize,
            color: color || this._colors.fingers.color,
            opacity: (this._colors.fingers.opacity ?? 1) * opacity
        };
        const comp = new FingerComponent(fret, string, finger, style, this._geometry, transport);
        comp.setRotation(this._rotation, this._mirror, this._dimensions);
        comp.update(1);
        comp.draw(this._ctx);
    }

    public calculateWithOffset(offsetX: number): void { }
    public drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void {
        this.drawChord(chord, transportDisplay, { ...arguments[3], buildProgress: progress });
    }
    public drawChordWithTransition(current: ChordDiagramProps, cTrans: number, next: ChordDiagramProps, nTrans: number, progress: number, offsetX?: number, options?: any): void {
        if (progress < 0.5) {
            this.drawChord(current, cTrans, { ...options, opacity: 1 - progress * 2 });
        } else {
            this.drawChord(next, nTrans, { ...options, opacity: (progress - 0.5) * 2 });
        }
    }
}
--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/CapoComponent.ts ---
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
            // For FullNeck, we now pass transport=1 to keep absolute position.
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
        if (this.geometry.neckType === NeckType.SHORT) {
            this.drawShort(ctx);
        } else {
            this.drawFull(ctx);
        }
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

        this.drawRotatedText(ctx, "C A P O", centerX, centerY, font, textColor);

        // Draw Number
        const displayFret = this.options?.displayFret ?? this.fret;
        if (displayFret > 0) {
            const numX = fretboardX - 35 * scaleFactor;
            const numY = centerY;
            const numFont = `bold ${32 * scaleFactor}px sans-serif`;
            const numColor = this.style.color || this.style.textColor;
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

    private drawFull(ctx: CanvasRenderingContext2D): void {
        const p1 = this.geometry.getFingerCoords(this.vFret, this.geometry.numStrings);
        const p2 = this.geometry.getFingerCoords(this.vFret, 1);

        const overhang = 25 * this.geometry.scaleFactor;
        const thickness = 35 * this.geometry.scaleFactor;

        ctx.save();
        ctx.globalAlpha = this.vOpacity;

        const rectX = p1.x - thickness / 2;
        const rectY = Math.min(p1.y, p2.y) - overhang;
        const rectW = thickness;
        const rectH = Math.abs(p1.y - p2.y) + overhang * 2;

        ctx.fillStyle = this.style.color;
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(rectX, rectY, rectW, rectH, 8 * this.geometry.scaleFactor);
        } else {
            ctx.rect(rectX, rectY, rectW, rectH);
        }
        ctx.fill();

        ctx.strokeStyle = this.style.border?.color || "#000000";
        ctx.lineWidth = (this.style.border?.width || 2) * this.geometry.scaleFactor;
        ctx.stroke();

        ctx.fillStyle = this.style.textColor || "#ffffff";
        ctx.font = `900 ${thickness * 0.45}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const letters = ["C", "A", "P", "O"];
        const segmentHeight = rectH / 4;
        letters.forEach((char, i) => {
            const charX = p1.x;
            const charY = rectY + (i * segmentHeight) + (segmentHeight / 2);

            if (this.rotation !== 0 || this.mirror) {
                ctx.save();
                ctx.translate(charX, charY);
                if (this.mirror) ctx.scale(-1, 1);
                if (this.rotation !== 0) ctx.rotate((-this.rotation * Math.PI) / 180);
                ctx.fillText(char, 0, 0);
                ctx.restore();
            } else {
                ctx.fillText(char, charX, charY);
            }
        });

        ctx.restore();
    }

    public getBounds() {
        const p1 = this.geometry.getFingerCoords(this.vFret, this.geometry.numStrings);
        const p2 = this.geometry.getFingerCoords(this.vFret, 1);
        const overhang = 25 * this.geometry.scaleFactor;
        const thickness = 35 * this.geometry.scaleFactor;

        if (this.geometry.neckType === NeckType.FULL) {
            return {
                x: p1.x - thickness / 2,
                y: Math.min(p1.y, p2.y) - overhang,
                width: thickness,
                height: Math.abs(p1.y - p2.y) + overhang * 2
            };
        } else {
            // Updated bounds for Short logic if needed, or keep generic approximation
            // Using logic from drawShort to approximate bounds
            const fretboardWidth = this.geometry.fretboardWidth;
            const scaleFactor = this.geometry.scaleFactor;
            const fretboardX = this.geometry.fretboardX;
            const fretboardY = this.geometry.fretboardY;
            const headstockYOffset = this.geometry.headstockYOffset;
            const capoHeight = 35 * scaleFactor;
            const capoY = fretboardY - (capoHeight / 2) - (2 * scaleFactor) + 27;

            return {
                x: fretboardX - 5 * scaleFactor,
                y: capoY,
                width: fretboardWidth + 10 * scaleFactor,
                height: capoHeight
            };
        }
    }

    public setFret(fret: number) { this.fret = this.sFret = this.tFret = fret; this.syncVisuals(1); }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/GeometryProvider.ts ---
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
    neckType: NeckType;
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
        if (this.settings.neckType === NeckType.FULL) {
            // X is fret based
            const x = this.settings.fretboardX + (fret - 0.5) * this.settings.realFretSpacing;
            // Y is string based (Mi Grave / string 6 at top = index 0)
            const visualIdx = this.settings.numStrings - string;
            const y = this.settings.boardY + this.settings.stringMargin + visualIdx * this.settings.stringSpacing;
            return { x, y };
        } else {
            // Vertical logic (ShortNeck style)
            // Reverse string order: Index 0 (Left) = String 6, Index 5 (Right) = String 1
            const visualIdx = this.settings.numStrings - string;
            const x = this.settings.fretboardX + this.settings.paddingX + visualIdx * this.settings.stringSpacing;
            const y = this.settings.fretboardY + (fret - 0.5) * this.settings.realFretSpacing;
            return { x, y };
        }
    }

    public getBarreRect(fret: number, startString: number, endString: number, barreWidth?: number, fingerRadius?: number): { x: number; y: number; width: number; height: number } {
        const p1 = this.getFingerCoords(fret, startString);
        const p2 = this.getFingerCoords(fret, endString);

        const bWidth = barreWidth || this.settings.barreWidth;
        const fRadius = fingerRadius || this.settings.fingerRadius;

        const isHorizontalInCoords = Math.abs(p1.y - p2.y) < 1;

        if (isHorizontalInCoords) {
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
        } else {
            // Barre is vertical in coordinate system (spans across strings in FULL neck)
            const topY = Math.min(p1.y, p2.y) - fRadius;
            const bottomY = Math.max(p1.y, p2.y) + fRadius;
            const height = bottomY - topY;
            return {
                x: p1.x - bWidth / 2,
                y: topY,
                width: bWidth,
                height: height
            };
        }
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
    public get neckType(): NeckType { return this.settings.neckType; }
    public get isHorizontal(): boolean { return this.settings.neckType === NeckType.FULL; }
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

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/StringNamesComponent.ts ---
import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface StringNamesStyle {
    color: string;
    fontSize: number;
}

/**
 * StringNamesComponent - Draws string names (E, A, D, G, B, e) for both FULL and SHORT orientations
 */
export class StringNamesComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: StringNamesStyle;
    private geometry: GeometryProvider;
    private stringNames: string[];
    private horizontalPadding: number;

    // For FULL neck
    private headWidth?: number;

    // For SHORT neck
    private stringNamesY?: number;
    private headstockYOffset?: number;

    private rotation: number = 0;
    private mirror: boolean = false;

    constructor(
        neckType: NeckType,
        stringNames: string[],
        style: StringNamesStyle,
        geometry: GeometryProvider,
        options: {
            horizontalPadding?: number;
            headWidth?: number;
            stringNamesY?: number;
            headstockYOffset?: number;
        } = {}
    ) {
        this.neckType = neckType;
        this.stringNames = stringNames;
        this.style = style;
        this.geometry = geometry;
        this.horizontalPadding = options.horizontalPadding ?? 0;
        this.headWidth = options.headWidth;
        this.stringNamesY = options.stringNamesY;
        this.headstockYOffset = options.headstockYOffset ?? 0;
    }

    public validate(): boolean {
        return true;
    }

    public update(progress: number): void {
        // Animation support
    }

    public setRotation(rotation: number, mirror: boolean): void {
        this.rotation = rotation;
        this.mirror = mirror;
    }

    public draw(ctx: CanvasRenderingContext2D, progress: number = 1): void {
        if (this.neckType === NeckType.FULL) {
            this.drawFullStringNames(ctx);
        } else {
            this.drawShortStringNames(ctx, progress);
        }
    }

    private drawFullStringNames(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const boardY = settings.boardY;
        const stringMargin = settings.stringMargin;
        const stringSpacing = settings.stringSpacing;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        const headWidth = this.headWidth ?? (this.geometry.realFretSpacing || 45 * scaleFactor);
        const centerX = fretboardX - headWidth / 2 - 5 * scaleFactor;

        ctx.save();
        ctx.fillStyle = this.style.color;
        ctx.font = `bold ${this.style.fontSize * scaleFactor}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < numStrings; i++) {
            const y = boardY + stringMargin + i * stringSpacing;
            const name = this.stringNames[i] || "";
            const textY = y + 4 * scaleFactor;

            if (this.rotation !== 0 || this.mirror) {
                // Counter-rotate logic to keep text upright and un-mirrored
                ctx.save();
                ctx.translate(centerX, textY);
                if (this.mirror) ctx.scale(-1, 1);
                if (this.rotation !== 0) ctx.rotate((-this.rotation * Math.PI) / 180);

                ctx.fillText(name, 0, 0);
                ctx.restore();
            } else {
                ctx.fillText(name, centerX, textY);
            }
        }

        ctx.restore();
    }

    private drawShortStringNames(ctx: CanvasRenderingContext2D, progress: number): void {
        if (this.stringNamesY === undefined) return;

        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const stringSpacing = settings.stringSpacing;
        const numStrings = settings.numStrings;
        const scaleFactor = settings.scaleFactor;

        const easedProgress = this.easeInOutQuad(progress);
        const translateY = (1 - easedProgress) * (-10 * scaleFactor);

        ctx.save();
        ctx.fillStyle = this.style.color;
        ctx.font = `bold ${this.style.fontSize * scaleFactor}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        this.stringNames.forEach((name, i) => {
            if (i >= numStrings) return;

            const x = fretboardX + this.horizontalPadding + i * stringSpacing;
            const y = this.stringNamesY! + translateY + (this.headstockYOffset ?? 0);

            if (this.rotation !== 0 || this.mirror) {
                // Counter-rotate logic to keep text upright
                ctx.save();
                ctx.translate(x, y);
                if (this.mirror) ctx.scale(-1, 1);
                if (this.rotation !== 0) ctx.rotate((-this.rotation * Math.PI) / 180);

                ctx.fillText(name, 0, 0);
                ctx.restore();
            } else {
                ctx.fillText(name, x, y);
            }
        });

        ctx.restore();
    }

    private easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    public getBounds() {
        const settings = (this.geometry as any).settings;
        return {
            x: settings.fretboardX,
            y: settings.fretboardY,
            width: settings.fretboardWidth,
            height: settings.fretboardHeight
        };
    }

    public setStringNames(names: string[]): void {
        this.stringNames = names;
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/FretsComponent.ts ---
import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface FretsStyle {
    color: string;
    thickness: number;
    shadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
}

/**
 * FretsComponent - Draws the frets for both FULL and SHORT orientations
 */
export class FretsComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: FretsStyle;
    private geometry: GeometryProvider;
    private showNut: boolean;

    constructor(
        neckType: NeckType,
        style: FretsStyle,
        geometry: GeometryProvider,
        options: {
            showNut?: boolean;
        } = {}
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;
        this.showNut = options.showNut ?? true;
    }

    public validate(): boolean {
        return true;
    }

    public update(progress: number): void {
        // Animation support
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.neckType === NeckType.FULL) {
            this.drawFullFrets(ctx);
        } else {
            this.drawShortFrets(ctx);
        }
    }

    private drawFullFrets(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const boardY = settings.boardY;
        const fretboardHeight = settings.fretboardHeight;
        const numFrets = settings.numFrets;
        const fretWidth = settings.fretboardWidth / numFrets;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        ctx.strokeStyle = this.style.color;
        ctx.lineWidth = this.style.thickness * scaleFactor;
        ctx.beginPath();

        // Draw vertical fret lines
        for (let i = 1; i <= numFrets; i++) {
            const x = fretboardX + i * fretWidth;
            ctx.moveTo(x, boardY);
            ctx.lineTo(x, boardY + fretboardHeight);
        }

        ctx.stroke();

        // Draw nut (thicker first fret)
        if (this.showNut) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 4 * scaleFactor;
            ctx.beginPath();
            ctx.moveTo(fretboardX, boardY);
            ctx.lineTo(fretboardX, boardY + fretboardHeight);
            ctx.stroke();
        }

        ctx.restore();
    }

    private drawShortFrets(ctx: CanvasRenderingContext2D): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const fretboardY = settings.fretboardY;
        const fretboardWidth = settings.fretboardWidth;
        const realFretSpacing = settings.realFretSpacing;
        const numFrets = settings.numFrets;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        ctx.strokeStyle = this.style.color;
        ctx.lineWidth = this.style.thickness * scaleFactor;

        // Draw horizontal fret lines
        for (let i = 0; i < numFrets; i++) {
            const y = fretboardY + i * realFretSpacing;

            ctx.beginPath();
            ctx.moveTo(fretboardX, y);
            ctx.lineTo(fretboardX + fretboardWidth, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    public getBounds() {
        const settings = (this.geometry as any).settings;
        return {
            x: settings.fretboardX,
            y: settings.fretboardY,
            width: settings.fretboardWidth,
            height: settings.fretboardHeight
        };
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/FullNeckComponent.ts ---
import { NeckComponent } from "./NeckComponent";
import { FretsComponent } from "./FretsComponent";
import { StringsComponent } from "./StringsComponent";
import { StringNamesComponent } from "./StringNamesComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";
import { FretboardTheme } from "@/modules/core/domain/types";
import { CapoComponent } from "./CapoComponent";

export class FullNeckComponent {
    private neck!: NeckComponent;
    private frets!: FretsComponent;
    private strings!: StringsComponent;
    private stringNames!: StringNamesComponent;
    private geometry: GeometryProvider;
    private theme: FretboardTheme;

    constructor(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.updateComponents();
    }

    public update(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.updateComponents();
    }

    private _mapShadow(s: any) {
        if (!s) return undefined;
        return {
            enabled: !!s.enabled,
            color: s.color || '#000000',
            blur: s.blur || 0,
            offsetX: s.offsetX || 0,
            offsetY: s.offsetY || 0
        };
    }

    private _mapBorder(b: any) {
        if (!b) return undefined;
        return {
            color: b.color || 'transparent',
            width: b.width || 0
        };
    }

    private updateComponents() {
        const settings = (this.geometry as any).settings;

        this.neck = new NeckComponent(
            NeckType.FULL,
            {
                color: this.theme.fretboard.neck.color || "#1a1a1a",
                shadow: this._mapShadow(this.theme.fretboard.neck.shadow),
                headColor: this.theme.head?.color || "#3a3a3e",
                headShadow: this._mapShadow(this.theme.head?.shadow),
                headBorder: this._mapBorder(this.theme.head?.border)
            },
            this.geometry,
            {
                showHeadBackground: true,
                neckRadius: settings.neckRadius, // 16 * scale inherited
                headWidth: settings.realFretSpacing
            }
        );

        this.frets = new FretsComponent(
            NeckType.FULL,
            {
                color: this.theme.fretboard.frets.color || "#555555",
                thickness: this.theme.fretboard.frets.thickness || 3,
                shadow: this._mapShadow(this.theme.fretboard.frets.shadow)
            },
            this.geometry,
            {
                showNut: true
            }
        );

        this.strings = new StringsComponent(
            NeckType.FULL,
            {
                color: this.theme.fretboard.strings.color || "#cccccc",
                thickness: this.theme.fretboard.strings.thickness || 2,
                shadow: this._mapShadow(this.theme.fretboard.strings.shadow)
            },
            this.geometry
        );

        this.stringNames = new StringNamesComponent(
            NeckType.FULL,
            ["E", "A", "D", "G", "B", "e"],
            {
                color: this.theme.global.primaryTextColor || "#ffffff",
                fontSize: 24
            },
            this.geometry,
            {
                // FullNeck calculates specific offsets for headstock width
                headWidth: settings.realFretSpacing // Headstock width logic from FullNeck.ts
            }
        );

        const rotation = this.theme.global.rotation || 0;
        const mirror = this.theme.global.mirror || false;
        this.stringNames.setRotation(rotation, mirror);
    }

    public setStringNames(names: string[]) {
        this.stringNames.setStringNames(names);
    }

    public draw(ctx: CanvasRenderingContext2D, phases?: any) {
        // FullNeck currently doesn't implement progressive drawing in the same way as ShortNeck (stubs in FullNeck.ts),
        // but it generally draws everything.

        ctx.save();
        // Global transforms are handled by the Drawer before calling components?
        // Wait, BaseDrawer applies transforms. Components typically don't apply global transforms themselves unless specified.
        // But NeckComponent, FretsComponent, etc. currently don't apply transforms internally EXCEPT for shadows/etc?
        // Actually, looking at ShortNeck.ts/FullNeck.ts, they call `this.applyTransforms()` inside the draw methods.
        // IF I move logic to components, components usually assume the Context is already transformed OR they handle it.
        // 
        // Let's look at `NeckComponent.ts`. 
        // It does `if (this.style.shadow?.enabled) ...` but it does NOT call `ctx.translate/rotate`.
        // 
        // `ShortNeck.ts` calls `this.applyTransforms()` before drawing neck, frets, strings.
        // So `ShortNeckComponent` should probably be called *after* transform is applied, OR `ShortNeckComponent` should apply it.
        // 
        // In `ShortNeck.ts`, `drawChordName` does NOT apply transforms (absolute).
        // 
        // Ideally, `ShortNeckDrawer` applies transform, then calls `ShortNeckComponent.draw()`.

        this.neck.draw(ctx);
        this.frets.draw(ctx);

        // Inlays logic was in `BaseDrawer` but `FullNeck` calls `drawInlays`. 
        // `BaseDrawer.drawInlays` is reused. 
        // We should arguably move Inlays to a component too or `FullNeckComponent` call `BaseDrawer.drawInlays` if possible?
        // No, `FullNeckComponent` doesn't inherit BaseDrawer.
        // `BaseDrawer.drawInlays` uses `this.getFingerCoords`. `GeometryProvider` has that.
        // So we can implement `drawInlays` in `FullNeckComponent` using geometry.

        this.drawInlays(ctx);

        this.strings.draw(ctx);
        this.stringNames.draw(ctx);

        ctx.restore();
    }

    public drawCapo(ctx: CanvasRenderingContext2D, globalCapo: number, transport: number = 1) {
        if (globalCapo <= 0) return;
        const capo = new CapoComponent(globalCapo, {
            color: this.theme.capo?.color || '#c0c0c0',
            border: this.theme.capo?.border || { color: '#808080', width: 2 },
            textColor: this.theme.capo?.textColors?.name || '#2c2c2c',
            opacity: 1
        }, this.geometry, { transport });

        const rotation = this.theme.global.rotation || 0;
        const mirror = this.theme.global.mirror || false;
        capo.setRotation(rotation, mirror);

        capo.draw(ctx);
    }

    private drawInlays(ctx: CanvasRenderingContext2D) {
        // Ported from BaseDrawer since we want component to handle everything
        const inlays = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        const doubleInlays = [12, 24];
        const style = this.theme.fretboard.board?.inlays || { color: '#555555', opacity: 0.5 };

        if ((style.opacity ?? 1) <= 0) return;

        ctx.save();
        // Shadow?

        const scaleFactor = (this.geometry as any).settings.scaleFactor; // Access internal settings if public?

        const radius = (28 * 0.5) * scaleFactor; // 28 is baseFingerRadius
        const numStrings = (this.geometry as any).settings.numStrings;
        const centerString = (numStrings + 1) / 2;

        ctx.fillStyle = this.theme.fretboard.board?.inlays?.color || '#555555'; // simplified
        ctx.globalAlpha = style.opacity ?? 0.5;

        inlays.forEach(fret => {
            if (fret > (this.geometry as any).settings.numFrets) return;

            if (doubleInlays.includes(fret)) {
                const spacing = 1.5;
                const topString = Math.max(1, centerString - spacing);
                const bottomString = Math.min(numStrings, centerString + spacing);

                const p1 = this.geometry.getFingerCoords(fret, topString);
                const p2 = this.geometry.getFingerCoords(fret, bottomString);

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
                ctx.arc(p2.x, p2.y, radius, 0, Math.PI * 2);
                ctx.fill();
            } else {
                const p = this.geometry.getFingerCoords(fret, centerString);
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.restore();
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/FullNeck.ts ---
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
        super.setTransforms(rotation, mirror);
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

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/NeckComponent.ts ---
import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface NeckStyle {
    color: string;
    shadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    headColor?: string;
    headShadow?: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    headBorder?: {
        color: string;
        width: number;
    };
}

/**
 * NeckComponent - Draws the fretboard neck for both FULL and SHORT orientations
 */
export class NeckComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: NeckStyle;
    private geometry: GeometryProvider;
    private showHeadBackground: boolean;
    private neckRadius: number;
    private headstockYOffset: number;

    // For SHORT neck
    private diagramY?: number;
    private stringNamesY?: number;
    private headWidth?: number;

    constructor(
        neckType: NeckType,
        style: NeckStyle,
        geometry: GeometryProvider,
        options: {
            showHeadBackground?: boolean;
            neckRadius?: number;
            headstockYOffset?: number;
            diagramY?: number;
            stringNamesY?: number;
            headWidth?: number;
        } = {}
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;
        this.showHeadBackground = options.showHeadBackground ?? true;
        this.neckRadius = options.neckRadius ?? (neckType === NeckType.FULL ? 16 : 35);
        this.headstockYOffset = options.headstockYOffset ?? 0;
        this.diagramY = options.diagramY;
        this.stringNamesY = options.stringNamesY;
        this.headWidth = options.headWidth;
    }

    public validate(): boolean {
        return true; // Neck is always valid
    }

    public update(progress: number): void {
        // Animation support - can be implemented later
    }

    public draw(ctx: CanvasRenderingContext2D, progress: number = 1): void {
        if (this.neckType === NeckType.FULL) {
            this.drawFullNeck(ctx, progress);
        } else {
            this.drawShortNeck(ctx, progress);
        }
    }

    private drawFullNeck(ctx: CanvasRenderingContext2D, progress: number): void {
        // Get geometry settings
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const boardY = settings.boardY;
        const fretboardWidth = settings.fretboardWidth;
        const fretboardHeight = settings.fretboardHeight;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        // Draw neck
        ctx.fillStyle = this.style.color;
        ctx.fillRect(fretboardX, boardY, fretboardWidth, fretboardHeight * progress);

        ctx.restore();

        // Draw headstock if enabled
        if (this.showHeadBackground) {
            this.drawFullHeadstock(ctx, fretboardX, boardY, fretboardHeight, scaleFactor);
        }
    }

    private drawFullHeadstock(ctx: CanvasRenderingContext2D, fretboardX: number, boardY: number, fretboardHeight: number, scaleFactor: number): void {
        ctx.save();

        // For FULL neck, use provided headWidth if possible, else fallback to consistent 45
        const headWidth = this.headWidth ?? (this.geometry.realFretSpacing || 45 * scaleFactor);
        const headX = fretboardX - headWidth - 2 * scaleFactor;

        // Apply shadow
        if (this.style.headShadow?.enabled) {
            ctx.shadowColor = this.style.headShadow.color;
            ctx.shadowBlur = this.style.headShadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.headShadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.headShadow.offsetY * scaleFactor;
        }

        ctx.fillStyle = this.style.headColor || "#1e1e22";
        ctx.beginPath();

        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(headX, boardY, headWidth, fretboardHeight, [10 * scaleFactor, 0, 0, 10 * scaleFactor]);
        } else {
            ctx.rect(headX, boardY, headWidth, fretboardHeight);
        }

        ctx.fill();

        // Optional border for head
        if (this.style.headBorder && this.style.headBorder.width > 0) {
            ctx.lineWidth = this.style.headBorder.width * scaleFactor;
            ctx.strokeStyle = this.style.headBorder.color;
            ctx.stroke();
        }

        ctx.restore();
    }

    private drawShortNeck(ctx: CanvasRenderingContext2D, progress: number): void {
        const settings = (this.geometry as any).settings;
        const fretboardX = settings.fretboardX;
        const fretboardY = settings.fretboardY;
        const fretboardWidth = settings.fretboardWidth;
        const fretboardHeight = settings.fretboardHeight;
        const scaleFactor = settings.scaleFactor;

        ctx.save();

        // Apply shadow
        if (this.style.shadow?.enabled) {
            ctx.shadowColor = this.style.shadow.color;
            ctx.shadowBlur = this.style.shadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.shadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.shadow.offsetY * scaleFactor;
        }

        // Draw neck with rounded bottom corners
        ctx.fillStyle = this.style.color;
        ctx.beginPath();

        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(
                fretboardX,
                fretboardY,
                fretboardWidth,
                fretboardHeight * progress,
                [0, 0, this.neckRadius * scaleFactor, this.neckRadius * scaleFactor]
            );
        } else {
            ctx.rect(fretboardX, fretboardY, fretboardWidth, fretboardHeight * progress);
        }

        ctx.fill();

        ctx.restore();

        // Draw headstock if enabled
        if (this.showHeadBackground && this.diagramY !== undefined) {
            this.drawShortHeadstock(ctx, fretboardX, fretboardY, fretboardWidth, scaleFactor);
        }
    }

    private drawShortHeadstock(ctx: CanvasRenderingContext2D, fretboardX: number, fretboardY: number, fretboardWidth: number, scaleFactor: number): void {
        if (this.diagramY === undefined) return;

        ctx.save();

        const headstockHeight = fretboardY - this.diagramY;
        const headStartY = this.diagramY + this.headstockYOffset;

        // Apply shadow
        if (this.style.headShadow?.enabled) {
            ctx.shadowColor = this.style.headShadow.color;
            ctx.shadowBlur = this.style.headShadow.blur * scaleFactor;
            ctx.shadowOffsetX = this.style.headShadow.offsetX * scaleFactor;
            ctx.shadowOffsetY = this.style.headShadow.offsetY * scaleFactor;
        }

        ctx.fillStyle = this.style.headColor || "#3a3a3e";
        ctx.beginPath();

        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(
                fretboardX,
                headStartY,
                fretboardWidth,
                headstockHeight,
                [this.neckRadius * scaleFactor, this.neckRadius * scaleFactor, 0, 0]
            );
        } else {
            ctx.rect(fretboardX, headStartY, fretboardWidth, headstockHeight);
        }

        ctx.fill();

        // Draw border if specified
        if (this.style.headBorder && this.style.headBorder.width > 0) {
            ctx.lineWidth = this.style.headBorder.width * scaleFactor;
            ctx.strokeStyle = this.style.headBorder.color;
            ctx.stroke();
        }

        ctx.restore();
    }

    public getBounds() {
        const settings = (this.geometry as any).settings;
        return {
            x: settings.fretboardX,
            y: settings.fretboardY,
            width: settings.fretboardWidth,
            height: settings.fretboardHeight
        };
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/NeckType.ts ---
/**
 * Enum to distinguish between Full (horizontal) and Short (vertical) neck orientations
 */
export enum NeckType {
    FULL = 'FULL',   // Horizontal orientation (FullNeck)
    SHORT = 'SHORT'  // Vertical orientation (ShortNeck)
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/domain/chord-logic.ts ---
import type { Achord, ChordDiagramProps, StandardPosition } from './types';

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const complements = ['Major', 'm', '°'];
export const basses = ['Tonica', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9', '/10', '/11', '/12'];
export const extensions = [
    'sus2', 'sus4', 'aug',
    '5', 'b5', '#5',
    '6', 'b6', '#6',
    '7', 'b7', '#7',
    '7+', 'b7+', '#7+',
    '9', 'b9', '#9',
    '11', 'b11', '#11',
    '13', 'b13', '#13'
];

export const getExtension = (value: string): number => { return extensions.indexOf(value) }
export const getNote = (value: string): number => { return notes.indexOf(value) }
export const getComplement = (value: string): number => { return complements.indexOf(value) }
export const getBasse = (value: string): number => { return basses.indexOf(value) }

export const formatNoteName = (note: string): string => {
    return note.replace(/#/g, '♯').replace(/b/g, '♭');
};

export const getNome = ({ note, complement, extension, bass }: Achord): string => {
    const complementStr = complements[complement] === 'Major' ? '' : complements[complement] || '';
    const extensionStr = extension ? extension.map(ext => extensions[ext]).join('') : '';
    const bassStr = bass > 0 ? basses[bass] : '';
    return notes[note] + complementStr + extensionStr + bassStr;
}

export const getFormattedNome = (chord: Achord): string => {
    return getNome(chord).replace(/#/g, '♯').replace(/b/g, '♭');
};

export const getScaleNotes = (selectedScale: string): string[] => {
    const scaleIndex = notes.indexOf(selectedScale);
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    return majorScaleIntervals.map((interval) => notes[(scaleIndex + interval) % 12]);
};

export const getBassNotes = (selectedScale: string): string[] => {
    const scaleIndex = notes.indexOf(selectedScale);
    return ["Root", ...Array.from({ length: 11 }, (_, i) => `/${formatNoteName(notes[(scaleIndex + i + 1) % 12])}`)];
};

export const transpose = (chord: ChordDiagramProps, newAchord: Achord): ChordDiagramProps => {
    // Calculate semitone shift from shape origin to target note
    let shift = newAchord.note - (chord.origin || 0); // Use 0 as default if origin is undefined

    // Ensure shift is within a 12-semitone range
    shift = ((shift % 12) + 12) % 12;

    const newFingers = chord.fingers.map(fingerPos => {
        let newFret = fingerPos.fret;
        // Only shift fretted notes (fret > 0)
        if (newFret > 0) {
            newFret = newFret + shift;
        }
        return { ...fingerPos, fret: newFret };
    });

    // Adjust capo if present and still relevant (this is more for visual adjustment now)
    const newCapo = (chord.capo || 0) + shift;

    return {
        ...chord,
        chord: newAchord,
        fingers: newFingers,
        capo: newCapo >= 0 ? newCapo : 0, // Capo cannot be negative
        origin: newAchord.note // Update origin to new root note
    };
};

export const getFilteredChords = (
    chordData: ChordDiagramProps[],
    selectedNote: string,
    selectedQuality: string,
    selectedExtensions: string[],
    selectedBass: string,
    tuning?: string[]
): ChordDiagramProps[] => {
    // First, filter by exact tuning match
    let baseChords = chordData;
    if (tuning && tuning.length > 0) {
        baseChords = chordData.filter(chord => {
            const chordTuning = chord.stringNames || [];
            // Check if tunings match exactly
            if (chordTuning.length !== tuning.length) return false;
            return chordTuning.every((note, index) => note === tuning[index]);
        });
    }

    let transposableChords: ChordDiagramProps[] = baseChords;

    if (selectedNote !== "all") {
        transposableChords = [];
        const targetNoteIndex = notes.indexOf(selectedNote);

        baseChords.forEach((chordItem) => {
            if (!chordItem.chord) return; // Skip invalid chords

            if (chordItem.unique) {
                if (notes[chordItem.chord.note] === selectedNote) {
                    transposableChords.push(chordItem);
                }
            } else {
                const newAchord = { ...chordItem.chord, note: targetNoteIndex }; // Create new Achord with target note
                const transposed = transpose(chordItem, newAchord); // Call transpose with the correct signature
                transposableChords.push(transposed);
            }
        });
    }

    let filtered = transposableChords;
    if (selectedQuality !== "all") {
        filtered = filtered.filter((chord) => {
            if (!chord.chord) return false;
            const comp = complements[chord.chord.complement];
            if (selectedQuality === "major") return ["Major"].includes(comp);
            if (selectedQuality === "minor") return comp === "m";
            if (selectedQuality === "dim") return comp === "°";
            return true;
        });
    }
    if (selectedExtensions.length > 0) {
        filtered = filtered.filter((chord) => {
            if (!chord.chord) return false;
            const chordExtensions = chord.chord.extension.map(ext => extensions[ext]);
            return selectedExtensions.every((ext) => chordExtensions.includes(ext));
        });
    }
    if (selectedBass !== "all") {
        const bassIndex = basses.indexOf(selectedBass);
        filtered = filtered.filter((chord) => chord.chord && chord.chord.bass === bassIndex);
    }
    return filtered;
}

// ... existing imports
import { BarreInfo } from './types'; // Ensure BarreInfo is imported or defined

// ... existing code ...

const findMinNonZeroNote = (fingers: StandardPosition[], avoid: number[]): [number, number] => {
    let min = Infinity;
    let max = 0;

    fingers.forEach(fingerPos => {
        const stringNumber = fingerPos.string;
        const fret = fingerPos.fret;

        // Only consider fretted notes (fret > 0) that are not in the 'avoid' list
        if (!avoid.includes(stringNumber) && fret > 0) {
            if (fret < min) {
                min = fret;
            }
            if (fret > max) {
                max = fret;
            }
        }
    });

    return [min === Infinity ? 0 : min, max];
};

/**
 * Detects the best barre candidate from finger positions.
 */
export const detectBarre = (fingers: StandardPosition[]): BarreInfo | null => {
    if (!fingers || fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxStrings = 1;

    fingers.forEach(f => {
        // A barre is defined by a finger crossing multiple strings (endString !== string)
        const isBarre = f.endString !== undefined && f.endString !== f.string;
        if (isBarre) {
            const start = Math.min(f.string, f.endString!);
            const end = Math.max(f.string, f.endString!);
            const span = end - start + 1;

            // Prioritize wider barres
            if (span > maxStrings) {
                maxStrings = span;
                bestBarre = {
                    fret: f.fret,
                    finger: f.finger ?? 1,
                    startString: start,
                    endString: end
                };
            }
        }
    });

    return bestBarre;
};

export interface VisualChordState {
    finalChord: ChordDiagramProps;
    startFret: number;
    barre: BarreInfo | null;
    formattedName: string;
    capoConfig: { isActive: boolean; fret: number; showNut: boolean };
    transposeConfig: { isActive: boolean; fret: number; showNut: boolean };
    visualStartFret: number; // The actual lowest fret number shown on the side
}

/**
 * Prepares all visual data needed to draw a Short Chord diagram.
 * Extracts logic (auto-transpose, barre, name) from the drawer class.
 */
export const prepareShortChordVisuals = (
    chord: ChordDiagramProps,
    numFrets: number,
    globalCapo: number = 0,
    forceTransportDisplay: number = 1
): VisualChordState => {

    // 1. Auto-Transpose Logic
    let finalChord = { ...chord };
    let startFret = forceTransportDisplay;

    // Calculate frets stats
    const frets = chord.fingers
        .filter(f => f.fret > 0)
        .map(f => f.fret);

    const maxFret = frets.length > 0 ? Math.max(...frets) : 0;
    const minFret = frets.length > 0 ? Math.min(...frets) : 0;

    // Check overflow logic (same as was in ShortChord)
    // If chords exceed the visible number of frets, we shift them.
    if (frets.length > 0 && maxFret > numFrets) {
        // Auto-transpose trigger
        startFret = minFret;

        // Apply shift
        const offset = startFret - 1;
        finalChord = {
            ...chord,
            fingers: chord.fingers.map(f => ({
                ...f,
                fret: f.fret > 0 ? f.fret - offset : 0
            }))
        };
    } else if (forceTransportDisplay > 1) {
        // Manual override case (if provided via props)
        const offset = forceTransportDisplay - 1;
        finalChord = {
            ...chord,
            fingers: chord.fingers.map(f => ({
                ...f,
                fret: f.fret > 0 ? f.fret - offset : 0
            }))
        };
    }

    // 2. Barre Detection
    const barre = detectBarre(finalChord.fingers);

    // 3. Name Formatting
    const formattedName = formatNoteName(finalChord.chordName || "");

    // 4. Capo / Transpose Configs
    const capoConfig = {
        isActive: globalCapo > 0,
        fret: globalCapo,
        showNut: globalCapo === 0 // Show nut only if no global capo
    };

    const transposeConfig = {
        isActive: startFret > 1,
        fret: startFret,
        showNut: startFret === 1 // If transposed, nut is hidden relative to the shift
    };

    console.log("transposeConfig", transposeConfig);

    // Visual start fret for the indicator (the number drawn)
    // Simply startFret, but we might want to align it with the top finger visually?
    // The previous code calculated 'minVisualFret' from the shifted chord for ALIGNMENT.
    // The NUMBER itself is `startFret`.

    return {
        finalChord,
        startFret,
        barre,
        formattedName,
        capoConfig,
        transposeConfig,
        visualStartFret: startFret
    };
};

/**
 * Legacy/Utility: Prepares chord display data for the timeline and other views.
 */
export const getChordDisplayData = (chord: ChordDiagramProps, numFrets: number = 4) => {
    const visuals = prepareShortChordVisuals(chord, numFrets);
    return {
        finalChord: visuals.finalChord,
        transportDisplay: visuals.startFret
    };
};
--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/AvoidComponent.ts ---
import { AvoidStyle } from "@/modules/core/domain/types";
import { NeckType } from "./NeckType";

export interface IGeometryProvider {
    getFingerCoords(fret: number, string: number): { x: number; y: number };
    scaleFactor: number;
    isHorizontal: boolean;
    numFrets: number;
    fingerRadius: number;
}

export class AvoidComponent {
    private string: number;
    private geometry: IGeometryProvider;
    private style: AvoidStyle;
    private currentOpacity: number;
    private targetOpacity: number;
    private isHorizontal: boolean;
    private neckType: NeckType;

    constructor(string: number, style: AvoidStyle, geometry: IGeometryProvider, neckType?: NeckType) {
        this.string = string;
        this.style = style;
        this.geometry = geometry;
        this.currentOpacity = style.opacity ?? 1;
        this.targetOpacity = style.opacity ?? 1;
        this.isHorizontal = geometry.isHorizontal;
        this.neckType = neckType ?? NeckType.SHORT;
    }

    public update(progress: number): void {
        const baseOpacity = this.style.opacity ?? 1;
        this.currentOpacity = baseOpacity + (this.targetOpacity - baseOpacity) * progress;
    }

    public setOpacity(opacity: number): void {
        this.currentOpacity = opacity;
    }

    public setTargetOpacity(opacity: number): void {
        this.targetOpacity = opacity;
    }

    private getAvoidCoords(): { x: number; y: number } {
        // Draw on the opposite side of the headstock (fret 0).
        // Using +1 fret beyond the last visible fret to simulate the "next fret space"
        const fretPos = this.geometry.numFrets ? this.geometry.numFrets + 1 : 25;
        const coords = this.geometry.getFingerCoords(fretPos, this.string);

        return coords;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.currentOpacity <= 0) return;

        const { x, y } = this.getAvoidCoords();
        const size = this.geometry.fingerRadius / 4;

        ctx.save();
        ctx.globalAlpha = this.currentOpacity;
        ctx.lineCap = 'round';

        // 1. Draw Border (outer thicker cross)
        if (this.style.border) {
            ctx.strokeStyle = this.style.border.color;
            ctx.lineWidth = (this.style.lineWidth + (this.style.border.width || 0) * 2) * this.geometry.scaleFactor;
            this.drawCross(ctx, x, y, size);
        }

        // 2. Draw Main Cross
        ctx.strokeStyle = this.style.color || "#ffffff";
        ctx.lineWidth = (this.style.lineWidth || 6) * this.geometry.scaleFactor;
        this.drawCross(ctx, x, y, size);

        ctx.restore();
    }

    private drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
        ctx.beginPath();
        ctx.moveTo(x - size, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + size, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.stroke();
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/editor/domain/types.ts ---

export type { ManualChordData } from "@/modules/core/domain/types";
import { MusicalEvent, StandardPosition, BarreData, ManualChordData } from "@/modules/core/domain/types";

export type Duration = 'w' | 'h' | 'q' | '8' | '16' | '32';
export type Accidental = 'none' | '♯' | '𝄪' | '♭' | '𝄫' | '♮';

export interface NoteDecorator {
    staccato?: boolean;       // a.
    staccatissimo?: boolean;   // av
    accent?: boolean;          // a>
    tenuto?: boolean;          // a-
    marcato?: boolean;         // a^
    pizzicato?: boolean;       // a+ (Left Hand)
    snapPizzicato?: boolean;   // ao
    fermataUp?: boolean;       // a@a (Up)
    fermataDown?: boolean;     // a@u (Down)
    bowUp?: boolean;           // a|
    bowDown?: boolean;         // am
    openNote?: boolean;            // ah
    dot?: boolean;
}

// NoteData now aligns with MusicalEvent
export interface NoteData extends Omit<MusicalEvent, 'type'> {
    // ID inherited

    // Editor specific duration (enum vs string)
    duration: Duration;

    // Type inherited but strictly typed here
    type: 'note' | 'rest';

    // Positions inherited (StandardPosition[])

    // Editor specifics
    accidental?: Accidental;
    decorators: NoteDecorator;
    noteHead?: 'standard' | 'x' | 'diamond' | 'square' | 'triangle' | 'slash' | 'cross' | 'circle' | 'triangle_inv' | 'arrow_down' | 'arrow_up' | 'slashed';

    slideTargetId?: string; // Explicitly link to another note for techniques
    tuplet?: string;
    isSlurred?: boolean;
    annotation?: string; // Text above/below note
    customDurationMs?: number; // User-defined duration in seconds/ms (overrides BPM/rhythm)

    // Chord Identity (inherited chordName)
    manualChord?: ManualChordData; // The definition (root, quality, etc)
    showChordName?: boolean; // Per-note control for chord name visibility

    // Barre (inherited from MusicalEvent as BarreData: all numbers)
    barre?: BarreData;
}

export interface MeasureData {
    id: string;
    notes: NoteData[];
    isCollapsed?: boolean;
    showClef?: boolean;
    clef?: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
    showTimeSig?: boolean;

    // Measure-level chord name (displays throughout entire measure)
    chordName?: string;
    showChordName?: boolean;
}

export interface GlobalSettings {
    bpm: number;
    time: string;
    key: string;
    clef: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
    showNotation: boolean;
    showTablature: boolean;
    showChordName?: boolean;
    displayMode?: 'tab' | 'score' | 'both';
    numStrings?: number;
    tuning?: string[]; // Optional tuning array
    instrumentId?: string;
    tuningIndex?: number;
    capo?: number; // Visual Capo Fret
    tuningShift?: number; // Shift in semitones (Positive = Capo, Negative = Down Tuning)
    numFrets?: number;
}

export type TransitionType = 'snap' | 'slide' | 'fade' | 'assemble';

// Adapted from NoteForge ScoreTheme
export interface ElementStyle {
    color: string;
    opacity: number;
    strokeColor?: string;
    strokeWidth?: number;
}

export interface ScoreStyle {
    // Core NoteForge properties (Refactored to ElementStyle)
    clefs: ElementStyle;
    timeSignature: ElementStyle;
    notes: ElementStyle;
    rests: ElementStyle;
    tabNumbers: ElementStyle;
    symbols: ElementStyle;
    staffLines: ElementStyle;

    background: string; // Used for "paperColor"

    // Legacy/Animation properties kept for App compatibility
    shadowIntensity: number;
    glowEffect: boolean;
    scale: number;
    transitionType: TransitionType;
    playheadColor: string;
    activeNoteColor: string;
    chordName: ElementStyle;

    // Legacy mapping (optional, or removed later)
    width?: number;
    staveSpace?: number;

    // View Transforms
    rotation?: 0 | 90 | 270;
    mirror?: boolean;
}

export const DEFAULT_SCORE_STYLE: ScoreStyle = {
    clefs: { color: '#ff9823ff', opacity: 1 },
    timeSignature: { color: '#ff9823ff', opacity: 1 },
    notes: { color: '#ffffffff', opacity: 1 },
    rests: { color: '#ffffffff', opacity: 0.8 },
    tabNumbers: { color: '#ffffffff', opacity: 1 },
    symbols: { color: '#ffffffff', opacity: 1 },
    staffLines: { color: '#ffffffff', opacity: 0.4 },
    chordName: {
        color: '#22d3ee',
        opacity: 1,
        strokeColor: '#000000',
        strokeWidth: 3
    },
    background: '#000000',
    playheadColor: '#ffffffff',
    activeNoteColor: '#ffffffff',
    shadowIntensity: 10,
    glowEffect: true,
    scale: 1,
    transitionType: 'snap',
    rotation: 0,
    mirror: false
};

export interface ScoreState {
    measures: MeasureData[];
    selectedNoteIds: string[];
    settings: GlobalSettings;
    style: ScoreStyle;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/domain/types.ts ---
// Standardized Position for all contexts
export interface StandardPosition {
    string: number; // 1-based start string
    endString?: number; // 1-based end string (if different from 'string', it's a barre)
    fret: number;
    finger?: number | string; // 0 = unknown/open, 1-4 = fingers, T = thumb
    avoid?: boolean;
}

export interface BarreData {
    fret: number;
    startString: number;
    endString: number;
    finger?: number | string;
}

export interface ManualChordData {
    root: string;
    quality: string;
    bass?: string;
    extensions?: string[];
}

// Master Entity that represents a "Vertical Slice" of music on the fretboard
export interface MusicalEvent {
    id: string;
    // Rhythmic context
    duration?: string; // 'w', 'h', 'q', etc.
    type: 'note' | 'rest';

    // Harmonic identity
    chordName?: string;
    showChordName?: boolean; // Per-event control for chord name visibility

    // Physical Execution
    positions: StandardPosition[];

    // Techniques
    technique?: string;
}

// === LEGACY / THEORY TYPES ===

export interface Achord {
    note: number; // Nota do acorde
    complement: number; // Complemento do acorde
    extension: number[]; // Extensão do acorde
    bass: number; // Basso do acorde
}

export type Position = {
    [key: number]: [
        number, // finger
        number, // string
        number? // fret
    ]
};

export interface nutForm {
    vis: boolean; // Se a pestana é visível
    str: [number, number]; // Cordas que a pestana abrange (ex: [1, 5] para cordas 1 a 5)
    pos: number; // Posição do traste (casa) onde a pestana está
    fin: number; // Dedo usado para a pestana
    trn: number; // Transposição no dedo
}

export interface BarreInfo extends BarreData { }

export interface TabEffect {
    type: 'slide' | 'bend' | 'hammer' | 'pull' | 'vibrato' | 'tap';
    fromFret?: number;
    toFret?: number;
    string: number;
    duration?: number;
}

export interface ChordDiagramProps {
    chord: Achord;
    origin: number;
    fingers: StandardPosition[];
    avoid: number[];
    scale?: number;
    transport?: number;
    unique?: boolean;
    list?: boolean;
    stringNames?: string[];
    chordName?: string;
    showChordName?: boolean;
    capo?: number; // Visual Capo Fret (0 = none)
    extends?: any; // Extra data for interoperability (Fretboard/Editor specific properties)
}

export interface ChordWithTiming {
    chord: ChordDiagramProps; // Original chord data
    duration: number; // in ms
    finalChord: ChordDiagramProps; // Pre-calculated transposed chord for display
    transportDisplay: number;    // Pre-calculated transpose display value
    strumming?: 'down' | 'up' | 'pluck' | 'mute';
    effects?: TabEffect[];
}

export interface TabData {
    fret: number;
    str: number;
}

export interface MusicalNote {
    id: string;
    keys: string[];
    duration: string;
    type: 'note' | 'rest';
    ticks: number;
    startTime: number;
    accidentals: (string | null)[];
    dots: number;
    tabData?: TabData[];
}

export interface MusicalMeasure {
    number: number;
    notes: MusicalNote[];
    clef: string;
    keySignature: string;
    timeSignature: {
        numerator: number;
        denominator: number;
    };
    totalTicks: number;
    chordName?: string;
}


export interface ScoreData {
    title: string;
    composer: string;
    measures: MusicalMeasure[];
    tempo: number;
}

// === THEME INTERFACES ===

export interface BorderStyle {
    color: string;
    width?: number;
}

export interface ElementStyle {
    color: string;
    border?: BorderStyle;
    opacity?: number;
    shadow?: {
        enabled?: boolean;
        color?: string;
        blur?: number;
        offsetX?: number;
        offsetY?: number;
    };
}

export interface TextStyle extends ElementStyle {
    stroke?: {
        color: string;
        width: number;
    };
    textColor?: string; // For things that have background + text (like fingers)
}

export interface FingersStyle extends TextStyle {
    radius: number;
    fontSize: number;
    barreWidth: number; // specialized for barres
    barreFingerRadius: number; // specialized for barres
}

export interface CapoStyle extends ElementStyle {
    textColor: string;
}

export interface ChordNameStyle extends TextStyle {
    fontSize: number;
    extSize: number;
}

export interface AvoidStyle extends ElementStyle {
    size: number;
    lineWidth: number;
}

export interface FretboardTheme {
    global: {
        backgroundColor: string; // was cardColor
        primaryTextColor: string; // was textColor
        scale: number;
        rotation: 0 | 90 | 270;
        mirror: boolean;
    };
    fretboard: {
        neck: ElementStyle; // fretboardColor
        frets: ElementStyle & { thickness?: number };
        strings: ElementStyle & { thickness: number }; // borderColor -> color
        board?: {
            inlays?: ElementStyle;
        };
    };
    fingers: FingersStyle; // color, border, shadow, textColor, opacity (backgroundAlpha)
    chordName: ChordNameStyle; // color, opacity, shadow, stroke
    capo: ElementStyle & {
        textColors: {
            name: string;
            number: string;
        };
    };
    avoid: AvoidStyle;
    head: ElementStyle & {
        textColors: {
            name: string;
        };
    };
}

export type InstrumentType = 'guitar' | 'bass' | 'ukulele' | 'custom';

export interface Note {
    fret: number;
    string: number; // 1-indexed (1 is high E)
    duration: number; // in beats
    velocity?: number;
    effect?: string; // e.g., 'slide', 'bend'
}

export interface Clip {
    id: string;
    start: number; // start time in beats
    duration: number; // duration in beats
    data: Note[];
    type: 'midi' | 'tab';
}

export interface Track {
    id: string;
    name: string;
    type: InstrumentType | 'text' | 'backing-track';
    clips: Clip[];
    settings: {
        tuning?: number[]; // Open string MIDI notes
        capo?: number;
        color?: string;
    };
}

export interface ProjectData {
    id: string;
    name: string;
    bpm: number;
    timeSignature: [number, number];
    tracks: Track[];
    duration: number; // total duration in seconds or beats
}

export interface FretboardTimelineEvent {
    startTime: number;
    duration: number;
    chordName: string;
    positions: {
        string: number;
        fret: number;
        finger: number;
    }[];
    tuning?: string[];
    capo?: number;
}

export interface FretboardHistoryFile {
    version: number;
    settings: {
        tuning: string[];
        capo: number;
        numStrings: number;
        tuningShift?: number;
        bpm?: number;
        time?: {
            numerator: number;
            denominator: number;
        };
    };
    timeline: FretboardTimelineEvent[];
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/lib/history-manager.ts ---
import { ChordDiagramProps, FretboardTheme, Achord } from "@/modules/core/domain/types";
import { MeasureData, NoteData, Duration, GlobalSettings } from "@/modules/editor/domain/types";

export interface FullHistoryState {
    version: number;
    chords: ChordDiagramProps[];
    measures?: MeasureData[]; // Added to preserve exact editor state
    settings?: GlobalSettings;
    theme?: FretboardTheme;
}

export function createFullHistory(measures: MeasureData[], settings: GlobalSettings, theme: FretboardTheme): FullHistoryState {
    const chords = fretboardToHistory(measures, settings);
    return {
        version: 1,
        chords,
        measures,
        settings,
        theme
    };
}

/**
 * Parses a chord name string into an Achord structure used by the system.
 */
function parseChordValues(chordName: string | undefined): Achord {
    if (!chordName) return { note: 0, complement: 0, extension: [], bass: 0 };

    console.log('[history-manager] Parsing:', chordName);

    // Hardcoded arrays to avoid import issues
    const notesRef = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const extensionsRef = ['sus2', 'sus4', 'aug', '5', "6", "7", "7+", "9", "11", "13", "(#5)", "(b5)"];
    const bassesRef = ['Tonica', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9', '/10', '/11', '/12'];

    // 1. Extract Bass if present (after last '/')
    let baseName = chordName;
    let bassIndex = 0;

    const slashIndex = chordName.lastIndexOf('/');
    if (slashIndex > -1) {
        const bassPart = chordName.substring(slashIndex); // e.g., "/G"
        bassIndex = bassesRef.indexOf(bassPart);

        if (bassIndex > -1) {
            baseName = chordName.substring(0, slashIndex);
        } else {
            bassIndex = 0;
        }
    }

    // 2. Extract Root
    let rootIndex = -1;
    let rootLen = 0;

    // Sort notes by length desc to match F# before F
    const sortedNotes = [...notesRef].sort((a, b) => b.length - a.length);

    for (const note of sortedNotes) {
        if (baseName.startsWith(note)) {
            rootIndex = notesRef.indexOf(note);
            rootLen = note.length;
            break;
        }
    }

    if (rootIndex === -1) {
        console.warn('[history-manager] Failed to find root for:', baseName);
        return { note: 0, complement: 0, extension: [], bass: 0 };
    }

    // 3. Extract Remainder (Quality + Extensions)
    const remainder = baseName.substring(rootLen);

    // 4. Determine Complement (Quality)
    let complementIndex = 0; // Major
    let extStr = remainder;

    if (remainder.startsWith('m') && !remainder.startsWith('maj')) {
        complementIndex = 1; // m
        extStr = remainder.substring(1);
    }
    else if (remainder.startsWith('°') || remainder.startsWith('dim')) {
        complementIndex = 2; // °
        extStr = remainder.startsWith('dim') ? remainder.substring(3) : remainder.substring(1);
    }

    // 5. Extract Extensions
    const extIndices: number[] = [];
    let processingExts = extStr;

    const sortedExts = extensionsRef.map((e, i) => ({ val: e, idx: i })).sort((a, b) => b.val.length - a.val.length);

    for (const { val, idx } of sortedExts) {
        if (processingExts.includes(val)) {
            extIndices.push(idx);
            processingExts = processingExts.replace(val, '');
        }
    }

    const result = {
        note: rootIndex,
        complement: complementIndex,
        extension: extIndices.sort((a, b) => a - b),
        bass: bassIndex
    };

    console.log('[history-manager] Parsed Result:', result);
    return result;
}

/**
 * Downloads the history object as a JSON file.
 */
export function downloadHistory(data: any, filename: string = "history.json") {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Reads a JSON file and returns the parsed history object.
 * Returns a normalized object containing chords, measures (optional), and settings/theme.
 */
export function readHistoryFile(file: File): Promise<{
    chords: ChordDiagramProps[],
    measures?: MeasureData[],
    settings?: GlobalSettings,
    theme?: FretboardTheme
}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        const normalizeFingers = (f: any): any[] => {
            if (Array.isArray(f)) return f;
            if (f && typeof f === 'object') {
                return Object.keys(f).map(key => {
                    const val = f[key];
                    // val is expected to be [fret, finger] or [fret, finger, endString/fret?]
                    // Legacy dict was [fret, finger]
                    return { string: parseInt(key), fret: val[0], finger: val[1] };
                });
            }
            return [];
        };

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                console.log('[history-manager] Parsed JSON keys:', Object.keys(json));

                // V2 Format: Timeline
                if (json.timeline && Array.isArray(json.timeline)) {
                    console.log('[history-manager] Detected V2 History Format');
                    const settings = json.settings || {};
                    const tuning = settings.tuning || ['E', 'A', 'D', 'G', 'B', 'e'];

                    const chords: ChordDiagramProps[] = json.timeline.map((event: any) => {
                        const achord = parseChordValues(event.chordName);
                        return {
                            chord: achord,
                            origin: achord.note,
                            fingers: event.positions || [],
                            avoid: [],
                            stringNames: event.tuning || tuning,
                            chordName: event.chordName,
                            showChordName: true,
                            capo: event.capo || settings.capo || 0,
                            extends: {
                                durationMs: event.duration
                            }
                        };
                    });

                    resolve({
                        chords,
                        settings: json.settings,
                        theme: json.theme
                    });
                }
                // Legacy Formats
                else if (json.chords || Array.isArray(json)) {
                    let chords = Array.isArray(json) ? json : json.chords;
                    // Normalize fingers from Dict to Array if needed
                    chords = chords.map((c: any) => ({
                        ...c,
                        fingers: normalizeFingers(c.fingers)
                    }));

                    resolve({
                        chords,
                        measures: json.measures,
                        settings: json.settings,
                        theme: json.theme
                    });
                } else {
                    reject(new Error("Invalid history file format."));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

import { getNoteDurationValue, getMeasureCapacity } from "@/modules/editor/domain/music-math";

/**
 * Converts Fretboard measures to the unified history format (ChordDiagramProps[]).
 * Merges all notes in a measure into a single ChordDiagramProps to represent the full chord shape.
 */
export function fretboardToHistory(measures: MeasureData[], settings: GlobalSettings): ChordDiagramProps[] {
    const history: ChordDiagramProps[] = [];
    const bpm = settings.bpm || 120;
    const msPerBeat = 60000 / bpm;

    // Calculate measure duration based on Time Signature
    // capacity is in "Whole Note" units (e.g., 4/4 = 1.0)
    // We assume 1 Whole Note = 4 Quarter Notes (Beats)
    const capacity = getMeasureCapacity(settings.time);
    const measureDurationMs = capacity * 4 * msPerBeat;

    measures.forEach(measure => {
        // 1. Collect all positions from all notes in the measure
        const mergedPositions: any = {};
        let barreData: any = undefined;

        measure.notes.forEach(note => {
            // Merge positions
            note.positions.forEach(pos => {
                if (pos.string > 0) {
                    // Studio expects [fret, finger]
                    mergedPositions[pos.string] = [pos.fret, pos.finger || 0];
                }
            });

            // Barre information is now derived from positions in the current data model.
            // Old barre property on NoteData is no longer supported.
        });

        // 2. Parse Chord Name to populate Achord
        const chordName = measure.chordName || '';
        const achord = parseChordValues(chordName);

        // 3. Create the unified ChordDiagramProps
        const chordData: ChordDiagramProps = {
            chord: achord,
            origin: achord.note,
            fingers: mergedPositions, // Corrected from positions to fingers
            avoid: [],
            stringNames: settings.tuning,
            chordName: chordName,
            showChordName: measure.showChordName,
            capo: settings.tuningShift && settings.tuningShift > 0 ? settings.tuningShift : 0,
            extends: {
                durationMs: measureDurationMs,
                measureId: measure.id,
            }
        };

        // Legacy nutForm mapping removed. Barre information is now handled via StandardPosition's endString.
        history.push(chordData);
    });

    return history;
}


/**
 * Converts the unified history format (ChordDiagramProps[]) back to Fretboard measures.
 * Maps each History Chord to ONE Fretboard Measure containing ONE Note (Chord).
 */
export function historyToFretboard(history: ChordDiagramProps[]): MeasureData[] {
    const measures: MeasureData[] = [];

    history.forEach(chord => {
        // Create a new measure for THIS chord
        const measure = createEmptyMeasure();

        // Restore chord name
        measure.chordName = chord.chordName;
        measure.showChordName = chord.showChordName;

        const ext = chord.extends || {};

        // Calculate duration code from durationMs if possible, or default to whole/quarter?
        // If we came from Studio, we might have durationMs.
        // If we came from Fretboard, we might have durationMs.
        // We'll default to 'w' (whole) or 'q' if short?
        // For simplicity, let's try to map ms back to duration or just use 'w' to fill measure.
        // Or if we stored 'extends.duration', use that.
        let durationCode: Duration = 'q';
        if (ext.duration) {
            durationCode = ext.duration;
        } else if (ext.durationMs) {
            // Approximate? 
            if (ext.durationMs >= 2000) durationCode = 'w'; // > 2s roughly
            else if (ext.durationMs >= 1000) durationCode = 'h';
            else durationCode = 'q';
        }

        // Create the single "Chord Note"
        const note: NoteData = {
            id: generateId(),
            type: 'note',
            duration: durationCode,
            positions: [],
            decorators: ext.decorators || {},
            accidental: ext.accidental || 'none',
            technique: ext.technique,
            manualChord: ext.manualChord,
        };

        // Legacy barre restoration from nut removed. Barre information should be derived from positions.

        // Populate positions from fingers
        if (chord.fingers) { // Changed from chord.positions to chord.fingers
            chord.fingers.forEach(fingerPos => { // Iterating directly over StandardPosition
                note.positions.push({
                    finger: fingerPos.finger,
                    string: fingerPos.string,
                    fret: fingerPos.fret,
                    endString: fingerPos.endString, // Include endString for barre
                });
            });
        }

        // Handle empty/rest
        if (note.positions.length === 0) {
            note.type = 'rest';
            note.positions = [{ fret: 0, string: 1 }];
        }

        measure.notes.push(note);
        measures.push(measure);
    });

    return measures;
}


// --- Studio Import/Export ---
import { TimelineState, TimelineTrack, TimelineClip, ClipType } from "@/modules/chords/domain/types";


/**
 * Converts Studio Timeline to unified history.

 * We only export Chord tracks for now.
 */
export function studioToHistory(timeline: TimelineState, theme?: FretboardTheme): FullHistoryState {
    const history: ChordDiagramProps[] = [];

    // Flatten all chord clips from all chord tracks
    // Sort by start time to maintain sequence
    const allClips: TimelineClip[] = [];
    timeline.tracks.forEach(t => {
        if (t.type === 'chord' || t.name.toLowerCase().includes('chord')) {
            allClips.push(...t.clips);
        }
    });

    allClips.sort((a, b) => a.start - b.start);

    allClips.forEach(clip => {
        if (clip.type === 'chord') {
            const chordProp = { ...clip.chord };
            // Ensure extends exists
            if (!chordProp.extends) chordProp.extends = {};

            // Save duration in ms if not present
            if (!chordProp.extends.durationMs) {
                chordProp.extends.durationMs = clip.duration;
            }

            // If we don't have note duration ('q', 'w'), try to approximate or leave empty
            // logic to reverse-engineer 'q' from ms could go here if needed.

            history.push(chordProp);
        }
    });

    return {
        version: 1,
        chords: history,
        theme
    };
}

/**
 * Converts history to a new TimelineState for Studio.
 * This overwrites the existing state or creates a new one.
 */
export function historyToStudio(history: ChordDiagramProps[]): TimelineState {
    const trackId = generateId();
    const track: TimelineTrack = {
        id: trackId,
        name: 'Imported Chords',
        type: 'chord',
        clips: []
    };

    let currentTime = 0;
    const BPM = 120; // Default BPM for import if unknown
    const msPerBeat = 60000 / BPM;

    history.forEach(chord => {
        const clipId = generateId();
        let durationMs = 1000; // Default 1s

        if (chord.extends?.durationMs) {
            durationMs = chord.extends.durationMs;
        } else if (chord.extends?.duration) {
            // Convert 'q' etc to ms
            const val = getNoteDurationValue(chord.extends.duration, !!chord.extends.decorators?.dot);
            durationMs = val * msPerBeat;
        }

        const clip: TimelineClip = {
            id: clipId,
            start: currentTime,
            duration: durationMs,
            type: 'chord',
            chord: chord,
            finalChord: chord, // No transp yet
        } as any;
        // Force cast because TimelineClip union is strict, and I'm lazy to fully strictly type the union check here in this snippet, 
        // but clip is definitely a ChordClip structure.

        track.clips.push(clip);
        currentTime += durationMs;
    });

    return {
        tracks: [track],
        totalDuration: Math.max(currentTime, 10000), // Min 10s
        zoom: 100
    };
}

function createEmptyMeasure(): MeasureData {
    return {
        id: generateId(),
        isCollapsed: false,
        showClef: true,
        showTimeSig: true,
        notes: []
    };
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/lib/chords/converter.ts ---

import { MeasureData, GlobalSettings } from "@/modules/editor/domain/types";
import { ChordWithTiming, ChordDiagramProps, TabEffect, StandardPosition } from "@/modules/core/domain/types";
import { getNoteDurationValue, getMsFromDuration } from "@/modules/editor/domain/music-math";

/**
 * Converts a list of MeasureData (from Tab Editor) into a flat list of ChordWithTiming (for Fretboard Visualizer).
 * 
 * @param measures The sequence of measures.
 * @param settings Global settings (BPM, Time Signature).
 * @returns Array of chords with absolute timing and duration.
 */
export function measuresToChords(measures: MeasureData[], settings: GlobalSettings): ChordWithTiming[] {
    const result: ChordWithTiming[] = [];
    const bpm = settings.bpm || 120;
    const msPerBeat = 60000 / bpm;
    // Assuming 4/4 as standard for calculation if not handled more complexly.
    // getNoteDurationValue returns 1 for quarter note (1 beat).

    // Iterate through measures and notes to build the sequence
    measures.forEach(measure => {
        let measureNotes = measure.notes;

        // Group notes by "simultaneity" if we had support for real polyphony in the visualizer input.
        // Currently, ChordWithTiming implies a SINGLE chord/event at a time (or arpeggiated).
        // Since TabEditor is monophonic-per-voice or polyphonic-simultaneous, we need to map 
        // the visualizer's "Chord" concept to the Tab's "Column of Notes".

        // However, tab-editor structures data as a list of NoteData. 
        // Notes in `measure.notes` are usually sequential for a single voice.
        // If there are multiple simultaneous notes (chords), they might be represented differently 
        // OR the visualizer needs to handle "chords" constructed from single notes.
        // 
        // LOOKING AT `VisualEditor`: It renders note by note.
        // LOOKING AT `MeasureData`: `notes: NoteData[]`.
        // `NoteData` has `positions: NotePosition[]`. 
        // THIS MEANS: A single `NoteData` object can contain multiple positions (a chord).

        measureNotes.forEach(note => {
            if (note.type === 'rest') {
                // Rests take up time but have no visualization.
                // We could emit a "silent" chord or just skip.
                // For the visualizer playback, preserving time is crucial.
                // FretboardStage computes time based on duration. 
                // If we skip, the next chord starts immediately? 
                // FretboardStage seems to sum durations: `totalMs += ...`.
                // So we SHOULD generate an empty "rest" chord to hold the time.

                const durationValue = getNoteDurationValue(note.duration, !!note.decorators?.dot);
                const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators?.dot, bpm);

                result.push({
                    chord: createEmptyChord(),
                    finalChord: createEmptyChord(),
                    duration: durationMs,
                    transportDisplay: 0,
                    // Mark as rest implicitly by having empty positions?
                });
                return;
            }

            // It is a note (or chord of notes)
            const durationValue = getNoteDurationValue(note.duration, !!note.decorators?.dot);
            const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators?.dot, bpm);

            const fingers: StandardPosition[] = note.positions
                .filter(pos => !pos.avoid)
                .map(pos => ({
                    string: pos.string,
                    endString: pos.endString,
                    fret: pos.fret,
                    finger: pos.finger
                }));

            const avoid: number[] = note.positions
                .filter(pos => pos.avoid)
                .map(pos => pos.string);

            // Map Techniques to Effects
            const effects: TabEffect[] = [];
            if (note.technique) {
                if (note.technique.includes('s')) effects.push({ type: 'slide', string: fingers[0]?.string || 1 });
                if (note.technique.includes('b')) effects.push({ type: 'bend', string: fingers[0]?.string || 1 });
                if (note.technique.includes('h')) effects.push({ type: 'hammer', string: fingers[0]?.string || 1 });
                if (note.technique.includes('p')) effects.push({ type: 'pull', string: fingers[0]?.string || 1 });
                if (note.technique.includes('v')) effects.push({ type: 'vibrato', string: fingers[0]?.string || 1 });
                if (note.technique.includes('t')) effects.push({ type: 'tap', string: fingers[0]?.string || 1 });
            }

            const chordData: ChordDiagramProps = {
                chord: { note: 0, complement: 0, extension: [], bass: 0 },
                origin: 0,
                fingers: fingers,
                avoid: avoid,
                stringNames: settings.tuning,
                extends: {
                    duration: note.duration,
                    type: note.type,
                    decorators: note.decorators,
                    accidental: note.accidental,
                    technique: note.technique,
                    manualChord: note.manualChord,
                    measureId: measure.id,
                    noteId: note.id
                }
            };

            let chordName = '';
            if (measure.chordName) chordName = measure.chordName;
            if (chordName) chordData.chordName = chordName;
            if (measure.showChordName !== undefined) {
                chordData.showChordName = measure.showChordName;
            }

            // Apply musical shift (Capo/Tuning Shift)
            // Apply musical shift (Capo/Tuning Shift)
            // REMOVIDO: O usuário quer que o "Visual Shift" (Capo) NÃO mude a posição dos dedos.
            // A posição dos dedos (fret) deve permanecer absoluta em relação ao braço/capo conforme definido no editor.
            // O ChordDrawerBase agora lida visualmente com a exibição do Capo sem mover os pontos.
            // A transposição de altura de som (pitch) deve ser lidada pelo AudioEngine separadamente, se necessário.
            const shiftedFingers = fingers; // Mantém os dedos originais

            // Deep clone to prevent reference sharing
            const clonedFingers = shiftedFingers.map(f => ({ ...f }));
            const clonedAvoid = [...avoid];
            const clonedExtends = chordData.extends ? { ...chordData.extends } : undefined;

            result.push({
                chord: {
                    ...chordData,
                    fingers: fingers.map(f => ({ ...f })),
                    avoid: [...avoid],
                    extends: clonedExtends
                },
                finalChord: {
                    ...chordData,
                    fingers: clonedFingers,
                    avoid: clonedAvoid,
                    extends: clonedExtends ? { ...clonedExtends } : undefined
                },
                duration: durationMs,
                transportDisplay: 0,
                strumming: undefined,
                effects: effects.length > 0 ? effects.map(e => ({ ...e })) : undefined
            });
        });
    });

    // Post-processing: Link effects to target notes
    for (let i = 0; i < result.length; i++) {
        const currentChord = result[i];
        if (!currentChord.effects) continue;

        currentChord.effects.forEach(effect => {
            if (['slide', 'hammer', 'pull', 'bend'].includes(effect.type)) {
                // Find next note on the same string
                for (let j = i + 1; j < result.length; j++) {
                    const nextChord = result[j];
                    // Search in fingers array
                    const nextFinger = nextChord.chord.fingers.find(f => f.string === effect.string || (f.endString && effect.string >= Math.min(f.string, f.endString) && effect.string <= Math.max(f.string, f.endString)));
                    if (nextFinger) {
                        effect.toFret = nextFinger.fret;
                        break; // Found target
                    }
                }
            }
        });
    }

    // Debug: Log to verify no reference sharing
    if (result.length > 0) {
        console.log('[measuresToChords] Generated', result.length, 'chords');
        result.forEach((chord, idx) => {
            const fingersStr = chord.finalChord.fingers.map(f => `${f.string}:${f.fret}`).join(',');
            console.log(`  [${idx}] ${chord.finalChord.chordName || 'unnamed'} - fingers: ${fingersStr}`);
        });
    }

    return result;
}

function createEmptyChord(): ChordDiagramProps {
    // Always return fresh objects to prevent reference sharing
    return {
        chord: { note: 0, complement: 0, extension: [], bass: 0 },
        origin: 0,
        fingers: [],
        avoid: [],
        list: false
    };
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/abstract/AbstractTimelinePanel.ts ---
import React from "react";
import { ITimelinePanelProps } from "../interfaces/TimelinePanel";

export abstract class AbstractTimelinePanel<P extends ITimelinePanelProps = ITimelinePanelProps, S = {}> extends React.Component<P, S> {
  abstract render(): React.ReactNode;
  // Métodos utilitários comuns podem ser adicionados aqui
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/abstract/AbstractVisualEditor.ts ---
import React from "react";
import { IVisualEditorProps } from "../interfaces/VisualEditor";

export abstract class AbstractVisualEditor<P extends IVisualEditorProps = IVisualEditorProps, S = {}> extends React.Component<P, S> {
  abstract render(): React.ReactNode;
  // Métodos utilitários comuns podem ser adicionados aqui
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/interfaces/AppHeader.ts ---
export interface IAppHeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/interfaces/LibraryPanel.ts ---
export interface ILibraryPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/interfaces/SettingsPanel.ts ---
export interface ISettingsPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/interfaces/TimelinePanel.ts ---
export interface ITimelinePanelProps {
  isAnimating: boolean;
  isPaused: boolean;
  ffmpegLoaded: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
  isTimelineEmpty: boolean;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/interfaces/VisualEditor.ts ---
export interface IVisualEditorProps {
  measures: any[];
  selectedNoteIds: string[];
  timeSignature: string;
  activeDuration: any;
  hasClipboard: boolean;
  onSelectNote: (id: string, multi: boolean) => void;
  onDoubleClickNote: (id: string) => void;
  onAddNote: (measureId: string) => void;
  onUpdateNote: (id: string, updates: any) => void;
  onRemoveMeasure: (id: string) => void;
  onAddMeasure: () => void;
  onUpdateMeasure: (id: string, updates: any) => void;
  onToggleCollapse: (id: string) => void;
  onCopyMeasure: (id: string) => void;
  onPasteMeasure: (id: string) => void;
  onReorderMeasures: (from: number, to: number) => void;
  onRemoveNote: (id: string) => void;
  onSelectMeasure: (id: string) => void;
  selectedMeasureId: string | null;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/lib/instruments.ts ---
export interface InstrumentPreset {
    id: string;
    name: string;
    tunings: string[][];
}

export const INSTRUMENTS: InstrumentPreset[] = [
    {
        id: "violao",
        name: "Violão / Guitarra (6 cordas)",
        tunings: [
            ["E", "A", "D", "G", "B", "e"],
            ["D", "A", "D", "G", "B", "e"],
            ["D", "A", "D", "G", "A", "D"],
            ["E", "B", "E", "G#", "B", "E"]
        ]
    },
    {
        id: "baixo-4",
        name: "Baixo (4 cordas)",
        tunings: [
            ["E", "A", "D", "G"],
            ["D", "A", "D", "G"],
            ["B", "E", "A", "D"]
        ]
    },
    {
        id: "baixo-5",
        name: "Baixo (5 cordas)",
        tunings: [
            ["B", "E", "A", "D", "G"],
            ["E", "A", "D", "G", "C"]
        ]
    },
    {
        id: "ukulele",
        name: "Ukulele",
        tunings: [
            ["G", "C", "E", "A"],
            ["A", "D", "F#", "B"]
        ]
    },
    {
        id: "cavaco",
        name: "Cavaquinho",
        tunings: [
            ["D", "G", "B", "D"],
            ["D", "G", "B", "E"]
        ]
    }
];

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/lib/shared/hooks/useCanvasRecorder.ts ---
import { useRef, useState, useCallback, useMemo } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export interface CanvasRecorderOptions {
    fps?: number;
    format?: 'webm' | 'mp4';
    quality?: 'low' | 'medium' | 'high' | 'ultra';
}

export interface CanvasRecorderResult {
    isRecording: boolean;
    isRendering: boolean;
    isComplete: boolean;
    renderProgress: number;
    estimatedTime: number | null; // seconds remaining
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    renderToFile: (onProgress?: (progress: number) => void) => Promise<Blob | null>;
    convertWebMToMP4: (webmBlob: Blob, onProgress?: (progress: number) => void) => Promise<Blob | null>;
    captureFrame: (canvas: HTMLCanvasElement, index: number) => Promise<void>;
    renderFramesToVideo: (totalFrames: number, onProgress?: (progress: number) => void) => Promise<Blob | null>;
    setRenderProgress: (progress: number) => void;
    setRenderStatus: (status: string | null) => void;
    setIsRendering: (isRendering: boolean) => void;
    setIsComplete: (isComplete: boolean) => void;
    cancelRender: () => void;
    downloadVideo: (blob: Blob, filename?: string) => void;
    error: string | null;
    renderStatus: string | null;
}

const QUALITY_SETTINGS = {
    low: { crf: 28, preset: 'ultrafast', bitrate: 5000000, scale: 0.5 },    // 960x540
    medium: { crf: 22, preset: 'fast', bitrate: 15000000, scale: 0.75 },   // 1440x810
    high: { crf: 12, preset: 'veryfast', bitrate: 45000000, scale: 1 },    // 1920x1080
    ultra: { crf: 0, preset: 'faster', bitrate: 100000000, scale: 2 },     // 3840x2160 (4K)
};

/**
 * Unified canvas recorder hook for both /studio and /tab-editor
 * Supports WebM (fast, real-time) and MP4 (compatible, FFmpeg-based)
 */
export function useCanvasRecorder(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    options: CanvasRecorderOptions = {}
): CanvasRecorderResult {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const ffmpegLoadPromiseRef = useRef<Promise<void> | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const frameCountRef = useRef(0);
    const isCancelledRef = useRef(false);
    const masterCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);
    const [renderStatus, setRenderStatus] = useState<string | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const renderStartTimeRef = useRef<number | null>(null);

    const {
        fps = 30,
        format = 'webm',
        quality = 'medium'
    } = useMemo(() => options, [options.fps, options.format, options.quality]);

    // Load FFmpeg (only needed for MP4)
    const loadFFmpeg = useCallback(async () => {
        if (ffmpegRef.current?.loaded) return;
        if (ffmpegLoadPromiseRef.current) return ffmpegLoadPromiseRef.current;

        ffmpegLoadPromiseRef.current = (async () => {
            const ffmpeg = new FFmpeg();
            ffmpegRef.current = ffmpeg;

            try {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
                setRenderStatus('Iniciando motor de vídeo...');
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
            } catch (err) {
                console.error('FFmpeg load error:', err);
                ffmpegLoadPromiseRef.current = null;
                throw err;
            }
        })();

        return ffmpegLoadPromiseRef.current;
    }, []);

    // WebM Recording (real-time, fast)
    const startRecording = useCallback(async () => {
        const container = canvasRef.current;
        if (!container) throw new Error('Container not found');

        setIsRecording(true);
        setError(null);
        chunksRef.current = [];

        try {
            const qualityCfg = (QUALITY_SETTINGS as any)[quality];
            const scaleFactor = qualityCfg.scale;
            const firstCanvas = container.querySelector('canvas');
            const sourceWidth = firstCanvas ? firstCanvas.width : 1920;
            const sourceHeight = firstCanvas ? firstCanvas.height : 1080;

            const targetWidth = Math.round(sourceWidth * scaleFactor);
            const targetHeight = Math.round(sourceHeight * scaleFactor);

            // Create Master Canvas
            if (!masterCanvasRef.current) {
                masterCanvasRef.current = document.createElement('canvas');
            }

            const masterCanvas = masterCanvasRef.current;
            masterCanvas.width = targetWidth;
            masterCanvas.height = targetHeight;

            const masterCtx = masterCanvas.getContext('2d', { alpha: false });
            if (!masterCtx) throw new Error('Failed to get master canvas context');

            // Force high-quality scaling
            masterCtx.imageSmoothingEnabled = true;
            masterCtx.imageSmoothingQuality = 'high';

            // Draw initial frame if background is needed
            masterCtx.fillStyle = '#09090b';
            masterCtx.fillRect(0, 0, targetWidth, targetHeight);

            // Find available mime types
            const mimeTypes = [
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm',
            ];
            const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
            console.log(`Starting ${quality} recording at ${targetWidth}x${targetHeight} (${scaleFactor}x scale)`);

            const stream = masterCanvas.captureStream(fps);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: qualityCfg.bitrate,
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(100); // Collect chunks every 100ms
            mediaRecorderRef.current = mediaRecorder;

            // Start Capture Loop
            const captureLoop = () => {
                const canvases = container.querySelectorAll('canvas');
                if (masterCtx && canvases.length > 0) {
                    // Clear background every frame to prevent smearing/ghosting
                    masterCtx.fillStyle = '#09090b';
                    masterCtx.fillRect(0, 0, targetWidth, targetHeight);

                    // Draw layers sequentially (Notation -> Playhead)
                    canvases.forEach(c => {
                        masterCtx.drawImage(c, 0, 0, targetWidth, targetHeight);
                    });
                }
                animationFrameRef.current = requestAnimationFrame(captureLoop);
            };
            captureLoop();

        } catch (err: any) {
            setError(err.message);
            setIsRecording(false);
            throw err;
        }
    }, [canvasRef, fps, quality]);

    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        // Add a buffer delay to ensure final frames are captured and encoded
        await new Promise(resolve => setTimeout(resolve, 500));

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;
            if (!mediaRecorder) {
                resolve(null);
                return;
            }

            mediaRecorder.onstop = () => {
                const type = mediaRecorder.mimeType || 'video/webm';
                const blob = new Blob(chunksRef.current, { type });
                chunksRef.current = [];
                setIsRecording(false);

                // For WebM, finishing recording is finishing the whole process
                if (format === 'webm') {
                    setIsRendering(false);
                    setIsComplete(true);
                    setRenderProgress(100);
                }

                resolve(blob);
            };

            mediaRecorder.stop();
        });
    }, [format]);

    // Convert WebM to MP4 using FFmpeg
    const convertWebMToMP4 = useCallback(async (webmBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob | null> => {
        try {
            console.log('Starting WebM to MP4 conversion...');
            console.log('WebM blob size:', webmBlob.size, 'bytes');
            console.log('WebM blob type:', webmBlob.type);

            // Validate WebM blob
            if (!webmBlob || webmBlob.size === 0) {
                throw new Error('WebM blob is empty or invalid');
            }

            if (webmBlob.size < 1000) {
                console.warn('WebM blob is very small, might be incomplete');
            }

            // Create a fresh FFmpeg instance for this conversion
            const ffmpeg = new FFmpeg();

            ffmpeg.on('log', ({ message }) => {
                console.log('[FFmpeg]:', message);
            });

            if (onProgress) onProgress(5);
            setRenderProgress(Math.max(renderProgress, 5));
            setRenderStatus('Carregando motor...');
            setIsComplete(false);
            renderStartTimeRef.current = Date.now();
            setEstimatedTime(null);

            try {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
                console.log('FFmpeg loaded successfully');

                // Wait a bit to ensure FFmpeg is fully initialized
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (loadErr) {
                console.error('FFmpeg load error:', loadErr);
                throw new Error(`Failed to load FFmpeg: ${loadErr}`);
            }

            if (onProgress) onProgress(10);
            setRenderProgress(10);
            setRenderStatus('Preparando arquivos...');

            // Write WebM file to FFmpeg virtual filesystem
            console.log('Writing WebM to FFmpeg FS...');
            const webmData = await fetchFile(webmBlob);
            console.log('WebM data size:', webmData.byteLength, 'bytes');

            try {
                await ffmpeg.writeFile('input.webm', webmData);
                console.log('WebM file written successfully');
            } catch (writeErr) {
                console.error('Error writing WebM file:', writeErr);
                throw new Error(`Failed to write WebM file: ${writeErr}`);
            }

            if (onProgress) onProgress(30);
            setRenderProgress(30);
            setRenderStatus('Convertendo para MP4...');

            // Convert WebM to MP4
            console.log('Starting FFmpeg conversion...');
            const qualitySettings = (QUALITY_SETTINGS as any)[quality];
            const progressHandler = (event: any) => {
                // Robust progress extraction
                let ratio = 0;
                if (typeof event === 'number') {
                    ratio = event;
                } else if (event && typeof event.progress === 'number') {
                    ratio = event.progress;
                } else if (event && typeof event.ratio === 'number') {
                    ratio = event.ratio;
                }

                // Clamp ratio to 0..1 range
                const safeRatio = Math.max(0, Math.min(1, ratio));
                const mappedProgress = 25 + (safeRatio * 70); // 25% to 95%

                setRenderProgress(mappedProgress);
                setRenderStatus(`Convertendo para MP4: ${Math.round(safeRatio * 100)}%...`);

                // Calculate estimated time remaining safely
                if (renderStartTimeRef.current && safeRatio > 0.02) {
                    const elapsed = (Date.now() - renderStartTimeRef.current) / 1000;
                    const totalEstimated = elapsed / safeRatio;
                    const remaining = Math.max(0, totalEstimated - elapsed);

                    // Only update if it's a sensible number (less than 1 hour)
                    if (remaining < 3600) {
                        setEstimatedTime(Math.round(remaining));
                    }
                }

                if (onProgress) onProgress(mappedProgress);
                console.log('FFmpeg Progress:', { ratio: safeRatio, mapped: mappedProgress, raw: event });
            };

            ffmpeg.on('progress', progressHandler);

            try {
                const ffmpegArgs = [
                    '-i', 'input.webm',
                    '-c:v', 'libx264',
                    '-pix_fmt', quality === 'ultra' ? 'yuv444p' : 'yuv420p',
                    '-preset', qualitySettings.preset,
                    '-crf', String(qualitySettings.crf),
                    '-tune', 'animation',
                    '-movflags', '+faststart',
                    'output.mp4'
                ];
                await ffmpeg.exec(ffmpegArgs);
                console.log('FFmpeg conversion completed');
            } catch (execErr) {
                console.error('FFmpeg exec error:', execErr);
                throw new Error(`FFmpeg conversion failed: ${execErr}`);
            } finally {
                ffmpeg.off('progress', progressHandler);
            }

            if (onProgress) onProgress(95);
            setRenderProgress(95);

            // Read output MP4
            console.log('Reading output MP4...');
            const data = await ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });
            console.log('MP4 blob created successfully, size:', mp4Blob.size, 'bytes');

            // Cleanup
            try {
                await ffmpeg.deleteFile('input.webm');
                await ffmpeg.deleteFile('output.mp4');
                console.log('Cleanup completed');
            } catch (cleanupErr) {
                console.warn('Cleanup error (non-fatal):', cleanupErr);
            }

            // Terminate FFmpeg instance
            try {
                ffmpeg.terminate();
                console.log('FFmpeg instance terminated');
            } catch (termErr) {
                console.warn('FFmpeg termination error (non-fatal):', termErr);
            }

            if (onProgress) onProgress(100);
            setRenderProgress(100);
            setRenderStatus('Renderização Concluída');
            setIsComplete(true);
            setEstimatedTime(0);

            return mp4Blob;
        } catch (err: any) {
            console.error('WebM to MP4 conversion error:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack,
                name: err.name
            });
            setError(err.message || 'Conversion failed');
            setIsRendering(false);
            return null;
        }
    }, [quality]);

    const captureFrame = useCallback(async (canvas: HTMLCanvasElement, index: number) => {
        try {
            await loadFFmpeg();
            const ffmpeg = ffmpegRef.current!;

            // Format index as 0000
            const fileName = `frame${String(index).padStart(4, '0')}.png`;

            // Get canvas data as blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png');
            });

            const data = await fetchFile(blob);
            await ffmpeg.writeFile(fileName, data);

            // Also keep track of frames needed for conversion
            frameCountRef.current = Math.max(frameCountRef.current, index + 1);
        } catch (err: any) {
            console.error('Frame capture error:', err);
            setError(`Capture failed at frame ${index}: ${err.message}`);
        }
    }, [loadFFmpeg]);

    const renderFramesToVideo = useCallback(async (totalFrames: number, onProgress?: (progress: number) => void): Promise<Blob | null> => {
        try {
            await loadFFmpeg();
            const ffmpeg = ffmpegRef.current;
            if (!ffmpeg) throw new Error('FFmpeg not initialized');

            setIsRendering(true);
            setIsComplete(false);
            renderStartTimeRef.current = Date.now();

            const qualitySettings = (QUALITY_SETTINGS as any)[quality];
            const progressHandler = (event: any) => {
                let ratio = 0;
                if (typeof event === 'number') ratio = event;
                else if (event && typeof event.progress === 'number') ratio = event.progress;

                const safeRatio = Math.max(0, Math.min(1, ratio));
                const mappedProgress = 20 + (safeRatio * 75); // 20% to 95%
                setRenderProgress(mappedProgress);

                const currentFrame = Math.round(safeRatio * totalFrames);
                const percent = Math.round(safeRatio * 100);
                setRenderStatus(`Processando quadro ${currentFrame} de ${totalFrames} (${percent}%)...`);

                if (onProgress) onProgress(mappedProgress);
            };

            ffmpeg.on('progress', progressHandler);

            try {
                // Use yuv444p for Ultra quality to avoid chroma blurring
                const pixFmt = quality === 'ultra' ? 'yuv444p' : 'yuv420p';

                const ffmpegArgs = [
                    '-framerate', String(fps),
                    '-i', 'frame%04d.png',
                    '-c:v', 'libx264',
                    '-pix_fmt', pixFmt,
                    '-preset', qualitySettings.preset,
                    '-crf', String(qualitySettings.crf),
                    '-tune', 'animation',
                    '-movflags', '+faststart',
                    'output.mp4'
                ];

                await ffmpeg.exec(ffmpegArgs);
            } finally {
                ffmpeg.off('progress', progressHandler);
            }

            const data = await ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });

            // Cleanup FS
            for (let i = 0; i < totalFrames; i++) {
                try {
                    await ffmpeg.deleteFile(`frame${String(i).padStart(4, '0')}.png`);
                } catch (e) { }
            }
            await ffmpeg.deleteFile('output.mp4');

            setIsComplete(true);
            setRenderProgress(100);
            return mp4Blob;
        } catch (err: any) {
            setError(err.message);
            setIsRendering(false);
            return null;
        }
    }, [quality, fps]);

    // MP4 Rendering (record as WebM, then convert to MP4)
    const renderToFile = useCallback(async (onProgress?: (progress: number) => void): Promise<Blob | null> => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not found');

        // For MP4, we record as WebM first, then convert
        // This is handled by the parent component calling startRecording/stopRecording
        // and then calling convertWebMToMP4

        // For now, just start recording
        if (format === 'mp4') {
            setIsRendering(true);
            setIsComplete(false);
            setRenderProgress(0);
            await startRecording();
            return null; // Parent will handle the rest
        }

        // For WebM, use direct recording
        setIsRendering(true);
        setIsComplete(false);
        setRenderProgress(0);
        await startRecording();
        return null;
    }, [canvasRef, format, startRecording]);

    const cancelRender = useCallback(() => {
        isCancelledRef.current = true;
        if (ffmpegRef.current) {
            try {
                ffmpegRef.current.terminate();
                console.log('FFmpeg terminated');
            } catch (e) {
                console.error('Error terminating FFmpeg:', e);
            }
        }
        setIsRendering(false);
        setIsComplete(false);
        setRenderProgress(0);
        setEstimatedTime(null);
    }, []);

    const downloadVideo = useCallback((blob: Blob, filename: string = 'video') => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    return useMemo(() => ({
        isRecording,
        isRendering,
        isComplete,
        renderProgress,
        estimatedTime,
        startRecording,
        stopRecording,
        renderToFile,
        convertWebMToMP4,
        captureFrame,
        renderFramesToVideo,
        setRenderProgress,
        setRenderStatus,
        setIsRendering,
        setIsComplete,
        cancelRender,
        downloadVideo,
        error,
        renderStatus,
    }), [
        isRecording,
        isRendering,
        isComplete,
        renderProgress,
        estimatedTime,
        startRecording,
        stopRecording,
        renderToFile,
        convertWebMToMP4,
        captureFrame,
        renderFramesToVideo,
        setRenderProgress,
        setRenderStatus,
        setIsRendering,
        setIsComplete,
        cancelRender,
        downloadVideo,
        error,
        renderStatus,
    ]);
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/application/utils.ts ---
import type { TimelineTrack } from "../domain/types";

/**
 * Converte tempo em ms para formato legível
 */
export function formatTimeMs(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const decimals = Math.floor((totalSeconds % 1) * 10);

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${decimals}`;
}

/**
 * Converte posição X para tempo em ms
 */
export function xToTime(x: number, zoom: number): number {
  return Math.max(0, (x / zoom) * 1000);
}

/**
 * Converte delta X (px) para delta de tempo (ms).
 * Diferente de xToTime, aqui pode ser negativo (arrastar para esquerda).
 */
export function xDeltaToTime(deltaX: number, zoom: number): number {
  return (deltaX / zoom) * 1000;
}

/**
 * Converte tempo em ms para posição X
 */
export function timeToX(time: number, zoom: number): number {
  return (time / 1000) * zoom;
}

/**
 * Arredonda tempo para o grid mais próximo
 */
export function snapToGrid(time: number, gridSize: number = 100): number {
  return Math.round(time / gridSize) * gridSize;
}


export function generateClipId(): string {
  // Usamos apenas um sufixo aleatório para IDs gerados em tempo de execução
  return `clip-${Math.random().toString(36).substring(2, 11)}`;
}


/**
 * Limita valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calcula o tempo final máximo de todas as tracks.
 */
export function calculateMaxTrackEndTime(tracks: TimelineTrack[]): number {
  let maxEndTime = 0;
  for (const track of tracks) {
    for (const clip of track.clips) {
      const endTime = clip.start + clip.duration;
      if (endTime > maxEndTime) {
        maxEndTime = endTime;
      }
    }
  }
  return maxEndTime;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/domain/types.ts ---
/**
 * 🎬 Timeline Types
 * Sistema de timeline horizontal para controle de tempo dos acordes
 */

import type { ChordDiagramProps } from "@/modules/core/domain/types";

export type ClipType = 'chord' | 'audio' | 'symbol' | 'score';

export interface ScoreNote {
  keys: string[]; // e.g., ["c/4"]
  duration: string; // "w", "h", "q", "8", "16"
  positions?: { str: number; fret: number }[]; // For tablature
  dots?: number;
  clef?: string;
  isRest?: boolean;
}

export interface ScoreClip extends BaseClip {
  type: 'score';
  name?: string;
  notes: ScoreNote[];
  clef?: string;
  timeSignature?: string;
  keySignature?: string;
}

/**
 * Base interface for all timeline clips
 */
export interface BaseClip {
  id: string;
  start: number;    // tempo de início em ms
  duration: number; // duração em ms
}

/**
 * Represents a musical symbol clip (notes, clefs, etc.)
 */
export interface SymbolClip extends BaseClip {
  type: 'symbol';
  name: string; // e.g., "Treble Clef"
  vexFlowProps: any; // Props to pass to VexFlowIcon
}

/**
 * Represents a chord clip on the timeline
 */
export interface ChordClip extends BaseClip {
  type: 'chord';
  chord: ChordDiagramProps;
  finalChord?: ChordDiagramProps; // Pre-calculated transposed chord
  transportDisplay?: number;    // Pre-calculated transpose display value
}

/**
 * Represents an audio clip on the timeline
 */
export interface AudioClip extends BaseClip {
  type: 'audio';
  fileName: string;
  audioUrl: string;
  waveform: number[];
}

// A clip can be one of the defined types
export type TimelineClip = ChordClip | AudioClip | SymbolClip | ScoreClip;

/**
 * Representa uma track (faixa/layer) na timeline
 */
export interface TimelineTrack {
  id: string;
  name: string;
  type: ClipType; // Tracks are typed now
  clips: TimelineClip[];
}

/**
 * Estado completo da timeline
 */
export interface TimelineState {
  tracks: TimelineTrack[];
  totalDuration: number; // duração total em ms
  zoom: number;          // nível de zoom (px por segundo)
}

/**
 * Informações sobre o clip sendo arrastado/redimensionado
 */
export interface DragState {
  clipId: string;
  trackId: string;
  startX: number;
  initialStart: number;
  initialDuration: number;
  mode: 'move' | 'resize-left' | 'resize-right';
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/infrastructure/adapter.ts ---
/**
 * 🔌 Timeline Adapter
 * Converte TimelineState → ChordTiming[] para o VideoCanvasStage
 */

import type { TimelineState } from "../domain/types";
// TODO: Replace this with the correct import if ChordTiming is exported elsewhere
export type ChordTiming = {
  holdDuration: number;
  transitionDuration: number;
  pauseDuration: number;
};

/**
 * Converte o estado da timeline para array de timings
 * que o VideoCanvasStage entende
 */
export function timelineToChordTimings(
  timeline: TimelineState,
  transitionDuration: number = 0.8,
  pauseDuration: number = 0.3
): ChordTiming[] {
  const track = timeline.tracks[0]; // por enquanto só uma track
  if (!track) return [];

  return track.clips.map(clip => ({
    holdDuration: clip.duration / 1000,      // ms → segundos
    transitionDuration: transitionDuration,   // pode ser customizado por clip no futuro
    pauseDuration: pauseDuration              // pode ser customizado por clip no futuro
  }));
}

/**
 * Calcula a duração total necessária baseada nos clips
 */
export function calculateTotalDuration(timeline: TimelineState): number {
  const track = timeline.tracks[0];
  if (!track || track.clips.length === 0) return 30000; // default 30s

  const lastClip = track.clips.reduce((max, clip) => {
    const clipEnd = clip.start + clip.duration;
    return clipEnd > max ? clipEnd : max;
  }, 0);

  return Math.max(lastClip + 5000, 30000); // +5s de margem, mínimo 30s
}

/**
 * Verifica se há overlap entre clips
 */
export function hasOverlap(timeline: TimelineState): boolean {
  const track = timeline.tracks[0];
  if (!track) return false;

  const sorted = [...track.clips].sort((a, b) => a.start - b.start);
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    
    if (current.start + current.duration > next.start) {
      return true;
    }
  }
  
  return false;
}

/**
 * Ajusta clips para evitar overlap (snap)
 */
export function snapClips(timeline: TimelineState, gap: number = 0): TimelineState {
  const track = timeline.tracks[0];
  if (!track) return timeline;

  const sorted = [...track.clips].sort((a, b) => a.start - b.start);
  const adjusted = sorted.map((clip, index) => {
    if (index === 0) return clip;
    
    const prev = sorted[index - 1];
    const minStart = prev.start + prev.duration + gap;
    
    if (clip.start < minStart) {
      return { ...clip, start: minStart };
    }
    
    return clip;
  });

  return {
    ...timeline,
    tracks: [{
      ...track,
      clips: adjusted
    }]
  };
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/application/command-manager.ts ---
import { Command, CommandHistory } from '../domain/interfaces/command';

export class CommandManager implements CommandHistory {
    private history: Command[] = [];
    private redoStack: Command[] = [];

    execute(command: Command): void {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Clear redo stack on new command
    }

    undo(): void {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
        }
    }

    get canUndo(): boolean {
        return this.history.length > 0;
    }

    get canRedo(): boolean {
        return this.redoStack.length > 0;
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/domain/constants.ts ---
export const KEY_SIGNATURE_MAP: { [key: number]: string } = {
    '-7': 'Cb', '-6': 'Gb', '-5': 'Db', '-4': 'Ab', '-3': 'Eb', '-2': 'Bb', '-1': 'F',
    '0': 'C', '1': 'G', '2': 'D', '3': 'A', '4': 'E', '5': 'B', '6': 'F#', '7': 'C#'
};

export const CLEF_MAP: { [key: string]: string } = {
    'G2': 'treble',
    'F4': 'bass',
    'C3': 'alto',
    'C4': 'tenor',
    'TAB': 'tab'
};

export const MIDI_TO_NOTE_NAME: { [key: number]: string } = {
    21: 'a/0', 22: 'bb/0', 23: 'b/0',
    24: 'c/1', 25: 'db/1', 26: 'd/1', 27: 'eb/1', 28: 'e/1', 29: 'f/1', 30: 'gb/1', 31: 'g/1', 32: 'ab/1', 33: 'a/1', 34: 'bb/1', 35: 'b/1',
    36: 'c/2', 37: 'db/2', 38: 'd/2', 39: 'eb/2', 40: 'e/2', 41: 'f/2', 42: 'gb/2', 43: 'g/2', 44: 'ab/2', 45: 'a/2', 46: 'bb/2', 47: 'b/2',
    48: 'c/3', 49: 'db/3', 50: 'd/3', 51: 'eb/3', 52: 'e/3', 53: 'f/3', 54: 'gb/3', 55: 'g/3', 56: 'ab/3', 57: 'a/3', 58: 'bb/3', 59: 'b/3',
    60: 'c/4', 61: 'db/4', 62: 'd/4', 63: 'eb/4', 64: 'e/4', 65: 'f/4', 66: 'gb/4', 67: 'g/4', 68: 'ab/4', 69: 'a/4', 70: 'bb/4', 71: 'b/4',
    72: 'c/5', 73: 'db/5', 74: 'd/5', 75: 'eb/5', 76: 'e/5', 77: 'f/5', 78: 'gb/5', 79: 'g/5', 80: 'ab/5', 81: 'a/5', 82: 'bb/5', 83: 'b/5',
    84: 'c/6', 85: 'db/6', 86: 'd/6', 87: 'eb/6', 88: 'e/6', 89: 'f/6', 90: 'gb/6', 91: 'g/6', 92: 'ab/6', 93: 'a/6', 94: 'bb/6', 95: 'b/6',
    96: 'c/7', 97: 'db/7', 98: 'd/7', 99: 'eb/7', 100: 'e/7', 101: 'f/7', 102: 'gb/7', 103: 'g/7', 104: 'ab/7', 105: 'a/7', 106: 'bb/7', 107: 'b/7',
    108: 'c/8'
};

export const DURATION_MAP: { [key: string]: string } = {
    'whole': 'w',
    'half': 'h',
    'quarter': 'q',
    'eighth': '8',
    '16th': '16',
    '32nd': '32'
};

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/domain/interfaces/command.ts ---
export interface Command {
    id: string;
    execute(): void;
    undo(): void;
}

export interface CommandHistory {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
    canUndo: boolean;
    canRedo: boolean;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/infrastructure/services/mscz-parser.ts ---

import { ScoreData, MusicalMeasure, MusicalNote, TabData } from '../../domain/types';
import { KEY_SIGNATURE_MAP, CLEF_MAP, MIDI_TO_NOTE_NAME, DURATION_MAP } from '../../domain/constants';

declare const JSZip: any;

export class MSCZParser {
  static async parse(file: File): Promise<ScoreData> {
    const zip = await JSZip.loadAsync(file);
    const mscxFile = Object.keys(zip.files).find(name => name.endsWith('.mscx'));

    if (!mscxFile) throw new Error("Arquivo .mscz inválido.");

    const xmlText = await zip.files[mscxFile].async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    return this.extractData(xmlDoc);
  }

  private static extractData(doc: Document): ScoreData {
    const title = doc.querySelector('metaTag[name="workTitle"]')?.textContent || 'Sem Título';
    const composer = doc.querySelector('metaTag[name="composer"]')?.textContent || 'Desconhecido';
    const tempoText = doc.querySelector('Tempo text')?.textContent || '120';
    const tempo = parseInt(tempoText) || 120;

    const measures: MusicalMeasure[] = [];
    const measureElements = doc.querySelectorAll('Measure');

    let currentClef = 'treble';
    let currentKey = 'C';
    let currentSigN = 4;
    let currentSigD = 4;

    measureElements.forEach((measureEl, index) => {
      const clefTag = measureEl.querySelector('Clef');
      if (clefTag) {
        const sign = clefTag.querySelector('sign')?.textContent || 'G';
        const line = clefTag.querySelector('line')?.textContent || '2';
        currentClef = CLEF_MAP[sign + line] || CLEF_MAP[sign] || 'treble';
      }

      const keyTag = measureEl.querySelector('KeySig accid');
      if (keyTag) {
        currentKey = KEY_SIGNATURE_MAP[parseInt(keyTag.textContent || '0')] || 'C';
      }

      const sigN = measureEl.querySelector('TimeSig sigN')?.textContent;
      const sigD = measureEl.querySelector('TimeSig sigD')?.textContent;
      if (sigN && sigD) {
        currentSigN = parseInt(sigN);
        currentSigD = parseInt(sigD);
      }

      const notes: MusicalNote[] = [];
      let measureTickOffset = 0;

      const voiceItems = measureEl.querySelectorAll('voice > Chord, voice > Rest');
      voiceItems.forEach((item) => {
        const durationType = item.querySelector('durationType')?.textContent || 'quarter';
        const dots = parseInt(item.querySelector('dots')?.textContent || '0');
        const vexDuration = DURATION_MAP[durationType] || 'q';
        const isRest = item.tagName === 'Rest';

        let baseTicks = 480;
        if (durationType === 'whole') baseTicks = 1920;
        else if (durationType === 'half') baseTicks = 960;
        else if (durationType === 'eighth') baseTicks = 240;
        else if (durationType === '16th') baseTicks = 120;
        else if (durationType === '32nd') baseTicks = 60;

        let totalTicks = baseTicks;
        let added = baseTicks / 2;
        for (let i = 0; i < dots; i++) {
          totalTicks += added;
          added /= 2;
        }

        const noteKeys: string[] = [];
        const accidentals: (string | null)[] = [];
        const tabEntries: TabData[] = [];

        if (!isRest) {
          const noteTags = item.querySelectorAll('Note');
          noteTags.forEach(nTag => {
            const pitch = parseInt(nTag.querySelector('pitch')?.textContent || '60');
            const accidTag = nTag.querySelector('accidental')?.textContent;
            const fretTag = nTag.querySelector('fret')?.textContent;
            const stringTag = nTag.querySelector('string')?.textContent;

            noteKeys.push(MIDI_TO_NOTE_NAME[pitch] || 'c/4');

            let vexAccid = null;
            if (accidTag === 'flat') vexAccid = 'b';
            else if (accidTag === 'sharp') vexAccid = '#';
            else if (accidTag === 'natural') vexAccid = 'n';

            accidentals.push(vexAccid);

            if (fretTag && stringTag) {
              tabEntries.push({
                fret: parseInt(fretTag),
                str: parseInt(stringTag)
              });
            }
          });
        } else {
          noteKeys.push('b/4');
          accidentals.push(null);
        }

        // Fix: Added missing 'id' property required by MusicalNote interface
        notes.push({
          id: Math.random().toString(36).substring(2, 11),
          keys: noteKeys,
          duration: vexDuration + (isRest ? 'r' : ''),
          type: isRest ? 'rest' : 'note',
          ticks: totalTicks,
          startTime: measureTickOffset,
          accidentals,
          dots,
          tabData: tabEntries.length > 0 ? tabEntries : undefined
        });

        measureTickOffset += totalTicks;
      });

      measures.push({
        number: index + 1,
        notes,
        clef: currentClef,
        keySignature: currentKey,
        timeSignature: { numerator: currentSigN, denominator: currentSigD },
        totalTicks: measureTickOffset
      });
    });

    return { title, composer, measures, tempo };
  }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/infrastructure/store/use-project-store.ts ---
import { create } from 'zustand';
import { ProjectData } from '../../domain/types';

interface ProjectState {
    project: ProjectData;
    isPlaying: boolean;
    currentTime: number; // in seconds
    zoomLevel: number; // timeline zoom

    // Actions
    setProject: (project: ProjectData) => void;
    togglePlay: () => void;
    setTime: (time: number) => void;
    setZoom: (zoom: number) => void;
}

const defaultProject: ProjectData = {
    id: 'new-project',
    name: 'Untitled Project',
    bpm: 120,
    timeSignature: [4, 4],
    tracks: [],
    duration: 300
};

export const useProjectStore = create<ProjectState>((set) => ({
    project: defaultProject,
    isPlaying: false,
    currentTime: 0,
    zoomLevel: 100,

    setProject: (project) => set({ project }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setTime: (time) => set({ currentTime: time }),
    setZoom: (zoom) => set({ zoomLevel: zoom }),
}));

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/editor/domain/clone-utils.ts ---
import { MeasureData, NoteData } from '@/modules/editor/domain/types';

/**
 * Deep clone utility for editor data structures
 * Ensures no reference sharing between objects
 */

const generateId = () => Math.random().toString(36).substr(2, 9);

export function deepCloneNote(note: NoteData, newId: boolean = false): NoteData {
    return {
        ...note,
        id: newId ? generateId() : note.id,
        positions: note.positions.map(p => ({ ...p })),
        decorators: { ...note.decorators }
    };
}

export function deepCloneMeasure(measure: MeasureData, newId: boolean = false): MeasureData {
    return {
        ...measure,
        id: newId ? generateId() : measure.id,
        notes: measure.notes.map(note => deepCloneNote(note, newId))
    };
}

export function deepCloneMeasures(measures: MeasureData[]): MeasureData[] {
    return measures.map(m => deepCloneMeasure(m, false));
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/editor/domain/music-math.ts ---

import { Chord } from "@tonaljs/tonal";
import { NoteData } from "@/modules/editor/domain/types";
export const STRING_BASES = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface Pitch {
    name: string;
    accidental: string;
    octave: number;
}

export function getMidiFromPosition(fret: number, stringIdx: number): number {
    const base = STRING_BASES[stringIdx - 1] || STRING_BASES[0];
    return base + (isNaN(fret) ? 0 : fret);
}

export function getPitchFromMidi(midi: number): Pitch {
    if (isNaN(midi)) return { name: 'C', accidental: '', octave: 4 };
    const octave = Math.floor(midi / 12) - 1;
    const noteIdx = ((midi % 12) + 12) % 12;
    const fullName = NOTE_NAMES[noteIdx] || 'C';
    const name = fullName[0];
    const accidental = fullName.length > 1 ? fullName[1] : '';
    return { name, accidental, octave };
}

export function getNoteKeyFromFret(fret: number, stringIdx: number): string {
    const midi = getMidiFromPosition(fret, stringIdx);
    const { name, accidental, octave } = getPitchFromMidi(midi);
    return `${name.toLowerCase()}${accidental}/${octave}`;
}

export function getMidiFromPitch(name: string, accidental: string, octave: number): number {
    let noteIdx = NOTE_NAMES.indexOf(name);
    if (accidental === '#') noteIdx = NOTE_NAMES.indexOf(name + '#');
    if (accidental === 'b') {
        const flatMap: Record<string, number> = { 'Cb': 11, 'Db': 1, 'Eb': 3, 'Fb': 4, 'Gb': 6, 'Ab': 8, 'Bb': 10 };
        noteIdx = flatMap[name + accidental] ?? noteIdx - 1;
    }
    return (octave + 1) * 12 + noteIdx;
}

export function findBestFretForPitch(midi: number, preferredString: number): { fret: number; string: number } {
    const basePreferred = STRING_BASES[preferredString - 1];
    const fretPreferred = midi - basePreferred;

    if (fretPreferred >= 0 && fretPreferred <= 24) {
        return { fret: fretPreferred, string: preferredString };
    }

    for (let i = 0; i < STRING_BASES.length; i++) {
        const stringNum = i + 1;
        const fret = midi - STRING_BASES[i];
        if (fret >= 0 && fret <= 24) {
            return { fret, string: stringNum };
        }
    }

    return { fret: Math.max(0, fretPreferred), string: preferredString };
}

export const DURATION_VALUES: Record<string, number> = {
    'w': 1.0,
    'h': 0.5,
    'q': 0.25,
    '8': 0.125,
    '16': 0.0625,
    '32': 0.03125
};

export const VALUE_TO_DURATION: Record<number, string> = {
    1.0: 'w',
    0.5: 'h',
    0.25: 'q',
    0.125: '8',
    0.0625: '16',
    0.03125: '32'
};

export function getNoteDurationValue(duration: string, isDotted: boolean): number {
    const base = DURATION_VALUES[duration] || 0.25;
    return isDotted ? base * 1.5 : base;
}

export function getMsFromDuration(duration: string, isDotted: boolean, bpm: number): number {
    const value = getNoteDurationValue(duration, isDotted);
    // At BPM, one quarter note (0.25) is 60000/BPM ms.
    // Thus, whole note (1.0) is (60000/BPM) * 4 ms.
    return (60000 / bpm) * (value * 4);
}

export function getMeasureCapacity(timeSignature: string): number {
    const [num, den] = timeSignature.split('/').map(Number);
    if (!num || !den) return 1.0;
    return num * (1 / den);
}

/**
 * Decompõe um valor decimal de tempo em uma sequência de durações padrão.
 * Ex: 0.375 -> ['q', '8']
 */
export function decomposeValue(value: number): { duration: string, dotted: boolean }[] {
    const result: { duration: string, dotted: boolean }[] | any = [];
    let remaining = value;
    const sortedDurations = Object.entries(DURATION_VALUES).sort((a, b) => b[1] - a[1]);

    while (remaining > 0.01) {
        let found = false;
        // Tenta primeiro com ponto (valor * 1.5)
        for (const [dur, val] of sortedDurations) {
            if (val * 1.5 <= remaining + 0.001) {
                result.push({ duration: dur, dotted: true });
                remaining -= val * 1.5;
                found = true;
                break;
            }
        }
        if (found) continue;
        // Tenta sem ponto
        for (const [dur, val] of sortedDurations) {
            if (val <= remaining + 0.001) {
                result.push({ duration: dur, dotted: false });
                remaining -= val;
                found = true;
                break;
            }
        }
        if (!found) break; // Evita loop infinito se sobrar algo minúsculo
    }
    return result;
}



/**
 * Detects the chord name from the notes in a measure.
 * Aggregates all pitches found in the measure to infer the harmony.
 */
export function detectChordFromMeasure(notes: NoteData[]): string | null {
    if (!notes || notes.length === 0) return null;

    const pitches: string[] = [];
    notes.forEach(n => {
        if (n.type === 'rest') return;
        n.positions.forEach(pos => {
            const midi = getMidiFromPosition(pos.fret, pos.string);
            const { name, accidental } = getPitchFromMidi(midi);
            pitches.push(name + accidental);
        });
    });

    // Remove duplicates
    const uniquePitches = Array.from(new Set(pitches));

    if (uniquePitches.length < 2) return null;

    // Use Tonal to detect
    const detected = Chord.detect(uniquePitches);
    if (detected && detected.length > 0) {
        // Return the first candidate (usually the most simple)
        return detected[0];
    }
    return null;
}

/**
 * Transposes a chord name by a given number of semitones.
 * Example: transposeChordName("C", 2) => "D"
 *          transposeChordName("Am7", -1) => "G#m7"
 */
export function transposeChordName(chordName: string | undefined, semitones: number): string {
    if (!chordName || semitones === 0) return chordName || '';

    // Split slash chords (e.g., C/G -> ["C", "G"])
    const parts = chordName.split('/');

    const transposedParts = parts.map(part => {
        // Parse the part to extract root note
        const match = part.match(/^([A-G][#b♯♭]?)(.*)/);
        if (!match) return part;

        const [, root, suffix] = match;

        // Find the current note index
        let noteIndex = NOTE_NAMES.indexOf(root);

        // Handle flats and musical symbols
        if (noteIndex === -1) {
            const altToSharp: Record<string, string> = {
                'Cb': 'B', 'Db': 'C#', 'Eb': 'D#', 'Fb': 'E',
                'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
                'C♯': 'C#', 'D♯': 'D#', 'F♯': 'F#', 'G♯': 'G#', 'A♯': 'A#',
                'C♭': 'B', 'D♭': 'C#', 'E♭': 'D#', 'F♭': 'E',
                'G♭': 'F#', 'A♭': 'G#', 'B♭': 'A#'
            };
            const sharpEquiv = altToSharp[root];
            if (sharpEquiv) {
                noteIndex = NOTE_NAMES.indexOf(sharpEquiv);
            }
        }

        if (noteIndex === -1) return part;

        // Transpose
        let newIndex = (noteIndex + semitones) % 12;
        if (newIndex < 0) newIndex += 12;

        const newRoot = NOTE_NAMES[newIndex];
        return newRoot + suffix;
    });

    return transposedParts.join('/');
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/editor/presentation/hooks/use-studio-chords-editor.ts ---

import { useState, useMemo } from 'react';
import { MeasureData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration, NoteData } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { useUndoRedo } from '@/modules/editor/presentation/hooks/use-undo-redo';
import { DEFAULT_COLORS } from '@/modules/editor/presentation/constants';
import { deepCloneNote, deepCloneMeasure } from '@/modules/editor/domain/clone-utils';
import {
    getNoteDurationValue,
    getMeasureCapacity,
    decomposeValue,
    getMidiFromPosition,
    getPitchFromMidi,
    findBestFretForPitch,
    getMidiFromPitch,
    NOTE_NAMES,
    transposeChordName
} from '@/modules/editor/domain/music-math';

interface FretboardEditorState {
    measures: MeasureData[];
    settings: GlobalSettings;
    scoreStyle: ScoreStyle;
    theme: FretboardTheme;
    selectedNoteIds: string[];
    editingNoteId: string | null;
    activePanel: 'studio' | 'library' | 'mixer' | 'customize';
    activeDuration: Duration;
    activePositionIndex: number;
    currentMeasureIndex: number;
    selectedMeasureId: string | null;
    copiedMeasure: MeasureData | null; // For copy/paste functionality
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useStudioChordsEditor() {
    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<FretboardEditorState>({
        measures: [{
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), positions: [], duration: 'q', type: 'note', decorators: { dot: false }, accidental: 'none' }
            ]
        }],
        settings: {
            clef: 'tab' as const,
            key: 'C',
            time: '4/4',
            bpm: 120,
            showNotation: true,
            showTablature: true,
            instrumentId: 'violao',
            tuningIndex: 0,
            capo: 0,
            tuningShift: 0,
            numFrets: 24
        },
        scoreStyle: DEFAULT_SCORE_STYLE,
        theme: DEFAULT_COLORS,
        selectedNoteIds: [],
        editingNoteId: null,
        activePanel: 'studio',
        activeDuration: 'q',
        activePositionIndex: 0,
        currentMeasureIndex: 0,
        selectedMeasureId: null,
        copiedMeasure: null
    });

    const {
        measures,
        settings,
        scoreStyle,
        theme,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId
    } = state;



    // --- Helpers ---



    const handleToggleBarre = (indices?: number[]) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));

            // If explicit indices provided, this is a bit complex in the new model.
            // But usually this means "these strings are part of one finger shift".
            // For now, let's just implement the Toggle OFF logic for the active position.
            const pos = newPositions[activePositionIndex];
            if (!pos) return {};

            if (pos.endString && pos.endString !== pos.string) {
                newPositions[activePositionIndex] = { ...pos, endString: undefined };
            }

            return { positions: newPositions };
        });
    };

    const handleToggleBarreTo = (targetString: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            const pos = newPositions[activePositionIndex];
            if (!pos) return {};

            // If we already have a barre to this targetString, toggle it off (to single note)
            if (pos.endString === targetString) {
                newPositions[activePositionIndex] = { ...pos, endString: undefined };
            } else {
                // Otherwise create/update it
                newPositions[activePositionIndex] = {
                    ...pos,
                    endString: targetString
                };
            }

            return { positions: newPositions };
        });
    };

    const setMeasures = (newMeasures: MeasureData[] | ((prev: MeasureData[]) => MeasureData[])) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            measures: typeof newMeasures === 'function' ? newMeasures(prev.measures) : newMeasures
        }));
    };

    const setSettings = (newSettings: GlobalSettings | ((prev: GlobalSettings) => GlobalSettings)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            settings: typeof newSettings === 'function' ? newSettings(prev.settings) : newSettings
        }));
    };

    const setScoreStyle = (newStyle: ScoreStyle | ((prev: ScoreStyle) => ScoreStyle)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            scoreStyle: typeof newStyle === 'function' ? newStyle(prev.scoreStyle) : newStyle
        }));
    };

    const setTheme = (newTheme: FretboardTheme | ((prev: FretboardTheme) => FretboardTheme)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            theme: typeof newTheme === 'function' ? newTheme(prev.theme) : newTheme
        }));
    };

    const setActiveDuration = (duration: Duration) => {
        setState((prev: FretboardEditorState) => ({ ...prev, activeDuration: duration }));
    };

    const setEditingNoteId = (id: string | null) => {
        setState((prev: FretboardEditorState) => ({ ...prev, editingNoteId: id }));
    };

    const setActivePanel = (panel: 'studio' | 'library' | 'mixer' | 'customize') => {
        setState((prev: FretboardEditorState) => ({ ...prev, activePanel: panel }));
    };

    const setActivePositionIndex = (index: number) => {
        setState((prev: FretboardEditorState) => ({ ...prev, activePositionIndex: index }));
    };

    // --- Derived State Helpers (Internal) ---
    const getEditingNote = () => {
        if (!editingNoteId) return null;
        for (const m of measures) {
            const found = m.notes.find(n => n.id === editingNoteId);
            if (found) return found;
        }
        return null;
    };

    const getCurrentPitch = () => {
        const editingNote = getEditingNote();
        if (!editingNote || editingNote.type === 'rest' || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(pos.fret, pos.string);
        return getPitchFromMidi(midi);
    };

    const getActiveMeasure = () => {
        return measures.find(m => m.id === selectedMeasureId) || null;
    };

    // --- Advanced Selection/Update Logic ---

    const handleSelectMeasure = (id: string) => {
        setState((prev: FretboardEditorState) => {
            const isSame = prev.selectedMeasureId === id;
            const newSelectedId = isSame ? null : id;
            const targetIndex = prev.measures.findIndex((m: MeasureData) => m.id === id);
            const newIndex = (targetIndex !== -1 && !isSame) ? targetIndex : prev.currentMeasureIndex;

            return {
                ...prev,
                selectedNoteIds: [],
                editingNoteId: null,
                selectedMeasureId: newSelectedId,
                currentMeasureIndex: newIndex
            };
        }, { overwrite: true });
    };

    const handleSelectNote = (id: string, multi: boolean) => {
        if (multi) {
            setState((prev: FretboardEditorState) => ({
                ...prev,
                selectedNoteIds: prev.selectedNoteIds.includes(id)
                    ? prev.selectedNoteIds.filter((i: string) => i !== id)
                    : [...prev.selectedNoteIds, id]
            }), { overwrite: true });
        } else {
            setState((prev: FretboardEditorState) => {
                // Find measure for this note
                const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === id));
                const measureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

                return {
                    ...prev,
                    selectedNoteIds: [id],
                    editingNoteId: id,
                    activePositionIndex: 0,
                    // Auto-select measure (Unified UI)
                    currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                    selectedMeasureId: measureId
                };
            }, { overwrite: true });
        }
    };

    const updateSelectedNotes = (updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        const resolved = typeof updates === 'function' ? updates(n) : updates;
                        return { ...n, ...resolved };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    };


    // --- Core Actions (Add/Remove) ---

    // Simplified Note Addition - No time limit
    const handleAddNote = (measureId: string, durationOverride?: Duration) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const durationToAdd = durationOverride || prev.activeDuration;
            const newNoteId = generateId();

            // Always add to current measure, no capacity check
            const newMeasures = prev.measures.map((m: MeasureData, idx: number) => {
                if (idx === measureIndex) {
                    return {
                        ...m,
                        notes: [...m.notes, {
                            id: newNoteId,
                            positions: [{ fret: 1, string: 3 }],
                            duration: durationToAdd,
                            type: 'note' as const,
                            decorators: {},
                            accidental: 'none' as const
                        }]
                    };
                }
                return m;
            });

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: measureIndex,
                selectedMeasureId: measureId,
                editingNoteId: newNoteId,
                selectedNoteIds: [newNoteId],
                activePositionIndex: 0
            };
        });
    };



    const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleAddMeasure = () => {
        setState((prev: FretboardEditorState) => {
            const newMeasure: MeasureData = {
                id: generateId(),
                isCollapsed: false,
                showClef: false,
                showTimeSig: false,
                notes: [
                    // Default Note (C4, Quarter Note)
                    {
                        id: generateId(),
                        duration: 'q',
                        type: 'note',
                        decorators: { dot: false },
                        positions: [],
                        technique: '',
                        isSlurred: false
                    }
                ]
            };
            const newMeasures = [...prev.measures, newMeasure];
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasures.length - 1,
                selectedMeasureId: newMeasure.id,
                // Update selected note to the new one
                selectedNoteIds: [newMeasure.notes[0].id],
                editingNoteId: newMeasure.notes[0].id
            };
        });
    };

    const handleRemoveMeasure = (id: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.filter((m: MeasureData) => m.id !== id);
            if (newMeasures.length === 0) {
                const initial: MeasureData = { id: generateId(), isCollapsed: false, showClef: true, showTimeSig: true, notes: [] };
                return { ...prev, measures: [initial], currentMeasureIndex: 0, selectedMeasureId: initial.id };
            }
            const newIndex = Math.min(prev.currentMeasureIndex, newMeasures.length - 1);
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newIndex,
                selectedMeasureId: newMeasures[newIndex].id
            };
        });
    };


    // --- Advanced Editing Handlers (Sidebar Support) ---

    const handleNoteRhythmChange = (noteId: string, newDuration?: Duration, newDot?: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === noteId));
            const targetMeasureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

            const newMeasures = prev.measures.map((m: MeasureData) => {
                const noteIndex = m.notes.findIndex((n: NoteData) => n.id === noteId);
                if (noteIndex === -1) return m;

                const note = m.notes[noteIndex];
                const oldVal = getNoteDurationValue(note.duration, !!note.decorators.dot);
                const targetDuration = newDuration || note.duration;
                const targetDot = newDot !== undefined ? newDot : !!note.decorators.dot;
                const newVal = getNoteDurationValue(targetDuration, targetDot);

                let delta = newVal - oldVal;
                const newNotes = [...m.notes];

                newNotes[noteIndex] = {
                    ...note,
                    duration: targetDuration,
                    decorators: { ...note.decorators, dot: targetDot }
                };

                if (delta > 0) {
                    let remainingToCut = delta;
                    let i = noteIndex + 1;
                    while (remainingToCut > 0.001 && i < newNotes.length) {
                        const nextNote = newNotes[i];
                        const nextVal = getNoteDurationValue(nextNote.duration, !!nextNote.decorators.dot);

                        if (nextVal <= remainingToCut + 0.001) {
                            remainingToCut -= nextVal;
                            newNotes.splice(i, 1);
                        } else {
                            const targetNextVal = nextVal - remainingToCut;
                            const decomposed = decomposeValue(targetNextVal);
                            if (decomposed.length > 0) {
                                newNotes[i] = {
                                    ...nextNote,
                                    duration: decomposed[0].duration as Duration,
                                    decorators: { ...nextNote.decorators, dot: decomposed[0].dotted }
                                };
                                if (decomposed.length > 1) {
                                    const extraRests = decomposed.slice(1).map(d => ({
                                        id: generateId(),
                                        positions: [{ fret: 0, string: 1 }],
                                        duration: d.duration as Duration,
                                        type: 'rest' as const,
                                        decorators: { dot: d.dotted },
                                        accidental: 'none' as const
                                    }));
                                    newNotes.splice(i + 1, 0, ...extraRests);
                                }
                            }
                            remainingToCut = 0;
                        }
                    }
                } else if (delta < 0) {
                    const absDelta = Math.abs(delta);
                    const restsToAdd = decomposeValue(absDelta).map(d => ({
                        id: generateId(),
                        positions: [{ fret: 0, string: 1 }],
                        duration: d.duration as Duration,
                        type: 'rest' as const,
                        decorators: { dot: d.dotted },
                        accidental: 'none' as const
                    }));
                    newNotes.splice(noteIndex + 1, 0, ...restsToAdd);
                }

                // Capacity check / Truncate (Simplified for brevity)
                const capacity = getMeasureCapacity(prev.settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
                        // Overflow handling omitted for now, just truncate
                        break;
                    }
                }
                return { ...m, notes: finalNotes };
            });

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                selectedMeasureId: targetMeasureId || prev.selectedMeasureId
            };
        });
    };

    /**
     * Simple duration change for Chord Sequence mode.
     * Does NOT add/remove rests to maintain measure duration.
     */
    const handleNoteDurationStatic = (noteId: string, newDuration: Duration) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === noteId) {
                        return { ...n, duration: newDuration };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    };

    const handleRemoveNote = (noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.filter((n: NoteData) => n.id !== noteId)
            }));
            return { ...prev, measures: newMeasures };
        });
    };

    const handleCopyNote = (noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => {
                const noteIndex = m.notes.findIndex((n: NoteData) => n.id === noteId);
                if (noteIndex === -1) return m;

                const noteToCopy = m.notes[noteIndex];
                const newNote = deepCloneNote(noteToCopy, true);
                const newNotes = [...m.notes];
                newNotes.splice(noteIndex + 1, 0, newNote);
                return { ...m, notes: newNotes };
            });
            return { ...prev, measures: newMeasures };
        });
    };

    const handlePitchChange = (newName?: string, newAccidental?: string, newOctave?: number) => {
        const editingNote = getEditingNote();
        const currentPitch = getCurrentPitch();
        if (!editingNote || !currentPitch) return;

        const pitch = newName ?? currentPitch.name;
        const acc = newAccidental ?? currentPitch.accidental;
        const oct = newOctave ?? currentPitch.octave;
        const midi = getMidiFromPitch(pitch, acc, oct);
        const currentPos = editingNote.positions[activePositionIndex];
        const { fret, string } = findBestFretForPitch(midi, currentPos.string);

        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex] = { fret: fret, string: string };
            return { positions: newPositions };
        });
    };

    const handleStringChange = (newString: number) => {
        const editingNote = getEditingNote();
        if (!editingNote || !editingNote.positions[activePositionIndex]) return;

        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = currentPos.fret;
        const currentMidi = getMidiFromPosition(currentFret, currentPos.string);

        const newStringNum = newString;
        // Standard Tuning
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
        const openMidi = openStrings[newStringNum];
        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;
        if (newFret < 0) newFret = 0;

        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex] = { string: newString, fret: newFret };
            return { positions: newPositions };
        });
    };

    const handleAccidentalChange = (accidental: string) => {
        updateSelectedNotes(n => {
            const desiredAccidental = (n.accidental === accidental ? 'none' : accidental) as any;
            const currentPos = n.positions[activePositionIndex];
            if (!currentPos) return {};

            const currentMidi = getMidiFromPosition(currentPos.fret, currentPos.string);
            const { name, octave } = getPitchFromMidi(currentMidi);
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '♯') offset = 1;
            else if (desiredAccidental === '♭') offset = -1;
            else if (desiredAccidental === 'none') {
                if (n.accidental === '♯') offset = -1;
                else if (n.accidental === '♭') offset = 1;
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, currentPos.string);
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex] = { ...currentPos, fret: fret };

            return {
                accidental: desiredAccidental,
                positions: newPositions
            };
        });
    };

    const handleDecoratorChange = (decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];
            const nextDecorators: any = { dot: n.decorators.dot };
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }
            return { decorators: nextDecorators };
        });
    };

    const handleSetFingerForString = (idx: number, finger: number | string | undefined) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};

            if (finger === 'X') {
                newPositions[idx] = { ...newPositions[idx], avoid: true, finger: undefined };
            } else {
                newPositions[idx] = { ...newPositions[idx], avoid: false, finger: finger };
            }
            return { positions: newPositions };
        });
    };

    const handleSetFretForString = (idx: number, fret: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};
            newPositions[idx] = { ...newPositions[idx], fret, avoid: false };
            return { positions: newPositions };
        });
    };

    const handleSetStringForPosition = (idx: number, stringNum: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};
            newPositions[idx] = { ...newPositions[idx], string: stringNum };
            return { positions: newPositions };
        });
    };

    const handleSelectStringAndAddIfMissing = (stringNum: number) => {
        setState((prev: FretboardEditorState) => {
            const editingNote = prev.editingNoteId
                ? prev.measures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId)
                : null;

            if (!editingNote) return prev;

            const existingIdx = editingNote.positions.findIndex(p => p.string === stringNum);
            if (existingIdx !== -1) {
                return { ...prev, activePositionIndex: existingIdx };
            }

            // Not found, add it
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === prev.editingNoteId) {
                        return {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: stringNum }]
                        };
                    }
                    return n;
                })
            }));

            // Re-find to get new index
            const updatedNote = newMeasures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId);
            const newIdx = updatedNote ? updatedNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIdx };
        });
    };

    const handleInsert = (code: string) => {
        if (code.startsWith('clef=')) {
            const clefValue = code.split('=')[1] as any;
            let targetIndex = currentMeasureIndex;
            if (selectedNoteIds.length > 0) {
                const foundIndex = measures.findIndex(m => m.notes.some(n => selectedNoteIds.includes(n.id)));
                if (foundIndex !== -1) targetIndex = foundIndex;
            }
            setMeasures(prev => prev.map((m, idx) => {
                if (idx === targetIndex) return { ...m, clef: clefValue, showClef: true };
                return m;
            }));
            return;
        }

        if (['s', 'h', 'p', 'b', 't', 'l'].includes(code) && selectedNoteIds.length === 2) {
            // Technique between two notes (Simplistic find)
            setMeasures(prev => prev.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (selectedNoteIds.includes(n.id) && selectedNoteIds.indexOf(n.id) === 0) {
                        return {
                            ...n,
                            technique: n.technique === code ? undefined : code,
                            slideTargetId: n.technique === code ? undefined : selectedNoteIds[1] // Assuming simple logic
                        };
                    }
                    return n;
                })
            })));
            return;
        }


        // Single Note Technique
        if (selectedNoteIds.length > 0) {
            updateSelectedNotes(n => ({
                technique: n.technique === code ? undefined : code,
                slideTargetId: n.technique === code ? undefined : n.slideTargetId
            }));
        }
    };

    const handleAddChordNote = () => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        const updatedNote = {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: (n.positions.length + 1) }]
                        };
                        return updatedNote;
                    }
                    return n;
                })
            }));

            const editingNote = prev.editingNoteId
                ? newMeasures.flatMap((m: MeasureData) => m.notes).find((n: NoteData) => n.id === prev.editingNoteId)
                : null;
            const newIndex = editingNote ? editingNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    const handleRemoveChordNote = (idx: number) => {
        setState((prev: FretboardEditorState) => {
            let newIndex = prev.activePositionIndex;
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        if (n.positions.length <= 1) return n;
                        const newPositions = n.positions.filter((_: any, i: number) => i !== idx);
                        if (newIndex >= newPositions.length) newIndex = Math.max(0, newPositions.length - 1);

                        return { ...n, positions: newPositions };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    const handleTransposeMeasure = (measureId: string, semitones: number, smartTranspose?: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const measure = prev.measures[measureIndex];

            // Determine selection mode:
            // 1. If selectedNoteIds is not empty OR there is an editingNoteId, it's Selective Mode.
            // 2. Otherwise, it's Global Mode (transposes everything).
            const selectedInMeasure = measure.notes.filter(n => prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId);
            const isSelectiveMode = selectedInMeasure.length > 0;
            const targetNotes = isSelectiveMode ? selectedInMeasure : measure.notes;

            // Bounds check for all notes that will be shifted
            const wouldGoOutOfBounds = targetNotes.some((note: NoteData) =>
                note.positions.some((pos: any) => {
                    if (pos.avoid) return false; // Ignore avoided strings in bounds check
                    const newFret = pos.fret + semitones;
                    return newFret < 0 || newFret > 24;
                })
            );

            if (wouldGoOutOfBounds) return prev;

            const targetIds = targetNotes.map(n => n.id);

            // Analysis for Smart Transpose (Before Transposition)
            let isStartingOpen = false;
            if (smartTranspose) {
                const allFrets = targetNotes.flatMap(n => n.positions.filter((p: any) => !p.avoid).map((p: any) => p.fret));
                if (allFrets.length > 0) {
                    const minFret = Math.min(...allFrets);
                    isStartingOpen = minFret === 0;
                }
            }

            const transposedNotes = measure.notes.map((note: NoteData) => {
                if (targetIds.includes(note.id)) {
                    let newPositions = note.positions.map((pos: any) => {
                        if (pos.avoid) return pos; // Don't shift avoided strings
                        return {
                            ...pos,
                            fret: pos.fret + semitones
                        };
                    });

                    // Smart Transpose Logic (After Transposition Calculation)
                    if (smartTranspose) {
                        const allNewFrets = newPositions.filter((p: any) => !p.avoid).map((p: any) => p.fret);
                        if (allNewFrets.length > 0) {
                            const newMinFret = Math.min(...allNewFrets);
                            const isEndingOpen = newMinFret === 0;

                            // Case 1: Open -> Barre (Shift Fingers Up)
                            if (isStartingOpen && !isEndingOpen) {
                                newPositions = newPositions.map((p: any) => {
                                    if (p.avoid) return p;
                                    let newFinger = p.finger;
                                    if (typeof p.finger === 'number') {
                                        newFinger = p.finger + 1;
                                    }
                                    // If this position is at the 'barre' fret (min fret), force finger 1 if not set
                                    if (p.fret === newMinFret && !newFinger) {
                                        newFinger = 1;
                                    }
                                    return { ...p, finger: newFinger };
                                });
                            }
                            // Case 2: Barre -> Open (Shift Fingers Down)
                            else if (!isStartingOpen && isEndingOpen) {
                                newPositions = newPositions.map((p: any) => {
                                    if (p.avoid) return p;
                                    let newFinger = p.finger;
                                    // If open string, remove finger
                                    if (p.fret === 0) {
                                        newFinger = undefined;
                                    } else if (typeof p.finger === 'number') {
                                        newFinger = Math.max(1, p.finger - 1);
                                    }
                                    return { ...p, finger: newFinger };
                                });
                            }
                        }
                    }

                    return {
                        ...note,
                        positions: newPositions,
                        barre: undefined
                    };
                }
                return note;
            });

            // Transpose chord name if Global Mode OR Smart Transpose is active
            const newChordName = (!isSelectiveMode || smartTranspose)
                ? transposeChordName(measure.chordName, semitones)
                : measure.chordName;

            const newMeasures = prev.measures.map((m: MeasureData, idx: number) =>
                idx === measureIndex
                    ? { ...m, notes: transposedNotes, chordName: newChordName }
                    : m
            );

            return {
                ...prev,
                measures: newMeasures
            };
        });
    };

    const handleTransposeAll = (semitones: number) => {
        setState((prev: FretboardEditorState) => {
            // Check bounds for ALL notes in ALL measures
            const wouldGoOutOfBounds = prev.measures.some((measure: MeasureData) =>
                measure.notes.some((note: NoteData) =>
                    note.positions.some((pos: any) => {
                        if (pos.avoid) return false;
                        const newFret = pos.fret + semitones;
                        return newFret < 0 || newFret > 24;
                    })
                )
            );

            if (wouldGoOutOfBounds) return prev;

            const newMeasures = prev.measures.map((measure: MeasureData) => {
                const transposedNotes = measure.notes.map((note: NoteData) => {
                    // Adjust barre if it exists
                    let newBarre = note.barre;
                    if (newBarre) {
                        newBarre = {
                            ...newBarre,
                            fret: newBarre.fret + semitones
                        };
                    }

                    return {
                        ...note,
                        positions: note.positions.map((pos: any) => {
                            if (pos.avoid) return pos;
                            return {
                                ...pos,
                                fret: pos.fret + semitones
                            };
                        }),
                        barre: newBarre
                    };
                });

                const newName = transposeChordName(measure.chordName, semitones);
                return { ...measure, notes: transposedNotes, chordName: newName };
            });

            return {
                ...prev,
                measures: newMeasures
            };
        });
    };

    return {
        // State
        measures,
        settings,
        scoreStyle,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId,

        editingNote: getEditingNote(),
        currentPitch: getCurrentPitch(),
        activeMeasure: getActiveMeasure(),

        // Actions
        setSettings,
        setMeasures,
        setScoreStyle,
        setActiveDuration,
        setActivePanel,
        setEditingNoteId,
        setActivePositionIndex,

        handleSelectMeasure,
        handleSelectNote,
        handleAddNote,

        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,

        // Toggle Collapse
        handleToggleCollapse: (measureId: string) => {
            setState((prev: FretboardEditorState) => ({
                ...prev,
                measures: prev.measures.map((m: MeasureData) =>
                    m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m
                )
            }));
        },

        // Reorder Measures
        handleReorderMeasures: (fromIndex: number, toIndex: number) => {
            setState((prev: FretboardEditorState) => {
                const newMeasures = [...prev.measures];
                const [movedMeasure] = newMeasures.splice(fromIndex, 1);
                newMeasures.splice(toIndex, 0, movedMeasure);
                return {
                    ...prev,
                    measures: newMeasures
                };
            });
        },

        // Reorder Notes within a Measure
        handleReorderNotes: (measureId: string, fromIndex: number, toIndex: number) => {
            setState((prev: FretboardEditorState) => {
                const measureIndex = prev.measures.findIndex(m => m.id === measureId);
                if (measureIndex === -1) return prev;

                const newMeasures = [...prev.measures];
                const measure = newMeasures[measureIndex];
                const newNotes = [...measure.notes];

                // Remove from source
                const [movedNote] = newNotes.splice(fromIndex, 1);

                // Insert at destination
                newNotes.splice(toIndex, 0, movedNote);

                newMeasures[measureIndex] = {
                    ...measure,
                    notes: newNotes
                };

                return {
                    ...prev,
                    measures: newMeasures
                };
            });
        },

        // Copy Measure (duplicates and adds right after the source)
        handleCopyMeasure: (measureId: string) => {
            setState((prev: FretboardEditorState) => {
                const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
                if (measureIndex === -1) return prev;

                const measureToCopy = prev.measures[measureIndex];
                const newMeasure = deepCloneMeasure(measureToCopy, true);

                // Insert right after the source measure
                const newMeasures = [...prev.measures];
                newMeasures.splice(measureIndex + 1, 0, newMeasure);

                return {
                    ...prev,
                    measures: newMeasures,
                    copiedMeasure: measureToCopy
                };
            });
        },

        // Paste Measure (adds copy to the end)
        handlePasteMeasure: () => {
            setState((prev: FretboardEditorState) => {
                if (!prev.copiedMeasure) return prev;

                const newMeasure = deepCloneMeasure(prev.copiedMeasure, true);

                return {
                    ...prev,
                    measures: [...prev.measures, newMeasure]
                };
            });
        },

        // Advanced Actions
        handleNoteRhythmChange,
        handleNoteDurationStatic,
        handleRemoveNote,
        handleCopyNote,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleSetFingerForString,
        handleSetFretForString,
        handleSetStringForPosition,
        handleSelectStringAndAddIfMissing,
        handleToggleBarre,
        handleToggleBarreTo,
        handleTransposeMeasure,
        handleTransposeAll,
        updateSelectedNotes,

        // Utils
        undo, redo, canUndo, canRedo,
        theme, setTheme
    };
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/editor/presentation/hooks/use-undo-redo.ts ---
import { useState, useCallback, useEffect, useRef } from 'react';

interface Options {
    enableShortcuts?: boolean;
}

interface UndoRedoHook<T> {
    state: T;
    setState: (newState: T | ((prevState: T) => T), options?: { overwrite?: boolean }) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    reset: (initialState: T) => void;
}

// Refactored to use a single history array and pointer index as requested.

interface HistoryState<T> {
    history: T[];
    index: number;
}

export function useUndoRedo<T>(initialState: T, options: Options = { enableShortcuts: true }): UndoRedoHook<T> {
    const [historyState, setHistoryState] = useState<HistoryState<T>>({
        history: [initialState],
        index: 0
    });

    const present = historyState.history[historyState.index] || initialState;

    const canUndo = historyState.index > 0;
    const canRedo = historyState.index < historyState.history.length - 1;

    const undo = useCallback(() => {
        setHistoryState(prev => {
            if (prev.index > 0) {
                console.log('[useUndoRedo] Undo:', prev.index, '->', prev.index - 1);
                return { ...prev, index: prev.index - 1 };
            }
            return prev;
        });
    }, []);

    const redo = useCallback(() => {
        setHistoryState(prev => {
            if (prev.index < prev.history.length - 1) {
                console.log('[useUndoRedo] Redo:', prev.index, '->', prev.index + 1);
                return { ...prev, index: prev.index + 1 };
            }
            return prev;
        });
    }, []);

    const setState = useCallback((newState: T | ((prevState: T) => T), options?: { overwrite?: boolean }) => {
        setHistoryState(prev => {
            const current = prev.history[prev.index];

            // CRITICAL FIX: Always use the current state from history, not a cached reference
            const resolvedState = typeof newState === 'function' ? (newState as Function)(current) : newState;

            if (resolvedState === undefined || resolvedState === null) return prev;

            // Deep equality check
            const isDeepEqual = (a: any, b: any): boolean => {
                if (a === b) return true;
                if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                if (keysA.length !== keysB.length) return false;
                for (const key of keysA) {
                    if (!keysB.includes(key) || !isDeepEqual(a[key], b[key])) return false;
                }
                return true;
            };

            if (isDeepEqual(current, resolvedState)) {
                return prev;
            }

            if (options?.overwrite) {
                // Overwrite current state without creating new history entry
                const newHistory = [...prev.history];
                newHistory[prev.index] = resolvedState;
                return { ...prev, history: newHistory };
            }

            // Create new history entry
            const newHistory = prev.history.slice(0, prev.index + 1);
            newHistory.push(resolvedState);

            return {
                history: newHistory,
                index: newHistory.length - 1
            };
        });
    }, []);

    const reset = useCallback((newInitialState: T) => {
        setHistoryState({
            history: [newInitialState],
            index: 0
        });
    }, []);

    useEffect(() => {
        if (!options.enableShortcuts) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlOrCmd = event.ctrlKey || event.metaKey;

            if (isCtrlOrCmd && event.key.toLowerCase() === 'z') {
                if (event.shiftKey) {
                    event.preventDefault();
                    redo();
                } else {
                    event.preventDefault();
                    undo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, options.enableShortcuts]);

    return {
        state: present,
        setState,
        undo,
        redo,
        canUndo,
        canRedo,
        reset
    };
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/domain/interfaces/renderer.ts ---
import { ProjectData } from '@/modules/core/domain/types';

export interface Renderer {
    initialize(canvas: HTMLCanvasElement): void;
    loadProject(project: ProjectData): void;
    play(): void;
    pause(): void;
    seek(time: number): void;
    dispose(): void;
}

export interface SceneObject {
    id: string;
    type: string;
    render(ctx: CanvasRenderingContext2D | any, time: number): void;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/BaseDrawer.ts ---
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


--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/ChordDrawer.ts ---
import type { ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { GeometryProvider } from "./components/GeometryProvider";

export interface ChordDrawer {
  readonly ctx: CanvasRenderingContext2D;
  readonly colors: FretboardTheme;
  readonly dimensions: { width: number; height: number };
  readonly scaleFactor: number;
  readonly fingerRadius: number;
  readonly barreWidth: number;
  readonly neckRadius: number;

  drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX?: number, options?: { skipFretboard?: boolean, skipChordName?: boolean }): void;
  drawFinger(fret: number, string: number, finger: number | string, color?: string, opacity?: number, transport?: number): void;
  drawBarre(fret: number, startString: number, endString: number, finger: number | string, color?: string, opacity?: number, transport?: number): void;
  drawFingers(chord: ChordDiagramProps): void;
  drawChordName(chordName: string, options?: { opacity?: number, extensions?: string[] }): void;
  drawFretboard(transport?: number): void;
  setGlobalCapo(capo: number): void;
  setStringNames(names: string[] | number | undefined, arg2?: string[]): void;
  calculateWithOffset(offsetX: number): void;
  drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void;
  drawChordWithTransition(currentFinalChord: ChordDiagramProps, currentTransportDisplay: number, nextFinalChord: ChordDiagramProps, nextTransportDisplay: number, originalProgress: number, offsetX?: number, options?: { skipFretboard?: boolean }): void;
  drawTransposeIndicator(text: string | number, alignFret?: number): void;
  drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void;
  getFingerCoords(fret: number, string: number): { x: number, y: number };
  getBarreCoords(fret: number, startString: number, endString: number): { x: number, y: number, width: number, height: number, radius: number };
  getGeometry(): GeometryProvider;
  validatePosition(fret: number, string: number): boolean;
  transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number };

  // Base config setters
  setCtx(ctx: CanvasRenderingContext2D): void;
  setNumStrings(num: number): void;
  setNumFrets(num: number): void;
  setTransforms(rotation: 0 | 90 | 180 | 270, mirror: boolean): void;
  calculateDimensions(): void;
  applyTransforms(): void;
  clear(): void;
}

export interface FingersAnimationParams {
  drawer: ChordDrawer;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; };
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; } | null;
  transitionProgress: number;
  allChords?: { finalChord: ChordDiagramProps; transportDisplay: number }[];
  currentIndex?: number;
  buildProgress?: number;
  skipFretboard?: boolean;
}

export interface FingersAnimationDrawer {
  draw(params: FingersAnimationParams): void;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/ChordNameComponent.ts ---
import { IFretboardComponent } from "./IFretboardComponent";
import { ManualChordData } from "@/modules/core/domain/types";

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

    private parseChord(name: string): ManualChordData {
        // Root: A-G plus #/b or ♯/♭
        const rootMatch = name.match(/^([A-G][#b♭♯]?)/);
        if (!rootMatch) return { root: name, quality: '', extensions: [], bass: '' };

        const root = rootMatch[1];
        let remaining = name.slice(root.length);

        // Quality: m, dim, aug, sus2, sus4, maj
        let quality = '';
        const qualityMatch = remaining.match(/^(m|dim|aug|sus2|sus4|maj)/);
        if (qualityMatch) {
            quality = qualityMatch[1];
            remaining = remaining.slice(quality.length);
        }

        // Bass: starts with / followed by note (handles both formatting variants)
        let bass = '';
        const bassRegex = /\/([A-G][#b♭♯]?|[#b♭♯][A-G])$/;
        const bassMatch = remaining.match(bassRegex);
        if (bassMatch) {
            let b = bassMatch[1];
            // Normalize: if accidental is at position 0, swap it to position 1
            if (b.length === 2 && ['#', 'b', '♭', '♯'].includes(b[0])) {
                b = b[1] + b[0];
            }
            bass = '/' + b;
            remaining = remaining.slice(0, remaining.length - bassMatch[0].length);
        }

        // Extensions parsing: match against known musical tokens
        const knownExtensions = [
            'sus2', 'sus4', 'aug', 'maj7', 'maj',
            'b13', '#13', '13',
            'b11', '#11', '11',
            'b9', '#9', '9',
            'b7+', '#7+', '7+',
            'b7', '#7', '7',
            'b6', '#6', '6',
            'b5', '#5', '5'
        ];

        const extensions: string[] = [];
        let found = true;
        while (found && remaining.length > 0) {
            found = false;
            // Sorting knownExtensions by length descending to match longest possible first
            const sortedKnown = [...knownExtensions].sort((a, b) => b.length - a.length);
            for (const ext of sortedKnown) {
                if (remaining.startsWith(ext)) {
                    extensions.push(ext);
                    remaining = remaining.slice(ext.length);
                    found = true;
                    break;
                }
            }
            if (!found && remaining.length > 0) {
                // Fallback for concatenated digits
                const fallback = remaining.match(/^([#b♭♯]?\d+|.)/);
                if (fallback) {
                    extensions.push(fallback[1]);
                    remaining = remaining.slice(fallback[1].length);
                    found = true;
                } else {
                    break;
                }
            }
        }

        // Sorting extensions musically (same order as in chord-logic or sidebar)
        const musicalOrder = [
            'sus2', 'sus4', 'aug', '5', 'b5', '#5', '6', 'b6', '#6',
            '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9',
            '11', 'b11', '#11', '13', 'b13', '#13'
        ];
        extensions.sort((a, b) => musicalOrder.indexOf(a) - musicalOrder.indexOf(b));

        return { root, quality, extensions, bass };
    }

    private formatSymbol(symbol: string): string {
        return symbol
            .replace(/#/g, '♯')
            .replace(/b/g, '♭')
            .replace('dim', 'º')
            .replace('aug', '+');
    }

    public validate(): boolean {
        return !!this.text;
    }

    public update(progress: number): void {
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.text) return;

        const parsed = this.parseChord(this.text);

        ctx.save();
        ctx.globalAlpha = this.style.opacity;
        ctx.fillStyle = this.style.color;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        const baseSize = this.style.fontSize * this.scaleFactor;
        const rootSize = baseSize;
        const qualitySize = baseSize;
        const extSize = baseSize * 0.55;
        const bassSize = baseSize; // Matches root size

        // Calculate total width to center it
        ctx.font = `900 ${rootSize}px ${this.style.fontFamily}`;
        const rootWidth = ctx.measureText(this.formatSymbol(parsed.root)).width;

        let qualityWidth = 0;
        if (parsed.quality) {
            // If quality is dim (rendered as º), we want it to feel like part of the root/quality block
            const qSize = parsed.quality === 'dim' ? rootSize : qualitySize;
            ctx.font = `900 ${qSize}px ${this.style.fontFamily}`;
            qualityWidth = ctx.measureText(this.formatSymbol(parsed.quality)).width + baseSize * 0.01;
        }

        let maxExtWidth = 0;
        if (parsed.extensions && parsed.extensions.length > 0) {
            ctx.font = `900 ${extSize}px ${this.style.fontFamily}`;
            parsed.extensions.forEach(ext => {
                const w = ctx.measureText(this.formatSymbol(ext)).width;
                if (w > maxExtWidth) maxExtWidth = w;
            });
            maxExtWidth += baseSize * 0.02; // Tighter padding
        }

        let bassWidth = 0;
        if (parsed.bass) {
            ctx.font = `900 ${bassSize}px ${this.style.fontFamily}`;
            bassWidth = ctx.measureText(this.formatSymbol(parsed.bass)).width + baseSize * 0.1;
        }

        const totalWidth = rootWidth + qualityWidth + (parsed.extensions && parsed.extensions.length > 0 ? maxExtWidth : 0) + bassWidth;
        let currentX = this.x - totalWidth / 2;
        const centerY = this.y + rootSize * 0.3;

        // 1. Draw Root
        ctx.font = `900 ${rootSize}px ${this.style.fontFamily}`;
        ctx.fillText(this.formatSymbol(parsed.root), currentX, centerY);
        currentX += rootWidth;

        // 2. Draw Quality
        if (parsed.quality) {
            currentX += baseSize * 0.01;
            ctx.font = `900 ${qualitySize}px ${this.style.fontFamily}`;
            ctx.fillText(this.formatSymbol(parsed.quality), currentX, centerY);
            currentX += qualityWidth;
        }

        // 3. Draw Extensions (Stacked)
        if (parsed.extensions && parsed.extensions.length > 0) {
            currentX += baseSize * 0.02;
            ctx.font = `900 ${extSize}px ${this.style.fontFamily}`;

            const numExts = parsed.extensions.length;
            const extLeading = extSize * 0.95; // Sidebars tight leading

            // Visual center of the root chord name (approx 45% up from baseline for capitals)
            const visualCenter = centerY - rootSize * 0.45;

            // Calculate total height: distance from FIRST extension's baseline to LAST extension's baseline
            const totalExtHeight = (numExts - 1) * extLeading;

            // Calculate starting Y for the first extension so the block's midpoint aligns with visualCenter
            // We adjust by a small fraction of extSize to account for the extensions' own internal vertical center
            let extY = visualCenter - (totalExtHeight / 2) + (extSize * 0.55);

            parsed.extensions.forEach(ext => {
                ctx.fillText(this.formatSymbol(ext), currentX, extY);
                extY += extLeading;
            });
            currentX += maxExtWidth;
        }

        // 4. Draw Bass
        if (parsed.bass) {
            currentX += baseSize * 0.1;
            ctx.font = `900 ${bassSize}px ${this.style.fontFamily}`;
            ctx.fillText(this.formatSymbol(parsed.bass), currentX, centerY);
        }

        ctx.restore();
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        const fontSize = this.style.fontSize * this.scaleFactor;
        const width = this.text.length * (fontSize * 0.6);
        return {
            x: this.x - width / 2,
            y: this.y - fontSize / 2,
            width: width,
            height: fontSize
        };
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/FingerComponent.ts ---
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
            if (fret > 0 && transport > 1) {
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
        if (this.isBarre && this.tFret === 0) return;

        ctx.save();

        // Note: Global transformation (Rotation/Mirror) is now applied by the Drawer/Animator
        // to ensure perfect alignment with the neck. Component only handles label uprighting.

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
        // UNIFIED SHAPE: Always use rounded rect for smooth transitions
        const thickness = Math.min(this.vRect.width, this.vRect.height);
        const cornerRadius = thickness / 2;
        if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(this.vRect.x, this.vRect.y, this.vRect.width, this.vRect.height, cornerRadius);
        } else {
            ctx.rect(this.vRect.x, this.vRect.y, this.vRect.width, this.vRect.height);
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

            // Counter the global transforms applied by the drawer to keep label upright
            if (this.mirror) ctx.scale(-1, 1);
            if (this.rotation) ctx.rotate((-this.rotation * Math.PI) / 180);

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

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/IFretboardComponent.ts ---
export interface IFretboardComponent {
    /**
     * Draws the component using the provided context.
     */
    draw(ctx: CanvasRenderingContext2D): void;

    /**
     * Updates the component's internal state (e.g., for animations).
     * @param progress A value between 0 and 1.
     */
    update(progress: number): void;

    /**
     * Returns the bounding box of the component in pixels.
     */
    getBounds(): { x: number; y: number; width: number; height: number };

    /**
     * Validates the input data for the component.
     * Throws an error or returns false if data is invalid (e.g., string 7 out of 6).
     */
    validate(): boolean;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/ShortNeckComponent.ts ---
import { NeckComponent } from "./NeckComponent";
import { FretsComponent } from "./FretsComponent";
import { StringsComponent } from "./StringsComponent";
import { StringNamesComponent } from "./StringNamesComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";
import { FretboardTheme } from "@/modules/core/domain/types";
import { CapoComponent } from "./CapoComponent";

export class ShortNeckComponent {
    private neck!: NeckComponent;
    private frets!: FretsComponent;
    private strings!: StringsComponent;
    private stringNames!: StringNamesComponent;
    private geometry: GeometryProvider;
    private theme: FretboardTheme;

    constructor(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.initializeComponents();
    }

    private initializeComponents() {
        // We might need to update these if geometry/theme changes
        // But for now, we instantiate them.
        this.updateComponents();
    }

    public update(geometry: GeometryProvider, theme: FretboardTheme) {
        this.geometry = geometry;
        this.theme = theme;
        this.updateComponents();
    }

    private _mapShadow(s: any) {
        if (!s) return undefined;
        return {
            enabled: !!s.enabled,
            color: s.color || '#000000',
            blur: s.blur || 0,
            offsetX: s.offsetX || 0,
            offsetY: s.offsetY || 0
        };
    }

    private _mapBorder(b: any) {
        if (!b) return undefined;
        return {
            color: b.color || 'transparent',
            width: b.width || 0
        };
    }

    private updateComponents() {
        this.neck = new NeckComponent(
            NeckType.SHORT,
            {
                color: this.theme.fretboard.neck.color || "#8d8d8d",
                shadow: this._mapShadow(this.theme.fretboard.neck.shadow),
                headColor: this.theme.head?.color || "#3a3a3e",
                headShadow: this._mapShadow(this.theme.head?.shadow),
                headBorder: this._mapBorder(this.theme.head?.border)
            },
            this.geometry,
            {
                showHeadBackground: true, // Configurable?
                neckRadius: this.geometry.neckRadius, // 35 * scale inherited implicitly or explicit? Use provider settings
                headstockYOffset: this.geometry.headstockYOffset,
                diagramY: this.geometry.boardY,
                stringNamesY: this.geometry.stringNamesY
            }
        );

        this.frets = new FretsComponent(
            NeckType.SHORT,
            {
                color: this.theme.fretboard.frets.color || "#666666",
                thickness: this.theme.fretboard.frets.thickness || 2,
                shadow: this._mapShadow(this.theme.fretboard.frets.shadow)
            },
            this.geometry
        );

        this.strings = new StringsComponent(
            NeckType.SHORT,
            {
                color: this.theme.fretboard.strings.color || "#444444",
                thickness: this.theme.fretboard.strings.thickness || 2,
                shadow: this._mapShadow(this.theme.fretboard.strings.shadow)
            },
            this.geometry,
            {
                horizontalPadding: this.geometry.paddingX
            }
        );

        this.stringNames = new StringNamesComponent(
            NeckType.SHORT,
            ["E", "A", "D", "G", "B", "e"], // Default, likely overridden
            {
                color: this.theme.head?.textColors?.name || this.theme.global.primaryTextColor || "#ffffff",
                fontSize: 30 // hardcoded base in ShortNeck.ts
            },
            this.geometry,
            {
                horizontalPadding: this.geometry.paddingX,
                stringNamesY: this.geometry.stringNamesY,
                headstockYOffset: this.geometry.headstockYOffset
            }
        );
    }

    public setStringNames(names: string[]) {
        this.stringNames.setStringNames(names);
    }

    public setConditionalFlags(showHeadBackground: boolean) {
        // Need to update neck component options.
        // For simplicity, we can recreate or add setters to NeckComponent.
        // Since NeckComponent constructor takes options and stores them, 
        // we might need to expose a setter in NeckComponent or just recreate it.
        // Recreating is safer for statelessness.
        // However, ShortNeck logic is: setConditionalFlags -> draw()
        // We will assume updateComponents handles this if we store state.

        // Actually, NeckComponent stores `showHeadBackground`.
        // We should probably pass this into `update` or constructor.
        // For now, let's keep it simple and just update internal state if possible, or recreate.
    }

    // Or simpler:
    public draw(ctx: CanvasRenderingContext2D, phases?: {
        neckProgress?: number;
        stringNamesProgress?: number;
        stringsProgress?: number;
        fretsProgress?: number;
        nutProgress?: number;
    }, rotation: number = 0, mirror: boolean = false) {
        // If phases is undefined, draw everything
        const p = phases || { neckProgress: 1, stringNamesProgress: 1, stringsProgress: 1, fretsProgress: 1, nutProgress: 1 };

        const neckP = p.neckProgress ?? 0;
        const fretsP = p.fretsProgress ?? 0;
        const stringsP = p.stringsProgress ?? 0;
        const namesP = p.stringNamesProgress ?? 0;

        if (neckP > 0) this.neck.draw(ctx, neckP);
        if (namesP > 0) {
            this.stringNames.setRotation(rotation, mirror);
            this.stringNames.draw(ctx, namesP);
        }
        if (fretsP > 0) this.frets.draw(ctx);
        if (stringsP > 0) this.strings.draw(ctx);
    }

    public drawCapo(ctx: CanvasRenderingContext2D, capoFret: number, rotation: number, mirror: boolean) {
        if (capoFret <= 0) return;

        const settings = (this.geometry as any).settings;

        const capoComp = new CapoComponent(1, {
            color: this.theme.capo?.color || '#c0c0c0',
            border: this.theme.capo?.border || { color: '#808080', width: 2 },
            textColor: this.theme.capo?.textColors?.name || '#2c2c2c',
            opacity: 1,
            shadow: this.theme.capo?.shadow
        }, this.geometry, {
            neckAppearance: {
                backgroundColor: this.theme.fretboard.neck.color || "#8d8d8d",
                stringColor: this.theme.fretboard.strings.color || "#444444"
            },
            displayFret: capoFret
        });

        capoComp.setRotation(rotation, mirror);
        capoComp.draw(ctx);
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/components/TransposeIndicatorComponent.ts ---
import { IFretboardComponent } from "./IFretboardComponent";
import { GeometryProvider } from "./GeometryProvider";
import { NeckType } from "./NeckType";

interface TransposeIndicatorStyle {
    color: string;
    fontSize: number;
}

/**
 * TransposeIndicatorComponent - Draws the transpose indicator (e.g., "7ª") for SHORT orientation
 */
export class TransposeIndicatorComponent implements IFretboardComponent {
    private neckType: NeckType;
    private style: TransposeIndicatorStyle;
    private geometry: GeometryProvider;

    // Animation/State
    private sText: string | number = 0;
    private tText: string | number = 0;
    private sFret: number = 1;
    private tFret: number = 1;
    private sOpacity: number = 0;
    private tOpacity: number = 0;

    // Visuals
    private vText: string | number = 0;
    private vFret: number = 1;
    private vOpacity: number = 0;

    constructor(
        neckType: NeckType,
        text: string | number,
        alignFret: number,
        style: TransposeIndicatorStyle,
        geometry: GeometryProvider
    ) {
        this.neckType = neckType;
        this.style = style;
        this.geometry = geometry;

        const opacity = Number(text) > 1 ? 1 : 0;
        this.vText = this.sText = this.tText = text;
        this.vFret = this.sFret = this.tFret = alignFret;
        this.vOpacity = this.sOpacity = this.tOpacity = opacity;
    }

    public setTarget(text: string | number, alignFret: number, opacity: number): void {
        this.sText = this.vText;
        this.sFret = this.vFret;
        this.sOpacity = this.vOpacity;

        this.tText = text;
        this.tFret = alignFret;
        this.tOpacity = opacity;
    }

    public validate(): boolean {
        return Number(this.vText) > 1;
    }

    public update(progress: number): void {
        this.vFret = this.sFret + (this.tFret - this.sFret) * progress;
        this.vOpacity = this.sOpacity + (this.tOpacity - this.sOpacity) * progress;
        this.vText = progress < 0.5 ? this.sText : this.tText;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.validate() || this.vOpacity <= 0) return;

        if (this.neckType === NeckType.SHORT) {
            this.drawShortTransposeIndicator(ctx);
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

    private drawShortTransposeIndicator(ctx: CanvasRenderingContext2D): void {
        const scaleFactor = this.geometry.scaleFactor;

        const fretboardX = this.geometry.fretboardX;
        const fretboardY = this.geometry.fretboardY;
        const realFretSpacing = this.geometry.realFretSpacing;

        // Final refined position: 50px to the left of the neck
        const x = fretboardX - (50 * scaleFactor);
        const y = fretboardY + (this.vFret - 0.5) * realFretSpacing;

        ctx.save();

        // Note: Global transformation is now applied by the Drawer

        ctx.globalAlpha = this.vOpacity;

        const fontSize = (this.style.fontSize || 35) * scaleFactor;
        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.style.color || "#ffffff";

        // Soft shadow for premium feel
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4 * scaleFactor;
        ctx.shadowOffsetX = 1 * scaleFactor;
        ctx.shadowOffsetY = 1 * scaleFactor;

        const displayText = `${this.vText}ª`;

        if (!isNaN(x) && !isNaN(y)) {
            ctx.save();
            ctx.translate(x, y);
            if (this.mirror) ctx.scale(-1, 1);
            if (this.rotation) ctx.rotate((-this.rotation * Math.PI) / 180);
            ctx.fillText(displayText, 0, 0);
            ctx.restore();
        }

        ctx.restore();
    }

    public getBounds() {
        const scaleFactor = this.geometry.scaleFactor;
        return {
            x: this.geometry.fretboardX - 80 * scaleFactor,
            y: this.geometry.fretboardY + (this.vFret - 1) * this.geometry.realFretSpacing,
            width: 80 * scaleFactor,
            height: this.geometry.realFretSpacing
        };
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/FretboardDrawer.ts ---
import type { FretboardTheme } from "@/modules/core/domain/types";

export interface FretboardDrawer {
  readonly ctx: CanvasRenderingContext2D;
  readonly colors: FretboardTheme;
  readonly dimensions: { width: number; height: number };
  readonly scaleFactor: number;

  // Core Drawing Methods
  drawFretboard(transport?: number): void;
  drawNeck(progress?: number): void;
  drawStrings(progress?: number): void;
  drawFrets(progress?: number): void;
  drawStringNames(progress?: number, customNames?: string[]): void;

  // Optional / Progressive Drawing
  drawNeckProgressive(progress: number): void;
  drawStringsProgressive(progress: number): void;
  drawFretsProgressive(progress: number): void;
  drawAnimatedFretboard(phases: {
    neckProgress: number;
    stringNamesProgress: number;
    stringsProgress: number;
    fretsProgress: number;
    nutProgress: number;
  }): void;

  // Configuration Methods (Common Interface)
  setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void;
  setHeadstockGap(gap: number): void;
  setCapo(show: boolean, fret: number): void;
  setHideCapoTitle(hide: boolean): void;

  setStringNames(names: string[] | undefined): void;
  setStringNames(index: number | string[] | undefined, names?: string[]): void; // Overload support

  // Common State Accessors
  readonly fingerRadius: number;
  readonly barreWidth: number;
  readonly neckRadius: number;

  // Geometry Updates
  updateGeometry(
    width: number,
    height: number,
    numStrings: number,
    numFrets: number,
    scaleFactor: number
  ): void;

  setDiagramX(x: number): void;
  setDiagramY(y: number): void;
  setFretboardWidth(width: number): void;
  setFretboardHeight(height: number): void;
  setFretSpacing(spacing: number): void;
  setHorizontalPadding(padding: number): void;
  setStringSpacing(spacing: number): void;
  setNumStrings(num: number): void;
  setNumFrets(num: number): void;

  calculateDimensions(): void;

  // Position Calculation & Validation
  getFingerCoords(fret: number, string: number): { x: number; y: number };
  getBarreCoords(fret: number, startString: number, endString: number): { x: number; y: number; width: number; height: number; radius: number };
  validatePosition(fret: number, string: number): boolean;
  getChordNameCoords(): { x: number; y: number };

  // Canvas
  setCtx(ctx: CanvasRenderingContext2D): void;
  clear(): void;
}
--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/ShortFingersAnimation.ts ---
import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";
import { FingersAnimationDrawer, FingersAnimationParams } from "./ChordDrawer";
import { easeInOutQuad } from "../utils/animacao";
import { detectBarreFromChord } from "./utils/barre-detection";
import { getFinNum } from "./utils/fingers-utils";
import { FingerComponent } from "./components/FingerComponent";
import { AvoidComponent } from "./components/AvoidComponent";
import { TransposeIndicatorComponent } from "./components/TransposeIndicatorComponent";
import { NeckType } from "./components/NeckType";

export class ShortFingersAnimation implements FingersAnimationDrawer {
    private fingerComponents: FingerComponent[] = [];
    private barreComponent: FingerComponent | null = null;
    private transposeComponent: TransposeIndicatorComponent | null = null;
    private avoidComponents: AvoidComponent[] = [];
    private lastChordId: string = "";

    public draw(params: FingersAnimationParams): void {
        const { drawer, currentDisplayChord, nextDisplayChord, transitionProgress, buildProgress, skipFretboard, allChords, currentIndex } = params;

        if (allChords && currentIndex !== undefined) {
            this.drawCarousel(params);
            return;
        }

        if (!currentDisplayChord) return;
        const ctx = drawer.ctx;
        const geometry = (drawer as any).getGeometry?.();

        if (!skipFretboard) {
            drawer.clear();
        }

        const currentFinalChord = currentDisplayChord.finalChord;
        const currentTransportDisplay = currentDisplayChord.transportDisplay;

        if (buildProgress !== undefined && buildProgress < 1) {
            drawer.drawChordWithBuildAnimation(
                currentFinalChord,
                currentTransportDisplay,
                buildProgress,
                0
            );
            return;
        }

        if (!geometry) {
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
            return;
        }

        // Prepare components
        this.ensureComponents(drawer, currentDisplayChord, nextDisplayChord || currentDisplayChord, geometry);

        if (nextDisplayChord && transitionProgress > 0) {
            const eased = easeInOutQuad(transitionProgress);

            ctx.save();
            drawer.applyTransforms();

            // Draw Barre (Historically separate, but now barre might be inside fingerComponents if unified)
            if (this.barreComponent) {
                this.barreComponent.update(eased);
                this.barreComponent.draw(ctx);
            }

            // Draw Fingers
            this.fingerComponents.forEach(f => {
                f.update(eased);
                f.draw(ctx);
            });

            // Draw Transpose Indicator
            if (this.transposeComponent) {
                this.transposeComponent.update(eased);
                this.transposeComponent.draw(ctx);
            }

            // Update & Draw Avoids
            this.avoidComponents.forEach(avoid => {
                avoid.update(eased);
                avoid.draw(ctx);
            });

            ctx.restore();
        } else {
            drawer.drawChord(currentFinalChord, currentTransportDisplay, 0, { skipFretboard });
        }
    }

    private drawCarousel(params: FingersAnimationParams): void {
        const { drawer, transitionProgress, allChords, currentIndex } = params;
        if (!allChords || allChords.length === 0 || currentIndex === undefined) return;

        const ctx = drawer.ctx;
        const diagramWidth = (drawer as any)._diagramWidth || drawer.dimensions.width;
        const spacing = diagramWidth * 1.4;
        const easedProgress = easeInOutQuad(transitionProgress);
        const baseShift = -easedProgress * spacing;

        const ACTIVE_OPACITY = 1.0;
        const INACTIVE_OPACITY = 0.4;

        drawer.clear();

        const drawItem = (chord: ChordDiagramProps, transport: number, offset: number, opacity: number) => {
            const threshold = (drawer.dimensions.width / 2) + diagramWidth;
            if (offset < -threshold || offset > threshold) return;

            ctx.save();
            ctx.translate(offset, 0);
            ctx.globalAlpha = opacity;

            // Draw the complete chord including its own fretboard
            drawer.drawChord(chord, transport, 0);

            ctx.restore();
        };

        // Right side (Next + Current)
        for (let i = currentIndex; i < allChords.length; i++) {
            const relIndex = i - currentIndex;
            const offset = (relIndex * spacing) + baseShift;

            let opacity = INACTIVE_OPACITY;
            if (i === currentIndex) {
                opacity = ACTIVE_OPACITY + (INACTIVE_OPACITY - ACTIVE_OPACITY) * easedProgress;
            } else if (i === currentIndex + 1) {
                opacity = INACTIVE_OPACITY + (ACTIVE_OPACITY - INACTIVE_OPACITY) * easedProgress;
            }

            drawItem(allChords[i].finalChord, allChords[i].transportDisplay, offset, opacity);
        }

        // Left side (Previous)
        for (let i = currentIndex - 1; i >= 0; i--) {
            const relIndex = i - currentIndex;
            const offset = (relIndex * spacing) + baseShift;
            drawItem(allChords[i].finalChord, allChords[i].transportDisplay, offset, INACTIVE_OPACITY);
        }
    }

    private ensureComponents(drawer: any, current: any, next: any, geometry: any): void {
        const nextId = (next.finalChord.chordName || "") + JSON.stringify(next.finalChord.fingers) + next.transportDisplay;
        const curId = (current.finalChord.chordName || "") + JSON.stringify(current.finalChord.fingers) + current.transportDisplay;

        // Include geometry in ID
        const geometryId = `${drawer.fretboardX}_${drawer.fretboardWidth}_${drawer.scaleFactor}`;
        const transitionId = `${curId}_to_${nextId}_geo_${geometryId}`;

        if (this.lastChordId === transitionId) return;

        // MATCH DRAWER LOGIC: Calculate actual transports used for static drawing
        const curT = FingerComponent.calculateEffectiveTransport(current.finalChord.fingers, drawer.numFrets, current.transportDisplay);
        const nxtT = FingerComponent.calculateEffectiveTransport(next.finalChord.fingers, drawer.numFrets, next.transportDisplay);

        const curV = drawer.transposeForDisplay(current.finalChord, curT).finalChord;
        const nxtV = drawer.transposeForDisplay(next.finalChord, nxtT).finalChord;

        // Unified Component Pools
        this.fingerComponents = [];
        this.barreComponent = null;

        const derivedStyle = {
            ...drawer.colors.fingers,
            radius: drawer.fingerRadius / drawer.scaleFactor,
            barreWidth: drawer.barreWidth / drawer.scaleFactor,
            fontSize: (drawer as any)._baseFontSize || drawer.colors.fingers.fontSize || 35
        };

        // Step 1: Extract all "Actors" from current and next chords
        // An Actor is either a Barre or a Loose Finger
        const getActors = (chord: ChordDiagramProps) => {
            const barre = detectBarreFromChord(chord);
            const loose = chord.fingers.filter(f => {
                if (f.fret <= 0) return false;
                if (barre && f.fret === barre.fret) {
                    const sMin = Math.min(barre.startString, barre.endString);
                    const sMax = Math.max(barre.startString, barre.endString);
                    if (f.string >= sMin && f.string <= sMax) return false;
                }
                return true;
            });
            return { barre, loose };
        };

        const curA = getActors(curV);
        const nxtA = getActors(nxtV);

        // Map by finger ID
        const componentsMap = new Map<number | string, FingerComponent>();

        // 1. Resolve Barre (if any finger ID 1 is usually used for barre, we check mapping)
        // Note: For simplicity, we assume there's only one "Major Barre" per chord for now.
        // But we map it by its finger ID to allow transformations.

        if (curA.barre || nxtA.barre) {
            const fingerId = curA.barre?.finger ?? nxtA.barre?.finger ?? 1;
            const initB = curA.barre || nxtA.barre;

            this.barreComponent = new FingerComponent(initB!.fret, initB!.startString, fingerId, derivedStyle, geometry, 1, initB!.endString);

            if (!curA.barre && nxtA.barre) {
                // Fading in
                (this.barreComponent as any).sOpacity = 0;
                (this.barreComponent as any).vOpacity = 0;
                this.barreComponent.setTarget(nxtA.barre.fret, nxtA.barre.startString, 1, fingerId, 1, nxtA.barre.endString);
            } else if (curA.barre && nxtA.barre) {
                // Moving/Transforming
                this.barreComponent.setTarget(nxtA.barre.fret, nxtA.barre.startString, 1, fingerId, 1, nxtA.barre.endString);
            } else if (curA.barre && !nxtA.barre) {
                // Disappearing OR transforming into a loose finger
                const nextLooseWithSameId = nxtA.loose.find(f => f.finger === fingerId);
                if (nextLooseWithSameId) {
                    // TRANSFORM into loose finger
                    this.barreComponent.setTarget(nextLooseWithSameId.fret, nextLooseWithSameId.string, 1, fingerId, 1, undefined);
                } else {
                    // Fading out
                    this.barreComponent.setTarget(curA.barre.fret, curA.barre.startString, 0, fingerId, 1, curA.barre.endString);
                }
            }
            this.barreComponent.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            componentsMap.set(fingerId, this.barreComponent);
        }

        // 2. Resolve Loose Fingers
        const usedNxtLoose = new Set<number>();

        // Match existing/new loose fingers
        curA.loose.forEach(curF => {
            if (componentsMap.has(curF.finger ?? 'none')) return; // Already handled by barre transformation

            const nxtFIdx = nxtA.loose.findIndex((f, idx) => !usedNxtLoose.has(idx) && f.finger === curF.finger && f.finger !== undefined && f.finger !== 0);
            const comp = new FingerComponent(curF.fret, curF.string, curF.finger ?? 1, derivedStyle, geometry, 1);

            if (nxtFIdx !== -1) {
                const nxtF = nxtA.loose[nxtFIdx];
                comp.setTarget(nxtF.fret, nxtF.string, 1, nxtF.finger ?? 1, 1);
                usedNxtLoose.add(nxtFIdx);
            } else {
                // Check if this finger becomes a Barre in next chord
                if (nxtA.barre && nxtA.barre.finger === curF.finger) {
                    // TRANSFORM into barre
                    comp.setTarget(nxtA.barre.fret, nxtA.barre.startString, 1, nxtA.barre.finger ?? 1, 1, nxtA.barre.endString);
                } else {
                    // Fade out
                    comp.setTarget(curF.fret, curF.string, 0, curF.finger ?? 1, 1);
                }
            }

            comp.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            this.fingerComponents.push(comp);
            if (curF.finger) componentsMap.set(curF.finger, comp);
        });

        // Add remaining loose fingers from nxt
        nxtA.loose.forEach((nxtF, idx) => {
            if (usedNxtLoose.has(idx)) return;
            if (componentsMap.has(nxtF.finger ?? 'none')) return;

            const comp = new FingerComponent(nxtF.fret, nxtF.string, nxtF.finger ?? 1, derivedStyle, geometry, 1);
            (comp as any).sOpacity = 0;
            (comp as any).vOpacity = 0;
            comp.setTarget(nxtF.fret, nxtF.string, 1, nxtF.finger ?? 1, 1);

            comp.setRotation((drawer as any).rotation, (drawer as any).mirror, drawer.dimensions);
            this.fingerComponents.push(comp);
        });

        // 3. Transpose Indicator
        const getMinFret = (fingers: StandardPosition[]) => {
            let minFret = Infinity;
            for (let i = 0; i < fingers.length; i++) {
                if (fingers[i].fret > 0 && fingers[i].fret < minFret) { minFret = fingers[i].fret; }
            }
            return minFret === Infinity ? 1 : minFret;
        };

        const minVisualFret = getMinFret(nxtV.fingers || []);
        const tText = nxtT;
        const tFretVisual = tText > 1 ? minVisualFret : 1;

        if (!this.transposeComponent) {
            const color = (drawer.colors.head?.textColors as any)?.name || drawer.colors.global.primaryTextColor || "#ffffff";
            this.transposeComponent = new TransposeIndicatorComponent(NeckType.SHORT, tText, tFretVisual, { color, fontSize: 35 }, geometry);
        }
        if (this.transposeComponent) {
            this.transposeComponent.setTarget(tText, tFretVisual, tText > 1 ? 1 : 0);
            this.transposeComponent.setRotation((drawer as any).rotation, (drawer as any).mirror);
        }

        // 4. Avoids
        this.avoidComponents = [];
        const curAvoid = current.finalChord.avoid || [];
        const nxtAvoid = next.finalChord.avoid || [];
        const allStrings = new Set([...(curAvoid as number[]), ...(nxtAvoid as number[])]);

        allStrings.forEach(s => {
            const style = drawer.colors.avoid;
            const comp = new AvoidComponent(s, { ...style, opacity: (curAvoid as number[]).includes(s) ? 1 : 0 }, geometry);
            comp.setTargetOpacity((nxtAvoid as number[]).includes(s) ? 1 : 0);
            this.avoidComponents.push(comp);
        });

        this.lastChordId = transitionId;
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/utils/avoided-strings-utils.ts ---
/**
 * Interface para contexto de desenho de cordas evitadas
 */
export interface AvoidedStringsContext {
    ctx: CanvasRenderingContext2D;
    fretboardX: number;
    fretboardY: number;
    fretboardHeight: number;
    horizontalPadding: number;
    stringSpacing: number;
    realFretSpacing: number;
    numStrings: number;
    scaleFactor: number;
    textColor: string;
    mirror?: boolean;
    rotation?: number;
}

/**
 * Calcula a posição X de uma corda na tela
 * Leva em conta padding horizontal e espaçamento das cordas
 * 
 * @param context Contexto de desenho
 * @param stringNum Número da corda (1-6 para guitarra)
 * @returns Posição X na tela
 */
export function calculateAvoidedStringX(context: AvoidedStringsContext, stringNum: number): number {
    return context.fretboardX + context.horizontalPadding + (context.numStrings - stringNum) * context.stringSpacing;
}

/**
 * Calcula a posição Y de uma corda evitada (abaixo do fretboard)
 * 
 * @param context Contexto de desenho
 * @returns Posição Y na tela
 */
export function calculateAvoidedStringY(context: AvoidedStringsContext): number {
    return context.fretboardY + context.fretboardHeight + context.realFretSpacing * 0.4;
}

/**
 * Desenha o símbolo "x" para uma corda evitada em uma posição específica
 * 
 * @param context Contexto de desenho
 * @param x Posição X
 * @param y Posição Y
 */
export function drawAvoidedStringMark(context: AvoidedStringsContext, x: number, y: number): void {
    context.ctx.save();
    context.ctx.translate(x, y);

    if (context.mirror) context.ctx.scale(-1, 1);
    if (context.rotation) context.ctx.rotate((-context.rotation * Math.PI) / 180);

    context.ctx.fillStyle = context.textColor;
    const fontSize = 45 * context.scaleFactor;
    context.ctx.font = `bold ${fontSize}px sans-serif`;
    context.ctx.textAlign = "center";
    context.ctx.textBaseline = "middle";
    context.ctx.fillText("x", 0, 0);

    context.ctx.restore();
}

/**
 * Renderiza todas as cordas evitadas de uma vez
 * Combinação de calculateAvoidedStringX/Y + drawAvoidedStringMark
 * 
 * @param context Contexto de desenho
 * @param avoidedStrings Array de números de cordas a evitar (ex: [2, 4])
 */
export function drawAvoidedStrings(context: AvoidedStringsContext, avoidedStrings: number[]): void {
    if (!avoidedStrings || avoidedStrings.length === 0) return;

    const y = calculateAvoidedStringY(context);

    avoidedStrings.forEach(stringNum => {
        const x = calculateAvoidedStringX(context, stringNum);
        drawAvoidedStringMark(context, x, y);
    });
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/utils/barre-detection.ts ---
import type { ChordDiagramProps, BarreInfo, StandardPosition } from "@/modules/core/domain/types";

/**
 * Detecta se há uma pestana (barre) em uma lista de posições de dedos.
 * Uma pestana é quando um dedo cobre múltiplas cordas no mesmo traste.
 * 
 * @param fingers Array de posições de dedos com fret, string e informações de fim
 * @returns Informações da pestana (fret, finger, startString, endString) ou null se não houver
 */
export function detectBarreFromFinger(fingers: StandardPosition[]): BarreInfo | null {
    if (!fingers || fingers.length === 0) return null;

    let bestBarre: BarreInfo | null = null;
    let maxSpan = 0;

    fingers.forEach(f => {
        // Verifica se o dedo cobre múltiplas cordas (tem endString diferente de string)
        if (f.endString !== undefined && f.endString !== f.string) {
            const span = Math.abs(f.endString - f.string);
            if (span > maxSpan) {
                maxSpan = span;
                bestBarre = {
                    fret: f.fret,
                    finger: f.finger ?? 1,
                    startString: f.string,
                    endString: f.endString
                };
            }
        }
    });

    return bestBarre;
}

/**
 * Detecta pestana em um acorde ChordDiagramProps (estrutura com positions ou fingers).
 * Extrai as posições de dedos e usa detectBarreFromFinger() internamente.
 * 
 * @param chord Objeto ChordDiagramProps contendo fingers com fret, string e informações
 * @returns Informações da pestana ou null se não houver
 */
export function detectBarreFromChord(chord: ChordDiagramProps): BarreInfo | null {
    if (!chord.fingers || chord.fingers.length === 0) return null;

    // First, check if any single finger object is already marked as a barre
    const singleFingerBarre = detectBarreFromFinger(chord.fingers);
    if (singleFingerBarre) return singleFingerBarre;

    // Group fingers by (fret, finger) pair
    const candidates = new Map<string, { fret: number, finger: number | string, notes: StandardPosition[] }>();

    chord.fingers.forEach(f => {
        if (f.fret > 0) {
            // Key using finger ID, defaulting to 'implied' if 0/undefined
            const fingerKey = (f.finger && f.finger !== 0) ? f.finger : 'implied';
            const key = `${f.fret}-${fingerKey}`;

            if (!candidates.has(key)) {
                candidates.set(key, { fret: f.fret, finger: fingerKey === 'implied' ? 1 : f.finger!, notes: [] });
            }
            candidates.get(key)!.notes.push(f);
        }
    });

    let bestCandidate: BarreInfo | null = null;
    let maxScore = 0;

    candidates.forEach((cand) => {
        if (cand.notes.length >= 2) {
            const strings = cand.notes.map(f => f.string).sort((a, b) => a - b);
            const startString = strings[0];
            const endString = strings[strings.length - 1];
            const span = Math.abs(endString - startString);

            // Heuristic Validation:
            // If explicit finger (>0), basic check (len >= 2) is allowed (score prioritization handles best fit).
            // If IMPLIED finger (0/undefined), require WIDE SPAN (>= 4 strings) to avoid false positives (like A Major Open cluster).
            // Exception: If implied but explicitly marked as endString in input, allow it.

            const isExplicit = cand.finger !== 1 || (cand.notes.some(n => n.finger === 1)); // Heuristic: '1' comes from implied or explicit 1.
            // Actually, simply: if original notes had '0', we handle them as candidate with finger 1.

            const hasExplicitFinger = cand.notes.some(n => n.finger && Number(n.finger) > 0);

            if (!hasExplicitFinger && span < 3) { // Require span >= 3 (distance 3 means 4 strings involved? No, 6-1=5. 5-2=3. 4-2=2(A major)).
                // A Major: Str 2,3,4. Span = 4-2 = 2.
                // Barrier for implied: Span > 2 (i.e. 3 or more).
                // D Major: Str 1,2,3. Span = 3-1 = 2.
                return;
            }

            // Score based on span (primary) and note count (secondary)
            // Weight span higher to prefer wider barres
            const score = (span * 10) + cand.notes.length;

            if (score > maxScore) {
                maxScore = score;
                bestCandidate = {
                    fret: cand.fret,
                    finger: cand.finger,
                    startString: startString,
                    endString: endString
                };
            }
        }
    });

    return bestCandidate;
}

/**
 * Wrapper para detectar barre de forma consistente.
 * Escolhe automaticamente entre detectBarreFromFinger ou detectBarreFromChord
 * baseado no tipo de entrada.
 * 
 * @param input Array de StandardPosition[] ou ChordDiagramProps
 * @returns Informações da pestana ou null
 */
export function detectBarre(input: StandardPosition[] | ChordDiagramProps): BarreInfo | null {
    if (Array.isArray(input)) {
        return detectBarreFromFinger(input);
    } else {
        return detectBarreFromChord(input);
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/utils/fingers-utils.ts ---
import type { StandardPosition } from "@/modules/core/domain/types";

export const getFinNum = (f: any) => (f === 'T' ? 0 : Number(f) || 1);

export function areFingersIdentical(a: StandardPosition[], b: StandardPosition[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].fret !== b[i].fret ||
            a[i].string !== b[i].string ||
            a[i].endString !== b[i].endString) {
            return false;
        }

        const fingerA = a[i].finger === 'T' ? 0 : (Number(a[i].finger) || 1);
        const fingerB = b[i].finger === 'T' ? 0 : (Number(b[i].finger) || 1);
        if (fingerA !== fingerB) return false;
    }

    return true;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/utils/label-positioning.ts ---
/**
 * Interface para encapsular posição de labels (nomes de acordes, transposição, etc)
 */
export interface LabelPosition {
    x: number;
    y: number;
}

/**
 * Tipos de labels que podem ser posicionados
 */
export type LabelType = 'name' | 'transpose' | 'stringName';

/**
 * Geometria do fretboard necessária para calcular posições
 */
export interface GeometryContext {
    fretboardX: number;
    fretboardY: number;
    fretboardWidth: number;
    fretboardHeight: number;
    diagramX: number;
    diagramY: number;
    diagramHeight: number;
    realFretSpacing: number;
    scaleFactor: number;
}

/**
 * Calcula a posição do nome do acorde (no topo do diagrama)
 * Centralizado horizontalmente e acima do fretboard
 * 
 * @param context Geometria do fretboard
 * @returns Posição {x, y} para desenhar o nome
 */
export function calculateChordNamePosition(context: GeometryContext): LabelPosition {
    const centerX = context.diagramX + context.fretboardWidth / 2;
    const centerY = context.diagramY - (30 * context.scaleFactor);
    return { x: centerX, y: centerY };
}

/**
 * Calcula a posição do indicador de transposição (fret number à esquerda do fretboard)
 * Posicionado verticalmente no topo do diagrama, horizontal à esquerda
 * 
 * @param context Geometria do fretboard
 * @returns Posição {x, y} para desenhar o indicador de transposição
 */
export function calculateTransposeIndicatorPosition(context: GeometryContext): LabelPosition {
    const x = context.diagramX - (60 * context.scaleFactor);
    const y = context.diagramY + (30 * context.scaleFactor);
    return { x, y };
}

/**
 * Interface genérica para calcular posição de qualquer tipo de label
 * Retorna posição baseada no tipo de label e contexto de geometria
 * 
 * @param labelType Tipo do label: 'name', 'transpose', 'stringName'
 * @param context Geometria do fretboard
 * @returns Posição calculada {x, y}
 */
export function calculateLabelPosition(labelType: LabelType, context: GeometryContext): LabelPosition {
    switch (labelType) {
        case 'name':
            return calculateChordNamePosition(context);
        case 'transpose':
            return calculateTransposeIndicatorPosition(context);
        case 'stringName':
            // String names são renderizadas pelo FretboardDrawer, não aqui
            return { x: context.fretboardX, y: context.diagramY };
        default:
            return { x: context.diagramX, y: context.diagramY };
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/drawers/utils/tuning-utils.ts ---
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/**
 * Transposes a note name by a given number of semitones.
 */
export function transposeNote(note: string, semitones: number): string {
    if (!note) return "";

    const isLower = note === note.toLowerCase();
    const cleanNote = note.toUpperCase();

    let index = NOTES.indexOf(cleanNote);
    if (index === -1) index = NOTES_FLAT.indexOf(cleanNote);

    if (index === -1) return note; // Return original if not found

    // Calculate new index
    let newIndex = (index + semitones) % 12;
    if (newIndex < 0) newIndex += 12;

    // Prefer flats for DOWN transposition
    const transposed = semitones < 0 ? NOTES_FLAT[newIndex] : NOTES[newIndex];

    return isLower ? transposed.toLowerCase() : transposed;
}

/**
 * Transposes an array of string names (e.g., ["E", "A", "D", "G", "B", "e"]).
 */
export function transposeStringNames(names: string[], semitones: number): string[] {
    return names.map(n => transposeNote(n, semitones));
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/renderers/scene-renderer.ts ---
import { Renderer, SceneObject } from '../../domain/interfaces/renderer';
import { ProjectData } from '@/modules/core/domain/types';

export class SceneRenderer implements Renderer {
    private ctx: CanvasRenderingContext2D | null = null;
    private objects: SceneObject[] = [];
    private project: ProjectData | null = null;
    private animationFrameId: number | null = null;

    initialize(canvas: HTMLCanvasElement): void {
        this.ctx = canvas.getContext('2d');
    }

    loadProject(project: ProjectData): void {
        this.project = project;
    }

    addObject(object: SceneObject): void {
        this.objects.push(object);
    }

    play(): void {
        if (this.animationFrameId) return;

        const renderLoop = (time: number) => {
            this.render(time);
            this.animationFrameId = requestAnimationFrame(renderLoop);
        };
        this.animationFrameId = requestAnimationFrame(renderLoop);
    }

    pause(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    seek(time: number): void {
        this.render(time);
    }

    dispose(): void {
        this.pause();
        this.ctx = null;
    }

    private render(time: number): void {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Render all objects
        for (const obj of this.objects) {
            obj.render(this.ctx, time);
        }
    }
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/engine/infrastructure/utils/animacao.ts ---
export type EasingFn = (t: number) => number;

export const linear: EasingFn = (t) => clamp01(t);

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(t: number): number {
  return clamp(t, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const easeInOutQuad: EasingFn = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
};

export const easeInOutCubic: EasingFn = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// --- “Anime-like” easings (pure functions) ---

export function easeOutBack(overshoot = 1.70158): EasingFn {
  return (t) => {
    const x = clamp01(t) - 1;
    return 1 + (overshoot + 1) * x * x * x + overshoot * x * x;
  };
}

export function easeInBack(overshoot = 1.70158): EasingFn {
  return (t) => {
    const x = clamp01(t);
    return (overshoot + 1) * x * x * x - overshoot * x * x;
  };
}

export function easeInOutBack(overshoot = 1.70158): EasingFn {
  return (t) => {
    const x = clamp01(t);
    const c = overshoot * 1.525;
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c + 1) * 2 * x - c)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c + 1) * (2 * x - 2) + c) + 2) / 2;
  };
}

export function easeOutElastic(amplitude = 1, period = 0.3): EasingFn {
  return (t) => {
    const x = clamp01(t);
    if (x === 0 || x === 1) return x;

    let a = amplitude;
    let p = period;
    if (p <= 0) p = 0.3;

    let s: number;
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }

    return a * Math.pow(2, -10 * x) * Math.sin(((x - s) * (2 * Math.PI)) / p) + 1;
  };
}

export function easeInElastic(amplitude = 1, period = 0.3): EasingFn {
  const out = easeOutElastic(amplitude, period);
  return (t) => 1 - out(1 - clamp01(t));
}

export function easeInOutElastic(amplitude = 1, period = 0.45): EasingFn {
  const out = easeOutElastic(amplitude, period);
  return (t) => {
    const x = clamp01(t);
    return x < 0.5 ? (1 - out(1 - 2 * x)) / 2 : (1 + out(2 * x - 1)) / 2;
  };
}

export const easeOutBounce: EasingFn = (t) => {
  const x = clamp01(t);
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) {
    const y = x - 1.5 / d1;
    return n1 * y * y + 0.75;
  }
  if (x < 2.5 / d1) {
    const y = x - 2.25 / d1;
    return n1 * y * y + 0.9375;
  }
  const y = x - 2.625 / d1;
  return n1 * y * y + 0.984375;
};

export const easeInBounce: EasingFn = (t) => 1 - easeOutBounce(1 - clamp01(t));

export const easeInOutBounce: EasingFn = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
};

// --- small helpers for building animation curves ---

export function pingPong(t: number): number {
  const x = clamp01(t);
  return 1 - Math.abs(2 * x - 1);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clampResult = false
): number {
  if (inMin === inMax) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  const mapped = outMin + (outMax - outMin) * t;
  if (!clampResult) return mapped;
  return outMin < outMax ? clamp(mapped, outMin, outMax) : clamp(mapped, outMax, outMin);
}

export function fadeIn(t: number, easing: EasingFn = (x) => x): number {
  return easing(clamp01(t));
}

export function fadeOut(t: number, easing: EasingFn = (x) => x): number {
  return 1 - easing(clamp01(t));
}

/**
 * Zoom in: cresce (ex.: 1 -> 1.5).
 * Útil para "sumir" (com opacidade caindo) ou dar destaque.
 */
export function zoomIn(t: number, fromScale = 1, toScale = 1.5, easing: EasingFn = (x) => x): number {
  return lerp(fromScale, toScale, easing(clamp01(t)));
}

/**
 * Zoom out: diminui (ex.: 1.5 -> 1).
 * Útil para "aparecer" (com opacidade subindo).
 */
export function zoomOut(t: number, fromScale = 1.5, toScale = 1, easing: EasingFn = (x) => x): number {
  return lerp(fromScale, toScale, easing(clamp01(t)));
}

export function slide(t: number, from: number, to: number, easing: EasingFn = (x) => x): number {
  return lerp(from, to, easing(clamp01(t)));
}

export interface CanvasTransform {
  opacity?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

/**
 * Aplica opacidade/escala/translação simples e executa o draw.
 * Não muda o ponto de origem da escala (escala em torno do (0,0)).
 */
export function withCanvasTransform(
  ctx: CanvasRenderingContext2D,
  transform: CanvasTransform,
  draw: () => void
): void {
  ctx.save();

  if (typeof transform.opacity === "number") ctx.globalAlpha = transform.opacity;
  if (typeof transform.translateX === "number" || typeof transform.translateY === "number") {
    ctx.translate(transform.translateX ?? 0, transform.translateY ?? 0);
  }
  if (typeof transform.scale === "number") ctx.scale(transform.scale, transform.scale);

  draw();
  ctx.restore();
}

/**
 * Escala em torno de um ponto (centerX, centerY) enquanto o draw desenha em coordenadas normais.
 */
export function withCanvasTransformAround(
  ctx: CanvasRenderingContext2D,
  params: { centerX: number; centerY: number; opacity?: number; scale?: number },
  draw: () => void
): void {
  ctx.save();
  if (typeof params.opacity === "number") ctx.globalAlpha = params.opacity;

  const scale = params.scale ?? 1;
  ctx.translate(params.centerX, params.centerY);
  ctx.scale(scale, scale);
  ctx.translate(-params.centerX, -params.centerY);

  draw();
  ctx.restore();
}

/**
 * Desenha algo que é renderizado em (0,0) (ex.: dedo e "x") no ponto (x,y), com escala/opacidade.
 */
export function withCanvasTransformAtPoint(
  ctx: CanvasRenderingContext2D,
  params: { x: number; y: number; opacity?: number; scale?: number },
  drawAtOrigin: () => void
): void {
  ctx.save();
  if (typeof params.opacity === "number") ctx.globalAlpha = params.opacity;

  const scale = params.scale ?? 1;
  ctx.translate(params.x, params.y);
  ctx.scale(scale, scale);

  drawAtOrigin();
  ctx.restore();
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/timeline/presentation/hooks/use-timeline-sync.ts ---
import { useMemo } from "react";
import { measuresToChords } from "@/lib/chords/converter";
import { MeasureData, GlobalSettings } from "@/modules/editor/domain/types";

interface TimelineSyncProps {
    measures: MeasureData[];
    settings: GlobalSettings;
    activeMeasure: MeasureData | null;
    currentMeasureIndex: number;
    editingNoteId: string | null;
    selectedNoteIds: string[];
    playbackIsPlaying: boolean;
    playbackProgress: number;
    playbackTotalDurationMs: number;
}

export function useTimelineSync({
    measures,
    settings,
    activeMeasure,
    currentMeasureIndex,
    editingNoteId,
    selectedNoteIds,
    playbackIsPlaying,
    playbackProgress,
    playbackTotalDurationMs
}: TimelineSyncProps) {
    // Use a stable reference for chords by stringifying measures
    const measuresKey = useMemo(() => JSON.stringify(measures.map(m => ({
        id: m.id,
        chordName: m.chordName, // Added to ensure updates when name changes
        notes: m.notes.map(n => ({ id: n.id, positions: n.positions }))
    }))), [measures]);

    const chords = useMemo(() => {
        console.log('[useTimelineSync] Recalculating chords');
        return measuresToChords(measures, settings);
    }, [measuresKey, settings]);

    const activeChordIndex = useMemo(() => {
        if (!activeMeasure || chords.length === 0) return 0;

        const previousMeasures = measures.slice(0, currentMeasureIndex);
        const prevChordsCount = measuresToChords(previousMeasures, settings).length;

        let offset = 0;
        if (editingNoteId) {
            const index = activeMeasure.notes.findIndex(n => n.id === editingNoteId);
            if (index !== -1) offset = index;
        } else if (selectedNoteIds.length > 0) {
            let maxIndex = -1;
            activeMeasure.notes.forEach((n, idx) => {
                if (selectedNoteIds.includes(n.id)) {
                    maxIndex = Math.max(maxIndex, idx);
                }
            });
            if (maxIndex !== -1) offset = maxIndex;
        }

        const result = prevChordsCount + offset;
        console.log('[useTimelineSync] activeChordIndex calculation:', {
            currentMeasureIndex,
            prevChordsCount,
            editingNoteId,
            selectedNoteIds,
            offset,
            result,
            totalChords: chords.length
        });
        return result;
    }, [activeMeasure, currentMeasureIndex, measures, settings, chords, editingNoteId, selectedNoteIds]);

    const totalDurationMs = useMemo(() => {
        return chords.reduce((acc, chord) => acc + (chord.duration || 0), 0);
    }, [chords]);

    const currentCursorMs = useMemo(() => {
        if (playbackIsPlaying && playbackTotalDurationMs > 0) {
            return playbackProgress * playbackTotalDurationMs;
        }

        if (!chords.length) return 0;
        const safeIndex = Math.min(activeChordIndex, chords.length);
        const previousChords = chords.slice(0, safeIndex);
        return previousChords.reduce((acc, chord) => acc + (chord.duration || 0), 0);
    }, [chords, activeChordIndex, playbackIsPlaying, playbackProgress, playbackTotalDurationMs]);

    return {
        chords,
        activeChordIndex,
        totalDurationMs,
        currentCursorMs
    };
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/context/app-context.ts ---
import React, { createContext, useContext } from "react";

// Exemplo de contexto compartilhado
export const AppContext = createContext<any>(null);
export function useAppContext() {
  return useContext(AppContext);
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/hooks/useIsMobile.ts ---
import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/lib/utils.ts ---
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/stores/tab-editor-store.ts ---
import { create } from 'zustand';

export interface TabNote {
    string: number; // 1-6
    fret: number;
    position: number; // relative position in the measure (0-1 or beat based)
    duration?: string;
    technique?: string;
}

export interface TabCard {
    id: string;
    name: string;
    bpm: number;
    timeSignature: [number, number];
    measureCount: number;
    notes: TabNote[];
    createdAt: number;
}

interface TabEditorState {
    // Global Settings
    bpm: number;
    timeSignature: [number, number];
    isSetup: boolean;

    // Editor State
    currentNotes: TabNote[];
    selectedString: number | null;

    // Library
    cards: TabCard[];

    // Actions
    setGlobalSettings: (bpm: number, timeSignature: [number, number]) => void;
    resetSetup: () => void;
    addNote: (note: TabNote) => void;
    removeNote: (string: number, position: number) => void;
    saveCurrentCard: (name: string) => void;
    loadCard: (id: string) => void;
    deleteCard: (id: string) => void;
    clearEditor: () => void;
}

export const useTabEditorStore = create<TabEditorState>((set, get) => ({
    bpm: 120,
    timeSignature: [4, 4],
    isSetup: false,

    currentNotes: [],
    selectedString: null,

    cards: [],

    setGlobalSettings: (bpm, timeSignature) =>
        set({ bpm, timeSignature, isSetup: true }),

    resetSetup: () =>
        set({ isSetup: false }),

    addNote: (note) =>
        set((state) => ({
            currentNotes: [
                ...state.currentNotes.filter(n => !(n.string === note.string && n.position === note.position)),
                note
            ]
        })),

    removeNote: (string, position) =>
        set((state) => ({
            currentNotes: state.currentNotes.filter(n => !(n.string === string && n.position === position))
        })),

    saveCurrentCard: (name) => {
        const { bpm, timeSignature, currentNotes, cards } = get();
        const newCard: TabCard = {
            id: crypto.randomUUID(),
            name,
            bpm,
            timeSignature,
            measureCount: 1, // Default to 1 for now
            notes: [...currentNotes],
            createdAt: Date.now(),
        };
        set({ cards: [...cards, newCard] });
    },

    loadCard: (id) => {
        const card = get().cards.find(c => c.id === id);
        if (card) {
            set({
                bpm: card.bpm,
                timeSignature: card.timeSignature,
                currentNotes: [...card.notes],
                isSetup: true
            });
        }
    },

    deleteCard: (id) =>
        set((state) => ({ cards: state.cards.filter(c => c.id !== id) })),

    clearEditor: () =>
        set({ currentNotes: [] }),
}));

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/types/css.d.ts ---
declare module '*.css';

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/Sidebar.tsx ---
'use client';

import React from 'react';
import { Duration, NoteData, MeasureData, GlobalSettings, ManualChordData } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { INSTRUMENTS } from '@/lib/instruments';
import { VexFlowRhythmIcon } from './VexFlowRhythmIcon';
import { GenericSidebar } from '@/shared/components/layout/GenericSidebar';
import Link from 'next/link';
import { Music, Settings2, Guitar, Home, ChevronDown, Minus, Plus, Clock, Wrench } from 'lucide-react';
import { useAppContext } from '@/modules/core/presentation/context/app-context';
import { NOTE_NAMES } from '@/modules/editor/domain/music-math';

const calculateShiftedTuning = (baseTuning: string[], shift: number): string[] => {
    if (shift >= 0) return [...baseTuning]; // Fix names for Capo or Standard

    return baseTuning.map(note => {
        // Extract note part (handles cases like 'e' for high E)
        const isHighE = note === 'e';
        const baseNote = isHighE ? 'E' : note;

        // Find index in NOTE_NAMES. Root might be like 'C#', 'Bb', etc.
        // NOTE_NAMES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        let idx = NOTE_NAMES.indexOf(baseNote);

        // Handle common flat aliases if not found directly
        if (idx === -1) {
            const aliases: Record<string, string> = {
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B', 'Fb': 'E'
            };
            if (aliases[baseNote]) idx = NOTE_NAMES.indexOf(aliases[baseNote]);
        }

        if (idx === -1) return note; // Fallback

        let newIdx = (idx + shift) % 12;
        if (newIdx < 0) newIdx += 12;

        let newNote = NOTE_NAMES[newIdx];

        // Use flats if shift is negative (Down tuning)
        if (shift < 0) {
            const sharpToFlat: Record<string, string> = {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
            };
            if (sharpToFlat[newNote]) newNote = sharpToFlat[newNote];
        }

        return isHighE ? newNote.toLowerCase() : newNote;
    });
};

interface SidebarProps {
    activeDuration: Duration;
    onSelectDuration: (duration: Duration) => void;
    // Inspector Props
    editingNote?: NoteData | null;
    currentPitch?: { name: string; accidental: string; octave: number } | null;
    onCloseInspector?: () => void;
    onNoteRhythmChange?: (newDuration?: Duration, newDot?: boolean) => void;
    onNoteTypeChange?: (type: 'note' | 'rest') => void;
    onPitchChange?: (name?: string, accidental?: string, octave?: number) => void;
    onStringChange?: (stringFret: number) => void;
    onAccidentalChange?: (accidental: string) => void;
    onDecoratorChange?: (decorator: string, value: any) => void;
    // Measure Props
    activeMeasure?: MeasureData | null;
    onMeasureUpdate?: (id: string, updates: Partial<MeasureData>) => void;
    onAddNote?: (measureId: string, duration: Duration) => void;
    // Generic update for new properties
    onUpdateNote?: (updates: Partial<NoteData>) => void;
    onInsert?: (code: string) => void;
    // Chord Props
    activePositionIndex?: number;
    onActivePositionIndexChange?: (index: number) => void;
    onAddChordNote?: () => void;
    onRemoveChordNote?: (index: number) => void;
    onToggleBarre?: (indices?: number[]) => void;
    onToggleBarreTo?: (targetString: number) => void;
    onSetFingerForPosition?: (idx: number, finger: number | string | undefined) => void;
    onSetFretForPosition?: (idx: number, fret: number) => void;
    onSetStringForPosition?: (idx: number, stringNum: number) => void;
    // Global Settings Props
    globalSettings?: GlobalSettings;
    onGlobalSettingsChange?: (settings: Partial<GlobalSettings>) => void;
    onImportScore?: () => void;
    // Undo/Redo props
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    // Mobile props
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    simpleMode?: boolean;
    onUpdateMeasure?: (measureId: string, updates: Partial<MeasureData>) => void;
    onTransposeMeasure?: (measureId: string, semitones: number, smartTranspose?: boolean) => void;
    onTransposeAll?: (semitones: number, smartTranspose?: boolean) => void;
    theme?: FretboardTheme;
    isSequentialMode?: boolean;
    onNoteDurationStatic?: (noteId: string, duration: Duration) => void;
    measures?: MeasureData[];
}

const Sidebar: React.FC<SidebarProps> = ({
    activeDuration,
    onSelectDuration,
    editingNote,
    currentPitch,
    onCloseInspector,
    onNoteRhythmChange,
    onNoteTypeChange,
    onPitchChange,
    onStringChange,
    activeMeasure,
    onMeasureUpdate,
    onAddNote,
    onUpdateNote,
    activePositionIndex = 0,
    onActivePositionIndexChange,
    onAddChordNote,
    onRemoveChordNote,
    onToggleBarre,
    onToggleBarreTo,
    globalSettings,
    onGlobalSettingsChange,
    onImportScore,
    isMobile = false,
    isOpen = true,
    onClose,
    onUpdateMeasure,
    onTransposeMeasure,
    onTransposeAll,
    theme,
    onInsert,
    simpleMode,
    isSequentialMode = false,
    onNoteDurationStatic,
    onSetFingerForPosition,
    onSetFretForPosition,
    onSetStringForPosition,
    measures,
}) => {
    const { setAnimationType, animationType, selectedChords } = useAppContext();

    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
    const [selectedStrings, setSelectedStrings] = React.useState<number[]>([]);
    const [isBarreSelectorOpen, setIsBarreSelectorOpen] = React.useState(false);
    const [activeCategory, setActiveCategory] = React.useState<'config' | 'chord' | 'rhythm' | 'editor' | 'tools'>(editingNote ? 'editor' : 'config');

    // --- REUSABLE EMPTY STATE COMPONENT ---
    const EmptyState = ({ icon: Icon, title, description, features }: {
        icon: any,
        title: string,
        description: string,
        features: string[]
    }) => (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900/50 border border-zinc-800/30 flex items-center justify-center mb-2">
                <Icon className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-1">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{title}</h4>
                <p className="text-[9px] text-zinc-600 font-medium leading-relaxed max-w-[180px]">
                    {description}
                </p>
            </div>
            <div className="pt-4 grid grid-cols-1 gap-2 w-full max-w-[160px]">
                <div className="h-px bg-zinc-800/50 w-full mb-2" />
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[8px] text-zinc-700 font-bold uppercase tracking-tighter text-left">
                        <div className="w-1 h-1 rounded-full bg-cyan-500/40 shrink-0" />
                        {f}
                    </div>
                ))}
            </div>
        </div>
    );

    // Chord builder state (initialized from prop logic or default)
    // We'll keep it simple: sync logic runs in useEffect below
    const [chordData, setChordData] = React.useState<ManualChordData>({
        root: "C",
        quality: "",
        bass: "Root",
        extensions: []
    });

    const [smartTranspose, setSmartTranspose] = React.useState(false);

    // Reset barre selector when note changes or active position changes
    React.useEffect(() => {
        setIsBarreSelectorOpen(false);
    }, [editingNote?.id, activePositionIndex]);

    // Sync local state when active measure changes
    React.useEffect(() => {
        if (activeMeasure?.chordName) {
            const chordName = activeMeasure.chordName;

            // Extract Bass first
            let bass = "Root";
            let rest = chordName;
            if (chordName.includes("/")) {
                const parts = chordName.split("/");
                bass = "/" + parts[1];
                rest = parts[0];
            }

            // Extract Root (1 or 2 chars)
            let root = "C";
            let qualityExt = "";
            if (rest.length > 1 && (rest[1] === "#" || rest[1] === "b")) {
                root = rest.substring(0, 2);
                qualityExt = rest.substring(2);
            } else {
                root = rest.substring(0, 1);
                qualityExt = rest.substring(1);
            }

            // Extract Quality basic check
            let quality = "";
            let extensionsStr = qualityExt;

            // Try to match specific quality prefixes first (Order matters: longest first)
            const qualities = ["dim", "aug", "sus2", "sus4", "maj", "m"];
            for (const q of qualities) {
                if (qualityExt.startsWith(q)) {
                    quality = q;
                    extensionsStr = qualityExt.substring(q.length);
                    break;
                }
            }

            // Parse individual extensions using regex
            const foundExts: string[] = [];
            const extRegex = /([b#])?(5|6|7\+?|9|11|13)/g;
            let match;
            while ((match = extRegex.exec(extensionsStr)) !== null) {
                foundExts.push(match[0]);
            }

            // Sort musically
            const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
            foundExts.sort((a, b) => {
                const indexA = musicalOrder.indexOf(a);
                const indexB = musicalOrder.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            // Set state
            setChordData({
                root,
                quality,
                bass,
                extensions: foundExts
            });

        } else {
            // Reset to defaults if no name
            setChordData({
                root: "C",
                quality: "",
                bass: "Root",
                extensions: []
            });
        }
    }, [activeMeasure?.id, activeMeasure?.chordName]);





    // Helper to update both local state and parent measure
    const handleChordChange = (updates: Partial<ManualChordData>) => {
        const newData = { ...chordData, ...updates };

        // Update local state
        setChordData(newData);

        // Build name and update parent
        if (activeMeasure && onUpdateMeasure) {
            const qualitySuffix = newData.quality;
            const bassSuffix = (!newData.bass || newData.bass === "Root") ? "" : newData.bass;
            const extensionStr = (newData.extensions || []).join("");
            const newName = `${newData.root}${qualitySuffix}${extensionStr}${bassSuffix}`;

            if (onUpdateMeasure) {
                onUpdateMeasure(activeMeasure.id, { chordName: newName });
            }
        }
    };

    const toggleExtension = (base: string, accidental: string) => {
        const fullExt = accidental + base;
        const currentExts = chordData.extensions || [];
        const isCurrentlyActive = currentExts.includes(fullExt);

        // Remove any version of the same degree
        const filtered = currentExts.filter(e => {
            if (base === '7') return !e.match(/^[b#]?7$/);
            if (base === '7+') return !e.match(/^[b#]?7\+$/);
            return !e.match(new RegExp(`^[b#]?${base}$`));
        });

        let newExts = filtered;
        if (!isCurrentlyActive) {
            newExts.push(fullExt);
        }

        // Sort musically
        const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
        newExts.sort((a, b) => {
            const indexA = musicalOrder.indexOf(a);
            const indexB = musicalOrder.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        handleChordChange({ extensions: newExts });
    };

    const toggleBass = (note: string, accidental: string = '') => {
        if (note === 'Root') {
            handleChordChange({ bass: 'Root' });
            return;
        }
        const displayBass = '/' + note + accidental;
        handleChordChange({ bass: displayBass });
    };


    const title = 'CHORD EDITOR';
    const Icon = Guitar;

    return (
        <GenericSidebar
            title={title}
            icon={Icon}
            onReset={undefined}
            onClose={onClose || onCloseInspector}
            side="left"
            isMobile={isMobile}
            isOpen={isOpen}
            contentClassName="overflow-hidden p-0"
            headerAction={(
                <Link href="/">
                    <button className="group relative p-2.5 bg-zinc-950/40 hover:bg-cyan-500/10 rounded-xl border border-zinc-800/60 hover:border-cyan-500/40 text-zinc-500 hover:text-cyan-400 transition-all duration-300 shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </Link>
            )}
        >
            <div className="flex h-full overflow-hidden">
                {/* Vertical Navigation Rail */}
                <div className="w-16 bg-zinc-950/60 border-r border-zinc-800/30 flex flex-col items-center py-4 gap-4">
                    {[
                        { id: 'editor', icon: Guitar, label: 'Fretboard' },
                        { id: 'chord', icon: Music, label: 'Harmonia' },
                        { id: 'rhythm', icon: Clock, label: 'Duração' },
                        { id: 'tools', icon: Wrench, label: 'Ações' },
                        { id: 'config', icon: Settings2, label: 'Projeto' },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as any)}
                            className={`group relative w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${activeCategory === cat.id
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
                                }`}
                        >
                            <cat.icon className="w-5 h-5" />
                            <span className={`absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-zinc-700`}>
                                {cat.label}
                            </span>
                            {activeCategory === cat.id && (
                                <div className="absolute right-0 w-1 h-4 bg-cyan-500 rounded-l-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-4 pb-20">

                    {/* --- CATEGORY: EDITOR (Fretboard Visuals) --- */}
                    {activeCategory === 'editor' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                            {/* VIEW WHEN A CHORD IS SELECTED */}
                            {editingNote ? (
                                <>
                                    {/* Strings & Frets - Consolidated */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fretboard Map</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={onAddChordNote}
                                                    className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-bold hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
                                                >
                                                    + ADD STRING
                                                </button>
                                            </div>
                                        </div>

                                        {/* Active Notes List */}
                                        <div className="flex flex-wrap gap-1.5 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50 min-h-[50px] items-center">
                                            {editingNote.positions.length === 0 && (
                                                <span className="text-[9px] text-zinc-600 italic px-2">No notes placed on fretboard</span>
                                            )}
                                            {editingNote.positions.map((pos, idx) => (
                                                <div key={idx} className="relative group">
                                                    <button
                                                        onClick={(e) => {
                                                            if (e.shiftKey) {
                                                                setSelectedIndices(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                                                            } else {
                                                                onActivePositionIndexChange?.(idx);
                                                                setSelectedIndices([]);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${activePositionIndex === idx || selectedIndices.includes(idx) ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                        style={activePositionIndex === idx || selectedIndices.includes(idx) ? {
                                                            backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                            borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                            color: theme?.fingers?.textColor || '#ffffff'
                                                        } : {}}
                                                    >
                                                        F{pos.fret} / S{pos.string}{pos.endString && pos.endString !== pos.string ? `-${pos.endString}` : ''}
                                                        {pos.finger !== undefined && (
                                                            <span className="ml-1 opacity-40 text-[8px]">({pos.finger === 0 ? 'T' : pos.finger})</span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onRemoveChordNote?.(idx); }}
                                                        className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Detailed Editors - Only visible if notes exist */}
                                        {editingNote.positions.length > 0 && (() => {
                                            const currentPos = editingNote.positions[activePositionIndex];
                                            const usedFingers = editingNote.positions
                                                .filter((_, idx) => idx !== activePositionIndex)
                                                .map(p => p.finger)
                                                .filter(f => f !== undefined && f !== 0);

                                            return (
                                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                                    {/* 1. String Selector */}
                                                    <div className="space-y-2 pt-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">1. Select String</span>
                                                        <div className="grid grid-cols-6 gap-1.5">
                                                            {Array.from({ length: globalSettings?.numStrings || 6 }, (_, i) => (globalSettings?.numStrings || 6) - i).map(s => {
                                                                const isActive = currentPos?.string === s;
                                                                const isUsedElsewhere = editingNote.positions.some((p, i) => p.string === s && i !== activePositionIndex);

                                                                return (
                                                                    <button
                                                                        key={s}
                                                                        disabled={isUsedElsewhere}
                                                                        onClick={() => onSetStringForPosition?.(activePositionIndex, s)}
                                                                        className={`py-2 rounded-lg border font-bold text-[9px] transition-all ${isActive
                                                                            ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                                                            : isUsedElsewhere
                                                                                ? 'bg-zinc-950/40 border-zinc-900/50 text-zinc-800 cursor-not-allowed opacity-30'
                                                                                : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
                                                                            }`}
                                                                        style={isActive ? {
                                                                            backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                                            borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                                            color: theme?.fingers?.textColor || '#ffffff'
                                                                        } : {}}
                                                                    >STR {s}</button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* 2. Finger Selector (includes Avoid) */}
                                                    <div className="space-y-2 pt-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">2. Select Finger</span>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {[
                                                                { label: 'Index (1)', val: 1 },
                                                                { label: 'Middle (2)', val: 2 },
                                                                { label: 'Ring (3)', val: 3 },
                                                                { label: 'Pinky (4)', val: 4 },
                                                                { label: 'Thumb (T)', val: 0 },
                                                                { label: 'Avoid (X)', val: 'X' }
                                                            ].map((finger) => {
                                                                const isAvoidVal = finger.val === 'X';
                                                                const isActive = isAvoidVal ? currentPos?.avoid : (currentPos?.finger === finger.val && !currentPos?.avoid);
                                                                const isUsed = !isAvoidVal && usedFingers.includes(finger.val as any);

                                                                return (
                                                                    <button
                                                                        key={finger.label}
                                                                        disabled={isUsed}
                                                                        onClick={() => onSetFingerForPosition?.(activePositionIndex, finger.val)}
                                                                        className={`flex-1 min-w-[60px] py-2 rounded-lg border font-bold text-[9px] transition-all ${isActive
                                                                            ? (isAvoidVal ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.15)]')
                                                                            : isUsed
                                                                                ? 'bg-zinc-950/20 border-zinc-900/50 text-zinc-800 opacity-30 cursor-not-allowed'
                                                                                : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800'
                                                                            }`}
                                                                    >
                                                                        {finger.label.split(" ")[0]} <span className="opacity-50">{finger.label.split(" ")[1]}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* 3. Fret Selector */}
                                                    <div className={`space-y-2 pt-2 transition-opacity duration-300 ${currentPos?.avoid ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">3. Select Fret</span>
                                                        <div className="grid grid-cols-6 gap-1.5">
                                                            {Array.from({ length: 24 }).map((_, i) => {
                                                                const fret = i + 1;
                                                                const currentFret = parseInt(currentPos?.fret?.toString() || '0');
                                                                const currentCapo = globalSettings?.capo || 0;
                                                                const isOverLimit = false;

                                                                return (
                                                                    <button
                                                                        key={fret}
                                                                        onClick={() => onSetFretForPosition?.(activePositionIndex, fret)}
                                                                        className={`h-7 rounded-md border font-black text-[10px] transition-all bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300`}
                                                                        style={currentFret === fret ? {
                                                                            backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                                            borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                                            color: theme?.fingers?.textColor || '#ffffff'
                                                                        } : {}}
                                                                    >
                                                                        {fret}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* 4. Pestana (Barre) Selector */}
                                                    <div className={`space-y-2 pt-2 border-t border-zinc-800/50 transition-opacity duration-300 ${currentPos?.avoid ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                                        {(() => {
                                                            const hasBarre = currentPos?.endString !== undefined && currentPos.endString !== currentPos.string;
                                                            const isBarreFinger = currentPos?.finger !== undefined && (typeof currentPos.finger === 'number' ? currentPos.finger > 0 : true);

                                                            return (
                                                                <>
                                                                    {(!hasBarre && !isBarreSelectorOpen) ? (
                                                                        <button
                                                                            disabled={!isBarreFinger}
                                                                            onClick={() => setIsBarreSelectorOpen(true)}
                                                                            className={`w-full py-3 rounded-xl border border-dashed text-[10px] font-black transition-all uppercase tracking-widest ${isBarreFinger ? 'border-zinc-800 text-zinc-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5' : 'border-zinc-900 text-zinc-800 cursor-not-allowed'}`}
                                                                        >
                                                                            + ADD BARRE (Pestana)
                                                                        </button>
                                                                    ) : (
                                                                        <>
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">4. Pestana (Barre To)</span>
                                                                                {hasBarre && (
                                                                                    <button
                                                                                        onClick={() => onToggleBarre?.()}
                                                                                        className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                                                                                    >
                                                                                        REMOVE
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                            <div className="grid grid-cols-6 gap-1.5">
                                                                                {Array.from({ length: globalSettings?.numStrings || 6 }, (_, i) => i + 1).map(s => {
                                                                                    const isTarget = currentPos?.endString === s;

                                                                                    return (
                                                                                        <button
                                                                                            key={s}
                                                                                            onClick={() => onToggleBarreTo?.(s)}
                                                                                            className={`py-2 rounded-lg border font-bold text-[9px] transition-all ${isTarget ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                                                            style={isTarget ? {
                                                                                                backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                                                                borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                                                                color: theme?.fingers?.textColor || '#ffffff'
                                                                                            } : {}}
                                                                                        >
                                                                                            {s}
                                                                                        </button>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                            <p className="text-[8px] text-zinc-600">Selecione uma nota e clique no número da corda onde a pestana deve terminar.</p>
                                                                        </>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </>
                            ) : (
                                <EmptyState
                                    icon={Guitar}
                                    title="No Note Selected"
                                    description="Select a chord in the timeline to edit its finger positions on the fretboard."
                                    features={[
                                        "Map Fingers to Strings",
                                        "Select Frets (1-24)",
                                        "Add Barre Chords"
                                    ]}
                                />
                            )}
                        </div>
                    )}

                    {/* --- CATEGORY: CHORD (Musical Theory) --- */}
                    {activeCategory === 'chord' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                            {editingNote ? (
                                <>

                                    {/* Root Selection */}
                                    <div className="space-y-3 bg-zinc-950/40 p-4 rounded-2xl border border-white/[0.02]">
                                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Root & Tone</label>
                                        <div className="grid grid-cols-7 gap-1">
                                            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                                                const currentBase = chordData.root.replace(/[#b]/g, '');
                                                const isActive = currentBase === note;
                                                return (
                                                    <button
                                                        key={note}
                                                        onClick={() => {
                                                            const currentAcc = chordData.root.includes('#') ? '#' : chordData.root.includes('b') ? 'b' : '';
                                                            handleChordChange({ root: note + currentAcc });
                                                        }}
                                                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${isActive ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-zinc-900/40 text-zinc-500 hover:bg-zinc-800 hover:text-white'}`}
                                                    >
                                                        {note}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="flex gap-2">
                                            {[{ label: 'Nat', val: '' }, { label: '♯', val: '#' }, { label: '♭', val: 'b' }].map((acc) => {
                                                const currentBase = chordData.root.replace(/[#b]/g, '') || 'C';
                                                const currentAcc = chordData.root.includes('#') ? '#' : chordData.root.includes('b') ? 'b' : '';
                                                const isAccActive = currentAcc === acc.val;
                                                return (
                                                    <button
                                                        key={acc.label}
                                                        onClick={() => handleChordChange({ root: currentBase + acc.val })}
                                                        className={`flex-1 h-8 rounded-xl text-[9px] font-black uppercase transition-all border ${isAccActive ? 'bg-zinc-800 text-cyan-400 border-cyan-500/30' : 'bg-zinc-950/20 text-zinc-600 border-zinc-900/50 hover:bg-zinc-900'}`}
                                                    >
                                                        {acc.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Quality & Extensions */}
                                    <div className="space-y-4 bg-zinc-950/40 p-4 rounded-2xl border border-white/[0.02]">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Quality</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl px-3 py-2 text-[10px] font-black text-zinc-300 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                                                    value={chordData.quality}
                                                    onChange={(e) => handleChordChange({ quality: e.target.value })}
                                                >
                                                    <option value="">Major</option>
                                                    <option value="m">Minor</option>
                                                    <option value="dim">Diminished</option>
                                                    <option value="aug">Augmented</option>
                                                    <option value="sus2">Sus2</option>
                                                    <option value="sus4">Sus4</option>
                                                    <option value="maj">Major 7th Style</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Extensions</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['5', '6', '7', '7+', '9', '11', '13'].map(base => {
                                                    const currentExts = chordData.extensions || [];
                                                    const isFlatActive = currentExts.includes('b' + base);
                                                    const isNatActive = currentExts.includes(base);
                                                    const isSharpActive = currentExts.includes('#' + base);
                                                    const isActive = isFlatActive || isNatActive || isSharpActive;

                                                    return (
                                                        <div
                                                            key={base}
                                                            className={`flex h-8 rounded-xl overflow-hidden border transition-all duration-300 ${isActive
                                                                ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                                : 'bg-zinc-900/20 border-zinc-800/80'
                                                                }`}
                                                        >
                                                            <button
                                                                onClick={() => toggleExtension(base, 'b')}
                                                                className={`flex-1 text-[9px] font-black transition-all border-r border-zinc-800/50 ${isFlatActive ? 'bg-cyan-500 text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/40'
                                                                    }`}
                                                            >
                                                                b
                                                            </button>
                                                            <button
                                                                onClick={() => toggleExtension(base, '')}
                                                                className={`flex-[2] text-[10px] font-black transition-all border-r border-zinc-800/50 ${isNatActive ? 'bg-cyan-500 text-black' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40'
                                                                    }`}
                                                            >
                                                                {base}
                                                            </button>
                                                            <button
                                                                onClick={() => toggleExtension(base, '#')}
                                                                className={`flex-1 text-[9px] font-black transition-all ${isSharpActive ? 'bg-cyan-500 text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/40'
                                                                    }`}
                                                            >
                                                                #
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bass Selection */}
                                    <div className="space-y-3 bg-zinc-950/40 p-4 rounded-2xl border border-white/[0.02]">
                                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Bass Note</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Root Toggle */}
                                            <button
                                                onClick={() => toggleBass('Root')}
                                                className={`col-span-2 py-2 rounded-xl text-[10px] font-black border transition-all ${chordData.bass === 'Root' ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-zinc-900/20 border-zinc-800/80 text-zinc-500 hover:text-white'}`}
                                            >
                                                ROOT
                                            </button>

                                            {/* Musical Notes with Alterations */}
                                            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                                                const currentBass = chordData.bass || '';
                                                const isFlatActive = currentBass === '/' + note + 'b';
                                                const isNatActive = currentBass === '/' + note;
                                                const isSharpActive = currentBass === '/' + note + '#';
                                                const isActive = isFlatActive || isNatActive || isSharpActive;

                                                return (
                                                    <div
                                                        key={note}
                                                        className={`flex h-8 rounded-xl overflow-hidden border transition-all duration-300 ${isActive
                                                            ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                                            : 'bg-zinc-900/20 border-zinc-800/80'
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={() => toggleBass(note, 'b')}
                                                            className={`flex-1 text-[9px] font-black transition-all border-r border-zinc-800/50 ${isFlatActive ? 'bg-amber-500 text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/40'
                                                                }`}
                                                        >
                                                            b
                                                        </button>
                                                        <button
                                                            onClick={() => toggleBass(note, '')}
                                                            className={`flex-[2] text-[10px] font-black transition-all border-r border-zinc-800/50 ${isNatActive ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40'
                                                                }`}
                                                        >
                                                            {note}
                                                        </button>
                                                        <button
                                                            onClick={() => toggleBass(note, '#')}
                                                            className={`flex-1 text-[9px] font-black transition-all ${isSharpActive ? 'bg-amber-500 text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/40'
                                                                }`}
                                                        >
                                                            #
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <EmptyState
                                    icon={Music}
                                    title="No Note Selected"
                                    description="Select a chord in the timeline to edit its musical theory properties like root, quality and extensions."
                                    features={[
                                        "Define Root & Quality",
                                        "Add Musical Extensions",
                                        "Set Bass Note Variations"
                                    ]}
                                />
                            )}
                        </div>
                    )}

                    {/* --- CATEGORY: RHYTHM --- */}
                    {activeCategory === 'rhythm' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                            {editingNote ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Duration</label>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'Whole', code: 'w' as Duration },
                                            { label: 'Half', code: 'h' as Duration },
                                            { label: 'Quarter', code: 'q' as Duration },
                                            { label: '8th', code: '8' as Duration },
                                            { label: '16th', code: '16' as Duration },
                                            { label: '32nd', code: '32' as Duration },
                                        ].map((item) => {
                                            const isActive = activeDuration === item.code;
                                            return (
                                                <button
                                                    key={item.code}
                                                    onClick={() => onSelectDuration(item.code)}
                                                    className={`aspect-[5/6] rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-500 group/dur ${isActive ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20' : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/40'}`}
                                                >
                                                    <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover/dur:scale-105'}`}>
                                                        <VexFlowRhythmIcon
                                                            duration={item.code}
                                                            className="w-10 h-10"
                                                            fillColor={isActive ? '#22d3ee' : '#3f3f46'}
                                                        />
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-cyan-400' : 'text-zinc-600'}`}>
                                                        {item.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Clock}
                                    title="Rhythm Controls"
                                    description="Select a note to adjust its musical duration and feel in the timeline."
                                    features={[
                                        "Select Note Duration",
                                        "Whole to 32nd Notes",
                                        "Sync with Playback"
                                    ]}
                                />
                            )}
                        </div>
                    )}

                    {/* --- CATEGORY: TOOLS --- */}
                    {activeCategory === 'tools' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                            {editingNote ? (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Musical Tools</h3>

                                    {/* Transpose Section */}
                                    <div className="bg-zinc-950/40 rounded-3xl p-5 border border-white/[0.02] shadow-xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">
                                                    Selective
                                                </span>
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">
                                                    Transpose
                                                </span>
                                            </div>
                                            <div
                                                onClick={() => setSmartTranspose(!smartTranspose)}
                                                className={`px-3 py-1 rounded-full border cursor-pointer transition-all ${smartTranspose ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[8px] font-black leading-none">AUTO</span>
                                                    <span className="text-[8px] font-black leading-none mt-0.5">FINGER</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, -1, smartTranspose)}
                                                className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>

                                            <div className="flex flex-col items-center justify-center min-w-[80px] h-14 bg-black/60 rounded-2xl border border-white/[0.05] shadow-inner">
                                                <span className="text-[14px] font-black text-zinc-300 leading-none">1</span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Semitone</span>
                                            </div>

                                            <button
                                                onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, 1, smartTranspose)}
                                                className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-lg"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Wrench}
                                    title="Note Tools"
                                    description="Select a note to access advanced manipulation tools like selective transposition."
                                    features={[
                                        "Selective Transpose",
                                        "Semitone Shifts",
                                        "Global Actions"
                                    ]}
                                />
                            )}
                        </div>
                    )}


                    {/* --- CATEGORY: CONFIG --- */}
                    {activeCategory === 'config' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Config</h3>

                                {/* BPM / Tempo Selector */}
                                <div className="space-y-3 pt-4 border-t border-zinc-900/50">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Tempo</label>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tight mt-1">Sync Animation</span>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                            <span className="text-[11px] font-black text-cyan-400 leading-none">{globalSettings?.bpm || 120} BPM</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-zinc-950/60 p-1.5 rounded-2xl border border-white/[0.03] shadow-inner">
                                        <button
                                            onClick={() => {
                                                const cur = globalSettings?.bpm || 120;
                                                onGlobalSettingsChange?.({ bpm: Math.max(20, cur - 5) });
                                            }}
                                            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all shadow-lg"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <div className="flex-1 flex flex-col items-center">
                                            <input
                                                type="number"
                                                value={globalSettings?.bpm || 120}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val)) onGlobalSettingsChange?.({ bpm: val });
                                                }}
                                                className="w-full bg-transparent text-center font-black text-xl text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>

                                        <button
                                            onClick={() => {
                                                const cur = globalSettings?.bpm || 120;
                                                onGlobalSettingsChange?.({ bpm: Math.min(300, cur + 5) });
                                            }}
                                            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all shadow-lg"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Instrument Selector */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Instrument</label>
                                    <select
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
                                        value={globalSettings?.instrumentId || 'violao'}
                                        onChange={(e) => {
                                            const instId = e.target.value;
                                            const inst = INSTRUMENTS.find(i => i.id === instId);
                                            if (inst && onGlobalSettingsChange) {
                                                const baseTuning = inst.tunings[0];
                                                const shift = globalSettings?.tuningShift || 0;
                                                onGlobalSettingsChange({
                                                    instrumentId: instId,
                                                    tuningIndex: 0,
                                                    tuning: calculateShiftedTuning(baseTuning, shift),
                                                    numStrings: baseTuning.length
                                                });
                                            }
                                        }}
                                    >
                                        {INSTRUMENTS.map(inst => (
                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tuning Selector */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Tuning</label>
                                    <select
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
                                        value={globalSettings?.tuningIndex || 0}
                                        onChange={(e) => {
                                            const idx = parseInt(e.target.value);
                                            const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                            if (instrument && onGlobalSettingsChange) {
                                                const baseTuning = instrument.tunings[idx];
                                                const shift = globalSettings?.tuningShift || 0;
                                                onGlobalSettingsChange({
                                                    tuningIndex: idx,
                                                    tuning: calculateShiftedTuning(baseTuning, shift)
                                                });
                                            }
                                        }}
                                    >
                                        {INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'))?.tunings.map((t, idx) => (
                                            <option key={idx} value={idx}>{t.join(" ")}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tuning Shift / Capo Selector */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                                            Capo / Tuning Shift
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const current = globalSettings?.tuningShift || 0;
                                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                                const newShift = Math.max(-5, current - 1);

                                                if (animationType === 'guitar-fretboard') {
                                                    const newCapo = Math.max(0, newShift);
                                                    if (measures && measures.length > 0) {
                                                        const allNotesValid = measures.every(m =>
                                                            m.notes.every(n =>
                                                                !n.positions.some(pos => {
                                                                    if (pos.avoid) return false;
                                                                    return (pos.fret + newCapo) > 24;
                                                                })
                                                            )
                                                        );
                                                        if (!allNotesValid) return;
                                                    }
                                                }

                                                onGlobalSettingsChange?.({
                                                    tuningShift: newShift,
                                                    capo: Math.max(0, newShift),
                                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                                });
                                            }}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                                        >-</button>
                                        <div className="flex-1 text-center font-bold text-zinc-300 bg-zinc-950/30 rounded-lg py-1.5 border border-zinc-800/50">
                                            {(() => {
                                                const shift = globalSettings?.tuningShift || 0;
                                                if (shift === 0) return 'STANDARD';
                                                if (shift > 0) return `CAPO ${shift}`;
                                                return `DOWN ${Math.abs(shift)}`;
                                            })()}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const current = globalSettings?.tuningShift || 0;
                                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                                const newShift = Math.min(24, current + 1);

                                                if (animationType === 'guitar-fretboard') {
                                                    const newCapo = Math.max(0, newShift);
                                                    if (measures && measures.length > 0) {
                                                        const allNotesValid = measures.every(m =>
                                                            m.notes.every(n =>
                                                                !n.positions.some(pos => {
                                                                    if (pos.avoid) return false;
                                                                    return (pos.fret + newCapo) > 24;
                                                                })
                                                            )
                                                        );
                                                        if (!allNotesValid) return;
                                                    }
                                                }

                                                onGlobalSettingsChange?.({
                                                    tuningShift: newShift,
                                                    capo: Math.max(0, newShift),
                                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                                });
                                            }}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                                        >+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={onImportScore}
                                    className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-xs hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-4"
                                >
                                    ↓ Import Score
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </GenericSidebar>
    );
};

export default Sidebar;

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/FretboardStage.tsx ---
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { type JSAnimation } from "animejs";
import type { ChordWithTiming, ChordDiagramProps } from "@/modules/core/domain/types";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { type ChordDrawer } from "@/modules/engine/infrastructure/drawers/ChordDrawer";
import { ShortNeckDrawer } from "@/modules/engine/infrastructure/drawers/ShortNeck";


import { FretboardEngine } from "@/modules/engine/infrastructure/FretboardEngine";
import { TimelineState } from "@/modules/chords/domain/types";
import { useCanvasRecorder } from "@/lib/shared/hooks/useCanvasRecorder";

export interface FretboardStageRef {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    handleRender: (format?: 'mp4' | 'webm' | 'json', quality?: 'low' | 'medium' | 'high' | 'ultra') => Promise<void>;
    cancelRender: () => void;
    isAnimating: boolean;
    isRendering: boolean;
    isPaused: boolean;
    resetPlayback: () => void;
}

interface FretboardStageProps {
    chords: ChordWithTiming[];
    previewChord?: ChordDiagramProps | null;
    timelineState?: TimelineState;
    width?: number;
    height?: number;
    onFrameCapture?: (frameData: ImageData) => void;
    isRecording?: boolean;
    onAnimationStateChange?: (isAnimating: boolean, isPaused: boolean) => void;
    onRenderProgress?: (progress: number) => void;
    transitionsEnabled?: boolean;
    buildEnabled?: boolean;
    prebufferMs?: number;
    activeChordIndex?: number;
    numStrings?: number;
    showChordName?: boolean;
    capo?: number;
    tuningShift?: number;
    stringNames?: string[];
    numFrets?: number;
    colors?: any; // FretboardTheme
    animationType?: string;
}

interface AnimationState {
    fingerOpacity: number;
    fingerScale: number;
    cardY: number;
    nameOpacity: number;
    chordIndex: number;
    transitionProgress: number;
    buildProgress: number;
    chordProgress?: number;
    currentChordName?: string;
    prevChordName?: string;
    nameTransitionProgress: number;
}

export const FretboardStage = React.forwardRef<FretboardStageRef, FretboardStageProps>(({
    chords,
    previewChord,
    timelineState,
    width = 1920,
    height = 1080,
    onFrameCapture,
    isRecording = false,
    activeChordIndex,
    onAnimationStateChange,
    onRenderProgress,
    transitionsEnabled = true,
    buildEnabled = true,
    prebufferMs = 0,
    numStrings = 6,
    showChordName = true,
    capo = 0,
    tuningShift = 0,
    stringNames = ["E", "A", "D", "G", "B", "e"],
    numFrets: propNumFrets, // Default removed to allow inference
    colors: propsColors,
    animationType: propsAnimationType,
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<JSAnimation | null>(null);
    const playheadAnimationRef = useRef<JSAnimation | null>(null);
    const playheadStateRef = useRef<{ t: number }>({ t: 0 });
    const playbackRafIdRef = useRef<number | null>(null);
    const playbackStartPerfMsRef = useRef<number>(0);
    const playbackElapsedMsRef = useRef<number>(0);
    const playbackSessionIdRef = useRef<number>(0);
    const lastProgressEmitMsRef = useRef<number>(0);

    const frameCacheRef = useRef<{
        startFrameIndex: number;
        bitmaps: Array<ImageBitmap | null>;
        frameMs: number;
    } | null>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationStateRef = useRef<AnimationState>({
        fingerOpacity: 0,
        fingerScale: 0.5,
        cardY: height,
        nameOpacity: 0,
        chordIndex: 0,
        transitionProgress: 0,
        buildProgress: 1,
        nameTransitionProgress: 1,
        currentChordName: "",
        prevChordName: "",
    });
    const {
        colors: contextColors,
        animationType: contextAnimationType,
        setPlaybackIsPlaying,
        setPlaybackIsPaused,
        setPlaybackProgress,
        setPlaybackTotalDurationMs,
        playbackTotalDurationMs,
        playbackSeekNonce,
        playbackSeekProgress,
    } = useAppContext();

    // Derived values logic (Fixed)
    const colors = propsColors || contextColors || undefined;
    const animationType = propsAnimationType || contextAnimationType || 'dynamic-fingers';

    // Determine effective numFrets
    const effectiveNumFrets = propNumFrets ?? 5;
    const numFrets = effectiveNumFrets;

    const [isAnimating, setIsAnimating] = useState(false);
    const isAnimatingRef = useRef(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderFormat, setRenderFormat] = useState<'mp4' | 'webm' | 'json'>('mp4');
    const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('medium');

    const isRenderCancelledRef = useRef(false);
    const isRenderingRef = useRef(false);
    const prevActiveChordIndexRef = useRef<number | undefined>(undefined);

    // State for the engine instance
    const engineRef = useRef<FretboardEngine | null>(null);
    const drawFrameRef = useRef<((state: AnimationState, timeMs: number) => void) | null>(null);

    // Initialize Engine
    useEffect(() => {
        if (!canvasRef.current || engineRef.current) return;

        engineRef.current = new FretboardEngine(canvasRef.current, {
            width,
            height,
            numStrings,
            numFrets: effectiveNumFrets,
            colors: colors as any,
            animationType,
            showChordName,
            transitionsEnabled,
            buildEnabled,
            capo,
            tuning: stringNames
        });

        // Initial draw
        engineRef.current.drawSingleFrame();

    }, []); // Only run once on mount (or you can add deps if you handle "re-creation" logic, but updates are better)

    // Update Engine Options when props change
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateOptions({
                width,
                height,
                numStrings,
                numFrets: effectiveNumFrets,
                colors: colors as any,
                animationType,
                showChordName,
                transitionsEnabled,
                buildEnabled,
                capo,
                tuning: stringNames
            });
        }
    }, [width, height, numStrings, effectiveNumFrets, colors, animationType, showChordName, transitionsEnabled, buildEnabled, capo, stringNames]);

    // Update Chords
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setChords(chords);
        }
    }, [chords]);

    // Update Preview Chord
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setPreviewChord(previewChord || null);
        }
    }, [previewChord]);

    const drawFrame = useCallback((state: AnimationState, timeMs: number) => {
        if (engineRef.current) {
            engineRef.current.drawFrame(state);
        }
    }, []);

    const drawAnimatedChord = useCallback(() => {
        if (!canvasRef.current || !engineRef.current) return;
        drawFrame(animationStateRef.current, playheadStateRef.current.t);
    }, [drawFrame]);

    useEffect(() => {
        // This ref is used by the canvas recorder, so it needs to point to the current drawFrame
        // which now delegates to the engine.
        drawFrameRef.current = drawFrame;
    }, [drawFrame]);

    // Resize handling (if props don't catch it strictly, or pure window resize needed)
    useEffect(() => {
        if (engineRef.current && canvasRef.current) {
            engineRef.current.resize(width, height);
        }
    }, [width, height]);

    // Canvas recorder for video rendering
    const canvasRecorder = useCanvasRecorder(stageContainerRef as any, {
        fps: 30,
        format: renderFormat === 'json' ? 'webm' : renderFormat,
        quality: renderQuality,
    });

    // Define Timing Helpers EARLY to avoid reference errors
    const minSegmentSec = 0.1;
    const getSegmentDurationSec = useCallback((chordWithTiming: ChordWithTiming) => {
        const defaultSegmentSec = 2.0;
        const clipSec = (chordWithTiming.duration / 1000) || defaultSegmentSec;
        return Math.max(clipSec, minSegmentSec);
        // Removed dangling legacy code
    }, [minSegmentSec]);

    useEffect(() => {
        if (!backgroundCanvasRef.current) return;
        const bgCtx = backgroundCanvasRef.current.getContext('2d');
        if (!bgCtx) return;

        bgCtx.clearRect(0, 0, width, height);
        if (colors?.global?.backgroundColor) {
            bgCtx.fillStyle = colors.global.backgroundColor;
            bgCtx.fillRect(0, 0, width, height);
        }

        const effectiveScale = colors?.global?.scale || 1;
        let bgDrawer: ChordDrawer;

        bgDrawer = new ShortNeckDrawer(bgCtx, colors, { width, height }, {
            diagramWidth: width,
            diagramHeight: height,
            diagramX: 0,
            diagramY: 0,
            numStrings: numStrings,
            numFrets: numFrets,
            horizontalPadding: 100,
            stringSpacing: 0,
            fretboardX: 0,
            fretboardY: 0,
            fretboardWidth: width,
            fretboardHeight: height,
            realFretSpacing: 0,
            neckRadius: 35 * effectiveScale,
            stringNamesY: 0,
        }, effectiveScale);

        bgDrawer.setNumStrings(numStrings || 6);
        bgDrawer.setNumFrets(numFrets || 24);
        bgDrawer.setGlobalCapo(capo || 0);
        bgDrawer.setStringNames(stringNames);
        bgDrawer.drawFretboard();
    }, [width, height, animationType, colors, numStrings, numFrets, capo, stringNames]);

    const stopPlayhead = useCallback(() => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setIsAnimating(false);
        isAnimatingRef.current = false;
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(false);
    }, [setPlaybackIsPlaying, setPlaybackIsPaused]);

    const computeTotalPlaybackDurationMs = useCallback(() => {
        if (!chords || chords.length === 0) return 0;
        let totalMs = 0;
        for (const chordWithTiming of chords) {
            totalMs += getSegmentDurationSec(chordWithTiming) * 1000;
        }
        return Math.max(0, Math.round(totalMs));
    }, [chords, getSegmentDurationSec]);

    const computeStateAtTimeMs = useCallback((timeMs: number) => {
        if (!chords || chords.length === 0) return null;
        const t = Math.max(0, timeMs);

        let cursor = 0;
        const targetTransitionMs = 530;

        for (let i = 0; i < chords.length; i++) {
            const currentDur = Math.max(100, getSegmentDurationSec(chords[i]) * 1000);
            const prevDur = i > 0 ? Math.max(100, getSegmentDurationSec(chords[i - 1]) * 1000) : 0;
            const nextDur = i < chords.length - 1 ? Math.max(100, getSegmentDurationSec(chords[i + 1]) * 1000) : 0;

            const transitionInTotal = i > 0 ? Math.min(targetTransitionMs, currentDur, prevDur) : 0;
            const transitionOutTotal = i < chords.length - 1 ? Math.min(targetTransitionMs, currentDur, nextDur) : 0;

            const inHalf = transitionInTotal / 2;
            const outHalf = transitionOutTotal / 2;
            const staticMs = currentDur - inHalf - outHalf;

            // 1. IN phase - just display current chord (no transition)
            if (t < cursor + inHalf) {
                return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: 0 };
            }
            cursor += inHalf;

            // 2. STATIC phase
            if (t < cursor + staticMs) {
                return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: 0.5 };
            }
            cursor += staticMs;

            // 3. OUT phase
            if (t < cursor + outHalf) {
                if (i === chords.length - 1) return { chordIndex: i, transitionProgress: 0, buildProgress: 1, chordProgress: 1 };
                const progress = (t - cursor) / outHalf;
                return { chordIndex: i, transitionProgress: progress, buildProgress: 1, chordProgress: progress };
            }
            cursor += outHalf;
        }
        return { chordIndex: chords.length - 1, transitionProgress: 0, buildProgress: 1, chordProgress: 1 };
    }, [chords, getSegmentDurationSec, transitionsEnabled, animationType]);

    const startPlayhead = useCallback((totalDurationMs: number) => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setPlaybackTotalDurationMs(totalDurationMs);
        setPlaybackIsPlaying(true);
        setPlaybackIsPaused(false);
        setPlaybackProgress(0);
        playheadStateRef.current.t = 0;
        playbackElapsedMsRef.current = 0;
        playbackStartPerfMsRef.current = performance.now();
        lastProgressEmitMsRef.current = 0;
    }, [setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, setPlaybackTotalDurationMs]);

    const startPlaybackRafLoop = useCallback((totalDurationMs: number) => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }

        const tick = () => {
            const now = performance.now();
            const elapsed = Math.max(0, now - playbackStartPerfMsRef.current);
            const clampedElapsed = Math.min(totalDurationMs, elapsed);
            playbackElapsedMsRef.current = clampedElapsed;
            playheadStateRef.current.t = clampedElapsed;

            const state = computeStateAtTimeMs(clampedElapsed);
            if (state && chords) {
                const currentChordData = chords[state.chordIndex];
                animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
                animationStateRef.current.chordIndex = state.chordIndex;
                animationStateRef.current.chordProgress = state.chordProgress;
                animationStateRef.current.transitionProgress = state.transitionProgress;
                animationStateRef.current.buildProgress = state.buildProgress;
                drawAnimatedChord();
            }

            if (now - lastProgressEmitMsRef.current >= 50) {
                lastProgressEmitMsRef.current = now;
                setPlaybackProgress(totalDurationMs > 0 ? clampedElapsed / totalDurationMs : 0);
            }

            if (clampedElapsed >= totalDurationMs) {
                // Reset to first chord when animation completes
                animationStateRef.current.chordIndex = 0;
                animationStateRef.current.chordProgress = 0;
                animationStateRef.current.transitionProgress = 0;
                animationStateRef.current.buildProgress = 1;
                playheadStateRef.current.t = 0;
                playbackElapsedMsRef.current = 0;

                setPlaybackProgress(0);
                setPlaybackIsPlaying(false);
                setPlaybackIsPaused(false);
                setIsAnimating(false);
                isAnimatingRef.current = false;
                setIsPaused(false);
                if (onAnimationStateChange) onAnimationStateChange(false, false);

                // Redraw to show first chord
                drawAnimatedChord();
                stopPlayhead();
                return;
            }
            playbackRafIdRef.current = requestAnimationFrame(tick);
        };
        playbackRafIdRef.current = requestAnimationFrame(tick);
    }, [computeStateAtTimeMs, drawAnimatedChord, onAnimationStateChange, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress, stopPlayhead, chords]);


    const startAnimation = () => {
        if (!chords || chords.length === 0) return;
        setIsAnimating(true);
        isAnimatingRef.current = true;
        setIsPaused(false);
        if (onAnimationStateChange) onAnimationStateChange(true, false);
        const totalMs = computeTotalPlaybackDurationMs();
        startPlayhead(totalMs);
        startPlaybackRafLoop(totalMs);
    };

    const pauseAnimation = () => {
        if (!isAnimating) return;
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setIsPaused(true);
        setPlaybackIsPaused(true);
        if (onAnimationStateChange) onAnimationStateChange(true, true);
    };

    const resumeAnimation = () => {
        if (!isPaused || !chords || chords.length === 0) return;
        setIsPaused(false);
        setPlaybackIsPaused(false);
        if (onAnimationStateChange) onAnimationStateChange(true, false);
        const totalMs = computeTotalPlaybackDurationMs();
        playbackStartPerfMsRef.current = performance.now() - playbackElapsedMsRef.current;
        startPlaybackRafLoop(totalMs);
    };

    const resetPlayback = () => {
        if (playbackRafIdRef.current !== null) {
            cancelAnimationFrame(playbackRafIdRef.current);
            playbackRafIdRef.current = null;
        }
        setIsAnimating(false);
        setIsPaused(false);
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(false);
        playbackElapsedMsRef.current = 0;
        animationStateRef.current = {
            ...animationStateRef.current,
            chordIndex: 0,
            chordProgress: 0,
            transitionProgress: 0,
            buildProgress: 0,
        };
        setPlaybackProgress(0);
        if (onAnimationStateChange) onAnimationStateChange(false, false);
        drawAnimatedChord();
    };

    useEffect(() => {
        const totalMs = computeTotalPlaybackDurationMs();
        if (totalMs !== playbackTotalDurationMs) {
            setPlaybackTotalDurationMs(totalMs);
        }
    }, [computeTotalPlaybackDurationMs, setPlaybackTotalDurationMs, playbackTotalDurationMs]);

    useEffect(() => {
        if (!chords || chords.length === 0 || !playbackSeekNonce) return;
        const clampedProgress = Math.max(0, Math.min(1, playbackSeekProgress));
        const totalMs = computeTotalPlaybackDurationMs();
        const timeMs = clampedProgress * totalMs;
        if (playbackRafIdRef.current !== null && !isPaused) {
            playbackElapsedMsRef.current = timeMs;
            playbackStartPerfMsRef.current = performance.now() - timeMs;
        }
        setIsAnimating(true);
        setIsPaused(true);
        setPlaybackIsPlaying(false);
        setPlaybackIsPaused(true);
        setPlaybackProgress(clampedProgress);
        const state = computeStateAtTimeMs(timeMs);
        if (state) {
            animationStateRef.current.chordIndex = state.chordIndex;
            animationStateRef.current.chordProgress = state.chordProgress;
            const currentChordData = chords[state.chordIndex];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;
            drawAnimatedChord();
        }
    }, [chords, computeStateAtTimeMs, computeTotalPlaybackDurationMs, playbackSeekNonce, playbackSeekProgress, setPlaybackIsPaused, setPlaybackIsPlaying, setPlaybackProgress]);

    // Effect for when chords array changes
    useEffect(() => {
        if (!isAnimating && chords && chords.length > 0 && typeof activeChordIndex === 'number') {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));
            animationStateRef.current.chordIndex = index;
            animationStateRef.current.chordProgress = 0;
            const currentChordData = chords[index];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;

            if (drawFrameRef.current) {
                drawFrameRef.current(animationStateRef.current, playheadStateRef.current.t);
            }
        }
    }, [chords, isAnimating]);

    // Effect for when activeChordIndex changes
    useEffect(() => {
        if (!isAnimating && typeof activeChordIndex === 'number' && chords && chords.length > 0) {
            const index = Math.max(0, Math.min(chords.length - 1, activeChordIndex));
            console.log('[FretboardStage] activeChordIndex changed:', {
                activeChordIndex,
                clampedIndex: index,
                totalChords: chords.length,
                chordData: chords[index]?.finalChord
            });

            animationStateRef.current.chordIndex = index;
            animationStateRef.current.chordProgress = 0;
            const currentChordData = chords[index];
            animationStateRef.current.currentChordName = currentChordData?.finalChord?.chordName || "";
            animationStateRef.current.prevChordName = "";
            animationStateRef.current.nameTransitionProgress = 1;

            if (drawFrameRef.current) {
                drawFrameRef.current(animationStateRef.current, playheadStateRef.current.t);
            }
        }
    }, [activeChordIndex, isAnimating]);

    const handleRender = useCallback(async (format?: 'mp4' | 'webm' | 'json', quality?: 'low' | 'medium' | 'high' | 'ultra') => {
        if (!chords || chords.length === 0 || !canvasRef.current) return;
        const targetFormat = format || 'mp4';
        const targetQuality = quality || 'medium';
        setRenderFormat(targetFormat);
        setRenderQuality(targetQuality);

        if (targetFormat === 'json') {
            const exportData = {
                chords: chords.map(c => ({
                    chordName: c.finalChord?.chordName || '',
                    fingers: c.finalChord?.fingers || [],
                    avoid: c.finalChord?.avoid || [],
                    duration: c.duration,
                    origin: c.finalChord?.origin || 0,
                })),
                settings: { width, height, numStrings, numFrets, capo, animationType },
                theme: colors,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            canvasRecorder.downloadVideo(blob, 'animation-data.json');
            return;
        }

        try {
            isRenderingRef.current = true;
            canvasRecorder.setIsRendering(true);
            canvasRecorder.setIsComplete(false);
            canvasRecorder.setRenderProgress(0);
            canvasRecorder.setRenderStatus('Preparando quadros...');
            isRenderCancelledRef.current = false;
            await new Promise(resolve => setTimeout(resolve, 100));
            const fps = 30;
            const totalDurationMs = computeTotalPlaybackDurationMs();
            const totalFrames = Math.ceil((totalDurationMs / 1000) * fps);
            const msPerFrame = 1000 / fps;
            let globalFrameIndex = 0;
            for (let i = 0; i < totalFrames; i++) {
                if (isRenderCancelledRef.current) throw new Error("Render cancelled");
                const currentTime = i * msPerFrame;
                const state = computeStateAtTimeMs(currentTime);
                if (state && drawFrameRef.current) {
                    animationStateRef.current = { ...animationStateRef.current, ...state, fingerOpacity: 1, fingerScale: 1, cardY: 0, nameOpacity: 1 };
                    drawFrameRef.current(animationStateRef.current, currentTime);
                    if (canvasRef.current) {
                        await canvasRecorder.captureFrame(canvasRef.current, globalFrameIndex++);
                        const progress = (i / totalFrames) * 20;
                        canvasRecorder.setRenderProgress(progress);
                        canvasRecorder.setRenderStatus(`Capturando quadro ${i + 1} de ${totalFrames}...`);
                        if (onRenderProgress) onRenderProgress(progress);
                    }
                }
            }
            canvasRecorder.setRenderStatus('Codificando vídeo...');
            const videoBlob = await canvasRecorder.renderFramesToVideo(globalFrameIndex, (progress) => {
                if (onRenderProgress) onRenderProgress(progress);
            });
            if (videoBlob) {
                const extension = targetFormat === 'webm' ? 'webm' : 'mp4';
                canvasRecorder.downloadVideo(videoBlob, `chord-animation.${extension}`);
                canvasRecorder.setIsComplete(true);
            }
        } catch (error: any) {
            if (error.message !== "Render cancelled") console.error('Render error:', error);
            canvasRecorder.cancelRender();
        } finally {
            isRenderingRef.current = false;
            canvasRecorder.setIsRendering(false);
        }
    }, [chords, width, height, numStrings, numFrets, capo, animationType, colors, canvasRecorder, computeTotalPlaybackDurationMs, computeStateAtTimeMs, onRenderProgress]);

    React.useImperativeHandle(ref, () => ({
        startAnimation,
        pauseAnimation,
        resumeAnimation,
        handleRender,
        cancelRender: () => { isRenderCancelledRef.current = true; canvasRecorder.cancelRender(); },
        isAnimating: isAnimatingRef.current,
        isRendering: isRenderingRef.current,
        isPaused: isPaused,
        resetPlayback
    }));

    return (
        <div ref={stageContainerRef} className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <canvas ref={backgroundCanvasRef} width={width} height={height} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
        </div>
    );
});

FretboardStage.displayName = "FretboardStage";

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/SettingsPanel.tsx ---
"use client";

import React, { useState } from "react";
import {
  Palette,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Sun,
  Layers,
  Zap,
  Target,
  Type,
  Grid,
  Music
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
import { useAppContext, AnimationType } from "@/modules/core/presentation/context/app-context";
import type { FretboardTheme } from "@/modules/core/domain/types";
import { cn } from "@/shared/lib/utils";
import { GenericSidebar } from "@/shared/components/layout/GenericSidebar";
import { DEFAULT_COLORS, STUDIO_PRESETS } from "@/modules/editor/presentation/constants";

// --- PRESETS ---

interface SettingsPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  colors?: FretboardTheme;
  onColorChange?: (newColors: any) => void;
  numFrets?: number;
}

// --- COMPONENTS ---

const ColorPicker = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="w-8 h-8 rounded-full ring-2 ring-zinc-700 overflow-hidden cursor-pointer shadow-sm hover:ring-pink-500/50 transition-all relative"
          style={{ backgroundColor: color }}
          onClick={(e) => e.stopPropagation()}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[9999] rounded-xl bg-[#111] border border-zinc-800 shadow-xl p-3 w-[200px] animate-in fade-in zoom-in-95 duration-200"
          side="left"
          align="start"
          sideOffset={10}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <HexColorPicker color={color} onChange={onChange} style={{ width: '100%', height: '160px' }} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold">#</span>
              <input
                type="text"
                value={color.startsWith('#') ? color.replace('#', '') : color}
                onChange={(e) => onChange(`#${e.target.value}`)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:border-pink-500/50 outline-none uppercase"
              />
            </div>
          </div>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// --- GROUPS DEFINITION ---

type SettingControl =
  | { type: 'color'; label: string; key: string }
  | { type: 'number'; label: string; key: string; min?: number; max?: number; step?: number }
  | { type: 'slider'; label: string; key: string; min: number; max: number; step: number }
  | { type: 'toggle'; label: string; key: string };

interface SettingGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  controls: SettingControl[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    id: 'global',
    label: 'Global & View',
    icon: Sun,
    controls: [
      { type: 'color', label: 'Background', key: 'global.backgroundColor' },
      { type: 'slider', label: 'Global Scale', key: 'global.scale', min: 0.7, max: 1.1, step: 0.1 },
    ]
  },
  {
    id: 'neck',
    label: 'Neck & Headstock',
    icon: Layers,
    controls: [
      { type: 'color', label: 'Neck Color', key: 'fretboard.neck.color' },
      { type: 'toggle', label: 'Neck Shadow', key: 'fretboard.neck.shadow.enabled' },
      { type: 'color', label: 'Neck Shadow Color', key: 'fretboard.neck.shadow.color' },

      { type: 'color', label: 'Headstock Color', key: 'head.color' },
      { type: 'color', label: 'Head Border', key: 'head.border.color' },
      { type: 'toggle', label: 'Head Shadow', key: 'head.shadow.enabled' },
      { type: 'color', label: 'Head Shadow Color', key: 'head.shadow.color' },
    ]
  },
  {
    id: 'inlays',
    label: 'Inlays (Markers)',
    icon: Music,
    controls: [
      { type: 'color', label: 'Inlays Color', key: 'fretboard.board.inlays.color' },
      { type: 'slider', label: 'Opacity', key: 'fretboard.board.inlays.opacity', min: 0, max: 1, step: 0.1 },
      { type: 'toggle', label: 'Inlays Shadow', key: 'fretboard.board.inlays.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fretboard.board.inlays.shadow.color' },
    ]
  },
  {
    id: 'strings_frets',
    label: 'Strings & Frets',
    icon: Grid,
    controls: [
      { type: 'color', label: 'Strings Color', key: 'fretboard.strings.color' },
      { type: 'toggle', label: 'String Shadow', key: 'fretboard.strings.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fretboard.strings.shadow.color' },

      { type: 'color', label: 'Frets Color', key: 'fretboard.frets.color' },
      { type: 'toggle', label: 'Frets Shadow', key: 'fretboard.frets.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fretboard.frets.shadow.color' },
    ]
  },
  {
    id: 'fingers',
    label: 'Fingers',
    icon: Target,
    controls: [
      { type: 'color', label: 'Fill Color', key: 'fingers.color' },
      { type: 'color', label: 'Text Color', key: 'fingers.textColor' },
      { type: 'color', label: 'Border Color', key: 'fingers.border.color' },
      { type: 'slider', label: 'BG Opacity', key: 'fingers.opacity', min: 0, max: 1, step: 0.1 },
      { type: 'toggle', label: 'Body Shadow', key: 'fingers.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fingers.shadow.color' },
    ]
  },
  {
    id: 'labels',
    label: 'Labels & Capo',
    icon: Type,
    controls: [
      { type: 'color', label: 'Chord Name', key: 'chordName.color' },
      { type: 'slider', label: 'Name Opacity', key: 'chordName.opacity', min: 0, max: 1, step: 0.1 },

      { type: 'color', label: 'Capo Color', key: 'capo.color' },
      { type: 'color', label: 'Capo Text', key: 'capo.textColors.name' },
      { type: 'toggle', label: 'Capo Shadow', key: 'capo.shadow.enabled' },
    ]
  }
];

// --- MAIN COMPONENT ---

export function SettingsPanel({ isMobile, isOpen, onClose, colors: propsColors, onColorChange, numFrets }: SettingsPanelProps) {
  const { setColors: contextSetColors, colors: contextColors, animationType, setAnimationType } = useAppContext();

  // Use props if available (from FretboardPlayer with history), otherwise fallback to context
  const colors = propsColors || contextColors;
  const setColors = onColorChange || contextSetColors;

  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'motion'>('basic');
  const [expandedKey, setExpandedKey] = useState<string | null>('fretboard');

  const handleColorChange = (key: string, value: any) => {
    setColors(prev => {
      const deepUpdate = (obj: any, path: string[], val: any): any => {
        if (path.length === 0) return val;
        const [head, ...tail] = path;
        const safeObj = obj || {};
        return {
          ...safeObj,
          [head]: tail.length === 0 ? val : deepUpdate(safeObj[head] || {}, tail, val)
        };
      };
      return deepUpdate(prev, key.split('.'), value);
    });
  };

  const handleReset = () => {
    setColors(DEFAULT_COLORS);
    setAnimationType('carousel');
  };

  const toggleExpand = (id: string) => {
    setExpandedKey(prev => prev === id ? null : id);
  };

  // --- TAB RENDERERS ---

  const renderBasicTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(STUDIO_PRESETS).map(([key, preset]) => (
          <div
            key={key}
            onClick={() => setColors(preset.style)}
            className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 hover:border-pink-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: preset.style.global.backgroundColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.style.fingers.color }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-pink-400 transition-colors uppercase tracking-wider">
                  {preset.label}
                </h3>
                <p className="text-[9px] text-zinc-500">Click to apply preset</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-3">
      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Components</p>

      {SETTING_GROUPS.map((group) => {
        const isExpanded = expandedKey === group.id;
        const Icon = group.icon;

        return (
          <div
            key={group.id}
            className={`flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-zinc-900/60 border-pink-500/30' : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800/40'}`}
          >
            <div
              className="flex items-center justify-between p-3 cursor-pointer group"
              onClick={() => toggleExpand(group.id)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="w-3 h-3 text-pink-400" /> : <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />}
                <div className="flex items-center gap-2">
                  <Icon className={`w-3 h-3 ${isExpanded ? 'text-pink-400' : 'text-zinc-500'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isExpanded ? 'text-pink-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {group.label}
                  </span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-3 pb-3 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-zinc-800/30 mt-1 pt-3">
                {group.controls.map(control => {
                  // Resolve deep value
                  const currentValue = control.key.split('.').reduce((obj: any, k) => obj?.[k], colors);

                  if (control.type === 'color') {
                    return (
                      <div key={control.key} className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                        <ColorPicker
                          color={String(currentValue)}
                          onChange={(val) => handleColorChange(control.key, val)}
                        />
                      </div>
                    );
                  }

                  if (control.type === 'slider') {
                    return (
                      <div key={control.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{Math.round((currentValue as number) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={Number(currentValue ?? 0)}
                          onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value) || 0)}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-pink-400 transition-all"
                        />
                      </div>
                    );
                  }

                  if (control.type === 'number') {
                    return (
                      <div key={control.key} className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                        <input
                          type="number"
                          min={control.min}
                          max={control.max}
                          step={control.step || 1}
                          value={Number(currentValue ?? 0)}
                          onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 font-mono focus:border-pink-500/50 outline-none text-right"
                        />
                      </div>
                    );
                  }

                  if (control.type === 'toggle') {
                    return (
                      <div key={control.key} className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                        <button
                          onClick={() => handleColorChange(control.key, !currentValue)}
                          className={`w-8 h-4 rounded-full transition-colors relative ${currentValue ? 'bg-pink-500/20' : 'bg-zinc-800'
                            }`}
                        >
                          <div className={`absolute top-0.5 bottom-0.5 w-3 h-3 rounded-full transition-all duration-300 ${currentValue
                            ? 'left-[18px] bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]'
                            : 'left-0.5 bg-zinc-600'
                            }`} />
                        </button>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="h-px w-full bg-zinc-800/50 my-4" />

      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">View Transform</p>

      {/* Rotation Controls */}
      <div className="space-y-3 p-3 bg-zinc-950/30 rounded-lg border border-zinc-800/50 mb-3">

        {/* Rotation Buttons */}
        <div className="space-y-1">
          <span className="text-[9px] text-zinc-500 font-medium">Rotation</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '0°', val: 0, mirror: false },
              { label: '90°', val: 90, mirror: false },
              { label: '270°', val: 270, mirror: true }
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => {
                  setColors((prev: any) => ({
                    ...prev,
                    global: {
                      ...(prev.global || {}),
                      rotation: opt.val,
                      mirror: opt.mirror
                    }
                  }));
                }}
                className={`py-2 rounded-lg border text-[10px] font-black transition-all ${colors.global?.rotation === opt.val
                    ? 'bg-pink-500/10 border-pink-500/40 text-pink-400 font-bold shadow-[0_0_10px_rgba(236,72,153,0.1)]'
                    : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );

  const renderMotionTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Animation Type</span>
        <div className="grid grid-cols-1 gap-2">
          {numFrets && numFrets <= 24 && (
            <button
              onClick={() => {
                console.log('Set animation to carousel');
                setAnimationType('carousel');
              }}
              className={`p-3 rounded-lg border text-left transition-all ${animationType === 'carousel'
                ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${animationType === 'carousel' ? 'text-pink-400' : 'text-zinc-300'}`}>
                Carousel
              </div>
              <div className="text-[9px] opacity-70">
                Flowing stream of chords sliding across the screen.
              </div>
            </button>
          )}

          {numFrets && numFrets <= 24 && (
            <button
              onClick={() => {
                console.log('Set animation to static-fingers');
                setAnimationType('static-fingers');
              }}
              className={`p-3 rounded-lg border text-left transition-all ${animationType === 'static-fingers'
                ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${animationType === 'static-fingers' ? 'text-pink-400' : 'text-zinc-300'}`}>
                Static Fretboard
              </div>
              <div className="text-[9px] opacity-70">
                Only fingers move. Fretboard remains fixed.
              </div>
            </button>
          )}


        </div>
      </div>

    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'motion', label: 'Motion' }
  ];

  return (
    <GenericSidebar
      title="Customize"
      icon={Palette}
      onReset={handleReset}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id: 'basic' | 'advanced' | 'motion') => setActiveTab(id)}
      isMobile={isMobile}
      isOpen={isOpen}
      onClose={onClose}
    >
      {activeTab === 'basic' && renderBasicTab()}
      {activeTab === 'advanced' && renderAdvancedTab()}
      {activeTab === 'motion' && renderMotionTab()}
    </GenericSidebar>
  );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/core/presentation/context/app-context.tsx ---
"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState, useRef, useMemo, useCallback } from "react";
import type { ChordDiagramProps, ChordWithTiming, FretboardTheme } from "@/modules/core/domain/types";
import type { TimelineState } from "@/modules/chords/domain/types";
import { useUndoRedo } from "@/modules/editor/presentation/hooks/use-undo-redo";
import { generateClipId } from "@/modules/chords/application/utils";
import { getChordDisplayData } from "@/modules/core/domain/chord-logic";
import { INSTRUMENTS } from "@/lib/instruments";
import { DEFAULT_COLORS } from "@/modules/editor/presentation/constants";

export interface StudioState {
  selectedChords: ChordWithTiming[];
  timelineState: TimelineState;
  colors: FretboardTheme;
  animationType: AnimationType;
  playbackTransitionsEnabled: boolean;
  playbackBuildEnabled: boolean;
  instrumentId: string;
  tuningIndex: number;
}

// Type alias for backward compatibility
export type ChordDiagramColors = FretboardTheme;

export type AnimationType = "carousel" | "static-fingers" | "dynamic-fingers" | "guitar-fretboard";

interface AppContextType {
  selectedChords: ChordWithTiming[];
  setSelectedChords: Dispatch<SetStateAction<ChordWithTiming[]>>;
  timelineState: TimelineState;
  setTimelineState: Dispatch<SetStateAction<TimelineState>>;
  colors: ChordDiagramColors;
  setColors: Dispatch<SetStateAction<ChordDiagramColors>>;
  animationType: AnimationType;
  setAnimationType: Dispatch<SetStateAction<AnimationType>>;

  playbackTransitionsEnabled: boolean;
  setPlaybackTransitionsEnabled: Dispatch<SetStateAction<boolean>>;
  playbackBuildEnabled: boolean;
  setPlaybackBuildEnabled: Dispatch<SetStateAction<boolean>>;

  playbackIsPlaying: boolean;
  setPlaybackIsPlaying: Dispatch<SetStateAction<boolean>>;
  playbackIsPaused: boolean;
  setPlaybackIsPaused: Dispatch<SetStateAction<boolean>>;
  playbackProgress: number; // 0..1
  setPlaybackProgress: Dispatch<SetStateAction<number>>;
  playbackTotalDurationMs: number;
  setPlaybackTotalDurationMs: Dispatch<SetStateAction<number>>;

  playbackIsScrubbing: boolean;
  setPlaybackIsScrubbing: Dispatch<SetStateAction<boolean>>;
  playbackSeekProgress: number; // 0..1
  playbackSeekNonce: number;
  requestPlaybackSeek: (progress: number) => void;

  isRendering: boolean;
  setIsRendering: Dispatch<SetStateAction<boolean>>;
  renderProgress: number; // 0..100
  setRenderProgress: Dispatch<SetStateAction<number>>;
  renderCancelRequested: boolean;
  setRenderCancelRequested: Dispatch<SetStateAction<boolean>>;

  minClipDurationMs: number;

  audioRefs: React.MutableRefObject<Record<string, HTMLAudioElement | null>>;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  addChordToTimeline: (chordData: ChordDiagramProps) => void;

  instrumentId: string;
  setInstrumentId: (id: string) => void;
  tuningIndex: number;
  setTuningIndex: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_TIMELINE_STATE: TimelineState = {
  tracks: [
    {
      id: "chords-track",
      name: "Acordes",
      type: 'chord',
      clips: []
    }
  ],
  totalDuration: 10000, // 10s default
  zoom: 100 // 100px por segundo
};


export function AppProvider({ children }: { children: React.ReactNode }) {

  // 1. Unified Undo/Redo State
  const initialStudioState = useMemo<StudioState>(() => ({
    selectedChords: [],
    timelineState: INITIAL_TIMELINE_STATE,
    colors: DEFAULT_COLORS,
    animationType: "carousel",
    playbackTransitionsEnabled: true,
    playbackBuildEnabled: false,
    instrumentId: "violao",
    tuningIndex: 0
  }), []);

  const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<StudioState>(initialStudioState);

  const {
    selectedChords,
    timelineState,
    colors,
    animationType,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    instrumentId,
    tuningIndex
  } = state;

  // 3. Ephemeral State (No Undo) - MOVED UP
  const [playbackIsPlaying, setPlaybackIsPlaying] = useState(false);
  const [playbackIsPaused, setPlaybackIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackTotalDurationMs, setPlaybackTotalDurationMs] = useState(0);
  const [playbackIsScrubbing, setPlaybackIsScrubbing] = useState(false);
  const [playbackSeekProgress, setPlaybackSeekProgress] = useState(0);
  const [playbackSeekNonce, setPlaybackSeekNonce] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderCancelRequested, setRenderCancelRequested] = useState(false);

  const minClipDurationMs = 200;

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // 2. Compatibility Setters & Handlers
  const setSelectedChords = (action: SetStateAction<ChordWithTiming[]>) => {
    setState(prev => ({
      ...prev,
      selectedChords: typeof action === "function" ? (action as Function)(prev.selectedChords) : action
    }));
  };

  const setTimelineState = (action: SetStateAction<TimelineState>) => {
    setState(prev => ({
      ...prev,
      timelineState: typeof action === "function" ? (action as Function)(prev.timelineState) : action
    }));
  };

  const setColors = (action: SetStateAction<ChordDiagramColors>) => {
    setState(prev => ({
      ...prev,
      colors: typeof action === "function" ? (action as Function)(prev.colors) : action
    }));
  };

  const setAnimationType = (action: SetStateAction<AnimationType>) => {
    setState(prev => ({
      ...prev,
      animationType: typeof action === "function" ? (action as Function)(prev.animationType) : action
    }));
  };

  const setPlaybackTransitionsEnabled = (action: SetStateAction<boolean>) => {
    setState(prev => ({
      ...prev,
      playbackTransitionsEnabled: typeof action === "function" ? (action as Function)(prev.playbackTransitionsEnabled) : action
    }));
  };

  const setPlaybackBuildEnabled = (action: SetStateAction<boolean>) => {
    setState(prev => ({
      ...prev,
      playbackBuildEnabled: typeof action === "function" ? (action as Function)(prev.playbackBuildEnabled) : action
    }));
  };

  const setInstrumentId = useCallback((id: string) => {
    setState(prev => ({ ...prev, instrumentId: id, tuningIndex: 0 }));
  }, [setState]);

  const setTuningIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, tuningIndex: index }));
  }, [setState]);

  const addChordToTimeline = useCallback((chordData: ChordDiagramProps) => {
    console.log('[AppProvider] addChordToTimeline called', chordData);
    setState((prev) => {
      const selectedInst = INSTRUMENTS.find(i => i.id === prev.instrumentId) || INSTRUMENTS[0];
      const stringNames = selectedInst.tunings[prev.tuningIndex];

      const optimizedChordData = {
        ...chordData,
        stringNames
      };

      const newChordWithTiming: ChordWithTiming = {
        chord: optimizedChordData,
        duration: 2000,
        finalChord: optimizedChordData,
        transportDisplay: 0
      };

      // 1. Update selectedChords
      const newSelectedChords = [...prev.selectedChords, newChordWithTiming];

      // 2. Update TimelineState
      const chordTrackIndex = prev.timelineState.tracks.findIndex(t => t.type === 'chord');
      if (chordTrackIndex === -1) return prev;

      const chordTrack = prev.timelineState.tracks[chordTrackIndex];
      const lastClip = chordTrack.clips[chordTrack.clips.length - 1];
      const newStart = lastClip ? lastClip.start + lastClip.duration : 0;
      const duration = Math.max(newChordWithTiming.duration || 2000, minClipDurationMs);
      const { finalChord, transportDisplay } = getChordDisplayData(chordData);

      const newClip = {
        id: generateClipId(),
        type: 'chord' as const,
        chord: optimizedChordData,
        finalChord,
        transportDisplay,
        start: newStart,
        duration
      };

      const newClips = [...chordTrack.clips, newClip];
      const newTracks = [...prev.timelineState.tracks];
      newTracks[chordTrackIndex] = { ...chordTrack, clips: newClips };

      const totalNeeded = newClips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0);
      const totalDuration = Math.max(1000, playbackTotalDurationMs || 10000, totalNeeded);

      return {
        ...prev,
        selectedChords: newSelectedChords,
        timelineState: {
          ...prev.timelineState,
          tracks: newTracks,
          totalDuration
        }
      };
    });
  }, [setState, minClipDurationMs, playbackTotalDurationMs]);

  const requestPlaybackSeek = (progress: number) => {
    setPlaybackSeekProgress(progress);
    setPlaybackSeekNonce((n) => n + 1);
  };

  const value: AppContextType = useMemo(() => ({
    selectedChords,
    setSelectedChords,
    timelineState,
    setTimelineState,
    colors,
    setColors,
    animationType,
    setAnimationType,

    playbackTransitionsEnabled,
    setPlaybackTransitionsEnabled,
    playbackBuildEnabled,
    setPlaybackBuildEnabled,

    playbackIsPlaying,
    setPlaybackIsPlaying,
    playbackIsPaused,
    setPlaybackIsPaused,
    playbackProgress,
    setPlaybackProgress,
    playbackTotalDurationMs,
    setPlaybackTotalDurationMs,

    playbackIsScrubbing,
    setPlaybackIsScrubbing,
    playbackSeekProgress,
    playbackSeekNonce,
    requestPlaybackSeek,

    isRendering,
    setIsRendering,
    renderProgress,
    setRenderProgress,
    renderCancelRequested,
    setRenderCancelRequested,

    minClipDurationMs,

    audioRefs,

    undo,
    redo,
    canUndo,
    addChordToTimeline,
    instrumentId: state.instrumentId,
    setInstrumentId,
    tuningIndex: state.tuningIndex,
    setTuningIndex,
  }), [
    selectedChords,
    timelineState,
    colors,
    animationType,
    playbackTransitionsEnabled,
    playbackBuildEnabled,
    playbackIsPlaying,
    playbackIsPaused,
    playbackProgress,
    playbackTotalDurationMs,
    playbackIsScrubbing,
    playbackSeekProgress,
    playbackSeekNonce,
    isRendering,
    renderProgress,
    renderCancelRequested,
    undo,
    redo,
    canUndo,
    canRedo,
    minClipDurationMs,
    addChordToTimeline
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/views/StudioView.tsx ---
"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Sidebar from "@/modules/chords/presentation/components/Sidebar";
import StudioTimeline from "@/modules/timeline/presentation/components/StudioTimeline";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { FretboardStage, FretboardStageRef } from "@/modules/chords/presentation/components/FretboardStage";
import { SettingsPanel } from "@/modules/chords/presentation/components/SettingsPanel";
import { AppHeader } from "@/modules/chords/presentation/components/app-header";
import { StageContainer } from "@/shared/components/layout/StageContainer";
import { WorkspaceLayout } from "@/shared/components/layout/WorkspaceLayout";
import { EditorGrid } from "@/shared/components/layout/EditorGrid";
import { MobileNav, NavItem } from "@/shared/components/layout/MobileNav";
import { RenderingProgressCard } from "@/modules/chords/presentation/components/rendering-progress-card";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { Library, Settings, Guitar } from "lucide-react";
import { TimelineControls } from "@/modules/timeline/presentation/components/TimelineControls";
import { useStudioChordsEditor } from "@/modules/editor/presentation/hooks/use-studio-chords-editor";
import { useTimelineSync } from "@/modules/timeline/presentation/hooks/use-timeline-sync";
import { RenderDialog, RenderFormat, RenderQuality } from "@/modules/chords/presentation/components/RenderDialog";

export function StudioView() {
    const {
        measures,
        settings,
        selectedNoteIds,
        editingNoteId,
        currentMeasureIndex,
        selectedMeasureId,
        activeDuration,
        activePositionIndex,
        editingNote,
        currentPitch,
        activeMeasure,
        setMeasures,
        setSettings,
        setActiveDuration,
        setActivePanel,
        setEditingNoteId,
        setActivePositionIndex,
        handleSelectMeasure,
        handleSelectNote,
        handleAddNote,
        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,
        handleNoteRhythmChange,
        handleRemoveNote,
        handleCopyNote,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleToggleBarre,
        handleToggleBarreTo,
        handleSetFingerForString,
        handleSetFretForString,
        handleSetStringForPosition,
        handleSelectStringAndAddIfMissing,
        handleToggleCollapse,
        handleReorderMeasures,
        handleReorderNotes,
        handleCopyMeasure,
        handlePasteMeasure,
        handleTransposeMeasure,
        handleTransposeAll,
        updateSelectedNotes,
        undo,
        redo,
        canUndo,
        canRedo,
        theme,
        setTheme
    } = useStudioChordsEditor();

    const {
        playbackTransitionsEnabled,
        playbackBuildEnabled,
        setAnimationType,
        isRendering,
        setIsRendering,
        setRenderProgress,
        renderCancelRequested,
        setRenderCancelRequested,
        playbackTotalDurationMs,
        animationType,
        playbackProgress,
        playbackIsPlaying,
        renderProgress,
        requestPlaybackSeek
    } = useAppContext();

    // Studio specific defaults
    useEffect(() => {
        setSettings(prev => ({ ...prev, numFrets: 5 }));
        if (animationType !== 'static-fingers' && animationType !== 'carousel') {
            setAnimationType('static-fingers');
        }
    }, [setSettings, setAnimationType]);

    const videoCanvasRef = useRef<FretboardStageRef>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderDialogOpen, setRenderDialogOpen] = useState(false);

    const handleAnimationStateChange = useCallback((animating: boolean, paused: boolean) => {
        setIsAnimating(animating);
        setIsPaused(paused);
    }, []);

    const [activePanel, setLocalActivePanel] = useState<'studio' | 'library' | 'mixer' | 'customize'>('studio');
    const isMobile = useIsMobile();

    const {
        chords,
        activeChordIndex,
        totalDurationMs,
        currentCursorMs
    } = useTimelineSync({
        measures,
        settings,
        activeMeasure,
        currentMeasureIndex,
        editingNoteId,
        selectedNoteIds,
        playbackIsPlaying,
        playbackProgress,
        playbackTotalDurationMs
    });

    const handleSeek = (ms: number) => {
        if (totalDurationMs > 0) {
            requestPlaybackSeek(ms / totalDurationMs);
        }
    };

    useEffect(() => {
        if (renderCancelRequested) {
            if (videoCanvasRef.current) videoCanvasRef.current.cancelRender();
            setIsRendering(false);
            setRenderProgress(0);
            setRenderCancelRequested(false);
        }
    }, [renderCancelRequested, setIsRendering, setRenderProgress, setRenderCancelRequested]);

    const handleAnimate = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.startAnimation();
            setIsAnimating(true);
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.pauseAnimation();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.resumeAnimation();
            setIsPaused(false);
        }
    };

    const handleResetPlayback = () => {
        if (videoCanvasRef.current) videoCanvasRef.current.cancelRender();
    };

    const handleRenderVideo = async () => {
        // Open the render dialog instead of directly rendering
        setRenderDialogOpen(true);
    };

    const handleRenderWithOptions = async (format: RenderFormat, quality: RenderQuality) => {
        if (videoCanvasRef.current) {
            setIsRendering(true);
            setRenderProgress(0);
            try {
                await videoCanvasRef.current.handleRender(format, quality);
                if (!renderCancelRequested) setRenderProgress(100);
            } catch (error) {
                console.error("Error rendering:", error);
                setRenderProgress(0);
            } finally {
                if (!renderCancelRequested) {
                    setTimeout(() => { setIsRendering(false); setRenderProgress(0); }, 2000);
                } else {
                    setIsRendering(false);
                    setRenderProgress(0);
                    setRenderCancelRequested(false);
                }
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                if (isAnimating) {
                    if (isPaused) handleResume();
                    else handlePause();
                } else {
                    handleAnimate();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAnimating, isPaused]);

    const floatingControls = (
        <TimelineControls
            isAnimating={isAnimating}
            isPaused={isPaused}
            ffmpegLoaded={true}
            handleAnimate={handleAnimate}
            handlePause={handlePause}
            handleResume={handleResume}
            handleRenderVideo={handleRenderVideo}
            isTimelineEmpty={measures.length === 0}
            onAudioUpload={() => { }}
            audioUploaded={false}
            onResetPlayback={handleResetPlayback}
        />
    );

    const navItems: NavItem[] = [
        { id: "studio", icon: Guitar, label: "Fretboard" },
        { id: "library", icon: Library, label: "Library" },
        { id: "customize", icon: Settings, label: "Settings" }
    ];

    const visualEditorProps = {
        measures,
        selectedNoteIds,
        timeSignature: settings.time,
        activeDuration: activeDuration,
        hasClipboard: false,
        onSelectNote: handleSelectNote,
        onDoubleClickNote: (id: string) => setEditingNoteId(id),
        onAddNote: handleAddNote,
        onRemoveNote: handleRemoveNote,
        onCopyNote: handleCopyNote,
        onRemoveMeasure: handleRemoveMeasure,
        onAddMeasure: handleAddMeasure,
        onUpdateMeasure: handleUpdateMeasure,
        onToggleCollapse: handleToggleCollapse,
        onCopyMeasure: handleCopyMeasure,
        onPasteMeasure: handlePasteMeasure,
        onReorderMeasures: handleReorderMeasures,
        onReorderNotes: handleReorderNotes,
        onSelectMeasure: handleSelectMeasure,
        onDeselectAll: () => handleSelectMeasure(''),
        selectedMeasureId: selectedMeasureId,
        onUpdateNote: (id: string, updates: any) => updateSelectedNotes(updates),
        totalDurationMs: totalDurationMs,
        currentCursorMs: currentCursorMs,
        bpm: settings.bpm,
        onSeek: handleSeek
    };

    const activeAnimationType = (settings.numFrets || 5) <= 6 ? (animationType === 'guitar-fretboard' ? 'static-fingers' : animationType) : 'guitar-fretboard';

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<AppHeader
                onImportHistory={async (file) => {
                    try {
                        const { readHistoryFile, historyToFretboard } = await import('@/lib/history-manager');
                        const data = await readHistoryFile(file);
                        if (data.measures) setMeasures(data.measures);
                        else setMeasures(historyToFretboard(data.chords));
                        if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
                        if (data.theme) setTheme(prev => ({ ...prev, ...data.theme }));
                    } catch (e) {
                        console.error("Import failed", e);
                    }
                }}
                onExportHistory={async () => {
                    const { downloadHistory, createFullHistory } = await import('@/lib/history-manager');
                    const history = createFullHistory(measures, settings, theme);
                    downloadHistory(history, 'fretboard-history.json');
                }}
                title="Studio"
            />}
            mobileBottomNav={<MobileNav items={navItems} activePanel={activePanel} onPanelChange={setLocalActivePanel} />}
            leftSidebar={
                <Sidebar
                    isMobile={isMobile}
                    isOpen={activePanel === 'library'}
                    onClose={() => setLocalActivePanel('studio')}
                    simpleMode={true}
                    onInsert={handleInsert}
                    onAddNote={handleAddNote}
                    onUpdateNote={updateSelectedNotes}
                    activeDuration={activeDuration}
                    onSelectDuration={setActiveDuration}
                    editingNote={editingNote}
                    currentPitch={currentPitch}
                    onCloseInspector={() => setEditingNoteId(null)}
                    onNoteRhythmChange={(dur, dot) => { if (editingNoteId) handleNoteRhythmChange(editingNoteId, dur, dot); }}
                    onNoteTypeChange={(type: any) => updateSelectedNotes({ type })}
                    onPitchChange={handlePitchChange}
                    onStringChange={handleStringChange}
                    onAccidentalChange={handleAccidentalChange}
                    onDecoratorChange={handleDecoratorChange}
                    activeMeasure={activeMeasure}
                    onMeasureUpdate={handleUpdateMeasure}
                    onUpdateMeasure={handleUpdateMeasure}
                    onTransposeMeasure={handleTransposeMeasure}
                    onTransposeAll={handleTransposeAll}
                    activePositionIndex={activePositionIndex}
                    onActivePositionIndexChange={setActivePositionIndex}
                    onAddChordNote={handleAddChordNote}
                    onRemoveChordNote={handleRemoveChordNote}
                    onToggleBarre={handleToggleBarre}
                    onToggleBarreTo={handleToggleBarreTo}
                    onSetFingerForPosition={handleSetFingerForString}
                    onSetFretForPosition={handleSetFretForString}
                    onSetStringForPosition={handleSetStringForPosition}
                    globalSettings={settings}
                    onGlobalSettingsChange={(newSettings: any) => setSettings(prev => ({ ...prev, ...newSettings }))}
                    onImportScore={() => { }}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    theme={theme}
                    measures={measures}
                />
            }
            rightSidebar={<SettingsPanel isMobile={isMobile} isOpen={activePanel === 'customize'} onClose={() => setLocalActivePanel('studio')} colors={theme} onColorChange={setTheme as any} numFrets={settings.numFrets || 5} />}
        >
            {isMobile ? (
                <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <StageContainer title="Visualizer">
                                <FretboardStage
                                    ref={videoCanvasRef}
                                    chords={chords}
                                    activeChordIndex={activeChordIndex}
                                    transitionsEnabled={playbackTransitionsEnabled}
                                    buildEnabled={playbackBuildEnabled}
                                    onAnimationStateChange={handleAnimationStateChange}
                                    onRenderProgress={setRenderProgress}
                                    numStrings={settings.numStrings}
                                    numFrets={settings.numFrets}
                                    showChordName={settings.showChordName !== false}
                                    capo={settings.capo}
                                    tuningShift={settings.tuningShift || 0}
                                    stringNames={settings.tuning}
                                    colors={theme}
                                    animationType={activeAnimationType}
                                />
                            </StageContainer>
                        </div>
                        <div className="mb-4 px-2">{floatingControls}</div>
                        <div className="h-64 overflow-hidden border-t border-white/10">
                            <StudioTimeline {...visualEditorProps} />
                        </div>
                    </div>
                </div>
            ) : (
                <EditorGrid
                    topSection={
                        <StageContainer title="Visualizer">
                            <FretboardStage
                                ref={videoCanvasRef}
                                chords={chords}
                                activeChordIndex={activeChordIndex}
                                transitionsEnabled={playbackTransitionsEnabled}
                                buildEnabled={playbackBuildEnabled}
                                onAnimationStateChange={(animating: boolean, paused: boolean) => {
                                    setIsAnimating(animating);
                                    setIsPaused(paused);
                                }}
                                onRenderProgress={setRenderProgress}
                                numStrings={settings.numStrings}
                                numFrets={settings.numFrets}
                                showChordName={settings.showChordName !== false}
                                capo={settings.capo}
                                tuningShift={settings.tuningShift || 0}
                                stringNames={settings.tuning}
                                colors={theme}
                                animationType={activeAnimationType}
                            />
                        </StageContainer>
                    }
                    bottomSection={<StudioTimeline {...visualEditorProps} />}
                    floatingControls={floatingControls}
                />
            )}
            <RenderDialog
                open={renderDialogOpen}
                onOpenChange={setRenderDialogOpen}
                onRender={handleRenderWithOptions}
                isRendering={isRendering}
                renderProgress={renderProgress}
            />
            <RenderingProgressCard />

        </WorkspaceLayout>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/app/page.tsx ---
import Link from "next/link";
import { Music } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            TabTune
          </h1>
          <p className="text-xl text-neutral-400">
            Escolha seu modo de criação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chord Studio Card */}
          <Link href="/chords" className="group">
            <div className="h-80 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-900/80 hover:scale-[1.02] hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Music className="w-12 h-12 text-blue-500" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Animação de Acordes</h2>
                <p className="text-neutral-500 group-hover:text-neutral-400">
                  Crie vídeos animados de diagramas de acordes e sequências.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <footer className="text-center text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} TabTune Studio
        </footer>
      </div>
    </div>
  );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/app/(app)/chords/page.tsx ---
import Link from 'next/link';
import { Camera, Music } from 'lucide-react';

export default function ChordsLandingPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center">
            <h1 className="text-4xl font-black mb-12 tracking-tighter">CHOOSE YOUR EXPERIENCE</h1>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Studio Mode */}
                <Link href="/chords/studio" className="group">
                    <div className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-800 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Music className="w-16 h-16 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-black uppercase italic">Studio Mode</h2>
                        <p className="text-zinc-400 text-sm max-w-[200px]">Vertical chord diagrams focused on notation and short-neck visualization.</p>
                    </div>
                </Link>

                {/* Cinematic Mode */}
                {/* Cinematic Mode - COMING SOON (Hidden for now as it's empty) */}
                {/* 
                <Link href="/chords/cinematic" className="group">
                    <div className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-pink-500/50 hover:bg-zinc-800 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Camera className="w-16 h-16 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-black uppercase italic">Cinematic Mode</h2>
                        <p className="text-zinc-400 text-sm max-w-[200px]">Horizontal full-neck guitar visualizer for high-quality video exports.</p>
                    </div>
                </Link> 
                */}
            </div>
        </div>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/app/(app)/chords/studio/page.tsx ---
"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { StudioView } from '@/modules/chords/presentation/views/StudioView';

export default function StudioPage() {
    return (
        <AppProvider>
            <StudioView />
        </AppProvider>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/app/layout.tsx ---
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'TabTune Animator',
  description: 'Generated by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6346152303245774"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta name="google-adsense-account" content="ca-pub-6346152303245774"></meta>
      </head>
      <body className="font-body antialiased bg-background">

        <div>
          {children}

        </div>
      </body>
    </html>
  );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/app-header.tsx ---
"use client";

import { Music, Settings, Menu, Upload, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onImportHistory?: (file: File) => void;
  onExportHistory?: () => void;
  title?: string;
}

export function AppHeader({ onMenuClick, onSettingsClick, onImportHistory, onExportHistory, title }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-zinc-950/40 backdrop-blur-md border-b border-zinc-800/50 shrink-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          <Music className="text-pink-400" size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-[0.2em] text-zinc-100 uppercase leading-tight">TabTune</h1>
          {title && <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest leading-tight">{title}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onImportHistory && (
          <>
            <input
              type="file"
              id="import-history"
              className="hidden"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImportHistory(file);
                  e.target.value = ''; // Reset to allow importing the same file again
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('import-history')?.click()}
              className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
              title="Importar"
            >
              <Upload size={18} />
            </Button>
          </>
        )}

        {onExportHistory && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExportHistory}
            className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
            title="Exportar"
          >
            <Download size={18} />
          </Button>
        )}

        {onSettingsClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          >
            <Settings size={18} />
          </Button>
        )}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          >
            <Menu size={18} />
          </Button>
        )}
      </div>
    </header>
  );
}



--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/RenderDialog.tsx ---
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Video, FileVideo, FileJson, Loader2 } from "lucide-react";

export type RenderFormat = 'mp4' | 'webm' | 'json';
export type RenderQuality = 'low' | 'medium' | 'high' | 'ultra';

interface RenderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRender: (format: RenderFormat, quality: RenderQuality) => void;
    isRendering?: boolean;
    renderProgress?: number;
    renderStatus?: string;
}

export function RenderDialog({
    open,
    onOpenChange,
    onRender,
    isRendering = false,
    renderProgress = 0,
    renderStatus,
}: RenderDialogProps) {
    const [format, setFormat] = useState<RenderFormat>('mp4');
    const [quality, setQuality] = useState<RenderQuality>('medium');

    const handleRender = () => {
        onRender(format, quality);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-cyan-500" />
                        Renderizar Animação
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Escolha o formato e a qualidade para exportar sua animação de acordes.
                    </DialogDescription>
                </DialogHeader>

                {isRendering ? (
                    <div className="py-8 space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                            <div className="w-full max-w-xs">
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                                        style={{ width: `${renderProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-zinc-400 mt-2 text-center">
                                    {renderStatus || `Renderizando... ${Math.round(renderProgress)}%`}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Format Selection */}
                        <div className="space-y-3">
                            <Label className="text-white font-medium">Formato de Saída</Label>
                            <RadioGroup value={format} onValueChange={(v) => setFormat(v as RenderFormat)}>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <RadioGroupItem value="mp4" id="mp4" />
                                    <Label htmlFor="mp4" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <FileVideo className="w-4 h-4 text-cyan-500" />
                                        <div>
                                            <p className="text-white font-medium">MP4</p>
                                            <p className="text-xs text-zinc-500">Compatível com todos os players (recomendado)</p>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <RadioGroupItem value="webm" id="webm" />
                                    <Label htmlFor="webm" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <FileVideo className="w-4 h-4 text-indigo-500" />
                                        <div>
                                            <p className="text-white font-medium">WebM</p>
                                            <p className="text-xs text-zinc-500">Renderização rápida, menor tamanho</p>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <RadioGroupItem value="json" id="json" />
                                    <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <FileJson className="w-4 h-4 text-purple-500" />
                                        <div>
                                            <p className="text-white font-medium">JSON</p>
                                            <p className="text-xs text-zinc-500">Dados da animação para integração</p>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Quality Selection (only for video formats) */}
                        {(format === 'mp4' || format === 'webm') && (
                            <div className="space-y-3">
                                <Label className="text-white font-medium">Qualidade</Label>
                                <Select value={quality} onValueChange={(v) => setQuality(v as RenderQuality)}>
                                    <SelectTrigger className="bg-zinc-800 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-white/10">
                                        <SelectItem value="low" className="text-white hover:bg-white/5">
                                            Baixa (800x340, rápido)
                                        </SelectItem>
                                        <SelectItem value="medium" className="text-white hover:bg-white/5">
                                            Média (1200x510, balanceado)
                                        </SelectItem>
                                        <SelectItem value="high" className="text-white hover:bg-white/5">
                                            Alta (1920x816, 1080p)
                                        </SelectItem>
                                        <SelectItem value="ultra" className="text-white hover:bg-white/5">
                                            Ultra (3840x1632, 4K sem perdas)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-zinc-500">
                                    Qualidades maiores resultam em arquivos maiores e tempo de renderização mais longo.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {!isRendering && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="bg-transparent border-white/10 text-white hover:bg-white/5"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleRender}
                                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Renderizar
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/rendering-progress-card.tsx ---
"use client";

import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function RenderingProgressCard() {
  const { isRendering, renderProgress, setRenderCancelRequested } = useAppContext();

  if (!isRendering) {
    return null;
  }

  const isComplete = renderProgress >= 100;

  const handleCancel = () => {
    setRenderCancelRequested(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isComplete ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Renderização Concluída
              </>
            ) : (
              "Renderizando Vídeo..."
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {isComplete
              ? "Seu vídeo foi renderizado com sucesso!"
              : "Aguarde, isso pode levar alguns minutos."}
          </p>
          <Progress value={renderProgress} className="w-full" />
          {!isComplete && (
            <p className="text-right text-sm font-bold mt-1">{Math.round(renderProgress)}%</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!isComplete && (
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/chords/presentation/components/VexFlowRhythmIcon.tsx ---
import React, { useEffect, useRef } from 'react';
import { Renderer, StaveNote, Formatter, Stave, Voice } from 'vexflow';

interface VexFlowIconProps {
    duration: string;
    type?: 'note' | 'rest';
    className?: string; // Allow external sizing via CSS
    fillColor?: string;
}

export const VexFlowRhythmIcon: React.FC<VexFlowIconProps> = ({
    duration,
    type = 'note',
    className = "w-10 h-14", // Default size class
    fillColor = '#ffffff'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Internal rendering dimensions (VexFlow units)
        const VIEWBOX_WIDTH = 70;
        const VIEWBOX_HEIGHT = 100;

        // Create Renderer
        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        renderer.resize(VIEWBOX_WIDTH, VIEWBOX_HEIGHT);

        const context = renderer.getContext();

        // Clear and prepare context
        context.setFillStyle(fillColor);
        context.setStrokeStyle(fillColor);

        // Map duration to VexFlow format
        const vfDuration = duration;

        const noteStruct = {
            keys: ['b/4'], // Center line
            duration: vfDuration + (type === 'rest' ? 'r' : ''),
            align_center: true,
            clef: 'treble'
        };

        try {
            const note = new StaveNote(noteStruct);

            // Apply styles
            note.setStyle({ fillStyle: fillColor, strokeStyle: fillColor });
            if (note.getStem()) {
                note.getStem()!.setStyle({ fillStyle: fillColor, strokeStyle: fillColor });
            }

            // Create a stave but don't draw it - just use it for relative positioning
            const stave = new Stave(0, 0, VIEWBOX_WIDTH);

            // Adjust stave Y to center note head at VIEWBOX_HEIGHT / 2
            // b/4 is on the middle stave line. The stave height is 40 units (5 lines * 10).
            // Middle is at stave.getY() + 20.
            const staveY = (VIEWBOX_HEIGHT / 2) - 50;
            stave.setY(staveY);

            // Format - centered
            const voice = new Voice({ numBeats: 1, beatValue: 4 });
            voice.setStrict(false);
            voice.addTickables([note]);

            // Center the note head horizontally
            new Formatter().joinVoices([voice]).format([voice], VIEWBOX_WIDTH);

            note.setStave(stave);
            note.setContext(context).draw();

            // Force SVG to be responsive and CLEAN
            const svg = containerRef.current.querySelector('svg');
            if (svg) {
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svg.setAttribute('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`);

                // Hide any paths that look like stave lines if they were accidentally drawn
                // (though stave.draw() is not called, some versions draw some lines)
                const paths = svg.querySelectorAll('path');
                paths.forEach(p => {
                    const d = p.getAttribute('d');
                    // VexFlow stave lines are usually straight horizontal paths
                    // We can't easily detect them, but since stave.draw() isn't called,
                    // we should be fine. If lines still appear, we might need more aggressive filtering.
                });
            }

        } catch (e) {
            console.error("VexFlowIcon Render Error:", e);
        }

    }, [duration, type, fillColor]);

    return <div ref={containerRef} className={`flex items-center justify-center ${className}`} />;
};


--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/editor/presentation/constants.tsx ---
import React from 'react';
import { ScoreStyle } from '@/modules/editor/domain/types';
import { ChordDiagramColors } from '@/modules/core/presentation/context/app-context';


export const DEFAULT_COLORS: ChordDiagramColors = {
    global: {
        backgroundColor: "#000000",
        primaryTextColor: "#FF8C42",
        scale: 1.0,
        rotation: 0,
        mirror: false,
    },
    fretboard: {
        neck: {
            color: "#303135",
            opacity: 1,
            shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 5 }
        },
        frets: {
            color: "#000000",
            shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 3 }
        },
        strings: {
            color: "#FFFFFF",
            thickness: 3,
            shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 3 }
        },
        board: {
            inlays: {
                color: "rgba(0, 0, 0, 0.35)",
                shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 3 }
            },
        },
    },
    fingers: {
        color: "#200f0f",
        textColor: "#ffffff",
        border: {
            color: "#FFFFFF",
            width: 4,
        },
        opacity: 0.9,
        shadow: { enabled: true, color: "rgba(0,0,0,0.6)", blur: 8 },
        radius: 22,
        fontSize: 16,
        barreWidth: 48,
        barreFingerRadius: 22
    },
    chordName: {
        color: "#ffffff",
        textColor: "#ffffff",
        opacity: 1,
        shadow: {
            color: "rgba(0,0,0,0.5)",
            blur: 5,
            enabled: true
        },
        stroke: {
            color: "#000000",
            width: 0,
        },
        fontSize: 35,
        extSize: 24
    },
    capo: {
        color: "rgba(100, 100, 110, 0.9)",
        border: {
            color: "rgba(0, 0, 0, 0.3)",
            width: 1, // Added default width
        },
        textColors: {
            name: "#ffffff",
            number: "#FF8C42",
        },
        shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 5 }
    },
    avoid: {
        color: "#ffffff",
        lineWidth: 6,
        size: 15,
        opacity: 0.9,
        border: {
            color: "#000000",
            width: 2
        }
    },
    head: {
        color: "#3a3a3e",
        textColors: {
            name: "#FF8C42",
        },
        border: {
            color: "#3a3a3e",
            width: 0
        },
        shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 5 }
    },
};

export const STUDIO_PRESETS = {
    default: {
        label: 'Default Dark',
        style: DEFAULT_COLORS
    },
    classic: {
        label: 'Classic Light',
        style: {
            ...DEFAULT_COLORS,
            global: {
                ...DEFAULT_COLORS.global,
                primaryTextColor: "#1a1a1a",
                backgroundColor: "#f8f9fa",
            },
            fretboard: {
                neck: {
                    color: "#ffffff",
                    opacity: 1,
                    shadow: { enabled: true, color: "rgba(0,0,0,0.05)", blur: 10 }
                },
                frets: { color: "#d1d5db" },
                strings: { color: "#4b5563", thickness: 2.5 }
            },
            chordName: {
                color: "#1a1a1a",
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 38,
                extSize: 26,
                shadow: { enabled: false, color: "rgba(0,0,0,0.1)", blur: 4 }
            },

            fingers: {
                color: "#1e293b",
                textColor: "#ffffff",
                border: {
                    color: "#334155",
                    width: 2,
                },
                opacity: 1,
                radius: 24,
                fontSize: 18,
                barreWidth: 52,
                barreFingerRadius: 24,
                shadow: { enabled: true, color: "rgba(0,0,0,0.15)", blur: 6 }
            },
            capo: {
                color: "#475569",
                border: { color: "#1e293b", width: 1 },
                textColors: { name: "#ffffff", number: "#94a3b8" }
            },
            head: {
                color: "#f1f5f9",
                textColors: { name: "#1a1a1a" },
                border: { color: "#e2e8f0", width: 1 }
            },
            avoid: {
                color: "#ef4444",
                lineWidth: 5,
                size: 14,
                opacity: 0.9,
                border: { color: "#ffffff", width: 2 }
            }
        }
    },
    cyberpunk: {
        label: 'Cyberpunk',
        style: {
            ...DEFAULT_COLORS,
            global: { ...DEFAULT_COLORS.global, primaryTextColor: "#ffffffff" },
            fretboard: {
                neck: {
                    color: "#2d0036",
                    opacity: 1
                },
                frets: { color: "#fb00ff50" },
                strings: { color: "#fb00ff", thickness: 3 }
            },
            chordName: {
                color: "#fb00ff",
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 35,
                extSize: 24,
                shadow: { enabled: true, color: "rgba(251,0,255,0.5)", blur: 10 }
            },
            fingers: {
                color: "#fb00ff50",
                textColor: "#fffdfdff",
                border: { color: "#fb00ff", width: 4 },
                opacity: 0.9,
                radius: 22,
                fontSize: 16,
                barreWidth: 48,
                barreFingerRadius: 22
            },
            capo: {
                color: "#180220",
                border: { color: "#fb00ff", width: 1 },
                textColors: { name: "#00ff9d", number: "#00ff9d" }
            },
            head: {
                color: "#180220",
                textColors: { name: "#fb00ff" },
                border: { color: "#fb00ff", width: 2 },
                shadow: { enabled: true, color: "#fb00ff", blur: 10 }
            },
            avoid: {
                color: "#fb00ff",
                lineWidth: 6,
                size: 15,
                opacity: 0.9,
                border: { color: "#000000", width: 2 }
            }
        }
    },
    midnight: {
        label: 'Midnight Blue',
        style: {
            ...DEFAULT_COLORS,
            global: { ...DEFAULT_COLORS.global, primaryTextColor: "#ffffffff" },
            fretboard: {
                neck: {
                    color: "#0f172a",
                    opacity: 1
                },
                frets: { color: "#334155" },
                strings: { color: "#94a3b8", thickness: 3 }
            },
            chordName: {
                color: "#60a5fa",
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 35,
                extSize: 24,
                shadow: { enabled: true, color: "rgba(0,0,0,0.5)", blur: 5 }
            },
            fingers: {
                color: "#334155",
                textColor: "#ffffff",
                border: { color: "#60a5fa", width: 4 },
                opacity: 0.9,
                radius: 22,
                fontSize: 16,
                barreWidth: 48,
                barreFingerRadius: 22
            },
            capo: {
                color: "#1e293b",
                border: { color: "#60a5fa", width: 1 },
                textColors: { name: "#d5e0eeff", number: "#a8c6eeff" }
            },
            head: {
                color: "#0f172a",
                textColors: { name: "#60a5fa" },
                border: { color: "#1e293b", width: 1 }
            }
        }
    },
    vintage: {
        label: 'Vintage',
        style: {
            ...DEFAULT_COLORS,
            global: { ...DEFAULT_COLORS.global, primaryTextColor: "#8b4513" },
            fretboard: {
                neck: {
                    color: "#e6dcc8",
                    opacity: 1
                },
                frets: { color: "#a68b6c" },
                strings: { color: "#8b4513", thickness: 3 }
            },
            chordName: {
                color: "#ece5e3ff",
                opacity: 0.9,
                stroke: { color: "transparent", width: 0 },
                fontSize: 35,
                extSize: 24,
                shadow: { enabled: true, color: "rgba(0,0,0,0.2)", blur: 5 }
            },
            fingers: {
                color: "#5c4033",
                textColor: "#efe6d5",
                border: { color: "#3e2723", width: 4 },
                opacity: 0.9,
                radius: 22,
                fontSize: 16,
                barreWidth: 48,
                barreFingerRadius: 22
            },
            capo: {
                color: "#5d4037",
                border: { color: "#3e2723", width: 1 },
                textColors: { name: "#ffffff", number: "#5c4033" }
            },
            head: {
                color: "#d7ccc8",
                textColors: { name: "#5c4033" },
                border: { color: "#a1887f", width: 1 },
                shadow: { enabled: true, color: "#5c403330", blur: 5 }
            }
        }
    }
};


export const DEFAULT_VEXTAB = `options space=20
tabstave notation=true key=A time=4/4
notes :q (5/2.5/3.7/4) 5h6/3 7/4 | 
notes :8 7/4 6/3 5/2 3v/1 :q 7v/5 :8 3s5/5`;

export const Icons = {
    Play: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    ),
    Pause: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
    ),
    Reset: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
    ),
    Magic: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
    ),
    Copy: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    ),
    Paste: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
    ),
    ChevronUp: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
    ),
    ChevronDown: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
    ),
    Grip: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
    ),
    Rest: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8" /><path d="M12 8v8" /><circle cx="12" cy="12" r="10" /></svg>
    ),
    MusicRest: (duration: string) => {
        // Retorna um SVG simplificado representando o tipo de pausa
        return (
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current">
                {duration === 'w' && <rect x="30" y="40" width="40" height="10" />}
                {duration === 'h' && <rect x="30" y="50" width="40" height="10" />}
                {duration === 'q' && <path d="M45,30 L55,40 L45,55 L55,70" stroke="currentColor" strokeWidth="4" fill="none" />}
                {(duration === '8' || duration === '16' || duration === '32') && (
                    <g transform="translate(45,30)">
                        <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="4" />
                        <circle cx="5" cy="5" r="4" />
                        {duration === '16' && <circle cx="5" cy="15" r="4" />}
                        {duration === '32' && <><circle cx="5" cy="15" r="4" /><circle cx="5" cy="25" r="4" /></>}
                    </g>
                )}
            </svg>
        );
    },
    Plus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    ChevronRight: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
    ),
    ChevronLeft: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
    ),
    SkipBack: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20L9 12l10-8v16zM5 19V5" /></svg>
    ),
    Repeat: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
    )
};

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/timeline/presentation/components/StudioTimeline.tsx ---
'use client';

import React, { useState } from 'react';
import { MeasureData, NoteData, Duration } from '@/modules/editor/domain/types';
import { getNoteDurationValue, getMeasureCapacity, getMsFromDuration, getMidiFromPosition, getPitchFromMidi } from '@/modules/editor/domain/music-math';
import { Icons } from '@/modules/editor/presentation/constants';

interface StudioTimelineProps {
    measures: MeasureData[];
    selectedNoteIds: string[];
    timeSignature: string;
    activeDuration: Duration;
    bpm?: number;
    hasClipboard: boolean;
    onSelectNote: (id: string, multi: boolean) => void;
    onDoubleClickNote: (id: string) => void;
    onAddNote: (measureId: string) => void;
    onUpdateNote: (id: string, updates: Partial<NoteData>) => void;
    onRemoveNote?: (id: string) => void;
    onCopyNote?: (id: string) => void;
    onRemoveMeasure: (id: string) => void;
    onAddMeasure: () => void;
    onUpdateMeasure: (id: string, updates: Partial<MeasureData>) => void;
    onToggleCollapse: (id: string) => void;
    onCopyMeasure: (id: string) => void;
    onPasteMeasure: (id: string) => void;
    onReorderMeasures: (from: number, to: number) => void;
    onReorderNotes: (measureId: string, from: number, to: number) => void;
    onSelectMeasure: (id: string) => void;
    onDeselectAll: () => void;
    selectedMeasureId: string | null;
    totalDurationMs?: number;
    currentCursorMs?: number;
    onSeek?: (ms: number) => void;
}

const StudioTimeline: React.FC<StudioTimelineProps> = ({
    measures,
    selectedNoteIds,
    timeSignature,
    activeDuration,
    bpm = 120,
    hasClipboard,
    onSelectNote,
    onDoubleClickNote,
    onAddNote,
    onUpdateNote,
    onRemoveNote,
    onCopyNote,
    onRemoveMeasure,
    onAddMeasure,
    onUpdateMeasure,
    onToggleCollapse,
    onCopyMeasure,
    onPasteMeasure,
    onReorderMeasures,
    onReorderNotes,
    onSelectMeasure,
    onDeselectAll,
    selectedMeasureId,
    totalDurationMs = 0,
    currentCursorMs = 0,
    onSeek
}) => {
    const capacity = getMeasureCapacity(timeSignature);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Note Drag State
    const [draggedNote, setDraggedNote] = useState<{ measureId: string, index: number } | null>(null);
    const [dragOverNoteIndex, setDragOverNoteIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        onReorderMeasures(draggedIndex, index);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Note Drag Handlers
    const handleNoteDragStart = (e: React.DragEvent, measureId: string, index: number) => {
        setDraggedNote({ measureId, index });
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
    };

    const handleNoteDragOver = (e: React.DragEvent, measureId: string, index: number) => {
        e.preventDefault();
        if (!draggedNote || draggedNote.measureId !== measureId || draggedNote.index === index) return;
        setDragOverNoteIndex(index);
        e.stopPropagation();
    };

    const handleNoteDrop = (e: React.DragEvent, measureId: string, index: number) => {
        e.preventDefault();
        if (!draggedNote || draggedNote.measureId !== measureId) return;

        onReorderNotes(measureId, draggedNote.index, index);
        setDraggedNote(null);
        setDragOverNoteIndex(null);
        e.stopPropagation();
    };

    const handleNoteDragEnd = () => {
        setDraggedNote(null);
        setDragOverNoteIndex(null);
    };

    const getTechColor = (tech: string) => {
        switch (tech) {
            case 's': return 'bg-cyan-500';
            case 'h': return 'bg-emerald-500';
            case 'p': return 'bg-rose-500';
            case 'b': return 'bg-amber-500';
            case 'v': return 'bg-purple-500';
            default: return 'bg-slate-600';
        }
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Pre-calculate note timings for playback highlighting
    const noteTimingMap = new Map<string, { start: number, end: number }>();
    let accumulatedTimeMs = 0;
    measures.forEach(measure => {
        measure.notes.forEach(note => {
            const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators.dot, bpm);
            noteTimingMap.set(note.id, { start: accumulatedTimeMs, end: accumulatedTimeMs + durationMs });
            accumulatedTimeMs += durationMs;
        });
    });

    // Timeline / Horizontal Layout - STUDIO MODE
    return (
        <div
            className="flex flex-col w-full h-full bg-[#050505]/40 backdrop-blur-2xl border-t border-white/[0.03] relative"
            onClick={onDeselectAll}
        >
            {/* Playback Progress Overlay */}
            <div
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 z-50 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                style={{ width: `${Math.min(100, (currentCursorMs / totalDurationMs) * 100)}%` }}
            />

            {/* Time Status */}
            <div className="absolute top-4 right-8 z-20 pointer-events-none">
                <div className="flex items-center space-x-2.5 bg-black/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-xl shadow-2xl">
                    <span className="text-[11px] font-mono font-black text-cyan-400 tracking-tighter">{formatTime(currentCursorMs)}</span>
                    <span className="text-[11px] font-mono text-zinc-600 font-bold">/</span>
                    <span className="text-[11px] font-mono font-black text-zinc-500 tracking-tighter">{formatTime(totalDurationMs)}</span>
                </div>
            </div>

            {/* Horizontal Timeline Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 py-6 custom-scrollbar">
                <div className="flex flex-row gap-5 min-w-max h-full items-start">
                    {measures.map((measure, mIdx) => {
                        const isCollapsed = measure.isCollapsed;
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;
                        const isMeasureSelected = measure.id === selectedMeasureId;

                        return (
                            <div
                                key={measure.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectMeasure(measure.id);
                                    const firstNote = measure.notes[0];
                                    if (firstNote) {
                                        onSelectNote(firstNote.id, e.shiftKey || e.ctrlKey);
                                        const timing = noteTimingMap.get(firstNote.id);
                                        if (timing && onSeek) onSeek(timing.start);
                                    }
                                }}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, mIdx)}
                                onDragOver={(e) => handleDragOver(e, mIdx)}
                                onDrop={(e) => handleDrop(e, mIdx)}
                                onDragEnd={handleDragEnd}
                                onDragLeave={() => setDragOverIndex(null)}
                                className={`
                                    flex flex-col
                                    relative group transition-all duration-500
                                    rounded-[24px] border
                                    ${isCollapsed ? 'w-16' : 'w-[180px]'}
                                    ${isDragging ? 'opacity-20 scale-95 border-dashed border-zinc-700' :
                                        isMeasureSelected
                                            ? 'opacity-100 border-cyan-500/40 bg-zinc-900/40 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20'
                                            : 'opacity-100 border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]'}
                                    ${isOver ? 'border-cyan-500/60 scale-[1.02] shadow-cyan-500/5' : ''}
                                    h-[85%] 
                                `}
                            >
                                {/* Glass Shine Effect */}
                                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Measure Header */}
                                <div className={`flex flex-col p-2.5 z-10 ${isCollapsed ? 'items-center' : 'border-b border-white/[0.05]'}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div
                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/40 border border-white/5 text-[11px] font-black text-zinc-500 cursor-grab active:cursor-grabbing hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-inner"
                                            title="Drag to reorder"
                                        >
                                            {mIdx + 1}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {/* Action Buttons */}
                                            {!isCollapsed && (
                                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={(e) => { e.stopPropagation(); onCopyMeasure(measure.id); }}
                                                        className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-cyan-400 transition-all duration-300"
                                                        title="Duplicate">
                                                        <Icons.Copy />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); onRemoveMeasure(measure.id); }}
                                                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-all duration-300"
                                                        title="Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            )}

                                            <button onClick={(e) => { e.stopPropagation(); onToggleCollapse(measure.id); }}
                                                className="p-1.5 bg-black/40 border border-white/10 hover:border-white/30 rounded-lg text-zinc-400 hover:text-white transition-all duration-300 shadow-lg">
                                                {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Measure Content (Notes) */}
                                {!isCollapsed && (
                                    <div className="flex-1 px-5 py-3 z-10 overflow-hidden flex flex-row gap-5 items-center">
                                        {measure.notes.map((note, nIdx) => {
                                            const isSelected = selectedNoteIds.includes(note.id);
                                            const isRest = note.type === 'rest';

                                            const isNoteDragging = draggedNote?.measureId === measure.id && draggedNote?.index === nIdx;
                                            const isNoteOver = dragOverNoteIndex === nIdx && draggedNote?.measureId === measure.id;

                                            const timing = noteTimingMap.get(note.id);
                                            const isPlaying = timing && currentCursorMs > 0 && currentCursorMs >= timing.start && currentCursorMs < timing.end;

                                            return (
                                                <div
                                                    key={note.id}
                                                    onDoubleClick={(e) => { e.stopPropagation(); onDoubleClickNote(note.id); }}
                                                    draggable={true}
                                                    onDragStart={(e) => handleNoteDragStart(e, measure.id, nIdx)}
                                                    onDragOver={(e) => handleNoteDragOver(e, measure.id, nIdx)}
                                                    onDrop={(e) => handleNoteDrop(e, measure.id, nIdx)}
                                                    onDragEnd={handleNoteDragEnd}
                                                    onDragLeave={() => setDragOverNoteIndex(null)}
                                                    className={`
                                                        relative cursor-pointer transition-all duration-500 group/note
                                                        w-[100px] h-[65px] shrink-0 rounded-[20px] border-2 flex flex-col items-center justify-center select-none shadow-xl
                                                        ${isPlaying
                                                            ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.05] z-10'
                                                            : isSelected
                                                                ? (isRest ? 'bg-zinc-800/80 border-zinc-500 shadow-zinc-900/40' : 'bg-cyan-900/20 border-cyan-500 shadow-cyan-900/40 translate-y-[-2px]')
                                                                : 'bg-black/30 border-white/[0.04] hover:border-white/[0.1] hover:bg-black/50 hover:translate-y-[-1px]'}
                                                        ${isRest ? 'grayscale-[0.5] opacity-40' : ''}
                                                        ${isNoteDragging ? 'opacity-20 scale-90 blur-[2px]' : ''}
                                                        ${isNoteOver ? 'border-cyan-400 scale-[1.05] -translate-y-1' : ''}
                                                    `}
                                                >
                                                    {/* Glow behind playing note */}
                                                    {isPlaying && <div className="absolute inset-x-0 bottom-0 top-1/2 bg-cyan-500/20 blur-2xl rounded-full" />}

                                                    {/* Note Info */}
                                                    <span className={`absolute top-2 left-4 text-[8px] font-black uppercase tracking-widest ${isSelected || isPlaying ? 'text-cyan-400' : 'text-zinc-600'}`}>
                                                        {note.duration}{note.decorators.dot && '•'}
                                                    </span>

                                                    {/* Main Value */}
                                                    <div className={`flex flex-row flex-wrap items-center justify-center content-center transition-all duration-500 group-hover/note:scale-110 ${isRest ? 'text-zinc-600' : 'text-white'} gap-1.5 px-2`}>
                                                        {isRest ? Icons.MusicRest(note.duration) : (
                                                            <div className="flex -space-x-1.5">
                                                                {(() => {
                                                                    const uniqueNotes = Array.from(new Set(note.positions
                                                                        .filter(p => !p.avoid)
                                                                        .map(p => {
                                                                            const midi = getMidiFromPosition(p.fret, p.string);
                                                                            const pitch = getPitchFromMidi(midi);
                                                                            return pitch.name + pitch.accidental.replace('#', '♯').replace('b', '♭');
                                                                        })));

                                                                    return uniqueNotes.slice(0, 3).map((noteName, i) => (
                                                                        <div key={i} className={`
                                                                            w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black shadow-lg transition-all duration-500
                                                                            ${isPlaying ? 'bg-cyan-400 border-white text-black scale-110' : 'bg-zinc-900 border-white/20 text-white'}
                                                                        `}>
                                                                            {noteName}
                                                                        </div>
                                                                    ));
                                                                })()}
                                                                {note.positions.filter(p => !p.avoid).length > 3 && (
                                                                    <div className="w-5 h-5 rounded-full bg-cyan-950 border-2 border-cyan-400/50 flex items-center justify-center text-[8px] font-black text-cyan-400 shadow-lg">
                                                                        +
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Indicators (Bottom Dots) */}
                                                    <div className="absolute bottom-3 left-4 flex gap-1">
                                                        {note.technique && <div className={`w-1.5 h-1.5 rounded-full ring-2 ring-black/40 shadow-sm ${getTechColor(note.technique)}`} />}
                                                    </div>

                                                    {/* Progress bar inside note (match cinematic) */}
                                                    {isPlaying && timing && (
                                                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                                                            style={{ width: `${Math.min(100, Math.max(0, ((currentCursorMs - timing.start) / (timing.end - timing.start)) * 100))}%` }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Section Button (End of Timeline) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddMeasure(); }}
                        className="w-20 h-[85%] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-cyan-500/5 hover:border-cyan-500/30 rounded-[24px] flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-400 transition-all duration-700 shrink-0 group/add-m"
                        title="Add New Block"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center group-hover/add-m:scale-110 group-hover/add-m:rotate-90 group-hover/add-m:bg-cyan-500/10 transition-all duration-500 shadow-xl">
                            <Icons.Plus />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-40 group-hover/add-m:opacity-100 transition-opacity">Add Block</span>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default StudioTimeline;

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/modules/timeline/presentation/components/TimelineControls.tsx ---
"use client";

import React from "react";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { Pause, Play, StopCircle, Video } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface TimelineControlsProps {
  isAnimating: boolean;
  isPaused: boolean;
  handleAnimate: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleRenderVideo: () => void;
  isTimelineEmpty: boolean;
  ffmpegLoaded?: boolean;
  onAudioUpload?: () => void;
  audioUploaded?: boolean;
  onResetPlayback?: () => void;
}

export function TimelineControls({
  isAnimating,
  isPaused,
  handleAnimate,
  handlePause,
  handleResume,
  handleRenderVideo,
  isTimelineEmpty,
  ffmpegLoaded = true,
  onResetPlayback
}: TimelineControlsProps) {
  const { isRendering } = useAppContext();

  return (
    <div className="flex items-center gap-1 bg-[#09090b] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!isAnimating) handleAnimate();
          else if (isPaused) handleResume();
          else handlePause();
        }}
        className={cn("w-10 h-10 rounded-xl transition-all duration-300", {
          "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]": !isAnimating || isPaused,
          "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400": isAnimating && !isPaused,
          "cursor-not-allowed opacity-50": isTimelineEmpty,
        })}
        disabled={isTimelineEmpty || isRendering}
      >
        {isAnimating && !isPaused ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-0.5" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onResetPlayback}
        className={cn("w-10 h-10 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all", {
          "cursor-not-allowed opacity-50": !isAnimating && !isPaused,
        })}
        disabled={(!isAnimating && !isPaused) || isRendering}
      >
        <StopCircle className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRenderVideo}
        className={cn(
          "w-10 h-10 rounded-xl text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all",
          {
            "cursor-not-allowed opacity-50": isTimelineEmpty || isRendering || !ffmpegLoaded,
          }
        )}
        disabled={isTimelineEmpty || isRendering || !ffmpegLoaded}
      >
        <Video className="w-5 h-5" />
      </Button>
    </div>
  );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/layout/EditorGrid.tsx ---
"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface EditorGridProps {
    topSection: React.ReactNode;
    bottomSection: React.ReactNode;
    floatingControls?: React.ReactNode;
    className?: string;
    topSectionClassName?: string;
    bottomSectionClassName?: string;
    splitRatio?: string; // e.g., "65% 35%"
}

export function EditorGrid({
    topSection,
    bottomSection,
    floatingControls,
    className,
    topSectionClassName,
    bottomSectionClassName,
    splitRatio = "70% 30%",
}: EditorGridProps) {
    return (
        <main
            className={cn("flex flex-1 flex-col overflow-hidden min-w-0 bg-black/20", className)}
            style={{ display: 'grid', gridTemplateRows: splitRatio }}
        >
            {/* Top Section: typically the Stage/Canvas */}
            <div className={cn("flex flex-col h-full overflow-hidden relative", topSectionClassName)}>
                {floatingControls && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-fit">
                        {floatingControls}
                    </div>
                )}
                {topSection}
            </div>

            {/* Bottom Section: typically the Timeline/VisualEditor */}
            <div className={cn("w-full h-full min-w-0 overflow-hidden relative border-t border-white/5 bg-black/20 backdrop-blur-sm", bottomSectionClassName)}>
                {bottomSection}
            </div>
        </main>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/layout/GenericSidebar.tsx ---
'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { RotateCcw, X } from 'lucide-react';

interface GenericSidebarProps {
    children: React.ReactNode;
    title: string;
    icon: React.ElementType;
    onReset?: () => void;
    tabs?: { id: string; label: string }[];
    activeTab?: string;
    onTabChange?: (tabId: any) => void;
    footer?: React.ReactNode;
    // Mobile / Overlay props
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    // Layout props
    side?: 'left' | 'right';
    className?: string;
    contentClassName?: string;
    headerAction?: React.ReactNode;
}

export const GenericSidebar: React.FC<GenericSidebarProps> = ({
    children,
    title,
    icon: Icon,
    onReset,
    tabs,
    activeTab,
    onTabChange,
    footer,
    isMobile = false,
    isOpen = true,
    onClose,
    side = 'right',
    className,
    contentClassName,
    headerAction
}) => {
    const isRight = side === 'right';

    const rootClasses = cn(
        "bg-[#0d0d0f] flex flex-col z-20 transition-all duration-300 ease-in-out",
        isMobile
            ? cn(
                "fixed inset-x-0 bottom-0 h-[70vh] rounded-t-2xl border-t border-zinc-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]",
                isOpen ? "translate-y-0" : "translate-y-full"
            )
            : cn(
                "relative w-80 h-full",
                isRight ? "border-l border-zinc-800/50 shadow-[-5px_0_30px_rgba(0,0,0,0.5)]" : "border-r border-zinc-800/50 shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
            ),
        className
    );

    return (
        <aside className={rootClasses}>
            {/* Header / Grabber for mobile */}
            {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
                </div>
            )}

            {/* Main Header */}
            <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                        <Icon className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">{title}</h1>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">NoteForge Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {headerAction}
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="p-2 bg-zinc-900/50 hover:bg-pink-500/10 rounded-lg text-zinc-500 hover:text-pink-400 border border-zinc-800 hover:border-pink-500/30 transition-all"
                            title="Reset Defaults"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                    {isMobile && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 bg-zinc-900/50 rounded-lg text-zinc-500 hover:text-white border border-zinc-800 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Switcher */}
            {tabs && activeTab && onTabChange && (
                <div className="px-6 mb-4">
                    <div className="flex bg-zinc-950/50 p-1 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-zinc-800/80 text-pink-400 shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-pink-500/20"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={cn("flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar", contentClassName)}>
                {children}
            </div>

            {/* Footer */}
            {footer ? (
                <div className="mt-auto p-4 border-t border-zinc-800/30 bg-zinc-950/20">
                    {footer}
                </div>
            ) : (
                <div className="mt-auto pt-4 pb-6 border-t border-zinc-800/30 text-center">
                    <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em] opacity-50">NoteForge Active</p>
                </div>
            )}
        </aside>
    );
};

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/layout/MobileHeader.tsx ---
import React from 'react';
import Link from 'next/link';

interface MobileHeaderProps {
    title?: string;
    onSettingsClick?: () => void;
    showSettings?: boolean;
    showBack?: boolean;
    onBackClick?: () => void;
}

export function MobileHeader({
    title = 'TabTune',
    onSettingsClick,
    showSettings = false,
    showBack = false,
    onBackClick
}: MobileHeaderProps) {
    return (
        <header className="flex-none px-6 pt-12 pb-6 flex items-center justify-between z-20 bg-zinc-950/40 backdrop-blur-lg border-b border-zinc-900/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/10 rounded-2xl border border-pink-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                    <span className="material-icons-round text-pink-400 text-2xl">
                        music_note
                    </span>
                </div>
                <h1 className="text-lg font-black tracking-[0.15em] text-zinc-100 uppercase">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-2">
                {showSettings && (
                    <button
                        onClick={onSettingsClick}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-all active:scale-90"
                    >
                        <span className="material-icons-round text-xl">
                            settings
                        </span>
                    </button>
                )}
                {showBack && (
                    <Link href="/">
                        <button
                            onClick={onBackClick}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-all active:scale-90"
                        >
                            <span className="material-icons-round text-xl">
                                arrow_back
                            </span>
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/layout/MobileNav.tsx ---
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface NavItem {
    id: string;
    icon: LucideIcon | string;
    label: string;
}

interface MobileNavProps {
    items: NavItem[];
    activePanel: string;
    onPanelChange: (id: any) => void;
}

export function MobileNav({ items, activePanel, onPanelChange }: MobileNavProps) {
    return (
        <nav className="relative z-[60] bg-zinc-950/60 backdrop-blur-xl border-t border-zinc-900/80 pb-safe pt-2 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {items.map((item) => {
                    const isActive = activePanel === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onPanelChange(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group",
                                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <div className="relative p-2 rounded-xl transition-all duration-300">
                                {isActive && (
                                    <div className="absolute inset-0 bg-cyan-500/10 rounded-xl animate-in fade-in zoom-in-95 duration-300 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]" />
                                )}
                                {typeof Icon === "string" ? (
                                    <span
                                        className={cn(
                                            "material-icons-round text-2xl relative z-10 transition-all duration-300",
                                            isActive ? "scale-110" : "group-hover:scale-105"
                                        )}
                                    >
                                        {Icon}
                                    </span>
                                ) : (
                                    <Icon
                                        size={24}
                                        className={cn(
                                            "relative z-10 transition-all duration-300",
                                            isActive ? "scale-110" : "group-hover:scale-105"
                                        )}
                                    />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-black uppercase tracking-widest mt-1 transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-60"
                                )}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/layout/StageContainer.tsx ---
"use client";

import React from 'react';
import { cn } from "@/shared/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";

interface StageContainerProps {
    children: React.ReactNode;
    title?: string;
    statusLabel?: string;
    aspectRatio?: string;
    background?: string;
    className?: string;
}

export const StageContainer = ({
    children,
    title = "Studio Canvas",
    statusLabel,
    aspectRatio = "aspect-video",
    background = "#050505",
    className
}: StageContainerProps) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section className={cn("flex-1 relative flex items-center justify-center overflow-hidden", className)}>
                <div className="w-full h-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#0F1218] p-4">
                        <div className="w-full h-full flex items-center justify-center">
                            {children}
                        </div>
                    </div>
                    <div className="absolute top-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10 shadow-lg transform translate-y-[-150%] group-hover:translate-y-0 transition-transform duration-300">
                        {title}
                    </div>
                </div>
            </section>
        );
    }

    // Desktop Layout (CRT Monitor style)
    return (
        <section className={cn("flex-1 relative flex items-center justify-center bg-transparent overflow-hidden px-4 py-2", className)}>
            {/* CRT Monitor Frame */}
            <div className={cn(
                "relative w-full max-w-[900px] rounded-3xl border-4 border-[#333] shadow-[0_0_0_2px_#111,0_0_40px_rgba(0,0,0,0.5),0_0_100px_rgba(6,182,212,0.05)] overflow-hidden group",
                aspectRatio
            )} style={{ backgroundColor: background }}>

                {/* Screen Bezel/Inner Shadow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />

                {/* CRT Scanline Overlay - Reduced opacity */}
                <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,3px_100%]" />

                {/* Subtle Screen Curved Reflection - Reduced opacity and made neutral */}
                <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-10 rounded-2xl" />

                <div className="w-full h-full relative z-10 flex items-center justify-center" style={{ backgroundColor: background }}>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {children}
                    </div>
                    <p className="absolute bottom-4 text-cyan-500/20 font-mono text-[10px] uppercase tracking-widest pointer-events-none">{statusLabel}</p>
                </div>
            </div>

            {/* Decorative localized glow under the monitor - Reduced intensity */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-cyan-500/5 blur-[100px] pointer-events-none" />
        </section>
    );
};

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/layout/WorkspaceLayout.tsx ---
"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface WorkspaceLayoutProps {
    header?: React.ReactNode;
    leftSidebar?: React.ReactNode;
    rightSidebar?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    mobileHeader?: React.ReactNode;
    mobileBottomNav?: React.ReactNode;
    isMobile?: boolean;
}

export function WorkspaceLayout({
    header,
    leftSidebar,
    rightSidebar,
    children,
    className,
    mobileHeader,
    mobileBottomNav,
    isMobile = false,
}: WorkspaceLayoutProps) {
    if (isMobile) {
        return (
            <div className="flex h-screen w-full flex-col bg-background text-foreground antialiased selection:bg-cyan-500/30">
                {mobileHeader}
                <main className="flex-1 relative overflow-hidden flex flex-col">
                    {children}
                </main>
                {leftSidebar}
                {rightSidebar}
                {mobileBottomNav}
            </div>
        );
    }

    return (
        <div className={cn(
            "flex h-screen w-full flex-col bg-gradient-to-br from-[#120621] via-[#0a0510] to-black text-foreground relative overflow-hidden",
            className
        )}>
            {/* Retro Grid Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,6px_100%] pointer-events-none z-0" />

            {header}

            <div className="relative z-10 flex flex-1 overflow-hidden">
                {leftSidebar}
                {children}
                {rightSidebar}
            </div>
        </div>
    );
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/accordion.tsx ---
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/alert-dialog.tsx ---
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/alert.tsx ---
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/avatar.tsx ---
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/shared/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/badge.tsx ---
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/button.tsx ---
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/card.tsx ---
import * as React from "react"

import { cn } from "@/shared/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/carousel.tsx ---
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/chart.tsx ---
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/shared/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/checkbox.tsx ---
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/collapsible.tsx ---
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/dialog.tsx ---
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/dropdown-menu.tsx ---
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/form.tsx ---
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/shared/lib/utils"
import { Label } from "@/shared/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/input.tsx ---
import * as React from "react"

import { cn } from "@/shared/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/label.tsx ---
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/menubar.tsx ---
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/shared/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/popover.tsx ---
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/shared/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/progress.tsx ---
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/shared/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/radio-group.tsx ---
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/resizable.tsx ---
"use client"

import { GripVertical } from "lucide-react"
import { Panel, Group, Separator } from "react-resizable-panels"

import { cn } from "@/shared/lib/utils"

const ResizablePanelGroup = ({
    className,
    ...props
}: React.ComponentProps<typeof Group> & { direction?: "horizontal" | "vertical" }) => (
    <Group
        className={cn(
            "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
            className
        )}
        {...props}
    />
)

const ResizablePanel = Panel

const ResizableHandle = ({
    withHandle,
    className,
    ...props
}: React.ComponentProps<typeof Separator> & {
    withHandle?: boolean
}) => (
    <Separator
        className={cn(
            "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
            className
        )}
        {...props}
    >
        {withHandle && (
            <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
                <GripVertical className="h-2.5 w-2.5" />
            </div>
        )}
    </Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/scroll-area.tsx ---
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/shared/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/select.tsx ---
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/separator.tsx ---
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/shared/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/sheet.tsx ---
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/sidebar.tsx ---
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/shared/hooks/use-mobile"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { Sheet, SheetContent } from "@/shared/components/ui/sheet"
import { Skeleton } from "@/shared/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/skeleton.tsx ---
import { cn } from "@/shared/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/slider.tsx ---
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/shared/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/switch.tsx ---
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/shared/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/table.tsx ---
import * as React from "react"

import { cn } from "@/shared/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/tabs.tsx ---
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/shared/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/textarea.tsx ---
import * as React from 'react';

import {cn} from '@/shared/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/components/ui/tooltip.tsx ---
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/shared/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

--- /home/maiq/Projetos/tab_videos/TabTune/Cifrai/src/shared/hooks/use-mobile.tsx ---
"use client";

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 1024; // Corresponds to lg in Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
}

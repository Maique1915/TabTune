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
        this.chordDrawer = new ShortNeckDrawer(
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
                scaleFactor: (this.options.colors?.global?.scale || 1),
                neckType: "SHORT" as any
            }
        );

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
            const exts = chordData.finalChord.chord?.extension ? chordData.finalChord.chord.extension.map(i => extensionMap[i]) : undefined;
            this.chordDrawer.drawChordName(chordData.finalChord.chordName || "", { opacity: 1, extensions: exts });
        }
    }

    private drawPreviewChord() {
        if (!this.previewChord || !this.chordDrawer) return;

        this.chordDrawer.drawFingers(this.previewChord);
        if (this.options.showChordName && this.previewChord.chordName && this.previewChord.showChordName !== false) {
            const exts = this.previewChord.chord?.extension ? this.previewChord.chord.extension.map(i => extensionMap[i]) : undefined;
            this.chordDrawer.drawChordName(this.previewChord.chordName, { extensions: exts });
        }
    }
}

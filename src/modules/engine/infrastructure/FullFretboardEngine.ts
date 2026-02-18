import { ChordDrawer, FingersAnimationDrawer } from "./drawers/ChordDrawer";
import { FullNeckDrawer } from "./drawers/FullNeck";
import { FullFingersAnimation } from "./drawers/FullFingersAnimation";
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

export class FullFretboardEngine {
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
        // Currently hardcoded to FullNeck as per cleanup, but extensive enough to swap if needed
        const drawer = new FullNeckDrawer(
            this.ctx,
            this.options.colors as any, // Type cast might be needed depending on strictness
            this.dimensions,
            {
                numStrings: this.options.numStrings || 6,
                numFrets: this.options.numFrets || 5
            }
        );

        if (this.options.tuning) {
            drawer.setStringNames(this.options.tuning);
        }

        if (this.options.capo !== undefined) {
            drawer.setGlobalCapo(this.options.capo);
        }

        const rotation = this.options.colors?.global?.rotation || 0;
        console.log('[FullFretboardEngine] initDrawers - Setting rotation:', rotation);
        const mirror = this.options.colors?.global?.mirror || false;
        drawer.setTransforms(rotation, mirror);

        this.chordDrawer = drawer;

        this.fingersAnimation = new FullFingersAnimation();
    }

    public resize(width: number, height: number, currentState?: AnimationState) {
        this.dimensions = { width, height };
        this.canvas.width = width;
        this.canvas.height = height;
        // Re-init drawers with new dimensions
        this.initDrawers();

        // If state is provided, redraw it. Otherwise do nothing (wait for consumer).
        if (currentState) {
            this.drawFrame(currentState);
        }
    }

    public updateOptions(newOptions: Partial<EngineOptions>, currentState?: AnimationState) {
        this.options = { ...this.options, ...newOptions };
        this.initDrawers(); // Re-init to apply potential theme/layout changes

        if (currentState) {
            this.drawFrame(currentState);
        } else if (!this.isRunning) {
            // Only draw single frame (default 0) if NO state provided and NOT running.
            // But preferably, we shouldn't even do this if we want to preserve state.
            // But for backward compat if callee assumes reset:
            // Let's decide: safe to remove if FretboardStage manages it.
            // For now, only draw if State provided, or just wait.
            // If we don't draw, canvas might be blank if initDrawers clears it? No, drawFretboard does.
            // Let's rely on consumer.
        }
    }

    public setChords(chords: ChordWithTiming[]) {
        this.chords = chords;
        // Do not force redraw here as it resets to frame 0.
        // The consumer (FretboardStage) should call drawFrame with the correct state.
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

        console.log('[FretboardEngine] drawFrame - Rotation:', (this.chordDrawer as any).rotation, 'Dimensions:', this.dimensions);

        // Clear canvas
        this.ctx.fillStyle = this.options.colors?.global?.backgroundColor || '#000000';
        this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);

        this.ctx.save();

        // Enforce transforms from options
        const rotation = this.options.colors?.global?.rotation || 0;
        const mirror = this.options.colors?.global?.mirror || false;
        this.chordDrawer.setTransforms(rotation, mirror);

        this.chordDrawer.drawFretboard();
        this.ctx.restore();

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
            this.chordDrawer.drawChordName(chordData.finalChord.chordName || "", { extensions: exts });
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

    public getGeometry() {
        return (this.chordDrawer as any)?._geometry || null;
    }
}

import { ChordDrawer, FingersAnimationDrawer } from "./drawers/ChordDrawer";
import { ShortNeckDrawer } from "./drawers/ShortNeck";
import { ShortFingersAnimation } from "./drawers/ShortFingersAnimation";
import { ChordWithTiming, ChordDiagramProps, FretboardTheme, TimeSignature } from "@/modules/core/domain/types";
import { RhythmArrow } from "./drawers/RhythmArrow";
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
    time?: string;
    timeSignature?: TimeSignature;
}

export interface AnimationState {
    chordIndex: number;
    transitionProgress: number;
    buildProgress: number;
    chordProgress?: number; // Added to fix type error
    // Add other state properties as needed
}

export class BeatsEngine {
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

        const rotation = this.options.colors?.global?.rotation || 0;
        console.log('[FretboardEngine] initDrawers - Setting rotation:', rotation);
        const mirror = this.options.colors?.global?.mirror || false;
        drawer.setTransforms(rotation, mirror);

        this.chordDrawer = drawer;

        this.fingersAnimation = new ShortFingersAnimation();
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

        // Clear canvas
        this.ctx.fillStyle = this.options.colors?.global?.backgroundColor || '#000000';
        this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);

        this.ctx.save();
        this.chordDrawer.applyTransforms();
        // this.chordDrawer.drawFretboard(); // Arm drawing removed as per user request
        this.ctx.restore();

        if (this.chords && this.chords.length > 0) {
            this.drawChords(state);
        } else if (this.previewChord) {
            this.drawPreviewChord();
        }

        this.drawRhythmGuide(state);
    }

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
            // fingersAnimation disabled for Beats view
            /*
            this.fingersAnimation.draw({
                drawer,
                allChords: allChordsSafe,
                currentIndex: state.chordIndex,
                currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                nextDisplayChord: null,
                transitionProgress: state.transitionProgress,
                skipFretboard: true
            });
            */
        } else if (this.fingersAnimation) {
            // fingersAnimation disabled for Beats view
            /*
            this.fingersAnimation.draw({
                drawer,
                currentDisplayChord: { finalChord: currentChordData.finalChord, transportDisplay: currentChordData.transportDisplay },
                nextDisplayChord: nextChordData ? { finalChord: nextChordData.finalChord, transportDisplay: nextChordData.transportDisplay } : null,
                transitionProgress: state.transitionProgress,
                buildProgress: state.buildProgress,
                skipFretboard: true
            });
            */
        } else {
            // Fallback: draw nothing or just names
        }

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

        // this.chordDrawer.drawFingers(this.previewChord); // NO FINGERS
        if (this.options.showChordName && this.previewChord.chordName && this.previewChord.showChordName !== false) {
            const exts = this.previewChord.chord?.extension
                ? this.previewChord.chord.extension.map(i => extensionMap[i]).filter((e): e is string => !!e)
                : undefined;
            this.chordDrawer.drawChordName(this.previewChord.chordName, { extensions: exts });
        }
    }

    private drawRhythmGuide(state: AnimationState) {
        const ctx = this.ctx;
        const W = this.dimensions.width;
        const H = this.dimensions.height;

        // CENTER the guide and make it fill a large portion of the screen
        const baseY = H * 0.5;
        const guideWidth = W * 0.9;
        const startX = (W - guideWidth) / 2;

        const chordIndex = Math.max(0, Math.min(this.chords.length - 1, Math.floor(state.chordIndex)));
        const currentChord = this.chords[chordIndex];
        if (!currentChord) return;

        // If we don't have extends, we can't find the measure, but we should STILL draw the background/timeline
        const measureId = currentChord.chord.extends?.measureId;
        const chordsInMeasure = measureId
            ? this.chords.filter(c => c.chord.extends?.measureId === measureId)
            : [currentChord];

        const timeSig = this.options.time || '4/4';
        const beats = this.options.timeSignature?.numerator || parseInt(timeSig.split('/')[0]) || 4;
        const subdivisions = this.options.timeSignature?.denominator || 4;

        ctx.save();

        // 3. Draw Chords/Arrows in Measure
        let measureTotalMs = 0;
        chordsInMeasure.forEach(c => measureTotalMs += (c.duration || 0));

        chordsInMeasure.forEach((c, idx) => {
            const globalIdx = this.chords.indexOf(c);
            const isCurrent = globalIdx === chordIndex;

            // Equidistant spacing: Always divide the space equally between arrows in current measure
            const x = startX + (idx + 0.5) * (guideWidth / chordsInMeasure.length);
            // Draw Advanced Geometrical Arrow (Includes Label inside and Mute cross)
            const label = c.chord.extends?.manualChord || "";
            const strumming = c.strumming || 'down';
            const isMuted = c.strumMode === 'mute';
            const isStrong = c.isStrong !== false; // Explicit check
            const strengthScale = isStrong ? 1.0 : 0.60; // 40% smaller for weak beats to ensure high contrast
            const pulse = isCurrent ? 1.0 + Math.sin((state.chordProgress || 0) * Math.PI) * 0.2 : 1.0;

            if (['up', 'down', 'pause', 'mute'].includes(strumming)) {
                RhythmArrow.draw(
                    ctx,
                    x,
                    baseY, // Internal centering logic in RhythmArrow class will handle Y-axis alignment
                    strumming as any,
                    label,
                    isMuted,
                    isCurrent,
                    pulse,
                    strengthScale,
                    this.options.colors
                );
            }
        });

        // 4. Draw Chord Name above the measure
        const chordName = currentChord.chord.chordName || currentChord.finalChord.chordName;
        if (chordName && this.chordDrawer) {
            const dims = RhythmArrow.getDimensions(1.0, 1.0);
            const arrowTop = baseY - (dims.h / 2);
            const scale = (this.options.colors?.global?.scale || 1);
            const nameY = arrowTop - (100 * scale);
            const measureCenterX = startX + (guideWidth / 2);

            this.chordDrawer.drawChordName(chordName, {
                x: measureCenterX,
                y: nameY,
                fontSize: 100 * scale,
                color: this.options.colors?.chordName?.color,
                opacity: this.options.colors?.chordName?.opacity
            });
        }

        ctx.restore();
    }

    public getGeometry() {
        return (this.chordDrawer as any)?._geometry || null;
    }
}

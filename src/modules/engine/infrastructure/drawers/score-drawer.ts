import { Renderer, Stave, StaveNote, TabNote, TabStave, Formatter, Accidental, Articulation, Dot } from "vexflow";
import type { SymbolClip } from "@/lib/timeline/types";

export class ScoreDrawer {
    private element: HTMLCanvasElement;
    private renderer: Renderer;
    private ctx: any; // VexFlow context

    constructor(element: HTMLCanvasElement) {
        this.element = element;
        this.renderer = new Renderer(this.element, Renderer.Backends.CANVAS);
        this.ctx = this.renderer.getContext();
    }

    clear() {
        const ctx = this.element.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.element.width, this.element.height);
        }
    }

    setCanvas(element: HTMLCanvasElement) {
        this.element = element;
        this.renderer = new Renderer(this.element, Renderer.Backends.CANVAS);
        this.ctx = this.renderer.getContext();
    }

    draw(width: number, height: number, clip: SymbolClip) {
        if (!clip || !clip.vexFlowProps) return;

        const props = clip.vexFlowProps;
        const notes = props.notes || [];
        const duration = props.duration || "q";
        const clef = props.clef || "treble";
        const staveWidth = props.staveWidth || 200;
        const isTab = clef === 'tab';

        // Scale and Position
        // We want to center the score on the screen
        const scale = 2.0; // Make it big and visible
        this.ctx.scale(scale, scale);
        this.ctx.setFont("Arial", 10);

        const logicalWidth = width / scale;
        const logicalHeight = height / scale;
        const x = (logicalWidth - staveWidth) / 2;
        const y = (logicalHeight - 150) / 2; // Approximate center

        let stave;
        if (isTab) {
            stave = new TabStave(x, y, staveWidth);
            stave.addClef("tab");
        } else {
            stave = new Stave(x, y, staveWidth);
            if (clef) stave.addClef(clef);
            // if (props.timeSignature) stave.addTimeSignature(props.timeSignature);
            // if (props.keySignature) stave.addKeySignature(props.keySignature);
        }

        stave.setContext(this.ctx).draw();

        // Notes
        const vfNotes = [];
        if (isTab) {
            // Simple Tab Note logic, maybe parse notes if they look like "1/2" (string/fret)? 
            // For now using placeholder or parsing logic if needed.
            // Assuming notes are like keys for now, but tab needs positions.
            // If user put "0/1" (fret 0, str 1), we can parse.
            // fallback:
            vfNotes.push(new TabNote({
                positions: [{ str: 1, fret: "0" }],
                duration: duration
            }));
        } else {
            const keys = notes.length > 0 ? notes : ["b/4"];
            const note = new StaveNote({
                keys: keys,
                duration: duration,
                clef: clef,
                autoStem: true
            });

            // Dots (parsing not implemented in props yet, using default 0)
            // Modifiers would go here

            vfNotes.push(note);
        }

        if (vfNotes.length > 0) {
            Formatter.FormatAndDraw(this.ctx, stave, vfNotes);
        }

        // Reset scale for next draw?
        this.ctx.scale(1 / scale, 1 / scale);
    }
}

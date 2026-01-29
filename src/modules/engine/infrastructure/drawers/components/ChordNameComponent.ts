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

import { ChordDrawerBase } from "./chord-drawer-base";
import type { FretboardTheme } from "@/modules/core/domain/types";
import { FretboardDrawer } from "./fretboard-drawer";
import type { Position, ChordDiagramProps, TabEffect } from "@/modules/core/domain/types";
import { notes, formatNoteName } from "@/modules/core/domain/chord-logic";

export interface GuitarFretboardDrawerOptions {
    width: number;
    height: number;
    numFrets?: number;
    numStrings?: number;
    rotation?: 0 | 90 | 270;
    mirror?: boolean;
    stringNames?: string[];
    tuningShift?: number;
}

export class GuitarFretboardDrawer {
    private ctx: CanvasRenderingContext2D;
    private colors: FretboardTheme;
    private width: number;
    private height: number;
    private numFrets: number;
    private numStrings: number;


    // Geometry
    private paddingX = 90; // Adjusted for better centering with smaller headstock
    private paddingY = 80; // Increased to make room for Chord Name above and better vertical centering
    private fretWidth: number = 0;
    private stringSpacing: number = 0;
    private fretboardHeight: number = 0;
    private boardY: number = 0; // Top Y of the board
    private stringMargin: number = 0; // Vertical margin for strings
    private rotation: number = 0;
    private mirror: boolean = false;
    private stringNames: string[] = ["E", "A", "D", "G", "B", "e"];
    private tuningShift: number = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        options: GuitarFretboardDrawerOptions
    ) {
        this.ctx = ctx;
        this.colors = colors;
        this.width = options.width;
        this.height = options.height;
        this.numFrets = options.numFrets || 12; // Reduced default to make neck shorter
        this.numStrings = options.numStrings || 6;
        this.rotation = options.rotation || 0;
        this.mirror = options.mirror || false;
        this.stringNames = options.stringNames || ["E", "A", "D", "G", "B", "e"];
        this.tuningShift = options.tuningShift || 0;

        this.calculateGeometry();
    }

    private calculateGeometry() {
        // Horizontal Layout:
        // Frets along X, Strings along Y
        const availableWidth = this.width - (this.paddingX * 2);
        // 15 frets + nut (pos 0)
        this.fretWidth = availableWidth / this.numFrets;

        // Height calculation Strategy: Constant Finger Size
        // We define a standard reference height for a standard 6-string guitar.
        // From this, we derive the 'standard' string spacing (which determines finger radius).
        // Then we calculate the actual fretboard height based on the current number of strings, keeping that spacing constant.

        const referenceNumStrings = 6;
        // Standard max height for 6 strings (matches previous logic's target)
        // This ensures the "Guitar" looks as before, but other instruments scale relative to it.
        const referenceMaxHeight = 400;

        // Reference Style: Strings are well inside the neck.
        // 0.75 ratio means strings occupy 75% of height.
        const stringSpanRatio = 0.75;

        // Calculate standard spacing for 6 strings
        // e.g., 400px height -> 300px span -> 5 gaps -> 60px spacing.
        const referenceStringSpan = referenceMaxHeight * stringSpanRatio;
        const referenceGaps = referenceNumStrings - 1;
        const constantStringSpacing = referenceStringSpan / referenceGaps;

        // Now calculate ACTUAL dimensions for THIS instrument
        const actualGaps = Math.max(1, this.numStrings - 1);
        const actualStringSpan = constantStringSpacing * actualGaps;

        // Reverse calculate board height needed to maintain ratio
        // stringSpan = height * ratio => height = stringSpan / ratio
        const requiredHeight = actualStringSpan / stringSpanRatio;

        this.fretboardHeight = requiredHeight;
        this.stringSpacing = constantStringSpacing;

        // Margins
        const totalMargin = this.fretboardHeight - actualStringSpan;
        this.stringMargin = totalMargin / 2;

        // Center the board vertically in the available canvas space
        this.boardY = (this.height - this.fretboardHeight) / 2;
    }

    public setColors(colors: FretboardTheme) {
        this.colors = colors;
    }

    public setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.calculateGeometry();
    }

    public setTransforms(rotation: 0 | 90 | 270, mirror: boolean) {
        this.rotation = rotation;
        this.mirror = mirror;
    }

    public setTuning(stringNames: string[], shift: number) {
        this.stringNames = stringNames;
        this.tuningShift = shift;
    }

    private applyTransforms() {
        this.ctx.translate(this.width / 2, this.height / 2);
        if (this.rotation) {
            this.ctx.rotate((this.rotation * Math.PI) / 180);
        }
        if (this.mirror) {
            this.ctx.scale(-1, 1);
        }
        this.ctx.translate(-this.width / 2, -this.height / 2);
    }

    public clear() {
        // Fill background with cardColor to match Studio style
        this.ctx.fillStyle = this.colors.cardColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public drawHeadstock() {
        const ctx = this.ctx;
        ctx.save();
        this.applyTransforms();

        // Headstock should be on the LEFT side of the fretboard (before the nut)
        // It should be vertical, matching the height of the fretboard
        const headstockWidth = 100; // Increased for better visibility
        const headstockGap = 15;
        const headstockX = this.paddingX - headstockWidth - headstockGap;
        const headstockHeight = this.fretboardHeight;
        const headstockY = this.boardY;
        const radius = 20;

        ctx.fillStyle = this.colors.fretboardColor;
        ctx.beginPath();
        ctx.roundRect(headstockX, headstockY, headstockWidth, headstockHeight, [radius, 0, 0, radius]);
        ctx.fill();

        ctx.restore();
    }

    public drawBoard() {
        const ctx = this.ctx;
        ctx.save();
        this.applyTransforms();

        // 1. Draw Fretboard Background
        ctx.fillStyle = this.colors.fretboardColor;
        ctx.fillRect(this.paddingX, this.boardY, this.width - this.paddingX * 2, this.fretboardHeight);

        // 2. Draw Frets (Vertical lines)
        ctx.strokeStyle = this.colors.fretColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Nut (zero fret) is thick
        ctx.moveTo(this.paddingX, this.boardY);
        ctx.lineTo(this.paddingX, this.boardY + this.fretboardHeight);

        for (let i = 1; i <= this.numFrets; i++) {
            const x = this.paddingX + i * this.fretWidth;
            ctx.moveTo(x, this.boardY);
            ctx.lineTo(x, this.boardY + this.fretboardHeight);
        }
        ctx.stroke();

        // 2.1 Draw Nut (thick line at start)
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.paddingX, this.boardY);
        ctx.lineTo(this.paddingX, this.boardY + this.fretboardHeight);
        ctx.stroke();

        // 3. Draw Strings (Horizontal lines)
        for (let i = 0; i < this.numStrings; i++) {
            const stringNum = i + 1; // 1 to 6
            const y = this.boardY + this.stringMargin + (i * this.stringSpacing);

            // Dynamic thickness - inverted so top string is thickest
            const thickness = 1 + ((this.numStrings - 1 - i) * 0.5);

            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.strokeStyle = this.colors.borderColor; // String color
            ctx.moveTo(this.paddingX, y);
            ctx.lineTo(this.width - this.paddingX, y);
            ctx.stroke();
        }

        // 4. Draw Inlays (Circles)
        const inlayFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        ctx.fillStyle = this.colors.fretColor; // Or a specific inlay color
        ctx.globalAlpha = 0.5;

        inlayFrets.forEach(fret => {
            if (fret > this.numFrets) return;
            const x = this.paddingX + (fret - 0.5) * this.fretWidth;
            const centerY = this.boardY + this.fretboardHeight / 2;

            ctx.beginPath();
            const radius = this.fretboardHeight / 20; // Slightly smaller proportional radius

            if (fret === 12 || fret === 24) {
                // Double dot
                // Spacing logic needs to adapt to new margin? 
                // Using string spacing is fine as it relates to visual lines
                ctx.arc(x, centerY - this.stringSpacing, radius, 0, Math.PI * 2);
                ctx.arc(x, centerY + this.stringSpacing, radius, 0, Math.PI * 2);
            } else {
                ctx.arc(x, centerY, radius, 0, Math.PI * 2);
            }
            this.ctx.fill();
        });

        // 5. Draw String Names (Left of Nut)
        this.ctx.fillStyle = this.colors.textColor;
        this.ctx.font = `bold ${this.stringSpacing * 0.45}px "Inter", sans-serif`;
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "middle";

        for (let i = 0; i < this.numStrings; i++) {
            const originalName = this.stringNames[i] || "";
            const displayName = this.tuningShift < 0
                ? this.getTransposedStringName(originalName, this.tuningShift)
                : originalName;

            const formattedName = formatNoteName(displayName);
            const x = this.paddingX - 15;
            const y = this.boardY + this.stringMargin + (i * this.stringSpacing);

            this.ctx.save();
            this.ctx.translate(x, y);
            if (this.mirror) this.ctx.scale(-1, 1);
            if (this.rotation) this.ctx.rotate((-this.rotation * Math.PI) / 180);
            this.ctx.fillText(formattedName, 0, 0);
            this.ctx.restore();
        }

        this.ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    private getTransposedStringName(originalName: string, shift: number): string {
        const isLowerCase = originalName === originalName.toLowerCase();
        const upperName = originalName.toUpperCase();

        let idx = notes.indexOf(upperName);
        // Rough fallback for flats if input has them (e.g. Eb)
        if (idx === -1 && upperName.includes('B')) {
            const base = upperName.replace('B', '');
            const baseIdx = notes.indexOf(base);
            if (baseIdx !== -1) idx = (baseIdx - 1 + 12) % 12;
        }

        if (idx === -1) return originalName;

        let newIdx = (idx + shift) % 12;
        if (newIdx < 0) newIdx += 12;

        const newNote = notes[newIdx];
        return isLowerCase ? newNote.toLowerCase() : newNote;
    }

    public drawChord(chord: ChordDiagramProps, options?: { strumming?: string, effects?: TabEffect[], progress?: number, opacity?: number, style?: 'normal' | 'ghost' }) {
        // Draw fingers on top of board
        const fingers = chord.fingers || [];
        const progress = options?.progress ?? 0; // 0 to 1

        this.ctx.save();
        this.applyTransforms();

        // Helper to draw a finger/note
        const drawFinger = (fret: number, visualIndex: number, finger: number | string, color: string, radiusScale: number = 1, alpha: number = 1, yOffset: number = 0, xOffset: number = 0) => {
            this.drawBarre(fret, visualIndex, visualIndex, color, alpha, { finger, xOffset, yOffset, radiusScale });
        };

        fingers.forEach(f => {
            const stringNum = f.string;
            const fret = f.fret;
            const fingerNum = f.finger ?? 0;
            const visualIdx = this.numStrings - stringNum; // User 6 -> 0 (Top), User 1 -> 5 (Bottom)

            if (stringNum < 1 || stringNum > this.numStrings) return;
            if (fret === undefined || fret === 0) return;

            const isBarre = f.endString !== undefined && f.endString !== f.string;

            // If it's a barre, we draw it as a barre once for this finger entry
            if (isBarre) {
                const fromIdx = this.numStrings - f.string;
                const toIdx = this.numStrings - f.endString!;

                this.drawBarre(
                    f.fret,
                    fromIdx,
                    toIdx,
                    this.colors.fingerColor,
                    options?.opacity ?? 1,
                    { finger: fingerNum }
                );
                // After drawing the barre, we might still want to apply animation logic?
                // The old code applied animation logic only to individual fingers.
                // However, if the whole barre slides, we need to handle it.
                // For now, let's keep the finger-based animation logic.
            }

            // --- ANIMATION LOGIC ---
            const stringEffects = options?.effects?.filter(e => e.string === stringNum);

            let currentFret = fret;
            let currentRadiusScale = 1;
            let baseAlpha = options?.opacity ?? 1;
            let currentAlpha = baseAlpha;
            let currentYOffset = 0;
            let currentXOffset = 0;

            const extraDraws: (() => void)[] = [];

            if (stringEffects) {
                stringEffects.forEach(effect => {
                    if (effect.type === 'slide' && effect.toFret !== undefined) {
                        const slideDist = (effect.toFret - currentFret) * this.fretWidth;
                        currentXOffset += slideDist * progress;
                    } else if (effect.type === 'vibrato') {
                        currentYOffset += Math.sin(progress * Math.PI * 10) * (this.stringSpacing * 0.2);
                    } else if (effect.type === 'tap') {
                        if (progress < 0.2) currentRadiusScale *= progress * 5;
                        else if (progress < 0.8) currentRadiusScale *= 1;
                        else {
                            const releaseProgress = (progress - 0.8) * 5;
                            currentAlpha *= 1 - releaseProgress;
                            currentYOffset += releaseProgress * (this.stringSpacing * 0.5);
                        }
                    } else if (effect.type === 'pull' && effect.toFret !== undefined) {
                        drawFinger(effect.toFret, visualIdx, 0, this.colors.fingerColor, 1, 0.7);
                        if (progress > 0.5) {
                            const removeProgress = (progress - 0.5) * 2;
                            currentRadiusScale *= 1 - removeProgress;
                            currentAlpha *= 1 - removeProgress;
                        }
                    } else if (effect.type === 'hammer' && effect.toFret !== undefined) {
                        extraDraws.push(() => {
                            if (progress > 0.3) {
                                const appearProgress = Math.min(1, (progress - 0.3) * 3);
                                drawFinger(effect.toFret as number, visualIdx, 0, this.colors.fingerColor, appearProgress, appearProgress);
                            }
                        });
                    } else if (effect.type === 'bend') {
                        const bendAmount = Math.sin(progress * Math.PI) * (this.stringSpacing * 0.5);
                        currentYOffset -= bendAmount;
                    }
                });
            }

            if (!isBarre) {
                drawFinger(currentFret, visualIdx, fingerNum, this.colors.fingerColor, currentRadiusScale, currentAlpha, currentYOffset, currentXOffset);
            }
        });

        // Muted Strings (X)
        if (chord.avoid) {
            chord.avoid.forEach(strNum => {
                const visualIdx = this.numStrings - strNum;
                const y = this.boardY + this.stringMargin + (visualIdx * this.stringSpacing);
                const x = this.paddingX - (this.fretWidth * 0.3);

                this.ctx.fillStyle = this.colors.textColor;
                this.ctx.font = `bold ${this.stringSpacing * 0.6}px sans-serif`;
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";

                // DRAW X WITHOUT FLIP/ROTATION
                this.ctx.save();
                this.ctx.translate(x, y);
                if (this.mirror) this.ctx.scale(-1, 1);
                if (this.rotation) this.ctx.rotate((-this.rotation * Math.PI) / 180);
                this.ctx.fillText("X", 0, 0);
                this.ctx.restore();
            });
        }
        this.ctx.restore();
    }

    public drawStrumAnimation(strumType: string, progress: number) {
        if (!strumType || strumType === 'mute') return;

        const ctx = this.ctx;
        ctx.save();
        this.applyTransforms();

        // Visual swipe across strings
        // Down: Top string to Bottom string (0 -> 5)
        // Up: Bottom to Top (5 -> 0)

        const totalH = this.fretboardHeight;
        const startY = this.boardY;

        let yPos = 0;
        if (strumType === 'down') {
            yPos = startY + (totalH * progress);
        } else if (strumType === 'up') {
            yPos = startY + totalH - (totalH * progress);
        }

        // Draw a "Pick" line or glow
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 4;
        ctx.moveTo(this.paddingX, yPos);
        ctx.lineTo(this.width - this.paddingX, yPos);
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = "white";
        ctx.shadowBlur = 10;
        ctx.stroke();
        this.ctx.shadowBlur = 0;
        ctx.restore();
    }

    private hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Detects the primary barre in a chord from the unified fingers array.
     */
    private detectBarre(chord: ChordDiagramProps): { fret: number, finger: number | string, fromString: number, toString: number } | null {
        const { fingers } = chord;
        if (!fingers || fingers.length === 0) return null;

        let bestBarre: { fret: number, finger: number | string, fromString: number, toString: number } | null = null;
        let maxSpan = 0;

        fingers.forEach(f => {
            if (f.endString !== undefined && f.endString !== f.string) {
                const span = Math.abs(f.endString - f.string);
                if (span > maxSpan) {
                    maxSpan = span;
                    bestBarre = {
                        fret: f.fret,
                        finger: f.finger ?? 1,
                        fromString: f.string,
                        toString: f.endString
                    };
                }
            }
        });

        return bestBarre;
    }

    private drawBarre(fret: number, fromIdx: number, toIdx: number, color: string, alpha: number, options?: { finger?: number | string, xOffset?: number, yOffset?: number, radiusScale?: number }) {
        const finger = options?.finger || 0;
        const xOffset = options?.xOffset || 0;
        const yOffset = options?.yOffset || 0;
        const radiusScale = options?.radiusScale || 1;

        // fromIdx and toIdx are 0-based visual string indices
        // Calculate Y positions
        const y1 = this.boardY + this.stringMargin + (fromIdx * this.stringSpacing) + yOffset;
        const y2 = this.boardY + this.stringMargin + (toIdx * this.stringSpacing) + yOffset;

        const topY = Math.min(y1, y2);
        const height = Math.abs(y2 - y1);

        // X position
        let x = this.paddingX + (Math.max(0, fret) - 0.5) * this.fretWidth + xOffset;
        if (fret === 0) {
            x = this.paddingX - (this.fretWidth * 0.3) + xOffset;
        }

        if (fret < 0) return;

        // Visual Parameters
        const radius = this.stringSpacing * 0.45 * radiusScale;
        const visualBarWidth = radius * 2;

        // Center X
        const rectX = x - (visualBarWidth / 2);
        // Start Y - we want the barre to encompass the circles which are centered at y.
        // So top is y - radius.
        const rectY = topY - radius;

        // Height includes the radius above top string and radius below bottom string
        const rectHeight = height + (radius * 2);
        const rectWidth = visualBarWidth;

        this.ctx.fillStyle = this.hexToRgba(color, this.colors.fingerBackgroundAlpha * alpha);

        this.ctx.beginPath();
        // Manual Rounded Rect
        // Start Top-Left after radius
        this.ctx.moveTo(rectX + radius, rectY);
        // Top Edge
        this.ctx.lineTo(rectX + rectWidth - radius, rectY);
        // Top-Right Corner
        this.ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
        // Right Edge
        this.ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
        // Bottom-Right Corner
        this.ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight);
        // Bottom Edge
        this.ctx.lineTo(rectX + radius, rectY + rectHeight);
        // Bottom-Left Corner
        this.ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
        // Left Edge
        this.ctx.lineTo(rectX, rectY + radius);
        // Top-Left Corner
        this.ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);

        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.hexToRgba(this.colors.fingerBorderColor, alpha);
        this.ctx.stroke();

        // Finger Number Logic (drawn on the 'toIdx' end or center?)
        // Let's draw it at the toIdx end for barres, or center for circles.
        if (finger !== 0 && alpha > 0.5 && radiusScale > 0.5) {
            const textY = (y1 + y2) / 2; // Midpoint between strings
            this.ctx.fillStyle = this.colors.fingerTextColor;
            this.ctx.font = `bold ${(this.stringSpacing * 0.35 * radiusScale) * 1.5}px sans-serif`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";

            this.ctx.save();
            this.ctx.translate(x, textY);
            if (this.mirror) this.ctx.scale(-1, 1);
            if (this.rotation) this.ctx.rotate((-this.rotation * Math.PI) / 180);
            this.ctx.fillText(finger.toString(), 0, 0);
            this.ctx.restore();
        }

        console.log(`[GuitarFretboardDrawer] Drawn Barre at Fret ${fret}, Indices ${fromIdx}-${toIdx}, Finger ${finger}`);
    }

    public drawCapo(fret: number) {
        if (fret <= 0 || fret > this.numFrets) return;

        // Capo spans ALL strings (1 to numStrings)
        const x = this.paddingX + (fret - 0.5) * this.fretWidth;

        // Geometry: We want it WIDER than the visual neck ("braço")
        // The neck goes from this.boardY to this.boardY + this.fretboardHeight

        const overhang = this.stringSpacing * 0.4; // How much it sticks out top/bottom
        const rectY = this.boardY - overhang;
        const rectHeight = this.fretboardHeight + (overhang * 2);

        // Visuals
        const width = this.fretWidth * 0.55; // Slightly wider to fit text
        const rectX = x - (width / 2);

        this.ctx.save();

        // 1. Main Dark Body
        this.ctx.fillStyle = "#2D2D2D"; // Dark Grey
        this.ctx.beginPath();
        this.ctx.roundRect(rectX, rectY, width, rectHeight, 8); // Increased radius slightly
        this.ctx.fill();

        // 2. Stroke
        this.ctx.strokeStyle = "#4A4A4A"; // Lighter Grey Stroke
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 3. Text & Grid
        const letters = ["C", "A", "P", "O"];

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = `900 ${width * 0.5}px "Inter", sans-serif`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        // Calculate spacing
        const segmentHeight = rectHeight / 4; // 4 segments exactly
        const startY = rectY;

        letters.forEach((char, i) => {
            const centerY = startY + (i * segmentHeight) + (segmentHeight / 2);

            // Draw Separator Line Above (except first)
            if (i > 0) {
                this.ctx.beginPath();
                const lineY = startY + (i * segmentHeight);
                this.ctx.moveTo(rectX, lineY);
                this.ctx.lineTo(rectX + width, lineY);
                this.ctx.strokeStyle = "rgba(255,255,255,0.15)";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            // Draw Letter
            this.ctx.fillText(char, x, centerY);
        });

        this.ctx.restore();
    }

    public drawChordName(name: string, options?: { opacity?: number }) {
        if (!name) return;

        this.ctx.save();
        // Since we are inside draw(), we assume the context might be clean or we need to apply our own transforms.
        // But usually the drawer manages its own transforms per frame or applyTransforms() does it.
        // If applyTransforms() accumulates, that's bad. But here it seems stateless (translate/rotate based on props).
        // Standard practice: save, apply transform, draw, restore.

        this.applyTransforms();

        // Position: Top centered horizontally on the board width, 
        // Vertical Y: boardY - margin
        const centerX = this.paddingX + (this.numFrets * this.fretWidth) / 2;
        // Ensure text doesn't go off-screen. If boardY is small, clamp topY.
        // We use textBaseline = "bottom", so anchor is the bottom of the text.
        // We want text to end slightly above the board (boardY).
        const textMargin = 15;
        const targetY = this.boardY - textMargin;
        // Text height approx fontSize.
        const fontSize = 64;
        // If targetY < fontSize, it might clip top.
        // Let's clamp the anchor position to be at least fontSize + padding.
        const safeY = Math.max(targetY, fontSize + 10);

        this.ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";

        // Use color from palette
        const color = this.colors.chordNameColor || "#22d3ee";
        // Combine theme opacity with transition opacity
        const themeOpacity = this.colors.chordNameOpacity ?? 1;
        const transitionOpacity = options?.opacity ?? 1;
        const finalOpacity = themeOpacity * transitionOpacity;

        // Glow/Shadow effect
        if (this.colors.chordNameShadow) {
            this.ctx.shadowColor = this.colors.chordNameShadowColor || color;
            this.ctx.shadowBlur = this.colors.chordNameShadowBlur || 10;
        } else {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = "transparent";
        }

        this.ctx.fillStyle = this.hexToRgba(color, finalOpacity);

        // Add stroke for contrast
        const strokeColor = this.colors.chordNameStrokeColor || "transparent";
        const strokeWidth = this.colors.chordNameStrokeWidth || 0;

        if (strokeWidth > 0 && strokeColor !== "transparent") {
            this.ctx.lineWidth = strokeWidth;
            this.ctx.strokeStyle = strokeColor;
            this.ctx.strokeText(name, centerX, safeY);
        }

        // Draw Text
        this.ctx.fillText(name, centerX, safeY);

        this.ctx.restore();
    }
}

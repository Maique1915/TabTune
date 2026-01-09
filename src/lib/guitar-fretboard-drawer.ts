import { ChordDrawerBase } from "./chord-drawer-base";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { FretboardDrawer } from "./fretboard-drawer";
import type { Position, ChordDiagramProps, TabEffect } from "@/lib/types";

export interface GuitarFretboardDrawerOptions {
    width: number;
    height: number;
    numFrets?: number;
    rotation?: 0 | 90 | 270;
    mirror?: boolean;
}

export class GuitarFretboardDrawer {
    private ctx: CanvasRenderingContext2D;
    private colors: ChordDiagramColors;
    private width: number;
    private height: number;
    private numFrets: number;

    // Geometry
    private paddingX = 40;
    private paddingY = 40;
    private fretWidth: number = 0;
    private stringSpacing: number = 0;
    private fretboardHeight: number = 0;
    private boardY: number = 0; // Top Y of the board
    private stringMargin: number = 0; // Vertical margin for strings
    private rotation: number = 0;
    private mirror: boolean = false;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: ChordDiagramColors,
        options: GuitarFretboardDrawerOptions
    ) {
        this.ctx = ctx;
        this.colors = colors;
        this.width = options.width;
        this.height = options.height;
        this.numFrets = options.numFrets || 15;
        this.rotation = options.rotation || 0;
        this.mirror = options.mirror || false;

        this.calculateGeometry();
    }

    private calculateGeometry() {
        // Horizontal Layout:
        // Frets along X, Strings along Y
        const availableWidth = this.width - (this.paddingX * 2);
        // 15 frets + nut (pos 0)
        this.fretWidth = availableWidth / this.numFrets;

        // Height calculation:
        // The user wants a "thick neck" look similar to a chord diagram.
        // User reported "no change" with 220px. Going extremely thin: 160px max.
        const availableHeight = this.height - (this.paddingY * 2);
        const targetHeight = Math.min(availableHeight, 160);
        this.fretboardHeight = Math.max(targetHeight, 120);

        this.boardY = (this.height - this.fretboardHeight) / 2;

        // Reference Style: Strings are well inside the neck.
        // Balanced Style:
        // 0.75 ratio means strings occupy 75% of height.
        // Margins are 12.5% on top and 12.5% on bottom.
        // For 300px height -> 225px spread, 37.5px top/bottom margin.
        const stringSpanRatio = 0.75;
        const stringSpanHeight = this.fretboardHeight * stringSpanRatio;

        // Margins
        const totalMargin = this.fretboardHeight - stringSpanHeight;
        this.stringMargin = totalMargin / 2;

        // Exact Spacing
        this.stringSpacing = stringSpanHeight / 5;
    }

    public setColors(colors: ChordDiagramColors) {
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
        this.ctx.clearRect(0, 0, this.width, this.height);
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
        for (let i = 0; i < 6; i++) {
            const stringNum = i + 1; // 1 to 6
            const y = this.boardY + this.stringMargin + (i * this.stringSpacing);

            // Dynamic thickness
            const thickness = 1 + (i * 0.5);

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
        this.ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    public drawChord(chord: ChordDiagramProps, options?: { strumming?: string, effects?: TabEffect[], progress?: number }) {
        // Draw fingers on top of board
        const positions = chord.positions;
        const progress = options?.progress ?? 0; // 0 to 1

        this.ctx.save();
        this.applyTransforms();

        // Helper to draw a finger/note
        const drawFinger = (fret: number, stringIndex: number, color: string, borderColor: string, radiusScale: number = 1, alpha: number = 1, yOffset: number = 0, xOffset: number = 0) => {
            const x = this.paddingX + (Math.max(0, fret) - 0.5) * this.fretWidth + xOffset;
            // Adjust x for open strings (fret 0)
            const drawX = fret === 0
                ? this.paddingX - (this.fretWidth * 0.3)
                : x;

            const y = this.boardY + this.stringMargin + (stringIndex * this.stringSpacing) + yOffset;

            // Draw Finger Circle
            this.ctx.beginPath();
            this.ctx.fillStyle = this.hexToRgba(color, this.colors.fingerBackgroundAlpha * alpha);
            this.ctx.strokeStyle = this.hexToRgba(borderColor, alpha); // Apply alpha to border too? Or just keep solid? Assuming hexToRgba handles alpha for border color if passed, but colors.fingerBorderColor is hex.
            // Manual alpha for border if needed
            // this.ctx.strokeStyle = borderColor; 
            // Let's assume we want opacity on everything
            this.ctx.globalAlpha = alpha;

            this.ctx.lineWidth = 2;

            const radius = this.stringSpacing * 0.35 * radiusScale;
            this.ctx.arc(drawX, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
        };

        Object.entries(positions).forEach(([strKey, [finger, _str, fret]]) => {
            const stringIndex = parseInt(strKey) - 1; // 0-based index
            if (stringIndex < 0 || stringIndex > 5) return;

            // --- ANIMATION LOGIC ---
            const stringEffects = options?.effects?.filter(e => e.string === stringIndex + 1);

            let currentFret = fret;
            let currentRadiusScale = 1;
            let currentAlpha = 1;
            let currentYOffset = 0;
            let currentXOffset = 0;
            let borderColor = this.colors.fingerBorderColor;

            const extraDraws: (() => void)[] = [];

            if (stringEffects) {
                stringEffects.forEach(effect => {
                    // 1. SLIDE
                    if (effect.type === 'slide' && effect.toFret !== undefined) {
                        const slideDist = (effect.toFret - currentFret) * this.fretWidth;
                        currentXOffset += slideDist * progress;
                    }

                    // 2. VIBRATO
                    else if (effect.type === 'vibrato') {
                        // Wiggle Y (perpendicular to string)
                        currentYOffset += Math.sin(progress * Math.PI * 10) * (this.stringSpacing * 0.2);
                    }

                    // 3. TAP
                    else if (effect.type === 'tap') {
                        // Attack (0 -> 0.2): Zoom In
                        if (progress < 0.2) {
                            currentRadiusScale *= progress * 5; // 0 to 1
                        }
                        // Sustain (0.2 -> 0.8): Hold
                        else if (progress < 0.8) {
                            currentRadiusScale *= 1;
                        }
                        // Release (0.8 -> 1.0): Fade out + Move Down
                        else {
                            const releaseProgress = (progress - 0.8) * 5; // 0 to 1
                            currentAlpha *= 1 - releaseProgress;
                            currentYOffset += releaseProgress * (this.stringSpacing * 0.5); // Move down
                        }
                    }

                    // 4. PULL-OFF
                    else if (effect.type === 'pull' && effect.toFret !== undefined) {
                        // Draw TARGET first (background)
                        // Note: Using a closure to capture the current state for the target might be needed if target also animates.
                        // For now, Pull target is static.
                        drawFinger(effect.toFret, stringIndex, this.colors.fingerColor, this.colors.fingerBorderColor, 1, 0.7);

                        // Animate CURRENT (remove zoom out)
                        if (progress > 0.5) {
                            const removeProgress = (progress - 0.5) * 2; // 0 to 1
                            currentRadiusScale *= 1 - removeProgress;
                            currentAlpha *= 1 - removeProgress;
                        }
                    }

                    // 5. HAMMER-ON
                    else if (effect.type === 'hammer' && effect.toFret !== undefined) {
                        // Draw TARGET (appearing later) - Schedule for AFTER main draw
                        extraDraws.push(() => {
                            if (progress > 0.3) {
                                const appearProgress = Math.min(1, (progress - 0.3) * 3);
                                drawFinger(effect.toFret as number, stringIndex, this.colors.fingerColor, this.colors.fingerBorderColor, appearProgress, appearProgress);
                            }
                        });
                        // Current note remains visible (drawn by main flow)
                    }

                    // 6. BEND
                    else if (effect.type === 'bend') {
                        const bendAmount = Math.sin(progress * Math.PI) * (this.stringSpacing * 0.5);
                        currentYOffset -= bendAmount;
                    }
                });
            }

            drawFinger(currentFret, stringIndex, this.colors.fingerColor, borderColor, currentRadiusScale, currentAlpha, currentYOffset, currentXOffset);

            // Finger Number (only if visible enough)
            if (finger > 0 && currentAlpha > 0.5 && currentRadiusScale > 0.5) {
                const drawX = (fret === 0 ? this.paddingX - (this.fretWidth * 0.3) : this.paddingX + (Math.max(0, fret) - 0.5) * this.fretWidth) + currentXOffset;
                const y = this.boardY + this.stringMargin + (stringIndex * this.stringSpacing) + currentYOffset;

                this.ctx.fillStyle = this.colors.fingerTextColor;
                // Scale font too
                this.ctx.font = `bold ${(this.stringSpacing * 0.35 * currentRadiusScale) * 1.5}px sans-serif`;
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";

                // DRAW TEXT WITHOUT FLIP/ROTATION
                this.ctx.save();
                this.ctx.translate(drawX, y);
                // Reverse mirror first if active
                if (this.mirror) this.ctx.scale(-1, 1);
                // Then reverse rotation
                if (this.rotation) this.ctx.rotate((-this.rotation * Math.PI) / 180);
                this.ctx.fillText(finger.toString(), 0, 0);
                this.ctx.restore();
            }
        });

        // Muted Strings (X)
        if (chord.avoid) {
            chord.avoid.forEach(strNum => {
                const stringIndex = strNum - 1;
                const y = this.boardY + this.stringMargin + (stringIndex * this.stringSpacing);
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
}

import { ChordDrawerBase } from "./chord-drawer-base";
import type { FretboardTheme } from "@/lib/types";
import { FretboardDrawer } from "./fretboard-drawer";
import type { Position, ChordDiagramProps, TabEffect } from "@/modules/core/domain/types";

export interface GuitarFretboardDrawerOptions {
    width: number;
    height: number;
    numFrets?: number;
    numStrings?: number;
    rotation?: 0 | 90 | 270;
    mirror?: boolean;
}

export class GuitarFretboardDrawer {
    private ctx: CanvasRenderingContext2D;
    private colors: FretboardTheme;
    private width: number;
    private height: number;
    private numFrets: number;
    private numStrings: number;


    // Geometry
    private paddingX = 40;
    private paddingY = 50; // Increased to make room for Chord Name above
    private fretWidth: number = 0;
    private stringSpacing: number = 0;
    private fretboardHeight: number = 0;
    private boardY: number = 0; // Top Y of the board
    private stringMargin: number = 0; // Vertical margin for strings
    private rotation: number = 0;
    private mirror: boolean = false;

    constructor(
        ctx: CanvasRenderingContext2D,
        colors: FretboardTheme,
        options: GuitarFretboardDrawerOptions
    ) {
        this.ctx = ctx;
        this.colors = colors;
        this.width = options.width;
        this.height = options.height;
        this.numFrets = options.numFrets || 15;
        this.numStrings = options.numStrings || 6;
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
        this.ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    public drawChord(chord: ChordDiagramProps, options?: { strumming?: string, effects?: TabEffect[], progress?: number, opacity?: number, style?: 'normal' | 'ghost' }) {
        // Draw fingers on top of board
        const positions = chord.positions;
        const progress = options?.progress ?? 0; // 0 to 1

        this.ctx.save();
        this.applyTransforms();

        // Helper to draw a finger/note
        // Helper to draw a finger/note
        // Helper to draw a finger/note
        const drawFinger = (fret: number, stringIndex: number, color: string, borderColor: string, radiusScale: number = 1, alpha: number = 1, yOffset: number = 0, xOffset: number = 0) => {

            // --- MODIFIED: Draw a barre from Bottom (User String 1 / Visual 6) up to Selected (Visual 6 - index) ---
            // User String 1 (Index 0) -> Visual String 6.
            // User String 6 (Index 5) -> Visual String 1.
            // Anchor is always Bottom (Visual 6). target is (6 - stringIndex).

            const x = this.paddingX + (Math.max(0, fret) - 0.5) * this.fretWidth + xOffset;
            // Adjust x for open strings (fret 0)
            const drawX = fret === 0
                ? this.paddingX - (this.fretWidth * 0.3)
                : x;

            // Invert Y calculation to match Barre logic (String 1 = Bottom / Visual Bottom)
            const y = this.boardY + this.stringMargin + ((this.numStrings - 1 - stringIndex) * this.stringSpacing) + yOffset;

            // Draw Finger Circle
            this.ctx.beginPath();
            this.ctx.fillStyle = this.hexToRgba(color, this.colors.fingerBackgroundAlpha * alpha);
            this.ctx.strokeStyle = this.hexToRgba(borderColor, alpha);
            this.ctx.globalAlpha = alpha;

            this.ctx.lineWidth = 2;

            const radius = this.stringSpacing * 0.45 * radiusScale;
            this.ctx.arc(drawX, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
        };

        // Detect Barre
        const barre = this.detectBarre(chord);

        if (barre) {
            // Draw the barre object using Inverted Logic (Anchor = Bottom String)
            // Logic: Draw from Visual Bottom (this.numStrings) up to the extent of the barre.
            // Assuming barre.toString is the highest string number (User's selection).
            // Visual target index = this.numStrings - barre.toString? 
            // Wait, previous logic: 6 - (barre.toString - 1). 
            // If toString=1, index=0. Target = 6 - 0 = 6 (out of bounds? DrawBarre takes 1-based?)
            // drawBarre takes 1-based? 
            // drawBarre implementation: `startStringIdx = fromString - 1`. If fromString=6, idx=5.
            // So logic was: Anchor at 6 (idx 5) -> correct.
            // Target: 6 - (barre.toString - 1).
            // Example: barre.toString=1 (High E). Idx=0. Target=6-0=6?
            // If I pass 6 to drawBarre, idx=5. (Bottom).
            // If I pass 1 to drawBarre, idx=0. (Top).
            // Previous code: `6 - (barre.toString - 1)`. 
            // if toString=6 (Bottom). 6-5=1. Draws 6 to 1. (Bottom to Top). Full barre. Correct.
            // if toString=1 (Top). 6-0=6. Draws 6 to 6. Single note barre at bottom?
            // User: "String 1 is explicitly defined as the *bottom-most* string".
            // If User String 1 = Bottom.
            // drawBarre coordinates: y1 = startStringIdx * spacing. (0 is Top).
            // So Visual String 0 is TOP. Visual String 5 is BOTTOM.
            // User String 1 -> Visual String 5.
            // User String 6 -> Visual String 0.

            // `drawFinger`: `(5 - stringIndex)`. 
            // If String 1 (idx 0) -> 5 (Bottom). Correct.
            // If String 6 (idx 5) -> 0 (Top). Correct.

            // `drawBarre` expects 1-based Visual Strings? Or 1-based Logic Strings?
            // `drawBarre(fret, fromString, toString)`
            // `const startStringIdx = fromString - 1;` 
            // It draws from `min(y1, y2)` to `max`.

            // If I want to draw from Bottom (Visual 6) to User Selected String.
            // User Selected String (e.g. 6 -> Top).
            // Visual Index for User 6 is 0. (Visual String 1).
            // Visual Index for User 1 is 5. (Visual String 6).

            // So `drawBarre(fret, this.numStrings, this.numStrings - (barre.toString - 1))`
            // If barre.toString=6 (User Top). -> `drawBarre(fret, 6, 6-(5) = 1)`. -> Draws 6 to 1. Correct.
            // If barre.toString=1 (User Bottom). -> `drawBarre(fret, 6, 6-(0) = 6)`. -> Draws 6 to 6. Correct.

            // So with numStrings:
            // Anchor = this.numStrings.
            // Target = this.numStrings - (barre.toString - 1).

            this.drawBarre(barre.fret, this.numStrings, this.numStrings - (barre.toString - 1), this.colors.fingerColor, options?.opacity ?? 1);
        }

        Object.entries(positions).forEach(([strKey, [finger, _str, fret]]) => {
            // console.log(strKey, [finger, _str, fret]);
            const stringIndex = parseInt(strKey) - 1; // 0-based index
            const stringNum = parseInt(strKey);

            if (stringIndex < 0 || stringIndex >= this.numStrings) return;

            // Skip if fret is undefined
            if (fret === undefined) return;

            // Check if this note is part of the barre
            const isBarreParts = barre && barre.fret === fret && stringNum >= barre.fromString && stringNum <= barre.toString;

            if (isBarreParts) {
                // Do NOT draw the individual circle
                return;
            }

            // --- ANIMATION LOGIC ---
            const stringEffects = options?.effects?.filter(e => e.string === stringIndex + 1);

            let currentFret = fret;
            let currentRadiusScale = 1;

            // Base alpha from options
            let baseAlpha = options?.opacity ?? 1;
            let borderColor = this.colors.fingerBorderColor; // Default definition

            if (options?.style === 'ghost') {
                baseAlpha *= 0.8; // Increased from 0.6 for better visibility
                borderColor = this.colors.fingerColor;
            }
            let currentAlpha = baseAlpha;

            let currentYOffset = 0;
            let currentXOffset = 0;

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

    /**
     * Detects the primary barre in a chord, prioritizing explicit `nut` properties.
     */
    private detectBarre(chord: ChordDiagramProps): { fret: number, finger: number, fromString: number, toString: number } | null {
        // We return a set of positions that form the barre, or simpler:
        // We need the range (fret, fromString, toString).
        // Reuse logic from ChordDrawerBase
        const { positions, nut } = chord;

        // console.log("[GuitarFretboardDrawer] Analyzing chord for barre:", positions);

        // 1. Explicit barre from `nut`
        if (nut && nut.vis && nut.pos > 0) {
            const [fromString, toString] = nut.str || [0, 0];
            // Removed check (toString > fromString) to allow single-note "barres" to force the pestana visual.
            return {
                fret: nut.pos,
                finger: nut.fin,
                fromString: fromString,
                toString: toString
            } as any;
        }

        // 2. Implicit detection
        // Group by fret
        const stringsByFret: { [fret: number]: number[] } = {};

        Object.entries(positions).forEach(([strKey, [finger, _str, fret]]) => {
            if (fret && fret > 0) { // Finger check? If user just selects notes, finger might be 0 or -1? 
                // If we want to force barre on multiple notes on same fret regardless of finger:
                const stringIndex = parseInt(strKey); // 1-based usually in positions keys '1'..'6'?
                // positions keys are '1', '2', ... '6'

                if (!stringsByFret[fret]) stringsByFret[fret] = [];
                stringsByFret[fret].push(stringIndex);
            }
        });

        // Find max span
        let bestBarre: { fret: number, fromString: number, toString: number } | null = null;
        let maxSpan = 0;

        for (const [fretStr, strings] of Object.entries(stringsByFret)) {
            if (strings.length >= 2) {
                // Check if they are sequential? 
                // Usually a regular barre covers all strings between min and max.
                // Even if some intermediate strings are not played (muted), the finger is physically barring them.
                // But visual barre usually connects the dots.
                const minStr = Math.min(...strings);
                const maxStr = Math.max(...strings);
                const span = maxStr - minStr; // simple count or distance?

                // Logic: If we have multiple notes on same fret, we treat as barre.
                // We prefer the one with most strings involved?
                if (strings.length > maxSpan) {
                    maxSpan = strings.length;
                    bestBarre = {
                        fret: parseInt(fretStr),
                        fromString: minStr,
                        toString: maxStr
                    };
                }
            }
        }

        if (bestBarre) {
            console.log("[GuitarFretboardDrawer] Detected Implicit Barre:", bestBarre);
        }
        return bestBarre as any;
    }

    private drawBarre(fret: number, fromString: number, toString: number, color: string, alpha: number) {
        // fromString and toString are 1-based indices (1..6)
        // Convert to 0-based for geometry
        const startStringIdx = fromString - 1;
        const endStringIdx = toString - 1;

        // Calculate Y positions
        const y1 = this.boardY + this.stringMargin + (startStringIdx * this.stringSpacing);
        const y2 = this.boardY + this.stringMargin + (endStringIdx * this.stringSpacing);

        const topY = Math.min(y1, y2);
        const height = Math.abs(y2 - y1);

        // X position
        const x = this.paddingX + (fret - 0.5) * this.fretWidth;

        // Visual Parameters
        const radius = this.stringSpacing * 0.45;
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

        // Border
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.hexToRgba(this.colors.fingerBorderColor, alpha);
        this.ctx.stroke();

        console.log(`[GuitarFretboardDrawer] Drawn Barre at Fret ${fret}, Strings ${fromString}-${toString}`);
    }

    public drawChordName(name: string) {
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
        const opacity = this.colors.chordNameOpacity ?? 1;

        // Glow/Shadow effect
        if (this.colors.chordNameShadow) {
            this.ctx.shadowColor = this.colors.chordNameShadowColor || color;
            this.ctx.shadowBlur = this.colors.chordNameShadowBlur || 10;
        } else {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = "transparent";
        }

        this.ctx.fillStyle = this.hexToRgba(color, opacity);

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

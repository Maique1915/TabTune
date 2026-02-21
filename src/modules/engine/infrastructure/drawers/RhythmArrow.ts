
import type { FretboardTheme } from "@/modules/core/domain/types";

export class RhythmArrow {
    /**
     * Calculates the geometric properties of an arrow based on scale and pulse.
     */
    static getDimensions(scale: number = 1.0, pulse: number = 1.0) {
        const baseSize = 350 * scale * pulse;
        const h = baseSize * 0.9;
        const w = h * 0.35; // Slimmer arrows (0.35 ratio)

        return {
            baseSize,
            w,
            h
        };
    }

    static draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        direction: 'up' | 'down' | 'pause' | 'mute',
        label: string,
        isMuted: boolean,
        isActive: boolean,
        pulse: number,
        scale: number = 1.0,
        theme?: FretboardTheme
    ) {
        const dims = this.getDimensions(scale, pulse);
        const { w, h, baseSize } = dims;

        ctx.save();
        ctx.translate(x, y);

        // Map theme properties
        const arrowTheme = theme?.arrows;
        const fingersTheme = theme?.fingers;

        const baseColor = arrowTheme?.color || fingersTheme?.color || '#E67E22';
        const textColor = arrowTheme?.textColor || fingersTheme?.textColor || '#000000';

        const shadowColor = arrowTheme?.shadow?.color || fingersTheme?.shadow?.color || '#00f7ff80';
        const shadowEnabled = (arrowTheme?.shadow?.enabled !== false && fingersTheme?.shadow?.enabled !== false);
        const shadowBlur = arrowTheme?.shadow?.blur ?? fingersTheme?.shadow?.blur ?? 15;
        const shadowOffsetX = arrowTheme?.shadow?.offsetX ?? fingersTheme?.shadow?.offsetX ?? 0;
        const shadowOffsetY = arrowTheme?.shadow?.offsetY ?? fingersTheme?.shadow?.offsetY ?? 0;

        const finalOpacity = 1.0; // Always opaque for high contrast
        ctx.globalAlpha = finalOpacity;

        if (shadowEnabled) {
            ctx.shadowBlur = shadowBlur * scale * pulse;
            ctx.shadowColor = shadowColor;
            ctx.shadowOffsetX = shadowOffsetX * scale;
            ctx.shadowOffsetY = shadowOffsetY * scale;
        } else {
            ctx.shadowColor = 'transparent';
        }

        ctx.fillStyle = baseColor;

        // --- DRAWING LOGIC ---

        // Variables for Label Positioning
        let labelX = 0;

        if (direction === 'mute') {
            // "Abafado" Symbol: Adjusted Half-Arrow + Chevrons
            // Using proportions from the full arrow for consistency:
            // xShaft = w * 0.25, xWing = w * 0.5
            const xShaftHalf = w * 0.25;
            const xWingTip = w * 0.5;

            // Coordinates for Arrow Polygon (Left part of the group)
            // Aligned such that Right Edge of Shaft is at x=0 (the center of the full arrow)
            const xShaftRight = 0;
            const xShaftLeft = -xShaftHalf;
            const xBevelTip = -xWingTip;

            // Label Positioning Update
            labelX = xShaftLeft / 2; // Center label in the mute arrow shaft

            // Y Coordinates (Consistent with full arrow)
            const yTop = -h * 0.5;
            const yBottom = h * 0.5;
            const yBevelTip = yTop + (h * 0.6875);
            const yInnerCorner = yTop + (h * 0.75);

            // Draw Motifs (Chevrons) - BEHIND
            // Positioned to the Right of the Shaft
            const chevronGap = xShaftHalf * 0.8;
            const cx = xShaftRight + chevronGap;
            const chevronSize = xShaftHalf * 1.5; // Slightly larger for better visibility

            // Draw Chevron Helper
            const drawChevron = (cx: number, cy: number, size: number) => {
                const half = size / 2;
                const arm = size * 0.35;
                const tipOffset = -half; // Pointing Left (<) towards the arrow

                // Points relative to cx, cy
                ctx.beginPath();
                ctx.moveTo(cx, cy - half);
                ctx.lineTo(cx + tipOffset, cy); // Tip
                ctx.lineTo(cx, cy + half);
                ctx.lineTo(cx + tipOffset - (tipOffset * 0.7), cy + half - arm);
                ctx.lineTo(cx + tipOffset - (tipOffset * 0.9), cy);
                ctx.lineTo(cx + tipOffset - (tipOffset * 0.7), cy - half + arm);
                ctx.closePath();

                ctx.fillStyle = baseColor;
                ctx.fill();
                strokeBorder(ctx, scale, arrowTheme, fingersTheme);
            };

            // 4 Chevrons
            const startCY = -h * 0.375;
            const stepCY = h * 0.25;
            const tipOffset = 10;
            drawChevron(cx + tipOffset, startCY, chevronSize);
            drawChevron(cx + tipOffset, startCY + stepCY, chevronSize);
            drawChevron(cx + tipOffset, startCY + stepCY * 2, chevronSize);
            drawChevron(cx + tipOffset, startCY + stepCY * 3, chevronSize);

            // Draw Updated Arrow Polygon (On Top)
            ctx.beginPath();
            ctx.moveTo(xShaftRight, yTop);       // p1
            ctx.lineTo(xShaftRight, yBottom);    // p2
            ctx.lineTo(xBevelTip, yBevelTip);    // p4
            ctx.lineTo(xShaftLeft, yInnerCorner);// p5
            ctx.lineTo(xShaftLeft, yTop);        // p6
            ctx.closePath();

            ctx.fill();
            strokeBorder(ctx, scale, arrowTheme, fingersTheme);
        }
        else if (direction === 'pause') {
            // Leave empty space as requested
        }
        else {
            // UP / DOWN (Full Symmetric Arrow)
            if (direction === 'up') ctx.rotate(Math.PI);

            const yTop = -h / 2;
            const yBottom = h / 2;
            const yWingTip = yTop + (h * 0.6875);
            const yShaftJoin = yTop + (h * 0.75);
            const xShaft = w * 0.25;
            const xWing = w * 0.5;

            ctx.beginPath();
            ctx.moveTo(xShaft, yTop);
            ctx.lineTo(xShaft, yShaftJoin);
            ctx.lineTo(xWing, yWingTip);
            ctx.lineTo(0, yBottom);
            ctx.lineTo(-xWing, yWingTip);
            ctx.lineTo(-xShaft, yShaftJoin);
            ctx.lineTo(-xShaft, yTop);
            ctx.closePath();

            ctx.fill();
            strokeBorder(ctx, scale, arrowTheme, fingersTheme);

            if (direction === 'up') ctx.rotate(-Math.PI);
        }


        // --- LABEL ---
        if (label && direction !== 'pause') {
            ctx.shadowBlur = 0;
            ctx.fillStyle = textColor;

            // Dynamic Font Sizing
            // Fixed font size relative to base logic units (ignoring accent scale/pulse)
            let fontSize = 40;

            // Calculate constraint based on Reference Arrow (Scale 1.0, Pulse 1.0)
            const refDims = RhythmArrow.getDimensions(1.0, 1.0);
            const refW = refDims.w; // Width of a full-scale arrow

            // Determine maximum width available in a "Full Size" arrow shaft
            let refShaftWidthForLabel = refW * 0.5; // Default for full arrow
            if (direction === 'mute') {
                refShaftWidthForLabel = refW * 0.35;
            }

            // Check if label fits in the Reference Shaft Width
            ctx.font = `bold ${fontSize}px Inter, sans-serif`;
            const textWidth = ctx.measureText(label.toUpperCase()).width;
            const maxWidth = refShaftWidthForLabel * 0.9;

            if (textWidth > maxWidth) {
                // Calculate scaled down size to fit in the Reference Arrow
                const ratio = maxWidth / textWidth;
                fontSize = Math.floor(fontSize * ratio);
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;
            }

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let labelY = 0;
            if (direction === 'down') labelY = -10 * scale;
            if (direction === 'up') labelY = 10 * scale;
            if (direction === 'mute') labelY = 0;

            ctx.fillText(label.toUpperCase(), labelX, labelY);
        }

        // --- MUTE CROSS ---
        if (isMuted) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.strokeStyle = isActive ? '#ff3232' : '#ff3232'; // Always opaque red
            ctx.lineWidth = 15 * scale;
            const cS = baseSize * 0.6;
            ctx.beginPath();
            ctx.moveTo(-cS / 2, -cS / 2); ctx.lineTo(cS / 2, cS / 2);
            ctx.moveTo(cS / 2, -cS / 2); ctx.lineTo(-cS / 2, cS / 2);
            ctx.stroke();
        }

        ctx.restore();
    }
}

function strokeBorder(ctx: CanvasRenderingContext2D, scale: number, arrowTheme: any, fingersTheme: any) {
    const isEnabled = arrowTheme?.border?.enabled ?? (arrowTheme?.border?.width > 0);
    if (isEnabled) {
        const borderWidth = arrowTheme?.border?.width || 4; // Constant default width
        ctx.strokeStyle = arrowTheme?.border?.color || fingersTheme?.border?.color || '#ffffff';
        ctx.lineWidth = borderWidth * scale;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

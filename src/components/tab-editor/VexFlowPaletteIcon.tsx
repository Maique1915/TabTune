
import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Formatter, Voice, KeySignature, TimeSignature, Clef } from 'vexflow';

interface VexFlowPaletteIconProps {
    type: 'clef' | 'key' | 'time';
    value: string;
    width?: number;
    height?: number;
    scale?: number;
    className?: string;
    fillColor?: string;
    isSelected?: boolean;
    hideStaveLines?: boolean;
    clef?: string;
}

export const VexFlowPaletteIcon: React.FC<VexFlowPaletteIconProps> = ({
    type,
    value,
    width = 60,
    height = 50,
    scale = 1,
    className = "",
    fillColor = '#e4e4e7', // zinc-200
    isSelected = false,
    hideStaveLines = false,
    clef
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Internal rendering dimensions (Fixed "canvas" size to contain symbols)
        const VIEWBOX_WIDTH = 120;
        const VIEWBOX_HEIGHT = 100;

        // Create Renderer
        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        renderer.resize(VIEWBOX_WIDTH, VIEWBOX_HEIGHT);

        const context = renderer.getContext();
        // REMOVED context scaling to simplify coordinate logic. We zoom via viewBox.
        // context.scale(scale, scale); 

        // Apply styles
        const activeColor = isSelected ? '#22d3ee' : fillColor; // Cyan-400 for active
        context.setFillStyle(activeColor);
        context.setStrokeStyle(activeColor);

        // Center the stave in the fixed 120x100 box
        // Unscaled width matches viewbox
        const staveWidth = VIEWBOX_WIDTH;

        // Fixed centered position optimized for Treble Clef and generally tall symbols
        // Box height 100. Center 50.
        // Stave top line at 30 lets it extend up to ~0 and down to ~70+
        const staveY = 30;

        // Only render lines if NOT hidden. VexFlow 3/4 doesn't support num_lines: 0 cleanly in all versions but we try config.
        // Alternatively, we rely on transparency.
        const stave = new Stave(0, staveY, staveWidth, { num_lines: hideStaveLines ? 0 : 5 });

        // Hide start/end barlines for a cleaner icon look
        if (hideStaveLines) {
            stave.setBegBarType(0); // Barline.type.NONE
            stave.setEndBarType(0); // Barline.type.NONE
        }

        try {
            // Render Stave first
            stave.setContext(context);
            // Stave lines color (fainter or transparent)
            const linesColor = hideStaveLines ? '#00000000' : (isSelected ? '#22d3ee40' : '#ffffff20');
            stave.setStyle({ fillStyle: linesColor, strokeStyle: linesColor });
            stave.draw();

            // Render the specific symbol
            if (type === 'clef') {
                // For clefs, we add the clef to the stave
                // value = 'treble', 'bass', 'alto', 'tenor', 'percussion', 'tab'
                if (value === 'tab') {
                    stave.addClef('tab');
                } else {
                    stave.addClef(value);
                }
                // Redraw stave with clef
                stave.draw();
            }
            else if (type === 'key') {
                // For key signature, we need a clef context usually (default treble)
                // We'll render a key signature modifier
                // value = 'C', 'G', 'F', 'Am', etc. VexFlow takes key spec like 'G', 'F#', 'Bb'

                // ADDED: Always add a clef for context so the key signature renders in the correct Y positions
                // Use the passed clef prop or default to treble
                const clefToUse = clef || 'treble';
                if (clefToUse !== 'tab') {
                    stave.addClef(clefToUse);
                }

                const ks = new KeySignature(value);
                // Manually position or add to stave?
                // StaveModifier approach:
                stave.addModifier(ks);
                stave.draw();
            }
            else if (type === 'time') {
                // value = '4/4', '3/4', 'C', 'C|'
                const ts = new TimeSignature(value);
                // TimeSignature usually needs padding from start, usually automatic if part of stave
                // We add it to stave
                stave.addTimeSignature(value);
                stave.draw();
            }

            // Repaint the symbols with the correct active color (Stave modifiers default to black often)
            const svg = containerRef.current.querySelector('svg');
            if (svg) {
                // Post-process SVG elements to ensure color match (VexFlow styles can be tricky on individual modifiers)
                const paths = svg.querySelectorAll('path');
                paths.forEach(p => {
                    const cls = p.getAttribute('class') || '';

                    // SAFETY CHECK: If the element is already explicitly transparent/none stroke, DO NOT recolor it.
                    const existingStroke = p.getAttribute('stroke');
                    if (existingStroke && (existingStroke === 'none' || existingStroke === '#00000000' || existingStroke === 'transparent')) {
                        return;
                    }

                    // Don't recolor stave lines if we want them faint, but VexFlow draws everything as paths
                    // Stave lines are usually long horizontal paths
                    const d = p.getAttribute('d') || '';
                    // Updated heuristic for Stave Lines:
                    const isLine = d.indexOf('H') !== -1 || (d.indexOf('L') !== -1 && d.indexOf('M') !== -1 && d.length < 200);

                    // If hidden lines requested, be aggressive about NOT coloring lines
                    if (hideStaveLines && isLine) {
                        p.style.display = 'none';
                        return;
                    }

                    if (!isLine) {
                        p.setAttribute('fill', activeColor);
                        p.setAttribute('stroke', activeColor);
                    }
                });

                // Responsiveness & ZOOM Logic
                svg.style.width = '100%';
                svg.style.height = '100%';

                // Calculate Scaled ViewBox (Zoom into the center)
                // Content Center based on user feedback (roughly x=20, y=88)
                const CONTENT_CENTER_X = 20;
                const CONTENT_CENTER_Y = 88;

                const vw = VIEWBOX_WIDTH / scale;
                const vh = VIEWBOX_HEIGHT / scale;

                const vx = CONTENT_CENTER_X - (vw / 2);
                const vy = CONTENT_CENTER_Y - (vh / 2);

                svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            }

        } catch (e) {
            console.error(`VexFlowPaletteIcon error (${type}/${value}):`, e);
        }

    }, [type, value, width, height, scale, fillColor, isSelected, hideStaveLines, clef]);

    return <div ref={containerRef} className={`flex items-center justify-center ${className}`} style={{ width, height }} />;
};

import React, { useEffect, useRef } from 'react';
import { Renderer, StaveNote, Formatter, Stave, Voice } from 'vexflow';

interface VexFlowIconProps {
    duration: string;
    type?: 'note' | 'rest';
    className?: string; // Allow external sizing via CSS
    fillColor?: string;
}

export const VexFlowRhythmIcon: React.FC<VexFlowIconProps> = ({
    duration,
    type = 'note',
    className = "w-10 h-14", // Default size class
    fillColor = '#ffffff'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Internal rendering dimensions (VexFlow units)
        const VIEWBOX_WIDTH = 70;
        const VIEWBOX_HEIGHT = 100;

        // Create Renderer
        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        renderer.resize(VIEWBOX_WIDTH, VIEWBOX_HEIGHT);

        const context = renderer.getContext();

        // Clear and prepare context
        context.setFillStyle(fillColor);
        context.setStrokeStyle(fillColor);

        // Map duration to VexFlow format
        const vfDuration = duration;

        const noteStruct = {
            keys: ['b/4'], // Center line
            duration: vfDuration + (type === 'rest' ? 'r' : ''),
            align_center: true,
            clef: 'treble'
        };

        try {
            const note = new StaveNote(noteStruct);

            // Apply styles
            note.setStyle({ fillStyle: fillColor, strokeStyle: fillColor });
            if (note.getStem()) {
                note.getStem()!.setStyle({ fillStyle: fillColor, strokeStyle: fillColor });
            }

            // Create a stave but don't draw it - just use it for relative positioning
            const stave = new Stave(0, 0, VIEWBOX_WIDTH);

            // Adjust stave Y to center note head at VIEWBOX_HEIGHT / 2
            // b/4 is on the middle stave line. The stave height is 40 units (5 lines * 10).
            // Middle is at stave.getY() + 20.
            const staveY = (VIEWBOX_HEIGHT / 2) - 50;
            stave.setY(staveY);

            // Format - centered
            const voice = new Voice({ numBeats: 1, beatValue: 4 });
            voice.setStrict(false);
            voice.addTickables([note]);

            // Center the note head horizontally
            new Formatter().joinVoices([voice]).format([voice], VIEWBOX_WIDTH);

            note.setStave(stave);
            note.setContext(context).draw();

            // Force SVG to be responsive and CLEAN
            const svg = containerRef.current.querySelector('svg');
            if (svg) {
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svg.setAttribute('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`);

                // Hide any paths that look like stave lines if they were accidentally drawn
                // (though stave.draw() is not called, some versions draw some lines)
                const paths = svg.querySelectorAll('path');
                paths.forEach(p => {
                    const d = p.getAttribute('d');
                    // VexFlow stave lines are usually straight horizontal paths
                    // We can't easily detect them, but since stave.draw() isn't called,
                    // we should be fine. If lines still appear, we might need more aggressive filtering.
                });
            }

        } catch (e) {
            console.error("VexFlowIcon Render Error:", e);
        }

    }, [duration, type, fillColor]);

    return <div ref={containerRef} className={`flex items-center justify-center ${className}`} />;
};


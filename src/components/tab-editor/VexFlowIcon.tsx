import React, { useEffect, useRef } from 'react';
import { Renderer, StaveNote, Formatter, Stave, Voice } from 'vexflow';

interface VexFlowIconProps {
    duration: string;
    type?: 'note' | 'rest';
    className?: string; // Allow external sizing via CSS
    fillColor?: string;
}

const VexFlowIcon: React.FC<VexFlowIconProps> = ({
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
        // A standard note with stem fits comfortably in ~60x100 box
        const VIEWBOX_WIDTH = 70;
        const VIEWBOX_HEIGHT = 100;

        // Create Renderer
        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        // We set the "native" size of the SVG to our internal viewport
        // The CSS className will control the actual displayed size
        renderer.resize(VIEWBOX_WIDTH, VIEWBOX_HEIGHT);

        const context = renderer.getContext();

        // Scale down the drawing slightly to leave padding
        context.scale(0.85, 0.85);

        // Note: 'translate' might not be available on all VexFlow RenderContexts types
        // We will adjust Stave positions to achieve "padding"

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

            // Layout
            // We shift the Stave to simulate padding (x=5, y adjusted)
            // (5 units shift accounts for the lack of translate(5,5))
            const stave = new Stave(5, 0, VIEWBOX_WIDTH);

            // Positioning vertical center
            // Approx middle of 100px height. 
            // Stave top line default is y=0. b/4 is center.
            // We push stave down so b/4 aligns with middle of VIEWBOX_HEIGHT
            // +5 for the top padding simulation
            const staveY = (VIEWBOX_HEIGHT / 2) - 50 + 5;
            stave.setY(staveY);

            // Format
            const voice = new Voice({ numBeats: 1, beatValue: 4 });
            voice.setStrict(false);
            voice.addTickables([note]);

            new Formatter().joinVoices([voice]).format([voice], VIEWBOX_WIDTH);

            note.setStave(stave);
            note.setContext(context).draw();

            // Force SVG to be responsive within the container
            const svg = containerRef.current.querySelector('svg');
            if (svg) {
                // Ensure the SVG stretches to fill the container defined by className
                svg.style.width = '100%';
                svg.style.height = '100%';
                // Preserve aspect ratio to avoid distortion (this was the user's main issue)
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svg.setAttribute('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`);
            }

        } catch (e) {
            console.error("VexFlowIcon Render Error:", e);
        }

    }, [duration, type, fillColor]);

    return <div ref={containerRef} className={`flex items-center justify-center ${className}`} />;
};

export default VexFlowIcon;

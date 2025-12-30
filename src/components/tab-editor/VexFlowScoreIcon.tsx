'use client';

import React, { useEffect, useRef } from 'react';

export interface VexFlowIconProps {
    width?: number;
    height?: number;
    staveWidth?: number;
    clef?: string;
    keys?: string[];
    duration?: string;
    isRest?: boolean;
    [key: string]: any;
}

export const VexFlowIcon: React.FC<VexFlowIconProps> = ({
    width = 60,
    height = 50,
    staveWidth = 60,
    clef,
    keys = ['c/4'],
    duration = 'q',
    isRest = false,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined' || !(window as any).Vex) return;

        const Vex = (window as any).Vex;
        const { Renderer, Stave, StaveNote, Formatter, Accidental } = Vex.Flow;

        // Clear previous
        containerRef.current.innerHTML = '';

        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();

        // Minimal Stave (centered vertically roughly)
        // height is 50, Stave lines take about 40px space.
        const staveY = (height - 40) / 2;
        const stave = new Stave(0, 0, staveWidth);

        // Remove start/end lines for cleaner icon look
        stave.setContext(context);
        stave.draw();

        if (clef) {
            const clefNote = new StaveNote({ keys: ["b/4"], duration: "1r" });
            clefNote.addModifier(new Vex.Flow.ClefNote(clef), 0);
            // Just draw clef? Or use addClef on stave?
            // If using standard stave.addClef, it puts it at start.
        }

        const notes = [];
        // Construct the note
        // handle rest notation
        const durationString = isRest ? duration + 'r' : duration;

        if (keys && keys.length > 0) {
            const note = new StaveNote({
                keys: keys,
                duration: durationString,
                auto_stem: true
            });

            // Add accidentals if detected in keys (e.g. "c#/4")
            keys.forEach((key, index) => {
                if (key.includes('#')) note.addAccidental(index, new Accidental('#'));
                if (key.includes('b') && !key.includes('bb')) note.addAccidental(index, new Accidental('b'));
            });

            // Style it white/light for the timeline clip visual
            note.setStyle({ fillStyle: '#e2e8f0', strokeStyle: '#e2e8f0' });

            notes.push(note);

            Formatter.FormatAndDraw(context, stave, notes);
        }

    }, [width, height, staveWidth, clef, keys, duration, isRest]);

    return (
        <div ref={containerRef} className="vexflow-icon pointer-events-none" />
    );
};

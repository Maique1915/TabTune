"use client";

import React, { useRef, useState } from 'react';
import { useTabEditorStore } from '@/stores/tab-editor-store';
import { cn } from '@/lib/utils'; // Assuming standard utils from Next.js setup

export function TabCanvas() {
    const { currentNotes, addNote, removeNote, timeSignature } = useTabEditorStore();
    const [hoverPosition, setHoverPosition] = useState<{ str: number, pos: number } | null>(null);

    // Constants for drawing
    const STRING_COUNT = 6;
    const SUBDIVISIONS = timeSignature[0] * 4; // e.g., 4 beats * 4 semiquavers = 16 slots

    const handleGridClick = (stringIndex: number, positionIndex: number) => {
        const existingNote = currentNotes.find(
            n => n.string === stringIndex + 1 && n.position === positionIndex
        );

        if (existingNote) {
            removeNote(stringIndex + 1, positionIndex);
        } else {
            // Default to fret 0 used as placeholder, user would type number normally
            // For this interaction let's prompt or cycle? 
            // Simplified: Click to add "0", then maybe allow editing value?
            // Let's just add '0' for now and assume input handling later
            const fret = prompt("Digite a casa (0-24):", "0");
            if (fret !== null) {
                const fretNum = parseInt(fret);
                if (!isNaN(fretNum) && fretNum >= 0 && fretNum <= 24) {
                    addNote({
                        string: stringIndex + 1,
                        position: positionIndex,
                        fret: fretNum
                    });
                }
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative bg-card p-6 md:p-8 rounded-2xl shadow-2xl border-4 border-border/20 min-w-[300px] max-w-[400px] w-full aspect-[3/4] flex flex-col justify-between">
                {/* Visual Header Fretboard Top */}
                <div className="absolute top-0 left-0 w-full h-2 bg-muted rounded-t-sm z-10" />

                {/* Strings with Notes */}
                <div className="flex flex-col justify-between h-full relative py-4">
                    {[...Array(STRING_COUNT)].map((_, i) => (
                        <div key={i} className="w-full h-[2px] bg-muted-foreground/30 relative flex items-center group-hover:bg-muted-foreground/50 transition-colors">
                            {/* String Labels (E A D G B e) - could be added if needed, maybe at top/bottom */}
                        </div>
                    ))}

                    {/* Grid Interaction Layer */}
                    <div className="absolute inset-x-0 top-4 bottom-4 grid" style={{ gridTemplateColumns: `repeat(${SUBDIVISIONS}, 1fr)`, gridTemplateRows: `repeat(${STRING_COUNT}, 1fr)` }}>
                        {[...Array(STRING_COUNT)].map((_, strIdx) => (
                            <React.Fragment key={strIdx}>
                                {[...Array(SUBDIVISIONS)].map((_, posIdx) => {
                                    const note = currentNotes.find(n => n.string === strIdx + 1 && n.position === posIdx);

                                    // Only show active notes for this "Chord Card" view style to mimic the input image
                                    // For a full editor we might want the grid visible, but for now let's make it cleaner

                                    return (
                                        <div
                                            key={`${strIdx}-${posIdx}`}
                                            className="relative cursor-pointer z-10"
                                            onClick={() => handleGridClick(strIdx, posIdx)}
                                        >
                                            {/* Note Display */}
                                            {note && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white bg-transparent flex items-center justify-center text-sm font-bold text-white shadow-sm z-20">
                                                    {note.fret}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Vertical Frets/Grid Lines - Stylized */}
                    <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-0.5 h-full bg-muted-foreground/20" />
                        ))}
                    </div>
                </div>

                {/* Markers */}
                <div className="absolute bottom-1 left-4 text-primary font-bold text-xs opacity-50">X</div>
                <div className="absolute bottom-1 right-4 text-primary font-bold text-xs opacity-50">X</div>
            </div>
        </div>
    );
}

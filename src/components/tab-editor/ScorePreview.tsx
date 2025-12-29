"use client";

import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ScoreStyle, MeasureData } from '@/lib/tab-editor/types';
import { getNoteKeyFromFret } from '@/lib/tab-editor/utils/musicMath';

interface ScorePreviewProps {
    code: string; // Kept for interface compatibility but largely unused now
    measures: MeasureData[];
    timeSignature: string;
    playbackPosition: number;
    isPlaying: boolean;
    style: ScoreStyle;
    showControls?: boolean;
}

declare global {
    interface Window {
        Vex: any;
        VexTab: any; // Kept to avoid breaking global types if used elsewhere
    }
}

const MeasureThumbnail = memo(({
    measureData,
    measureIndex,
    isActive,
    progress,
    style,
    shouldAnimate,
    timeSignatureStr
}: {
    measureData: MeasureData;
    measureIndex: number;
    isActive: boolean;
    progress: number;
    style: ScoreStyle;
    shouldAnimate: boolean;
    timeSignatureStr: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [renderError, setRenderError] = useState<string | null>(null);

    const draw = () => {
        const container = containerRef.current;
        if (!container || !window.Vex) return;

        container.innerHTML = '';
        // Explicitly set background on container (NoteForge style)
        container.style.backgroundColor = style.background || '#09090b';

        // NoteForge-compatible styling helper
        const applyStyles = (obj: any, color: string, bg: string = 'transparent') => {
            if (!obj) return;
            const styleOpts = {
                fillStyle: color,
                strokeStyle: color,
                backgroundColor: bg
            };

            if (obj.setStyle) obj.setStyle(styleOpts);
            if (obj.setStemStyle) obj.setStemStyle({ strokeStyle: color });

            if (obj.modifiers) {
                obj.modifiers.forEach((m: any) => applyStyles(m, color, bg));
            }
        };

        try {
            const { Renderer, Stave, StaveNote, TabStave, TabNote, Formatter, Dot } = window.Vex.Flow;

            const renderer = new Renderer(container, Renderer.Backends.SVG);
            renderer.resize(800, 340);
            const context = renderer.getContext();
            context.setFillStyle('transparent');

            // Determine what staves to show based on global settings (implicit or explicit in data)
            // For now assuming we show both if data exists, or based on 'notation=true' equivalent logic
            // Since we moved away from string parsing, we'll default to showing both unless tailored.
            // NoteForge shows both by default in 'both' mode.
            const showNotation = true;
            const showTab = true;

            let x = 10;
            const width = 780;

            // --- NOTATION STAVE ---
            if (showNotation) {
                const stave = new Stave(x, 40, width);

                // Add Modifiers if needed
                if (measureData.showClef || measureIndex === 0) {
                    stave.addClef('treble');
                }
                if (measureData.showTimeSig || measureIndex === 0) {
                    stave.addTimeSignature(timeSignatureStr || '4/4');
                }

                // Style Stave Modifiers
                const mods = stave.getModifiers();
                mods.forEach((mod: any) => {
                    const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                    let color = style.notes; // Default fallback

                    if (category.includes('clef')) color = style.clefs || style.notes;
                    else if (category.includes('timesignature') || category.includes('time')) color = style.timeSignature || style.notes;
                    else if (category.includes('keysignature') || category.includes('key')) color = style.symbols || style.notes;
                    else if (category.includes('barline')) color = style.staffLines || style.notes;

                    applyStyles(mod, color, style.background || 'transparent');
                });

                stave.setContext(context);
                stave.setStyle({ strokeStyle: style.staffLines || '#555', fillStyle: style.staffLines || '#555' });
                stave.draw();

                // Generate Notes
                const notes = measureData.notes.map(note => {
                    if (note.type === 'rest') {
                        const sn = new StaveNote({
                            keys: ["b/4"],
                            duration: note.duration + "r"
                        });
                        applyStyles(sn, style.rests || style.notes, style.background || 'transparent');
                        return sn;
                    } else {
                        // Calculate key
                        const key = getNoteKeyFromFret(parseInt(note.fret), parseInt(note.string));
                        const sn = new StaveNote({
                            keys: [key],
                            duration: note.duration
                        });

                        // Handle dots if needed (simple check for now)
                        if (note.duration.includes('d')) {
                            Dot.buildAndAttach([sn], { all: true });
                        }

                        applyStyles(sn, style.notes, style.background || 'transparent');
                        return sn;
                    }
                });

                if (notes.length > 0) {
                    Formatter.FormatAndDraw(context, stave, notes);
                }
            }

            // --- TABLATURE STAVE ---
            if (showTab) {
                const yOffset = showNotation ? 150 : 40;
                const tabStave = new TabStave(x, yOffset, width);

                if (measureData.showClef || measureIndex === 0) {
                    tabStave.addTabGlyph();
                }

                // Style Tab Modifiers (TabGlyph)
                const mods = tabStave.getModifiers();
                mods.forEach((mod: any) => {
                    // Tab glyph usually considered 'clef' or 'tabglyph'
                    applyStyles(mod, style.clefs || style.notes, style.background || 'transparent');
                });

                tabStave.setContext(context);
                tabStave.setStyle({ strokeStyle: style.staffLines || '#555', fillStyle: style.staffLines || '#555' });
                tabStave.draw();

                const tabNotes = measureData.notes.map(note => {
                    if (note.type === 'rest') {
                        // VexFlow TabRest... or just hidden positions?
                        // NoteForge uses TabNote with position 'X' for rests usually or similar hack
                        // Simplest: 
                        return new TabNote({
                            positions: [{ str: 3, fret: 'X' }], // Dummy position for rest visualization
                            duration: note.duration + "r"
                        });
                    } else {
                        const tn = new TabNote({
                            positions: [{ str: parseInt(note.string), fret: parseInt(note.fret) }],
                            duration: note.duration
                        });
                        return tn;
                    }
                });

                // Style Tab Notes
                tabNotes.forEach((tn: any) => {
                    // Check if rest
                    const isRest = tn.isRest();
                    const color = isRest ? (style.rests || style.notes) : (style.tabNumbers || style.notes);
                    applyStyles(tn, color, style.background || 'transparent');
                });

                if (tabNotes.length > 0) {
                    Formatter.FormatAndDraw(context, tabStave, tabNotes);
                }
            }

            setRenderError(null);

        } catch (e: any) {
            console.error("VexFlow Render Error", e);
            setRenderError(e.message || "Render Error");
        }
    };

    useEffect(() => { draw(); }, [measureData, style, shouldAnimate, timeSignatureStr]);

    return (
        <div
            className="rounded-[3.5rem] shadow-[0_80px_160px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 relative flex items-center justify-center min-h-[310px]"
            style={{ backgroundColor: style.background }}
        >
            <style>
                {`
                  .score-canvas-viewport svg rect[fill="white"],
                  .score-canvas-viewport svg rect[fill="#ffffff"] {
                    fill: ${style.background || '#09090b'} !important;
                  }
                `}
            </style>

            <div
                ref={containerRef}
                className="score-canvas-viewport w-full h-full flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: renderError ? 0.2 : 1 }}
            />

            {/* Playhead Overlay */}
            {isActive && !renderError && (
                <div
                    className="absolute top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10 pointer-events-none transition-transform will-change-transform"
                    style={{ left: `${progress}%` }}
                />
            )}
        </div>
    );
});

const ScorePreview: React.FC<ScorePreviewProps> = ({
    code,
    playbackPosition,
    isPlaying,
    style,
    measures,
    showControls = true,
    timeSignature
}) => {
    // Current Measure Calculation
    // We assume 'measures' maps 1:1 to 'rawMeasureCodes' logic from before

    // Safety check
    const safeMeasures = measures || [];

    const currentMeasureIndex = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const idx = Math.floor((playbackPosition / 100) * safeMeasures.length);
        return Math.min(idx, safeMeasures.length - 1);
    }, [playbackPosition, safeMeasures.length]);

    const measureProgress = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const measureWeight = 100 / safeMeasures.length;
        return ((playbackPosition % measureWeight) / measureWeight) * 100;
    }, [playbackPosition, safeMeasures.length]);

    const shouldAnimate = currentMeasureIndex === 0 || currentMeasureIndex === safeMeasures.length - 1;
    const activeMeasureData = safeMeasures[currentMeasureIndex];

    if (!activeMeasureData) return null;

    return (
        <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />
            <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative">
                <div className="w-full max-w-5xl relative h-[310px]">
                    {safeMeasures.map((measure, idx) => (
                        idx === currentMeasureIndex && (
                            <div
                                key={`${measure.id || idx}-${style.transitionType}-${timeSignature}`}
                                className={`absolute inset-0 w-full ${shouldAnimate ? `score-animation-${style.transitionType}` : ''}`}
                            >
                                <MeasureThumbnail
                                    measureData={measure}
                                    measureIndex={idx}
                                    isActive={isPlaying}
                                    progress={measureProgress}
                                    style={style}
                                    shouldAnimate={shouldAnimate}
                                    timeSignatureStr={timeSignature}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>

            {showControls && (
                <div className="h-24 flex items-center justify-between px-12 z-20 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Timeline</span>
                        <div className="flex space-x-2">
                            {safeMeasures.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentMeasureIndex ? 'bg-cyan-500 w-16 shadow-[0_0_15px_#06b6d4]' : 'bg-slate-800 w-4 hover:bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-900/50 px-6 py-2 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-cyan-400 uppercase">Section {currentMeasureIndex + 1}</span>
                        <div className="w-px h-4 bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-500">{safeMeasures.length} MEASURES</span>
                    </div>
                </div>
            )}

            <style>{`
        .score-animation-slide { animation: scoreSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .score-animation-fade { animation: scoreFadeIn 0.6s ease-out forwards; }
        @keyframes scoreSlideIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(20px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes scoreFadeIn {
          0% { opacity: 0; filter: blur(15px); }
          100% { opacity: 1; filter: blur(0); }
        }
        .score-canvas-viewport svg { width: 100%; height: auto; }
      `}</style>
        </div>
    );
};

export default ScorePreview;

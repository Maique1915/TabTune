"use client";

import React, { useEffect, useRef, useMemo, memo, useState } from "react";
import { getNoteKeyFromFret } from "@/lib/tab-editor/utils/musicMath";
import { ScoreStyle, MeasureData } from "@/lib/tab-editor/types";
import { ScoreStyler } from "@/lib/tab-editor/ScoreStyler";

interface ScorePreviewProps {
    code: string; // Kept for compatibility but unused/mapped to empty
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
    }
}

const MeasureThumbnail = memo(
    ({
        measure,
        isActive,
        progress,
        style,
        shouldAnimate,
    }: {
        measure: MeasureData;
        isActive: boolean;
        progress: number;
        style: ScoreStyle;
        shouldAnimate: boolean;
    }) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const outputRef = useRef<HTMLDivElement>(null);
        const [renderError, setRenderError] = useState<string | null>(null);

        const draw = () => {
            const div = outputRef.current;
            if (!div || !window.Vex) return;

            div.innerHTML = "";
            const { Renderer, Stave, TabStave, StaveNote, TabNote, Formatter, Accidental } = window.Vex.Flow;

            try {
                const renderer = new Renderer(div, Renderer.Backends.SVG);
                renderer.resize(800, 340);
                const context = renderer.getContext();

                // NoteForge: Set transparent fill style initially
                context.setFillStyle('transparent');

                // NoteForge: Helper for applying styles via API
                const applyStyles = (obj: any, color: string, bg: string) => {
                    if (!obj) return;
                    const styleOpts = {
                        fillStyle: color,
                        strokeStyle: color,
                        backgroundColor: bg
                    };

                    if (obj.setStyle) obj.setStyle(styleOpts);

                    if (obj.modifiers) {
                        obj.modifiers.forEach((m: any) => applyStyles(m, color, bg));
                    }
                };

                const width = style.width || 780;
                const x = 10;
                const staveY = 40; // Notation
                const tabY = 180;  // Tablature

                // NoteForge Logic Adaptation
                const bg = style.background;

                // --- 1. NOTATION STAVE ---
                const stave = new Stave(x, staveY, width);
                if (measure.showClef) stave.addClef("treble");
                if (measure.showTimeSig) stave.addTimeSignature("4/4"); // TODO: Use real timeSig

                // Style Modifiers (Clef, TimeSig)
                stave.getModifiers().forEach((mod: any) => {
                    const isClef = mod.getCategory && mod.getCategory() === 'clefs';
                    const color = isClef ? style.clefs : style.timeSignature;
                    applyStyles(mod, color, bg);
                });

                stave.setContext(context);
                // Style Stave Lines (VexFlow 5 adapted)
                context.save();
                context.setStrokeStyle(style.staffLines);
                context.setFillStyle(style.staffLines);
                stave.draw();
                context.restore();

                // --- 2. TABLATURE STAVE ---
                const tabStave = new TabStave(x, tabY, width);
                if (measure.showClef) tabStave.addTabGlyph();

                // Style Tab Modifiers
                tabStave.getModifiers().forEach((mod: any) => applyStyles(mod, style.clefs, bg));

                tabStave.setContext(context);
                // Style Tab Stave Lines (VexFlow 5 adapted)
                context.save();
                context.setStrokeStyle(style.staffLines);
                context.setFillStyle(style.staffLines);
                tabStave.draw();
                context.restore();

                // --- 3. NOTES ---
                const staveNotes: any[] = [];
                const tabNotes: any[] = [];

                if (measure.notes && measure.notes.length > 0) {
                    measure.notes.forEach((n, i) => {
                        const duration = n.duration || "q";
                        const isRest = n.type === 'rest';

                        // --- Tab Note ---
                        let tNote;
                        if (isRest) {
                            // NoteForge Tab Rest Logic
                            tNote = new TabNote({
                                positions: [{ str: 3, fret: 'X' }],
                                duration: duration + (n.decorators?.dot ? 'd' : '') + 'r',
                                type: 'r'
                            });
                            applyStyles(tNote, style.rests, bg);
                        } else {
                            const strVal = parseInt(n.string) || 6;
                            const fretVal = parseInt(n.fret) || 0;
                            tNote = new TabNote({
                                positions: [{ str: strVal, fret: fretVal }],
                                duration: duration + (n.decorators?.dot ? 'd' : '')
                            });
                            applyStyles(tNote, style.tabNumbers, bg);
                        }
                        tabNotes.push(tNote);



                        const strVal = parseInt(n.string) || 6;
                        const fretVal = parseInt(n.fret) || 0;

                        // --- Stave Note ---
                        const noteKey = getNoteKeyFromFret(strVal, fretVal);

                        const sNote = new StaveNote({
                            keys: [noteKey],
                            duration: duration + (n.decorators?.dot ? 'd' : '') + (isRest ? 'r' : ''),
                            type: isRest ? 'r' : undefined
                        });

                        // Accidental Logic
                        if (!isRest && n.accidental && n.accidental !== 'none') {
                            sNote.addAccidental(0, new Accidental(n.accidental));
                        }

                        // Dot Logic
                        if (n.decorators && n.decorators.dot) {
                            if (sNote.addDot) sNote.addDot(0);
                            if (tNote.addDot) tNote.addDot(0);
                        }

                        const noteColor = isRest ? style.rests : style.notes;
                        applyStyles(sNote, noteColor, bg);

                        staveNotes.push(sNote);
                    });
                }

                // Format and Draw
                if (staveNotes.length > 0) {
                    Formatter.FormatAndDraw(context, stave, staveNotes);

                    // Auto-Beaming
                    const beams = window.Vex.Flow.Beam.generateBeams(staveNotes);
                    beams.forEach((b: any) => {
                        applyStyles(b, style.notes, bg); // Apply theme color to beams
                        b.setContext(context).draw();
                    });
                }
                if (tabNotes.length > 0) {
                    Formatter.FormatAndDraw(context, tabStave, tabNotes);
                }

            } catch (e: any) {
                console.error("VexFlow Render Error:", e);
                setRenderError(e.message);
            }
        };

        useEffect(() => {
            // Wait for VexFlow to load
            const check = () => {
                if (window.Vex) draw();
                else requestAnimationFrame(check);
            };
            check();
        }, [measure, style, shouldAnimate, isActive, progress]);

        // Watch for style changes specifically
        useEffect(() => { draw(); }, [style]);

        return (
            <div
                ref={containerRef}
                className="relative w-full aspect-video max-w-[800px] mx-auto bg-[#0a0a0a] rounded-3xl border-4 border-[#333] shadow-[0_0_0_2px_#111,0_0_40px_rgba(0,0,0,0.5),0_0_100px_rgba(6,182,212,0.1)] overflow-hidden group"
            >
                {/* Screen Bezel/Inner Shadow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/5" />

                {/* CRT Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02))] bg-[length:100%_4px,3px_100%]" />

                {/* Subtle Screen Curved Reflection */}
                <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 rounded-2xl" />

                {/* Canvas Container */}
                <div
                    className="w-full h-full relative z-10 flex items-center justify-center bg-[#050505]"
                    style={{
                        backgroundColor: style.background,
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    <div className="score-canvas-viewport w-full h-full flex items-center justify-center relative">
                        <div
                            ref={outputRef}
                            className={`vexflow-container w-full h-full flex items-center justify-center transition-opacity duration-300 ${renderError ? "opacity-20 blur-sm" : "opacity-100"
                                } filter brightness-110 contrast-125 saturate-150`}
                        />

                        {/* Playhead Overlay */}
                        {isActive && !renderError && (
                            <div
                                className="absolute top-5 bottom-5 w-1 z-50 pointer-events-none transition-all duration-75"
                                style={{
                                    left: `${progress}%`,
                                    backgroundColor: style.playheadColor,
                                    boxShadow: style.glowEffect
                                        ? `0 0 ${style.shadowIntensity}px ${style.playheadColor}`
                                        : "none",
                                }}
                            >
                                <div
                                    className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full"
                                    style={{ backgroundColor: style.playheadColor }}
                                />
                                <div
                                    className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full"
                                    style={{ backgroundColor: style.playheadColor }}
                                />
                            </div>
                        )}
                    </div>
                    {renderError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in z-40">
                            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                    <path d="M12 9v4" />
                                    <path d="M12 17h.01" />
                                </svg>
                            </div>
                            <p className="text-slate-500 text-[10px] font-mono max-w-xs">{renderError}</p>
                        </div>
                    )}
                    <p className="absolute bottom-4 text-cyan-500/30 font-mono text-[10px] uppercase tracking-widest pointer-events-none z-40">
                        Signal: Active
                    </p>
                </div>
            </div>
        );
    }
);

const ScorePreview: React.FC<ScorePreviewProps> = ({
    code,
    playbackPosition,
    isPlaying,
    style,
    measures,
    showControls = true,
}) => {
    // Use measures directly. If measures is empty but code exists, we typically parse code.
    // But given the refactor, let's assume valid measures are passed or we use empty.
    const activeMeasures = measures.length > 0 ? measures : [];

    const currentMeasureIndex = useMemo(() => {
        if (activeMeasures.length === 0) return 0;
        const idx = Math.floor((playbackPosition / 100) * activeMeasures.length);
        return Math.min(idx, activeMeasures.length - 1);
    }, [playbackPosition, activeMeasures.length]);

    const measureProgress = useMemo(() => {
        if (activeMeasures.length === 0) return 0;
        const measureWeight = 100 / activeMeasures.length;
        return ((playbackPosition % measureWeight) / measureWeight) * 100;
    }, [playbackPosition, activeMeasures.length]);

    const shouldAnimate =
        currentMeasureIndex === 0 || currentMeasureIndex === activeMeasures.length - 1;

    // Encontrar o MeasureData correspondente
    const activeMeasure = activeMeasures[currentMeasureIndex];
    // Guard clause if no measure
    if (!activeMeasure) {
        return <div className="p-10 text-center text-gray-500">No measures data available</div>;
    }

    return (
        <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
            {/* NoteForge Background Override Injection */}
            <style>
                {`
              .vexflow-container svg rect[fill="white"],
              .vexflow-container svg rect[fill="#ffffff"] {
                fill: ${style.background} !important;
                opacity: 0; /* Make them explicitly transparent or match background */
              }
            `}
            </style>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />

            {/* Main Stage Glow Effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-40 bg-cyan-500/10 blur-[120px] pointer-events-none" />

            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
                <div className="w-full max-w-[800px] relative">
                    {activeMeasures.map((measure, idx) =>
                        idx === currentMeasureIndex && (
                            <div
                                key={`${measure.id}-${style.transitionType}`}
                                className={`w-full ${shouldAnimate ? `score-animation-${style.transitionType}` : ""
                                    }`}
                            >
                                <MeasureThumbnail
                                    measure={measure}
                                    isActive={isPlaying}
                                    progress={measureProgress}
                                    style={style}
                                    shouldAnimate={shouldAnimate}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>

            {showControls && (
                <div className="h-14 flex items-center justify-between px-6 z-20 bg-[#0a0a0a] border-t border-[#333] shadow-lg shrink-0">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-[#333] uppercase tracking-widest">
                                SEQ
                            </span>
                            {activeMeasures.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 ${i === currentMeasureIndex
                                        ? "bg-cyan-500 w-8 shadow-[0_0_10px_#06b6d4]"
                                        : "bg-[#222] w-2"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-[#111] border border-[#222]">
                            <span className="text-[10px] font-black text-cyan-500 uppercase">
                                SEC {currentMeasureIndex + 1}
                            </span>
                            <span className="text-[10px] font-bold text-[#444]">
                                {activeMeasures.length} BAR
                            </span>
                        </div>
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
        .score-canvas-viewport { overflow: hidden; height: 100% !important; min-height: 310px; }
      `}</style>
        </div>
    );
};

export default ScorePreview;


"use client";

import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ScoreStyle, MeasureData } from '@/lib/tab-editor/types';
import { getNoteKeyFromFret } from '@/lib/tab-editor/utils/musicMath';
import { Music, MousePointerClick, MoreHorizontal, MoveLeft, MoveRight, Video, Circle, Square } from 'lucide-react';
import { useScreenRecorder } from '@/lib/tab-editor/hooks/useVideoRecorder';

interface ScorePreviewProps {
    code: string; // Kept for interface compatibility but largely unused now
    measures: MeasureData[];
    timeSignature: string;
    playbackPosition: number;
    isPlaying: boolean;
    style: ScoreStyle;
    showControls?: boolean;
    showNotation?: boolean;
    showTablature?: boolean;
    onMeasuresChange?: (measures: MeasureData[]) => void;
    selectedNoteIds?: string[];
    onSelectNote?: (noteId: string, isMulti: boolean) => void;
    onDoubleClickNote?: (noteId: string) => void;
    currentMeasureIndex?: number;
    onPlaybackControl?: (isPlaying: boolean) => void;
    onPlaybackPositionChange?: (position: number) => void;
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
    timeSignatureStr,
    showNotation,
    showTablature,
    onNoteClick,
    onNoteDoubleClick,
    selectedNoteIds
}: {
    measureData: MeasureData;
    measureIndex: number;
    isActive: boolean;
    progress: number;
    style: ScoreStyle;
    shouldAnimate: boolean;
    timeSignatureStr: string;
    showNotation: boolean;
    showTablature: boolean;
    onNoteClick?: (measureIndex: number, noteIndex: number, isMulti: boolean) => void;
    onNoteDoubleClick?: (noteId: string) => void;
    selectedNoteIds?: string[];
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [renderError, setRenderError] = useState<string | null>(null);

    const draw = () => {
        // Only run on client-side to avoid hydration mismatch
        if (typeof window === 'undefined') return;

        const container = containerRef.current;
        if (!container || !window.Vex) return;

        container.innerHTML = '';
        // Explicitly set background on container (NoteForge style)
        container.style.backgroundColor = style.background || '#09090b';

        // Create div element for VexFlow SVG rendering
        const svgContainer = document.createElement('div');
        svgContainer.style.width = '800px';
        svgContainer.style.height = '340px';
        container.appendChild(svgContainer);

        // Helper for Interaction
        const attachInteraction = (vexNote: any, noteIndex: number, noteId: string) => {
            if (!vexNote || !onNoteClick) return;
            const el = vexNote.attrs?.el;
            if (el) {
                el.style.cursor = 'pointer';
                el.onclick = (e: MouseEvent) => {
                    e.stopPropagation();
                    onNoteClick(measureIndex, noteIndex, e.shiftKey || e.metaKey);
                };
                el.ondblclick = (e: MouseEvent) => {
                    e.stopPropagation();
                    if (onNoteDoubleClick) onNoteDoubleClick(noteId);
                };
            }
        };

        // Helper for Opacity
        const hexToRgba = (hex: string, alpha: number) => {
            let c: any;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split('');
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = '0x' + c.join('');
                return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
            }
            return hex;
        }

        // NoteForge-compatible styling helper
        const applyStyles = (obj: any, styleDef: any, bg: string = 'transparent') => {
            if (!obj || !styleDef) return;

            // Handle both legacy string and new ElementStyle
            const color = typeof styleDef === 'string' ? styleDef : styleDef.color;
            const opacity = typeof styleDef === 'string' ? 1 : (styleDef.opacity ?? 1);
            const shadow = typeof styleDef === 'string' ? false : (styleDef.shadow ?? false);
            // New Shadow Props
            const shadowColor = typeof styleDef === 'string' ? color : (styleDef.shadowColor || color);
            const shadowBlur = typeof styleDef === 'string' ? 10 : (styleDef.shadowBlur ?? 10);

            const rgbaColor = hexToRgba(color, opacity);

            const styleOpts: any = {
                fillStyle: rgbaColor,
                strokeStyle: rgbaColor,
                backgroundColor: bg
            };

            if (shadow) {
                styleOpts.shadowColor = shadowColor;
                styleOpts.shadowBlur = shadowBlur;
            } else {
                styleOpts.shadowBlur = 0; // Clear shadow if disabled
            }

            if (obj.setStyle) obj.setStyle(styleOpts);
            if (obj.setStemStyle) obj.setStemStyle({ strokeStyle: rgbaColor });

            if (obj.modifiers) {
                obj.modifiers.forEach((m: any) => applyStyles(m, styleDef, bg));
            }
        };

        try {
            const { Renderer, Stave, StaveNote, TabStave, TabNote, Formatter, Dot, Accidental, Articulation } = window.Vex.Flow;

            const renderer = new Renderer(svgContainer, Renderer.Backends.SVG);
            renderer.resize(800, 340);
            const context = renderer.getContext();
            context.setFillStyle('transparent');

            let x = 10;
            const width = 780;

            // --- NOTATION STAVE ---
            if (showNotation) {
                const staveY = showTablature ? 40 : 120; // Center if only notation
                const stave = new Stave(x, staveY, width);

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
                    let targetStyle = style.notes; // Default

                    if (category.includes('clef')) targetStyle = style.clefs;
                    else if (category.includes('timesignature') || category.includes('time')) targetStyle = style.timeSignature;
                    else if (category.includes('keysignature') || category.includes('key')) targetStyle = style.symbols;
                    else if (category.includes('barline')) targetStyle = style.staffLines;

                    applyStyles(mod, targetStyle, style.background || 'transparent');
                });

                stave.setContext(context);
                // Apply Staff Lines style
                const linesColor = hexToRgba(style.staffLines.color, style.staffLines.opacity);
                const linesStyle: any = { strokeStyle: linesColor, fillStyle: linesColor };
                if (style.staffLines.shadow) {
                    linesStyle.shadowColor = style.staffLines.shadowColor || style.staffLines.color;
                    linesStyle.shadowBlur = style.staffLines.shadowBlur || 10;
                }
                stave.setStyle(linesStyle);
                stave.draw();

                // Calculate total duration for progress
                const totalDuration = measureData.notes.reduce((sum, note) => sum + (1 / parseInt(note.duration.replace('d', '').replace('r', ''))), 0);
                let currentDurationAccumulator = 0;

                // Generate Notes
                const notes = measureData.notes.map((note, i) => {
                    const noteValue = (1 / parseInt(note.duration.replace('d', '').replace('r', '')));
                    const startProgress = (currentDurationAccumulator / totalDuration) * 100;
                    const endProgress = ((currentDurationAccumulator + noteValue) / totalDuration) * 100;

                    const isActiveNote = isActive && progress >= startProgress && progress < endProgress;
                    const isSelected = selectedNoteIds?.includes(note.id);

                    // Construct style object for active note vs normal note
                    let noteStyle = isActiveNote
                        ? { color: style.activeNoteColor, opacity: 1, shadow: true }
                        : (isSelected ? { color: '#fbbf24', opacity: 1, shadow: true, shadowColor: '#fbbf24', shadowBlur: 15 } : style.notes);

                    currentDurationAccumulator += noteValue;

                    if (note.type === 'rest') {
                        const finalRestStyle = isActiveNote
                            ? { color: style.activeNoteColor, opacity: 1, shadow: true }
                            : (isSelected ? { color: '#fbbf24', opacity: 1, shadow: true } : style.rests);

                        const sn = new StaveNote({ keys: ["b/4"], duration: note.duration + "r" });
                        applyStyles(sn, finalRestStyle, style.background || 'transparent');
                        return sn;
                    } else {
                        // Calculate key
                        const key = getNoteKeyFromFret(parseInt(note.fret), parseInt(note.string));
                        const sn = new StaveNote({
                            keys: [key],
                            duration: note.duration
                        })

                        // Handle dots if needed
                        if (note.decorators?.dot) {
                            Dot.buildAndAttach([sn], { all: true });
                        }

                        // Add Accidental
                        if (note.accidental && note.accidental !== 'none') {
                            sn.addModifier(new Accidental(note.accidental));
                        }

                        // Add Decorators
                        if (note.decorators) {
                            if (note.decorators.staccato) sn.addModifier(new Articulation('a.')); // Staccato
                            if (note.decorators.accent) sn.addModifier(new Articulation('a>'));   // Accent
                        }

                        applyStyles(sn, noteStyle, style.background || 'transparent');
                        return sn;
                    }
                });

                if (notes.length > 0) {
                    // Generate Beams
                    const beams = window.Vex.Flow.Beam.generateBeams(notes);

                    // Style Beams
                    beams.forEach((beam: any) => {
                        applyStyles(beam, style.notes, style.background || 'transparent');
                    });

                    Formatter.FormatAndDraw(context, stave, notes);

                    // Draw Beams
                    beams.forEach((beam: any) => {
                        beam.setContext(context).draw();
                    });

                    // Attach Interaction
                    notes.forEach((n: any, i: number) => attachInteraction(n, i, measureData.notes[i].id));
                }
            }

            // --- TABLATURE STAVE ---
            if (showTablature) {
                const yOffset = showNotation ? 150 : 100; // Center if only tab
                const tabStave = new TabStave(x, yOffset, width);

                if (measureData.showClef || measureIndex === 0) {
                    tabStave.addTabGlyph();
                }

                // Style Tab Modifiers (TabGlyph)
                const mods = tabStave.getModifiers();
                mods.forEach((mod: any) => {
                    // Tab glyph usually considered 'clef' or 'tabglyph'
                    applyStyles(mod, style.clefs, style.background || 'transparent');
                });

                tabStave.setContext(context);
                // Staff Lines Style
                const linesColor = hexToRgba(style.staffLines.color, style.staffLines.opacity);
                tabStave.setStyle({ strokeStyle: linesColor, fillStyle: linesColor });
                tabStave.draw();

                // Reset accumulator for tab notes if needed for active state
                let currentDurationAccumulatorTab = 0;
                const totalDurationTab = measureData.notes.reduce((sum, note) => sum + (1 / parseInt(note.duration.replace('d', '').replace('r', ''))), 0);

                const tabNotes = measureData.notes.map((note, i) => {
                    const noteValue = (1 / parseInt(note.duration.replace('d', '').replace('r', '')));
                    const startProgress = (currentDurationAccumulatorTab / totalDurationTab) * 100;
                    const endProgress = ((currentDurationAccumulatorTab + noteValue) / totalDurationTab) * 100;

                    const isActiveNote = isActive && progress >= startProgress && progress < endProgress;
                    const isSelected = selectedNoteIds?.includes(note.id);
                    currentDurationAccumulatorTab += noteValue;

                    if (note.type === 'rest') {
                        const tn = new TabNote({
                            positions: [{ str: 3, fret: 'X' }], // Dummy position for rest visualization
                            duration: note.duration + "r"
                        });
                        const finalRestStyle = isActiveNote
                            ? { color: style.activeNoteColor, opacity: 1, shadow: true }
                            : (isSelected ? { color: '#fbbf24', opacity: 1, shadow: true } : style.rests);
                        applyStyles(tn, finalRestStyle, style.background || 'transparent');
                        return tn;
                    } else {
                        const tn = new TabNote({
                            positions: [{ str: parseInt(note.string), fret: parseInt(note.fret) }],
                            duration: note.duration
                        });
                        const finalTabNoteStyle = isActiveNote
                            ? { color: style.activeNoteColor, opacity: 1, shadow: true }
                            : (isSelected ? { color: '#fbbf24', opacity: 1, shadow: true } : style.tabNumbers);
                        applyStyles(tn, finalTabNoteStyle, style.background || 'transparent');
                        return tn;
                    }
                });

                if (tabNotes.length > 0) {
                    Formatter.FormatAndDraw(context, tabStave, tabNotes);
                    // Attach Interaction
                    tabNotes.forEach((n: any, i: number) => attachInteraction(n, i, measureData.notes[i].id));
                }
            }

            setRenderError(null);

        } catch (e: any) {
            console.error("VexFlow Render Error", e);
            setRenderError(e.message || "Render Error");
        }
    };

    useEffect(() => {
        draw();
    }, [measureData, style, shouldAnimate, timeSignatureStr, showNotation, showTablature, selectedNoteIds]);

    return (
        <div
            className="rounded-[3.5rem] shadow-[0_80px_160px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 relative flex items-center justify-center min-h-[310px]"
            style={{ backgroundColor: style.background }}
        >
            <div
                ref={containerRef}
                className="score-canvas-viewport w-full h-full flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: renderError ? 0.2 : 1 }}
            />

            {/* Playhead Overlay */}
            {isActive && !renderError && (
                <>
                    {console.log('Playhead rendering:', { isActive, progress, renderError })}
                    <div
                        className="absolute top-0 bottom-0 w-2 bg-cyan-400 z-50 pointer-events-none"
                        style={{
                            left: `${progress}%`,
                            boxShadow: '0 0 20px rgba(6,182,212,1), 0 0 40px rgba(6,182,212,0.6)',
                            opacity: 1
                        }}
                    />
                </>
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
    timeSignature,
    showNotation = true,
    showTablature = true,
    onMeasuresChange,
    selectedNoteIds = [],
    onSelectNote,
    onDoubleClickNote,
    currentMeasureIndex: externalMeasureIndex,
    onPlaybackControl,
    onPlaybackPositionChange
}) => {
    // Current Measure Calculation
    const safeMeasures = measures || [];
    const scoreContainerRef = useRef<HTMLElement>(null);

    // Video Recording
    const { isRecording, startRecording, stopRecording, downloadVideo, error: recordingError } = useScreenRecorder(scoreContainerRef, {
        fps: 30,
        videoBitsPerSecond: 5000000
    });

    const handleStartRecording = async () => {
        // Reset to beginning and start playing
        if (onPlaybackPositionChange) {
            onPlaybackPositionChange(0);
        }
        if (onPlaybackControl) {
            onPlaybackControl(true);
        }
        // Start recording
        await startRecording();
    };

    const handleStopRecording = async () => {
        // Stop playback
        if (onPlaybackControl) {
            onPlaybackControl(false);
        }
        // Stop recording and download
        const blob = await stopRecording();
        if (blob) {
            downloadVideo(blob, `tab-animation-${Date.now()}.webm`);
        }
    };

    // Auto-stop recording when playback reaches the end
    useEffect(() => {
        if (isRecording && playbackPosition >= 99.9) {
            handleStopRecording();
        }
    }, [isRecording, playbackPosition]);

    const calculatedMeasureIndex = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const idx = Math.floor((playbackPosition / 100) * safeMeasures.length);
        return Math.min(idx, safeMeasures.length - 1);
    }, [playbackPosition, safeMeasures.length]);


    // When playing, use calculated index from playback; otherwise use external (manual selection)
    const currentMeasureIndex = isPlaying ? calculatedMeasureIndex : (externalMeasureIndex !== undefined ? externalMeasureIndex : calculatedMeasureIndex);

    const measureProgress = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const measureWeight = 100 / safeMeasures.length;
        return ((playbackPosition % measureWeight) / measureWeight) * 100;
    }, [playbackPosition, safeMeasures.length]);

    const shouldAnimate = currentMeasureIndex === 0 || currentMeasureIndex === safeMeasures.length - 1;
    const activeMeasureData = safeMeasures[currentMeasureIndex];

    const handleNoteClick = (measureIndex: number, noteIndex: number, isMulti: boolean) => {
        const measure = safeMeasures[measureIndex];
        const note = measure?.notes[noteIndex];
        if (!note || !onSelectNote) return;

        onSelectNote(note.id, isMulti);
    };



    if (!activeMeasureData) return null;

    return (
        <div ref={scoreContainerRef as React.RefObject<HTMLDivElement>} className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />

            <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative">
                <div className="w-full max-w-5xl relative h-[310px]">
                    {safeMeasures.map((measure, idx) => (
                        idx === currentMeasureIndex && (
                            <div
                                key={`${measure.id || idx}-${style.transitionType}-${timeSignature}-${showNotation}-${showTablature}`}
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
                                    showNotation={showNotation}
                                    showTablature={showTablature}
                                    onNoteClick={handleNoteClick}
                                    onNoteDoubleClick={onDoubleClickNote}
                                    selectedNoteIds={selectedNoteIds}
                                />
                            </div>
                        )
                    ))}

                    {/* Playhead Overlay - Moved here to ensure visibility */}
                    {isPlaying && (
                        <>
                            {console.log('Main Playhead rendering:', { isPlaying, measureProgress })}
                            <div
                                className="absolute top-0 bottom-0 w-2 bg-cyan-400 z-[100] pointer-events-none"
                                style={{
                                    left: `${measureProgress}%`,
                                    boxShadow: '0 0 20px rgba(6,182,212,1), 0 0 40px rgba(6,182,212,0.6)',
                                    opacity: 1
                                }}
                            />
                        </>
                    )}
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
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-4 bg-slate-900/50 px-6 py-2 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-cyan-400 uppercase">Section {currentMeasureIndex + 1}</span>
                            <div className="w-px h-4 bg-slate-800" />
                            <span className="text-[10px] font-black text-slate-500">{safeMeasures.length} MEASURES</span>
                        </div>

                        {/* Recording Controls */}
                        <button
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${isRecording
                                ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                                : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400'
                                }`}
                            title={isRecording ? 'Stop Recording' : 'Start Recording'}
                        >
                            {isRecording ? (
                                <>
                                    <Square className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase">Stop</span>
                                    <Circle className="w-2 h-2 fill-red-500 animate-pulse" />
                                </>
                            ) : (
                                <>
                                    <Video className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase">Record</span>
                                </>
                            )}
                        </button>
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

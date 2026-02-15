'use client';

import React, { useState } from 'react';
import { BaseTimelineProps } from './BaseTimeline';
import {
    getMeasureCapacity,
    getMsFromDuration,
    getMidiFromPosition,
    getPitchFromMidi
} from '@/modules/editor/domain/music-math';
import { Icons } from '@/modules/editor/presentation/constants';

const StudioTimeline: React.FC<BaseTimelineProps> = ({
    measures,
    selectedNoteIds,
    timeSignature,
    activeDuration,
    bpm = 120,
    hasClipboard,
    onSelectNote,
    onDoubleClickNote,
    onAddNote,
    onUpdateNote,
    onRemoveNote,
    onCopyNote,
    onRemoveMeasure,
    onAddMeasure,
    onUpdateMeasure,
    onToggleCollapse,
    onCopyMeasure,
    onPasteMeasure,
    onReorderMeasures,
    onReorderNotes,
    onSelectMeasure,
    onDeselectAll,
    selectedMeasureId,
    totalDurationMs = 0,
    currentCursorMs = 0,
    onSeek,
    variant = 'full'
}) => {
    const capacity = getMeasureCapacity(timeSignature);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Note Drag State
    const [draggedNote, setDraggedNote] = useState<{ measureId: string, index: number } | null>(null);
    const [dragOverNoteIndex, setDragOverNoteIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        onReorderMeasures(draggedIndex, index);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Note Drag Handlers
    const handleNoteDragStart = (e: React.DragEvent, measureId: string, index: number) => {
        setDraggedNote({ measureId, index });
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
    };

    const handleNoteDragOver = (e: React.DragEvent, measureId: string, index: number) => {
        e.preventDefault();
        if (!draggedNote || draggedNote.measureId !== measureId || draggedNote.index === index) return;
        setDragOverNoteIndex(index);
        e.stopPropagation();
    };

    const handleNoteDrop = (e: React.DragEvent, measureId: string, index: number) => {
        e.preventDefault();
        if (!draggedNote || draggedNote.measureId !== measureId) return;

        onReorderNotes(measureId, draggedNote.index, index);
        setDraggedNote(null);
        setDragOverNoteIndex(null);
        e.stopPropagation();
    };

    const handleNoteDragEnd = () => {
        setDraggedNote(null);
        setDragOverNoteIndex(null);
    };

    const getTechColor = (tech: string) => {
        switch (tech) {
            case 's': return 'bg-cyan-500';
            case 'h': return 'bg-emerald-500';
            case 'p': return 'bg-rose-500';
            case 'b': return 'bg-amber-500';
            case 'v': return 'bg-purple-500';
            default: return 'bg-slate-600';
        }
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Pre-calculate note timings for playback highlighting
    const noteTimingMap = new Map<string, { start: number, end: number }>();
    let accumulatedTimeMs = 0;
    measures.forEach(measure => {
        measure.notes.forEach(note => {
            const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators.dot, bpm);
            noteTimingMap.set(note.id, { start: accumulatedTimeMs, end: accumulatedTimeMs + durationMs });
            accumulatedTimeMs += durationMs;
        });
    });

    // Timeline / Horizontal Layout - STUDIO MODE
    return (
        <div
            className="flex flex-col w-full h-full bg-panel-dark/95 backdrop-blur-2xl border-t border-white/5 relative"
            onClick={onDeselectAll}
        >
            {/* Playback Progress Overlay */}
            <div
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-cyan-400 to-primary z-50 transition-all duration-100 ease-linear shadow-cyan-glow"
                style={{ width: `${Math.min(100, (currentCursorMs / totalDurationMs) * 100)}%` }}
            />



            {/* Horizontal Timeline Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 py-6 custom-scrollbar">
                <div className="flex flex-row gap-5 min-w-max h-full items-start">
                    {measures.map((measure, mIdx) => {
                        const isCollapsed = measure.isCollapsed;
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;
                        const isMeasureSelected = measure.id === selectedMeasureId;

                        return (
                            <div
                                key={measure.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectMeasure(measure.id);
                                    if (variant === 'short' && measure.notes.length > 0) {
                                        onSelectNote(measure.notes[0].id, false);
                                    }
                                }}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, mIdx)}
                                onDragOver={(e) => handleDragOver(e, mIdx)}
                                onDrop={(e) => handleDrop(e, mIdx)}
                                onDragEnd={handleDragEnd}
                                onDragLeave={() => setDragOverIndex(null)}
                                className={`
                                    flex flex-col
                                    relative group transition-all duration-300
                                    rounded-[20px] border
                                    ${isCollapsed ? 'w-14' : 'w-[180px]'}
                                    ${isDragging ? 'opacity-20 scale-95 border-dashed border-zinc-700' :
                                        isMeasureSelected
                                            ? 'opacity-100 border-primary bg-gradient-to-br from-primary/10 to-transparent shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-primary/30 z-10'
                                            : 'opacity-100 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/10 hover:bg-white/[0.05]'}
                                    ${isOver ? 'border-primary/60 scale-[1.02] shadow-cyan-glow' : ''}
                                    h-[85%] overflow-hidden
                                `}
                            >
                                {/* Active Selection Indicator Line */}
                                {isMeasureSelected && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />}

                                {/* Measure Header */}
                                <div className={`flex flex-col p-2.5 z-10 ${isCollapsed ? 'items-center px-1' : ''}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div
                                            className={`
                                                flex items-center justify-center rounded-md text-[10px] font-bold transition-all
                                                ${isCollapsed ? 'w-full h-8' : 'w-6 h-6'}
                                                ${isMeasureSelected
                                                    ? 'bg-primary text-black shadow-cyan-glow scale-110'
                                                    : 'bg-white/5 border border-white/5 text-zinc-500 hover:text-white group-hover:bg-white/10'}
                                            `}
                                            title="Drag to reorder"
                                        >
                                            {mIdx + 1}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {/* Action Buttons */}
                                            {!isCollapsed && (
                                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    {variant !== 'short' && (
                                                        <button onClick={(e) => { e.stopPropagation(); onAddNote?.(measure.id); }}
                                                            className="size-6 flex items-center justify-center hover:bg-white/10 rounded-md text-zinc-500 hover:text-primary transition-all duration-300"
                                                            title="Add Chord">
                                                            <Icons.Plus className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                    <button onClick={(e) => { e.stopPropagation(); onCopyMeasure(measure.id); }}
                                                        className="size-6 flex items-center justify-center hover:bg-white/10 rounded-md text-zinc-500 hover:text-primary transition-all duration-300"
                                                        title="Duplicate">
                                                        <Icons.Copy className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); onRemoveMeasure(measure.id); }}
                                                        className="size-6 flex items-center justify-center hover:bg-rose-500/10 rounded-md text-zinc-500 hover:text-rose-400 transition-all duration-300"
                                                        title="Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            )}

                                            <button onClick={(e) => { e.stopPropagation(); onToggleCollapse(measure.id); }}
                                                className={`size-6 flex items-center justify-center rounded-md text-zinc-600 hover:text-white transition-all duration-300 ${isCollapsed ? 'hidden group-hover:flex absolute top-12 left-0 right-0 mx-auto' : ''}`}>
                                                {isCollapsed ? <Icons.ChevronRight className="w-4 h-4" /> : <Icons.ChevronLeft className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Measure Content (Notes) */}
                                {!isCollapsed && (
                                    <div className="flex-1 px-3 py-2 z-10 overflow-y-auto overflow-x-hidden flex flex-wrap gap-2 items-center justify-center">
                                        {measure.notes.map((note, nIdx) => {
                                            const isSelected = selectedNoteIds.includes(note.id);

                                            const isNoteDragging = draggedNote?.measureId === measure.id && draggedNote?.index === nIdx;
                                            const isNoteOver = dragOverNoteIndex === nIdx && draggedNote?.measureId === measure.id;

                                            const timing = noteTimingMap.get(note.id);
                                            const isPlaying = timing && currentCursorMs > 0 && currentCursorMs >= timing.start && currentCursorMs < timing.end;

                                            return (
                                                <div
                                                    key={note.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectMeasure(measure.id);
                                                        onSelectNote(note.id, e.shiftKey || e.ctrlKey);
                                                    }}
                                                    onDoubleClick={(e) => { e.stopPropagation(); onDoubleClickNote(note.id); }}
                                                    draggable={true}
                                                    onDragStart={(e) => handleNoteDragStart(e, measure.id, nIdx)}
                                                    onDragOver={(e) => handleNoteDragOver(e, measure.id, nIdx)}
                                                    onDrop={(e) => handleNoteDrop(e, measure.id, nIdx)}
                                                    onDragEnd={handleNoteDragEnd}
                                                    onDragLeave={() => setDragOverNoteIndex(null)}
                                                    className={`
                                                        relative cursor-pointer transition-all duration-300 group/note
                                                        w-[110px] h-[72px] shrink-0 rounded-xl border flex flex-col items-center justify-center select-none shadow-md pt-4
                                                        ${isPlaying
                                                            ? 'bg-primary/20 border-primary shadow-cyan-glow scale-[1.05] z-20'
                                                            : isSelected
                                                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                                : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/60'}
                                                        ${isNoteDragging ? 'opacity-20 scale-90 blur-[2px]' : ''}
                                                        ${isNoteOver ? 'border-primary scale-[1.05] -translate-y-1' : ''}
                                                    `}
                                                >
                                                    {/* Note Actions */}
                                                    {variant !== 'short' && (onCopyNote || onRemoveNote) && (
                                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity z-10">
                                                            {onCopyNote && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onCopyNote(note.id); }}
                                                                    className="size-5 flex items-center justify-center rounded-md bg-black/60 hover:bg-white/10 text-zinc-300 hover:text-white transition"
                                                                    title="Duplicar"
                                                                >
                                                                    <Icons.Copy className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                            {onRemoveNote && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onRemoveNote(note.id); }}
                                                                    className="size-5 flex items-center justify-center rounded-md bg-black/60 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 transition"
                                                                    title="Excluir"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* Glow behind playing note */}
                                                    {isPlaying && <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-xl" />}

                                                    {/* Note Info */}
                                                    <span className={`absolute top-1.5 left-2 text-[7px] font-black uppercase tracking-widest ${isSelected || isPlaying ? 'text-primary' : 'text-zinc-700 group-hover/note:text-zinc-500'}`}>
                                                        {note.duration}{note.decorators.dot && '•'}
                                                    </span>

                                                    {/* Main Value */}
                                                    <div className="flex flex-row flex-wrap items-center justify-center content-center transition-all duration-500 group-hover/note:scale-105 text-white gap-1.5 px-2">
                                                        <div className="flex -space-x-2">
                                                            {(() => {
                                                                const uniqueNotes = Array.from(new Set(note.positions
                                                                    .filter(p => !p.avoid)
                                                                    .map(p => {
                                                                        const midi = getMidiFromPosition(p.fret, p.string);
                                                                        const pitch = getPitchFromMidi(midi);
                                                                        return pitch.name + pitch.accidental.replace('#', '♯').replace('b', '♭');
                                                                    })));

                                                                return uniqueNotes.slice(0, 3).map((noteName, i) => (
                                                                    <div key={i} className={`
                                                                        size-6 rounded-full border border-black flex items-center justify-center text-[9px] font-black shadow-lg transition-all duration-300
                                                                        ${isPlaying ? 'bg-primary text-black scale-110 z-10' : 'bg-zinc-800 text-zinc-300'}
                                                                    `}>
                                                                        {noteName}
                                                                    </div>
                                                                ));
                                                            })()}
                                                            {note.positions.filter(p => !p.avoid).length > 3 && (
                                                                <div className="w-5 h-5 rounded-full bg-cyan-950 border-2 border-primary/50 flex items-center justify-center text-[8px] font-black text-primary shadow-lg">
                                                                    +
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Indicators (Bottom Dots) */}
                                                    <div className="absolute bottom-3 left-4 flex gap-1">
                                                        {note.technique && <div className={`w-1.5 h-1.5 rounded-full ring-2 ring-black/40 shadow-sm ${getTechColor(note.technique)}`} />}
                                                    </div>

                                                    {/* Progress bar inside note (match cinematic) */}
                                                    {isPlaying && timing && (
                                                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full transition-all duration-100 ease-linear shadow-cyan-glow"
                                                            style={{ width: `${Math.min(100, Math.max(0, ((currentCursorMs - timing.start) / (timing.end - timing.start)) * 100))}%` }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Section Button (End of Timeline) */}
                    {(
                        <button
                            onClick={(e) => { e.stopPropagation(); onAddMeasure(); }}
                            className="w-20 h-[85%] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-primary/5 hover:border-primary/30 rounded-[24px] flex flex-col items-center justify-center text-zinc-600 hover:text-primary transition-all duration-700 shrink-0 group/add-m"
                            title="Add New Block"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center group-hover/add-m:scale-110 group-hover/add-m:rotate-90 group-hover/add-m:bg-primary/10 transition-all duration-500 shadow-xl">
                                <Icons.Plus />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-40 group-hover/add-m:opacity-100 transition-opacity">Add Block</span>
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
};

export default StudioTimeline;

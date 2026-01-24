'use client';

import React, { useState } from 'react';
import { MeasureData, NoteData, Duration } from '@/modules/editor/domain/types';
import { getNoteDurationValue, getMeasureCapacity, getMsFromDuration } from '@/modules/editor/domain/music-math';
import { Icons } from '@/modules/editor/presentation/constants';

interface FretboardVisualEditorProps {
    measures: MeasureData[];
    selectedNoteIds: string[];
    timeSignature: string;
    activeDuration: Duration;
    bpm?: number;
    hasClipboard: boolean;
    onSelectNote: (id: string, multi: boolean) => void;
    onDoubleClickNote: (id: string) => void;
    onAddNote: (measureId: string) => void;
    onUpdateNote: (id: string, updates: Partial<NoteData>) => void;
    onRemoveMeasure: (id: string) => void;
    onAddMeasure: () => void;
    onUpdateMeasure: (id: string, updates: Partial<MeasureData>) => void;
    onToggleCollapse: (id: string) => void;
    onCopyMeasure: (id: string) => void;
    onPasteMeasure: (id: string) => void;
    onReorderMeasures: (from: number, to: number) => void;
    onReorderNotes: (measureId: string, from: number, to: number) => void;
    onSelectMeasure: (id: string) => void;
    onDeselectAll: () => void;
    selectedMeasureId: string | null;
    totalDurationMs?: number;
    currentCursorMs?: number;
    mode?: 'studio' | 'cinematic';
}

const VisualTimeline: React.FC<FretboardVisualEditorProps> = ({
    measures,
    selectedNoteIds,
    timeSignature,
    activeDuration,
    bpm = 120,
    hasClipboard,
    onSelectNote,
    onDoubleClickNote,
    onAddNote,
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
    mode = 'studio'
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

    // Timeline / Horizontal Layout
    return (
        <div
            className="flex flex-col w-full h-full bg-[#050505]/40 backdrop-blur-2xl border-t border-white/[0.03] relative"
            onClick={onDeselectAll}
        >
            {/* Time Status */}
            <div className="absolute top-4 right-8 z-20 pointer-events-none">
                <div className="flex items-center space-x-2.5 bg-black/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-xl shadow-2xl">
                    <span className="text-[11px] font-mono font-black text-cyan-400 tracking-tighter">{formatTime(currentCursorMs)}</span>
                    <span className="text-[11px] font-mono text-zinc-600 font-bold">/</span>
                    <span className="text-[11px] font-mono font-black text-zinc-500 tracking-tighter">{formatTime(totalDurationMs)}</span>
                </div>
            </div>

            {/* Horizontal Timeline Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 py-6 custom-scrollbar">
                <div className="flex flex-row gap-5 min-w-max h-full items-start">
                    {measures.map((measure, mIdx) => {
                        const isCollapsed = measure.isCollapsed;
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;
                        const isMeasureSelected = measure.id === selectedMeasureId;

                        const isCinematic = mode === 'cinematic';
                        const noteCount = measure.notes.length;

                        return (
                            <div
                                key={measure.id}
                                onClick={(e) => { e.stopPropagation(); onSelectMeasure(measure.id); }}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, mIdx)}
                                onDragOver={(e) => handleDragOver(e, mIdx)}
                                onDrop={(e) => handleDrop(e, mIdx)}
                                onDragEnd={handleDragEnd}
                                onDragLeave={() => setDragOverIndex(null)}
                                className={`
                                    flex flex-col
                                    relative group transition-all duration-500
                                    rounded-[24px] border
                                    ${isCollapsed ? 'w-16' : ''}
                                    ${isDragging ? 'opacity-20 scale-95 border-dashed border-zinc-700' :
                                        isMeasureSelected
                                            ? 'opacity-100 border-cyan-500/40 bg-zinc-900/40 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20'
                                            : 'opacity-100 border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]'}
                                    ${isOver ? 'border-cyan-500/60 scale-[1.02] shadow-cyan-500/5' : ''}
                                    h-[85%] 
                                `}
                                style={!isCollapsed && isCinematic ? { minWidth: Math.max(180, noteCount * 110 + 100) } : !isCollapsed ? { width: 180 } : {}}
                            >
                                {/* Glass Shine Effect */}
                                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Measure Header */}
                                <div className={`flex flex-col p-3 z-10 ${isCollapsed ? 'items-center space-y-3' : 'border-b border-white/[0.05]'}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/40 border border-white/5 text-[11px] font-black text-zinc-500 cursor-grab active:cursor-grabbing hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-inner"
                                                title="Drag to reorder"
                                            >
                                                {mIdx + 1}
                                            </div>
                                            {!isCollapsed && (
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-cyan-400 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                                                        {measure.chordName || `Chord ${mIdx + 1}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {/* Action Buttons moved here */}
                                            {!isCollapsed && (
                                                <div className="flex items-center gap-1.5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={(e) => { e.stopPropagation(); onCopyMeasure(measure.id); }}
                                                        className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-cyan-400 transition-all duration-300"
                                                        title="Duplicate">
                                                        <Icons.Copy />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); onRemoveMeasure(measure.id); }}
                                                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-all duration-300"
                                                        title="Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            )}

                                            <button onClick={(e) => { e.stopPropagation(); onToggleCollapse(measure.id); }}
                                                className="p-1.5 bg-black/40 border border-white/10 hover:border-white/30 rounded-lg text-zinc-400 hover:text-white transition-all duration-300 shadow-lg">
                                                {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Measure Content (Notes) */}
                                {!isCollapsed && (
                                    <div className="flex-1 px-5 py-3 z-10 overflow-hidden flex flex-row gap-5 items-center">
                                        {measure.notes.map((note, nIdx) => {
                                            const isSelected = selectedNoteIds.includes(note.id);
                                            const isRest = note.type === 'rest';

                                            const isNoteDragging = draggedNote?.measureId === measure.id && draggedNote?.index === nIdx;
                                            const isNoteOver = dragOverNoteIndex === nIdx && draggedNote?.measureId === measure.id;

                                            const timing = noteTimingMap.get(note.id);
                                            const isPlaying = timing && currentCursorMs > 0 && currentCursorMs >= timing.start && currentCursorMs < timing.end;

                                            return (
                                                <div
                                                    key={note.id}
                                                    onClick={(e) => { e.stopPropagation(); onSelectNote(note.id, e.shiftKey || e.ctrlKey); }}
                                                    onDoubleClick={(e) => { e.stopPropagation(); onDoubleClickNote(note.id); }}
                                                    draggable={true}
                                                    onDragStart={(e) => handleNoteDragStart(e, measure.id, nIdx)}
                                                    onDragOver={(e) => handleNoteDragOver(e, measure.id, nIdx)}
                                                    onDrop={(e) => handleNoteDrop(e, measure.id, nIdx)}
                                                    onDragEnd={handleNoteDragEnd}
                                                    onDragLeave={() => setDragOverNoteIndex(null)}
                                                    className={`
                                                        relative cursor-pointer transition-all duration-500 group/note
                                                        w-[100px] h-[60px] shrink-0 rounded-[18px] border-2 flex flex-col items-center justify-center select-none shadow-xl
                                                        ${isPlaying
                                                            ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.05] z-10'
                                                            : isSelected
                                                                ? (isRest ? 'bg-zinc-800/80 border-zinc-500 shadow-zinc-900/40' : 'bg-cyan-900/20 border-cyan-500 shadow-cyan-900/40 translate-y-[-2px]')
                                                                : 'bg-black/30 border-white/[0.04] hover:border-white/[0.1] hover:bg-black/50 hover:translate-y-[-1px]'}
                                                        ${isRest ? 'grayscale-[0.5] opacity-40' : ''}
                                                        ${isNoteDragging ? 'opacity-20 scale-90 blur-[2px]' : ''}
                                                        ${isNoteOver ? 'border-cyan-400 scale-[1.05] -translate-y-1' : ''}
                                                    `}
                                                >
                                                    {/* Glow behind playing note */}
                                                    {isPlaying && <div className="absolute inset-x-0 bottom-0 top-1/2 bg-cyan-500/20 blur-2xl rounded-full" />}

                                                    {/* Note Info */}
                                                    <span className={`absolute top-2.5 left-4 text-[9px] font-black uppercase tracking-tighter ${isSelected || isPlaying ? 'text-cyan-400' : 'text-zinc-600'}`}>
                                                        {note.duration}{note.decorators.dot && '•'}
                                                    </span>

                                                    {/* Main Value */}
                                                    <div className={`flex flex-row flex-wrap items-center justify-center content-center transition-all duration-500 group-hover/note:scale-110 ${isRest ? 'text-zinc-600' : 'text-white'} gap-1.5 px-2`}>
                                                        {isRest ? Icons.MusicRest(note.duration) : note.positions.map((pos, idx) => (
                                                            <div key={idx} className="flex flex-col items-center leading-none">
                                                                <span className="text-[17px] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{pos.fret}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Indicators (Bottom Dots) */}
                                                    <div className="absolute bottom-3 flex gap-1">
                                                        {note.technique && <div className={`w-1.5 h-1.5 rounded-full ring-2 ring-black/40 shadow-sm ${getTechColor(note.technique)}`} />}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Add Note Button inside measure */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAddNote(measure.id); }}
                                            className="w-14 h-[60px] shrink-0 border-2 border-dashed border-cyan-500/20 bg-cyan-500/5 rounded-[18px] flex items-center justify-center text-cyan-500/60 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-500 group/add-n"
                                            title="Add note to this chord"
                                        >
                                            <div className="p-3 transition-transform duration-500 group-hover/add-n:scale-110">
                                                <Icons.Plus />
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Section Button (End of Timeline) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddMeasure(); }}
                        className="w-20 h-[85%] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-cyan-500/5 hover:border-cyan-500/30 rounded-[24px] flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-400 transition-all duration-700 shrink-0 group/add-m"
                        title="Add New Block"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center group-hover/add-m:scale-110 group-hover/add-m:rotate-90 group-hover/add-m:bg-cyan-500/10 transition-all duration-500 shadow-xl">
                            <Icons.Plus />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-40 group-hover/add-m:opacity-100 transition-opacity">Add Block</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisualTimeline;

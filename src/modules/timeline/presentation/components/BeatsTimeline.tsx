'use client';

import React, { useState } from 'react';
import { BaseTimelineProps } from './BaseTimeline';
import {
    getMeasureCapacity,
    getMsFromDuration,
    getNoteDurationValue
} from '@/modules/editor/domain/music-math';
import { Icons } from '@/modules/editor/presentation/constants';
import { ArrowDown, ArrowUp } from 'lucide-react';

const BeatsTimeline: React.FC<BaseTimelineProps> = ({
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
    variant = 'beats'
}) => {
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

    // Helper to determine arrow direction (Simple Heuristic for now)
    // In a real implementation, we would store this in NoteData
    const getArrowDirection = (noteIndex: number, measureIndex: number) => {
        // Assume down on even, up on odd for now, or based on rhythm
        return noteIndex % 2 === 0 ? 'down' : 'up';
    };

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
                <div className="flex flex-row gap-8 min-w-max h-full items-start">
                    {measures.map((measure, mIdx) => {
                        const isCollapsed = measure.isCollapsed;
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;
                        const isMeasureSelected = measure.id === selectedMeasureId;

                        // Identify time signature parts (e.g., "4/4")
                        const [beats, beatType] = timeSignature.split('/').map(Number);

                        return (
                            <div
                                key={measure.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectMeasure(measure.id);
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
                                    ${isCollapsed ? 'w-14' : 'w-[400px]'} 
                                    ${isDragging ? 'opacity-20 scale-95 border-dashed border-zinc-700' :
                                        isMeasureSelected
                                            ? 'opacity-100 border-primary bg-gradient-to-br from-primary/5 to-transparent shadow-[0_0_30px_rgba(6,182,212,0.1)] ring-1 ring-primary/30 z-10'
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
                                        <div className="flex items-center gap-2">
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

                                            {!isCollapsed && (
                                                <div className="flex flex-col gap-1 w-32">
                                                    <div className="flex items-center justify-between px-0.5">
                                                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Ocupação</span>
                                                        <span className={`text-[8px] font-black ${(() => {
                                                            const cap = getMeasureCapacity(timeSignature);
                                                            const cur = measure.notes.reduce((acc, n) => acc + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
                                                            const perc = (cur / cap) * 100;
                                                            return perc > 100 ? 'text-rose-500' : perc === 100 ? 'text-emerald-500' : 'text-zinc-500';
                                                        })()}`}>
                                                            {(() => {
                                                                const cap = getMeasureCapacity(timeSignature);
                                                                const cur = measure.notes.reduce((acc, n) => acc + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
                                                                return Math.round((cur / cap) * 100);
                                                            })()}%
                                                        </span>
                                                    </div>
                                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <div
                                                            className={`h-full transition-all duration-500 rounded-full ${(() => {
                                                                const cap = getMeasureCapacity(timeSignature);
                                                                const cur = measure.notes.reduce((acc, n) => acc + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
                                                                const perc = (cur / cap) * 100;
                                                                return perc > 100 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-primary shadow-cyan-glow';
                                                            })()}`}
                                                            style={{
                                                                width: `${Math.min(100, (() => {
                                                                    const cap = getMeasureCapacity(timeSignature);
                                                                    const cur = measure.notes.reduce((acc, n) => acc + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
                                                                    return (cur / cap) * 100;
                                                                })())}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {/* Action Buttons */}
                                            {!isCollapsed && (
                                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={(e) => { e.stopPropagation(); onAddNote?.(measure.id); }}
                                                        className="size-6 flex items-center justify-center hover:bg-white/10 rounded-md text-zinc-500 hover:text-primary transition-all duration-300"
                                                        title="Add Beat">
                                                        <Icons.Plus className="w-3 h-3" />
                                                    </button>
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

                                {/* Beats Grid Background */}
                                {!isCollapsed && (
                                    <div className="absolute inset-0 top-[40px] px-3 z-0 flex justify-between items-end pb-4 pointer-events-none">
                                        {Array.from({ length: beats }).map((_, i) => (
                                            <div key={i} className="flex flex-col items-center justify-end h-full flex-1 border-r border-white/[0.02] last:border-none">
                                                <span className="text-[10px] font-black text-zinc-800 mb-2">{i + 1}</span>
                                                <div className="w-[1px] h-2 bg-zinc-800" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Measure Content (Notes as Arrows) */}
                                {!isCollapsed && (
                                    <div className="flex-1 px-3 py-2 z-10 overflow-hidden flex items-center justify-evenly relative">
                                        {measure.notes.map((note, nIdx) => {
                                            const isSelected = selectedNoteIds.includes(note.id);
                                            const isRest = note.type === 'rest';

                                            const isNoteDragging = draggedNote?.measureId === measure.id && draggedNote?.index === nIdx;
                                            const isNoteOver = dragOverNoteIndex === nIdx && draggedNote?.measureId === measure.id;

                                            const timing = noteTimingMap.get(note.id);
                                            const isPlaying = timing && currentCursorMs > 0 && currentCursorMs >= timing.start && currentCursorMs < timing.end;

                                            // Determine Arrow Direction from Data
                                            const direction = note.strumDirection || 'down';
                                            const finger = note.strumFinger;

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
                                                        w-16 h-32 shrink-0 flex flex-col items-center justify-center select-none
                                                        ${isNoteDragging ? 'opacity-20 scale-90 blur-[2px]' : ''}
                                                        ${isNoteOver ? 'scale-[1.05] -translate-y-1' : ''}
                                                    `}
                                                >
                                                    {/* Note Actions */}
                                                    {(onCopyNote || onRemoveNote) && (
                                                        <div className={`absolute top-2 right-2 flex gap-0.5 z-20 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover/note:opacity-100'}`}>
                                                            {onCopyNote && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onCopyNote(note.id); }}
                                                                    className="size-5 flex items-center justify-center rounded-md bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-zinc-400 hover:text-primary transition-colors"
                                                                    title="Duplicate"
                                                                >
                                                                    <Icons.Copy className="w-2.5 h-2.5" />
                                                                </button>
                                                            )}
                                                            {onRemoveNote && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onRemoveNote(note.id); }}
                                                                    className="size-5 flex items-center justify-center rounded-md bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-zinc-400 hover:text-rose-400 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Icons.Trash className="w-2.5 h-2.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* Glow behind playing note */}
                                                    {isPlaying && <div className="absolute inset-x-2 inset-y-4 bg-primary/10 animate-pulse rounded-xl blur-md" />}

                                                    <div className={`
                                                        flex flex-col items-center justify-center gap-2
                                                        transition-all duration-300
                                                        ${isSelected ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-zinc-400 hover:text-zinc-200'}
                                                        ${isPlaying ? 'text-primary scale-125' : ''}
                                                    `}>
                                                        {/* Finger Label */}
                                                        {finger && (
                                                            <span className="text-[10px] font-black uppercase mb-1 text-zinc-300 bg-black/50 px-1.5 rounded">{finger}</span>
                                                        )}

                                                        {direction === 'down' ? (
                                                            <ArrowDown strokeWidth={3} className="w-12 h-12" />
                                                        ) : (
                                                            <ArrowUp strokeWidth={3} className="w-12 h-12" />
                                                        )}

                                                        {/* Note Duration Label */}
                                                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-50">
                                                            {note.duration}{note.decorators.dot && '•'}
                                                        </span>
                                                    </div>

                                                    {/* Selection/Hover Halo */}
                                                    {isSelected && (
                                                        <div className="absolute bottom-4 w-2 h-2 bg-primary rounded-full shadow-cyan-glow" />
                                                    )}

                                                    {/* Progress bar inside note (optional, or rely on measure cursor?) */}
                                                    {/* Kept existing logic but minimal */}
                                                    {isPlaying && timing && (
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-primary rounded-full transition-all duration-100 ease-linear shadow-cyan-glow w-8" />
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
                </div>
            </div>
        </div >
    );
};

export default BeatsTimeline;

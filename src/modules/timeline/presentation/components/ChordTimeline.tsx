'use client';

import React, { useState } from 'react';
import { MeasureData, NoteData, Duration } from '@/modules/editor/domain/types';
import { getMsFromDuration } from '@/modules/editor/domain/music-math';
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
    onRemoveNote?: (id: string) => void;
    onCopyNote?: (id: string) => void;
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

const ChordTimeline: React.FC<FretboardVisualEditorProps> = ({
    measures,
    selectedNoteIds,
    bpm = 120,
    onSelectNote,
    onAddNote,
    onRemoveNote,
    onCopyNote,
    onRemoveMeasure,
    onAddMeasure,
    onToggleCollapse,
    onCopyMeasure,
    onReorderMeasures,
    onReorderNotes,
    onSelectMeasure,
    onDeselectAll,
    selectedMeasureId,
    totalDurationMs = 0,
    currentCursorMs = 0,
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
        e.stopPropagation(); // Prevents measure drag from starting
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

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const noteTimingMap = new Map<string, { start: number, end: number }>();
    let accumulatedTimeMs = 0;
    measures.forEach(measure => {
        measure.notes.forEach(note => {
            const durationMs = note.customDurationMs || getMsFromDuration(note.duration, !!note.decorators.dot, bpm);
            noteTimingMap.set(note.id, { start: accumulatedTimeMs, end: accumulatedTimeMs + durationMs });
            accumulatedTimeMs += durationMs;
        });
    });

    return (
        <div
            className="flex flex-col w-full h-full bg-[#050505]/60 backdrop-blur-3xl border-t border-white/[0.05] relative select-none"
            onClick={onDeselectAll}
        >
            {/* Playback Progress Overlay */}
            <div
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 z-50 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                style={{ width: `${Math.min(100, (currentCursorMs / totalDurationMs) * 100)}%` }}
            />

            {/* Time Status */}
            <div className="absolute top-6 right-10 z-20 pointer-events-none">
                <div className="flex items-center space-x-3 bg-black/80 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <span className="text-[12px] font-mono font-black text-cyan-400 tracking-tight">{formatTime(currentCursorMs)}</span>
                    <span className="text-[12px] font-mono text-white/20 font-bold">/</span>
                    <span className="text-[12px] font-mono font-black text-zinc-500 tracking-tight">{formatTime(totalDurationMs)}</span>
                </div>
            </div>

            {/* Horizontal Timeline Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-12 py-10 custom-scrollbar relative">
                <div className="flex flex-row gap-8 min-w-max h-full items-center">
                    {measures.map((measure, mIdx) => {
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;
                        const isMeasureSelected = measure.id === selectedMeasureId;
                        const isCollapsed = measure.isCollapsed;

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
                                    flex flex-col transition-all duration-700
                                    relative group rounded-[20px] border-[2px]
                                    ${isCollapsed ? 'w-[88px] h-[160px] items-center' : 'min-w-[240px] min-h-[160px]'}
                                    ${isDragging ? 'opacity-20 scale-95 blur-md border-dashed border-zinc-700' :
                                        isMeasureSelected
                                            ? 'opacity-100 border-cyan-400/60 bg-cyan-950/20 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_40px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/20'
                                            : 'opacity-100 border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl hover:border-white/[0.2] hover:bg-white/[0.05] shadow-2xl'}
                                    ${isOver ? 'border-cyan-400 scale-[1.02] -translate-y-2' : ''}
                                    px-3 py-3 overflow-visible
                                `}
                            >
                                {/* Glass Reflection */}
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent rounded-t-[20px] pointer-events-none" />

                                {/* Header Area */}
                                <div className={`flex items-center justify-between w-full relative z-10 ${isCollapsed ? 'flex-col gap-6 mb-0' : 'mb-6'}`}>
                                    <div className={`flex items-center gap-4 ${isCollapsed ? 'flex-col' : ''}`}>
                                        <div className={`
                                            w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl transition-all duration-500
                                            ${isMeasureSelected ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-white/5 border border-white/10 text-white/40'}
                                            text-[12px] font-black
                                        `}>
                                            {mIdx + 1}
                                        </div>
                                        {!isCollapsed && (
                                            <div className="flex flex-col">
                                                <span className={`text-[14px] font-black uppercase tracking-[0.25em] truncate max-w-[110px] ${isMeasureSelected ? 'text-white' : 'text-zinc-400'}`}>
                                                    {measure.chordName || 'CHORD'}
                                                </span>
                                                <div className={`h-[3px] w-6 mt-1.5 rounded-full transition-all duration-500 ${isMeasureSelected ? 'bg-cyan-400' : 'bg-white/10'}`} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!isCollapsed && (
                                            <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/[0.05] backdrop-blur-xl shadow-inner group-hover:border-white/20 transition-all">
                                                <button onClick={(e) => { e.stopPropagation(); onCopyMeasure(measure.id); }} className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-cyan-400 transition-all active:scale-75">
                                                    <div className="w-4 h-4"><Icons.Copy /></div>
                                                </button>
                                                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                                                <button onClick={(e) => { e.stopPropagation(); onRemoveMeasure(measure.id); }} className="p-2 hover:bg-rose-500/10 rounded-xl text-zinc-500 hover:text-rose-400 transition-all active:scale-75">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); onToggleCollapse(measure.id); }} className="p-2.5 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 rounded-2xl text-zinc-400 hover:text-cyan-400 shadow-2xl transition-all active:scale-90">
                                            <div className="w-4 h-4">{isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Content Area */}
                                {!isCollapsed && (
                                    <div className="flex flex-row items-center gap-4 overflow-x-auto custom-scrollbar-mini pb-2 px-1">
                                        {measure.notes.map((note, nIdx) => {
                                            const isNoteDragging = draggedNote?.measureId === measure.id && draggedNote?.index === nIdx;
                                            const isNoteOver = dragOverNoteIndex === nIdx && draggedNote?.measureId === measure.id;
                                            const isSelected = selectedNoteIds.includes(note.id);
                                            const timing = noteTimingMap.get(note.id);
                                            const isPlaying = timing && currentCursorMs > 0 && currentCursorMs >= timing.start && currentCursorMs < timing.end;

                                            return (
                                                <div
                                                    key={note.id}
                                                    onClick={(e) => { e.stopPropagation(); onSelectNote(note.id, e.shiftKey || e.ctrlKey); }}
                                                    draggable={true}
                                                    onDragStart={(e) => handleNoteDragStart(e, measure.id, nIdx)}
                                                    onDragOver={(e) => handleNoteDragOver(e, measure.id, nIdx)}
                                                    onDrop={(e) => handleNoteDrop(e, measure.id, nIdx)}
                                                    onDragEnd={handleNoteDragEnd}
                                                    onDragLeave={() => setDragOverNoteIndex(null)}
                                                    className={`
                                                        relative h-24 min-w-[110px] rounded-[28px] border-[2px] flex flex-col transition-all duration-700 cursor-pointer group/note overflow-hidden
                                                        ${isPlaying
                                                            ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_50px_rgba(6,182,212,0.5)] scale-[1.1] z-20 -translate-y-2'
                                                            : isSelected
                                                                ? 'border-cyan-400/80 bg-cyan-950/60 ring-2 ring-cyan-400/20'
                                                                : 'border-white/[0.1] bg-black/60 hover:border-white/30 hover:-translate-y-1 shadow-2xl'}
                                                        ${isNoteDragging ? 'opacity-20 scale-90 blur-[2px]' : ''}
                                                        ${isNoteOver ? 'border-cyan-400 scale-[1.05] -translate-y-1' : ''}
                                                    `}
                                                >
                                                    {/* Glow Stripe */}
                                                    <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

                                                    {/* Note Header */}
                                                    <div className={`px-4 py-3 flex items-center justify-between border-b transition-all duration-500 ${isSelected || isPlaying ? 'border-cyan-400/20 bg-cyan-400/10' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                                                        <span className={`text-[12px] font-black tracking-widest ${isSelected || isPlaying ? 'text-cyan-400' : 'text-zinc-500'}`}>
                                                            {note.duration.toUpperCase()}
                                                        </span>

                                                        {/* Floating Actions */}
                                                        <div className="flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-all transform scale-75 group-hover/note:scale-100">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onCopyNote?.(note.id); }}
                                                                className="p-1.5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-cyan-400 transition-all active:scale-75"
                                                            >
                                                                <div className="w-4 h-4"><Icons.Copy /></div>
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onRemoveNote?.(note.id); }}
                                                                className="p-1.5 hover:bg-rose-500/10 rounded-xl text-zinc-600 hover:text-rose-400 transition-all active:scale-75"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Note Content */}
                                                    <div className="flex-1 flex items-center justify-center p-3 relative z-10">
                                                        {note.positions.length > 0 ? (
                                                            <div className="flex -space-x-2">
                                                                {note.positions.slice(0, 3).map((p, i) => (
                                                                    <div key={i} className={`
                                                                        w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black shadow-2xl transition-all duration-700
                                                                        ${isPlaying ? 'bg-cyan-400 border-white text-black scale-125 rotate-[360deg]' : 'bg-zinc-900 border-white/20 text-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]'}
                                                                    `}>
                                                                        {p.fret}
                                                                    </div>
                                                                ))}
                                                                {note.positions.length > 3 && (
                                                                    <div className="w-6 h-6 rounded-full bg-cyan-950 border-2 border-cyan-400/50 flex items-center justify-center text-[10px] font-black text-cyan-400 shadow-2xl ring-1 ring-cyan-400/20">
                                                                        +
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className={`h-1 w-8 rounded-full transition-all duration-500 ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-white/10'}`} />
                                                        )}
                                                    </div>

                                                    {/* Refined Progress Bar */}
                                                    {isPlaying && timing && (
                                                        <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 rounded-full transition-all duration-100 ease-linear shadow-[0_0_20px_rgba(34,211,238,0.7)]"
                                                            style={{ width: `${Math.min(100, Math.max(0, ((currentCursorMs - timing.start) / (timing.end - timing.start)) * 100))}%` }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAddNote(measure.id); }}
                                            className="h-24 w-16 shrink-0 flex items-center justify-center rounded-[28px] border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-cyan-400/10 text-zinc-600 hover:text-cyan-400 transition-all duration-500 active:scale-90 group/add shadow-2xl"
                                        >
                                            <div className="w-7 h-7 group-hover/add:scale-125 group-hover/add:rotate-90 transition-all duration-700"><Icons.Plus /></div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <button
                        onClick={(e) => { e.stopPropagation(); onAddMeasure(); }}
                        className="w-36 h-[160px] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-cyan-400/5 hover:border-cyan-400/50 rounded-[40px] flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-400 transition-all duration-1000 shrink-0 group/add-m active:scale-[0.95] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
                    >
                        <div className="w-16 h-16 rounded-[28px] bg-white/[0.05] flex items-center justify-center group-hover/add-m:scale-110 group-hover/add-m:rotate-180 group-hover/add-m:bg-cyan-400 group-hover/add-m:text-black transition-all duration-700 border border-white/10 shadow-3xl">
                            <div className="w-8 h-8"><Icons.Plus /></div>
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] mt-5 opacity-40 group-hover/add-m:opacity-100 transition-all">NEW BLOCK</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChordTimeline;


'use client';

import React, { useState } from 'react';
import { MeasureData, NoteData, Duration } from '@/lib/tab-editor/types';
import { getNoteDurationValue, getMeasureCapacity } from '@/lib/tab-editor/utils/musicMath';
import { Icons } from '@/lib/tab-editor/constants';

interface VisualEditorProps {
    measures: MeasureData[];
    selectedNoteIds: string[];
    timeSignature: string;
    activeDuration: Duration;
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
    onRemoveNote: (id: string) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({
    measures,
    selectedNoteIds,
    timeSignature,
    activeDuration,
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
    onRemoveNote
}) => {
    const capacity = getMeasureCapacity(timeSignature);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

    const getTechLabel = (tech: string) => {
        switch (tech) {
            case 's': return 'SLIDE';
            case 'h': return 'HAMMER';
            case 'p': return 'PULL';
            case 'b': return 'BEND';
            case 'v': return 'VIB';
            default: return tech.toUpperCase();
        }
    };

    // Timeline / Horizontal Layout
    return (
        <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0a0a0a] border-b border-[#222] shrink-0 z-20 shadow-md">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 tracking-wider uppercase drop-shadow-[0_0_2px_rgba(6,182,212,0.5)] flex items-center gap-2">
                        <Icons.Grip />
                        Score Constructor
                    </h2>
                </div>
                <div className="flex items-center space-x-3">
                    {hasClipboard && (
                        <button
                            onClick={() => onPasteMeasure('')}
                            className="px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-black hover:bg-emerald-500/10 transition-all flex items-center space-x-2"
                        >
                            <Icons.Paste />
                            <span>PASTE</span>
                        </button>
                    )}
                    <button
                        onClick={onAddMeasure}
                        className="px-3 py-1.5 bg-cyan-950/30 text-cyan-400 border border-cyan-500/20 rounded-md text-[10px] font-black hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all flex items-center space-x-2 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                    >
                        <span>+ NEW SECTION</span>
                    </button>
                </div>
            </div>

            {/* Horizontal Timeline Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar bg-[#050505]">
                <div className="flex flex-row gap-4 min-w-max h-full items-start">
                    {measures.map((measure, mIdx) => {
                        const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
                        const usagePercent = Math.min((currentTotal / capacity) * 100, 100);
                        const isFull = currentTotal >= capacity - 0.001;
                        const isCollapsed = measure.isCollapsed;
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;

                        return (
                            <div
                                key={measure.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, mIdx)}
                                onDragOver={(e) => handleDragOver(e, mIdx)}
                                onDrop={(e) => handleDrop(e, mIdx)}
                                onDragEnd={handleDragEnd}
                                onDragLeave={() => setDragOverIndex(null)}
                                className={`
                                    flex flex-col
                                    relative group transition-all duration-300
                                    rounded-2xl border
                                    ${isCollapsed ? 'w-20' : 'min-w-[280px]'}
                                    ${isDragging ? 'opacity-40 border-dashed border-slate-600' : 'opacity-100 border-[#222] bg-[#0f0f0f] hover:border-[#333] hover:bg-[#111]'}
                                    ${isOver ? 'border-cyan-500/50 scale-[1.01]' : ''}
                                    h-[90%] 
                                `}
                            >
                                {/* Measure Header */}
                                <div className={`flex flex-col p-3 ${isCollapsed ? 'items-center space-y-4' : 'border-b border-[#222]'}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-5 h-5 flex items-center justify-center rounded-md bg-[#1a1a1a] border border-[#333] text-[9px] font-black text-slate-500 cursor-grab active:cursor-grabbing hover:text-cyan-400 transition-colors"
                                                title="Drag to reorder"
                                            >
                                                {mIdx + 1}
                                            </div>
                                            {!isCollapsed && (
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Measure {mIdx + 1}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            {!isCollapsed && (
                                                <div className="flex items-center space-x-1 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => onUpdateMeasure(measure.id, { showClef: !measure.showClef })} className={`p-1 rounded transition-all ${measure.showClef ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-700 hover:text-slate-400'}`} title="Show Clef"><span className="text-[10px] font-serif">𝄞</span></button>
                                                    <button onClick={() => onUpdateMeasure(measure.id, { showTimeSig: !measure.showTimeSig })} className={`p-1 rounded transition-all ${measure.showTimeSig ? 'text-purple-400 bg-purple-500/10' : 'text-slate-700 hover:text-slate-400'}`} title="Show Time Sig"><span className="text-[8px] font-serif font-bold">4/4</span></button>
                                                </div>
                                            )}

                                            <button onClick={() => onToggleCollapse(measure.id)} className="p-1 hover:bg-[#222] rounded text-slate-600 hover:text-white transition-colors">
                                                {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Bar (Only visible on hover if not collapsed) */}
                                    {!isCollapsed && (
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex flex-col w-full mr-4">
                                                <div className="w-full h-0.5 bg-[#222] rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all duration-500 ${isFull ? 'bg-cyan-500' : 'bg-slate-600'}`} style={{ width: `${usagePercent}%` }} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onCopyMeasure(measure.id)} className="p-1 text-slate-600 hover:text-cyan-400 transition-colors"><Icons.Copy /></button>
                                                <button onClick={() => onRemoveMeasure(measure.id)} className="p-1 text-slate-600 hover:text-red-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Vertical Info when collapsed */}
                                    {isCollapsed && (
                                        <div className="flex flex-col items-center space-y-2 py-4">
                                            <div className="text-[9px] font-black text-slate-700 rotated-text uppercase tracking-widest whitespace-nowrap" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                                {measure.notes.length} Notes
                                            </div>
                                            <div className={`w-0.5 h-8 rounded-full ${isFull ? 'bg-cyan-500/50' : 'bg-[#222]'}`} />
                                        </div>
                                    )}
                                </div>

                                {/* Measure Content (Notes) */}
                                {!isCollapsed && (
                                    <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                                        <div className="flex flex-wrap content-start gap-1.5">
                                            {measure.notes.map((note) => {
                                                const isSelected = selectedNoteIds.includes(note.id);
                                                const isRest = note.type === 'rest';

                                                return (
                                                    <div
                                                        key={note.id}
                                                        onClick={(e) => onSelectNote(note.id, e.shiftKey || e.ctrlKey)}
                                                        onDoubleClick={() => onDoubleClickNote(note.id)}
                                                        className={`
                                                            relative cursor-pointer transition-all duration-200 group/note
                                                            w-12 h-16 rounded-lg border flex flex-col items-center justify-center select-none
                                                            ${isSelected
                                                                ? (isRest ? 'bg-slate-800 border-slate-500' : 'bg-cyan-900/30 border-cyan-500/50')
                                                                : 'bg-[#151515] border-[#222] hover:border-[#444] hover:bg-[#1a1a1a]'}
                                                            ${isRest ? 'grayscale opacity-60' : ''}
                                                        `}
                                                    >
                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onRemoveNote(note.id); }}
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/note:opacity-100 transition-all hover:scale-110 shadow-sm z-20"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>

                                                        {/* Note Info */}
                                                        <span className={`absolute top-0.5 left-1 text-[7px] font-black uppercase ${isSelected ? 'text-white' : 'text-[#444]'}`}>
                                                            {note.duration}{note.decorators.dot && '.'}
                                                        </span>

                                                        {/* Main Value */}
                                                        <div className={`transition-transform duration-300 group-hover/note:scale-110 ${isRest ? 'text-[#333]' : 'text-slate-200'}`}>
                                                            {isRest ? Icons.MusicRest(note.duration) : <span className="text-xl font-black">{note.fret}</span>}
                                                        </div>

                                                        {/* String Info */}
                                                        {!isRest && <span className="text-[6px] font-bold text-[#444] uppercase mt-0.5">STR {note.string}</span>}

                                                        {/* Indicators */}
                                                        <div className="absolute bottom-1 flex gap-0.5">
                                                            {note.technique && <div className={`w-0.5 h-0.5 rounded-full ${getTechColor(note.technique)}`} />}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Add Button */}
                                            {!isFull && (
                                                <button
                                                    onClick={() => onAddNote(measure.id)}
                                                    className="w-12 h-16 border border-dashed border-[#222] rounded-lg flex flex-col items-center justify-center text-[#333] hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all active:scale-95 group/add"
                                                    title="Add Note"
                                                >
                                                    <span className="scale-75 opacity-50 group-hover/add:opacity-100 transition-opacity">
                                                        <Icons.Plus />
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Section Button (End of Timeline) */}
                    <button
                        onClick={onAddMeasure}
                        className="w-12 h-[90%] border border-dashed border-[#222] rounded-2xl flex items-center justify-center text-[#333] hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all shrink-0"
                        title="Add New Measure"
                    >
                        <Icons.Plus />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisualEditor;

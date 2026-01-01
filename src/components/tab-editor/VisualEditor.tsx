
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
    onSelectMeasure: (id: string) => void;
    onDeselectAll: () => void;
    selectedMeasureId: string | null;
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
    onRemoveNote,
    onSelectMeasure,
    onDeselectAll,
    selectedMeasureId
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
        <div
            className="flex flex-col w-full h-full bg-black/20 backdrop-blur-xl border-t border-white/5 relative"
            onClick={onDeselectAll}
        >
            {/* Horizontal Timeline Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 custom-scrollbar bg-black/40">
                <div className="flex flex-row gap-4 min-w-max h-full items-start">
                    {measures.map((measure, mIdx) => {
                        const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
                        const usagePercent = Math.min((currentTotal / capacity) * 100, 100);
                        const isFull = currentTotal >= capacity - 0.001;
                        const isCollapsed = measure.isCollapsed;
                        const isDragging = draggedIndex === mIdx;
                        const isOver = dragOverIndex === mIdx;
                        const isMeasureSelected = measure.id === selectedMeasureId;

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
                                    relative group transition-all duration-300
                                    rounded-2xl border
                                    ${isCollapsed ? 'w-20' : 'min-w-[220px]'}
                                    ${isDragging ? 'opacity-40 border-dashed border-slate-600' :
                                        isMeasureSelected
                                            ? 'opacity-100 border-cyan-500 bg-[#161616] shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                            : 'opacity-100 border-[#222] bg-[#0f0f0f] hover:border-[#333] hover:bg-[#111]'}
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
                                                    <button onClick={(e) => { e.stopPropagation(); onUpdateMeasure(measure.id, { showClef: !measure.showClef }); }} className={`p-1 rounded transition-all ${measure.showClef ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-700 hover:text-slate-400'}`} title="Show Clef"><span className="text-[10px] font-serif">𝄞</span></button>
                                                    <button onClick={(e) => { e.stopPropagation(); onUpdateMeasure(measure.id, { showTimeSig: !measure.showTimeSig }); }} className={`p-1 rounded transition-all ${measure.showTimeSig ? 'text-purple-400 bg-purple-500/10' : 'text-slate-700 hover:text-slate-400'}`} title="Show Time Sig"><span className="text-[8px] font-serif font-bold">4/4</span></button>
                                                </div>
                                            )}

                                            <button onClick={(e) => { e.stopPropagation(); onToggleCollapse(measure.id); }} className="p-1 hover:bg-[#222] rounded text-slate-600 hover:text-white transition-colors">
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
                                                <button onClick={(e) => { e.stopPropagation(); onCopyMeasure(measure.id); }} className="p-1 text-slate-600 hover:text-cyan-400 transition-colors"><Icons.Copy /></button>
                                                <button onClick={(e) => { e.stopPropagation(); onRemoveMeasure(measure.id); }} className="p-1 text-slate-600 hover:text-red-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
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
                                                        onClick={(e) => { e.stopPropagation(); onSelectNote(note.id, e.shiftKey || e.ctrlKey); }}
                                                        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClickNote(note.id); }}
                                                        className={`
                                                            relative cursor-pointer transition-all duration-200 group/note
                                                            w-10 h-14 rounded-lg border flex flex-col items-center justify-center select-none
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
                                                        <div className={`flex flex-col items-center justify-center transition-transform duration-300 group-hover/note:scale-105 ${isRest ? 'text-[#333]' : 'text-slate-200'} ${note.positions.length > 3 ? 'gap-0' : 'gap-0.5'}`}>
                                                            {isRest ? Icons.MusicRest(note.duration) : note.positions.map((pos, idx) => (
                                                                <div key={idx} className="flex flex-col items-center leading-none">
                                                                    <span className={`${note.positions.length > 3 ? 'text-[9px]' : note.positions.length > 2 ? 'text-[11px]' : 'text-base'} font-black`}>{pos.fret}</span>
                                                                    {note.positions.length <= 2 && <span className="text-[5px] font-bold text-[#444] uppercase">S{pos.string}</span>}
                                                                </div>
                                                            ))}
                                                        </div>

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
                                                    onClick={(e) => { e.stopPropagation(); onAddNote(measure.id); }}
                                                    className="w-10 h-14 border border-dashed border-[#222] rounded-lg flex flex-col items-center justify-center text-[#333] hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all active:scale-95 group/add"
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
                        onClick={(e) => { e.stopPropagation(); onAddMeasure(); }}
                        className="w-16 h-[90%] border-2 border-dashed border-zinc-700/50 bg-zinc-900/50 hover:bg-cyan-500/10 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-cyan-400 transition-all shrink-0 group/add-m"
                        title="Add New Measure"
                    >
                        <Icons.Plus />
                        <span className="text-[8px] font-black uppercase tracking-tighter mt-2 opacity-0 group-hover/add-m:opacity-100 transition-opacity">Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisualEditor;

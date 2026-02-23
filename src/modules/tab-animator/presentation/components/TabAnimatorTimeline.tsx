import React, { useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Plus, Clock, Trash2, Copy, GripVertical } from "lucide-react";
import { Note } from "../../domain/types";
import { cn } from "@/shared/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface TabAnimatorTimelineProps {
    notes: Note[];
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onSeek: (time: number) => void;
    onReset: () => void;
    onAddNote: () => void;
    onSelectNote: (id: string) => void;
    selectedNoteId: string | null;
    onDeleteNote: (id: string) => void;
    onAddPosition: (id: string) => void;
    onDuplicateNote: (id: string) => void;
    onReorderNotes: (notes: Note[]) => void;
}

export function TabAnimatorTimeline({
    notes,
    currentTime,
    duration,
    isPlaying,
    onTogglePlay,
    onSeek,
    onReset,
    onAddNote,
    onSelectNote,
    selectedNoteId,
    onDeleteNote,
    onAddPosition,
    onDuplicateNote,
    onReorderNotes
}: TabAnimatorTimelineProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to selected note
    useEffect(() => {
        if (selectedNoteId) {
            const element = document.getElementById(`note-${selectedNoteId}`);
            if (element && scrollContainerRef.current) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [selectedNoteId]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(notes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Map times based on original sequence but preserve durations
        // This is a simple reordering logic: re-calculate times to maintain original spacing increments
        let lastTime = items[0].time;
        const updatedItems = items.map((item, idx) => {
            if (idx === 0) return item;
            const prevItem = items[idx - 1];
            const newTime = prevItem.time + prevItem.duration;
            return { ...item, time: newTime };
        });

        onReorderNotes(updatedItems);
    };

    return (
        <div className="flex flex-col w-full bg-background-dark/40 backdrop-blur-2xl border-t border-white/[0.05] relative overflow-hidden rounded-t-[32px]">
            {/* Playback Progress Overlay (Top Line) */}
            <div
                className="absolute top-0 left-0 h-1 bg-emerald-500 z-50 transition-all duration-100 ease-linear shadow-cyan-glow"
                style={{ width: `${Math.min(100, (currentTime / Math.max(duration, 0.1)) * 100)}%` }}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="timeline" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={(el) => {
                                provided.innerRef(el);
                                (scrollContainerRef as any).current = el;
                            }}
                            className="flex-1 overflow-x-auto overflow-y-hidden px-10 py-8 custom-scrollbar relative z-10"
                        >
                            <div className="flex flex-row gap-6 min-w-max h-full items-start">
                                {notes.map((note, index) => {
                                    const isSelected = selectedNoteId === note.id;
                                    const isActive = currentTime >= note.time && currentTime < (note.time + note.duration);

                                    // Calculate progress within the note
                                    const noteProgress = isActive
                                        ? ((currentTime - note.time) / note.duration) * 100
                                        : (currentTime >= note.time + note.duration ? 100 : 0);

                                    return (
                                        <Draggable key={note.id} draggableId={note.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    id={`note-${note.id}`}
                                                    onClick={() => onSelectNote(note.id)}
                                                    className={cn(
                                                        "flex flex-col relative group transition-all duration-500 rounded-[28px] border w-[160px] h-32 overflow-hidden cursor-pointer",
                                                        isSelected
                                                            ? "opacity-100 border-emerald-500 bg-emerald-500/[0.08] shadow-premium-glow ring-1 ring-emerald-500/20 z-10 scale-[1.02]"
                                                            : "opacity-100 border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1]",
                                                        snapshot.isDragging && "shadow-2xl ring-2 ring-emerald-500/50 bg-emerald-500/10 rotate-2"
                                                    )}
                                                >
                                                    {/* Drag Handle */}
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="absolute top-1/2 left-1 -translate-y-1/2 opacity-0 group-hover:opacity-40 hover:opacity-100 p-1 text-zinc-400 cursor-grab active:cursor-grabbing transition-opacity"
                                                    >
                                                        <GripVertical className="w-4 h-4" />
                                                    </div>

                                                    {/* Active Selection Indicator Line */}
                                                    {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500 opacity-50 shadow-cyan-glow" />}

                                                    {/* Note Header */}
                                                    <div className="flex items-center justify-between p-3 pl-5">
                                                        <div className={cn(
                                                            "flex items-center justify-center rounded-md text-[10px] font-bold w-6 h-6 transition-all",
                                                            isSelected ? "bg-emerald-500 text-black shadow-cyan-glow" : "bg-white/5 text-zinc-500"
                                                        )}>
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500">
                                                            <Clock className="w-3 h-3" />
                                                            {note.time.toFixed(1)}s
                                                        </div>
                                                    </div>

                                                    {/* Note Content (Multi-finger Chord View) */}
                                                    <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                                                        <div className="flex flex-wrap items-center justify-center gap-1.5 px-4">
                                                            {note.positions.map((pos, pIdx) => (
                                                                <div key={pIdx} className={cn(
                                                                    "size-7 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all duration-500",
                                                                    isActive ? "bg-emerald-500 text-black scale-105 shadow-cyan-glow border-emerald-400" : "bg-zinc-800 text-slate-300 border-white/5"
                                                                )}>
                                                                    {pos.fret}
                                                                </div>
                                                            ))}
                                                            {/* Inline Add Finger Button */}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onAddPosition(note.id); }}
                                                                className="size-7 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group/plus"
                                                            >
                                                                <Plus className="size-3 group-hover/plus:rotate-90 transition-transform" />
                                                            </button>
                                                        </div>
                                                        <span className="text-[7px] font-black text-zinc-500 mt-1 tracking-[0.2em] uppercase">
                                                            {note.positions.length} DEDOS
                                                        </span>
                                                    </div>

                                                    {/* Action Buttons (Hover) */}
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDuplicateNote(note.id); }}
                                                            className="p-1.5 hover:bg-emerald-500/10 rounded-md text-zinc-500 hover:text-emerald-400 transition-all"
                                                            title="Duplicar Nota"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                                                            className="p-1.5 hover:bg-rose-500/10 rounded-md text-zinc-500 hover:text-rose-400 transition-all"
                                                            title="Excluir Nota"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Progress bar inside card */}
                                                    <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                                                        <div
                                                            className="h-full bg-emerald-500 transition-all duration-100 ease-linear shadow-cyan-glow"
                                                            style={{ width: `${noteProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}

                                {/* Add Note Button */}
                                <button
                                    onClick={onAddNote}
                                    className="w-32 h-32 border-2 border-dashed border-white/[0.05] bg-white/[0.01] hover:bg-emerald-500/[0.03] hover:border-emerald-500/30 rounded-[32px] flex flex-col items-center justify-center text-zinc-600 hover:text-emerald-500 transition-all duration-700 shrink-0 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-white/[0.02] flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 group-hover:bg-emerald-500/10 transition-all duration-500 shadow-xl border border-white/[0.03] group-hover:border-emerald-500/20">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-40 group-hover:opacity-100 transition-opacity">Nova Nota</span>
                                </button>
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Bottom Controls Bar */}
            <div className="h-20 shrink-0 bg-white/[0.02] border-t border-white/[0.05] px-8 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                        title="Reset"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onTogglePlay}
                        className={cn(
                            "flex items-center gap-3 px-6 h-12 rounded-2xl font-black text-xs tracking-widest transition-all duration-500",
                            isPlaying
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 shadow-premium-glow"
                                : "bg-emerald-500 text-black border border-emerald-400 hover:shadow-cyan-glow"
                        )}
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isPlaying ? "PAUSAR" : "REPRODUZIR"}
                    </button>
                </div>

                {/* Seek Slider */}
                <div className="flex-1 max-w-2xl px-12 group">
                    <div className="relative pt-1">
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            step="0.01"
                            value={currentTime}
                            onChange={(e) => onSeek(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500 group-hover:accent-emerald-400 transition-all"
                        />
                    </div>
                </div>

                {/* Time Indicator */}
                <div className="flex items-center gap-4 bg-black/40 px-5 py-2.5 rounded-2xl border border-white/[0.03] shadow-inner-glow shrink-0">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Tempo Atual</span>
                        <span className="text-xl font-mono font-black text-emerald-500 leading-none tracking-tighter tabular-nums">
                            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(2).padStart(5, '0')}
                        </span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/5" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Duração</span>
                        <span className="text-sm font-mono font-black text-zinc-400 leading-none tabular-nums">
                            {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

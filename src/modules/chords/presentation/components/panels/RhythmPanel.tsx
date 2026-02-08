import React from 'react';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';
import { SidebarProps } from '../sidebar-types';
import { EmptyState } from './EmptyState';
import { Duration } from '@/modules/editor/domain/types';
import { VexFlowRhythmIcon } from '../VexFlowRhythmIcon';
import { Clock } from 'lucide-react';

export const RhythmPanel: React.FC<SidebarProps> = ({
    editingNote,
    activeMeasure,
    onSelectDuration,
    onNoteRhythmChange,
    onNoteTypeChange,
    onNoteDurationStatic,
    isSequentialMode
}) => {
    // Determine display note: editingNote or first note of active measure
    const displayNote = editingNote || (activeMeasure?.notes && activeMeasure.notes.length > 0 ? activeMeasure.notes[0] : null);

    if (!displayNote) {
        return (
            <EmptyState
                icon={Clock}
                title="Rhythm Controls"
                description="Select a note to adjust its musical duration and feel in the timeline."
                features={[
                    "Select Note Duration",
                    "Whole to 32nd Notes",
                    "Sync with Playback"
                ]}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Duration</label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'Whole', code: 'w' as Duration },
                        { label: 'Half', code: 'h' as Duration },
                        { label: 'Quarter', code: 'q' as Duration },
                        { label: '8th', code: '8' as Duration },
                        { label: '16th', code: '16' as Duration },
                        { label: '32nd', code: '32' as Duration },
                    ].map((item) => {
                        const isActive = displayNote.duration === item.code;
                        return (
                            <button
                                key={item.code}
                                onClick={() => {
                                    if (isSequentialMode && onNoteDurationStatic && displayNote) {
                                        onNoteDurationStatic(displayNote.id, item.code);
                                    } else {
                                        onSelectDuration(item.code);
                                        onNoteRhythmChange?.(item.code);
                                    }
                                }}
                                className={`aspect-[5/6] rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-500 group/dur ${isActive ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20' : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/40'}`}
                            >
                                <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover/dur:scale-105'}`}>
                                    <VexFlowRhythmIcon
                                        duration={item.code}
                                        className="w-10 h-10"
                                        fillColor={isActive ? '#22d3ee' : '#3f3f46'}
                                    />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-primary' : 'text-zinc-600'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Modifiers</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onNoteRhythmChange?.(undefined, !displayNote.decorators.dot)}
                            className={`flex-1 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase transition-all border ${displayNote.decorators.dot
                                ? 'bg-primary/20 border-primary/50 text-primary'
                                : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                }`}
                        >
                            • Dotted
                        </button>
                        <button
                            onClick={() => onNoteTypeChange?.(displayNote.type === 'rest' ? 'note' : 'rest')}
                            className={`flex-1 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase transition-all border ${displayNote.type === 'rest'
                                ? 'bg-primary/20 border-primary/50 text-primary'
                                : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                }`}
                        >
                            Rest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

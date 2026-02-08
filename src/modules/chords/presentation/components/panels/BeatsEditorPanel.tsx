import React from 'react';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';
import { SidebarProps } from '../sidebar-types';
import { EmptyState } from './EmptyState';
// import { SidebarBeatsEditor } from './SidebarBeatsEditor'; // Removed unused import
import { Guitar } from 'lucide-react';

// Wrapper component to lazy load or just structure the code
// I realized I should probably extract the "SidebarBeatsEditor" logic chunks.
// Ideally, I'd port the logic from BeatsSidebar.tsx into this.

// Wait, the Beats content is complex. I'll just copy the content from BeatsSidebar into this file for now.

import { Duration } from "@/modules/editor/domain/types";
import { getNoteDurationValue, getMeasureCapacity } from "@/modules/editor/domain/music-math";
import { VexFlowRhythmIcon } from "@/modules/chords/presentation/components/VexFlowRhythmIcon";
import { ArrowDown, ArrowUp, Zap, ZapOff, Circle, Waves } from "lucide-react";

export const BeatsEditorPanel: React.FC<SidebarProps> = ({
    activeMeasure,
    activeDuration,
    onAddNote,
    editingNote,
    onSelectNote,
    onRemoveNote,
    onNoteRhythmChange,
    onNoteDurationStatic,
    onUpdateNote,
    globalSettings,
    theme
}) => {
    const { t } = useTranslation();

    if (!activeMeasure) {
        return (
            <EmptyState
                icon={Guitar}
                title={t('beats.select_measure_title')}
                description={t('beats.select_measure_desc')}
                features={[
                    "Add Multiple Beats",
                    "Individual Durations",
                    "Strumming Patterns"
                ]}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
            {/* Beats Map Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('beats.map_title')}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onAddNote?.(activeMeasure.id, activeDuration)}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[9px] font-bold hover:bg-primary/20 transition-colors border border-primary/20"
                        >
                            {t('beats.add_beat')}
                        </button>
                    </div>
                </div>

                {/* Active Beats List */}
                {activeMeasure.notes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 bg-black/20 p-3 rounded-xl border border-white/5 min-h-[60px] items-center">
                        {activeMeasure.notes.map((note, idx) => {
                            const isSelected = editingNote?.id === note.id;
                            const direction = note.strumDirection || 'down';

                            return (
                                <div key={note.id} className="relative group">
                                    <button
                                        onClick={() => onSelectNote?.(note.id, false)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border flex items-center gap-2 ${isSelected ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-black/40 border-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'}`}
                                        style={isSelected ? {
                                            backgroundColor: theme?.fingers?.color || '#06b6d4',
                                            borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                            color: theme?.fingers?.textColor || '#ffffff'
                                        } : {}}
                                    >
                                        <span className="opacity-50">#{idx + 1}</span>
                                        {direction === 'down' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                                        <span className="text-[8px] opacity-60 uppercase">{note.duration}</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveNote?.(note.id); }}
                                        className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Rhythm Controls - Only show when a note is selected */}
            {editingNote && (
                <div className="space-y-6">
                    {/* Duration Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('beats.duration')}</label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Whole', code: 'w' as Duration },
                                { label: 'Half', code: 'h' as Duration },
                                { label: 'Quarter', code: 'q' as Duration },
                                { label: '8th', code: '8' as Duration },
                                { label: '16th', code: '16' as Duration },
                            ].map((item) => {
                                const currentNoteValue = getNoteDurationValue(editingNote.duration, !!editingNote.decorators.dot);
                                const isActive = editingNote.duration === item.code;

                                // --- CAPACITY CHECK ---
                                const timeSignature = globalSettings?.time || '4/4';
                                const capacity = getMeasureCapacity(timeSignature);
                                const currentTotal = activeMeasure?.notes.reduce((acc, note) =>
                                    acc + getNoteDurationValue(note.duration, !!note.decorators.dot), 0) || 0;

                                const targetValue = getNoteDurationValue(item.code, false);

                                // Logic for editing
                                const remainingAfterOthers = capacity - (currentTotal - currentNoteValue);
                                const isDisabled = !isActive && (targetValue > remainingAfterOthers + 0.001);

                                return (
                                    <button
                                        key={item.code}
                                        disabled={isDisabled}
                                        onClick={() => {
                                            if (isDisabled) return;
                                            if (onNoteDurationStatic) {
                                                onNoteDurationStatic(editingNote.id, item.code);
                                            } else {
                                                onNoteRhythmChange?.(item.code);
                                            }
                                        }}
                                        className={`aspect-[5/6] rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${isActive
                                            ? 'bg-primary/20 border-primary/50 text-primary shadow-cyan-glow'
                                            : isDisabled
                                                ? 'bg-zinc-900/10 border-zinc-900/20 opacity-20 cursor-not-allowed grayscale'
                                                : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/40'
                                            }`}
                                    >
                                        <VexFlowRhythmIcon
                                            duration={item.code}
                                            className="w-8 h-8"
                                            fillColor={isActive ? '#22d3ee' : '#3f3f46'}
                                        />
                                        <span className={`text-[8px] font-black uppercase ${isActive ? 'text-primary' : 'text-zinc-600'}`}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Extra individual note controls */}
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 pt-4 border-t border-white/5">
                        {/* Strumming Direction */}
                        <div className="space-y-2 animate-in fade-in duration-300">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('beats.direction')}</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onUpdateNote?.({ strumDirection: 'down' })}
                                    className={`flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${editingNote.strumDirection === 'down' || !editingNote.strumDirection
                                        ? 'bg-primary/20 border-primary/50 text-primary shadow-cyan-glow'
                                        : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                        }`}
                                >
                                    <ArrowDown className="w-5 h-5 mb-1" />
                                    <span className="text-[8px] font-black">{t('beats.down')}</span>
                                </button>
                                <button
                                    onClick={() => onUpdateNote?.({ strumDirection: 'up' })}
                                    className={`flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${editingNote.strumDirection === 'up'
                                        ? 'bg-primary/20 border-primary/50 text-primary shadow-cyan-glow'
                                        : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                        }`}
                                >
                                    <ArrowUp className="w-5 h-5 mb-1" />
                                    <span className="text-[8px] font-black">{t('beats.up')}</span>
                                </button>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => onUpdateNote?.({ strumDirection: 'pause' })}
                                    className={`flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${editingNote.strumDirection === 'pause'
                                        ? 'bg-primary/20 border-primary/50 text-primary shadow-cyan-glow'
                                        : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                        }`}
                                >
                                    <Circle className="w-5 h-5 mb-1 fill-current" />
                                    <span className="text-[8px] font-black">{t('beats.pause')}</span>
                                </button>
                                <button
                                    onClick={() => onUpdateNote?.({ strumDirection: 'mute' })}
                                    className={`flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${editingNote.strumDirection === 'mute'
                                        ? 'bg-primary/20 border-primary/50 text-primary shadow-cyan-glow'
                                        : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                        }`}
                                >
                                    <Waves className="w-5 h-5 mb-1" />
                                    <span className="text-[8px] font-black">{t('beats.mute')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Beat Strength (Strong/Weak) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('beats.accent')}</label>
                            <button
                                onClick={() => {
                                    const newVal = editingNote.isStrong === false;
                                    onUpdateNote?.({ isStrong: newVal });
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${editingNote.isStrong !== false
                                    ? 'bg-secondary/20 border-secondary/50 text-secondary shadow-[0_0_15px_rgba(255,0,229,0.15)]'
                                    : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {editingNote.isStrong !== false ? <Zap className="w-4 h-4 text-secondary fill-secondary/20" /> : <ZapOff className="w-4 h-4" />}
                                    <span className="text-[10px] font-black uppercase tracking-wider">{t('beats.strong_beat')}</span>
                                </div>
                                <div className={`w-9 h-5 rounded-full relative transition-all duration-300 ${editingNote.isStrong !== false ? 'bg-primary shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-zinc-800'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${editingNote.isStrong !== false ? 'left-5' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>

                        {/* Finger Selection */}
                        <div className="space-y-2 animate-in fade-in duration-300">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('beats.strum_finger')}</label>
                            <div className="flex gap-1.5 flex-wrap">
                                {['P', 'i', 'm', 'a'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => onUpdateNote?.({ strumFinger: f })}
                                        className={`size-8 rounded-lg font-black text-xs border transition-all ${editingNote.strumFinger === f
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                                <input
                                    type="text"
                                    value={editingNote.strumFinger || ''}
                                    onChange={(e) => onUpdateNote?.({ strumFinger: e.target.value })}
                                    placeholder="Custom"
                                    className="h-8 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-primary focus:outline-none w-20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State visual when list is empty */}
            {activeMeasure.notes.length === 0 && (
                <div className="flex-1 mt-6">
                    <EmptyState
                        icon={Guitar}
                        title={t('beats.measure_empty_title')}
                        description={t('beats.measure_empty_desc')}
                        actionLabel={t('beats.add_first_beat')}
                        onAction={() => onAddNote?.(activeMeasure.id, activeDuration)}
                    />
                </div>
            )}
        </div>
    );
};

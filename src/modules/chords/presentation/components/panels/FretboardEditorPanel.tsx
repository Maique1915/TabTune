import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';
import { SidebarProps } from '../sidebar-types';
import { EmptyState } from './EmptyState';
import { Guitar } from 'lucide-react';

export const FretboardEditorPanel: React.FC<SidebarProps> = ({
    editingNote,
    activeMeasure,
    activePositionIndex = 0,
    onActivePositionIndexChange,
    onAddChordNote,
    onRemoveChordNote,
    onSetStringForPosition,
    onSetFingerForPosition,
    onSetFretForPosition,
    onToggleBarre,
    onToggleBarreTo,
    globalSettings,
    theme
}) => {
    const { t } = useTranslation();
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isBarreSelectorOpen, setIsBarreSelectorOpen] = useState(false);

    const displayNote = editingNote || (activeMeasure?.notes && activeMeasure.notes.length > 0 ? activeMeasure.notes[0] : null);

    const [prevSelectionState, setPrevSelectionState] = useState<{ id: string | null, index: number | null } | null>(null);

    // Reset barre selector when note changes or active position changes
    const currentSelectionState = { id: editingNote?.id || null, index: activePositionIndex ?? null };
    if (currentSelectionState.id !== prevSelectionState?.id || currentSelectionState.index !== prevSelectionState?.index) {
        setPrevSelectionState(currentSelectionState);
        setIsBarreSelectorOpen(false);
    }

    if (!displayNote) {
        return (
            <EmptyState
                icon={Guitar}
                title={t('fretboard.no_note_selected_title')}
                description={t('fretboard.no_note_selected_desc')}
                features={[
                    t('fretboard.feature_map_fingers'),
                    t('fretboard.feature_select_frets'),
                    t('fretboard.feature_add_barre')
                ]}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
            {/* Strings & Frets - Consolidated */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('fretboard.map')}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={onAddChordNote}
                            className="px-2 py-1 rounded bg-primary/10 text-primary text-[9px] font-bold hover:bg-primary/20 transition-colors border border-primary/20"
                        >
                            {t('fretboard.add_string')}
                        </button>
                    </div>
                </div>

                {/* Active Notes List */}
                <div className="flex flex-wrap gap-1.5 bg-black/20 p-2 rounded-xl border border-white/5 min-h-[50px] items-center">
                    {displayNote.positions.length === 0 && (
                        <span className="text-[9px] text-zinc-600 italic px-2">{t('fretboard.no_notes')}</span>
                    )}
                    {displayNote.positions.map((pos, idx) => (
                        <div key={idx} className="relative group">
                            <button
                                onClick={(e) => {
                                    if (e.shiftKey) {
                                        setSelectedIndices(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                                    } else {
                                        onActivePositionIndexChange?.(idx);
                                        setSelectedIndices([]);
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${activePositionIndex === idx || selectedIndices.includes(idx) ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-black/40 border-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'}`}
                                style={activePositionIndex === idx || selectedIndices.includes(idx) ? {
                                    backgroundColor: theme?.fingers?.color || '#06b6d4',
                                    borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                    color: theme?.fingers?.textColor || '#ffffff'
                                } : {}}
                            >
                                F{pos.fret} / S{pos.string}{pos.endString && pos.endString !== pos.string ? `-${pos.endString}` : ''}
                                {pos.finger !== undefined && (
                                    <span className="ml-1 opacity-40 text-[8px]">({pos.finger === 0 ? 'T' : pos.finger})</span>
                                )}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemoveChordNote?.(idx); }}
                                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* Detailed Editors - Only visible if notes exist */}
                {displayNote.positions.length > 0 && (() => {
                    const safeActiveIndex = activePositionIndex ?? 0;
                    const currentPos = displayNote.positions[safeActiveIndex];
                    const usedFingers = displayNote.positions
                        .filter((_, idx) => idx !== safeActiveIndex)
                        .map(p => p.finger)
                        .filter(f => f !== undefined && f !== 0);

                    return (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            {/* 1. String Selector */}
                            <div className="space-y-2 pt-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('fretboard.select_string')}</span>
                                <div className="flex gap-2 justify-between">
                                    {Array.from({ length: globalSettings?.numStrings || 6 }, (_, i) => (globalSettings?.numStrings || 6) - i).map(s => {
                                        const isActive = currentPos?.string === s;
                                        const isUsedElsewhere = displayNote.positions.some((p, i) => p.string === s && i !== activePositionIndex);

                                        return (
                                            <button
                                                key={s}
                                                disabled={isUsedElsewhere}
                                                onClick={() => onSetStringForPosition?.(safeActiveIndex, s)}
                                                className={`flex-1 h-9 rounded-lg border font-bold text-[10px] transition-all flex items-center justify-center ${isActive
                                                    ? 'bg-primary shadow-cyan-glow border-primary text-black'
                                                    : isUsedElsewhere
                                                        ? 'bg-black/40 border-white/5 text-zinc-700 cursor-not-allowed'
                                                        : 'bg-black/20 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Finger Selector */}
                            <div className="space-y-2 pt-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('fretboard.select_finger')}</span>
                                <div className="flex gap-2">
                                    {[
                                        { label: '1', val: 1 },
                                        { label: '2', val: 2 },
                                        { label: '3', val: 3 },
                                        { label: '4', val: 4 },
                                        { label: 'T', val: 0 },
                                        { label: 'X', val: 'X' }
                                    ].map((finger) => {
                                        const isAvoidVal = finger.val === 'X';
                                        const isActive = isAvoidVal ? currentPos?.avoid : (currentPos?.finger === finger.val && !currentPos?.avoid);
                                        const isUsed = !isAvoidVal && usedFingers.includes(finger.val as any);

                                        return (
                                            <button
                                                key={finger.label}
                                                disabled={isUsed}
                                                onClick={() => onSetFingerForPosition?.(safeActiveIndex, finger.val)}
                                                className={`flex-1 h-9 rounded-lg border font-bold text-xs transition-all flex items-center justify-center ${isActive
                                                    ? (isAvoidVal ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-primary shadow-cyan-glow border-primary text-black')
                                                    : isUsed
                                                        ? 'bg-black/40 border-white/5 text-zinc-800 cursor-not-allowed'
                                                        : 'bg-black/20 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {finger.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Fret Selector */}
                            <div className={`space-y-2 pt-2 transition-opacity duration-300 ${currentPos?.avoid ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('fretboard.select_fret')}</span>
                                    <span className="text-[10px] font-mono text-primary font-bold">
                                        {parseInt(currentPos?.fret?.toString() || '0') > 0 ? `${t('fretboard.fret')} ${currentPos?.fret}` : t('fretboard.nut')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const fret = i + 1;
                                        const currentFret = parseInt(currentPos?.fret?.toString() || '0');
                                        const barreFret = displayNote.positions.find(p => p.endString !== undefined && p.endString !== p.string)?.fret || 0;
                                        const minAllowedFret = Math.max(1, globalSettings?.capo ?? 0, barreFret);

                                        // Do not hide frets in selector, maybe disable them? Standard behavior is show 24.
                                        // We will just render them.

                                        return (
                                            <button
                                                key={fret}
                                                onClick={() => onSetFretForPosition?.(safeActiveIndex, fret)}
                                                className={`h-7 rounded-sm border font-mono text-[10px] transition-all flex items-center justify-center ${currentFret === fret
                                                    ? 'bg-primary border-primary text-black shadow-cyan-glow'
                                                    : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {fret}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. Pestana (Barre) Selector */}
                            <div className={`space-y-2 pt-2 border-t border-zinc-800/50 transition-opacity duration-300 ${currentPos?.avoid ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                {(() => {
                                    const hasBarre = currentPos?.endString !== undefined && currentPos.endString !== currentPos.string;
                                    const isBarreFinger = currentPos?.finger !== undefined && (typeof currentPos.finger === 'number' ? currentPos.finger > 0 : true);

                                    return (
                                        <>
                                            {(!hasBarre && !isBarreSelectorOpen) ? (
                                                <button
                                                    disabled={!isBarreFinger}
                                                    onClick={() => setIsBarreSelectorOpen(true)}
                                                    className={`w-full py-3 rounded-xl border border-dashed text-[10px] font-black transition-all uppercase tracking-widest ${isBarreFinger ? 'border-primary/50 text-zinc-500 hover:border-primary hover:text-primary hover:bg-primary/5' : 'border-zinc-900 text-zinc-800 cursor-not-allowed'}`}
                                                >
                                                    {t('fretboard.add_barre')}
                                                </button>
                                            ) : (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t('fretboard.barre_to')}</span>
                                                        {hasBarre && (
                                                            <button
                                                                onClick={() => onToggleBarre?.()}
                                                                className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                                                            >
                                                                {t('fretboard.remove')}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-6 gap-1.5">
                                                        {Array.from({ length: globalSettings?.numStrings || 6 }, (_, i) => i + 1).map(s => {
                                                            const isTarget = currentPos?.endString === s;

                                                            return (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => onToggleBarreTo?.(s)}
                                                                    className={`py-2 rounded-lg border font-bold text-[9px] transition-all ${isTarget ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-black/30 border-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'}`}
                                                                    style={isTarget ? {
                                                                        backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                                        borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                                        color: theme?.fingers?.textColor || '#ffffff'
                                                                    } : {}}
                                                                >
                                                                    {s}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-[8px] text-zinc-600">{t('fretboard.pestana_instruction')}</p>
                                                </>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

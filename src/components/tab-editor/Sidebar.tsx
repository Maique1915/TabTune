'use client';

import React from 'react';
import { Duration, NoteData } from '@/lib/tab-editor/types';
import { Icons } from '@/lib/tab-editor/constants';

interface SidebarProps {
    onInsert: (text: string) => void;
    activeDuration: Duration;
    onSelectDuration: (duration: Duration) => void;
    // Inspector Props
    editingNote?: NoteData | null;
    currentPitch?: { name: string; accidental: string; octave: number } | null;
    onCloseInspector?: () => void;
    onNoteRhythmChange?: (newDuration?: Duration, newDot?: boolean) => void;
    onNoteTypeChange?: (type: 'note' | 'rest') => void;
    onPitchChange?: (name?: string, accidental?: string, octave?: number) => void;
    onStringChange?: (stringFret: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    onInsert,
    activeDuration,
    onSelectDuration,
    editingNote,
    currentPitch,
    onCloseInspector,
    onNoteRhythmChange,
    onNoteTypeChange,
    onPitchChange,
    onStringChange
}) => {
    const durationItems = [
        { label: 'Whole', code: 'w' as Duration },
        { label: 'Half', code: 'h' as Duration },
        { label: 'Quarter', code: 'q' as Duration },
        { label: '8th', code: '8' as Duration },
        { label: '16th', code: '16' as Duration },
        { label: '32nd', code: '32' as Duration },
    ];

    const isInspector = !!editingNote;

    const handleDurationClick = (code: Duration) => {
        if (isInspector && onNoteRhythmChange) {
            onNoteRhythmChange(code);
        } else {
            onSelectDuration(code);
        }
    };

    const getDurationActive = (code: Duration) => {
        if (isInspector && editingNote) {
            return editingNote.duration === code;
        }
        return activeDuration === code;
    };

    const palettes = [
        {
            title: 'Claves',
            items: [
                { label: 'Treble', code: 'clef=treble' },
                { label: 'Bass', code: 'clef=bass' },
                { label: 'Tab', code: 'clef=tab' },
            ]
        },
        {
            title: 'Techniques',
            items: [
                { label: 'Hammer-on', code: 'h' },
                { label: 'Pull-off', code: 'p' },
                { label: 'Slide', code: 's' },
                { label: 'Bend', code: 'b' },
                { label: 'Vibrato', code: 'v' },
            ]
        }
    ];

    return (
        <aside className={`w-80 border-r border-white/5 flex flex-col h-full transition-all duration-300 ${isInspector ? 'bg-black/40' : 'bg-black/20'} backdrop-blur-xl`}>
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between min-h-[80px]">
                <div className="flex flex-col">
                    <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {isInspector ? 'PROPERTIES' : 'LIBRARY'}
                    </h2>
                    <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest mt-1">
                        {isInspector ? `Editing ${editingNote?.type}` : 'Note Controls'}
                    </span>
                </div>
                {isInspector && onCloseInspector && (
                    <button
                        onClick={onCloseInspector}
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
                        title="Close Inspector"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">

                {/* Unified Duration Selector */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                        <span>Duration</span>
                        {isInspector && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">ACTIVE</span>}
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                        {durationItems.map((item) => {
                            const active = getDurationActive(item.code);
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleDurationClick(item.code)}
                                    className={`py-3 rounded-xl border border-white/5 font-black transition-all text-[10px] flex flex-col items-center justify-center space-y-1 ${active
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}
                                >
                                    <span className={`origin-center scale-50 transition-all ${active ? 'opacity-100 scale-75' : 'opacity-40'}`}>{Icons.MusicRest(item.code)}</span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Conditional Content */}
                {isInspector && editingNote ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Dotted Toggle */}
                        <button
                            onClick={() => onNoteRhythmChange?.(undefined, !editingNote.decorators.dot)}
                            className={`w-full py-3 rounded-xl border transition-all text-xs font-bold flex items-center justify-center space-x-2 ${editingNote.decorators.dot ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${editingNote.decorators.dot ? 'bg-amber-400' : 'bg-slate-600'}`} />
                            <span>DOTTED NOTE</span>
                        </button>

                        {/* Note/Rest Actions */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</h3>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                <button onClick={() => onNoteTypeChange?.('note')} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${editingNote.type === 'note' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-600 hover:text-slate-400'}`}>NOTE</button>
                                <button onClick={() => onNoteTypeChange?.('rest')} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${editingNote.type === 'rest' ? 'bg-white/10 text-white border border-white/10' : 'text-slate-600 hover:text-slate-400'}`}>REST</button>
                            </div>
                        </div>

                        {/* Pitch Controls */}
                        {editingNote.type === 'note' && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Pitch & Fret</span>
                                    <span className="text-white bg-white/10 px-1.5 rounded border border-white/5">{currentPitch?.name}{currentPitch?.accidental}{currentPitch?.octave}</span>
                                </h3>

                                <div className="space-y-2">
                                    <div className="grid grid-cols-7 gap-1">
                                        {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(n => (
                                            <button key={n} onClick={() => onPitchChange?.(n)} className={`h-8 rounded-lg md:rounded-xl border font-black text-xs transition-all ${currentPitch?.name === n ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>{n}</button>
                                        ))}
                                    </div>
                                    <div className="flex bg-black/40 rounded-xl border border-white/5 p-0.5">
                                        {[2, 3, 4, 5, 6].map(o => (
                                            <button key={o} onClick={() => onPitchChange?.(undefined, undefined, o)} className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${currentPitch?.octave === o ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'}`}>{o}</button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5 pt-2">
                                        {[1, 2, 3, 4, 5, 6].map(s => (
                                            <button key={s} onClick={() => onStringChange?.(s.toString())} className={`py-1.5 rounded-lg border font-bold text-[10px] transition-all ${editingNote.string === s.toString() ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>STR {s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Toolkit Palettes
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {palettes.map((section) => (
                            <div key={section.title} className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => onInsert(item.code)}
                                            className="px-3 py-3 text-xs bg-white/5 hover:bg-white/10 hover:scale-[1.02] text-slate-300 rounded-xl transition-all text-center border border-white/5 font-bold active:scale-95 shadow-sm"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!isInspector && (
                <div className="p-4 border-t border-white/5 text-[10px] text-slate-600 text-center bg-black/20 font-medium">
                    Select a duration, then click (+) in the editor.
                </div>
            )}
        </aside>
    );
};

export default Sidebar;

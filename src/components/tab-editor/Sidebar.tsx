'use client';

import React from 'react';
import { Duration, NoteData, MeasureData } from '@/lib/tab-editor/types';
import { Icons } from '@/lib/tab-editor/constants';
import VexFlowRhythmIcon from './VexFlowRhythmIcon';
import { GenericSidebar } from '@/components/shared/GenericSidebar';
import Link from 'next/link';
import { Music, Settings2, Info, Home } from 'lucide-react';

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
    onAccidentalChange?: (accidental: string) => void;
    onDecoratorChange?: (decorator: string) => void;
    // Measure Props
    activeMeasure?: MeasureData | null;
    onMeasureUpdate?: (id: string, updates: Partial<MeasureData>) => void;
    onAddNote?: (measureId: string, duration: Duration) => void;
    // Generic update for new properties
    onUpdateNote?: (updates: Partial<NoteData>) => void;
}

interface ArticulationBtnProps {
    label: string;
    symbol: string;
    isActive: boolean;
    onClick: () => void;
}

const ArticulationButton: React.FC<ArticulationBtnProps> = ({ label, symbol, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
    >
        <span className="text-sm font-bold">{symbol}</span>
        <span className="text-[7px] uppercase font-black">{label}</span>
    </button>
);

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
    onStringChange,
    onAccidentalChange,
    onDecoratorChange,
    activeMeasure,
    onMeasureUpdate,
    onAddNote,
    onUpdateNote
}) => {
    const [activeTab, setActiveTab] = React.useState<'main' | 'articulations' | 'effects' | 'text'>('main');

    const durationItems = [
        { label: 'Whole', code: 'w' as Duration },
        { label: 'Half', code: 'h' as Duration },
        { label: 'Quarter', code: 'q' as Duration },
        { label: '8th', code: '8' as Duration },
        { label: '16th', code: '16' as Duration },
        { label: '32nd', code: '32' as Duration },
    ];


    const isInspector = !!editingNote;
    const isMeasureProperties = !!activeMeasure && !isInspector;

    const handleDurationClick = (code: Duration) => {
        if (isInspector && onNoteRhythmChange) {
            onNoteRhythmChange(code);
        } else {
            onSelectDuration(code);
            // If strictly in measure context (no note editing), clicking adds a note
            if (isMeasureProperties && activeMeasure && onAddNote) {
                onAddNote(activeMeasure.id, code);
            }
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
                { label: 'Tap', code: 't' },
                { label: 'Slide', code: 's' },
                { label: 'Bend', code: 'b' },
                { label: 'Vibrato', code: 'v' },
            ]
        }
    ];

    const tabs = [
        { id: 'main', label: 'Main' },
        { id: 'articulations', label: 'Articulations' },
        { id: 'effects', label: 'Effects' },
        { id: 'text', label: 'Text' }
    ];

    const title = isInspector ? 'PROPERTIES' : isMeasureProperties ? 'PROPERTIES' : 'LIBRARY';
    const Icon = isInspector ? Settings2 : isMeasureProperties ? Info : Music;

    return (
        <GenericSidebar
            title={title}
            icon={Icon}
            onReset={undefined} // No reset for library
            tabs={isInspector && editingNote ? tabs : undefined}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={onCloseInspector}
            side="left"
            headerAction={!isInspector && !isMeasureProperties && (
                <Link href="/">
                    <button className="group relative p-2.5 bg-zinc-950/40 hover:bg-cyan-500/10 rounded-xl border border-zinc-800/60 hover:border-cyan-500/40 text-zinc-500 hover:text-cyan-400 transition-all duration-300 shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </Link>
            )}
            footer={!isInspector ? (
                <div className="text-[10px] text-slate-600 text-center font-medium">
                    Select a duration, then click (+) in the editor.
                </div>
            ) : undefined}
        >
            <div className="space-y-8">
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
                                    className={`py-2 rounded-xl border border-white/5 font-black transition-all text-[10px] flex flex-col items-center justify-center space-y-1 ${active
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                        }`}
                                >
                                    <div className={`transition-all ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                        <VexFlowRhythmIcon
                                            duration={item.code}
                                            fillColor={active ? '#67e8f9' : '#94a3b8'} // cyan-300 vs slate-400
                                        />
                                    </div>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Conditional Content */}
                {isInspector && editingNote ? (
                    <div className="space-y-6">
                        {/* TAB CONTENT: MAIN */}
                        {activeTab === 'main' && (
                            <div className="space-y-6">
                                {/* Dotted & Type */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => onNoteRhythmChange?.(undefined, !editingNote.decorators.dot)}
                                        className={`py-3 rounded-xl border transition-all text-xs font-bold flex items-center justify-center space-x-2 ${editingNote.decorators.dot ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-white/5 border-white/5 text-slate-400'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${editingNote.decorators.dot ? 'bg-amber-400' : 'bg-slate-600'}`} />
                                        <span className="text-[9px] uppercase">Dotted</span>
                                    </button>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                        <button onClick={() => onNoteTypeChange?.('note')} className={`flex-1 text-[9px] font-black rounded-lg transition-all ${editingNote.type === 'note' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-600'}`}>NOTE</button>
                                        <button onClick={() => onNoteTypeChange?.('rest')} className={`flex-1 text-[9px] font-black rounded-lg transition-all ${editingNote.type === 'rest' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>REST</button>
                                    </div>
                                </div>

                                {editingNote.type === 'note' && (
                                    <div className="space-y-3 pt-2 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Note Heads</h3>
                                        <div className="grid grid-cols-5 gap-1.5">
                                            {[
                                                { id: undefined, label: 'Std', symbol: '●' },
                                                { id: 'x', label: 'Ghost', symbol: 'X' },
                                                { id: 'diamond', label: 'Diam.', symbol: '◇' },
                                                { id: 'square', label: 'Square', symbol: '□' },
                                                { id: 'triangle', label: 'Tri.', symbol: '△' }
                                            ].map((head) => (
                                                <ArticulationButton
                                                    key={head.id || 'std'}
                                                    label={head.label}
                                                    symbol={head.symbol}
                                                    isActive={editingNote.noteHead === head.id}
                                                    onClick={() => onUpdateNote?.({ noteHead: head.id as any })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pitch Controls */}
                                {editingNote.type === 'note' && (
                                    <div className="space-y-3 pt-2 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-500 uppercase">Pitch</span>
                                            <span className="text-[9px] text-white bg-white/10 px-1.5 rounded">{currentPitch?.name}{currentPitch?.accidental}{currentPitch?.octave}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-7 gap-1">
                                                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(n => (
                                                    <button key={n} onClick={() => onPitchChange?.(n)} className={`h-8 rounded-lg border font-black text-xs transition-all ${currentPitch?.name === n ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-slate-500'}`}>{n}</button>
                                                ))}
                                            </div>
                                            <div className="flex bg-black/40 rounded-xl border border-white/5 p-0.5">
                                                {[2, 3, 4, 5, 6].map(o => (
                                                    <button key={o} onClick={() => onPitchChange?.(undefined, undefined, o)} className={`flex-1 py-1 text-[9px] font-bold rounded-lg transition-all ${currentPitch?.octave === o ? 'bg-white/10 text-white' : 'text-slate-600'}`}>{o}</button>
                                                ))}
                                            </div>
                                            {/* Accidentals */}
                                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                                {[{ l: '♭', v: 'b' }, { l: '♮', v: 'n' }, { l: '♯', v: '#' }].map(acc => (
                                                    <button key={acc.v} onClick={() => onAccidentalChange?.(acc.v)} className={`flex-1 py-1 text-sm font-serif rounded-lg transition-all ${editingNote.accidental === acc.v || (editingNote.accidental === 'none' && acc.v === 'n') ? 'bg-white/10 text-white' : 'text-slate-600'}`}>{acc.l}</button>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-3 gap-1.5 pt-1">
                                                {[1, 2, 3, 4, 5, 6].map(s => (
                                                    <button key={s} onClick={() => onStringChange?.(s.toString())} className={`py-1.5 rounded-lg border font-bold text-[9px] transition-all ${editingNote.string === s.toString() ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-slate-500'}`}>STR {s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: ARTICULATIONS */}
                        {activeTab === 'articulations' && (
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { k: 'staccato', l: 'Staccato', s: '.' },
                                    { k: 'staccatissimo', l: 'Staccatissimo', s: 'v' },
                                    { k: 'accent', l: 'Accent', s: '>' },
                                    { k: 'tenuto', l: 'Tenuto', s: '-' },
                                    { k: 'marcato', l: 'Marcato', s: '^' },
                                    { k: 'pizzicato', l: 'LH Pizz', s: '+' },
                                    { k: 'snapPizzicato', l: 'Snap Pizz', s: 'o' },
                                    { k: 'openNote', l: 'Open Note', s: 'h' },
                                    { k: 'fermataUp', l: 'Fermata Up', s: '𝄐' },
                                    { k: 'fermataDown', l: 'Fermata Down', s: '𝄑' },
                                    { k: 'bowUp', l: 'Bow Up', s: '⋁' },
                                    { k: 'bowDown', l: 'Bow Down', s: '⊓' },
                                ].map((art) => (
                                    <ArticulationButton
                                        key={art.k}
                                        label={art.l}
                                        symbol={art.s}
                                        isActive={!!editingNote.decorators[art.k as keyof typeof editingNote.decorators]}
                                        onClick={() => onDecoratorChange?.(art.k)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* TAB CONTENT: EFFECTS */}
                        {activeTab === 'effects' && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                    Techniques
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { l: 'Hammer-on', c: 'h' },
                                        { l: 'Pull-off', c: 'p' },
                                        { l: 'Tap', c: 't' },
                                        { l: 'Slide', c: 's' },
                                        { l: 'Bend', c: 'b' },
                                        { l: 'Vibrato', c: 'v' },
                                    ].map((item) => (
                                        <button
                                            key={item.c}
                                            onClick={() => onInsert(item.c)}
                                            className={`py-3 px-2 rounded-xl border font-black transition-all text-[10px] flex flex-col items-center justify-center ${editingNote.technique === item.c
                                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {item.l}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[8px] text-zinc-500 italic leading-tight">
                                    Select two notes in the Timeline to connect them with a technique, or select one note to apply individual effects.
                                </p>
                            </div>
                        )}

                        {/* TAB CONTENT: TEXT */}
                        {activeTab === 'text' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Chord Symbol</label>
                                    <input
                                        type="text"
                                        value={editingNote.chord || ''}
                                        onChange={(e) => onUpdateNote?.({ chord: e.target.value })}
                                        placeholder="e.g. Amaj7"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-cyan-300 focus:border-cyan-500 outline-none placeholder:text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Annotation</label>
                                    <input
                                        type="text"
                                        value={editingNote.annotation || ''}
                                        onChange={(e) => onUpdateNote?.({ annotation: e.target.value })}
                                        placeholder="e.g. Text"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 focus:border-slate-500 outline-none placeholder:text-slate-700"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : isMeasureProperties && activeMeasure ? (
                    // Measure Properties
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                Clef
                            </h3>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                {['treble', 'bass', 'tab'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => onMeasureUpdate?.(activeMeasure.id, { clef: c as any, showClef: true })}
                                        className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase ${activeMeasure.clef === c || (!activeMeasure.clef && c === 'treble') ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-600 hover:text-slate-400'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                Visibility
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => onMeasureUpdate?.(activeMeasure.id, { showClef: !activeMeasure.showClef })}
                                    className={`py-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${activeMeasure.showClef ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                                >
                                    <span className="text-lg font-serif">𝄞</span>
                                    <span className="text-[9px] font-black uppercase">Show Clef</span>
                                </button>
                                <button
                                    onClick={() => onMeasureUpdate?.(activeMeasure.id, { showTimeSig: !activeMeasure.showTimeSig })}
                                    className={`py-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${activeMeasure.showTimeSig ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                                >
                                    <span className="text-xs font-serif font-bold pt-1">4/4</span>
                                    <span className="text-[9px] font-black uppercase">Show Time</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Toolkit Palettes
                    <div className="space-y-8">
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
        </GenericSidebar>
    );
};

export default Sidebar;

'use client';

import React from 'react';
import { Duration, NoteData, MeasureData } from '@/lib/tab-editor/types';
import { Icons } from '@/lib/tab-editor/constants';
import { VexFlowRhythmIcon } from './VexFlowRhythmIcon';
import { VexFlowPaletteIcon } from './VexFlowPaletteIcon';
import { GenericSidebar } from '@/components/shared/GenericSidebar';
import Link from 'next/link';
import { Music, Settings2, Info, Home, ChevronRight, ChevronDown } from 'lucide-react';

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
    // Chord Props
    activePositionIndex?: number;
    onActivePositionIndexChange?: (index: number) => void;
    onAddChordNote?: () => void;
    onRemoveChordNote?: (index: number) => void;
    // Global Settings Props
    globalSettings?: {
        bpm: number;
        time: string;
        clef: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab';
        showNotation: boolean;
        showTablature: boolean;
    };
    onGlobalSettingsChange?: (settings: { bpm?: number; time?: string; clef?: 'treble' | 'bass' | 'alto' | 'tenor' | 'tab'; showNotation?: boolean; showTablature?: boolean; key?: string }) => void;
    onImportScore?: () => void;
    // Mobile props
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
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
        className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'bg-pink-500/20 border-pink-500/30 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.15)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
    >
        <span className="text-sm font-bold">{symbol}</span>
        <span className="text-[7px] uppercase font-black tracking-wider">{label}</span>
    </button>
);

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
        <div className="space-y-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50 pb-2 hover:text-zinc-300 transition-colors"
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {isOpen && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

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
    onUpdateNote,
    activePositionIndex = 0,
    onActivePositionIndexChange,
    onAddChordNote,
    onRemoveChordNote,
    globalSettings,
    onGlobalSettingsChange,
    onImportScore,
    isMobile = false,
    isOpen = true,
    onClose
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



    const tabs = [
        { id: 'main', label: 'Main' },
        { id: 'articulations', label: 'Articulations' },
        { id: 'effects', label: 'Effects' },
        { id: 'text', label: 'Text' }
    ];

    const title = isInspector ? 'PROPERTIES' : isMeasureProperties ? 'PROPERTIES' : 'GLOBAL SETTINGS';
    const Icon = isInspector ? Settings2 : isMeasureProperties ? Info : Settings2;

    return (
        <GenericSidebar
            title={title}
            icon={Icon}
            onReset={undefined} // No reset for library
            tabs={isInspector && editingNote ? tabs : undefined}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={onClose || onCloseInspector}
            side="left"
            isMobile={isMobile}
            isOpen={isOpen}
            headerAction={!isInspector && (
                <Link href="/">
                    <button className="group relative p-2.5 bg-zinc-950/40 hover:bg-cyan-500/10 rounded-xl border border-zinc-800/60 hover:border-cyan-500/40 text-zinc-500 hover:text-cyan-400 transition-all duration-300 shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </Link>
            )}
            footer={!isInspector ? (
                <div className="text-[10px] text-zinc-600 text-center font-medium tracking-wide">
                    Select a duration, then click (+) in the editor.
                </div>
            ) : undefined}
        >
            <div className="space-y-8">
                {/* Unified Duration Selector - Only show when editing/inspecting */}
                {(isInspector || isMeasureProperties) && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center space-x-2">
                            <span>Duration</span>
                            {isInspector && <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[9px] border border-purple-500/20">ACTIVE</span>}
                        </h3>

                        <div className="grid grid-cols-3 gap-2">
                            {durationItems.map((item) => {
                                const active = getDurationActive(item.code);
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => handleDurationClick(item.code)}
                                        className={`py-2 rounded-xl border font-black transition-all text-[10px] flex flex-col items-center justify-center space-y-1 ${active
                                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                            : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
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
                )}

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
                                        className={`py-3 rounded-xl border transition-all text-xs font-bold flex items-center justify-center space-x-2 ${editingNote.decorators.dot ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${editingNote.decorators.dot ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'bg-zinc-700'}`} />
                                        <span className="text-[9px] uppercase tracking-wider">Dotted</span>
                                    </button>

                                    <div className="flex bg-zinc-950/40 p-1 rounded-xl border border-zinc-800/50">
                                        <button onClick={() => onNoteTypeChange?.('note')} className={`flex-1 text-[9px] font-black rounded-lg transition-all py-1 ${editingNote.type === 'note' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-zinc-600 hover:text-zinc-400'}`}>NOTE</button>
                                        <button onClick={() => onNoteTypeChange?.('rest')} className={`flex-1 text-[9px] font-black rounded-lg transition-all py-1 ${editingNote.type === 'rest' ? 'bg-zinc-100/10 text-zinc-100 border border-zinc-100/20' : 'text-zinc-600 hover:text-zinc-400'}`}>REST</button>
                                    </div>
                                </div>

                                {editingNote.type === 'note' && (
                                    <div className="space-y-3 pt-2 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Note Heads</h3>
                                        <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                                            {[
                                                { id: 'so', label: 'Std', symbol: '●' },
                                                { id: 'x', label: 'Ghost', symbol: 'x' },
                                                { id: 'diamond', label: 'Diam.', symbol: '◇' },
                                                { id: 'square', label: 'Square', symbol: '□' },
                                                { id: 'triangle', label: 'Tri.', symbol: '△' },
                                                { id: 'do', label: 'R.', symbol: '▲' },
                                                { id: 'mi', label: 'Mi.', symbol: '◆' },
                                                { id: 'fa', label: 'Fa.', symbol: '◤' },
                                                { id: 'la', label: 'La.', symbol: '■' },
                                                { id: 'slashed', label: 'Slashed', symbol: 'ø' }
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

                                <div className="space-y-3 pt-2 border-t border-zinc-800/50">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Chord Notes</h3>
                                        <button
                                            onClick={onAddChordNote}
                                            className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-bold hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
                                        >
                                            + ADD NOTE
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 bg-zinc-950/40 p-1.5 rounded-xl border border-zinc-800/50">
                                        {editingNote.positions.map((pos, idx) => (
                                            <div key={idx} className="relative group">
                                                <button
                                                    onClick={() => onActivePositionIndexChange?.(idx)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${activePositionIndex === idx ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                >
                                                    {pos.fret}/{pos.string}
                                                </button>
                                                {editingNote.positions.length > 1 && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onRemoveChordNote?.(idx); }}
                                                        className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2 border-t border-zinc-800/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pitch (Active)</span>
                                        <span className="text-[10px] text-zinc-300 bg-zinc-800/50 px-2 py-0.5 rounded-lg border border-zinc-700/50 font-bold">{currentPitch?.name}{currentPitch?.accidental}{currentPitch?.octave}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-7 gap-1">
                                            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(n => (
                                                <button key={n} onClick={() => onPitchChange?.(n)} className={`h-8 rounded-lg border font-black text-xs transition-all ${currentPitch?.name === n ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}>{n}</button>
                                            ))}
                                        </div>
                                        <div className="flex bg-zinc-950/40 rounded-xl border border-zinc-800/50 p-1 mt-2">
                                            {[2, 3, 4, 5, 6].map(o => (
                                                <button key={o} onClick={() => onPitchChange?.(undefined, undefined, o)} className={`flex-1 py-1 text-[9px] font-bold rounded-lg transition-all ${currentPitch?.octave === o ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>{o}</button>
                                            ))}
                                        </div>
                                        {/* Accidentals */}
                                        <div className="flex bg-zinc-950/40 p-1 rounded-xl border border-zinc-800/50 my-2">
                                            {[{ l: '♭', v: 'b' }, { l: '♮', v: 'n' }, { l: '♯', v: '#' }].map(acc => (
                                                <button key={acc.v} onClick={() => onAccidentalChange?.(acc.v)} className={`flex-1 py-1 text-sm font-serif rounded-lg transition-all ${editingNote.accidental === acc.v || (editingNote.accidental === 'none' && acc.v === 'n') ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>{acc.l}</button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                                            {[1, 2, 3, 4, 5, 6].map(s => (
                                                <button key={s} onClick={() => onStringChange?.(s.toString())} className={`py-1.5 rounded-lg border font-bold text-[9px] transition-all ${editingNote.positions[activePositionIndex]?.string === s.toString() ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}>STR {s}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50 pb-2">
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
                                        { l: 'Slur/Tie', c: 'l' },
                                    ].map((item) => (
                                        <button
                                            key={item.c}
                                            onClick={() => onInsert(item.c)}
                                            className={`py-3 px-2 rounded-xl border font-black transition-all text-[10px] flex flex-col items-center justify-center ${editingNote.technique === item.c
                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                                : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
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
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Chord Symbol</label>
                                    <input
                                        type="text"
                                        value={editingNote.chord || ''}
                                        onChange={(e) => onUpdateNote?.({ chord: e.target.value })}
                                        placeholder="e.g. Amaj7"
                                        className="w-full bg-zinc-950/40 border border-zinc-800/60 rounded-xl px-3 py-2.5 text-xs font-bold text-cyan-400 focus:border-cyan-500/50 outline-none placeholder:text-zinc-700 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Annotation</label>
                                    <input
                                        type="text"
                                        value={editingNote.annotation || ''}
                                        onChange={(e) => onUpdateNote?.({ annotation: e.target.value })}
                                        placeholder="e.g. Text"
                                        className="w-full bg-zinc-950/40 border border-zinc-800/60 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-300 focus:border-zinc-500/50 outline-none placeholder:text-zinc-700 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : isMeasureProperties && activeMeasure ? (
                    // Measure Properties
                    <div className="space-y-8">


                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50 pb-2">
                                Visibility
                            </h3>
                            <div className="grid grid-cols-2 gap-2">

                                <button
                                    onClick={() => onMeasureUpdate?.(activeMeasure.id, { showTimeSig: !activeMeasure.showTimeSig })}
                                    className={`py-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${activeMeasure.showTimeSig ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                >
                                    <span className="text-xs font-serif font-bold pt-1">4/4</span>
                                    <span className="text-[9px] font-black uppercase tracking-wider">Show Time</span>
                                </button>
                                <button
                                    onClick={() => onMeasureUpdate?.(activeMeasure.id, { showClef: !activeMeasure.showClef })}
                                    className={`py-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${activeMeasure.showClef ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                >
                                    <span className="text-xs font-serif font-bold pt-1">𝄞</span>
                                    <span className="text-[9px] font-black uppercase tracking-wider">Show Clef</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Collapsible Sections for Palettes */}
                        <CollapsibleSection title="Claves">
                            <div className="grid grid-cols-4 gap-2 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50">
                                {(['treble', 'bass', 'alto', 'tenor', 'percussion', 'tab'] as const).map(c => (
                                    <button
                                        key={c}
                                        onClick={() => onGlobalSettingsChange?.({ clef: c === 'percussion' ? 'treble' : c })}
                                        className={`h-14 flex items-center justify-center rounded-lg border transition-all ${globalSettings?.clef === c ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/50'}`}
                                        title={c}
                                    >
                                        <VexFlowPaletteIcon type="clef" value={c} width={50} height={50} scale={1.5} isSelected={globalSettings?.clef === c} hideStaveLines={true} />
                                    </button>
                                ))}
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Armaduras de clave">
                            <div className="grid grid-cols-5 gap-1 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50">
                                {[
                                    'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
                                    'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'
                                ].map(k => (
                                    <button
                                        key={k}
                                        onClick={() => onGlobalSettingsChange?.({ key: k })}
                                        className={`h-12 flex items-center justify-center rounded-lg border transition-all ${globalSettings?.key === k ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/50'}`}
                                        title={k}
                                    >
                                        <VexFlowPaletteIcon type="key" value={k} width={40} height={50} scale={1.45} isSelected={globalSettings?.key === k} hideStaveLines={true} clef="tab" />
                                    </button>
                                ))}
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Fórmulas de compasso">
                            <div className="grid grid-cols-4 gap-2 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50">
                                {['4/4', '3/4', '2/4', '6/8', '12/8', 'C', 'C|'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => onGlobalSettingsChange?.({ time: t })}
                                        className={`h-14 flex items-center justify-center rounded-lg border transition-all ${globalSettings?.time === t ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/50'}`}
                                        title={t}
                                    >
                                        <VexFlowPaletteIcon type="time" value={t} width={50} height={50} scale={1.45} isSelected={globalSettings?.time === t} hideStaveLines={true} />
                                    </button>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* Playback & View Settings (Compact) */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pb-1">Settings</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Tempo</label>
                                    <input
                                        type="number"
                                        value={globalSettings?.bpm || 120}
                                        onChange={(e) => onGlobalSettingsChange?.({ bpm: parseInt(e.target.value) || 120 })}
                                        className="w-full bg-zinc-950/40 border border-zinc-800/60 rounded-xl px-3 py-2 text-xs font-bold text-cyan-400 focus:border-cyan-500/50 outline-none text-center"
                                    />
                                </div>
                                <div className="flex items-end gap-1">
                                    <button
                                        onClick={() => onGlobalSettingsChange?.({ showNotation: !globalSettings?.showNotation })}
                                        className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase ${globalSettings?.showNotation ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500'}`}
                                    >
                                        Notation
                                    </button>
                                    <button
                                        onClick={() => onGlobalSettingsChange?.({ showTablature: !globalSettings?.showTablature })}
                                        className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase ${globalSettings?.showTablature ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500'}`}
                                    >
                                        Tab
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Import/Action */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <button
                                onClick={onImportScore}
                                className="w-full py-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="group-hover:scale-110 transition-transform">📂</span>
                                Import Score
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </GenericSidebar>
    );
};

export default Sidebar;

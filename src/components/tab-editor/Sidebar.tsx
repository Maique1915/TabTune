'use client';

import React from 'react';
import { Duration, NoteData, MeasureData, GlobalSettings, ManualChordData } from '@/modules/editor/domain/types';
import { notes, getScaleNotes, getBassNotes, extensions, formatNoteName, basses } from '@/modules/core/domain/chord-logic';
import { INSTRUMENTS } from '@/lib/instruments';
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
    onToggleBarre?: (indices?: number[]) => void;
    // Global Settings Props
    globalSettings?: GlobalSettings;
    onGlobalSettingsChange?: (settings: Partial<GlobalSettings>) => void;
    onImportScore?: () => void;
    // Undo/Redo props
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    // Mobile props
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    simpleMode?: boolean;
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
    const [isOpen, setIsOpen] = React.useState(false);
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
    onToggleBarre,
    globalSettings,
    onGlobalSettingsChange,
    onImportScore,
    isMobile = false,
    isOpen = true,
    onClose,
    simpleMode = false
}) => {
    const [activeTab, setActiveTab] = React.useState<'main' | 'articulations' | 'effects' | 'text'>('main');
    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
    const [selectedStrings, setSelectedStrings] = React.useState<number[]>([]);

    // Reset selection when editing note changes
    React.useEffect(() => {
        setSelectedIndices([]);
        setSelectedStrings([]);
    }, [editingNote?.id]);

    const handleStringClick = (strStr: string, e: React.MouseEvent) => {
        const str = parseInt(strStr);
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Current active string
            const currentStr = editingNote?.positions[activePositionIndex || 0]?.string || 0;

            // If starting selection, include current active string
            const currentSelection = selectedStrings.length > 0
                ? selectedStrings
                : (currentStr > 0 ? [currentStr] : []);

            const newSelection = currentSelection.includes(str)
                ? currentSelection.filter(s => s !== str)
                : [...currentSelection, str];

            setSelectedStrings(newSelection);

            if (newSelection.length > 1) {
                const max = Math.max(...newSelection);
                const min = Math.min(...newSelection);
                // Active Fret
                const currentPos = editingNote?.positions[activePositionIndex || 0];
                const fret = currentPos?.fret;
                if (fret !== undefined && onUpdateNote) {
                    onUpdateNote({ barre: { fret: fret.toString(), startString: max.toString(), endString: min.toString() } });
                }
            }
        } else {
            setSelectedStrings([]);
            handleStringChangeLocal(strStr);
        }
    };

    const handlePosClick = (idx: number, e: React.MouseEvent) => {
        console.log('Pos Click:', idx, 'Modifiers:', { shift: e.shiftKey, ctrl: e.ctrlKey, meta: e.metaKey });
        console.log('Current State:', { selectedIndices, activePositionIndex });

        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            e.preventDefault();

            // If starting selection, include the currently active item
            const currentSelection = selectedIndices.length > 0
                ? selectedIndices
                : (activePositionIndex !== undefined && activePositionIndex >= 0 ? [activePositionIndex] : []);

            const newIndices = currentSelection.includes(idx)
                ? currentSelection.filter(i => i !== idx)
                : [...currentSelection, idx];

            console.log('New Indices:', newIndices);
            setSelectedIndices(newIndices);

            // Auto-trigger barre if multiple active
            if (newIndices.length > 1 && onToggleBarre) {
                console.log('Triggering Toggle Barre');
                onToggleBarre(newIndices);
            }
        } else {
            console.log('Normal Click - Reset selection');
            setSelectedIndices([]);
            onActivePositionIndexChange?.(idx);
        }
    };

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

    const handleFretChange = (fret: number) => {
        if (!editingNote || activePositionIndex === undefined || activePositionIndex < 0) return;
        const currentPos = editingNote.positions[activePositionIndex];
        if (!currentPos) return;

        const newPositions = [...editingNote.positions];
        newPositions[activePositionIndex] = { ...currentPos, fret: fret };

        onUpdateNote?.({ positions: newPositions });
    };

    const handleStringChangeLocal = (newString: string) => {
        if (!editingNote || activePositionIndex === undefined || activePositionIndex < 0) return;
        const currentPos = editingNote.positions[activePositionIndex];
        if (!currentPos) return;

        const newPositions = [...editingNote.positions];
        newPositions[activePositionIndex] = { ...currentPos, string: parseInt(newString) };

        onUpdateNote?.({ positions: newPositions });
    };

    // ... tabs definition ...
    const tabs = [
        { id: 'main', label: 'Main' },
        { id: 'articulations', label: 'Articulations' },
        { id: 'effects', label: 'Effects' }
    ];

    const title = isInspector ? 'PROPERTIES' : isMeasureProperties ? 'PROPERTIES' : 'GLOBAL SETTINGS';
    const Icon = isInspector ? Settings2 : isMeasureProperties ? Info : Settings2;

    return (
        <GenericSidebar
            title={title}
            icon={Icon}
            onReset={undefined}
            tabs={isInspector && editingNote ? tabs : undefined}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            // ... rest of props ...
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

                                {(!simpleMode && editingNote.type === 'note') && (
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
                                        <button
                                            onClick={() => onToggleBarre?.()}
                                            className={`ml-2 px-2 py-0.5 rounded text-[9px] font-bold transition-all border ${editingNote.barre ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20'}`}
                                            title="Toggle Barre Chord"
                                        >
                                            {editingNote.barre ? 'REMOVE BARRE' : 'MAKE BARRE'}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 bg-zinc-950/40 p-1.5 rounded-xl border border-zinc-800/50">
                                        {editingNote.positions.map((pos, idx) => (
                                            <div key={idx} className="relative group">
                                                <button
                                                    onClick={(e) => handlePosClick(idx, e)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${activePositionIndex === idx || selectedIndices.includes(idx) ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
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
                                    {simpleMode ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fret Selection</span>
                                                <span className="text-[10px] text-zinc-300 bg-zinc-800/50 px-2 py-0.5 rounded-lg border border-zinc-700/50 font-bold">
                                                    FR: {editingNote.positions[activePositionIndex]?.fret}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {Array.from({ length: 24 }).map((_, i) => {
                                                    const fret = i + 1; // Start from 1 instead of 0
                                                    const currentFret = parseInt(editingNote.positions[activePositionIndex]?.fret?.toString() || '0');
                                                    return (
                                                        <button
                                                            key={fret}
                                                            onClick={() => handleFretChange(fret)}
                                                            className={`h-8 rounded-lg border font-black text-xs transition-all ${currentFret === fret ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                        >
                                                            {fret}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="grid grid-cols-6 gap-1.5 pt-2">
                                                {[6, 5, 4, 3, 2, 1].map(s => (
                                                    <button key={s} onClick={(e) => handleStringClick(s.toString(), e)} className={`py-1.5 rounded-lg border font-bold text-[9px] transition-all ${editingNote.positions[activePositionIndex]?.string === s || selectedStrings.includes(s) ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}>{s}</button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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
                                            className={`py-3 px-2 rounded-xl border font-black transition-all text-[10px] flex flex-col items-center justify-center ${editingNote.technique?.includes(item.c)
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
                    </div>
                ) : isMeasureProperties && activeMeasure ? (
                    // Measure Properties
                    <div className="space-y-8">

                        {/* NEW NOTE CHORD EDITOR */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50 pb-2 flex items-center gap-2">
                                <Music className="w-3 h-3" />
                                <span>Note Chord</span>
                            </h3>

                            <div className="space-y-4 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                                {/* Chord Parsing Logic */}
                                {(() => {
                                    if (!editingNote) {
                                        return (
                                            <div className="text-zinc-500 text-xs italic text-center py-4 border border-dashed border-zinc-800 rounded-xl">
                                                Select a note to edit its chord symbol
                                            </div>
                                        );
                                    }

                                    const chordName = editingNote?.chordName || "";
                                    const match = chordName.match(/^([A-G][#b]?)(.*?)(\/[A-G][#b]?)?$/);
                                    const currentRoot = match ? match[1] : "C";
                                    const currentQuality = match ? match[2] : "Major";
                                    const currentBass = match && match[3] ? match[3] : "Root";

                                    const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                                    const QUALITIES = [
                                        { label: "Major", value: "Major" },
                                        { label: "Minor", value: "m" },
                                        { label: "Dim", value: "dim" }
                                    ];
                                    const BASES = ["Root", ...ROOTS.map(r => `/${r}`)];

                                    const updateChord = (type: 'root' | 'quality' | 'bass', value: string) => {
                                        let newRoot = currentRoot;
                                        let newQuality = currentQuality;
                                        let newBass = currentBass;

                                        if (type === 'root') newRoot = value;
                                        if (type === 'quality') newQuality = value;
                                        if (type === 'bass') newBass = value;

                                        let qualitySuffix = (newQuality === "Major") ? "" : newQuality;
                                        let bassSuffix = newBass === "Root" ? "" : newBass;

                                        const newName = `${newRoot}${qualitySuffix}${bassSuffix}`;
                                        onUpdateNote?.({ chordName: newName });
                                    };

                                    return (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2 col-span-1">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Root</label>
                                                <div className="relative group">
                                                    <select
                                                        className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-cyan-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                                        value={currentRoot}
                                                        onChange={(e) => updateChord('root', e.target.value)}
                                                    >
                                                        {ROOTS.map(r => <option key={r} value={r} className="bg-zinc-950">{r}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-2 col-span-1">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Quality</label>
                                                <div className="relative group">
                                                    <select
                                                        className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-cyan-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                                        value={currentQuality === "" ? "Major" : currentQuality}
                                                        onChange={(e) => updateChord('quality', e.target.value)}
                                                    >
                                                        {QUALITIES.map(q => <option key={q.value} value={q.value} className="bg-zinc-950">{q.label}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Bass</label>
                                                <div className="relative group">
                                                    <select
                                                        className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-cyan-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                                        value={currentBass === "" ? "Root" : currentBass}
                                                        onChange={(e) => updateChord('bass', e.target.value)}
                                                    >
                                                        {BASES.map(b => <option key={b} value={b} className="bg-zinc-950">{b}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* EXTENSIONS */}
                                            <div className="col-span-2 pt-2 border-t border-zinc-800/50 mt-1">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Extensions</label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[
                                                        { label: "SUS2", value: "sus2" },
                                                        { label: "SUS4", value: "sus4" },
                                                        { label: "AUG", value: "aug" },
                                                        { label: "5", value: "5" },
                                                        { label: "6", value: "6" },
                                                        { label: "7", value: "7" },
                                                        { label: "7+", value: "maj7" },
                                                        { label: "9", value: "9" },
                                                        { label: "11", value: "11" },
                                                        { label: "13", value: "13" },
                                                        { label: "(#5)", value: "(#5)" },
                                                        { label: "(B5)", value: "(b5)" }
                                                    ].map(ext => {
                                                        const middlePart = match ? match[2] : "";
                                                        const matchRegex = new RegExp(`(${ext.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`);
                                                        const isActive = matchRegex.test(middlePart);

                                                        return (
                                                            <button
                                                                key={ext.value}
                                                                onClick={() => {
                                                                    let middle = match ? match[2] : "";
                                                                    if (middle.includes(ext.value)) {
                                                                        middle = middle.replace(ext.value, "");
                                                                    } else {
                                                                        middle += ext.value;
                                                                    }
                                                                    const newName = `${currentRoot}${middle}${match && match[3] ? match[3] : ""}`;
                                                                    onUpdateNote?.({ chordName: newName });
                                                                }}
                                                                className={`px-2 py-1.5 rounded-lg text-[9px] font-bold border transition-all uppercase tracking-wider ${isActive
                                                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                                                    : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                                                                    }`}
                                                            >
                                                                {ext.label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

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
                    </div >
                ) : (
                    <div className="space-y-8">
                        {/* Collapsible Sections for Palettes */}
                        <CollapsibleSection title="Instrument & Tuning">
                            <div className="space-y-4 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Instrument</label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:bg-zinc-800 focus:border-cyan-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                            value={globalSettings?.instrumentId || "violao"}
                                            onChange={(e) => {
                                                const instId = e.target.value;
                                                const inst = INSTRUMENTS.find(i => i.id === instId) || INSTRUMENTS[0];
                                                const defaultTuning = inst.tunings[0];
                                                onGlobalSettingsChange?.({
                                                    instrumentId: instId,
                                                    tuningIndex: 0,
                                                    tuning: defaultTuning,
                                                    numStrings: defaultTuning.length
                                                });
                                            }}
                                        >
                                            {INSTRUMENTS.map((inst) => (
                                                <option key={inst.id} value={inst.id} className="bg-zinc-950">{inst.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                    </div>
                                </div>



                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Tuning</label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-xs font-bold text-zinc-400 focus:outline-none focus:bg-zinc-800 focus:border-cyan-500/30 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50 pr-8"
                                            value={globalSettings?.tuningIndex || 0}
                                            onChange={(e) => {
                                                const idx = parseInt(e.target.value);
                                                const instId = globalSettings?.instrumentId || "violao";
                                                const inst = INSTRUMENTS.find(i => i.id === instId) || INSTRUMENTS[0];
                                                const newTuning = inst.tunings[idx] || inst.tunings[0];
                                                onGlobalSettingsChange?.({
                                                    tuningIndex: idx,
                                                    tuning: newTuning,
                                                    numStrings: newTuning.length
                                                });
                                            }}
                                        >
                                            {(() => {
                                                const instId = globalSettings?.instrumentId || "violao";
                                                const inst = INSTRUMENTS.find(i => i.id === instId) || INSTRUMENTS[0];
                                                return inst.tunings.map((t, idx) => (
                                                    <option key={idx} value={idx} className="bg-zinc-950">
                                                        {t.join(" ")}
                                                    </option>
                                                ));
                                            })()}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                    </div>
                                </div>
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
            </div >
        </GenericSidebar >
    );
};

export default Sidebar;

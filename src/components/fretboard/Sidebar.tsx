'use client';

import React from 'react';
import { Duration, NoteData, MeasureData, GlobalSettings } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { INSTRUMENTS } from '@/lib/instruments';
import { VexFlowRhythmIcon } from './VexFlowRhythmIcon';
import { GenericSidebar } from '@/components/shared/GenericSidebar';
import Link from 'next/link';
import { Music, Settings2, Info, Home, ChevronDown } from 'lucide-react';

interface SidebarProps {
    activeDuration: Duration;
    onSelectDuration: (duration: Duration) => void;
    // Inspector Props
    editingNote?: NoteData | null;
    currentPitch?: { name: string; accidental: string; octave: number } | null;
    onCloseInspector?: () => void;
    onNoteRhythmChange?: (newDuration?: Duration, newDot?: boolean) => void;
    onNoteTypeChange?: (type: 'note' | 'rest') => void;
    onPitchChange?: (name?: string, accidental?: string, octave?: number) => void;
    onStringChange?: (stringFret: number) => void;
    onAccidentalChange?: (accidental: string) => void;
    onDecoratorChange?: (decorator: string, value: any) => void;
    // Measure Props
    activeMeasure?: MeasureData | null;
    onMeasureUpdate?: (id: string, updates: Partial<MeasureData>) => void;
    onAddNote?: (measureId: string, duration: Duration) => void;
    // Generic update for new properties
    onUpdateNote?: (updates: Partial<NoteData>) => void;
    onInsert?: (code: string) => void;
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
    onUpdateMeasure?: (measureId: string, updates: Partial<MeasureData>) => void;
    onTransposeMeasure?: (measureId: string, semitones: number) => void;
    theme?: FretboardTheme;
}



const Sidebar: React.FC<SidebarProps> = ({
    activeDuration,
    onSelectDuration,
    editingNote,
    currentPitch,
    onCloseInspector,
    onNoteRhythmChange,
    onNoteTypeChange,
    onPitchChange,
    onStringChange,
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
    onUpdateMeasure,
    onTransposeMeasure,
    theme,
}) => {

    const [simpleMode, setSimpleMode] = React.useState(true);
    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
    const [selectedStrings, setSelectedStrings] = React.useState<number[]>([]);
    const [chordRoot, setChordRoot] = React.useState("C");
    const [chordQuality, setChordQuality] = React.useState("");
    const [chordBass, setChordBass] = React.useState("Root");
    const [chordExtensions, setChordExtensions] = React.useState<string[]>([]);

    // Chord builder local states for note inspector
    const [localRoot, setLocalRoot] = React.useState(chordRoot);
    const [localQuality, setLocalQuality] = React.useState(chordQuality);
    const [localBass, setLocalBass] = React.useState(chordBass);
    const [localExtensions, setLocalExtensions] = React.useState<string[]>(chordExtensions);

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
                    onUpdateNote({ barre: { fret: typeof fret === 'string' ? parseInt(fret) : fret, startString: max, endString: min } });
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

    // Simple mode - no tabs needed for fretboard

    const title = isInspector ? 'PROPERTIES' : isMeasureProperties ? 'PROPERTIES' : 'GLOBAL SETTINGS';
    const Icon = isInspector ? Settings2 : isMeasureProperties ? Info : Settings2;

    return (
        <GenericSidebar
            title={title}
            icon={Icon}
            onReset={undefined}
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
                        {/* Note Inspector Content */}
                        {(
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
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${activePositionIndex === idx || selectedIndices.includes(idx) ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                    style={activePositionIndex === idx || selectedIndices.includes(idx) ? {
                                                        backgroundColor: theme?.fingerColor || '#06b6d4',
                                                        borderColor: theme?.fingerBorderColor || '#22d3ee',
                                                        color: theme?.fingerTextColor || '#ffffff'
                                                    } : {}}
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
                                                            className={`h-8 rounded-lg border font-black text-xs transition-all ${currentFret === fret ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                            style={currentFret === fret ? {
                                                                backgroundColor: theme?.fingerColor || '#06b6d4',
                                                                borderColor: theme?.fingerBorderColor || '#22d3ee',
                                                                color: theme?.fingerTextColor || '#ffffff'
                                                            } : {}}
                                                        >
                                                            {fret}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="grid grid-cols-6 gap-1.5 pt-2">
                                                {[6, 5, 4, 3, 2, 1].map(s => (
                                                    <button key={s} onClick={(e) => handleStringClick(s.toString(), e)} className={`py-1.5 rounded-lg border font-bold text-[9px] transition-all ${editingNote.positions[activePositionIndex]?.string === s || selectedStrings.includes(s) ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                                        style={editingNote.positions[activePositionIndex]?.string === s || selectedStrings.includes(s) ? {
                                                            backgroundColor: theme?.fingerColor || '#06b6d4',
                                                            borderColor: theme?.fingerBorderColor || '#22d3ee',
                                                            color: theme?.fingerTextColor || '#ffffff'
                                                        } : {}}
                                                    >{s}</button>
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

                                                <div className="grid grid-cols-3 gap-1.5 pt-1">
                                                    {[1, 2, 3, 4, 5, 6].map(s => (
                                                        <button key={s} onClick={() => onStringChange?.(s)} className={`py-1.5 rounded-lg border font-bold text-[9px] transition-all ${editingNote.positions[activePositionIndex]?.string === s ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}>STR {s}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}


                    </div>
                ) : isMeasureProperties && activeMeasure ? (
                    // Measure Properties
                    <div className="space-y-6">
                        {/* CHORD NAME BUILDER FOR MEASURE */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Measure Chord Name</label>
                                <button
                                    onClick={() => onUpdateMeasure?.(activeMeasure.id, { showChordName: !activeMeasure.showChordName })}
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all border ${activeMeasure.showChordName !== false
                                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                        : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/50 hover:bg-zinc-800/80'
                                        }`}
                                >
                                    {activeMeasure.showChordName !== false ? 'VISIBLE' : 'HIDDEN'}
                                </button>
                            </div>

                            {/* Chord Builder */}
                            {(() => {
                                const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                                const QUALITIES = [
                                    { label: "Major", value: "" },
                                    { label: "Minor", value: "m" },
                                    { label: "Dim", value: "dim" },
                                    { label: "Aug", value: "aug" },
                                    { label: "Sus2", value: "sus2" },
                                    { label: "Sus4", value: "sus4" }
                                ];
                                const BASS_OPTIONS = ["Root", ...ROOTS.map(r => `/${r}`)];

                                const buildChordName = () => {
                                    let qualitySuffix = chordQuality;
                                    let bassSuffix = chordBass === "Root" ? "" : chordBass;
                                    let extensionStr = chordExtensions.join("");
                                    return `${chordRoot}${qualitySuffix}${extensionStr}${bassSuffix}`;
                                };

                                const applyChordName = () => {
                                    const name = buildChordName();
                                    onUpdateMeasure?.(activeMeasure.id, { chordName: name });
                                };

                                const toggleExtension = (ext: string) => {
                                    setChordExtensions(prev =>
                                        prev.includes(ext) ? prev.filter(e => e !== ext) : [...prev, ext]
                                    );
                                };

                                const currentChordName = buildChordName();

                                return (
                                    <div className="space-y-3 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                                        {/* Preview */}
                                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-2 text-center">
                                            <span className="text-sm font-black" style={{ color: theme?.chordNameColor || '#22d3ee' }}>{currentChordName}</span>
                                        </div>

                                        {/* Root & Quality */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase">Root</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full px-2 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/30 appearance-none pr-6"
                                                        value={chordRoot}
                                                        onChange={(e) => setChordRoot(e.target.value)}
                                                    >
                                                        {ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase">Quality</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full px-2 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/30 appearance-none pr-6"
                                                        value={chordQuality}
                                                        onChange={(e) => setChordQuality(e.target.value)}
                                                    >
                                                        {QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bass */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">Bass</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-2 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/30 appearance-none pr-6"
                                                    value={chordBass}
                                                    onChange={(e) => setChordBass(e.target.value)}
                                                >
                                                    {BASS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Extensions */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">Extensions</label>
                                            <div className="flex flex-wrap gap-1">
                                                {[
                                                    { label: "5", value: "5" },
                                                    { label: "6", value: "6" },
                                                    { label: "7", value: "7" },
                                                    { label: "maj7", value: "maj7" },
                                                    { label: "9", value: "9" },
                                                    { label: "11", value: "11" },
                                                    { label: "13", value: "13" },
                                                ].map(ext => {
                                                    const isActive = chordExtensions.includes(ext.value);
                                                    return (
                                                        <button
                                                            key={ext.value}
                                                            onClick={() => toggleExtension(ext.value)}
                                                            className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${isActive
                                                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                                                : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/50 hover:bg-zinc-800/80'
                                                                }`}
                                                        >
                                                            {ext.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Apply Button */}
                                        <button
                                            onClick={applyChordName}
                                            className="w-full py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold text-xs hover:bg-cyan-500/20 transition-all uppercase tracking-wider"
                                        >
                                            Apply to Measure
                                        </button>

                                        {/* Direct Input */}
                                        <div className="pt-2 border-t border-zinc-800/50">
                                            <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Or type directly</label>
                                            <input
                                                type="text"
                                                value={activeMeasure.chordName || ''}
                                                onChange={(e) => onUpdateMeasure?.(activeMeasure.id, { chordName: e.target.value })}
                                                placeholder="e.g., C#m7/B"
                                                className="w-full bg-zinc-950/40 border border-zinc-800/60 rounded-lg px-2 py-1.5 text-xs font-bold text-cyan-400 placeholder:text-zinc-600 focus:border-cyan-500/50 outline-none"
                                            />
                                            <p className="text-[9px] text-zinc-600 mt-1">Displays throughout entire measure</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* TRANSPOSITION CONTROL */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transpose Measure</label>
                            <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => onTransposeMeasure?.(activeMeasure.id, -1)}
                                        disabled={activeMeasure.notes.some(n => n.positions.some(p => p.fret <= 0))}
                                        className="flex-1 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-400 font-bold text-xs hover:bg-zinc-800 hover:border-zinc-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        -1 Semitone
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Reset to original by calculating difference
                                            // For now, just a visual indicator
                                        }}
                                        className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-500 font-bold text-[10px] hover:bg-zinc-800 hover:border-zinc-600 transition-all"
                                    >
                                        RESET
                                    </button>
                                    <button
                                        onClick={() => onTransposeMeasure?.(activeMeasure.id, 1)}
                                        disabled={activeMeasure.notes.some(n => n.positions.some(p => p.fret >= 24))}
                                        className="flex-1 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-400 font-bold text-xs hover:bg-zinc-800 hover:border-zinc-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        +1 Semitone
                                    </button>
                                </div>
                                <p className="text-[9px] text-zinc-600 text-center">
                                    Shifts all notes and updates chord name (Notes at fret 0 are hidden)
                                </p>
                            </div>
                        </div>
                    </div >
                ) : (
                    <div className="space-y-8">
                        {/* Settings only - simplified for fretboard */}


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
                            <div className="pt-2">
                                <button
                                    onClick={() => onGlobalSettingsChange?.({ showChordName: !globalSettings?.showChordName })}
                                    className={`w-full py-2 rounded-lg border text-[10px] font-black uppercase transition-all ${globalSettings?.showChordName !== false ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
                                >
                                    Chord Name
                                </button>
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

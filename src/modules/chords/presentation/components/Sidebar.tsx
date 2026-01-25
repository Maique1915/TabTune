'use client';

import React from 'react';
import { Duration, NoteData, MeasureData, GlobalSettings } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { extensions as extensionOrder } from '@/modules/core/domain/chord-logic';
import { INSTRUMENTS } from '@/lib/instruments';
import { VexFlowRhythmIcon } from './VexFlowRhythmIcon';
import { GenericSidebar } from '@/shared/components/layout/GenericSidebar';
import Link from 'next/link';
import { Music, Settings2, Guitar, Home, ChevronDown, Minus, Plus } from 'lucide-react';
import { useAppContext } from '@/modules/core/presentation/context/app-context';
import { NOTE_NAMES, getMsFromDuration } from '@/modules/editor/domain/music-math';
import { FullNeckDrawer } from '@/modules/engine/infrastructure/drawers/FullNeck';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/shared/components/ui/accordion';

const calculateShiftedTuning = (baseTuning: string[], shift: number): string[] => {
    if (shift >= 0) return [...baseTuning]; // Fix names for Capo or Standard

    return baseTuning.map(note => {
        // Extract note part (handles cases like 'e' for high E)
        const isHighE = note === 'e';
        const baseNote = isHighE ? 'E' : note;

        // Find index in NOTE_NAMES. Root might be like 'C#', 'Bb', etc.
        // NOTE_NAMES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        let idx = NOTE_NAMES.indexOf(baseNote);

        // Handle common flat aliases if not found directly
        if (idx === -1) {
            const aliases: Record<string, string> = {
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B', 'Fb': 'E'
            };
            if (aliases[baseNote]) idx = NOTE_NAMES.indexOf(aliases[baseNote]);
        }

        if (idx === -1) return note; // Fallback

        let newIdx = (idx + shift) % 12;
        if (newIdx < 0) newIdx += 12;

        let newNote = NOTE_NAMES[newIdx];

        // Use flats if shift is negative (Down tuning)
        if (shift < 0) {
            const sharpToFlat: Record<string, string> = {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
            };
            if (sharpToFlat[newNote]) newNote = sharpToFlat[newNote];
        }

        return isHighE ? newNote.toLowerCase() : newNote;
    });
};

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
    onToggleBarreTo?: (targetString: number) => void;
    onSetFingerForString?: (idx: number, finger: number | string | undefined) => void;
    onSetFretForString?: (idx: number, fret: number) => void;
    onSetStringForPosition?: (idx: number, stringNum: number) => void;
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
    onTransposeAll?: (semitones: number) => void;
    theme?: FretboardTheme;
    isSequentialMode?: boolean;
    onNoteDurationStatic?: (noteId: string, duration: Duration) => void;
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
    onToggleBarreTo,
    globalSettings,
    onGlobalSettingsChange,
    onImportScore,
    isMobile = false,
    isOpen = true,
    onClose,
    onUpdateMeasure,
    onTransposeMeasure,
    onTransposeAll,
    theme,
    onInsert,
    isSequentialMode = false,
    onNoteDurationStatic,
    onSetFingerForString,
    onSetFretForString,
    onSetStringForPosition,
}) => {
    const { setAnimationType, animationType, selectedChords } = useAppContext();

    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
    const [selectedStrings, setSelectedStrings] = React.useState<number[]>([]);
    const [isBarreSelectorOpen, setIsBarreSelectorOpen] = React.useState(false);

    // Chord builder state (initialized from prop logic or default)
    // We'll keep it simple: sync logic runs in useEffect below
    const [localRoot, setLocalRoot] = React.useState("C");
    const [localQuality, setLocalQuality] = React.useState("");
    const [localBass, setLocalBass] = React.useState("Root");
    const [localExtensions, setLocalExtensions] = React.useState<string[]>([]);

    // Reset barre selector when note changes or active position changes
    React.useEffect(() => {
        setIsBarreSelectorOpen(false);
    }, [editingNote?.id, activePositionIndex]);

    // Sync local state when active measure changes
    React.useEffect(() => {
        if (activeMeasure?.chordName) {
            const chordName = activeMeasure.chordName;

            // Extract Bass first
            let bass = "Root";
            let rest = chordName;
            if (chordName.includes("/")) {
                const parts = chordName.split("/");
                bass = "/" + parts[1];
                rest = parts[0];
            }

            // Extract Root (1 or 2 chars)
            let root = "C";
            let qualityExt = "";
            if (rest.length > 1 && (rest[1] === "#" || rest[1] === "b")) {
                root = rest.substring(0, 2);
                qualityExt = rest.substring(2);
            } else {
                root = rest.substring(0, 1);
                qualityExt = rest.substring(1);
            }

            // Extract Quality basic check
            let quality = "";
            let extensionsStr = qualityExt;

            // Try to match specific quality prefixes first (Order matters: longest first)
            const qualities = ["dim", "aug", "sus2", "sus4", "maj", "m"];
            for (const q of qualities) {
                if (qualityExt.startsWith(q)) {
                    quality = q;
                    extensionsStr = qualityExt.substring(q.length);
                    break;
                }
            }

            // Parse individual extensions using regex
            const foundExts: string[] = [];
            const extRegex = /([b#])?(5|6|7\+?|9|11|13)/g;
            let match;
            while ((match = extRegex.exec(extensionsStr)) !== null) {
                foundExts.push(match[0]);
            }

            // Set state
            setLocalRoot(root);
            setLocalQuality(quality);
            setLocalBass(bass);
            setLocalExtensions(foundExts);

        } else {
            // Reset to defaults if no name
            setLocalRoot("C");
            setLocalQuality("");
            setLocalBass("Root");
            setLocalExtensions([]);
        }
    }, [activeMeasure?.id, activeMeasure?.chordName]);


    // Tab Interface State: Unified
    // Tabs for the unified view
    const tabs = [
        { id: 'chord', label: 'THEORY', icon: Music },
        { id: 'fretboard', label: 'FRETBOARD', icon: Guitar },
    ] as const;

    const [activeUnifiedTab, setActiveUnifiedTab] = React.useState<typeof tabs[number]['id']>('chord');


    // Reset selection when editing note changes
    React.useEffect(() => {
        setSelectedIndices([]);
        setSelectedStrings([]);
    }, [editingNote?.id]);

    // Auto-switch to Fretboard tab when a note is selected for editing
    React.useEffect(() => {
        if (editingNote) {
            setActiveUnifiedTab('fretboard');
        }
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

            // Legacy: Auto-barre on multi-select removed in favor of Finger-based logic.
            // We keep selection state for potential bulk operations (like mass delete or mass finger set?)
            // For now, just keeping the selection visual is harmless.
        } else {
            setSelectedStrings([]);
            handleStringChangeLocal(strStr);
        }
    };

    const handlePosClick = (idx: number, e: React.MouseEvent) => {
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const currentSelection = selectedIndices.length > 0
                ? selectedIndices
                : (activePositionIndex !== undefined && activePositionIndex >= 0 ? [activePositionIndex] : []);

            const newIndices = currentSelection.includes(idx)
                ? currentSelection.filter(i => i !== idx)
                : [...currentSelection, idx];

            setSelectedIndices(newIndices);

            // Legacy auto-toggle barre removed
        } else {
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

    const handleDurationClick = (code: Duration) => {
        if (!!editingNote) {
            if (isSequentialMode && onNoteDurationStatic) {
                onNoteDurationStatic(editingNote.id, code);
            } else if (onNoteRhythmChange) {
                onNoteRhythmChange(code);
            }
        } else {
            onSelectDuration(code);
        }
    };

    const getDurationActive = (code: Duration) => {
        if (!!editingNote && editingNote) {
            return editingNote.duration === code;
        }
        return activeDuration === code;
    };

    const handleFretChange = (fret: number) => {
        if (!editingNote || activePositionIndex === undefined || activePositionIndex < 0) return;
        const note = editingNote as any;
        const currentPos = note.positions[activePositionIndex];
        if (!currentPos) return;

        // Validation for Cinematic mode (max 24 frets including capo)
        if (animationType === 'guitar-fretboard') {
            const currentCapo = globalSettings?.capo || 0;
            if (fret + currentCapo > 24) return;
        }

        const newPositions = [...note.positions];
        newPositions[activePositionIndex] = { ...currentPos, fret: fret };

        onUpdateNote?.({ positions: newPositions });
    };

    const handleFingerChange = (finger: number) => {
        if (!editingNote || activePositionIndex === undefined || activePositionIndex < 0) return;
        const currentPos = editingNote.positions[activePositionIndex];
        if (!currentPos) return;

        const newPositions = [...editingNote.positions];
        newPositions[activePositionIndex] = { ...currentPos, finger: finger };

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


    // Helper to update both local state and parent measure
    const handleChordChange = (updates: { root?: string, quality?: string, bass?: string, extensions?: string[] }) => {
        const newRoot = updates.root !== undefined ? updates.root : localRoot;
        const newQuality = updates.quality !== undefined ? updates.quality : localQuality;
        const newBass = updates.bass !== undefined ? updates.bass : localBass;
        const newExts = updates.extensions !== undefined ? updates.extensions : localExtensions;

        // Update local state
        if (updates.root !== undefined) setLocalRoot(updates.root);
        if (updates.quality !== undefined) setLocalQuality(updates.quality);
        if (updates.bass !== undefined) setLocalBass(updates.bass);
        if (updates.extensions !== undefined) setLocalExtensions(updates.extensions);

        // Build name and update parent
        if (activeMeasure && onUpdateMeasure) {
            const qualitySuffix = newQuality;
            const bassSuffix = newBass === "Root" ? "" : newBass;
            const extensionStr = newExts.join("");
            const newName = `${newRoot}${qualitySuffix}${extensionStr}${bassSuffix}`;

            if (onUpdateMeasure) {
                // We don't check for equality here to allow force updates if needed, 
                // but ideally we do. The logic is fine.
                onUpdateMeasure(activeMeasure.id, { chordName: newName });
            }
        }
    };


    const title = 'CHORD EDITOR';
    const Icon = Guitar;

    return (
        <GenericSidebar
            title={title}
            icon={Icon}
            onReset={undefined}
            onClose={onClose || onCloseInspector}
            side="left"
            isMobile={isMobile}
            isOpen={isOpen}
            headerAction={(
                <Link href="/">
                    <button className="group relative p-2.5 bg-zinc-950/40 hover:bg-cyan-500/10 rounded-xl border border-zinc-800/60 hover:border-cyan-500/40 text-zinc-500 hover:text-cyan-400 transition-all duration-300 shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </Link>
            )}
        >
            <div className="space-y-3">

                {/* Unified Tab Navigation */}
                <div className="flex bg-zinc-950/40 p-0.5 rounded-xl border border-zinc-800/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveUnifiedTab(tab.id)}
                            className={`flex-1 py-1.5 text-[8px] font-black rounded-lg transition-all flex flex-col items-center gap-0.5 ${activeUnifiedTab === tab.id
                                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                                : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                        >
                            <tab.icon className="w-3 h-3" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- CHORD TAB (Theory & Name) --- */}
                {activeUnifiedTab === 'chord' && (
                    <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">

                        {/* GLOBAL MODE: No Active Measure Selected */}
                        {!activeMeasure ? (
                            <div className="space-y-6 px-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Global Controls</label>
                                    </div>

                                    <button
                                        onClick={() => onInsert?.(activeDuration || 'q')}
                                        className="w-full py-5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-2xl font-black text-xs transition-all duration-300 flex flex-col items-center justify-center gap-3 group relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <div className="p-3 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                                            <Music className="w-5 h-5 relative z-10" />
                                        </div>
                                        <span className="relative z-10 uppercase tracking-widest text-[10px]">Add to Timeline</span>
                                    </button>

                                    {/* BPM / Tempo Selector (Moved to Global Global) */}
                                    <div className="space-y-3 pt-4 border-t border-zinc-900/50">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Tempo</label>
                                                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tight mt-1">Sync Animation</span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                                <span className="text-[11px] font-black text-cyan-400 leading-none">{globalSettings?.bpm || 120} BPM</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 bg-zinc-950/60 p-1.5 rounded-2xl border border-white/[0.03] shadow-inner">
                                            <button
                                                onClick={() => {
                                                    const cur = globalSettings?.bpm || 120;
                                                    onGlobalSettingsChange?.({ bpm: Math.max(20, cur - 5) });
                                                }}
                                                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all shadow-lg"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>

                                            <div className="flex-1 flex flex-col items-center">
                                                <input
                                                    type="number"
                                                    value={globalSettings?.bpm || 120}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val)) onGlobalSettingsChange?.({ bpm: val });
                                                    }}
                                                    className="w-full bg-transparent text-center font-black text-xl text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const cur = globalSettings?.bpm || 120;
                                                    onGlobalSettingsChange?.({ bpm: Math.min(300, cur + 5) });
                                                }}
                                                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all shadow-lg"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* CHORD MODE: Active Measure Selected */
                            <div className="space-y-5 px-1 pb-4">
                                {/* Theory-based Duration Grid - ONLY in Internal/Selective Mode */}
                                {(editingNote) && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Duration</label>
                                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[9px] font-bold uppercase tracking-widest leading-none">
                                                ACTIVE
                                            </span>
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
                                                const isActive = getDurationActive(item.code);
                                                return (
                                                    <button
                                                        key={item.code}
                                                        onClick={() => handleDurationClick(item.code)}
                                                        className={`
                                                        aspect-[5/6] rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-500 group/dur
                                                        ${isActive
                                                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20'
                                                                : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/40'}
                                                    `}
                                                    >
                                                        <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover/dur:scale-105'}`}>
                                                            <VexFlowRhythmIcon
                                                                duration={item.code}
                                                                className="w-10 h-10"
                                                                fillColor={isActive ? '#22d3ee' : '#3f3f46'}
                                                            />
                                                        </div>
                                                        <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-cyan-400' : 'text-zinc-600'}`}>
                                                            {item.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="h-px bg-zinc-800/30 w-full" />

                                {/* Chord Editor - Unified Box & Accordion */}
                                <div className="space-y-4">
                                    {(!editingNote) ? (
                                        <>
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center flex-1">Symbol Preview</label>
                                            </div>

                                            {/* --- SYMBOL PREVIEW BOX --- */}
                                            <div className="relative group overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-50" />
                                                <div className="bg-black/60 p-6 rounded-[24px] border border-white/[0.05] text-center relative z-10 shadow-2xl backdrop-blur-sm">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] tracking-tighter">
                                                            {localRoot?.replace('#', '♯').replace('b', '♭')}
                                                        </span>
                                                        {localQuality && (
                                                            <span className="text-2xl font-black text-cyan-500/80 transform translate-y-[-2px] tracking-tight">
                                                                {localQuality}
                                                            </span>
                                                        )}
                                                        {localExtensions && localExtensions.length > 0 && (
                                                            <div className="flex flex-col items-start leading-[0.75] ml-1.5 pt-1">
                                                                {localExtensions.slice().sort((a, b) => extensionOrder.indexOf(a) - extensionOrder.indexOf(b)).map((ext, i) => (
                                                                    <span key={i} className="text-[12px] font-black text-cyan-400/90 drop-shadow-sm">{ext.replace('#', '♯').replace('b', '♭')}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {localBass && localBass !== 'Root' && (
                                                            <span className="text-2xl font-black text-cyan-600/60 ml-2 tracking-tighter">
                                                                /{localBass.replace('#', '♯').replace('b', '♭')}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 flex gap-2 justify-center">
                                                        {activeMeasure && (
                                                            <button
                                                                onClick={() => onUpdateMeasure?.(activeMeasure.id, { showChordName: !activeMeasure.showChordName })}
                                                                className={`px-3 py-1 rounded-full text-[8px] font-black transition-all border uppercase tracking-[0.1em] ${activeMeasure.showChordName !== false
                                                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                                                    : 'bg-zinc-900/80 text-zinc-600 border-zinc-800'
                                                                    }`}
                                                            >
                                                                {activeMeasure.showChordName !== false ? '• Symbol Visible' : '• Symbol Hidden'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* --- THEORY ACCORDION (Consolidated) --- */}
                                            <Accordion type="single" collapsible defaultValue="chord-theory" className="w-full">
                                                <AccordionItem value="chord-theory" className="border-none bg-zinc-950/40 rounded-2xl overflow-hidden px-4 border border-white/[0.02]">
                                                    <AccordionTrigger className="hover:no-underline py-4">
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Chord Theory</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pb-5 pt-0 space-y-6">
                                                        {/* ROOT SECTION */}
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Root & Tone</label>
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-7 gap-1">
                                                                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                                                                        const currentBase = localRoot.replace(/[#b]/g, '');
                                                                        const isActive = currentBase === note;
                                                                        return (
                                                                            <button
                                                                                key={note}
                                                                                onClick={() => handleChordChange({ root: note })}
                                                                                className={`
                                                                            aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all
                                                                            ${isActive
                                                                                        ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                                                                                        : 'bg-zinc-900/40 text-zinc-500 hover:bg-zinc-800 hover:text-white'}
                                                                        `}
                                                                            >
                                                                                {note}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    {[{ label: 'Nat', val: '' }, { label: '♯', val: '#' }, { label: '♭', val: 'b' }].map((acc) => {
                                                                        const currentBase = localRoot.replace(/[#b]/g, '') || 'C';
                                                                        const currentAcc = localRoot.includes('#') ? '#' : localRoot.includes('b') ? 'b' : '';
                                                                        const isAccActive = currentAcc === acc.val;

                                                                        return (
                                                                            <button
                                                                                key={acc.label}
                                                                                onClick={() => handleChordChange({ root: currentBase + acc.val })}
                                                                                className={`
                                                                            flex-1 h-8 rounded-xl text-[9px] font-black uppercase transition-all border
                                                                            ${isAccActive
                                                                                        ? 'bg-zinc-800 text-cyan-400 border-cyan-500/30'
                                                                                        : 'bg-zinc-950/20 text-zinc-600 border-zinc-900/50 hover:bg-zinc-900'}
                                                                        `}
                                                                            >
                                                                                {acc.label}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* QUALITY SECTION */}
                                                        <div className="space-y-2 border-t border-zinc-900/50 pt-4">
                                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Quality</label>
                                                            <div className="relative">
                                                                <select
                                                                    className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl px-3 py-2 text-[10px] font-black text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                                                                    value={localQuality}
                                                                    onChange={(e) => handleChordChange({ quality: e.target.value })}
                                                                >
                                                                    <option value="">Major</option>
                                                                    <option value="m">Minor</option>
                                                                    <option value="dim">Diminished</option>
                                                                    <option value="aug">Augmented</option>
                                                                    <option value="sus2">Sus2</option>
                                                                    <option value="sus4">Sus4</option>
                                                                    <option value="maj">Major 7th Style</option>
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                                                            </div>
                                                        </div>

                                                        {/* EXTENSIONS SECTION */}
                                                        <div className="space-y-3 border-t border-zinc-900/50 pt-4">
                                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Extensions</label>
                                                            <div className="grid grid-cols-4 gap-1.5">
                                                                {[
                                                                    { label: '5', value: '5' },
                                                                    { label: '6', value: '6' },
                                                                    { label: '7', value: '7' },
                                                                    { label: '7+', value: '7+' },
                                                                    { label: '9', value: '9' },
                                                                    { label: '11', value: '11' },
                                                                    { label: '13', value: '13' }
                                                                ].map(ext => {
                                                                    const isActive = localExtensions.includes(ext.value);
                                                                    return (
                                                                        <button
                                                                            key={ext.value}
                                                                            onClick={() => {
                                                                                const others = localExtensions.includes(ext.value)
                                                                                    ? localExtensions.filter(e => e !== ext.value)
                                                                                    : [...localExtensions, ext.value];
                                                                                handleChordChange({ extensions: others });
                                                                            }}
                                                                            className={`
                                                                        py-2 rounded-lg text-[9px] font-black border transition-all duration-300
                                                                        ${isActive
                                                                                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
                                                                                    : 'bg-zinc-900/20 border-zinc-800/80 text-zinc-500 hover:text-white'}
                                                                    `}
                                                                        >
                                                                            {ext.label}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* BASS SECTION */}
                                                        <div className="space-y-3 border-t border-zinc-900/50 pt-4">
                                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Bass Inversion</label>
                                                            <div className="grid grid-cols-4 gap-1.5">
                                                                {['Root', ...['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(r => `/${r}`)].map(label => {
                                                                    const value = label === 'Root' ? 'Root' : label;
                                                                    const isActive = localBass === value;
                                                                    return (
                                                                        <button
                                                                            key={value}
                                                                            onClick={() => handleChordChange({ bass: value })}
                                                                            className={`
                                                                        py-2 rounded-lg text-[9px] font-black border transition-all duration-300
                                                                        ${isActive
                                                                                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                                                                                    : 'bg-zinc-900/20 border-zinc-800/80 text-zinc-600 hover:text-white'}
                                                                    `}
                                                                        >
                                                                            {label === 'Root' ? 'Root' : label.replace('#', '♯').replace('b', '♭')}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </>
                                    ) : null}

                                    {/* Tools Section */}
                                    <div className="bg-zinc-950/40 rounded-3xl p-5 border border-white/[0.02] mt-4 shadow-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                {(!editingNote) ? 'Global Transpose' : 'Selective Transpose'}
                                            </span>
                                            <span className="text-[9px] font-black text-orange-400 px-2 py-0.5 rounded-full bg-orange-400/10 border border-orange-400/20">DATA SHIFT</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, -1)}
                                                className="w-12 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95"
                                            >-</button>
                                            <div className="flex-1 text-center text-[10px] font-black text-zinc-400 bg-black/40 py-3 rounded-xl border border-white/[0.03] uppercase tracking-widest">1 Semitone</div>
                                            <button
                                                onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, 1)}
                                                className="w-12 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                )}


                {/* --- FRETBOARD TAB (Visual Editor & Settings) --- */}
                {activeUnifiedTab === 'fretboard' && (
                    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                        {/* VIEW WHEN A CHORD IS SELECTED */}
                        {editingNote && (
                            <>
                                <div className="h-px bg-zinc-800/50 w-full" />

                                {/* Strings & Frets - Consolidated */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fretboard Map</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={onAddChordNote}
                                                className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-bold hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
                                            >
                                                + ADD STRING
                                            </button>
                                        </div>
                                    </div>

                                    {/* Active Notes List */}
                                    <div className="flex flex-wrap gap-1.5 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50 min-h-[50px] items-center">
                                        {editingNote.positions.length === 0 && (
                                            <span className="text-[9px] text-zinc-600 italic px-2">No notes placed on fretboard</span>
                                        )}
                                        {editingNote.positions.map((pos, idx) => (
                                            <div key={idx} className="relative group">
                                                <button
                                                    onClick={(e) => handlePosClick(idx, e)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${activePositionIndex === idx || selectedIndices.includes(idx) ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
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
                                    {editingNote.positions.length > 0 && (() => {
                                        const currentPos = editingNote.positions[activePositionIndex];
                                        const usedFingers = editingNote.positions
                                            .filter((_, idx) => idx !== activePositionIndex)
                                            .map(p => p.finger)
                                            .filter(f => f !== undefined && f !== 0);

                                        return (
                                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                                {/* 1. String Selector */}
                                                <div className="space-y-2 pt-2">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">1. Select String</span>
                                                    <div className="grid grid-cols-6 gap-1.5">
                                                        {[6, 5, 4, 3, 2, 1].map(s => {
                                                            const isActive = currentPos?.string === s;
                                                            const isUsedElsewhere = editingNote.positions.some((p, i) => p.string === s && i !== activePositionIndex);

                                                            return (
                                                                <button
                                                                    key={s}
                                                                    disabled={isUsedElsewhere}
                                                                    onClick={() => onSetStringForPosition?.(activePositionIndex, s)}
                                                                    className={`py-2 rounded-lg border font-bold text-[9px] transition-all ${isActive
                                                                        ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                                                        : isUsedElsewhere
                                                                            ? 'bg-zinc-950/40 border-zinc-900/50 text-zinc-800 cursor-not-allowed opacity-30'
                                                                            : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
                                                                        }`}
                                                                    style={isActive ? {
                                                                        backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                                        borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                                        color: theme?.fingers?.textColor || '#ffffff'
                                                                    } : {}}
                                                                >STR {s}</button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* 2. Finger Selector (includes Avoid) */}
                                                <div className="space-y-2 pt-2">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">2. Select Finger</span>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {[
                                                            { label: 'Index (1)', val: 1 },
                                                            { label: 'Middle (2)', val: 2 },
                                                            { label: 'Ring (3)', val: 3 },
                                                            { label: 'Pinky (4)', val: 4 },
                                                            { label: 'Thumb (T)', val: 0 },
                                                            { label: 'Avoid (X)', val: 'X' }
                                                        ].map((finger) => {
                                                            const isAvoidVal = finger.val === 'X';
                                                            const isActive = isAvoidVal ? currentPos?.avoid : (currentPos?.finger === finger.val && !currentPos?.avoid);
                                                            const isUsed = !isAvoidVal && usedFingers.includes(finger.val as any);

                                                            return (
                                                                <button
                                                                    key={finger.label}
                                                                    disabled={isUsed}
                                                                    onClick={() => onSetFingerForString?.(activePositionIndex, finger.val)}
                                                                    className={`flex-1 min-w-[60px] py-2 rounded-lg border font-bold text-[9px] transition-all ${isActive
                                                                        ? (isAvoidVal ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.15)]')
                                                                        : isUsed
                                                                            ? 'bg-zinc-950/20 border-zinc-900/50 text-zinc-800 opacity-30 cursor-not-allowed'
                                                                            : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800'
                                                                        }`}
                                                                >
                                                                    {finger.label.split(" ")[0]} <span className="opacity-50">{finger.label.split(" ")[1]}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* 3. Fret Selector */}
                                                <div className={`space-y-2 pt-2 transition-opacity duration-300 ${currentPos?.avoid ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">3. Select Fret</span>
                                                    <div className="grid grid-cols-6 gap-1.5">
                                                        {Array.from({ length: 24 }).map((_, i) => {
                                                            const fret = i + 1;
                                                            const currentFret = parseInt(currentPos?.fret?.toString() || '0');
                                                            const currentCapo = globalSettings?.capo || 0;
                                                            const isOverLimit = animationType === 'guitar-fretboard' && (fret + currentCapo > 24);

                                                            return (
                                                                <button
                                                                    key={fret}
                                                                    disabled={isOverLimit}
                                                                    onClick={() => onSetFretForString?.(activePositionIndex, fret)}
                                                                    className={`h-7 rounded-md border font-black text-[10px] transition-all ${isOverLimit ? 'opacity-20 cursor-not-allowed bg-zinc-950 border-transparent' : (currentFret === fret ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300')}`}
                                                                    style={currentFret === fret ? {
                                                                        backgroundColor: theme?.fingers?.color || '#06b6d4',
                                                                        borderColor: theme?.fingers?.border?.color || '#22d3ee',
                                                                        color: theme?.fingers?.textColor || '#ffffff'
                                                                    } : {}}
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
                                                                        className={`w-full py-3 rounded-xl border border-dashed text-[10px] font-black transition-all uppercase tracking-widest ${isBarreFinger ? 'border-zinc-800 text-zinc-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5' : 'border-zinc-900 text-zinc-800 cursor-not-allowed'}`}
                                                                    >
                                                                        + ADD BARRE (Pestana)
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">4. Pestana (Barre To)</span>
                                                                            {hasBarre && (
                                                                                <button
                                                                                    onClick={() => onToggleBarre?.()}
                                                                                    className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
                                                                                >
                                                                                    REMOVE
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        <div className="grid grid-cols-6 gap-1.5">
                                                                            {[1, 2, 3, 4, 5, 6].map(s => {
                                                                                const isTarget = currentPos?.endString === s;

                                                                                return (
                                                                                    <button
                                                                                        key={s}
                                                                                        onClick={() => onToggleBarreTo?.(s)}
                                                                                        className={`py-2 rounded-lg border font-bold text-[9px] transition-all ${isTarget ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'}`}
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
                                                                        <p className="text-[8px] text-zinc-600">Selecione uma nota e clique no número da corda onde a pestana deve terminar.</p>
                                                                    </>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </div>

                            </>
                        )}



                        {/* VIEW WHEN NO CHORD IS SELECTED (GLOBAL SETTINGS) */}
                        {!editingNote && (
                            <div className="space-y-4 pt-4 border-t border-zinc-800/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Config</h3>

                                {/* Guitar Neck Section */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center space-x-2">
                                        <span>Guitar Neck</span>
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                onGlobalSettingsChange?.({ numFrets: 24 });
                                                setAnimationType('guitar-fretboard');
                                            }}
                                            className={`py-3 rounded-xl border font-black transition-all text-[10px] flex flex-col items-center justify-center space-y-1 ${(globalSettings?.numFrets || 24) === 24 && animationType === 'guitar-fretboard'
                                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
                                                }`}
                                        >
                                            <span>FULL NECK</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onGlobalSettingsChange?.({ numFrets: 5 });
                                                setAnimationType('static-fingers');
                                            }}
                                            className={`py-3 rounded-xl border font-black transition-all text-[10px] flex flex-col items-center justify-center space-y-1 ${globalSettings?.numFrets === 5
                                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
                                                }`}
                                        >
                                            <span>SHORT NECK</span>
                                        </button>
                                    </div>

                                    {/* Carousel Toggle (Only visible in Short Neck) */}
                                    {globalSettings?.numFrets === 5 && (
                                        <button
                                            onClick={() => setAnimationType(animationType === 'carousel' ? 'static-fingers' : 'carousel')}
                                            className={`w-full py-2 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center space-x-2 ${animationType === 'carousel'
                                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                                : 'bg-zinc-900/30 border-zinc-800/30 text-zinc-500 hover:text-zinc-300'
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${animationType === 'carousel' ? 'bg-purple-500' : 'bg-zinc-600'}`} />
                                            <span>CAROUSEL MODE</span>
                                        </button>
                                    )}
                                </div>

                                {/* Instrument Selector */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Instrument</label>
                                    <select
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none"
                                        value={globalSettings?.instrumentId || 'violao'}
                                        onChange={(e) => {
                                            const instId = e.target.value;
                                            const inst = INSTRUMENTS.find(i => i.id === instId);
                                            if (inst && onGlobalSettingsChange) {
                                                const baseTuning = inst.tunings[0];
                                                const shift = globalSettings?.tuningShift || 0;
                                                onGlobalSettingsChange({
                                                    instrumentId: instId,
                                                    tuningIndex: 0,
                                                    tuning: calculateShiftedTuning(baseTuning, shift)
                                                });
                                            }
                                        }}
                                    >
                                        {INSTRUMENTS.map(inst => (
                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tuning Selector (Context-Aware) */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Tuning</label>
                                    <select
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none"
                                        value={globalSettings?.tuningIndex || 0}
                                        onChange={(e) => {
                                            const idx = parseInt(e.target.value);
                                            const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                            if (instrument && onGlobalSettingsChange) {
                                                const baseTuning = instrument.tunings[idx];
                                                const shift = globalSettings?.tuningShift || 0;
                                                onGlobalSettingsChange({
                                                    tuningIndex: idx,
                                                    tuning: calculateShiftedTuning(baseTuning, shift)
                                                });
                                            }
                                        }}
                                    >
                                        {INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'))?.tunings.map((t, idx) => (
                                            <option key={idx} value={idx}>{t.join(" ")}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tuning Shift / Capo Selector */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                                            Capo / Guitar Tuning
                                        </div>
                                        <div className="text-[9px] font-bold text-cyan-500/80 uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                                            Visual Shift
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const current = globalSettings?.tuningShift || 0;
                                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                                const newShift = Math.max(-12, current - 1);
                                                onGlobalSettingsChange?.({
                                                    tuningShift: newShift,
                                                    capo: Math.max(0, newShift), // capo is 0 if shift is negative
                                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                                });
                                            }}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 text-center font-bold text-zinc-300 bg-zinc-950/30 rounded-lg py-1.5 border border-zinc-800/50">
                                            {(() => {
                                                const shift = globalSettings?.tuningShift || 0;
                                                if (shift === 0) return 'STANDARD';
                                                if (shift > 0) return `CAPO ${shift}`;
                                                return `DOWN ${Math.abs(shift)}`;
                                            })()}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const current = globalSettings?.tuningShift || 0;
                                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                                const newShift = Math.min(24, current + 1);

                                                // Validation for Cinematic mode (max 24 frets for any note + capo)
                                                if (animationType === 'guitar-fretboard') {
                                                    const newCapo = Math.max(0, newShift);

                                                    // 1. Check current editing note if exists
                                                    if (editingNote && (editingNote as any).positions) {
                                                        const mockChord = { fingers: (editingNote as any).positions } as any;
                                                        if (!FullNeckDrawer.validateFretLimit(mockChord, newCapo)) return;
                                                    }

                                                    // 2. Check all chords in timeline
                                                    if (selectedChords && selectedChords.length > 0) {
                                                        const allValid = selectedChords.every(c =>
                                                            FullNeckDrawer.validateFretLimit(c.finalChord, newCapo)
                                                        );
                                                        if (!allValid) return;
                                                    }
                                                }

                                                onGlobalSettingsChange?.({
                                                    tuningShift: newShift,
                                                    capo: Math.max(0, newShift), // capo is the shift value if positive
                                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                                });
                                            }}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>


                                {/* Import/Export (Stub for now) */}
                                <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                                    <button
                                        onClick={onImportScore}
                                        className="w-full py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-xs hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="text-lg">↓</span> IMPORT SCORE
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
                }


            </div >


        </GenericSidebar >
    );
};

export default Sidebar;

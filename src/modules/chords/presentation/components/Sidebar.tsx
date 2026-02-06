'use client';

import React from 'react';
import { Duration, NoteData, MeasureData, GlobalSettings, ManualChordData } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { INSTRUMENTS } from '@/lib/instruments';
import { VexFlowRhythmIcon } from './VexFlowRhythmIcon';
import { GenericSidebar } from '@/shared/components/layout/GenericSidebar';
import Link from 'next/link';
import { Music, Settings2, Guitar, Home, ChevronDown, Minus, Plus, Clock, Wrench } from 'lucide-react';
import { useAppContext } from '@/modules/core/presentation/context/app-context';
import { NOTE_NAMES } from '@/modules/editor/domain/music-math';

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
    onSetFingerForPosition?: (idx: number, finger: number | string | undefined) => void;
    onSetFretForPosition?: (idx: number, fret: number) => void;
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
    onTransposeMeasure?: (measureId: string, semitones: number, smartTranspose?: boolean) => void;
    onTransposeAll?: (semitones: number, smartTranspose?: boolean) => void;
    onToggleAutoFinger?: (enabled: boolean) => void;
    theme?: FretboardTheme;
    isSequentialMode?: boolean;
    onNoteDurationStatic?: (noteId: string, duration: Duration) => void;
    measures?: MeasureData[];
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
    onToggleAutoFinger,
    theme,
    onInsert,
    simpleMode,
    isSequentialMode = false,
    onNoteDurationStatic,
    onSetFingerForPosition,
    onSetFretForPosition,
    onSetStringForPosition,
    measures,
}) => {
    const { setAnimationType, animationType, selectedChords } = useAppContext();

    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
    const [selectedStrings, setSelectedStrings] = React.useState<number[]>([]);
    const [isBarreSelectorOpen, setIsBarreSelectorOpen] = React.useState(false);
    const [activeCategory, setActiveCategory] = React.useState<'config' | 'chord' | 'rhythm' | 'editor' | 'tools'>((editingNote || activeMeasure) ? 'editor' : 'config');
    const isEditorGroup = activeCategory === 'editor' || activeCategory === 'rhythm' || activeCategory === 'tools';

    const displayNote = editingNote || (activeMeasure?.notes && activeMeasure.notes.length > 0 ? activeMeasure.notes[0] : null);

    // --- REUSABLE EMPTY STATE COMPONENT ---
    const EmptyState = ({ icon: Icon, title, description, features }: {
        icon: any,
        title: string,
        description: string,
        features: string[]
    }) => (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900/50 border border-zinc-800/30 flex items-center justify-center mb-2">
                <Icon className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-1">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{title}</h4>
                <p className="text-[9px] text-zinc-600 font-medium leading-relaxed max-w-[180px]">
                    {description}
                </p>
            </div>
            <div className="pt-4 grid grid-cols-1 gap-2 w-full max-w-[160px]">
                <div className="h-px bg-zinc-800/50 w-full mb-2" />
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[8px] text-zinc-700 font-bold uppercase tracking-tighter text-left">
                        <div className="w-1 h-1 rounded-full bg-cyan-500/40 shrink-0" />
                        {f}
                    </div>
                ))}
            </div>
        </div>
    );

    // Chord builder state (initialized from prop logic or default)
    // We'll keep it simple: sync logic runs in useEffect below
    const [chordData, setChordData] = React.useState<ManualChordData>({
        root: "C",
        quality: "",
        bass: "Root",
        extensions: []
    });

    const [smartTranspose, setSmartTranspose] = React.useState(false);

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

            // Sort musically
            const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
            foundExts.sort((a, b) => {
                const indexA = musicalOrder.indexOf(a);
                const indexB = musicalOrder.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            // Set state
            setChordData({
                root,
                quality,
                bass,
                extensions: foundExts
            });

        } else {
            // Reset to defaults if no name
            setChordData({
                root: "C",
                quality: "",
                bass: "Root",
                extensions: []
            });
        }
    }, [activeMeasure?.id, activeMeasure?.chordName]);





    // Helper to update both local state and parent measure
    const handleChordChange = (updates: Partial<ManualChordData>) => {
        const newData = { ...chordData, ...updates };

        // Update local state
        setChordData(newData);

        // Build name and update parent
        if (activeMeasure && onUpdateMeasure) {
            const qualitySuffix = newData.quality;
            const bassSuffix = (!newData.bass || newData.bass === "Root") ? "" : newData.bass;
            const extensionStr = (newData.extensions || []).join("");
            const newName = `${newData.root}${qualitySuffix}${extensionStr}${bassSuffix}`;

            if (onUpdateMeasure) {
                onUpdateMeasure(activeMeasure.id, { chordName: newName });
            }
        }
    };

    const toggleExtension = (base: string, accidental: string) => {
        const fullExt = accidental + base;
        const currentExts = chordData.extensions || [];
        const isCurrentlyActive = currentExts.includes(fullExt);

        // Remove any version of the same degree
        const filtered = currentExts.filter(e => {
            if (base === '7') return !e.match(/^[b#]?7$/);
            if (base === '7+') return !e.match(/^[b#]?7\+$/);
            return !e.match(new RegExp(`^[b#]?${base}$`));
        });

        let newExts = filtered;
        if (!isCurrentlyActive) {
            newExts.push(fullExt);
        }

        // Sort musically
        const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
        newExts.sort((a, b) => {
            const indexA = musicalOrder.indexOf(a);
            const indexB = musicalOrder.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        handleChordChange({ extensions: newExts });
    };

    const toggleBass = (note: string, accidental: string = '') => {
        if (note === 'Root') {
            handleChordChange({ bass: 'Root' });
            return;
        }
        const displayBass = '/' + note + accidental;
        handleChordChange({ bass: displayBass });
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
            contentClassName="overflow-hidden p-0"
            headerAction={(
                <Link href="/">
                    <button className="group relative p-2.5 bg-zinc-950/40 hover:bg-cyan-500/10 rounded-xl border border-zinc-800/60 hover:border-cyan-500/40 text-zinc-500 hover:text-cyan-400 transition-all duration-300 shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </Link>
            )}
        >
            <div className="flex h-full overflow-hidden">
                {/* Vertical Navigation Rail */}
                {/* Vertical Navigation Rail */}
                <div className="w-16 bg-panel-dark/50 border-r border-white/5 flex flex-col items-center py-6 gap-4 backdrop-blur-md">
                    {[
                        { id: 'config', icon: Settings2, label: 'Projeto' },
                        { id: 'chord', icon: Music, label: 'Harmonia' },
                        { id: 'editorGroup', icon: Guitar, label: 'Editor' },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                if (cat.id === 'editorGroup') {
                                    setActiveCategory('editor');
                                } else {
                                    setActiveCategory(cat.id as any);
                                }
                            }}
                            className={`group relative w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${(cat.id === 'editorGroup' ? isEditorGroup : activeCategory === cat.id)
                                ? 'bg-primary/20 text-primary border border-primary/30 shadow-cyan-glow'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <cat.icon className="w-5 h-5" />
                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-2 py-1 bg-card-dark text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                                {cat.label}
                            </span>
                        </button>
                    ))}

                    <div className="mt-auto mb-2">
                        <button className="group relative w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary-neon/20 border border-white/10 hover:border-primary/50 transition-all shadow-lg hover:shadow-cyan-glow">
                            <div className="text-[9px] font-black text-white group-hover:text-primary transition-colors">PRO</div>
                            <span className="absolute left-full ml-4 px-2 py-1 bg-card-dark text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                                Upgrade Plan
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-4 pb-20">

                    {isEditorGroup && (
                        <div className="mb-5">
                            <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-gradient-to-b from-black/40 to-black/20 p-1 shadow-[inset_0_0_24px_rgba(0,0,0,0.55)]">
                                {[
                                    { id: 'editor', label: 'Braço', icon: Guitar },
                                    { id: 'rhythm', label: 'Duração', icon: Clock },
                                    { id: 'tools', label: 'Ações', icon: Wrench },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveCategory(tab.id as any)}
                                        className={`group relative flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === tab.id
                                            ? 'bg-primary/20 text-primary border border-primary/30 shadow-cyan-glow'
                                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        {tab.label}
                                        <span className={`absolute -bottom-1 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full transition-all ${activeCategory === tab.id ? 'bg-primary shadow-cyan-glow' : 'bg-transparent'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- CATEGORY: EDITOR (Fretboard Visuals) --- */}
                    {activeCategory === 'editor' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                            {/* VIEW WHEN A CHORD IS SELECTED */}
                            {displayNote ? (
                                <>
                                    {/* Strings & Frets - Consolidated */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fretboard Map</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={onAddChordNote}
                                                    className="px-2 py-1 rounded bg-primary/10 text-primary text-[9px] font-bold hover:bg-primary/20 transition-colors border border-primary/20"
                                                >
                                                    + ADD STRING
                                                </button>
                                            </div>
                                        </div>

                                        {/* Active Notes List */}
                                        <div className="flex flex-wrap gap-1.5 bg-black/20 p-2 rounded-xl border border-white/5 min-h-[50px] items-center">
                                            {displayNote.positions.length === 0 && (
                                                <span className="text-[9px] text-zinc-600 italic px-2">No notes placed on fretboard</span>
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
                                            const currentPos = displayNote.positions[activePositionIndex];
                                            const usedFingers = displayNote.positions
                                                .filter((_, idx) => idx !== activePositionIndex)
                                                .map(p => p.finger)
                                                .filter(f => f !== undefined && f !== 0);

                                            return (
                                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                                    {/* 1. String Selector */}
                                                    <div className="space-y-2 pt-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">1. Select String</span>
                                                        <div className="flex gap-2 justify-between">
                                                            {Array.from({ length: globalSettings?.numStrings || 6 }, (_, i) => (globalSettings?.numStrings || 6) - i).map(s => {
                                                                const isActive = currentPos?.string === s;
                                                                const isUsedElsewhere = displayNote.positions.some((p, i) => p.string === s && i !== activePositionIndex);

                                                                return (
                                                                    <button
                                                                        key={s}
                                                                        disabled={isUsedElsewhere}
                                                                        onClick={() => onSetStringForPosition?.(activePositionIndex, s)}
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
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">2. Select Finger</span>
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
                                                                        onClick={() => onSetFingerForPosition?.(activePositionIndex, finger.val)}
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
                                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">3. Select Fret</span>
                                                            <span className="text-[10px] font-mono text-primary font-bold">
                                                                {parseInt(currentPos?.fret?.toString() || '0') > 0 ? `FRET ${currentPos?.fret}` : 'NUT'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-6 gap-1.5">
                                                            {Array.from({ length: 24 }).map((_, i) => {
                                                                const fret = i + 1;
                                                                const currentFret = parseInt(currentPos?.fret?.toString() || '0');

                                                                return (
                                                                    <button
                                                                        key={fret}
                                                                        onClick={() => onSetFretForPosition?.(activePositionIndex, fret)}
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
                                                                            <p className="text-[8px] text-zinc-600">Selecione uma nota e clique no número da corda onde a pestana deve terminar.</p>
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
                                </>
                            ) : (
                                <EmptyState
                                    icon={Guitar}
                                    title="No Note Selected"
                                    description="Select a chord in the timeline to edit its finger positions on the fretboard."
                                    features={[
                                        "Map Fingers to Strings",
                                        "Select Frets (1-24)",
                                        "Add Barre Chords"
                                    ]}
                                />
                            )}
                        </div>
                    )}

                    {/* --- CATEGORY: CHORD (Musical Theory) --- */}
                    {activeCategory === 'chord' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                            {displayNote ? (
                                <>

                                    {/* Root Selection */}
                                    <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Root & Tone</label>
                                        <div className="grid grid-cols-7 gap-1">
                                            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                                                const currentBase = chordData.root.replace(/[#b]/g, '');
                                                const isActive = currentBase === note;
                                                return (
                                                    <button
                                                        key={note}
                                                        onClick={() => {
                                                            const currentAcc = chordData.root.includes('#') ? '#' : chordData.root.includes('b') ? 'b' : '';
                                                            handleChordChange({ root: note + currentAcc });
                                                        }}
                                                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${isActive ? 'bg-primary text-black shadow-[0_0_12px_rgba(7,182,213,0.3)]' : 'bg-black/40 text-zinc-500 hover:bg-white/10 hover:text-white'}`}
                                                    >
                                                        {note}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="flex gap-2">
                                            {[{ label: 'Nat', val: '' }, { label: '♯', val: '#' }, { label: '♭', val: 'b' }].map((acc) => {
                                                const currentBase = chordData.root.replace(/[#b]/g, '') || 'C';
                                                const currentAcc = chordData.root.includes('#') ? '#' : chordData.root.includes('b') ? 'b' : '';
                                                const isAccActive = currentAcc === acc.val;
                                                return (
                                                    <button
                                                        key={acc.label}
                                                        onClick={() => handleChordChange({ root: currentBase + acc.val })}
                                                        className={`flex-1 h-8 rounded-xl text-[9px] font-black uppercase transition-all border ${isAccActive ? 'bg-white/10 text-primary border-primary/30' : 'bg-black/20 text-zinc-600 border-white/5 hover:bg-white/5'}`}
                                                    >
                                                        {acc.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Quality & Extensions */}
                                    <div className="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Quality</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black text-zinc-300 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                                    value={chordData.quality}
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

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Extensions</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['5', '6', '7', '7+', '9', '11', '13'].map(base => {
                                                    const currentExts = chordData.extensions || [];
                                                    const isFlatActive = currentExts.includes('b' + base);
                                                    const isNatActive = currentExts.includes(base);
                                                    const isSharpActive = currentExts.includes('#' + base);
                                                    const isActive = isFlatActive || isNatActive || isSharpActive;

                                                    return (
                                                        <div
                                                            key={base}
                                                            className={`flex h-8 rounded-xl overflow-hidden border transition-all duration-300 ${isActive
                                                                ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(7,182,213,0.1)]'
                                                                : 'bg-black/20 border-white/5'
                                                                }`}
                                                        >
                                                            <button
                                                                onClick={() => toggleExtension(base, 'b')}
                                                                className={`flex-1 text-[9px] font-black transition-all border-r border-white/5 ${isFlatActive ? 'bg-primary text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                                                                    }`}
                                                            >
                                                                b
                                                            </button>
                                                            <button
                                                                onClick={() => toggleExtension(base, '')}
                                                                className={`flex-[2] text-[10px] font-black transition-all border-r border-white/5 ${isNatActive ? 'bg-primary text-black' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                                                    }`}
                                                            >
                                                                {base}
                                                            </button>
                                                            <button
                                                                onClick={() => toggleExtension(base, '#')}
                                                                className={`flex-1 text-[9px] font-black transition-all ${isSharpActive ? 'bg-primary text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                                                                    }`}
                                                            >
                                                                #
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bass Selection */}
                                    <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">Bass Note</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Root Toggle */}
                                            <button
                                                onClick={() => toggleBass('Root')}
                                                className={`col-span-2 py-2 rounded-xl text-[10px] font-black border transition-all ${chordData.bass === 'Root' ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(7,182,213,0.1)]' : 'bg-black/20 border-white/5 text-zinc-500 hover:text-white'}`}
                                            >
                                                ROOT
                                            </button>

                                            {/* Musical Notes with Alterations */}
                                            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                                                const currentBass = chordData.bass || '';
                                                const isFlatActive = currentBass === '/' + note + 'b';
                                                const isNatActive = currentBass === '/' + note;
                                                const isSharpActive = currentBass === '/' + note + '#';
                                                const isActive = isFlatActive || isNatActive || isSharpActive;

                                                return (
                                                    <div
                                                        key={note}
                                                        className={`flex h-8 rounded-xl overflow-hidden border transition-all duration-300 ${isActive
                                                            ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(7,182,213,0.1)]'
                                                            : 'bg-black/20 border-white/5'
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={() => toggleBass(note, 'b')}
                                                            className={`flex-1 text-[9px] font-black transition-all border-r border-white/5 ${isFlatActive ? 'bg-primary text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                                                                }`}
                                                        >
                                                            b
                                                        </button>
                                                        <button
                                                            onClick={() => toggleBass(note, '')}
                                                            className={`flex-[2] text-[10px] font-black transition-all border-r border-white/5 ${isNatActive ? 'bg-primary text-black' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                                                }`}
                                                        >
                                                            {note}
                                                        </button>
                                                        <button
                                                            onClick={() => toggleBass(note, '#')}
                                                            className={`flex-1 text-[9px] font-black transition-all ${isSharpActive ? 'bg-primary text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                                                                }`}
                                                        >
                                                            #
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <EmptyState
                                    icon={Music}
                                    title="No Note Selected"
                                    description="Select a chord in the timeline to edit its musical theory properties like root, quality and extensions."
                                    features={[
                                        "Define Root & Quality",
                                        "Add Musical Extensions",
                                        "Set Bass Note Variations"
                                    ]}
                                />
                            )}
                        </div>
                    )}

                    {/* --- CATEGORY: RHYTHM --- */}
                    {activeCategory === 'rhythm' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                            {displayNote ? (
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
                            ) : (
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
                            )}
                        </div>
                    )}

                    {/* --- CATEGORY: TOOLS --- */}
                    {activeCategory === 'tools' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                            {activeMeasure ? (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{editingNote ? "Note Tools" : "Measure Tools"}</h3>

                                    {/* Transpose Section */}
                                    <div className="bg-zinc-950/40 rounded-3xl p-5 border border-white/[0.02] shadow-xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">
                                                    {editingNote ? "Selective" : "Measure"}
                                                </span>
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">
                                                    Transpose
                                                </span>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    const newState = !smartTranspose;
                                                    setSmartTranspose(newState);
                                                    onToggleAutoFinger?.(newState);
                                                }}
                                                className={`px-3 py-1 rounded-full border cursor-pointer transition-all ${smartTranspose ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[8px] font-black leading-none">AUTO</span>
                                                    <span className="text-[8px] font-black leading-none mt-0.5">FINGER</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, -1, smartTranspose)}
                                                className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>

                                            <div className="flex flex-col items-center justify-center min-w-[80px] h-14 bg-black/60 rounded-2xl border border-white/[0.05] shadow-inner">
                                                <span className="text-[14px] font-black text-zinc-300 leading-none">1</span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Semitone</span>
                                            </div>

                                            <button
                                                onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, 1, smartTranspose)}
                                                className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-lg"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Wrench}
                                    title="Note Tools"
                                    description="Select a note to access advanced manipulation tools like selective transposition."
                                    features={[
                                        "Selective Transpose",
                                        "Semitone Shifts",
                                        "Global Actions"
                                    ]}
                                />
                            )}
                        </div>
                    )}


                    {/* --- CATEGORY: CONFIG --- */}
                    {activeCategory === 'config' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Config</h3>

                                {/* BPM / Tempo Selector */}
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

                                {/* Instrument Selector */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Instrument</label>
                                    <select
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
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
                                                    tuning: calculateShiftedTuning(baseTuning, shift),
                                                    numStrings: baseTuning.length
                                                });
                                            }
                                        }}
                                    >
                                        {INSTRUMENTS.map(inst => (
                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tuning Selector */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Tuning</label>
                                    <select
                                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
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
                                            Capo / Tuning Shift
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const current = globalSettings?.tuningShift || 0;
                                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                                const newShift = Math.max(-5, current - 1);

                                                if (animationType === 'guitar-fretboard') {
                                                    const newCapo = Math.max(0, newShift);
                                                    if (measures && measures.length > 0) {
                                                        const allNotesValid = measures.every(m =>
                                                            m.notes.every(n =>
                                                                !n.positions.some(pos => {
                                                                    if (pos.avoid) return false;
                                                                    return (pos.fret + newCapo) > 24;
                                                                })
                                                            )
                                                        );
                                                        if (!allNotesValid) return;
                                                    }
                                                }

                                                onGlobalSettingsChange?.({
                                                    tuningShift: newShift,
                                                    capo: Math.max(0, newShift),
                                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                                });
                                            }}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                                        >-</button>
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

                                                if (animationType === 'guitar-fretboard') {
                                                    const newCapo = Math.max(0, newShift);
                                                    if (measures && measures.length > 0) {
                                                        const allNotesValid = measures.every(m =>
                                                            m.notes.every(n =>
                                                                !n.positions.some(pos => {
                                                                    if (pos.avoid) return false;
                                                                    return (pos.fret + newCapo) > 24;
                                                                })
                                                            )
                                                        );
                                                        if (!allNotesValid) return;
                                                    }
                                                }

                                                onGlobalSettingsChange?.({
                                                    tuningShift: newShift,
                                                    capo: Math.max(0, newShift),
                                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                                });
                                            }}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                                        >+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={onImportScore}
                                    className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-xs hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-4"
                                >
                                    ↓ Import Score
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </GenericSidebar>
    );
};

export default Sidebar;

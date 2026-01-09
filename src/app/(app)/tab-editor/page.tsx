
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Music2, Library, Settings, Palette } from "lucide-react";
import {
    MeasureData,
    NoteData,
    GlobalSettings,
    ScoreStyle,
    DEFAULT_SCORE_STYLE,
    Duration
} from '@/lib/tab-editor/types';
import { MobileNav, NavItem } from "@/components/shared/MobileNav";
import Sidebar from '@/components/tab-editor/Sidebar';
import StyleSidebar from '@/components/tab-editor/StyleSidebar';
import { AppHeader as StudioHeader } from '@/components/studio/app-header';
import { SettingsPanel } from '@/components/studio/SettingsPanel';
import ScorePreview, { ScorePreviewRef } from '@/components/tab-editor/ScorePreview';
import VisualEditor from '@/components/tab-editor/VisualEditor';
import { convertToVextab } from '@/lib/tab-editor/utils/vextabConverter';
import { importScoreFile } from '@/lib/tab-editor/utils/musicXmlParser';
import { Upload } from 'lucide-react';
import { VideoRenderSettingsModal, VideoRenderSettings } from '@/components/shared/VideoRenderSettingsModal';
import { RenderProgressModal } from '@/components/shared/RenderProgressModal';
import { MobileHeader } from '@/components/shared/MobileHeader';
import { MobilePlaybackControls } from '@/components/shared/MobilePlaybackControls';
import { StageContainer } from '@/components/shared/StageContainer';
import { UnifiedControls } from "@/components/shared/UnifiedControls";
import { WorkspaceLayout } from "@/components/shared/WorkspaceLayout";
import { EditorGrid } from "@/components/shared/EditorGrid";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';
import {
    getPitchFromMidi,
    NOTE_NAMES,
    getMidiFromPosition,
    findBestFretForPitch,
    getMidiFromPitch,
    getNoteDurationValue,
    getMeasureCapacity,
    decomposeValue
} from '@/lib/tab-editor/utils/musicMath';
import { useUndoRedo } from '@/hooks/use-undo-redo';

interface TabEditorState {
    measures: MeasureData[];
    settings: GlobalSettings;
    scoreStyle: ScoreStyle;
    selectedNoteIds: string[];
    editingNoteId: string | null;
    activePanel: 'studio' | 'library' | 'mixer' | 'customize';
    activeDuration: Duration;
    activePositionIndex: number;
    currentMeasureIndex: number;
    selectedMeasureId: string | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function TabEditorPage() {
    const [isImporting, setIsImporting] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const isMobile = useIsMobile();

    const editorNavItems: NavItem[] = [
        { id: "studio", icon: Music2, label: "Editor" },
        { id: "library", icon: Library, label: "Library" },
        { id: "customize", icon: Palette, label: "Customize" }
    ];

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [clipboard, setClipboard] = useState<MeasureData | null>(null);

    // Unified Undo/Redo State
    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<TabEditorState>({
        measures: [{
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), positions: [{ fret: '5', string: '3' }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), positions: [{ fret: '7', string: '3' }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
                { id: generateId(), positions: [{ fret: '9', string: '3' }], duration: 'q', type: 'note', decorators: {}, accidental: 'none' },
            ]
        }],
        settings: {
            clef: 'treble',
            key: 'C',
            time: '4/4',
            bpm: 120,
            showNotation: true,
            showTablature: true
        },
        scoreStyle: DEFAULT_SCORE_STYLE,
        selectedNoteIds: [],
        editingNoteId: null,
        activePanel: 'studio',
        activeDuration: 'q',
        activePositionIndex: 0,
        currentMeasureIndex: 0,
        selectedMeasureId: null
    });

    const {
        measures,
        settings,
        scoreStyle,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId
    } = state;

    // Helper setters to maintain compatibility without rewriting everything
    const setMeasures = (newMeasures: MeasureData[] | ((prev: MeasureData[]) => MeasureData[])) => {
        setState(prev => ({
            ...prev,
            measures: typeof newMeasures === 'function' ? newMeasures(prev.measures) : newMeasures
        }));
    };

    const setSettings = (newSettings: GlobalSettings | ((prev: GlobalSettings) => GlobalSettings)) => {
        setState(prev => ({
            ...prev,
            settings: typeof newSettings === 'function' ? newSettings(prev.settings) : newSettings
        }));
    };

    const setScoreStyle = (newStyle: ScoreStyle | ((prev: ScoreStyle) => ScoreStyle)) => {
        setState(prev => ({
            ...prev,
            scoreStyle: typeof newStyle === 'function' ? newStyle(prev.scoreStyle) : newStyle
        }));
    };

    const setSelectedNoteIds = (newIds: string[] | ((prev: string[]) => string[])) => {
        setState(prev => ({
            ...prev,
            selectedNoteIds: typeof newIds === 'function' ? newIds(prev.selectedNoteIds) : newIds
        }));
    };

    const setEditingNoteId = (newId: string | null) => {
        setState(prev => ({ ...prev, editingNoteId: newId }));
    };

    const setActivePanel = (panel: 'studio' | 'library' | 'mixer' | 'customize') => {
        setState(prev => ({ ...prev, activePanel: panel }));
    };

    const setActiveDuration = (duration: Duration) => {
        setState(prev => ({ ...prev, activeDuration: duration }));
    };

    const setActivePositionIndex = (index: number) => {
        setState(prev => ({ ...prev, activePositionIndex: index }));
    };

    const setCurrentMeasureIndex = (indexOrFn: number | ((prev: number) => number)) => {
        setState(prev => ({
            ...prev,
            currentMeasureIndex: typeof indexOrFn === 'function' ? indexOrFn(prev.currentMeasureIndex) : indexOrFn
        }));
    };

    // const [currentMeasureIndex, setCurrentMeasureIndex] = useState(0); // Removed local state
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [isLooping, setIsLooping] = useState(false);

    // Rendering State
    const scorePreviewRef = useRef<ScorePreviewRef>(null);
    const [showRenderSettings, setShowRenderSettings] = useState(false);
    const [renderState, setRenderState] = useState({
        isRendering: false,
        progress: 0,
        isComplete: false
    });
    const [renderSettings, setRenderSettings] = useState<VideoRenderSettings>({
        format: 'mp4',
        fps: 30,
        quality: 'medium'
    });

    const vextabCode = useMemo(() => convertToVextab(measures, settings, scoreStyle), [measures, settings, scoreStyle]);

    const editingNote = useMemo(() => {
        if (!editingNoteId) return null;
        for (const m of measures) {
            const found = m.notes.find(n => n.id === editingNoteId);
            if (found) return found;
        }
        return null;
    }, [editingNoteId, measures]);

    const currentPitch = useMemo(() => {
        if (!editingNote || editingNote.type === 'rest' || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(parseInt(pos.fret), parseInt(pos.string));
        return getPitchFromMidi(midi);
    }, [editingNote, activePositionIndex]);

    const activeMeasure = useMemo(() => {
        return measures.find(m => m.id === selectedMeasureId) || null;
    }, [measures, selectedMeasureId]);

    const displayMeasureInfo = useMemo(() => {
        const current = isPlaying || renderState.isRendering
            ? Math.min(Math.floor((playbackPosition / 100) * measures.length) + 1, measures.length)
            : currentMeasureIndex + 1;
        return { current, total: measures.length };
    }, [isPlaying, renderState.isRendering, playbackPosition, measures.length, currentMeasureIndex]);

    // previewData removed as per user request

    useEffect(() => {
        let interval: number;
        if (isPlaying) {
            const [num] = settings.time.split('/').map(Number);
            const beatDuration = 60 / settings.bpm;
            const measureDuration = beatDuration * num;
            const totalDuration = measures.length * measureDuration;

            const frameRate = 30;
            const increment = (100 / (totalDuration * (1000 / frameRate)));

            interval = window.setInterval(() => {
                setPlaybackPosition((prev) => {
                    if (prev >= 100) {
                        return isLooping ? 0 : 100;
                    }
                    return prev + increment;
                });
            }, frameRate);
        }
        return () => clearInterval(interval);
    }, [isPlaying, settings.bpm, settings.time, measures.length, isLooping]);

    // Cleanup and reset playback when it reaches the end
    useEffect(() => {
        if (isPlaying && playbackPosition >= 100 && !isLooping) {
            setIsPlaying(false);
            setPlaybackPosition(0);
        }
    }, [isPlaying, playbackPosition, isLooping]);

    const handleAddMeasure = () => {
        setState(prev => {
            const newMeasure: MeasureData = {
                id: generateId(),
                isCollapsed: false,
                showClef: false,
                showTimeSig: false,
                notes: []
            };
            const newMeasures = [...prev.measures, newMeasure];
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasures.length - 1,
                selectedMeasureId: newMeasure.id
            };
        });
    };

    const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleToggleCollapse = (measureId: string) => {
        setState(prev => ({
            ...prev,
            measures: prev.measures.map(m => m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m)
        }), { overwrite: true });
    };

    const handleCopyMeasure = (measureId: string) => {
        const measure = measures.find(m => m.id === measureId);
        if (measure) setClipboard(JSON.parse(JSON.stringify(measure)));
    };

    const handlePasteMeasure = () => {
        if (!clipboard) return;
        setState(prev => {
            const newMeasure: MeasureData = {
                ...clipboard,
                id: generateId(),
                isCollapsed: false,
                notes: clipboard.notes.map(n => ({ ...n, id: generateId() }))
            };
            const newMeasures = [...prev.measures, newMeasure];
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasures.length - 1, // Focus on pasted measure
                selectedMeasureId: newMeasure.id
            };
        });
    };

    const handleReorderMeasures = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        setState(prev => {
            const newMeasures = [...prev.measures];
            const [moved] = newMeasures.splice(fromIndex, 1);
            newMeasures.splice(toIndex, 0, moved);

            // If the currently viewed measure moved, update the index to follow it
            let newCurrentIndex = prev.currentMeasureIndex;
            if (prev.currentMeasureIndex === fromIndex) {
                newCurrentIndex = toIndex;
            } else if (fromIndex < prev.currentMeasureIndex && toIndex >= prev.currentMeasureIndex) {
                newCurrentIndex--;
            } else if (fromIndex > prev.currentMeasureIndex && toIndex <= prev.currentMeasureIndex) {
                newCurrentIndex++;
            }

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newCurrentIndex
            };
        });
    };

    const handleSelectMeasure = (id: string) => {
        setState(prev => {
            const isSame = prev.selectedMeasureId === id;
            const newSelectedId = isSame ? null : id;

            // Find index of the measure being selected (if any)
            const targetIndex = prev.measures.findIndex(m => m.id === id);

            // If selecting a new measure, update currentMeasureIndex
            // If deselecting, keep current index
            const newIndex = (targetIndex !== -1 && !isSame)
                ? targetIndex
                : prev.currentMeasureIndex;

            return {
                ...prev,
                selectedNoteIds: [],
                editingNoteId: null,
                selectedMeasureId: newSelectedId,
                currentMeasureIndex: newIndex
            };
        }, { overwrite: true });
    };

    const handleDeselectAll = () => {
        setState(prev => ({
            ...prev,
            selectedNoteIds: [],
            editingNoteId: null,
            selectedMeasureId: null
        }), { overwrite: true });
    };

    const handleRemoveNote = (noteId: string) => {
        setState(prev => {
            let targetMeasureIndex = prev.currentMeasureIndex;
            let targetMeasureId = prev.selectedMeasureId;

            const newMeasures = prev.measures.map((m, idx) => {
                const found = m.notes.some(n => n.id === noteId);
                if (found) {
                    targetMeasureIndex = idx;
                    targetMeasureId = m.id;
                    return {
                        ...m,
                        notes: m.notes.filter(n => n.id !== noteId)
                    };
                }
                return m;
            });

            return {
                ...prev,
                measures: newMeasures,
                selectedNoteIds: prev.selectedNoteIds.filter(id => id !== noteId),
                editingNoteId: prev.editingNoteId === noteId ? null : prev.editingNoteId,
                currentMeasureIndex: targetMeasureIndex,
                selectedMeasureId: targetMeasureId
            };
        });
    };

    const handleNoteRhythmChange = (noteId: string, newDuration?: Duration, newDot?: boolean) => {
        setState(prev => {
            const measureIndex = prev.measures.findIndex(m => m.notes.some(n => n.id === noteId));
            const targetMeasureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

            const newMeasures = prev.measures.map(m => {
                const noteIndex = m.notes.findIndex(n => n.id === noteId);
                if (noteIndex === -1) return m;

                const note = m.notes[noteIndex];
                const oldVal = getNoteDurationValue(note.duration, !!note.decorators.dot);
                const targetDuration = newDuration || note.duration;
                const targetDot = newDot !== undefined ? newDot : !!note.decorators.dot;
                const newVal = getNoteDurationValue(targetDuration, targetDot);

                let delta = newVal - oldVal;
                const newNotes = [...m.notes];

                newNotes[noteIndex] = {
                    ...note,
                    duration: targetDuration,
                    decorators: { ...note.decorators, dot: targetDot }
                };

                if (delta > 0) {
                    let remainingToCut = delta;
                    let i = noteIndex + 1;
                    while (remainingToCut > 0.001 && i < newNotes.length) {
                        const nextNote = newNotes[i];
                        const nextVal = getNoteDurationValue(nextNote.duration, !!nextNote.decorators.dot);

                        if (nextVal <= remainingToCut + 0.001) {
                            remainingToCut -= nextVal;
                            newNotes.splice(i, 1);
                        } else {
                            const targetNextVal = nextVal - remainingToCut;
                            const decomposed = decomposeValue(targetNextVal);
                            if (decomposed.length > 0) {
                                newNotes[i] = {
                                    ...nextNote,
                                    duration: decomposed[0].duration as Duration,
                                    decorators: { ...nextNote.decorators, dot: decomposed[0].dotted }
                                };
                                if (decomposed.length > 1) {
                                    const extraRests = decomposed.slice(1).map(d => ({
                                        id: generateId(),
                                        positions: [{ fret: '0', string: '1' }],
                                        duration: d.duration as Duration,
                                        type: 'rest' as const,
                                        decorators: { dot: d.dotted },
                                        accidental: 'none' as const
                                    }));
                                    newNotes.splice(i + 1, 0, ...extraRests);
                                }
                            }
                            remainingToCut = 0;
                        }
                    }
                } else if (delta < 0) {
                    const absDelta = Math.abs(delta);
                    const restsToAdd = decomposeValue(absDelta).map(d => ({
                        id: generateId(),
                        positions: [{ fret: '0', string: '1' }],
                        duration: d.duration as Duration,
                        type: 'rest' as const,
                        decorators: { dot: d.dotted },
                        accidental: 'none' as const
                    }));
                    newNotes.splice(noteIndex + 1, 0, ...restsToAdd);
                }

                const capacity = getMeasureCapacity(prev.settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
                        const spaceLeft = capacity - total;
                        if (spaceLeft >= 0.03125) {
                            const decomposed = decomposeValue(spaceLeft);
                            if (decomposed.length > 0) {
                                finalNotes.push({
                                    ...n,
                                    duration: decomposed[0].duration as Duration,
                                    decorators: { ...n.decorators, dot: decomposed[0].dotted }
                                });
                            }
                        }
                        break;
                    }
                }

                return { ...m, notes: finalNotes };
            });

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                selectedMeasureId: targetMeasureId || prev.selectedMeasureId
            };
        });
    };

    const handleAddNote = (measureId: string, durationOverride?: Duration) => {
        setState(prev => {
            const measureIndex = prev.measures.findIndex(m => m.id === measureId);
            if (measureIndex === -1) return prev; // Should not happen

            const measure = prev.measures[measureIndex];
            const durationToAdd = durationOverride || prev.activeDuration;

            const currentTotal = measure.notes.reduce((sum, n) => sum + getNoteDurationValue(n.duration, !!n.decorators.dot), 0);
            const capacity = getMeasureCapacity(prev.settings.time);
            const newNoteValue = getNoteDurationValue(durationToAdd, false);

            let newMeasures = [...prev.measures];
            let newMeasureFullIndex = measureIndex;
            let targetMeasureId = measureId;

            if (currentTotal + newNoteValue > capacity + 0.001) {
                // Overflow logic
                const newMeasureId = generateId();
                const newNote = {
                    id: generateId(),
                    positions: [{ fret: '0', string: '3' }],
                    duration: durationToAdd,
                    type: 'note' as const,
                    decorators: {},
                    accidental: 'none' as const
                };
                newMeasures.splice(measureIndex + 1, 0, {
                    id: newMeasureId,
                    isCollapsed: false,
                    showClef: false,
                    showTimeSig: false,
                    notes: [newNote]
                });
                newMeasureFullIndex = measureIndex + 1;
                targetMeasureId = newMeasureId;
            } else {
                newMeasures = prev.measures.map((m, idx) => {
                    if (idx === measureIndex) {
                        return {
                            ...m,
                            notes: [...m.notes, { id: generateId(), positions: [{ fret: '0', string: '3' }], duration: durationToAdd, type: 'note', decorators: {}, accidental: 'none' }]
                        };
                    }
                    return m;
                });
            }

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasureFullIndex,
                selectedMeasureId: targetMeasureId // Sync selection
            };
        });
    };

    const handleSelectNote = (id: string, multi: boolean) => {
        if (multi) {
            setState(prev => ({
                ...prev,
                selectedNoteIds: prev.selectedNoteIds.includes(id)
                    ? prev.selectedNoteIds.filter(i => i !== id)
                    : [...prev.selectedNoteIds, id]
            }), { overwrite: true });
        } else {
            // Updated to perform atomic update on state AND focus the measure
            setState(prev => {
                // Auto-focus the measure containing this note
                const measureIndex = prev.measures.findIndex(m => m.notes.some(n => n.id === id));
                const measureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

                return {
                    ...prev,
                    selectedNoteIds: [id],
                    editingNoteId: id,
                    activePositionIndex: 0,
                    currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                    selectedMeasureId: measureId
                };
            }, { overwrite: true });
        }
    };

    const updateSelectedNotes = (updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        // Warning: This simplistic updater uses 'setMeasures' which might bypass 'setState' for other fields
        // But since we need to update state atomically, let's rewrite it to use setState if possible, 
        // OR rely on it if it's just updating notes content.
        // However, updating note content usually doesn't change focus/selection unless we want it to.
        // The user specifically asked about "alterar uma nota" (altering a note).
        // If `updateSelectedNotes` is used for things like string/fret change, we should probably ensure proper state flow.
        // But for now, let's stick to strict replacement of the block requested.
        setMeasures(measures.map(m => ({
            ...m,
            notes: m.notes.map(n => {
                if (selectedNoteIds.includes(n.id) || n.id === editingNoteId) {
                    const resolvedUpdates = typeof updates === 'function' ? updates(n) : updates;
                    return { ...n, ...resolvedUpdates };
                }
                return n;
            })
        })));
    };

    const handlePitchChange = (newName?: string, newAccidental?: string, newOctave?: number) => {
        if (!editingNote || !currentPitch) return;
        const pitch = newName ?? currentPitch.name;
        const acc = newAccidental ?? currentPitch.accidental;
        const oct = newOctave ?? currentPitch.octave;
        const midi = getMidiFromPitch(pitch, acc, oct);
        const currentPos = editingNote.positions[activePositionIndex];
        const { fret, string } = findBestFretForPitch(midi, parseInt(currentPos.string));

        updateSelectedNotes(n => {
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { fret: fret.toString(), string: string.toString() };
            return { positions: newPositions };
        });
    };

    const handleStringChange = (newString: string) => {
        if (!editingNote || !editingNote.positions[activePositionIndex]) return;
        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = parseInt(currentPos.fret);
        const currentString = parseInt(currentPos.string);
        // Calculate current MIDI pitch
        const currentMidi = getMidiFromPosition(currentFret, currentString);

        const newStringNum = parseInt(newString);
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
        const openMidi = openStrings[newStringNum];

        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;
        if (newFret < 0) newFret = 0;

        updateSelectedNotes(n => {
            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { string: newString, fret: newFret.toString() };
            return { positions: newPositions };
        });
    };

    const handleInsert = (code: string) => {
        if (code.startsWith('clef=')) {
            const clefValue = code.split('=')[1] as any; // Allow 'tab' etc.

            let targetIndex = currentMeasureIndex;
            if (selectedNoteIds.length > 0) {
                const foundIndex = measures.findIndex(m => m.notes.some(n => selectedNoteIds.includes(n.id)));
                if (foundIndex !== -1) targetIndex = foundIndex;
            }

            setMeasures(prev => prev.map((m, idx) => {
                if (idx === targetIndex) {
                    return { ...m, clef: clefValue, showClef: true };
                }
                return m;
            }));
            return;
        }

        const transitions = ['s', 'h', 'p', 't', 'l'];

        // Robust Toggle Helper (Checkbox behavior)
        const updateTechniqueString = (current: string | undefined, newCode: string): string | undefined => {
            const currentStr = current || '';
            const charSet = new Set(currentStr.split(''));

            if (charSet.has(newCode)) {
                charSet.delete(newCode);
            } else {
                charSet.add(newCode);
            }

            const res = Array.from(charSet).join('');
            return res.length > 0 ? res : undefined;
        };

        // Combine selections to make sure Sidebar note is ALWAYS updated
        const targetIds = Array.from(new Set([...selectedNoteIds, ...(editingNoteId ? [editingNoteId] : [])]));
        if (targetIds.length === 0) return;

        // Case 1: Connect Two Notes (Transitions only)
        // If we have 2 notes selected AND we are inserting a transition code
        if (transitions.includes(code) && targetIds.length === 2) {
            let firstNote: NoteData | null = null;
            let secondNote: NoteData | null = null;

            for (const m of measures) {
                const found = m.notes.filter(n => targetIds.includes(n.id));
                if (found.length === 2) {
                    const idx0 = m.notes.findIndex(n => n.id === found[0].id);
                    const idx1 = m.notes.findIndex(n => n.id === found[1].id);
                    if (idx0 < idx1) {
                        firstNote = m.notes[idx0];
                        secondNote = m.notes[idx1];
                    } else {
                        firstNote = m.notes[idx1];
                        secondNote = m.notes[idx0];
                    }
                    break;
                }
            }

            if (firstNote && secondNote && firstNote.positions[0] && secondNote.positions[0] && firstNote.positions[0].string === secondNote.positions[0].string) {
                const targetId = secondNote.id;

                // Force UI to show Source Note
                setEditingNoteId(firstNote.id);

                setMeasures(prev => prev.map(m => ({
                    ...m,
                    notes: m.notes.map(n => {
                        if (n.id === firstNote!.id) {
                            const newTechnique = updateTechniqueString(n.technique, code);
                            const hasTransition = newTechnique && transitions.some(t => newTechnique.includes(t));

                            return {
                                ...n,
                                technique: newTechnique,
                                slideTargetId: hasTransition ? targetId : undefined
                            };
                        }
                        return n;
                    })
                })));
                return;
            }
        }

        // Case 2: General Multi/Single Selection Update
        setMeasures(prev => prev.map(m => ({
            ...m,
            notes: m.notes.map(n => {
                if (targetIds.includes(n.id)) {
                    const newTechnique = updateTechniqueString(n.technique, code);

                    let nextSlideTargetId = n.slideTargetId;
                    if (transitions.includes(code)) {
                        const hasAnyTransition = newTechnique && transitions.some(t => newTechnique.includes(t));
                        if (!hasAnyTransition) {
                            nextSlideTargetId = undefined;
                        }
                    }

                    return {
                        ...n,
                        technique: newTechnique,
                        slideTargetId: nextSlideTargetId
                    };
                }
                return n;
            })
        })));
    };

    const handleAddChordNote = () => {
        setState(prev => {
            // Logic duplicated from updateSelectedNotes but integrated
            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        // Add chord note logic
                        return {
                            ...n,
                            positions: [...n.positions, { fret: '0', string: (n.positions.length + 1).toString() }]
                        };
                    }
                    return n;
                })
            }));

            // Logic for index update
            const editingNote = prev.editingNoteId
                ? newMeasures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId)
                : null;

            const newIndex = editingNote ? editingNote.positions.length - 1 : 0; // The last one added

            return {
                ...prev,
                measures: newMeasures,
                activePositionIndex: newIndex // Set to the newly added position
            };
        });
    };

    const handleRemoveChordNote = (idx: number) => {
        setState(prev => {
            let newIndex = prev.activePositionIndex;

            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        if (n.positions.length <= 1) return n;
                        const newPositions = n.positions.filter((_, i) => i !== idx);

                        // Update index if needed logic (from original code)
                        if (newIndex >= newPositions.length) {
                            newIndex = Math.max(0, newPositions.length - 1);
                        }

                        return { ...n, positions: newPositions };
                    }
                    return n;
                })
            }));

            return {
                ...prev,
                measures: newMeasures,
                activePositionIndex: newIndex
            };
        });
    };

    const toggleVisibility = (type: 'notation' | 'tablature') => {
        setSettings(prev => {
            const next = { ...prev };
            if (type === 'notation') {
                // Only allow hiding if tablature is still visible
                if (!next.showNotation || next.showTablature) {
                    next.showNotation = !next.showNotation;
                }
            } else {
                // Only allow hiding if notation is still visible
                if (!next.showTablature || next.showNotation) {
                    next.showTablature = !next.showTablature;
                }
            }
            return next;
        });
    };

    const handleAccidentalChange = (accidental: string) => {
        updateSelectedNotes(n => {
            const desiredAccidental = (n.accidental === accidental ? 'none' : accidental) as any;
            const currentPos = n.positions[activePositionIndex];
            if (!currentPos) return {};

            const currentMidi = getMidiFromPosition(parseInt(currentPos.fret), parseInt(currentPos.string));
            const { name, octave } = getPitchFromMidi(currentMidi);

            // Calculate Natural MIDI for this pitch class/octave
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '#') offset = 1;
            else if (desiredAccidental === 'b') offset = -1;
            else if (desiredAccidental === 'none') {
                if (n.accidental === '#') offset = -1; // Remove sharp
                else if (n.accidental === 'b') offset = 1; // Remove flat
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, parseInt(currentPos.string));

            const newPositions = [...n.positions];
            newPositions[activePositionIndex] = { ...currentPos, fret: fret.toString() };

            return {
                accidental: desiredAccidental,
                positions: newPositions
            };
        });
    };

    const handleDecoratorChange = (decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];

            // Clean slate: start with only the dot if it exists
            const nextDecorators: any = {
                dot: n.decorators.dot
            };

            // Toggle logic: only set the new one if it wasn't already active
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }

            return {
                decorators: nextDecorators
            };
        });
    };

    const handleImportMusicXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const { measures: newMeasures, settings: newSettings } = await importScoreFile(file);

            // Atomic update for import
            setState(prev => ({
                ...prev,
                measures: newMeasures,
                settings: {
                    ...prev.settings,
                    bpm: newSettings.bpm,
                    time: newSettings.time
                },
                editingNoteId: null,
                selectedNoteIds: [],
                activePositionIndex: 0 // Reset focus
            }));

            toast({
                title: "Score Imported",
                description: `Successfully imported ${newMeasures.length} measures.`,
            });
        } catch (error) {
            console.error("Import error:", error);
            toast({
                title: "Import Failed",
                description: "Could not parse MusicXML file. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerImport = () => { // Add trigger function
        fileInputRef.current?.click();
    };

    const floatingControls = (
        <UnifiedControls
            isPlaying={isPlaying}
            isPaused={!isPlaying}
            isLooping={isLooping}
            onPlayPause={() => {
                if (!isPlaying && playbackPosition >= 100) {
                    setPlaybackPosition(0);
                }
                setIsPlaying(!isPlaying);
            }}
            onSkipBack={() => setPlaybackPosition(0)}
            onToggleLoop={() => setIsLooping(!isLooping)}
            onReset={() => { setIsPlaying(false); setPlaybackPosition(0); }}
            onRender={() => {
                if (renderState.isRendering) {
                    scorePreviewRef.current?.cancelRender();
                } else {
                    setShowRenderSettings(true);
                }
            }}
            isRendering={renderState.isRendering}
        // Removed leftExtra and rightExtra
        />
    );

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<StudioHeader />}
            mobileHeader={<MobileHeader title="Tab Editor" showBack={true} />}
            mobileBottomNav={<MobileNav items={editorNavItems} activePanel={activePanel} onPanelChange={setActivePanel} />}
            leftSidebar={
                <Sidebar
                    onInsert={handleInsert}
                    onAddNote={handleAddNote}
                    onUpdateNote={(updates) => updateSelectedNotes(updates)}
                    activeDuration={activeDuration}
                    onSelectDuration={setActiveDuration}
                    editingNote={editingNote}
                    currentPitch={currentPitch}
                    onCloseInspector={() => setEditingNoteId(null)}
                    onNoteRhythmChange={(d, dot) => editingNote && handleNoteRhythmChange(editingNote.id, d, dot)}
                    onNoteTypeChange={(type) => updateSelectedNotes({ type })}
                    onPitchChange={handlePitchChange}
                    onStringChange={handleStringChange}
                    onAccidentalChange={handleAccidentalChange}
                    onDecoratorChange={handleDecoratorChange}
                    activeMeasure={activeMeasure}
                    onMeasureUpdate={handleUpdateMeasure}
                    activePositionIndex={activePositionIndex}
                    onActivePositionIndexChange={setActivePositionIndex}
                    onAddChordNote={handleAddChordNote}
                    onRemoveChordNote={handleRemoveChordNote}
                    globalSettings={settings}
                    onGlobalSettingsChange={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
                    onImportScore={triggerImport}
                    isMobile={isMobile}
                    isOpen={activePanel === 'library'}
                    onClose={() => setActivePanel('studio')}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                />
            }
            rightSidebar={
                <StyleSidebar
                    style={scoreStyle}
                    onChange={(up: Partial<ScoreStyle>) => setScoreStyle({ ...scoreStyle, ...up })}
                    onReset={() => setScoreStyle(DEFAULT_SCORE_STYLE)}
                    isMobile={isMobile}
                    isOpen={activePanel === 'customize'}
                    onClose={() => setActivePanel('studio')}
                />
            }
        >
            {isMobile ? (
                <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    {/* Blur effect background */}
                    <div className="absolute w-full h-full max-w-sm bg-primary-mobile/10 blur-[60px] rounded-full pointer-events-none" />

                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        {/* Score Preview Container */}
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <StageContainer title="Score Preview" aspectRatio="aspect-[800/340]" background={scoreStyle.background}>
                                <ScorePreview
                                    ref={scorePreviewRef}
                                    measures={measures}
                                    playbackPosition={playbackPosition}
                                    isPlaying={isPlaying}
                                    style={scoreStyle}
                                    clef={settings.clef}
                                    keySignature={settings.key}
                                    showNotation={settings.showNotation}
                                    showTablature={settings.showTablature}
                                    onMeasuresChange={setMeasures}
                                    selectedNoteIds={selectedNoteIds}
                                    onSelectNote={handleSelectNote}
                                    onDoubleClickNote={(id) => setEditingNoteId(id)}
                                    currentMeasureIndex={currentMeasureIndex}
                                    onPlaybackControl={setIsPlaying}
                                    onPlaybackPositionChange={setPlaybackPosition}
                                    onToggleVisibility={toggleVisibility}
                                    onRenderStateChange={setRenderState}
                                    code={vextabCode}
                                    timeSignature={settings.time}
                                />
                                <div className="absolute top-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10 shadow-lg transform translate-y-[-150%] group-hover:translate-y-0 transition-transform duration-300">
                                    {settings.key} {settings.clef}
                                </div>
                            </StageContainer>
                        </div>

                        {/* Compact Playback Controls (asd.html style) */}
                        <div className="flex justify-center w-full mb-4">
                            <MobilePlaybackControls
                                isPlaying={isPlaying}
                                isLooping={isLooping}
                                currentMeasure={displayMeasureInfo.current}
                                totalMeasures={displayMeasureInfo.total}
                                onPlayPause={() => {
                                    if (!isPlaying && playbackPosition >= 100) {
                                        setPlaybackPosition(0);
                                    }
                                    setIsPlaying(!isPlaying);
                                }}
                                onSkipBack={() => setPlaybackPosition(0)}
                                onToggleLoop={() => setIsLooping(!isLooping)}
                                onStop={() => { setIsPlaying(false); setPlaybackPosition(0); }}
                            />
                        </div>

                        {/* Timeline (VisualEditor) */}
                        <div className="mb-4">
                            <VisualEditor
                                measures={measures}
                                selectedNoteIds={selectedNoteIds}
                                timeSignature={settings.time}
                                activeDuration={activeDuration}
                                hasClipboard={!!clipboard}
                                onSelectNote={handleSelectNote}
                                onDoubleClickNote={(id) => setEditingNoteId(id)}
                                onAddNote={handleAddNote}
                                onUpdateNote={(id, updates) => updateSelectedNotes(updates)}
                                onRemoveMeasure={(id) => setMeasures(measures.filter(m => m.id !== id))}
                                onAddMeasure={handleAddMeasure}
                                onUpdateMeasure={handleUpdateMeasure}
                                onToggleCollapse={handleToggleCollapse}
                                onCopyMeasure={handleCopyMeasure}
                                onPasteMeasure={handlePasteMeasure}
                                onReorderMeasures={handleReorderMeasures}
                                onRemoveNote={handleRemoveNote}
                                onSelectMeasure={handleSelectMeasure}
                                selectedMeasureId={selectedMeasureId}
                                onDeselectAll={handleDeselectAll}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <EditorGrid
                    topSection={
                        <StageContainer title="Score Preview" aspectRatio="aspect-[800/340]" background={scoreStyle.background}>
                            <ScorePreview
                                ref={scorePreviewRef}
                                measures={measures}
                                playbackPosition={playbackPosition}
                                isPlaying={isPlaying}
                                style={scoreStyle}
                                clef={settings.clef}
                                keySignature={settings.key}
                                showNotation={settings.showNotation}
                                showTablature={settings.showTablature}
                                onMeasuresChange={setMeasures}
                                selectedNoteIds={selectedNoteIds}
                                onSelectNote={handleSelectNote}
                                onDoubleClickNote={(id) => setEditingNoteId(id)}
                                currentMeasureIndex={currentMeasureIndex}
                                onPlaybackControl={setIsPlaying}
                                onPlaybackPositionChange={setPlaybackPosition}
                                onToggleVisibility={toggleVisibility}
                                onRenderStateChange={setRenderState}
                                code={vextabCode}
                                timeSignature={settings.time}
                            />
                        </StageContainer>
                    }
                    bottomSection={
                        <VisualEditor
                            measures={measures}
                            selectedNoteIds={selectedNoteIds}
                            timeSignature={settings.time}
                            activeDuration={activeDuration}
                            onSelectNote={handleSelectNote}
                            onDoubleClickNote={(id) => setEditingNoteId(id)}
                            onAddNote={handleAddNote}
                            onUpdateNote={(id, up) => updateSelectedNotes(up)}
                            onRemoveMeasure={(id) => setMeasures(measures.filter(m => m.id !== id))}
                            onAddMeasure={handleAddMeasure}
                            onUpdateMeasure={handleUpdateMeasure}
                            onToggleCollapse={handleToggleCollapse}
                            onCopyMeasure={handleCopyMeasure}
                            onPasteMeasure={handlePasteMeasure}
                            onReorderMeasures={handleReorderMeasures}
                            onRemoveNote={handleRemoveNote}
                            hasClipboard={!!clipboard}
                            onSelectMeasure={handleSelectMeasure}
                            selectedMeasureId={selectedMeasureId}
                            onDeselectAll={handleDeselectAll}
                        />
                    }
                    floatingControls={floatingControls}
                />
            )}

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportMusicXML}
                accept=".musicxml,.xml,.mxl,.mscz"
                className="hidden"
            />

            <VideoRenderSettingsModal
                isOpen={showRenderSettings}
                settings={renderSettings}
                onClose={() => setShowRenderSettings(false)}
                onRender={(settings: VideoRenderSettings) => {
                    setRenderSettings(settings);
                    setShowRenderSettings(false);
                    scorePreviewRef.current?.startRender(settings);
                }}
            />

            <RenderProgressModal
                isOpen={renderState.isRendering}
                isComplete={renderState.isComplete}
                progress={renderState.progress}
                onClose={() => setRenderState(prev => ({ ...prev, isRendering: false }))}
            />
        </WorkspaceLayout>
    );
}

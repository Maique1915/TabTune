
import { useState, useMemo } from 'react';
import { MeasureData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration, NoteData } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { useUndoRedo } from '@/modules/editor/presentation/hooks/use-undo-redo';
import { DEFAULT_COLORS } from '@/modules/editor/presentation/constants';
import { deepCloneNote, deepCloneMeasure } from '@/modules/editor/domain/clone-utils';
import {
    getNoteDurationValue,
    getMeasureCapacity,
    decomposeValue,
    getMidiFromPosition,
    getPitchFromMidi,
    findBestFretForPitch,
    getMidiFromPitch,
    NOTE_NAMES,
    transposeChordName
} from '@/modules/editor/domain/music-math';

interface FretboardEditorState {
    measures: MeasureData[];
    settings: GlobalSettings;
    scoreStyle: ScoreStyle;
    theme: FretboardTheme;
    selectedNoteIds: string[];
    editingNoteId: string | null;
    activePanel: 'studio' | 'library' | 'mixer' | 'customize';
    activeDuration: Duration;
    activePositionIndex: number;
    currentMeasureIndex: number;
    selectedMeasureId: string | null;
    copiedMeasure: MeasureData | null; // For copy/paste functionality
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useStudioChordsEditor() {
    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<FretboardEditorState>({
        measures: [{
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), positions: [], duration: 'q', type: 'note', decorators: { dot: false }, accidental: 'none' }
            ]
        }],
        settings: {
            clef: 'tab' as const,
            key: 'C',
            time: '4/4',
            bpm: 120,
            showNotation: true,
            showTablature: true,
            instrumentId: 'violao',
            tuningIndex: 0,
            capo: 0,
            tuningShift: 0,
            numFrets: 24
        },
        scoreStyle: DEFAULT_SCORE_STYLE,
        theme: DEFAULT_COLORS,
        selectedNoteIds: [],
        editingNoteId: null,
        activePanel: 'studio',
        activeDuration: 'q',
        activePositionIndex: 0,
        currentMeasureIndex: 0,
        selectedMeasureId: null,
        copiedMeasure: null
    });

    const {
        measures,
        settings,
        scoreStyle,
        theme,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId
    } = state;



    // --- Helpers ---



    const handleToggleBarre = (indices?: number[]) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));

            // If explicit indices provided, this is a bit complex in the new model.
            // But usually this means "these strings are part of one finger shift".
            // For now, let's just implement the Toggle OFF logic for the active position.
            const pos = newPositions[activePositionIndex];
            if (!pos) return {};

            if (pos.endString && pos.endString !== pos.string) {
                newPositions[activePositionIndex] = { ...pos, endString: undefined };
            }

            return { positions: newPositions };
        });
    };

    const handleToggleBarreTo = (targetString: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            const pos = newPositions[activePositionIndex];
            if (!pos) return {};

            // If we already have a barre to this targetString, toggle it off (to single note)
            if (pos.endString === targetString) {
                newPositions[activePositionIndex] = { ...pos, endString: undefined };
            } else {
                // Otherwise create/update it
                newPositions[activePositionIndex] = {
                    ...pos,
                    endString: targetString
                };
            }

            return { positions: newPositions };
        });
    };

    const setMeasures = (newMeasures: MeasureData[] | ((prev: MeasureData[]) => MeasureData[])) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            measures: typeof newMeasures === 'function' ? newMeasures(prev.measures) : newMeasures
        }));
    };

    const setSettings = (newSettings: GlobalSettings | ((prev: GlobalSettings) => GlobalSettings)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            settings: typeof newSettings === 'function' ? newSettings(prev.settings) : newSettings
        }));
    };

    const setScoreStyle = (newStyle: ScoreStyle | ((prev: ScoreStyle) => ScoreStyle)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            scoreStyle: typeof newStyle === 'function' ? newStyle(prev.scoreStyle) : newStyle
        }));
    };

    const setTheme = (newTheme: FretboardTheme | ((prev: FretboardTheme) => FretboardTheme)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            theme: typeof newTheme === 'function' ? newTheme(prev.theme) : newTheme
        }));
    };

    const setActiveDuration = (duration: Duration) => {
        setState((prev: FretboardEditorState) => ({ ...prev, activeDuration: duration }));
    };

    const setEditingNoteId = (id: string | null) => {
        setState((prev: FretboardEditorState) => ({ ...prev, editingNoteId: id }));
    };

    const setActivePanel = (panel: 'studio' | 'library' | 'mixer' | 'customize') => {
        setState((prev: FretboardEditorState) => ({ ...prev, activePanel: panel }));
    };

    const setActivePositionIndex = (index: number) => {
        setState((prev: FretboardEditorState) => ({ ...prev, activePositionIndex: index }));
    };

    // --- Derived State Helpers (Internal) ---
    const getEditingNote = () => {
        if (!editingNoteId) return null;
        for (const m of measures) {
            const found = m.notes.find(n => n.id === editingNoteId);
            if (found) return found;
        }
        return null;
    };

    const getCurrentPitch = () => {
        const editingNote = getEditingNote();
        if (!editingNote || editingNote.type === 'rest' || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(pos.fret, pos.string);
        return getPitchFromMidi(midi);
    };

    const getActiveMeasure = () => {
        return measures.find(m => m.id === selectedMeasureId) || null;
    };

    // --- Advanced Selection/Update Logic ---

    const handleSelectMeasure = (id: string) => {
        setState((prev: FretboardEditorState) => {
            const isSame = prev.selectedMeasureId === id;
            const newSelectedId = isSame ? null : id;
            const targetIndex = prev.measures.findIndex((m: MeasureData) => m.id === id);
            const newIndex = (targetIndex !== -1 && !isSame) ? targetIndex : prev.currentMeasureIndex;

            return {
                ...prev,
                selectedNoteIds: [],
                editingNoteId: null,
                selectedMeasureId: newSelectedId,
                currentMeasureIndex: newIndex
            };
        }, { overwrite: true });
    };

    const handleSelectNote = (id: string, multi: boolean) => {
        if (multi) {
            setState((prev: FretboardEditorState) => ({
                ...prev,
                selectedNoteIds: prev.selectedNoteIds.includes(id)
                    ? prev.selectedNoteIds.filter((i: string) => i !== id)
                    : [...prev.selectedNoteIds, id]
            }), { overwrite: true });
        } else {
            setState((prev: FretboardEditorState) => {
                // Find measure for this note
                const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === id));
                const measureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

                return {
                    ...prev,
                    selectedNoteIds: [id],
                    editingNoteId: id,
                    activePositionIndex: 0,
                    // Auto-select measure (Unified UI)
                    currentMeasureIndex: measureIndex !== -1 ? measureIndex : prev.currentMeasureIndex,
                    selectedMeasureId: measureId
                };
            }, { overwrite: true });
        }
    };

    const updateSelectedNotes = (updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        const resolved = typeof updates === 'function' ? updates(n) : updates;
                        return { ...n, ...resolved };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    };


    // --- Core Actions (Add/Remove) ---

    // Simplified Note Addition - No time limit
    const handleAddNote = (measureId: string, durationOverride?: Duration) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const durationToAdd = durationOverride || prev.activeDuration;
            const newNoteId = generateId();

            // Always add to current measure, no capacity check
            const newMeasures = prev.measures.map((m: MeasureData, idx: number) => {
                if (idx === measureIndex) {
                    return {
                        ...m,
                        notes: [...m.notes, {
                            id: newNoteId,
                            positions: [{ fret: 1, string: 3 }],
                            duration: durationToAdd,
                            type: 'note' as const,
                            decorators: {},
                            accidental: 'none' as const
                        }]
                    };
                }
                return m;
            });

            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: measureIndex,
                selectedMeasureId: measureId,
                editingNoteId: newNoteId,
                selectedNoteIds: [newNoteId],
                activePositionIndex: 0
            };
        });
    };



    const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleAddMeasure = () => {
        setState((prev: FretboardEditorState) => {
            const newMeasure: MeasureData = {
                id: generateId(),
                isCollapsed: false,
                showClef: false,
                showTimeSig: false,
                notes: [
                    // Default Note (C4, Quarter Note)
                    {
                        id: generateId(),
                        duration: 'q',
                        type: 'note',
                        decorators: { dot: false },
                        positions: [],
                        technique: '',
                        isSlurred: false
                    }
                ]
            };
            const newMeasures = [...prev.measures, newMeasure];
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasures.length - 1,
                selectedMeasureId: newMeasure.id,
                // Update selected note to the new one
                selectedNoteIds: [newMeasure.notes[0].id],
                editingNoteId: newMeasure.notes[0].id
            };
        });
    };

    const handleRemoveMeasure = (id: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.filter((m: MeasureData) => m.id !== id);
            if (newMeasures.length === 0) {
                const initial: MeasureData = { id: generateId(), isCollapsed: false, showClef: true, showTimeSig: true, notes: [] };
                return { ...prev, measures: [initial], currentMeasureIndex: 0, selectedMeasureId: initial.id };
            }
            const newIndex = Math.min(prev.currentMeasureIndex, newMeasures.length - 1);
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newIndex,
                selectedMeasureId: newMeasures[newIndex].id
            };
        });
    };


    // --- Advanced Editing Handlers (Sidebar Support) ---

    const handleNoteRhythmChange = (noteId: string, newDuration?: Duration, newDot?: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === noteId));
            const targetMeasureId = measureIndex !== -1 ? prev.measures[measureIndex].id : prev.selectedMeasureId;

            const newMeasures = prev.measures.map((m: MeasureData) => {
                const noteIndex = m.notes.findIndex((n: NoteData) => n.id === noteId);
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
                                        positions: [{ fret: 0, string: 1 }],
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
                        positions: [{ fret: 0, string: 1 }],
                        duration: d.duration as Duration,
                        type: 'rest' as const,
                        decorators: { dot: d.dotted },
                        accidental: 'none' as const
                    }));
                    newNotes.splice(noteIndex + 1, 0, ...restsToAdd);
                }

                // Capacity check / Truncate (Simplified for brevity)
                const capacity = getMeasureCapacity(prev.settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
                        // Overflow handling omitted for now, just truncate
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

    /**
     * Simple duration change for Chord Sequence mode.
     * Does NOT add/remove rests to maintain measure duration.
     */
    const handleNoteDurationStatic = (noteId: string, newDuration: Duration) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === noteId) {
                        return { ...n, duration: newDuration };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    };

    const handleRemoveNote = (noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.filter((n: NoteData) => n.id !== noteId)
            }));
            return { ...prev, measures: newMeasures };
        });
    };

    const handleCopyNote = (noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => {
                const noteIndex = m.notes.findIndex((n: NoteData) => n.id === noteId);
                if (noteIndex === -1) return m;

                const noteToCopy = m.notes[noteIndex];
                const newNote = deepCloneNote(noteToCopy, true);
                const newNotes = [...m.notes];
                newNotes.splice(noteIndex + 1, 0, newNote);
                return { ...m, notes: newNotes };
            });
            return { ...prev, measures: newMeasures };
        });
    };

    const handlePitchChange = (newName?: string, newAccidental?: string, newOctave?: number) => {
        const editingNote = getEditingNote();
        const currentPitch = getCurrentPitch();
        if (!editingNote || !currentPitch) return;

        const pitch = newName ?? currentPitch.name;
        const acc = newAccidental ?? currentPitch.accidental;
        const oct = newOctave ?? currentPitch.octave;
        const midi = getMidiFromPitch(pitch, acc, oct);
        const currentPos = editingNote.positions[activePositionIndex];
        const { fret, string } = findBestFretForPitch(midi, currentPos.string);

        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex] = { fret: fret, string: string };
            return { positions: newPositions };
        });
    };

    const handleStringChange = (newString: number) => {
        const editingNote = getEditingNote();
        if (!editingNote || !editingNote.positions[activePositionIndex]) return;

        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = currentPos.fret;
        const currentMidi = getMidiFromPosition(currentFret, currentPos.string);

        const newStringNum = newString;
        // Standard Tuning
        const openStrings: Record<number, number> = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
        const openMidi = openStrings[newStringNum];
        if (openMidi === undefined) return;

        let newFret = currentMidi - openMidi;
        if (newFret < 0) newFret = 0;

        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex] = { string: newString, fret: newFret };
            return { positions: newPositions };
        });
    };

    const handleAccidentalChange = (accidental: string) => {
        updateSelectedNotes(n => {
            const desiredAccidental = (n.accidental === accidental ? 'none' : accidental) as any;
            const currentPos = n.positions[activePositionIndex];
            if (!currentPos) return {};

            const currentMidi = getMidiFromPosition(currentPos.fret, currentPos.string);
            const { name, octave } = getPitchFromMidi(currentMidi);
            const baseIndex = NOTE_NAMES.indexOf(name);
            const naturalMidi = (octave + 1) * 12 + baseIndex;

            let offset = 0;
            if (desiredAccidental === '♯') offset = 1;
            else if (desiredAccidental === '♭') offset = -1;
            else if (desiredAccidental === 'none') {
                if (n.accidental === '♯') offset = -1;
                else if (n.accidental === '♭') offset = 1;
            }

            const newMidi = naturalMidi + offset;
            const { fret } = findBestFretForPitch(newMidi, currentPos.string);
            const newPositions = n.positions.map(p => ({ ...p }));
            newPositions[activePositionIndex] = { ...currentPos, fret: fret };

            return {
                accidental: desiredAccidental,
                positions: newPositions
            };
        });
    };

    const handleDecoratorChange = (decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];
            const nextDecorators: any = { dot: n.decorators.dot };
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }
            return { decorators: nextDecorators };
        });
    };

    const handleSetFingerForString = (idx: number, finger: number | string | undefined) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};

            if (finger === 'X') {
                newPositions[idx] = { ...newPositions[idx], avoid: true, finger: undefined };
            } else {
                newPositions[idx] = { ...newPositions[idx], avoid: false, finger: finger };
            }
            return { positions: newPositions };
        });
    };

    const handleSetFretForString = (idx: number, fret: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};
            newPositions[idx] = { ...newPositions[idx], fret, avoid: false };
            return { positions: newPositions };
        });
    };

    const handleSetStringForPosition = (idx: number, stringNum: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};
            newPositions[idx] = { ...newPositions[idx], string: stringNum };
            return { positions: newPositions };
        });
    };

    const handleSelectStringAndAddIfMissing = (stringNum: number) => {
        setState((prev: FretboardEditorState) => {
            const editingNote = prev.editingNoteId
                ? prev.measures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId)
                : null;

            if (!editingNote) return prev;

            const existingIdx = editingNote.positions.findIndex(p => p.string === stringNum);
            if (existingIdx !== -1) {
                return { ...prev, activePositionIndex: existingIdx };
            }

            // Not found, add it
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === prev.editingNoteId) {
                        return {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: stringNum }]
                        };
                    }
                    return n;
                })
            }));

            // Re-find to get new index
            const updatedNote = newMeasures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId);
            const newIdx = updatedNote ? updatedNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIdx };
        });
    };

    const handleInsert = (code: string) => {
        if (code.startsWith('clef=')) {
            const clefValue = code.split('=')[1] as any;
            let targetIndex = currentMeasureIndex;
            if (selectedNoteIds.length > 0) {
                const foundIndex = measures.findIndex(m => m.notes.some(n => selectedNoteIds.includes(n.id)));
                if (foundIndex !== -1) targetIndex = foundIndex;
            }
            setMeasures(prev => prev.map((m, idx) => {
                if (idx === targetIndex) return { ...m, clef: clefValue, showClef: true };
                return m;
            }));
            return;
        }

        if (['s', 'h', 'p', 'b', 't', 'l'].includes(code) && selectedNoteIds.length === 2) {
            // Technique between two notes (Simplistic find)
            setMeasures(prev => prev.map(m => ({
                ...m,
                notes: m.notes.map(n => {
                    if (selectedNoteIds.includes(n.id) && selectedNoteIds.indexOf(n.id) === 0) {
                        return {
                            ...n,
                            technique: n.technique === code ? undefined : code,
                            slideTargetId: n.technique === code ? undefined : selectedNoteIds[1] // Assuming simple logic
                        };
                    }
                    return n;
                })
            })));
            return;
        }


        // Single Note Technique
        if (selectedNoteIds.length > 0) {
            updateSelectedNotes(n => ({
                technique: n.technique === code ? undefined : code,
                slideTargetId: n.technique === code ? undefined : n.slideTargetId
            }));
        }
    };

    const handleAddChordNote = () => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        const updatedNote = {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: (n.positions.length + 1) }]
                        };
                        return updatedNote;
                    }
                    return n;
                })
            }));

            const editingNote = prev.editingNoteId
                ? newMeasures.flatMap((m: MeasureData) => m.notes).find((n: NoteData) => n.id === prev.editingNoteId)
                : null;
            const newIndex = editingNote ? editingNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    const handleRemoveChordNote = (idx: number) => {
        setState((prev: FretboardEditorState) => {
            let newIndex = prev.activePositionIndex;
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId) {
                        if (n.positions.length <= 1) return n;
                        const newPositions = n.positions.filter((_: any, i: number) => i !== idx);
                        if (newIndex >= newPositions.length) newIndex = Math.max(0, newPositions.length - 1);

                        return { ...n, positions: newPositions };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    const handleTransposeMeasure = (measureId: string, semitones: number, smartTranspose?: boolean) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const measure = prev.measures[measureIndex];

            // Determine selection mode:
            // 1. If selectedNoteIds is not empty OR there is an editingNoteId, it's Selective Mode.
            // 2. Otherwise, it's Global Mode (transposes everything).
            const selectedInMeasure = measure.notes.filter(n => prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId);
            const isSelectiveMode = selectedInMeasure.length > 0;
            const targetNotes = isSelectiveMode ? selectedInMeasure : measure.notes;

            // Bounds check for all notes that will be shifted
            const wouldGoOutOfBounds = targetNotes.some((note: NoteData) =>
                note.positions.some((pos: any) => {
                    if (pos.avoid) return false; // Ignore avoided strings in bounds check
                    const newFret = pos.fret + semitones;
                    return newFret < 0 || newFret > 24;
                })
            );

            if (wouldGoOutOfBounds) return prev;

            const targetIds = targetNotes.map(n => n.id);

            // Analysis for Smart Transpose (Before Transposition)
            let isStartingOpen = false;
            if (smartTranspose) {
                const allFrets = targetNotes.flatMap(n => n.positions.filter((p: any) => !p.avoid).map((p: any) => p.fret));
                if (allFrets.length > 0) {
                    const minFret = Math.min(...allFrets);
                    isStartingOpen = minFret === 0;
                }
            }

            const transposedNotes = measure.notes.map((note: NoteData) => {
                if (targetIds.includes(note.id)) {
                    let newPositions = note.positions.map((pos: any) => {
                        if (pos.avoid) return pos; // Don't shift avoided strings
                        return {
                            ...pos,
                            fret: pos.fret + semitones
                        };
                    });

                    // Smart Transpose Logic (After Transposition Calculation)
                    if (smartTranspose) {
                        const allNewFrets = newPositions.filter((p: any) => !p.avoid).map((p: any) => p.fret);
                        if (allNewFrets.length > 0) {
                            const newMinFret = Math.min(...allNewFrets);
                            const isEndingOpen = newMinFret === 0;

                            // Case 1: Open -> Barre (Shift Fingers Up)
                            if (isStartingOpen && !isEndingOpen) {
                                newPositions = newPositions.map((p: any) => {
                                    if (p.avoid) return p;
                                    let newFinger = p.finger;
                                    if (typeof p.finger === 'number') {
                                        newFinger = p.finger + 1;
                                    }
                                    // If this position is at the 'barre' fret (min fret), force finger 1 if not set
                                    if (p.fret === newMinFret && !newFinger) {
                                        newFinger = 1;
                                    }
                                    return { ...p, finger: newFinger };
                                });
                            }
                            // Case 2: Barre -> Open (Shift Fingers Down)
                            else if (!isStartingOpen && isEndingOpen) {
                                newPositions = newPositions.map((p: any) => {
                                    if (p.avoid) return p;
                                    let newFinger = p.finger;
                                    // If open string, remove finger
                                    if (p.fret === 0) {
                                        newFinger = undefined;
                                    } else if (typeof p.finger === 'number') {
                                        newFinger = Math.max(1, p.finger - 1);
                                    }
                                    return { ...p, finger: newFinger };
                                });
                            }
                        }
                    }

                    return {
                        ...note,
                        positions: newPositions,
                        barre: undefined
                    };
                }
                return note;
            });

            // Transpose chord name if Global Mode OR Smart Transpose is active
            const newChordName = (!isSelectiveMode || smartTranspose)
                ? transposeChordName(measure.chordName, semitones)
                : measure.chordName;

            const newMeasures = prev.measures.map((m: MeasureData, idx: number) =>
                idx === measureIndex
                    ? { ...m, notes: transposedNotes, chordName: newChordName }
                    : m
            );

            return {
                ...prev,
                measures: newMeasures
            };
        });
    };

    const handleTransposeAll = (semitones: number) => {
        setState((prev: FretboardEditorState) => {
            // Check bounds for ALL notes in ALL measures
            const wouldGoOutOfBounds = prev.measures.some((measure: MeasureData) =>
                measure.notes.some((note: NoteData) =>
                    note.positions.some((pos: any) => {
                        if (pos.avoid) return false;
                        const newFret = pos.fret + semitones;
                        return newFret < 0 || newFret > 24;
                    })
                )
            );

            if (wouldGoOutOfBounds) return prev;

            const newMeasures = prev.measures.map((measure: MeasureData) => {
                const transposedNotes = measure.notes.map((note: NoteData) => {
                    // Adjust barre if it exists
                    let newBarre = note.barre;
                    if (newBarre) {
                        newBarre = {
                            ...newBarre,
                            fret: newBarre.fret + semitones
                        };
                    }

                    return {
                        ...note,
                        positions: note.positions.map((pos: any) => {
                            if (pos.avoid) return pos;
                            return {
                                ...pos,
                                fret: pos.fret + semitones
                            };
                        }),
                        barre: newBarre
                    };
                });

                const newName = transposeChordName(measure.chordName, semitones);
                return { ...measure, notes: transposedNotes, chordName: newName };
            });

            return {
                ...prev,
                measures: newMeasures
            };
        });
    };

    return {
        // State
        measures,
        settings,
        scoreStyle,
        selectedNoteIds,
        editingNoteId,
        activePanel,
        activeDuration,
        activePositionIndex,
        currentMeasureIndex,
        selectedMeasureId,

        editingNote: getEditingNote(),
        currentPitch: getCurrentPitch(),
        activeMeasure: getActiveMeasure(),

        // Actions
        setSettings,
        setMeasures,
        setScoreStyle,
        setActiveDuration,
        setActivePanel,
        setEditingNoteId,
        setActivePositionIndex,

        handleSelectMeasure,
        handleSelectNote,
        handleAddNote,

        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,

        // Toggle Collapse
        handleToggleCollapse: (measureId: string) => {
            setState((prev: FretboardEditorState) => ({
                ...prev,
                measures: prev.measures.map((m: MeasureData) =>
                    m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m
                )
            }));
        },

        // Reorder Measures
        handleReorderMeasures: (fromIndex: number, toIndex: number) => {
            setState((prev: FretboardEditorState) => {
                const newMeasures = [...prev.measures];
                const [movedMeasure] = newMeasures.splice(fromIndex, 1);
                newMeasures.splice(toIndex, 0, movedMeasure);
                return {
                    ...prev,
                    measures: newMeasures
                };
            });
        },

        // Reorder Notes within a Measure
        handleReorderNotes: (measureId: string, fromIndex: number, toIndex: number) => {
            setState((prev: FretboardEditorState) => {
                const measureIndex = prev.measures.findIndex(m => m.id === measureId);
                if (measureIndex === -1) return prev;

                const newMeasures = [...prev.measures];
                const measure = newMeasures[measureIndex];
                const newNotes = [...measure.notes];

                // Remove from source
                const [movedNote] = newNotes.splice(fromIndex, 1);

                // Insert at destination
                newNotes.splice(toIndex, 0, movedNote);

                newMeasures[measureIndex] = {
                    ...measure,
                    notes: newNotes
                };

                return {
                    ...prev,
                    measures: newMeasures
                };
            });
        },

        // Copy Measure (duplicates and adds right after the source)
        handleCopyMeasure: (measureId: string) => {
            setState((prev: FretboardEditorState) => {
                const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
                if (measureIndex === -1) return prev;

                const measureToCopy = prev.measures[measureIndex];
                const newMeasure = deepCloneMeasure(measureToCopy, true);

                // Insert right after the source measure
                const newMeasures = [...prev.measures];
                newMeasures.splice(measureIndex + 1, 0, newMeasure);

                return {
                    ...prev,
                    measures: newMeasures,
                    copiedMeasure: measureToCopy
                };
            });
        },

        // Paste Measure (adds copy to the end)
        handlePasteMeasure: () => {
            setState((prev: FretboardEditorState) => {
                if (!prev.copiedMeasure) return prev;

                const newMeasure = deepCloneMeasure(prev.copiedMeasure, true);

                return {
                    ...prev,
                    measures: [...prev.measures, newMeasure]
                };
            });
        },

        // Advanced Actions
        handleNoteRhythmChange,
        handleNoteDurationStatic,
        handleRemoveNote,
        handleCopyNote,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleSetFingerForString,
        handleSetFretForString,
        handleSetStringForPosition,
        handleSelectStringAndAddIfMissing,
        handleToggleBarre,
        handleToggleBarreTo,
        handleTransposeMeasure,
        handleTransposeAll,
        updateSelectedNotes,

        // Utils
        undo, redo, canUndo, canRedo,
        theme, setTheme
    };
}


import { useState, useMemo } from 'react';
import { MeasureData, GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration, NoteData } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { DEFAULT_COLORS } from '@/app/context/app--context';
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

export function useChordsEditor() {
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
            const newPositions = [...n.positions];

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
            const newPositions = [...n.positions];
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

    const setTheme = (newTheme: FretboardTheme | ((prev: FretboardTheme) => FretboardTheme)) => {
        setState(prev => ({
            ...prev,
            theme: typeof newTheme === 'function' ? newTheme(prev.theme) : newTheme
        }));
    };

    const setActiveDuration = (duration: Duration) => {
        setState(prev => ({ ...prev, activeDuration: duration }));
    };

    const setEditingNoteId = (id: string | null) => {
        setState(prev => ({ ...prev, editingNoteId: id }));
    };

    const setActivePanel = (panel: 'studio' | 'library' | 'mixer' | 'customize') => {
        setState(prev => ({ ...prev, activePanel: panel }));
    };

    const setActivePositionIndex = (index: number) => {
        setState(prev => ({ ...prev, activePositionIndex: index }));
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
        setState(prev => {
            const isSame = prev.selectedMeasureId === id;
            const newSelectedId = isSame ? null : id;
            const targetIndex = prev.measures.findIndex(m => m.id === id);
            const newIndex = (targetIndex !== -1 && !isSame) ? targetIndex : prev.currentMeasureIndex;

            // Auto-select note if exists (Unified UI)
            let noteIdToSelect = null;
            if (newSelectedId && targetIndex !== -1) {
                const m = prev.measures[targetIndex];
                if (m.notes.length > 0) {
                    noteIdToSelect = m.notes[0].id;
                }
            }

            return {
                ...prev,
                selectedNoteIds: noteIdToSelect ? [noteIdToSelect] : [],
                editingNoteId: noteIdToSelect,
                selectedMeasureId: newSelectedId,
                currentMeasureIndex: newIndex
            };
        }, { overwrite: true });
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
            setState(prev => {
                // Find measure for this note
                const measureIndex = prev.measures.findIndex(m => m.notes.some(n => n.id === id));
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
        setState(prev => {
            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
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
        setState(prev => {
            const measureIndex = prev.measures.findIndex(m => m.id === measureId);
            if (measureIndex === -1) return prev;

            const durationToAdd = durationOverride || prev.activeDuration;
            const newNoteId = generateId();

            // Always add to current measure, no capacity check
            const newMeasures = prev.measures.map((m, idx) => {
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

    const handleRemoveNote = (noteId: string) => {
        setState(prev => {
            let targetMeasureIndex = prev.currentMeasureIndex;
            let targetMeasureId = prev.selectedMeasureId;
            const newMeasures = prev.measures.map((m, idx) => {
                const found = m.notes.some(n => n.id === noteId);
                if (found) {
                    targetMeasureIndex = idx;
                    targetMeasureId = m.id;
                    return { ...m, notes: m.notes.filter(n => n.id !== noteId) };
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

    const handleUpdateMeasure = (id: string, updates: Partial<MeasureData>) => {
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleAddMeasure = () => {
        setState(prev => {
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
        setState(prev => {
            const newMeasures = prev.measures.filter(m => m.id !== id);
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
            const newPositions = [...n.positions];
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
            const newPositions = [...n.positions];
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
            const newPositions = [...n.positions];
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
        setState(prev => {
            const newMeasures = prev.measures.map(m => ({
                ...m,
                notes: m.notes.map(n => {
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
                ? newMeasures.flatMap(m => m.notes).find(n => n.id === prev.editingNoteId)
                : null;
            const newIndex = editingNote ? editingNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
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
                        if (newIndex >= newPositions.length) newIndex = Math.max(0, newPositions.length - 1);

                        return { ...n, positions: newPositions };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    };

    const handleTransposeMeasure = (measureId: string, semitones: number) => {
        setState(prev => {
            const measureIndex = prev.measures.findIndex(m => m.id === measureId);
            if (measureIndex === -1) return prev;

            const measure = prev.measures[measureIndex];

            // Check if transposing would put any note outside valid fret range (0-24)
            const wouldGoOutOfBounds = measure.notes.some(note =>
                note.positions.some(pos => {
                    const newFret = pos.fret + semitones;
                    return newFret < 0 || newFret > 24;
                })
            );

            if (wouldGoOutOfBounds) return prev; // Don't allow

            // Transpose all notes
            const transposedNotes = measure.notes.map(note => ({
                ...note,
                positions: note.positions.map(pos => ({
                    ...pos,
                    fret: pos.fret + semitones
                })),
                // Clear barre on transpose
                barre: undefined
            }));

            // Transpose chord name if it exists
            const newChordName = transposeChordName(measure.chordName, semitones);

            const newMeasures = prev.measures.map((m, idx) =>
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
        setState(prev => {
            // Check bounds for ALL notes in ALL measures
            const wouldGoOutOfBounds = prev.measures.some(measure =>
                measure.notes.some(note =>
                    note.positions.some(pos => {
                        const newFret = pos.fret + semitones;
                        return newFret < 0 || newFret > 24;
                    })
                )
            );

            if (wouldGoOutOfBounds) return prev;

            const newMeasures = prev.measures.map(measure => {
                const transposedNotes = measure.notes.map(note => ({
                    ...note,
                    positions: note.positions.map(pos => ({
                        ...pos,
                        fret: pos.fret + semitones
                    })),
                    barre: undefined
                }));

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
        handleRemoveNote,
        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,

        // Toggle Collapse
        handleToggleCollapse: (measureId: string) => {
            setState(prev => ({
                ...prev,
                measures: prev.measures.map(m =>
                    m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m
                )
            }));
        },

        // Reorder Measures
        handleReorderMeasures: (fromIndex: number, toIndex: number) => {
            setState(prev => {
                const newMeasures = [...prev.measures];
                const [movedMeasure] = newMeasures.splice(fromIndex, 1);
                newMeasures.splice(toIndex, 0, movedMeasure);
                return {
                    ...prev,
                    measures: newMeasures
                };
            });
        },

        // Copy Measure (duplicates and adds to end immediately)
        handleCopyMeasure: (measureId: string) => {
            setState(prev => {
                const measureToCopy = prev.measures.find(m => m.id === measureId);
                if (!measureToCopy) return prev;

                // Deep clone the measure with new IDs
                const newMeasure: MeasureData = {
                    ...measureToCopy,
                    id: generateId(),
                    notes: measureToCopy.notes.map(note => ({
                        ...note,
                        id: generateId()
                    }))
                };

                return {
                    ...prev,
                    measures: [...prev.measures, newMeasure],
                    copiedMeasure: measureToCopy
                };
            });
        },

        // Paste Measure (adds copy to the end)
        handlePasteMeasure: () => {
            setState(prev => {
                if (!prev.copiedMeasure) return prev;

                // Deep clone the measure with new IDs
                const newMeasure: MeasureData = {
                    ...prev.copiedMeasure,
                    id: generateId(),
                    notes: prev.copiedMeasure.notes.map(note => ({
                        ...note,
                        id: generateId()
                    }))
                };

                return {
                    ...prev,
                    measures: [...prev.measures, newMeasure]
                };
            });
        },

        // Advanced Actions
        handleNoteRhythmChange,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
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

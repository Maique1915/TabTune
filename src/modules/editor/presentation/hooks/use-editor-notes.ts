import { useCallback } from 'react';
import { MeasureData, NoteData, Duration } from '@/modules/editor/domain/types';
import { FretboardEditorState } from './types';
import { deepCloneNote } from '@/modules/editor/domain/clone-utils';
import {
    getNoteDurationValue,
    getMeasureCapacity,
    decomposeValue,
    getMidiFromPosition,
    getPitchFromMidi,
    findBestFretForPitch,
    getMidiFromPitch,
    NOTE_NAMES
} from '@/modules/editor/domain/music-math';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useEditorNotes(
    state: FretboardEditorState,
    setState: (newState: FretboardEditorState | ((prevState: FretboardEditorState) => FretboardEditorState), options?: { overwrite?: boolean }) => void
) {
    const {
        measures,
        selectedNoteIds,
        editingNoteId,
        activePositionIndex,
        selectedMeasureId,
        activeDuration
    } = state;

    // --- Helpers ---

    const getEditingNote = useCallback(() => {
        if (editingNoteId) {
            for (const m of measures) {
                const found = m.notes.find(n => n.id === editingNoteId);
                if (found) return found;
            }
        }
        // Implicit targeting: first note of selected measure
        if (selectedMeasureId && selectedNoteIds.length === 0) {
            const measure = measures.find(m => m.id === selectedMeasureId);
            if (measure && measure.notes.length > 0) return measure.notes[0];
        }
        return null;
    }, [editingNoteId, measures, selectedMeasureId, selectedNoteIds]);

    const getCurrentPitch = useCallback(() => {
        const editingNote = getEditingNote();
        if (!editingNote || editingNote.type === 'rest' || !editingNote.positions[activePositionIndex]) return null;
        const pos = editingNote.positions[activePositionIndex];
        const midi = getMidiFromPosition(pos.fret, pos.string);
        return getPitchFromMidi(midi);
    }, [getEditingNote, activePositionIndex]);


    const updateSelectedNotes = useCallback((updates: Partial<NoteData> | ((n: NoteData) => Partial<NoteData>)) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicitlySelected = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicitlySelected = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicitlySelected || isImplicitlySelected) {
                        const resolved = typeof updates === 'function' ? updates(n) : updates;
                        return { ...n, ...resolved };
                    }
                    return n;
                })
            }));
            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    // --- Actions ---

    const handleSelectNote = useCallback((id: string, multi: boolean) => {
        if (multi) {
            setState((prev: FretboardEditorState) => ({
                ...prev,
                selectedNoteIds: prev.selectedNoteIds.includes(id)
                    ? prev.selectedNoteIds.filter((i: string) => i !== id)
                    : [...prev.selectedNoteIds, id]
            }), { overwrite: true });
        } else {
            setState((prev: FretboardEditorState) => {
                const measureIndex = prev.measures.findIndex((m: MeasureData) => m.notes.some((n: NoteData) => n.id === id));
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
    }, [setState]);

    const handleAddNote = useCallback((measureId: string, durationOverride?: Duration) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex((m: MeasureData) => m.id === measureId);
            if (measureIndex === -1) return prev;

            const durationToAdd = durationOverride || prev.activeDuration;
            const newNoteId = generateId();

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
    }, [setState]);

    const handleNoteRhythmChange = useCallback((noteId: string, newDuration?: Duration, newDot?: boolean) => {
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

                // Capacity check / Truncate
                const capacity = getMeasureCapacity(prev.settings.time);
                let total = 0;
                const finalNotes: NoteData[] = [];
                for (const n of newNotes) {
                    const val = getNoteDurationValue(n.duration, !!n.decorators.dot);
                    if (total + val <= capacity + 0.001) {
                        finalNotes.push(n);
                        total += val;
                    } else {
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
    }, [setState]);

    const handleNoteDurationStatic = useCallback((noteId: string, newDuration: Duration) => {
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
    }, [setState]);

    const handleRemoveNote = useCallback((noteId: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.filter((n: NoteData) => n.id !== noteId)
            }));
            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    const handleCopyNote = useCallback((noteId: string) => {
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
    }, [setState]);

    const handlePitchChange = useCallback((newName?: string, newAccidental?: string, newOctave?: number) => {
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
    }, [getEditingNote, getCurrentPitch, activePositionIndex, updateSelectedNotes]);

    const handleStringChange = useCallback((newString: number) => {
        const editingNote = getEditingNote();
        if (!editingNote || !editingNote.positions[activePositionIndex]) return;

        const currentPos = editingNote.positions[activePositionIndex];
        const currentFret = currentPos.fret;
        const currentMidi = getMidiFromPosition(currentFret, currentPos.string);

        const newStringNum = newString;
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
    }, [getEditingNote, activePositionIndex, updateSelectedNotes]);

    const handleAccidentalChange = useCallback((accidental: string) => {
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
    }, [updateSelectedNotes, activePositionIndex]);

    const handleDecoratorChange = useCallback((decorator: string) => {
        updateSelectedNotes(n => {
            const isAlreadyActive = !!n.decorators[decorator as keyof typeof n.decorators];
            const nextDecorators: any = { dot: n.decorators.dot };
            if (!isAlreadyActive) {
                nextDecorators[decorator] = true;
            }
            return { decorators: nextDecorators };
        });
    }, [updateSelectedNotes]);

    const handleSetFingerForString = useCallback((idx: number, finger: number | string | undefined) => {
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
    }, [updateSelectedNotes]);

    const handleSetFretForString = useCallback((idx: number, fret: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};
            newPositions[idx] = { ...newPositions[idx], fret, avoid: false };
            return { positions: newPositions };
        });
    }, [updateSelectedNotes]);

    const handleSetStringForPosition = useCallback((idx: number, stringNum: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            if (!newPositions[idx]) return {};
            newPositions[idx] = { ...newPositions[idx], string: stringNum };
            return { positions: newPositions };
        });
    }, [updateSelectedNotes]);

    const handleSelectStringAndAddIfMissing = useCallback((stringNum: number) => {
        setState((prev: FretboardEditorState) => {
            let targetNoteId = prev.editingNoteId;
            if (!targetNoteId && prev.selectedMeasureId) {
                const measure = prev.measures.find(m => m.id === prev.selectedMeasureId);
                if (measure && measure.notes.length > 0) targetNoteId = measure.notes[0].id;
            }

            const editingNote = targetNoteId
                ? prev.measures.flatMap(m => m.notes).find(n => n.id === targetNoteId)
                : null;

            if (!editingNote) return prev;

            const existingIdx = editingNote.positions.findIndex(p => p.string === stringNum);
            if (existingIdx !== -1) {
                return { ...prev, activePositionIndex: existingIdx };
            }

            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData) => {
                    if (n.id === targetNoteId) {
                        return {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: stringNum }]
                        };
                    }
                    return n;
                })
            }));

            const updatedNote = newMeasures.flatMap(m => m.notes).find(n => n.id === targetNoteId);
            const newIdx = updatedNote ? updatedNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIdx };
        });
    }, [setState]);

    const handleToggleBarre = useCallback((indices?: number[]) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            const pos = newPositions[activePositionIndex];
            if (!pos) return {};

            if (pos.endString && pos.endString !== pos.string) {
                newPositions[activePositionIndex] = { ...pos, endString: undefined };
            }

            return { positions: newPositions };
        });
    }, [updateSelectedNotes, activePositionIndex]);

    const handleToggleBarreTo = useCallback((targetString: number) => {
        updateSelectedNotes(n => {
            const newPositions = n.positions.map(p => ({ ...p }));
            const pos = newPositions[activePositionIndex];
            if (!pos) return {};

            if (pos.endString === targetString) {
                newPositions[activePositionIndex] = { ...pos, endString: undefined };
            } else {
                newPositions[activePositionIndex] = {
                    ...pos,
                    endString: targetString
                };
            }

            return { positions: newPositions };
        });
    }, [updateSelectedNotes, activePositionIndex]);

    const handleInsert = useCallback((code: string) => {
        setState(prev => {
            // Clef Logic
            if (code.startsWith('clef=')) {
                const clefValue = code.split('=')[1] as any;
                let targetIndex = prev.currentMeasureIndex;
                if (prev.selectedNoteIds.length > 0) {
                    const foundIndex = prev.measures.findIndex(m => m.notes.some(n => prev.selectedNoteIds.includes(n.id)));
                    if (foundIndex !== -1) targetIndex = foundIndex;
                }
                const newMeasures = prev.measures.map((m, idx) => {
                    if (idx === targetIndex) return { ...m, clef: clefValue, showClef: true };
                    return m;
                });
                return { ...prev, measures: newMeasures };
            }

            if (['s', 'h', 'p', 'b', 't', 'l'].includes(code) && prev.selectedNoteIds.length === 2) {
                const newMeasures = prev.measures.map(m => ({
                    ...m,
                    notes: m.notes.map(n => {
                        if (prev.selectedNoteIds.includes(n.id) && prev.selectedNoteIds.indexOf(n.id) === 0) {
                            return {
                                ...n,
                                technique: n.technique === code ? undefined : code,
                                slideTargetId: n.technique === code ? undefined : prev.selectedNoteIds[1]
                            };
                        }
                        return n;
                    })
                }));
                return { ...prev, measures: newMeasures };
            }

            // Fallback: Delegate to updateSelectedNotes style logic but we need access to state here, so it's tricky to reuse `updateSelectedNotes` which is a wrapper.
            // We can re-implement the update logic here or call a helper.
            // Let's implement inline for clarity as we are inside setState.

            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicit = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicit = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicit || isImplicit) {
                        const technique = n.technique === code ? undefined : code;
                        return {
                            ...n,
                            technique,
                            slideTargetId: technique ? n.slideTargetId : undefined
                        };
                    }
                    return n;
                })
            }));

            return { ...prev, measures: newMeasures };
        });
    }, [setState]);

    const handleAddChordNote = useCallback(() => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicit = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicit = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicit || isImplicit) {
                        return {
                            ...n,
                            positions: [...n.positions, { fret: 0, string: (n.positions.length + 1) }]
                        };
                    }
                    return n;
                })
            }));

            let targetId = prev.editingNoteId;
            if (!targetId && prev.selectedMeasureId) {
                const measure = newMeasures.find(m => m.id === prev.selectedMeasureId);
                if (measure && measure.notes.length > 0) targetId = measure.notes[0].id;
            }

            const editingNote = targetId
                ? newMeasures.flatMap((m: MeasureData) => m.notes).find((n: NoteData) => n.id === targetId)
                : null;
            const newIndex = editingNote ? editingNote.positions.length - 1 : 0;

            return { ...prev, measures: newMeasures, activePositionIndex: newIndex };
        });
    }, [setState]);

    const handleRemoveChordNote = useCallback((idx: number) => {
        setState((prev: FretboardEditorState) => {
            let newIndex = prev.activePositionIndex;
            const newMeasures = prev.measures.map((m: MeasureData) => ({
                ...m,
                notes: m.notes.map((n: NoteData, nIdx: number) => {
                    const isExplicit = prev.selectedNoteIds.includes(n.id) || n.id === prev.editingNoteId;
                    const isImplicit = !prev.editingNoteId && prev.selectedNoteIds.length === 0 && m.id === prev.selectedMeasureId && nIdx === 0;

                    if (isExplicit || isImplicit) {
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
    }, [setState]);

    const handleReorderNotes = useCallback((measureId: string, fromIndex: number, toIndex: number) => {
        setState((prev: FretboardEditorState) => {
            const measureIndex = prev.measures.findIndex(m => m.id === measureId);
            if (measureIndex === -1) return prev;

            const newMeasures = [...prev.measures];
            const measure = newMeasures[measureIndex];
            const newNotes = [...measure.notes];

            const [movedNote] = newNotes.splice(fromIndex, 1);
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
    }, [setState]);

    return {
        getEditingNote,
        getCurrentPitch,
        updateSelectedNotes,
        handleSelectNote,
        handleAddNote,
        handleNoteRhythmChange,
        handleNoteDurationStatic,
        handleRemoveNote,
        handleCopyNote,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleSetFingerForString,
        handleSetFretForString,
        handleSetStringForPosition,
        handleSelectStringAndAddIfMissing,
        handleToggleBarre,
        handleToggleBarreTo,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleReorderNotes
    };
}

import { MeasureData, NoteData } from '@/modules/editor/domain/types';

/**
 * Deep clone utility for editor data structures
 * Ensures no reference sharing between objects
 */

const generateId = () => Math.random().toString(36).substr(2, 9);

export function deepCloneNote(note: NoteData, newId: boolean = false): NoteData {
    return {
        ...note,
        id: newId ? generateId() : note.id,
        positions: note.positions.map(p => ({ ...p })),
        decorators: { ...note.decorators }
    };
}

export function deepCloneMeasure(measure: MeasureData, newId: boolean = false): MeasureData {
    return {
        ...measure,
        id: newId ? generateId() : measure.id,
        notes: measure.notes.map(note => deepCloneNote(note, newId))
    };
}

export function deepCloneMeasures(measures: MeasureData[]): MeasureData[] {
    return measures.map(m => deepCloneMeasure(m, false));
}

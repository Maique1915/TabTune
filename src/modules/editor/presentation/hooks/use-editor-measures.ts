import { useCallback } from 'react';
import { MeasureData } from '@/modules/editor/domain/types';
import { FretboardEditorState } from './types';

// Helper to avoid duplication if not exported elsewhere
const generateId = () => Math.random().toString(36).substr(2, 9);

export function useEditorMeasures(
    state: FretboardEditorState,
    setState: (newState: FretboardEditorState | ((prevState: FretboardEditorState) => FretboardEditorState), options?: { overwrite?: boolean }) => void
) {
    const handleSelectMeasure = useCallback((id: string) => {
        setState((prev: FretboardEditorState) => {
            const newSelectedId = id || null;
            const targetIndex = prev.measures.findIndex((m: MeasureData) => m.id === id);
            const newIndex = targetIndex !== -1 ? targetIndex : prev.currentMeasureIndex;

            return {
                ...prev,
                selectedNoteIds: [],
                editingNoteId: null,
                activePositionIndex: null,
                selectedMeasureId: newSelectedId,
                currentMeasureIndex: newIndex
            };
        }, { overwrite: true });
    }, [setState]);

    const setMeasures = useCallback((newMeasures: MeasureData[] | ((prev: MeasureData[]) => MeasureData[])) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            measures: typeof newMeasures === 'function' ? newMeasures(prev.measures) : newMeasures
        }));
    }, [setState]);

    const handleUpdateMeasure = useCallback((id: string, updates: Partial<MeasureData>) => {
        setMeasures(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    }, [setMeasures]);

    const handleAddMeasure = useCallback(() => {
        setState((prev: FretboardEditorState) => {
            const newMeasure: MeasureData = {
                id: generateId(),
                isCollapsed: false,
                showClef: false,
                showTimeSig: false,
                notes: [
                    {
                        id: generateId(),
                        duration: 'q',
                        type: 'note',
                        decorators: { dot: false },
                        positions: [],
                        technique: '',
                        isSlurred: false,
                        accidental: 'none'
                    }
                ]
            };
            const newMeasures = [...prev.measures, newMeasure];
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newMeasures.length - 1,
                selectedMeasureId: newMeasure.id,
                selectedNoteIds: [newMeasure.notes[0].id],
                editingNoteId: newMeasure.notes[0].id
            };
        });
    }, [setState]);

    const handleRemoveMeasure = useCallback((id: string) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = prev.measures.filter((m: MeasureData) => m.id !== id);

            // If empty, just return empty list and clear selection
            if (newMeasures.length === 0) {
                return {
                    ...prev,
                    measures: [],
                    currentMeasureIndex: 0,
                    selectedMeasureId: null,
                    editingNoteId: null,
                    selectedNoteIds: []
                };
            }

            const newIndex = Math.min(prev.currentMeasureIndex, newMeasures.length - 1);
            return {
                ...prev,
                measures: newMeasures,
                currentMeasureIndex: newIndex,
                selectedMeasureId: newMeasures[newIndex].id
            };
        });
    }, [setState]);

    const handleToggleCollapse = useCallback((measureId: string) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            measures: prev.measures.map((m: MeasureData) =>
                m.id === measureId ? { ...m, isCollapsed: !m.isCollapsed } : m
            )
        }));
    }, [setState]);

    const handleReorderMeasures = useCallback((fromIndex: number, toIndex: number) => {
        setState((prev: FretboardEditorState) => {
            const newMeasures = [...prev.measures];
            const [movedMeasure] = newMeasures.splice(fromIndex, 1);
            newMeasures.splice(toIndex, 0, movedMeasure);
            return {
                ...prev,
                measures: newMeasures
            };
        });
    }, [setState]);

    return {
        handleSelectMeasure,
        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,
        handleToggleCollapse,
        handleReorderMeasures,
        setMeasures
    };
}

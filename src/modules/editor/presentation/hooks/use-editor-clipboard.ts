import { useCallback } from 'react';
import { MeasureData } from '@/modules/editor/domain/types';
import { FretboardEditorState } from './types';
import { deepCloneMeasure } from '@/modules/editor/domain/clone-utils';

export function useEditorClipboard(
    state: FretboardEditorState,
    setState: (newState: FretboardEditorState | ((prevState: FretboardEditorState) => FretboardEditorState), options?: { overwrite?: boolean }) => void
) {
    const { copiedMeasure } = state;

    const handleCopyMeasure = useCallback((measureId: string) => {
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
    }, [setState]);

    const handlePasteMeasure = useCallback(() => {
        setState((prev: FretboardEditorState) => {
            if (!prev.copiedMeasure) return prev;

            const newMeasure = deepCloneMeasure(prev.copiedMeasure, true);

            return {
                ...prev,
                measures: [...prev.measures, newMeasure]
            };
        });
    }, [setState]);

    return {
        handleCopyMeasure,
        handlePasteMeasure
    };
}

import { useCallback } from 'react';
import { GlobalSettings, ScoreStyle, DEFAULT_SCORE_STYLE, Duration } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';
import { useUndoRedo } from '@/modules/editor/presentation/hooks/use-undo-redo';
import { DEFAULT_COLORS } from '@/modules/editor/presentation/constants';
import { FretboardEditorState } from './types';

// Sub-hooks
import { useEditorMeasures } from './use-editor-measures';
import { useEditorNotes } from './use-editor-notes';
import { useEditorTransposition } from './use-editor-transposition';
import { useEditorClipboard } from './use-editor-clipboard';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useBeatsEditor() {
    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<FretboardEditorState>({
        measures: [{
            id: generateId(),
            isCollapsed: false,
            showClef: true,
            showTimeSig: true,
            notes: [
                { id: generateId(), positions: [], duration: 'q', type: 'note', decorators: { dot: false }, accidental: 'none' as const, strumDirection: 'down' as const }
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

    // Destructure state for easier access
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

    // Use Sub-hooks
    const measuresApi = useEditorMeasures(state, setState);
    const notesApi = useEditorNotes(state, setState);
    const transpositionApi = useEditorTransposition(state, setState);
    const clipboardApi = useEditorClipboard(state, setState);

    // --- Simple Setters (kept in main hook) ---

    const setSettings = useCallback((newSettings: GlobalSettings | ((prev: GlobalSettings) => GlobalSettings)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            settings: typeof newSettings === 'function' ? newSettings(prev.settings) : newSettings
        }));
    }, [setState]);

    const setScoreStyle = useCallback((newStyle: ScoreStyle | ((prev: ScoreStyle) => ScoreStyle)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            scoreStyle: typeof newStyle === 'function' ? newStyle(prev.scoreStyle) : newStyle
        }));
    }, [setState]);

    const setTheme = useCallback((newTheme: FretboardTheme | ((prev: FretboardTheme) => FretboardTheme)) => {
        setState((prev: FretboardEditorState) => ({
            ...prev,
            theme: typeof newTheme === 'function' ? newTheme(prev.theme) : newTheme
        }));
    }, [setState]);

    const setActiveDuration = useCallback((duration: Duration) => {
        setState((prev: FretboardEditorState) => ({ ...prev, activeDuration: duration }));
    }, [setState]);

    const setEditingNoteId = useCallback((id: string | null) => {
        setState((prev: FretboardEditorState) => ({ ...prev, editingNoteId: id }));
    }, [setState]);

    const setActivePanel = useCallback((panel: 'studio' | 'library' | 'mixer' | 'customize') => {
        setState((prev: FretboardEditorState) => ({ ...prev, activePanel: panel }));
    }, [setState]);

    const setActivePositionIndex = useCallback((index: number) => {
        setState((prev: FretboardEditorState) => ({ ...prev, activePositionIndex: index }));
    }, [setState]);

    // Derived Helper
    const getActiveMeasure = useCallback(() => {
        return measures.find(m => m.id === selectedMeasureId) || null;
    }, [measures, selectedMeasureId]);


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

        editingNote: notesApi.getEditingNote(),
        currentPitch: notesApi.getCurrentPitch(),
        activeMeasure: getActiveMeasure(),

        // Actions
        setSettings,
        setMeasures: measuresApi.setMeasures,
        setScoreStyle,
        setActiveDuration,
        setActivePanel,
        setEditingNoteId,
        setActivePositionIndex,

        handleSelectMeasure: measuresApi.handleSelectMeasure,
        handleSelectNote: notesApi.handleSelectNote,
        handleAddNote: notesApi.handleAddNote,

        handleUpdateMeasure: measuresApi.handleUpdateMeasure,
        handleAddMeasure: measuresApi.handleAddMeasure,
        handleRemoveMeasure: measuresApi.handleRemoveMeasure,

        // Toggle Collapse
        handleToggleCollapse: measuresApi.handleToggleCollapse,

        // Reorder Measures
        handleReorderMeasures: measuresApi.handleReorderMeasures,

        // Reorder Notes within a Measure
        handleReorderNotes: notesApi.handleReorderNotes,

        // Copy/Paste
        handleCopyMeasure: clipboardApi.handleCopyMeasure,
        handlePasteMeasure: clipboardApi.handlePasteMeasure,

        // Advanced Actions (Notes)
        handleNoteRhythmChange: notesApi.handleNoteRhythmChange,
        handleNoteDurationStatic: notesApi.handleNoteDurationStatic,
        handleRemoveNote: notesApi.handleRemoveNote,
        handleCopyNote: notesApi.handleCopyNote,
        handlePitchChange: notesApi.handlePitchChange,
        handleStringChange: notesApi.handleStringChange,
        handleAccidentalChange: notesApi.handleAccidentalChange,
        handleDecoratorChange: notesApi.handleDecoratorChange,
        handleInsert: notesApi.handleInsert,
        handleAddChordNote: notesApi.handleAddChordNote,
        handleRemoveChordNote: notesApi.handleRemoveChordNote,
        handleSetFingerForString: notesApi.handleSetFingerForString,
        handleSetFretForString: notesApi.handleSetFretForString,
        handleSetStringForPosition: notesApi.handleSetStringForPosition,
        handleSelectStringAndAddIfMissing: notesApi.handleSelectStringAndAddIfMissing,
        handleToggleBarre: notesApi.handleToggleBarre,
        handleToggleBarreTo: notesApi.handleToggleBarreTo,
        updateSelectedNotes: notesApi.updateSelectedNotes,

        // Transposition
        handleTransposeMeasure: transpositionApi.handleTransposeMeasure,
        handleTransposeAll: transpositionApi.handleTransposeAll,
        handleAutoFingerToggle: transpositionApi.handleAutoFingerToggle,

        undo, redo, canUndo, canRedo,
        theme, setTheme
    };
}

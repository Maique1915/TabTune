import { Duration, NoteData, MeasureData, GlobalSettings } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';

export interface SidebarProps {
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
    onAddMeasure?: () => void;
    onRemoveMeasure?: (id: string) => void;
    onCopyMeasure?: (id: string) => void;
    // Generic update for new properties
    onUpdateNote?: (updates: Partial<NoteData>) => void;
    onInsert?: (code: string) => void;
    // Chord Props
    activePositionIndex?: number | null;
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
    hasUnsavedChanges?: boolean;
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

    // Beats specific props (Optional to stay compatible)
    onSelectNote?: (id: string, multi: boolean) => void;
    onSelectMeasure?: (id: string) => void;
    onRemoveNote?: (id: string) => void;

    // Animation/View Props
    animationType?: string;
    projectName?: string;
    onSave?: () => void;
    setTheme?: (theme: FretboardTheme | ((prev: FretboardTheme) => FretboardTheme)) => void;
    variant?: 'short' | 'full' | 'beats';
}

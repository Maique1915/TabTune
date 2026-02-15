import { MeasureData, GlobalSettings, ScoreStyle, Duration } from '@/modules/editor/domain/types';
import { FretboardTheme } from '@/modules/core/domain/types';

export interface FretboardEditorState {
    measures: MeasureData[];
    settings: GlobalSettings;
    scoreStyle: ScoreStyle;
    theme: FretboardTheme;
    selectedNoteIds: string[];
    editingNoteId: string | null;
    activePanel: 'studio' | 'library' | 'mixer' | 'customize';
    activeDuration: Duration;
    activePositionIndex: number | null;
    currentMeasureIndex: number;
    selectedMeasureId: string | null;
    copiedMeasure: MeasureData | null;
}

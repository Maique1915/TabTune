export interface IVisualEditorProps {
  measures: any[];
  selectedNoteIds: string[];
  timeSignature: string;
  activeDuration: any;
  hasClipboard: boolean;
  onSelectNote: (id: string, multi: boolean) => void;
  onDoubleClickNote: (id: string) => void;
  onAddNote: (measureId: string) => void;
  onUpdateNote: (id: string, updates: any) => void;
  onRemoveMeasure: (id: string) => void;
  onAddMeasure: () => void;
  onUpdateMeasure: (id: string, updates: any) => void;
  onToggleCollapse: (id: string) => void;
  onCopyMeasure: (id: string) => void;
  onPasteMeasure: (id: string) => void;
  onReorderMeasures: (from: number, to: number) => void;
  onRemoveNote: (id: string) => void;
  onSelectMeasure: (id: string) => void;
  selectedMeasureId: string | null;
}

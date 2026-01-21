import type { ChordDiagramProps } from "@/modules/core/domain/types";
import { BaseDrawer } from "./BaseDrawer";

export interface ChordDrawer extends BaseDrawer {
  drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX?: number, options?: { skipFretboard?: boolean }): void;
  drawFingers(chord: ChordDiagramProps): void;
  drawChordName(chordName: string, options?: { opacity?: number }): void;
  drawFretboard(): void;
  setGlobalCapo(capo: number): void;
  setStringNames(names: string[]): void;
  calculateWithOffset(offsetX: number): void;
  drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void;
  drawChordWithTransition(currentFinalChord: ChordDiagramProps, currentTransportDisplay: number, nextFinalChord: ChordDiagramProps, nextTransportDisplay: number, originalProgress: number, offsetX?: number, options?: { skipFretboard?: boolean }): void;
}

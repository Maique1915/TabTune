import type { ChordDiagramProps } from "@/modules/core/domain/types";
import { BaseDrawer } from "./BaseDrawer";

export interface ChordDrawer extends BaseDrawer {
  drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX?: number, options?: { skipFretboard?: boolean, skipChordName?: boolean }): void;
  drawFingers(chord: ChordDiagramProps): void;
  drawChordName(chordName: string, options?: { opacity?: number, extensions?: string[] }): void;
  drawFretboard(): void;
  setGlobalCapo(capo: number): void;
  setStringNames(names: string[]): void;
  calculateWithOffset(offsetX: number): void;
  drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void;
  drawChordWithTransition(currentFinalChord: ChordDiagramProps, currentTransportDisplay: number, nextFinalChord: ChordDiagramProps, nextTransportDisplay: number, originalProgress: number, offsetX?: number, options?: { skipFretboard?: boolean }): void;
  drawTransposeIndicator(text: string | number, alignFret?: number): void;
  drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void;
  getFingerPosition(fret: number, string: number): { x: number, y: number };
  getBarreRect(fret: number, startString: number, endString: number): { x: number, y: number, width: number, height: number, radius: number };
  transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number };
}

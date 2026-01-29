import type { ChordDiagramProps, FretboardTheme } from "@/modules/core/domain/types";
import { GeometryProvider } from "./components/GeometryProvider";

export interface ChordDrawer {
  readonly ctx: CanvasRenderingContext2D;
  readonly colors: FretboardTheme;
  readonly dimensions: { width: number; height: number };
  readonly scaleFactor: number;
  readonly fingerRadius: number;
  readonly barreWidth: number;
  readonly neckRadius: number;

  drawChord(inputChord: ChordDiagramProps, inputTransportDisplay: number, offsetX?: number, options?: { skipFretboard?: boolean, skipChordName?: boolean }): void;
  drawFinger(fret: number, string: number, finger: number | string, color?: string, opacity?: number, transport?: number): void;
  drawBarre(fret: number, startString: number, endString: number, finger: number | string, color?: string, opacity?: number, transport?: number): void;
  drawFingers(chord: ChordDiagramProps): void;
  drawChordName(chordName: string, options?: { opacity?: number, extensions?: string[] }): void;
  drawFretboard(): void;
  setGlobalCapo(capo: number): void;
  setStringNames(names: string[] | number | undefined, arg2?: string[]): void;
  calculateWithOffset(offsetX: number): void;
  drawChordWithBuildAnimation(chord: ChordDiagramProps, transportDisplay: number, progress: number, offsetX?: number): void;
  drawChordWithTransition(currentFinalChord: ChordDiagramProps, currentTransportDisplay: number, nextFinalChord: ChordDiagramProps, nextTransportDisplay: number, originalProgress: number, offsetX?: number, options?: { skipFretboard?: boolean }): void;
  drawTransposeIndicator(text: string | number, alignFret?: number): void;
  drawTransposeIndicatorWithTransition(cTransport: number, nTransport: number, cAlignedFret: number, nAlignedFret: number, progress: number): void;
  getFingerCoords(fret: number, string: number): { x: number, y: number };
  getBarreCoords(fret: number, startString: number, endString: number): { x: number, y: number, width: number, height: number, radius: number };
  getGeometry(): GeometryProvider;
  validatePosition(fret: number, string: number): boolean;
  transposeForDisplay(chord: ChordDiagramProps, transportDisplay: number): { finalChord: ChordDiagramProps, transportDisplay: number };

  // Base config setters
  setCtx(ctx: CanvasRenderingContext2D): void;
  setNumStrings(num: number): void;
  setNumFrets(num: number): void;
  setTransforms(rotation: 0 | 90 | 180 | 270, mirror: boolean): void;
  calculateDimensions(): void;
  clear(): void;
}

export interface FingersAnimationParams {
  drawer: ChordDrawer;
  currentDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; };
  nextDisplayChord: { finalChord: ChordDiagramProps; transportDisplay: number; } | null;
  transitionProgress: number;
  allChords?: { finalChord: ChordDiagramProps; transportDisplay: number }[];
  currentIndex?: number;
  buildProgress?: number;
  skipFretboard?: boolean;
}

export interface FingersAnimationDrawer {
  draw(params: FingersAnimationParams): void;
}

import { BaseDrawer } from "./BaseDrawer";

export interface FretboardDrawer extends BaseDrawer {
  // Core Drawing Methods
  drawFretboard(): void;
  drawNeck(progress?: number): void;
  drawStrings(progress?: number): void;
  drawFrets(progress?: number): void;
  drawStringNames(progress?: number, customNames?: string[]): void;

  // Optional / Progressive Drawing
  drawNeckProgressive(progress: number): void;
  drawStringsProgressive(progress: number): void;
  drawFretsProgressive(progress: number): void;
  drawAnimatedFretboard(phases: {
    neckProgress: number;
    stringNamesProgress: number;
    stringsProgress: number;
    fretsProgress: number;
    nutProgress: number;
  }): void;

  // Configuration Methods (Common Interface)
  setConditionalFlags(showNut: boolean, showHeadBackground: boolean): void;
  setHeadstockGap(gap: number): void;
  setCapo(show: boolean, fret: number): void;
  setHideCapoTitle(hide: boolean): void;

  setStringNames(names: string[] | undefined): void;
  setStringNames(index: number, names: string[]): void; // Overload support

  // Geometry Updates
  updateGeometry(
    width: number,
    height: number,
    numStrings: number,
    numFrets: number,
    scaleFactor: number
  ): void;

  setDiagramX(x: number): void;
  setDiagramY(y: number): void;
  setFretboardWidth(width: number): void;
  setFretboardHeight(height: number): void;
  setFretSpacing(spacing: number): void;
  setHorizontalPadding(padding: number): void;
  setStringSpacing(spacing: number): void;
  setNumStrings(num: number): void;
}
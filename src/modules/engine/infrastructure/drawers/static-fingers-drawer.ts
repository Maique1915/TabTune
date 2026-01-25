import type { ChordDiagramProps } from "@/modules/core/domain/types";
import { ChordDrawer } from "./ChordDrawer";

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

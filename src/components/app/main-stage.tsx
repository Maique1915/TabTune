
"use client";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  ZoomIn,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/context/app--context";
import { ChordDiagram } from "./chord-diagram";

export function MainStage() {
  const { selectedChords } = useAppContext();
  const currentChord = selectedChords[selectedChords.length - 1];

  return (
    <div className="flex-1 flex flex-col bg-toolbar p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <SkipBack />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <Play />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <Pause />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <SkipForward />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <RotateCcw />
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <ZoomIn />
          </Button>
          <span>100%</span>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/50 hover:text-primary-foreground">
            <Maximize />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-black rounded-lg w-[525px] h-[555px] overflow-hidden">
        {currentChord ? (
            <ChordDiagram {...currentChord} scale={1.5} />
        ) : (
            <p className="text-muted-foreground">Select a chord from the library to get started</p>
        )}
      </div>
    </div>
  );
}

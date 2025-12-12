
"use client";

import { useAppContext } from "@/app/context/app--context";
import { Music, GripVertical, Trash2 } from "lucide-react";
import { ChordDiagram } from "./chord-diagram";
import { Button } from "../ui/button";

export function SelectedChordsPanel() {
  const { selectedChords, setSelectedChords } = useAppContext();

  const handleRemove = (index: number) => {
    setSelectedChords((prev) => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="h-64 shrink-0 bg-panel border-t p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Music className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-bold text-white">Selected Chords</p>
      </div>
      <div className="flex-1 relative overflow-x-auto overflow-y-hidden">
        <div className="absolute inset-0 flex items-center p-2">
            {selectedChords.length === 0 && (
                <div className="flex-1 flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Your selected chords will appear here.</p>
                </div>
            )}
          {selectedChords.map((chord, index) => (
            <div key={`${chord.id}-${index}`} className="group relative flex items-center gap-1 bg-toolbar p-2 rounded-lg h-full">
                <GripVertical className="h-6 w-6 text-muted-foreground cursor-grab" />
                <div className="h-full">
                    <ChordDiagram chord={chord} scale={1/2} />
                </div>
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:bg-destructive/80 hover:text-destructive-foreground opacity-0 group-hover:opacity-100" onClick={() => handleRemove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

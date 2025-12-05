"use client";

import { useAppContext } from "@/app/context/app--context";
import { Music, GripVertical, Trash2 } from "lucide-react";
import { ChordDiagram } from "./chord-diagram";
import { Button } from "../ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ChordDiagramProps } from "@/lib/types";
import React, { useState, useEffect, useRef } from 'react';


export function SelectedChordsPanel() {
  const { selectedChords, setSelectedChords } = useAppContext();
  const [chords, setChords] = useState<ChordDiagramProps[]>([]);
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null);

  useEffect(() => {
    setChords(selectedChords);
  }, [selectedChords]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chords);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChords(items);
    setSelectedChords(items);
  };

  const handleDeleteChord = (index: number) => {
    const updatedChords = chords.filter((_, i) => i !== index);
    setChords(updatedChords);
    setSelectedChords(updatedChords);
    setSelectedChordIndex(null);
  };
  
  const handleItemClick = (index: number) => {
    if (selectedChordIndex === index) {
        handleDeleteChord(index);
    } else {
        setSelectedChordIndex(index);
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedChordIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="h-64 shrink-0 bg-panel border-t p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Music className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-bold text-white">Selected Chords</p>
      </div>
      <div className="flex-1 relative overflow-x-auto overflow-y-hidden" ref={containerRef}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="chords" direction="horizontal">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="absolute inset-0 flex items-center gap-4 p-2">
                        {chords.length === 0 && (
                            <div className="flex-1 flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Your selected chords will appear here.</p>
                            </div>
                        )}
                        {chords.map((chord, index) => (
                            <Draggable key={index} draggableId={`chord-${index}`} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="group relative flex items-center gap-1 bg-toolbar p-2 rounded-lg"
                                        onClick={() => handleItemClick(index)}
                                    >
                                        <GripVertical className="h-6 w-6 text-muted-foreground cursor-grab" />
                                        <div className="flex items-center justify-center" style={{ overflow: 'hidden' }}>
                                            <ChordDiagram {...chord} scale={0.5} />
                                        </div>
                                         {selectedChordIndex === index && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:bg-destructive/80 hover:text-destructive-foreground"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteChord(index);
                                                }}
                                                aria-label="Delete chord"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
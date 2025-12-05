"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { X } from 'lucide-react';
import ChordDiagram from './ChordDiagram';
import type { ChordDiagramProps } from '../lib/types';
import { Button } from '@/components/ui/button';
import '@/styles/ChordSequenceEditor.css';

interface ChordSequenceEditorProps {
  chordData: ChordDiagramProps[];
  onReorder: (reorderedData: ChordDiagramProps[]) => void;
}

const ChordSequenceEditor: React.FC<ChordSequenceEditorProps> = ({ chordData, onReorder }) => {
  const [chords, setChords] = useState<ChordDiagramProps[]>([]);
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null);

  useEffect(() => {
    setChords(chordData);
  }, [chordData]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chords);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChords(items);
    onReorder(items);
  };

  const handleDeleteChord = (index: number) => {
    const updatedChords = chords.filter((_, i) => i !== index);
    setChords(updatedChords);
    onReorder(updatedChords);
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
    <div ref={containerRef} className="h-full">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="chords">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="chord-list">
              {chords.length > 0 ? (
                chords.map((chord, index) => (
                  <Draggable key={index} draggableId={`chord-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="chord-item"
                        onClick={() => handleItemClick(index)}
                      >
                        <ChordDiagram {...chord} list={true}/>
                         {selectedChordIndex === index && (
                            <Button
                                variant="destructive"
                                size="icon"
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChord(index);
                                }}
                                aria-label="Delete chord"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="empty-sequence-message">
                    <p>Your sequence is empty.</p>
                    <p className="text-sm text-muted-foreground">Add chords from the carousel to get started.</p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ChordSequenceEditor;

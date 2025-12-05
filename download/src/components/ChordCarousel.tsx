"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ChordDiagram from './ChordDiagram';
import type { ChordDiagramProps } from '@/lib/types';
import "@/styles/ChordCarousel.css";

interface ChordCarouselProps {
  chordData: ChordDiagramProps[];
  onAddChord: (chord: ChordDiagramProps) => void;
}

const ChordCarousel: React.FC<ChordCarouselProps> = ({ chordData, onAddChord }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleAddClick = () => {
    if (chordData.length > 0) {
      onAddChord(chordData[current]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-4">
      {chordData.length === 0 ? (
        <div className="no-chords-message">
          <p>No chords available for the selected parameters.</p>
        </div>
      ) : (
        <>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {chordData.map((chord, index) => (
                <CarouselItem key={index}>
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <ChordDiagram {...chord} />
                    </CardContent>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Chord {current + 1} of {chordData.length}
          </div>
          <Button onClick={handleAddClick} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add to Sequence
          </Button>
        </>
      )}
    </div>
  );
};

export default ChordCarousel;

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ChordSelectorForm from "@/components/ChordSelectorForm";
import ChordCarousel from "@/components/ChordCarousel";
import ChordSequenceEditor from "@/components/ChordSequenceEditor";
import { chordData } from "@/lib/chords";
import { transpose } from "@/lib/chord-logic";
import type { Achord, ChordDiagramProps } from "@/lib/types";

export default function Home() {
  const [achord, setAchord] = useState<Achord>({ note: 0, complement: 0, bass: 0 });
  const [adjustedChordData, setAdjustedChordData] = useState<ChordDiagramProps[]>(chordData);
  const [sequenceData, setSequenceData] = useState<ChordDiagramProps[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateChords = (selectedChord: Achord) => {
    const newChordData: ChordDiagramProps[] = chordData
      .filter((chord) =>
        chord.chord.complement === selectedChord.complement && chord.chord.bass === selectedChord.bass
      )
      .map((chord) => {
        const transposed = transpose(chord, selectedChord);
        const newChord: ChordDiagramProps = {
          ...chord,
          chord: {
            ...chord.chord,
            note: selectedChord.note,
          },
          positions: transposed.positions,
          transport: transposed.transport,
          nut: transposed.nut,
        };
        return newChord;
      });
    setAdjustedChordData(newChordData);
  };

  const handleFormSubmit = (selectedChord: Achord) => {
    setAchord(selectedChord);
    updateChords(selectedChord);
  };

  const handleAddChordToSequence = (chordToAdd: ChordDiagramProps) => {
    setSequenceData((prev) => [...prev, chordToAdd]);
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(sequenceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', 'harmonic_flow_sequence.json');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="container mx-auto p-4 md:p-8 bg-background min-h-screen">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">HarmonicFlow</h1>
        <p className="text-muted-foreground mt-2 text-lg">Create, arrange, and export your chord progressions with ease.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Chord Selector</CardTitle>
              <CardDescription>Select a root note, quality, and bass to find chord shapes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChordSelectorForm onSubmit={handleFormSubmit} />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle className="font-headline text-3xl">Available Chords</CardTitle>
                <CardDescription>Browse through the generated chords and add them to your sequence.</CardDescription>
              </CardHeader>
            <CardContent>
              <ChordCarousel chordData={adjustedChordData} onAddChord={handleAddChordToSequence} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="shadow-lg h-full">
             <CardHeader>
                <CardTitle className="font-headline text-3xl">Your Sequence</CardTitle>
                <CardDescription>Drag and drop to reorder your chord progression. Double-click an item to remove it.</CardDescription>
              </CardHeader>
            <CardContent className="h-full">
              <ChordSequenceEditor chordData={sequenceData} onReorder={setSequenceData} />
            </CardContent>
          </Card>
           <Button onClick={handleDownload} size="lg" className="w-full" disabled={sequenceData.length === 0}>
             <Download className="mr-2 h-5 w-5" />
             Download Sequence as JSON
           </Button>
        </div>
      </div>
    </main>
  );
}

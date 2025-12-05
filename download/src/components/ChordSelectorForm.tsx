"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { notes, complements, basses } from '@/lib/chords';
import type { Achord } from '@/lib/types';
import "@/styles/Form.css";

interface FormProps {
  onSubmit: (selectedChord: Achord) => void;
}

const ChordSelectorForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [note, setNote] = useState(0);
  const [complement, setComplement] = useState(0);
  const [bass, setBass] = useState(0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ note, complement, bass });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="note">Root Note</Label>
          <Select value={String(note)} onValueChange={(value) => setNote(Number(value))}>
            <SelectTrigger id="note">
              <SelectValue placeholder="Select Note" />
            </SelectTrigger>
            <SelectContent>
              {notes.map((note, index) => (
                <SelectItem key={note} value={String(index)}>{note}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="complement">Quality</Label>
          <Select value={String(complement)} onValueChange={(value) => setComplement(Number(value))}>
            <SelectTrigger id="complement">
              <SelectValue placeholder="Select Quality" />
            </SelectTrigger>
            <SelectContent>
              {complements.map((comp, index) => (
                <SelectItem key={comp} value={String(index)}>{comp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bass">Bass Note</Label>
          <Select value={String(bass)} onValueChange={(value) => setBass(Number(value))}>
            <SelectTrigger id="bass">
              <SelectValue placeholder="Select Bass" />
            </SelectTrigger>
            <SelectContent>
              {basses.map((b, index) => (
                <SelectItem key={b} value={String(index)}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">Find Chords</Button>
    </form>
  );
};

export default ChordSelectorForm;

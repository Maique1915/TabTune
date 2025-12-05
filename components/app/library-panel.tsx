
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CHORDS, type Chord } from "@/lib/chords";
import { useAppContext } from "@/app/context/app--context";
import { ChordDiagram } from "./chord-diagram";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Major", "Minor", "7th"];

export function LibraryPanel() {
  const { selectedChords, setSelectedChords } = useAppContext();
  const { toast } = useToast();

  const handleChordSelect = (chord: Chord) => {
    setSelectedChords((prev) => [...prev, chord]);
    toast({
      title: `${chord.name} added`,
    });
  };


  return (
    <aside className="flex h-full w-80 flex-col bg-panel border-r border-l shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-4">Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search Library..." className="pl-10 h-10 bg-input rounded-lg" />
        </div>
      </div>
      <div className="px-4 pb-4 border-b">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <Badge
              key={category}
              variant={index === 0 ? "default" : "secondary"}
              className={`cursor-pointer shrink-0 ${
                index === 0
                  ? "bg-accent text-accent-foreground hover:bg-accent/80"
                  : "bg-input text-foreground hover:bg-primary/50"
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            
            <AccordionContent>
              <div className="grid grid-cols-2 gap-3 p-4">
                {CHORDS.map((chord) => (
                  <div
                    key={chord.id}
                    className="group relative cursor-pointer rounded-lg overflow-hidden flex items-center justify-center p-4 w-[525px] h-[555px]"
                    onClick={() => handleChordSelect(chord)}
                  >
                    <ChordDiagram chord={chord} scale={0.5} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <AccordionTrigger className="px-4 text-base font-semibold">
              Chords
            </AccordionTrigger>
                     <p className="absolute bottom-2 left-2 text-sm font-bold text-white line-clamp-2">
                      {chord.name}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
}

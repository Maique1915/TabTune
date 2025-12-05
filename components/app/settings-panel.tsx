
"use client";

import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppContext } from "@/app/context/app--context";
import type { ChordDiagramColors } from "@/app/context/app--context";

export function SettingsPanel() {
  const { colors, setColors } = useAppContext();

  const handleColorChange = (
    key: keyof ChordDiagramColors,
    value: string
  ) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSetAll = (value: string) => {
    setColors({
        cardColor: value,
        fingerColor: value,
        fretboardColor: value,
        borderColor: value,
        textColor: colors.textColor, // Keep text color separate or choose a contrasting one
    });
  }

  return (
    <aside className="flex h-full w-80 flex-col bg-panel border-l shrink-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette />
          Customize
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-semibold">
              Colors
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="cardColor">Background</Label>
                <div className="relative">
                  <Input
                    id="cardColor"
                    type="color"
                    value={colors.cardColor}
                    onChange={(e) => handleColorChange("cardColor", e.target.value)}
                    className="w-10 h-10 p-1 bg-input border-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fingerColor">Fingers</Label>
                 <div className="relative">
                    <Input
                        id="fingerColor"
                        type="color"
                        value={colors.fingerColor}
                        onChange={(e) => handleColorChange("fingerColor", e.target.value)}
                        className="w-10 h-10 p-1 bg-input border-none"
                    />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fretboardColor">Guitar Neck</Label>
                <div className="relative">
                    <Input
                        id="fretboardColor"
                        type="color"
                        value={colors.fretboardColor}
                        onChange={(e) => handleColorChange("fretboardColor", e.target.value)}
                        className="w-10 h-10 p-1 bg-input border-none"
                    />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="borderColor">Borders</Label>
                 <div className="relative">
                    <Input
                        id="borderColor"
                        type="color"
                        value={colors.borderColor}
                        onChange={(e) => handleColorChange("borderColor", e.target.value)}
                        className="w-10 h-10 p-1 bg-input border-none"
                    />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="textColor">Text</Label>
                 <div className="relative">
                    <Input
                        id="textColor"
                        type="color"
                        value={colors.textColor}
                        onChange={(e) => handleColorChange("textColor", e.target.value)}
                        className="w-10 h-10 p-1 bg-input border-none"
                    />
                </div>
              </div>
               <div className="flex items-center justify-between pt-4 border-t">
                <Label htmlFor="allColor">Both</Label>
                 <div className="relative">
                    <Input
                        id="allColor"
                        type="color"
                        onChange={(e) => handleSetAll(e.target.value)}
                        className="w-10 h-10 p-1 bg-input border-none"
                    />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
}

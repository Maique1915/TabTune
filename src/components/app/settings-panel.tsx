"use client";

import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAppContext, DEFAULT_COLORS } from "@/app/context/app--context";
import type { ChordDiagramColors } from "@/app/context/app--context";

export function SettingsPanel() {
  const { colors, setColors } = useAppContext();

  const handleColorChange = (
    key: keyof ChordDiagramColors,
    value: string | number
  ) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetToDefault = () => {
    setColors(DEFAULT_COLORS);
  };

  return (
    <aside className="flex h-full w-80 flex-col bg-panel border-l shrink-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette />
          Customize
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="general" className="w-full pr-4"> {/* Adicionado pr-4 para dar espaço ao seletor de cores */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fingers">Fingers</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="cardColor"
                  type="color"
                  value={colors.cardColor}
                  onChange={(e) => handleColorChange("cardColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="cardColor" className="flex-1 text-right">Background</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="fretboardColor"
                  type="color"
                  value={colors.fretboardColor}
                  onChange={(e) => handleColorChange("fretboardColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="fretboardColor" className="flex-1 text-right">Guitar Neck</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="borderColor"
                  type="color"
                  value={colors.borderColor}
                  onChange={(e) => handleColorChange("borderColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="borderColor" className="flex-1 text-right">Borders</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="textColor"
                  type="color"
                  value={colors.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="textColor" className="flex-1 text-right">Text</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="borderWidth">Border Width</Label>
              <div className="relative">
                <Input
                id="borderWidth"
                type="number"
                value={colors.borderWidth}
                onChange={(e) => handleColorChange("borderWidth", parseInt(e.target.value))}
                className="w-20 bg-input"
              />
            </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="stringThickness">String Thickness</Label>
              <Input
                id="stringThickness"
                type="number"
                value={colors.stringThickness}
                onChange={(e) => handleColorChange("stringThickness", parseInt(e.target.value))}
                className="w-20 bg-input"
              />
            </div>
          </TabsContent>
          <TabsContent value="fingers" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="fingerColor"
                  type="color"
                  value={colors.fingerColor}
                  onChange={(e) => handleColorChange("fingerColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="fingerColor" className="flex-1 text-right">Background</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="fingerTextColor"
                  type="color"
                  value={colors.fingerTextColor}
                  onChange={(e) => handleColorChange("fingerTextColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="fingerTextColor" className="flex-1 text-right">Text</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="fingerBorderColor"
                  type="color"
                  value={colors.fingerBorderColor}
                  onChange={(e) => handleColorChange("fingerBorderColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="fingerBorderColor" className="flex-1 text-right">Border</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerBorderWidth">Border Width</Label>
              <div className="relative">
                <Input
                  id="fingerBorderWidth"
                  type="number"
                  value={colors.fingerBorderWidth}
                  onChange={(e) => handleColorChange("fingerBorderWidth", parseInt(e.target.value))}
                  className="w-20 bg-input"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerBoxShadowHOffset">Shadow H-Offset</Label>
              <Input
                id="fingerBoxShadowHOffset"
                type="number"
                value={colors.fingerBoxShadowHOffset}
                onChange={(e) => handleColorChange("fingerBoxShadowHOffset", parseInt(e.target.value))}
                className="w-20 bg-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerBoxShadowVOffset">Shadow V-Offset</Label>
              <Input
                id="fingerBoxShadowVOffset"
                type="number"
                value={colors.fingerBoxShadowVOffset}
                onChange={(e) => handleColorChange("fingerBoxShadowVOffset", parseInt(e.target.value))}
                className="w-20 bg-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerBoxShadowBlur">Shadow Blur</Label>
              <Input
                id="fingerBoxShadowBlur"
                type="number"
                value={colors.fingerBoxShadowBlur}
                onChange={(e) => handleColorChange("fingerBoxShadowBlur", parseInt(e.target.value))}
                className="w-20 bg-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerBoxShadowSpread">Shadow Spread</Label>
              <Input
                id="fingerBoxShadowSpread"
                type="number"
                value={colors.fingerBoxShadowSpread}
                onChange={(e) => handleColorChange("fingerBoxShadowSpread", parseInt(e.target.value))}
                className="w-20 bg-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Input
                  id="fingerBoxShadowColor"
                  type="color"
                  value={colors.fingerBoxShadowColor}
                  onChange={(e) => handleColorChange("fingerBoxShadowColor", e.target.value)}
                  className="w-10 h-10 p-1 bg-input border-none"
                />
              </div>
              <Label htmlFor="fingerBoxShadowColor" className="flex-1 text-right">Shadow Color</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerBackgroundAlpha">BG Opacity</Label>
              <div className="flex items-center gap-2 w-32">
                <Slider
                  id="fingerBackgroundAlpha"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[colors.fingerBackgroundAlpha]}
                  onValueChange={(value) => handleColorChange("fingerBackgroundAlpha", value[0])}
                  className="w-full"
                />
                <span className="text-xs w-10 text-right">{Math.round(colors.fingerBackgroundAlpha * 100)}%</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Button onClick={handleResetToDefault} className="w-full mt-4">
          Reset to Default
        </Button>
      </div>
    </aside>
  );
}
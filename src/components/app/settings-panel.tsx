"use client";

import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAppContext, DEFAULT_COLORS, AnimationType } from "@/app/context/app--context";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SettingsPanel({ isMobile, isOpen, onClose }: SettingsPanelProps) {
  const { colors, setColors, animationType, setAnimationType } = useAppContext();

  const handleColorChange = (key: keyof ChordDiagramColors, value: string | number) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetToDefault = () => {
    setColors(DEFAULT_COLORS);
  };

  const rootClasses = cn(
    "flex flex-col bg-surface-light dark:bg-surface-dark transition-transform duration-300 ease-in-out",
    isMobile
      ? `fixed inset-x-0 bottom-0 h-[70vh] rounded-t-2xl shadow-2xl z-50 ${isOpen ? "translate-y-0" : "translate-y-full"}`
      : "relative w-80 h-full border-l border-gray-200 dark:border-gray-800"
  );
  
  const PanelContent = () => (
    <>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette />
          Customize
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="animation" className="w-full pr-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="animation">Animation</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fingers">Fingers</TabsTrigger>
          </TabsList>
          <TabsContent value="animation" className="space-y-4 pt-4">
            <div className="space-y-3">
              <Label>Animation Style</Label>
              <RadioGroup value={animationType} onValueChange={(value) => setAnimationType(value as AnimationType)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50">
                  <RadioGroupItem value="carousel" id="carousel" />
                  <Label htmlFor="carousel" className="flex-1 cursor-pointer">
                    <div className="font-medium">Carousel</div>
                    <div className="text-xs text-muted-foreground">Chords slide across the screen like a carousel</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50">
                  <RadioGroupItem value="static-fingers" id="static-fingers" />
                  <Label htmlFor="static-fingers" className="flex-1 cursor-pointer">
                    <div className="font-medium">Static Fretboard</div>
                    <div className="text-xs text-muted-foreground">Fretboard stays centered, fingers animate smoothly between positions</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          <TabsContent value="general" className="space-y-4 pt-4">
            {/* General Settings */}
            <ColorSetting label="Background" colorKey="cardColor" />
            <ColorSetting label="Guitar Neck" colorKey="fretboardColor" />
            <ColorSetting label="Strings (Cordas)" colorKey="borderColor" />
            <ColorSetting label="Frets (Trastes)" colorKey="fretColor" />
            <ColorSetting label="Text" colorKey="textColor" />
            <ColorSetting label="Chord Name" colorKey="chordNameColor" />
            <NumberSetting label="Border Width" colorKey="borderWidth" />
            <NumberSetting label="String Thickness" colorKey="stringThickness" />
          </TabsContent>
          <TabsContent value="fingers" className="space-y-4 pt-4">
            {/* Finger Settings */}
            <ColorSetting label="Background" colorKey="fingerColor" />
            <ColorSetting label="Text" colorKey="fingerTextColor" />
            <ColorSetting label="Border" colorKey="fingerBorderColor" />
            <NumberSetting label="Border Width" colorKey="fingerBorderWidth" />
            <NumberSetting label="Shadow H-Offset" colorKey="fingerBoxShadowHOffset" />
            <NumberSetting label="Shadow V-Offset" colorKey="fingerBoxShadowVOffset" />
            <NumberSetting label="Shadow Blur" colorKey="fingerBoxShadowBlur" />
            <NumberSetting label="Shadow Spread" colorKey="fingerBoxShadowSpread" />
            <ColorSetting label="Shadow Color" colorKey="fingerBoxShadowColor" />
            <SliderSetting label="BG Opacity" colorKey="fingerBackgroundAlpha" />
          </TabsContent>
        </Tabs>
        <Button onClick={handleResetToDefault} className="w-full mt-4">
          Reset to Default
        </Button>
      </div>
    </>
  );

  const ColorSetting = ({ label, colorKey }: { label: string; colorKey: keyof ChordDiagramColors }) => (
    <div className="flex items-center justify-between">
      <Input
        id={colorKey}
        type="color"
        value={colors[colorKey] as string}
        onChange={(e) => handleColorChange(colorKey, e.target.value)}
        className="w-10 h-10 p-1 bg-input border-none"
      />
      <Label htmlFor={colorKey} className="flex-1 text-right">{label}</Label>
    </div>
  );

  const NumberSetting = ({ label, colorKey }: { label: string; colorKey: keyof ChordDiagramColors }) => (
    <div className="flex items-center justify-between">
      <Label htmlFor={colorKey}>{label}</Label>
      <Input
        id={colorKey}
        type="number"
        value={colors[colorKey] as number}
        onChange={(e) => handleColorChange(colorKey, parseInt(e.target.value))}
        className="w-20 bg-input"
      />
    </div>
  );

  const SliderSetting = ({ label, colorKey }: { label: string; colorKey: keyof ChordDiagramColors }) => (
     <div className="flex items-center justify-between">
      <Label htmlFor={colorKey}>{label}</Label>
      <div className="flex items-center gap-2 w-32">
        <Slider
          id={colorKey}
          min={0}
          max={1}
          step={0.05}
          value={[colors[colorKey] as number]}
          onValueChange={(value) => handleColorChange(colorKey, value[0])}
          className="w-full"
        />
        <span className="text-xs w-10 text-right">{Math.round((colors[colorKey] as number) * 100)}%</span>
      </div>
    </div>
  );

  return (
    <div className={rootClasses}>
       {isMobile && (
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      )}
      <div className={cn("flex flex-col flex-1 overflow-hidden", { "hidden lg:flex": !isMobile })}>
        <PanelContent />
      </div>
      {isMobile && isOpen && (
         <div className="flex flex-col flex-1 overflow-hidden">
           <PanelContent />
         </div>
      )}
    </div>
  );
}

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

// Helper components extracted to avoid re-renders
const ColorSetting = ({ label, colorKey }: { label: string; colorKey: keyof ChordDiagramColors }) => {
  const { colors, setColors } = useAppContext();

  const handleColorChange = (key: keyof ChordDiagramColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const rawValue = colors[colorKey] as string;
  let safeValue = rawValue;
  if (safeValue.startsWith('#') && safeValue.length > 7) {
    safeValue = safeValue.substring(0, 7);
  } else if (safeValue.startsWith('rgba') || safeValue.startsWith('rgb')) {
    safeValue = "#000000";
  }

  return (
    <div className="flex items-center justify-between">
      <Input
        id={colorKey}
        type="color"
        value={safeValue}
        onChange={(e) => handleColorChange(colorKey, e.target.value)}
        className="w-10 h-10 p-1 bg-input border-none"
      />
      <Label htmlFor={colorKey} className="flex-1 text-right">{label}</Label>
    </div>
  );
};

const NumberSetting = ({ label, colorKey }: { label: string; colorKey: keyof ChordDiagramColors }) => {
  const { colors, setColors } = useAppContext();

  const handleColorChange = (key: keyof ChordDiagramColors, value: number) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={colorKey}>{label}</Label>
      <Input
        id={colorKey}
        type="number"
        value={isNaN(colors[colorKey] as number) ? 0 : (colors[colorKey] as number)}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          handleColorChange(colorKey, isNaN(val) ? 0 : val);
        }}
        className="w-20 bg-input"
      />
    </div>
  );
};

const SliderSetting = ({ label, colorKey, min = 0, max = 1, step = 0.05 }: { label: string; colorKey: keyof ChordDiagramColors, min?: number, max?: number, step?: number }) => {
  const { colors, setColors } = useAppContext();

  const handleColorChange = (key: keyof ChordDiagramColors, value: number) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={colorKey}>{label}</Label>
      <div className="flex items-center gap-2 w-32">
        <Slider
          id={colorKey}
          min={min}
          max={max}
          step={step}
          value={[colors[colorKey] as number]}
          onValueChange={(value) => handleColorChange(colorKey, value[0])}
          className="w-full"
        />
        <span className="text-xs w-10 text-right">{Math.round((colors[colorKey] as number) * 100)}%</span>
      </div>
    </div>
  );
};

const SettingsContent = ({ isMobile }: { isMobile?: boolean }) => {
  const { animationType, setAnimationType, setColors } = useAppContext();

  const handleResetToDefault = () => {
    setColors(DEFAULT_COLORS);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-0">
        <Tabs defaultValue="animation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-white/10 mb-4 p-1 rounded-lg">
            <TabsTrigger value="animation" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 data-[state=active]:border-pink-500/30 data-[state=active]:shadow-[0_0_10px_rgba(236,72,153,0.2)] rounded-md transition-all text-xs font-bold uppercase">Anim</TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 data-[state=active]:border-pink-500/30 data-[state=active]:shadow-[0_0_10px_rgba(236,72,153,0.2)] rounded-md transition-all text-xs font-bold uppercase">Gen</TabsTrigger>
            <TabsTrigger value="fingers" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 data-[state=active]:border-pink-500/30 data-[state=active]:shadow-[0_0_10px_rgba(236,72,153,0.2)] rounded-md transition-all text-xs font-bold uppercase">Finger</TabsTrigger>
          </TabsList>

          <TabsContent value="animation" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-pink-200/70 text-xs font-bold uppercase tracking-wider mb-2 block">Animation Style</Label>
              <RadioGroup value={animationType} onValueChange={(value) => setAnimationType(value as AnimationType)}>
                <div className={cn("flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer", animationType === 'carousel' ? "bg-pink-950/30 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.1)]" : "bg-black/20 border-white/5 hover:bg-white/5")}>
                  <RadioGroupItem value="carousel" id="carousel" className="text-pink-500 border-pink-500/50" />
                  <Label htmlFor="carousel" className="flex-1 cursor-pointer">
                    <div className="font-bold text-pink-100">Carousel</div>
                    <div className="text-xs text-pink-200/50">Chords slide across the screen</div>
                  </Label>
                </div>
                <div className={cn("flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer", animationType === 'static-fingers' ? "bg-pink-950/30 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.1)]" : "bg-black/20 border-white/5 hover:bg-white/5")}>
                  <RadioGroupItem value="static-fingers" id="static-fingers" className="text-pink-500 border-pink-500/50" />
                  <Label htmlFor="static-fingers" className="flex-1 cursor-pointer">
                    <div className="font-bold text-pink-100">Static Fretboard</div>
                    <div className="text-xs text-pink-200/50">Only fingers move</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <ColorSetting label="Background" colorKey="cardColor" />
            <SliderSetting label="Scale" colorKey="fretboardScale" min={0.5} max={1.5} step={0.1} />
            <ColorSetting label="Guitar Neck" colorKey="fretboardColor" />
            <ColorSetting label="Strings" colorKey="borderColor" />
            <ColorSetting label="Frets" colorKey="fretColor" />
            <ColorSetting label="Text" colorKey="textColor" />
            <ColorSetting label="Chord Name" colorKey="chordNameColor" />
            <NumberSetting label="Border Width" colorKey="borderWidth" />
            <NumberSetting label="String Thickness" colorKey="stringThickness" />
          </TabsContent>

          <TabsContent value="fingers" className="space-y-4">
            <ColorSetting label="Background" colorKey="fingerColor" />
            <ColorSetting label="Text" colorKey="fingerTextColor" />
            <ColorSetting label="Border" colorKey="fingerBorderColor" />
            <NumberSetting label="Border Width" colorKey="fingerBorderWidth" />
            <NumberSetting label="Shadow H" colorKey="fingerBoxShadowHOffset" />
            <NumberSetting label="Shadow V" colorKey="fingerBoxShadowVOffset" />
            <ColorSetting label="Shadow Color" colorKey="fingerBoxShadowColor" />
            <SliderSetting label="BG Opacity" colorKey="fingerBackgroundAlpha" />
          </TabsContent>
        </Tabs>

        <Button onClick={handleResetToDefault} className="w-full mt-6 bg-pink-900/30 border border-pink-500/30 text-pink-300 hover:bg-pink-900/50 hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          Reset to Default
        </Button>
      </div>
    </>
  );
};

export function SettingsPanel({ isMobile, isOpen, onClose }: SettingsPanelProps) {
  const rootClasses = cn(
    "flex flex-col bg-black/40 backdrop-blur-xl border-l border-pink-500/30 shadow-[-5px_0_30px_rgba(236,72,153,0.15)] transition-transform duration-300 ease-in-out z-20",
    isMobile
      ? `fixed inset-x-0 bottom-0 h-[70vh] rounded-t-2xl border-t border-l-0 border-pink-500/30 shadow-[0_-5px_30px_rgba(236,72,153,0.15)] ${isOpen ? "translate-y-0" : "translate-y-full"}`
      : "relative w-80 h-full"
  );

  return (
    <div className={rootClasses}>
      {isMobile && (
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer bg-black/50 rounded-t-2xl" onClick={onClose}>
          <div className="w-12 h-1.5 bg-pink-900/50 rounded-full"></div>
        </div>
      )}

      <div className={cn("flex flex-col flex-1 overflow-hidden", { "hidden lg:flex": !isMobile, "flex": isMobile })}>
        <div className="p-4 border-b border-pink-500/20">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 tracking-wider uppercase drop-shadow-[0_0_2px_rgba(236,72,153,0.5)] flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" />
            Customize
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <SettingsContent isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

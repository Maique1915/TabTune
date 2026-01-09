"use client";

import React, { useState } from "react";
import {
  Palette,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Sun,
  Layers,
  Zap,
  Target,
  Type,
  Grid,
  Music
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
import { useAppContext, DEFAULT_COLORS, AnimationType } from "@/app/context/app--context";
import type { ChordDiagramColors } from "@/app/context/app--context";
import { cn } from "@/shared/lib/utils";
import { GenericSidebar } from "@/components/shared/GenericSidebar";

// --- PRESETS ---

const STUDIO_PRESETS = {
  default: {
    label: 'Default Dark',
    style: DEFAULT_COLORS
  },
  classic: {
    label: 'Classic Light',
    style: {
      ...DEFAULT_COLORS,
      cardColor: "#ffffff",
      fretboardColor: "#f5f5f5",
      borderColor: "#cccccc",
      fretColor: "#dddddd",
      textColor: "#333333",
      chordNameColor: "#000000",
      fingerColor: "#333333",
      fingerTextColor: "#ffffff",
      fingerBorderColor: "#000000",
      fingerBoxShadowColor: "#00000050",
    }
  },
  cyberpunk: {
    label: 'Cyberpunk',
    style: {
      ...DEFAULT_COLORS,
      cardColor: "#0f0518",
      fretboardColor: "#2d0036",
      borderColor: "#fb00ff",
      fretColor: "#fb00ff50",
      textColor: "#00ff9d",
      chordNameColor: "#fb00ff",
      fingerColor: "#00ff9d",
      fingerTextColor: "#fffdfdff",
      fingerBorderColor: "#fb00ff",
      fingerBoxShadowColor: "#00ff9d80",
    }
  },
  midnight: {
    label: 'Midnight Blue',
    style: {
      ...DEFAULT_COLORS,
      cardColor: "#020617",
      fretboardColor: "#0f172a",
      borderColor: "#1e293b",
      fretColor: "#334155",
      textColor: "#94a3b8",
      chordNameColor: "#60a5fa",
      fingerColor: "#3b82f6",
      fingerTextColor: "#ffffff",
      fingerBorderColor: "#60a5fa",
      fingerBoxShadowColor: "#3b82f660",
    }
  },
  vintage: {
    label: 'Vintage',
    style: {
      ...DEFAULT_COLORS,
      cardColor: "#efe6d5",
      fretboardColor: "#e6dcc8",
      borderColor: "#8b4513",
      fretColor: "#a68b6c",
      textColor: "#5c4033",
      chordNameColor: "#3e2723",
      fingerColor: "#5c4033",
      fingerTextColor: "#efe6d5",
      fingerBorderColor: "#3e2723",
      fingerBoxShadowColor: "#5c403350",
    }
  }
};

interface SettingsPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

// --- COMPONENTS ---

const ColorPicker = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="w-8 h-8 rounded-full ring-2 ring-zinc-700 overflow-hidden cursor-pointer shadow-sm hover:ring-pink-500/50 transition-all relative"
          style={{ backgroundColor: color }}
          onClick={(e) => e.stopPropagation()}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[9999] rounded-xl bg-[#111] border border-zinc-800 shadow-xl p-3 w-[200px] animate-in fade-in zoom-in-95 duration-200"
          side="left"
          align="start"
          sideOffset={10}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <HexColorPicker color={color} onChange={onChange} style={{ width: '100%', height: '160px' }} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold">#</span>
              <input
                type="text"
                value={color.startsWith('#') ? color.replace('#', '') : color}
                onChange={(e) => onChange(`#${e.target.value}`)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:border-pink-500/50 outline-none uppercase"
              />
            </div>
          </div>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// --- GROUPS DEFINITION ---

type SettingControl =
  | { type: 'color'; label: string; key: keyof ChordDiagramColors }
  | { type: 'number'; label: string; key: keyof ChordDiagramColors; min?: number; max?: number; step?: number }
  | { type: 'slider'; label: string; key: keyof ChordDiagramColors; min: number; max: number; step: number };

interface SettingGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  controls: SettingControl[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    id: 'fretboard',
    label: 'Fretboard Board',
    icon: Grid,
    controls: [
      { type: 'color', label: 'Background', key: 'cardColor' },
      { type: 'color', label: 'Neck Color', key: 'fretboardColor' },
      { type: 'color', label: 'Frets Color', key: 'fretColor' },
    ]
  },
  {
    id: 'strings',
    label: 'Strings & Structure',
    icon: Music,
    controls: [
      { type: 'color', label: 'String Color', key: 'borderColor' }, // borderColor acts as string color in ChordDrawerBase
      { type: 'number', label: 'String Thick.', key: 'stringThickness', min: 1, max: 10, step: 1 },
    ]
  },
  {
    id: 'fingers',
    label: 'Fingers',
    icon: Target,
    controls: [
      { type: 'color', label: 'Fill Color', key: 'fingerColor' },
      { type: 'color', label: 'Text Color', key: 'fingerTextColor' },
      { type: 'color', label: 'Border Color', key: 'fingerBorderColor' },
      { type: 'slider', label: 'BG Opacity', key: 'fingerBackgroundAlpha', min: 0, max: 1, step: 0.1 },
    ]
  },
  {
    id: 'shadows',
    label: 'Finger Shadows',
    icon: Layers,
    controls: [
      { type: 'color', label: 'Shadow Color', key: 'fingerBoxShadowColor' },
      { type: 'number', label: 'Offset X', key: 'fingerBoxShadowHOffset', min: -10, max: 10 },
      { type: 'number', label: 'Offset Y', key: 'fingerBoxShadowVOffset', min: -10, max: 10 },
    ]
  },
  {
    id: 'text',
    label: 'Typography',
    icon: Type,
    controls: [
      { type: 'color', label: 'Chord Name', key: 'chordNameColor' },
      { type: 'color', label: 'General Text', key: 'textColor' },
    ]
  }
];

// --- MAIN COMPONENT ---

export function SettingsPanel({ isMobile, isOpen, onClose }: SettingsPanelProps) {
  const { colors, setColors, animationType, setAnimationType } = useAppContext();
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'motion'>('basic');
  const [expandedKey, setExpandedKey] = useState<string | null>('fretboard');

  const handleColorChange = (key: keyof ChordDiagramColors, value: any) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setColors(DEFAULT_COLORS);
    setAnimationType('carousel');
  };

  const toggleExpand = (id: string) => {
    setExpandedKey(prev => prev === id ? null : id);
  };

  // --- TAB RENDERERS ---

  const renderBasicTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(STUDIO_PRESETS).map(([key, preset]) => (
          <div
            key={key}
            onClick={() => setColors(preset.style)}
            className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 hover:border-pink-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: preset.style.cardColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.style.fingerColor }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-pink-400 transition-colors uppercase tracking-wider">
                  {preset.label}
                </h3>
                <p className="text-[9px] text-zinc-500">Click to apply preset</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-3">
      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Components</p>

      {SETTING_GROUPS.map((group) => {
        const isExpanded = expandedKey === group.id;
        const Icon = group.icon;

        return (
          <div
            key={group.id}
            className={`flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-zinc-900/60 border-pink-500/30' : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800/40'}`}
          >
            <div
              className="flex items-center justify-between p-3 cursor-pointer group"
              onClick={() => toggleExpand(group.id)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="w-3 h-3 text-pink-400" /> : <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />}
                <div className="flex items-center gap-2">
                  <Icon className={`w-3 h-3 ${isExpanded ? 'text-pink-400' : 'text-zinc-500'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isExpanded ? 'text-pink-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {group.label}
                  </span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-3 pb-3 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-zinc-800/30 mt-1 pt-3">
                {group.controls.map(control => {
                  const currentValue = colors[control.key];

                  if (control.type === 'color') {
                    return (
                      <div key={control.key} className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                        <ColorPicker
                          color={String(currentValue)}
                          onChange={(val) => handleColorChange(control.key, val)}
                        />
                      </div>
                    );
                  }

                  if (control.type === 'slider') {
                    return (
                      <div key={control.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{Math.round((currentValue as number) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={Number(currentValue)}
                          onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value))}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-pink-400 transition-all"
                        />
                      </div>
                    );
                  }

                  if (control.type === 'number') {
                    return (
                      <div key={control.key} className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                        <input
                          type="number"
                          min={control.min}
                          max={control.max}
                          step={control.step || 1}
                          value={Number(currentValue)}
                          onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value))}
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 font-mono focus:border-pink-500/50 outline-none text-right"
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="h-px w-full bg-zinc-800/50 my-4" />

      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">View Transform</p>

      {/* Rotation Controls */}
      <div className="space-y-3 p-3 bg-zinc-950/30 rounded-lg border border-zinc-800/50 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] font-semibold text-zinc-400">ROTATION</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 90, 270].map((deg) => (
            <button
              key={deg}
              onClick={() => {
                // Consolidate updates to avoid race conditions in undo/redo state
                setColors(prev => ({
                  ...prev,
                  rotation: deg as 0 | 90 | 270,
                  mirror: deg === 270
                }));
              }}
              className={`py-2 rounded-lg border text-[10px] font-black transition-all ${colors.rotation === deg
                ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300'
                }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  const renderMotionTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Animation Type</span>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setAnimationType('carousel')}
            className={`p-3 rounded-lg border text-left transition-all ${animationType === 'carousel'
              ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
              : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${animationType === 'carousel' ? 'text-pink-400' : 'text-zinc-300'}`}>
              Carousel
            </div>
            <div className="text-[9px] opacity-70">
              Flowing stream of chords sliding across the screen.
            </div>
          </button>

          <button
            onClick={() => setAnimationType('static-fingers')}
            className={`p-3 rounded-lg border text-left transition-all ${animationType === 'static-fingers'
              ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
              : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${animationType === 'static-fingers' ? 'text-pink-400' : 'text-zinc-300'}`}>
              Static Fretboard
            </div>
            <div className="text-[9px] opacity-70">
              Only fingers move. Fretboard remains fixed.
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Scale</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">{colors.fretboardScale}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={colors.fretboardScale}
          onChange={(e) => handleColorChange('fretboardScale', parseFloat(e.target.value))}
          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-pink-400 transition-all"
        />
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'motion', label: 'Motion' }
  ];

  return (
    <GenericSidebar
      title="Customize"
      icon={Palette}
      onReset={handleReset}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id)}
      isMobile={isMobile}
      isOpen={isOpen}
      onClose={onClose}
    >
      {activeTab === 'basic' && renderBasicTab()}
      {activeTab === 'advanced' && renderAdvancedTab()}
      {activeTab === 'motion' && renderMotionTab()}
    </GenericSidebar>
  );
}

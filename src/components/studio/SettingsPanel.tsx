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
import type { FretboardTheme } from "@/modules/core/domain/types";
import { cn } from "@/shared/lib/utils";
import { GenericSidebar } from "@/components/shared/GenericSidebar";

// --- PRESETS ---

// --- PRESETS ---

export const STUDIO_PRESETS = {
  default: {
    label: 'Default Dark',
    style: DEFAULT_COLORS
  },
  classic: {
    label: 'Classic Light',
    style: {
      ...DEFAULT_COLORS,
      global: {
        ...DEFAULT_COLORS.global,
        primaryTextColor: "#3b3b3bff",
        backgroundColor: "#000000",
      },
      fretboard: {
        neck: {
          color: "#f5f5f5",
          opacity: 1
        },
        frets: { color: "#474747ff" },
        strings: { color: "#000000", thickness: 3 }
      },
      chordName: {
        color: "#f4f4f5",
        opacity: 1,
        shadow: { enabled: false, color: "transparent", blur: 0 },
        stroke: { color: "transparent", width: 0 }
      },

      fingers: {
        color: "#200f0f",
        textColor: "#200f0f",
        border: {
          color: "#200f0f",
          width: 4,
        },
        shadow: {
          enabled: true,
          color: "#000000",
          hOffset: 0,
          vOffset: 0,
          blur: 0,
          spread: 0,
        },
        opacity: 0.3, // backgroundAlpha
      },
      capo: {
        color: "#e4e4e7",
        border: { color: "#a1a1aa", width: 1 },
        shadow: { enabled: true, color: "rgba(0,0,0,0.2)" },
        textColors: { name: "#333333ff", number: "#dddddd" }
      }
    }
  },
  cyberpunk: {
    label: 'Cyberpunk',
    style: {
      ...DEFAULT_COLORS,
      global: { ...DEFAULT_COLORS.global, primaryTextColor: "#ffffffff" },
      fretboard: {
        neck: {
          color: "#2d0036",
          opacity: 1
        },
        frets: { color: "#fb00ff50" },
        strings: { color: "#fb00ff", thickness: 3 }
      },
      chordName: {
        color: "#fb00ff",
        opacity: 1,
        shadow: { enabled: true, color: "#fb00ff", blur: 20 },
        stroke: { color: "transparent", width: 0 }
      },
      fingers: {
        color: "#fb00ff50",
        textColor: "#fffdfdff",
        border: { color: "#fb00ff", width: 4 },
        shadow: { enabled: true, color: "#00ff9d80", hOffset: 0, vOffset: 0, blur: 0, spread: 0 },
        opacity: 0.3
      },
      capo: {
        color: "#180220",
        border: { color: "#fb00ff", width: 1 },
        shadow: { enabled: true, color: "#fb00ff" },
        textColors: { name: "#00ff9d", number: "#00ff9d" }
      }
    }
  },
  midnight: {
    label: 'Midnight Blue',
    style: {
      ...DEFAULT_COLORS,
      global: { ...DEFAULT_COLORS.global, primaryTextColor: "#ffffffff" },
      fretboard: {
        neck: {
          color: "#0f172a",
          opacity: 1
        },
        frets: { color: "#334155" },
        strings: { color: "#94a3b8", thickness: 3 }
      },
      chordName: {
        color: "#60a5fa",
        opacity: 1,
        shadow: { enabled: true, color: "#60a5fa", blur: 15 },
        stroke: { color: "transparent", width: 0 }
      },
      fingers: {
        color: "#334155",
        textColor: "#ffffff",
        border: { color: "#60a5fa", width: 4 },
        shadow: { enabled: true, color: "#3b82f660", hOffset: 0, vOffset: 0, blur: 0, spread: 0 },
        opacity: 0.9
      },
      capo: {
        color: "#1e293b",
        border: { color: "#60a5fa", width: 1 },
        shadow: { enabled: true, color: "#3b82f6aa" },
        textColors: { name: "#d5e0eeff", number: "#a8c6eeff" }
      }
    }
  },
  vintage: {
    label: 'Vintage',
    style: {
      ...DEFAULT_COLORS,
      global: { ...DEFAULT_COLORS.global, primaryTextColor: "#8b4513" },
      fretboard: {
        neck: {
          color: "#e6dcc8",
          opacity: 1
        },
        frets: { color: "#a68b6c" },
        strings: { color: "#8b4513", thickness: 3 }
      },
      chordName: {
        color: "#ece5e3ff",
        opacity: 0.9,
        shadow: { enabled: false, color: "transparent", blur: 0 },
        stroke: { color: "transparent", width: 0 }
      },
      fingers: {
        color: "#5c4033",
        textColor: "#efe6d5",
        border: { color: "#3e2723", width: 4 },
        shadow: { enabled: true, color: "#5c403350", hOffset: 0, vOffset: 0, blur: 0, spread: 0 },
        opacity: 0.9
      },
      capo: {
        color: "#5d4037",
        border: { color: "#3e2723", width: 1 },
        shadow: { enabled: true, color: "rgba(62, 39, 35, 0.4)" },
        textColors: { name: "#ffffff", number: "#5c4033" }
      }
    }
  }
};

interface SettingsPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  colors?: FretboardTheme;
  onColorChange?: (newColors: any) => void;
  numFrets?: number;
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
  | { type: 'color'; label: string; key: string }
  | { type: 'number'; label: string; key: string; min?: number; max?: number; step?: number }
  | { type: 'slider'; label: string; key: string; min: number; max: number; step: number }
  | { type: 'toggle'; label: string; key: string };

interface SettingGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  controls: SettingControl[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    id: 'global',
    label: 'Global',
    icon: Sun,
    controls: [
      { type: 'color', label: 'Background', key: 'global.backgroundColor' },
      { type: 'color', label: 'Primary Text', key: 'global.primaryTextColor' },
    ]
  },
  {
    id: 'fretboard',
    label: 'Fretboard',
    icon: Grid,
    controls: [
      { type: 'color', label: 'Neck Color', key: 'fretboard.neck.color' },
      { type: 'color', label: 'Frets Color', key: 'fretboard.frets.color' },
    ]
  },
  {
    id: 'strings',
    label: 'Strings & Structure',
    icon: Music,
    controls: [
      { type: 'color', label: 'String Color', key: 'fretboard.strings.color' },
      { type: 'number', label: 'String Thick.', key: 'fretboard.strings.thickness', min: 1, max: 10, step: 1 },
    ]
  },
  {
    id: 'fingers',
    label: 'Fingers',
    icon: Target,
    controls: [
      { type: 'color', label: 'Fill Color', key: 'fingers.color' },
      { type: 'color', label: 'Text Color', key: 'fingers.textColor' },
      { type: 'color', label: 'Border Color', key: 'fingers.border.color' },
      { type: 'slider', label: 'BG Opacity', key: 'fingers.opacity', min: 0, max: 1, step: 0.1 },
    ]
  },
  {
    id: 'capo',
    label: 'Capo & Visuals',
    icon: Target,
    controls: [
      { type: 'color', label: 'Capo Color', key: 'capo.color' },
      { type: 'color', label: 'Border Color', key: 'capo.border.color' },
      { type: 'color', label: 'Name Text Color', key: 'capo.textColors.name' },
      { type: 'color', label: 'Number Color', key: 'capo.textColors.number' },
      { type: 'toggle', label: 'Shadow', key: 'capo.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'capo.shadow.color' }
    ]
  },
  {
    id: 'text',
    label: 'Typography',
    icon: Type,
    controls: [
      { type: 'color', label: 'Chord Name', key: 'chordName.color' },
      { type: 'slider', label: 'Opacity', key: 'chordName.opacity', min: 0, max: 1, step: 0.1 },
      { type: 'color', label: 'Shadow Color', key: 'chordName.shadow.color' },
      { type: 'number', label: 'Shadow Blur', key: 'chordName.shadow.blur', min: 0, max: 50 },
      { type: 'color', label: 'Stroke Color', key: 'chordName.stroke.color' },
      { type: 'number', label: 'Stroke Width', key: 'chordName.stroke.width', min: 0, max: 10 },
    ]
  }
];

// --- MAIN COMPONENT ---

export function SettingsPanel({ isMobile, isOpen, onClose, colors: propsColors, onColorChange, numFrets }: SettingsPanelProps) {
  const { setColors: contextSetColors, colors: contextColors, animationType, setAnimationType } = useAppContext();

  // Use props if available (from FretboardPlayer with history), otherwise fallback to context
  const colors = propsColors || contextColors;
  const setColors = onColorChange || contextSetColors;

  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'motion'>('basic');
  const [expandedKey, setExpandedKey] = useState<string | null>('fretboard');

  const handleColorChange = (key: string, value: any) => {
    setColors(prev => {
      const deepUpdate = (obj: any, path: string[], val: any): any => {
        if (path.length === 0) return val;
        const [head, ...tail] = path;
        return {
          ...obj,
          [head]: tail.length === 0 ? val : deepUpdate(obj[head] || {}, tail, val)
        };
      };
      return deepUpdate(prev, key.split('.'), value);
    });
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
                style={{ backgroundColor: preset.style.global.backgroundColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.style.fingers.color }}
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
                  // Resolve deep value
                  const currentValue = control.key.split('.').reduce((obj: any, k) => obj?.[k], colors);

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

                  if (control.type === 'toggle') {
                    return (
                      <div key={control.key} className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">{control.label}</span>
                        <button
                          onClick={() => handleColorChange(control.key, !currentValue)}
                          className={`w-8 h-4 rounded-full transition-colors relative ${currentValue ? 'bg-pink-500/20' : 'bg-zinc-800'
                            }`}
                        >
                          <div className={`absolute top-0.5 bottom-0.5 w-3 h-3 rounded-full transition-all duration-300 ${currentValue
                            ? 'left-[18px] bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]'
                            : 'left-0.5 bg-zinc-600'
                            }`} />
                        </button>
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
                  global: {
                    ...prev.global,
                    rotation: deg as 0 | 90 | 270,
                    mirror: deg === 270
                  }
                }));
              }}
              className={`py-2 rounded-lg border text-[10px] font-black transition-all ${colors.global?.rotation === deg
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
          {(!numFrets || numFrets === 5) && (
            <button
              onClick={() => {
                console.log('Set animation to carousel');
                setAnimationType('carousel');
              }}
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
          )}

          <button
            onClick={() => {
              console.log('Set animation to static-fingers');
              setAnimationType('static-fingers');
            }}
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
          <span className="text-[10px] font-mono text-zinc-500">{colors.global?.scale}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={colors.global?.scale || 1}
          onChange={(e) => handleColorChange('global.scale', parseFloat(e.target.value))}
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

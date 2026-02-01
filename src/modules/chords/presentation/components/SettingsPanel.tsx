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
import { useAppContext, AnimationType } from "@/modules/core/presentation/context/app-context";
import type { FretboardTheme } from "@/modules/core/domain/types";
import { cn } from "@/shared/lib/utils";
import { GenericSidebar } from "@/shared/components/layout/GenericSidebar";
import { DEFAULT_COLORS, STUDIO_PRESETS } from "@/modules/editor/presentation/constants";

// --- PRESETS ---

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
          className="w-8 h-8 rounded-full ring-2 ring-white/10 overflow-hidden cursor-pointer shadow-sm hover:ring-primary/50 transition-all relative"
          style={{ backgroundColor: color }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[9999] rounded-xl bg-[#111] border border-zinc-800 shadow-xl p-3 w-[200px] animate-in fade-in zoom-in-95 duration-200"
          side="left"
          align="start"
          sideOffset={10}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <HexColorPicker color={color} onChange={onChange} style={{ width: '100%', height: '160px' }} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold">#</span>
              <input
                onChange={(e) => onChange(`#${e.target.value}`)}
                className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:border-primary/50 outline-none uppercase"
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
    label: 'Global & View',
    icon: Sun,
    controls: [
      { type: 'color', label: 'Background', key: 'global.backgroundColor' },
      { type: 'slider', label: 'Global Scale', key: 'global.scale', min: 0.7, max: 1.1, step: 0.1 },
    ]
  },
  {
    id: 'neck',
    label: 'Neck & Headstock',
    icon: Layers,
    controls: [
      { type: 'color', label: 'Neck Color', key: 'fretboard.neck.color' },
      { type: 'toggle', label: 'Neck Shadow', key: 'fretboard.neck.shadow.enabled' },
      { type: 'color', label: 'Neck Shadow Color', key: 'fretboard.neck.shadow.color' },

      { type: 'color', label: 'Headstock Color', key: 'head.color' },
      { type: 'color', label: 'Head Border', key: 'head.border.color' },
      { type: 'toggle', label: 'Head Shadow', key: 'head.shadow.enabled' },
      { type: 'color', label: 'Head Shadow Color', key: 'head.shadow.color' },
    ]
  },
  {
    id: 'inlays',
    label: 'Inlays (Markers)',
    icon: Music,
    controls: [
      { type: 'color', label: 'Inlays Color', key: 'fretboard.board.inlays.color' },
      { type: 'slider', label: 'Opacity', key: 'fretboard.board.inlays.opacity', min: 0, max: 1, step: 0.1 },
      { type: 'toggle', label: 'Inlays Shadow', key: 'fretboard.board.inlays.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fretboard.board.inlays.shadow.color' },
    ]
  },
  {
    id: 'strings_frets',
    label: 'Strings & Frets',
    icon: Grid,
    controls: [
      { type: 'color', label: 'Strings Color', key: 'fretboard.strings.color' },
      { type: 'toggle', label: 'String Shadow', key: 'fretboard.strings.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fretboard.strings.shadow.color' },

      { type: 'color', label: 'Frets Color', key: 'fretboard.frets.color' },
      { type: 'toggle', label: 'Frets Shadow', key: 'fretboard.frets.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fretboard.frets.shadow.color' },
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
      { type: 'toggle', label: 'Body Shadow', key: 'fingers.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'fingers.shadow.color' },
    ]
  },
  {
    id: 'labels',
    label: 'Labels & Capo',
    icon: Type,
    controls: [
      { type: 'color', label: 'Chord Name', key: 'chordName.color' },
      { type: 'slider', label: 'Name Opacity', key: 'chordName.opacity', min: 0, max: 1, step: 0.1 },

      { type: 'color', label: 'Capo Color', key: 'capo.color' },
      { type: 'color', label: 'Capo Text', key: 'capo.textColors.name' },
      { type: 'color', label: 'Capo Number', key: 'capo.textColors.number' },
      { type: 'toggle', label: 'Capo Shadow', key: 'capo.shadow.enabled' },
      { type: 'color', label: 'Shadow Color', key: 'capo.shadow.color' },
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
        const safeObj = obj || {};
        return {
          ...safeObj,
          [head]: tail.length === 0 ? val : deepUpdate(safeObj[head] || {}, tail, val)
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
      <div className="space-y-1 mb-4">
        <h3 className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          Visual Presets
        </h3>
        <p className="text-white/40 text-[10px]">Customize render output style</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {Object.entries(STUDIO_PRESETS).map(([key, preset]) => {
          const colors = [
            preset.style.fingers?.color || '#000',
            preset.style.global?.backgroundColor || '#000',
            preset.style.fretboard?.strings?.color || '#fff'
          ];

          return (
            <div
              key={key}
              onClick={() => setColors(preset.style)}
              className="p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-white/20 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="size-8 rounded bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}
                />
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{preset.label}</p>
                  <p className="text-[9px] text-white/40">Professional Styles</p>
                </div>
              </div>
              <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-black/20">
                <div className="flex-1 h-full" style={{ backgroundColor: colors[0] }} />
                <div className="flex-1 h-full" style={{ backgroundColor: colors[1] }} />
                <div className="flex-1 h-full" style={{ backgroundColor: colors[2] }} />
              </div>
            </div>
          );
        })}
      </div>
    </div >
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
            className={`flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-black/40 border-primary/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
          >
            <div
              className="flex items-center justify-between p-3 cursor-pointer group"
              onClick={() => toggleExpand(group.id)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />}
                <div className="flex items-center gap-2">
                  <Icon className={`w-3 h-3 ${isExpanded ? 'text-primary' : 'text-zinc-500'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isExpanded ? 'text-primary-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
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
                          value={Number(currentValue ?? 0)}
                          onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value) || 0)}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all shadow-cyan-glow"
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
                          value={Number(currentValue ?? 0)}
                          onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-zinc-300 font-mono focus:border-primary/50 outline-none text-right"
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
                          className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${currentValue ? 'bg-primary/20' : 'bg-white/10'
                            }`}
                        >
                          <div className={`absolute top-0.5 bottom-0.5 w-3 h-3 rounded-full transition-all duration-300 ${currentValue
                            ? 'left-[18px] bg-primary shadow-[0_0_8px_rgba(6,182,212,0.6)]'
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

        {/* Rotation Buttons */}
        <div className="space-y-1">
          <span className="text-[9px] text-zinc-500 font-medium">Rotation</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '0°', val: 0, mirror: false },
              { label: '90°', val: 90, mirror: false },
              { label: '270°', val: 270, mirror: true }
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => {
                  setColors((prev: any) => ({
                    ...prev,
                    global: {
                      ...(prev.global || {}),
                      rotation: opt.val,
                      mirror: opt.mirror
                    }
                  }));
                }}
                className={`py-2 rounded-lg border text-[10px] font-black transition-all ${colors.global?.rotation === opt.val
                  ? 'bg-primary/10 border-primary/40 text-primary font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );

  const renderMotionTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Animation Type</span>
        <div className="grid grid-cols-1 gap-2">
          {numFrets && numFrets <= 24 && (
            <button
              onClick={() => {
                console.log('Set animation to carousel');
                setAnimationType('carousel');
              }}
              className={`p-3 rounded-lg border text-left transition-all ${animationType === 'carousel'
                ? 'bg-secondary-neon/10 border-secondary-neon/50 shadow-[0_0_15px_rgba(255,0,229,0.15)]'
                : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${animationType === 'carousel' ? 'text-secondary-neon' : 'text-zinc-300'}`}>
                Carousel
              </div>
              <div className="text-[9px] opacity-70">
                Flowing stream of chords sliding across the screen.
              </div>
            </button>
          )}

          {numFrets && numFrets <= 24 && (
            <button
              onClick={() => {
                console.log('Set animation to static-fingers');
                setAnimationType('static-fingers');
              }}
              className={`p-3 rounded-lg border text-left transition-all ${animationType === 'static-fingers'
                ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${animationType === 'static-fingers' ? 'text-primary' : 'text-zinc-300'}`}>
                Static Fretboard
              </div>
              <div className="text-[9px] opacity-70">
                Only fingers move. Fretboard remains fixed.
              </div>
            </button>
          )}


        </div>
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
      title="Visual Presets"
      icon={Palette}
      onReset={handleReset}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id: 'basic' | 'advanced' | 'motion') => setActiveTab(id)}
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

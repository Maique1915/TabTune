"use client";

import React, { useState, useEffect } from "react";
import { SaveStyleDialog } from "./SaveStyleDialog";
import {
  Palette,
  ChevronDown,
  ChevronRight,
  Sun,
  Layers,
  Target,
  Type,
  Grid,
  Music,
  Trash
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import type { FretboardTheme } from "@/modules/core/domain/types";
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
  viewMode?: 'standard' | 'beats' | 'full';
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

export function SettingsPanel({ isMobile, isOpen, onClose, colors: propsColors, onColorChange, numFrets, viewMode = 'standard' }: SettingsPanelProps) {
  const { setColors: contextSetColors, colors: contextColors, animationType, setAnimationType } = useAppContext();

  // Use props if available (from FretboardPlayer with history), otherwise fallback to context
  const colors = propsColors || contextColors;
  const setColors = onColorChange || contextSetColors;

  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'motion'>('basic');
  const [expandedKey, setExpandedKey] = useState<string | null>('fretboard');
  const [saveStyleDialogOpen, setSaveStyleDialogOpen] = useState(false);
  const [customStyles, setCustomStyles] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);

  // Load custom styles on mount
  useEffect(() => {
    const saved = localStorage.getItem('cifrai_custom_styles');
    if (saved) {
      try {
        setCustomStyles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse custom styles", e);
      }
    }
  }, []);

  // Detect changes against presets AND track which custom style is active
  useEffect(() => {
    // Check if current colors match any preset
    const presetMatch = Object.values(STUDIO_PRESETS).some(p => JSON.stringify(p.style) === JSON.stringify(colors));

    // Check if current colors match any custom style
    const customMatch = customStyles.find(s => JSON.stringify(s.style) === JSON.stringify(colors));

    if (customMatch) {
      setActiveStyleId(customMatch.id);
      setHasChanges(false);
    } else if (presetMatch) {
      setActiveStyleId(null);
      setHasChanges(false);
    } else {
      // If we had an active style and now colors changed, we have unsaved changes on THAT style
      setHasChanges(true);
    }
  }, [colors, customStyles]);

  const visibleGroups = SETTING_GROUPS.filter(group => {
    if (viewMode === 'beats') {
      return ['global', 'fingers', 'labels'].includes(group.id);
    }
    return true;
  });

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
    setActiveStyleId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedKey(prev => prev === id ? null : id);
  };

  const handleSaveStyle = (name: string, overwrite: boolean = false) => {
    let updated;
    if (overwrite && activeStyleId) {
      // Update existing style
      updated = customStyles.map(s => s.id === activeStyleId ? { ...s, label: name, style: colors } : s);
      alert("Estilo atualizado com sucesso!");
    } else {
      // Save as new style (with auto-increment if name exists)
      let finalName = name;
      const existingNames = customStyles.map(s => s.label);

      if (existingNames.includes(name)) {
        let maxSuffix = 0;
        // Search for names like "Base Name (x)"
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const suffixRegex = new RegExp(`^${escapedName} \\((\\d+)\\)$`);

        existingNames.forEach(n => {
          if (n === name && maxSuffix === 0) {
            maxSuffix = 0; // The base name exists
          }
          const match = n.match(suffixRegex);
          if (match) {
            const suffix = parseInt(match[1]);
            if (suffix > maxSuffix) maxSuffix = suffix;
          }
        });

        finalName = `${name} (${maxSuffix + 1})`;
      }

      const newStyle = {
        id: Date.now().toString(),
        label: finalName,
        style: colors,
        isCustom: true,
        context: viewMode
      };
      updated = [...customStyles, newStyle];
      setActiveStyleId(newStyle.id);
      alert("Estilo salvo com sucesso!");
    }

    setCustomStyles(updated);
    localStorage.setItem('cifrai_custom_styles', JSON.stringify(updated));
  };

  // --- TAB RENDERERS ---

  const renderBasicTab = () => (
    <div className="px-4 space-y-4">
      <div className="space-y-1 mb-4">
        <h3 className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          Visual Presets
        </h3>
        <p className="text-white/40 text-[10px]">Customize render output style</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {Object.entries(STUDIO_PRESETS).map(([key, preset]) => {
          const previewColors = [
            preset.style.fingers?.color || '#000',
            preset.style.global?.backgroundColor || '#000',
            preset.style.fretboard?.strings?.color || '#fff'
          ];

          const isSelected = JSON.stringify(preset.style) === JSON.stringify(colors);

          return (
            <div
              key={key}
              onClick={() => setColors(preset.style)}
              className={`p-3 rounded-xl border cursor-pointer transition-colors group ${isSelected ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="size-8 rounded bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${previewColors[0]} 0%, ${previewColors[1]} 100%)` }}
                />
                <div>
                  <p className={`text-xs font-bold transition-colors ${isSelected ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{preset.label}</p>
                  <p className="text-[9px] text-white/40">Professional Styles</p>
                </div>
              </div>
              <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-black/20">
                <div className="flex-1 h-full" style={{ backgroundColor: previewColors[0] }} />
                <div className="flex-1 h-full" style={{ backgroundColor: previewColors[1] }} />
                <div className="flex-1 h-full" style={{ backgroundColor: previewColors[2] }} />
              </div>
            </div>
          );
        })}

        {/* Custom Styles */}
        {customStyles.length > 0 && (
          <>
            <div className="h-px bg-white/5 my-2" />
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-2">Custom Styles</p>
            {customStyles.map((style) => {
              const previewColors = [
                style.style.fingers?.color || '#000',
                style.style.global?.backgroundColor || '#000',
                style.style.fretboard?.strings?.color || '#fff'
              ];

              const isSelected = JSON.stringify(style.style) === JSON.stringify(colors);

              return (
                <div
                  key={style.id}
                  onClick={() => setColors(style.style)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors group ${isSelected ? 'bg-pink-500/10 border-pink-500/40' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner"
                        style={{ background: `linear-gradient(135deg, ${previewColors[0]} 0%, ${previewColors[1]} 100%)` }}
                      />
                      <div>
                        <p className={`text-xs font-bold transition-colors ${isSelected ? 'text-pink-400' : 'text-white group-hover:text-pink-400'}`}>{style.label}</p>
                        <p className="text-[9px] text-white/40">Personal Style</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = customStyles.filter(s => s.id !== style.id);
                        setCustomStyles(updated);
                        localStorage.setItem('cifrai_custom_styles', JSON.stringify(updated));
                      }}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-black/20">
                    <div className="flex-1 h-full" style={{ backgroundColor: previewColors[0] }} />
                    <div className="flex-1 h-full" style={{ backgroundColor: previewColors[1] }} />
                    <div className="flex-1 h-full" style={{ backgroundColor: previewColors[2] }} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div >
  );

  const renderAdvancedTab = () => {
    // Determine which groups and controls to show based on viewMode
    let groupsToRender = visibleGroups;

    if (viewMode === 'beats') {
      groupsToRender = [
        {
          id: 'global',
          label: 'Ambiente',
          icon: Sun,
          controls: [
            { type: 'color', label: 'Cor do Fundo', key: 'global.backgroundColor' }
          ]
        },
        {
          id: 'fingers',
          label: 'Seta de Batida',
          icon: Target,
          controls: [
            { type: 'color', label: 'Cor da Seta', key: 'arrows.color' },
            { type: 'color', label: 'Cor do Dedo (PIMA)', key: 'arrows.textColor' },
            { type: 'toggle', label: 'Ativar Sombra', key: 'arrows.shadow.enabled' },
            { type: 'color', label: 'Cor da Sombra', key: 'arrows.shadow.color' },
            { type: 'toggle', label: 'Ativar Borda', key: 'arrows.border.enabled' },
            { type: 'color', label: 'Cor da Borda', key: 'arrows.border.color' }
          ]
        },
        {
          id: 'labels',
          label: 'Identificação',
          icon: Type,
          controls: [
            { type: 'color', label: 'Cor do Nome do Acorde', key: 'chordName.color' }
          ]
        }
      ] as any;
    }

    return (
      <div className="px-4 space-y-3">
        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Componentes</p>

        {groupsToRender.map((group) => {
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
              {(numFrets && numFrets > 12
                ? [
                  { label: '0°', val: 0, mirror: false },
                  { label: '180°', val: 0, mirror: true } // Mirror on Y axis (headstock to the right)
                ]
                : [
                  { label: '0°', val: 0, mirror: false },
                  { label: '90°', val: 90, mirror: false },
                  { label: '270°', val: 270, mirror: true }
                ]
              ).map((opt) => (
                <button
                  key={`${opt.val}-${opt.mirror}`}
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
                  className={`py-2 rounded-lg border text-[10px] font-black transition-all ${colors.global?.rotation === opt.val && colors.global?.mirror === opt.mirror
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
  };

  const renderMotionTab = () => (
    <div className="space-y-6">
      <div className="px-4 space-y-3">
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
  ].filter(tab => {
    if (tab.id === 'motion') {
      return viewMode === 'standard';
    }
    return true;
  });

  return (
    <>
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
        footer={hasChanges && (
          <button
            onClick={() => setSaveStyleDialogOpen(true)}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 group transition-all"
          >
            <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Salvar Estilo Customizado
          </button>
        )}
      >
        {activeTab === 'basic' && renderBasicTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
        {activeTab === 'motion' && renderMotionTab()}
      </GenericSidebar>

      <SaveStyleDialog
        open={saveStyleDialogOpen}
        onOpenChange={setSaveStyleDialogOpen}
        onSave={handleSaveStyle}
        initialName={customStyles.find(s => s.id === activeStyleId)?.label || ""}
        isActiveStyle={!!activeStyleId}
      />
    </>
  );
}

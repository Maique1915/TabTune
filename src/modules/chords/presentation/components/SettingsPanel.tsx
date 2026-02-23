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
import { useTranslation } from "@/modules/core/presentation/context/translation-context";
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
  const { t } = useTranslation();

  // Use props if available (from FretboardPlayer with history), otherwise fallback to context
  const colors = propsColors || contextColors;
  const setColors = onColorChange || contextSetColors;

  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'motion'>('basic');
  const [expandedKey, setExpandedKey] = useState<string | null>('fretboard');
  const [saveStyleDialogOpen, setSaveStyleDialogOpen] = useState(false);
  const [customStyles, setCustomStyles] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('cifrai_custom_styles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse custom styles", e);
        }
      }
    }
    return [];
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);

  // Remove the old useEffect for loading styles

  const [prevColorsState, setPrevColorsState] = useState<string>(JSON.stringify(colors));
  const [prevCustomStylesState, setPrevCustomStylesState] = useState<any[]>(customStyles);

  // Detect changes against presets AND track which custom style is active
  const currentColorsStr = JSON.stringify(colors);
  if (currentColorsStr !== prevColorsState || customStyles !== prevCustomStylesState) {
    setPrevColorsState(currentColorsStr);
    setPrevCustomStylesState(customStyles);

    // Check if current colors match any preset
    const presetMatch = Object.values(STUDIO_PRESETS).some(p => JSON.stringify(p.style) === currentColorsStr);

    // Check if current colors match any custom style
    const customMatch = customStyles.find(s => JSON.stringify(s.style) === currentColorsStr);

    if (customMatch) {
      setActiveStyleId(customMatch.id);
      setHasChanges(false);
    } else if (presetMatch) {
      setActiveStyleId(null);
      setHasChanges(false);
    } else {
      setHasChanges(true);
    }
  }

  const visibleGroups = SETTING_GROUPS.map(group => ({
    ...group,
    label: t(`settings.groups.${group.id}` as any),
    controls: group.controls.map(control => {
      let translationKey = control.key.replace(/\./g, '_');

      // Custom mappings for specific paths that differ from the simple key
      if (control.key === 'fretboard.neck.color') translationKey = 'neck_color';
      if (control.key === 'fretboard.neck.shadow.enabled') translationKey = 'neck_shadow_enabled';
      if (control.key === 'fretboard.neck.shadow.color') translationKey = 'neck_shadow_color';
      if (control.key === 'head.color') translationKey = 'headstock_color';
      if (control.key === 'head.border.color') translationKey = 'head_border_color';
      if (control.key === 'head.shadow.enabled') translationKey = 'head_shadow_enabled';
      if (control.key === 'head.shadow.color') translationKey = 'head_shadow_color';
      if (control.key === 'fretboard.board.inlays.color') translationKey = 'inlays_color';
      if (control.key === 'fretboard.board.inlays.opacity') translationKey = 'fingers_opacity';
      if (control.key === 'fretboard.board.inlays.shadow.enabled') translationKey = 'inlays_shadow_enabled';
      if (control.key === 'fretboard.board.inlays.shadow.color') translationKey = 'inlays_shadow_color';
      if (control.key === 'fretboard.strings.color') translationKey = 'strings_color';
      if (control.key === 'fretboard.strings.shadow.enabled') translationKey = 'strings_shadow_enabled';
      if (control.key === 'fretboard.strings.shadow.color') translationKey = 'strings_shadow_color';
      if (control.key === 'fretboard.frets.color') translationKey = 'frets_color';
      if (control.key === 'fretboard.frets.shadow.enabled') translationKey = 'frets_shadow_enabled';
      if (control.key === 'fretboard.frets.shadow.color') translationKey = 'frets_shadow_color';
      if (control.key === 'fingers.color') translationKey = 'fill_color';
      if (control.key === 'fingers.textColor') translationKey = 'text_color';
      if (control.key === 'fingers.border.color') translationKey = 'border_color';
      if (control.key === 'fingers.opacity') translationKey = 'fingers_opacity';
      if (control.key === 'fingers.shadow.enabled') translationKey = 'fingers_shadow_enabled';
      if (control.key === 'fingers.shadow.color') translationKey = 'fingers_shadow_color';
      if (control.key === 'chordName.color') translationKey = 'chordName_color';
      if (control.key === 'capo.color') translationKey = 'capo_color';
      if (control.key === 'capo.textColors.name') translationKey = 'capo_text_color';
      if (control.key === 'capo.textColors.number') translationKey = 'capo_text_color';
      if (control.key === 'capo.shadow.enabled') translationKey = 'capo_shadow_enabled';
      if (control.key === 'capo.shadow.color') translationKey = 'capo_shadow_color';

      return {
        ...control,
        label: t(`settings.labels.${translationKey}` as any)
      };
    })
  })).filter(group => {
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
      alert(t('settings.messages.style_updated'));
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
      alert(t('settings.messages.style_saved'));
    }

    setCustomStyles(updated);
    localStorage.setItem('cifrai_custom_styles', JSON.stringify(updated));
  };

  // --- TAB RENDERERS ---

  const renderBasicTab = () => (
    <div className="px-8 space-y-6">
      <div className="space-y-1.5 mb-2">
        <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
          {t('settings.tabs.presets')}
        </h3>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{t('settings.presets_desc')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-500 group relative overflow-hidden ${isSelected ? 'bg-primary/10 border-primary/40 shadow-premium-glow' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.05]'}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="size-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500"
                  style={{ background: `linear-gradient(135deg, ${previewColors[0]} 0%, ${previewColors[1]} 100%)` }}
                />
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{t(`settings.presets.${key}` as any)}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{t('settings.professional_styles')}</p>
                </div>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden bg-black/40 border border-white/[0.05]">
                <div className="flex-1 h-full shadow-inner" style={{ backgroundColor: previewColors[0] }} />
                <div className="flex-1 h-full shadow-inner" style={{ backgroundColor: previewColors[1] }} />
                <div className="flex-1 h-full shadow-inner" style={{ backgroundColor: previewColors[2] }} />
              </div>
              {isSelected && <div className="absolute top-2 right-2 size-2 bg-primary rounded-full shadow-cyan-glow" />}
            </div>
          );
        })}

        {/* Custom Styles */}
        {customStyles.length > 0 && (
          <>
            <div className="h-px bg-white/5 my-4" />
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2">{t('settings.custom_styles')}</p>
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
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-500 group relative overflow-hidden ${isSelected ? 'bg-pink-500/10 border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.05]'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div
                        className="size-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500"
                        style={{ background: `linear-gradient(135deg, ${previewColors[0]} 0%, ${previewColors[1]} 100%)` }}
                      />
                      <div>
                        <p className={`text-xs font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-pink-400' : 'text-white group-hover:text-pink-400'}`}>{style.label}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{t('settings.personal_style')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden bg-black/40 border border-white/[0.05]">
                    <div className="flex-1 h-full shadow-inner" style={{ backgroundColor: previewColors[0] }} />
                    <div className="flex-1 h-full shadow-inner" style={{ backgroundColor: previewColors[1] }} />
                    <div className="flex-1 h-full shadow-inner" style={{ backgroundColor: previewColors[2] }} />
                  </div>
                  {isSelected && <div className="absolute top-2 right-2 size-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />}
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
          label: t('settings.groups.global'),
          icon: Sun,
          controls: [
            { type: 'color', label: t('settings.labels.global_backgroundColor'), key: 'global.backgroundColor' }
          ]
        },
        {
          id: 'fingers',
          label: t('settings.groups.arrows'),
          icon: Target,
          controls: [
            { type: 'color', label: t('settings.labels.arrows_color'), key: 'arrows.color' },
            { type: 'color', label: t('settings.labels.arrows_textColor'), key: 'arrows.textColor' },
            { type: 'toggle', label: t('settings.labels.arrows_shadow_enabled'), key: 'arrows.shadow.enabled' },
            { type: 'color', label: t('settings.labels.arrows_shadow_color'), key: 'arrows.shadow.color' },
            { type: 'toggle', label: t('settings.labels.arrows_border_enabled'), key: 'arrows.border.enabled' },
            { type: 'color', label: t('settings.labels.arrows_border_color'), key: 'arrows.border.color' }
          ]
        },
        {
          id: 'labels',
          label: t('settings.groups.labels'),
          icon: Type,
          controls: [
            { type: 'color', label: t('settings.labels.chordName_color'), key: 'chordName.color' }
          ]
        }
      ] as any;
    }

    return (
      <div className="px-8 space-y-4">
        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mb-4">{t('settings.headers.components')}</p>

        {groupsToRender.map((group) => {
          const isExpanded = expandedKey === group.id;
          const Icon = group.icon;

          return (
            <div
              key={group.id}
              className={`flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden shadow-lg ${isExpanded ? 'bg-white/[0.04] border-primary/30' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1]'}`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer group"
                onClick={() => toggleExpand(group.id)}
              >
                <div className="flex items-center gap-4">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors duration-500 ${isExpanded ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isExpanded ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {group.label}
                    </span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 pt-2 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-white/[0.05] bg-black/20">
                  {group.controls.map(control => {
                    // Resolve deep value
                    const currentValue = control.key.split('.').reduce((obj: any, k) => obj?.[k], colors);

                    if (control.type === 'color') {
                      return (
                        <div key={control.key} className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{control.label}</span>
                          <ColorPicker
                            color={String(currentValue)}
                            onChange={(val) => handleColorChange(control.key, val)}
                          />
                        </div>
                      );
                    }

                    if (control.type === 'slider') {
                      return (
                        <div key={control.key} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{control.label}</span>
                            <span className="text-[10px] font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded shadow-inner-glow">{Math.round((currentValue as number) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={Number(currentValue ?? 0)}
                            onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value) || 0)}
                            className="w-full h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all shadow-cyan-glow border border-white/10"
                          />
                        </div>
                      );
                    }

                    if (control.type === 'number') {
                      return (
                        <div key={control.key} className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{control.label}</span>
                          <input
                            type="number"
                            min={control.min}
                            max={control.max}
                            step={control.step || 1}
                            value={Number(currentValue ?? 0)}
                            onChange={(e) => handleColorChange(control.key, parseFloat(e.target.value) || 0)}
                            className="w-20 bg-black/60 border border-white/[0.08] hover:border-white/20 rounded-xl px-3 py-1.5 text-xs text-primary font-black font-mono focus:border-primary/50 outline-none text-right transition-all"
                          />
                        </div>
                      );
                    }

                    if (control.type === 'toggle') {
                      return (
                        <div key={control.key} className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{control.label}</span>
                          <button
                            onClick={() => handleColorChange(control.key, !currentValue)}
                            className={`w-10 h-5 rounded-full transition-all duration-500 relative cursor-pointer shadow-inner ${currentValue ? 'bg-primary/20 ring-1 ring-primary/30' : 'bg-white/10 ring-1 ring-white/5'
                              }`}
                          >
                            <div className={`absolute top-1 bottom-1 w-3 h-3 rounded-full transition-all duration-500 ${currentValue
                              ? 'left-[22px] bg-primary shadow-cyan-glow scale-125'
                              : 'left-1 bg-slate-600'
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


      </div>
    );
  };

  const renderMotionTab = () => (
    <div className="space-y-8 px-8">
      <div className="space-y-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t('settings.animation_type')}</span>
        <div className="grid grid-cols-1 gap-4">
          {numFrets && numFrets <= 24 && (
            <button
              onClick={() => {
                console.log('Set animation to carousel');
                setAnimationType('carousel');
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-500 relative overflow-hidden group ${animationType === 'carousel'
                ? 'bg-secondary-neon/10 border-secondary-neon/40 shadow-[0_0_20px_rgba(255,0,229,0.15)] ring-1 ring-secondary-neon/20'
                : 'bg-white/[0.02] border-white/[0.05] text-slate-500 hover:border-white/[0.15] hover:text-white'
                }`}
            >
              <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${animationType === 'carousel' ? 'text-secondary-neon' : 'text-slate-300 group-hover:text-white'}`}>
                {t('settings.animations.carousel.title')}
              </div>
              <div className="text-[10px] opacity-60 font-black uppercase tracking-widest leading-relaxed">
                {t('settings.animations.carousel.desc')}
              </div>
              {animationType === 'carousel' && <div className="absolute top-2 right-2 size-2 bg-secondary-neon rounded-full shadow-[0_0_8px_rgba(255,0,229,0.8)]" />}
            </button>
          )}

          {numFrets && numFrets <= 24 && (
            <button
              onClick={() => {
                console.log('Set animation to static-fingers');
                setAnimationType('static-fingers');
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-500 relative overflow-hidden group ${animationType === 'static-fingers'
                ? 'bg-primary/10 border-primary/40 shadow-premium-glow ring-1 ring-primary/20'
                : 'bg-white/[0.02] border-white/[0.05] text-slate-500 hover:border-white/[0.15] hover:text-white'
                }`}
            >
              <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${animationType === 'static-fingers' ? 'text-primary' : 'text-slate-300 group-hover:text-white'}`}>
                {t('settings.animations.static.title')}
              </div>
              <div className="text-[10px] opacity-60 font-black uppercase tracking-widest leading-relaxed">
                {t('settings.animations.static.desc')}
              </div>
              {animationType === 'static-fingers' && <div className="absolute top-2 right-2 size-2 bg-primary rounded-full shadow-cyan-glow" />}
            </button>
          )}


        </div>
      </div>

    </div>
  );

  const tabs = [
    { id: 'basic', label: t('settings.tabs.basic') },
    { id: 'advanced', label: t('settings.tabs.advanced') },
    { id: 'motion', label: t('settings.tabs.motion') }
  ].filter(tab => {
    if (tab.id === 'motion') {
      return viewMode === 'standard';
    }
    return true;
  });

  return (
    <>
      <GenericSidebar
        title={t('settings.headers.visual_presets')}
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
            {t('settings.save_custom_style')}
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

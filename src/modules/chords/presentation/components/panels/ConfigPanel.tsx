import React from 'react';
import { SidebarProps } from '../sidebar-types';
import { Minus, Plus } from 'lucide-react';
import { InstrumentPreset } from '@/lib/instruments';
import { INSTRUMENTS } from '@/lib/instruments';
import { calculateShiftedTuning } from '@/modules/editor/domain/music-math';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';

export const ConfigPanel: React.FC<SidebarProps> = ({
    globalSettings,
    onGlobalSettingsChange,
    measures,
    animationType,
    theme,
    setTheme,
    variant
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('beats.config.title')}</h3>

                {/* BPM / Tempo Selector */}
                <div className="space-y-3 pt-4 border-t border-zinc-900/50">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">{t('beats.config.tempo')}</label>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tight mt-1">{t('beats.config.sync')}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            <span className="text-[11px] font-black text-cyan-400 leading-none">{globalSettings?.bpm || 120} BPM</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-950/60 p-1.5 rounded-2xl border border-white/[0.03] shadow-inner">
                        <button
                            onClick={() => {
                                const cur = globalSettings?.bpm || 120;
                                onGlobalSettingsChange?.({ bpm: Math.max(20, cur - 5) });
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all shadow-lg"
                        >
                            <Minus className="w-4 h-4" />
                        </button>

                        <div className="flex-1 flex flex-col items-center">
                            <input
                                type="number"
                                value={globalSettings?.bpm || 120}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) onGlobalSettingsChange?.({ bpm: val });
                                }}
                                className="w-full bg-transparent text-center font-black text-xl text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>

                        <button
                            onClick={() => {
                                const cur = globalSettings?.bpm || 120;
                                onGlobalSettingsChange?.({ bpm: Math.min(300, cur + 5) });
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Instrument Selector */}
                {variant !== 'beats' && (
                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Instrument</label>
                    <select
                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
                        value={globalSettings?.instrumentId || 'violao'}
                        onChange={(e) => {
                            const instId = e.target.value;
                            const inst = INSTRUMENTS.find(i => i.id === instId);
                            if (inst && onGlobalSettingsChange) {
                                const baseTuning = inst.tunings[0];
                                const shift = globalSettings?.tuningShift || 0;
                                onGlobalSettingsChange({
                                    instrumentId: instId,
                                    tuningIndex: 0,
                                    tuning: calculateShiftedTuning(baseTuning, shift),
                                    numStrings: baseTuning.length
                                });
                            }
                        }}
                    >
                        {INSTRUMENTS.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                </div>
                )}

                {/* Tuning Selector */}
                {variant !== 'beats' && (
                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Tuning</label>
                    <select
                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
                        value={globalSettings?.tuningIndex || 0}
                        onChange={(e) => {
                            const idx = parseInt(e.target.value);
                            const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                            if (instrument && onGlobalSettingsChange) {
                                const baseTuning = instrument.tunings[idx];
                                const shift = globalSettings?.tuningShift || 0;
                                onGlobalSettingsChange({
                                    tuningIndex: idx,
                                    tuning: calculateShiftedTuning(baseTuning, shift)
                                });
                            }
                        }}
                    >
                        {INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'))?.tunings.map((t, idx) => (
                            <option key={idx} value={idx}>{t.join(" ")}</option>
                        ))}
                    </select>
                </div>
                )}

                {/* Tuning Shift / Capo Selector */}
                {variant !== 'beats' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                            {t('settings.labels.capo_color')} / Tuning Shift
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const current = globalSettings?.tuningShift || 0;
                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                const newShift = Math.max(-5, current - 1);

                                if (animationType === 'guitar-fretboard') {
                                    const newCapo = Math.max(0, newShift);
                                    if (measures && measures.length > 0) {
                                        const allNotesValid = measures.every(m =>
                                            m.notes.every(n =>
                                                !n.positions.some(pos => {
                                                    if (pos.avoid) return false;
                                                    return (pos.fret + newCapo) > 24;
                                                })
                                            )
                                        );
                                        if (!allNotesValid) return;
                                    }
                                }

                                onGlobalSettingsChange?.({
                                    tuningShift: newShift,
                                    capo: Math.max(0, newShift),
                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                });
                            }}
                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                        >-</button>
                        <div className="flex-1 text-center font-bold text-zinc-300 bg-zinc-950/30 rounded-lg py-1.5 border border-zinc-800/50">
                            {(() => {
                                const shift = globalSettings?.tuningShift || 0;
                                const tuning = globalSettings?.tuning || [];
                                const tuningDisplay = tuning.length > 0 ? `(${tuning.join(" ")})` : "";

                                if (shift === 0) return `STANDARD ${tuningDisplay}`;
                                if (shift > 0) return `CAPO ${shift} ${tuningDisplay}`;
                                return `DOWN ${Math.abs(shift)} ${tuningDisplay}`;
                            })()}
                        </div>
                        <button
                            onClick={() => {
                                const current = globalSettings?.tuningShift || 0;
                                const instrument = INSTRUMENTS.find(i => i.id === (globalSettings?.instrumentId || 'violao'));
                                const baseTuning = instrument?.tunings[globalSettings?.tuningIndex || 0] || ["E", "A", "D", "G", "B", "e"];
                                const newShift = Math.min(24, current + 1);

                                if (animationType === 'guitar-fretboard') {
                                    const newCapo = Math.max(0, newShift);
                                    if (measures && measures.length > 0) {
                                        const allNotesValid = measures.every(m =>
                                            m.notes.every(n =>
                                                !n.positions.some(pos => {
                                                    if (pos.avoid) return false;
                                                    return (pos.fret + newCapo) > 24;
                                                })
                                            )
                                        );
                                        if (!allNotesValid) return;
                                    }
                                }

                                onGlobalSettingsChange?.({
                                    tuningShift: newShift,
                                    capo: Math.max(0, newShift),
                                    tuning: calculateShiftedTuning(baseTuning, newShift)
                                });
                            }}
                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
                        >+</button>
                    </div>
                </div>
                )}


                {/* View Transform / Rotation */}
                {variant !== 'beats' && (
                <div className="space-y-3 pt-6 border-t border-zinc-900/50">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                            {t('settings.headers.view_transform')}
                        </label>
                    </div>

                    <div className="space-y-3 p-3 bg-zinc-950/40 rounded-2xl border border-white/[0.03] shadow-inner">
                        <div className="space-y-1.5 cursor-default">
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight pl-0.5">{t('settings.labels.rotation')}</span>
                            <div className="grid grid-cols-3 gap-2">
                                {(globalSettings?.numFrets && globalSettings.numFrets > 12
                                    ? [
                                        { label: '0°', val: 0, mirror: false },
                                        { label: '180°', val: 0, mirror: true }
                                    ]
                                    : [
                                        { label: '0°', val: 0, mirror: false },
                                        { label: '90°', val: 90, mirror: false },
                                        { label: '270°', val: 270, mirror: true }
                                    ]
                                ).map((opt) => {
                                    const isSelected = theme?.global?.rotation === opt.val && theme?.global?.mirror === opt.mirror;

                                    return (
                                        <button
                                            key={`${opt.val}-${opt.mirror}`}
                                            onClick={() => {
                                                setTheme?.((prev: any) => ({
                                                    ...prev,
                                                    global: {
                                                        ...(prev.global || {}),
                                                        rotation: opt.val,
                                                        mirror: opt.mirror
                                                    }
                                                }));
                                            }}
                                            className={`py-2 rounded-xl border text-[10px] font-black transition-all ${isSelected
                                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

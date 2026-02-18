import React from 'react';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';
import { ChevronDown } from 'lucide-react';
import { ManualChordData } from '@/modules/editor/domain/types';

interface HarmonyPanelProps {
    chordData: ManualChordData;
    onChordChange: (updates: Partial<ManualChordData>) => void;
    onToggleExtension: (base: string, accidental: string) => void;
    onToggleBass: (note: string, accidental?: string) => void;
}

export const HarmonyPanel: React.FC<HarmonyPanelProps> = ({
    chordData,
    onChordChange,
    onToggleExtension,
    onToggleBass
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-3 animate-in slide-in-from-right-2 duration-300">
            {/* Root Selection */}
            <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between px-0.5">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{t('harmony.root_tone')}</label>
                    <button
                        onClick={() => onChordChange({ showChordName: !chordData.showChordName })}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${chordData.showChordName !== false ? 'bg-primary/10 text-primary' : 'bg-black/40 text-zinc-600'}`}
                    >
                        <span className="text-[8px] font-black uppercase tracking-tighter">{t('harmony.show_name')}</span>
                        <div className={`w-6 h-3.5 rounded-full relative transition-all duration-300 ${chordData.showChordName !== false ? 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-zinc-800'}`}>
                            <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all duration-300 ${chordData.showChordName !== false ? 'left-3' : 'left-0.5'}`} />
                        </div>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                        const currentBase = chordData.root.replace(/[#b]/g, '');
                        const isActive = currentBase === note;
                        return (
                            <button
                                key={note}
                                onClick={() => {
                                    const currentAcc = chordData.root.includes('#') ? '#' : chordData.root.includes('b') ? 'b' : '';
                                    onChordChange({ root: note + currentAcc });
                                }}
                                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${isActive ? 'bg-primary text-black shadow-[0_0_12px_rgba(7,182,213,0.3)]' : 'bg-black/40 text-zinc-500 hover:bg-white/10 hover:text-white'}`}
                            >
                                {note}
                            </button>
                        );
                    })}
                </div>
                <div className="flex gap-1.5">
                    {[{ label: 'Nat', val: '' }, { label: '♯', val: '#' }, { label: '♭', val: 'b' }].map((acc) => {
                        const currentBase = chordData.root.replace(/[#b]/g, '') || 'C';
                        const currentAcc = chordData.root.includes('#') ? '#' : chordData.root.includes('b') ? 'b' : '';
                        const isAccActive = currentAcc === acc.val;
                        return (
                            <button
                                key={acc.label}
                                onClick={() => onChordChange({ root: currentBase + acc.val })}
                                className={`flex-1 h-7 rounded-lg text-[9px] font-black uppercase transition-all border ${isAccActive ? 'bg-white/10 text-primary border-primary/30' : 'bg-black/20 text-zinc-600 border-white/5 hover:bg-white/5'}`}
                            >
                                {acc.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quality & Extensions */}
            <div className="space-y-2.5 bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">{t('harmony.quality')}</label>
                    <div className="relative">
                        <select
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-black text-zinc-300 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                            value={chordData.quality}
                            onChange={(e) => onChordChange({ quality: e.target.value })}
                        >
                            <option value="">{t('harmony.qualities.major')}</option>
                            <option value="m">{t('harmony.qualities.minor')}</option>
                            <option value="dim">{t('harmony.qualities.dim')}</option>
                            <option value="aug">{t('harmony.qualities.aug')}</option>
                            <option value="sus2">{t('harmony.qualities.sus2')}</option>
                            <option value="sus4">{t('harmony.qualities.sus4')}</option>
                            <option value="maj">{t('harmony.qualities.maj')}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">{t('harmony.extensions')}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {['5', '6', '7', '7+', '9', '11', '13'].map(base => {
                            const currentExts = chordData.extensions || [];
                            const isFlatActive = currentExts.includes('b' + base);
                            const isNatActive = currentExts.includes(base);
                            const isSharpActive = currentExts.includes('#' + base);
                            const isActive = isFlatActive || isNatActive || isSharpActive;

                            return (
                                <div
                                    key={base}
                                    className={`flex h-7 rounded-lg overflow-hidden border transition-all duration-300 ${isActive
                                        ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(7,182,213,0.1)]'
                                        : 'bg-black/20 border-white/5'
                                        }`}
                                >
                                    <button
                                        onClick={() => onToggleExtension(base, 'b')}
                                        className={`flex-1 text-[9px] font-black transition-all border-r border-white/5 ${isFlatActive ? 'bg-primary text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                                            }`}
                                    >
                                        b
                                    </button>
                                    <button
                                        onClick={() => onToggleExtension(base, '')}
                                        className={`flex-[2] text-[10px] font-black transition-all border-r border-white/5 ${isNatActive ? 'bg-primary text-black' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                            }`}
                                    >
                                        {base}
                                    </button>
                                    <button
                                        onClick={() => onToggleExtension(base, '#')}
                                        className={`flex-1 text-[9px] font-black transition-all ${isSharpActive ? 'bg-primary text-black' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                                            }`}
                                    >
                                        #
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bass Selection */}
            <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5">
                <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-0.5">{t('harmony.bass_note')}</label>
                <div className="grid grid-cols-2 gap-1.5">
                    {/* Root Toggle */}
                    <button
                        onClick={() => onToggleBass('Root')}
                        className={`col-span-2 py-1.5 rounded-lg text-[10px] font-black border transition-all ${chordData.bass === 'Root' || !chordData.bass ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(7,182,213,0.1)]' : 'bg-black/20 border-white/5 text-zinc-500 hover:text-white'}`}
                    >
                        {t('harmony.root')}
                    </button>

                    {/* Musical Notes with Alterations */}
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                        const currentBass = chordData.bass || '';
                        const isFlatActive = currentBass === '/' + note + 'b';
                        const isNatActive = currentBass === '/' + note;
                        const isSharpActive = currentBass === '/' + note + '#';
                        const isActive = isFlatActive || isNatActive || isSharpActive;

                        return (
                            <div key={note} className={`flex h-7 rounded-lg overflow-hidden border transition-all ${isActive ? 'border-primary/40' : 'border-white/5'}`}>
                                <button
                                    onClick={() => onToggleBass(note, 'b')}
                                    className={`w-6 text-[8px] font-black border-r border-white/5 transition-all ${isFlatActive ? 'bg-primary text-black' : 'bg-black/20 text-zinc-600 hover:bg-white/5 hover:text-zinc-300'}`}
                                >
                                    ♭
                                </button>
                                <button
                                    onClick={() => onToggleBass(note, '')}
                                    className={`flex-1 text-[9px] font-black border-r border-white/5 transition-all ${isNatActive ? 'bg-primary text-black' : 'bg-black/20 text-zinc-500 hover:bg-white/5 hover:text-zinc-200'}`}
                                >
                                    {note}
                                </button>
                                <button
                                    onClick={() => onToggleBass(note, '#')}
                                    className={`w-6 text-[8px] font-black transition-all ${isSharpActive ? 'bg-primary text-black' : 'bg-black/20 text-zinc-600 hover:bg-white/5 hover:text-zinc-300'}`}
                                >
                                    ♯
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

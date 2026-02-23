import React, { useState } from "react";
import { Note, NoteType, Articulation } from "../../domain/types";
import { Circle, Diamond, X, Square, Clock, Trash2, Settings, Guitar, Undo2, Redo2, Plus, Minus, FileUp, Loader2, Eye, EyeOff } from "lucide-react";
import { GenericSidebar } from "@/shared/components/layout/GenericSidebar";
import { cn } from "@/shared/lib/utils";
import { VexFlowRhythmIcon } from "@/modules/chords/presentation/components/VexFlowRhythmIcon";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";
import { MSCZParser } from "@/modules/core/infrastructure/services/mscz-parser";
import { convertScoreToAnimatorNotes } from "../../infrastructure/mscz-converter";

const durationMap: Record<number, string> = {
    4.0: 'w',
    2.0: 'h',
    1.0: 'q',
    0.5: '8',
    0.25: '16',
    0.125: '32',
};

interface TabAnimatorSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedNote: Note | null;
    onUpdateNote: (id: string, updates: Partial<Note>) => void;
    onDeleteNote: (id: string) => void;
    onAddPosition: (noteId: string) => void;
    onRemovePosition: (noteId: string, index: number) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    bpm: number;
    setBpm: (bpm: number) => void;
    isMobile?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    onSetNotes: (notes: Note[]) => void;
    showSoundhole: boolean;
    setShowSoundhole: (show: boolean) => void;
}

const TabAnimatorSidebar: React.FC<TabAnimatorSidebarProps> = ({
    isOpen,
    onClose,
    selectedNote,
    onUpdateNote,
    onDeleteNote,
    onAddPosition,
    onRemovePosition,
    speed,
    setSpeed,
    bpm,
    setBpm,
    isMobile = false,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onSetNotes,
    showSoundhole,
    setShowSoundhole
}) => {
    const [activeCategory, setActiveCategory] = useState<'config' | 'editor'>('config');
    const [editorTab, setEditorTab] = useState<'braco' | 'duracao' | 'acoes'>('braco');
    const [activePositionIndex, setActivePositionIndex] = useState<number>(0);
    const [isImporting, setIsImporting] = useState(false);

    // Automatically switch to editor tab when a new note is selected
    React.useEffect(() => {
        if (selectedNote) {
            setActiveCategory('editor');
            setEditorTab('braco');
            setActivePositionIndex(0);
        }
    }, [selectedNote?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const navItems = [
        { id: 'config', label: 'PROJETO', icon: Settings },
        { id: 'editor', label: 'EDITOR', icon: Guitar },
    ];

    const headerAction = (
        <div className="flex items-center gap-1.5 mr-auto">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={cn(
                    "p-2 rounded-xl border transition-all duration-300",
                    canUndo
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                        : "bg-transparent border-transparent text-zinc-600 cursor-not-allowed"
                )}
                title="Desfazer (Ctrl+Z)"
            >
                <Undo2 className="w-4 h-4" />
            </button>
            <button
                onClick={onRedo}
                disabled={!canRedo}
                className={cn(
                    "p-2 rounded-xl border transition-all duration-300",
                    canRedo
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                        : "bg-transparent border-transparent text-zinc-600 cursor-not-allowed"
                )}
                title="Refazer (Ctrl+Shift+Z)"
            >
                <Redo2 className="w-4 h-4" />
            </button>
        </div>
    );

    const activePosition = selectedNote?.positions[activePositionIndex] || null;

    return (
        <GenericSidebar
            isOpen={isOpen}
            onClose={onClose}
            title="Tab Animator"
            side="left"
            className="border-r border-white/5 bg-background-dark/40 backdrop-blur-2xl"
            contentClassName="p-0 flex flex-col"
            headerAction={headerAction}
        >
            <div className="flex h-full overflow-hidden">
                {/* Vertical Navigation Rail */}
                <div className="w-16 bg-white/[0.02] border-r border-white/[0.05] flex flex-col items-center py-6 gap-4 backdrop-blur-xl shrink-0">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeCategory === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveCategory(item.id as any)}
                                className={cn(
                                    "relative group p-3 rounded-2xl transition-all duration-500",
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-500 shadow-premium-glow ring-1 ring-emerald-500/20"
                                        : "text-slate-500 hover:text-white hover:bg-white/[0.05]"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
                                <span className="absolute left-full ml-4 px-3 py-1.5 bg-background-dark/95 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-2xl border border-white/[0.1] uppercase tracking-[0.2em] backdrop-blur-md">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {/* Secondary Context Header */}
                    <div className="h-16 shrink-0 border-b border-white/[0.05] flex items-center px-6 bg-white/[0.01] backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 leading-none mb-1">
                                TAB ANIMATOR
                            </span>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">
                                {activeCategory === 'config' ? 'PROJETO' : 'PROPRIEDADES DA NOTA'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {activeCategory === 'config' ? (
                            <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6 animate-in slide-in-from-right-2 duration-300">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Configuração Global</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-zinc-300 uppercase leading-none mb-1">Tempo</span>
                                                <span className="text-[8px] font-black text-zinc-600 uppercase leading-none">Sincronizar Animação</span>
                                            </div>
                                            <button className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest shadow-premium-glow">
                                                {bpm} BPM
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl p-2 h-16">
                                            <button
                                                onClick={() => setBpm(Math.max(40, bpm - 1))}
                                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>

                                            <div className="flex-1 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-black text-white leading-none tabular-nums">
                                                    {bpm}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => setBpm(Math.min(300, bpm + 1))}
                                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Velocidade (px/s)</label>
                                        <input
                                            type="range"
                                            min="100"
                                            max="800"
                                            value={speed}
                                            onChange={(e) => setSpeed(Number(e.target.value))}
                                            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <div className="flex justify-between font-mono text-[10px] text-emerald-500/80">
                                            <span>100 px/s</span>
                                            <span className="font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{speed}</span>
                                            <span>800 px/s</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-zinc-300 uppercase leading-none mb-1">Visualização</span>
                                                <span className="text-[8px] font-black text-zinc-600 uppercase leading-none">Exibir Boca do Violão</span>
                                            </div>
                                            <button
                                                onClick={() => setShowSoundhole(!showSoundhole)}
                                                className={cn(
                                                    "w-12 h-6 rounded-full transition-all relative flex items-center px-1 border",
                                                    showSoundhole
                                                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full transition-all flex items-center justify-center",
                                                    showSoundhole
                                                        ? "translate-x-6 bg-emerald-500"
                                                        : "translate-x-0 bg-zinc-700"
                                                )}>
                                                    {showSoundhole ? <Eye className="w-2.5 h-2.5 text-black" /> : <EyeOff className="w-2.5 h-2.5" />}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Ações do Projeto</h3>

                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".mscz"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    setIsImporting(true);
                                                    try {
                                                        const score = await MSCZParser.parse(file);
                                                        const { notes: animatorNotes, bpm: newBpm } = convertScoreToAnimatorNotes(score);
                                                        onSetNotes(animatorNotes);
                                                        setBpm(newBpm);
                                                        setActiveCategory('editor'); // Switch to editor after successful import
                                                    } catch (err) {
                                                        console.error("Failed to import MSCZ:", err);
                                                        alert("Erro ao importar arquivo MuseScore. Verifique se o arquivo é válido.");
                                                    } finally {
                                                        setIsImporting(false);
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                disabled={isImporting}
                                            />
                                            <div className={cn(
                                                "flex items-center gap-3 w-full p-4 rounded-2xl border border-dashed transition-all",
                                                isImporting
                                                    ? "bg-white/5 border-zinc-800 opacity-50"
                                                    : "border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                                            )}>
                                                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                                                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Importar Arquivo</span>
                                                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Suporta .mscz (MuseScore)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-300">
                                {/* Sub-Tab Navigation */}
                                <div className="px-6 pt-2 pb-6 shrink-0">
                                    <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-gradient-to-b from-black/40 to-black/20 p-1 shadow-[inset_0_0_24px_rgba(0,0,0,0.55)]">
                                        {[
                                            { id: 'braco', label: 'BRAÇO' },
                                            { id: 'duracao', label: 'DURAÇÃO' },
                                            { id: 'acoes', label: 'AÇÕES' },
                                        ].map((tab) => {
                                            const isActive = editorTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setEditorTab(tab.id as any)}
                                                    className={cn(
                                                        "group relative flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                        isActive
                                                            ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-premium-glow"
                                                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                                                    )}
                                                >
                                                    {tab.label}
                                                    <span className={cn(
                                                        "absolute -bottom-1 left-1/2 h-[1px] w-6 -translate-x-1/2 rounded-full transition-all",
                                                        isActive ? "bg-emerald-500 shadow-premium-glow" : "bg-transparent"
                                                    )} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-0">
                                    {selectedNote ? (
                                        <div className="space-y-6">
                                            {/* BRAÇO TAB */}
                                            {editorTab === 'braco' && (
                                                <div className="space-y-8 animate-in fade-in duration-500">
                                                    <div className="space-y-4">
                                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo de Nota</h3>
                                                        <div className="grid grid-cols-4 gap-1.5">
                                                            {[
                                                                { id: 'normal', label: 'PADRÃO', icon: Circle },
                                                                { id: 'ghost', label: 'ABAFADA', icon: X },
                                                                { id: 'diamond', label: 'HARMÔNICO', icon: Diamond },
                                                                { id: 'square', label: 'TAPPING', icon: Square },
                                                            ].map((type) => {
                                                                const Icon = type.icon;
                                                                const isActive = selectedNote.type === type.id || (!selectedNote.type && type.id === 'normal');
                                                                return (
                                                                    <button
                                                                        key={type.id}
                                                                        onClick={() => onUpdateNote(selectedNote.id, { type: type.id as any })}
                                                                        className={cn(
                                                                            "flex flex-col items-center justify-center gap-2 p-2 rounded-xl border transition-all duration-300 min-h-[54px]",
                                                                            isActive
                                                                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-premium-glow"
                                                                                : "bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5"
                                                                        )}
                                                                        title={type.label}
                                                                    >
                                                                        <Icon className="w-4 h-4" />
                                                                        <span className="text-[7px] font-black uppercase text-center leading-tight">{type.label}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fretboard.Map</h3>
                                                            <button
                                                                onClick={() => onAddPosition(selectedNote.id)}
                                                                className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20 transition-all"
                                                            >
                                                                + Adicionar Corda
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 -mx-1 px-1 custom-scrollbar no-scrollbar">
                                                            {selectedNote.positions.length > 0 ? (
                                                                selectedNote.positions.map((pos, idx) => {
                                                                    const artAbbr = pos.articulation
                                                                        ? (({ hammer: 'H', pull: 'P', slide: '/', bend: 'b', 'bend-release': 'br', tap: 'T', vibrato: '~' } as Record<string, string>)[pos.articulation])
                                                                        : null;
                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            onClick={() => setActivePositionIndex(idx)}
                                                                            className={cn(
                                                                                "flex shrink-0 items-center gap-2 px-2.5 py-2 rounded-xl border transition-all cursor-pointer group",
                                                                                activePositionIndex === idx
                                                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-premium-glow"
                                                                                    : "bg-black/20 border-white/5 hover:border-white/10"
                                                                            )}
                                                                        >
                                                                            <span className="text-[10px] font-black whitespace-nowrap">
                                                                                C{pos.stringIndex + 1} / N{pos.fret}
                                                                                <span className="ml-1 opacity-40">({idx + 1})</span>
                                                                            </span>
                                                                            <div className="flex items-center gap-1">
                                                                                {artAbbr && (
                                                                                    <span className="text-[8px] font-black font-mono text-emerald-400">
                                                                                        {artAbbr}
                                                                                    </span>
                                                                                )}
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); onRemovePosition(selectedNote.id, idx); }}
                                                                                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-md text-zinc-500 hover:text-rose-400 transition-all"
                                                                                >
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="w-full py-4 bg-black/20 border border-dashed border-white/5 rounded-2xl text-center">
                                                                    <p className="text-[10px] text-zinc-600 font-medium italic">Selecione o braço para adicionar</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Articulações</h3>
                                                        <div className="grid grid-cols-4 gap-1.5">
                                                            {([
                                                                { id: 'none', label: 'Não', abbr: '—' },
                                                                { id: 'hammer', label: 'H.On', abbr: 'H' },
                                                                { id: 'pull', label: 'P.Off', abbr: 'P' },
                                                                { id: 'slide', label: 'Sld', abbr: '/' },
                                                                { id: 'bend', label: 'Bnd', abbr: 'b' },
                                                                { id: 'bend-release', label: 'B.R', abbr: 'br' },
                                                                { id: 'tap', label: 'Tap', abbr: 'T' },
                                                                { id: 'vibrato', label: 'Vib', abbr: '~' },
                                                            ] as { id: Articulation | 'none'; label: string; abbr: string }[]).map((art) => {
                                                                const current = activePosition?.articulation ?? 'none';
                                                                const isActive = current === art.id;
                                                                return (
                                                                    <button
                                                                        key={art.id}
                                                                        onClick={() => {
                                                                            if (!activePosition) return;
                                                                            const newPositions = [...selectedNote.positions];
                                                                            newPositions[activePositionIndex] = {
                                                                                ...activePosition,
                                                                                articulation: art.id === 'none' ? undefined : art.id as Articulation
                                                                            };
                                                                            onUpdateNote(selectedNote.id, { positions: newPositions });
                                                                        }}
                                                                        className={cn(
                                                                            "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl border text-center transition-all duration-300 min-h-[48px]",
                                                                            isActive
                                                                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-premium-glow"
                                                                                : "bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5 hover:text-white"
                                                                        )}
                                                                    >
                                                                        <span className={cn("text-sm font-black leading-none font-mono", isActive ? "text-emerald-400" : "text-zinc-400")}>{art.abbr}</span>
                                                                        <span className="text-[7px] font-black uppercase tracking-wider leading-none">{art.label}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {activePosition && (
                                                        <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in duration-300">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-cyan-glow" />
                                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Editando Corda {activePositionIndex + 1}</span>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">1. Selecionar Corda</label>
                                                                    <div className="grid grid-cols-6 gap-1">
                                                                        {[6, 5, 4, 3, 2, 1].map(s => (
                                                                            <button
                                                                                key={s}
                                                                                onClick={() => {
                                                                                    const newPositions = [...selectedNote.positions];
                                                                                    newPositions[activePositionIndex] = { ...newPositions[activePositionIndex], stringIndex: s - 1 };
                                                                                    onUpdateNote(selectedNote.id, { positions: newPositions });
                                                                                }}
                                                                                className={cn(
                                                                                    "h-9 rounded-lg border text-xs font-black transition-all",
                                                                                    activePosition.stringIndex === s - 1
                                                                                        ? "bg-emerald-500 border-emerald-500 text-black shadow-premium-glow"
                                                                                        : "bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5"
                                                                                )}
                                                                            >
                                                                                {s}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">2. Valor da Nota</label>
                                                                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Nota {activePosition.fret}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl p-2 h-16">
                                                                        <button
                                                                            onClick={() => {
                                                                                const val = Math.max(0, activePosition.fret - 1);
                                                                                const newPositions = [...selectedNote.positions];
                                                                                newPositions[activePositionIndex] = { ...newPositions[activePositionIndex], fret: val };
                                                                                onUpdateNote(selectedNote.id, { positions: newPositions });
                                                                            }}
                                                                            className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                                                                        >
                                                                            <Minus className="w-5 h-5" />
                                                                        </button>

                                                                        <div className="flex-1 flex flex-col items-center justify-center">
                                                                            <span className="text-2xl font-black text-white leading-none tabular-nums">
                                                                                {activePosition.fret}
                                                                            </span>
                                                                        </div>

                                                                        <button
                                                                            onClick={() => {
                                                                                const val = Math.min(24, activePosition.fret + 1);
                                                                                const newPositions = [...selectedNote.positions];
                                                                                newPositions[activePositionIndex] = { ...newPositions[activePositionIndex], fret: val };
                                                                                onUpdateNote(selectedNote.id, { positions: newPositions });
                                                                            }}
                                                                            className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                                                                        >
                                                                            <Plus className="w-5 h-5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* DURAÇÃO TAB */}
                                            {editorTab === 'duracao' && (
                                                <div className="space-y-8 animate-in fade-in duration-500">
                                                    <div className="space-y-4">
                                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Duração</h3>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[
                                                                { label: 'SEMIBREVE', value: 4.0 },
                                                                { label: 'MÍNIMA', value: 2.0 },
                                                                { label: 'SEMÍNIMA', value: 1.0 },
                                                                { label: 'COLCHEIA', value: 0.5 },
                                                                { label: 'SEMICOLCHEIA', value: 0.25 },
                                                                { label: 'FUSA', value: 0.125 },
                                                            ].map((dur) => {
                                                                const currentBeats = (selectedNote.duration * bpm) / 60;
                                                                const isActive = Math.abs(currentBeats - dur.value) < 0.01;
                                                                return (
                                                                    <button
                                                                        key={dur.label}
                                                                        onClick={() => onUpdateNote(selectedNote.id, { duration: (dur.value * 60) / bpm })}
                                                                        className={cn(
                                                                            "aspect-[5/6] rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                                                                            isActive
                                                                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-premium-glow"
                                                                                : "bg-black/20 border-white/5 text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                                                                        )}
                                                                    >
                                                                        <VexFlowRhythmIcon
                                                                            duration={durationMap[dur.value]}
                                                                            className="w-8 h-10"
                                                                            fillColor={isActive ? '#10b981' : '#52525b'}
                                                                        />
                                                                        <span className="text-[7px] font-black uppercase text-center tracking-tighter">{dur.label}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tempo de Início (s)</label>
                                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{selectedNote.time.toFixed(2)}s</span>
                                                        </div>

                                                        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl p-2 h-16">
                                                            <button
                                                                onClick={() => {
                                                                    const val = Math.max(0, selectedNote.time - 0.1);
                                                                    onUpdateNote(selectedNote.id, { time: val });
                                                                }}
                                                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                                                            >
                                                                <Minus className="w-5 h-5" />
                                                            </button>

                                                            <div className="flex-1 flex flex-col items-center justify-center">
                                                                <span className="text-2xl font-black text-white leading-none tabular-nums">
                                                                    {selectedNote.time.toFixed(1)}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    const val = selectedNote.time + 0.1;
                                                                    onUpdateNote(selectedNote.id, { time: val });
                                                                }}
                                                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                                                            >
                                                                <Plus className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* AÇÕES TAB */}
                                            {editorTab === 'acoes' && (
                                                <div className="space-y-8 animate-in fade-in duration-500">
                                                    <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-4">
                                                        <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Ferramentas de Nota</h3>
                                                        <button
                                                            onClick={() => onDeleteNote(selectedNote.id)}
                                                            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Excluir Nota
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                                            <div className="size-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-700">
                                                <Guitar className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-widest">Nenhuma Seleção</p>
                                                <p className="text-[10px] text-zinc-500 font-medium px-10 mt-1">
                                                    Selecione uma nota na linha do tempo para editar suas propriedades.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GenericSidebar>
    );
};

export { TabAnimatorSidebar };

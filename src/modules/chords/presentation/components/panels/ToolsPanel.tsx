import React, { useState } from 'react';
import { SidebarProps } from '../sidebar-types';
import { EmptyState } from './EmptyState';
import { Minus, Plus, Wrench } from 'lucide-react';

export const ToolsPanel: React.FC<SidebarProps> = ({
    editingNote,
    activeMeasure,
    onTransposeMeasure,
    onToggleAutoFinger
}) => {
    const [smartTranspose, setSmartTranspose] = useState(false);

    if (!activeMeasure) {
        return (
            <EmptyState
                icon={Wrench}
                title="Note Tools"
                description="Select a note to access advanced manipulation tools like selective transposition."
                features={[
                    "Selective Transpose",
                    "Semitone Shifts",
                    "Global Actions"
                ]}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 h-full flex flex-col">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{editingNote ? "Note Tools" : "Measure Tools"}</h3>

                {/* Transpose Section */}
                <div className="bg-zinc-950/40 rounded-3xl p-5 border border-white/[0.02] shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">
                                {editingNote ? "Selective" : "Measure"}
                            </span>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">
                                Transpose
                            </span>
                        </div>
                        <div
                            onClick={() => {
                                const newState = !smartTranspose;
                                setSmartTranspose(newState);
                                onToggleAutoFinger?.(newState);
                            }}
                            className={`px-3 py-1 rounded-full border cursor-pointer transition-all ${smartTranspose ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black leading-none">AUTO</span>
                                <span className="text-[8px] font-black leading-none mt-0.5">FINGER</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, -1, smartTranspose)}
                            className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-lg"
                        >
                            <Minus className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center justify-center min-w-[80px] h-14 bg-black/60 rounded-2xl border border-white/[0.05] shadow-inner">
                            <span className="text-[14px] font-black text-zinc-300 leading-none">1</span>
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Semitone</span>
                        </div>

                        <button
                            onClick={() => activeMeasure && onTransposeMeasure?.(activeMeasure.id, 1, smartTranspose)}
                            className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

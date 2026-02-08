"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

export type RenderFormat = 'mp4' | 'webm' | 'png-sequence';
export type RenderQuality = 'low' | 'medium' | 'high';

interface RenderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRender: (format: RenderFormat, quality: RenderQuality, fileName: string) => void;
    isRendering?: boolean;
    renderProgress?: number;
    renderStatus?: string;
}

export function RenderDialog({
    open,
    onOpenChange,
    onRender,
    isRendering = false,
    renderProgress = 0,
    renderStatus,
}: RenderDialogProps) {
    const [format, setFormat] = useState<RenderFormat>('mp4');
    const [quality, setQuality] = useState<RenderQuality>('medium');
    const [fileName, setFileName] = useState("Meu Acorde Animado");

    const handleRender = () => {
        onRender(format, quality, fileName);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] p-0 rounded-2xl overflow-hidden gap-0">

                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <span className="material-symbols-outlined">videocam</span>
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold tracking-tight text-white mb-0.5">Renderizar Animação</DialogTitle>
                            <DialogDescription className="text-xs text-slate-400">Escolha o formato e a qualidade para exportar sua animação.</DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* File Name Input */}
                    <section className="space-y-2">
                        <Label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="file-name">
                            <span className="material-symbols-outlined text-base text-slate-500">drive_file_rename_outline</span>
                            Nome do Arquivo
                        </Label>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-slate-200"
                            id="file-name"
                            placeholder="Meu Acorde Animado"
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    </section>

                    {/* Format Selection */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-slate-500">settings_suggest</span>
                            Formato de Saída
                        </h3>
                        <div className="space-y-3">
                            <label className="relative block cursor-pointer group">
                                <input checked={format === 'mp4'} onChange={() => setFormat('mp4')} className="peer sr-only" name="format" type="radio" />
                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all peer-checked:border-cyan-500 peer-checked:bg-cyan-500/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500/10 text-cyan-500">
                                            <span className="material-symbols-outlined">video_file</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-white">MP4</p>
                                            <p className="text-xs text-slate-400">Compatível com todos os players (recomendado)</p>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-cyan-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 scale-0 transition-transform peer-checked:scale-100"></div>
                                    </div>
                                </div>
                            </label>

                            <label className="relative block cursor-pointer group">
                                <input checked={format === 'webm'} onChange={() => setFormat('webm')} className="peer sr-only" name="format" type="radio" />
                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all peer-checked:border-cyan-500 peer-checked:bg-cyan-500/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-700/50 text-slate-300">
                                            <span className="material-symbols-outlined">language</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-white">WebM</p>
                                            <p className="text-xs text-slate-400">Renderização rápida, menor tamanho</p>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-cyan-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 scale-0 transition-transform peer-checked:scale-100"></div>
                                    </div>
                                </div>
                            </label>

                            <label className="relative block cursor-pointer group">
                                <input checked={format === 'png-sequence'} onChange={() => setFormat('png-sequence')} className="peer sr-only" name="format" type="radio" />
                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all peer-checked:border-cyan-500 peer-checked:bg-cyan-500/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-700/50 text-slate-300">
                                            <span className="material-symbols-outlined">imagesmode</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-white">Sequência PNG (ZIP)</p>
                                            <p className="text-xs text-slate-400">Uma imagem para cada acorde</p>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 peer-checked:border-cyan-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 scale-0 transition-transform peer-checked:scale-100"></div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Quality Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-slate-500">high_quality</span>
                                Qualidade
                            </h3>
                        </div>
                        <div className="relative">
                            <select
                                value={quality}
                                onChange={(e) => setQuality(e.target.value as RenderQuality)}
                                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all cursor-pointer text-slate-200"
                            >
                                <option className="bg-slate-900" value="low">Baixa (854x480, 480p)</option>
                                <option className="bg-slate-900" value="medium">Média (1280x720, 720p)</option>
                                <option className="bg-slate-900" value="high">Alta (1920x1080, 1080p)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Qualidades maiores resultam em arquivos maiores e tempo de renderização mais longo.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 flex items-center justify-end gap-3 border-t border-white/5">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 h-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleRender}
                        className="bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center gap-2 px-8 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all h-auto border-none"
                    >
                        <span className="material-symbols-outlined text-lg">videocam</span>
                        Renderizar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

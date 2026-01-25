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
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Video, FileVideo, FileJson, Loader2 } from "lucide-react";

export type RenderFormat = 'mp4' | 'webm' | 'json';
export type RenderQuality = 'low' | 'medium' | 'high' | 'ultra';

interface RenderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRender: (format: RenderFormat, quality: RenderQuality) => void;
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

    const handleRender = () => {
        onRender(format, quality);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-cyan-500" />
                        Renderizar Animação
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Escolha o formato e a qualidade para exportar sua animação de acordes.
                    </DialogDescription>
                </DialogHeader>

                {isRendering ? (
                    <div className="py-8 space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                            <div className="w-full max-w-xs">
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                                        style={{ width: `${renderProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-zinc-400 mt-2 text-center">
                                    {renderStatus || `Renderizando... ${Math.round(renderProgress)}%`}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Format Selection */}
                        <div className="space-y-3">
                            <Label className="text-white font-medium">Formato de Saída</Label>
                            <RadioGroup value={format} onValueChange={(v) => setFormat(v as RenderFormat)}>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <RadioGroupItem value="mp4" id="mp4" />
                                    <Label htmlFor="mp4" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <FileVideo className="w-4 h-4 text-cyan-500" />
                                        <div>
                                            <p className="text-white font-medium">MP4</p>
                                            <p className="text-xs text-zinc-500">Compatível com todos os players (recomendado)</p>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <RadioGroupItem value="webm" id="webm" />
                                    <Label htmlFor="webm" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <FileVideo className="w-4 h-4 text-indigo-500" />
                                        <div>
                                            <p className="text-white font-medium">WebM</p>
                                            <p className="text-xs text-zinc-500">Renderização rápida, menor tamanho</p>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <RadioGroupItem value="json" id="json" />
                                    <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <FileJson className="w-4 h-4 text-purple-500" />
                                        <div>
                                            <p className="text-white font-medium">JSON</p>
                                            <p className="text-xs text-zinc-500">Dados da animação para integração</p>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Quality Selection (only for video formats) */}
                        {(format === 'mp4' || format === 'webm') && (
                            <div className="space-y-3">
                                <Label className="text-white font-medium">Qualidade</Label>
                                <Select value={quality} onValueChange={(v) => setQuality(v as RenderQuality)}>
                                    <SelectTrigger className="bg-zinc-800 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-white/10">
                                        <SelectItem value="low" className="text-white hover:bg-white/5">
                                            Baixa (800x340, rápido)
                                        </SelectItem>
                                        <SelectItem value="medium" className="text-white hover:bg-white/5">
                                            Média (1200x510, balanceado)
                                        </SelectItem>
                                        <SelectItem value="high" className="text-white hover:bg-white/5">
                                            Alta (1920x816, 1080p)
                                        </SelectItem>
                                        <SelectItem value="ultra" className="text-white hover:bg-white/5">
                                            Ultra (3840x1632, 4K sem perdas)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-zinc-500">
                                    Qualidades maiores resultam em arquivos maiores e tempo de renderização mais longo.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {!isRendering && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="bg-transparent border-white/10 text-white hover:bg-white/5"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleRender}
                                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Renderizar
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

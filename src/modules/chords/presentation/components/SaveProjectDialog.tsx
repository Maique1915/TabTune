"use client";

import React, { useState, useEffect } from "react";
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
import { Save } from "lucide-react";

interface SaveProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string) => void;
    initialName?: string;
}

export function SaveProjectDialog({
    open,
    onOpenChange,
    onSave,
    initialName = "",
}: SaveProjectDialogProps) {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        if (open) {
            setName(initialName || "Meu Novo Projeto");
        }
    }, [open, initialName]);

    const handleSave = () => {
        if (name.trim()) {
            onSave(name);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Save className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">Salvar Projeto</DialogTitle>
                            <DialogDescription className="text-sm text-zinc-400">Dê um nome ao seu projeto para salvá-lo em sua biblioteca.</DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-name" className="text-sm font-medium text-zinc-400">
                            Nome do Projeto
                        </Label>
                        <input
                            id="project-name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-zinc-600 text-white"
                            placeholder="Ex: Minha Composição 01"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                            }}
                            autoFocus
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 flex items-center justify-end gap-3 border-t border-white/5 bg-white/[0.02]">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all h-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all h-auto border-none"
                    >
                        Salvar Projeto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

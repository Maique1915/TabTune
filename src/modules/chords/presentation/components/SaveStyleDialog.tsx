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
import { Palette, Save, Plus } from "lucide-react";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";

interface SaveStyleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string, overwrite?: boolean) => void;
    initialName?: string;
    isActiveStyle?: boolean;
}

export function SaveStyleDialog({
    open,
    onOpenChange,
    onSave,
    initialName = "",
    isActiveStyle = false,
}: SaveStyleDialogProps) {
    const { t } = useTranslation();
    const [name, setName] = useState(initialName);

    const [prevOpen, setPrevOpen] = useState(false);
    const [prevInitialName, setPrevInitialName] = useState(initialName);

    if (open !== prevOpen || (open && initialName !== prevInitialName)) {
        setPrevOpen(open);
        setPrevInitialName(initialName);
        if (open) {
            setName(initialName || t('settings.save_dialog.default_name'));
        }
    }

    const handleSaveAsNew = () => {
        if (name.trim()) {
            onSave(name, false);
            onOpenChange(false);
        }
    };

    const handleUpdate = () => {
        onSave(name, true);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(236,72,153,0.15)] rounded-3xl overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="p-8 border-b border-white/5 relative bg-gradient-to-br from-white/[0.03] to-transparent">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                            <Palette className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold text-white tracking-tight mb-0.5">{t('settings.save_dialog.title')}</DialogTitle>
                            <DialogDescription className="text-xs text-zinc-400 font-medium leading-relaxed">
                                {isActiveStyle
                                    ? t('settings.save_dialog.edit_desc')
                                    : t('settings.save_dialog.new_desc')
                                }
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2.5">
                        <Label htmlFor="style-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                            {t('settings.save_dialog.style_name')}
                        </Label>
                        <div className="relative group">
                            <input
                                id="style-name"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 outline-none transition-all placeholder:text-zinc-700 text-white font-semibold"
                                placeholder={t('settings.save_dialog.placeholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveAsNew();
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 flex items-center justify-end gap-3 border-t border-white/5 bg-black/20">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="px-6 h-11 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        {t('settings.save_dialog.cancel')}
                    </Button>

                    <div className="flex items-center gap-2">
                        {isActiveStyle && (
                            <Button
                                onClick={handleUpdate}
                                className="h-11 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-bold px-6 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider text-[10px]"
                            >
                                <Save className="w-3.5 h-3.5 text-pink-500" />
                                {t('settings.save_dialog.update')}
                            </Button>
                        )}

                        <Button
                            onClick={handleSaveAsNew}
                            disabled={!name.trim()}
                            className="h-11 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-pink-500/20 transition-all border-none flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider text-[10px]"
                        >
                            <Plus className="w-4 h-4" />
                            {isActiveStyle ? t('settings.save_dialog.save_new') : t('settings.save_dialog.save')}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

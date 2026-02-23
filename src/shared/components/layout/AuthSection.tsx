"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { ShortcutsModal } from "./ShortcutsModal";
import { Keyboard } from "lucide-react";

interface AuthSectionProps {
    variant?: "header" | "landing";
}

export function AuthSection({ variant = "header" }: AuthSectionProps) {
    const { language, setLanguage, t } = useTranslation();

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r pr-4 mr-2 border-white/10">
                <Languages size={14} className="text-zinc-500" />
                <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                    <SelectTrigger className="w-[45px] h-8 bg-transparent border-none text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white focus:ring-0 focus:ring-offset-0 px-0 gap-1 shadow-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[70px] bg-zinc-900 border-white/5 text-zinc-400 rounded-xl shadow-2xl">
                        <SelectItem value="en" className="text-[10px] font-bold focus:bg-white/5 focus:text-white cursor-pointer justify-center pl-2">EN</SelectItem>
                        <SelectItem value="pt" className="text-[10px] font-bold focus:bg-white/5 focus:text-white cursor-pointer justify-center pl-2">PT</SelectItem>
                        <SelectItem value="es" className="text-[10px] font-bold focus:bg-white/5 focus:text-white cursor-pointer justify-center pl-2">ES</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ShortcutsModal>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-primary transition-all border border-transparent hover:border-white/5 group mr-2">
                    <Keyboard size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{t('shortcuts.title') || 'Atalhos'}</span>
                </button>
            </ShortcutsModal>
        </div>
    );
}

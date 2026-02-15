"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface ShortcutGroupProps {
    title: string;
    shortcuts: { key: string; description: string }[];
}

const ShortcutGroup = ({ title, shortcuts }: ShortcutGroupProps) => (
    <div className="mb-6 last:mb-0">
        <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">{title}</h3>
        <div className="space-y-2">
            {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-muted-foreground mr-4">{s.description}</span>
                    <kbd className="inline-flex h-6 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white opacity-100">
                        {s.key}
                    </kbd>
                </div>
            ))}
        </div>
    </div>
);

export function ShortcutsModal({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();

    const sections = [
        {
            title: t('shortcuts.groups.navigation') || 'Navigation',
            shortcuts: [
                { key: t('shortcuts.keys.arrows'), description: t('shortcuts.keys.arrows_desc') },
                { key: t('shortcuts.keys.alt_arrows'), description: t('shortcuts.keys.alt_arrows_desc') },
            ]
        },
        {
            title: t('shortcuts.groups.editing') || 'Editing',
            shortcuts: [
                { key: t('shortcuts.keys.plus'), description: t('shortcuts.keys.plus_desc') },
                { key: t('shortcuts.keys.shift_plus'), description: t('shortcuts.keys.shift_plus_desc') },
                { key: t('shortcuts.keys.ctrl_plus'), description: t('shortcuts.keys.ctrl_plus_desc') },
                { key: t('shortcuts.keys.minus'), description: t('shortcuts.keys.minus_desc') },
                { key: t('shortcuts.keys.shift_minus'), description: t('shortcuts.keys.shift_minus_desc') },
                { key: t('shortcuts.keys.ctrl_minus'), description: t('shortcuts.keys.ctrl_minus_desc') },
                { key: t('shortcuts.keys.ctrl_d'), description: t('shortcuts.keys.ctrl_d_desc') },
            ]
        },
        {
            title: t('shortcuts.groups.advanced') || 'Advanced',
            shortcuts: [
                { key: t('shortcuts.keys.shift_arrows'), description: t('shortcuts.keys.shift_arrows_desc') },
                { key: t('shortcuts.keys.shift_arrows_rl'), description: t('shortcuts.keys.shift_arrows_rl_desc') },
                { key: t('shortcuts.keys.ctrl_arrows_ud'), description: t('shortcuts.keys.ctrl_arrows_ud_desc') },
                { key: t('shortcuts.keys.ctrl_arrows_rl'), description: t('shortcuts.keys.ctrl_arrows_rl_desc') },
                { key: t('shortcuts.keys.ctrl_shift_arrows'), description: t('shortcuts.keys.ctrl_shift_arrows_desc') },
                { key: t('shortcuts.keys.ctrl_space'), description: t('shortcuts.keys.ctrl_space_desc') },
                { key: t('shortcuts.keys.ctrl_arrows_rl_beats'), description: t('shortcuts.keys.ctrl_arrows_rl_beats_desc') },
                { key: t('shortcuts.keys.ctrl_shift_arrows_beats'), description: t('shortcuts.keys.ctrl_shift_arrows_beats_desc') },
                { key: t('shortcuts.keys.alt_shift_arrows_ud_beats'), description: t('shortcuts.keys.alt_shift_arrows_ud_beats_desc') },
                { key: t('shortcuts.keys.alt_arrows_ud_beats'), description: t('shortcuts.keys.alt_arrows_ud_beats_desc') },
            ]
        }
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-background-dark border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {t('shortcuts.title') || 'Keyboard Shortcuts'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {t('shortcuts.description') || 'Boost your productivity with these quick shortcuts.'}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-6">
                    <div className="mt-4">
                        {sections.map((section, idx) => (
                            <ShortcutGroup
                                key={idx}
                                title={section.title}
                                shortcuts={section.shortcuts}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

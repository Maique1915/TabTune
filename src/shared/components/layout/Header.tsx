"use client";

import React from "react";
import Link from "next/link";
import { AuthSection } from "./AuthSection";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";

export function Header() {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-background-dark/80 backdrop-blur-xl">
            <div className="mx-auto px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-background-dark shadow-cyan-glow group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-2xl font-bold">
                            graphic_eq
                        </span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors duration-300">
                        TabTune<span className="text-primary">.</span>
                    </h2>
                </Link>
                <nav className="hidden md:flex items-center gap-12">
                    <Link href="/short" className="text-sm font-semibold text-slate-400 hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                        {t('page.features_section.short_view.title') || 'Short View'}
                    </Link>
                    <Link href="/full" className="text-sm font-semibold text-slate-400 hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                        {t('page.features_section.full_view.title') || 'Full View'}
                    </Link>
                    <Link href="/beats" className="text-sm font-semibold text-slate-400 hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                        {t('page.features_section.beats.title') || 'Beats Editor'}
                    </Link>
                </nav>
                <div className="flex items-center gap-6">
                    <AuthSection />
                </div>
            </div>
        </header>
    );
}

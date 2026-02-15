"use client";

import React from "react";
import Link from "next/link";
import { AuthSection } from "./AuthSection";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";
import { Button } from "@/shared/components/ui/button";

export function Header() {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-[0_0_15px_rgba(7,182,213,0.5)]">
                        <span className="material-symbols-outlined text-2xl font-bold">
                            graphic_eq
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tighter">
                        TabTune<span className="text-primary">.</span>
                    </h2>
                </Link>
                <nav className="hidden md:flex items-center gap-10">
                    <Link href="/short" className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                        {t('page.features_section.short_view.title') || 'Short View'}
                    </Link>
                    <Link href="/full" className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                        {t('page.features_section.full_view.title') || 'Full View'}
                    </Link>
                    <Link href="/beats" className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                        {t('page.features_section.beats.title') || 'Beats Editor'}
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <AuthSection variant="header" />
                </div>
            </div>
        </header>
    );
}

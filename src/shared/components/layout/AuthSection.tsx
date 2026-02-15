"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/modules/core/presentation/context/user-context";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { User, LogOut, Settings, LayoutDashboard, Languages } from "lucide-react";
import { usePathname } from "next/navigation";
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
    const { user, loading, logout } = useUser();
    const { t, language, setLanguage } = useTranslation();
    const pathname = usePathname();

    if (loading) {
        return <div className="size-8 rounded-full bg-zinc-800 animate-pulse" />;
    }

    if (user) {
        const isProfilePage = pathname?.startsWith("/profile");

        if (isProfilePage) {
            return (
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all border border-red-500/20"
                >
                    <LogOut size={14} />
                    <span>{t('header.logout') || 'Sair'}</span>
                </button>
            );
        }

        return (
            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
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
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-primary transition-all border border-transparent hover:border-white/5 group">
                        <Keyboard size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{t('shortcuts.title') || 'Atalhos'}</span>
                    </button>
                </ShortcutsModal>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 pl-1 group outline-none">
                            <div className="flex flex-col text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-white leading-none group-hover:text-primary transition-colors">
                                    {user.name}
                                </p>
                                <p className="text-[8px] font-bold text-primary uppercase tracking-wider leading-none mt-0.5">
                                    {user.nivel === 'admin' ? t('header.levels.admin') : user.nivel === 'plus' ? t('header.levels.plus') : t('header.levels.free')}
                                </p>
                            </div>
                            <Avatar className="size-8 border-2 border-primary/30 group-hover:border-primary transition-all">
                                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/5 text-zinc-400">
                        <DropdownMenuLabel className="text-zinc-100">{t('header.my_account')}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <Link href="/profile">
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/5 hover:text-white">
                                <User className="mr-2 h-4 w-4" />
                                <span>{t('header.view_profile')}</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/5 hover:text-white">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t('sidebar.settings')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{t('header.logout')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    if (variant === "landing") {
        return (
            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
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

                <Link href="/login">
                    <button className="text-sm font-semibold hover:text-primary transition-colors text-white">
                        {t('header.login') || 'Log In'}
                    </button>
                </Link>
                <Link href="/signup">
                    <button className="bg-primary text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-cyan-glow hover:brightness-110 transition-all">
                        {t('page.start_creating') || 'Sign Up'}
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
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

            <Link href="/login">
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5">
                    {t('header.login') || 'Log In'}
                </Button>
            </Link>
            <Link href="/signup">
                <Button className="h-7 px-3 bg-primary text-background-dark hover:bg-primary/90 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {t('page.start_creating') || 'Sign Up'}
                </Button>
            </Link>
        </div>
    );
}

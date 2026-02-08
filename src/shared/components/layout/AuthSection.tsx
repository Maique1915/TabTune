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
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

interface AuthSectionProps {
    variant?: "header" | "landing";
}

export function AuthSection({ variant = "header" }: AuthSectionProps) {
    const { user, loading, logout } = useUser();
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
                    <span>Sair</span>
                </button>
            );
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 pl-1 group outline-none">
                        <div className="flex flex-col text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-white leading-none group-hover:text-primary transition-colors">
                                {user.name}
                            </p>
                            <p className="text-[8px] font-bold text-primary uppercase tracking-wider leading-none mt-0.5">
                                {user.nivel === 'admin' ? 'Admin Member' : user.nivel === 'plus' ? 'Plus Member' : 'Free Member'}
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
                    <DropdownMenuLabel className="text-zinc-100">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <Link href="/profile">
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/5 hover:text-white">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/5 hover:text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem
                        className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    if (variant === "landing") {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login">
                    <button className="text-sm font-semibold hover:text-primary transition-colors text-white">
                        Log In
                    </button>
                </Link>
                <Link href="/signup">
                    <button className="bg-primary text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-cyan-glow hover:brightness-110 transition-all">
                        Sign Up
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link href="/login">
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5">
                    Log In
                </Button>
            </Link>
            <Link href="/signup">
                <Button className="h-7 px-3 bg-primary text-background-dark hover:bg-primary/90 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    Sign Up
                </Button>
            </Link>
        </div>
    );
}

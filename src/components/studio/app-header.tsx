"use client";

import { Music, Settings, Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export function AppHeader({ onMenuClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-zinc-950/40 backdrop-blur-md border-b border-zinc-800/50 shrink-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          <Music className="text-pink-400" size={20} />
        </div>
        <h1 className="text-sm font-black tracking-[0.2em] text-zinc-100 uppercase">TabTune</h1>
      </div>
      <div className="flex items-center gap-3">
        {onSettingsClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          >
            <Settings size={18} />
          </Button>
        )}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          >
            <Menu size={18} />
          </Button>
        )}
      </div>
    </header>
  );
}

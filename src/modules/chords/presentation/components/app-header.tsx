"use client";

import { Music, Settings, Menu, Upload, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onImportHistory?: (file: File) => void;
  onExportHistory?: () => void;
  title?: string;
}

export function AppHeader({ onMenuClick, onSettingsClick, onImportHistory, onExportHistory, title }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-zinc-950/40 backdrop-blur-md border-b border-zinc-800/50 shrink-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          <Music className="text-pink-400" size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-[0.2em] text-zinc-100 uppercase leading-tight">TabTune</h1>
          {title && <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest leading-tight">{title}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onImportHistory && (
          <>
            <input
              type="file"
              id="import-history"
              className="hidden"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImportHistory(file);
                  e.target.value = ''; // Reset to allow importing the same file again
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('import-history')?.click()}
              className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
              title="Importar"
            >
              <Upload size={18} />
            </Button>
          </>
        )}

        {onExportHistory && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExportHistory}
            className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
            title="Exportar"
          >
            <Download size={18} />
          </Button>
        )}

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



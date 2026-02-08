"use client";

import { Music, Menu, Upload, Download, User, Share2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { AuthSection } from '@/shared/components/layout/AuthSection';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onImportHistory?: (file: File) => void;
  onExportHistory?: () => void;
  title?: string;
}

export function AppHeader({ onMenuClick, onImportHistory, onExportHistory, title }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-panel-dark/80 backdrop-blur-md border-b border-white/5 shrink-0 z-50 relative">
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-cyan-glow group-hover:bg-primary/20 transition-all">
            <Music className="text-primary" size={18} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-display font-black tracking-widest text-white uppercase leading-none flex items-center gap-2">
              TabTune <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </h1>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-tight group-hover:text-primary transition-colors">
              Studio Mode
            </span>
          </div>
        </div>
      </div>

      {/* Center Navigation - Visual Only for now */}


      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 pr-4 border-r border-white/5 mr-1">
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
                className="size-8 rounded-lg text-zinc-500 hover:text-primary hover:bg-white/5 transition-all"
                title="Importar"
              >
                <Upload size={16} />
              </Button>
            </>
          )}

          {onExportHistory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onExportHistory}
              className="size-8 rounded-lg text-zinc-500 hover:text-primary hover:bg-white/5 transition-all"
              title="Exportar"
            >
              <Download size={16} />
            </Button>
          )}

          <Button className="ml-2 h-7 px-3 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold uppercase tracking-wider border border-primary/20 rounded-lg">
            <Share2 size={12} className="mr-2" /> Share
          </Button>
        </div>

        <div className="flex items-center gap-3 pl-1">
          <AuthSection />
        </div>

        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all ml-2"
          >
            <Menu size={18} />
          </Button>
        )}
      </div>
    </header>
  );
}



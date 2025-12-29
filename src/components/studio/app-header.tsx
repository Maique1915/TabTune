"use client";

import { Music, Settings, Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export function AppHeader({ onMenuClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 shrink-0 z-20">
      <div className="flex items-center space-x-2">
        <Music className="text-primary" size={32} />
        <h1 className="text-xl font-bold tracking-tight">TabTune</h1>
      </div>
      <div className="flex items-center gap-2">
        {onSettingsClick && (
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="text-gray-500 dark:text-gray-400" />
          </Button>
        )}
         {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="text-gray-500 dark:text-gray-400" />
          </Button>
        )}
      </div>
    </header>
  );
}

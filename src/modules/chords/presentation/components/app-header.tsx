import { Music, Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { AuthSection } from '@/shared/components/layout/AuthSection';
import { useTranslation } from "@/modules/core/presentation/context/translation-context";
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  title?: string;
  hasUnsavedChanges?: boolean;
}

export function AppHeader({ onMenuClick, title, hasUnsavedChanges }: HeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogoClick = () => {
    if (hasUnsavedChanges) {
      if (confirm(t('menu.confirm_exit'))) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-panel-dark/80 backdrop-blur-md border-b border-white/5 shrink-0 z-50 relative">
      <div className="flex items-center space-x-4">
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-cyan-glow group-hover:bg-primary/20 transition-all">
            <Music className="text-primary" size={18} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-display font-black tracking-widest text-white uppercase leading-none flex items-center gap-2">
              TabTune <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </h1>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-tight group-hover:text-primary transition-colors">
              {t('menu.studio_mode')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AuthSection />

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

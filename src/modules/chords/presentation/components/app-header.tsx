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
    <header className="flex justify-between items-center px-8 py-4 bg-background-dark/60 backdrop-blur-xl border-b border-white/[0.05] shrink-0 z-50 relative">
      <div className="flex items-center space-x-4">
        <div
          className="flex items-center gap-4 group cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner-glow group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
            <Music className="text-primary" size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-display font-black tracking-widest text-white uppercase leading-none flex items-center gap-3">
              TabTune <div className="size-2 rounded-full bg-primary shadow-cyan-glow animate-pulse-subtle" />
            </h1>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-tight group-hover:text-primary transition-colors duration-500">
              {t('menu.studio_mode')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <AuthSection />

        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all ml-2"
          >
            <Menu size={20} />
          </Button>
        )}
      </div>
    </header>
  );
}

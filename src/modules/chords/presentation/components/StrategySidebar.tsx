import React, { useMemo, useState, useEffect } from 'react';
import { SidebarProps } from './sidebar-types';
import { MenuFactory, MenuType } from '../strategies/MenuFactory';
import { GenericSidebar } from '@/shared/components/layout/GenericSidebar';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';
import { NavItemDef } from '../strategies/MenuStrategy';
import { RotateCw, Save } from 'lucide-react';

interface StrategySidebarProps extends SidebarProps {
    menuType?: MenuType;
    title?: string;
    icon?: React.ElementType;
}

export const StrategySidebar: React.FC<StrategySidebarProps> = (props) => {
    const { t } = useTranslation();
    const {
        menuType = 'default',
        isOpen,
        onClose,
        isMobile,
        title,
        icon,
        onUndo,
        onRedo,
        canUndo,
        canRedo,
        hasUnsavedChanges = true // Default to true for backwards compatibility
    } = props;

    const strategy = useMemo(() => MenuFactory.createStrategy(menuType), [menuType]);

    // Initialize state with default category from strategy
    const [activeCategory, setActiveCategory] = useState<string>(() => strategy.getDefaultCategory(props));

    // Force switch to editor if selection occurs
    useEffect(() => {
        if (props.editingNote || props.activeMeasure) {
            setActiveCategory('editor');
        }
    }, [props.editingNote?.id, props.activeMeasure?.id]);

    const navItems = strategy.getNavItems(t);

    // Get current category labels for the secondary header
    const currentNavItem = navItems.find(item => item.id === activeCategory || item.includedCategories?.includes(activeCategory));

    // Use project name if it exists and we're in the config/studio view
    const isProjectSaved = !!props.projectName;
    const breadcrumbLabel = activeCategory === 'config' ? (isProjectSaved ? t('sidebar.project') : t('sidebar.project')) : (isProjectSaved ? props.projectName : t('sidebar.editor'));
    const categoryLabel = (activeCategory === 'config' && isProjectSaved) ? props.projectName : (currentNavItem?.label || t('sidebar.fretboard'));

    return (
        <GenericSidebar
            title={title}
            icon={icon}
            isOpen={isOpen}
            onClose={onClose}
            isMobile={isMobile}
            side="left"
            className="border-r border-white/5 bg-[#09090b]/95 backdrop-blur-xl"
            contentClassName="p-0 flex flex-col"
        >
            <div className="flex h-full overflow-hidden">
                {/* Vertical Navigation Rail */}
                <div className="w-14 bg-panel-dark/50 border-r border-white/5 flex flex-col items-center py-4 gap-3 backdrop-blur-md">
                    {navItems.map((item: NavItemDef) => {
                        const Icon = item.icon;
                        const isActive = activeCategory === item.id || (item.includedCategories?.includes(activeCategory));

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveCategory(item.id)}
                                className={`relative group p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                                {/* Tooltip */}
                                <span className="absolute left-full ml-4 px-2 py-1 bg-card-dark text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10 uppercase tracking-widest">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    <div className="mt-auto mb-2">
                        <button className="group relative w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary-neon/20 border border-white/10 hover:border-primary/50 transition-all shadow-lg hover:shadow-cyan-glow">
                            <div className="text-[9px] font-black text-white group-hover:text-primary transition-colors">PRO</div>
                            <span className="absolute left-full ml-4 px-2 py-1 bg-card-dark text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                                {t('sidebar.upgrade')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                    {/* Secondary Context Header */}
                    <div className="h-14 shrink-0 border-b border-white/5 flex items-center justify-between px-5 bg-black/10 backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500 leading-none mb-0.5">
                                {breadcrumbLabel}
                            </span>
                            <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">
                                {categoryLabel}
                            </h2>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-white/5 shadow-sm">
                            <button
                                onClick={props.onSave}
                                disabled={!hasUnsavedChanges}
                                className={`p-1.5 rounded-md transition-all ${!hasUnsavedChanges ? 'text-zinc-600 opacity-40 cursor-not-allowed' : 'text-zinc-400 hover:text-primary hover:bg-primary/10'}`}
                                title={t('projects.save_dialog.title')}
                            >
                                <Save className="w-3 h-3" />
                            </button>
                            <div className="w-[1px] h-2 bg-white/5 mx-0.5" />
                            <button
                                onClick={onUndo}
                                disabled={!canUndo}
                                className={`p-1.5 rounded-md transition-all ${!canUndo ? 'text-zinc-600 opacity-40 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                title="Undo"
                            >
                                <RotateCw className="w-3 h-3 -scale-x-100" />
                            </button>
                            <div className="w-[1px] h-2 bg-white/5" />
                            <button
                                onClick={onRedo}
                                disabled={!canRedo}
                                className={`p-1.5 rounded-md transition-all ${!canRedo ? 'text-zinc-600 opacity-40 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                title="Redo"
                            >
                                <RotateCw className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {strategy.renderContent(activeCategory, props, setActiveCategory)}
                    </div>
                </div>
            </div>
        </GenericSidebar>
    );
};

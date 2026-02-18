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
            className="border-r border-white/5 bg-background-dark/40 backdrop-blur-2xl"
            contentClassName="p-0 flex flex-col"
        >
            <div className="flex h-full overflow-hidden">
                {/* Vertical Navigation Rail */}
                <div className="w-16 bg-white/[0.02] border-r border-white/[0.05] flex flex-col items-center py-6 gap-4 backdrop-blur-xl">
                    {navItems.map((item: NavItemDef) => {
                        const Icon = item.icon;
                        const isActive = activeCategory === item.id || (item.includedCategories?.includes(activeCategory));

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveCategory(item.id)}
                                className={`relative group p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-primary/10 text-primary shadow-premium-glow ring-1 ring-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'}`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                {/* Tooltip */}
                                <span className="absolute left-full ml-4 px-3 py-1.5 bg-background-dark/95 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-2xl border border-white/[0.1] uppercase tracking-[0.2em] backdrop-blur-md">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    <div className="mt-auto mb-4 px-2">
                        <button className="group relative w-11 h-11 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary-neon/20 border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-cyan-glow overflow-hidden">
                            <div className="text-[10px] font-black text-white group-hover:text-primary transition-colors z-10">PRO</div>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                    {/* Secondary Context Header */}
                    <div className="h-16 shrink-0 border-b border-white/[0.05] flex items-center justify-between px-6 bg-white/[0.01] backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 leading-none mb-1">
                                {breadcrumbLabel}
                            </span>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">
                                {categoryLabel}
                            </h2>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.05] shadow-inner-glow">
                            <button
                                onClick={props.onSave}
                                disabled={!hasUnsavedChanges}
                                className={`p-2 rounded-lg transition-all duration-300 ${!hasUnsavedChanges ? 'text-zinc-600 opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
                                title={t('projects.save_dialog.title')}
                            >
                                <Save className="w-4 h-4" />
                            </button>
                            <div className="w-[1px] h-3 bg-white/[0.05] mx-0.5" />
                            <button
                                onClick={onUndo}
                                disabled={!canUndo}
                                className={`p-2 rounded-lg transition-all duration-300 ${!canUndo ? 'text-zinc-600 opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}
                                title="Undo"
                            >
                                <RotateCw className="w-4 h-4 -scale-x-100" />
                            </button>
                            <div className="w-[1px] h-3 bg-white/[0.05]" />
                            <button
                                onClick={onRedo}
                                disabled={!canRedo}
                                className={`p-2 rounded-lg transition-all duration-300 ${!canRedo ? 'text-zinc-600 opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}
                                title="Redo"
                            >
                                <RotateCw className="w-4 h-4" />
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

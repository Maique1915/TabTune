import { ReactNode } from 'react';
import { SidebarProps } from '../components/sidebar-types';

export interface NavItemDef {
    id: string;
    icon: any;
    label: string;
    isGroup?: boolean;
    includedCategories?: string[]; // Categories that should also trigger this item as active
}

export interface MenuStrategy {
    /**
     * Returns the list of navigation items for the sidebar rail.
     */
    getNavItems(t: (key: string) => string): NavItemDef[];

    /**
     * Returns the default category ID to select initially.
     */
    getDefaultCategory(props: SidebarProps): string;

    /**
     * Renders the main content area based on the active category.
     */
    renderContent(activeCategory: string, props: SidebarProps, setActiveCategory: (cat: string) => void): ReactNode;
}

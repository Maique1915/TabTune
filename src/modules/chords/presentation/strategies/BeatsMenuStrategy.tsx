import React from 'react';
import { MenuStrategy, NavItemDef } from './MenuStrategy';
import { SidebarProps } from '../components/sidebar-types';
import { ConfigPanel } from '../components/panels/ConfigPanel';
import { BeatsEditorPanel } from '../components/panels/BeatsEditorPanel';
import { HarmonyPanel } from '../components/panels/HarmonyPanel';
import { useChordLogic } from '../hooks/use-chord-logic';
import { Settings, Guitar, Edit3, Music } from 'lucide-react';

export class BeatsMenuStrategy implements MenuStrategy {
    getNavItems(t: (key: string) => string): NavItemDef[] {
        return [
            {
                id: 'config',
                label: t('sidebar.project'),
                icon: Settings
            },
            {
                id: 'chord',
                label: t('sidebar.harmony'),
                icon: Music
            },
            {
                id: 'editor',
                label: t('sidebar.editor'),
                icon: Edit3, // Use different icon to distinguish? Or Guitar.
                includedCategories: ['editor']
            }
        ];
    }

    getDefaultCategory(props: SidebarProps): string {
        return (props.editingNote || props.activeMeasure) ? 'editor' : 'config';
    }

    renderContent(category: string, props: SidebarProps, setActiveCategory: (cat: string) => void): React.ReactNode {
        switch (category) {
            case 'config':
                return (
                    <div className="h-full overflow-y-auto custom-scrollbar px-6 pt-4 pb-20">
                        <ConfigPanel {...props} />
                    </div>
                );
            case 'chord':
                return <HarmonyPanelWrapper {...props} />;
            case 'editor':
                return (
                    <div className="h-full flex flex-col">
                        {/* No sub-tabs for Beats currently */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-4 pb-20">
                            <BeatsEditorPanel {...props} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }
}

const HarmonyPanelWrapper: React.FC<SidebarProps> = (props) => {
    const { chordData, handleChordChange, toggleExtension, toggleBass } = useChordLogic({
        activeMeasure: props.activeMeasure,
        onUpdateMeasure: props.onUpdateMeasure
    });

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-6 pt-4 pb-20">
            <HarmonyPanel
                chordData={chordData}
                onChordChange={handleChordChange}
                onToggleExtension={toggleExtension}
                onToggleBass={toggleBass}
            />
        </div>
    );
};

import React from 'react';
import { MenuStrategy, NavItemDef } from './MenuStrategy';
import { SidebarProps } from '../components/sidebar-types';
import { ConfigPanel } from '../components/panels/ConfigPanel';
import { HarmonyPanel } from '../components/panels/HarmonyPanel';
import { FretboardEditorPanel } from '../components/panels/FretboardEditorPanel';
import { RhythmPanel } from '../components/panels/RhythmPanel';
import { ToolsPanel } from '../components/panels/ToolsPanel';
import { SubTabNavigation } from '../components/panels/SubTabNavigation';
import { useChordLogic } from '../hooks/use-chord-logic';
import { Settings, Music, Guitar } from 'lucide-react';

export class DefaultMenuStrategy implements MenuStrategy {
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
                icon: Guitar,
                includedCategories: ['editor', 'rhythm', 'tools']
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
                    <div className="h-full overflow-y-auto custom-scrollbar px-4 pt-4 pb-20">
                        <ConfigPanel {...props} />
                    </div>
                );
            case 'chord':
                return <HarmonyPanelWrapper {...props} />;
            case 'editor':
                return (
                    <div className="h-full flex flex-col">
                        <SubTabNavigation activeCategory={category} onSelect={setActiveCategory} />
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-20">
                            <FretboardEditorPanel {...props} />
                        </div>
                    </div>
                );
            case 'rhythm':
                return (
                    <div className="h-full flex flex-col">
                        <SubTabNavigation activeCategory={category} onSelect={setActiveCategory} />
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-20">
                            <RhythmPanel {...props} />
                        </div>
                    </div>
                );
            case 'tools':
                return (
                    <div className="h-full flex flex-col">
                        <SubTabNavigation activeCategory={category} onSelect={setActiveCategory} />
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-20">
                            <ToolsPanel {...props} />
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
        <div className="h-full overflow-y-auto custom-scrollbar px-4 pt-4 pb-20">
            <HarmonyPanel
                chordData={chordData}
                onChordChange={handleChordChange}
                onToggleExtension={toggleExtension}
                onToggleBass={toggleBass}
            />
        </div>
    );
};

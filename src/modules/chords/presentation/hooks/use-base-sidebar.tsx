import { useState } from 'react';
import { MeasureData, NoteData, ManualChordData } from '@/modules/editor/domain/types';

export interface BaseSidebarConfig {
    // Props do sidebar
    activeMeasure?: MeasureData | null;
    onUpdateMeasure?: (id: string, updates: Partial<MeasureData>) => void;
    onUpdateNote?: (updates: Partial<NoteData>) => void;

    // Configuração de comportamento
    bassToggleMode?: 'chord' | 'note';

    // Nota atual (para modo 'note')
    displayNote?: NoteData | null;
}

export function useBaseSidebar(config: BaseSidebarConfig) {
    const {
        activeMeasure,
        onUpdateMeasure,
        onUpdateNote,
        bassToggleMode = 'chord',
        displayNote
    } = config;

    // Estado local para dados do acorde
    const [chordData, setChordData] = useState<ManualChordData>({
        root: 'C',
        quality: '',
        extensions: [],
        bass: 'Root'
    });

    // ============================================
    // FUNÇÕES 100% IDÊNTICAS
    // ============================================

    /**
     * Atualiza os dados do acorde e sincroniza com a medida pai
     */
    const handleChordChange = (updates: Partial<ManualChordData>) => {
        const newData = { ...chordData, ...updates };
        setChordData(newData);

        if (activeMeasure && onUpdateMeasure) {
            const qualitySuffix = newData.quality;
            const bassSuffix = (!newData.bass || newData.bass === "Root") ? "" : newData.bass;
            const extensionStr = (newData.extensions || []).join("");
            const newName = `${newData.root}${qualitySuffix}${extensionStr}${bassSuffix}`;
            onUpdateMeasure(activeMeasure.id, { chordName: newName });
        }
    };

    /**
     * Alterna uma extensão de acorde (ex: b9, #11, 13)
     */
    const toggleExtension = (base: string, accidental: string) => {
        const fullExt = accidental + base;
        const currentExts = chordData.extensions || [];
        const isCurrentlyActive = currentExts.includes(fullExt);

        // Remove any version of the same degree
        const filtered = currentExts.filter(e => {
            if (base === '7') return !e.match(/^[b#]?7$/);
            if (base === '7+') return !e.match(/^[b#]?7\+$/);
            return !e.match(new RegExp(`^[b#]?${base}$`));
        });

        let newExts = filtered;
        if (!isCurrentlyActive) newExts.push(fullExt);

        // Sort musically
        const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
        newExts.sort((a, b) => {
            const indexA = musicalOrder.indexOf(a);
            const indexB = musicalOrder.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        handleChordChange({ extensions: newExts });
    };

    // ============================================
    // FUNÇÕES GENERALIZADAS
    // ============================================

    /**
     * Alterna a nota do baixo (bass note)
     * Suporta dois modos:
     * - 'chord': Atualiza via handleChordChange (Short/Full)
     * - 'note': Atualiza via onUpdateNote (Beats)
     */
    const toggleBass = (note: string, accidental: string = '') => {
        if (bassToggleMode === 'chord') {
            // Modo Short/Full: usa handleChordChange
            if (note === 'Root') {
                handleChordChange({ bass: 'Root' });
                return;
            }
            const displayBass = '/' + note + accidental;
            handleChordChange({ bass: displayBass });
        } else {
            // Modo Beats: usa onUpdateNote com toggle on/off
            if (!displayNote?.bass) {
                onUpdateNote?.({ bass: `${note}${accidental}` });
            } else {
                // Allow toggle off
                if (displayNote.bass === `${note}${accidental}`) {
                    onUpdateNote?.({ bass: undefined });
                } else {
                    onUpdateNote?.({ bass: `${note}${accidental}` });
                }
            }
        }
    };

    return {
        // Estado
        chordData,
        setChordData,

        // Funções
        handleChordChange,
        toggleExtension,
        toggleBass
    };
}

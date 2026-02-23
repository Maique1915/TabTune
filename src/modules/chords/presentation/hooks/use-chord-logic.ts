import { useState, useEffect, useCallback } from 'react';
import { ManualChordData, MeasureData } from '@/modules/editor/domain/types';

interface UseChordLogicProps {
    activeMeasure?: MeasureData | null;
    onUpdateMeasure?: (id: string, updates: Partial<MeasureData>) => void;
}

export const useChordLogic = ({ activeMeasure, onUpdateMeasure }: UseChordLogicProps) => {
    const [chordData, setChordData] = useState<ManualChordData>({
        root: "C",
        quality: "",
        bass: "Root",
        extensions: [],
        showChordName: true
    });

    const [prevMeasureState, setPrevMeasureState] = useState<{ id: string | null, name: string | null, shown: boolean } | null>(null);

    // Sync local state when active measure changes
    const currentMeasureState = {
        id: activeMeasure?.id || null,
        name: activeMeasure?.chordName || null,
        shown: activeMeasure?.showChordName ?? true
    };

    if (currentMeasureState.id !== prevMeasureState?.id ||
        currentMeasureState.name !== prevMeasureState?.name ||
        currentMeasureState.shown !== prevMeasureState?.shown) {

        setPrevMeasureState(currentMeasureState);

        if (activeMeasure?.chordName) {
            const chordName = activeMeasure.chordName;

            // Extract Bass first
            let bass = "Root";
            let rest = chordName;
            if (chordName.includes("/")) {
                const parts = chordName.split("/");
                bass = "/" + parts[1];
                rest = parts[0];
            }

            // Extract Root (1 or 2 chars)
            let root = "C";
            let qualityExt = "";
            if (rest.length > 1 && (rest[1] === "#" || rest[1] === "b")) {
                root = rest.substring(0, 2);
                qualityExt = rest.substring(2);
            } else {
                root = rest.substring(0, 1);
                qualityExt = rest.substring(1);
            }

            // Extract Quality basic check
            let quality = "";
            let extensionsStr = qualityExt;

            // Try to match specific quality prefixes first (Order matters: longest first)
            const qualities = ["dim", "aug", "sus2", "sus4", "maj", "m"];
            for (const q of qualities) {
                if (qualityExt.startsWith(q)) {
                    quality = q;
                    extensionsStr = qualityExt.substring(q.length);
                    break;
                }
            }

            // Parse individual extensions using regex
            const foundExts: string[] = [];
            const extRegex = /([b#])?(5|6|7\+?|9|11|13)/g;
            let match;
            while ((match = extRegex.exec(extensionsStr)) !== null) {
                foundExts.push(match[0]);
            }

            // Sort musically
            const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
            foundExts.sort((a, b) => {
                const indexA = musicalOrder.indexOf(a);
                const indexB = musicalOrder.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            // Set state
            setChordData({
                root,
                quality,
                bass,
                extensions: foundExts,
                showChordName: activeMeasure.showChordName !== false
            });

        } else {
            // Reset to defaults if no name
            setChordData({
                root: "C",
                quality: "",
                bass: "Root",
                extensions: [],
                showChordName: activeMeasure?.showChordName ?? true
            });
        }
    }

    // Sync chord data changes back to parent measure
    useEffect(() => {
        if (activeMeasure && onUpdateMeasure) {
            const qualitySuffix = chordData.quality;
            const bassSuffix = (!chordData.bass || chordData.bass === "Root") ? "" : chordData.bass;
            const extensionStr = (chordData.extensions || []).join("");
            const newName = `${chordData.root}${qualitySuffix}${extensionStr}${bassSuffix}`;

            // Only update if the name actually changed to avoid infinite loops
            if (activeMeasure.chordName !== newName || activeMeasure.showChordName !== chordData.showChordName) {
                onUpdateMeasure(activeMeasure.id, {
                    chordName: newName,
                    showChordName: chordData.showChordName
                });
            }
        }
    }, [chordData, activeMeasure?.id, activeMeasure?.chordName, onUpdateMeasure, activeMeasure]);

    // Helper to update local state only (parent sync happens in useEffect above)
    const handleChordChange = useCallback((updates: Partial<ManualChordData>) => {
        setChordData(prev => ({ ...prev, ...updates }));
    }, []);

    const toggleExtension = useCallback((base: string, accidental: string) => {
        setChordData(currentData => {
            const fullExt = accidental + base;
            const currentExts = currentData.extensions || [];
            const isCurrentlyActive = currentExts.includes(fullExt);

            // Remove any version of the same degree
            const filtered = currentExts.filter(e => {
                if (base === '7') return !e.match(/^[b#]?7$/);
                if (base === '7+') return !e.match(/^[b#]?7\+$/);
                return !e.match(new RegExp(`^[b#]?${base}$`));
            });

            let newExts = filtered;
            if (!isCurrentlyActive) {
                newExts.push(fullExt);
            }

            // Sort musically
            const musicalOrder = ['5', 'b5', '#5', '6', 'b6', '#6', '7', 'b7', '#7', '7+', 'b7+', '#7+', '9', 'b9', '#9', '11', 'b11', '#11', '13', 'b13', '#13'];
            newExts.sort((a, b) => {
                const indexA = musicalOrder.indexOf(a);
                const indexB = musicalOrder.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            return { ...currentData, extensions: newExts };
        });
    }, []);

    const toggleBass = useCallback((note: string, accidental: string = '') => {
        const bassValue = note === 'Root' ? 'Root' : '/' + note + accidental;
        handleChordChange({ bass: bassValue });
    }, [handleChordChange]);

    return {
        chordData,
        handleChordChange,
        toggleExtension,
        toggleBass
    };
};

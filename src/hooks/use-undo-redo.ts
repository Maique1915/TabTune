import { useState, useCallback, useEffect, useRef } from 'react';

interface Options {
    enableShortcuts?: boolean;
}

interface UndoRedoHook<T> {
    state: T;
    setState: (newState: T | ((prevState: T) => T), options?: { overwrite?: boolean }) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    reset: (initialState: T) => void;
}

// Refactored to use a single history array and pointer index as requested.

interface HistoryState<T> {
    history: T[];
    index: number;
}

export function useUndoRedo<T>(initialState: T, options: Options = { enableShortcuts: true }): UndoRedoHook<T> {
    const [historyState, setHistoryState] = useState<HistoryState<T>>({
        history: [initialState],
        index: 0
    });

    const present = historyState.history[historyState.index] || initialState;

    const canUndo = historyState.index > 0;
    const canRedo = historyState.index < historyState.history.length - 1;

    const undo = useCallback(() => {
        setHistoryState(prev => {
            if (prev.index > 0) {
                console.log('[useUndoRedo] Undo:', prev.index, '->', prev.index - 1);
                return { ...prev, index: prev.index - 1 };
            }
            return prev;
        });
    }, []);

    const redo = useCallback(() => {
        setHistoryState(prev => {
            if (prev.index < prev.history.length - 1) {
                console.log('[useUndoRedo] Redo:', prev.index, '->', prev.index + 1);
                return { ...prev, index: prev.index + 1 };
            }
            return prev;
        });
    }, []);

    const setState = useCallback((newState: T | ((prevState: T) => T), options?: { overwrite?: boolean }) => {
        setHistoryState(prev => {
            const current = prev.history[prev.index];
            const resolvedState = typeof newState === 'function' ? (newState as Function)(current) : newState;

            if (resolvedState === undefined || resolvedState === null) return prev;

            // Deep equality check
            const isDeepEqual = (a: any, b: any): boolean => {
                if (a === b) return true;
                if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                if (keysA.length !== keysB.length) return false;
                for (const key of keysA) {
                    if (!keysB.includes(key) || !isDeepEqual(a[key], b[key])) return false;
                }
                return true;
            };

            if (isDeepEqual(current, resolvedState)) {
                return prev;
            }

            if (options?.overwrite) {
                console.log('[useUndoRedo] Overwrite at index', prev.index);
                const newHistory = [...prev.history];
                newHistory[prev.index] = resolvedState;
                return { ...prev, history: newHistory };
            }

            const newHistory = prev.history.slice(0, prev.index + 1);
            newHistory.push(resolvedState);

            console.log('[useUndoRedo] New Entry:', {
                index: newHistory.length - 1,
                size: newHistory.length
            });

            return {
                history: newHistory,
                index: newHistory.length - 1
            };
        });
    }, []);

    const reset = useCallback((newInitialState: T) => {
        setHistoryState({
            history: [newInitialState],
            index: 0
        });
    }, []);

    useEffect(() => {
        if (!options.enableShortcuts) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlOrCmd = event.ctrlKey || event.metaKey;

            if (isCtrlOrCmd && event.key.toLowerCase() === 'z') {
                if (event.shiftKey) {
                    event.preventDefault();
                    redo();
                } else {
                    event.preventDefault();
                    undo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, options.enableShortcuts]);

    return {
        state: present,
        setState,
        undo,
        redo,
        canUndo,
        canRedo,
        reset
    };
}

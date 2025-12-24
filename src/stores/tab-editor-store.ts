import { create } from 'zustand';

export interface TabNote {
    string: number; // 1-6
    fret: number;
    position: number; // relative position in the measure (0-1 or beat based)
    duration?: string;
    technique?: string;
}

export interface TabCard {
    id: string;
    name: string;
    bpm: number;
    timeSignature: [number, number];
    measureCount: number;
    notes: TabNote[];
    createdAt: number;
}

interface TabEditorState {
    // Global Settings
    bpm: number;
    timeSignature: [number, number];
    isSetup: boolean;

    // Editor State
    currentNotes: TabNote[];
    selectedString: number | null;

    // Library
    cards: TabCard[];

    // Actions
    setGlobalSettings: (bpm: number, timeSignature: [number, number]) => void;
    resetSetup: () => void;
    addNote: (note: TabNote) => void;
    removeNote: (string: number, position: number) => void;
    saveCurrentCard: (name: string) => void;
    loadCard: (id: string) => void;
    deleteCard: (id: string) => void;
    clearEditor: () => void;
}

export const useTabEditorStore = create<TabEditorState>((set, get) => ({
    bpm: 120,
    timeSignature: [4, 4],
    isSetup: false,

    currentNotes: [],
    selectedString: null,

    cards: [],

    setGlobalSettings: (bpm, timeSignature) =>
        set({ bpm, timeSignature, isSetup: true }),

    resetSetup: () =>
        set({ isSetup: false }),

    addNote: (note) =>
        set((state) => ({
            currentNotes: [
                ...state.currentNotes.filter(n => !(n.string === note.string && n.position === note.position)),
                note
            ]
        })),

    removeNote: (string, position) =>
        set((state) => ({
            currentNotes: state.currentNotes.filter(n => !(n.string === string && n.position === position))
        })),

    saveCurrentCard: (name) => {
        const { bpm, timeSignature, currentNotes, cards } = get();
        const newCard: TabCard = {
            id: crypto.randomUUID(),
            name,
            bpm,
            timeSignature,
            measureCount: 1, // Default to 1 for now
            notes: [...currentNotes],
            createdAt: Date.now(),
        };
        set({ cards: [...cards, newCard] });
    },

    loadCard: (id) => {
        const card = get().cards.find(c => c.id === id);
        if (card) {
            set({
                bpm: card.bpm,
                timeSignature: card.timeSignature,
                currentNotes: [...card.notes],
                isSetup: true
            });
        }
    },

    deleteCard: (id) =>
        set((state) => ({ cards: state.cards.filter(c => c.id !== id) })),

    clearEditor: () =>
        set({ currentNotes: [] }),
}));

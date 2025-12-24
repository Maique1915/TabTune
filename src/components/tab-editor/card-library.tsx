"use client";

import React from 'react';
import { useTabEditorStore } from '@/stores/tab-editor-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardLibraryProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CardLibrary({ isOpen, onClose }: CardLibraryProps) {
    const cards = useTabEditorStore((state) => state.cards);
    const loadCard = useTabEditorStore((state) => state.loadCard);
    const deleteCard = useTabEditorStore((state) => state.deleteCard);

    return (
        <div
            className={cn(
                "fixed inset-x-0 bottom-0 h-[85vh] bg-background/95 backdrop-blur-md rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-t border-white/10",
                isOpen ? "translate-y-0" : "translate-y-full"
            )}
        >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full"></div>
            </div>

            <div className="px-6 py-2 flex justify-between items-center border-b border-border/50">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Library</h2>
                    <p className="text-xs text-muted-foreground">{cards.length} cards available</p>
                </div>
                <Button size="icon" variant="default" className="bg-primary text-primary-foreground shadow-sm rounded-lg">
                    <span className="text-lg font-bold">+</span>
                </Button>
            </div>

            {/* Filter Chips */}
            <div className="py-3 px-6 flex space-x-2 overflow-x-auto no-scrollbar border-b border-border/50 bg-card/50">
                <button className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium whitespace-nowrap">All</button>
                <button className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium whitespace-nowrap border border-border">Tabs</button>
                <button className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium whitespace-nowrap border border-border">Scores</button>
            </div>

            <ScrollArea className="flex-1 p-4 pb-24">
                <div className="grid grid-cols-2 gap-4">
                    {cards.length === 0 ? (
                        <div className="col-span-2 text-center text-muted-foreground text-sm py-8">
                            Nenhum card salvo ainda.
                        </div>
                    ) : (
                        cards.map((card) => (
                            <div
                                key={card.id}
                                className="bg-card rounded-xl p-3 shadow-sm border border-border flex flex-col items-center group relative overflow-hidden"
                            >
                                <div className="w-full aspect-[3/4] bg-muted/30 rounded-lg mb-2 flex items-center justify-center text-4xl">
                                    🎼
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-foreground truncate">{card.name}</h3>
                                    <span className="text-[10px] bg-primary/10 text-primary px-1 rounded">{card.bpm}</span>
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => { loadCard(card.id); onClose(); }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => deleteCard(card.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

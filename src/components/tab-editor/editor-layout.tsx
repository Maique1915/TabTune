"use client";

import React, { useState } from 'react';
import { useTabEditorStore } from '@/stores/tab-editor-store';
import { TabCanvas } from './tab-canvas';
import { CardLibrary } from './card-library';
import { CustomizePanel } from './customize-panel'; // Import new panel
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Layers, Music, SlidersHorizontal, Home, Play, ZoomIn, ZoomOut, Film } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function EditorLayout() {
    const { saveCurrentCard, resetSetup, clearEditor } = useTabEditorStore();
    const [cardName, setCardName] = React.useState("Fm6");
    const [activePanel, setActivePanel] = useState<'none' | 'library' | 'customize'>('none');

    const handleSave = () => {
        saveCurrentCard(cardName);
    };

    const togglePanel = (panel: 'library' | 'customize') => {
        if (activePanel === panel) {
            setActivePanel('none');
        } else {
            setActivePanel(panel);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Header */}
            <header className="flex justify-between items-center px-4 py-3 bg-card border-b border-border shrink-0 z-20">
                <div className="flex items-center space-x-2">
                    <Music className="text-primary h-6 w-6" />
                    <h1 className="text-xl font-bold tracking-tight">TabTune</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-32 bg-transparent border-transparent hover:border-border focus:border-primary h-8 text-sm font-bold text-right"
                    />
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={resetSetup}>
                        <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </header>

            {/* Main Content (Stage) */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-black/90">
                <div className="flex-1 relative flex items-center justify-center min-h-[40vh]">
                    {/* Floating Title (Mobile Style) */}
                    <div className="absolute top-4 inset-x-0 text-center z-10 pointer-events-none">
                        <h2 className="text-4xl font-bold text-foreground tracking-wider opacity-90">{cardName}</h2>
                    </div>

                    <TabCanvas />

                    {/* FAB Render Button */}
                    <button className="absolute bottom-6 right-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-destructive/90 active:scale-95 transition-all z-30">
                        <Film className="h-4 w-4" />
                        <span className="text-sm font-semibold">Render MP4</span>
                    </button>
                </div>

                {/* Timeline Section */}
                <div className="bg-card border-t border-border h-48 flex flex-col shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                        <div className="flex items-center space-x-4">
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                <Play className="h-6 w-6" />
                            </button>
                            <span className="text-xs text-muted-foreground font-mono">0:00.0 / 0:04.0</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                                <ZoomOut className="h-4 w-4" />
                            </button>
                            <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                                <ZoomIn className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {/* Timeline visualization placeholder */}
                    <div className="flex-1 overflow-x-auto relative p-4 bg-muted/20">
                        <div className="absolute top-0 left-0 w-full h-full flex pointer-events-none opacity-20">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="w-[100px] border-l border-dashed border-foreground h-full pl-1 text-[10px]">0:0{i}</div>
                            ))}
                        </div>
                        <div className="relative mt-4 h-12 flex items-center">
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-muted/80 backdrop-blur flex items-center justify-center text-xs font-bold text-muted-foreground rounded-l-md z-10 border-r border-border">
                                Chords
                            </div>
                            <div className="flex ml-16 space-x-1">
                                <div className="w-[180px] bg-primary/20 border border-primary text-primary h-10 rounded-md flex items-center justify-between px-3 cursor-pointer hover:bg-primary/30 transition-colors">
                                    <span className="font-bold text-sm truncate">{cardName}</span>
                                    <span className="text-[10px] opacity-70">0:02.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-card border-t border-border pb-safe z-50">
                <div className="flex justify-around items-center h-16">
                    <button
                        className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", activePanel === 'none' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                        onClick={() => setActivePanel('none')}
                    >
                        <Home className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Studio</span>
                    </button>

                    <button
                        className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", activePanel === 'library' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                        onClick={() => togglePanel('library')}
                    >
                        <Layers className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Library</span>
                    </button>

                    <button
                        className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", activePanel === 'customize' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                        onClick={() => togglePanel('customize')}
                    >
                        <SlidersHorizontal className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Customize</span>
                    </button>
                </div>
            </nav>

            {/* Slide-up Panels */}
            <CardLibrary isOpen={activePanel === 'library'} onClose={() => setActivePanel('none')} />
            <CustomizePanel isOpen={activePanel === 'customize'} onClose={() => setActivePanel('none')} />
        </div>
    );
}

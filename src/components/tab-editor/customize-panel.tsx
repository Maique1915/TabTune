"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface CustomizePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CustomizePanel({ isOpen, onClose }: CustomizePanelProps) {
    return (
        <div
            className={cn(
                "fixed inset-x-0 bottom-0 h-[70vh] bg-background/95 backdrop-blur-md rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-t border-white/10",
                isOpen ? "translate-y-0" : "translate-y-full"
            )}
        >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full"></div>
            </div>

            <div className="p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" /> Customize
                </h2>

                {/* Tabs */}
                <div className="flex p-1 bg-muted rounded-lg mb-6">
                    <button className="flex-1 py-2 rounded-md bg-card shadow-sm text-xs font-bold text-foreground transition-all">Animation</button>
                    <button className="flex-1 py-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground">General</button>
                    <button className="flex-1 py-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground">Fingers</button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Animation Style</h3>

                    {/* Option 1 */}
                    <div className="group flex items-start space-x-3 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                        <div className="mt-0.5 relative flex items-center justify-center">
                            <input checked readOnly className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" type="radio" />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-foreground">Carousel</span>
                            <span className="block text-xs text-muted-foreground mt-1">Chords slide across the screen like a carousel animation.</span>
                        </div>
                    </div>

                    {/* Option 2 */}
                    <div className="group flex items-start space-x-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 cursor-pointer transition-colors">
                        <div className="mt-0.5 relative flex items-center justify-center">
                            <input className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" type="radio" />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-foreground">Static Fretboard</span>
                            <span className="block text-xs text-muted-foreground mt-1">Fretboard stays centered, fingers animate smoothly between positions.</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 bg-muted text-muted-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors">
                        Reset to Default
                    </button>
                </div>
            </div>
        </div>
    );
}

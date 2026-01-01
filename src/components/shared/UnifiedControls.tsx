"use client";

import React from 'react';
import { Button } from "@/shared/components/ui/button";
import { Play, Pause, Film, SkipBack, RotateCcw, Repeat } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface UnifiedControlsProps {
    // Playback State
    isPlaying: boolean;
    isPaused: boolean;
    isLooping?: boolean;

    // Callbacks
    onPlayPause: () => void;
    onReset?: () => void;
    onSkipBack?: () => void;
    onToggleLoop?: () => void;

    // Render/Export State
    isRendering?: boolean;
    onRender?: () => void;

    // Page Specific Controls (slots)
    leftExtra?: React.ReactNode;
    rightExtra?: React.ReactNode;
    centerExtra?: React.ReactNode;

    className?: string;
}

export const UnifiedControls = ({
    isPlaying,
    isPaused,
    isLooping,
    onPlayPause,
    onReset,
    onSkipBack,
    onToggleLoop,
    isRendering,
    onRender,
    leftExtra,
    rightExtra,
    centerExtra,
    className
}: UnifiedControlsProps) => {
    return (
        <div className={cn("flex w-full items-center justify-between px-4 py-2 gap-4", className)}>
            {/* Left: Play/Pause and Transport */}
            <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 p-0.5 bg-black/20 rounded-xl border border-white/5">
                    <Button
                        className={cn(
                            "relative overflow-hidden transition-all duration-300 rounded-lg h-9 w-10 flex items-center justify-center p-0",
                            isPlaying && !isPaused
                                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-600'
                                : 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400'
                        )}
                        onClick={onPlayPause}
                        title={isPlaying && !isPaused ? "Stop" : "Play"}
                    >
                        {isPlaying && !isPaused ? (
                            <Pause className="w-5 h-5 fill-current" />
                        ) : (
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        )}
                    </Button>

                    <div className="flex items-center gap-0.5">
                        {onSkipBack && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 bg-transparent hover:bg-white/10 text-slate-400 hover:text-white border-none rounded-lg transition-all flex items-center justify-center p-0"
                                onClick={onSkipBack}
                                title="Back to Start"
                            >
                                <SkipBack className="w-4 h-4" />
                            </Button>
                        )}

                        {onToggleLoop && (
                            <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                    "h-9 w-9 border-none rounded-lg transition-all flex items-center justify-center p-0",
                                    isLooping
                                        ? 'bg-pink-500/20 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                                        : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/10'
                                )}
                                onClick={onToggleLoop}
                                title="Toggle Loop"
                            >
                                <Repeat className="w-4 h-4" />
                            </Button>
                        )}

                        {onReset && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 bg-transparent hover:bg-white/10 text-slate-400 hover:text-white border-none rounded-lg transition-all flex items-center justify-center p-0"
                                onClick={onReset}
                                title="Reset"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {leftExtra && (
                    <>
                        <div className="h-5 w-px bg-white/10 mx-1" />
                        {leftExtra}
                    </>
                )}
            </div>

            {centerExtra && (
                <div className="flex items-center justify-center px-2">
                    {centerExtra}
                </div>
            )}

            {/* Right: Page Specific and Render */}
            <div className="flex items-center gap-2">
                {rightExtra}

                {onRender && (
                    <div className="flex items-center p-0.5 bg-black/20 rounded-xl border border-white/5">
                        <Button
                            className={cn(
                                "h-9 w-10 p-0 rounded-lg transition-all flex items-center justify-center border-none",
                                isRendering
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                            )}
                            onClick={onRender}
                            disabled={isRendering}
                            title={isRendering ? "Recording..." : "Export Video"}
                        >
                            <Film className={cn("w-5 h-5", isRendering && "animate-pulse")} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

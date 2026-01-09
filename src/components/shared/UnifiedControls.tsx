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

    // Timeline state
    isTimelineEmpty?: boolean;

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
    isTimelineEmpty,
    className
}: UnifiedControlsProps) => {
    return (
        <div className={cn("flex w-full items-center justify-between px-6 py-3 gap-6", className)}>
            {/* Left: Play/Pause and Transport */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 p-1 bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 shadow-inner">
                    <Button
                        className={cn(
                            "relative overflow-hidden transition-all duration-300 rounded-xl h-10 w-11 flex items-center justify-center p-0 border",
                            isPlaying && !isPaused
                                ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:bg-red-500/20'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-cyan-500/20',
                            isTimelineEmpty && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={onPlayPause}
                        disabled={isTimelineEmpty}
                        title={isTimelineEmpty ? "Add chords to timeline first" : (isPlaying && !isPaused ? "Stop" : "Play")}
                    >
                        {isPlaying && !isPaused ? (
                            <Pause className="w-5 h-5 fill-current" />
                        ) : (
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        )}
                    </Button>

                    <div className="flex items-center gap-1">
                        {onSkipBack && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800/50 rounded-xl transition-all flex items-center justify-center p-0"
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
                                    "h-10 w-10 border rounded-xl transition-all flex items-center justify-center p-0",
                                    isLooping
                                        ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.15)]'
                                        : 'bg-zinc-900/50 text-zinc-400 border-zinc-800/50 hover:text-zinc-100 hover:bg-zinc-800'
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
                                className="h-10 w-10 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800/50 rounded-xl transition-all flex items-center justify-center p-0"
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
                        <div className="h-6 w-px bg-zinc-800/50 mx-1" />
                        {leftExtra}
                    </>
                )}
            </div>

            {centerExtra && (
                <div className="flex items-center justify-center px-4 flex-1">
                    {centerExtra}
                </div>
            )}

            {/* Right: Page Specific and Render */}
            <div className="flex items-center gap-3">
                {rightExtra}

                {onRender && (
                    <div className="flex items-center p-1 bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 shadow-inner">
                        <Button
                            className={cn(
                                "h-10 w-11 p-0 rounded-xl transition-all flex items-center justify-center border",
                                isRendering
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                                    : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
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

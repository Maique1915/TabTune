import React from 'react';
import { Upload, Film } from 'lucide-react';

interface MobilePlaybackControlsProps {
    // Playback state
    isPlaying: boolean;
    isPaused?: boolean;
    isLooping?: boolean;

    // Settings
    bpm: number;
    timeSignature: string;

    // Display info
    currentMeasure: number;
    totalMeasures: number;

    // Visibility toggles
    showNotation?: boolean;
    showTablature?: boolean;

    // Rendering state
    isRendering?: boolean;
    renderProgress?: number;

    // Callbacks
    onPlayPause: () => void;
    onStop?: () => void;
    onSkipBack?: () => void;
    onToggleLoop?: () => void;
    onBpmChange: (bpm: number) => void;
    onTimeSignatureChange: (time: string) => void;
    onToggleNotation?: () => void;
    onToggleTablature?: () => void;
    onImport?: () => void;
    onExport?: () => void;
    onCancelRender?: () => void;

    // Optional props
    isImporting?: boolean;
    showVisibilityToggles?: boolean;
    showImportExport?: boolean;
}

export function MobilePlaybackControls({
    isPlaying,
    isPaused = false,
    isLooping = false,
    bpm,
    timeSignature,
    currentMeasure,
    totalMeasures,
    showNotation = true,
    showTablature = true,
    isRendering = false,
    onPlayPause,
    onStop,
    onSkipBack,
    onToggleLoop,
    onBpmChange,
    onTimeSignatureChange,
    onToggleNotation,
    onToggleTablature,
    onImport,
    onExport,
    onCancelRender,
    isImporting = false,
    showVisibilityToggles = true,
    showImportExport = true,
}: MobilePlaybackControlsProps) {
    return (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl">
            {/* Left: Playback Controls */}
            <div className="flex items-center space-x-4">
                {/* Play/Pause Button */}
                <button
                    onClick={onPlayPause}
                    className={`px-6 py-2 rounded-xl flex items-center space-x-3 text-xs font-black transition-all ${isPlaying
                            ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                            : 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        }`}
                >
                    <span className="material-icons-round text-xl">
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{isPlaying ? 'STOP' : 'PLAY'}</span>
                </button>

                {/* Skip Back */}
                {onSkipBack && (
                    <button
                        onClick={onSkipBack}
                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors border border-white/5"
                        title="Back to Start"
                    >
                        <span className="material-icons-round text-xl">skip_previous</span>
                    </button>
                )}

                {/* Loop Toggle */}
                {onToggleLoop && (
                    <button
                        onClick={onToggleLoop}
                        className={`p-2.5 rounded-xl border transition-all ${isLooping
                                ? 'bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                                : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
                            }`}
                        title="Toggle Loop"
                    >
                        <span className="material-icons-round text-xl">repeat</span>
                    </button>
                )}

                {/* Stop & Reset */}
                {onStop && (
                    <button
                        onClick={onStop}
                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors border border-white/5"
                        title="Stop & Reset"
                    >
                        <span className="material-icons-round text-xl">stop</span>
                    </button>
                )}

                <div className="h-6 w-px bg-white/10 mx-2" />

                {/* Tempo & Time Signature */}
                <div className="flex items-center space-x-2 bg-black/50 p-1 rounded-lg border border-white/10">
                    <div className="flex items-center px-3 space-x-2 border-r border-white/10">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Tempo</span>
                        <input
                            type="number"
                            value={bpm}
                            min="40"
                            max="240"
                            onChange={(e) => onBpmChange(parseInt(e.target.value) || 120)}
                            className="w-12 bg-transparent text-xs font-black text-cyan-400 outline-none text-center"
                        />
                        <span className="text-[10px] font-bold text-slate-700">BPM</span>
                    </div>
                    <select
                        value={timeSignature}
                        onChange={(e) => onTimeSignatureChange(e.target.value)}
                        className="bg-transparent text-xs font-black text-slate-300 px-3 outline-none cursor-pointer"
                    >
                        <option value="4/4">4/4</option>
                        <option value="3/4">3/4</option>
                        <option value="2/4">2/4</option>
                        <option value="6/8">6/8</option>
                    </select>
                </div>

                <div className="h-6 w-px bg-white/10 mx-2" />

                {/* Measure Info & Visibility Toggles */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center px-4 py-1.5 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-[10px] font-black text-cyan-400 tracking-wider uppercase">
                            Section {currentMeasure}/{totalMeasures} Meas
                        </span>
                    </div>

                    {showVisibilityToggles && onToggleNotation && onToggleTablature && (
                        <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-lg border border-white/10 ml-2">
                            <button
                                onClick={onToggleNotation}
                                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase transition-all ${showNotation ? 'bg-blue-500/20 text-blue-400' : 'text-slate-600'
                                    }`}
                            >
                                Partitura
                            </button>
                            <button
                                onClick={onToggleTablature}
                                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase transition-all ${showTablature ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-600'
                                    }`}
                            >
                                Tablatura
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Import/Export Actions */}
            {showImportExport && (
                <div className="flex items-center space-x-3 pr-2">
                    {onImport && (
                        <button
                            onClick={onImport}
                            disabled={isImporting}
                            className="h-9 px-4 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border bg-white/5 text-slate-300 border-white/5 hover:border-cyan-500/50 hover:text-white hover:bg-white/10 disabled:opacity-50"
                            title="Import File"
                        >
                            <Upload className="w-4 h-4" />
                            <span>{isImporting ? 'Importing...' : 'Import'}</span>
                        </button>
                    )}

                    {onExport && (
                        <button
                            onClick={isRendering ? onCancelRender : onExport}
                            className={`h-9 px-5 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 border ${isRendering
                                    ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
                                    : 'bg-white/5 text-slate-300 border-white/5 hover:border-cyan-500/50 hover:text-white hover:bg-white/10'
                                }`}
                            title={isRendering ? 'Stop Rendering' : 'Export Video'}
                        >
                            <Film className={`w-4 h-4 ${isRendering ? 'animate-pulse' : ''}`} />
                            <span>{isRendering ? 'Recording...' : 'Export Video'}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

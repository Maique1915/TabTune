import React from 'react';
import { Settings, X } from 'lucide-react';

export interface VideoSettings {
    format: 'webm' | 'mp4';
    fps: 30 | 60;
    quality: 'low' | 'medium' | 'high';
}

interface VideoRecordingSettingsProps {
    isOpen: boolean;
    settings: VideoSettings;
    onClose: () => void;
    onSave: (settings: VideoSettings) => void;
}

const QUALITY_BITRATES = {
    low: 2500000,    // 2.5 Mbps
    medium: 5000000, // 5 Mbps
    high: 10000000   // 10 Mbps
};

export const VideoRecordingSettings: React.FC<VideoRecordingSettingsProps> = ({
    isOpen,
    settings,
    onClose,
    onSave
}) => {
    const [localSettings, setLocalSettings] = React.useState(settings);

    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-black text-white uppercase">Recording Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                    {/* Format */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">
                            Video Format
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, format: 'webm' })}
                                className={`px-4 py-3 rounded-xl border transition-all ${localSettings.format === 'webm'
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <div className="text-sm font-black">WebM</div>
                                <div className="text-xs opacity-60">Smaller size</div>
                            </button>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, format: 'mp4' })}
                                className={`px-4 py-3 rounded-xl border transition-all ${localSettings.format === 'mp4'
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                                    }`}
                                disabled
                            >
                                <div className="text-sm font-black">MP4</div>
                                <div className="text-xs opacity-60">Coming soon</div>
                            </button>
                        </div>
                    </div>

                    {/* FPS */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">
                            Frame Rate
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, fps: 30 })}
                                className={`px-4 py-3 rounded-xl border transition-all ${localSettings.fps === 30
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <div className="text-sm font-black">30 FPS</div>
                                <div className="text-xs opacity-60">Balanced</div>
                            </button>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, fps: 60 })}
                                className={`px-4 py-3 rounded-xl border transition-all ${localSettings.fps === 60
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <div className="text-sm font-black">60 FPS</div>
                                <div className="text-xs opacity-60">Smoother</div>
                            </button>
                        </div>
                    </div>

                    {/* Quality */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">
                            Video Quality
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['low', 'medium', 'high'] as const).map((quality) => (
                                <button
                                    key={quality}
                                    onClick={() => setLocalSettings({ ...localSettings, quality })}
                                    className={`px-4 py-3 rounded-xl border transition-all ${localSettings.quality === quality
                                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                            : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="text-sm font-black capitalize">{quality}</div>
                                    <div className="text-xs opacity-60">
                                        {quality === 'low' && '2.5 Mbps'}
                                        {quality === 'medium' && '5 Mbps'}
                                        {quality === 'high' && '10 Mbps'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-xs text-cyan-400/80">
                            <strong>Note:</strong> MP4 format requires FFmpeg.wasm and will be available in a future update.
                            WebM is currently the fastest and most efficient option.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export { QUALITY_BITRATES };

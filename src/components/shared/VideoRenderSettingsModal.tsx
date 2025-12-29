import React from 'react';
import { Settings, X, Film } from 'lucide-react';

export interface VideoRenderSettings {
    format: 'webm' | 'mp4';
    fps: 30 | 60;
    quality: 'low' | 'medium' | 'high' | 'ultra';
}

interface VideoRenderSettingsModalProps {
    isOpen: boolean;
    settings: VideoRenderSettings;
    onClose: () => void;
    onRender: (settings: VideoRenderSettings) => void;
}

const QUALITY_INFO = {
    low: { bitrate: '2.5 Mbps', label: 'SD', description: 'Standard resolution' },
    medium: { bitrate: '10 Mbps', label: 'HD+', description: 'Superior clarity' },
    high: { bitrate: '25 Mbps', label: 'Full HD', description: 'Retina sharp' },
    ultra: { bitrate: '45 Mbps', label: 'Pro 1080p', description: 'Studio quality' },
};

export const VideoRenderSettingsModal: React.FC<VideoRenderSettingsModalProps> = ({
    isOpen,
    settings,
    onClose,
    onRender
}) => {
    const [localSettings, setLocalSettings] = React.useState(settings);

    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleConfirm = () => {
        onRender(localSettings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-[0_0_80px_rgba(6,182,212,0.3)] relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[100px] rounded-full" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-cyan-500/10 rounded-xl">
                            <Film className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Export Video</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Settings */}
                <div className="space-y-8 relative">
                    {/* Format */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                            Video Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, format: 'webm' })}
                                className={`px-4 py-4 rounded-2xl border-2 transition-all text-left ${localSettings.format === 'webm'
                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                    : 'bg-slate-800/30 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="text-sm font-black uppercase">WebM</div>
                                <div className="text-[10px] font-medium opacity-60">Fast & Real-time</div>
                            </button>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, format: 'mp4' })}
                                className={`px-4 py-4 rounded-2xl border-2 transition-all text-left ${localSettings.format === 'mp4'
                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                    : 'bg-slate-800/30 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="text-sm font-black uppercase">MP4</div>
                                <div className="text-[10px] font-medium opacity-60">Universal & Stable</div>
                            </button>
                        </div>
                    </div>

                    {/* Quality */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                            Video Quality
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
                                <button
                                    key={quality}
                                    onClick={() => setLocalSettings({ ...localSettings, quality })}
                                    className={`px-4 py-4 rounded-2xl border-2 transition-all text-left ${localSettings.quality === quality
                                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                        : 'bg-slate-800/30 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className="text-sm font-black uppercase">
                                        {QUALITY_INFO[quality].label}
                                    </div>
                                    <div className="text-[10px] font-medium opacity-60">
                                        {QUALITY_INFO[quality].bitrate}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3 mt-10 relative">
                    <button
                        onClick={handleConfirm}
                        className="w-full px-6 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 transition-all shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(6,182,212,0.5)] active:scale-[0.98] border-t border-white/20 flex items-center justify-center space-x-2"
                    >
                        <span>RENDERIZAR</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-2xl bg-transparent text-slate-500 font-bold hover:text-slate-300 transition-all text-sm uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export { QUALITY_INFO };

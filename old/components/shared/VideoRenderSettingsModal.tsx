import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    const [localSettings, setLocalSettings] = useState(settings);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleConfirm = () => {
        onRender(localSettings);
        onClose();
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-[0_0_80px_rgba(6,182,212,0.3)] relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[100px] rounded-full" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Film className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Export Video</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Settings Grid */}
                <div className="space-y-6 relative">
                    {/* Format */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
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
                                <div className="font-black text-lg mb-1">WEBM</div>
                                <div className="text-[10px] opacity-60 font-medium">Fast & Real-time</div>
                            </button>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, format: 'mp4' })}
                                className={`px-4 py-4 rounded-2xl border-2 transition-all text-left ${localSettings.format === 'mp4'
                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                    : 'bg-slate-800/30 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="font-black text-lg mb-1">MP4</div>
                                <div className="text-[10px] opacity-60 font-medium">Universal & Stable</div>
                            </button>
                        </div>
                    </div>

                    {/* Quality */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                            Video Quality
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.entries(QUALITY_INFO) as [keyof typeof QUALITY_INFO, typeof QUALITY_INFO['medium']][]).map(([key, info]) => (
                                <button
                                    key={key}
                                    onClick={() => setLocalSettings({ ...localSettings, quality: key as any })}
                                    className={`p-3 rounded-xl border transition-all text-left group ${localSettings.quality === key
                                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                        : 'bg-slate-800/30 border-white/5 text-slate-400 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-black uppercase text-sm">{info.label}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${localSettings.quality === key ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/30 text-slate-500'
                                            }`}>
                                            {info.bitrate}
                                        </span>
                                    </div>
                                    <div className={`text-[10px] font-medium leading-tight ${localSettings.quality === key ? 'text-cyan-500/70' : 'text-slate-500 group-hover:text-slate-400'
                                        }`}>
                                        {info.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-3">
                        {/* Cancel Button - Added explicitly for better UX? No, X close is enough, usually just valid action */}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8">
                    <button
                        onClick={handleConfirm}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Renderizar
                    </button>
                    <button onClick={onClose} className="w-full mt-3 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest py-2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export { QUALITY_INFO };

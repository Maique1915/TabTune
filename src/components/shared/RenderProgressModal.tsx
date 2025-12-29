import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X, CheckCircle2 } from 'lucide-react';

interface RenderProgressModalProps {
    isOpen: boolean;
    isComplete?: boolean;
    progress: number;
    status?: string | null;
    estimatedTime?: number | null;
    onCancel: () => void;
}

export const RenderProgressModal: React.FC<RenderProgressModalProps> = ({
    isOpen,
    isComplete = false,
    progress,
    status = null,
    estimatedTime = null,
    onCancel
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        {isComplete ? (
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                        ) : (
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                                <div className="absolute inset-0 blur-lg bg-cyan-500/30 rounded-full animate-pulse" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-black text-white uppercase mb-2">
                        {isComplete ? 'Renderização Concluída!' : 'Renderizando Vídeo...'}
                    </h2>
                    <p className="text-sm text-slate-400">
                        {isComplete
                            ? 'Seu vídeo foi gerado e o download deve começar automaticamente.'
                            : 'Aguarde, isso pode levar alguns minutos.'}
                    </p>
                    {status && !isComplete && (
                        <div className="mt-4 px-4 py-2 bg-slate-950/50 rounded-lg border border-white/5 inline-block">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">
                                {status}
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-slate-400 uppercase">
                            {isComplete ? 'Concluído' : 'Progresso'}
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-cyan-400">
                                {Math.max(0, Math.min(100, Math.round(progress)))}%
                            </span>
                            {!isComplete && estimatedTime !== null && estimatedTime > 0 && (
                                <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                    ~{estimatedTime}s restantes
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Cancel Button */}
                <button
                    onClick={onCancel}
                    className={`w-full px-4 py-3 rounded-xl transition-all font-black uppercase tracking-wider ${isComplete
                        ? 'bg-green-500 text-slate-950 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : 'bg-slate-800/50 border border-white/5 text-slate-400 hover:bg-slate-800 hover:text-red-400'
                        }`}
                >
                    {isComplete ? 'Fechar' : 'Cancelar'}
                </button>
            </div>
        </div>,
        document.body
    );
};

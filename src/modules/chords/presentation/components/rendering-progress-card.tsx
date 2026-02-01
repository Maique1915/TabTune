"use client";

import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface RenderingProgressCardProps {
  elapsedTime?: string;
  quality?: string;
}

export function RenderingProgressCard({ elapsedTime = "--:--", quality = "--" }: RenderingProgressCardProps) {
  const { isRendering, renderProgress, setRenderCancelRequested } = useAppContext();

  if (!isRendering) {
    return null;
  }

  const isComplete = renderProgress >= 100;

  const handleCancel = () => {
    setRenderCancelRequested(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
        <div className="w-full max-w-[840px] rounded-xl overflow-hidden flex flex-col p-8 border border-cyan-500/30 bg-[#0f2023]/90 backdrop-blur-xl shadow-[0_0_20px_rgba(7,182,213,0.15)] relative">

          {/* Header Section */}
          <div className="flex items-center justify-between mb-8 z-10">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-cyan-500 font-bold ${!isComplete ? 'animate-pulse' : ''}`}>
                {isComplete ? 'check_circle' : 'radio_button_checked'}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {isComplete ? 'Renderização Concluída!' : 'Renderizando Vídeo...'}
              </h1>
            </div>
            {!isComplete && (
              <div className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                <p className="text-cyan-500 text-xs font-semibold uppercase tracking-wider">Exportação Ativa</p>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-4 mb-8 z-10">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <p className="text-cyan-500/80 text-sm font-medium uppercase tracking-tight">Status do Processamento</p>
                <p className="text-white text-lg font-bold">
                  {isComplete ? 'Finalizando arquivo...' : 'Processando animação'}
                  <span className="text-cyan-500 ml-2">({Math.round(renderProgress)}%)</span>
                </p>
              </div>
              <p className="text-4xl font-bold text-white leading-none">{Math.round(renderProgress)}%</p>
            </div>
            <div className="h-4 w-full bg-[#1b2627] rounded-full overflow-hidden border border-white/5 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 relative overflow-hidden transition-all duration-300"
                style={{ width: `${renderProgress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:40px_40px] opacity-30 animate-[spin_3s_linear_infinite]" />
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 z-10">
            <div className="flex flex-col gap-1 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Tempo Decorrido</p>
              <p className="text-white text-xl font-bold font-display leading-tight">{elapsedTime}</p>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(7,182,213,0.4)]">
              <p className="text-cyan-500/70 text-xs font-medium uppercase tracking-wider">Status</p>
              <p className="text-cyan-500 text-xl font-bold font-display leading-tight">
                {isComplete ? 'Pronto' : 'Renderizando'}
              </p>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Qualidade</p>
              <p className="text-white text-xl font-bold font-display leading-tight capitalize">{quality}</p>
            </div>
          </div>

          {/* Console Log (Mock) */}
          <div className="bg-black/40 rounded-lg p-4 mb-8 font-mono text-[11px] text-white/40 border border-white/5 h-24 overflow-hidden relative z-10">
            <div className="flex flex-col gap-1">
              <p>&gt; [INFO] Initializing Render Engine...</p>
              <p>&gt; [INFO] Loading assets...</p>
              {!isComplete ? (
                <>
                  <p>&gt; [INFO] Processing frames...</p>
                  <p className="text-cyan-500/60 font-semibold animate-pulse">&gt; [DEBUG] Encoding stream... {Math.round(renderProgress)}%</p>
                </>
              ) : (
                <p className="text-green-500 font-bold">&gt; [SUCCESS] Render complete!</p>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-center z-10">
            {!isComplete ? (
              <button
                onClick={handleCancel}
                className="group flex items-center gap-2 px-6 py-2 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-white/50 group-hover:text-red-500 transition-colors text-lg">close</span>
                <span className="text-white/50 group-hover:text-red-500 font-medium transition-colors">Cancelar Renderização</span>
              </button>
            ) : (
              <button
                onClick={handleCancel} // Using cancel to close for now, logically might need a 'close' specific handler if differing from cancel
                className="group flex items-center gap-2 px-6 py-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                <span className="text-white font-medium transition-colors">Fechar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

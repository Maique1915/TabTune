import React, { ForwardedRef } from "react";

interface BaseStageUIProps {
    width: number;
    height: number;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    backgroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    stageContainerRef: React.RefObject<HTMLDivElement>;
    children?: React.ReactNode;
    onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const BaseStageUI = ({
    width,
    height,
    canvasRef,
    backgroundCanvasRef,
    stageContainerRef,
    children,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave
}: BaseStageUIProps) => {
    return (
        <div ref={stageContainerRef} className="relative w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full max-w-[900px] rounded-2xl border-2 border-[#1a3a3f] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group flex flex-col items-center justify-center bg-[#0c1a1d] aspect-video">
                <div className="crt-overlay absolute inset-0 z-10 pointer-events-none opacity-80"></div>
                <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]"></div>

                <canvas
                    ref={backgroundCanvasRef}
                    width={width}
                    height={height}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-[#0c1a1d]"
                />

                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="absolute inset-0 w-full h-full object-contain cursor-crosshair z-30"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                />

                {children}
            </div>
        </div>
    );
};

export const PreviewWatermark = () => {
    return (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden select-none">
            <h1 className="text-[150px] font-black tracking-widest opacity-15 animate-pulse"
                style={{
                    animation: 'colorCycle 10s infinite, pulse 4s infinite ease-in-out',
                    transform: 'rotate(-15deg)'
                }}
            >
                PREVIEW
            </h1>
            <style jsx>{`
                @keyframes colorCycle {
                    0% { color: #ef4444; } /* red */
                    25% { color: #3b82f6; } /* blue */
                    50% { color: #22c55e; } /* green */
                    75% { color: #eab308; } /* yellow */
                    100% { color: #ef4444; } /* red */
                }
            `}</style>
        </div>
    );
};

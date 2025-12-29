"use client";

import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ScoreStyle, MeasureData } from '@/lib/tab-editor/types';

interface ScorePreviewProps {
    code: string;
    measures: MeasureData[];
    timeSignature: string;
    playbackPosition: number;
    isPlaying: boolean;
    style: ScoreStyle;
    showControls?: boolean;
}

declare global {
    interface Window {
        VexTab: any;
        Artist: any;
        Vex: any;
    }
}

const MeasureThumbnail = memo(({
    measureCode,
    header,
    isActive,
    progress,
    style,
    shouldAnimate,
    showClef,
    showTimeSig
}: {
    measureCode: string;
    header: string;
    isActive: boolean;
    progress: number;
    style: ScoreStyle;
    shouldAnimate: boolean;
    showClef: boolean;
    showTimeSig: boolean;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [buildProgress, setBuildProgress] = useState((style.transitionType === 'assemble' && shouldAnimate) ? 0 : 100);
    const [renderError, setRenderError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new MutationObserver(() => {
            containerRef.current?.querySelectorAll('a').forEach(a => a.remove());
        });
        observer.observe(containerRef.current, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (style.transitionType !== 'assemble' || !shouldAnimate) {
            setBuildProgress(100);
            return;
        }
        setBuildProgress(0);
        let start: number;
        const duration = 1000;
        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const p = Math.min((timestamp - start) / duration, 1);
            setBuildProgress(p * 100);
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [measureCode, style.transitionType, shouldAnimate]);

    const draw = () => {
        const container = containerRef.current;
        if (!container || !window.VexTab || !window.Vex) return;

        // Clear previous render
        container.innerHTML = '';

        // Create SVG renderer attached to div
        // We use a temporary simple way to set background since SVG is transparent by default
        container.style.backgroundColor = style.background || '#09090b';

        const applyElementStyle = (obj: any, color: string) => {
            if (!obj) return;
            const styleObj = { fillStyle: color, strokeStyle: color };

            try {
                if (obj.setStyle) obj.setStyle(styleObj);
                if (obj.glyph && obj.glyph.setStyle) obj.glyph.setStyle(styleObj);
                if (obj.modifiers) obj.modifiers.forEach((m: any) => applyElementStyle(m, color));
            } catch (e) { }
        };

        const renderLayer = (targetColor?: string, filterNotes: boolean = false) => {
            try {
                const renderer = new window.Vex.Flow.Renderer(container, window.Vex.Flow.Renderer.Backends.SVG);
                // Set size (similar to canvas logic but for SVG)
                renderer.resize(800, 340);
                const context = renderer.getContext();

                // Helper to check for modifiers and apply styles logic
                // (Same robust logic as before)

                const hasNotation = measureCode.includes('notation=true');
                const hasTab = measureCode.includes('tablature=true');

                let startY = 40;
                if (hasNotation && !hasTab) startY = 120;
                else if (!hasNotation && hasTab) startY = 100;

                const scaleVal = (style.scale || 1.0) * 1.5;
                const artist = new window.Artist(10, startY, 780, { scale: scaleVal });
                const vextab = new window.VexTab(artist);

                vextab.parse(`${header}\n${measureCode}`);
                setRenderError(null);

                if (artist.staves) {
                    artist.staves.forEach((staveInstance: any) => {
                        const vStaves = [staveInstance.stave, staveInstance.tab_stave].filter(Boolean);

                        vStaves.forEach((vfStave: any) => {
                            if (!vfStave) return;

                            // --- STYLE STAFF LINES ---
                            const sColor = targetColor || style.staffLines;
                            if (vfStave.setStyle) vfStave.setContext(context).setStyle({ strokeStyle: sColor, fillStyle: sColor });

                            // --- HANDLE MODIFIERS ---
                            let modifiers: any[] = [];
                            if (vfStave.getModifiers && typeof vfStave.getModifiers === 'function') {
                                try { modifiers = vfStave.getModifiers(); } catch (e) { modifiers = []; }
                            } else if (vfStave.modifiers) {
                                modifiers = vfStave.modifiers;
                            }

                            if (modifiers) {
                                modifiers.forEach((mod: any) => {
                                    if (!mod) return;
                                    const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                                    const isClef = category.includes('clef');
                                    const isTime = category.includes('time');
                                    const isKey = category.includes('key');

                                    if ((!showClef && isClef) || (!showTimeSig && isTime)) {
                                        // Hide element
                                        mod.setStyle({ fillStyle: 'transparent', strokeStyle: 'transparent' });
                                        if (mod.setWidth) mod.setWidth(0);
                                        if (mod.setPadding) mod.setPadding(0);
                                        return;
                                    }

                                    // Explicitly apply styles based on type
                                    if (isClef) {
                                        const color = targetColor || style.clefs || style.notes;
                                        if (mod.setStyle) mod.setStyle({ fillStyle: color, strokeStyle: color });
                                        if (mod.setAttribute) mod.setAttribute('fill', color);
                                        // Tag for DOM access - try AddClass logic
                                        if (mod.addClass) mod.addClass('vf-custom-clef');
                                        // Tag via ID if attrs exists (common in VexFlow)
                                        if (mod.attrs) mod.attrs.id = 'vf-custom-clef-id';
                                    } else if (isTime) {
                                        const color = targetColor || style.timeSignature || style.notes;
                                        if (mod.setStyle) mod.setStyle({ fillStyle: color, strokeStyle: color });
                                        if (mod.addClass) mod.addClass('vf-custom-time-sig');
                                        if (mod.attrs) mod.attrs.id = 'vf-custom-time-sig-id';
                                    } else if (isKey) {
                                        const color = targetColor || style.symbols || style.notes;
                                        applyElementStyle(mod, color);
                                        if (mod.addClass) mod.addClass('vf-custom-key-sig');
                                        if (mod.attrs) mod.attrs.id = 'vf-custom-key-sig-id';
                                    } else {
                                        // Default fallback for other modifiers
                                        const color = targetColor || style.notes;
                                        applyElementStyle(mod, color);
                                    }
                                });
                            }
                        });

                        if (!filterNotes) {
                            [staveInstance.note_notes, staveInstance.tab_notes].forEach((notesGroup: any) => {
                                if (notesGroup) {
                                    notesGroup.forEach((note: any) => {
                                        try {
                                            const isRest = note.isRest === true || (typeof note.isRest === 'function' && note.isRest());
                                            const finalColor = targetColor || (isRest ? style.rests : style.notes);

                                            applyElementStyle(note, finalColor);
                                            if (note.setStemStyle) note.setStemStyle({ strokeStyle: finalColor });

                                            if (isRest) {
                                                if (note.setBeam) note.setBeam(null);
                                            } else if (note.getBeam && note.getBeam()) {
                                                const beam = note.getBeam();
                                                if (beam.setStyle) beam.setStyle({ fillStyle: finalColor, strokeStyle: finalColor });
                                            }

                                            if (note.getAccidentals) {
                                                note.getAccidentals().forEach((acc: any) => applyElementStyle(acc, style.notes));
                                            }

                                            if (note.getDots) {
                                                note.getDots().forEach((dot: any) => applyElementStyle(dot, finalColor));
                                            }
                                        } catch (e) { }
                                    });
                                }
                            });
                        }
                    });
                }

                artist.render(renderer);

                // --- POST-RENDER DOM FIX ---
                // Manually paint the tagged elements since VexFlow 4.2.2 sometimes drops styles for specific modifiers
                setTimeout(() => {
                    if (!container) return;

                    const paintElements = (selector: string, color: string) => {
                        const elements = container.querySelectorAll(selector);
                        elements.forEach((el: any) => {
                            // If element is a path itself (unlikely for classes but possible for IDs)
                            if (el.tagName.toLowerCase() === 'path') {
                                el.setAttribute('fill', color);
                                el.setAttribute('stroke', color);
                                el.style.fill = color;
                                el.style.stroke = color;
                            }

                            const paths = el.getElementsByTagName('path');
                            Array.from(paths).forEach((path: any) => {
                                path.setAttribute('fill', color);
                                path.setAttribute('stroke', color);
                                path.style.fill = color;
                                path.style.stroke = color;
                            });

                            // Also target text
                            const texts = el.getElementsByTagName('text');
                            Array.from(texts).forEach((text: any) => {
                                text.setAttribute('fill', color);
                                text.style.fill = color;
                            });
                        });
                    };

                    // Try multiple selectors for redundancy
                    if (style.clefs) {
                        paintElements('.vf-custom-clef', style.clefs);
                        paintElements('#vf-custom-clef-id', style.clefs);
                        paintElements('.vf-clef', style.clefs); // Standard VF class
                    }
                    if (style.timeSignature) {
                        paintElements('.vf-custom-time-sig', style.timeSignature);
                        paintElements('#vf-custom-time-sig-id', style.timeSignature);
                        paintElements('.vf-time-signature', style.timeSignature); // Standard VF class
                    }
                    if (style.symbols) {
                        paintElements('.vf-custom-key-sig', style.symbols);
                        paintElements('#vf-custom-key-sig-id', style.symbols);
                        paintElements('.vf-key-signature', style.symbols); // Standard VF class
                    }
                }, 0);

            } catch (err: any) {
                setRenderError(err.message || "Vextab Error");
            }
        };

        renderLayer();

        if (isActive && !renderError && container) {
            // Playhead via DOM/SVG logic? 
            // VexTab's Artist might not support manual playhead drawing on SVG context easily without API support.
            // But we can just create an SVG line or overlay on top of the container if needed.
            // For now, let's stick to simple overlay for playhead using absolute div since we are in HTML/SVG land.
        }
    };

    useEffect(() => { draw(); }, [measureCode, header, progress, isActive, style, shouldAnimate, showClef, showTimeSig]);

    return (
        <div
            className="rounded-[3.5rem] shadow-[0_80px_160px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 relative flex items-center justify-center min-h-[310px]"
            style={{ backgroundColor: style.background }}
        >
            <div
                ref={containerRef}
                className="score-canvas-viewport w-full h-full flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: renderError ? 0.2 : 1 }}
            />

            {/* Playhead Overlay */}
            {isActive && !renderError && (
                <div
                    className="absolute top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10 pointer-events-none transition-transform will-change-transform"
                    style={{
                        left: `${progress}%`,
                        // Adjust position visually if needed
                    }}
                />
            )}

            {renderError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in pointer-events-none">
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <p className="text-slate-500 text-[10px] font-mono max-w-xs">{renderError}</p>
                </div>
            )}
        </div>
    );
});

const ScorePreview: React.FC<ScorePreviewProps> = ({
    code,
    playbackPosition,
    isPlaying,
    style,
    measures,
    showControls = true
}) => {
    const { header, rawMeasureCodes } = useMemo(() => {
        try {
            if (!code) return { header: '', rawMeasureCodes: [] };
            const lines = code.split('\n');
            const headerStr = lines.filter(l => l.startsWith('options')).join('\n');
            const content = code.replace(headerStr, '').trim();
            const blocks = content.split(/(?=tabstave)/g).filter(b => b.trim().length > 0);
            return { header: headerStr, rawMeasureCodes: blocks };
        } catch (e) {
            console.error("VexTab Parse Error", e);
            return { header: '', rawMeasureCodes: [] };
        }
    }, [code]);

    const currentMeasureIndex = useMemo(() => {
        if (rawMeasureCodes.length === 0) return 0;
        const idx = Math.floor((playbackPosition / 100) * rawMeasureCodes.length);
        return Math.min(idx, rawMeasureCodes.length - 1);
    }, [playbackPosition, rawMeasureCodes.length]);

    const measureProgress = useMemo(() => {
        if (rawMeasureCodes.length === 0) return 0;
        const measureWeight = 100 / rawMeasureCodes.length;
        return ((playbackPosition % measureWeight) / measureWeight) * 100;
    }, [playbackPosition, rawMeasureCodes.length]);

    const shouldAnimate = currentMeasureIndex === 0 || currentMeasureIndex === rawMeasureCodes.length - 1;

    const activeMeasureData = measures && measures[currentMeasureIndex];

    return (
        <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />
            <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative">
                <div className="w-full max-w-5xl relative h-[310px]">
                    {rawMeasureCodes.map((mCode, idx) => (
                        idx === currentMeasureIndex && (
                            <div
                                key={`${idx}-${style.transitionType}`}
                                className={`absolute inset-0 w-full ${shouldAnimate ? `score-animation-${style.transitionType}` : ''}`}
                            >
                                <MeasureThumbnail
                                    measureCode={mCode}
                                    header={header}
                                    isActive={isPlaying}
                                    progress={measureProgress}
                                    style={style}
                                    shouldAnimate={shouldAnimate}
                                    showClef={activeMeasureData?.showClef ?? false}
                                    showTimeSig={activeMeasureData?.showTimeSig ?? false}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>

            {showControls && (
                <div className="h-24 flex items-center justify-between px-12 z-20 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Timeline</span>
                        <div className="flex space-x-2">
                            {rawMeasureCodes.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentMeasureIndex ? 'bg-cyan-500 w-16 shadow-[0_0_15px_#06b6d4]' : 'bg-slate-800 w-4 hover:bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-900/50 px-6 py-2 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-cyan-400 uppercase">Section {currentMeasureIndex + 1}</span>
                        <div className="w-px h-4 bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-500">{rawMeasureCodes.length} MEASURES</span>
                    </div>
                </div>
            )}

            <style>{`
        .score-animation-slide { animation: scoreSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .score-animation-fade { animation: scoreFadeIn 0.6s ease-out forwards; }
        @keyframes scoreSlideIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(20px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes scoreFadeIn {
          0% { opacity: 0; filter: blur(15px); }
          100% { opacity: 1; filter: blur(0); }
        }
        .score-canvas-viewport svg { width: 100%; height: auto; }
      `}</style>
        </div>
    );
};

export default ScorePreview;

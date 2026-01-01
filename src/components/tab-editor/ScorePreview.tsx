"use client";

import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ScoreStyle, MeasureData } from '@/lib/tab-editor/types';
import { getNoteKeyFromFret } from '@/lib/tab-editor/utils/musicMath';
import { Music, MousePointerClick, MoreHorizontal, MoveLeft, MoveRight, Film, Settings } from 'lucide-react';
import { useCanvasRecorder } from '@/lib/shared/hooks/useCanvasRecorder';
import { VideoRenderSettings } from '@/components/shared/VideoRenderSettingsModal';
import { PRESET_THEMES } from '@/lib/tab-editor/constants';

export interface ScorePreviewRef {
    startRender: (settings: VideoRenderSettings) => void;
    cancelRender: () => void;
    isRendering: boolean;
    progress: number;
    isComplete: boolean;
}

interface ScorePreviewProps {
    code: string;
    measures: MeasureData[];
    timeSignature: string;
    clef?: string;
    keySignature?: string;
    playbackPosition: number;
    isPlaying: boolean;
    style: ScoreStyle;
    showControls?: boolean;
    showNotation?: boolean;
    showTablature?: boolean;
    onMeasuresChange?: (measures: MeasureData[]) => void;
    selectedNoteIds?: string[];
    onSelectNote?: (noteId: string, isMulti: boolean) => void;
    onDoubleClickNote?: (noteId: string) => void;
    currentMeasureIndex?: number;
    onPlaybackControl?: (isPlaying: boolean) => void;
    onPlaybackPositionChange?: (position: number) => void;
    onToggleVisibility?: (type: 'notation' | 'tablature') => void;
    onRenderStateChange?: (state: { isRendering: boolean; progress: number; isComplete: boolean }) => void;
}

declare global {
    interface Window {
        Vex: any;
        VexTab: any; // Kept to avoid breaking global types if used elsewhere
    }
}



const MeasureThumbnail = memo(({
    measureData,
    measureIndex,
    isActive,
    progress,
    style,
    shouldAnimate,
    timeSignatureStr,
    showNotation,
    showTablature,
    onNoteClick,
    onNoteDoubleClick,
    selectedNoteIds,
    dpr,
    clef,
    keySignature
}: {
    measureData: MeasureData;
    measureIndex: number;
    isActive: boolean;
    progress: number;
    style: ScoreStyle;
    shouldAnimate: boolean;
    timeSignatureStr: string;
    showNotation: boolean;
    showTablature: boolean;
    onNoteClick?: (measureIndex: number, noteIndex: number, isMulti: boolean) => void;
    onNoteDoubleClick?: (noteId: string) => void;
    selectedNoteIds?: string[];
    dpr: number;
    clef?: string;
    keySignature?: string
}) => {
    const notationCanvasRef = useRef<HTMLCanvasElement>(null);
    const playheadCanvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenSvgRef = useRef<SVGElement | null>(null);
    const cachedNotationImgRef = useRef<HTMLImageElement | null>(null);
    const [renderError, setRenderError] = useState<string | null>(null);

    // Resolution Constants
    const width = 800;
    const height = 340;

    const hexToRgba = (hex: string, alpha: number) => {
        if (!hex || typeof hex !== 'string') return hex;
        // Strip alpha from 8-digit hex if present, we prefer theme opacity
        let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
        if (cleanHex.length === 8) cleanHex = cleanHex.slice(0, 6);
        if (cleanHex.length === 4) cleanHex = cleanHex.slice(0, 3);

        let r = 0, g = 0, b = 0;
        if (cleanHex.length === 3) {
            r = parseInt(cleanHex[0] + cleanHex[0], 16);
            g = parseInt(cleanHex[1] + cleanHex[1], 16);
            b = parseInt(cleanHex[2] + cleanHex[2], 16);
        } else if (cleanHex.length === 6) {
            r = parseInt(cleanHex.slice(0, 2), 16);
            g = parseInt(cleanHex.slice(2, 4), 16);
            b = parseInt(cleanHex.slice(4, 6), 16);
        } else {
            return hex; // Fallback for names or complex strings
        }
        return `rgba(${r},${g},${b},${alpha})`;
    };

    const applyStyles = (obj: any, styleDef: any, bg: string = 'transparent') => {
        if (!obj || !styleDef) return;
        const color = typeof styleDef === 'string' ? styleDef : styleDef.color;
        const opacity = typeof styleDef === 'string' ? 1 : (styleDef.opacity ?? 1);
        const shadow = typeof styleDef === 'string' ? false : (styleDef.shadow ?? false);
        const rgbaColor = hexToRgba(color, opacity);

        const styleOpts: any = { fillStyle: rgbaColor, strokeStyle: rgbaColor, backgroundColor: bg };
        if (shadow) {
            styleOpts.shadowColor = typeof styleDef === 'string' ? color : (styleDef.shadowColor || color);
            styleOpts.shadowBlur = typeof styleDef === 'string' ? 10 : (styleDef.shadowBlur ?? 10);
        } else {
            styleOpts.shadowBlur = 0;
        }

        if (obj.setStyle) obj.setStyle(styleOpts);
        if (obj.setStemStyle) obj.setStemStyle({ strokeStyle: rgbaColor });
        if (obj.modifiers) obj.modifiers.forEach((m: any) => applyStyles(m, styleDef, bg));
    };

    const renderStaticNotation = () => {
        if (typeof window === 'undefined' || !window.Vex) return null;

        const host = document.createElement('div');
        const { Renderer, Stave, StaveNote, TabStave, TabNote, Formatter, Dot, Accidental, Articulation, TabTie, StaveTie, TabSlide, Vibrato, Bend, Annotation } = window.Vex.Flow;
        const renderer = new Renderer(host, Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();

        try {
            const svg = (context as any).svg;
            svg.style.backgroundColor = style.background || '#09090b';

            const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bgRect.setAttribute("width", "100%");
            bgRect.setAttribute("height", "100%");
            bgRect.setAttribute("fill", style.background || '#09090b');
            bgRect.setAttribute("id", "measure-bg"); // Add an ID to identify the background rect
            svg.prepend(bgRect);

            let x = 10;
            const staveWidth = width - 20;
            let notes: any[] = [];
            let tabNotes: any[] = [];
            let stave: any = null;

            if (showNotation) {
                let staveY = 120; // Default single center
                if (showTablature) staveY = 70; // Top position if dual
                stave = new Stave(x, staveY, staveWidth);
                // Priority: Global clef prop -> Measure-specific clef -> Style default -> Treble
                // We prioritizing the Global Settings 'clef' prop because the Sidebar Global Settings
                // are intended to control the overall view.
                const effectiveClef = clef || measureData.clef || (style.clefs && typeof style.clefs === 'string' ? style.clefs : 'treble');

                if (measureData.showClef) {
                    if (effectiveClef && effectiveClef !== 'tab') {
                        stave.addClef(effectiveClef);
                    }
                }

                // Add Key Signature if provided
                if (keySignature) {
                    stave.addKeySignature(keySignature);
                }

                if (measureData.showTimeSig) stave.addTimeSignature(timeSignatureStr || '4/4');

                stave.getModifiers().forEach((mod: any) => {
                    const category = (mod.getCategory ? mod.getCategory() : "").toLowerCase();
                    let targetStyle = style.notes;
                    if (category.includes('clef')) targetStyle = style.clefs;
                    else if (category.includes('time')) targetStyle = style.timeSignature;
                    else if (category.includes('key')) targetStyle = style.symbols;
                    else if (category.includes('barline')) targetStyle = style.staffLines;
                    applyStyles(mod, targetStyle, style.background || 'transparent');
                });

                stave.setContext(context);
                const linesColor = hexToRgba(style.staffLines.color, style.staffLines.opacity);
                const linesStyle: any = { strokeStyle: linesColor, fillStyle: linesColor };
                if (style.staffLines.shadow) {
                    linesStyle.shadowColor = style.staffLines.shadowColor || style.staffLines.color;
                    linesStyle.shadowBlur = style.staffLines.shadowBlur || 10;
                }
                stave.setStyle(linesStyle).draw();

                notes = measureData.notes.map((note) => {
                    const isSelected = selectedNoteIds?.includes(note.id);
                    let noteStyle = isSelected ? PRESET_THEMES.default.style.notes : style.notes;

                    if (note.type === 'rest') {
                        const sn = new StaveNote({ keys: ["b/4"], duration: note.duration + "r", clef: effectiveClef });
                        applyStyles(sn, isSelected ? noteStyle : style.rests, style.background || 'transparent');
                        return sn;
                    } else {
                        const keys = note.positions.map(p => getNoteKeyFromFret(parseInt(p.fret), parseInt(p.string)));

                        // Validate keys
                        if (keys.length === 0) {
                            console.error(`[ScorePreview] Note ${note.id} has no valid keys for notation! Positions:`, note.positions);
                            // Return a placeholder rest to avoid breaking VexFlow
                            return new StaveNote({ keys: ["b/4"], duration: note.duration + "r", clef: effectiveClef });
                        }

                        // Explicitly pass the clef to StaveNote so it knows how to position the notes!
                        const sn = new StaveNote({ keys: keys, duration: note.duration, clef: effectiveClef });
                        const d = note.decorators || {};
                        if (d.dot) Dot.buildAndAttach([sn], { all: true });
                        if (note.accidental && note.accidental !== 'none') sn.addModifier(new Accidental(note.accidental));

                        // Articulations
                        if (d.staccato) sn.addModifier(new Articulation('a.'));
                        if (d.staccatissimo) sn.addModifier(new Articulation('av'));
                        if (d.accent) sn.addModifier(new Articulation('a>'));
                        if (d.tenuto) sn.addModifier(new Articulation('a-'));
                        if (d.marcato) sn.addModifier(new Articulation('a^'));
                        if (d.pizzicato) sn.addModifier(new Articulation('a+'));
                        if (d.snapPizzicato) sn.addModifier(new Articulation('ao'));
                        if (d.fermataUp) sn.addModifier(new Articulation('a@a'));
                        if (d.fermataDown) sn.addModifier(new Articulation('a@u'));
                        if (d.bowUp) sn.addModifier(new Articulation('a|'));
                        if (d.bowDown) sn.addModifier(new Articulation('am'));
                        if (d.openNote) sn.addModifier(new Articulation('ah'));

                        // Techniques Modifiers
                        if (note.technique === 'v') {
                            const vib = new Vibrato();
                            applyStyles(vib, noteStyle, style.background || 'transparent');
                            sn.addModifier(vib);
                        }
                        if (note.technique === 't') {
                            const ann = new Annotation('T').setVerticalJustification(Annotation.VerticalJustify.TOP);
                            applyStyles(ann, noteStyle, style.background || 'transparent');
                            sn.addModifier(ann);
                        }
                        if (note.technique === 'b') {
                            const bend = new Bend([{ type: 1, text: "Full" }]); // 1 = UP
                            applyStyles(bend, noteStyle, style.background || 'transparent');
                            sn.addModifier(bend);
                        }

                        applyStyles(sn, noteStyle, style.background || 'transparent');
                        return sn;
                    }
                });

                if (notes.length > 0) {
                    const beams = window.Vex.Flow.Beam.generateBeams(notes);
                    beams.forEach((b: any) => applyStyles(b, style.notes, style.background || 'transparent'));
                    Formatter.FormatAndDraw(context, stave, notes);
                    beams.forEach((b: any) => b.setContext(context).draw());
                }
            }

            if (showTablature) {
                let yOffset = 120; // Default single center
                if (showNotation) yOffset = 180; // Bottom position if dual
                const tabStave = new TabStave(x, yOffset, staveWidth);
                if (measureData.showClef) tabStave.addTabGlyph();
                tabStave.getModifiers().forEach((mod: any) => applyStyles(mod, style.clefs, style.background || 'transparent'));

                tabStave.setContext(context);
                const linesColor = hexToRgba(style.staffLines.color, style.staffLines.opacity);
                tabStave.setStyle({ strokeStyle: linesColor, fillStyle: linesColor }).draw();

                tabNotes = measureData.notes.map((note) => {
                    const isSelected = selectedNoteIds?.includes(note.id);
                    const tabNoteStyle = isSelected ? PRESET_THEMES.default.style.notes : (note.type === 'rest' ? style.rests : style.tabNumbers);

                    if (note.type === 'rest') {
                        const tn = new TabNote({ positions: [{ str: 3, fret: 'X' }], duration: note.duration + "r" });
                        applyStyles(tn, tabNoteStyle, style.background || 'transparent');
                        return tn;
                    } else {
                        // Check if this note is a target of a bend in the current measure
                        const isBendTarget = measureData.notes.some(n => n.technique === 'b' && n.slideTargetId === note.id);

                        const positions = note.positions.map(p => ({
                            str: parseInt(p.string),
                            fret: isBendTarget ? `(${p.fret})` : p.fret
                        })).filter(p => {
                            const isValid = !isNaN(p.str);
                            if (!isValid) {
                                console.warn(`[ScorePreview] Filtered out invalid position: string="${p.str}" (NaN). Original: ${JSON.stringify(note.positions)}`);
                            }
                            return isValid;
                        });

                        // Validate we have positions after filtering
                        if (positions.length === 0) {
                            console.error(`[ScorePreview] Note ${note.id} has no valid positions after filtering! Original positions:`, note.positions);
                        }

                        const tn = new TabNote({
                            positions,
                            duration: note.duration
                        });
                        const d = note.decorators || {};

                        // Articulations on Tab
                        if (d.staccato) tn.addModifier(new Articulation('a.'));
                        if (d.staccatissimo) tn.addModifier(new Articulation('av'));
                        if (d.accent) tn.addModifier(new Articulation('a>'));
                        if (d.tenuto) tn.addModifier(new Articulation('a-'));
                        if (d.marcato) tn.addModifier(new Articulation('a^'));
                        if (d.pizzicato) tn.addModifier(new Articulation('a+'));
                        if (d.snapPizzicato) tn.addModifier(new Articulation('ao'));
                        if (d.fermataUp) tn.addModifier(new Articulation('a@a'));
                        if (d.fermataDown) tn.addModifier(new Articulation('a@u'));
                        if (d.bowUp) tn.addModifier(new Articulation('a|'));
                        if (d.bowDown) tn.addModifier(new Articulation('am'));
                        if (d.openNote) tn.addModifier(new Articulation('ah'));

                        // Techniques Modifiers on Tab
                        if (note.technique === 'v') {
                            const vib = new Vibrato();
                            applyStyles(vib, tabNoteStyle, style.background || 'transparent');
                            tn.addModifier(vib);
                        }
                        if (note.technique === 't') {
                            const ann = new Annotation('T').setVerticalJustification(Annotation.VerticalJustify.TOP);
                            applyStyles(ann, tabNoteStyle, style.background || 'transparent');
                            tn.addModifier(ann);
                        }
                        if (note.technique === 'b') {
                            let bendLabel = "Full";
                            if (note.slideTargetId) {
                                const target = measureData.notes.find(n => n.id === note.slideTargetId);
                                if (target && target.positions.length > 0 && note.positions.length > 0) {
                                    const diff = parseInt(target.positions[0].fret) - parseInt(note.positions[0].fret);
                                    if (diff === 1) bendLabel = "1/2";
                                    else if (diff === 2) bendLabel = "Full";
                                    else if (diff > 0) bendLabel = diff.toString();
                                }
                            }
                            const bend = new Bend([{ type: 1, text: bendLabel }]); // 1 = UP
                            applyStyles(bend, tabNoteStyle, style.background || 'transparent');
                            tn.addModifier(bend);
                        }

                        applyStyles(tn, tabNoteStyle, style.background || 'transparent');
                        return tn;
                    }
                });

                if (tabNotes.length > 0) {
                    Formatter.FormatAndDraw(context, tabStave, tabNotes);
                }
            }

            // --- RENDER TIES & SLURS FOR TECHNIQUES ---
            measureData.notes.forEach((n, nIdx) => {
                const tech = n.technique;
                if (tech && ['h', 'p', 's', 'l'].includes(tech)) {
                    let targetIdx = -1;
                    if (n.slideTargetId) {
                        targetIdx = measureData.notes.findIndex(target => target.id === n.slideTargetId);
                    } else if (nIdx + 1 < measureData.notes.length) {
                        // Fallback to next note if targetId isn't set but it's a connector
                        const next = measureData.notes[nIdx + 1];
                        if (next.type === 'note' && next.positions[0].string === n.positions[0].string) targetIdx = nIdx + 1;
                    }

                    if (targetIdx !== -1) {
                        const firstIdx = nIdx;
                        const secondIdx = targetIdx;

                        let tieLabel = "";
                        if (tech === 'h') tieLabel = "h";
                        if (tech === 'p') tieLabel = "p";
                        if (tech === 's') tieLabel = "sl.";
                        if (tech === 'l') tieLabel = ""; // Pure slur - no label

                        const tieStyle = selectedNoteIds?.includes(n.id) || selectedNoteIds?.includes(measureData.notes[targetIdx].id)
                            ? PRESET_THEMES.default.style.notes
                            : style.notes;

                        if (showNotation && notes[firstIdx] && notes[secondIdx]) {
                            const slur = new StaveTie({
                                first_note: notes[firstIdx],
                                last_note: notes[secondIdx],
                                first_indices: [0],
                                last_indices: [0]
                            }, tieLabel);
                            applyStyles(slur, tieStyle, style.background || 'transparent');
                            slur.setContext(context).draw();
                        }

                        if (showTablature && tabNotes[firstIdx] && tabNotes[secondIdx]) {
                            const tie = new TabTie({
                                first_note: tabNotes[firstIdx],
                                last_note: tabNotes[secondIdx],
                                first_indices: [0],
                                last_indices: [0]
                            }, tieLabel);
                            applyStyles(tie, tieStyle, style.background || 'transparent');
                            tie.setContext(context).draw();
                        }
                    }
                }
            });

            // --- POST-PROCESS SVG ---
            // Force colors on common elements that sometimes bypass VexFlow's setStyle (like Annotations, Ties text, etc.)
            const svgElements = host.querySelectorAll('text, path, rect, circle');
            svgElements.forEach((el: any) => {
                const currentFill = el.getAttribute('fill');
                const currentStroke = el.getAttribute('stroke');

                // Identify category from VexFlow classes
                const cls = (el.getAttribute('class') || "") + (el.parentElement?.getAttribute('class') || "");
                const d = el.getAttribute('d') || "";
                let targetStyle = style.notes;

                // Robust Staff/Stave detection
                // VexFlow stave lines are often paths without classes, but they are long horizontal lines (e.g. "M... L...")
                const isHorizontalLine = el.tagName === 'path' && d.includes('M') && d.includes('L') && !d.includes('C') && !d.includes('Q');

                if (cls.includes('stave') || cls.includes('staffline') || cls.includes('barline') || isHorizontalLine) {
                    targetStyle = style.staffLines;
                } else if (cls.includes('clef')) {
                    targetStyle = style.clefs;
                } else if (cls.includes('time-signature') || cls.includes('timesignature')) {
                    targetStyle = style.timeSignature;
                } else if (cls.includes('tab-note') || cls.includes('tabnote')) {
                    targetStyle = style.tabNumbers;
                } else if (cls.includes('stave-note') || cls.includes('stavenote')) {
                    targetStyle = style.notes;
                } else if (cls.includes('rest')) {
                    targetStyle = style.rests;
                }

                const targetColor = hexToRgba(targetStyle.color, targetStyle.opacity ?? 1);

                // If element is black or default slate, force it to theme color (unless it's the background)
                if (currentFill === '#000000' || currentFill === 'black' || !currentFill) {
                    if (el.tagName !== 'rect' || el.getAttribute('id') !== 'measure-bg') {
                        el.setAttribute('fill', targetColor);
                    }
                }
                if (currentStroke === '#000000' || currentStroke === 'black' || !currentStroke) {
                    if (el.tagName !== 'rect' || el.getAttribute('id') !== 'measure-bg') {
                        el.setAttribute('stroke', targetColor);
                    }
                }

                // Apply shadows if enabled in theme
                if (targetStyle.shadow) {
                    const shadowId = `shadow-${targetStyle.color.replace(/#/g, '')}`;
                    if (!svg.querySelector(`#${shadowId}`)) {
                        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
                        filter.setAttribute("id", shadowId);
                        filter.innerHTML = `
                            <feGaussianBlur stdDeviation="${(targetStyle.shadowBlur || 10) / 4}" />
                            <feOffset dx="0" dy="0" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        `;
                        svg.prepend(filter);
                    }
                    el.setAttribute("filter", `url(#${shadowId})`);
                }

                // Fix for [object Object] - if text content starts/ends with object signs, hide or fix it
                if (el.textContent === '[object Object]') {
                    el.textContent = ''; // Hide broken text
                }
            });

            // Post-process SVG: Fix white "boxes" behind tab numbers and other elements in dark mode
            const bgHex = style.background || '#09090b';
            const rects = svg.querySelectorAll('rect');
            rects.forEach((rect: any) => {
                const fill = rect.getAttribute('fill');
                const w = parseFloat(rect.getAttribute('width') || '0');
                const h = parseFloat(rect.getAttribute('height') || '0');

                // VexFlow uses white rects for clearance. We theme them to match background.
                // We check w > 2 && h > 2 to avoid hitting thin barlines.
                if ((fill === '#ffffff' || fill === 'white') && w > 2 && h > 2) {
                    rect.setAttribute('fill', bgHex);
                }
            });

            return svg;
        } catch (e: any) {
            console.error("VexFlow Static Render Error", e);
            setRenderError(e.message);
            return null;
        }
    };

    const rasterizeSvg = async () => {
        const svg = offscreenSvgRef.current;
        if (!svg) return;

        try {
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.src = url;

            await new Promise((resolve) => {
                img.onload = () => {
                    cachedNotationImgRef.current = img;
                    URL.revokeObjectURL(url);
                    resolve(null);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve(null);
                };
            });
        } catch (e) {
            console.error('Rasterization failure', e);
        }
    };

    const drawNotation = () => {
        const canvas = notationCanvasRef.current;
        const img = cachedNotationImgRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const drawPlayhead = () => {
        const canvas = playheadCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear only the playhead canvas (it's transparent)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isActive && progress > 0) {
            const playheadX = Math.round((progress / 100) * width);
            const activeColor = style.activeNoteColor || '#06b6d4';
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.globalCompositeOperation = 'screen';
            for (let i = 1; i <= 8; i++) {
                ctx.fillStyle = activeColor;
                ctx.globalAlpha = 0.1 / i;
                ctx.fillRect(playheadX - i, 0, i * 2, height);
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = activeColor;
            ctx.fillRect(playheadX - 0.5, 0, 1.5, height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(playheadX, 0, 0.5, height);
            ctx.restore();
        }
    };

    // Static Update Loop
    useEffect(() => {
        const updateNotation = async () => {
            offscreenSvgRef.current = renderStaticNotation();
            await rasterizeSvg();
            drawNotation();
            drawPlayhead(); // Initial draw
        };
        updateNotation();
    }, [measureData, style, timeSignatureStr, showNotation, showTablature, selectedNoteIds, dpr, clef]);

    // Playback Loop (Synchronous and ultra-fast)
    useEffect(() => {
        drawPlayhead();
    }, [isActive, progress]);

    return (
        <div className="overflow-hidden relative flex items-center justify-center aspect-[800/340] w-full bg-transparent">
            <div className="score-canvas-viewport w-full h-full relative" style={{ opacity: renderError ? 0.2 : 1 }}>
                <canvas
                    ref={notationCanvasRef}
                    width={width * dpr}
                    height={height * dpr}
                    className="absolute inset-0 w-full h-full"
                    style={{ imageRendering: 'auto' }}
                />
                <canvas
                    ref={playheadCanvasRef}
                    width={width * dpr}
                    height={height * dpr}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ imageRendering: 'auto' }}
                />
            </div>
        </div>
    );
});

const ScorePreview = React.forwardRef<ScorePreviewRef, ScorePreviewProps>(({
    code,
    playbackPosition,
    isPlaying,
    style,
    measures,
    showControls = true,
    timeSignature,
    clef = 'treble',
    keySignature,
    showNotation = true,
    showTablature = true,
    onMeasuresChange,
    selectedNoteIds = [],
    onSelectNote,
    onDoubleClickNote,
    currentMeasureIndex: externalMeasureIndex,
    onPlaybackControl,
    onPlaybackPositionChange,
    onToggleVisibility,
    onRenderStateChange
}, ref) => {
    // Current Measure Calculation
    const safeMeasures = measures || [];
    const scoreContainerRef = useRef<HTMLElement>(null);



    // Video Render Settings (Internal state moved to page.tsx mostly, but we keep logic here for now)
    const [renderSettings, setRenderSettings] = useState<VideoRenderSettings>({
        format: 'mp4',
        fps: 30,
        quality: 'medium'
    });
    const [isOfflineRendering, setIsOfflineRendering] = useState(false);
    const [offlinePosition, setOfflinePosition] = useState(0);

    // Unified Canvas Recorder
    const {
        isRecording,
        isRendering,
        isComplete,
        renderProgress,
        estimatedTime,
        startRecording,
        stopRecording,
        renderToFile,
        convertWebMToMP4,
        captureFrame,
        renderFramesToVideo,
        setRenderProgress,
        setRenderStatus,
        cancelRender,
        downloadVideo,
        error: renderError,
        renderStatus,
        setIsRendering,
        setIsComplete
    } = useCanvasRecorder(scoreContainerRef as React.RefObject<HTMLCanvasElement>, renderSettings);

    useEffect(() => {
        onRenderStateChange?.({ isRendering, progress: renderProgress, isComplete });
    }, [isRendering, renderProgress, isComplete, onRenderStateChange]);

    // Simplified Position calculation for internal use (glows, etc)
    const displayMeasureCurrent = useMemo(() => {
        if (isPlaying || (isRendering && renderSettings.format === 'mp4')) {
            const pos = isRendering ? offlinePosition : playbackPosition;
            return Math.min(Math.floor((pos / 100) * safeMeasures.length) + 1, safeMeasures.length);
        }
        return (externalMeasureIndex ?? 0) + 1;
    }, [isPlaying, isRendering, playbackPosition, offlinePosition, safeMeasures.length, externalMeasureIndex, renderSettings.format]);

    React.useImperativeHandle(ref, () => ({
        startRender: (settings) => {
            setRenderSettings(settings);
            handleStartRender();
        },
        cancelRender: () => {
            cancelRender();
        },
        isRendering,
        progress: renderProgress,
        isComplete,
        status: renderStatus,
        estimatedTime
    }));

    const handleStartRender = async () => {
        if (!scoreContainerRef.current) {
            console.error('Score container not found');
            return;
        }

        // --- NEW GOLD STANDARD: OFFLINE RENDERING FOR ALL MP4 ---
        if (renderSettings.format === 'mp4') {
            await handleStartRenderOffline();
            return;
        }

        // Fallback for WebM (real-time fast recording)
        if (onPlaybackPositionChange) onPlaybackPositionChange(0);
        if (onPlaybackControl) onPlaybackControl(true);
        await renderToFile();
    };

    const handleStartRenderOffline = async () => {
        setIsRendering(true);
        setIsComplete(false);
        setIsOfflineRendering(true);
        setOfflinePosition(0);
        setRenderProgress(0);

        // Calculate total frames (approximate 2s per measure)
        const fps = 30;
        const secondsPerMeasure = 2;
        const totalDuration = safeMeasures.length * secondsPerMeasure;
        const totalFrames = Math.ceil(totalDuration * fps);

        console.log(`Starting offline render: ${totalFrames} frames`);

        // Find the actual canvas elements
        const viewport = scoreContainerRef.current?.querySelector('.score-canvas-viewport');
        if (!viewport) {
            console.error('Viewport not found for offline render');
            setIsOfflineRendering(false);
            return;
        }

        // Create composite canvas for high-quality export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 800 * currentDPR;
        exportCanvas.height = 340 * currentDPR;
        const exportCtx = exportCanvas.getContext('2d', { alpha: false });

        // Pre-load FFmpeg
        await setRenderProgress(5);

        for (let i = 0; i < totalFrames; i++) {
            const pos = (i / totalFrames) * 100;
            setOfflinePosition(pos);
            setRenderProgress((i / totalFrames) * 20); // 0-20% is capture phase

            // Wait for React to render and VexFlow (async SVG rasterization) to finish
            await new Promise(resolve => setTimeout(resolve, 100));

            // Composite layers
            const canvases = viewport.querySelectorAll('canvas');
            if (exportCtx && canvases.length >= 2) {
                exportCtx.drawImage(canvases[0], 0, 0); // Notation
                exportCtx.drawImage(canvases[1], 0, 0); // Playhead
            }

            // Capture frame
            setRenderStatus(`Capturando quadro ${i + 1} de ${totalFrames}...`);
            await captureFrame(exportCanvas, i);
        }

        // Transition to FFmpeg conversion
        setRenderProgress(20);
        setRenderStatus('Iniciando processamento de vídeo...');
        const mp4Blob = await renderFramesToVideo(totalFrames);

        if (mp4Blob) {
            downloadVideo(mp4Blob, `tab-pro-render-${Date.now()}.mp4`);
        }

        setIsOfflineRendering(false);
        setOfflinePosition(0);
    };

    // Auto-stop recording and convert when playback reaches the end
    useEffect(() => {
        const handleRecordingComplete = async () => {
            if (isRecording && playbackPosition >= 99.9) {
                // Stop playback
                if (onPlaybackControl) {
                    onPlaybackControl(false);
                }

                // Stop recording
                const webmBlob = await stopRecording();

                if (webmBlob) {
                    console.log('Recording complete! WebM blob:', webmBlob.size, 'bytes');

                    // If format is MP4, convert WebM to MP4
                    if (renderSettings.format === 'mp4') {
                        console.log('Starting conversion to MP4...');
                        const mp4Blob = await convertWebMToMP4(webmBlob, (progress) => {
                            console.log('Conversion progress:', progress);
                        });

                        if (mp4Blob) {
                            downloadVideo(mp4Blob, `tab-animation-${Date.now()}.mp4`);
                        }
                    } else {
                        // For WebM, just download directly
                        downloadVideo(webmBlob, `tab-animation-${Date.now()}.webm`);
                    }
                }
            }
        };

        handleRecordingComplete();
    }, [isRecording, playbackPosition, renderSettings.format, stopRecording, convertWebMToMP4, downloadVideo, onPlaybackControl]);

    // Track last progress to avoid infinite loop
    const lastRenderProgressRef = useRef<number>(-1);

    // Update progress during recording phase
    useEffect(() => {
        if (isRecording) {
            // Map playbackPosition (0-100) to renderProgress (0-25)
            // Use Math.round to avoid tiny floating point changes triggering re-renders
            const progress = Math.round((playbackPosition / 100) * 25);
            if (progress !== lastRenderProgressRef.current) {
                setRenderProgress(progress);
                lastRenderProgressRef.current = progress;
            }
        }
    }, [isRecording, playbackPosition, setRenderProgress]);

    const effectivePosition = isOfflineRendering ? offlinePosition : playbackPosition;

    const calculatedMeasureIndex = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const idx = Math.floor((effectivePosition / 100) * safeMeasures.length);
        return Math.min(idx, safeMeasures.length - 1);
    }, [effectivePosition, safeMeasures.length]);


    // When playing, use calculated index from playback; otherwise use external (manual selection)
    const currentMeasureIndex = (isPlaying || isOfflineRendering) ? calculatedMeasureIndex : (externalMeasureIndex !== undefined ? externalMeasureIndex : calculatedMeasureIndex);

    const measureProgress = useMemo(() => {
        if (safeMeasures.length === 0) return 0;
        const measureWeight = 100 / safeMeasures.length;
        return ((effectivePosition % measureWeight) / measureWeight) * 100;
    }, [effectivePosition, safeMeasures.length]);

    const shouldAnimate = currentMeasureIndex === 0 || currentMeasureIndex === safeMeasures.length - 1;
    const activeMeasureData = safeMeasures[currentMeasureIndex];

    const currentDPR = useMemo(() => {
        const dprSettings = {
            low: 1,
            medium: 1.5,
            high: 2.4,   // 1080p
            ultra: 4.8   // 4K
        };
        return (dprSettings as any)[renderSettings.quality || 'medium'] || 1.5;
    }, [renderSettings.quality]);

    const handleNoteClick = (measureIndex: number, noteIndex: number, isMulti: boolean) => {
        const measure = safeMeasures[measureIndex];
        const note = measure?.notes[noteIndex];
        if (!note || !onSelectNote) return;

        onSelectNote(note.id, isMulti);
    };



    if (!activeMeasureData) return null;

    return (
        <div ref={scoreContainerRef as React.RefObject<HTMLDivElement>} className="w-full h-full flex flex-col bg-transparent overflow-hidden relative">
            <div className="flex-1 flex flex-col items-center justify-center bg-transparent overflow-hidden relative">
                {safeMeasures.map((measure, idx) => (
                    idx === currentMeasureIndex && (
                        <div
                            key={`${measure.id || idx}-${style.transitionType}-${timeSignature}-${showNotation}-${showTablature}-${clef}-${keySignature}`}
                            className={`absolute inset-0 w-full ${shouldAnimate ? `score-animation-${style.transitionType}` : ''}`}
                        >
                            <MeasureThumbnail
                                measureData={measure}
                                measureIndex={idx}
                                isActive={isPlaying || isOfflineRendering}
                                progress={measureProgress}
                                style={style}
                                shouldAnimate={shouldAnimate}
                                timeSignatureStr={timeSignature}
                                showNotation={showNotation}
                                showTablature={showTablature}
                                onNoteClick={handleNoteClick}
                                onNoteDoubleClick={onDoubleClickNote}
                                selectedNoteIds={selectedNoteIds}
                                dpr={currentDPR}
                                clef={clef}
                                keySignature={keySignature}
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
});

ScorePreview.displayName = 'ScorePreview';

export default ScorePreview;

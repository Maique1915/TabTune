"use client";

import React, { useRef, useEffect } from 'react';
import { Note } from '../../domain/types';

interface TabCanvasProps {
    notes: Note[];
    currentTime: number;
    isPlaying: boolean;
    speed?: number; // pixels per second
    showSoundhole?: boolean;
}

const STRING_COUNT = 6;
const STRING_SPACING = 28;
const NOTE_RADIUS = 12;
const PLAYHEAD_X_OFFSET = 200; // Distance from left edge
const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];

export const TabCanvas: React.FC<TabCanvasProps> = ({
    notes,
    currentTime,
    isPlaying,
    speed = 150,
    showSoundhole = true
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [bounds, setBounds] = React.useState({ width: 0, height: 0 });

    // 1. Handle initial sizing and layout changes via ResizeObserver
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateBounds = () => {
            const rect = container.getBoundingClientRect();
            // Use Math.floor to avoid sub-pixel flickering/stretching
            const w = Math.floor(rect.width);
            const h = Math.floor(rect.height);
            setBounds(prev => {
                if (prev.width === w && prev.height === h) return prev;
                return { width: w, height: h };
            });
        };

        const resizeObserver = new ResizeObserver(() => {
            // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
            window.requestAnimationFrame(updateBounds);
        });

        resizeObserver.observe(container);
        updateBounds();

        return () => resizeObserver.disconnect();
    }, []);

    // 2. Main Drawing / Animation Loop (Stable Dimensions)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || bounds.width === 0 || bounds.height === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const { width, height } = bounds;

        // Sync canvas internal resolution with stable logical bounds
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        let animationFrameId: number;

        const render = () => {
            // Draw background using stable dimensions
            ctx.clearRect(0, 0, width, height);

            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#1a1a1a');
            gradient.addColorStop(1, '#0f0f0f');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const centerY = height / 2;

            if (showSoundhole) {
                ctx.beginPath();
                ctx.arc(PLAYHEAD_X_OFFSET, centerY, 130, 0, Math.PI * 2);
                ctx.fillStyle = '#000';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(PLAYHEAD_X_OFFSET, centerY, 130, 0, Math.PI * 2);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 4;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(PLAYHEAD_X_OFFSET, centerY, 120, 0, Math.PI * 2);
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            const totalHeight = (STRING_COUNT - 1) * STRING_SPACING;
            const startY = (height - totalHeight) / 2;

            const timeStart = currentTime - (PLAYHEAD_X_OFFSET / speed);
            const timeEnd = timeStart + (width / speed);
            const gridInterval = 1.0;

            const firstGridTime = Math.ceil(timeStart / gridInterval) * gridInterval;

            ctx.save();
            ctx.beginPath();
            for (let t = firstGridTime; t < timeEnd; t += gridInterval) {
                const x = PLAYHEAD_X_OFFSET + (t - currentTime) * speed;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            ctx.strokeStyle = '#ffffff08';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();

            for (let i = 0; i < STRING_COUNT; i++) {
                const y = startY + i * STRING_SPACING;
                ctx.beginPath();
                ctx.moveTo(0, y + 2);
                ctx.lineTo(width, y + 2);
                ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                const stringGradient = ctx.createLinearGradient(0, y - 1, 0, y + 1);
                stringGradient.addColorStop(0, '#888');
                stringGradient.addColorStop(0.5, '#eee');
                stringGradient.addColorStop(1, '#666');
                ctx.strokeStyle = stringGradient;
                ctx.lineWidth = 1 + (i * 0.4);
                ctx.stroke();

                ctx.fillStyle = '#666';
                ctx.font = 'bold 12px "Inter", sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText(STRING_NAMES[i], 30, y);
            }

            const sortedNotes = [...notes].sort((a, b) => a.time - b.time);
            sortedNotes.forEach((note, index) => {
                const x1 = PLAYHEAD_X_OFFSET + (note.time - currentTime) * speed;
                if (!note.positions || note.positions.length === 0) return;

                note.positions.forEach((pos) => {
                    const y = startY + (pos.stringIndex * STRING_SPACING);
                    const articulation = pos.articulation || note.articulation;

                    if (articulation === 'bend' || articulation === 'bend-release') {
                        if (x1 > -50 && x1 < width + 50) {
                            const bendHeight = STRING_SPACING * 1.5;
                            const bendWidth = 40;
                            ctx.beginPath();
                            ctx.moveTo(x1 + NOTE_RADIUS, y);
                            if (articulation === 'bend-release') {
                                ctx.quadraticCurveTo(x1 + bendWidth, y, x1 + bendWidth, y - bendHeight);
                                ctx.strokeStyle = '#eab308';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                const peakX = x1 + bendWidth;
                                const peakY = y - bendHeight;
                                const arrowSize = 6;
                                ctx.beginPath();
                                ctx.moveTo(peakX, peakY - arrowSize);
                                ctx.lineTo(peakX - arrowSize, peakY + arrowSize);
                                ctx.lineTo(peakX + arrowSize, peakY + arrowSize);
                                ctx.closePath();
                                ctx.fillStyle = '#eab308';
                                ctx.fill();
                                const releaseWidth = 24;
                                const endX = peakX + releaseWidth;
                                ctx.beginPath();
                                ctx.moveTo(peakX, peakY);
                                ctx.quadraticCurveTo(endX, peakY, endX, y);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(endX, y);
                                ctx.lineTo(endX - arrowSize, y - arrowSize * 1.5);
                                ctx.lineTo(endX + arrowSize, y - arrowSize * 1.5);
                                ctx.closePath();
                                ctx.fill();
                                ctx.fillStyle = '#eab308';
                                ctx.font = 'bold 10px "Inter", sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText('Full', peakX, peakY - arrowSize - 2);
                            } else {
                                ctx.quadraticCurveTo(x1 + bendWidth, y, x1 + bendWidth, y - bendHeight);
                                ctx.strokeStyle = '#eab308';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                const arrowX = x1 + bendWidth;
                                const arrowY = y - bendHeight;
                                const arrowSize = 6;
                                ctx.beginPath();
                                ctx.moveTo(arrowX, arrowY - arrowSize);
                                ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
                                ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
                                ctx.closePath();
                                ctx.fillStyle = '#eab308';
                                ctx.fill();
                                ctx.fillStyle = '#eab308';
                                ctx.font = 'bold 10px "Inter", sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText('Full', arrowX, arrowY - arrowSize - 2);
                            }
                        }
                    }

                    if (articulation === 'hammer' || articulation === 'pull' || articulation === 'slide') {
                        let nextNote = null;
                        let nextPos = null;
                        for (let i = index + 1; i < sortedNotes.length; i++) {
                            const foundPos = sortedNotes[i].positions.find(p => p.stringIndex === pos.stringIndex);
                            if (foundPos) {
                                nextNote = sortedNotes[i];
                                nextPos = foundPos;
                                break;
                            }
                        }
                        if (nextNote && nextPos) {
                            const x2 = PLAYHEAD_X_OFFSET + (nextNote.time - currentTime) * speed;
                            if (x2 > -50 && x1 < width + 50) {
                                if (articulation === 'slide') {
                                    const startX = x1 + NOTE_RADIUS + 4;
                                    const endX = x2 - NOTE_RADIUS - 4;
                                    ctx.beginPath();
                                    if (nextPos.fret > pos.fret) {
                                        ctx.moveTo(startX, y + 6);
                                        ctx.lineTo(endX, y - 6);
                                    } else {
                                        ctx.moveTo(startX, y - 6);
                                        ctx.lineTo(endX, y + 6);
                                    }
                                    ctx.strokeStyle = '#eab308';
                                    ctx.lineWidth = 2;
                                    ctx.stroke();
                                } else {
                                    const arcStartX = x1;
                                    const arcEndX = x2;
                                    const arcY = y - NOTE_RADIUS - 4;
                                    const arcWidth = arcEndX - arcStartX;
                                    const arcHeight = Math.min(20, Math.max(8, arcWidth * 0.1));
                                    ctx.beginPath();
                                    ctx.moveTo(arcStartX, arcY);
                                    ctx.quadraticCurveTo(arcStartX + arcWidth / 2, arcY - arcHeight, arcEndX, arcY);
                                    ctx.quadraticCurveTo(arcStartX + arcWidth / 2, arcY - arcHeight + 2, arcStartX, arcY);
                                    ctx.fillStyle = '#eab308';
                                    ctx.fill();
                                    const isTopStringOfSlur = !note.positions.some(otherPos =>
                                        otherPos.stringIndex < pos.stringIndex &&
                                        nextNote?.positions.some(p => p.stringIndex === otherPos.stringIndex)
                                    );
                                    if (isTopStringOfSlur) {
                                        const label = articulation === 'hammer' ? 'H' : 'P';
                                        ctx.fillStyle = '#eab308';
                                        ctx.font = 'bold 10px "Inter", sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'bottom';
                                        ctx.fillText(label, arcStartX + arcWidth / 2, arcY - arcHeight + 2);
                                    }
                                }
                            }
                        }
                    }
                });
            });

            ctx.save();
            ctx.fillStyle = '#eab308';
            ctx.font = 'bold 24px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 10;
            ctx.fillText('T', 15, startY + STRING_SPACING * 1.5);
            ctx.fillText('A', 15, startY + STRING_SPACING * 2.5);
            ctx.fillText('B', 15, startY + STRING_SPACING * 3.5);
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(35, startY);
            ctx.lineTo(35, startY + (STRING_COUNT - 1) * STRING_SPACING);
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(PLAYHEAD_X_OFFSET, 0);
            ctx.lineTo(PLAYHEAD_X_OFFSET, height);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();

            notes.forEach(note => {
                const timeDiff = note.time - currentTime;
                const x = PLAYHEAD_X_OFFSET + (timeDiff * speed);
                const tailLength = (note.duration || 0) * speed;
                const tailEndX = x + tailLength;

                if ((x > -50 && x < width + 50) || (tailEndX > -50 && tailEndX < width + 50)) {
                    const isHit = Math.abs(timeDiff) < 0.05;
                    const isPast = timeDiff < -0.05;
                    const isSustaining = timeDiff < 0 && (timeDiff + note.duration) > 0;

                    note.positions.forEach((position, posIndex) => {
                        const y = startY + (position.stringIndex * STRING_SPACING);

                        if (note.duration > 0.1) {
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(tailEndX, y);
                            const tailGradient = ctx.createLinearGradient(x, y, tailEndX, y);
                            if (isHit || isSustaining) {
                                tailGradient.addColorStop(0, '#22c55e');
                                tailGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
                            } else {
                                tailGradient.addColorStop(0, '#4ade80');
                                tailGradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
                            }
                            ctx.strokeStyle = tailGradient;
                            ctx.lineWidth = NOTE_RADIUS * 0.8;
                            ctx.lineCap = 'round';
                            ctx.globalAlpha = isPast && !isSustaining ? 0.3 : 0.6;
                            ctx.stroke();
                            ctx.globalAlpha = 1.0;
                        }

                        ctx.beginPath();
                        if (note.type === 'diamond') {
                            ctx.moveTo(x, y - NOTE_RADIUS);
                            ctx.lineTo(x + NOTE_RADIUS, y);
                            ctx.lineTo(x, y + NOTE_RADIUS);
                            ctx.lineTo(x - NOTE_RADIUS, y);
                            ctx.closePath();
                        } else if (note.type === 'square') {
                            ctx.rect(x - NOTE_RADIUS + 4, y - NOTE_RADIUS + 4, (NOTE_RADIUS - 4) * 2, (NOTE_RADIUS - 4) * 2);
                        } else {
                            ctx.arc(x, y, NOTE_RADIUS, 0, Math.PI * 2);
                        }

                        if (isHit || isSustaining) {
                            ctx.fillStyle = '#22c55e';
                            ctx.shadowColor = '#22c55e';
                            ctx.shadowBlur = 20;
                            ctx.fill();
                            if (note.type !== 'ghost') {
                                ctx.fillStyle = '#fff';
                                ctx.beginPath();
                                if (note.type === 'diamond') {
                                    ctx.moveTo(x, y - NOTE_RADIUS * 0.6);
                                    ctx.lineTo(x + NOTE_RADIUS * 0.6, y);
                                    ctx.lineTo(x, y + NOTE_RADIUS * 0.6);
                                    ctx.lineTo(x - NOTE_RADIUS * 0.6, y);
                                } else {
                                    ctx.arc(x, y, NOTE_RADIUS * 0.8, 0, Math.PI * 2);
                                }
                                ctx.fill();
                            }
                        } else if (isPast) {
                            ctx.fillStyle = '#333';
                            ctx.globalAlpha = Math.max(0, 1 + (timeDiff * 2));
                            ctx.fill();
                            ctx.strokeStyle = '#555';
                            ctx.stroke();
                        } else {
                            if (note.type === 'ghost') {
                                ctx.strokeStyle = '#666';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(x - NOTE_RADIUS / 2, y - NOTE_RADIUS / 2);
                                ctx.lineTo(x + NOTE_RADIUS / 2, y + NOTE_RADIUS / 2);
                                ctx.moveTo(x + NOTE_RADIUS / 2, y - NOTE_RADIUS / 2);
                                ctx.lineTo(x - NOTE_RADIUS / 2, y + NOTE_RADIUS / 2);
                                ctx.stroke();
                            } else {
                                ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
                                ctx.fill();
                                ctx.strokeStyle = '#4ade80';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }
                        }
                        ctx.shadowBlur = 0;
                        if ((!isPast || ctx.globalAlpha > 0.1 || isSustaining) && note.type !== 'ghost') {
                            ctx.fillStyle = (isHit || isSustaining) ? '#000' : '#fff';
                            ctx.font = 'bold 16px "JetBrains Mono", monospace';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(position.fret.toString(), x, y);
                        }

                        const currentArticulation = position.articulation || note.articulation;
                        if (currentArticulation && currentArticulation !== 'none') {
                            const artY = y - NOTE_RADIUS - 4;
                            let label = '';
                            if (currentArticulation === 'tap') label = 'T';
                            if (label) {
                                ctx.fillStyle = '#eab308';
                                ctx.font = 'bold 12px "Inter", sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(label, x, artY);
                            }
                            if (currentArticulation === 'vibrato') {
                                const waveWidth = 24;
                                const waveX = x - waveWidth / 2;
                                const waveY = artY - 4;
                                ctx.beginPath();
                                ctx.moveTo(waveX, waveY);
                                const segments = 3;
                                const segmentWidth = waveWidth / segments;
                                const amplitude = 3;
                                for (let i = 0; i < segments; i++) {
                                    const sx = waveX + i * segmentWidth;
                                    ctx.bezierCurveTo(sx + segmentWidth * 0.25, waveY - amplitude, sx + segmentWidth * 0.75, waveY + amplitude, sx + segmentWidth, waveY);
                                }
                                ctx.strokeStyle = '#eab308';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }
                        }
                        ctx.globalAlpha = 1.0;
                    });
                }
            });

            if (isPlaying) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [notes, currentTime, isPlaying, speed, showSoundhole, bounds]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[400px] bg-[#111] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
            <canvas ref={canvasRef} className="block w-full h-full" />
            <div className="absolute top-4 right-4 text-emerald-500/50 font-mono text-xs border border-emerald-500/20 px-2 py-1 rounded">
                TIME: {currentTime.toFixed(2)}s
            </div>
        </div>
    );
};

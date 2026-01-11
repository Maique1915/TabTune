import React from 'react';
import { ScoreStyle } from '@/modules/editor/domain/types';

export const PRESET_THEMES: Record<string, { label: string; style: ScoreStyle }> = {
    default: {
        label: 'Default Dark',
        style: {
            clefs: { color: '#ff9823ff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 10 },
            timeSignature: { color: '#ff9823ff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 10 },
            notes: { color: '#ffffffff', opacity: 1, shadow: true, shadowColor: '#000000', shadowBlur: 12 },
            rests: { color: '#ffffffff', opacity: 0.8, shadow: false },
            tabNumbers: { color: '#ffffffff', opacity: 1, shadow: false },
            symbols: { color: '#ffffffff', opacity: 1, shadow: false },
            staffLines: { color: '#ffffffff', opacity: 0.4, shadow: false },
            chordName: {
                color: '#22d3ee',
                opacity: 1,
                shadow: true,
                shadowColor: '#22d3ee',
                shadowBlur: 10,
                strokeColor: '#000000',
                strokeWidth: 3
            },
            background: '#000000ff',
            playheadColor: '#ffffffff',
            activeNoteColor: '#ffffffff',
            shadowIntensity: 10,
            glowEffect: true,
            scale: 1,
            transitionType: 'snap'
        }
    },
    classic: {
        label: 'Classic Light',
        style: {
            clefs: { color: '#000000', opacity: 1, shadow: false },
            timeSignature: { color: '#000000', opacity: 1, shadow: false },
            notes: { color: '#111111', opacity: 1, shadow: false },
            rests: { color: '#111111', opacity: 1, shadow: false },
            tabNumbers: { color: '#111111', opacity: 1, shadow: false },
            symbols: { color: '#111111', opacity: 1, shadow: false },
            staffLines: { color: '#000000', opacity: 0.1, shadow: false },
            chordName: {
                color: '#111111',
                opacity: 1,
                shadow: false,
                shadowColor: '#000000',
                shadowBlur: 0,
                strokeColor: '#000000',
                strokeWidth: 0
            },
            background: '#fdfdfd',
            playheadColor: '#2563eb',
            activeNoteColor: '#ef4444',
            shadowIntensity: 0,
            glowEffect: false,
            scale: 1,
            transitionType: 'snap'
        }
    },
    cyberpunk: {
        label: 'Cyberpunk',
        style: {
            clefs: { color: '#fb00ff', opacity: 1, shadow: true, shadowColor: '#3b82f6', shadowBlur: 10 },
            timeSignature: { color: '#fb00ff', opacity: 1, shadow: true, shadowColor: '#3b82f6', shadowBlur: 10 },
            notes: { color: '#00ff9d', opacity: 1, shadow: true, shadowColor: '#ffffff', shadowBlur: 12 },
            rests: { color: '#ffffff', opacity: 0.8, shadow: false },
            tabNumbers: { color: '#ffffff', opacity: 1, shadow: false },
            symbols: { color: '#ffffffff', opacity: 1, shadow: false },
            staffLines: { color: '#ffffffff', opacity: 0.4, shadow: false },
            chordName: {
                color: '#00ff9d',
                opacity: 1,
                shadow: true,
                shadowColor: '#ffffff',
                shadowBlur: 10,
                strokeColor: '#000000',
                strokeWidth: 3
            },
            background: '#020617',
            playheadColor: '#3b82f6',
            activeNoteColor: '#60a5fa',
            shadowIntensity: 15,
            glowEffect: true,
            scale: 1,
            transitionType: 'assemble'
        }
    },
    midnight: {
        label: 'Midnight Blue',
        style: {
            clefs: { color: '#3b82f6', opacity: 1, shadow: true, shadowColor: '#3b82f6', shadowBlur: 10 },
            timeSignature: { color: '#3b82f6', opacity: 1, shadow: true, shadowColor: '#3b82f6', shadowBlur: 10 },
            notes: { color: '#ffffff', opacity: 1, shadow: true, shadowColor: '#ffffff', shadowBlur: 12 },
            rests: { color: '#ffffff', opacity: 0.8, shadow: false },
            tabNumbers: { color: '#ffffff', opacity: 1, shadow: false },
            symbols: { color: '#3b82f6', opacity: 1, shadow: false },
            staffLines: { color: '#3b82f6', opacity: 0.4, shadow: false },
            chordName: {
                color: '#60a5fa',
                opacity: 1,
                shadow: true,
                shadowColor: '#3b82f6',
                shadowBlur: 10,
                strokeColor: '#000000',
                strokeWidth: 3
            },
            background: '#020617',
            playheadColor: '#3b82f6',
            activeNoteColor: '#60a5fa',
            shadowIntensity: 10,
            glowEffect: true,
            scale: 1,
            transitionType: 'assemble'
        }
    },
    vintage: {
        label: 'Vintage',
        style: {
            clefs: { color: '#451a03', opacity: 1, shadow: false },
            timeSignature: { color: '#451a03', opacity: 1, shadow: false },
            notes: { color: '#451a03', opacity: 1, shadow: false },
            rests: { color: '#451a03', opacity: 1, shadow: false },
            tabNumbers: { color: '#451a03', opacity: 1, shadow: false },
            symbols: { color: '#78350f', opacity: 1, shadow: false },
            staffLines: { color: '#78350f', opacity: 0.2, shadow: false },
            chordName: {
                color: '#451a03',
                opacity: 1,
                shadow: false,
                shadowColor: '#000000',
                shadowBlur: 0,
                strokeColor: '#000000',
                strokeWidth: 0
            },
            background: '#f5f1e6',
            playheadColor: '#b45309',
            activeNoteColor: '#78350f',
            shadowIntensity: 0,
            glowEffect: false,
            scale: 1,
            transitionType: 'assemble'
        }
    }
};

export const DEFAULT_VEXTAB = `options space=20
tabstave notation=true key=A time=4/4
notes :q (5/2.5/3.7/4) 5h6/3 7/4 | 
notes :8 7/4 6/3 5/2 3v/1 :q 7v/5 :8 3s5/5`;

export const Icons = {
    Play: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    ),
    Pause: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
    ),
    Reset: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
    ),
    Magic: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
    ),
    Copy: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    ),
    Paste: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
    ),
    ChevronUp: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
    ),
    ChevronDown: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
    ),
    Grip: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
    ),
    Rest: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8" /><path d="M12 8v8" /><circle cx="12" cy="12" r="10" /></svg>
    ),
    MusicRest: (duration: string) => {
        // Retorna um SVG simplificado representando o tipo de pausa
        return (
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current">
                {duration === 'w' && <rect x="30" y="40" width="40" height="10" />}
                {duration === 'h' && <rect x="30" y="50" width="40" height="10" />}
                {duration === 'q' && <path d="M45,30 L55,40 L45,55 L55,70" stroke="currentColor" strokeWidth="4" fill="none" />}
                {(duration === '8' || duration === '16' || duration === '32') && (
                    <g transform="translate(45,30)">
                        <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="4" />
                        <circle cx="5" cy="5" r="4" />
                        {duration === '16' && <circle cx="5" cy="15" r="4" />}
                        {duration === '32' && <><circle cx="5" cy="15" r="4" /><circle cx="5" cy="25" r="4" /></>}
                    </g>
                )}
            </svg>
        );
    },
    Plus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    ChevronRight: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
    ),
    ChevronLeft: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
    ),
    SkipBack: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20L9 12l10-8v16zM5 19V5" /></svg>
    ),
    Repeat: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
    )
};

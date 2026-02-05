import React from 'react';
import { ScoreStyle } from '@/modules/editor/domain/types';
import { ChordDiagramColors } from '@/modules/core/presentation/context/app-context';


export const DEFAULT_COLORS: ChordDiagramColors = {
    global: {
        backgroundColor: "#000000",
        primaryTextColor: "#FF8C42",
        scale: 1.0,
        rotation: 0,
        mirror: false,
    },
    fretboard: {
        neck: {
            color: "#303135",
            opacity: 1,
            shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 5 }
        },
        frets: {
            color: "#000000",
            shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 3 }
        },
        strings: {
            color: "#FFFFFF",
            thickness: 3,
            shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 3 }
        },
        board: {
            inlays: {
                color: "rgba(0, 0, 0, 0.35)",
                shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 3 }
            },
        },
    },
    fingers: {
        color: "#200f0f",
        textColor: "#ffffff",
        border: {
            color: "#FFFFFF",
            width: 4,
        },
        opacity: 0.9,
        shadow: { enabled: true, color: "rgba(0,0,0,0.6)", blur: 8 },
        radius: 22,
        fontSize: 16,
        barreWidth: 48,
        barreFingerRadius: 22
    },
    chordName: {
        color: "#ffffff",
        textColor: "#ffffff",
        opacity: 1,
        shadow: {
            color: "rgba(0,0,0,0.5)",
            blur: 5,
            enabled: true
        },
        stroke: {
            color: "#000000",
            width: 0,
        },
        fontSize: 35,
        extSize: 24
    },
    capo: {
        color: "rgba(100, 100, 110, 0.9)",
        border: {
            color: "rgba(0, 0, 0, 0.3)",
            width: 1, // Added default width
        },
        textColors: {
            name: "#ffffff",
            number: "#FF8C42",
        },
        shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 5 }
    },
    avoid: {
        color: "#ffffff",
        lineWidth: 6,
        size: 15,
        opacity: 0.9,
        border: {
            color: "#000000",
            width: 2
        }
    },
    head: {
        color: "#3a3a3e",
        textColors: {
            name: "#FF8C42",
        },
        border: {
            color: "#3a3a3e",
            width: 0
        },
        shadow: { enabled: false, color: "rgba(0,0,0,0.5)", blur: 5 }
    },
};

export const STUDIO_PRESETS = {
    default: {
        label: 'Default Dark',
        style: DEFAULT_COLORS
    },
    classic: {
        label: 'Classic Light',
        style: {
            ...DEFAULT_COLORS,
            global: {
                ...DEFAULT_COLORS.global,
                primaryTextColor: "#1a1a1a",
                backgroundColor: "#f8f9fa",
            },
            fretboard: {
                neck: {
                    color: "#ffffff",
                    opacity: 1,
                    shadow: { enabled: true, color: "rgba(0,0,0,0.05)", blur: 10 }
                },
                frets: { color: "#d1d5db" },
                strings: { color: "#4b5563", thickness: 2.5 }
            },
            chordName: {
                color: "#1a1a1a",
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 38,
                extSize: 26,
                shadow: { enabled: false, color: "rgba(0,0,0,0.1)", blur: 4 }
            },

            fingers: {
                color: "#1e293b",
                textColor: "#ffffff",
                border: {
                    color: "#334155",
                    width: 2,
                },
                opacity: 1,
                radius: 24,
                fontSize: 18,
                barreWidth: 52,
                barreFingerRadius: 24,
                shadow: { enabled: true, color: "rgba(0,0,0,0.15)", blur: 6 }
            },
            capo: {
                color: "#475569",
                border: { color: "#1e293b", width: 1 },
                textColors: { name: "#ffffff", number: "#94a3b8" }
            },
            head: {
                color: "#f1f5f9",
                textColors: { name: "#1a1a1a" },
                border: { color: "#e2e8f0", width: 1 }
            },
            avoid: {
                color: "#ef4444",
                lineWidth: 5,
                size: 14,
                opacity: 0.9,
                border: { color: "#ffffff", width: 2 }
            }
        }
    },
    cyberpunk: {
        label: 'Cyberpunk',
        style: {
            ...DEFAULT_COLORS,
            global: { ...DEFAULT_COLORS.global, primaryTextColor: "#ffffffff" },
            fretboard: {
                neck: {
                    color: "#2d0036",
                    opacity: 1
                },
                frets: { color: "#fb00ff50" },
                strings: { color: "#fb00ff", thickness: 3 }
            },
            chordName: {
                color: "#fb00ff",
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 35,
                extSize: 24,
                shadow: { enabled: true, color: "rgba(251,0,255,0.5)", blur: 10 }
            },
            fingers: {
                color: "#fb00ff50",
                textColor: "#fffdfdff",
                border: { color: "#fb00ff", width: 4 },
                opacity: 0.9,
                radius: 22,
                fontSize: 16,
                barreWidth: 48,
                barreFingerRadius: 22
            },
            capo: {
                color: "#180220",
                border: { color: "#fb00ff", width: 1 },
                textColors: { name: "#00ff9d", number: "#00ff9d" }
            },
            head: {
                color: "#180220",
                textColors: { name: "#fb00ff" },
                border: { color: "#fb00ff", width: 2 },
                shadow: { enabled: true, color: "#fb00ff", blur: 10 }
            },
            avoid: {
                color: "#fb00ff",
                lineWidth: 6,
                size: 15,
                opacity: 0.9,
                border: { color: "#000000", width: 2 }
            }
        }
    },
    midnight: {
        label: 'Midnight Blue',
        style: {
            ...DEFAULT_COLORS,
            global: { ...DEFAULT_COLORS.global, primaryTextColor: "#ffffffff" },
            fretboard: {
                neck: {
                    color: "#0f172a",
                    opacity: 1
                },
                frets: { color: "#334155" },
                strings: { color: "#94a3b8", thickness: 3 }
            },
            chordName: {
                color: "#60a5fa",
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 35,
                extSize: 24,
                shadow: { enabled: true, color: "rgba(0,0,0,0.5)", blur: 5 }
            },
            fingers: {
                color: "#334155",
                textColor: "#ffffff",
                border: { color: "#60a5fa", width: 4 },
                opacity: 0.9,
                radius: 22,
                fontSize: 16,
                barreWidth: 48,
                barreFingerRadius: 22
            },
            capo: {
                color: "#1e293b",
                border: { color: "#60a5fa", width: 1 },
                textColors: { name: "#d5e0eeff", number: "#a8c6eeff" }
            },
            head: {
                color: "#0f172a",
                textColors: { name: "#60a5fa" },
                border: { color: "#1e293b", width: 1 }
            }
        }
    },
    vintage: {
        label: 'Vintage',
        style: {
            ...DEFAULT_COLORS,
            global: { ...DEFAULT_COLORS.global, primaryTextColor: "#8b4513" },
            fretboard: {
                neck: {
                    color: "#e6dcc8",
                    opacity: 1
                },
                frets: { color: "#a68b6c" },
                strings: { color: "#8b4513", thickness: 3 }
            },
            chordName: {
                color: "#ece5e3ff",
                opacity: 0.9,
                stroke: { color: "transparent", width: 0 },
                fontSize: 35,
                extSize: 24,
                shadow: { enabled: true, color: "rgba(0,0,0,0.2)", blur: 5 }
            },
            fingers: {
                color: "#5c4033",
                textColor: "#efe6d5",
                border: { color: "#3e2723", width: 4 },
                opacity: 0.9,
                radius: 22,
                fontSize: 16,
                barreWidth: 48,
                barreFingerRadius: 22
            },
            capo: {
                color: "#5d4037",
                border: { color: "#3e2723", width: 1 },
                textColors: { name: "#ffffff", number: "#5c4033" }
            },
            head: {
                color: "#d7ccc8",
                textColors: { name: "#5c4033" },
                border: { color: "#a1887f", width: 1 },
                shadow: { enabled: true, color: "#5c403330", blur: 5 }
            }
        }
    },
    studio: {
        label: 'Studio Mode',
        style: {
            ...DEFAULT_COLORS,
            global: {
                ...DEFAULT_COLORS.global,
                backgroundColor: "#0c1a1d",
                primaryTextColor: "#07b6d5",
                scale: 1.0,
            },
            fretboard: {
                neck: {
                    color: "#0c1a1d", // Dark monitor background
                    opacity: 1,
                    shadow: { enabled: true, color: "rgba(0,0,0,0.5)", blur: 10 }
                },
                frets: {
                    color: "rgba(255, 255, 255, 0.2)", // Subtle grid lines
                    shadow: { enabled: false, color: "transparent", blur: 0 }
                },
                strings: {
                    color: "rgba(255, 255, 255, 0.2)",
                    thickness: 2,
                    shadow: { enabled: false, color: "transparent", blur: 0 }
                },
                board: {
                    inlays: {
                        color: "rgba(7, 182, 213, 0.2)",
                        shadow: { enabled: true, color: "rgba(7, 182, 213, 0.4)", blur: 8 }
                    }
                }
            },
            chordName: {
                color: "#07b6d5", // Cyan
                opacity: 1,
                stroke: { color: "transparent", width: 0 },
                fontSize: 42,
                extSize: 28,
                shadow: { enabled: true, color: "rgba(7, 182, 213, 0.6)", blur: 15 } // Intense glow
            },
            fingers: {
                color: "#07b6d5", // Primary Cyan
                textColor: "#0f2023", // Dark contrast
                border: {
                    color: "#ffffff",
                    width: 2,
                },
                opacity: 0.9,
                radius: 24,
                fontSize: 18,
                barreWidth: 52,
                barreFingerRadius: 24,
                shadow: { enabled: true, color: "rgba(7, 182, 213, 0.5)", blur: 10 } // Cyan glow
            },
            capo: {
                color: "#162a2d",
                border: { color: "#07b6d5", width: 2 },
                textColors: { name: "#ffffff", number: "#07b6d5" },
                shadow: { enabled: true, color: "rgba(7, 182, 213, 0.3)", blur: 8 }
            },
            head: {
                color: "#0c1a1d",
                textColors: { name: "#07b6d5" },
                border: { color: "#1a3a3f", width: 2 },
                shadow: { enabled: true, color: "rgba(0,0,0,0.5)", blur: 10 }
            },
            avoid: {
                color: "#f472b6", // Accent Pink
                lineWidth: 5,
                size: 14,
                opacity: 0.9,
                border: { color: "#ffffff", width: 2 }
            }
        }
    }
};


export const DEFAULT_VEXTAB = `options space=20
tabstave notation=true key=A time=4/4
notes :q (5/2.5/3.7/4) 5h6/3 7/4 | 
notes :8 7/4 6/3 5/2 3v/1 :q 7v/5 :8 3s5/5`;

export const Icons = {
    Play: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z" /></svg>
    ),
    Pause: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
    ),
    Reset: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
    ),
    Magic: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
    ),
    Copy: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    ),
    Paste: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
    ),
    ChevronUp: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 15-6-6-6 6" /></svg>
    ),
    ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>
    ),
    Grip: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
    ),
    Rest: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 12h8" /><path d="M12 8v8" /><circle cx="12" cy="12" r="10" /></svg>
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
    Plus: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6" /></svg>
    ),
    ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6" /></svg>
    ),
    SkipBack: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 20L9 12l10-8v16zM5 19V5" /></svg>
    ),
    Repeat: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
    )
};

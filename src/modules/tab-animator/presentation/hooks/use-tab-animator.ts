"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Note } from '../../domain/types';
import { useUndoRedo } from '@/modules/editor/presentation/hooks/use-undo-redo';

export const SAMPLE_NOTES: Note[] = [
    { id: '1', positions: [{ stringIndex: 5, fret: 3 }], time: 2.0, duration: 0.5 },
    { id: '2', positions: [{ stringIndex: 4, fret: 5 }], time: 2.5, duration: 0.5 },
    { id: '3', positions: [{ stringIndex: 3, fret: 5 }], time: 3.0, duration: 0.5 },
    { id: '4', positions: [{ stringIndex: 2, fret: 4 }], time: 3.5, duration: 0.5 },
    { id: '5', positions: [{ stringIndex: 1, fret: 3 }], time: 4.0, duration: 0.5 },
    { id: '6', positions: [{ stringIndex: 0, fret: 3 }], time: 4.5, duration: 0.5 },

    { id: '7', positions: [{ stringIndex: 5, fret: 0 }], time: 5.5, duration: 0.5 },
    { id: '8', positions: [{ stringIndex: 4, fret: 2 }], time: 6.0, duration: 0.5 },
    { id: '9', positions: [{ stringIndex: 3, fret: 2 }], time: 6.5, duration: 0.5 },
    { id: '10', positions: [{ stringIndex: 2, fret: 0 }], time: 7.0, duration: 0.5 },

    { id: '11', positions: [{ stringIndex: 5, fret: 3 }, { stringIndex: 0, fret: 3 }], time: 8.0, duration: 0.5 },
];

export function useTabAnimator() {
    const {
        state: notes,
        setState: setNotesInternal,
        undo,
        redo,
        canUndo,
        canRedo
    } = useUndoRedo<Note[]>(SAMPLE_NOTES);

    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(30);
    const [speed, setSpeed] = useState(400);
    const [bpm, setBpm] = useState(120);
    const [showSoundhole, setShowSoundhole] = useState(true);

    const lastTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(0);

    const animateRef = useRef<(time: number) => void>(null);

    const animate = useCallback((time: number) => {
        if (lastTimeRef.current !== undefined) {
            const deltaTime = (time - lastTimeRef.current) / 1000;
            setCurrentTime(prevTime => {
                const newTime = prevTime + deltaTime;
                if (newTime >= duration) {
                    setIsPlaying(false);
                    return 0;
                }
                return newTime;
            });
        }
        lastTimeRef.current = time;
        if (isPlaying && animateRef.current) {
            requestRef.current = requestAnimationFrame(animateRef.current);
        }
    }, [isPlaying, duration]);

    useEffect(() => {
        animateRef.current = animate;
    }, [animate]);

    useEffect(() => {
        if (isPlaying) {
            lastTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, animate]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleSeek = (time: number) => {
        setCurrentTime(time);
    };

    const handleAddNote = (time = currentTime) => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            positions: [{ stringIndex: 0, fret: 0 }],
            time: time,
            duration: 0.5,
            type: 'normal'
        };
        setNotesInternal(prev => [...prev, newNote].sort((a, b) => a.time - b.time));
        return newNote.id;
    };

    const handleUpdateNote = (id: string, updates: Partial<Note>) => {
        setNotesInternal(prev => {
            const index = prev.findIndex(n => n.id === id);
            if (index === -1) return prev;

            const oldNote = prev[index];
            const newNote = { ...oldNote, ...updates };

            let updatedNotes = prev.map(n => n.id === id ? newNote : n);

            // If time or duration changed, shift subsequent notes (Ripple Effect)
            if ((updates.time !== undefined && updates.time !== oldNote.time) ||
                (updates.duration !== undefined && updates.duration !== oldNote.duration)) {

                const timeDiff = updates.time !== undefined ? updates.time - oldNote.time : 0;
                const durationDiff = updates.duration !== undefined ? updates.duration - oldNote.duration : 0;
                const totalShift = timeDiff + durationDiff;

                updatedNotes = updatedNotes.map(n => {
                    if (n.time > oldNote.time) {
                        return { ...n, time: n.time + totalShift };
                    }
                    return n;
                });
            }

            return updatedNotes.sort((a, b) => a.time - b.time);
        });
    };

    const handleSetBpm = (newBpm: number) => {
        if (newBpm === bpm || newBpm <= 0) return;

        const ratio = bpm / newBpm;
        setBpm(newBpm);

        // Scale all notes to maintain their rhythmic positions
        setNotesInternal(prev => prev.map(n => ({
            ...n,
            time: n.time * ratio,
            duration: n.duration * ratio
        })));

        // Scale current time to match
        setCurrentTime(prev => prev * ratio);
    };

    const handleAddPosition = (noteId: string) => {
        setNotesInternal(prev => prev.map(n => {
            if (n.id === noteId) {
                // Find next available string
                const occupiedStrings = n.positions.map((p: any) => p.stringIndex);
                let nextString = 0;
                while (occupiedStrings.includes(nextString) && nextString < 5) {
                    nextString++;
                }
                return {
                    ...n,
                    positions: [...n.positions, { stringIndex: nextString, fret: 0 }]
                };
            }
            return n;
        }));
    };

    const handleRemovePosition = (noteId: string, index: number) => {
        setNotesInternal(prev => prev.map(n => {
            if (n.id === noteId && n.positions.length > 1) {
                const newPositions = [...n.positions];
                newPositions.splice(index, 1);
                return { ...n, positions: newPositions };
            }
            return n;
        }));
    };

    const handleDeleteNote = (id: string) => {
        setNotesInternal(prev => prev.filter(n => n.id !== id));
    };

    const handleDuplicateNote = (id: string) => {
        setNotesInternal(prev => {
            const noteToCopy = prev.find(n => n.id === id);
            if (!noteToCopy) return prev;

            const newNote: Note = {
                ...noteToCopy,
                id: crypto.randomUUID(),
                time: noteToCopy.time + noteToCopy.duration // Place it immediately after
            };

            // Shift subsequent notes to make space (Ripple Effect)
            const updatedNotes = prev.map(n => {
                if (n.time >= newNote.time) {
                    return { ...n, time: n.time + newNote.duration };
                }
                return n;
            });

            return [...updatedNotes, newNote].sort((a, b) => a.time - b.time);
        });
    };

    return {
        notes,
        setNotes: (newNotes: Note[]) => setNotesInternal(newNotes),
        undo,
        redo,
        canUndo,
        canRedo,
        currentTime,
        isPlaying,
        duration,
        speed,
        bpm,
        setDuration,
        setSpeed,
        setBpm: handleSetBpm,
        togglePlay,
        handleReset,
        handleSeek,
        handleAddNote,
        handleUpdateNote,
        handleAddPosition,
        handleRemovePosition,
        handleDeleteNote,
        handleDuplicateNote,
        showSoundhole,
        setShowSoundhole
    };
}

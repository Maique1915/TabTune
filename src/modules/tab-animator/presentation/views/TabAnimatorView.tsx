"use client";

import React, { useState } from "react";
import { useTabAnimator } from "../hooks/use-tab-animator";
import { TabCanvas } from "../components/TabCanvas";
import { TabAnimatorSidebar } from "../components/TabAnimatorSidebar";
import { TabAnimatorTimeline } from "../components/TabAnimatorTimeline";
import { WorkspaceLayout } from "@/shared/components/layout/WorkspaceLayout";
import { AppHeader } from "@/modules/chords/presentation/components/app-header";
import { StageContainer } from "@/shared/components/layout/StageContainer";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function TabAnimatorView() {
    const isMobile = useIsMobile();
    const {
        notes,
        currentTime,
        isPlaying,
        duration,
        speed,
        bpm,
        undo,
        redo,
        canUndo,
        canRedo,
        setSpeed,
        setBpm,
        togglePlay,
        handleReset,
        handleSeek,
        handleAddNote,
        handleUpdateNote,
        handleDeleteNote,
        handleDuplicateNote,
        handleAddPosition,
        handleRemovePosition,
        setNotes,
        showSoundhole,
        setShowSoundhole
    } = useTabAnimator();

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={
                <AppHeader
                    title="Tab Animator"
                    hasUnsavedChanges={false}
                    onImport={() => { }}
                    onExport={() => { }}
                />
            }
            leftSidebar={
                <TabAnimatorSidebar
                    isOpen={true}
                    onClose={() => { }}
                    selectedNote={selectedNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={(id) => {
                        handleDeleteNote(id);
                        setSelectedNoteId(null);
                    }}
                    onAddPosition={handleAddPosition}
                    onRemovePosition={handleRemovePosition}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    speed={speed}
                    setSpeed={setSpeed}
                    bpm={bpm}
                    setBpm={setBpm}
                    isMobile={isMobile}
                    onSetNotes={setNotes}
                    showSoundhole={showSoundhole}
                    setShowSoundhole={setShowSoundhole}
                />
            }
        >
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
                {/* Main Visualizer Stage */}
                <div className="flex-1 p-6 flex flex-col min-h-0">
                    <StageContainer title="Visualização">
                        <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#000]">
                            <TabCanvas
                                notes={notes}
                                currentTime={currentTime}
                                isPlaying={isPlaying}
                                speed={speed}
                                showSoundhole={showSoundhole}
                            />
                            {/* Cinematic Overlay Gradients */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/60 via-transparent to-transparent w-48 left-0 top-0 bottom-0 z-10" />
                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
                        </div>
                    </StageContainer>
                </div>

                {/* Card-based Timeline */}
                <div className="shrink-0">
                    <TabAnimatorTimeline
                        notes={notes}
                        currentTime={currentTime}
                        duration={duration}
                        isPlaying={isPlaying}
                        onTogglePlay={togglePlay}
                        onSeek={handleSeek}
                        onReset={handleReset}
                        onSelectNote={setSelectedNoteId}
                        selectedNoteId={selectedNoteId}
                        onDeleteNote={(id) => {
                            handleDeleteNote(id);
                            if (selectedNoteId === id) setSelectedNoteId(null);
                        }}
                        onAddNote={() => {
                            const newId = handleAddNote();
                            setSelectedNoteId(newId);
                        }}
                        onAddPosition={handleAddPosition}
                        onDuplicateNote={handleDuplicateNote}
                        onReorderNotes={setNotes}
                    />
                </div>
            </div>
        </WorkspaceLayout>
    );
}

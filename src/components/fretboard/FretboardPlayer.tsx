"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "@/components/tab-editor/Sidebar";
import { measuresToChords } from "@/lib/fretboard/converter";
import VisualEditor from "@/components/tab-editor/VisualEditor";
import { useAppContext } from "@/app/context/app--context";
import { FretboardStage, FretboardStageRef } from "@/components/fretboard/FretboardStage";
import { SettingsPanel } from "@/components/studio/SettingsPanel";
import { AppHeader } from "@/components/studio/app-header";
import { StageContainer } from "@/components/shared/StageContainer";
import { WorkspaceLayout } from "@/components/shared/WorkspaceLayout";
import { EditorGrid } from "@/components/shared/EditorGrid";
import { MobileNav, NavItem } from "@/components/shared/MobileNav";
import { MobileHeader } from "@/components/shared/MobileHeader";
import { RenderingProgressCard } from "@/components/studio/rendering-progress-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { Music2, Library, Settings, Guitar } from "lucide-react";
import { TimelineControls } from "@/components/studio/timeline/TimelineControls";
import { useFretboardEditor } from "@/hooks/use-fretboard-editor";

export function FretboardPlayer() {
    // 1. New Editor State
    const {
        measures,
        settings,
        selectedNoteIds,
        editingNoteId,
        currentMeasureIndex,
        selectedMeasureId,
        activeDuration,
        activePositionIndex,
        editingNote,
        currentPitch,
        activeMeasure,
        setMeasures,
        setSettings,
        setActiveDuration,
        setActivePanel,
        setEditingNoteId,
        setActivePositionIndex,
        handleSelectMeasure,
        handleSelectNote,
        handleAddNote,
        handleRemoveNote,
        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,
        handleNoteRhythmChange,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        updateSelectedNotes,
        undo,
        redo,
        canUndo,
        canRedo
    } = useFretboardEditor();

    // 2. App Context (Visualizer State)
    const {
        playbackTransitionsEnabled,
        playbackBuildEnabled,
        setAnimationType,
        isRendering,
        setIsRendering,
        setRenderProgress,
        renderCancelRequested,
        setRenderCancelRequested,
        playbackTotalDurationMs
    } = useAppContext();

    const videoCanvasRef = useRef<FretboardStageRef>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // We use a local state for navigation within the layout
    const [activePanel, setLocalActivePanel] = useState<'studio' | 'library' | 'mixer' | 'customize'>('studio');

    const isMobile = useIsMobile();

    // 3. Convert Measures to Chords for Visualization
    const chords = useMemo(() => {
console.log("Debug Chords:", measuresToChords(measures, settings));
        return measuresToChords(measures, settings);
    }, [measures, settings]);

    // Force Guitar Fretboard mode on mount
    useEffect(() => {
        setAnimationType("guitar-fretboard");
    }, [setAnimationType]);

    // Handle render cancellation
    useEffect(() => {
        if (renderCancelRequested) {
            if (videoCanvasRef.current) {
                videoCanvasRef.current.cancelRender();
            }
            setIsRendering(false);
            setRenderProgress(0);
            setRenderCancelRequested(false);
        }
    }, [renderCancelRequested, setIsRendering, setRenderProgress, setRenderCancelRequested]);

    // Animation Controls
    const handleAnimate = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.startAnimation();
            setIsAnimating(true);
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.pauseAnimation();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.resumeAnimation();
            setIsPaused(false);
        }
    };

    const handleResetPlayback = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.cancelRender();
        }
    };

    const handleRenderVideo = async () => {
        if (videoCanvasRef.current) {
            setIsRendering(true);
            setRenderProgress(0);
            try {
                await videoCanvasRef.current.handleRender();
                if (!renderCancelRequested) setRenderProgress(100);
            } catch (error) {
                console.error("Error rendering:", error);
                setRenderProgress(0);
            } finally {
                if (!renderCancelRequested) {
                    setTimeout(() => { setIsRendering(false); setRenderProgress(0); }, 2000);
                } else {
                    setIsRendering(false);
                    setRenderProgress(0);
                    setRenderCancelRequested(false);
                }
            }
        }
    };


    const floatingControls = (
        <TimelineControls
            isAnimating={isAnimating}
            isPaused={isPaused}
            ffmpegLoaded={true}
            handleAnimate={handleAnimate}
            handlePause={handlePause}
            handleResume={handleResume}
            handleRenderVideo={handleRenderVideo}
            isTimelineEmpty={measures.length === 0}
            onAudioUpload={() => { }}
            audioUploaded={false}
            onResetPlayback={handleResetPlayback}
        />
    );

    const navItems: NavItem[] = [
        { id: "studio", icon: Guitar, label: "Fretboard" },
        { id: "library", icon: Library, label: "Library" },
        { id: "customize", icon: Settings, label: "Settings" }
    ];

    const visualEditorProps = {
        measures,
        selectedNoteIds,
        timeSignature: settings.time,
        activeDuration: activeDuration,
        hasClipboard: false,
        onSelectNote: handleSelectNote,
        onDoubleClickNote: (id: string) => setEditingNoteId(id),
        onAddNote: handleAddNote,
        onRemoveMeasure: handleRemoveMeasure,
        onAddMeasure: handleAddMeasure,
        onUpdateMeasure: handleUpdateMeasure,
        onToggleCollapse: (id: string) => { },
        onCopyMeasure: (id: string) => { },
        onPasteMeasure: (id: string) => { },
        onReorderMeasures: (from: number, to: number) => { },
        onRemoveNote: handleRemoveNote,
        onSelectMeasure: handleSelectMeasure,
        onDeselectAll: () => handleSelectMeasure(''),
        selectedMeasureId: selectedMeasureId,
        onUpdateNote: (id: string, updates: any) => updateSelectedNotes(updates),
    };

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<AppHeader />}
            mobileHeader={<MobileHeader title="Fretboard" showBack={true} />}
            mobileBottomNav={
                <MobileNav
                    items={navItems}
                    activePanel={activePanel}
                    onPanelChange={setLocalActivePanel}
                />
            }
            leftSidebar={
                <Sidebar
                    isMobile={isMobile}
                    isOpen={activePanel === 'library'}
                    onClose={() => setLocalActivePanel('studio')}
                    simpleMode={true}
                    // Handlers
                    onInsert={handleInsert}
                    onAddNote={handleAddNote}
                    onUpdateNote={updateSelectedNotes}
                    activeDuration={activeDuration}
                    onSelectDuration={setActiveDuration}
                    editingNote={editingNote}
                    currentPitch={currentPitch}
                    onCloseInspector={() => setEditingNoteId(null)}
                    onNoteRhythmChange={(dur, dot) => {
                        if (editingNoteId) handleNoteRhythmChange(editingNoteId, dur, dot);
                    }}
                    onNoteTypeChange={(type: any) => updateSelectedNotes({ type })}
                    onPitchChange={handlePitchChange}
                    onStringChange={handleStringChange}
                    onAccidentalChange={handleAccidentalChange}
                    onDecoratorChange={handleDecoratorChange}
                    activeMeasure={activeMeasure}
                    onMeasureUpdate={handleUpdateMeasure}
                    activePositionIndex={activePositionIndex}
                    onActivePositionIndexChange={setActivePositionIndex}
                    onAddChordNote={handleAddChordNote}
                    onRemoveChordNote={handleRemoveChordNote}
                    globalSettings={settings}
                    onGlobalSettingsChange={(newSettings: any) => setSettings(prev => ({ ...prev, ...newSettings }))}
                    onImportScore={() => { }}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                />
            }
            rightSidebar={<SettingsPanel isMobile={isMobile} isOpen={activePanel === 'customize'} onClose={() => setLocalActivePanel('studio')} />}
        >
            {isMobile ? (
                <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <StageContainer title="Visualizer">
                                <FretboardStage
                                    ref={videoCanvasRef}
                                    chords={chords}
                                    transitionsEnabled={playbackTransitionsEnabled}
                                    buildEnabled={playbackBuildEnabled}
                                    onAnimationStateChange={(animating: boolean, paused: boolean) => {
                                        setIsAnimating(animating);
                                        setIsPaused(paused);
                                    }}
                                    onRenderProgress={setRenderProgress}
                                />
                            </StageContainer>
                        </div>
                        {/* Mobile Controls */}
                        <div className="mb-4 px-2">
                            {floatingControls}
                        </div>

                        <div className="h-64 overflow-hidden border-t border-white/10">
                            {/* VisualEditor replaces TimelinePanel */}
                            <VisualEditor {...visualEditorProps} />
                        </div>
                    </div>
                </div>
            ) : (
                <EditorGrid
                    topSection={
                        <StageContainer title="Visualizer">
                            <FretboardStage
                                ref={videoCanvasRef}
                                chords={chords}
                                transitionsEnabled={playbackTransitionsEnabled}
                                buildEnabled={playbackBuildEnabled}
                                onAnimationStateChange={(animating: boolean, paused: boolean) => {
                                    setIsAnimating(animating);
                                    setIsPaused(paused);
                                }}
                                onRenderProgress={setRenderProgress}
                            />
                        </StageContainer>
                    }
                    bottomSection={
                        <VisualEditor {...visualEditorProps} />
                    }
                    floatingControls={floatingControls}
                />
            )}
            <RenderingProgressCard />
        </WorkspaceLayout>
    );
}

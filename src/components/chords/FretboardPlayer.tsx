"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "@/components/chords/Sidebar";
import { measuresToChords } from "@/lib/fretboard/converter";
import { ChordDiagramProps } from "@/modules/core/domain/types";
import VisualTimeline from "@/components/chords/timeline/VisualTimeline";
import { useAppContext } from "@/app/context/app--context";
import { FretboardStage, FretboardStageRef } from "@/components/chords/FretboardStage";
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
import { TimelineControls } from "@/components/chords/timeline/TimelineControls";
import { useChordsEditor } from "@/hooks/use-chords-editor";

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
        handleToggleBarre,
        handleToggleBarreTo,
        handleToggleCollapse,
        handleReorderMeasures,
        handleCopyMeasure,
        handlePasteMeasure,
        handleTransposeMeasure,
        handleTransposeAll,
        updateSelectedNotes,
        undo,
        redo,
        canUndo,
        canRedo,
        theme,     // Local History-tracked theme
        setTheme   // Setter that pushes to history
    } = useChordsEditor();

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
        playbackTotalDurationMs,
        animationType, // Needed for SettingsPanel props? or Stage?
        // colors/setColors removed from here
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

    // 4. Calculate Preview Chord (Ghost Note)
    const previewChord = useMemo<ChordDiagramProps | null>(() => {
        return null;
    }, [activeMeasure, settings, selectedNoteIds]);

    // 5. Calculate Active Chord Index (for syncing canvas with timeline selection)
    // 5. Calculate Active Chord Index (for syncing canvas with timeline selection)
    const activeChordIndex = useMemo(() => {
        if (!activeMeasure || chords.length === 0) return 0;

        // Count how many chords are in the measures BEFORE the current measure
        const previousMeasures = measures.slice(0, currentMeasureIndex);

        // Base Index: Start of the current measure
        const prevChordsCount = measuresToChords(previousMeasures, settings).length;

        // Offset: Find which note in the active measure is "focused"
        let offset = 0;

        // Priority 1: Note being edited (The "history" tip)
        if (editingNoteId) {
            const index = activeMeasure.notes.findIndex(n => n.id === editingNoteId);
            if (index !== -1) offset = index;
        }
        // Priority 2: Last selected note
        else if (selectedNoteIds.length > 0) {
            // Find the selected note with the highest index (latest in measure)
            // or just the last added to selection? 
            // Let's assume the last note in the measure that is selected.
            let maxIndex = -1;
            activeMeasure.notes.forEach((n, idx) => {
                if (selectedNoteIds.includes(n.id)) {
                    maxIndex = Math.max(maxIndex, idx);
                }
            });
            if (maxIndex !== -1) offset = maxIndex;
        }

        return prevChordsCount + offset;
    }, [activeMeasure, currentMeasureIndex, measures, settings, chords, editingNoteId, selectedNoteIds]);

    // Force Guitar Fretboard mode on mount if coming from Studio default
    useEffect(() => {
        setAnimationType(prev => (prev === 'carousel' ? 'guitar-fretboard' : prev));
    }, [setAnimationType]);

    // Sync animation type with numFrets to ensure Undo/Redo restores the correct view
    useEffect(() => {
        const numFrets = settings.numFrets || 24;
        if (numFrets <= 6 && animationType !== 'static-fingers') {
            setAnimationType('static-fingers');
        } else if (numFrets > 6 && animationType !== 'guitar-fretboard') {
            setAnimationType('guitar-fretboard');
        }
    }, [settings.numFrets, animationType, setAnimationType]);

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

    // Global Keyboard Listeners (Space for Play/Pause)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                // Prevent toggling when typing in inputs
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

                e.preventDefault(); // Prevent page scroll

                if (isAnimating) {
                    if (isPaused) handleResume();
                    else handlePause();
                } else {
                    handleAnimate();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAnimating, isPaused]);


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
        onToggleCollapse: handleToggleCollapse,
        onCopyMeasure: handleCopyMeasure,
        onPasteMeasure: handlePasteMeasure,
        onReorderMeasures: handleReorderMeasures,
        onRemoveNote: handleRemoveNote,
        onSelectMeasure: handleSelectMeasure,
        onDeselectAll: () => handleSelectMeasure(''),
        selectedMeasureId: selectedMeasureId,
        onUpdateNote: (id: string, updates: any) => updateSelectedNotes(updates),
    };

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<AppHeader
                onImportHistory={async (file) => {
                    try {
                        const { readHistoryFile, historyToFretboard } = await import('@/lib/history-manager');
                        const data = await readHistoryFile(file);

                        // Restore measures
                        if (data.measures) {
                            setMeasures(data.measures);
                        } else {
                            const newMeasures = historyToFretboard(data.chords);
                            setMeasures(newMeasures);
                        }

                        // Restore settings if available
                        if (data.settings) {
                            setSettings(prev => ({ ...prev, ...data.settings }));
                        }

                        // Restore theme if available & supported
                        if (data.theme) {
                            setTheme(prev => ({ ...prev, ...data.theme }));
                        }

                    } catch (e) {
                        console.error("Import failed", e);
                    }
                }}
                onExportHistory={async () => {
                    const { downloadHistory, createFullHistory } = await import('@/lib/history-manager');
                    // We need colors here. 'colors' is available in scope from context.
                    console.log('[FretboardPlayer] Exporting History. Current Theme:', theme);
                    const history = createFullHistory(measures, settings, theme);
                    downloadHistory(history, 'fretboard-history.json');
                }}
            />}

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
                    onUpdateMeasure={handleUpdateMeasure}
                    onTransposeMeasure={handleTransposeMeasure}
                    onTransposeAll={handleTransposeAll}
                    activePositionIndex={activePositionIndex}
                    onActivePositionIndexChange={setActivePositionIndex}
                    onAddChordNote={handleAddChordNote}
                    onRemoveChordNote={handleRemoveChordNote}
                    onToggleBarre={handleToggleBarre}
                    onToggleBarreTo={handleToggleBarreTo}
                    globalSettings={settings}
                    onGlobalSettingsChange={(newSettings: any) => setSettings(prev => ({ ...prev, ...newSettings }))}
                    onImportScore={() => { }}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    theme={theme}
                />
            }
            rightSidebar={<SettingsPanel
                isMobile={isMobile}
                isOpen={activePanel === 'customize'}
                onClose={() => setLocalActivePanel('studio')}
                colors={theme}
                onColorChange={setTheme as any}
            />}
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
                                    numStrings={settings.numStrings}
                                    numFrets={settings.numFrets}
                                    showChordName={settings.showChordName !== false}
                                    capo={settings.capo}
                                    tuningShift={settings.tuningShift || 0}
                                    stringNames={settings.tuning}
                                    colors={theme}
                                    animationType={(settings.numFrets || 24) <= 6 ? 'static-fingers' : (animationType === 'static-fingers' ? 'guitar-fretboard' : animationType)}
                                />
                            </StageContainer>
                        </div>
                        {/* Mobile Controls */}
                        <div className="mb-4 px-2">
                            {floatingControls}
                        </div>
                        <div className="h-64 overflow-hidden border-t border-white/10">
                            {/* VisualTimeline replaces TimelinePanel */}
                            <VisualTimeline {...visualEditorProps} />
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
                                previewChord={previewChord}
                                activeChordIndex={activeChordIndex}
                                transitionsEnabled={playbackTransitionsEnabled}
                                buildEnabled={playbackBuildEnabled}
                                onAnimationStateChange={(animating: boolean, paused: boolean) => {
                                    setIsAnimating(animating);
                                    setIsPaused(paused);
                                }}
                                onRenderProgress={setRenderProgress}
                                numStrings={settings.numStrings}
                                numFrets={settings.numFrets}
                                showChordName={settings.showChordName !== false}
                                capo={settings.capo}
                                tuningShift={settings.tuningShift || 0}
                                stringNames={settings.tuning}
                                colors={theme}
                                animationType={(settings.numFrets || 24) <= 6 ? 'static-fingers' : (animationType === 'static-fingers' ? 'guitar-fretboard' : animationType)}
                            />
                        </StageContainer>
                    }
                    bottomSection={
                        <VisualTimeline {...visualEditorProps} />
                    }
                    floatingControls={floatingControls}
                />
            )}
            <RenderingProgressCard />
        </WorkspaceLayout>
    );
}

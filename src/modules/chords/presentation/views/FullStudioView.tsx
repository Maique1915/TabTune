"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import FullSidebar from "@/modules/chords/presentation/components/FullSidebar";
import StudioTimeline from "@/modules/timeline/presentation/components/StudioTimeline";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { FullFretboardStage, FullFretboardStageRef } from "@/modules/chords/presentation/components/FullFretboardStage";
import { SettingsPanel } from "@/modules/chords/presentation/components/SettingsPanel";
import { AppHeader } from "@/modules/chords/presentation/components/app-header";
import { StageContainer } from "@/shared/components/layout/StageContainer";
import { WorkspaceLayout } from "@/shared/components/layout/WorkspaceLayout";
import { EditorGrid } from "@/shared/components/layout/EditorGrid";
import { MobileNav, NavItem } from "@/shared/components/layout/MobileNav";
import { RenderingProgressCard } from "@/modules/chords/presentation/components/rendering-progress-card";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { Library, Settings, Guitar } from "lucide-react";
import { TimelineControls } from "@/modules/timeline/presentation/components/TimelineControls";
import { useStudioChordsEditor } from "@/modules/editor/presentation/hooks/use-studio-chords-editor";
import { useTimelineSync } from "@/modules/timeline/presentation/hooks/use-timeline-sync";
import { RenderDialog, RenderFormat, RenderQuality } from "@/modules/chords/presentation/components/RenderDialog";
import { PreviewWatermark } from "@/modules/chords/presentation/components/PreviewWatermark";

export function FullStudioView() {
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
        handleUpdateMeasure,
        handleAddMeasure,
        handleRemoveMeasure,
        handleNoteRhythmChange,
        handleRemoveNote,
        handleCopyNote,
        handlePitchChange,
        handleStringChange,
        handleAccidentalChange,
        handleDecoratorChange,
        handleInsert,
        handleAddChordNote,
        handleRemoveChordNote,
        handleToggleBarre,
        handleToggleBarreTo,
        handleSetFingerForString,
        handleSetFretForString,
        handleSetStringForPosition,
        handleSelectStringAndAddIfMissing,
        handleToggleCollapse,
        handleReorderMeasures,
        handleReorderNotes,
        handleCopyMeasure,
        handlePasteMeasure,
        handleTransposeMeasure,
        handleTransposeAll,
        handleAutoFingerToggle,
        updateSelectedNotes,
        undo,
        redo,
        canUndo,
        canRedo,
        theme,
        setTheme
    } = useStudioChordsEditor();

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
        animationType,
        playbackProgress,
        playbackIsPlaying,
        renderProgress,
        requestPlaybackSeek
    } = useAppContext();

    // Studio specific defaults for Cinematic-like Full View
    useEffect(() => {
        setSettings(prev => ({ ...prev, numFrets: 24 }));
        if (animationType !== 'guitar-fretboard') {
            setAnimationType('guitar-fretboard');
        }
    }, [setSettings, setAnimationType]);

    const videoCanvasRef = useRef<FullFretboardStageRef>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderDialogOpen, setRenderDialogOpen] = useState(false);
    const [renderQuality, setRenderQuality] = useState<string>('--');
    const [renderStartTime, setRenderStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState("--:--");

    const handleAnimationStateChange = useCallback((animating: boolean, paused: boolean) => {
        setIsAnimating(animating);
        setIsPaused(paused);
    }, []);

    const [activePanel, setLocalActivePanel] = useState<'studio' | 'library' | 'mixer' | 'customize'>('studio');
    const isMobile = useIsMobile();

    const {
        chords,
        activeChordIndex,
        totalDurationMs,
        currentCursorMs
    } = useTimelineSync({
        measures,
        settings,
        activeMeasure,
        currentMeasureIndex,
        editingNoteId,
        selectedNoteIds,
        playbackIsPlaying,
        playbackProgress,
        playbackTotalDurationMs,
        selectedMeasureId
    });

    const handleSeek = (ms: number) => {
        if (totalDurationMs > 0) {
            requestPlaybackSeek(ms / totalDurationMs);
        }
    };

    useEffect(() => {
        if (renderCancelRequested) {
            if (videoCanvasRef.current) videoCanvasRef.current.cancelRender();
            setIsRendering(false);
            setRenderProgress(0);
            setRenderCancelRequested(false);
        }
    }, [renderCancelRequested, setIsRendering, setRenderProgress, setRenderCancelRequested]);

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
        if (videoCanvasRef.current) videoCanvasRef.current.cancelRender();
    };

    const handleRenderVideo = async () => {
        // Open the render dialog instead of directly rendering
        setRenderDialogOpen(true);
    };

    const handleRenderWithOptions = async (format: RenderFormat, quality: RenderQuality, fileName: string) => {
        setRenderDialogOpen(false);
        setRenderQuality(quality);
        setRenderStartTime(Date.now());
        setElapsedTime("00:00");
        if (videoCanvasRef.current) {
            setIsRendering(true);
            setRenderProgress(0);
            try {
                await videoCanvasRef.current.handleRender(format, quality, fileName);
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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRendering && renderStartTime) {
            interval = setInterval(() => {
                const seconds = Math.floor((Date.now() - renderStartTime) / 1000);
                const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                const secs = (seconds % 60).toString().padStart(2, '0');
                setElapsedTime(`${mins}:${secs}`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRendering, renderStartTime]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
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
            currentTime={currentCursorMs}
            totalDuration={totalDurationMs}
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
        onRemoveNote: handleRemoveNote,
        onCopyNote: handleCopyNote,
        onRemoveMeasure: handleRemoveMeasure,
        onAddMeasure: handleAddMeasure,
        onUpdateMeasure: handleUpdateMeasure,
        onToggleCollapse: handleToggleCollapse,
        onCopyMeasure: handleCopyMeasure,
        onPasteMeasure: handlePasteMeasure,
        onReorderMeasures: handleReorderMeasures,
        onReorderNotes: handleReorderNotes,
        onSelectMeasure: handleSelectMeasure,
        onDeselectAll: () => handleSelectMeasure(''),
        selectedMeasureId: selectedMeasureId,
        onUpdateNote: (id: string, updates: any) => updateSelectedNotes(updates),
        totalDurationMs: totalDurationMs,
        currentCursorMs: currentCursorMs,
        bpm: settings.bpm,
        onSeek: handleSeek
    };

    const activeAnimationType = (settings.numFrets || 5) <= 6 ? (animationType === 'guitar-fretboard' ? 'static-fingers' : animationType) : 'guitar-fretboard';

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<AppHeader
                onImportHistory={async (file) => {
                    try {
                        const { readHistoryFile, historyToFretboard } = await import('@/lib/history-manager');
                        const data = await readHistoryFile(file);
                        if (data.measures) setMeasures(data.measures);
                        else setMeasures(historyToFretboard(data.chords));
                        if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
                        if (data.theme) setTheme(prev => ({ ...prev, ...data.theme }));
                    } catch (e) {
                        console.error("Import failed", e);
                    }
                }}
                onExportHistory={async () => {
                    const { downloadHistory, createFullHistory } = await import('@/lib/history-manager');
                    const history = createFullHistory(measures, settings, theme);
                    downloadHistory(history, 'fretboard-history.json');
                }}
                title="Studio"
            />}
            mobileBottomNav={<MobileNav items={navItems} activePanel={activePanel} onPanelChange={setLocalActivePanel} />}
            leftSidebar={
                <FullSidebar
                    isMobile={isMobile}
                    isOpen={activePanel === 'library'}
                    onClose={() => setLocalActivePanel('studio')}
                    simpleMode={true}
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
                    onToggleAutoFinger={handleAutoFingerToggle}
                    activePositionIndex={activePositionIndex}
                    onActivePositionIndexChange={setActivePositionIndex}
                    onAddChordNote={handleAddChordNote}
                    onRemoveChordNote={handleRemoveChordNote}
                    onToggleBarre={handleToggleBarre}
                    onToggleBarreTo={handleToggleBarreTo}
                    onSetFingerForPosition={handleSetFingerForString}
                    onSetFretForPosition={handleSetFretForString}
                    onSetStringForPosition={handleSetStringForPosition}
                    globalSettings={settings}
                    onGlobalSettingsChange={(newSettings: any) => setSettings(prev => ({ ...prev, ...newSettings }))}
                    onImportScore={() => { }}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    theme={theme}
                    measures={measures}
                />
            }
            rightSidebar={<SettingsPanel isMobile={isMobile} isOpen={activePanel === 'customize'} onClose={() => setLocalActivePanel('studio')} colors={theme} onColorChange={setTheme as any} numFrets={settings.numFrets || 5} />}
        >
            {isMobile ? (
                <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <StageContainer title="Visualizer">
                                <FullFretboardStage
                                    ref={videoCanvasRef}
                                    chords={chords}
                                    activeChordIndex={activeChordIndex}
                                    transitionsEnabled={playbackTransitionsEnabled}
                                    buildEnabled={playbackBuildEnabled}
                                    onAnimationStateChange={handleAnimationStateChange}
                                    onRenderProgress={setRenderProgress}
                                    numStrings={settings.numStrings}
                                    numFrets={settings.numFrets}
                                    showChordName={settings.showChordName !== false}
                                    capo={settings.capo}
                                    tuningShift={settings.tuningShift || 0}
                                    stringNames={settings.tuning}
                                    colors={theme}
                                    animationType={activeAnimationType}
                                />
                            </StageContainer>
                        </div>
                        <div className="mb-4 px-2">{floatingControls}</div>
                        <div className="h-64 overflow-hidden border-t border-white/10">
                            <StudioTimeline {...visualEditorProps} />
                        </div>
                    </div>
                </div>
            ) : (
                <EditorGrid
                    topSection={
                        <StageContainer title="Visualizer">
                            <FullFretboardStage
                                ref={videoCanvasRef}
                                chords={chords}
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
                                animationType={activeAnimationType}
                            />
                            {!isRendering && <PreviewWatermark />}
                        </StageContainer>
                    }
                    bottomSection={<StudioTimeline {...visualEditorProps} />}
                    floatingControls={floatingControls}
                />
            )}
            <RenderDialog
                open={renderDialogOpen}
                onOpenChange={setRenderDialogOpen}
                onRender={handleRenderWithOptions}
                isRendering={isRendering}
                renderProgress={renderProgress}
            />
            <RenderingProgressCard elapsedTime={elapsedTime} quality={renderQuality} />

        </WorkspaceLayout>
    );
}

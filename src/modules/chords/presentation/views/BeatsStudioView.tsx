"use client";

import React, { useRef } from "react";
import BeatsSidebar from "@/modules/chords/presentation/components/Sidebar/BeatsSidebar";
import BeatsTimeline from "@/modules/timeline/presentation/components/BeatsTimeline";
import { BeatsFretboardStage, BeatsFretboardStageRef } from "@/modules/chords/presentation/components/FretboardStage/BeatsFretboardStage";
import { SettingsPanel } from "@/modules/chords/presentation/components/SettingsPanel";
import { AppHeader } from "@/modules/chords/presentation/components/app-header";
import { StageContainer } from "@/shared/components/layout/StageContainer";
import { WorkspaceLayout } from "@/shared/components/layout/WorkspaceLayout";
import { EditorGrid } from "@/shared/components/layout/EditorGrid";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { RenderingProgressCard } from "@/modules/chords/presentation/components/rendering-progress-card";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { useBeatsEditor } from "@/modules/editor/presentation/hooks/use-beats-editor";
import { RenderDialog } from "@/modules/chords/presentation/components/RenderDialog";
import { SaveProjectDialog } from "@/modules/chords/presentation/components/SaveProjectDialog";
import { PreviewWatermark } from "@/modules/chords/presentation/components/PreviewWatermark";
import { useBaseStudioView } from "@/modules/chords/presentation/hooks/use-base-studio-view";

export function BeatsStudioView() {
    const videoCanvasRef = useRef<BeatsFretboardStageRef>(null);
    const isMobile = useIsMobile();

    const baseView = useBaseStudioView({
        useEditor: useBeatsEditor,  // Beats uses different editor
        defaultNumFrets: 5,
        defaultAnimationType: 'static-fingers',
        allowedAnimationTypes: ['static-fingers', 'carousel'],
        stageRef: videoCanvasRef
    });

    const {
        measures,
        settings,
        selectedNoteIds,
        editingNoteId,
        activeDuration,
        activePositionIndex,
        editingNote,
        currentPitch,
        activeMeasure,
        setMeasures,
        setSettings,
        setActiveDuration,
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
        handleTransposeMeasure,
        handleTransposeAll,
        handleAutoFingerToggle,
        updateSelectedNotes,
        undo,
        redo,
        canUndo,
        canRedo,
        theme,
        setTheme,
        // Base view data
        isAnimating,
        isPaused,
        renderDialogOpen,
        setRenderDialogOpen,
        renderQuality,
        elapsedTime,
        activePanel,
        setLocalActivePanel,
        handleAnimationStateChange,
        handleRenderWithOptions,
        handleSaveProject,
        chords,
        activeChordIndex,
        floatingControls,
        navItems,
        visualEditorProps,
        activeAnimationType,
        playbackTransitionsEnabled,
        playbackBuildEnabled,
        isRendering,
        renderProgress,
        setRenderProgress,
        projectName,
        saveDialogOpen,
        setSaveDialogOpen,
        onConfirmSaveNewProject
    } = baseView;

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
                        if (data.settings) setSettings((prev: any) => ({ ...prev, ...data.settings }));
                        if (data.theme) setTheme((prev: any) => ({ ...prev, ...data.theme }));
                    } catch (e) {
                        console.error("Import failed", e);
                    }
                }}
                onExportHistory={async () => {
                    const { downloadHistory, createFullHistory } = await import('@/lib/history-manager');
                    const history = createFullHistory(measures, settings, theme);
                    downloadHistory(history, 'fretboard-history.json');
                }}
                title="Guitar Beats"
            />}
            mobileBottomNav={<MobileNav items={navItems} activePanel={activePanel} onPanelChange={setLocalActivePanel} />}
            leftSidebar={
                <BeatsSidebar
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
                        const targetId = editingNoteId || activeMeasure?.notes[0]?.id;
                        if (targetId) handleNoteRhythmChange(targetId, dur, dot);
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
                    onGlobalSettingsChange={(newSettings: any) => setSettings((prev: any) => ({ ...prev, ...newSettings }))}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    theme={theme}
                    measures={measures}
                    onSelectNote={handleSelectNote}
                    onRemoveNote={handleRemoveNote}
                    projectName={projectName}
                    onSave={handleSaveProject}
                />
            }
            rightSidebar={<SettingsPanel
                isMobile={isMobile}
                isOpen={activePanel === 'customize'}
                onClose={() => setLocalActivePanel('studio')}
                colors={theme}
                onColorChange={setTheme as any}
                numFrets={settings.numFrets || 5}
                viewMode="beats"
            />}
        >
            {isMobile ? (
                <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <StageContainer title="Beats Visualizer">
                                <BeatsFretboardStage
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
                                    timeSignature={settings.time}
                                />
                            </StageContainer>
                        </div>
                        <div className="mb-4 px-2">{floatingControls}</div>
                        <div className="h-64 overflow-hidden border-t border-white/10">
                            <BeatsTimeline {...visualEditorProps} />
                        </div>
                    </div>
                </div>
            ) : (
                <EditorGrid
                    topSection={
                        <StageContainer title="Beats Visualizer">
                            <BeatsFretboardStage
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
                            {!isRendering && <PreviewWatermark />}
                        </StageContainer>
                    }
                    bottomSection={<BeatsTimeline {...visualEditorProps} />}
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
            <SaveProjectDialog
                open={saveDialogOpen}
                onOpenChange={setSaveDialogOpen}
                onSave={onConfirmSaveNewProject}
                initialName={projectName}
            />

        </WorkspaceLayout>
    );
}

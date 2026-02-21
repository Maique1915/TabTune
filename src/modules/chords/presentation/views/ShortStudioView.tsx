"use client";

import React, { useRef } from "react";
import Sidebar from "@/modules/chords/presentation/components/Sidebar/ShortSidebar";
import StudioTimeline from "@/modules/timeline/presentation/components/StudioTimeline";
import { FretboardStage, FretboardStageRef } from "@/modules/chords/presentation/components/FretboardStage/FretboardStage";
import { SettingsPanel } from "@/modules/chords/presentation/components/SettingsPanel";
import { AppHeader } from "@/modules/chords/presentation/components/app-header";
import { StageContainer } from "@/shared/components/layout/StageContainer";
import { WorkspaceLayout } from "@/shared/components/layout/WorkspaceLayout";
import { EditorGrid } from "@/shared/components/layout/EditorGrid";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { RenderingProgressCard } from "@/modules/chords/presentation/components/rendering-progress-card";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { useStudioChordsEditor } from "@/modules/editor/presentation/hooks/use-studio-chords-editor";
import { RenderDialog } from "@/modules/chords/presentation/components/RenderDialog";
import { SaveProjectDialog } from "@/modules/chords/presentation/components/SaveProjectDialog";
import { PreviewWatermark } from "@/modules/chords/presentation/components/PreviewWatermark";
import { useBaseStudioView } from "@/modules/chords/presentation/hooks/use-base-studio-view";
import { useKeyboardShortcuts } from "@/modules/chords/presentation/hooks/use-keyboard-shortcuts";

export function ShortStudioView() {
    const videoCanvasRef = useRef<FretboardStageRef>(null);
    const isMobile = useIsMobile();

    const baseViewConfig = React.useMemo(() => ({
        useEditor: useStudioChordsEditor,
        defaultNumFrets: 5,
        defaultAnimationType: 'static-fingers',
        allowedAnimationTypes: ['static-fingers', 'carousel'],
        variant: 'short' as const,
        stageRef: videoCanvasRef
    }), []);

    const baseView = useBaseStudioView(baseViewConfig);

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
        handleCopyMeasure,
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
        hasUnsavedChanges,
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

    useKeyboardShortcuts({
        ...baseView,
        onSetFretForPosition: handleSetFretForString,
        onSetStringForPosition: handleSetStringForPosition,
        onSetFingerForPosition: handleSetFingerForString,
        onToggleBarreTo: handleToggleBarreTo,
        onToggleBarre: handleToggleBarre,
        onTransposeAll: handleTransposeAll,
        onAddNote: handleAddNote,
        onAddMeasure: handleAddMeasure,
        onAddChordNote: handleAddChordNote,
        onRemoveMeasure: handleRemoveMeasure,
        onCopyMeasure: handleCopyMeasure,
        onRemoveChordNote: handleRemoveChordNote,
        onRemoveNote: handleRemoveNote,
        onGlobalSettingsChange: (newSettings: any) => setSettings((prev: any) => ({ ...prev, ...newSettings })),
        globalSettings: settings
    } as any);

    return (
        <WorkspaceLayout
            isMobile={isMobile}
            header={<AppHeader
                title="Studio"
                hasUnsavedChanges={hasUnsavedChanges}
            />}
            mobileBottomNav={<MobileNav items={navItems} activePanel={activePanel} onPanelChange={setLocalActivePanel} />}
            leftSidebar={
                <Sidebar
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
                    onImportScore={() => { }}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    hasUnsavedChanges={hasUnsavedChanges}
                    theme={theme}
                    measures={measures}
                    projectName={projectName}
                    onSave={handleSaveProject}
                    variant="short"
                />
            }
            rightSidebar={<SettingsPanel isMobile={isMobile} isOpen={activePanel === 'customize'} onClose={() => setLocalActivePanel('studio')} colors={theme} onColorChange={setTheme as any} numFrets={settings.numFrets || 5} />}
        >
            {isMobile ? (
                <div className="flex-1 px-4 py-2 flex flex-col min-h-[250px] relative overflow-hidden">
                    <div className={cn("h-full w-full flex flex-col", { "hidden": activePanel !== 'studio' })}>
                        <div className="flex-1 relative flex items-center justify-center mb-4">
                            <StageContainer title="Visualizer">
                                <FretboardStage
                                    ref={videoCanvasRef}
                                    {...visualEditorProps}
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
                            <StudioTimeline {...visualEditorProps} variant="short" />
                        </div>
                    </div>
                </div>
            ) : (
                <EditorGrid
                    topSection={
                        <StageContainer title="Visualizer">
                            <FretboardStage
                                ref={videoCanvasRef}
                                {...visualEditorProps}
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
                    bottomSection={<StudioTimeline {...visualEditorProps} variant="short" />}
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

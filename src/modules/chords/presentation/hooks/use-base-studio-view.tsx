import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { useTimelineSync } from "@/modules/timeline/presentation/hooks/use-timeline-sync";
import { TimelineControls } from "@/modules/timeline/presentation/components/TimelineControls";
import { NavItem } from "@/shared/components/layout/MobileNav";
import { Library, Settings, Guitar } from "lucide-react";
import { RenderFormat, RenderQuality } from "@/modules/chords/presentation/components/RenderDialog";

export interface BaseStudioViewConfig {
    // Editor hook to use
    useEditor: () => any;

    // Initial settings
    defaultNumFrets: number;
    defaultAnimationType: string;
    allowedAnimationTypes?: string[];
    variant?: 'short' | 'full' | 'beats';

    // Stage ref
    stageRef: React.RefObject<any>;
}

export function useBaseStudioView(config: BaseStudioViewConfig) {
    const {
        useEditor,
        defaultNumFrets,
        defaultAnimationType,
        allowedAnimationTypes,
        stageRef
    } = config;

    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');

    // Use the provided editor hook
    const editorData = useEditor();

    const { setMeasures, setSettings, setTheme, hasUnsavedChanges, markAsSaved } = editorData;

    const [projectName, setProjectName] = useState<string>("");

    // Load project if ID is present
    useEffect(() => {
        if (!projectId) return;

        fetch(`/api/projects?userId=${JSON.parse(localStorage.getItem('cifrai_user') || '{}')?.id}`)
            .then(res => res.json())
            .then(allProjects => {
                const project = allProjects.find((p: any) => p.id === Number(projectId));
                if (project && project.data) {
                    const data = typeof project.data === 'string' ? JSON.parse(project.data) : project.data;

                    if (data.measures) setMeasures(data.measures);
                    if (data.settings) setSettings((prev: any) => ({ ...prev, ...data.settings }));
                    if (data.theme) setTheme((prev: any) => ({ ...prev, ...data.theme }));
                    if (project.name) setProjectName(project.name);

                    // Mark the loaded project as saved
                    markAsSaved();

                    console.log(`Project ${project.name} loaded successfully`);
                }
            })
            .catch(err => console.error('Error loading project:', err));
    }, [projectId, setMeasures, setSettings, setTheme, setProjectName, markAsSaved]);

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

    // Studio specific defaults
    useEffect(() => {
        editorData.setSettings((prev: any) => ({ ...prev, numFrets: defaultNumFrets }));
        if (allowedAnimationTypes && !allowedAnimationTypes.includes(animationType)) {
            setAnimationType(defaultAnimationType as any);
        }
    }, [editorData.setSettings, setAnimationType, defaultNumFrets, defaultAnimationType, allowedAnimationTypes, animationType]);

    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [renderDialogOpen, setRenderDialogOpen] = useState(false);
    const [renderQuality, setRenderQuality] = useState<string>('--');
    const [renderStartTime, setRenderStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState("--:--");
    const [activePanel, setLocalActivePanel] = useState<'studio' | 'library' | 'mixer' | 'customize'>('studio');
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);

    const handleAnimationStateChange = useCallback((animating: boolean, paused: boolean) => {
        setIsAnimating(animating);
        setIsPaused(paused);
    }, []);

    const {
        chords,
        activeChordIndex,
        totalDurationMs,
        currentCursorMs
    } = useTimelineSync({
        measures: editorData.measures,
        settings: editorData.settings,
        activeMeasure: editorData.activeMeasure,
        currentMeasureIndex: editorData.currentMeasureIndex,
        editingNoteId: editorData.editingNoteId,
        selectedNoteIds: editorData.selectedNoteIds,
        playbackIsPlaying,
        playbackProgress,
        playbackTotalDurationMs,
        selectedMeasureId: editorData.selectedMeasureId
    });

    const handleSeek = (ms: number) => {
        if (totalDurationMs > 0) {
            requestPlaybackSeek(ms / totalDurationMs);
        }
    };

    useEffect(() => {
        if (renderCancelRequested) {
            if (stageRef.current) stageRef.current.cancelRender();
            setIsRendering(false);
            setRenderProgress(0);
            setRenderCancelRequested(false);
        }
    }, [renderCancelRequested, setIsRendering, setRenderProgress, setRenderCancelRequested, stageRef]);

    const handleAnimate = () => {
        if (stageRef.current) {
            stageRef.current.startAnimation();
            setIsAnimating(true);
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        if (stageRef.current) {
            stageRef.current.pauseAnimation();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (stageRef.current) {
            stageRef.current.resumeAnimation();
            setIsPaused(false);
        }
    };

    const handleResetPlayback = () => {
        if (stageRef.current) stageRef.current.cancelRender();
    };

    const handleRenderVideo = async () => {
        setRenderDialogOpen(true);
    };

    const handleRenderWithOptions = async (format: RenderFormat, quality: RenderQuality, fileName: string) => {
        console.log('[useBaseStudioView] handleRenderWithOptions triggered', { format, quality, fileName });
        setRenderDialogOpen(false);
        setRenderQuality(quality);
        setRenderStartTime(Date.now());
        setElapsedTime("00:00");

        if (!stageRef.current) {
            console.error('[useBaseStudioView] stageRef.current is NULL! Cannot render.');
            alert("Erro interno: Referência do palco não encontrada. Tente recarregar a página.");
            return;
        }

        if (stageRef.current) {
            console.log('[useBaseStudioView] Starting render on stageRef...');
            setIsRendering(true);
            setRenderProgress(0);
            try {
                await stageRef.current.handleRender(format, quality, fileName);
                console.log('[useBaseStudioView] Render command sent successfully');
                if (!renderCancelRequested) setRenderProgress(100);
            } catch (error) {
                console.error("Error rendering:", error);
                alert(`Erro ao renderizar: ${error}`);
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
            if (e.code === 'Space' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                if (isAnimating) {
                    if (isPaused) handleResume();
                    else handlePause();
                } else {
                    handleAnimate();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
                e.preventDefault();
                handleSaveProject();
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
            isTimelineEmpty={editorData.measures.length === 0}
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
        measures: editorData.measures,
        selectedNoteIds: editorData.selectedNoteIds,
        timeSignature: editorData.settings.time,
        activeDuration: editorData.activeDuration,
        hasClipboard: false,
        onSelectNote: editorData.handleSelectNote,
        onDoubleClickNote: (id: string) => editorData.setEditingNoteId(id),
        onAddNote: (measureId: string) => {
            if (config.variant === 'short') {
                const measure = editorData.measures.find((m: any) => m.id === measureId);
                if (measure && measure.notes.length > 0) {
                    editorData.handleSelectNote(measure.notes[0].id, false);
                    return;
                }
            }
            editorData.handleAddNote(measureId);
        },
        onRemoveNote: editorData.handleRemoveNote,
        onCopyNote: editorData.handleCopyNote,
        onRemoveMeasure: editorData.handleRemoveMeasure,
        onAddMeasure: editorData.handleAddMeasure,
        onUpdateMeasure: editorData.handleUpdateMeasure,
        onToggleCollapse: editorData.handleToggleCollapse,
        onCopyMeasure: editorData.handleCopyMeasure,
        onPasteMeasure: editorData.handlePasteMeasure,
        onReorderMeasures: editorData.handleReorderMeasures,
        onReorderNotes: editorData.handleReorderNotes,
        onSelectMeasure: editorData.handleSelectMeasure,
        onDeselectAll: () => editorData.handleSelectMeasure(''),
        selectedMeasureId: editorData.selectedMeasureId,
        onUpdateNote: (id: string, updates: any) => editorData.updateSelectedNotes(updates),
        totalDurationMs: totalDurationMs,
        currentCursorMs: currentCursorMs,
        bpm: editorData.settings.bpm,
        onSeek: handleSeek
    };

    const activeAnimationType = (editorData.settings.numFrets || 5) <= 6
        ? (animationType === 'guitar-fretboard' ? 'static-fingers' : animationType)
        : 'guitar-fretboard';

    const handleSaveProject = async () => {
        if (projectId) {
            // It's a saved project, just update it
            const storedUser = localStorage.getItem('cifrai_user');
            if (!storedUser) {
                alert("Faça login para salvar seus projetos.");
                return;
            }

            const { createFullHistory } = await import('@/lib/history-manager');
            const history = createFullHistory(editorData.measures, editorData.settings, editorData.theme);

            try {
                const res = await fetch('/api/projects', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: projectId,
                        data: history
                    })
                });
                if (res.ok) {
                    markAsSaved(); // Mark current state as saved
                    alert("Projeto salvo com sucesso!");
                }
            } catch (err) {
                console.error("Save error:", err);
            }
        } else {
            // It's a new project, open the name dialog
            setSaveDialogOpen(true);
        }
    };

    const onConfirmSaveNewProject = async (name: string) => {
        const storedUser = localStorage.getItem('cifrai_user');
        if (!storedUser) {
            alert("Faça login para salvar seus projetos.");
            return;
        }

        const user = JSON.parse(storedUser);
        const { createFullHistory } = await import('@/lib/history-manager');
        const history = createFullHistory(editorData.measures, editorData.settings, editorData.theme);
        const screenContext = window.location.pathname.replace('/', '') || 'short';

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    screenContext,
                    data: history
                })
            });
            if (res.ok) {
                const result = await res.json();
                setProjectName(name);
                markAsSaved(); // Mark current state as saved
                const newUrl = `${window.location.pathname}?id=${result.id}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
                alert("Projeto criado e salvo!");
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    return {
        // Editor data (pass through)
        ...editorData,

        // Base view state
        isAnimating,
        isPaused,
        renderDialogOpen,
        setRenderDialogOpen,
        renderQuality,
        renderStartTime,
        elapsedTime,
        activePanel,
        setLocalActivePanel,

        // Base view handlers
        handleAnimationStateChange,
        handleSeek,
        handleAnimate,
        handlePause,
        handleResume,
        handleResetPlayback,
        handleRenderWithOptions,
        handleSaveProject,
        onConfirmSaveNewProject,
        saveDialogOpen,
        setSaveDialogOpen,

        // Timeline sync data
        chords,
        activeChordIndex,
        totalDurationMs,
        currentCursorMs,

        // Shared objects
        floatingControls,
        navItems,
        visualEditorProps: {
            ...visualEditorProps,
            variant: config.variant
        },
        activeAnimationType,

        // App context
        playbackTransitionsEnabled,
        playbackBuildEnabled,
        isRendering,
        renderProgress,
        setRenderProgress,
        projectName,
        variant: config.variant
    };
}

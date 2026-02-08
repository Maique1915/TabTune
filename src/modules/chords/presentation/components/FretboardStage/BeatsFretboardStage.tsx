"use client";

import React, { Children, useCallback, ForwardedRef, useMemo } from "react";
import { type ChordDrawer } from "@/modules/engine/infrastructure/drawers/ChordDrawer";
import { ShortNeckDrawer } from "@/modules/engine/infrastructure/drawers/ShortNeck";
import { BeatsEngine } from "@/modules/engine/infrastructure/BeatsEngine";
import { BaseStageUI } from "./BaseStageUI";
import { useBaseStage, BaseStageRef, BaseStageProps } from "./useBaseStage";
import { useAppContext } from "@/modules/core/presentation/context/app-context";
import { TimeSignature, ChordWithTiming } from "@/modules/core/domain/types";



export interface BeatsFretboardStageRef extends BaseStageRef { }

interface BeatsFretboardStageProps extends BaseStageProps {
    timeSignature?: TimeSignature;
}

export const BeatsFretboardStage = React.forwardRef<BeatsFretboardStageRef, BeatsFretboardStageProps>((props, ref) => {
    const { colors: contextColors } = useAppContext();
    return <BeatsFretboardStageInner {...props} contextColors={contextColors} forwardedRef={ref} />;
});

// Helper type for engine options to include timeSignature which is specific to BeatsEngine
type BeatsEngineOptions = {
    // ... all base options
    timeSignature?: TimeSignature;
}

const BeatsFretboardStageInner = ({ contextColors, forwardedRef, ...props }: any) => {
    const {
        width = 1920,
        height = 1080,
        numStrings = 6,
        numFrets: propNumFrets,
        capo = 0,
        stringNames = ["E", "A", "D", "G", "B", "e"],
        colors: propsColors,
        timeSignature = { numerator: 4, denominator: 4, bpm: 120 },
        chords: rawChords
    } = props;

    // Process chords to ensure data validity for beats
    const chords = useMemo(() => rawChords || [], [rawChords]);

    const colors = propsColors || contextColors || undefined;
    const effectiveNumFrets = propNumFrets ?? 5;
    const numFrets = effectiveNumFrets;

    const onDrawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.clearRect(0, 0, w, h);
        if (colors?.global?.backgroundColor) {
            ctx.fillStyle = colors.global.backgroundColor;
            ctx.fillRect(0, 0, w, h);
        }

        const effectiveScale = colors?.global?.scale || 1;
        const bgDrawer = new ShortNeckDrawer(ctx, colors, { width: w, height: h }, {
            diagramWidth: w,
            diagramHeight: h,
            diagramX: 0,
            diagramY: 0,
            numStrings: numStrings || 6,
            numFrets: numFrets || 24,
            horizontalPadding: 100,
            stringSpacing: 0,
            fretboardX: 0,
            fretboardY: 0,
            fretboardWidth: w,
            fretboardHeight: h,
            realFretSpacing: 0,
            neckRadius: 35 * effectiveScale,
            stringNamesY: 0,
        }, effectiveScale);

        bgDrawer.setNumStrings(numStrings || 6);
        bgDrawer.setNumFrets(numFrets || 24);
        bgDrawer.setGlobalCapo(capo || 0);
        bgDrawer.setStringNames(stringNames);

        bgDrawer.drawFretboard();
    }, [colors, numStrings, numFrets, capo, stringNames]);

    const engineFactory = useCallback((canvas: HTMLCanvasElement) => {
        // BeatsEngine requires timeSignature in its options
        return new BeatsEngine(canvas, {
            width,
            height,
            numStrings,
            numFrets: effectiveNumFrets,
            colors: colors,
            animationType: props.animationType || 'dynamic-fingers',
            showChordName: props.showChordName ?? true,
            transitionsEnabled: props.transitionsEnabled ?? true,
            buildEnabled: props.buildEnabled ?? true,
            capo,
            tuning: stringNames,
            timeSignature // Passing explicitly
        });
    }, [width, height, numStrings, effectiveNumFrets, colors, props.animationType, props.showChordName, props.transitionsEnabled, props.buildEnabled, capo, stringNames, timeSignature]);

    // Extra options for the hook to pass down to engine updates
    const extraOptions = useMemo(() => ({
        timeSignature
    }), [timeSignature]);

    const baseStage = useBaseStage({
        ...props,
        chords, // Use processed chords
        extraOptions,
        engineFactory,
        onDrawBackground,
        ref: forwardedRef
    });

    return (
        <BaseStageUI
            width={width}
            height={height}
            canvasRef={baseStage.canvasRef as any}
            backgroundCanvasRef={baseStage.backgroundCanvasRef as any}
            stageContainerRef={baseStage.stageContainerRef as any}
        />
    );
};

BeatsFretboardStage.displayName = "BeatsFretboardStage";

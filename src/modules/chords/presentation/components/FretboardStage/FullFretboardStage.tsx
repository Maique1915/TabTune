"use client";

import React, { useCallback } from "react";
import { FullNeckDrawer } from "@/modules/engine/infrastructure/drawers/FullNeck";
import { FullFretboardEngine } from "@/modules/engine/infrastructure/FullFretboardEngine";
import { useBaseStage, BaseStageRef, BaseStageProps } from "./useBaseStage";
import { BaseStageUI } from "./BaseStageUI";
import { useAppContext } from "@/modules/core/presentation/context/app-context";

export interface FullFretboardStageRef extends BaseStageRef { }

interface FullFretboardStageProps extends BaseStageProps {
}

export const FullFretboardStage = React.forwardRef<FullFretboardStageRef, FullFretboardStageProps>((props, ref) => {
    const { colors: contextColors } = useAppContext();
    return <FullFretboardStageInner {...props} contextColors={contextColors} forwardedRef={ref} />;
});

const FullFretboardStageInner = ({ contextColors, forwardedRef, ...props }: any) => {
    const {
        width = 1920,
        height = 1080,
        numStrings = 6,
        numFrets: propNumFrets,
        capo = 0,
        stringNames = ["E", "A", "D", "G", "B", "e"],
        colors: propsColors
    } = props;

    const colors = propsColors || contextColors || undefined;
    const effectiveNumFrets = propNumFrets ?? 5;
    const numFrets = effectiveNumFrets;

    console.log('[FullFretboardStage] Render colors:', {
        rotation: colors?.global?.rotation,
        mirror: colors?.global?.mirror
    });

    const onDrawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.clearRect(0, 0, w, h);
        if (colors?.global?.backgroundColor) {
            ctx.fillStyle = colors.global.backgroundColor;
            ctx.fillRect(0, 0, w, h);
        }

        const effectiveScale = colors?.global?.scale || 1;
        const bgDrawer = new FullNeckDrawer(ctx, colors, { width: w, height: h }, {
            numStrings: numStrings || 6,
            numFrets: numFrets || 24
        }, effectiveScale);

        bgDrawer.setNumStrings(numStrings || 6);
        bgDrawer.setNumFrets(numFrets || 24);
        bgDrawer.setGlobalCapo(capo || 0);
        bgDrawer.setStringNames(stringNames);

        // Explicitly apply transforms to ensure mirror/rotation are picked up
        const bgRotation = colors?.global?.rotation || 0;
        const bgMirror = colors?.global?.mirror || false;
        bgDrawer.setTransforms(bgRotation, bgMirror);

        bgDrawer.drawFretboard();
    }, [colors, numStrings, numFrets, capo, stringNames]); // Colors is in dep array, captured from closure

    const engineFactory = useCallback((canvas: HTMLCanvasElement) => {
        return new FullFretboardEngine(canvas, {
            width,
            height,
            numStrings,
            numFrets: effectiveNumFrets,
            colors: colors,
            animationType: props.animationType,
            showChordName: props.showChordName ?? true,
            transitionsEnabled: props.transitionsEnabled ?? true,
            buildEnabled: props.buildEnabled ?? true,
            capo,
            tuning: stringNames
        });
    }, [width, height, numStrings, effectiveNumFrets, colors, props.animationType, props.showChordName, props.transitionsEnabled, props.buildEnabled, capo, stringNames]);

    const baseStage = useBaseStage({
        ...props,
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

FullFretboardStage.displayName = "FullFretboardStage";

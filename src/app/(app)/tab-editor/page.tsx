"use client";

import React from 'react';
import { useTabEditorStore } from '@/stores/tab-editor-store';
import { SetupDialog } from '@/components/tab-editor/setup-dialog';
import { EditorLayout } from '@/components/tab-editor/editor-layout';

export default function EditorPage() {
    const isSetup = useTabEditorStore((state) => state.isSetup);

    if (!isSetup) {
        return (
            <div className="flex bg-[#121212] h-screen items-center justify-center text-white">
                <SetupDialog />
                <div className="text-center opacity-20">
                    <h1 className="text-4xl font-bold mb-4">TabTune Editor</h1>
                    <p>Configure seu novo card para começar</p>
                </div>
            </div>
        );
    }

    return <EditorLayout />;
}

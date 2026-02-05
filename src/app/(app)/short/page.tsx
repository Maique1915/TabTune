"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { StudioView } from '@/modules/chords/presentation/views/StudioView';

export default function StudioPage() {
    return (
        <AppProvider>
            <StudioView />
        </AppProvider>
    );
}

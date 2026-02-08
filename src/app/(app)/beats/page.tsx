"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { BeatsStudioView } from '@/modules/chords/presentation/views/BeatsStudioView';

export default function BeatsPage() {
    return (
        <AppProvider>
            <BeatsStudioView />
        </AppProvider>
    );
}

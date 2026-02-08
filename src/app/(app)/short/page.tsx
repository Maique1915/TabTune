"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { ShortStudioView } from '@/modules/chords/presentation/views/ShortStudioView';

export default function StudioPage() {
    return (
        <AppProvider>
            <ShortStudioView />
        </AppProvider>
    );
}

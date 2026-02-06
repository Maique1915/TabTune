"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { FullStudioView } from '@/modules/chords/presentation/views/FullStudioView';

export default function FullPage() {
    return (
        <AppProvider>
            <FullStudioView />
        </AppProvider>
    );
}

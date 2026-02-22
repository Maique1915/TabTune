"use client";

import { Suspense } from 'react';
import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { ShortStudioView } from '@/modules/chords/presentation/views/ShortStudioView';

export default function StudioPage() {
    return (
        <AppProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <ShortStudioView />
            </Suspense>
        </AppProvider>
    );
}

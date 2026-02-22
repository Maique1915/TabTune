"use client";

import { Suspense } from 'react';
import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { BeatsStudioView } from '@/modules/chords/presentation/views/BeatsStudioView';

export default function BeatsPage() {
    return (
        <AppProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <BeatsStudioView />
            </Suspense>
        </AppProvider>
    );
}

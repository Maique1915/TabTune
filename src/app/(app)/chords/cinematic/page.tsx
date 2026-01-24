"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { CinematicView } from '@/modules/chords/presentation/views/CinematicView';

export default function CinematicPage() {
    return (
        <AppProvider>
            <CinematicView />
        </AppProvider>
    );
}

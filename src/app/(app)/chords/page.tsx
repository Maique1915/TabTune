"use client";

import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { FretboardPlayer } from '@/modules/chords/presentation/components/FretboardPlayer';

export default function FretboardPage() {
    return (
        <AppProvider>
            <FretboardPlayer />
        </AppProvider>
    );
}

"use client";

import { AppProvider } from '@/app/context/app--context';
import { FretboardPlayer } from '@/components/chords/FretboardPlayer';

export default function FretboardPage() {
    return (
        <AppProvider>
            <FretboardPlayer />
        </AppProvider>
    );
}

"use client";

import { Suspense } from 'react';
import { AppProvider } from '@/modules/core/presentation/context/app-context';
import { TabAnimatorView } from '@/modules/tab-animator/presentation/views/TabAnimatorView';

export default function TabAnimatorPage() {
    return (
        <AppProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <TabAnimatorView />
            </Suspense>
        </AppProvider>
    );
}

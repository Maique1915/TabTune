"use client";

import React from "react";
import { UserProvider } from "@/modules/core/presentation/context/user-context";
import { TranslationProvider } from "@/modules/core/presentation/context/translation-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TranslationProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </TranslationProvider>
    );
}

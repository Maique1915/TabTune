"use client";

import React from "react";
import { UserProvider } from "@/modules/core/presentation/context/user-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}

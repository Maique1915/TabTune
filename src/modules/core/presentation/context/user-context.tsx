"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    name: string;
    email: string;
    preferredLanguage?: string;
    nivel?: "free" | "plus" | "admin";
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("cifrai_user");
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                    localStorage.removeItem("cifrai_user");
                }
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSetUser = useCallback((newUser: User | null) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem("cifrai_user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("cifrai_user");
        }
    }, []);

    const logout = useCallback(() => {
        handleSetUser(null);
        router.push("/");
    }, [handleSetUser, router]);

    return (
        <UserContext.Provider value={{ user, loading, setUser: handleSetUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

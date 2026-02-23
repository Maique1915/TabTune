"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language } from '@/modules/core/domain/i18n/translations';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== "undefined") {
            // First, check if user is logged in and has a preferred language
            const storedUser = localStorage.getItem('cifrai_user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    const userLang = user.preferred_language as Language;
                    if (userLang && ['en', 'pt', 'es'].includes(userLang)) return userLang;
                } catch (error) {
                    console.error('Error parsing user language preference:', error);
                }
            }

            // Fallback to stored language preference if no user is logged in
            const stored = localStorage.getItem('language') as Language;
            if (stored && ['en', 'pt', 'es'].includes(stored)) {
                return stored;
            }
        }
        return 'en';
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const updateLanguage = React.useCallback((lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);

        // If user is logged in, also update their preferred language
        const storedUser = localStorage.getItem('cifrai_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                user.preferred_language = lang;
                localStorage.setItem('cifrai_user', JSON.stringify(user));

                /*
                // Update language in database
                fetch('/api/user/update-language', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        language: lang
                    })
                }).catch(error => {
                    console.error('Failed to update language in database:', error);
                });
                */
            } catch (error) {
                console.error('Error updating user language preference:', error);
            }
        }
    }, []);

    const t = React.useCallback((key: string): string => {
        const keys = key.split('.');
        // Use English during SSR and initial hydration to avoid mismatch
        // On the very first client render, mounted will be false.
        const activeLanguage = mounted ? language : 'en';
        let current: any = translations[activeLanguage];

        for (const k of keys) {
            if (current === undefined || current[k] === undefined) {
                // Fallback to English if not found in current language
                if (activeLanguage !== 'en') {
                    let fallback: any = translations['en'];
                    for (const fk of keys) {
                        if (fallback === undefined || fallback[fk] === undefined) return key;
                        fallback = fallback[fk];
                    }
                    return fallback as string;
                }
                return key;
            }
            current = current[k];
        }
        return current as string;
    }, [language, mounted]);

    const value = React.useMemo(() => ({
        language,
        setLanguage: updateLanguage,
        t
    }), [language, updateLanguage, t]);

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};

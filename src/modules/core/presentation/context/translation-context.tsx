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
    const [language, setLanguage] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // First, check if user is logged in and has a preferred language
        const storedUser = localStorage.getItem('cifrai_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const userLang = user.preferred_language as Language;

                // If user has a valid preferred language, use it
                if (userLang && ['en', 'pt', 'es'].includes(userLang)) {
                    setLanguage(userLang);
                    // Also update the language localStorage to keep them in sync
                    localStorage.setItem('language', userLang);
                    return;
                }
            } catch (error) {
                console.error('Error parsing user language preference:', error);
            }
        }

        // Fallback to stored language preference if no user is logged in
        const stored = localStorage.getItem('language') as Language;
        if (stored && ['en', 'pt', 'es'].includes(stored)) {
            setLanguage(stored);
        }
    }, []);

    const updateLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);

        // If user is logged in, also update their preferred language
        const storedUser = localStorage.getItem('cifrai_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                user.preferred_language = lang;
                localStorage.setItem('cifrai_user', JSON.stringify(user));

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
            } catch (error) {
                console.error('Error updating user language preference:', error);
            }
        }
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        // Use English during SSR and initial hydration to avoid mismatch
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
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
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

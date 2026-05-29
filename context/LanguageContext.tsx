'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const activeLocale = useLocale() as Language;
    const [language, setLanguageState] = useState<Language>(activeLocale);
    const nextIntlT = useTranslations();

    useEffect(() => {
        if (activeLocale && (activeLocale === 'es' || activeLocale === 'en')) {
            setLanguageState(activeLocale);
        }
    }, [activeLocale]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('vamosJuntos_lang', lang);
    };

    const t = (key: string): string => {
        try {
            // Dynamically translate flat keys using next-intl
            return nextIntlT(key);
        } catch {
            return key; // Graceful fallback to translation key itself
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

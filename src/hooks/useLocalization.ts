
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';

const DEFAULT_LANGUAGE: Language = 'en';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'el'];

export function useLocalization() {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage directly if on client
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('appLanguage') as Language | null;
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        return storedLang;
      }
      localStorage.setItem('appLanguage', DEFAULT_LANGUAGE); // Set default if not found or invalid
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    // This effect handles initial setup and updates if localStorage changes externally (though unlikely for this app)
    // Or if the component re-mounts for some reason.
    let currentLanguage = DEFAULT_LANGUAGE;
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('appLanguage') as Language | null;
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        currentLanguage = storedLang;
      } else {
        localStorage.setItem('appLanguage', DEFAULT_LANGUAGE);
      }
    }
    if (language !== currentLanguage) { // Sync React state if it's different
        setLanguageState(currentLanguage);
    }
  }, [language]); // Rerun if language state itself changes to ensure consistency, though direct localStorage is prime

  const setAppLanguage = useCallback((lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('appLanguage', lang);
      }
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback(
    (translations: { [key in Language]?: string } | string, fallback?: string): string => {
      if (typeof translations === 'string') {
        return translations;
      }
      
      let translation = translations[language];
      
      if (translation === undefined) {
        translation = translations[DEFAULT_LANGUAGE];
      }
      
      if (translation === undefined && translations.en) {
        translation = translations.en;
      }

      return translation || fallback || (typeof translations === 'object' ? (translations.en || 'T_N/A') : 'T_N/A');
    },
    [language] 
  );

  return { language, setAppLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES };
}

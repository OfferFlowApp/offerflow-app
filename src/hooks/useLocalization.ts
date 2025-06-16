
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';

const DEFAULT_LANGUAGE: Language = 'en';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'el'];
const LANGUAGE_STORAGE_KEY = 'appLanguage';

export function useLocalization() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE); // Initialize with default

  useEffect(() => {
    // This effect runs once on mount to correctly set the language
    // from localStorage and then listens for any cross-tab storage changes.
    let initialLang = DEFAULT_LANGUAGE;
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        initialLang = storedLang;
      } else {
        // If no valid language is stored, set the default in localStorage.
        localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
      }
    }
    setLanguageState(initialLang); // Update React state with the determined language.

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY && event.newValue && SUPPORTED_LANGUAGES.includes(event.newValue as Language)) {
        setLanguageState(event.newValue as Language);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleans up on unmount.

  const setAppLanguage = useCallback((lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      }
      setLanguageState(lang); // Update React state
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


"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';

const DEFAULT_LANGUAGE: Language = 'en';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'el', 'de', 'fr'];

export function useLocalization() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // This effect runs once on mount to initialize language from localStorage
    let initialLanguage = DEFAULT_LANGUAGE;
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('appLanguage') as Language | null;
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        initialLanguage = storedLang;
      } else {
        // If no valid language is stored, set default and save it
        localStorage.setItem('appLanguage', DEFAULT_LANGUAGE);
      }
    }
    // Set state only if it's different from the current initial state to avoid unnecessary re-renders
    if (language !== initialLanguage) {
        setLanguageState(initialLanguage);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const setAppLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined' && SUPPORTED_LANGUAGES.includes(lang)) {
      localStorage.setItem('appLanguage', lang);
    }
    setLanguageState(lang); // Update React state to trigger re-renders
    // Reload removed for smoother SPA-like experience
  }, []); // Empty dependency array as this callback doesn't depend on other hook values

  const t = useCallback(
    (translations: { [key in Language]?: string } | string, fallback?: string): string => {
      if (typeof translations === 'string') {
        return translations;
      }
      
      return translations[language] || translations[DEFAULT_LANGUAGE] || fallback || 'Translation N/A';
    },
    [language] // t function updates if language state changes
  );

  return { language, setAppLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES };
}


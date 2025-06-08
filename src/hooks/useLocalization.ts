
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';

const DEFAULT_LANGUAGE: Language = 'en';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'el', 'de', 'fr'];

export function useLocalization() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const storedLang = localStorage.getItem('appLanguage') as Language | null;
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      if (language !== storedLang) {
          setLanguageState(storedLang);
      }
    } else {
      localStorage.setItem('appLanguage', DEFAULT_LANGUAGE);
      if (language !== DEFAULT_LANGUAGE) {
           setLanguageState(DEFAULT_LANGUAGE);
      }
    }
  }, []); // language dependency removed to prevent potential loops if default is set multiple times.

  const setAppLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined' && SUPPORTED_LANGUAGES.includes(lang)) {
      localStorage.setItem('appLanguage', lang);
    }
    setLanguageState(lang);
    // Keeping the reload as it was in previous version of Header.tsx for broader effect
    setTimeout(() => window.location.reload(), 100); // Reduced timeout slightly
  }, []);

  const t = useCallback(
    (translations: { [key in Language]?: string } | string, fallback?: string): string => {
      if (typeof translations === 'string') {
        return translations;
      }
      
      return translations[language] || translations[DEFAULT_LANGUAGE] || fallback || 'Translation N/A';
    },
    [language]
  );

  return { language, setAppLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES };
}

"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';

const DEFAULT_LANGUAGE: Language = 'en';

// Helper to get language from localStorage safely
const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  const storedLang = localStorage.getItem('appLanguage') as Language | null;
  if (storedLang && (storedLang === 'en' || storedLang === 'el')) {
    return storedLang;
  }
  return DEFAULT_LANGUAGE;
};

export function useLocalization() {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    const currentStoredLang = getStoredLanguage();
    if (language !== currentStoredLang) {
      setLanguageState(currentStoredLang);
    }
    // Ensure localStorage is set if it wasn't or was invalid
    if (typeof window !== 'undefined' && localStorage.getItem('appLanguage') !== currentStoredLang) {
      localStorage.setItem('appLanguage', currentStoredLang);
    }
  }, [language]); // Re-run if language state changes elsewhere, e.g. another tab

  const setAppLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', lang);
    }
    setLanguageState(lang);
    // Forcing a reload can be disruptive; better to rely on state updates.
    // If components don't update, a context or event bus might be needed for global refresh.
    // window.location.reload(); 
  }, []);

  const t = useCallback(
    (translations: { [key in Language]?: string } | string, fallback?: string): string => {
      if (typeof translations === 'string') { // Simple key-based translation (future enhancement)
        // Example: t('greeting') -> load from a translation file
        // For now, this mode is not fully supported, use object mode
        return translations; // Return key as is
      }
      // Object mode: t({ en: 'Hello', el: 'Γεια' }, 'Default Greeting')
      return translations[language] || translations[DEFAULT_LANGUAGE] || fallback || 'Translation N/A';
    },
    [language]
  );

  return { language, setAppLanguage, t };
}

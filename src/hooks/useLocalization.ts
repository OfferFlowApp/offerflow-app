"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';

const DEFAULT_LANGUAGE: Language = 'en';

export function useLocalization() {
  // Initialize with DEFAULT_LANGUAGE to ensure server and client match on first render.
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  // This state helps to know when the actual language from localStorage has been applied.
  // const [isClientLangApplied, setIsClientLangApplied] = useState(false); // Currently unused, but can be useful for loading states

  useEffect(() => {
    // This effect runs only on the client, after hydration.
    const storedLang = localStorage.getItem('appLanguage') as Language | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'el')) {
      if (language !== storedLang) { // Only update if different from initial (DEFAULT_LANGUAGE)
          setLanguageState(storedLang);
      }
    } else {
      // If no valid language in localStorage, ensure it's set to DEFAULT_LANGUAGE.
      localStorage.setItem('appLanguage', DEFAULT_LANGUAGE);
      // If language state was somehow not DEFAULT_LANGUAGE (e.g. future bug), reset it.
      if (language !== DEFAULT_LANGUAGE) {
           setLanguageState(DEFAULT_LANGUAGE);
      }
    }
    // setIsClientLangApplied(true); // Mark that client-side check is done.
  }, []); // Empty dependency array: run once on mount after initial render.

  const setAppLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', lang);
    }
    setLanguageState(lang);
    // Keeping the reload as it was in previous version of Header.tsx
    setTimeout(() => window.location.reload(), 300);
  }, []);

  const t = useCallback(
    (translations: { [key in Language]?: string } | string, fallback?: string): string => {
      // On the server, `language` is `DEFAULT_LANGUAGE`.
      // On the client, initial render: `language` is `DEFAULT_LANGUAGE`.
      // On the client, after useEffect: `language` is `localStorage` value or `DEFAULT_LANGUAGE`.
      // This ensures consistency.
      if (typeof translations === 'string') {
        return translations;
      }
      
      return translations[language] || translations[DEFAULT_LANGUAGE] || fallback || 'Translation N/A';
    },
    [language]
  );

  return { language, setAppLanguage, t };
}


"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/lib/types';

const DEFAULT_THEME: Theme = 'light';
const THEME_STORAGE_KEY = 'appTheme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    let initialTheme: Theme;
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      initialTheme = storedTheme && (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : DEFAULT_THEME;
    } else {
      // Default for server-side or when window is not available (should not happen in useEffect)
      initialTheme = DEFAULT_THEME;
    }
    
    setThemeState(initialTheme);
    
    // Apply theme to documentElement if on client
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}

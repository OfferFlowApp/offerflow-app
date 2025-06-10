
"use client";

import React from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Removed Image import
import { Separator } from '@/components/ui/separator';
import { useLocalization } from '@/hooks/useLocalization';
import type { Language } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
];

export default function Header() {
  const { language, setAppLanguage, t } = useLocalization();
  const { loading: authLoading } = useAuth(); // currentUser will be null, logOut is a no-op
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setAppLanguage(value as Language);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          {/* Replaced Image with text */}
          <span className="text-2xl font-bold text-primary">Giorgaras Furniture</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            {t({ en: 'Home', el: 'Αρχική', de: 'Startseite', fr: 'Accueil' })}
          </Link>
          <Link href="/offer-sheet/edit" className="transition-colors hover:text-primary">
            {t({ en: 'Create Offer', el: 'Δημιουργία', de: 'Angebot Erstellen', fr: 'Créer Offre' })}
          </Link>
          <Link href="/settings" className="transition-colors hover:text-primary">
            {t({ en: 'Settings', el: 'Ρυθμίσεις', de: 'Einstellungen', fr: 'Paramètres' })}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-auto h-9 px-3 text-sm">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t({ en: "Language", el: "Γλώσσα", de: "Sprache", fr: "Langue"})} />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {authLoading ? (
            <div className="h-8 w-24 bg-muted rounded-md animate-pulse"></div>
          ) : (
            <>
              {/* Profile button always visible, links to local profile */}
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} aria-label={t({en: "Local Profile", el: "Τοπικό Προφίλ", de: "Lokales Profil", fr: "Profil Local"})}>
                  <UserCircle className="h-5 w-5" />
              </Button>
              {/* Login and Signup buttons are removed as Firebase auth is disabled */}
            </>
          )}
        </div>
      </div>
      <Separator />
    </header>
  );
}

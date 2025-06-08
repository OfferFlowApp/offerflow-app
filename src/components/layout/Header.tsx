
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { Languages, LogIn, LogOut, UserCircle } from 'lucide-react';
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
  const { currentUser, logOut, loading } = useAuth();
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setAppLanguage(value as Language);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          <Image src="/offerflow-logo.png" alt="OfferFlow Logo" width={144} height={36} priority data-ai-hint="app logo"/>
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

          {loading ? (
            <div className="h-8 w-24 bg-muted rounded-md animate-pulse"></div> // Skeleton loader
          ) : (
            <>
              {currentUser ? (
                <>
                  <span className="text-sm text-muted-foreground hidden md:inline whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]" title={currentUser.email || ''}>
                    {currentUser.email}
                  </span>
                   <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} aria-label={t({en: "User Profile", el: "Προφίλ Χρήστη"})}>
                     <UserCircle className="h-5 w-5" />
                   </Button>
                  <Button variant="outline" size="sm" onClick={logOut}>
                    <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t({ en: 'Logout', el: 'Αποσύνδεση', de: 'Abmelden', fr: 'Déconnexion' })}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" passHref>
                    <Button variant="outline" size="sm">
                      <LogIn className="mr-0 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t({ en: 'Login', el: 'Σύνδεση', de: 'Anmelden', fr: 'Connexion' })}</span>
                    </Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                       <span className="hidden sm:inline">{t({ en: 'Sign Up', el: 'Εγγραφή', de: 'Registrieren', fr: 'S\'inscrire' })}</span>
                       <span className="sm:hidden"><UserCircle className="h-4 w-4" /></span>
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Separator />
    </header>
  );
}

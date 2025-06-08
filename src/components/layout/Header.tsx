
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, HomeIcon, LogOut, Languages, Sun, Moon, Euro, DollarSign as DollarIcon, PoundSterling } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalization } from '@/hooks/useLocalization';
import { useTheme } from '@/hooks/useTheme';
import type { Language, Currency, SettingsData } from '@/lib/types';

const languageDisplayNames: Record<Language, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  fr: 'Français',
};

const currencyMetadataHeader: Record<Currency, { IconComponent: React.ElementType, labelKey: { [key in Language]?: string } | string }> = {
  EUR: { IconComponent: Euro, labelKey: { en: 'Euro', el: 'Ευρώ', de: 'Euro', fr: 'Euro' } },
  USD: { IconComponent: DollarIcon, labelKey: { en: 'US Dollar', el: 'Δολάριο ΗΠΑ', de: 'US-Dollar', fr: 'Dollar américain' } },
  GBP: { IconComponent: PoundSterling, labelKey: { en: 'British Pound', el: 'Λίρα Αγγλίας', de: 'Britisches Pfund', fr: 'Livre sterling' } },
};
const SUPPORTED_CURRENCIES_HEADER: Currency[] = ['EUR', 'USD', 'GBP'];
const BASE_DEFAULT_CURRENCY_HEADER: Currency = 'EUR';


export default function Header() {
  const { language, setAppLanguage, t, supportedLanguages } = useLocalization();
  const { theme, toggleTheme } = useTheme();
  
  const [currentDefaultCurrency, setCurrentDefaultCurrency] = useState<Currency>(BASE_DEFAULT_CURRENCY_HEADER);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedSettings = localStorage.getItem('offerSheetSettings');
      let currencyToSet = BASE_DEFAULT_CURRENCY_HEADER;
      if (savedSettings) {
        try {
          const parsedSettings: SettingsData = JSON.parse(savedSettings);
          if (parsedSettings.defaultCurrency && SUPPORTED_CURRENCIES_HEADER.includes(parsedSettings.defaultCurrency)) {
            currencyToSet = parsedSettings.defaultCurrency;
          }
        } catch (e) {
          console.error("Failed to parse settings for currency in header (useEffect):", e);
        }
      }
      if (currentDefaultCurrency !== currencyToSet) {
        setCurrentDefaultCurrency(currencyToSet);
      }

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'offerSheetSettings') {
          const newSavedSettings = localStorage.getItem('offerSheetSettings');
          let newCurrencyToSet = BASE_DEFAULT_CURRENCY_HEADER;
           if (newSavedSettings) {
            try {
              const parsedNewSettings: SettingsData = JSON.parse(newSavedSettings);
              if (parsedNewSettings.defaultCurrency && SUPPORTED_CURRENCIES_HEADER.includes(parsedNewSettings.defaultCurrency)) {
                newCurrencyToSet = parsedNewSettings.defaultCurrency;
              }
            } catch (e) {
              console.error("Failed to parse settings on storage event:", e);
            }
          }
          if (currentDefaultCurrency !== newCurrencyToSet) {
            setCurrentDefaultCurrency(newCurrencyToSet);
          }
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]); // currentDefaultCurrency removed from deps, it is set within.

  const handleLanguageChange = (lang: Language) => {
    setAppLanguage(lang);
  };

  const handleDefaultCurrencyChange = (newCurrency: Currency) => {
    if (isClient) {
      const savedSettings = localStorage.getItem('offerSheetSettings');
      let currentSettings: SettingsData = {};
      if (savedSettings) {
        try {
          currentSettings = JSON.parse(savedSettings);
        } catch (e) { 
          console.error("Failed to parse settings during currency change in header:", e);
          currentSettings = {}; // Reset if parsing fails
        }
      }
      const settingsToSave: SettingsData = { ...currentSettings, defaultCurrency: newCurrency };
      localStorage.setItem('offerSheetSettings', JSON.stringify(settingsToSave));
      setCurrentDefaultCurrency(newCurrency);
    }
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
            {t({ en: 'Create Offer', el: 'Δημιουργία Προσφοράς', de: 'Angebot Erstellen', fr: 'Créer une Offre' })}
          </Link>
          <Link href="/settings" className="transition-colors hover:text-primary">
            {t({ en: 'Settings', el: 'Ρυθμίσεις', de: 'Einstellungen', fr: 'Paramètres' })}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8" aria-label={t({en: 'Toggle theme', el: 'Εναλλαγή θέματος'})}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t({en: 'Change currency', el: 'Αλλαγή νομίσματος'})}>
                   {isClient && React.createElement(currencyMetadataHeader[currentDefaultCurrency]?.IconComponent || Euro, { className: "h-5 w-5" })}
                   {!isClient && <Euro className="h-5 w-5" /> }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t({ en: 'Default Currency', el: 'Προεπιλεγμένο Νόμισμα', de: 'Standardwährung', fr: 'Devise par Défaut' })}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SUPPORTED_CURRENCIES_HEADER.map(curr => (
                  <DropdownMenuItem 
                    key={curr} 
                    onSelect={() => handleDefaultCurrencyChange(curr)} 
                    disabled={currentDefaultCurrency === curr && isClient}
                    className="flex items-center"
                  >
                    <currencyMetadataHeader[curr].IconComponent className="h-4 w-4 mr-2" />
                    {t(currencyMetadataHeader[curr].labelKey)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t({en: 'Change language', el: 'Αλλαγή γλώσσας'})}>
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t({ en: 'Language', el: 'Γλώσσα', de: 'Sprache', fr: 'Langue' })}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {supportedLanguages.map(lang => (
                   <DropdownMenuItem key={lang} onSelect={() => handleLanguageChange(lang)} disabled={language === lang}>
                     {languageDisplayNames[lang]}
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar"/>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john.doe@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>{t({ en: 'Dashboard', el: 'Ταμπλό', de: 'Dashboard', fr: 'Tableau de bord' })}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t({ en: 'Settings', el: 'Ρυθμίσεις', de: 'Einstellungen', fr: 'Paramètres' })}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t({ en: 'Log out', el: 'Αποσύνδεση', de: 'Abmelden', fr: 'Déconnexion' })}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </div>
      <Separator />
    </header>
  );
}

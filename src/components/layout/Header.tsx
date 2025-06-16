
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useLocalization } from '@/hooks/useLocalization';
import type { Language, SettingsData, SellerInfo } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, UserCircle, LogIn, UserPlus, Settings, FileText, CreditCard, HelpCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'el', label: 'Ελληνικά' },
];

export default function Header() {
  const { language, setAppLanguage, t } = useLocalization();
  const { currentUser, loading: authLoading, logOut } = useAuth();
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [isLoadingLogo, setIsLoadingLogo] = useState(true);

  useEffect(() => {
    setIsLoadingLogo(true);
    if (typeof window !== 'undefined') {
      const savedSettingsRaw = localStorage.getItem('offerSheetSettings');
      if (savedSettingsRaw) {
        try {
          const parsedSettings: SettingsData = JSON.parse(savedSettingsRaw);
          let url: string | undefined = undefined;
          if (parsedSettings.defaultSellerInfo && parsedSettings.defaultSellerInfo.logoUrl) {
            url = parsedSettings.defaultSellerInfo.logoUrl;
          } else if (parsedSettings.defaultLogoUrl) { // Legacy support for older settings structure
            url = parsedSettings.defaultLogoUrl;
          }
          setLogoUrl(url);
        } catch (e) {
          console.error("Failed to parse settings for header logo:", e);
          setLogoUrl(undefined);
        }
      }
    }
    setIsLoadingLogo(false);
  }, []);

  const handleLanguageChange = (value: string) => {
    setAppLanguage(value as Language);
  };

  const handleLogout = async () => {
    await logOut();
    router.push('/'); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          {isLoadingLogo ? (
            <span className="text-2xl font-bold text-primary animate-pulse">OfferSheet</span>
          ) : logoUrl ? (
            <Image 
              src={logoUrl} 
              alt={t({ en: 'Application Logo', el: 'Λογότυπο Εφαρμογής' })} 
              width={120} // Provide a base width for aspect ratio
              height={40} // Provide a base height for aspect ratio
              className="h-10 w-auto max-w-[150px] object-contain" // CSS controls final size
              data-ai-hint="company brand"
            />
          ) : (
            <span className="text-2xl font-bold text-primary">OfferSheet</span>
          )}
        </Link>
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary flex items-center">
            <Home className="mr-1 h-4 w-4" /> {/* Changed Icon for Home */}
            {t({ en: 'Home', el: 'Αρχική' })}
          </Link>
          <Link href="/offer-sheet/edit" className="transition-colors hover:text-primary flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            {t({ en: 'Create Offer', el: 'Δημιουργία' })}
          </Link>
           <Link href="/pricing" className="transition-colors hover:text-primary flex items-center">
            <CreditCard className="mr-1 h-4 w-4" />
            {t({ en: 'Pricing', el: 'Τιμολόγηση' })}
          </Link>
          <Link href="/settings" className="transition-colors hover:text-primary flex items-center">
            <Settings className="mr-1 h-4 w-4" />
            {t({ en: 'Settings', el: 'Ρυθμίσεις' })}
          </Link>
          <Link href="/help" className="transition-colors hover:text-primary flex items-center">
            <HelpCircle className="mr-1 h-4 w-4" />
            {t({ en: 'Help', el: 'Βοήθεια' })}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-auto h-9 px-3 text-sm">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t({ en: "Language", el: "Γλώσσα"})} />
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
          ) : currentUser ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} aria-label={t({en: "Profile", el: "Προφίλ"})}>
                  <UserCircle className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {t({ en: 'Logout', el: 'Αποσύνδεση' })}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                {t({ en: 'Login', el: 'Σύνδεση' })}
              </Button>
              <Button variant="default" size="sm" onClick={() => router.push('/signup')}>
                <UserPlus className="mr-2 h-4 w-4" />
                {t({ en: 'Sign Up', el: 'Εγγραφή' })}
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator />
    </header>
  );
}

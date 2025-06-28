
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useLocalization } from '@/hooks/useLocalization';
import type { Language, SettingsData } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, UserCircle, LogIn, UserPlus, Settings, FileText, CreditCard, HelpCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'el', label: 'Ελληνικά' },
];

export default function Header() {
  const { language, setAppLanguage, t } = useLocalization();
  const { currentUser, currentEntitlements, loading: authLoading, logOut } = useAuth();
  const router = useRouter();
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentEntitlements.canReplaceHeaderLogo) {
      const savedSettingsRaw = localStorage.getItem('offerSheetSettings');
      if (savedSettingsRaw) {
        try {
          const parsedSettings: SettingsData = JSON.parse(savedSettingsRaw);
          const logo = parsedSettings.defaultSellerInfo?.logoUrl;
          setHeaderLogoUrl(logo);
        } catch (e) {
          setHeaderLogoUrl(undefined);
        }
      }
    } else {
        setHeaderLogoUrl(undefined);
    }
  }, [currentEntitlements, currentUser]); // Rerun when entitlements or user change

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
        <div className="flex items-center gap-1 mr-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label={t({en: "Go back", el: "Πίσω"})}>
              <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.forward()} aria-label={t({en: "Go forward", el: "Μπροστά"})}>
              <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mr-8 flex items-center">
          {currentEntitlements.canReplaceHeaderLogo && headerLogoUrl ? (
            <Link href="/">
              <Image src={headerLogoUrl} alt={t({en: "Company Logo", el: "Λογότυπο Εταιρείας"})} width={120} height={40} className="max-h-10 object-contain" data-ai-hint="company brand" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-primary">Offer</span><span className="text-accent">Flow</span>
              </span>
            </Link>
          )}
        </div>

        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/offer-sheet/edit" className="transition-colors hover:text-primary flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            {t({ en: 'Create Offer', el: 'Δημιουργία' })}
          </Link>
           <Link href="/pricing" className="transition-colors hover:text-primary flex items-center">
            <CreditCard className="mr-1 h-4 w-4" />
            {t({ en: 'Pricing', el: 'Τιμολόγηση' })}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
           <Button asChild variant="ghost" size="icon">
             <Link href="/settings" aria-label={t({ en: 'Settings', el: 'Ρυθμίσεις' })}>
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="/help" aria-label={t({ en: 'Help', el: 'Βοήθεια' })}>
              <HelpCircle className="h-5 w-5" />
            </Link>
          </Button>
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


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
import { Languages, UserCircle, LogIn, UserPlus } from 'lucide-react';
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

  const handleLanguageChange = (value: string) => {
    setAppLanguage(value as Language);
  };

  const handleLogout = async () => {
    await logOut();
    router.push('/'); // Redirect to homepage after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          <span className="text-2xl font-bold text-primary">Giorgaras Furniture</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            {t({ en: 'Home', el: 'Αρχική' })}
          </Link>
          <Link href="/offer-sheet/edit" className="transition-colors hover:text-primary">
            {t({ en: 'Create Offer', el: 'Δημιουργία' })}
          </Link>
          <Link href="/settings" className="transition-colors hover:text-primary">
            {t({ en: 'Settings', el: 'Ρυθμίσεις' })}
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

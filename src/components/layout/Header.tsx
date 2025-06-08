
"use client"; // Required for the hook

import Link from 'next/link';
import Image from 'next/image';
import { FileText, Settings, HomeIcon, LogOut, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalization } from '@/hooks/useLocalization';
import type { Language } from '@/lib/types';


export default function Header() {
  const { language, setAppLanguage, t } = useLocalization();

  const handleLanguageChange = (lang: Language) => {
    setAppLanguage(lang);
    // Optional: reload if state changes aren't propagating correctly for all text
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          {/* Ensure you have 'offerflow-logo.png' in your /public directory */}
          <Image src="/offerflow-logo.png" alt="OfferFlow Logo" width={144} height={36} priority />
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            {t({ en: 'Home', el: 'Αρχική' })}
          </Link>
          <Link href="/offer-sheet/edit" className="transition-colors hover:text-primary">
            {t({ en: 'Create Offer', el: 'Δημιουργία Προσφοράς' })}
          </Link>
          <Link href="/settings" className="transition-colors hover:text-primary">
            {t({ en: 'Settings', el: 'Ρυθμίσεις' })}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t({ en: 'Language', el: 'Γλώσσα' })}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleLanguageChange('en')} disabled={language === 'en'}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleLanguageChange('el')} disabled={language === 'el'}>
                  Ελληνικά
                </DropdownMenuItem>
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
                    <span>{t({ en: 'Dashboard', el: 'Ταμπλό' })}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t({ en: 'Settings', el: 'Ρυθμίσεις' })}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t({ en: 'Log out', el: 'Αποσύνδεση' })}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </div>
      <Separator />
    </header>
  );
}

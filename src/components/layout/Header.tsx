
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
// Removed many imports related to dropdowns, icons, hooks for simplification

export default function Header() {
  // All complex state, effects, and custom hook calls have been removed.

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          {/* Make sure offerflow-logo.png is in your /public folder */}
          <Image src="/offerflow-logo.png" alt="OfferFlow Logo" width={144} height={36} priority data-ai-hint="app logo"/>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/offer-sheet/edit" className="transition-colors hover:text-primary">
            Create Offer
          </Link>
          <Link href="/settings" className="transition-colors hover:text-primary">
            Settings
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* All interactive elements like theme toggle, language/currency switchers, and user menu are removed for now. */}
          <span className="text-sm text-muted-foreground">(Simplified Header)</span>
        </div>
      </div>
      <Separator />
    </header>
  );
}

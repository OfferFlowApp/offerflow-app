
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListChecks, ChevronRight, Palette, ClipboardList, Share2, User, Briefcase } from 'lucide-react'; 
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useLocalization } from '@/hooks/useLocalization';
import { useState, useEffect, useMemo } from 'react';
import type { OfferSheetData } from '@/lib/types';

const OFFER_SHEET_STORAGE_PREFIX = 'offerSheet-';

interface DisplayOfferInfo {
  id: string; // Timestamp from localStorage key
  customerName: string;
  customerCompany?: string;
  customerContact?: string;
  formattedDate: string;
  offerSheetName: string; // Derived name for the offer
}

export default function HomePage() {
  const { t, language } = useLocalization(); 
  const [recentOffers, setRecentOffers] = useState<DisplayOfferInfo[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedOffers: DisplayOfferInfo[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(OFFER_SHEET_STORAGE_PREFIX)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const offerData: OfferSheetData = JSON.parse(item);
              const timestampStr = key.substring(OFFER_SHEET_STORAGE_PREFIX.length);
              const timestamp = parseInt(timestampStr, 10);

              if (!isNaN(timestamp)) {
                const date = new Date(timestamp);
                const offerSheetName = offerData.customerInfo.name || offerData.customerInfo.company || t({en: "Unnamed Offer", el: "Ανώνυμη Προσφορά"});
                
                loadedOffers.push({
                  id: timestampStr,
                  customerName: offerData.customerInfo.name,
                  customerCompany: offerData.customerInfo.company,
                  customerContact: offerData.customerInfo.contact,
                  formattedDate: date.toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                  offerSheetName: offerSheetName,
                });
              }
            }
          } catch (e) {
            console.error("Failed to parse offer sheet from localStorage:", key, e);
          }
        }
      }
      // Sort by most recent first
      loadedOffers.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
      setRecentOffers(loadedOffers.slice(0, 5)); // Show latest 5, for example
    }
  }, [language, t]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            {t({ en: 'Your Offer Sheets', el: 'Οι Προσφορές Σας' })}
          </h1>
          <Link href="/offer-sheet/edit" className="block max-w-2xl mx-auto">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-lg rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-6 w-6" />
              {t({ en: 'Create New Offer Sheet', el: 'Δημιουργία Νέου Δελτίου Προσφοράς' })}
            </Button>
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 text-center text-muted-foreground">
            {t({ en: 'Recent Offer Sheets', el: 'Πρόσφατες Προσφορές' })}
          </h2>
          {recentOffers.length > 0 ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {recentOffers.map((offer) => (
                <Link href={`/offer-sheet/edit?id=${offer.id}`} key={offer.id} className="block">
                  <Card className="hover:shadow-lg transition-shadow duration-300 group bg-card rounded-xl border">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex-grow overflow-hidden">
                        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors truncate" title={offer.offerSheetName}>
                          {offer.offerSheetName}
                        </h3>
                        {offer.customerCompany && offer.customerCompany !== offer.customerName && (
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 shrink-0" />
                            <span className="truncate" title={offer.customerCompany}>{offer.customerCompany}</span>
                          </p>
                        )}
                         {!offer.customerCompany && offer.customerName && (
                            <p className="text-sm text-muted-foreground flex items-center">
                                <User className="h-4 w-4 mr-2 shrink-0" />
                                <span className="truncate" title={offer.customerName}>{offer.customerName}</span>
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {t({ en: 'Created on', el: 'Δημιουργήθηκε στις' })}{' '}
                          {offer.formattedDate}
                        </p>
                      </div>
                      <Button
                        variant="default"
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 shrink-0 shadow ml-4"
                        aria-label={t({ en: 'Open offer', el: 'Άνοιγμα προσφοράς' })}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 max-w-2xl mx-auto rounded-xl border bg-card">
              <CardHeader className="pb-4">
                <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="font-headline text-2xl">
                  {t({ en: 'No Recent Offer Sheets', el: 'Καμία Πρόσφατη Προσφορά' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Start by creating a new offer sheet above.', el: 'Ξεκινήστε δημιουργώντας ένα νέο δελτίο προσφοράς παραπάνω.' })}</p>
              </CardContent>
            </Card>
          )}
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center font-headline">{t({ en: 'Key Features', el: 'Βασικά Χαρακτηριστικά' })}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-flex items-center justify-center mb-4 w-12 h-12">
                   <Palette className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{t({ en: 'Custom Branding', el: 'Προσαρμοσμένη Επωνυμία' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Easily upload your company logo to personalize every offer sheet.', el: 'Ανεβάστε εύκολα το λογότυπο της εταιρείας σας για να εξατομικεύσετε κάθε δελτίο προσφοράς.' })}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-flex items-center justify-center mb-4 w-12 h-12">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{t({ en: 'Dynamic Product Lists', el: 'Δυναμικές Λίστες Προϊόντων' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Add multiple products with details, images, and pricing effortlessly.', el: 'Προσθέστε πολλαπλά προϊόντα με λεπτομέρειες, εικόνες και τιμολόγηση χωρίς κόπο.' })}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-flex items-center justify-center mb-4 w-12 h-12">
                 <Share2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{t({ en: 'Export & Share', el: 'Εξαγωγή & Κοινοποίηση' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Generate professional PDFs and share your offers with clients in moments.', el: 'Δημιουργήστε επαγγελματικά PDF και μοιραστείτε τις προσφορές σας με πελάτες σε στιγμές.' })}</p>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

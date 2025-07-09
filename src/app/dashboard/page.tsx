
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListChecks, ChevronRight, Briefcase, User, Cloud, ShieldAlert } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { useState, useEffect } from 'react';
import type { OfferSheetData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

interface DisplayOfferInfo {
  id: string;
  customerName: string;
  customerCompany?: string;
  customerContact?: string;
  formattedDate: string;
  offerSheetName: string;
  isCloud?: boolean;
}

export default function DashboardPage() {
  const { t, language } = useLocalization();
  const { currentUser, userSubscription, currentEntitlements, loading: authLoading, refreshSubscription } = useAuth();
  const router = useRouter();

  const [cloudRecentOffers, setCloudRecentOffers] = useState<DisplayOfferInfo[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    
    if (currentUser) {
      refreshSubscription();
    }
  }, [currentUser, authLoading, router, refreshSubscription]);


  // Effect for loading cloud offers (only for logged-in users)
  useEffect(() => {
    if (currentUser) {
      setIsLoadingOffers(true);
      const fetchCloudOffers = async () => {
        try {
          const token = await currentUser.getIdToken();
          const response = await fetch('/api/offer-sheets', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch cloud offers');

          const offers: any[] = await response.json();
          const formattedOffers: DisplayOfferInfo[] = offers.map(offer => ({
            id: offer.id,
            customerName: offer.customerInfo.name,
            customerCompany: offer.customerInfo.company,
            customerContact: offer.customerInfo.contact,
            formattedDate: format(new Date(offer.lastSaved), 'PPP'),
            offerSheetName: offer.customerInfo.name || offer.customerInfo.company || t({en: "Unnamed Offer", el: "Ανώνυμη Προσφορά"}),
            isCloud: true,
          }));
          setCloudRecentOffers(formattedOffers);
        } catch (error) {
          console.error("Error fetching cloud offers:", error);
          setCloudRecentOffers([]);
        } finally {
          setIsLoadingOffers(false);
        }
      };
      fetchCloudOffers();
    } else {
      setCloudRecentOffers([]); // Clear cloud offers on logout
      setIsLoadingOffers(false);
    }
  }, [currentUser, language, t]);

  const handleCreateNewOffer = () => {
    const offerCount = userSubscription?.offersCreatedThisPeriod || 0;
    if (currentEntitlements.maxOfferSheetsPerMonth !== 'unlimited' && offerCount >= currentEntitlements.maxOfferSheetsPerMonth) {
       setUpgradeReason(t({en:"You've reached your monthly limit. Please upgrade your plan for unlimited offers.", el:"Έχετε φτάσει το μηνιαίο όριο. Παρακαλώ αναβαθμίστε το πρόγραμμά σας."}));
      setShowUpgradeModal(true);
      return;
    }
    router.push('/offer-sheet/edit');
  };

  if (authLoading || !currentUser) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                <LoadingSpinner className="h-12 w-12" />
            </main>
            <Footer />
        </div>
    );
  }


  return (
    <>
    {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                        <ShieldAlert className="mr-2 h-6 w-6" />
                        {t({en: "Upgrade Required", el: "Απαιτείται Αναβάθμιση"})}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{upgradeReason}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>{t({en: "Close", el: "Κλείσιμο"})}</Button>
                    <Button onClick={() => { setShowUpgradeModal(false); router.push('/pricing'); }} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {t({en: "View Plans", el: "Δείτε τα Πλάνα"})}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )}
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            {t({ en: 'Your Offer Sheets', el: 'Οι Προσφορές Σας' })}
          </h1>
          
          <Button size="lg" onClick={handleCreateNewOffer} className="w-full max-w-2xl mx-auto bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-lg rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="mr-2 h-6 w-6" />
            {t({ en: 'Create New Offer Sheet', el: 'Δημιουργία Νέου Δελτίου Προσφοράς' })}
          </Button>
          
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 text-center text-muted-foreground">
            {t({ en: 'Recent Offer Sheets', el: 'Πρόσφατες Προσφορές' })}
          </h2>
          {isLoadingOffers ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-card rounded-xl border">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex-grow overflow-hidden space-y-2 pr-4">
                      <Skeleton className="h-6 w-3/4" /> 
                      <Skeleton className="h-4 w-1/2" /> 
                      <Skeleton className="h-4 w-1/3" /> 
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" /> 
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cloudRecentOffers.length > 0 ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {cloudRecentOffers.map((offer) => (
                <Link href={`/offer-sheet/edit?id=${offer.id}`} key={offer.id} className="block">
                  <Card className="hover:shadow-lg transition-shadow duration-300 group bg-card rounded-xl border">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex-grow overflow-hidden">
                        <div className="flex items-center gap-2">
                           {offer.isCloud && <Cloud className="h-4 w-4 text-blue-400 shrink-0" title={t({en: 'Saved in Cloud', el: 'Αποθηκευμένο στο Cloud'})} />}
                           <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors truncate" title={offer.offerSheetName}>
                              {offer.offerSheetName}
                           </h3>
                        </div>
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
                          {t({ en: 'Saved on', el: 'Αποθηκεύτηκε στις' })}{' '}
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
                <p className="text-sm text-muted-foreground mt-2">{t({ en: 'Your saved offers will appear here.', el: 'Οι αποθηκευμένες προσφορές σας θα εμφανιστούν εδώ.' })}</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
}

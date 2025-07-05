
"use client";

import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { Skeleton } from '@/components/ui/skeleton';

const OfferSheetForm = dynamic(() => import('@/components/offer-sheet/OfferSheetForm'), {
  ssr: false, 
  loading: () => <OfferSheetFormSkeleton />,
});

const OfferSheetFormSkeleton = () => (
  <div className="space-y-8 p-4 md:p-6 max-w-4xl mx-auto bg-card rounded-xl shadow-2xl border">
    {[...Array(3)].map((_, i) => (
      <div className="space-y-6" key={i}>
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    ))}
    <div className="flex justify-end pt-6 border-t mt-8">
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);


export default function EditOfferSheetPage() {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-2 py-8">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
          {t({ en: 'Create / Edit Offer Sheet', el: 'Δημιουργία / Επεξεργασία Δελτίου Προσφοράς' })}
        </h1>
        <OfferSheetForm />
      </main>
      <Footer />
    </div>
  );
}

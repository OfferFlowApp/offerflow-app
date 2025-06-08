"use client"; // Required for the hook

import OfferSheetForm from '@/components/offer-sheet/OfferSheetForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLocalization } from '@/hooks/useLocalization';

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

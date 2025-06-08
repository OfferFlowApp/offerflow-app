import OfferSheetForm from '@/components/offer-sheet/OfferSheetForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function EditOfferSheetPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-2 py-8">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
          Create / Edit Offer Sheet
        </h1>
        <OfferSheetForm />
      </main>
      <Footer />
    </div>
  );
}

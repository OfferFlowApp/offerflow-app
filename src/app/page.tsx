"use client"; // Required for the hook

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListChecks, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useLocalization } from '@/hooks/useLocalization';

export default function HomePage() {
  const { t } = useLocalization();

  const lastProjects = [
    { id: 'proj1', name: t({ en: 'Q4 Tech Sale Proposal', el: 'Πρόταση Πώλησης Τεχνολογίας Q4' }), date: '2023-10-15' },
    { id: 'proj2', name: t({ en: 'Spring Marketing Offer', el: 'Ανοιξιάτικη Προσφορά Μάρκετινγκ' }), date: '2023-09-28' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 font-headline text-primary">{t({ en: 'Welcome to OfferSheet', el: 'Καλώς ήρθατε στο OfferSheet' })}</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t({ 
              en: 'Streamline your sales process with professional, easy-to-create offer sheets. Upload your logo, add products, set terms, and impress your clients.', 
              el: 'Βελτιστοποιήστε τη διαδικασία πωλήσεών σας με επαγγελματικά, εύκολα στη δημιουργία δελτία προσφορών. Ανεβάστε το λογότυπό σας, προσθέστε προϊόντα, ορίστε όρους και εντυπωσιάστε τους πελάτες σας.' 
            })}
          </p>
          <Link href="/offer-sheet/edit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t({ en: 'Create New Offer Sheet', el: 'Δημιουργία Νέου Δελτίου Προσφοράς' })}
            </Button>
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center font-headline">{t({ en: 'Key Features', el: 'Βασικά Χαρακτηριστικά' })}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-4">
                   <Image src="https://placehold.co/48x48.png" alt={t({ en: "Logo Upload Icon", el: "Εικονίδιο Μεταφόρτωσης Λογοτύπου"})} width={48} height={48} data-ai-hint="logo upload" />
                </div>
                <CardTitle className="font-headline">{t({ en: 'Custom Branding', el: 'Προσαρμοσμένη Επωνυμία' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Easily upload your company logo to personalize every offer sheet.', el: 'Ανεβάστε εύκολα το λογότυπο της εταιρείας σας για να εξατομικεύσετε κάθε δελτίο προσφοράς.' })}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-4">
                  <Image src="https://placehold.co/48x48.png" alt={t({ en: "Product List Icon", el: "Εικονίδιο Λίστας Προϊόντων" })} width={48} height={48} data-ai-hint="product list"/>
                </div>
                <CardTitle className="font-headline">{t({ en: 'Dynamic Product Lists', el: 'Δυναμικές Λίστες Προϊόντων' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Add multiple products with details, images, and pricing effortlessly.', el: 'Προσθέστε πολλαπλά προϊόντα με λεπτομέρειες, εικόνες και τιμολόγηση χωρίς κόπο.' })}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-4">
                 <Image src="https://placehold.co/48x48.png" alt={t({ en: "Export Icon", el: "Εικονίδιο Εξαγωγής" })} width={48} height={48} data-ai-hint="export share" />
                </div>
                <CardTitle className="font-headline">{t({ en: 'Export & Share', el: 'Εξαγωγή & Κοινοποίηση' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Generate professional PDFs and share your offers with clients in moments.', el: 'Δημιουργήστε επαγγελματικά PDF και μοιραστείτε τις προσφορές σας με πελάτες σε στιγμές.' })}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center font-headline">{t({ en: 'Your Recent Offer Sheets', el: 'Τα Πρόσφατα Δελτία Προσφορών Σας' })}</h2>
          {lastProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lastProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{project.name}</CardTitle>
                    <CardDescription>{t({ en: 'Last updated:', el: 'Τελευταία ενημέρωση:' })} {project.date}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/offer-sheet/edit?id=${project.id}`}>
                        {t({ en: 'Open Project', el: 'Άνοιγμα Έργου' })} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardHeader>
                <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="font-headline">{t({ en: 'No Recent Projects', el: 'Κανένα Πρόσφατο Έργο' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t({ en: 'Start by creating a new offer sheet.', el: 'Ξεκινήστε δημιουργώντας ένα νέο δελτίο προσφοράς.' })}</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

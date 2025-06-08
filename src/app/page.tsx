
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListChecks, ChevronRight, Palette, ClipboardList, Share2 } from 'lucide-react'; 
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useLocalization } from '@/hooks/useLocalization';
import { useState, useEffect, useMemo } from 'react';

export default function HomePage() {
  const { t, language } = useLocalization(); 

  const lastProjectsStaticData = useMemo(() => [
    { id: 'proj1', nameKey: { en: 'Johnson Property Offer', el: 'Πρόταση Ακινήτου Johnson' }, date: '2023-05-15' },
    { id: 'proj2', nameKey: { en: 'Lakeside Condo Offer', el: 'Πρόταση Διαμερίσματος Lakeside' }, date: '2023-04-28' },
    { id: 'proj3', nameKey: { en: 'Downtown Loft Offer', el: 'Πρόταση Σοφίτας Downtown' }, date: '2023-03-12' },
    { id: 'proj4', nameKey: { en: 'Riverfront Estate Offer', el: 'Πρόταση Κτήματος Riverfront' }, date: '2023-02-05' },
  ], []);

  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    const newFormattedDates: Record<string, string> = {};
    lastProjectsStaticData.forEach(project => {
      newFormattedDates[project.id] = new Date(project.date).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
    setFormattedDates(newFormattedDates);
  }, [language, lastProjectsStaticData]);


  const projectsToDisplay = useMemo(() => {
    return lastProjectsStaticData.map(p => ({
      ...p,
      name: t(p.nameKey),
      formattedDate: formattedDates[p.id] || '...', 
    }));
  }, [lastProjectsStaticData, t, formattedDates]);


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
          {projectsToDisplay.length > 0 ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {projectsToDisplay.map((project) => (
                <Link href={`/offer-sheet/edit?id=${project.id}`} key={project.id} className="block">
                  <Card className="hover:shadow-lg transition-shadow duration-300 group bg-card rounded-xl border">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Created on', el: 'Δημιουργήθηκε στις' })}{' '}
                          {project.formattedDate}
                        </p>
                      </div>
                      <Button
                        variant="default"
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 shrink-0 shadow"
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

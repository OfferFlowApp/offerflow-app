
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart, FileText, Palette } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { t } = useLocalization();
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          {/* You might want to add a loading spinner here */}
        </main>
        <Footer />
      </div>
    );
  }

  if (currentUser) {
    router.replace('/dashboard');
    return null; // or a loading component
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
              <span className="text-primary">{t({ en: "Create Professional Offer Sheets", el: "Δημιουργήστε Επαγγελματικές Προσφορές" })}</span>
              <span className="text-accent">{t({ en: " in Minutes", el: " σε Λεπτά" })}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t({ en: "Stop wrestling with Word and Excel. OfferFlow helps you generate, manage, and share beautiful, error-free offer sheets that win you business.", el: "Σταματήστε να παλεύετε με το Word και το Excel. Το OfferFlow σας βοηθά να δημιουργείτε, να διαχειρίζεστε και να μοιράζεστε όμορφα, χωρίς λάθη δελτία προσφορών που κερδίζουν πελάτες." })}
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link href="/signup">
                {t({ en: "Start Your Free Trial", el: "Ξεκινήστε τη Δωρεάν Δοκιμή σας" })}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Trusted by Section */}
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">
                        {t({en: "Trusted By", el: "Μας Εμπιστεύονται"})}
                    </p>
                    <div className="flex items-center justify-center gap-x-8 sm:gap-x-16 gap-y-4 text-muted-foreground flex-wrap">
                        <svg
                            role="img"
                            aria-label="Giorgaras Furniture Logo"
                            className="h-12 w-auto"
                            viewBox="0 0 250 50"
                            fill="currentColor"
                        >
                            <text x="0" y="20" fontFamily="sans-serif" fontSize="22" fontWeight="bold">GIORGARAS</text>
                            <text x="0" y="40" fontFamily="sans-serif" fontSize="12">FURNITURE</text>
                            <text x="145" y="40" fontFamily="sans-serif" fontSize="10" fontStyle="italic">since 1965</text>
                        </svg>

                         <div className="flex flex-col items-center">
                           <svg 
                                role="img" 
                                aria-label="Rhodes Inc. Logo" 
                                className="h-12 w-12" 
                                viewBox="0 0 100 100" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M50 15 C 80 30, 80 70, 50 85" fill="#00808030"/>
                                    <path d="M50 15 C 20 30, 20 70, 50 85" fill="#4b008230" />
                                    <path d="M50 15 C 80 30, 80 70, 50 85" />
                                    <path d="M50 15 C 20 30, 20 70, 50 85" />
                                    <path d="M40 25 C 70 40, 70 60, 40 75" opacity="0.7"/>
                                    <path d="M60 25 C 30 40, 30 60, 60 75" opacity="0.7"/>
                                </g>
                           </svg>
                           <span className="text-xs font-semibold tracking-wider mt-1">rhodesinc</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Features Section */}
        <section id="features" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t({ en: "Why You'll Love OfferFlow", el: "Γιατί θα Αγαπήσετε το OfferFlow" })}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-md inline-flex items-center justify-center mb-4 w-12 h-12">
                     <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t({ en: "Custom Branding", el: "Προσαρμοσμένη Επωνυμία" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t({ en: "Add your company logo and details to every offer, creating a professional and consistent brand image.", el: "Προσθέστε το λογότυπο και τα στοιχεία της εταιρείας σας σε κάθε προσφορά, δημιουργώντας μια επαγγελματική εικόνα." })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-md inline-flex items-center justify-center mb-4 w-12 h-12">
                   <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t({ en: "Automated Calculations", el: "Αυτόματοι Υπολογισμοί" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t({ en: "Never make a math mistake again. OfferFlow handles subtotals, VAT, and grand totals for you.", el: "Μην ξανακάνετε λάθος στα μαθηματικά. Το OfferFlow υπολογίζει τα σύνολα, το ΦΠΑ και τα τελικά ποσά για εσάς." })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-md inline-flex items-center justify-center mb-4 w-12 h-12">
                   <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t({ en: "Cloud Sync & Analytics", el: "Cloud Sync & Αναλυτικά" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t({ en: "Save offers to the cloud and access them anywhere. Gain insights with our analytics dashboard (Business Plan).", el: "Αποθηκεύστε τις προσφορές στο cloud και αποκτήστε πρόσβαση από οπουδήποτε. Δείτε την απόδοση με τον πίνακα αναλυτικών (Business Plan)." })}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">{t({ en: "Ready to streamline your sales process?", el: "Έτοιμοι να απλοποιήσετε τη διαδικασία πωλήσεών σας;" })}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t({ en: "Sign up today and get a 30-day free trial of our Pro plan. No credit card required.", el: "Εγγραφείτε σήμερα και λάβετε μια δωρεάν δοκιμή 30 ημερών του Pro πλάνου μας. Δεν απαιτείται πιστωτική κάρτα." })}</p>
            <Button asChild size="lg" className="text-lg">
              <Link href="/signup">
                {t({ en: "Get Started for Free", el: "Ξεκινήστε Δωρεάν" })}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

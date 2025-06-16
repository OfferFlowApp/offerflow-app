
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';

interface PricingPlan {
  id: string;
  nameKey: { en: string; el: string };
  priceKey: { en: string; el: string };
  priceSuffixKey?: { en: string; el: string };
  descriptionKey: { en: string; el: string };
  featuresKeys: { en: string; el: string }[];
  buttonTextKey: { en: string; el: string };
  isFeatured?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    nameKey: { en: 'Free Tier', el: 'Δωρεάν Πακέτο' },
    priceKey: { en: '$0', el: '€0' },
    descriptionKey: { en: 'Get started with the basics.', el: 'Ξεκινήστε με τα βασικά.' },
    featuresKeys: [
      { en: 'Up to 3 Offer Sheets', el: 'Έως 3 Δελτία Προσφορών' },
      { en: 'Basic PDF Export', el: 'Βασική Εξαγωγή PDF' },
      { en: 'Community Support', el: 'Υποστήριξη Κοινότητας' },
    ],
    buttonTextKey: { en: 'Get Started', el: 'Ξεκινήστε' },
  },
  {
    id: 'pro',
    nameKey: { en: 'Pro Plan', el: 'Pro Πακέτο' },
    priceKey: { en: '$15', el: '€15' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For professionals and small businesses.', el: 'Για επαγγελματίες και μικρές επιχειρήσεις.' },
    featuresKeys: [
      { en: 'Unlimited Offer Sheets', el: 'Απεριόριστα Δελτία Προσφορών' },
      { en: 'Custom Branding & Logo', el: 'Προσαρμοσμένη Επωνυμία & Λογότυπο' },
      { en: 'Advanced PDF Export', el: 'Προηγμένη Εξαγωγή PDF' },
      { en: 'Priority Email Support', el: 'Κατά Προτεραιότητα Υποστήριξη Email' },
    ],
    buttonTextKey: { en: 'Choose Pro', el: 'Επιλέξτε Pro' },
    isFeatured: true,
  },
  {
    id: 'enterprise',
    nameKey: { en: 'Enterprise', el: 'Enterprise' },
    priceKey: { en: 'Custom', el: 'Επικοινωνήστε' },
    descriptionKey: { en: 'Tailored solutions for large organizations.', el: 'Εξατομικευμένες λύσεις για μεγάλους οργανισμούς.' },
    featuresKeys: [
      { en: 'All Pro Features', el: 'Όλα τα Pro Χαρακτηριστικά' },
      { en: 'Team Collaboration', el: 'Συνεργασία Ομάδας' },
      { en: 'Dedicated Account Manager', el: 'Αποκλειστικός Διαχειριστής Λογαριασμού' },
      { en: 'API Access & Integrations', el: 'Πρόσβαση API & Ενσωματώσεις' },
    ],
    buttonTextKey: { en: 'Contact Us', el: 'Επικοινωνήστε Μαζί μας' },
  },
];

export default function PricingPage() {
  const { t } = useLocalization();

  const handleChoosePlan = (planId: string) => {
    // Placeholder: In a real app, this would navigate to a checkout or contact form.
    alert(`${t({en: "You selected:", el:"Επιλέξατε:"})} ${planId}. ${t({en: "Checkout functionality is a placeholder.", el: "Η λειτουργία πληρωμής είναι placeholder."})}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary font-headline">
            {t({ en: 'Choose Your Plan', el: 'Επιλέξτε το Πρόγραμμά σας' })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t({ 
              en: 'Simple, transparent pricing for teams of all sizes. Pick the plan that’s right for you.', 
              el: 'Απλή, διαφανής τιμολόγηση για ομάδες όλων των μεγεθών. Επιλέξτε το πρόγραμμα που σας ταιριάζει.' 
            })}
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`flex flex-col shadow-xl rounded-lg transition-all duration-300 hover:shadow-2xl ${plan.isFeatured ? 'border-primary border-2 ring-2 ring-primary/50 relative' : 'border'}`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full shadow-md">
                  {t({en: "Most Popular", el: "Πιο Δημοφιλές"})}
                </div>
              )}
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-bold font-headline text-center text-primary">
                  {t(plan.nameKey)}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground min-h-[40px]">
                  {t(plan.descriptionKey)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold">{t(plan.priceKey)}</span>
                  {plan.priceSuffixKey && <span className="text-muted-foreground">{t(plan.priceSuffixKey)}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.featuresKeys.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleChoosePlan(plan.id)} 
                  className={`w-full text-lg py-3 ${plan.isFeatured ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t(plan.buttonTextKey)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

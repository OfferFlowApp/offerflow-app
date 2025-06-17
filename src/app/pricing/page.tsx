
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info, ShoppingCart } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { PLANS, type PricingPlanDetails } from '@/config/plans'; // Import new plans config
import type { PlanId } from '@/lib/types';

const plansToShow: PricingPlanDetails[] = [PLANS.free, PLANS.pro, PLANS.business];

export default function PricingPage() {
  const { t } = useLocalization();

  const handleChoosePlan = (planId: PlanId) => {
    // Placeholder: In a real app, this would navigate to a checkout or contact form.
    // For now, it can log or show a toast.
    // With Firebase Auth, you'd typically associate the chosen plan with the user ID.
    // Example: router.push(`/checkout?plan=${planId}`);
    alert(`${t({en: "You selected:", el:"Επιλέξατε:"})} ${t(PLANS[planId].nameKey)}. ${t({en: "Checkout functionality is a placeholder.", el: "Η λειτουργία πληρωμής είναι placeholder."})}`);
  };

  const getFeatureIcon = (iconType?: 'check' | 'x' | 'info') => {
    if (iconType === 'x') return <XCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 shrink-0" />;
    if (iconType === 'info') return <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />;
    return <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />;
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
          {plansToShow.map((plan) => (
            <Card 
              key={plan.id} 
              className={`flex flex-col rounded-lg transition-all duration-300 ${
                plan.isFeatured 
                  ? 'border-primary border-[3px] ring-4 ring-primary/60 relative shadow-2xl' 
                  : 'border shadow-xl hover:shadow-2xl'
              }`}
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
                  {plan.features.map((feature) => (
                    <li key={feature.key || t(feature.textKey)} className="flex items-start">
                      {getFeatureIcon(feature.icon)}
                      <span className={`text-muted-foreground ${!feature.available ? 'line-through' : ''}`}>{t(feature.textKey)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleChoosePlan(plan.id)} 
                  className={`w-full text-lg py-3 ${plan.isFeatured ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}
                  disabled={plan.id === 'free'} // Cannot "choose" free again from here
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

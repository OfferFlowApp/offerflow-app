
"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info, ShoppingCart, Loader2, Sparkles } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { PLANS, type PricingPlanDetails } from '@/config/plans';
import type { PlanId } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const proPlanMonthly = PLANS['pro-monthly'];
const proPlanYearly = PLANS['pro-yearly'];
const businessPlanMonthly = PLANS['business-monthly'];
const businessPlanYearly = PLANS['business-yearly'];

export default function PricingPage() {
  const { t } = useLocalization();
  const { currentUser, userSubscription, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoadingPlan, setIsLoadingPlan] = useState<PlanId | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const proPlan = billingInterval === 'monthly' ? proPlanMonthly : proPlanYearly;
  const businessPlan = billingInterval === 'monthly' ? businessPlanMonthly : businessPlanYearly;

  const handleChoosePlan = async (planId: PlanId) => {
    if (planId === 'none') return;
    
    if (!currentUser) {
      toast({
        title: t({ en: "Login Required", el: "Απαιτείται Σύνδεση" }),
        description: t({ en: "Please log in or sign up to choose a plan.", el: "Παρακαλώ συνδεθείτε ή εγγραφείτε για να επιλέξετε ένα πρόγραμμα." }),
        variant: "default",
      });
      router.push('/login?redirect=/pricing'); // Redirect back to pricing after login
      return;
    }

    if (userSubscription?.status === 'active' || userSubscription?.status === 'trialing') {
      // This is a placeholder for subscription management (upgrade/downgrade)
      // For now, we'll just inform the user they are already subscribed.
      toast({
        title: t({ en: "Already Subscribed", el: "Είστε ήδη Συνδρομητής" }),
        description: t({ en: "Please manage your subscription from your profile page.", el: "Διαχειριστείτε τη συνδρομή σας από τη σελίδα του προφίλ σας." }),
      });
      return;
    }

    setIsLoadingPlan(planId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: planId, userId: currentUser.uid }),
      });

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      } else if (session.error) {
        console.error("Stripe session error:", session.error);
        toast({
          title: t({ en: "Checkout Error", el: "Σφάλμα Πληρωμής" }),
          description: session.error.message || t({ en: "Could not initiate checkout. Please try again.", el: "Δεν ήταν δυνατή η έναρξη της πληρωμής." }),
          variant: "destructive",
        });
      } else {
         throw new Error("Invalid response from checkout session API");
      }
    } catch (error) {
      console.error("Error choosing plan:", error);
      toast({
        title: t({ en: "Error", el: "Σφάλμα" }),
        description: t({ en: "An unexpected error occurred. Please try again.", el: "Παρουσιάστηκε μη αναμενόμενο σφάλμα." }),
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlan(null);
    }
  };

  const getFeatureIcon = (iconType?: 'check' | 'x' | 'info') => {
    if (iconType === 'x') return <XCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 shrink-0" />;
    if (iconType === 'info') return <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />;
    return <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />;
  };

  const plansToShow = [proPlan, businessPlan];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary font-headline">
            {t({ en: 'Choose Your Plan', el: 'Επιλέξτε το Πρόγραμμά σας' })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t({
              en: 'All plans start with a 30-day free trial. No credit card required to start, but required to continue after the trial.',
              el: 'Όλα τα προγράμματα ξεκινούν με 30 ημέρες δωρεάν δοκιμή. Δεν απαιτείται πιστωτική κάρτα για την έναρξη, αλλά για τη συνέχιση μετά τη δοκιμή.'
            })}
          </p>
        </section>

        <section className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">{t({ en: 'Select Billing Cycle', el: 'Επιλέξτε Κύκλο Χρέωσης' })}</h2>
              <p className="text-muted-foreground">{t({ en: 'Save more by choosing a yearly plan!', el: 'Εξοικονομήστε περισσότερα επιλέγοντας ετήσιο πρόγραμμα!' })}</p>
            </div>
            <Tabs
                defaultValue="monthly"
                onValueChange={(value) => setBillingInterval(value as 'monthly' | 'yearly')}
                className="w-auto"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">{t({ en: 'Monthly', el: 'Μηνιαία' })}</TabsTrigger>
                    <TabsTrigger value="yearly">{t({ en: 'Yearly', el: 'Ετήσια' })} <span className="hidden sm:inline ml-2 bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full text-xs">SAVE!</span></TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
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
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
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
                      <div className="flex items-baseline justify-center gap-2">
                        {plan.listPriceKey && t(plan.listPriceKey) !== t(plan.priceKey) && (
                          <span className="text-2xl font-medium text-destructive line-through">
                            {t(plan.listPriceKey)}
                          </span>
                        )}
                        <span className="text-4xl font-extrabold">{t(plan.priceKey)}</span>
                      </div>
                      {plan.priceSuffixKey && <span className="text-muted-foreground">{t(plan.priceSuffixKey)}</span>}
                    </div>
                    <ul className="space-y-3">
                    {plan.features.map((feature) => (
                        <li key={t(feature.textKey)} className="flex items-start">
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
                    disabled={isLoadingPlan === plan.id || authLoading}
                    >
                    {isLoadingPlan === plan.id ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <ShoppingCart className="mr-2 h-5 w-5" />
                    )}
                    {isLoadingPlan === plan.id ? t({en:"Processing...", el:"Επεξεργασία..."}) : t(plan.buttonTextKey)}
                    </Button>
                </CardFooter>
                </Card>
            ))}
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

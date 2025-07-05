
"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info, ShoppingCart, Sparkles, Clock } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { PLANS, type PricingPlanDetails } from '@/config/plans';
import type { PlanId } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { differenceInDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  
  const isAlreadyPaid = userSubscription?.status === 'active';
  const isTrialing = userSubscription?.status === 'trialing';

  let trialDaysLeft = 0;
  if (isTrialing && userSubscription?.currentPeriodEnd) {
    const endDate = new Date(userSubscription.currentPeriodEnd);
    trialDaysLeft = Math.max(0, differenceInDays(endDate, new Date()));
  }

  const handleChoosePlan = async (planId: PlanId) => {
    if (planId === 'none') return;
    
    if (!currentUser) {
      toast({
        title: t({ en: "Login Required", el: "Απαιτείται Σύνδεση" }),
        description: t({ en: "Please log in or sign up to choose a plan.", el: "Παρακαλώ συνδεθείτε ή εγγραφείτε για να επιλέξετε ένα πρόγραμμα." }),
        variant: "default",
      });
      router.push('/login?redirect=/pricing');
      return;
    }

    if (isAlreadyPaid) {
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
  
  const getIntroText = () => {
    if (isAlreadyPaid) {
      return t({en: "You are currently subscribed. You can manage your plan from your profile page.", el: "Είστε ήδη συνδρομητής. Μπορείτε να διαχειριστείτε το πρόγραμμά σας από το προφίλ σας."});
    }
    if (isTrialing) {
      return t({en: "You are on a free trial. Choose a plan below to activate it and continue after your trial ends.", el: "Βρίσκεστε σε δωρεάν δοκιμή. Επιλέξτε ένα πρόγραμμα παρακάτω για να το ενεργοποιήσετε και να συνεχίσετε μετά τη λήξη της."});
    }
    if (currentUser && !userSubscription) {
        return t({en: "Welcome! Choose a plan below to start your 30-day free trial.", el: "Καλώς ήρθατε! Επιλέξτε ένα πρόγραμμα για να ξεκινήσετε τη δωρεάν δοκιμή 30 ημερών."});
    }
    // This is for logged-out users
    return t({en: "Create an account to automatically start your 30-day free Pro trial. Choose a plan below to continue when the trial ends.", el: "Δημιουργήστε λογαριασμό για να ξεκινήσετε αυτόματα τη δωρεάν δοκιμή 30 ημερών. Επιλέξτε ένα πρόγραμμα παρακάτω για να συνεχίσετε μετά τη δοκιμή."});
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary font-headline">
            {t({ en: 'Choose Your Plan', el: 'Επιλέξτε το Πρόγραμμά σας' })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getIntroText()}
          </p>
        </section>

        {isTrialing && (
          <Alert className="max-w-5xl mx-auto mb-8 border-accent text-accent-foreground bg-accent/10">
            <Clock className="h-4 w-4 !text-accent" />
            <AlertTitle>{t({ en: "You are on a free trial!", el: "Βρίσκεστε σε δωρεάν δοκιμή!" })}</AlertTitle>
            <AlertDescription>
              {t({ en: `You have ${trialDaysLeft} day(s) left. Choose a plan now to activate it.`, el: `Απομένουν ${trialDaysLeft} ημέρα(ες). Επιλέξτε ένα πρόγραμμα τώρα για να το ενεργοποιήσετε.` })}
            </AlertDescription>
          </Alert>
        )}

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
                    <TabsTrigger value="yearly">{t({ en: 'Yearly', el: 'Ετήσια' })} <span className="hidden sm:inline ml-2 bg-destructive text-destructive-foreground font-semibold px-2.5 py-1 rounded-full text-xs animate-pulse">SAVE BIG!</span></TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
            {plansToShow.map((plan) => {
                const isCurrentPlan = isAlreadyPaid && userSubscription?.planId === plan.id;
                const isDisabled = isLoadingPlan === plan.id || authLoading || isAlreadyPaid;

                const getButtonText = () => {
                  if (isCurrentPlan) return t({en: "Your Current Plan", el: "Το Πρόγραμμά σας"});
                  if (isTrialing) return t({en: "Invest Now", el: "Επενδύστε Τώρα"});
                  return t(plan.buttonTextKey);
                }

                return (
                  <Card
                  key={plan.id}
                  className={`flex flex-col rounded-lg transition-all duration-300 ${
                      isCurrentPlan ? 'border-accent border-[3px] ring-4 ring-accent/60 relative shadow-2xl' :
                      plan.isFeatured
                      ? 'border-primary border-[3px] ring-4 ring-primary/60 relative shadow-2xl'
                      : 'border shadow-xl hover:shadow-2xl'
                  }`}
                  >
                  {plan.isFeatured && !isCurrentPlan && (
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
                      {plan.isFeatured && (
                        <div className="flex items-center justify-center gap-2 text-destructive font-semibold pt-2">
                          <Clock className="h-5 w-5 animate-pulse" />
                          <span>{t({en: "Limited Time Offer!", el: "Προσφορά Περιορισμένου Χρόνου!"})}</span>
                        </div>
                      )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-2">
                          {plan.listPriceKey && t(plan.listPriceKey) !== t(plan.priceKey) && (
                            <span className="text-2xl font-medium text-muted-foreground line-through decoration-destructive decoration-2">
                              {t(plan.listPriceKey)}
                            </span>
                          )}
                          <span className="text-4xl font-extrabold text-foreground">{t(plan.priceKey)}</span>
                        </div>
                        {plan.priceSuffixKey && <span className="text-muted-foreground">{t(plan.priceSuffixKey)}</span>}
                      </div>
                      <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                          <li key={t(feature.textKey) + index} className="flex items-start">
                          {getFeatureIcon(feature.icon)}
                          <span className={`text-muted-foreground ${!feature.available ? 'line-through' : ''}`}>{t(feature.textKey)}</span>
                          </li>
                      ))}
                      </ul>
                  </CardContent>
                  <CardFooter>
                      <Button
                      onClick={() => handleChoosePlan(plan.id)}
                      className={`w-full text-lg py-3 ${
                        isCurrentPlan ? 'bg-accent hover:bg-accent/90 text-accent-foreground' :
                        plan.isFeatured ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      }`}
                      disabled={isDisabled}
                      >
                      {isLoadingPlan === plan.id ? (
                        <>
                          <LoadingSpinner className="mr-2 h-5 w-5" />
                          {t({ en: 'Redirecting...', el: 'Ανακατεύθυνση...' })}
                        </>
                      ) : isCurrentPlan ? (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            {getButtonText()}
                          </>
                      ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {getButtonText()}
                          </>
                      )}
                      </Button>
                  </CardFooter>
                  </Card>
              )})}
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, XCircle, Info, ShoppingCart, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { PLANS, type PricingPlanDetails } from '@/config/plans';
import type { PlanId } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch'; // Using Switch instead of Tabs
import { Label } from '@/components/ui/label';
import { differenceInDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';


const proPlanMonthly = PLANS['pro-monthly'];
const proPlanYearly = PLANS['pro-yearly'];
const businessPlanMonthly = PLANS['business-monthly'];
const businessPlanYearly = PLANS['business-yearly'];

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

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
      const refId = getCookie('referral_id');
      const requestBody = {
        planId: planId,
        userId: currentUser.uid,
        ...(refId && { refId: refId }),
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
    return t({en: "Create an account to automatically start your 30-day free Pro trial.", el: "Δημιουργήστε λογαριασμό για να ξεκινήσετε αυτόματα τη δωρεάν δοκιμή 30 ημερών."});
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t({ en: 'Pricing', el: 'Τιμολόγηση' })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t({ en: 'Get the best value for your money with our competitive pricing.', el: 'Αποκτήστε την καλύτερη αξία για τα χρήματά σας με τις ανταγωνιστικές μας τιμές.' })}
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
            <div className="flex items-center space-x-3">
              <Label htmlFor="billing-cycle" className={cn("font-medium", billingInterval === 'monthly' ? 'text-primary' : 'text-muted-foreground')}>
                {t({ en: 'Monthly', el: 'Μηνιαία' })}
              </Label>
              <Switch
                id="billing-cycle"
                checked={billingInterval === 'yearly'}
                onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
                aria-label="Toggle billing cycle"
              />
              <Label htmlFor="billing-cycle" className={cn("font-medium", billingInterval === 'yearly' ? 'text-primary' : 'text-muted-foreground')}>
                {t({ en: 'Yearly', el: 'Ετήσια' })}
                <span className="text-accent text-sm font-semibold ml-2">({t({en: 'Save Big!', el: 'Μεγάλη Έκπτωση!'})})</span>
              </Label>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto w-full items-start">
            {plansToShow.map((plan) => {
                const isCurrentPlan = isAlreadyPaid && userSubscription?.planId === plan.id;
                const isLoadingThisPlan = isLoadingPlan === plan.id;
                const isHighlighted = plan.isFeatured;

                const getButtonText = () => {
                  if (plan.id === 'none') return t({en: "Start for Free", el: "Ξεκινήστε Δωρεάν"});
                  if (isCurrentPlan) return t({en: "Your Current Plan", el: "Το Πρόγραμμά σας"});
                  if (isTrialing) return t({en: "Activate Now", el: "Ενεργοποίηση Τώρα"});
                  return t(plan.buttonTextKey);
                }

                return (
                  <Card
                  key={plan.id}
                  className={cn(
                    "flex flex-col rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 h-full",
                    isHighlighted ? 'bg-primary text-primary-foreground border-2 border-primary' : 'bg-card text-card-foreground',
                     isCurrentPlan ? 'border-accent ring-2 ring-accent' : ''
                  )}
                  >
                  <CardHeader className="pt-8 pb-4">
                      <CardTitle className="text-2xl font-bold text-center">
                        {t(plan.nameKey)}
                      </CardTitle>
                      <CardDescription className={cn("text-center min-h-[20px]", isHighlighted ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                        {plan.id === 'none' ? t({en: 'To get you started', el: 'Για να ξεκινήσετε'}) : t(plan.descriptionKey)}
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                      <div className="text-center mb-8">
                        <span className="text-5xl font-extrabold">{t(plan.priceKey)}</span>
                        {plan.priceSuffixKey && <span className={cn("text-sm", isHighlighted ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{t(plan.priceSuffixKey)}</span>}
                      </div>
                      <ul className="space-y-4 flex-grow">
                      {plan.features.map((feature, index) => (
                          <li key={t(feature.textKey) + index} className="flex items-start">
                            <Check className={cn("h-5 w-5 mr-3 mt-0.5 shrink-0", isHighlighted ? 'text-accent' : 'text-primary')} />
                            <span className={isHighlighted ? 'text-primary-foreground/90' : 'text-muted-foreground'}>{t(feature.textKey)}</span>
                          </li>
                      ))}
                      </ul>
                  </CardContent>
                  <CardFooter className="p-6 mt-6">
                      <Button
                        onClick={() => handleChoosePlan(plan.id)}
                        className={cn(
                            'w-full text-lg py-6',
                            isHighlighted ? 'bg-white text-primary hover:bg-gray-200' : 'bg-primary hover:bg-primary/90 text-primary-foreground',
                            isCurrentPlan && '!bg-accent hover:!bg-accent/90'
                        )}
                        disabled={isLoadingThisPlan || authLoading || (isAlreadyPaid && !isCurrentPlan) || (plan.id === 'none' && currentUser != null)}
                      >
                      {isLoadingThisPlan ? (
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
                          getButtonText()
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

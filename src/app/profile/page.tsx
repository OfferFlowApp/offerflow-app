
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLocalization } from '@/hooks/useLocalization';
import { CheckCircle, Clock, XCircle, ExternalLink, UserCircle, ShieldCheck } from 'lucide-react';
import { getPlanDetails } from '@/config/plans';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { currentUser, userSubscription, loading: authLoading, logOut, refreshSubscription } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login.
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
    // Refresh subscription data when component mounts and user is available
    if (currentUser) {
        refreshSubscription();
    }
  }, [currentUser, authLoading, router, refreshSubscription]);
  
  const handleManageSubscription = async () => {
      if (!currentUser) return;
      setIsRedirecting(true);
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/create-billing-portal-session', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const session = await response.json();
        if (session.url) {
            window.location.href = session.url;
        } else {
            toast({
                title: t({en: "Error", el: "Σφάλμα"}),
                description: session.error?.message || t({en: "Could not open subscription management.", el: "Δεν ήταν δυνατό το άνοιγμα της διαχείρισης συνδρομής."}),
                variant: "destructive"
            });
            setIsRedirecting(false);
        }
      } catch (error) {
        toast({
            title: t({en: "Error", el: "Σφάλμα"}),
            description: t({en: "An unexpected error occurred.", el: "Παρουσιάστηκε ένα μη αναμενόμενο σφάλμα."}),
            variant: "destructive"
        });
        setIsRedirecting(false);
      }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <LoadingSpinner className="h-12 w-12" />
        </main>
        <Footer />
      </div>
    );
  }

  const planDetails = getPlanDetails(userSubscription?.planId);
  const status = userSubscription?.status;
  const endDate = userSubscription?.currentPeriodEnd ? new Date(userSubscription.currentPeriodEnd) : null;
  
  const getStatusInfo = () => {
    switch (status) {
        case 'active':
            return {
                icon: <CheckCircle className="h-5 w-5 text-accent" />,
                text: t({en: "Active", el: "Ενεργή"}),
                description: endDate ? `${t({en:"Your plan renews on", el:"Το πλάνο σας ανανεώνεται στις"})} ${format(endDate, 'PPP')}` : ''
            };
        case 'trialing':
            return {
                icon: <Clock className="h-5 w-5 text-blue-500" />,
                text: t({en: "Trial Period", el: "Δοκιμαστική Περίοδος"}),
                description: endDate ? `${t({en:"Your trial ends on", el:"Η δοκιμή σας λήγει στις"})} ${format(endDate, 'PPP')}` : ''
            };
        case 'canceled':
            return {
                icon: <XCircle className="h-5 w-5 text-destructive" />,
                text: t({en: "Canceled", el: "Ακυρωμένη"}),
                description: endDate ? `${t({en:"Your access will end on", el:"Η πρόσβασή σας λήγει στις"})} ${format(endDate, 'PPP')}` : ''
            };
        default:
            return {
                icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
                text: t({en: "No active subscription", el: "Καμία ενεργή συνδρομή"}),
                description: t({en: "Choose a plan to get started!", el: "Επιλέξτε ένα πλάνο για να ξεκινήσετε!"})
            };
    }
  }
  
  const statusInfo = getStatusInfo();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
          {t({en: "My Account", el: "Ο Λογαριασμός μου"})}
        </h1>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <UserCircle className="mr-3 h-7 w-7 text-primary" />
                {t({en: "Profile", el: "Προφίλ"})}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>{t({en: "Email Address", el: "Διεύθυνση Email"})}</Label>
                <p className="text-muted-foreground break-all">{currentUser.email}</p>
              </div>
               <div className="space-y-1">
                <Label>{t({en: "User ID", el: "Αναγνωριστικό Χρήστη"})}</Label>
                <p className="text-xs text-muted-foreground break-all">{currentUser.uid}</p>
              </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={logOut}>
                    {t({en: "Log Out", el: "Αποσύνδεση"})}
                </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
                {t({en: "Subscription", el: "Συνδρομή"})}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">{t({en: "Current Plan", el: "Τρέχον Πρόγραμμα"})}</p>
                    <p className="text-lg font-semibold">{t(planDetails.nameKey)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">{t({en: "Status", el: "Κατάσταση"})}</p>
                    <div className="flex items-center gap-2">
                        {statusInfo.icon}
                        <p className="text-lg font-semibold">{statusInfo.text}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{statusInfo.description}</p>
                </div>
            </CardContent>
             <CardFooter className="flex flex-col items-start gap-2">
                {userSubscription?.stripeCustomerId ? (
                    <Button onClick={handleManageSubscription} className="w-full" disabled={isRedirecting}>
                        {isRedirecting ? <LoadingSpinner className="mr-2" /> : <ExternalLink className="mr-2" />}
                        {t({en: "Manage Subscription & Billing", el: "Διαχείριση Συνδρομής & Χρέωσης"})}
                    </Button>
                ) : (
                    <Button onClick={() => router.push('/pricing')} className="w-full">
                       {t({en: "View Plans", el: "Δείτε τα Πλάνα"})}
                    </Button>
                )}
                 <p className="text-xs text-muted-foreground text-center w-full pt-1">{t({en:"You will be redirected to our payment partner, Stripe.", el:"Θα μεταφερθείτε στον συνεργάτη πληρωμών μας, Stripe."})}</p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

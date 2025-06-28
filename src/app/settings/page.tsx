
"use client"; 

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DefaultLogoSettings from '@/components/settings/DefaultLogoSettings';
import DefaultCurrencySettings from '@/components/settings/DefaultCurrencySettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import DefaultTermsSettings from '@/components/settings/DefaultTermsSettings'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLocalization } from '@/hooks/useLocalization'; 
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getPlanDetails } from '@/config/plans';
import { ShieldCheck } from 'lucide-react';


export default function SettingsPage() {
  const { t } = useLocalization();
  const { currentUser, userSubscription } = useAuth();
  const router = useRouter();

  const planDetails = getPlanDetails(userSubscription?.planId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
           {t({ en: "Application Settings", el: "Ρυθμίσεις Εφαρμογής"})}
        </h1>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{t({ en: "Branding & Seller Defaults", el: "Προεπιλογές Επωνυμίας & Πωλητή" })}</CardTitle>
              <CardDescription>
                {t({ en: "Set default seller information and logo for new offer sheets.", el: "Ορίστε προεπιλεγμένες πληροφορίες πωλητή και λογότυπο για νέα δελτία προσφοράς." })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultLogoSettings />
            </CardContent>
          </Card>

          <Separator />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{t({ en: "Localization", el: "Τοπικοποίηση" })}</CardTitle>
              <CardDescription>
                {t({ en: "Set your preferred language and default currency.", el: "Ορίστε την προτιμώμενη γλώσσα και το προεπιλεγμένο νόμισμά σας." })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LanguageSettings />
              <Separator />
              <DefaultCurrencySettings />
            </CardContent>
          </Card>
          
          <Separator />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{t({ en: "Default Content", el: "Προεπιλεγμένο Περιεχόμενο" })}</CardTitle>
              <CardDescription>
                {t({ en: "Set default terms and conditions for new offer sheets.", el: "Ορίστε προεπιλεγμένους όρους και προϋποθέσεις για νέα δελτία προσφοράς." })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultTermsSettings />
            </CardContent>
          </Card>

          <Separator />

          {currentUser && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <ShieldCheck />
                  {t({ en: "Subscription & Billing", el: "Συνδρομή & Χρέωση" })}
                </CardTitle>
                <CardDescription>
                  {t({ en: "View your current plan and manage your billing details.", el: "Δείτε το τρέχον πρόγραμμά σας και διαχειριστείτε τα στοιχεία χρέωσής σας." })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  {t({en: "You are currently on the", el: "Αυτή τη στιγμή βρίσκεστε στο"})} <span className="font-semibold">{t(planDetails.nameKey)}</span> {t({en: "plan.", el: "πρόγραμμα."})}
                </p>
              </CardContent>
              <CardFooter>
                 <Button onClick={() => router.push('/profile')}>
                    {t({en: "Manage Account & Billing", el: "Διαχείριση Λογαριασμού & Χρέωσης"})}
                 </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

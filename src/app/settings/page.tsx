import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DefaultLogoSettings from '@/components/settings/DefaultLogoSettings';
import DefaultCurrencySettings from '@/components/settings/DefaultCurrencySettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import SubscriptionSettings from '@/components/settings/SubscriptionSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLocalization } from '@/hooks/useLocalization'; // Import the hook


export default function SettingsPage() {
  // No need to call useLocalization here if children components handle their text
  // Or, if SettingsPage itself had text to translate, you would:
  // const { t } = useLocalization();
  // <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
  //   {t({ en: "Application Settings", el: "Ρυθμίσεις Εφαρμογής"})}
  // </h1>

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* This title will be translated by Header component if Header uses useLocalization */}
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
           Application Settings
        </h1>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Branding Settings</CardTitle>
              <CardDescription>
                Set a default logo that will be automatically added to new offer sheets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultLogoSettings />
            </CardContent>
          </Card>

          <Separator />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Localization</CardTitle>
              <CardDescription>
                Set your preferred language and default currency.
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
              <CardTitle className="font-headline text-2xl">Subscription & Billing</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionSettings />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

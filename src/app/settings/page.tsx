
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
  const { t } = useLocalization();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
           {t({ en: "Application Settings", el: "Ρυθμίσεις Εφαρμογής", de: "Anwendungseinstellungen", fr: "Paramètres de l'application"})}
        </h1>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{t({ en: "Branding Settings", el: "Ρυθμίσεις Επωνυμίας", de: "Branding-Einstellungen", fr: "Paramètres de Marque" })}</CardTitle>
              <CardDescription>
                {t({ en: "Set a default logo that will be automatically added to new offer sheets.", el: "Ορίστε ένα προεπιλεγμένο λογότυπο που θα προστίθεται αυτόματα σε νέα δελτία προσφοράς.", de: "Legen Sie ein Standardlogo fest, das automatisch zu neuen Angebotsblättern hinzugefügt wird.", fr: "Définissez un logo par défaut qui sera automatiquement ajouté aux nouvelles fiches d'offre." })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultLogoSettings />
            </CardContent>
          </Card>

          <Separator />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{t({ en: "Localization", el: "Τοπικοποίηση", de: "Lokalisierung", fr: "Localisation" })}</CardTitle>
              <CardDescription>
                {t({ en: "Set your preferred language and default currency.", el: "Ορίστε την προτιμώμενη γλώσσα και το προεπιλεγμένο νόμισμά σας.", de: "Stellen Sie Ihre bevorzugte Sprache und Standardwährung ein.", fr: "Définissez votre langue préférée et votre devise par défaut." })}
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
              <CardTitle className="font-headline text-2xl">{t({ en: "Subscription & Billing (Placeholder)", el: "Συνδρομή & Χρέωση (Placeholder)", de: "Abonnement & Abrechnung (Platzhalter)", fr: "Abonnement & Facturation (Placeholder)" })}</CardTitle>
              <CardDescription>
                {t({ en: "Manage your subscription plan and billing details. (This section is a non-functional placeholder).", el: "Διαχειριστείτε το πρόγραμμα συνδρομής και τα στοιχεία χρέωσής σας. (Αυτή η ενότητα είναι ένας μη λειτουργικός placeholder).", de: "Verwalten Sie Ihren Abonnementplan und Ihre Rechnungsdetails. (Dieser Abschnitt ist ein nicht funktionsfähiger Platzhalter).", fr: "Gérez votre plan d'abonnement et vos informations de facturation. (Cette section est un espace réservé non fonctionnel)." })}
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

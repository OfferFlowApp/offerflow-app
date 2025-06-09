
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';

export default function SubscriptionSettings() {
  const { t } = useLocalization();
  // Placeholder data
  const currentPlan = t({ en: "Pro Plan (Example)", el: "Pro Plan (Παράδειγμα)", de: "Pro Plan (Beispiel)", fr: "Plan Pro (Exemple)" });
  const nextBillingDate = t({ en: "Not Applicable", el: "Μη Διαθέσιμο", de: "Nicht Zutreffend", fr: "Non Applicable" });


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline">{t({ en: "Current Plan:", el: "Τρέχον Πρόγραμμα:", de: "Aktueller Plan:", fr: "Plan Actuel:" })} {currentPlan}</CardTitle>
          <CardDescription>
            {t({ en: "Subscription features are currently placeholders and not functional.", el: "Οι λειτουργίες συνδρομής είναι προς το παρόν placeholders και μη λειτουργικές.", de: "Abonnementfunktionen sind derzeit Platzhalter und nicht funktionsfähig.", fr: "Les fonctionnalités d'abonnement sont actuellement des placeholders et non fonctionnelles." })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> {t({ en: "Unlimited Offer Sheets (Example Feature)", el: "Απεριόριστα Δελτία Προσφορών (Παράδειγμα Λειτουργίας)", de: "Unbegrenzte Angebotsblätter (Beispielfunktion)", fr: "Fiches d'Offre Illimitées (Exemple de Fonctionnalité)" })}</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> {t({ en: "Custom Branding (Example Feature)", el: "Προσαρμοσμένη Επωνυμία (Παράδειγμα Λειτουργίας)", de: "Benutzerdefiniertes Branding (Beispielfunktion)", fr: "Marque Personnalisée (Exemple de Fonctionnalité)" })}</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> {t({ en: "PDF Export (Example Feature)", el: "Εξαγωγή PDF (Παράδειγμα Λειτουργίας)", de: "PDF-Export (Beispielfunktion)", fr: "Exportation PDF (Exemple de Fonctionnalité)" })}</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <Button variant="outline" disabled>
            {t({ en: "Change Plan", el: "Αλλαγή Προγράμματος", de: "Plan ändern", fr: "Changer de Plan" })}
          </Button>
          <Button variant="destructive" disabled>
            {t({ en: "Cancel Subscription", el: "Ακύρωση Συνδρομής", de: "Abonnement kündigen", fr: "Annuler l'Abonnement" })}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline">{t({ en: "Billing Information (Placeholder)", el: "Στοιχεία Χρέωσης (Placeholder)", de: "Rechnungsinformationen (Platzhalter)", fr: "Informations de Facturation (Placeholder)" })}</CardTitle>
          <CardDescription>
             {t({ en: "Payment method management is not yet active.", el: "Η διαχείριση τρόπων πληρωμής δεν είναι ακόμη ενεργή.", de: "Die Verwaltung der Zahlungsmethoden ist noch nicht aktiv.", fr: "La gestion des méthodes de paiement n'est pas encore active." })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-medium">{t({ en: "Card ending in **** XXXX (Example)", el: "Κάρτα που λήγει σε **** XXXX (Παράδειγμα)", de: "Karte endet auf **** XXXX (Beispiel)", fr: "Carte se terminant par **** XXXX (Exemple)" })}</p>
              <p className="text-sm text-muted-foreground">{t({ en: "Expires MM/YYYY", el: "Λήγει MM/YYYY", de: "Läuft ab MM/JJJJ", fr: "Expire MM/AAAA" })}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled>{t({ en: "Update Payment Method", el: "Ενημέρωση Τρόπου Πληρωμής", de: "Zahlungsmethode aktualisieren", fr: "Mettre à Jour le Moyen de Paiement" })}</Button>
        </CardFooter>
      </Card>
       <p className="text-sm text-muted-foreground text-center pt-4">
        {t({ en: "Subscription and billing features are currently placeholders and not functional.", el: "Οι λειτουργίες συνδρομής και χρέωσης είναι προς το παρόν placeholders και μη λειτουργικές.", de: "Abonnement- und Abrechnungsfunktionen sind derzeit Platzhalter und nicht funktionsfähig.", fr: "Les fonctionnalités d'abonnement et de facturation sont actuellement des placeholders et non fonctionnelles." })}
      </p>
    </div>
  );
}

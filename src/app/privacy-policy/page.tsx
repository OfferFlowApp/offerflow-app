"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/useLocalization';
import { ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
  const { t } = useLocalization();
  
  // This state prevents hydration errors by ensuring dynamic content like dates
  // are only rendered on the client after the initial render.
  const [lastUpdated, setLastUpdated] = useState('July 26, 2024');

  useEffect(() => {
    // Set a static date to avoid hydration mismatch.
    // In a real app, this date would be updated when the policy changes.
    const staticDate = new Date('2024-07-26T12:00:00Z');
    setLastUpdated(staticDate.toLocaleDateString(t({ en: 'en-US', el: 'el-GR' })));
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold font-headline">
              {t({ en: 'Privacy Policy', el: 'Πολιτική Απορρήτου' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none mx-auto p-6 md:p-8 space-y-4">
            <p><strong>{t({ en: 'Last Updated:', el: 'Τελευταία Ενημέρωση:' })}</strong> {lastUpdated}</p>

            <h2>1. {t({ en: 'Information We Collect', el: 'Πληροφορίες που Συλλέγουμε' })}</h2>
            <p>
              {t({
                en: 'We collect information you provide directly to us, such as when you create an account, create an offer sheet, or communicate with us. This may include your name, email address, and any other information you choose to provide.',
                el: 'Συλλέγουμε πληροφορίες που μας παρέχετε απευθείας, όπως όταν δημιουργείτε έναν λογαριασμό, δημιουργείτε ένα δελτίο προσφοράς ή επικοινωνείτε μαζί μας. Αυτό μπορεί να περιλαμβάνει το όνομά σας, τη διεύθυνση email σας και οποιαδήποτε άλλη πληροφορία επιλέξετε να παρέχετε.'
              })}
            </p>
            <p>
              {t({
                en: 'We also use local storage in your browser to save your offer sheets and application settings. This data remains on your device and is not automatically transmitted to our servers.',
                el: 'Χρησιμοποιούμε επίσης τοπική αποθήκευση στο πρόγραμμα περιήγησής σας για την αποθήκευση των δελτίων προσφορών και των ρυθμίσεων της εφαρμογής σας. Αυτά τα δεδομένα παραμένουν στη συσκευή σας και δεν μεταδίδονται αυτόματα στους διακομιστές μας.'
              })}
            </p>

            <h2>2. {t({ en: 'How We Use Information', el: 'Πώς Χρησιμοποιούμε τις Πληροφορίες' })}</h2>
            <p>
              {t({
                en: 'We use the information we collect to operate, maintain, and provide you with the features and functionality of the Service, as well as to communicate with you, such as to send you service-related emails or notices.',
                el: 'Χρησιμοποιούμε τις πληροφορίες που συλλέγουμε για τη λειτουργία, τη συντήρηση και την παροχή των χαρακτηριστικών και της λειτουργικότητας της Υπηρεσίας, καθώς και για την επικοινωνία μαζί σας, όπως για την αποστολή email ή ειδοποιήσεων που σχετίζονται με την υπηρεσία.'
              })}
            </p>

            <h2>3. {t({ en: 'Sharing of Information', el: 'Κοινοποίηση Πληροφοριών' })}</h2>
            <p>
              {t({
                en: 'We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with third-party vendors and service providers that perform services on our behalf, such as payment processing (e.g., Stripe).',
                el: 'Δεν κοινοποιούμε τις προσωπικές σας πληροφορίες σε τρίτους, εκτός από ό,τι περιγράφεται στην παρούσα Πολιτική Απορρήτου. Μπορεί να κοινοποιήσουμε πληροφορίες με τρίτους προμηθευτές και παρόχους υπηρεσιών που εκτελούν υπηρεσίες για λογαριασμό μας, όπως η επεξεργασία πληρωμών (π.χ., Stripe).'
              })}
            </p>

            <h2>4. {t({ en: 'Data Security', el: 'Ασφάλεια Δεδομένων' })}</h2>
            <p>
              {t({
                en: 'We use reasonable administrative, technical, and physical security measures to protect your information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.',
                el: 'Χρησιμοποιούμε εύλογα διοικητικά, τεχνικά και φυσικά μέτρα ασφαλείας για την προστασία των πληροφοριών σας. Ωστόσο, καμία μέθοδος μετάδοσης μέσω του Διαδικτύου ή μέθοδος ηλεκτρονικής αποθήκευσης δεν είναι 100% ασφαλής.'
              })}
            </p>
            
            <h2>5. {t({ en: 'Your Rights', el: 'Τα Δικαιώματά σας' })}</h2>
            <p>
              {t({
                en: 'You have the right to access, update, or delete your personal information. You can manage your account information through your profile settings page.',
                el: 'Έχετε το δικαίωμα πρόσβασης, ενημέρωσης ή διαγραφής των προσωπικών σας πληροφοριών. Μπορείτε να διαχειριστείτε τις πληροφορίες του λογαριασμού σας μέσω της σελίδας ρυθμίσεων του προφίλ σας.'
              })}
            </p>

            <h2>6. {t({ en: 'Contact Us', el: 'Επικοινωνήστε Μαζί Μας' })}</h2>
            <p>
              {t({
                en: 'If you have any questions about this Privacy Policy, please contact us at support@offerflow.app (placeholder email).',
                el: 'Εάν έχετε οποιεσδήποτε ερωτήσεις σχετικά με αυτήν την Πολιτική Απορρήτου, παρακαλούμε επικοινωνήστε μαζί μας στο support@offerflow.app (placeholder email).'
              })}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

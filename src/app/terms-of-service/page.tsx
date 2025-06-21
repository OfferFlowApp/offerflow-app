"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/useLocalization';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold font-headline">
              {t({ en: 'Terms of Service', el: 'Όροι Παροχής Υπηρεσιών' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none mx-auto p-6 md:p-8 space-y-4">
            <p><strong>{t({ en: 'Last Updated:', el: 'Τελευταία Ενημέρωση:' })}</strong> {new Date().toLocaleDateString(t({ en: 'en-US', el: 'el-GR' }))}</p>

            <h2>1. {t({ en: 'Introduction', el: 'Εισαγωγή' })}</h2>
            <p>
              {t({
                en: 'Welcome to OfferFlow ("we", "our", "us"). These Terms of Service ("Terms") govern your use of our web application (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.',
                el: 'Καλώς ήρθατε στο OfferFlow ("εμείς", "μας"). Αυτοί οι Όροι Παροχής Υπηρεσιών ("Όροι") διέπουν τη χρήση της διαδικτυακής μας εφαρμογής (η "Υπηρεσία"). Με την πρόσβαση ή τη χρήση της Υπηρεσίας, συμφωνείτε να δεσμεύεστε από αυτούς τους Όρους.'
              })}
            </p>

            <h2>2. {t({ en: 'Use of Service', el: 'Χρήση της Υπηρεσίας' })}</h2>
            <p>
              {t({
                en: 'You agree to use the Service only for lawful purposes. You are responsible for all data, information, and content that you upload, post, or otherwise transmit via the Service.',
                el: 'Συμφωνείτε να χρησιμοποιείτε την Υπηρεσία μόνο για νόμιμους σκοπούς. Είστε υπεύθυνοι για όλα τα δεδομένα, τις πληροφορίες και το περιεχόμενο που ανεβάζετε, δημοσιεύετε ή μεταδίδετε με άλλο τρόπο μέσω της Υπηρεσίας.'
              })}
            </p>
            
            <h2>3. {t({ en: 'User Accounts & Subscriptions', el: 'Λογαριασμοί Χρηστών & Συνδρομές' })}</h2>
            <p>
              {t({
                en: 'To access certain features, you may need to register for an account. You are responsible for maintaining the confidentiality of your account information. We offer various subscription plans (Free, Pro, Business) which are subject to recurring payments and governed by the terms specified at the time of purchase.',
                el: 'Για να αποκτήσετε πρόσβαση σε ορισμένες λειτουργίες, μπορεί να χρειαστεί να εγγραφείτε για έναν λογαριασμό. Είστε υπεύθυνοι για τη διατήρηση της εμπιστευτικότητας των πληροφοριών του λογαριασμού σας. Προσφέρουμε διάφορα προγράμματα συνδρομής (Free, Pro, Business) τα οποία υπόκεινται σε επαναλαμβανόμενες πληρωμές και διέπονται από τους όρους που καθορίζονται κατά τη στιγμή της αγοράς.'
              })}
            </p>
            
            <h2>4. {t({ en: 'Intellectual Property', el: 'Πνευματική Ιδιοκτησία' })}</h2>
            <p>
              {t({
                en: 'The Service and its original content, features, and functionality are and will remain the exclusive property of OfferFlow and its licensors. The Service is protected by copyright, trademark, and other laws of both the European Union and foreign countries.',
                el: 'Η Υπηρεσία και το πρωτότυπο περιεχόμενό της, τα χαρακτηριστικά και η λειτουργικότητά της είναι και θα παραμείνουν αποκλειστική ιδιοκτησία της OfferFlow και των δικαιοπαρόχων της. Η Υπηρεσία προστατεύεται από πνευματικά δικαιώματα, εμπορικά σήματα και άλλους νόμους τόσο της Ευρωπαϊκής Ένωσης όσο και ξένων χωρών.'
              })}
            </p>
            
            <h2>5. {t({ en: 'Termination', el: 'Τερματισμός' })}</h2>
            <p>
              {t({
                en: 'We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.',
                el: 'Μπορούμε να τερματίσουμε ή να αναστείλουμε την πρόσβασή σας στην Υπηρεσία αμέσως, χωρίς προηγούμενη ειδοποίηση ή ευθύνη, για οποιονδήποτε λόγο, συμπεριλαμβανομένου χωρίς περιορισμό εάν παραβιάσετε τους Όρους.'
              })}
            </p>
            
            <h2>6. {t({ en: 'Changes to Terms', el: 'Αλλαγές στους Όρους' })}</h2>
            <p>
              {t({
                en: 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.',
                el: 'Διατηρούμε το δικαίωμα, κατά την αποκλειστική μας κρίση, να τροποποιήσουμε ή να αντικαταστήσουμε αυτούς τους Όρους ανά πάσα στιγμή. Θα παρέχουμε ειδοποίηση για τυχόν αλλαγές δημοσιεύοντας τους νέους Όρους σε αυτήν τη σελίδα.'
              })}
            </p>

            <h2>7. {t({ en: 'Contact Us', el: 'Επικοινωνήστε Μαζί Μας' })}</h2>
            <p>
              {t({
                en: 'If you have any questions about these Terms, please contact us at support@offerflow.app (placeholder email).',
                el: 'Εάν έχετε οποιεσδήποτε ερωτήσεις σχετικά με αυτούς τους Όρους, παρακαλούμε επικοινωνήστε μαζί μας στο support@offerflow.app (placeholder email).'
              })}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/useLocalization';
import Link from 'next/link';
import { HelpCircle, LayoutDashboard, SettingsIcon, UserCircleIcon, FileTextIcon, PlusCircleIcon, SaveIcon, Share2Icon, DownloadIcon, UploadIcon, PaletteIcon, ListChecksIcon, CreditCardIcon, FileSignature, BarChart2 } from 'lucide-react';

export default function HelpPage() {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold font-headline">
            <span className="text-primary">{t({ en: "Offer", el: "Offer" })}</span><span className="text-accent">{t({ en: "Flow", el: "Flow" })}</span>{' '}
            {t({ en: "User Guide", el: "Οδηγός Χρήσης" })}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {t({ en: "Learn how to create, manage, and share professional offer sheets.", el: "Μάθετε πώς να δημιουργείτε, να διαχειρίζεστε και να μοιράζεστε επαγγελματικά δελτία προσφορών." })}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-xl rounded-lg">
          <CardContent className="p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Getting Started & Navigation", el: "Ξεκινώντας & Πλοήγηση" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-3">
                  <p>{t({ en: "Welcome to OfferFlow! This guide will help you make the most of its features.", el: "Καλώς ήρθατε στο OfferFlow! Αυτός ο οδηγός θα σας βοηθήσει να αξιοποιήσετε στο έπακρο τις δυνατότητές του." })}</p>
                  <p>
                    {t({ en: "The main navigation bar at the top includes:", el: "Η κύρια γραμμή πλοήγησης στην κορυφή περιλαμβάνει:" })}
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><Link href="/" className="text-primary hover:underline">{t({ en: "Home:", el: "Αρχική:" })}</Link> {t({ en: "Access recent offers and create new ones.", el: "Πρόσβαση σε πρόσφατες προσφορές και δημιουργία νέων." })}</li>
                    <li><Link href="/offer-sheet/edit" className="text-primary hover:underline">{t({ en: "Create Offer:", el: "Δημιουργία Προσφοράς:" })}</Link> {t({ en: "Go directly to the offer sheet form.", el: "Μεταβείτε απευθείας στη φόρμα δελτίου προσφοράς." })}</li>
                    <li><Link href="/dashboard" className="text-primary hover:underline">{t({ en: "Dashboard:", el: "Πίνακας Ελέγχου:" })}</Link> {t({ en: "View offer analytics (Business plan).", el: "Προβολή αναλυτικών στοιχείων προσφορών (πλάνο Business)." })}</li>
                    <li><Link href="/pricing" className="text-primary hover:underline">{t({ en: "Pricing:", el: "Τιμολόγηση:" })}</Link> {t({ en: "View and manage available subscription plans.", el: "Δείτε και διαχειριστείτε τα διαθέσιμα προγράμματα συνδρομής." })}</li>
                    <li><Link href="/settings" className="text-primary hover:underline">{t({ en: "Settings:", el: "Ρυθμίσεις:" })}</Link> {t({ en: "Customize default seller info, logo, currency, language, and terms.", el: "Προσαρμόστε τις προεπιλεγμένες πληροφορίες πωλητή, λογότυπο, νόμισμα, γλώσσα και όρους." })}</li>
                    <li><Link href="/profile" className="text-primary hover:underline">{t({ en: "Profile:", el: "Προφίλ:" })}</Link> {t({ en: "Manage your account and subscription.", el: "Διαχειριστείτε τον λογαριασμό και τη συνδρομή σας." })}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <PlusCircleIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Creating & Editing an Offer Sheet", el: "Δημιουργία & Επεξεργασία Δελτίου Προσφοράς" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-4">
                  <p>{t({ en: "Navigate to 'Create Offer' or click 'Create New Offer Sheet' on the homepage.", el: "Πλοηγηθείτε στο 'Δημιουργία Προσφοράς' ή κάντε κλικ στο 'Δημιουργία Νέου Δελτίου Προσφοράς' στην αρχική σελίδα." })}</p>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "1. Seller Information & Logo", el: "1. Πληροφορίες Πωλητή & Λογότυπο" })}</h4>
                    <p>{t({ en: "Enter your company's details. Upload your logo (Pro/Business feature). You can set defaults in Settings.", el: "Εισαγάγετε τα στοιχεία της εταιρείας σας. Ανεβάστε το λογότυπό σας (λειτουργία Pro/Business). Μπορείτε να ορίσετε προεπιλογές στις Ρυθμίσεις." })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "2. Customer Information", el: "2. Στοιχεία Πελάτη" })}</h4>
                    <p>{t({ en: "Fill in your client's details. You can save and reuse customer profiles with a Pro/Business plan (feature coming soon).", el: "Συμπληρώστε τα στοιχεία του πελάτη σας. Μπορείτε να αποθηκεύσετε και να επαναχρησιμοποιήσετε προφίλ πελατών με ένα πλάνο Pro/Business (η λειτουργία έρχεται σύντομα)." })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "3. Adding Products", el: "3. Προσθήκη Προϊόντων" })}</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>{t({ en: "Click 'Add Product'.", el: "Κάντε κλικ στο 'Προσθήκη Προϊόντος'." })}</li>
                      <li>{t({ en: "Enter title, quantity, original unit price, and the discounted unit price.", el: "Εισαγάγετε τίτλο, ποσότητα, αρχική τιμή μονάδας και την τιμή μονάδας με έκπτωση." })}</li>
                      <li>{t({ en: "Drag and drop products to reorder them.", el: "Σύρετε και αποθέστε προϊόντα για να αλλάξετε τη σειρά τους." })}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "4. Price Summary", el: "4. Σύνοψη Τιμών" })}</h4>
                     <p>{t({ en: "Set the VAT rate and see all totals calculated automatically, saving you from manual math errors.", el: "Ορίστε το ποσοστό ΦΠΑ και δείτε όλα τα σύνολα να υπολογίζονται αυτόματα, γλιτώνοντάς σας από χειροκίνητα μαθηματικά λάθη." })}</p>
                  </div>
                   <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "5. Notes / Terms & Conditions", el: "5. Σημειώσεις / Όροι & Προϋποθέσεις" })}</h4>
                    <p>{t({ en: "Add any specific notes or payment terms. You can save default terms in Settings and even save entire offer sheets as reusable templates with a Pro/Business plan (feature coming soon).", el: "Προσθέστε τυχόν συγκεκριμένες σημειώσεις ή όρους πληρωμής. Μπορείτε να αποθηκεύσετε προεπιλεγμένους όρους στις Ρυθμίσεις και ακόμη και να αποθηκεύσετε ολόκληρα δελτία προσφορών ως επαναχρησιμοποιήσιμα πρότυπα με ένα πλάνο Pro/Business (η λειτουργία έρχεται σύντομα)." })}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <SaveIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Saving, Exporting & Sharing", el: "Αποθήκευση, Εξαγωγή & Κοινοποίηση" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-3">
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "Saving (Save Offer Sheet)", el: "Αποθήκευση (Αποθήκευση Δελτίου Προσφοράς)" })}</h4>
                    <p>{t({ en: "Saves your current offer sheet to your browser's local storage. Access it later from the Homepage.", el: "Αποθηκεύει το τρέχον δελτίο προσφοράς στην τοπική αποθήκευση του προγράμματος περιήγησής σας. Αποκτήστε πρόσβαση αργότερα από την Αρχική σελίδα." })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "Exporting (Export Button)", el: "Εξαγωγή (Κουμπί Εξαγωγής)" })}</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li><DownloadIcon className="inline mr-1 h-4 w-4" /><strong>{t({ en: "PDF:", el: "PDF:" })}</strong> {t({ en: "Generates a professional PDF document.", el: "Δημιουργεί ένα επαγγελματικό έγγραφο PDF." })}</li>
                      <li><DownloadIcon className="inline mr-1 h-4 w-4" /><strong>{t({ en: "JPEG/JSON:", el: "JPEG/JSON:" })}</strong> {t({ en: "Export an image of page 1 or the raw offer data.", el: "Εξάγετε μια εικόνα της σελίδας 1 ή τα ακατέργαστα δεδομένα της προσφοράς." })}</li>
                      <li><DownloadIcon className="inline mr-1 h-4 w-4" /><strong>{t({ en: "CSV/Excel:", el: "CSV/Excel:" })}</strong> {t({ en: "Export product data for analysis (Business feature).", el: "Εξαγωγή δεδομένων προϊόντων για ανάλυση (λειτουργία Business)." })}</li>
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "Importing Data (Import Data Button)", el: "Εισαγωγή Δεδομένων (Κουμπί Εισαγωγής Δεδομένων)" })}</h4>
                    <p>{t({ en: "Allows you to load an offer sheet from a previously exported JSON file.", el: "Σας επιτρέπει να φορτώσετε ένα δελτίο προσφοράς από ένα προηγουμένως εξαγόμενο αρχείο JSON." })}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-analytics">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <BarChart2 className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Analytics Dashboard", el: "Πίνακας Αναλυτικών" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8">
                  <p>{t({ en: "The Analytics Dashboard is a premium feature available on the Business plan. It provides insights into your offer performance, such as views, conversions, and top-performing products. Please note: This dashboard is currently in a demonstration phase and uses sample data. Full tracking functionality will be enabled soon.", el: "Ο Πίνακας Αναλυτικών είναι μια premium λειτουργία διαθέσιμη στο πλάνο Business. Παρέχει πληροφορίες για την απόδοση των προσφορών σας, όπως προβολές, μετατροπές και προϊόντα με την καλύτερη απόδοση. Σημείωση: Αυτός ο πίνακας βρίσκεται προς το παρόν σε φάση επίδειξης και χρησιμοποιεί δείγματα δεδομένων. Η πλήρης λειτουργικότητα παρακολούθησης θα ενεργοποιηθεί σύντομα." })}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <SettingsIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Customizing Settings", el: "Προσαρμογή Ρυθμίσεων" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-3">
                  <p>{t({ en: "Access the settings page to set default values for new offer sheets, such as your seller info, logo, default currency, and default terms.", el: "Αποκτήστε πρόσβαση στη σελίδα ρυθμίσεων για να ορίσετε προεπιλεγμένες τιμές για νέα δελτία προσφορών, όπως τα στοιχεία του πωλητή σας, το λογότυπο, το προεπιλεγμένο νόμισμα και τους προεπιλεγμένους όρους." })}</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <UserCircleIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Managing Your Profile & Subscription", el: "Διαχείριση Προφίλ & Συνδρομής" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8">
                  <p>{t({ en: "The Profile page allows you to view your account details and manage your subscription. You can upgrade, downgrade, or cancel your plan, and update your billing information through our secure payment partner, Stripe.", el: "Η σελίδα Προφίλ σας επιτρέπει να δείτε τα στοιχεία του λογαριασμού σας και να διαχειριστείτε τη συνδρομή σας. Μπορείτε να αναβαθμίσετε, να υποβαθμίσετε ή να ακυρώσετε το πλάνο σας και να ενημερώσετε τα στοιχεία χρέωσής σας μέσω του ασφαλούς συνεργάτη πληρωμών μας, Stripe." })}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <CreditCardIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Pricing Page", el: "Σελίδα Τιμολόγησης" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8">
                  <p>{t({ en: "The Pricing page displays available subscription plans. You can create an account to start a free 30-day trial of the Pro plan, or choose a plan that best fits your needs.", el: "Η σελίδα Τιμολόγησης εμφανίζει τα διαθέσιμα προγράμματα συνδρομής. Μπορείτε να δημιουργήσετε λογαριασμό για να ξεκινήσετε μια δωρεάν δοκιμή 30 ημερών του προγράμματος Pro ή να επιλέξετε ένα πρόγραμμα που ταιριάζει καλύτερα στις ανάγκες σας." })}</p>
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <PaletteIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Troubleshooting & Tips", el: "Αντιμετώπιση Προβλημάτων & Συμβουλές" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-2">
                  <p><strong>{t({ en: "Pop-ups:", el: "Αναδυόμενα παράθυρα:" })}</strong> {t({ en: "Ensure your browser allows pop-ups from this site for PDF downloads and email drafts to open correctly.", el: "Βεβαιωθείτε ότι το πρόγραμμα περιήγησής σας επιτρέπει αναδυόμενα παράθυρα από αυτόν τον ιστότοπο για να ανοίγουν σωστά οι λήψεις PDF και τα πρόχειρα email." })}</p>
                  <p><strong>{t({ en: "Local Storage:", el: "Τοπική Αποθήκευση:" })}</strong> {t({ en: "Offer sheets and settings are saved in your browser's local storage. This means data is specific to the browser you are using and won't automatically sync across different devices or browsers unless you manually export/import JSON data. Cloud sync for signed-in users is a planned feature.", el: "Τα δελτία προσφορών και οι ρυθμίσεις αποθηκεύονται στην τοπική αποθήκευση του προγράμματος περιήγησής σας. Αυτό σημαίνει ότι τα δεδομένα είναι συγκεκριμένα για το πρόγραμμα περιήγησης που χρησιμοποιείτε και δεν θα συγχρονίζονται αυτόματα σε διαφορετικές συσκευές ή προγράμματα περιήγησης. Ο συγχρονισμός στο cloud για συνδεδεμένους χρήστες είναι μια προγραμματισμένη λειτουργία." })}</p>
                   <p><strong>{t({ en: "Performance:", el: "Απόδοση:" })}</strong> {t({ en: "If the app feels slow, ensure your internet connection is stable. Complex offer sheets with many high-resolution images might take longer to process for PDF/JPEG generation.", el: "Εάν η εφαρμογή φαίνεται αργή, βεβαιωθείτε ότι η σύνδεσή σας στο διαδίκτυο είναι σταθερή. Πολύπλοκα δελτία προσφορών με πολλές εικόνες υψηλής ανάλυσης ενδέχεται να χρειαστούν περισσότερο χρόνο για επεξεργασία κατά τη δημιουργία PDF/JPEG." })}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <FileSignature className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Legal Information", el: "Νομικές Πληροφορίες" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-2">
                  <ul className="list-disc list-inside space-y-1 pl-4">
                     <li><Link href="/terms-of-service" className="text-primary hover:underline">{t({ en: "Terms of Service", el: "Όροι Παροχής Υπηρεσιών" })}</Link></li>
                     <li><Link href="/privacy-policy" className="text-primary hover:underline">{t({ en: "Privacy Policy", el: "Πολιτική Απορρήτου" })}</Link></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

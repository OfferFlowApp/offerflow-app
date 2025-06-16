
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
import { HelpCircle, LayoutDashboard, SettingsIcon, UserCircleIcon, ShoppingCartIcon, FileTextIcon, PlusCircleIcon, SaveIcon, Share2Icon, DownloadIcon, UploadIcon, PaletteIcon, ListChecksIcon, CreditCardIcon } from 'lucide-react';

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
                     <li><Link href="/pricing" className="text-primary hover:underline">{t({ en: "Pricing:", el: "Τιμολόγηση:" })}</Link> {t({ en: "View available plans (placeholder).", el: "Δείτε τα διαθέσιμα προγράμματα (placeholder)." })}</li>
                    <li><Link href="/settings" className="text-primary hover:underline">{t({ en: "Settings:", el: "Ρυθμίσεις:" })}</Link> {t({ en: "Customize default seller info, logo, currency, language, and terms.", el: "Προσαρμόστε τις προεπιλεγμένες πληροφορίες πωλητή, λογότυπο, νόμισμα, γλώσσα και όρους." })}</li>
                    <li><Link href="/profile" className="text-primary hover:underline">{t({ en: "Profile:", el: "Προφίλ:" })}</Link> {t({ en: "Manage your local user data (or account info if logged in).", el: "Διαχειριστείτε τα τοπικά δεδομένα χρήστη σας (ή πληροφορίες λογαριασμού εάν είστε συνδεδεμένοι)." })}</li>
                    <li>{t({ en: "Language Selector:", el: "Επιλογέας Γλώσσas:" })} {t({ en: "Change the application's display language.", el: "Αλλάξτε τη γλώσσα εμφάνισης της εφαρμογής." })}</li>
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
                    <p>{t({ en: "Enter your company's details (name, address, email, phone, ΓΕΜΗ). Upload your logo. You can set defaults in Settings.", el: "Εισαγάγετε τα στοιχεία της εταιρείας σας (όνομα, διεύθυνση, email, τηλέφωνο, ΓΕΜΗ). Ανεβάστε το λογότυπό σας. Μπορείτε να ορίσετε προεπιλογές στις Ρυθμίσεις." })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "2. Customer Information & Offer Validity", el: "2. Στοιχεία Πελάτη & Ισχύς Προσφοράς" })}</h4>
                    <p>{t({ en: "Fill in your client's details (name, company, contact info, VAT, ΓΕΜΗ, address). Choose the offer currency (EUR, USD, GBP) and set validity dates.", el: "Συμπληρώστε τα στοιχεία του πελάτη σας (όνομα, εταιρεία, στοιχεία επικοινωνίας, ΑΦΜ, ΓΕΜΗ, διεύθυνση). Επιλέξτε το νόμισμα της προσφοράς (EUR, USD, GBP) και ορίστε τις ημερομηνίες ισχύος." })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "3. Adding Products", el: "3. Προσθήκη Προϊόντων" })}</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>{t({ en: "Click 'Add Product'.", el: "Κάντε κλικ στο 'Προσθήκη Προϊόντος'." })}</li>
                      <li>{t({ en: "Enter title, quantity, original unit price (excluding VAT), and the discounted unit price.", el: "Εισαγάγετε τίτλο, ποσότητα, αρχική τιμή μονάδας (χωρίς ΦΠΑ) και την τιμή μονάδας με έκπτωση." })}</li>
                      <li>{t({ en: "'Discounted Price VAT Type': Choose if the discounted price you entered 'Excludes VAT' (it's a net price) or 'Includes VAT' (it's a gross price for that item).", el: "'Τύπος ΦΠΑ Τιμής με Έκπτωση': Επιλέξτε εάν η τιμή με έκπτωση που εισαγάγατε 'Χωρίς ΦΠΑ' (είναι καθαρή τιμή) ή 'Με ΦΠΑ' (είναι μικτή τιμή για αυτό το είδος)." })}</li>
                      <li>{t({ en: "Add a description and upload an image for each product.", el: "Προσθέστε περιγραφή και ανεβάστε εικόνα για κάθε προϊόν." })}</li>
                      <li>{t({ en: "Drag and drop products to reorder them.", el: "Σύρετε και αποθέστε προϊόντα για να αλλάξετε τη σειρά τους." })}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "4. Price Summary", el: "4. Σύνοψη Τιμών" })}</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>{t({ en: "The 'Prices include VAT' checkbox determines if the 'Discounted Unit Price' you entered for products is treated as VAT-inclusive *for the final total calculation* when adding VAT.", el: "Το πλαίσιο ελέγχου 'Οι τιμές περιλαμβάνουν ΦΠΑ' καθορίζει εάν η 'Τιμή Μονάδας με Έκπτωση' που εισαγάγατε για τα προϊόντα αντιμετωπίζεται ως συμπεριλαμβανομένου του ΦΠΑ *για τον τελικό υπολογισμό του συνόλου* κατά την προσθήκη του ΦΠΑ." })}</li>
                      <li>{t({ en: "Set the VAT Rate (e.g., 24 for 24%).", el: "Ορίστε το ποσοστό ΦΠΑ (π.χ., 24 για 24%)." })}</li>
                      <li>{t({ en: "Totals (Subtotal, VAT Amount, Grand Total) are calculated automatically.", el: "Τα σύνολα (Μερικό Σύνολο, Ποσό ΦΠΑ, Γενικό Σύνολο) υπολογίζονται αυτόματα." })}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "5. Notes / Terms & Conditions", el: "5. Σημειώσεις / Όροι & Προϋποθέσεις" })}</h4>
                    <p>{t({ en: "Add any specific notes, payment terms, or other conditions. You can set default terms in Settings.", el: "Προσθέστε τυχόν συγκεκριμένες σημειώσεις, όρους πληρωμής ή άλλες προϋποθέσεις. Μπορείτε να ορίσετε προεπιλεγμένους όρους στις Ρυθμίσεις." })}</p>
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
                      <li><DownloadIcon className="inline mr-1 h-4 w-4" /><strong>{t({ en: "JPEG (Page 1):", el: "JPEG (Σελίδα 1):" })}</strong> {t({ en: "Creates an image of the first page of your offer.", el: "Δημιουργεί μια εικόνα της πρώτης σελίδας της προσφοράς σας." })}</li>
                      <li><DownloadIcon className="inline mr-1 h-4 w-4" /><strong>{t({ en: "JSON Data:", el: "Δεδομένα JSON:" })}</strong> {t({ en: "Exports all offer data in JSON format, useful for backup or importing into another session/browser.", el: "Εξάγει όλα τα δεδομένα της προσφοράς σε μορφή JSON, χρήσιμο για δημιουργία αντιγράφων ασφαλείας ή εισαγωγή σε άλλη περίοδο λειτουργίας/πρόγραμμα περιήγησης." })}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "Sharing (Share Offer Button)", el: "Κοινοποίηση (Κουμπί Κοινοποίησης Προσφοράς)" })}</h4>
                    <p>{t({ en: "This attempts to use your device's native sharing capabilities (e.g., to share the PDF via Email, WhatsApp, Messenger). If direct sharing isn't supported or fails, it will download the PDF and open your default email client with a pre-filled draft. You'll then need to manually attach the downloaded PDF.", el: "Αυτό προσπαθεί να χρησιμοποιήσει τις ενσωματωμένες δυνατότητες κοινοποίησης της συσκευής σας (π.χ., για κοινοποίηση του PDF μέσω Email, WhatsApp, Messenger). Εάν η απευθείας κοινοποίηση δεν υποστηρίζεται ή αποτύχει, θα γίνει λήψη του PDF και θα ανοίξει το προεπιλεγμένο πρόγραμμα-πελάτη email σας με ένα προσυμπληρωμένο πρόχειρο. Στη συνέχεια, θα χρειαστεί να επισυνάψετε χειροκίνητα το ληφθέν PDF." })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">{t({ en: "Importing Data (Import Data Button)", el: "Εισαγωγή Δεδομένων (Κουμπί Εισαγωγής Δεδομένων)" })}</h4>
                    <p>{t({ en: "Allows you to load an offer sheet from a previously exported JSON file.", el: "Σας επιτρέπει να φορτώσετε ένα δελτίο προσφοράς από ένα προηγουμένως εξαγόμενο αρχείο JSON." })}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <SettingsIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Customizing Settings", el: "Προσαρμογή Ρυθμίσεων" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-3">
                  <p>{t({ en: "Access the settings page via the header link to set default values for new offer sheets:", el: "Αποκτήστε πρόσβαση στη σελίδα ρυθμίσεων μέσω του συνδέσμου στην κεφαλίδα για να ορίσετε προεπιλεγμένες τιμές για νέα δελτία προσφορών:" })}</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>{t({ en: "Branding & Seller Defaults:", el: "Προεπιλογές Επωνυμίας & Πωλητή:" })}</strong> {t({ en: "Set your default company logo, name, address, email, phone, and ΓΕΜΗ.", el: "Ορίστε το προεπιλεγμένο λογότυπο της εταιρείας σας, όνομα, διεύθυνση, email, τηλέφωνο και ΓΕΜΗ." })}</li>
                    <li><strong>{t({ en: "Localization:", el: "Τοπικοποίηση:" })}</strong> {t({ en: "Choose your preferred application language and default currency (EUR, USD, GBP) for new offers.", el: "Επιλέξτε την προτιμώμενη γλώσσα εφαρμογής και το προεπιλεγμένο νόμισμα (EUR, USD, GBP) για νέες προσφορές." })}</li>
                    <li><strong>{t({ en: "Default Content:", el: "Προεπιλεγμένο Περιεχόμενο:" })}</strong> {t({ en: "Set default terms and conditions text that will auto-populate in new offer sheets.", el: "Ορίστε προεπιλεγμένο κείμενο όρων και προϋποθέσεων που θα συμπληρώνεται αυτόματα σε νέα δελτία προσφορών." })}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <UserCircleIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Managing Your Profile", el: "Διαχείριση του Προφίλ σας" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8">
                  <p>{t({ en: "The Profile page allows you to save a display name or other notes locally in your browser. If user accounts are fully enabled and you are logged in, this page would show your account details.", el: "Η σελίδα Προφίλ σας επιτρέπει να αποθηκεύσετε ένα εμφανιζόμενο όνομα ή άλλες σημειώσεις τοπικά στο πρόγραμμα περιήγησής σας. Εάν οι λογαριασμοί χρηστών είναι πλήρως ενεργοποιημένοι και είστε συνδεδεμένοι, αυτή η σελίδα θα εμφανίζει τα στοιχεία του λογαριασμού σας." })}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <CreditCardIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Pricing Page", el: "Σελίδα Τιμολόγησης" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8">
                  <p>{t({ en: "The Pricing page displays available subscription plans. Currently, this section is for demonstration purposes.", el: "Η σελίδα Τιμολόγησης εμφανίζει τα διαθέσιμα προγράμματα συνδρομής. Προς το παρόν, αυτή η ενότητα είναι για λόγους επίδειξης." })}</p>
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <PaletteIcon className="mr-3 h-5 w-5 text-primary" />
                  {t({ en: "Troubleshooting & Tips", el: "Αντιμετώπιση Προβλημάτων & Συμβουλές" })}
                </AccordionTrigger>
                <AccordionContent className="text-base pl-8 space-y-2">
                  <p><strong>{t({ en: "Pop-ups:", el: "Αναδυόμενα παράθυρα:" })}</strong> {t({ en: "Ensure your browser allows pop-ups from this site for PDF downloads and email drafts to open correctly.", el: "Βεβαιωθείτε ότι το πρόγραμμα περιήγησής σας επιτρέπει αναδυόμενα παράθυρα από αυτόν τον ιστότοπο για να ανοίγουν σωστά οι λήψεις PDF και τα πρόχειρα email." })}</p>
                  <p><strong>{t({ en: "Local Storage:", el: "Τοπική Αποθήκευση:" })}</strong> {t({ en: "Offer sheets and settings are saved in your browser's local storage. This means data is specific to the browser you are using and won't automatically sync across different devices or browsers unless you manually export/import JSON data or a future cloud sync feature is implemented.", el: "Τα δελτία προσφορών και οι ρυθμίσεις αποθηκεύονται στην τοπική αποθήκευση του προγράμματος περιήγησής σας. Αυτό σημαίνει ότι τα δεδομένα είναι συγκεκριμένα για το πρόγραμμα περιήγησης που χρησιμοποιείτε και δεν θα συγχρονίζονται αυτόματα σε διαφορετικές συσκευές ή προγράμματα περιήγησης, εκτός εάν εξάγετε/εισάγετε χειροκίνητα δεδομένα JSON ή εφαρμοστεί μια μελλοντική λειτουργία συγχρονισμού cloud." })}</p>
                   <p><strong>{t({ en: "Performance:", el: "Απόδοση:" })}</strong> {t({ en: "If the app feels slow, ensure your internet connection is stable. Complex offer sheets with many high-resolution images might take longer to process for PDF/JPEG generation.", el: "Εάν η εφαρμογή φαίνεται αργή, βεβαιωθείτε ότι η σύνδεσή σας στο διαδίκτυο είναι σταθερή. Πολύπλοκα δελτία προσφορών με πολλές εικόνες υψηλής ανάλυσης ενδέχεται να χρειαστούν περισσότερο χρόνο για επεξεργασία κατά τη δημιουργία PDF/JPEG." })}</p>
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

    

    
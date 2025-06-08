
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { currentUser, loading, logOut } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
           <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
            <Skeleton className="h-10 w-48 mx-auto" />
          </h1>
          <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader>
              <CardTitle><Skeleton className="h-8 w-3/4" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground"><Skeleton className="h-4 w-16 mb-1" /></p>
                <p><Skeleton className="h-6 w-full" /></p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground"><Skeleton className="h-4 w-20 mb-1" /></p>
                <p><Skeleton className="h-6 w-full" /></p>
              </div>
               <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
     // This case should ideally be handled by the useEffect redirect,
     // but as a fallback:
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <p>{t({en: "Redirecting to login...", el: "Ανακατεύθυνση στη σύνδεση...", de: "Weiterleitung zur Anmeldung...", fr: "Redirection vers la connexion..."})}</p>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
          {t({en: "User Profile", el: "Προφίλ Χρήστη", de: "Benutzerprofil", fr: "Profil Utilisateur"})}
        </h1>
        <Card className="max-w-lg mx-auto shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t({en: "My Information", el: "Οι Πληροφορίες μου", de: "Meine Informationen", fr: "Mes Informations"})}</CardTitle>
            <CardDescription>{t({en: "View and manage your account details.", el: "Δείτε και διαχειριστείτε τις λεπτομέρειες του λογαριασμού σας.", de: "Sehen und verwalten Sie Ihre Kontodetails.", fr: "Consultez et gérez les détails de votre compte."})}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-b pb-4">
              <Label className="text-sm font-medium text-muted-foreground">{t({en: "Email Address", el: "Διεύθυνση Email", de: "E-Mail-Adresse", fr: "Adresse e-mail"})}</Label>
              <p className="text-lg">{currentUser.email}</p>
            </div>
            <div className="border-b pb-4">
              <Label className="text-sm font-medium text-muted-foreground">{t({en: "User ID", el: "Αναγνωριστικό Χρήστη", de: "Benutzer-ID", fr: "ID Utilisateur"})}</Label>
              <p className="text-sm break-all text-muted-foreground">{currentUser.uid}</p>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold mb-3">{t({en: "Account Management", el: "Διαχείριση Λογαριασμού", de: "Kontoverwaltung", fr: "Gestion du compte"})}</h3>
                <Button variant="outline" className="w-full mb-3" onClick={() => toast({title: t({en: "Not Implemented", el: "Δεν έχει υλοποιηθεί"})})}>
                    {t({en: "Change Password", el: "Αλλαγή Κωδικού", de: "Passwort ändern", fr: "Changer le mot de passe"})}
                </Button>
                <Button variant="destructive" className="w-full" onClick={logOut}>
                    {t({en: "Logout", el: "Αποσύνδεση", de: "Abmelden", fr: "Déconnexion"})}
                </Button>
            </div>

             <p className="text-xs text-muted-foreground pt-4 text-center">
              {t({en: "More profile settings (like updating display name, photo, etc.) can be added here.", el: "Περισσότερες ρυθμίσεις προφίλ (όπως ενημέρωση ονόματος εμφάνισης, φωτογραφίας κ.λπ.) μπορούν να προστεθούν εδώ.", de: "Weitere Profileinstellungen (wie Aktualisierung des Anzeigenamens, Fotos usw.) können hier hinzugefügt werden.", fr: "D'autres paramètres de profil (comme la mise à jour du nom d'affichage, de la photo, etc.) peuvent être ajoutés ici."})}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

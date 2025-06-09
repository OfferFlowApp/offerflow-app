
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
import { Label } from '@/components/ui/label'; // Keep for potential future use if local profile info is added

export default function ProfilePage() {
  const { currentUser, loading, logOut } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();

  // Removed useEffect redirecting to login, as login is disabled.
  // useEffect(() => {
  //   if (!loading && !currentUser) {
  //     router.push('/login');
  //   }
  // }, [currentUser, loading, router]);

  if (loading) { // This loading state might always be false now
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

  // With Firebase removed, currentUser will likely always be null.
  // Display a message indicating functionality is disabled.
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
            {t({en: "User Profile", el: "Προφίλ Χρήστη", de: "Benutzerprofil", fr: "Profil Utilisateur"})}
          </h1>
          <Card className="max-w-lg mx-auto shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t({en: "Profile Unavailable", el: "Προφίλ μη Διαθέσιμο", de: "Profil nicht verfügbar", fr: "Profil non disponible"})}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t({en: "User profile functionality is currently disabled as Firebase authentication has been removed.", el: "Η λειτουργικότητα προφίλ χρήστη είναι προς το παρόν απενεργοποιημένη καθώς η πιστοποίηση Firebase έχει αφαιρεθεί.", de: "Die Benutzerprofilfunktionalität ist derzeit deaktiviert, da die Firebase-Authentifizierung entfernt wurde.", fr: "La fonctionnalité de profil utilisateur est actuellement désactivée car l'authentification Firebase a été supprimée."})}
              </p>
              <Button onClick={() => router.push('/')} className="mt-6 w-full">
                {t({en: "Go to Homepage", el: "Μετάβαση στην Αρχική Σελίδα", de: "Zur Startseite", fr: "Aller à la page d'accueil"})}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // This part below will likely not be reached if currentUser is always null.
  // Kept for structure, but content should reflect disabled state if somehow reached.
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
          {t({en: "User Profile", el: "Προφίλ Χρήστη", de: "Benutzerprofil", fr: "Profil Utilisateur"})}
        </h1>
        <Card className="max-w-lg mx-auto shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t({en: "My Information (Disabled)", el: "Οι Πληροφορίες μου (Απενεργοποιημένο)", de: "Meine Informationen (Deaktiviert)", fr: "Mes Informations (Désactivé)"})}</CardTitle>
            <CardDescription>{t({en: "Firebase authentication is disabled.", el: "Η πιστοποίηση Firebase είναι απενεργοποιημένη.", de: "Firebase-Authentifizierung ist deaktiviert.", fr: "L'authentification Firebase est désactivée."})}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>{t({en: "User details are unavailable.", el: "Οι λεπτομέρειες χρήστη δεν είναι διαθέσιμες.", de: "Benutzerdetails sind nicht verfügbar.", fr: "Les détails de l'utilisateur ne sont pas disponibles."})}</p>
            <Button variant="destructive" className="w-full" onClick={logOut}>
                {t({en: "Logout", el: "Αποσύνδεση", de: "Abmelden", fr: "Déconnexion"})}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

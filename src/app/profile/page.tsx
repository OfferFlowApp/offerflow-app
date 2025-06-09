
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useToast } from "@/hooks/use-toast";
import type { LocalUserProfile } from '@/lib/types';
import { Save } from 'lucide-react';

const LOCAL_PROFILE_STORAGE_KEY = 'offerFlowLocalProfile';

export default function ProfilePage() {
  const { logOut } = useAuth(); // currentUser and loading might not be relevant for local profile
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [userCodes, setUserCodes] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem(LOCAL_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        try {
          const profile: LocalUserProfile = JSON.parse(storedProfile);
          setUsername(profile.username || '');
          setUserCodes(profile.userCodes || '');
        } catch (e) {
          console.error("Failed to parse local profile", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const handleSaveProfile = () => {
    if (typeof window !== 'undefined') {
      const profileToSave: LocalUserProfile = { username, userCodes };
      localStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, JSON.stringify(profileToSave));
      toast({
        title: t({ en: "Profile Saved", el: "Το Προφίλ Αποθηκεύτηκε", de: "Profil gespeichert", fr: "Profil Enregistré" }),
        description: t({ en: "Your local profile information has been updated.", el: "Οι πληροφορίες του τοπικού σας προφίλ ενημερώθηκαν.", de: "Ihre lokalen Profilinformationen wurden aktualisiert.", fr: "Vos informations de profil local ont été mises à jour." }),
        variant: "default",
      });
    }
  };
  
  const handleLogout = async () => {
    // logOut already shows a toast about Firebase being disabled and redirects
    await logOut(); 
    // Optionally, clear local profile data on logout
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem(LOCAL_PROFILE_STORAGE_KEY);
    //   setUsername('');
    //   setUserCodes('');
    // }
  };


  if (!isLoaded && typeof window !== 'undefined') { // Avoid SSR issues with localStorage access
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <p>{t({en: "Loading profile...", el: "Φόρτωση προφίλ...", de: "Profil wird geladen...", fr: "Chargement du profil..."})}</p>
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
          {t({en: "My Local Profile", el: "Το Τοπικό μου Προφίλ", de: "Mein lokales Profil", fr: "Mon Profil Local"})}
        </h1>
        <Card className="max-w-lg mx-auto shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t({en: "Edit Information", el: "Επεξεργασία Πληροφοριών", de: "Informationen bearbeiten", fr: "Modifier les Informations"})}</CardTitle>
            <CardDescription>{t({en: "This information is saved locally in your browser.", el: "Αυτές οι πληροφορίες αποθηκεύονται τοπικά στο πρόγραμμα περιήγησής σας.", de: "Diese Informationen werden lokal in Ihrem Browser gespeichert.", fr: "Ces informations sont enregistrées localement dans votre navigateur."})}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t({en: "Username", el: "Όνομα Χρήστη", de: "Benutzername", fr: "Nom d'utilisateur"})}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t({en: "Enter your desired username", el: "Εισαγάγετε το επιθυμητό όνομα χρήστη", de: "Geben Sie Ihren gewünschten Benutzernamen ein", fr: "Entrez le nom d'utilisateur souhaité"})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userCodes">{t({en: "My Codes/Notes", el: "Οι Κωδικοί/Σημειώσεις μου", de: "Meine Codes/Notizen", fr: "Mes Codes/Notes"})}</Label>
              <Textarea
                id="userCodes"
                value={userCodes}
                onChange={(e) => setUserCodes(e.target.value)}
                placeholder={t({en: "Store any codes or notes here...", el: "Αποθηκεύστε τυχόν κωδικούς ή σημειώσεις εδώ...", de: "Speichern Sie hier Codes oder Notizen...", fr: "Stockez ici des codes ou des notes..."})}
                rows={4}
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="mr-2 h-5 w-5" />
              {t({en: "Save Local Profile", el: "Αποθήκευση Τοπικού Προφίλ", de: "Lokales Profil speichern", fr: "Enregistrer le Profil Local"})}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
              {t({en: "Go to Homepage", el: "Μετάβαση στην Αρχική Σελίδα", de: "Zur Startseite", fr: "Aller à la page d'accueil"})}
            </Button>
             <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
                {t({en: "Logout (Account Disabled)", el: "Αποσύνδεση (Λογαριασμός Απενεργοποιημένος)", de: "Abmelden (Konto deaktiviert)", fr: "Déconnexion (Compte désactivé)"})}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

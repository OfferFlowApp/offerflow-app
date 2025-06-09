
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
import { Save, LogOut, UserCircle } from 'lucide-react'; // Added LogOut

const LOCAL_PROFILE_STORAGE_KEY = 'offerFlowLocalProfile';

export default function ProfilePage() {
  const { currentUser, logOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [userCodes, setUserCodes] = useState('');
  const [isLocalProfileLoaded, setIsLocalProfileLoaded] = useState(false);

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
      setIsLocalProfileLoaded(true);
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
    await logOut(); 
    // Navigation is handled within logOut
  };

  if (authLoading || (!isLocalProfileLoaded && typeof window !== 'undefined')) {
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
          {currentUser ? t({en: "My Profile", el: "Το Προφίλ μου", de: "Mein Profil", fr: "Mon Profil"}) : t({en: "My Local Profile", el: "Το Τοπικό μου Προφίλ", de: "Mein lokales Profil", fr: "Mon Profil Local"})}
        </h1>
        <Card className="max-w-lg mx-auto shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <UserCircle className="mr-2 h-7 w-7 text-primary" />
              {currentUser ? currentUser.email : t({en: "Local User", el: "Τοπικός Χρήστης", de: "Lokaler Benutzer", fr: "Utilisateur Local"})}
            </CardTitle>
            <CardDescription>
              {currentUser 
                ? t({en: "Manage your account details and local preferences.", el: "Διαχειριστείτε τα στοιχεία του λογαριασμού σας και τις τοπικές προτιμήσεις.", de: "Verwalten Sie Ihre Kontodetails und lokalen Präferenzen.", fr: "Gérez les détails de votre compte et vos préférences locales."}) 
                : t({en: "This information is saved locally in your browser.", el: "Αυτές οι πληροφορίες αποθηκεύονται τοπικά στο πρόγραμμα περιήγησής σας.", de: "Diese Informationen werden lokal in Ihrem Browser gespeichert.", fr: "Ces informations sont enregistrées localement dans votre navigateur."})}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t({en: "Display Name / Username", el: "Εμφανιζόμενο Όνομα / Όνομα Χρήστη", de: "Anzeigename / Benutzername", fr: "Nom d'affichage / Nom d'utilisateur"})}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t({en: "Enter your desired username", el: "Εισαγάγετε το επιθυμητό όνομα χρήστη", de: "Geben Sie Ihren gewünschten Benutzernamen ein", fr: "Entrez le nom d'utilisateur souhaité"})}
              />
              <p className="text-xs text-muted-foreground">{t({en: "This is saved locally in your browser.", el: "Αποθηκεύεται τοπικά στον περιηγητή σας."})}</p>
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
              <p className="text-xs text-muted-foreground">{t({en: "This is saved locally in your browser.", el: "Αποθηκεύεται τοπικά στον περιηγητή σας."})}</p>
            </div>
            <Button onClick={handleSaveProfile} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-5 w-5" />
              {t({en: "Save Local Preferences", el: "Αποθήκευση Τοπικών Προτιμήσεων", de: "Lokale Einstellungen speichern", fr: "Enregistrer les Préférences Locales"})}
            </Button>
            
            {currentUser && (
              <Button variant="destructive" className="w-full mt-4" onClick={handleLogout} disabled={authLoading}>
                <LogOut className="mr-2 h-5 w-5" />
                {authLoading ? t({en: "Logging out...", el: "Αποσύνδεση...", de: "Abmelden...", fr: "Déconnexion..."}) : t({en: "Logout", el: "Αποσύνδεση", de: "Abmelden", fr: "Déconnexion"})}
              </Button>
            )}
            {!currentUser && (
                 <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>
                    {t({en: "Login to Sync Profile", el: "Σύνδεση για Συγχρονισμό Προφίλ", de: "Zum Profilsynchronisieren anmelden", fr: "Se connecter pour synchroniser le profil"})}
                 </Button>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

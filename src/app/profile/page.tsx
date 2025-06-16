
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// useAuth can still be used to get loading state, currentUser will be null
import { useAuth } from '@/contexts/AuthContext'; 
import React, { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useToast } from "@/hooks/use-toast";
import type { LocalUserProfile } from '@/lib/types';
import { Save, UserCircle, Loader2 } from 'lucide-react';

const LOCAL_PROFILE_STORAGE_KEY = 'offerFlowLocalProfile';

export default function ProfilePage() {
  const { loading: authLoading } = useAuth(); // currentUser is always null
  const { t } = useLocalization();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [userCodes, setUserCodes] = useState('');
  const [isLocalProfileLoaded, setIsLocalProfileLoaded] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);


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
          // Initialize with empty strings if parsing fails
          setUsername('');
          setUserCodes('');
        }
      } else {
        // Initialize with empty strings if no profile is stored yet
        setUsername('');
        setUserCodes('');
      }
      setIsLocalProfileLoaded(true);
    }
  }, []);

  const handleSaveProfile = async () => {
    if (typeof window !== 'undefined') {
      setIsSavingProfile(true);
      try {
        // Simulate async operation for demo
        await new Promise(resolve => setTimeout(resolve, 300));
        const profileToSave: LocalUserProfile = { username, userCodes };
        localStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, JSON.stringify(profileToSave));
        toast({
          title: t({ en: "Local Profile Saved", el: "Το Τοπικό Προφίλ Αποθηκεύτηκε" }),
          description: t({ en: "Your information has been saved in this browser.", el: "Οι πληροφορίες σας αποθηκεύτηκαν σε αυτό το πρόγραμμα περιήγησης." }),
          variant: "default",
        });
      } catch (error) {
        toast({ title: t({en: "Save Error", el: "Σφάλμα Αποθήκευσης"}), description: t({en: "Could not save profile.", el: "Δεν ήταν δυνατή η αποθήκευση."}), variant: "destructive" });
      } finally {
        setIsSavingProfile(false);
      }
    }
  };
  
  if (authLoading || (!isLocalProfileLoaded && typeof window !== 'undefined')) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t({en: "Loading profile...", el: "Φόρτωση προφίλ..."})}</span>
          </div>
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
          {t({en: "My Local Profile", el: "Το Τοπικό μου Προφίλ"})}
        </h1>
        <Card className="max-w-lg mx-auto shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <UserCircle className="mr-2 h-7 w-7 text-primary" />
              {t({en: "Local User Data", el: "Τοπικά Δεδομένα Χρήστη"})}
            </CardTitle>
            <CardDescription>
              {t({en: "This information is saved locally in your browser and does not sync across devices. Online accounts are currently disabled.", el: "Αυτές οι πληροφορίες αποθηκεύονται τοπικά στο πρόγραμμα περιήγησής σας και δεν συγχρονίζονται μεταξύ συσκευών. Οι online λογαριασμοί είναι προσωρινά απενεργοποιημένοι."})}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t({en: "Display Name / Username", el: "Εμφανιζόμενο Όνομα / Όνομα Χρήστη"})}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t({en: "Enter your desired username", el: "Εισαγάγετε το επιθυμητό όνομα χρήστη"})}
                disabled={isSavingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userCodes">{t({en: "My Codes/Notes", el: "Οι Κωδικοί/Σημειώσεις μου"})}</Label>
              <Textarea
                id="userCodes"
                value={userCodes}
                onChange={(e) => setUserCodes(e.target.value)}
                placeholder={t({en: "Store any codes or notes here...", el: "Αποθηκεύστε τυχόν κωδικούς ή σημειώσεις εδώ..."})}
                rows={4}
                disabled={isSavingProfile}
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSavingProfile || authLoading}>
              {isSavingProfile ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {isSavingProfile ? t({en: "Saving...", el: "Αποθήκευση..."}) : t({en: "Save to This Browser", el: "Αποθήκευση σε Αυτόν τον Περιηγητή"})}
            </Button>
            {/* Logout and Login to Sync buttons are removed */}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

    
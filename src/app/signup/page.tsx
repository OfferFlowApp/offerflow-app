
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext'; // To be used when signUp function is implemented
import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const { signUpWithEmail } = useAuth(); // Uncomment when signUpWithEmail is implemented
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: t({en: "Passwords don't match!", el: "Οι κωδικοί δεν ταιριάζουν!", de: "Passwörter stimmen nicht überein!", fr: "Les mots de passe ne correspondent pas !"}), variant: 'destructive' });
      return;
    }
    toast({
      title: t({en: "Sign Up Not Implemented", el: "Η Εγγραφή δεν έχει Υλοποιηθεί", de: "Registrierung nicht implementiert", fr: "Inscription non implémentée"}),
      description: t({en: "Sign up functionality will be available soon.", el: "Η λειτουργία εγγραφής θα είναι σύντομα διαθέσιμη.", de: "Die Registrierungsfunktion wird in Kürze verfügbar sein.", fr: "La fonctionnalité d'inscription sera bientôt disponible."}),
      variant: "default",
    });
    // Example usage when implemented:
    // try {
    //   await signUpWithEmail(email, password);
    //   toast({ title: t({en: 'Account Created Successfully!', el: 'Ο Λογαριασμός Δημιουργήθηκε Επιτυχώς!'}) });
    //   router.push('/');
    // } catch (error: any) {
    //   toast({ title: t({en: 'Signup Failed', el: 'Η Εγγραφή Απέτυχε'}), description: error.message, variant: 'destructive' });
    // }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">{t({en: "Create Account", el: "Δημιουργία Λογαριασμού", de: "Konto erstellen", fr: "Créer un compte"})}</CardTitle>
            <CardDescription>{t({en: "Join OfferFlow today.", el: "Γίνετε μέλος του OfferFlow σήμερα.", de: "Treten Sie OfferFlow noch heute bei.", fr: "Rejoignez OfferFlow aujourd'hui."})}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t({en: "Email Address", el: "Διεύθυνση Email", de: "E-Mail-Adresse", fr: "Adresse e-mail"})}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t({en: "you@example.com", el: "you@example.com", de: "du@beispiel.com", fr: "vous@exemple.com"})}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t({en: "Password", el: "Κωδικός Πρόσβασης", de: "Passwort", fr: "Mot de passe"})}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t({en: "Confirm Password", el: "Επιβεβαίωση Κωδικού", de: "Passwort bestätigen", fr: "Confirmer le mot de passe"})}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {t({en: "Sign Up", el: "Εγγραφή", de: "Registrieren", fr: "S'inscrire"})}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t({en: "Already have an account?", el: "Έχετε ήδη λογαριασμό;", de: "Sie haben bereits ein Konto?", fr: "Vous avez déjà un compte ?"})}{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t({en: "Log in", el: "Σύνδεση", de: "Anmelden", fr: "Se connecter"})}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

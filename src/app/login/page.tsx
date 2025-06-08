
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
// import { useAuth } from '@/contexts/AuthContext'; // To be used when login function is implemented
import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const { signInWithEmail } = useAuth(); // Uncomment when signInWithEmail is implemented
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t({en: "Login Not Implemented", el: "Η Σύνδεση δεν έχει Υλοποιηθεί", de: "Anmeldung nicht implementiert", fr: "Connexion non implémentée"}),
      description: t({en: "Login functionality will be available soon.", el: "Η λειτουργία σύνδεσης θα είναι σύντομα διαθέσιμη.", de: "Die Anmeldefunktion wird in Kürze verfügbar sein.", fr: "La fonctionnalité de connexion sera bientôt disponible."}),
      variant: "default",
    });
    // Example usage when implemented:
    // try {
    //   await signInWithEmail(email, password);
    //   toast({ title: t({en: 'Logged In Successfully!', el: 'Επιτυχής Σύνδεση!'}) });
    //   router.push('/');
    // } catch (error: any) {
    //   toast({ title: t({en: 'Login Failed', el: 'Η Σύνδεση Απέτυχε'}), description: error.message, variant: 'destructive' });
    // }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">{t({en: "Login", el: "Σύνδεση", de: "Anmelden", fr: "Connexion"})}</CardTitle>
            <CardDescription>{t({en: "Access your OfferFlow account.", el: "Αποκτήστε πρόσβαση στον λογαριασμό σας OfferFlow.", de: "Greifen Sie auf Ihr OfferFlow-Konto zu.", fr: "Accédez à votre compte OfferFlow."})}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {t({en: "Login", el: "Σύνδεση", de: "Anmelden", fr: "Connexion"})}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t({en: "Don't have an account?", el: "Δεν έχετε λογαριασμό;", de: "Sie haben noch kein Konto?", fr: "Vous n'avez pas de compte ?"})}{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                {t({en: "Sign up", el: "Εγγραφή", de: "Registrieren", fr: "S'inscrire"})}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

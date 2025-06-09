
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Not strictly needed if login is disabled
// import { useAuth } from '@/contexts/AuthContext'; // Auth context might not have signInWithEmail anymore
import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  // const router = useRouter();
  const { t } = useLocalization();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t({en: "Login Disabled", el: "Η Σύνδεση είναι Απενεργοποιημένη", de: "Anmeldung deaktiviert", fr: "Connexion désactivée"}),
      description: t({en: "Firebase authentication is currently disabled.", el: "Η πιστοποίηση Firebase είναι προς το παρόν απενεργοποιημένη.", de: "Die Firebase-Authentifizierung ist derzeit deaktiviert.", fr: "L'authentification Firebase est actuellement désactivée."}),
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">{t({en: "Login", el: "Σύνδεση", de: "Anmelden", fr: "Connexion"})}</CardTitle>
            <CardDescription>{t({en: "Access your OfferFlow account. (Authentication currently disabled)", el: "Αποκτήστε πρόσβαση στον λογαριασμό σας OfferFlow. (Η πιστοποίηση είναι προς το παρόν απενεργοποιημένη)", de: "Greifen Sie auf Ihr OfferFlow-Konto zu. (Authentifizierung derzeit deaktiviert)", fr: "Accédez à votre compte OfferFlow. (Authentification actuellement désactivée)"})}</CardDescription>
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
                  disabled
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
                  disabled
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
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

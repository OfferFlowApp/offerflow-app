
"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalization } from '@/hooks/useLocalization';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { t } = useLocalization();
  const { signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(t({en: "Passwords do not match.", el: "Οι κωδικοί δεν ταιριάζουν."}));
      return;
    }
    try {
      const user = await signUpWithEmail(email, password);
      if (user) {
        // AuthContext will redirect via toast, or router.push('/') can be used here
        // router.push('/'); // Already handled by AuthContext
      } else {
         // Toast in AuthContext handles specific errors
        // setError(t({en: "Signup failed. Please try again.", el: "Η εγγραφή απέτυχε. Παρακαλώ προσπαθήστε ξανά."}));
      }
    } catch (err: any) {
      // This catch might be redundant if AuthContext handles all toast errors
      // setError(err.message || t({en: "An unexpected error occurred.", el: "Παρουσιάστηκε ένα μη αναμενόμενο σφάλμα."}));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold text-primary">{t({en: "Create Account", el: "Δημιουργία Λογαριασμού"})}</CardTitle>
            <CardDescription className="mt-2">
              {t({
                en: "Join OfferFlow to manage your offer sheets.",
                el: "Εγγραφείτε στο OfferFlow για να διαχειριστείτε τις προσφορές σας."
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t({en: "Email", el: "Email"})}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t({en: "Password", el: "Κωδικός Πρόσβασης"})}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t({en: "Confirm Password", el: "Επιβεβαίωση Κωδικού"})}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="text-base"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? t({en: "Creating account...", el: "Δημιουργία λογαριασμού..."}) : t({en: "Create Account", el: "Δημιουργία Λογαριασμού"})}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm">
              {t({en: "Already have an account?", el: "Έχετε ήδη λογαριασμό;"})}{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t({en: "Login", el: "Σύνδεση"})}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

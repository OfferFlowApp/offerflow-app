
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/useLocalization';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold text-primary">{t({en: "Account Creation Unavailable", el: "Η Δημιουργία Λογαριασμού δεν είναι Διαθέσιμη"})}</CardTitle>
            <CardDescription className="mt-2">
              {t({
                en: "User registration and online account features are currently disabled. Any settings or profile information will be saved locally to your browser.",
                el: "Η εγγραφή χρήστη και οι λειτουργίες online λογαριασμών είναι προσωρινά απενεργοποιημένες. Τυχόν ρυθμίσεις ή πληροφορίες προφίλ θα αποθηκεύονται τοπικά στον περιηγητή σας."
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/" passHref>
              <Button variant="outline" className="mt-4">
                {t({en: "Go to Homepage", el: "Μετάβαση στην Αρχική Σελίδα"})}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

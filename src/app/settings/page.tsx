import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DefaultLogoSettings from '@/components/settings/DefaultLogoSettings';
import SubscriptionSettings from '@/components/settings/SubscriptionSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center font-headline text-primary">
          Application Settings
        </h1>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Offer Sheet Prototype</CardTitle>
              <CardDescription>
                Set a default logo that will be automatically added to new offer sheets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultLogoSettings />
            </CardContent>
          </Card>

          <Separator />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Subscription & Billing</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionSettings />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

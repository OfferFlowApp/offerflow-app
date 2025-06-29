
"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, Eye, Target, Users, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { ChartConfig } from '@/components/ui/chart';

// --- MOCK DATA FOR DEMONSTRATION ---
const overviewChartData = [
  { name: 'Jan', views: 400, conversions: 24 },
  { name: 'Feb', views: 300, conversions: 13 },
  { name: 'Mar', views: 500, conversions: 48 },
  { name: 'Apr', views: 278, conversions: 39 },
  { name: 'May', views: 189, conversions: 18 },
  { name: 'Jun', views: 239, conversions: 38 },
];

const topProductsData = [
    { name: 'Premium Widget', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Standard Unit', value: 300, fill: 'hsl(var(--chart-2))' },
    { name: 'Basic Component', value: 300, fill: 'hsl(var(--chart-3))' },
    { name: 'Advanced Gizmo', value: 200, fill: 'hsl(var(--chart-4))' },
];

const overviewChartConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--primary))',
  },
  conversions: {
    label: 'Conversions',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

const topProductsConfig = {
    value: {
        label: "Interactions"
    },
    'Premium Widget': {
        label: "Premium Widget",
    },
    'Standard Unit': {
        label: "Standard Unit",
    },
    'Basic Component': {
        label: "Basic Component"
    },
    'Advanced Gizmo': {
        label: "Advanced Gizmo"
    }
} satisfies ChartConfig

export default function DashboardPage() {
  const { currentUser, currentEntitlements, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login?redirect=/dashboard');
    }
    
    if (!authLoading && currentUser && !currentEntitlements.canUseDashboard) {
        setShowUpgradeModal(true);
    }
  }, [currentUser, currentEntitlements, authLoading, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <LoadingSpinner className="h-12 w-12" />
        </main>
        <Footer />
      </div>
    );
  }

  if (showUpgradeModal) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                        <ShieldAlert className="mr-2 h-6 w-6" />
                        {t({en: "Upgrade to Business", el: "Αναβάθμιση σε Business"})}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{t({en: "The Analytics Dashboard is a Business plan feature.", el: "Ο Πίνακας Αναλυτικών είναι λειτουργία του Business πλάνου."})}</p>
                    <p className="text-sm text-muted-foreground">
                      {t({en: "Please upgrade your plan to the Business tier to access detailed offer performance analytics.", el: "Παρακαλώ αναβαθμίστε το πλάνο σας σε Business για πρόσβαση."})}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => router.push('/')}>{t({en: "Go to Home", el: "Αρχική"})}</Button>
                    <Button onClick={() => router.push('/pricing')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {t({en: "View Plans", el: "Δείτε τα Πλάνα"})}
                    </Button>
                </CardFooter>
            </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold font-headline text-primary">
            {t({en: "Analytics Dashboard", el: "Πίνακας Αναλυτικών"})}
          </h1>
          <p className="text-lg text-amber-600 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <strong>{t({en: "Please Note:", el: "Σημείωση:"})}</strong> {t({en: "This dashboard is currently for demonstration purposes using sample data. The full tracking functionality will be enabled soon.", el: "Αυτός ο πίνακας είναι για επίδειξη. Η πλήρης λειτουργικότητα θα ενεργοποιηθεί σύντομα."})}
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t({en: "Total Views", el: "Συνολικές Προβολές"})}</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345</div>
                <p className="text-xs text-muted-foreground">+20.1% {t({en: "from last month", el: "από τον προηγούμενο μήνα"})}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t({en: "Conversions", el: "Μετατροπές"})}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">+180.1% {t({en: "from last month", el: "από τον προηγούμενο μήνα"})}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t({en: "Conversion Rate", el: "Ποσοστό Μετατροπής"})}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.92%</div>
                <p className="text-xs text-muted-foreground">+0.5% {t({en: "from last month", el: "από τον προηγούμενο μήνα"})}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t({en: "Active Offers", el: "Ενεργές Προσφορές"})}</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">57</div>
                <p className="text-xs text-muted-foreground">+2 {t({en: "since last week", el: "από την προηγούμενη εβδομάδα"})}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>{t({en: "Performance Overview", el: "Επισκόπηση Απόδοσης"})}</CardTitle>
                <CardDescription>{t({en: "Offer views and conversions over the last 6 months.", el: "Προβολές και μετατροπές τους τελευταίους 6 μήνες."})}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={overviewChartConfig} className="h-[350px] w-full">
                    <BarChart data={overviewChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                        <Bar dataKey="conversions" fill="var(--color-conversions)" radius={4} />
                    </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>{t({en: "Top Performing Products", el: "Κορυφαία Προϊόντα"})}</CardTitle>
                <CardDescription>{t({en: "Products with the most interactions across all offers.", el: "Προϊόντα με τις περισσότερες αλληλεπιδράσεις."})}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                 <ChartContainer config={topProductsConfig} className="h-[350px] w-full">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie data={topProductsData} dataKey="value" nameKey="name" />
                    </PieChart>
                 </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

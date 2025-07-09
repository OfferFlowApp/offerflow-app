
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, Eye, Target, Users, ArrowUpRight, ShieldAlert, FileSpreadsheet, Euro } from 'lucide-react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

type KpiData = {
    totalOffers: { value: string, change: string };
    conversions: { value: string, change: string };
    conversionRate: { value: string, change: string };
    avgOfferValue: { value: string, change: string };
};

type AnalyticsData = {
    kpi: KpiData;
    overviewChartData: any[];
    topProductsData: any[];
};

// --- CHART CONFIGS (STATIC) ---
const overviewChartConfig = {
  created: {
    label: 'Created',
    color: 'hsl(var(--primary))',
  },
  exported: {
    label: 'Exported',
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

const AnalyticsSkeleton = () => (
    <div className="space-y-8">
      <Skeleton className="h-12 w-1/3" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Skeleton className="h-[350px] w-[350px] rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
);


export default function AnalyticsPage() {
  const { currentUser, currentEntitlements, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login?redirect=/analytics');
      return;
    }
    
    if (!authLoading && currentUser && !currentEntitlements.hasAnalytics) {
      setShowUpgradeModal(true);
      return;
    }

    if (currentUser) {
        const fetchData = async () => {
            setIsDataLoading(true);
            try {
                const token = await currentUser.getIdToken();
                const response = await fetch('/api/dashboard-data', { // This should be updated to a new /api/analytics endpoint
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const data: AnalyticsData = await response.json();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsDataLoading(false);
            }
        };
        fetchData();
    }
  }, [currentUser, currentEntitlements, authLoading, router]);

  if (authLoading || (!currentUser && !showUpgradeModal)) {
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
                    <p className="text-sm text-muted-foreground mb-4">{t({en: "The Analytics page is a Business plan feature.", el: "Η σελίδα Αναλυτικών είναι λειτουργία του Business πλάνου."})}</p>
                    <p className="text-sm text-muted-foreground">
                      {t({en: "Please upgrade your plan to the Business tier to access detailed offer performance analytics.", el: "Παρακαλώ αναβαθμίστε το πλάνο σας σε Business για πρόσβαση."})}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>{t({en: "Go to Dashboard", el: "Πίνακας Ελέγχου"})}</Button>
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
        {isDataLoading ? (
            <AnalyticsSkeleton />
        ) : !analyticsData ? (
            <div className="text-center">
                <p>{t({en: "Could not load analytics data.", el: "Δεν ήταν δυνατή η φόρτωση των δεδομένων."})}</p>
            </div>
        ) : (
            <div className="space-y-8">
                <h1 className="text-4xl font-bold font-headline text-primary">
                    {t({en: "Analytics", el: "Αναλυτικά"})}
                </h1>
                <p className="text-lg text-amber-600 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <strong>{t({en: "Please Note:", el: "Σημείωση:"})}</strong> {t({en: "The dashboard is now showing real data for 'Total Offers'. Other statistics are for demonstration as tracking functionality is being enabled.", el: "Αυτός ο πίνακας δείχνει πραγματικά δεδομένα για τις 'Συνολικές Προσφορές'. Άλλες στατιστικές είναι για επίδειξη."})}
                </p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t({en: "Total Offers Created", el: "Σύνολο Προσφορών"})}</CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.kpi.totalOffers.value}</div>
                            <p className="text-xs text-muted-foreground">{analyticsData.kpi.totalOffers.change}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t({en: "Conversions (Demo)", el: "Μετατροπές (Demo)"})}</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.kpi.conversions.value}</div>
                            <p className="text-xs text-muted-foreground">{analyticsData.kpi.conversions.change} {t({en: "from last month", el: "από τον προηγούμενο μήνα"})}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t({en: "Conversion Rate (Demo)", el: "Ποσοστό Μετατροπής (Demo)"})}</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.kpi.conversionRate.value}</div>
                            <p className="text-xs text-muted-foreground">{analyticsData.kpi.conversionRate.change} {t({en: "from last month", el: "από τον προηγούμενο μήνα"})}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t({en: "Avg. Offer Value (Demo)", el: "Μέση Αξία Προσφοράς (Demo)"})}</CardTitle>
                            <Euro className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.kpi.avgOfferValue.value}</div>
                            <p className="text-xs text-muted-foreground">{analyticsData.kpi.avgOfferValue.change} {t({en: "from last month", el: "από τον προηγούμενο μήνα"})}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t({en: "Performance Overview (Demo)", el: "Επισκόπηση Απόδοσης (Demo)"})}</CardTitle>
                        <CardDescription>{t({en: "Offers created vs. exported over the last 6 months.", el: "Δημιουργημένες vs. εξαγόμενες προσφορές τους τελευταίους 6 μήνες."})}</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={overviewChartConfig} className="h-[350px] w-full">
                            <BarChart data={analyticsData.overviewChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="created" fill="var(--color-created)" radius={4} />
                                <Bar dataKey="exported" fill="var(--color-exported)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t({en: "Top Performing Products (Demo)", el: "Κορυφαία Προϊόντα (Demo)"})}</CardTitle>
                        <CardDescription>{t({en: "Products with the most interactions across all offers.", el: "Προϊόντα με τις περισσότερες αλληλεπιδράσεις."})}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <ChartContainer config={topProductsConfig} className="h-[350px] w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={analyticsData.topProductsData} dataKey="value" nameKey="name" />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    </Card>
                </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

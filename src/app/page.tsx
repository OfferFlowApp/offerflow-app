
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, BarChart2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const GiorgarasLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 100 12"><path d="M10.8,0,5.4,12H10L13,5.3,16,12h4.6L15.2,0Z M28.7,0a5.8,5.8,0,0,0-6,6,5.8,5.8,0,0,0,6,6,5.8,5.8,0,0,0,6-6,5.8,5.8,0,0,0-6-6m0,9.5a3.5,3.5,0,0,1-3.5-3.5,3.5,3.5,0,0,1,3.5-3.5,3.5,3.5,0,0,1,3.5,3.5,3.5,3.5,0,0,1-3.5,3.5M44.5,0,40,12h4.5l1-3h5.8l1,3H57L52.5,0Zm-1.2,6.7,2-6,2,6Z M66.9,0,62,12h10V9.5H66.8l.8-2.4h4.3V4.7H68.4L67.6,0Z M84.5,0,79.6,12H84l2.2-5.3h5.5V12h4.5V0H92.2V4.7H86.7Z M98,0a6,6,0,0,0,0,12h2V0Z"/></svg>;

const RhodesincLogo = (props: React.SVGProps<SVGSVGElement>) => <div {...props}>RHODESINC</div>;
const VisualsRhoLogo = (props: React.SVGProps<SVGSVGElement>) => <div {...props}>VISUALS.RHO</div>;
const AlphaHustleLogo = (props: React.SVGProps<SVGSVGElement>) => <div {...props}>ALPHA HUSTLE CO</div>;
const DromeasLogo = (props: React.SVGProps<SVGSVGElement>) => <div {...props}>DROMEAS OFFICE DODECANESE</div>;
const MediaStromLogo = (props: React.SVGProps<SVGSVGElement>) => <div {...props}>MEDIA STROM RHO</div>;

export default function LandingPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner className="h-12 w-12" />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentUser) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative py-20 md:py-32 text-center overflow-hidden">
          <div 
            className="absolute inset-0 -z-10" 
            style={{backgroundImage: 'radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.1), transparent 50%)'}}
          ></div>
          <div className="container mx-auto px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60">
              Create and manage professional offer sheets.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Generate, customize, and share beautiful offer sheets in minutes. Streamline your sales process, reduce errors, and impress your clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link href="/signup">
                    Create New Offer Sheet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                    <Link href="/help">
                        Learn More
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50 dark:bg-gray-800/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                TRUSTED BY
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-12 gap-y-8 text-gray-500">
                  <RhodesincLogo className="h-6 text-gray-400 hover:text-gray-600 transition-colors uppercase font-medium tracking-wider" />
                  <AlphaHustleLogo className="h-6 text-gray-400 hover:text-gray-600 transition-colors uppercase font-medium tracking-wider" />
                  <GiorgarasLogo className="h-6 text-gray-400 hover:text-gray-600 transition-colors" />
                  <DromeasLogo className="h-6 text-gray-400 hover:text-gray-600 transition-colors uppercase font-medium tracking-wider" />
                  <MediaStromLogo className="h-6 text-gray-400 hover:text-gray-600 transition-colors uppercase font-medium tracking-wider" />
                  <VisualsRhoLogo className="h-6 text-gray-400 hover:text-gray-600 transition-colors uppercase font-medium tracking-wider" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold font-headline mb-4">Features Designed for Professionals</h2>
                    <p className="text-lg text-muted-foreground mb-12">
                        Everything you need to create winning proposals without the hassle.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="bg-card border rounded-lg p-6">
                        <FileText className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Dynamic Product Lists</h3>
                        <p className="text-muted-foreground">Easily add products with descriptions, images, and pricing. Totals are calculated automatically, saving you time and preventing errors.</p>
                    </div>
                    <div className="bg-card border rounded-lg p-6">
                        <BarChart2 className="h-8 w-8 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Cloud Sync & Analytics</h3>
                        <p className="text-muted-foreground">Save offers to the cloud and access them anywhere. Gain insights with our analytics dashboard to see which offers perform best.</p>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

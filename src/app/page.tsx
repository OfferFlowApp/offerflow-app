
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36"><path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.49,8.09C2.79,32.65-1.71,56.6.54,80.21A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.8-5.18,77,77,0,0,0,5.06-4.75,69.26,69.26,0,0,0,18.7,4.38,70.54,70.54,0,0,0,18.7-4.38,77.2,77.2,0,0,0,5.06,4.75,68.6,68.6,0,0,1-10.8,5.18,77.42,77.42,0,0,0,6.91,11.1A105.25,105.25,0,0,0,126.6,80.22c2.53-24-8.91-48-27.64-72.15ZM42.45,65.69C36.65,65.69,32,59.3,32,51.61S36.6,37.53,42.45,37.53a10.88,10.88,0,0,1,10.8,10.89C53.24,59.3,48.29,65.69,42.45,65.69Zm42.24,0C78.89,65.69,74.2,59.3,74.2,51.61S78.84,37.53,84.69,37.53A10.88,10.88,0,0,1,95.49,48.42C95.49,59.3,90.54,65.69,84.69,65.69Z"/></svg>
)

const InteractiveDemoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 3 9-3 9 19-9Z"/><path d="m22 6-3-3-3 3"/><path d="m22 18-3 3-3-3"/></svg>
)

const AmazonLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 100 30"><path d="M24.26,17.11a4.06,4.06,0,0,1-1.42-.26c-.3-.1-.58-.2-.88-.31L21.8,16c-1.63-.6-2.62-1.64-2.62-3.13,0-1.89,1.4-3.3,3.74-3.3,1,0,2.1.3,2.94.9E5,5,11,5,15c-1-1.3-2.5-2-4-2-2.3,0-4,1.8-4,4.2,0,2.9,2.5,4.3,5.1,4.3,1.6,0,3.2-.6,4.2-1.7v1.4h3.3V9.7c-2.4-1.2-5.1-1.8-8.1-1.8C5.8,7.9,2,11.2,2,16.2c0,5.1,4.4,8.9,10.1,8.9,3.1,0,6.2-1.3,8.2-3.6Z"/><path d="M53.6,18.5c0,4.2,3.3,5.6,5.3,5.6s3.3-1.4,3.3-3.1c0-2.3-3.7-2.6-6.1-3.2-3-.8-5.2-2.3-5.2-5.3,0-3.3,3.2-5.6,7.4-5.6,4.8,0,7.1,2.5,7.1,5.6H62c0-1.6-1.4-2.8-3.5-2.8-1.9,0-3.1,1.1-3.1,2.6,0,2,3.1,2.3,5.5,2.9,3.5,1,5.8,2.5,5.8,5.5,0,3.9-3.8,6-8.3,6-5.5,0-8.6-2.9-8.6-6.1Z"/><path d="M85.3,18.8a5,5,0,0,1-4.9-5,5,5,0,0,1,4.9-5,5,5,0,0,1,4.9,5,5,5,0,0,1-4.9,5m0-13.6c-4.9,0-8.3,3.4-8.3,8.6s3.4,8.6,8.3,8.6,8.3-3.4,8.3-8.6S90.2,5.2,85.3,5.2Z"/><path d="M96,25.1,99.8,7.9h3.4l-5.8,22.4H95l-5.8-22.4h3.4Z"/><path d="M37.7,13.8,40,21.9l2.2-8.1h3.2L40.9,25h-3L33.4,7.9h3.2Z"/><path d="M72,13.8,74.3,21.9,76.5,13.8h3.2L75.2,25h-3L67.7,7.9h3.2Z"/><path d="M96.3,16.4a16.3,16.3,0,0,0-5-1,3,3,0,0,0-2.3,1c-1.8,2.2-4.1,2.1-4.1,2.1l.6,2.6s2.6.5,4.3-1.4a3,3,0,0,1,2.6-.8,8.2,8.2,0,0,1,3.2.7,1.5,1.5,0,0,1,.8,1.3,2.4,2.4,0,0,1-2.2,2.4,10.6,10.6,0,0,1-4.3-.9,19.3,19.3,0,0,1-6.1-3.1c-1.6-1.2-2.5-2.7-2.5-4.4,0-3.2,2.4-5.6,6-5.6a13.9,13.9,0,0,1,11,5.2,1,1,0,0,1,0,1.4.7.7,0,0,1-1.1.1Z"/></svg>

const NetflixLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 100 27"><path d="M14.2,26.2V.6H0V27H14.2Z M28.4.6V27H42V.6H28.4Zm57.4,0-14.2,26.4h14.2V.6h14.2V27h-14.2Z M56.8.6,42.6,27h14.2V.6Z"/></svg>

const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 20 24"><path d="M16.2,12.2a4,4,0,0,1-2.4,3.7,4.1,4.1,0,0,1,2.5,3.7,4.3,4.3,0,0,1-4.6,4.3,4.4,4.4,0,0,1-4.6-4.3,3.9,3.9,0,0,1,2.6-3.7A4.2,4.2,0,0,1,7.2,8.5,4.6,4.6,0,0,1,11.8,4a4.1,4.1,0,0,1,3.4,1.7A3.8,3.8,0,0,0,18.4,4,3.8,3.8,0,0,0,15.2,0a8.1,8.1,0,0,0-7.3,4.6A8.5,8.5,0,0,0,0,12.2,8.4,8.4,0,0,0,8,20.1a8.1,8.1,0,0,0,8.2-7.9Z M12.2,2.8A3.8,3.8,0,0,1,11.7,4,4,4,0,0,1,8.9,6.7,3.6,3.6,0,0,1,9.5,5.2,4.1,4.1,0,0,1,12.2,2.8Z"/></svg>

const NvidiaLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 100 16"><path d="M99.6,7.6,90,1.8a2.5,2.5,0,0,0-2.4,0L78,7.6V2.3a.6.6,0,0,0-.6-.6H71a.6.6,0,0,0-.6.6V13a.6.6,0,0,0,.6.6H78A.6.6,0,0,0,78.6,13V8.4l11.4,7a2.1,2.1,0,0,0,2.4,0l9.6-5.8V13a.6.6,0,0,0,.6.6h6.4a.6.6,0,0,0,.6-.6V2.3a.6.6,0,0,0-.6-.6h-6.4a.6.6,0,0,0-.6.6ZM87.6,7.2,81,11V2.8l6.6,4Z M52.5.5h-5L35,14.6a.4.4,0,0,0,.4.6h4.5a.4.4,0,0,0,.4-.3l2-5.4a.4.4,0,0,1,.4-.3h6.5a.4.4,0,0,1,.4.3L56,15a.4.4,0,0,0,.4.3H61a.4.4,0,0,0,.4-.6Zm-8,7.3L47,1.8h.6l4.2,6Z M31.5,1.7H25a.6.6,0,0,0-.6.6V15.4h7.2a.6.6,0,0,0,.6-.6V7.4A5.7,5.7,0,0,0,26.4,1.7Zm-1.2,11V4.9a3.1,3.1,0,0,1,3.2,2.5V10a3.1,3.1,0,0,1-3.2,2.7Z M19.4.5h-5L1.8,14.6a.4.4,0,0,0,.4.6H11a.4.4,0,0,0,.4-.3L13,9.5a.4.4,0,0,1,.4-.3h6.5a.4.4,0,0,1,.4.3L23,15a.4.4,0,0,0,.4.3h4.5a.4.4,0,0,0,.4-.6Zm-8,7.3L14,1.8h.6l4.2,6Z M67.5,1.7a.6.6,0,0,0-.6.6V15.4h7.2a.6.6,0,0,0,.6-.6V2.3a.6.6,0,0,0-.6-.6ZM71,13V4.9h.6V13Z"/></svg>

const TeslaLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 100 13"><path d="M13,0,6.5,12.9h13Z M39,0V12.9h13V10.4H45.5V0Z M52,0l6.5,12.9h13L65,0Z M80.5,0V12.9H93.4V10.4H87V7.8h5.2V5.2H87V2.6h6.5V0Z M0,0V2.6H13V0Z M26,0V12.9h13V10.4H32.5V0Z"/></svg>

const RobloxLogo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 100 28"><path d="M41.4,0,0,7.3V20.7L41.4,28,82.9,20.7V7.3Z M64,13l-1.3,4.9-19.4.1L42,22.8,20.3,18.1,21,15.4l22.2,4.8,1.3-4.7,19.2-.1Z"/></svg>

export default function LandingPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
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
    <div className="flex flex-col min-h-screen bg-background dark">
      <Header />
      <main className="flex-grow">
        <section className="relative py-20 md:py-32 text-center overflow-hidden">
          <div 
            className="absolute inset-0 -z-10" 
            style={{backgroundImage: 'radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.15), transparent 40%)'}}
          ></div>
          <div className="container mx-auto px-4 z-10">
            <Link href="#" className="inline-flex items-center justify-center gap-2 bg-muted/50 text-foreground py-1 px-3 rounded-full text-sm mb-6 hover:bg-muted/75 transition-colors">
                <DiscordIcon className="h-4 w-4 text-[#7289da]"/>
                <span>Join our Discord community</span>
                <ArrowRight className="h-4 w-4" />
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              Instant Codebase Clarity
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              You spend half your day reading code. Our codebase maps help you ship features faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base bg-white text-black hover:bg-gray-200">
                  <Link href="/signup">
                    <Code className="mr-2 h-5 w-5" />
                    VS Code Extension
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="text-base">
                    <Link href="#">
                        <InteractiveDemoIcon className="mr-2 h-5 w-5" />
                        Interactive Demo
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
                Trusted by engineers at:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 gap-y-6 text-gray-500">
                <AmazonLogo className="h-5 text-gray-400 hover:text-white transition-colors"/>
                <NetflixLogo className="h-5 text-gray-400 hover:text-white transition-colors"/>
                <AppleLogo className="h-6 text-gray-400 hover:text-white transition-colors"/>
                <NvidiaLogo className="h-4 text-gray-400 hover:text-white transition-colors"/>
                <TeslaLogo className="h-3 text-gray-400 hover:text-white transition-colors"/>
                <RobloxLogo className="h-6 text-gray-400 hover:text-white transition-colors"/>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

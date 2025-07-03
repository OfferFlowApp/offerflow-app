
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProviders from '@/components/layout/AppProviders';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider
import TopProgressBar from '@/components/layout/TopProgressBar';
import SupportChat from '@/components/layout/SupportChat';

export const metadata: Metadata = {
  title: 'OfferFlow App',
  description: 'Create and manage professional offer sheets.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#3F51B5" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <AuthProvider> {/* Wrap AppProviders with AuthProvider */}
          <AppProviders>
            <TopProgressBar />
            {children}
            <Toaster />
            <SupportChat />
          </AppProviders>
        </AuthProvider>
      </body>
    </html>
  );
}

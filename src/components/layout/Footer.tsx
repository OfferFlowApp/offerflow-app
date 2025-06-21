import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold">
            <span className="text-primary">Offer</span><span className="text-accent">Flow</span>
          </span>
          <span>
            © {new Date().getFullYear()} OfferFlow. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms-of-service" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-center gap-2 md:h-24 md:flex-row md:justify-start">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* User TODO: Create an image named e.g. offerflow-icon.png in /public and update src below */}
          <Image src="https://placehold.co/20x20.png" alt="OfferFlow Mini Logo" width={20} height={20} data-ai-hint="logo icon" />
          <span>
            © {new Date().getFullYear()} OfferFlow. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

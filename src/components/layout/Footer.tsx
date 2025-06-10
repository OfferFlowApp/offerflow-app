
// import Image from 'next/image'; // Removed Image import

export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-center gap-2 md:h-24 md:flex-row md:justify-start">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* Replaced Image with text */}
          <span className="font-semibold text-primary">Giorgaras Furniture</span>
          <span>
            © {new Date().getFullYear()} OfferFlow. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

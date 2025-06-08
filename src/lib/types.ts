
export type Currency = 'EUR' | 'USD' | 'GBP';
export type Language = 'en' | 'el' | 'de' | 'fr';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  title: string;
  originalPrice: number; // Assumed to be VAT-exclusive
  discountedPrice: number;
  discountedPriceType?: 'exclusive' | 'inclusive'; // How to interpret discountedPrice regarding VAT
  description: string;
  imageUrl?: string;
}

export interface CustomerInfo {
  name: string;
  company: string;
  contact: string;
}

export interface OfferSheetData {
  logoUrl?: string;
  customerInfo: CustomerInfo;
  validityStartDate?: Date;
  validityEndDate?: Date;
  products: Product[];
  termsAndConditions: string;
  currency: Currency;
  defaultLogoUrl?: string;
  vatRate?: number; // User-defined VAT rate for the whole offer sheet (percentage)
}

export interface SettingsData {
  defaultLogoUrl?: string;
  defaultCurrency?: Currency;
  preferredLanguage?: Language;
}

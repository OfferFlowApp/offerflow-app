export type Currency = 'EUR' | 'USD' | 'GBP';
export type Language = 'en' | 'el';

export interface Product {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
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
  currency: Currency; // Added currency
  defaultLogoUrl?: string; // For prototype feature
}

export interface SettingsData {
  defaultLogoUrl?: string;
  defaultCurrency?: Currency; // Added default currency
  preferredLanguage?: Language; // Added preferred language
}

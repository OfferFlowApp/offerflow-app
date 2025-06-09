
export type Currency = 'EUR' | 'USD' | 'GBP';
export type Language = 'en' | 'el' | 'de' | 'fr';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  title: string;
  quantity: number; // New field
  originalPrice: number; // Assumed to be VAT-exclusive UNIT price
  discountedPrice: number; // Assumed to be VAT-exclusive UNIT price
  discountedPriceType?: 'exclusive' | 'inclusive'; // How to interpret discountedPrice regarding VAT - Note: This might be less relevant if prices are unit based now.
  description: string;
  imageUrl?: string;
}

export interface CustomerInfo {
  name: string;
  company: string;
  contact: string;
  vatNumber?: string; // Added from PDF mock
  address?: string; // Added from PDF mock
  phone2?: string; // Added from PDF mock
}

export interface SellerInfo {
  name: string;
  address: string;
  contact: string;
  logoUrl?: string; // This seems to be what `offerData.logoUrl` was for.
  // Add other fields like VAT number if needed for seller
}

export interface OfferSheetData {
  customerInfo: CustomerInfo;
  sellerInfo: SellerInfo; // New field, replaces top-level logoUrl effectively
  validityStartDate?: Date;
  validityEndDate?: Date;
  products: Product[];
  termsAndConditions: string;
  currency: Currency;
  vatRate?: number; // User-defined VAT rate for the whole offer sheet (percentage)
  // defaultLogoUrl is for settings, not this data structure directly
}

export interface SettingsData {
  defaultLogoUrl?: string; // This is the SELLER's default logo
  defaultSellerInfo?: Partial<SellerInfo>;
  defaultCurrency?: Currency;
  preferredLanguage?: Language;
}

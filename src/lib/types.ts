
export type Currency = 'EUR';
export type Language = 'en' | 'el';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  title: string;
  quantity: number;
  originalPrice: number; 
  discountedPrice: number; 
  discountedPriceType: 'exclusive' | 'inclusive';
  description: string;
  imageUrl?: string;
}

export interface CustomerInfo {
  name: string;
  company: string;
  contact: string; 
  vatNumber?: string; 
  address?: string; 
  phone2?: string; 
  gemhNumber?: string;
}

export interface SellerInfo {
  name: string;
  address: string;
  email?: string; 
  phone?: string; 
  logoUrl?: string; 
  gemhNumber?: string;
}

export interface OfferSheetData {
  customerInfo: CustomerInfo;
  sellerInfo: SellerInfo; 
  validityStartDate?: Date;
  validityEndDate?: Date;
  products: Product[];
  termsAndConditions: string;
  currency: Currency;
  vatRate?: number; 
  isFinalPriceVatInclusive?: boolean; // Added new field
}

export interface LocalUserProfile {
  username?: string;
  userCodes?: string; 
}

export interface SettingsData {
  defaultLogoUrl?: string; 
  defaultSellerInfo?: Partial<SellerInfo>;
  defaultCurrency?: Currency;
  preferredLanguage?: Language;
  localProfile?: LocalUserProfile; 
}


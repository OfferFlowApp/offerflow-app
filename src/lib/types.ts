
export type Currency = 'EUR';
export type Language = 'en' | 'el';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  title: string;
  quantity: number;
  originalPrice: number; 
  discountedPrice: number; 
  discountedPriceType?: 'exclusive' | 'inclusive'; 
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
}

export interface SellerInfo {
  name: string;
  address: string;
  contact: string;
  logoUrl?: string; 
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
}

export interface LocalUserProfile {
  username?: string;
  userCodes?: string; // For storing some codes or notes
}

export interface SettingsData {
  defaultLogoUrl?: string; 
  defaultSellerInfo?: Partial<SellerInfo>;
  defaultCurrency?: Currency;
  preferredLanguage?: Language;
  localProfile?: LocalUserProfile; // Can store the local profile here too if combined
}

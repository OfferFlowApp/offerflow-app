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
  defaultLogoUrl?: string; // For prototype feature
}

export interface SettingsData {
  defaultLogoUrl?: string;
}

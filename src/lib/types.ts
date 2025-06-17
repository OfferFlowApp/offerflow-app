
export type Currency = 'EUR' | 'USD' | 'GBP';
export type Language = 'en' | 'el';
export type Theme = 'light' | 'dark';

export type PlanId = 'free' | 'pro' | 'business';

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
  id?: string; // For saving/reusing customers
  name: string;
  company: string;
  contact: string; 
  vatNumber?: string; 
  address?: string; 
  phone2?: string; 
  gemhNumber?: string;
  notes?: string; // For Pro/Business saved customers
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
  id?: string; // To identify the offer sheet itself
  customerInfo: CustomerInfo;
  sellerInfo: SellerInfo; 
  validityStartDate?: Date;
  validityEndDate?: Date;
  products: Product[];
  termsAndConditions: string;
  currency: Currency;
  vatRate?: number; 
  isFinalPriceVatInclusive?: boolean;
  // Fields for plan tracking if needed directly on offer
  // createdByPlan?: PlanId; 
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
  defaultTermsAndConditions?: string;
}

// Subscription and Entitlements
export interface PlanEntitlements {
  maxOfferSheetsPerMonth: number | 'unlimited';
  canUseCustomBranding: boolean;
  canRemoveWatermark: boolean;
  canSaveTemplates: boolean; // Pro and up
  canSaveCustomers: boolean; // Pro and up
  canUseDashboard: boolean; // Pro and up
  allowedExportFormats: ('pdf' | 'jpeg' | 'json' | 'csv' | 'excel')[];
  maxTeamMembers: number; // 1 for Free/Pro, 4 for Business
  hasAnalytics: boolean; // Business
  prioritySupportLevel: 'basic' | 'standard' | 'priority';
}

export interface UserSubscription {
  planId: PlanId;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'free'; // 'free' for users without a paid plan
  currentPeriodStart?: number; // Timestamp (ms)
  currentPeriodEnd?: number; // Timestamp (ms)
  offersCreatedThisPeriod?: number;
  // Stripe specific fields (optional, for future use)
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  // Entitlements will be derived from planId mostly, but can be overridden
  entitlements?: Partial<PlanEntitlements>; 
}

export interface PricingPlanDetails {
  id: PlanId;
  nameKey: { en: string; el: string };
  priceKey: { en: string; el: string };
  priceSuffixKey?: { en: string; el: string };
  descriptionKey: { en: string; el: string };
  features: {
    key?: string; // for unique key in map
    textKey: { en: string; el: string };
    available: boolean; // true if available in this plan, false if it's a "not available" feature
    icon?: 'check' | 'x' | 'info'; // To show checkmark, cross, or info icon
  }[];
  buttonTextKey: { en: string; el: string };
  isFeatured?: boolean;
  entitlements: PlanEntitlements;
}

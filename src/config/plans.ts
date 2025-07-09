
import type { PricingPlanDetails, PlanId, PlanEntitlements } from '@/lib/types';

const defaultEntitlements: PlanEntitlements = {
  maxOfferSheetsPerMonth: 0,
  canUseCustomBranding: false,
  canRemoveWatermark: false,
  canReplaceHeaderLogo: false,
  canSaveTemplates: false,
  canSaveCustomers: false,
  canUseDashboard: false,
  allowedExportFormats: [],
  maxTeamMembers: 0,
  hasAnalytics: false,
  prioritySupportLevel: 'basic',
};

const proEntitlements: PlanEntitlements = {
  maxOfferSheetsPerMonth: 'unlimited',
  canUseCustomBranding: true,
  canRemoveWatermark: true,
  canReplaceHeaderLogo: false,
  canSaveTemplates: true,
  canSaveCustomers: true,
  canUseDashboard: false,
  allowedExportFormats: ['pdf', 'jpeg', 'json'],
  maxTeamMembers: 1,
  hasAnalytics: false,
  prioritySupportLevel: 'standard',
};

const businessEntitlements: PlanEntitlements = {
  maxOfferSheetsPerMonth: 'unlimited',
  canUseCustomBranding: true,
  canRemoveWatermark: true,
  canReplaceHeaderLogo: true, // Business users can replace the header logo
  canSaveTemplates: true,
  canSaveCustomers: true,
  canUseDashboard: true,
  allowedExportFormats: ['pdf', 'jpeg', 'json', 'csv'],
  maxTeamMembers: 4,
  hasAnalytics: true,
  prioritySupportLevel: 'priority',
};

export const PLANS: Record<PlanId, PricingPlanDetails> = {
  'none': {
    id: 'none',
    nameKey: { en: 'Free', el: 'Δωρεάν' },
    priceKey: { en: '€0', el: '€0' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: '', el: '' },
    features: [
        { textKey: { en: '1 Offer Sheet', el: '1 Δελτίο Προσφοράς' } },
        { textKey: { en: 'Standard PDF Export', el: 'Standard Εξαγωγή PDF' } },
        { textKey: { en: 'Email Support', el: 'Υποστήριξη Email' } },
    ],
    buttonTextKey: { en: 'Choose Plan', el: 'Επιλογή Προγράμματος' },
    entitlements: {
      ...defaultEntitlements,
      maxOfferSheetsPerMonth: 1, // Allow 1 free offer to try it out
      allowedExportFormats: ['pdf'],
    },
  },
  'pro-monthly': {
    id: 'pro-monthly',
    nameKey: { en: 'Pro', el: 'Pro' },
    priceKey: { en: '€7.98', el: '€7.98' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For individual professionals.', el: 'Για μεμονωμένους επαγγελματίες.' },
    features: [
        { textKey: { en: 'Unlimited Offer Sheets', el: 'Απεριόριστα Δελτία Προσφορών' } },
        { textKey: { en: 'Custom Logo & Branding', el: 'Προσαρμοσμένο Λογότυπο & Επωνυμία' } },
        { textKey: { en: 'Save & Reuse Templates', el: 'Αποθήκευση & Επαναχρησιμοποίηση Προτύπων' } },
        { textKey: { en: 'Save & Manage Customers', el: 'Αποθήκευση & Διαχείριση Πελατών' } },
        { textKey: { en: 'PDF, JPEG, JSON Export', el: 'Εξαγωγή PDF, JPEG, JSON' } },
    ],
    buttonTextKey: { en: 'Get Pro', el: 'Απόκτηση Pro' },
    isFeatured: true,
    entitlements: proEntitlements,
    stripePriceId: 'price_1RcYqTGxDVvbchhpdQw7awbM' 
  },
  'pro-yearly': {
    id: 'pro-yearly',
    nameKey: { en: 'Pro', el: 'Pro' },
    priceKey: { en: '€83.79', el: '€83.79' },
    priceSuffixKey: { en: '/ year', el: '/ έτος' },
    descriptionKey: { en: 'For individual professionals.', el: 'Για μεμονωμένους επαγγελματίες.' },
     features: [
        { textKey: { en: 'Unlimited Offer Sheets', el: 'Απεριόριστα Δελτία Προσφορών' } },
        { textKey: { en: 'Custom Logo & Branding', el: 'Προσαρμοσμένο Λογότυπο & Επωνυμία' } },
        { textKey: { en: 'Save & Reuse Templates', el: 'Αποθήκευση & Επαναχρησιμοποίηση Προτύπων' } },
        { textKey: { en: 'Save & Manage Customers', el: 'Αποθήκευση & Διαχείριση Πελατών' } },
        { textKey: { en: 'PDF, JPEG, JSON Export', el: 'Εξαγωγή PDF, JPEG, JSON' } },
    ],
    buttonTextKey: { en: 'Get Pro', el: 'Απόκτηση Pro' },
    isFeatured: true,
    entitlements: proEntitlements,
    stripePriceId: 'price_1RcZ5VGxDVvbchhpXseQQ1qV' 
  },
  'business-monthly': {
    id: 'business-monthly',
    nameKey: { en: 'Business', el: 'Business' },
    priceKey: { en: '€38.98', el: '€38.98' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For growing teams and businesses.', el: 'Για αναπτυσσόμενες ομάδες και επιχειρήσεις.' },
    features: [
        { textKey: { en: 'Everything in Pro Plan', el: 'Όλα όσα περιλαμβάνει το Pro' } },
        { textKey: { en: 'Replace Header Logo', el: 'Αντικατάσταση Λογοτύπου Κεφαλίδας' } },
        { textKey: { en: 'Excel/CSV Export Options', el: 'Επιλογές Εξαγωγής Excel/CSV' } },
        { textKey: { en: 'Performance Analytics', el: 'Αναλυτικά Στοιχεία Απόδοσης' } },
        { textKey: { en: 'Priority Support (24h)', el: 'Υποστήριξη κατά Προτεραιότητα (24h)' } },
    ],
    buttonTextKey: { en: 'Get Business', el: 'Απόκτηση Business' },
    entitlements: businessEntitlements,
    stripePriceId: 'price_1RcYuxGxDVvbchhpjUS5jpM9' 
  },
  'business-yearly': {
    id: 'business-yearly',
    nameKey: { en: 'Business', el: 'Business' },
    priceKey: { en: '€389.80', el: '€389.80' },
    priceSuffixKey: { en: '/ year', el: '/ έτος' },
    descriptionKey: { en: 'For growing teams and businesses.', el: 'Για αναπτυσσόμενες ομάδες και επιχειρήσεις.' },
    features: [
        { textKey: { en: 'Everything in Pro Plan', el: 'Όλα όσα περιλαμβάνει το Pro' } },
        { textKey: { en: 'Replace Header Logo', el: 'Αντικατάσταση Λογοτύπου Κεφαλίδας' } },
        { textKey: { en: 'Excel/CSV Export Options', el: 'Επιλογές Εξαγωγής Excel/CSV' } },
        { textKey: { en: 'Performance Analytics', el: 'Αναλυτικά Στοιχεία Απόδοσης' } },
        { textKey: { en: 'Priority Support (24h)', el: 'Υποστήριξη κατά Προτεραιότητα (24h)' } },
    ],
    buttonTextKey: { en: 'Get Business', el: 'Απόκτηση Business' },
    entitlements: businessEntitlements,
    stripePriceId: 'price_1RcZHOGxDVvbchhpxW5LE71u'
  },
};

export const getPlanDetails = (planId: PlanId | undefined | null): PricingPlanDetails => {
  return PLANS[planId || 'none'] || PLANS.none;
};

export const getEntitlements = (planId: PlanId | undefined | null): PlanEntitlements => {
  return getPlanDetails(planId).entitlements;
};

export const isPaidUser = (planId: PlanId | undefined | null): boolean => {
  if (!planId || planId === 'none') return false;
  return true;
};


import type { PricingPlanDetails, PlanId, PlanEntitlements } from '@/lib/types';

const defaultEntitlements: PlanEntitlements = {
  maxOfferSheetsPerMonth: 0,
  canUseCustomBranding: false,
  canRemoveWatermark: false,
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
  canSaveTemplates: true,
  canSaveCustomers: true,
  canUseDashboard: true,
  allowedExportFormats: ['pdf', 'jpeg', 'json'],
  maxTeamMembers: 1,
  hasAnalytics: false,
  prioritySupportLevel: 'standard',
};

const businessEntitlements: PlanEntitlements = {
  maxOfferSheetsPerMonth: 'unlimited',
  canUseCustomBranding: true,
  canRemoveWatermark: true,
  canSaveTemplates: true,
  canSaveCustomers: true,
  canUseDashboard: true,
  allowedExportFormats: ['pdf', 'jpeg', 'json', 'csv', 'excel'],
  maxTeamMembers: 4,
  hasAnalytics: true,
  prioritySupportLevel: 'priority',
};

export const PLANS: Record<PlanId, PricingPlanDetails> = {
  'none': {
    id: 'none',
    nameKey: { en: 'No Plan', el: 'Κανένα Πρόγραμμα' },
    priceKey: { en: '', el: '' },
    descriptionKey: { en: '', el: '' },
    features: [],
    buttonTextKey: { en: 'Choose Plan', el: 'Επιλογή Προγράμματος' },
    entitlements: {
      ...defaultEntitlements,
      maxOfferSheetsPerMonth: 1, // Allow 1 free offer to try it out
      allowedExportFormats: ['pdf'],
    },
  },
  'pro-monthly': {
    id: 'pro-monthly',
    nameKey: { en: 'Pro Plan', el: 'Pro Πρόγραμμα' },
    listPriceKey: { en: '€11.98', el: '€11.98' },
    priceKey: { en: '€7.98', el: '€7.98' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For professionals who need more power.', el: 'Για επαγγελματίες που χρειάζονται περισσότερη δύναμη.' },
    features: [
        { textKey: { en: 'Unlimited Offer Sheets', el: 'Απεριόριστα Δελτία Προσφορών' }, available: true, icon: 'check' },
        { textKey: { en: 'Custom Logo & Branding', el: 'Προσαρμοσμένο Λογότυπο & Επωνυμία' }, available: true, icon: 'check' },
        { textKey: { en: 'Remove "Made with OfferFlow" watermark', el: 'Αφαίρεση υδατογραφήματος' }, available: true, icon: 'check' },
        { textKey: { en: 'Save & Reuse Custom Templates', el: 'Αποθήκευση & Επαναχρησιμοποίηση Προτύπων' }, available: true, icon: 'check' },
        { textKey: { en: 'Save & Manage Customer Info', el: 'Αποθήκευση & Διαχείριση Πελατών' }, available: true, icon: 'check' },
        { textKey: { en: 'PDF, JPEG, JSON Export', el: 'Εξαγωγή PDF, JPEG, JSON' }, available: true, icon: 'check' },
        { textKey: { en: 'Standard Email Support (~48h)', el: 'Standard Υποστήριξη Email (~48h)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Invest Now', el: 'Επενδύστε Τώρα' },
    isFeatured: true,
    entitlements: proEntitlements,
    stripePriceId: 'price_1RcYqTGxDVvbchhpdQw7awbM' 
  },
  'pro-yearly': {
    id: 'pro-yearly',
    nameKey: { en: 'Pro Plan', el: 'Pro Πρόγραμμα' },
    listPriceKey: { en: '€143.76', el: '€143.76' },
    priceKey: { en: '€83.79', el: '€83.79' },
    priceSuffixKey: { en: '/ year', el: '/ έτος' },
    descriptionKey: { en: 'Save ~1.5 months with the yearly plan!', el: 'Εξοικονομήστε ~1.5 μήνα με το ετήσιο!' },
    features: [
        { textKey: { en: 'Unlimited Offer Sheets', el: 'Απεριόριστα Δελτία Προσφορών' }, available: true, icon: 'check' },
        { textKey: { en: 'Custom Logo & Branding', el: 'Προσαρμοσμένο Λογότυπο & Επωνυμία' }, available: true, icon: 'check' },
        { textKey: { en: 'Remove "Made with OfferFlow" watermark', el: 'Αφαίρεση υδατογραφήματος' }, available: true, icon: 'check' },
        { textKey: { en: 'Save & Reuse Custom Templates', el: 'Αποθήκευση & Επαναχρησιμοποίηση Προτύπων' }, available: true, icon: 'check' },
        { textKey: { en: 'Save & Manage Customer Info', el: 'Αποθήκευση & Διαχείριση Πελατών' }, available: true, icon: 'check' },
        { textKey: { en: 'PDF, JPEG, JSON Export', el: 'Εξαγωγή PDF, JPEG, JSON' }, available: true, icon: 'check' },
        { textKey: { en: 'Standard Email Support (~48h)', el: 'Standard Υποστήριξη Email (~48h)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Invest Now', el: 'Επενδύστε Τώρα' },
    isFeatured: true,
    entitlements: proEntitlements,
    stripePriceId: 'price_1RcZ5VGxDVvbchhpXseQQ1qV' 
  },
  'business-monthly': {
    id: 'business-monthly',
    nameKey: { en: 'Business Plan', el: 'Business Πρόγραμμα' },
    priceKey: { en: '€38.98', el: '€38.98' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For teams and growing businesses.', el: 'Για ομάδες και αναπτυσσόμενες επιχειρήσεις.' },
    features: [
        { textKey: { en: 'Everything in Pro Plan', el: 'Όλα όσα περιλαμβάνει το Pro' }, available: true, icon: 'check' },
        { textKey: { en: 'Up to 4 Team Users', el: 'Έως 4 Χρήστες Ομάδας' }, available: true, icon: 'check' },
        { textKey: { en: 'Full White-Labeling Option', el: 'Επιλογή πλήρους White-Labeling' }, available: true, icon: 'check' },
        { textKey: { en: 'CSV & Excel Export Options', el: 'Επιλογές Εξαγωγής CSV & Excel' }, available: true, icon: 'check' },
        { textKey: { en: 'Offer Performance Analytics', el: 'Αναλυτικά Στοιχεία Απόδοσης Προσφορών' }, available: true, icon: 'check' },
        { textKey: { en: 'Priority Support (24h)', el: 'Υποστήριξη κατά Προτεραιότητα (24h)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Invest Now', el: 'Επενδύστε Τώρα' },
    entitlements: businessEntitlements,
    stripePriceId: 'price_1RcYuxGxDVvbchhpjUS5jpM9' 
  },
  'business-yearly': {
    id: 'business-yearly',
    nameKey: { en: 'Business Plan', el: 'Business Πρόγραμμα' },
    listPriceKey: { en: '€467.76', el: '€467.76' },
    priceKey: { en: '€389.80', el: '€389.80' },
    priceSuffixKey: { en: '/ year', el: '/ έτος' },
    descriptionKey: { en: 'Save 2 months with the yearly plan!', el: 'Εξοικονομήστε 2 μήνες με το ετήσιο!' },
    features: [
        { textKey: { en: 'Everything in Pro Plan', el: 'Όλα όσα περιλαμβάνει το Pro' }, available: true, icon: 'check' },
        { textKey: { en: 'Up to 4 Team Users', el: 'Έως 4 Χρήστες Ομάδας' }, available: true, icon: 'check' },
        { textKey: { en: 'Full White-Labeling Option', el: 'Επιλογή πλήρους White-Labeling' }, available: true, icon: 'check' },
        { textKey: { en: 'CSV & Excel Export Options', el: 'Επιλογές Εξαγωγής CSV & Excel' }, available: true, icon: 'check' },
        { textKey: { en: 'Offer Performance Analytics', el: 'Αναλυτικά Στοιχεία Απόδοσης Προσφορών' }, available: true, icon: 'check' },
        { textKey: { en: 'Priority Support (24h)', el: 'Υποστήριξη κατά Προτεραιότητα (24h)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Invest Now', el: 'Επενδύστε Τώρα' },
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
  return true; // Any plan other than 'none' is a paid/trialing plan
};

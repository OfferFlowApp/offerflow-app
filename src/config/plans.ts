
import type { PricingPlanDetails, PlanId, PlanEntitlements } from '@/lib/types';

const defaultEntitlements: PlanEntitlements = {
  maxOfferSheetsPerMonth: 0,
  canUseCustomBranding: false,
  canRemoveWatermark: false,
  canSaveTemplates: false,
  canSaveCustomers: false,
  canUseDashboard: false,
  allowedExportFormats: ['pdf'], // Free default
  maxTeamMembers: 1,
  hasAnalytics: false,
  prioritySupportLevel: 'basic',
};

export const PLANS: Record<PlanId, PricingPlanDetails> = {
  free: {
    id: 'free',
    nameKey: { en: 'Free Plan', el: 'Δωρεάν Πρόγραμμα' },
    priceKey: { en: '€0', el: '€0' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'Get started with basic offer sheet creation.', el: 'Ξεκινήστε με βασική δημιουργία προσφορών.' },
    features: [
      { key: 'free-offers', textKey: { en: 'Up to 2 Offer Sheets / month', el: 'Έως 2 Δελτία Προσφορών / μήνα' }, available: true, icon: 'check' },
      { key: 'free-watermark', textKey: { en: '"Made with OfferFlow" watermark', el: 'Υδατογράφημα "Made with OfferFlow"' }, available: true, icon: 'info' },
      { key: 'free-export', textKey: { en: 'PDF Export only', el: 'Εξαγωγή μόνο σε PDF' }, available: true, icon: 'check' },
      { key: 'free-branding', textKey: { en: 'No Custom Branding', el: 'Όχι Προσαρμοσμένη Επωνυμία' }, available: false, icon: 'x' },
      { key: 'free-templates', textKey: { en: 'No Custom Templates', el: 'Όχι Προσαρμοσμένα Πρότυπα' }, available: false, icon: 'x' },
      { key: 'free-customers', textKey: { en: 'No Saved Customers', el: 'Όχι Αποθηκευμένοι Πελάτες' }, available: false, icon: 'x' },
      { key: 'free-teams', textKey: { en: 'No Team Access', el: 'Όχι Πρόσβαση Ομάδας' }, available: false, icon: 'x' },
      { key: 'free-support', textKey: { en: 'Basic Email Support (72h+)', el: 'Βασική Υποστήριξη Email (72h+)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Current Plan', el: 'Τρέχον Πρόγραμμα' }, // Changed from Get Started as it's selected by default
    entitlements: {
      ...defaultEntitlements,
      maxOfferSheetsPerMonth: 2,
      canUseCustomBranding: false,
      canRemoveWatermark: false, // Explicitly false, watermark will be shown
      allowedExportFormats: ['pdf'],
      prioritySupportLevel: 'basic',
    },
    // stripePriceId: 'YOUR_FREE_PLAN_STRIPE_PRICE_ID' // Usually free plans don't need a price ID unless you model them in Stripe
  },
  pro: {
    id: 'pro',
    nameKey: { en: 'Pro Plan', el: 'Pro Πρόγραμμα' },
    priceKey: { en: '€11.98', el: '€11.98' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For professionals who need more power.', el: 'Για επαγγελματίες που χρειάζονται περισσότερη δύναμη.' },
    features: [
      { key: 'pro-offers', textKey: { en: 'Unlimited Offer Sheets', el: 'Απεριόριστα Δελτία Προσφορών' }, available: true, icon: 'check' },
      { key: 'pro-branding', textKey: { en: 'Custom Logo & Branding', el: 'Προσαρμοσμένο Λογότυπο & Επωνυμία' }, available: true, icon: 'check' },
      { key: 'pro-no-watermark', textKey: { en: 'Remove "Made with OfferFlow" watermark', el: 'Αφαίρεση υδατογραφήματος "Made with OfferFlow"' }, available: true, icon: 'check' },
      { key: 'pro-templates', textKey: { en: 'Save & Reuse Custom Templates', el: 'Αποθήκευση & Επαναχρησιμοποίηση Προτύπων' }, available: true, icon: 'check' },
      { key: 'pro-customers', textKey: { en: 'Save & Manage Customer Info', el: 'Αποθήκευση & Διαχείριση Πελατών' }, available: true, icon: 'check' },
      { key: 'pro-dashboard', textKey: { en: 'Basic Usage Dashboard', el: 'Βασικός Πίνακας Ελέγχου Χρήσης' }, available: true, icon: 'check' },
      { key: 'pro-export', textKey: { en: 'PDF, JPEG, JSON Export', el: 'Εξαγωγή PDF, JPEG, JSON' }, available: true, icon: 'check' },
      { key: 'pro-support', textKey: { en: 'Standard Email Support (~48h)', el: 'Standard Υποστήριξη Email (~48h)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Choose Pro', el: 'Επιλέξτε Pro' },
    isFeatured: true,
    entitlements: {
      ...defaultEntitlements,
      maxOfferSheetsPerMonth: 'unlimited',
      canUseCustomBranding: true,
      canRemoveWatermark: true,
      canSaveTemplates: true,
      canSaveCustomers: true,
      canUseDashboard: true, // Placeholder for now
      allowedExportFormats: ['pdf', 'jpeg', 'json'],
      prioritySupportLevel: 'standard',
    },
    stripePriceId: 'YOUR_PRO_PLAN_STRIPE_PRICE_ID' // Replace with your actual Stripe Price ID
  },
  business: {
    id: 'business',
    nameKey: { en: 'Business Plan', el: 'Business Πρόγραμμα' },
    priceKey: { en: '€38.98', el: '€38.98' },
    priceSuffixKey: { en: '/ month', el: '/ μήνα' },
    descriptionKey: { en: 'For teams and growing businesses.', el: 'Για ομάδες και αναπτυσσόμενες επιχειρήσεις.' },
    features: [
      { key: 'business-all-pro', textKey: { en: 'Everything in Pro Plan', el: 'Όλα όσα περιλαμβάνει το Pro' }, available: true, icon: 'check' },
      { key: 'business-teams', textKey: { en: 'Up to 4 Team Users', el: 'Έως 4 Χρήστες Ομάδας' }, available: true, icon: 'check' },
      { key: 'business-whitelabel', textKey: { en: 'Full White-Labeling Option', el: 'Επιλογή πλήρους White-Labeling' }, available: true, icon: 'check' },
      { key: 'business-export', textKey: { en: 'CSV & Excel Export Options', el: 'Επιλογές Εξαγωγής CSV & Excel' }, available: true, icon: 'check' },
      { key: 'business-analytics', textKey: { en: 'Offer Performance Analytics', el: 'Αναλυτικά Στοιχεία Απόδοσης Προσφορών' }, available: true, icon: 'check' },
      { key: 'business-support', textKey: { en: 'Priority Support (24h)', el: 'Υποστήριξη κατά Προτεραιότητα (24h)' }, available: true, icon: 'check' },
    ],
    buttonTextKey: { en: 'Choose Business', el: 'Επιλέξτε Business' },
    entitlements: {
      ...defaultEntitlements,
      maxOfferSheetsPerMonth: 'unlimited',
      canUseCustomBranding: true,
      canRemoveWatermark: true,
      canSaveTemplates: true,
      canSaveCustomers: true,
      canUseDashboard: true, // Placeholder
      allowedExportFormats: ['pdf', 'jpeg', 'json', 'csv', 'excel'],
      maxTeamMembers: 4, // Placeholder
      hasAnalytics: true, // Placeholder
      prioritySupportLevel: 'priority',
    },
    stripePriceId: 'YOUR_BUSINESS_PLAN_STRIPE_PRICE_ID' // Replace with your actual Stripe Price ID
  },
};

export const getPlanDetails = (planId: PlanId | undefined | null): PricingPlanDetails => {
  return PLANS[planId || 'free'] || PLANS.free;
};

export const getEntitlements = (planId: PlanId | undefined | null): PlanEntitlements => {
  return getPlanDetails(planId).entitlements;
};

// Helper to check if a user is on a paid plan
export const isPaidUser = (planId: PlanId | undefined | null): boolean => {
  return planId === 'pro' || planId === 'business';
};

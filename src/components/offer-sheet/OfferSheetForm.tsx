
"use client";

import * as React from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { OfferSheetData, Product, CustomerInfo, Currency, SellerInfo, Language, SettingsData, PlanEntitlements } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadCloud, PlusCircle, Trash2, FileDown, Share2, Save, Euro, DollarSign as DollarIcon, PoundSterling, FileText, Image as ImageIconLucide, Percent, Package, Building, User, Phone, Mail, FileUp, BookTemplate, UserPlus as UserPlusIcon, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useDrag, useDrop, type XYCoord } from 'react-dnd'; 
import { useLocalization } from '@/hooks/useLocalization';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '../ui/loading-spinner';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

const PdfPageLayout = dynamic(() => import('./PdfPageLayout'));

const OFFER_SHEET_STORAGE_PREFIX = 'offerSheet-';

const initialProduct: Product = {
  id: '',
  title: '',
  quantity: 1, 
  originalPrice: 0, 
  discountedPrice: 0, 
  discountedPriceType: 'exclusive', 
  description: '',
  imageUrl: undefined,
};

const initialCustomerInfo: CustomerInfo = {
  name: '',
  company: '',
  contact: '', 
  vatNumber: '',
  address: '',
  phone2: '',
  gemhNumber: '',
  notes: '',
};

const initialSellerInfo: SellerInfo = {
  name: '',
  address: '',
  email: '',
  phone: '',
  logoUrl: undefined,
  gemhNumber: '',
};

const currencyMetadata: Record<Currency, { symbol: string; IconComponent: React.ElementType, label: string }> = {
  EUR: { symbol: '€', IconComponent: Euro, label: 'Euro' },
  USD: { symbol: '$', IconComponent: DollarIcon, label: 'US Dollar' },
  GBP: { symbol: '£', IconComponent: PoundSterling, label: 'British Pound' },
};

const getCurrencySymbol = (currency: Currency): string => {
  return currencyMetadata[currency]?.symbol || '€'; 
};

const BASE_DEFAULT_CURRENCY: Currency = 'EUR';

const initialOfferSheetData = (defaultCurrency: Currency, defaultTerms?: string): OfferSheetData => ({
  customerInfo: { ...initialCustomerInfo },
  sellerInfo: { ...initialSellerInfo },
  validityStartDate: undefined,
  validityEndDate: undefined,
  products: [],
  termsAndConditions: defaultTerms || '',
  currency: defaultCurrency,
  vatRate: 0,
  isFinalPriceVatInclusive: false,
});


interface ProductItemProps {
  product: Product;
  index: number;
  currencySymbol: string;
  updateProduct: (index: number, updatedProduct: Product) => void;
  removeProduct: (index: number) => void;
  moveProduct: (dragIndex: number, hoverIndex: number) => void;
  t: (translations: { [key in Language]?: string } | string, fallback?: string) => string;
}

const ItemTypes = {
  PRODUCT: 'product',
}

interface DragItem {
  index: number
  id: string
  type: string
}

const ProductItemCard: React.FC<ProductItemProps> = React.memo(function ProductItemCard({ product, index, currencySymbol, updateProduct, removeProduct, moveProduct, t }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any }>({
    accept: ItemTypes.PRODUCT,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveProduct(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PRODUCT,
    item: () => ({ id: product.id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleProductFieldChange = (fieldName: keyof Product, value: any) => {
    updateProduct(index, { ...product, [fieldName]: value });
  };
  
  const handleProductInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof Product;
    const parsedValue = (name.includes('Price') || name === 'quantity') ? parseFloat(value) || 0 : value;
    handleProductFieldChange(fieldName, parsedValue);
  };

  const handleProductImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProductFieldChange('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div ref={ref} data-handler-id={handlerId} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-4 p-1 border rounded-lg cursor-move">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">{t({ en: 'Product', el: 'Προϊόν' })} #{index + 1}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => removeProduct(index)} className="text-destructive hover:text-destructive/80">
            <Trash2 className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`productTitle-${index}`}>{t({ en: 'Title', el: 'Τίτλος' })}</Label>
            <Input id={`productTitle-${index}`} name="title" value={product.title} onChange={handleProductInputChange} placeholder={t({ en: "Product Title", el: "Τίτλος Προϊόντος" })} />
          </div>
           <div className="space-y-2">
            <Label htmlFor={`productQuantity-${index}`}>{t({ en: 'Quantity', el: 'Ποσότητα' })}</Label>
            <Input id={`productQuantity-${index}`} name="quantity" type="number" value={product.quantity} onChange={handleProductInputChange} placeholder="1" min="1" />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor={`productDescription-${index}`}>{t({ en: 'Description', el: 'Περιγραφή' })}</Label>
            <Textarea id={`productDescription-${index}`} name="description" value={product.description} onChange={handleProductInputChange} placeholder={t({ en: "Product Description", el: "Περιγραφή Προϊόντος" })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`originalPrice-${index}`}>{t({ en: 'Original Unit Price (excl. VAT)', el: 'Αρχική Τιμή Μονάδας (χωρίς ΦΠΑ)' })} ({currencySymbol})</Label>
            <Input id={`originalPrice-${index}`} name="originalPrice" type="number" value={product.originalPrice} onChange={handleProductInputChange} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`discountedPrice-${index}`}>{t({ en: 'Discounted Unit Price', el: 'Τιμή Μονάδας με Έκπτωση' })} ({currencySymbol})</Label>
            <Input id={`discountedPrice-${index}`} name="discountedPrice" type="number" value={product.discountedPrice} onChange={handleProductInputChange} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`discountedPriceType-${index}`}>{t({ en: 'Discounted Price VAT Type', el: 'Τύπος ΦΠΑ Τιμής με Έκπτωση' })}</Label>
            <Select
              value={product.discountedPriceType || 'exclusive'}
              onValueChange={(value) => handleProductFieldChange('discountedPriceType', value as 'exclusive' | 'inclusive')}
            >
              <SelectTrigger id={`discountedPriceType-${index}`}>
                <SelectValue placeholder={t({en: "Select type", el: "Επιλογή τύπου"})} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive">{t({en: "Excludes VAT", el: "Χωρίς ΦΠΑ"})}</SelectItem>
                <SelectItem value="inclusive">{t({en: "Includes VAT", el: "Με ΦΠΑ"})}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor={`productImage-${index}`}>{t({ en: 'Product Image', el: 'Εικόνα Προϊόντος' })}</Label>
            <Input id={`productImage-${index}`} type="file" accept="image/*" onChange={handleProductImageUpload} className="file:text-primary file:font-medium" />
            {product.imageUrl && (
              <div className="mt-2">
                <Image src={product.imageUrl} alt={t({ en: "Product Preview", el: "Προεπισκόπηση Προϊόντος" })} width={100} height={100} className="rounded-md object-cover" data-ai-hint="product photo"/>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});


export default function OfferSheetForm() {
  const { t } = useLocalization();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser, userSubscription, currentEntitlements, incrementOfferCountForCurrentUser, loading: authLoading } = useAuth();
  const [offerData, setOfferData] = React.useState<OfferSheetData>(() => initialOfferSheetData(BASE_DEFAULT_CURRENCY));
  const { toast } = useToast();
  const [isFinalPriceVatInclusive, setIsFinalPriceVatInclusive] = React.useState(false);
  const [currentOfferId, setCurrentOfferId] = React.useState<string | null>(null);
  const importFileRef = React.useRef<HTMLInputElement>(null);

  // Loading states for actions
  const [isSaving, setIsSaving] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);
  const [isExportingJpeg, setIsExportingJpeg] = React.useState(false);
  const [isExportingJson, setIsExportingJson] = React.useState(false);
  const [isExportingExcel, setIsExportingExcel] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = React.useState(false);
  const [isSavingCustomer, setIsSavingCustomer] = React.useState(false);
  
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [upgradeReason, setUpgradeReason] = React.useState('');


  React.useEffect(() => {
    const initializeNewOfferSheet = (keepExistingId = false) => {
      let userDefaultSellerInfo: Partial<SellerInfo> | undefined = undefined;
      let userDefaultCurrency: Currency = BASE_DEFAULT_CURRENCY;
      let userDefaultTerms: string | undefined = undefined;
      const savedSettingsRaw = localStorage.getItem('offerSheetSettings');
      
      if (savedSettingsRaw) {
        try {
          const parsedSettings: SettingsData = JSON.parse(savedSettingsRaw);
          if (parsedSettings.defaultSellerInfo) {
            userDefaultSellerInfo = parsedSettings.defaultSellerInfo;
          } else if (parsedSettings.defaultLogoUrl) { // Legacy support
            userDefaultSellerInfo = { logoUrl: parsedSettings.defaultLogoUrl };
          }

          if (parsedSettings.defaultCurrency && currencyMetadata[parsedSettings.defaultCurrency]) {
            userDefaultCurrency = parsedSettings.defaultCurrency;
          }
          if (parsedSettings.defaultTermsAndConditions) {
            userDefaultTerms = parsedSettings.defaultTermsAndConditions;
          }
        } catch (error) {
          console.error("Failed to parse settings from localStorage", error);
        }
      }
      
      const baseInitialData = initialOfferSheetData(userDefaultCurrency, userDefaultTerms);
      const effectiveSellerInfo = {
        ...baseInitialData.sellerInfo,
        ...(userDefaultSellerInfo || {}),
      };

      setOfferData({
        ...baseInitialData,
        sellerInfo: effectiveSellerInfo,
        currency: userDefaultCurrency,
        termsAndConditions: userDefaultTerms || baseInitialData.termsAndConditions,
        vatRate: baseInitialData.vatRate,
        isFinalPriceVatInclusive: baseInitialData.isFinalPriceVatInclusive,
        products: baseInitialData.products.map(p => ({...p, discountedPriceType: p.discountedPriceType || 'exclusive'}))
      });
      setIsFinalPriceVatInclusive(baseInitialData.isFinalPriceVatInclusive || false);
      if (!keepExistingId) {
        setCurrentOfferId(null); 
      }
    };

    const loadOfferSheet = async (id: string) => {
      if (currentUser) {
        // Load from cloud for logged-in users
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/offer-sheets?id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch offer sheet');
            const loadedData = await response.json();
            
            const fullLoadedData: OfferSheetData = {
              ...initialOfferSheetData(loadedData.currency || BASE_DEFAULT_CURRENCY, loadedData.termsAndConditions), 
              ...loadedData,
              validityStartDate: loadedData.validityStartDate ? new Date(loadedData.validityStartDate) : undefined,
              validityEndDate: loadedData.validityEndDate ? new Date(loadedData.validityEndDate) : undefined,
            };
            setOfferData(fullLoadedData);
            setIsFinalPriceVatInclusive(fullLoadedData.isFinalPriceVatInclusive || false);
            setCurrentOfferId(id);
            toast({ title: t({en: "Offer Sheet Loaded", el: "Το Δελτίο Προσφοράς Φορτώθηκε"}), description: `${t({en: "Loaded offer from the cloud.", el: "Φορτώθηκε προσφορά από το cloud."})}` });
        } catch (e) {
          console.error("Failed to load offer sheet from cloud:", e);
          toast({ title: t({en: "Load Error", el: "Σφάλμα Φόρτωσης"}), description: t({en: "Could not load the offer sheet.", el: "Δεν ήταν δυνατή η φόρτωση."}), variant: "destructive" });
          router.push('/offer-sheet/edit'); // Redirect to a new sheet
        }
      } else {
        // Load from local storage for logged-out users
        const item = localStorage.getItem(OFFER_SHEET_STORAGE_PREFIX + id);
        if (item) {
          try {
            const loadedData: OfferSheetData = JSON.parse(item);
            const fullLoadedData: OfferSheetData = {
              ...initialOfferSheetData(loadedData.currency || BASE_DEFAULT_CURRENCY, loadedData.termsAndConditions), 
              ...loadedData,
              validityStartDate: loadedData.validityStartDate ? new Date(loadedData.validityStartDate) : undefined,
              validityEndDate: loadedData.validityEndDate ? new Date(loadedData.validityEndDate) : undefined,
            };
            setOfferData(fullLoadedData);
            setIsFinalPriceVatInclusive(fullLoadedData.isFinalPriceVatInclusive || false);
            setCurrentOfferId(id);
            toast({ title: t({en: "Offer Sheet Loaded", el: "Το Δελτίο Προσφοράς Φορτώθηκε"}), description: `${t({en: "Loaded offer from browser storage.", el: "Φορτώθηκε προσφορά από τον browser."})}` });
          } catch (e) {
            console.error("Failed to parse loaded offer sheet:", e);
            toast({ title: t({en: "Load Error", el: "Σφάλμα Φόρτωσης"}), description: t({en: "Could not load the offer sheet.", el: "Δεν ήταν δυνατή η φόρτωση."}), variant: "destructive" });
            router.push('/offer-sheet/edit');
          }
        } else {
          toast({ title: t({en: "Load Error", el: "Σφάλμα Φόρτωσης"}), description: t({en: "Offer sheet not found.", el: "Το δελτίο προσφοράς δεν βρέθηκε."}), variant: "destructive" });
          initializeNewOfferSheet();
        }
      }
    };

    const offerIdFromUrl = searchParams.get('id');
    if (offerIdFromUrl) {
      loadOfferSheet(offerIdFromUrl);
    } else {
      initializeNewOfferSheet();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, t, currentUser, router]);

  React.useEffect(() => {
    setOfferData(prev => ({ ...prev, isFinalPriceVatInclusive: isFinalPriceVatInclusive }));
  }, [isFinalPriceVatInclusive]);


  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOfferData(prev => ({ ...prev, sellerInfo: { ...prev.sellerInfo, logoUrl: reader.result as string } }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSellerInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOfferData(prev => ({
      ...prev,
      sellerInfo: { ...prev.sellerInfo, [name]: value },
    }));
  };

  const handleCustomerInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOfferData(prev => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, [name]: value },
    }));
  };
  
  const addProduct = React.useCallback(() => {
    setOfferData(prevOfferData => ({
      ...prevOfferData,
      products: [...prevOfferData.products, { ...initialProduct, id: `product-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, quantity: 1, discountedPriceType: 'exclusive' }],
    }));
  }, []);

  const updateProduct = React.useCallback((index: number, updatedProduct: Product) => {
    setOfferData(prevOfferData => {
      const newProducts = [...prevOfferData.products];
      newProducts[index] = updatedProduct;
      return { ...prevOfferData, products: newProducts };
    });
  }, []);

  const removeProduct = React.useCallback((index: number) => {
    setOfferData(prevOfferData => {
      const newProducts = prevOfferData.products.filter((_, i) => i !== index);
      return { ...prevOfferData, products: newProducts };
    });
  }, []);
  
  const moveProduct = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setOfferData((prev) => {
        const newProducts = [...prev.products];
        const [draggedItem] = newProducts.splice(dragIndex, 1);
        newProducts.splice(hoverIndex, 0, draggedItem);
        return {
            ...prev,
            products: newProducts,
        };
    });
  }, []);

  const handleCurrencyChange = (value: string) => {
    if (currencyMetadata[value as Currency]) {
      setOfferData({ ...offerData, currency: value as Currency });
    }
  };

  const handleVatRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setOfferData({ ...offerData, vatRate: Math.max(0, value) || 0 });
  };

  const currentCalculatedTotals = React.useMemo(() => {
    const currentVatRateAsDecimal = (offerData.vatRate || 0) / 100;
    const totalOriginalPriceExclVat = offerData.products.reduce((sum, p) => sum + ((p.originalPrice || 0) * (p.quantity || 1)), 0);

    let subtotalDiscountedNet = 0;
    let vatAmountCalculated = 0;
    let grandTotalCalculated = 0;

    if (isFinalPriceVatInclusive) {
        grandTotalCalculated = offerData.products.reduce((sum, p) => sum + ((p.discountedPrice || 0) * (p.quantity || 1)), 0);
        
        subtotalDiscountedNet = currentVatRateAsDecimal > 0 
            ? grandTotalCalculated / (1 + currentVatRateAsDecimal) 
            : grandTotalCalculated;
        
        vatAmountCalculated = grandTotalCalculated - subtotalDiscountedNet;
    } else {
        subtotalDiscountedNet = offerData.products.reduce((sum, p) => {
            let unitDiscountedPrice = p.discountedPrice || 0;
            let priceExclVatForProduct = unitDiscountedPrice;
            if (p.discountedPriceType === 'inclusive' && currentVatRateAsDecimal > 0) {
                priceExclVatForProduct = unitDiscountedPrice / (1 + currentVatRateAsDecimal);
            }
            return sum + (priceExclVatForProduct * (p.quantity || 1));
        }, 0);
        
        vatAmountCalculated = subtotalDiscountedNet * currentVatRateAsDecimal;
        grandTotalCalculated = subtotalDiscountedNet + vatAmountCalculated;
    }

    return { 
        totalOriginalPrice: totalOriginalPriceExclVat, 
        subtotalDiscounted: subtotalDiscountedNet, 
        vatAmount: vatAmountCalculated, 
        grandTotal: grandTotalCalculated 
    };
  }, [offerData.products, offerData.vatRate, isFinalPriceVatInclusive]);


  const currentCurrencySymbol = getCurrencySymbol(offerData.currency);


  const handleSubmit = React.useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    const isNewOffer = !currentOfferId;

    if (isNewOffer) {
        const countLocalOffers = () => {
            if (typeof window === 'undefined') return 0;
            let count = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(OFFER_SHEET_STORAGE_PREFIX)) count++;
            }
            return count;
        };

        const offerCount = currentUser ? (userSubscription?.offersCreatedThisPeriod || 0) : countLocalOffers();
        
        if (currentEntitlements.maxOfferSheetsPerMonth !== 'unlimited' && offerCount >= currentEntitlements.maxOfferSheetsPerMonth) {
            let reason = '';
            if (userSubscription?.status === 'trialing') {
                reason = t({en:"You've reached your trial limit of {limit} offer. Please upgrade to create unlimited offers.", el:"Φτάσατε το όριο του {limit} για τη δοκιμή σας. Αναβαθμίστε για απεριόριστες προσφορές."}).replace('{limit}', String(currentEntitlements.maxOfferSheetsPerMonth));
            } else if (currentUser) {
                reason = t({en:"You've reached your monthly limit of {limit} offer(s) for your current plan. Please upgrade for more.", el:"Φτάσατε το μηνιαίο όριο του {limit} για το πλάνο σας. Αναβαθμίστε για περισσότερα."}).replace('{limit}', String(currentEntitlements.maxOfferSheetsPerMonth));
            } else {
                reason = t({en:"You've used your free offer. Please create an account to get a 30-day trial or subscribe to create more.", el:"Χρησιμοποιήσατε τη δωρεάν προσφορά σας. Δημιουργήστε λογαριασμό για δωρεάν δοκιμή 30 ημερών ή εγγραφείτε για περισσότερα."});
            }
            setUpgradeReason(reason);
            setShowUpgradeModal(true);
            return;
        }
    }

    setIsSaving(true);
    try {
      const offerDataToSave = { ...offerData, isFinalPriceVatInclusive: isFinalPriceVatInclusive, id: currentOfferId };
      
      if (currentUser) {
        // Save to cloud
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/offer-sheets', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offerData: offerDataToSave }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to save to cloud.');
        }

        if (isNewOffer) {
          await incrementOfferCountForCurrentUser();
          setCurrentOfferId(result.offerId);
          router.replace(`/offer-sheet/edit?id=${result.offerId}`, { scroll: false });
        }
        toast({ title: t({ en: "Offer Sheet Saved", el: "Το Δελτίο Προσφοράς Αποθηκεύτηκε" }), description: t({ en: "Saved to the cloud.", el: "Αποθηκεύτηκε στο cloud." }) });
      } else {
        // Save to local storage
        const saveId = currentOfferId || Date.now().toString();
        localStorage.setItem(OFFER_SHEET_STORAGE_PREFIX + saveId, JSON.stringify(offerDataToSave));
        
        if (isNewOffer) {
          setCurrentOfferId(saveId);
          router.replace(`/offer-sheet/edit?id=${saveId}`, { scroll: false });
        }
        toast({ title: t({ en: "Offer Sheet Saved", el: "Το Δελτίο Προσφοράς Αποθηκεύτηκε" }), description: t({ en: "Saved to your browser.", el: "Αποθηκεύτηκε στον browser σας." }) });
      }
    } catch (error: any) {
        toast({ title: t({en: "Save Error", el: "Σφάλμα Αποθήκευσης"}), description: error.message || t({en: "Could not save the offer sheet.", el: "Δεν ήταν δυνατή η αποθήκευση."}), variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  }, [
      offerData, 
      isFinalPriceVatInclusive, 
      currentOfferId, 
      t, 
      toast, 
      router, 
      currentUser,
      userSubscription, 
      currentEntitlements, 
      incrementOfferCountForCurrentUser
  ]);
  
  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(dataUrl); 
  };

  const exportAsPdfInternal = React.useCallback(async (returnAsBlob: boolean = false): Promise<Blob | null> => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const { default: ReactDOM } = await import('react-dom/client');

    const PRODUCTS_PER_PAGE = 3; 
    const totalPages = Math.max(1, Math.ceil(offerData.products.length / PRODUCTS_PER_PAGE));
    const pdf = new jsPDF('p', 'mm', 'a4');
    const creationDate = format(new Date(), 'dd/MM/yyyy');

    toast({ title: t({en: "Generating PDF...", el: "Δημιουργία PDF..."}), description: t({en: "This may take a moment.", el: "Αυτό μπορεί να πάρει λίγο χρόνο."})});

    const currentOfferDataForPdf = { ...offerData, isFinalPriceVatInclusive: isFinalPriceVatInclusive };

    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      const startIndex = i * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const productsOnPage = offerData.products.slice(startIndex, endIndex);

      const tempPdfPageContainer = document.createElement('div');
      tempPdfPageContainer.style.position = 'absolute';
      tempPdfPageContainer.style.left = '-210mm'; 
      tempPdfPageContainer.style.width = '210mm'; 
      document.body.appendChild(tempPdfPageContainer);
      
      const root = ReactDOM.createRoot(tempPdfPageContainer);
      root.render(
        <React.StrictMode> 
          <PdfPageLayout
            offerData={currentOfferDataForPdf}
            productsOnPage={productsOnPage}
            pageNum={pageNum}
            totalPages={totalPages}
            currencySymbol={currentCurrencySymbol}
            calculatedTotals={currentCalculatedTotals} 
            creationDate={creationDate}
            t={t}
            entitlements={currentEntitlements}
          />
        </React.StrictMode>
      );

      await new Promise(resolve => setTimeout(resolve, 100)); 

      try {
        const canvas = await html2canvas(tempPdfPageContainer, { 
          scale: 2, 
          useCORS: true,
          windowWidth: tempPdfPageContainer.scrollWidth,
          windowHeight: tempPdfPageContainer.scrollHeight,

        });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage();
        }
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.height / imgProps.width;
        let imgHeight = pdfWidth * ratio;
        
        let heightToUse = imgHeight;
        if (imgHeight > pdfHeight) { 
            heightToUse = pdfHeight; 
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, heightToUse);

      } catch (error) {
        console.error("Error generating canvas for page:", pageNum, error);
        toast({ title: t({en: "PDF Page Generation Failed", el: "Η δημιουργία σελίδας PDF απέτυχε"}), description: `Page ${pageNum}: ${String(error)}`, variant: "destructive" });
        root.unmount();
        document.body.removeChild(tempPdfPageContainer);
        return null; 
      } finally {
        root.unmount();
        if (document.body.contains(tempPdfPageContainer)) {
             document.body.removeChild(tempPdfPageContainer);
        }
      }
    }
    
    if (returnAsBlob) {
      return pdf.output('blob');
    } else {
      pdf.save('offer-sheet.pdf');
      toast({ title: t({en: "PDF Generated", el: "Το PDF δημιουργήθηκε"}), description: t({en: "Your PDF has been downloaded.", el: "Το PDF σας έχει ληφθεί."}), variant: "default" });
      return null;
    }
  }, [offerData, isFinalPriceVatInclusive, currentCurrencySymbol, currentCalculatedTotals, t, toast, currentEntitlements]);

  const handleExportPdf = async () => {
    // Temporarily disabled for user
    // if (!currentEntitlements.allowedExportFormats.includes('pdf')) {
    //     setUpgradeReason(t({en:"PDF export is not available on your current plan.", el: "Η εξαγωγή PDF δεν είναι διαθέσιμη."}));
    //     setShowUpgradeModal(true);
    //     return;
    // }
    setIsExportingPdf(true);
    try {
      await exportAsPdfInternal(false);
    } catch (error) {
        console.error("Error exporting PDF:", error);
    } finally {
        setIsExportingPdf(false);
    }
  };

  const handleExportJpeg = React.useCallback(async () => {
    setIsExportingJpeg(true);
    try {
        const { default: html2canvas } = await import('html2canvas');
        const { default: ReactDOM } = await import('react-dom/client');
        const tempPdfPageContainer = document.createElement('div');
        tempPdfPageContainer.style.position = 'absolute';
        tempPdfPageContainer.style.left = '-210mm';
        tempPdfPageContainer.style.width = '210mm';
        document.body.appendChild(tempPdfPageContainer);
        
        const root = ReactDOM.createRoot(tempPdfPageContainer);
        const productsForFirstPage = offerData.products.slice(0, 3); 
        const currentOfferDataForJpeg = { ...offerData, isFinalPriceVatInclusive: isFinalPriceVatInclusive };
        
        root.render(
          <PdfPageLayout
            offerData={currentOfferDataForJpeg}
            productsOnPage={productsForFirstPage} 
            pageNum={1}
            totalPages={Math.max(1, Math.ceil(offerData.products.length / 3))} 
            currencySymbol={currentCurrencySymbol}
            calculatedTotals={currentCalculatedTotals}
            creationDate={format(new Date(), 'dd/MM/yyyy')}
            t={t}
            entitlements={currentEntitlements}
          />
        );
        await new Promise(resolve => setTimeout(resolve, 100));

        toast({ title: t({en: "Generating JPEG...", el: "Δημιουργία JPEG..."}), description: t({en: "This may take a moment.", el: "Αυτό μπορεί να πάρει λίγο χρόνο."})});
        const canvas = await html2canvas(tempPdfPageContainer, { scale: 2, useCORS: true, windowWidth: tempPdfPageContainer.scrollWidth, windowHeight: tempPdfPageContainer.scrollHeight });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        triggerDownload(dataUrl, 'offer-sheet-page1.jpg');
        toast({ title: t({en: "JPEG Generated (Page 1)", el: "Το JPEG δημιουργήθηκε (Σελίδα 1)"}), description: t({en: "Your JPEG has been downloaded.", el: "Το JPEG σας έχει ληφθεί."}), variant: "default" });
        root.unmount();
        if (document.body.contains(tempPdfPageContainer)) {
             document.body.removeChild(tempPdfPageContainer);
        }
    } catch (error) {
      console.error("Error generating JPEG:", error);
      toast({ title: t({en: "JPEG Generation Failed", el: "Η δημιουργία JPEG απέτυχε"}), description: String(error), variant: "destructive" });
    } finally {
        setIsExportingJpeg(false);
    }
  }, [offerData, isFinalPriceVatInclusive, currentCurrencySymbol, currentCalculatedTotals, t, toast, currentEntitlements]);

  const handleExportJson = React.useCallback(async () => {
    setIsExportingJson(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 100)); 
        const dataToExport = {
          ...offerData,
          isFinalPriceVatInclusive: isFinalPriceVatInclusive, 
        };
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const customerIdentifier = offerData.customerInfo.name || offerData.customerInfo.company || 'offer';
        const filename = `offer-sheet-${customerIdentifier.replace(/\s+/g, '_')}-${Date.now()}.json`;
        triggerDownload(url, filename);
        toast({ title: t({en: "Data Exported", el: "Τα Δεδομένα Εξήχθησαν"}), description: t({en: "Offer sheet data downloaded as JSON.", el: "Τα δεδομένα του δελτίου προσφοράς λήφθηκαν ως JSON."}) });
    } catch (error) {
        console.error("Error exporting JSON:", error);
        toast({ title: t({en: "Export Error", el: "Σφάλμα Εξαγωγής"}), description: t({en: "Could not export data.", el: "Δεν ήταν δυνατή η εξαγωγή."}), variant: "destructive" });
    } finally {
        setIsExportingJson(false);
    }
  }, [offerData, isFinalPriceVatInclusive, t, toast]);

  const handleExportExcel = React.useCallback(async () => {
    setIsExportingExcel(true);
    try {
        const { utils, write } = await import('xlsx');
        await new Promise(resolve => setTimeout(resolve, 100));
        const worksheetData = offerData.products.map(p => ({
            'Product Title': p.title,
            'Quantity': p.quantity,
            'Original Unit Price (excl. VAT)': p.originalPrice,
            'Discounted Unit Price': p.discountedPrice,
            'Discounted Price Type': p.discountedPriceType,
            'Description': p.description,
        }));
        const worksheet = utils.json_to_sheet(worksheetData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Products");
        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        
        const url = URL.createObjectURL(blob);
        const customerIdentifier = offerData.customerInfo.name || offerData.customerInfo.company || 'offer';
        const filename = `offer-sheet-${customerIdentifier.replace(/\s+/g, '_')}.xlsx`;
        triggerDownload(url, filename);
        toast({ title: t({en: "Excel Exported", el: "Το Excel Εξήχθη"}), description: t({en: "Product data exported as .xlsx file.", el: "Τα δεδομένα προϊόντων εξήχθησαν ως αρχείο .xlsx."}) });
    } catch (error) {
        console.error("Error exporting Excel:", error);
        toast({ title: t({en: "Export Error", el: "Σφάλμα Εξαγωγής"}), description: t({en: "Could not export data as Excel.", el: "Δεν ήταν δυνατή η εξαγωγή σε Excel."}), variant: "destructive" });
    } finally {
        setIsExportingExcel(false);
    }
  }, [offerData.products, t, toast]);


  const handleImportFileChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error(t({en: "File content is not readable text.", el: "Το περιεχόμενο του αρχείου δεν είναι αναγνώσιμο κείμενο."}));
        }
        const importedRawData = JSON.parse(text);
        
        if (!importedRawData.customerInfo || !importedRawData.products || typeof importedRawData.currency === 'undefined') {
             throw new Error(t({en: "Invalid JSON structure for offer sheet.", el: "Μη έγκυρη δομή JSON για δελτίο προσφοράς."}));
        }
        
        const importedOfferData: OfferSheetData = {
          ...initialOfferSheetData(importedRawData.currency || BASE_DEFAULT_CURRENCY), 
          ...importedRawData, 
          customerInfo: { ...initialCustomerInfo, ...(importedRawData.customerInfo || {}) },
          sellerInfo: { ...initialSellerInfo, ...(importedRawData.sellerInfo || {}) },
          products: (importedRawData.products || []).map((p: any) => ({ ...initialProduct, ...p, id: p.id || `product-${Date.now()}-${Math.random().toString(36).slice(2,7)}` , discountedPriceType: p.discountedPriceType || 'exclusive' })),
          validityStartDate: importedRawData.validityStartDate ? new Date(importedRawData.validityStartDate) : undefined,
          validityEndDate: importedRawData.validityEndDate ? new Date(importedRawData.validityEndDate) : undefined,
          isFinalPriceVatInclusive: typeof importedRawData.isFinalPriceVatInclusive === 'boolean' ? importedRawData.isFinalPriceVatInclusive : false,
        };
        
        setOfferData(importedOfferData);
        setIsFinalPriceVatInclusive(importedOfferData.isFinalPriceVatInclusive || false);
        setCurrentOfferId(null); // Import as a new offer, don't overwrite existing by ID

        toast({ title: t({en: "Data Imported", el: "Τα Δεδομένα Εισήχθησαν"}), description: t({en: "Offer sheet data loaded from JSON.", el: "Τα δεδομένα του δελτίου προσφοράς φορτώθηκαν από JSON."}) });
      } catch (error) {
        console.error("Error importing JSON:", error);
        toast({ title: t({en: "Import Error", el: "Σφάλμα Εισαγωγής"}), description: (error as Error).message || t({en: "Could not parse or load the JSON file.", el: "Δεν ήταν δυνατή η ανάλυση ή η φόρτωση."}), variant: "destructive" });
      }
    };
    reader.readAsText(file);
    
    if (importFileRef.current) {
      importFileRef.current.value = "";
    }
  }, [t, toast]);

  const triggerImportFileDialog = React.useCallback(() => {
    importFileRef.current?.click();
  }, []);

  const handleShare = React.useCallback(async () => {
    setIsSharing(true);
    try {
        const pdfBlob = await exportAsPdfInternal(true);
        if (!pdfBlob) {
          toast({ title: t({en: "PDF Generation Failed", el: "Η Δημιουργία PDF Απέτυχε"}), description: t({en: "Could not generate PDF for sharing.", el: "Δεν ήταν δυνατή η δημιουργία PDF."}), variant: "destructive"});
          setIsSharing(false);
          return;
        }

        const customerName = offerData.customerInfo.name || offerData.customerInfo.company || "Customer";
        const pdfFile = new File([pdfBlob], `OfferSheet-${customerName.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
        const shareData = {
          files: [pdfFile],
          title: t({en: "Offer Sheet for ", el: "Προσφορά για "}) + customerName,
          text: t({en: "Please find attached the offer sheet for ", el: "Παρακαλώ βρείτε συνημμένη την προσφορά για "}) + customerName,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({ title: t({en: "Shared Successfully", el: "Επιτυχής Κοινοποίηση"}), description: t({en: "Offer sheet shared via native dialog.", el: "Το δελτίο προσφοράς κοινοποιήθηκε."})});
        } else {
          toast({ title: t({en: "Direct Share Not Supported", el: "Η Απευθείας Κοινοποίηση δεν Υποστηρίζεται"}), description: t({en: "PDF downloaded. Please share it manually.", el: "Το PDF λήφθηκε. Παρακαλούμε κοινοποιήστε το."}), variant: "default"});
          await exportAsPdfInternal(false); 
        }
    } catch (error) {
        // Ignore AbortError which happens when the user cancels the share dialog
        if ((error as DOMException).name === 'AbortError') {
            console.log("Share action was cancelled by the user.");
        } else {
            console.error("Error in share process:", error);
            toast({ title: t({en: "Sharing Error", el: "Σφάλμα Κοινοποίησης"}), description: t({en: "An unexpected error occurred during sharing.", el: "Παρουσιάστηκε σφάλμα."}), variant: "destructive"});
        }
    } finally {
        setIsSharing(false);
    }
  }, [exportAsPdfInternal, offerData.customerInfo, t, toast]);

  const handleSaveTemplate = async () => {
    if (!currentUser) {
        toast({ title: t({en: "Authentication Required", el: "Απαιτείται Σύνδεση"}), description: t({en: "You must be logged in to save templates.", el: "Πρέπει να είστε συνδεδεμένοι."}), variant: "destructive" });
        return;
    }

    setIsSavingTemplate(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/save-template', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offerData }), 
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to save template.');
      }

      toast({ 
          title: t({en:"Template Saved", el:"Το Πρότυπο Αποθηκεύτηκε"}), 
          description: result.message
      });

    } catch (error: any) {
        toast({ title: t({en: "Error", el: "Σφάλμα"}), description: error.message, variant: "destructive" });
    } finally {
        setIsSavingTemplate(false);
    }
  };

  const handleSaveCustomer = async () => {
    if (!currentUser) {
        toast({ title: t({en: "Authentication Required", el: "Απαιτείται Σύνδεση"}), description: t({en: "You must be logged in to save customers.", el: "Πρέπει να είστε συνδεδεμένοι."}), variant: "destructive" });
        return;
    }

    if (!offerData.customerInfo.name && !offerData.customerInfo.company) {
        toast({ title: t({en: "Missing Information", el: "Λείπουν Πληροφορίες"}), description: t({en: "Please provide a customer name or company before saving.", el: "Παρακαλώ δώστε ένα όνομα πελάτη ή εταιρείας."}), variant: "destructive" });
        return;
    }
    
    setIsSavingCustomer(true);
    try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/save-customer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerInfo: offerData.customerInfo }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to save customer.');
        }

        toast({
            title: t({en: "Customer Saved", el: "Ο Πελάτης Αποθηκεύτηκε"}),
            description: result.message,
        });

    } catch (error: any) {
        toast({ title: t({en: "Error", el: "Σφάλμα"}), description: error.message, variant: "destructive" });
    } finally {
        setIsSavingCustomer(false);
    }
  };

  // If auth is loading, show a loader for the whole form
  if (authLoading) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
            <LoadingSpinner className="h-12 w-12" />
            <p className="mt-4 text-muted-foreground">{t({en: "Loading offer sheet...", el: "Φόρτωση δελτίου προσφοράς..."})}</p>
        </div>
    );
  }


  return (
    <>
    {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                        <ShieldAlert className="mr-2 h-6 w-6" />
                        {t({en: "Upgrade Required", el: "Απαιτείται Αναβάθμιση"})}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{upgradeReason}</p>
                    <p className="text-sm text-muted-foreground">
                      {t({en: "Please upgrade your plan to access this feature.", el: "Παρακαλώ αναβαθμίστε το πρόγραμμά σας για πρόσβαση."})}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>{t({en: "Close", el: "Κλείσιμο"})}</Button>
                    <Button onClick={() => { setShowUpgradeModal(false); router.push('/pricing'); }} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {t({en: "View Plans", el: "Δείτε τα Πλάνα"})}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )}
    <form onSubmit={handleSubmit} id="offer-sheet-form-capture-area" className="space-y-8 p-4 md:p-6 max-w-4xl mx-auto bg-card rounded-xl shadow-2xl border">
      <input type="file" accept=".json" ref={importFileRef} onChange={handleImportFileChange} style={{ display: 'none' }} />
      
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-xl md:text-2xl">{t({ en: 'Seller Information & Logo', el: 'Πληροφορίες Πωλητή & Λογότυπο' })}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sellerName">{t({ en: 'Seller Company Name', el: 'Όνομα Εταιρείας Πωλητή' })}</Label>
            <Input
              id="sellerName"
              name="name"
              value={offerData.sellerInfo.name}
              onChange={handleSellerInfoChange}
              placeholder={t({ en: "Your Company Name", el: "Όνομα Εταιρείας" })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sellerAddress">{t({ en: 'Seller Address', el: 'Διεύθυνση Πωλητή' })}</Label>
            <Textarea
              id="sellerAddress"
              name="address"
              value={offerData.sellerInfo.address}
              onChange={handleSellerInfoChange}
              placeholder={t({ en: "123 Business Rd, Suite 400, City, Country", el: "Οδός Επιχείρησης 123, Γραφείο 400, Πόλη, Χώρα" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerEmail">{t({ en: 'Seller Email', el: 'Email Πωλητή' })}</Label>
            <Input id="sellerEmail" name="email" type="email" value={offerData.sellerInfo.email || ''} onChange={handleSellerInfoChange} placeholder={t({en: "contact@yourcompany.com", el:"contact@yourcompany.com"})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sellerPhone">{t({ en: 'Seller Phone', el: 'Τηλέφωνο Πωλητή' })}</Label>
            <Input id="sellerPhone" name="phone" type="tel" value={offerData.sellerInfo.phone || ''} onChange={handleSellerInfoChange} placeholder={t({en: "e.g., +1 234 567 890", el: "π.χ. +30 210 123 4567"})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sellerGemhNumber">{t({ en: 'Seller General Commercial Registry Number', el: 'Αριθμός ΓΕΜΗ Πωλητή' })}</Label>
            <Input id="sellerGemhNumber" name="gemhNumber" value={offerData.sellerInfo.gemhNumber || ''} onChange={handleSellerInfoChange} placeholder={t({en: "e.g., 1234567890000", el:"π.χ. 1234567890000"})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="logoUpload">{t({ en: 'Seller Logo', el: 'Λογότυπο Πωλητή' })}</Label>
            <div className="flex flex-col items-start space-y-2">
              {offerData.sellerInfo.logoUrl ? (
                <Image src={offerData.sellerInfo.logoUrl} alt={t({ en: "Seller Logo Preview", el: "Προεπισκόπηση Λογοτύπου Πωλητή"})} width={150} height={75} className="rounded-md object-contain border p-2" data-ai-hint="company brand" />
              ) : (
                <div className="w-32 h-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  <UploadCloud className="h-8 w-8" />
                </div>
              )}
              <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-sm file:text-primary file:font-medium" />
              <p className="text-xs text-muted-foreground">{t({ en: 'Upload your company logo (PNG, JPG, SVG)', el: 'Μεταφορτώστε το λογότυπο της εταιρείας σας (PNG, JPG, SVG)' })}</p>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="shadow-none border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl md:text-2xl">{t({ en: 'Customer Information & Offer Validity', el: 'Στοιχεία Πελάτη & Ισχύς Προσφοράς' })}</CardTitle>
          {currentEntitlements.canSaveCustomers && (
            <Button type="button" variant="outline" onClick={handleSaveCustomer} disabled={isSavingCustomer}>
              {isSavingCustomer ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <UserPlusIcon className="mr-2 h-5 w-5" />}
              {t({en: "Save Customer", el: "Αποθήκευση Πελάτη"})}
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">{t({ en: 'Customer Name', el: 'Όνομα Πελάτη' })}</Label>
            <Input id="customerName" name="name" value={offerData.customerInfo.name} onChange={handleCustomerInfoChange} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerCompany">{t({ en: 'Company', el: 'Εταιρεία' })}</Label>
            <Input id="customerCompany" name="company" value={offerData.customerInfo.company} onChange={handleCustomerInfoChange} placeholder="Acme Corp" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="customerVatNumber">{t({ en: 'Client VAT Number', el: 'ΑΦΜ Πελάτη' })}</Label>
            <Input id="customerVatNumber" name="vatNumber" value={offerData.customerInfo.vatNumber || ''} onChange={handleCustomerInfoChange} placeholder="EL123456789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerGemhNumber">{t({ en: 'Client General Commercial Registry Number', el: 'Αριθμός ΓΕΜΗ Πελάτη' })}</Label>
            <Input id="customerGemhNumber" name="gemhNumber" value={offerData.customerInfo.gemhNumber || ''} onChange={handleCustomerInfoChange} placeholder="123456789012" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerContact">{t({ en: 'Client Email/Contact', el: 'Email/Επικοινωνία Πελάτη' })}</Label>
            <Input id="customerContact" name="contact" type="text" value={offerData.customerInfo.contact} onChange={handleCustomerInfoChange} placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone2">{t({ en: 'Client Phone (Optional)', el: 'Τηλέφωνο Πελάτη (Προαιρετικό)' })}</Label>
            <Input id="customerPhone2" name="phone2" value={offerData.customerInfo.phone2 || ''} onChange={handleCustomerInfoChange} placeholder="555-0202" />
          </div>
           <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customerAddress">{t({ en: 'Client Address', el: 'Διεύθυνση Πελάτη' })}</Label>
            <Textarea id="customerAddress" name="address" value={offerData.customerInfo.address || ''} onChange={handleCustomerInfoChange} placeholder="456 Client Ave, Town, Country" />
          </div>
          {currentEntitlements.canSaveCustomers && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customerNotes">{t({ en: 'Customer Notes (Internal)', el: 'Σημειώσεις Πελάτη (Εσωτερικές)' })}</Label>
              <Textarea id="customerNotes" name="notes" value={offerData.customerInfo.notes || ''} onChange={handleCustomerInfoChange} placeholder={t({en: "Add notes about this customer...", el: "Προσθέστε σημειώσεις..."})} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="offerCurrency">{t({ en: 'Offer Currency', el: 'Νόμισμα Προσφοράς' })}</Label>
            <Select value={offerData.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="offerCurrency" className="w-full">
                <SelectValue placeholder={t({ en: "Select currency", el: "Επιλογή νομίσματος" })} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencyMetadata).map(([code, {label, IconComponent}]) => (
                   <SelectItem key={code} value={code}>
                     <div className="flex items-center">
                       <IconComponent className="h-4 w-4 mr-2" />
                       {t({en: label, el: label} as any)}
                     </div>
                   </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityStartDate">{t({ en: 'Offer Valid From', el: 'Έναρξη Ισχύος Προσφοράς' })}</Label>
            <DatePicker 
              date={offerData.validityStartDate ? new Date(offerData.validityStartDate) : undefined} 
              onDateChange={(date) => setOfferData({ ...offerData, validityStartDate: date })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityEndDate">{t({ en: 'Offer Valid Until', el: 'Λήξη Ισχύος Προσφοράς' })}</Label>
            <DatePicker 
              date={offerData.validityEndDate ? new Date(offerData.validityEndDate) : undefined} 
              onDateChange={(date) => setOfferData({ ...offerData, validityEndDate: date })} 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl md:text-2xl">{t({ en: 'Products', el: 'Προϊόντα' })}</CardTitle>
          <Button type="button" variant="outline" onClick={addProduct} className="text-primary border-primary hover:bg-primary/10">
            <PlusCircle className="mr-2 h-5 w-5" /> {t({ en: 'Add Product', el: 'Προσθήκη Προϊόντος' })}
          </Button>
        </CardHeader>
        <CardContent>
          {offerData.products.length === 0 && (
            <p className="text-muted-foreground text-center py-4">{t({ en: 'No products added yet. Click Add Product to get started.', el: 'Δεν έχουν προστεθεί προϊόντα ακόμα. Κάντε κλικ στην Προσθήκη Προϊόντος για να ξεκινήσετε.' })}</p>
          )}
          {offerData.products.map((product, index) => (
            <ProductItemCard
              key={product.id || index}
              index={index}
              product={product}
              currencySymbol={currentCurrencySymbol}
              updateProduct={updateProduct}
              removeProduct={removeProduct}
              moveProduct={moveProduct}
              t={t}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-xl md:text-2xl">{t({ en: 'Price Summary', el: 'Σύνοψη Τιμών' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentCalculatedTotals.totalOriginalPrice.toFixed(2) !== currentCalculatedTotals.subtotalDiscounted.toFixed(2) && (
            <div className="flex justify-between items-center text-base md:text-lg">
              <span className="text-muted-foreground">{t({ en: 'Total Original Price (excl. VAT):', el: 'Συνολική Αρχική Τιμή (χωρίς ΦΠΑ):' })}</span>
              <span className="font-semibold">{currentCurrencySymbol}{currentCalculatedTotals.totalOriginalPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-base md:text-lg">
            <span className="text-muted-foreground">
              {isFinalPriceVatInclusive
                ? t({ en: 'Subtotal (Net):', el: 'Μερικό Σύνολο (Καθαρό):' })
                : t({ en: 'Subtotal (Discounted, excl. VAT):', el: 'Μερικό Σύνολο (με Έκπτωση, χωρίς ΦΠΑ):' })
              }
            </span>
            <span className="font-semibold">{currentCurrencySymbol}{currentCalculatedTotals.subtotalDiscounted.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isFinalPriceVatInclusive"
              checked={isFinalPriceVatInclusive}
              onCheckedChange={(checked) => setIsFinalPriceVatInclusive(checked as boolean)}
            />
            <Label htmlFor="isFinalPriceVatInclusive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t({ en: 'Prices include VAT', el: 'Οι τιμές περιλαμβάνουν ΦΠΑ' })}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vatRate">{t({ en: 'VAT Rate (%)', el: 'Ποσοστό ΦΠΑ (%)' })}</Label>
            <div className="flex items-center">
              <Input id="vatRate" type="number" value={offerData.vatRate || 0} onChange={handleVatRateChange} placeholder="0" min="0" className="w-24 mr-2" />
              <Percent className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-between items-center text-base md:text-lg">
            <span className="text-muted-foreground">{t({ en: `VAT (${offerData.vatRate || 0}%):`, el: `ΦΠΑ (${offerData.vatRate || 0}%):` })}</span>
            <span className="font-semibold">{currentCurrencySymbol}{currentCalculatedTotals.vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg md:text-xl font-bold text-primary">
            <span>{t({ en: 'Grand Total (incl. VAT):', el: 'Γενικό Σύνολο (με ΦΠΑ):' })}</span>
            <span>{currentCurrencySymbol}{currentCalculatedTotals.grandTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl md:text-2xl">{t({ en: 'Notes / Terms & Conditions', el: 'Σημειώσεις / Όροι & Προϋποθέσεις' })}</CardTitle>
           {currentEntitlements.canSaveTemplates && (
             <Button type="button" variant="outline" onClick={handleSaveTemplate} disabled={isSavingTemplate}>
                {isSavingTemplate ? <LoadingSpinner className="h-4 w-4 mr-2"/> : <BookTemplate className="mr-2 h-5 w-5" />}
                {t({en:"Save as Template", el:"Αποθήκευση ως Πρότυπο"})}
             </Button>
           )}
        </CardHeader>
        <CardContent>
          <Textarea
            value={offerData.termsAndConditions}
            onChange={(e) => setOfferData({ ...offerData, termsAndConditions: e.target.value })}
            placeholder={t({ en: "Enter any notes or terms and conditions for this offer...", el: "Εισαγάγετε τυχόν σημειώσεις ή όρους και προϋποθέσεις για αυτήν την προσφορά..."})}
            rows={5}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4 pt-6 border-t mt-8">
        <Button type="button" variant="outline" onClick={handleShare} disabled={isSharing || isExportingPdf}>
          {isSharing ? <LoadingSpinner className="mr-2 h-5 w-5" /> : <Share2 className="mr-2 h-5 w-5" />}
          {isSharing ? t({ en: 'Sharing...', el: 'Κοινοποίηση...' }) : t({ en: 'Share Offer', el: 'Κοινοποίηση Προσφοράς' })}
        </Button>
        
        <Button type="button" variant="outline" onClick={triggerImportFileDialog} disabled={isSaving || isSharing || isExportingPdf || isExportingJpeg || isExportingJson || isExportingExcel}>
          <FileUp className="mr-2 h-5 w-5" /> {t({ en: 'Import Data', el: 'Εισαγωγή Δεδομένων' })}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isSaving || isSharing || isExportingPdf || isExportingJpeg || isExportingJson || isExportingExcel}>
              {isExportingPdf || isExportingJpeg || isExportingJson || isExportingExcel ? <LoadingSpinner className="mr-2 h-5 w-5" /> : <FileDown className="mr-2 h-5 w-5" />}
              {t({ en: 'Export', el: 'Εξαγωγή' })}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportPdf} disabled={isExportingPdf}>
              {isExportingPdf ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
              {isExportingPdf ? t({en: 'Generating PDF...', el: 'Δημιουργία PDF...'}) : t({ en: 'Export as PDF', el: 'Εξαγωγή ως PDF' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJpeg} disabled={isExportingJpeg}>
               {isExportingJpeg ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <ImageIconLucide className="mr-2 h-4 w-4" />}
              {isExportingJpeg ? t({en: 'Generating JPEG...', el: 'Δημιουργία JPEG...'}) : t({ en: 'Export as JPEG (Page 1)', el: 'Εξαγωγή ως JPEG (Σελίδα 1)' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJson} disabled={isExportingJson}>
              {isExportingJson ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 lucide lucide-file-json-2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="M7 10a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1"/><path d="M15 10a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1"/><path d="M11 10a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1"/><path d="M4 15l2 2-2 2"/><path d="M18 15l-2 2 2 2"/></svg>}
              {isExportingJson ? t({en: 'Exporting Data...', el: 'Εξαγωγή Δεδομένων...'}) : t({ en: 'Export Offer Data (.json)', el: 'Εξαγωγή Δεδομένων Προσφοράς (.json)' })}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportExcel} disabled={isExportingExcel}>
              {isExportingExcel ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
              {isExportingExcel ? t({en: 'Exporting Excel...', el: 'Εξαγωγή Excel...'}) : t({en: 'Export as Excel (.xlsx)', el: 'Εξαγωγή ως Excel (.xlsx)'})}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving || isSharing || isExportingPdf || isExportingJpeg || isExportingJson || isExportingExcel}>
          {isSaving ? <LoadingSpinner className="mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
          {isSaving ? t({ en: 'Saving...', el: 'Αποθήκευση...' }) : t({ en: 'Save Offer Sheet', el: 'Αποθήκευση Δελτίου Προσφοράς' })}
        </Button>
      </div>
    </form>
    </>
  );
}


"use client";

import * as React from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { OfferSheetData, Product, CustomerInfo, Currency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadCloud, PlusCircle, Trash2, FileDown, Share2, Save, Euro, DollarSign as DollarIcon, PoundSterling, FileText, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { DndProvider, useDrag, useDrop, type XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useLocalization } from '@/hooks/useLocalization';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const initialProduct: Product = {
  id: '',
  title: '',
  originalPrice: 0,
  discountedPrice: 0,
  description: '',
  imageUrl: undefined,
};

const initialCustomerInfo: CustomerInfo = {
  name: '',
  company: '',
  contact: '',
};

const currencyMetadata: Record<Currency, { symbol: string; IconComponent: React.ElementType, label: string }> = {
  EUR: { symbol: '€', IconComponent: Euro, label: 'Euro' },
  USD: { symbol: '$', IconComponent: DollarIcon, label: 'US Dollar' },
  GBP: { symbol: '£', IconComponent: PoundSterling, label: 'British Pound' },
};

const getCurrencySymbol = (currency: Currency): string => {
  return currencyMetadata[currency]?.symbol || '$';
};

const BASE_DEFAULT_CURRENCY: Currency = 'EUR';

const initialOfferSheetData = (defaultCurrency: Currency): OfferSheetData => ({
  logoUrl: undefined,
  customerInfo: initialCustomerInfo,
  validityStartDate: undefined,
  validityEndDate: undefined,
  products: [],
  termsAndConditions: '',
  currency: defaultCurrency,
});


interface ProductItemProps {
  product: Product;
  index: number;
  currencySymbol: string;
  updateProduct: (index: number, updatedProduct: Product) => void;
  removeProduct: (index: number) => void;
  moveProduct: (dragIndex: number, hoverIndex: number) => void;
  t: (translations: { [key in 'en' | 'el']?: string } | string, fallback?: string) => string;
}

const ItemTypes = {
  PRODUCT: 'product',
}

interface DragItem {
  index: number
  id: string
  type: string
}

const ProductItemCard: React.FC<ProductItemProps> = ({ product, index, currencySymbol, updateProduct, removeProduct, moveProduct, t }) => {
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

  const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateProduct(index, { ...product, [name]: name.includes('Price') ? parseFloat(value) || 0 : value });
  };

  const handleProductImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProduct(index, { ...product, imageUrl: reader.result as string });
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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`productTitle-${index}`}>{t({ en: 'Title', el: 'Τίτλος' })}</Label>
            <Input id={`productTitle-${index}`} name="title" value={product.title} onChange={handleProductChange} placeholder={t({ en: "Product Title", el: "Τίτλος Προϊόντος" })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`productDescription-${index}`}>{t({ en: 'Description', el: 'Περιγραφή' })}</Label>
            <Textarea id={`productDescription-${index}`} name="description" value={product.description} onChange={handleProductChange} placeholder={t({ en: "Product Description", el: "Περιγραφή Προϊόντος" })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`originalPrice-${index}`}>{t({ en: 'Original Price', el: 'Αρχική Τιμή' })} ({currencySymbol})</Label>
            <Input id={`originalPrice-${index}`} name="originalPrice" type="number" value={product.originalPrice} onChange={handleProductChange} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`discountedPrice-${index}`}>{t({ en: 'Discounted Price', el: 'Τιμή με Έκπτωση' })} ({currencySymbol})</Label>
            <Input id={`discountedPrice-${index}`} name="discountedPrice" type="number" value={product.discountedPrice} onChange={handleProductChange} placeholder="0.00" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`productImage-${index}`}>{t({ en: 'Product Image', el: 'Εικόνα Προϊόντος' })}</Label>
            <Input id={`productImage-${index}`} type="file" accept="image/*" onChange={handleProductImageUpload} className="file:text-primary file:font-medium" />
            {product.imageUrl && (
              <div className="mt-2">
                <Image src={product.imageUrl} alt={t({ en: "Product Preview", el: "Προεπισκόπηση Προϊόντος" })} width={100} height={100} className="rounded-md object-cover" data-ai-hint="product image" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default function OfferSheetForm() {
  const { t } = useLocalization();
  const [offerData, setOfferData] = React.useState<OfferSheetData>(() => initialOfferSheetData(BASE_DEFAULT_CURRENCY));
  const [logoPreview, setLogoPreview] = React.useState<string | undefined>(undefined);
  const { toast } = useToast();
  const offerSheetRef = React.useRef<HTMLFormElement>(null);


  React.useEffect(() => {
    let userDefaultLogo: string | undefined = undefined;
    let userDefaultCurrency: Currency = BASE_DEFAULT_CURRENCY;

    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.defaultLogoUrl) {
          userDefaultLogo = parsedSettings.defaultLogoUrl;
        }
        if (parsedSettings.defaultCurrency && currencyMetadata[parsedSettings.defaultCurrency]) {
          userDefaultCurrency = parsedSettings.defaultCurrency;
        }
      } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        userDefaultLogo = undefined;
        userDefaultCurrency = BASE_DEFAULT_CURRENCY;
      }
    }
    
    setOfferData(prev => {
      const newLogoUrl = prev.logoUrl === undefined && userDefaultLogo ? userDefaultLogo : prev.logoUrl;
      const newCurrency = prev.currency === BASE_DEFAULT_CURRENCY ? userDefaultCurrency : prev.currency;
      
      return {
        ...prev,
        logoUrl: newLogoUrl,
        currency: newCurrency,
      };
    });

    if (userDefaultLogo && (offerData.logoUrl === userDefaultLogo || (offerData.logoUrl === undefined))) {
        setLogoPreview(userDefaultLogo);
    } else if (offerData.logoUrl) {
        setLogoPreview(offerData.logoUrl);
    }
  }, []);


  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setOfferData({ ...offerData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCustomerInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOfferData({
      ...offerData,
      customerInfo: { ...offerData.customerInfo, [e.target.name]: e.target.value },
    });
  };
  
  const addProduct = () => {
    setOfferData({
      ...offerData,
      products: [...offerData.products, { ...initialProduct, id: `product-${Date.now()}` }],
    });
  };

  const updateProduct = (index: number, updatedProduct: Product) => {
    const newProducts = [...offerData.products];
    newProducts[index] = updatedProduct;
    setOfferData({ ...offerData, products: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = offerData.products.filter((_, i) => i !== index);
    setOfferData({ ...offerData, products: newProducts });
  };
  
  const moveProduct = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setOfferData((prevOfferData) =>
      update(prevOfferData, {
        products: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevOfferData.products[dragIndex] as Product],
          ],
        },
      }),
    )
  }, []); 

  const handleCurrencyChange = (value: string) => {
    if (currencyMetadata[value as Currency]) {
      setOfferData({ ...offerData, currency: value as Currency });
    }
  };

  const calculateTotals = () => {
    const totalOriginalPrice = offerData.products.reduce((sum, p) => sum + (p.originalPrice || 0), 0);
    const totalDiscountedPrice = offerData.products.reduce((sum, p) => sum + (p.discountedPrice || 0), 0);
    return { totalOriginalPrice, totalDiscountedPrice };
  };

  const { totalOriginalPrice, totalDiscountedPrice } = calculateTotals();
  const currentCurrencySymbol = getCurrencySymbol(offerData.currency);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Offer Sheet Data:", offerData);
    toast({
      title: t({ en: "Offer Sheet Saved (Simulated)", el: "Το Δελτίο Προσφοράς Αποθηκεύτηκε (Προσομοίωση)" }),
      description: t({ en: "Your offer sheet data has been logged to the console.", el: "Τα δεδομένα του δελτίου προσφοράς καταγράφηκαν στην κονσόλα." }),
      variant: "default",
    });
  };
  
  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsPdf = async () => {
    const element = offerSheetRef.current;
    if (!element) {
      toast({ title: "Error", description: "Could not find offer sheet content to export.", variant: "destructive" });
      return;
    }
    toast({ title: t({en: "Generating PDF...", el: "Δημιουργία PDF..."}), description: t({en: "This may take a moment.", el: "Αυτό μπορεί να πάρει λίγο χρόνο."})});
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true,  windowWidth: element.scrollWidth, windowHeight: element.scrollHeight});
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const newImgWidth = imgWidth * ratio;
      const newImgHeight = imgHeight * ratio;
      
      // Center the image on the PDF page (optional)
      const xOffset = (pdfWidth - newImgWidth) / 2;
      const yOffset = (pdfHeight - newImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
      pdf.save('offer-sheet.pdf');
      toast({ title: t({en: "PDF Generated", el: "Το PDF δημιουργήθηκε"}), description: t({en: "Your PDF has been downloaded.", el: "Το PDF σας έχει ληφθεί."}), variant: "default" });
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: t({en: "PDF Generation Failed", el: "Η δημιουργία PDF απέτυχε"}), description: String(error), variant: "destructive" });
    }
  };

  const exportAsJpeg = async () => {
    const element = offerSheetRef.current;
    if (!element) {
      toast({ title: "Error", description: "Could not find offer sheet content to export.", variant: "destructive" });
      return;
    }
    toast({ title: t({en: "Generating JPEG...", el: "Δημιουργία JPEG..."}), description: t({en: "This may take a moment.", el: "Αυτό μπορεί να πάρει λίγο χρόνο."})});
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
      triggerDownload(dataUrl, 'offer-sheet.jpg');
      toast({ title: t({en: "JPEG Generated", el: "Το JPEG δημιουργήθηκε"}), description: t({en: "Your JPEG has been downloaded.", el: "Το JPEG σας έχει ληφθεί."}), variant: "default" });
    } catch (error) {
      console.error("Error generating JPEG:", error);
      toast({ title: t({en: "JPEG Generation Failed", el: "Η δημιουργία JPEG απέτυχε"}), description: String(error), variant: "destructive" });
    }
  };


  const handleShare = () => {
     toast({
      title: t({ en: "Share Feature Not Yet Active", el: "Η Κοινοποίηση δεν είναι Ενεργή Ακόμα" }),
      description: t({ en: "Direct sharing is under development. Please download your offer sheet first.", el: "Η απευθείας κοινοποίηση είναι υπό ανάπτυξη. Παρακαλούμε κατεβάστε πρώτα το δελτίο προσφοράς σας." }),
      variant: "default",
    });
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <form onSubmit={handleSubmit} ref={offerSheetRef} id="offer-sheet-form-capture-area" className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto bg-card rounded-xl shadow-2xl border">
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t({ en: 'Company Logo', el: 'Λογότυπο Εταιρείας' })}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {logoPreview ? (
            <Image src={logoPreview} alt={t({ en: "Logo Preview", el: "Προεπισκόπηση Λογοτύπου" })} width={150} height={150} className="rounded-md object-contain border p-2" data-ai-hint="company logo" />
          ) : (
            <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
              <UploadCloud className="h-16 w-16" />
            </div>
          )}
          <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-sm file:text-primary file:font-medium" />
          <Label htmlFor="logoUpload" className="text-sm text-muted-foreground">{t({ en: 'Upload your company logo (PNG, JPG, SVG)', el: 'Μεταφορτώστε το λογότυπο της εταιρείας σας (PNG, JPG, SVG)' })}</Label>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t({ en: 'Customer Information & Offer Validity', el: 'Στοιχεία Πελάτη & Ισχύς Προσφοράς' })}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">{t({ en: 'Customer Name', el: 'Όνομα Πελάτη' })}</Label>
            <Input id="customerName" name="name" value={offerData.customerInfo.name} onChange={handleCustomerInfoChange} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerCompany">{t({ en: 'Company', el: 'Εταιρεία' })}</Label>
            <Input id="customerCompany" name="company" value={offerData.customerInfo.company} onChange={handleCustomerInfoChange} placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerContact">{t({ en: 'Contact (Email/Phone)', el: 'Επικοινωνία (Email/Τηλέφωνο)' })}</Label>
            <Input id="customerContact" name="contact" value={offerData.customerInfo.contact} onChange={handleCustomerInfoChange} placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offerCurrency">{t({ en: 'Offer Currency', el: 'Νόμισμα Προσφοράς' })}</Label>
            <Select value={offerData.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="offerCurrency">
                <SelectValue placeholder={t({ en: "Select currency", el: "Επιλογή νομίσματος" })} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencyMetadata).map(([code, {label, IconComponent}]) => (
                   <SelectItem key={code} value={code}>
                     <div className="flex items-center">
                       <IconComponent className="h-4 w-4 mr-2" />
                       {t({en: label, el: label})}
                     </div>
                   </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityStartDate">{t({ en: 'Offer Valid From', el: 'Έναρξη Ισχύος Προσφοράς' })}</Label>
            <DatePicker date={offerData.validityStartDate} onDateChange={(date) => setOfferData({ ...offerData, validityStartDate: date })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityEndDate">{t({ en: 'Offer Valid Until', el: 'Λήξη Ισχύος Προσφοράς' })}</Label>
            <DatePicker date={offerData.validityEndDate} onDateChange={(date) => setOfferData({ ...offerData, validityEndDate: date })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">{t({ en: 'Products', el: 'Προϊόντα' })}</CardTitle>
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
          <CardTitle className="font-headline text-2xl">{t({ en: 'Price Summary', el: 'Σύνοψη Τιμών' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">{t({ en: 'Total Original Price:', el: 'Συνολική Αρχική Τιμή:' })}</span>
            <span className="font-semibold">{currentCurrencySymbol}{totalOriginalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-primary">
            <span>{t({ en: 'Total Discounted Price:', el: 'Συνολική Τιμή με Έκπτωση:' })}</span>
            <span>{currentCurrencySymbol}{totalDiscountedPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t({ en: 'Notes / Terms & Conditions', el: 'Σημειώσεις / Όροι & Προϋποθέσεις' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={offerData.termsAndConditions}
            onChange={(e) => setOfferData({ ...offerData, termsAndConditions: e.target.value })}
            placeholder={t({ en: "Enter any notes or terms and conditions for this offer...", el: "Εισαγάγετε τυχόν σημειώσεις ή όρους και προϋпоθέσεις για αυτήν την προσφορά..."})}
            rows={5}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t mt-8">
        <Button type="button" variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-5 w-5" /> {t({ en: 'Share', el: 'Κοινοποίηση' })}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FileDown className="mr-2 h-5 w-5" /> {t({ en: 'Export', el: 'Εξαγωγή' })}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportAsPdf}>
              <FileText className="mr-2 h-4 w-4" />
              {t({ en: 'Export as PDF', el: 'Εξαγωγή ως PDF' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsJpeg}>
              <ImageIcon className="mr-2 h-4 w-4" />
              {t({ en: 'Export as JPEG', el: 'Εξαγωγή ως JPEG' })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> {t({ en: 'Save Offer Sheet', el: 'Αποθήκευση Δελτίου Προσφοράς' })}
        </Button>
      </div>
    </form>
    </DndProvider>
  );
}

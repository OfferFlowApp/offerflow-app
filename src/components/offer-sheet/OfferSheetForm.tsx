
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
import { UploadCloud, PlusCircle, Trash2, FileDown, Share2, Save, Euro, DollarSign as DollarIcon, PoundSterling, FileText, Image as ImageIcon, Percent } from 'lucide-react';
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
  discountedPriceType: 'exclusive', // Default to price excluding VAT
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
  vatRate: 0, // Default VAT rate to 0%
});


interface ProductItemProps {
  product: Product;
  index: number;
  currencySymbol: string;
  updateProduct: (index: number, updatedProduct: Product) => void;
  removeProduct: (index: number) => void;
  moveProduct: (dragIndex: number, hoverIndex: number) => void;
  t: (translations: { [key in 'en' | 'el' | 'de' | 'fr']?: string } | string, fallback?: string) => string;
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

  const handleProductFieldChange = (fieldName: keyof Product, value: any) => {
    updateProduct(index, { ...product, [fieldName]: value });
  };
  
  const handleProductInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof Product;
    const parsedValue = name.includes('Price') ? parseFloat(value) || 0 : value;
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
          <CardTitle className="text-lg font-medium">{t({ en: 'Product', el: 'Προϊόν', de: 'Produkt', fr: 'Produit' })} #{index + 1}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => removeProduct(index)} className="text-destructive hover:text-destructive/80">
            <Trash2 className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`productTitle-${index}`}>{t({ en: 'Title', el: 'Τίτλος', de: 'Titel', fr: 'Titre' })}</Label>
            <Input id={`productTitle-${index}`} name="title" value={product.title} onChange={handleProductInputChange} placeholder={t({ en: "Product Title", el: "Τίτλος Προϊόντος", de: "Produkttitel", fr: "Titre du produit" })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`productDescription-${index}`}>{t({ en: 'Description', el: 'Περιγραφή', de: 'Beschreibung', fr: 'Description' })}</Label>
            <Textarea id={`productDescription-${index}`} name="description" value={product.description} onChange={handleProductInputChange} placeholder={t({ en: "Product Description", el: "Περιγραφή Προϊόντος", de: "Produktbeschreibung", fr: "Description du produit" })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`originalPrice-${index}`}>{t({ en: 'Original Price (excl. VAT)', el: 'Αρχική Τιμή (χωρίς ΦΠΑ)', de: 'Originalpreis (exkl. MwSt.)', fr: 'Prix Original (hors TVA)' })} ({currencySymbol})</Label>
            <Input id={`originalPrice-${index}`} name="originalPrice" type="number" value={product.originalPrice} onChange={handleProductInputChange} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`discountedPrice-${index}`}>{t({ en: 'Discounted Price', el: 'Τιμή με Έκπτωση', de: 'Reduzierter Preis', fr: 'Prix Réduit' })} ({currencySymbol})</Label>
            <Input id={`discountedPrice-${index}`} name="discountedPrice" type="number" value={product.discountedPrice} onChange={handleProductInputChange} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`discountedPriceType-${index}`}>{t({ en: 'Discounted Price Type', el: 'Τύπος Τιμής με Έκπτωση', de: 'Art des reduzierten Preises', fr: 'Type de Prix Réduit' })}</Label>
            <Select
              value={product.discountedPriceType || 'exclusive'}
              onValueChange={(value) => handleProductFieldChange('discountedPriceType', value as 'exclusive' | 'inclusive')}
            >
              <SelectTrigger id={`discountedPriceType-${index}`}>
                <SelectValue placeholder={t({en: "Select type", el: "Επιλογή τύπου", de: "Typ auswählen", fr: "Sélectionner le type"})} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive">{t({en: "Excludes VAT", el: "Χωρίς ΦΠΑ", de: "Exklusive MwSt.", fr: "Hors TVA"})}</SelectItem>
                <SelectItem value="inclusive">{t({en: "Includes VAT", el: "Με ΦΠΑ", de: "Inklusive MwSt.", fr: "TVA incluse"})}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`productImage-${index}`}>{t({ en: 'Product Image', el: 'Εικόνα Προϊόντος', de: 'Produktbild', fr: 'Image du Produit' })}</Label>
            <Input id={`productImage-${index}`} type="file" accept="image/*" onChange={handleProductImageUpload} className="file:text-primary file:font-medium" />
            {product.imageUrl && (
              <div className="mt-2">
                <Image src={product.imageUrl} alt={t({ en: "Product Preview", el: "Προεπισκόπηση Προϊόντος", de: "Produktvorschau", fr: "Aperçu du produit" })} width={100} height={100} className="rounded-md object-cover" data-ai-hint="product image" />
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
        vatRate: prev.vatRate === undefined ? 0 : prev.vatRate, // Ensure vatRate is initialized
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

  const handleVatRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOfferData({ ...offerData, vatRate: parseFloat(value) || 0 });
  };

  const calculateTotals = () => {
    const currentVatRateAsDecimal = (offerData.vatRate || 0) / 100;

    const totalOriginalPrice = offerData.products.reduce((sum, p) => sum + (p.originalPrice || 0), 0);
    
    const subtotalDiscounted = offerData.products.reduce((sum, p) => {
      let priceExclVat = p.discountedPrice || 0;
      if (p.discountedPriceType === 'inclusive' && currentVatRateAsDecimal > 0) {
        priceExclVat = (p.discountedPrice || 0) / (1 + currentVatRateAsDecimal);
      }
      return sum + priceExclVat;
    }, 0);

    const vatAmount = subtotalDiscounted * currentVatRateAsDecimal;
    const grandTotal = subtotalDiscounted + vatAmount;

    return { totalOriginalPrice, subtotalDiscounted, vatAmount, grandTotal };
  };

  const { totalOriginalPrice, subtotalDiscounted, vatAmount, grandTotal } = calculateTotals();
  const currentCurrencySymbol = getCurrencySymbol(offerData.currency);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const offerDataWithTotals = {
        ...offerData,
        calculatedTotals: {
            totalOriginalPrice,
            subtotalDiscounted,
            vatAmount,
            grandTotal,
            vatRateApplied: offerData.vatRate || 0,
            currency: offerData.currency,
        }
    };
    console.log("Offer Sheet Data:", offerDataWithTotals);
    toast({
      title: t({ en: "Offer Sheet Saved (Simulated)", el: "Το Δελτίο Προσφοράς Αποθηκεύτηκε (Προσομοίωση)", de: "Angebot gespeichert (Simuliert)", fr: "Devis sauvegardé (Simulation)" }),
      description: t({ en: "Your offer sheet data has been logged to the console.", el: "Τα δεδομένα του δελτίου προσφοράς καταγράφηκαν στην κονσόλα.", de: "Ihre Angebotsdaten wurden in der Konsole protokolliert.", fr: "Les données de votre devis ont été enregistrées dans la console." }),
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
      toast({ title: t({en: "Error", el: "Σφάλμα", de: "Fehler", fr: "Erreur"}), description: t({en: "Could not find offer sheet content to export.", el: "Δεν ήταν δυνατή η εύρεση περιεχομένου δελτίου προσφοράς για εξαγωγή.", de: "Angebot konnte nicht zum Export gefunden werden.", fr: "Impossible de trouver le contenu du devis à exporter."}), variant: "destructive" });
      return;
    }
    toast({ title: t({en: "Generating PDF...", el: "Δημιουργία PDF...", de: "PDF wird generiert...", fr: "Génération du PDF..."}), description: t({en: "This may take a moment.", el: "Αυτό μπορεί να πάρει λίγο χρόνο.", de: "Dies kann einen Moment dauern.", fr: "Cela peut prendre un moment."})});
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true,  windowWidth: element.scrollWidth, windowHeight: element.scrollHeight});
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = pdf.internal.pageSize.getHeight(); // Not directly used for single page image fit
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      // Calculate the number of pages needed
      const pageHeightA4 = pdf.internal.pageSize.getHeight();
      const contentHeightInMM = (imgHeight * pdfWidth) / imgWidth; // Scale image height to fit PDF width
      const numPages = Math.ceil(contentHeightInMM / pageHeightA4);

      for (let i = 0; i < numPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        // Calculate y-offset for cropping from the original canvas
        // The height of the crop is the original canvas height scaled to one PDF page height equivalent
        const cropSourceY = (pageHeightA4 / contentHeightInMM) * imgHeight * i;
        const cropSourceHeight = Math.min((pageHeightA4 / contentHeightInMM) * imgHeight, imgHeight - cropSourceY);

        // Create a temporary canvas for the current page's content
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth; // Keep original image width for quality
        pageCanvas.height = cropSourceHeight;
        const pageCtx = pageCanvas.getContext('2d');
        
        // Draw the cropped part of the original canvas onto the temporary page canvas
        pageCtx?.drawImage(canvas, 0, cropSourceY, imgWidth, cropSourceHeight, 0, 0, imgWidth, cropSourceHeight);
        const pageImgData = pageCanvas.toDataURL('image/png');
        
        // Add the image for the current page to the PDF
        // Scale it to fit the PDF width, height will adjust proportionally
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, (cropSourceHeight * pdfWidth) / imgWidth);
      }


      pdf.save('offer-sheet.pdf');
      toast({ title: t({en: "PDF Generated", el: "Το PDF δημιουργήθηκε", de: "PDF generiert", fr: "PDF généré"}), description: t({en: "Your PDF has been downloaded.", el: "Το PDF σας έχει ληφθεί.", de: "Ihre PDF wurde heruntergeladen.", fr: "Votre PDF a été téléchargé."}), variant: "default" });
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: t({en: "PDF Generation Failed", el: "Η δημιουργία PDF απέτυχε", de: "PDF-Generierung fehlgeschlagen", fr: "Échec de la génération du PDF"}), description: String(error), variant: "destructive" });
    }
  };

  const exportAsJpeg = async () => {
    const element = offerSheetRef.current;
    if (!element) {
      toast({ title: t({en: "Error", el: "Σφάλμα", de: "Fehler", fr: "Erreur"}), description: t({en: "Could not find offer sheet content to export.", el: "Δεν ήταν δυνατή η εύρεση περιεχομένου δελτίου προσφοράς για εξαγωγή.", de: "Angebot konnte nicht zum Export gefunden werden.", fr: "Impossible de trouver le contenu du devis à exporter."}), variant: "destructive" });
      return;
    }
    toast({ title: t({en: "Generating JPEG...", el: "Δημιουργία JPEG...", de: "JPEG wird generiert...", fr: "Génération du JPEG..."}), description: t({en: "This may take a moment.", el: "Αυτό μπορεί να πάρει λίγο χρόνο.", de: "Dies kann einen Moment dauern.", fr: "Cela peut prendre un moment."})});
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
      triggerDownload(dataUrl, 'offer-sheet.jpg');
      toast({ title: t({en: "JPEG Generated", el: "Το JPEG δημιουργήθηκε", de: "JPEG generiert", fr: "JPEG généré"}), description: t({en: "Your JPEG has been downloaded.", el: "Το JPEG σας έχει ληφθεί.", de: "Ihre JPEG wurde heruntergeladen.", fr: "Votre JPEG a été téléchargé."}), variant: "default" });
    } catch (error) {
      console.error("Error generating JPEG:", error);
      toast({ title: t({en: "JPEG Generation Failed", el: "Η δημιουργία JPEG απέτυχε", de: "JPEG-Generierung fehlgeschlagen", fr: "Échec de la génération du JPEG"}), description: String(error), variant: "destructive" });
    }
  };


  const handleShare = () => {
     toast({
      title: t({ en: "Share Feature Not Yet Active", el: "Η Κοινοποίηση δεν είναι Ενεργή Ακόμα", de: "Teilen-Funktion noch nicht aktiv", fr: "Fonction de partage pas encore active" }),
      description: t({ en: "Direct sharing is under development. Please download your offer sheet first.", el: "Η απευθείας κοινοποίηση είναι υπό ανάπτυξη. Παρακαλούμε κατεβάστε πρώτα το δελτίο προσφοράς σας.", de: "Direktes Teilen ist in Entwicklung. Bitte laden Sie zuerst Ihr Angebot herunter.", fr: "Le partage direct est en cours de développement. Veuillez d'abord télécharger votre devis." }),
      variant: "default",
    });
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <form onSubmit={handleSubmit} ref={offerSheetRef} id="offer-sheet-form-capture-area" className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto bg-card rounded-xl shadow-2xl border">
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t({ en: 'Company Logo', el: 'Λογότυπο Εταιρείας', de: 'Firmenlogo', fr: 'Logo de l\'entreprise' })}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {logoPreview ? (
            <Image src={logoPreview} alt={t({ en: "Logo Preview", el: "Προεπισκόπηση Λογοτύπου", de: "Logo-Vorschau", fr: "Aperçu du logo" })} width={150} height={150} className="rounded-md object-contain border p-2" data-ai-hint="company logo" />
          ) : (
            <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
              <UploadCloud className="h-16 w-16" />
            </div>
          )}
          <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-sm file:text-primary file:font-medium" />
          <Label htmlFor="logoUpload" className="text-sm text-muted-foreground">{t({ en: 'Upload your company logo (PNG, JPG, SVG)', el: 'Μεταφορτώστε το λογότυπο της εταιρείας σας (PNG, JPG, SVG)', de: 'Laden Sie Ihr Firmenlogo hoch (PNG, JPG, SVG)', fr: 'Téléchargez le logo de votre entreprise (PNG, JPG, SVG)' })}</Label>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t({ en: 'Customer Information & Offer Validity', el: 'Στοιχεία Πελάτη & Ισχύς Προσφοράς', de: 'Kundeninformationen & Angebotsgültigkeit', fr: 'Informations Client & Validité de l\'Offre' })}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">{t({ en: 'Customer Name', el: 'Όνομα Πελάτη', de: 'Kundenname', fr: 'Nom du Client' })}</Label>
            <Input id="customerName" name="name" value={offerData.customerInfo.name} onChange={handleCustomerInfoChange} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerCompany">{t({ en: 'Company', el: 'Εταιρεία', de: 'Firma', fr: 'Entreprise' })}</Label>
            <Input id="customerCompany" name="company" value={offerData.customerInfo.company} onChange={handleCustomerInfoChange} placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerContact">{t({ en: 'Contact (Email/Phone)', el: 'Επικοινωνία (Email/Τηλέφωνο)', de: 'Kontakt (E-Mail/Telefon)', fr: 'Contact (Email/Téléphone)' })}</Label>
            <Input id="customerContact" name="contact" value={offerData.customerInfo.contact} onChange={handleCustomerInfoChange} placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offerCurrency">{t({ en: 'Offer Currency', el: 'Νόμισμα Προσφοράς', de: 'Angebotswährung', fr: 'Devise de l\'Offre' })}</Label>
            <Select value={offerData.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="offerCurrency">
                <SelectValue placeholder={t({ en: "Select currency", el: "Επιλογή νομίσματος", de: "Währung auswählen", fr: "Sélectionner la devise" })} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencyMetadata).map(([code, {label, IconComponent}]) => (
                   <SelectItem key={code} value={code}>
                     <div className="flex items-center">
                       <IconComponent className="h-4 w-4 mr-2" />
                       {t({en: label, el: label, de: label, fr: label})}
                     </div>
                   </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityStartDate">{t({ en: 'Offer Valid From', el: 'Έναρξη Ισχύος Προσφοράς', de: 'Angebot gültig ab', fr: 'Offre Valable à Partir de' })}</Label>
            <DatePicker date={offerData.validityStartDate} onDateChange={(date) => setOfferData({ ...offerData, validityStartDate: date })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityEndDate">{t({ en: 'Offer Valid Until', el: 'Λήξη Ισχύος Προσφοράς', de: 'Angebot gültig bis', fr: 'Offre Valable Jusqu\'au' })}</Label>
            <DatePicker date={offerData.validityEndDate} onDateChange={(date) => setOfferData({ ...offerData, validityEndDate: date })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">{t({ en: 'Products', el: 'Προϊόντα', de: 'Produkte', fr: 'Produits' })}</CardTitle>
          <Button type="button" variant="outline" onClick={addProduct} className="text-primary border-primary hover:bg-primary/10">
            <PlusCircle className="mr-2 h-5 w-5" /> {t({ en: 'Add Product', el: 'Προσθήκη Προϊόντος', de: 'Produkt hinzufügen', fr: 'Ajouter un Produit' })}
          </Button>
        </CardHeader>
        <CardContent>
          {offerData.products.length === 0 && (
            <p className="text-muted-foreground text-center py-4">{t({ en: 'No products added yet. Click Add Product to get started.', el: 'Δεν έχουν προστεθεί προϊόντα ακόμα. Κάντε κλικ στην Προσθήκη Προϊόντος για να ξεκινήσετε.', de: 'Noch keine Produkte hinzugefügt. Klicken Sie auf Produkt hinzufügen, um zu beginnen.', fr: 'Aucun produit ajouté pour le moment. Cliquez sur Ajouter un produit pour commencer.' })}</p>
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
          <CardTitle className="font-headline text-2xl">{t({ en: 'Price Summary', el: 'Σύνοψη Τιμών', de: 'Preisübersicht', fr: 'Résumé des Prix' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">{t({ en: 'Total Original Price (excl. VAT):', el: 'Συνολική Αρχική Τιμή (χωρίς ΦΠΑ):', de: 'Gesamter Originalpreis (exkl. MwSt.):', fr: 'Prix Original Total (hors TVA):' })}</span>
            <span className="font-semibold">{currentCurrencySymbol}{totalOriginalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">{t({ en: 'Subtotal (Discounted, excl. VAT):', el: 'Μερικό Σύνολο (με Έκπτωση, χωρίς ΦΠΑ):', de: 'Zwischensumme (Reduziert, exkl. MwSt.):', fr: 'Sous-total (Réduit, hors TVA):' })}</span>
            <span className="font-semibold">{currentCurrencySymbol}{subtotalDiscounted.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatRate">{t({ en: 'VAT Rate (%)', el: 'Ποσοστό ΦΠΑ (%)', de: 'MwSt.-Satz (%)', fr: 'Taux de TVA (%)' })}</Label>
            <div className="flex items-center">
              <Input id="vatRate" type="number" value={offerData.vatRate || 0} onChange={handleVatRateChange} placeholder="0" className="w-24 mr-2" />
              <Percent className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">{t({ en: `VAT (${offerData.vatRate || 0}%):`, el: `ΦΠΑ (${offerData.vatRate || 0}%):`, de: `MwSt. (${offerData.vatRate || 0}%):`, fr: `TVA (${offerData.vatRate || 0}%):` })}</span>
            <span className="font-semibold">{currentCurrencySymbol}{vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-primary">
            <span>{t({ en: 'Grand Total (incl. VAT):', el: 'Γενικό Σύνολο (με ΦΠΑ):', de: 'Gesamtsumme (inkl. MwSt.):', fr: 'Total Général (TVA incl.):' })}</span>
            <span>{currentCurrencySymbol}{grandTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t({ en: 'Notes / Terms & Conditions', el: 'Σημειώσεις / Όροι & Προϋποθέσεις', de: 'Anmerkungen / AGB', fr: 'Notes / Termes & Conditions' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={offerData.termsAndConditions}
            onChange={(e) => setOfferData({ ...offerData, termsAndConditions: e.target.value })}
            placeholder={t({ en: "Enter any notes or terms and conditions for this offer...", el: "Εισαγάγετε τυχόν σημειώσεις ή όρους και προϋποθέσεις για αυτήν την προσφορά...", de: "Geben Sie hier Anmerkungen oder AGB für dieses Angebot ein...", fr: "Entrez ici les notes ou termes et conditions pour cette offre..."})}
            rows={5}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t mt-8">
        <Button type="button" variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-5 w-5" /> {t({ en: 'Share', el: 'Κοινοποίηση', de: 'Teilen', fr: 'Partager' })}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FileDown className="mr-2 h-5 w-5" /> {t({ en: 'Export', el: 'Εξαγωγή', de: 'Exportieren', fr: 'Exporter' })}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportAsPdf}>
              <FileText className="mr-2 h-4 w-4" />
              {t({ en: 'Export as PDF', el: 'Εξαγωγή ως PDF', de: 'Als PDF exportieren', fr: 'Exporter en PDF' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsJpeg}>
              <ImageIcon className="mr-2 h-4 w-4" />
              {t({ en: 'Export as JPEG', el: 'Εξαγωγή ως JPEG', de: 'Als JPEG exportieren', fr: 'Exporter en JPEG' })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> {t({ en: 'Save Offer Sheet', el: 'Αποθήκευση Δελτίου Προσφοράς', de: 'Angebot speichern', fr: 'Sauvegarder le Devis' })}
        </Button>
      </div>
    </form>
    </DndProvider>
  );
}

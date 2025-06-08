"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { OfferSheetData, Product, CustomerInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker'; 
import { UploadCloud, PlusCircle, Trash2, FileDown, Share2, Save, Settings, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { DndProvider, useDrag, useDrop, type XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

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

const initialOfferSheetData: OfferSheetData = {
  logoUrl: undefined,
  customerInfo: initialCustomerInfo,
  validityStartDate: undefined,
  validityEndDate: undefined,
  products: [],
  termsAndConditions: '',
};

interface ProductItemProps {
  product: Product;
  index: number;
  updateProduct: (index: number, updatedProduct: Product) => void;
  removeProduct: (index: number) => void;
  moveProduct: (dragIndex: number, hoverIndex: number) => void;
}

const ItemTypes = {
  PRODUCT: 'product',
}

interface DragItem {
  index: number
  id: string
  type: string
}

const ProductItemCard: React.FC<ProductItemProps> = ({ product, index, updateProduct, removeProduct, moveProduct }) => {
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
          <CardTitle className="text-lg font-medium">Product #{index + 1}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => removeProduct(index)} className="text-destructive hover:text-destructive/80">
            <Trash2 className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`productTitle-${index}`}>Title</Label>
            <Input id={`productTitle-${index}`} name="title" value={product.title} onChange={handleProductChange} placeholder="Product Title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`productDescription-${index}`}>Description</Label>
            <Textarea id={`productDescription-${index}`} name="description" value={product.description} onChange={handleProductChange} placeholder="Product Description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`originalPrice-${index}`}>Original Price</Label>
            <Input id={`originalPrice-${index}`} name="originalPrice" type="number" value={product.originalPrice} onChange={handleProductChange} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`discountedPrice-${index}`}>Discounted Price</Label>
            <Input id={`discountedPrice-${index}`} name="discountedPrice" type="number" value={product.discountedPrice} onChange={handleProductChange} placeholder="0.00" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`productImage-${index}`}>Product Image</Label>
            <Input id={`productImage-${index}`} type="file" accept="image/*" onChange={handleProductImageUpload} className="file:text-primary file:font-medium" />
            {product.imageUrl && (
              <div className="mt-2">
                <Image src={product.imageUrl} alt="Product Preview" width={100} height={100} className="rounded-md object-cover" data-ai-hint="product image" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default function OfferSheetForm() {
  const [offerData, setOfferData] = useState<OfferSheetData>(initialOfferSheetData);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data or default settings
    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      if(parsedSettings.defaultLogoUrl) {
        setOfferData(prev => ({ ...prev, logoUrl: parsedSettings.defaultLogoUrl }));
        setLogoPreview(parsedSettings.defaultLogoUrl);
      }
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
  
  const moveProduct = useCallback((dragIndex: number, hoverIndex: number) => {
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


  const calculateTotals = () => {
    const totalOriginalPrice = offerData.products.reduce((sum, p) => sum + (p.originalPrice || 0), 0);
    const totalDiscountedPrice = offerData.products.reduce((sum, p) => sum + (p.discountedPrice || 0), 0);
    return { totalOriginalPrice, totalDiscountedPrice };
  };

  const { totalOriginalPrice, totalDiscountedPrice } = calculateTotals();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // For now, just log data. Later, this would save to a backend.
    console.log("Offer Sheet Data:", offerData);
    toast({
      title: "Offer Sheet Saved (Simulated)",
      description: "Your offer sheet data has been logged to the console.",
      variant: "default",
    });
  };
  
  const handleExportPdf = () => {
    toast({
      title: "Export to PDF (Placeholder)",
      description: "This feature will be implemented soon.",
      variant: "default",
    });
  }

  const handleShare = () => {
     toast({
      title: "Share Offer (Placeholder)",
      description: "Sharing functionality will be available soon.",
      variant: "default",
    });
  }


  return (
    <DndProvider backend={HTML5Backend}>
    <form onSubmit={handleSubmit} className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Logo Upload Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Company Logo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {logoPreview ? (
            <Image src={logoPreview} alt="Logo Preview" width={150} height={150} className="rounded-md object-contain border p-2" data-ai-hint="company logo" />
          ) : (
            <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
              <UploadCloud className="h-16 w-16" />
            </div>
          )}
          <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-sm file:text-primary file:font-medium" />
          <Label htmlFor="logoUpload" className="text-sm text-muted-foreground">Upload your company logo (PNG, JPG, SVG)</Label>
        </CardContent>
      </Card>

      {/* Customer Info & Validity Dates Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Customer Information & Offer Validity</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input id="customerName" name="name" value={offerData.customerInfo.name} onChange={handleCustomerInfoChange} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerCompany">Company</Label>
            <Input id="customerCompany" name="company" value={offerData.customerInfo.company} onChange={handleCustomerInfoChange} placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerContact">Contact (Email/Phone)</Label>
            <Input id="customerContact" name="contact" value={offerData.customerInfo.contact} onChange={handleCustomerInfoChange} placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityStartDate">Offer Valid From</Label>
            <DatePicker date={offerData.validityStartDate} onDateChange={(date) => setOfferData({ ...offerData, validityStartDate: date })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityEndDate">Offer Valid Until</Label>
            <DatePicker date={offerData.validityEndDate} onDateChange={(date) => setOfferData({ ...offerData, validityEndDate: date })} />
          </div>
        </CardContent>
      </Card>

      {/* Product List Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">Products</CardTitle>
          <Button type="button" variant="outline" onClick={addProduct} className="text-primary border-primary hover:bg-primary/10">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {offerData.products.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No products added yet. Click Add Product to get started.</p>
          )}
          {offerData.products.map((product, index) => (
            <ProductItemCard
              key={product.id || index}
              index={index}
              product={product}
              updateProduct={updateProduct}
              removeProduct={removeProduct}
              moveProduct={moveProduct}
            />
          ))}
        </CardContent>
      </Card>

      {/* Price Calculation Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Price Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">Total Original Price:</span>
            <span className="font-semibold"><DollarSign className="inline h-5 w-5 relative -top-px"/>{totalOriginalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-primary">
            <span>Total Discounted Price:</span>
            <span><DollarSign className="inline h-5 w-5 relative -top-px"/>{totalDiscountedPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Notes / Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={offerData.termsAndConditions}
            onChange={(e) => setOfferData({ ...offerData, termsAndConditions: e.target.value })}
            placeholder="Enter any notes or terms and conditions for this offer..."
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6">
        <Button type="button" variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-5 w-5" /> Share
        </Button>
        <Button type="button" variant="outline" onClick={handleExportPdf}>
          <FileDown className="mr-2 h-5 w-5" /> Export PDF
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5" /> Save Offer Sheet
        </Button>
      </div>
    </form>
    </DndProvider>
  );
}

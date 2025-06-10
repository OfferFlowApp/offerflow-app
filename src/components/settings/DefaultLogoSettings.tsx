
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Save } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { SettingsData, SellerInfo } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalization } from '@/hooks/useLocalization';

const PREDEFINED_SELLER_NAMES = [
  'ΓΙΩΡΓΑΡΑΣ ΕΠΙΠΛΑ',
  'ΓΙΩΡΓΑΡΑΣ ΕΠΙΠΛΑ - MEDIA STROM',
  'ΓΙΩΡΓΑΡΑΣ ΕΠΙΠΛΑ - DROMEAS',
  'GIORGARAS FURNITURE',
];
const OTHER_SELLER_NAME_VALUE = 'other_seller_name';


export default function DefaultLogoSettings() {
  const [defaultSellerInfo, setDefaultSellerInfo] = useState<Partial<SellerInfo>>({
    name: PREDEFINED_SELLER_NAMES[0] || '',
    address: '',
    contact: '',
    logoUrl: undefined,
  });
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [selectedDefaultSellerNameKey, setSelectedDefaultSellerNameKey] = useState<string>(PREDEFINED_SELLER_NAMES[0] || OTHER_SELLER_NAME_VALUE);
  const { toast } = useToast();
  const { t } = useLocalization();


  useEffect(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      try {
        const parsedSettings: SettingsData = JSON.parse(savedSettings);
        let sellerNameFromStorage: string | undefined = undefined;
        let sellerLogoFromStorage: string | undefined = undefined;
        let sellerAddressFromStorage: string | undefined = undefined;
        let sellerContactFromStorage: string | undefined = undefined;

        if (parsedSettings.defaultSellerInfo) {
            sellerNameFromStorage = parsedSettings.defaultSellerInfo.name;
            sellerLogoFromStorage = parsedSettings.defaultSellerInfo.logoUrl;
            sellerAddressFromStorage = parsedSettings.defaultSellerInfo.address;
            sellerContactFromStorage = parsedSettings.defaultSellerInfo.contact;
        } else if (parsedSettings.defaultLogoUrl) { // Legacy support
            sellerLogoFromStorage = parsedSettings.defaultLogoUrl;
        }
        
        const effectiveName = sellerNameFromStorage || PREDEFINED_SELLER_NAMES[0] || '';
        const keyForSelect = PREDEFINED_SELLER_NAMES.includes(effectiveName) ? effectiveName : OTHER_SELLER_NAME_VALUE;
        
        setDefaultSellerInfo({
            name: effectiveName,
            logoUrl: sellerLogoFromStorage,
            address: sellerAddressFromStorage || '',
            contact: sellerContactFromStorage || '',
        });
        setSelectedDefaultSellerNameKey(keyForSelect);
        if (sellerLogoFromStorage) {
            setLogoPreview(sellerLogoFromStorage);
        }

      } catch (e) {
        console.error("Failed to parse default seller settings", e);
         // Fallback to first predefined name if parsing fails or no name is set
        const fallbackName = PREDEFINED_SELLER_NAMES[0] || '';
        setDefaultSellerInfo(prev => ({...prev, name: fallbackName }));
        setSelectedDefaultSellerNameKey(fallbackName || OTHER_SELLER_NAME_VALUE);
      }
    } else {
       // No settings saved, use first predefined name
      const initialName = PREDEFINED_SELLER_NAMES[0] || '';
      setDefaultSellerInfo(prev => ({...prev, name: initialName}));
      setSelectedDefaultSellerNameKey(initialName || OTHER_SELLER_NAME_VALUE);
    }
  }, []);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setDefaultSellerInfo(prev => ({...prev, logoUrl: result}));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setDefaultSellerInfo(prev => ({...prev, [name]: value}));
  };

  const handleDefaultSellerNameSelectionChange = (value: string) => {
    setSelectedDefaultSellerNameKey(value);
    if (value !== OTHER_SELLER_NAME_VALUE) {
      setDefaultSellerInfo(prev => ({ ...prev, name: value }));
    } else {
      // If "Other" is selected and current name is predefined, clear it for custom input
      if (PREDEFINED_SELLER_NAMES.includes(defaultSellerInfo.name || '')) {
        setDefaultSellerInfo(prev => ({ ...prev, name: '' }));
      }
    }
  };

  const handleCustomDefaultSellerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDefaultSellerInfo(prev => ({ ...prev, name: e.target.value }));
  };

  const handleSaveSettings = () => {
    const existingSettingsRaw = localStorage.getItem('offerSheetSettings');
    let existingSettings: SettingsData = {};
    if (existingSettingsRaw) {
        try {
            existingSettings = JSON.parse(existingSettingsRaw);
        } catch (e) {
            console.error("Error parsing existing settings", e);
        }
    }

    const settingsToSave: SettingsData = {
        ...existingSettings,
        defaultSellerInfo: defaultSellerInfo,
        defaultLogoUrl: defaultSellerInfo.logoUrl, 
    };
    localStorage.setItem('offerSheetSettings', JSON.stringify(settingsToSave));
    toast({
      title: t({en: "Settings Saved", el: "Οι Ρυθμίσεις Αποθηκεύτηκαν"}),
      description: t({en: "Your default seller information and logo have been updated.", el: "Οι προεπιλεγμένες πληροφορίες πωλητή και το λογότυπό σας ενημερώθηκαν."}),
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base">{t({en: "Default Seller Information & Logo", el: "Προεπιλεγμένες Πληροφορίες Πωλητή & Λογότυπο"})}</Label>
        <p className="text-sm text-muted-foreground">
          {t({en: "This information will be used as default for new offer sheets.", el: "Αυτές οι πληροφορίες θα χρησιμοποιούνται ως προεπιλογή για νέα δελτία προσφοράς."})}
        </p>
      </div>

      <div className="space-y-4">
        <div>
            <Label htmlFor="defaultSellerNameSelect">{t({en: "Default Seller Name", el: "Προεπιλεγμένο Όνομα Πωλητή"})}</Label>
            <Select value={selectedDefaultSellerNameKey} onValueChange={handleDefaultSellerNameSelectionChange}>
              <SelectTrigger id="defaultSellerNameSelect">
                <SelectValue placeholder={t({ en: "Select or type default seller name", el: "Επιλέξτε ή πληκτρολογήστε προεπιλεγμένο όνομα πωλητή" })} />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_SELLER_NAMES.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
                <SelectItem value={OTHER_SELLER_NAME_VALUE}>{t({ en: "Other (Specify below)", el: "Άλλο (Καθορίστε παρακάτω)" })}</SelectItem>
              </SelectContent>
            </Select>
            {selectedDefaultSellerNameKey === OTHER_SELLER_NAME_VALUE && (
              <div className="mt-2 space-y-1">
                <Label htmlFor="customDefaultSellerName" className="text-sm font-normal">{t({ en: 'Custom Default Seller Name', el: 'Προσαρμοσμένο Προεπιλεγμένο Όνομα Πωλητή' })}</Label>
                <Input
                  id="customDefaultSellerName"
                  value={defaultSellerInfo.name || ''}
                  onChange={handleCustomDefaultSellerNameChange}
                  placeholder={t({en: "Enter custom default seller name", el: "Εισαγάγετε προσαρμοσμένο προεπιλεγμένο όνομα πωλητή"})}
                />
              </div>
            )}
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerContact">{t({en: "Default Seller Contact (Email/Phone)", el: "Προεπιλεγμένη Επικοινωνία Πωλητή (Email/Τηλέφωνο)"})}</Label>
            <Input id="defaultSellerContact" name="contact" value={defaultSellerInfo.contact || ''} onChange={handleInfoChange} placeholder={t({en: "info@yourcompany.com", el: "info@yourcompany.com"})}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerAddress">{t({en: "Default Seller Address", el: "Προεπιλεγμένη Διεύθυνση Πωλητή"})}</Label>
            <Textarea id="defaultSellerAddress" name="address" value={defaultSellerInfo.address || ''} onChange={handleInfoChange} placeholder={t({en: "123 Business Park, City, Country", el: "Βιομηχανικό Πάρκο 123, Πόλη, Χώρα"})}/>
        </div>
      </div>
      
      <div className="flex flex-col items-start space-y-4">
        <Label htmlFor="defaultLogoUpload" className="text-base">{t({en: "Default Company Logo", el: "Προεπιλεγμένο Λογότυπο Εταιρείας"})}</Label>
        {logoPreview ? (
          <Image src={logoPreview} alt="Default Logo Preview" width={150} height={150} className="rounded-md object-contain border p-2" data-ai-hint="company logo" />
        ) : (
          <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
            <UploadCloud className="h-16 w-16" />
          </div>
        )}
        <Input id="defaultLogoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-sm file:text-primary file:font-medium" />
      </div>
      <Button onClick={handleSaveSettings} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        <Save className="mr-2 h-5 w-5" /> {t({en: "Save Default Seller Info", el: "Αποθήκευση Προεπιλεγμένων Πληροφοριών Πωλητή"})}
      </Button>
    </div>
  );
}

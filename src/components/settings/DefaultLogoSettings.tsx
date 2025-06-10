
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

const PREDEFINED_SELLER_ADDRESSES = [
  'ΚΑΝΑΔΑ 11 ΡΟΔΟΣ',
  'KANADA 11 RHODES',
];
const OTHER_SELLER_ADDRESS_VALUE = 'other_seller_address';
const DEFAULT_SELLER_GEMH = '071970120000';
const DEFAULT_SELLER_EMAIL = 'epiplagiorgaras@gmail.com';
const DEFAULT_SELLER_PHONE = '2241021087';

export default function DefaultLogoSettings() {
  const [defaultSellerInfo, setDefaultSellerInfo] = useState<Partial<SellerInfo>>({
    name: PREDEFINED_SELLER_NAMES[0] || '',
    address: PREDEFINED_SELLER_ADDRESSES[0] || '',
    email: DEFAULT_SELLER_EMAIL,
    phone: DEFAULT_SELLER_PHONE,
    logoUrl: undefined,
    gemhNumber: DEFAULT_SELLER_GEMH,
  });
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [selectedDefaultSellerNameKey, setSelectedDefaultSellerNameKey] = useState<string>(PREDEFINED_SELLER_NAMES[0] || OTHER_SELLER_NAME_VALUE);
  const [selectedDefaultSellerAddressKey, setSelectedDefaultSellerAddressKey] = useState<string>(PREDEFINED_SELLER_ADDRESSES[0] || OTHER_SELLER_ADDRESS_VALUE);
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
        let sellerEmailFromStorage: string | undefined = undefined;
        let sellerPhoneFromStorage: string | undefined = undefined;
        let sellerGemhFromStorage: string | undefined = undefined;

        if (parsedSettings.defaultSellerInfo) {
            sellerNameFromStorage = parsedSettings.defaultSellerInfo.name;
            sellerLogoFromStorage = parsedSettings.defaultSellerInfo.logoUrl;
            sellerAddressFromStorage = parsedSettings.defaultSellerInfo.address;
            sellerEmailFromStorage = parsedSettings.defaultSellerInfo.email;
            sellerPhoneFromStorage = parsedSettings.defaultSellerInfo.phone;
            sellerGemhFromStorage = parsedSettings.defaultSellerInfo.gemhNumber;
        } else if (parsedSettings.defaultLogoUrl) { // Legacy support for only logo
            sellerLogoFromStorage = parsedSettings.defaultLogoUrl;
        }
        
        const effectiveName = sellerNameFromStorage || PREDEFINED_SELLER_NAMES[0] || '';
        const keyForNameSelect = PREDEFINED_SELLER_NAMES.includes(effectiveName) ? effectiveName : OTHER_SELLER_NAME_VALUE;
        
        const effectiveAddress = sellerAddressFromStorage || PREDEFINED_SELLER_ADDRESSES[0] || '';
        const keyForAddressSelect = PREDEFINED_SELLER_ADDRESSES.includes(effectiveAddress) ? effectiveAddress : OTHER_SELLER_ADDRESS_VALUE;

        setDefaultSellerInfo({
            name: effectiveName,
            logoUrl: sellerLogoFromStorage,
            address: effectiveAddress,
            email: sellerEmailFromStorage || DEFAULT_SELLER_EMAIL,
            phone: sellerPhoneFromStorage || DEFAULT_SELLER_PHONE,
            gemhNumber: sellerGemhFromStorage || DEFAULT_SELLER_GEMH,
        });
        setSelectedDefaultSellerNameKey(keyForNameSelect);
        setSelectedDefaultSellerAddressKey(keyForAddressSelect);

        if (sellerLogoFromStorage) {
            setLogoPreview(sellerLogoFromStorage);
        }

      } catch (e) {
        console.error("Failed to parse default seller settings", e);
        const fallbackName = PREDEFINED_SELLER_NAMES[0] || '';
        const fallbackAddress = PREDEFINED_SELLER_ADDRESSES[0] || '';
        setDefaultSellerInfo(prev => ({
            ...prev, 
            name: fallbackName, 
            address: fallbackAddress, 
            email: DEFAULT_SELLER_EMAIL,
            phone: DEFAULT_SELLER_PHONE,
            gemhNumber: DEFAULT_SELLER_GEMH 
        }));
        setSelectedDefaultSellerNameKey(fallbackName || OTHER_SELLER_NAME_VALUE);
        setSelectedDefaultSellerAddressKey(fallbackAddress || OTHER_SELLER_ADDRESS_VALUE);
      }
    } else {
      // No settings found, use hardcoded defaults
      const initialName = PREDEFINED_SELLER_NAMES[0] || '';
      const initialAddress = PREDEFINED_SELLER_ADDRESSES[0] || '';
      setDefaultSellerInfo(prev => ({
          ...prev, 
          name: initialName, 
          address: initialAddress,
          email: DEFAULT_SELLER_EMAIL,
          phone: DEFAULT_SELLER_PHONE,
          gemhNumber: DEFAULT_SELLER_GEMH
      }));
      setSelectedDefaultSellerNameKey(initialName || OTHER_SELLER_NAME_VALUE);
      setSelectedDefaultSellerAddressKey(initialAddress || OTHER_SELLER_ADDRESS_VALUE);
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
      // If "Other" is selected and the current name is one of the predefined ones, clear it to allow custom input.
      if (PREDEFINED_SELLER_NAMES.includes(defaultSellerInfo.name || '')) {
        setDefaultSellerInfo(prev => ({ ...prev, name: '' }));
      }
    }
  };

  const handleCustomDefaultSellerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDefaultSellerInfo(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleDefaultSellerAddressSelectionChange = (value: string) => {
    setSelectedDefaultSellerAddressKey(value);
    if (value !== OTHER_SELLER_ADDRESS_VALUE) {
      setDefaultSellerInfo(prev => ({ ...prev, address: value }));
    } else {
       if (PREDEFINED_SELLER_ADDRESSES.includes(defaultSellerInfo.address || '')) {
        setDefaultSellerInfo(prev => ({ ...prev, address: '' }));
      }
    }
  };

  const handleCustomDefaultSellerAddressChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultSellerInfo(prev => ({ ...prev, address: e.target.value }));
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

    // Ensure that if "Other" was selected but input was empty, we don't save an empty string if a default exists
    const finalSellerInfoToSave = { ...defaultSellerInfo };
    if (selectedDefaultSellerNameKey === OTHER_SELLER_NAME_VALUE && !finalSellerInfoToSave.name) {
      // This case is tricky; if they selected "Other" and left it blank, what should happen?
      // For now, it saves blank. Could be improved to fall back to first predefined if desired.
    }
    if (selectedDefaultSellerAddressKey === OTHER_SELLER_ADDRESS_VALUE && !finalSellerInfoToSave.address) {
      // Similar to name
    }


    const settingsToSave: SettingsData = {
        ...existingSettings,
        defaultSellerInfo: finalSellerInfoToSave,
        defaultLogoUrl: finalSellerInfoToSave.logoUrl, // Keep for legacy if OfferSheetForm directly uses it
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
                  name="name" // Should match key in defaultSellerInfo
                  value={defaultSellerInfo.name || ''}
                  onChange={handleCustomDefaultSellerNameChange}
                  placeholder={t({en: "Enter custom default seller name", el: "Εισαγάγετε προσαρμοσμένο προεπιλεγμένο όνομα πωλητή"})}
                />
              </div>
            )}
        </div>
        
        <div>
            <Label htmlFor="defaultSellerAddressSelect">{t({en: "Default Seller Address", el: "Προεπιλεγμένη Διεύθυνση Πωλητή"})}</Label>
            <Select value={selectedDefaultSellerAddressKey} onValueChange={handleDefaultSellerAddressSelectionChange}>
              <SelectTrigger id="defaultSellerAddressSelect">
                <SelectValue placeholder={t({ en: "Select or type default seller address", el: "Επιλέξτε ή πληκτρολογήστε προεπιλεγμένη διεύθυνση πωλητή" })} />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_SELLER_ADDRESSES.map(addr => (
                  <SelectItem key={addr} value={addr}>{addr}</SelectItem>
                ))}
                <SelectItem value={OTHER_SELLER_ADDRESS_VALUE}>{t({ en: "Other (Specify below)", el: "Άλλο (Καθορίστε παρακάτω)" })}</SelectItem>
              </SelectContent>
            </Select>
            {selectedDefaultSellerAddressKey === OTHER_SELLER_ADDRESS_VALUE && (
              <div className="mt-2 space-y-1">
                <Label htmlFor="customDefaultSellerAddress" className="text-sm font-normal">{t({ en: 'Custom Default Seller Address', el: 'Προσαρμοσμένη Προεπιλεγμένη Διεύθυνση Πωλητή' })}</Label>
                <Textarea
                  id="customDefaultSellerAddress"
                  name="address" // Should match key in defaultSellerInfo
                  value={defaultSellerInfo.address || ''}
                  onChange={handleCustomDefaultSellerAddressChange}
                  placeholder={t({en: "Enter custom default seller address", el: "Εισαγάγετε προσαρμοσμένη προεπιλεγμένη διεύθυνση πωλητή"})}
                />
              </div>
            )}
        </div>

        <div className="space-y-2">
            <Label htmlFor="defaultSellerEmail">{t({en: "Default Seller Email", el: "Προεπιλεγμένο Email Πωλητή"})}</Label>
            <Input id="defaultSellerEmail" name="email" value={defaultSellerInfo.email || ''} onChange={handleInfoChange} placeholder={DEFAULT_SELLER_EMAIL}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerPhone">{t({en: "Default Seller Phone", el: "Προεπιλεγμένο Τηλέφωνο Πωλητή"})}</Label>
            <Input id="defaultSellerPhone" name="phone" value={defaultSellerInfo.phone || ''} onChange={handleInfoChange} placeholder={DEFAULT_SELLER_PHONE}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerGemh">{t({en: "Default Seller ΓΕΜΗ Number", el: "Προεπιλεγμένος Αριθμός ΓΕΜΗ Πωλητή"})}</Label>
            <Input id="defaultSellerGemh" name="gemhNumber" value={defaultSellerInfo.gemhNumber || ''} onChange={handleInfoChange} placeholder={DEFAULT_SELLER_GEMH}/>
        </div>
      </div>
      
      <div className="flex flex-col items-start space-y-4">
        <Label htmlFor="defaultLogoUpload" className="text-base">{t({en: "Default Company Logo", el: "Προεπιλεγμένο Λογότυπο Εταιρείας"})}</Label>
        {logoPreview ? (
          <Image src={logoPreview} alt={t({en:"Default Logo Preview", el:"Προεπισκόπηση Προεπιλεγμένου Λογότυπου"})} width={150} height={150} className="rounded-md object-contain border p-2" data-ai-hint="company logo" />
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

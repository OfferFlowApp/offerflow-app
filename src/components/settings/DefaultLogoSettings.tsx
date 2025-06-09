
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Save } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { SettingsData, SellerInfo } from '@/lib/types'; // Updated type import
import { Textarea } from '../ui/textarea';
import { useLocalization } from '@/hooks/useLocalization';

export default function DefaultLogoSettings() {
  const [defaultSellerInfo, setDefaultSellerInfo] = useState<Partial<SellerInfo>>({
    name: '',
    address: '',
    contact: '',
    logoUrl: undefined,
  });
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { t } = useLocalization();


  useEffect(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      const parsedSettings: SettingsData = JSON.parse(savedSettings);
      if (parsedSettings.defaultLogoUrl) { // Legacy support
        setDefaultSellerInfo(prev => ({...prev, logoUrl: parsedSettings.defaultLogoUrl}));
        setLogoPreview(parsedSettings.defaultLogoUrl);
      }
      if (parsedSettings.defaultSellerInfo) {
        setDefaultSellerInfo(prev => ({...prev, ...parsedSettings.defaultSellerInfo}));
        if (parsedSettings.defaultSellerInfo.logoUrl) {
          setLogoPreview(parsedSettings.defaultSellerInfo.logoUrl);
        }
      }
    }
  }, []);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setDefaultSellerInfo(prev => ({...prev, logoUrl: reader.result as string}));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setDefaultSellerInfo(prev => ({...prev, [name]: value}));
  }

  const handleSaveSettings = () => {
    // Retrieve existing settings to merge, preserve other settings like currency/language
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
        defaultLogoUrl: defaultSellerInfo.logoUrl, // Keep for backward compatibility or if other parts still use it
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="defaultSellerName">{t({en: "Default Seller Name", el: "Προεπιλεγμένο Όνομα Πωλητή"})}</Label>
            <Input id="defaultSellerName" name="name" value={defaultSellerInfo.name || ''} onChange={handleInfoChange} placeholder={t({en: "Your Company LLC", el: "Η Εταιρεία Σας ΕΠΕ"})}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerContact">{t({en: "Default Seller Contact (Email/Phone)", el: "Προεπιλεγμένη Επικοινωνία Πωλητή (Email/Τηλέφωνο)"})}</Label>
            <Input id="defaultSellerContact" name="contact" value={defaultSellerInfo.contact || ''} onChange={handleInfoChange} placeholder={t({en: "info@yourcompany.com", el: "info@yourcompany.com"})}/>
        </div>
        <div className="space-y-2 md:col-span-2">
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

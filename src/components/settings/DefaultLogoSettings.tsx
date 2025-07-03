
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Save, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { SettingsData, SellerInfo } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation';


export default function DefaultLogoSettings() {
  const { currentEntitlements } = useAuth();
  const router = useRouter();
  const [defaultSellerInfo, setDefaultSellerInfo] = useState<Partial<SellerInfo>>({
    name: '',
    address: '',
    email: '',
    phone: '',
    logoUrl: undefined,
    gemhNumber: '',
  });
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { t } = useLocalization();


  useEffect(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      try {
        const parsedSettings: SettingsData = JSON.parse(savedSettings);
        const savedInfo = parsedSettings.defaultSellerInfo || {};
        
        const effectiveLogo = savedInfo.logoUrl;

        setDefaultSellerInfo({
            name: savedInfo.name || '',
            logoUrl: effectiveLogo,
            address: savedInfo.address || '',
            email: savedInfo.email || '',
            phone: savedInfo.phone || '',
            gemhNumber: savedInfo.gemhNumber || '',
        });

        if (effectiveLogo) {
            setLogoPreview(effectiveLogo);
        }

      } catch (e) {
        console.error("Failed to parse default seller settings", e);
        setDefaultSellerInfo({
            name: '', address: '', email: '', phone: '', gemhNumber: '', logoUrl: undefined
        });
        setLogoPreview(undefined);
      }
    } else {
      // No settings found, use empty defaults
      setDefaultSellerInfo({
          name: '', address: '', email: '', phone: '', gemhNumber: '', logoUrl: undefined
      });
      setLogoPreview(undefined);
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

    const finalSellerInfoToSave = { ...defaultSellerInfo };

    const settingsToSave: SettingsData = {
        ...existingSettings,
        defaultSellerInfo: finalSellerInfoToSave,
        defaultLogoUrl: finalSellerInfoToSave.logoUrl, // Keep legacy for OfferSheetForm compatibility
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
        <div className="space-y-2">
            <Label htmlFor="defaultSellerName">{t({en: "Default Seller Name", el: "Προεπιλεγμένο Όνομα Πωλητή"})}</Label>
            <Input
                id="defaultSellerName"
                name="name" 
                value={defaultSellerInfo.name || ''}
                onChange={handleInfoChange}
                placeholder={t({en: "Your Company Name", el: "Όνομα Εταιρείας"})}
            />
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="defaultSellerAddress">{t({en: "Default Seller Address", el: "Προεπιλεγμένη Διεύθυνση Πωλητή"})}</Label>
            <Textarea
                id="defaultSellerAddress"
                name="address" 
                value={defaultSellerInfo.address || ''}
                onChange={handleInfoChange}
                placeholder={t({ en: "123 Business Rd, Suite 400, City, Country", el: "Οδός Επιχείρησης 123, Γραφείο 400, Πόλη, Χώρα" })}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="defaultSellerEmail">{t({en: "Default Seller Email", el: "Προεπιλεγμένο Email Πωλητή"})}</Label>
            <Input id="defaultSellerEmail" name="email" value={defaultSellerInfo.email || ''} onChange={handleInfoChange} placeholder={t({en: "contact@yourcompany.com", el:"contact@yourcompany.com"})}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerPhone">{t({en: "Default Seller Phone", el: "Προεπιλεγμένο Τηλέφωνο Πωλητή"})}</Label>
            <Input id="defaultSellerPhone" name="phone" value={defaultSellerInfo.phone || ''} onChange={handleInfoChange} placeholder={t({en: "e.g., +1 234 567 890", el: "π.χ. +30 210 123 4567"})}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="defaultSellerGemh">{t({en: "Default Seller General Commercial Registry Number", el: "Προεπιλεγμένος Αριθμός ΓΕΜΗ Πωλητή"})}</Label>
            <Input id="defaultSellerGemh" name="gemhNumber" value={defaultSellerInfo.gemhNumber || ''} onChange={handleInfoChange} placeholder={t({en: "e.g., 1234567890000", el:"π.χ. 1234567890000"})}/>
        </div>
      </div>
      
      <div className="flex flex-col items-start space-y-4">
        <Label htmlFor="defaultLogoUpload" className="text-base">{t({en: "Default Company Logo", el: "Προεπιλεγμένο Λογότυπο Εταιρείας"})}</Label>
        {logoPreview ? (
          <Image src={logoPreview} alt={t({en:"Default Logo Preview", el:"Προεπισκόπηση Προεπιλεγμένου Λογότυπου"})} width={150} height={150} className="rounded-md object-contain border p-2" data-ai-hint="company brand" />
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

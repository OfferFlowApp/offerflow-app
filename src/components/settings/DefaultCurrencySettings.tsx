
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Euro, DollarSign, PoundSterling } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { SettingsData, Currency } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalization } from '@/hooks/useLocalization';

const currencyOptions: { value: Currency, label: string, IconComponent: React.ElementType }[] = [
  { value: 'EUR', label: 'Euro (€)', IconComponent: Euro },
  { value: 'USD', label: 'US Dollar ($)', IconComponent: DollarSign },
  { value: 'GBP', label: 'British Pound (£)', IconComponent: PoundSterling },
];
const VALID_CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP'];

export default function DefaultCurrencySettings() {
  const [defaultCurrency, setDefaultCurrency] = useState<Currency | undefined>(undefined);
  const { toast } = useToast();
  const { t } = useLocalization();

  useEffect(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    let newDefaultCurrency: Currency = 'EUR'; // Default to EUR
    if (savedSettings) {
      const parsedSettings: SettingsData = JSON.parse(savedSettings);
      if (parsedSettings.defaultCurrency && VALID_CURRENCIES.includes(parsedSettings.defaultCurrency)) {
        newDefaultCurrency = parsedSettings.defaultCurrency;
      }
    }
    setDefaultCurrency(newDefaultCurrency);
  }, []);

  const handleCurrencyChange = (value: string) => {
    if (VALID_CURRENCIES.includes(value as Currency)) {
      setDefaultCurrency(value as Currency);
    }
  };

  const handleSaveSettings = () => {
    if (!defaultCurrency) {
        toast({
            title: t({ en: "Error", el: "Σφάλμα" }),
            description: t({ en: "Please select a valid currency.", el: "Παρακαλώ επιλέξτε ένα έγκυρο νόμισμα." }),
            variant: "destructive",
        });
        return;
    }

    const savedSettings = localStorage.getItem('offerSheetSettings');
    let currentSettings: SettingsData = {};
    if (savedSettings) {
      try {
        currentSettings = JSON.parse(savedSettings);
      } catch (e) {
        console.error("Failed to parse settings: ", e);
        currentSettings = {}; // Reset if parsing fails
      }
    }
    
    const settingsToSave: SettingsData = { ...currentSettings, defaultCurrency: defaultCurrency };
    localStorage.setItem('offerSheetSettings', JSON.stringify(settingsToSave));
    toast({
      title: t({ en: "Settings Saved", el: "Οι ρυθμίσεις αποθηκεύτηκαν" }),
      description: t({ en: "Your default currency has been updated.", el: "Το προεπιλεγμένο νόμισμά σας ενημερώθηκε." }),
      variant: "default",
    });
  };

  if (defaultCurrency === undefined) {
    return <div>{t({ en: "Loading currency settings...", el: "Φόρτωση ρυθμίσεων νομίσματος..." })}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultCurrencySelect" className="text-base">
          {t({ en: "Default Currency", el: "Προεπιλεγμένο Νόμισμα" })}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t({ en: "This currency will be used as default for new offer sheets.", el: "Αυτό το νόμισμα θα χρησιμοποιείται ως προεπιλογή για νέα δελτία προσφοράς."})}
        </p>
      </div>
      
      <Select value={defaultCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger id="defaultCurrencySelect" className="w-full sm:w-[280px]">
          <SelectValue placeholder={t({ en: "Select default currency", el: "Επιλέξτε προεπιλεγμένο νόμισμα" })} />
        </SelectTrigger>
        <SelectContent>
          {currencyOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center">
                <option.IconComponent className="h-4 w-4 mr-2" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSaveSettings} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        <Save className="mr-2 h-5 w-5" /> {t({ en: "Save Default Currency", el: "Αποθήκευση Προεπιλεγμένου Νομίσματος" })}
      </Button>
    </div>
  );
}

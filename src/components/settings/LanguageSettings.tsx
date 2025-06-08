
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react'; // Removed Languages icon as it's not used here
import { useToast } from "@/hooks/use-toast";
import type { SettingsData, Language } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalization } from '@/hooks/useLocalization';


const languageOptions: { value: Language, label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'el', label: 'Ελληνικά (Greek)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'fr', label: 'Français (French)' },
];

export default function LanguageSettings() {
  const { language: currentLang, setAppLanguage, t } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLang);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedLanguage(currentLang);
  }, [currentLang]);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleSaveSettings = () => {
    setAppLanguage(selectedLanguage); // This updates localStorage and context

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
    const settingsToSave: SettingsData = { ...currentSettings, preferredLanguage: selectedLanguage };
    localStorage.setItem('offerSheetSettings', JSON.stringify(settingsToSave));
    
    toast({
      title: t({ en: "Settings Saved", el: "Οι ρυθμίσεις αποθηκεύτηκαν" }),
      description: t({ en: "Your preferred language has been updated.", el: "Η προτιμώμενη γλώσσα σας ενημερώθηκε." }),
      variant: "default",
    });
    // The reload is handled by setAppLanguage now
  };
  
  if (!selectedLanguage) {
     return <div>{t({ en: "Loading language settings...", el: "Φόρτωση ρυθμίσεων γλώσσας..." })}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="languageSelect" className="text-base">
          {t({ en: "Preferred Language", el: "Προτιμώμενη Γλώσσα" })}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t({ en: "Choose the language for the application interface.", el: "Επιλέξτε τη γλώσσα για το περιβάλλον της εφαρμογής."})}
        </p>
      </div>
      
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger id="languageSelect" className="w-full sm:w-[280px]">
          <SelectValue placeholder={t({ en: "Select language", el: "Επιλογή γλώσσας" })} />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
               {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSaveSettings} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        <Save className="mr-2 h-5 w-5" /> {t({ en: "Save Language", el: "Αποθήκευση Γλώσσας" })}
      </Button>
    </div>
  );
}


"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { SettingsData } from '@/lib/types';
import { useLocalization } from '@/hooks/useLocalization';

export default function DefaultTermsSettings() {
  const [defaultTerms, setDefaultTerms] = useState<string>('');
  const { toast } = useToast();
  const { t } = useLocalization();

  useEffect(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      try {
        const parsedSettings: SettingsData = JSON.parse(savedSettings);
        setDefaultTerms(parsedSettings.defaultTermsAndConditions || '');
      } catch (e) {
        console.error("Failed to parse default terms settings", e);
        setDefaultTerms('');
      }
    }
  }, []);

  const handleTermsChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultTerms(event.target.value);
  }, []);

  const handleSaveSettings = useCallback(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    let currentSettings: SettingsData = {};
    if (savedSettings) {
      try {
        currentSettings = JSON.parse(savedSettings);
      } catch (e) {
        console.error("Failed to parse settings: ", e);
        currentSettings = {}; 
      }
    }
    
    const settingsToSave: SettingsData = { 
      ...currentSettings, 
      defaultTermsAndConditions: defaultTerms 
    };
    localStorage.setItem('offerSheetSettings', JSON.stringify(settingsToSave));
    toast({
      title: t({ en: "Settings Saved", el: "Οι ρυθμίσεις αποθηκεύτηκαν" }),
      description: t({ en: "Your default terms and conditions have been updated.", el: "Οι προεπιλεγμένοι όροι και προϋποθέσεις σας ενημερώθηκαν." }),
      variant: "default",
    });
  }, [defaultTerms, t, toast]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultTermsTextarea" className="text-base">
          {t({ en: "Default Terms & Conditions", el: "Προεπιλεγμένοι Όροι & Προϋποθέσεις" })}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t({ en: "This text will be automatically added to the 'Notes / Terms & Conditions' section of new offer sheets.", el: "Αυτό το κείμενο θα προστίθεται αυτόματα στην ενότητα 'Σημειώσεις / Όροι & Προϋποθέσεις' των νέων δελτίων προσφοράς."})}
        </p>
      </div>
      
      <Textarea
        id="defaultTermsTextarea"
        value={defaultTerms}
        onChange={handleTermsChange}
        placeholder={t({ en: "Enter your default terms and conditions here...", el: "Εισαγάγετε τους προεπιλεγμένους όρους και προϋποθέσεις σας εδώ..."})}
        rows={8}
        className="text-sm"
      />

      <Button onClick={handleSaveSettings} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        <Save className="mr-2 h-5 w-5" /> {t({ en: "Save Default Terms", el: "Αποθήκευση Προεπιλεγμένων Όρων" })}
      </Button>
    </div>
  );
}

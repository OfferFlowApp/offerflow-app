"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Save } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { SettingsData } from '@/lib/types';

export default function DefaultLogoSettings() {
  const [defaultLogoUrl, setDefaultLogoUrl] = useState<string | undefined>(undefined);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('offerSheetSettings');
    if (savedSettings) {
      const parsedSettings: SettingsData = JSON.parse(savedSettings);
      if (parsedSettings.defaultLogoUrl) {
        setDefaultLogoUrl(parsedSettings.defaultLogoUrl);
        setLogoPreview(parsedSettings.defaultLogoUrl);
      }
    }
  }, []);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setDefaultLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveSettings = () => {
    const settingsToSave: SettingsData = { defaultLogoUrl };
    localStorage.setItem('offerSheetSettings', JSON.stringify(settingsToSave));
    toast({
      title: "Settings Saved",
      description: "Your default logo has been updated.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultLogoUpload" className="text-base">Default Company Logo</Label>
        <p className="text-sm text-muted-foreground">
          This logo will be used as a default for all new offer sheets you create.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4">
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
        <Save className="mr-2 h-5 w-5" /> Save Default Logo
      </Button>
    </div>
  );
}

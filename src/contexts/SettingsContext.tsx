import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SiteSettings {
  paletteName?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  logoUrl?: string;
  logoWidth?: number;
  logoHeight?: number;
  heroBannerUrl?: string;
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTitleFontSize?: number;
  heroTitleFontWeight?: string;
  heroSubtitleFontSize?: number;
  heroSubtitleFontWeight?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  mapIframe?: string;
  footerDescription?: string;
  aboutPageHeroImageUrl?: string;
  aboutPageHeroTitle?: string;
  aboutPageHeroSubtitle?: string;
  aboutPageDescription?: string;
  missionText?: string;
  visionText?: string;
  trustValueText?: string;
  customerValueText?: string;
  excellenceValueText?: string;
  milestones?: { year: string; description: string; }[];
  teamMembers?: { name: string; title: string; imageUrl?: string; }[];
}

interface SettingsContextType {
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetch('/api/admin/brand-settings')
      .then(res => res.json())
      .then(data => setSettings({
        ...data,
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        heroTitleFontSize: data.heroTitleFontSize || 48,
        heroTitleFontWeight: data.heroTitleFontWeight || 'bold',
        heroSubtitleFontSize: data.heroSubtitleFontSize || 20,
        heroSubtitleFontWeight: data.heroSubtitleFontWeight || 'normal',
      }))
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}

export async function fetchAndUpdateSettings(setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>) {
  const res = await fetch('/api/admin/brand-settings');
  const data = await res.json();
  setSettings({
    ...data,
    heroTitle: data.heroTitle || '',
    heroSubtitle: data.heroSubtitle || '',
    heroTitleFontSize: data.heroTitleFontSize || 48,
    heroTitleFontWeight: data.heroTitleFontWeight || 'bold',
    heroSubtitleFontSize: data.heroSubtitleFontSize || 20,
    heroSubtitleFontWeight: data.heroSubtitleFontWeight || 'normal',
  });
} 
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSettings } from "./SettingsContext";

export type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

const defaultColors: BrandColors = {
  primary: "#ea580c", // orange-600
  secondary: "#fbbf24", // orange-400
  accent: "#ffecd2", // light accent
  background: "#fff8f1", // light background
  text: "#222222", // dark text
};

const BrandColorContext = createContext<{
  colors: BrandColors;
  setColors: (colors: BrandColors) => void;
}>({
  colors: defaultColors,
  setColors: () => {},
});

export const useBrandColors = () => useContext(BrandColorContext);

export const BrandColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<BrandColors>(defaultColors);
  const { settings } = useSettings();

  useEffect(() => {
    // If settings has paletteName and color values, update context
    if (settings && (settings.paletteName || settings.primary)) {
      setColors({
        primary: settings.primary || defaultColors.primary,
        secondary: settings.secondary || defaultColors.secondary,
        accent: settings.accent || defaultColors.accent,
        background: settings.background || defaultColors.background,
        text: settings.text || defaultColors.text,
      });
    }
  }, [settings.paletteName, settings.primary, settings.secondary, settings.accent, settings.background, settings.text]);

  return (
    <BrandColorContext.Provider value={{ colors, setColors }}>
      {children}
    </BrandColorContext.Provider>
  );
}; 
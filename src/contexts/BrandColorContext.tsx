import React, { createContext, useContext, useState } from "react";

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

  return (
    <BrandColorContext.Provider value={{ colors, setColors }}>
      {children}
    </BrandColorContext.Provider>
  );
}; 
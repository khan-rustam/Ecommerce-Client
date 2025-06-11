import React, { createContext, useContext, useState } from "react";

type UserMenuContextType = {
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
};

const UserMenuContext = createContext<UserMenuContextType | undefined>(undefined);

export const UserMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <UserMenuContext.Provider value={{ userMenuOpen, setUserMenuOpen }}>
      {children}
    </UserMenuContext.Provider>
  );
};

export const useUserMenu = () => {
  const ctx = useContext(UserMenuContext);
  if (!ctx) throw new Error("useUserMenu must be used within UserMenuProvider");
  return ctx;
}; 
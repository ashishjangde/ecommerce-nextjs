'use client'
import { createContext, useContext, useState } from "react";

interface MenuBarContextProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapse: (collapsed: boolean) => void;
  isHidden: boolean; 
  setIsHidden: (hidden: boolean) => void; 
}

const MenuBarContext = createContext<MenuBarContextProps | undefined>(undefined);

export const MenuBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // Initialize `isHidden`

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const setCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <MenuBarContext.Provider value={{ isCollapsed, toggleCollapse, setCollapse, isHidden, setIsHidden }}>
      {children}
    </MenuBarContext.Provider>
  );
};

export const useMenuBar = () => {
  const context = useContext(MenuBarContext);
  if (!context) {
    throw new Error("useMenuBar must be used within a MenuBarProvider");
  }
  return context;
};

'use client'
import { createContext ,  useContext ,  useState } from "react";

interface MenuBarContextProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    setCollapse: (collapsed: boolean) => void;
  }
  
  const MenuBarContext = createContext<MenuBarContextProps | undefined>(undefined);

  export const MenuBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    const toggleCollapse = () => {
      setIsCollapsed((prev) => !prev);
    };
  
    const setCollapse = (collapsed: boolean) => {
      setIsCollapsed(collapsed);
    };
  
    return (
      <MenuBarContext.Provider value={{ isCollapsed, toggleCollapse, setCollapse }}>
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
  

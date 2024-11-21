'use client'
import  { createContext, useContext, useState, ReactNode } from "react";

interface UIStateContextProps {
  loading: boolean;
  error: string | null;
  accessDenied: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAccessDenied: (accessDenied: boolean) => void;
}

const UIStateContext = createContext<UIStateContextProps | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  return (
    <UIStateContext.Provider value={{ loading, error, accessDenied, setLoading, setError, setAccessDenied }}>
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = (): UIStateContextProps => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error("useUIState must be used within a UIStateProvider");
  }
  return context;
};

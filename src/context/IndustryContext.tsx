import { createContext, useContext, ReactNode, FC, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { IndustryDetail } from '../types';
import { INITIAL_INDUSTRIES_DETAILED } from '../constants';

interface IndustryContextType {
  industries: IndustryDetail[];
  updateIndustry: (id: string, updatedIndustryData: IndustryDetail) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

interface IndustryProviderProps {
    children: ReactNode;
}

export const IndustryProvider: FC<IndustryProviderProps> = ({ children }) => {
  const [industries, setIndustries] = useLocalStorage<IndustryDetail[]>('tapeindia_industries_v7', INITIAL_INDUSTRIES_DETAILED);

  useEffect(() => {
    // Data validation: If industry data is corrupted, empty, or not an array, reset to initial data.
    if (!Array.isArray(industries) || (industries.length === 0 && INITIAL_INDUSTRIES_DETAILED.length > 0)) {
      setIndustries(INITIAL_INDUSTRIES_DETAILED);
    }
  }, [industries, setIndustries]);

  const updateIndustry = useCallback((id: string, updatedIndustryData: IndustryDetail) => {
    setIndustries(prev => (Array.isArray(prev) ? prev.map(i => (i.id === id ? updatedIndustryData : i)) : [updatedIndustryData]));
  }, [setIndustries]);

  // Ensure consumers always receive a valid array.
  const validIndustries = Array.isArray(industries) ? industries : INITIAL_INDUSTRIES_DETAILED;

  const value = { industries: validIndustries, updateIndustry };

  return <IndustryContext.Provider value={value}>{children}</IndustryContext.Provider>;
};

export const useIndustry = (): IndustryContextType => {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
};
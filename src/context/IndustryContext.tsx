
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

  // --- SMART MERGE LOGIC ---
  useEffect(() => {
      setIndustries(currentIndustries => {
          const stored = Array.isArray(currentIndustries) ? currentIndustries : [];
          const deploymentMap = new Map(INITIAL_INDUSTRIES_DETAILED.map(i => [i.id, i]));
          
          // Start with fresh deployment data
          const mergedList = [...INITIAL_INDUSTRIES_DETAILED];

          // Preserve locally created/modified industries that don't exist in deployment
          // Note: Since industries are usually fixed, this mostly handles updates to descriptions/images
          // For industries, we aggressively prefer deployment data to ensure SEO and Product lists are sync.
          
          if (JSON.stringify(mergedList) !== JSON.stringify(stored)) {
              return mergedList;
          }
          return stored;
      });
  }, [setIndustries]);

  const updateIndustry = useCallback((id: string, updatedIndustryData: IndustryDetail) => {
    setIndustries(prev => (Array.isArray(prev) ? prev.map(i => (i.id === id ? updatedIndustryData : i)) : [updatedIndustryData]));
  }, [setIndustries]);

  // Ensure consumers always receive a valid array.
  const validIndustries = (Array.isArray(industries) && industries.length > 0) ? industries : INITIAL_INDUSTRIES_DETAILED;

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

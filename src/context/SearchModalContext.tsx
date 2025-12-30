import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface SearchModalContextType {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export const SearchModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const value = { isSearchModalOpen, openSearchModal, closeSearchModal };

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
};

export const useSearchModal = (): SearchModalContextType => {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
};

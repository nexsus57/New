
import { createContext, useContext, ReactNode, FC, useMemo } from 'react';
import { Category } from '../types';
import { ALL_CATEGORIES } from '../data/seoData';

interface CategoryContextType {
  categories: Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const value = useMemo(() => ({ categories: ALL_CATEGORIES }), []);
  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within CategoryProvider');
  return context;
}

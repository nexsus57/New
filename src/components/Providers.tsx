
'use client';

import { ReactNode, FC } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';
import { CategoryProvider } from '../context/CategoryContext';
import { SettingsProvider } from '../context/SettingsContext';
import { IndustryProvider } from '../context/IndustryContext';
import { SearchModalProvider } from '../context/SearchModalContext';
import { BlogProvider } from '../context/BlogContext';
import { CartProvider } from '../context/CartContext';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <HelmetProvider>
      <SearchModalProvider>
        <AuthProvider>
          <SettingsProvider>
            <ProductProvider>
              <CategoryProvider>
                <IndustryProvider>
                  <BlogProvider>
                    <CartProvider>
                      {children}
                    </CartProvider>
                  </BlogProvider>
                </IndustryProvider>
              </CategoryProvider>
            </ProductProvider>
          </SettingsProvider>
        </AuthProvider>
      </SearchModalProvider>
    </HelmetProvider>
  );
}
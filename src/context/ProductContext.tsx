
import { createContext, useContext, ReactNode, useCallback, FC, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Product, SeoPageData } from '../types';
import { PRODUCTS as CONTENT_PRODUCTS, INITIAL_INDUSTRIES_DETAILED } from '../constants';
import { seoData } from '../data/seoData';

const PLACEHOLDER_IMAGE = 'https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png';

// --- MERGE LOGIC ---

// 1. Build a reverse map: ProductID -> Array of IndustryIDs
const productIndustryMap = new Map<string, string[]>();

INITIAL_INDUSTRIES_DETAILED.forEach(ind => {
    ind.products.forEach(prodId => {
        const current = productIndustryMap.get(prodId) || [];
        // Avoid duplicates
        if (!current.includes(ind.id)) {
            current.push(ind.id);
        }
        productIndustryMap.set(prodId, current);
    });
});

// 2. Create the authoritative, combined product list.
const INITIAL_PRODUCTS: Product[] = CONTENT_PRODUCTS.map(productContent => {
    const productSeo = seoData.find(seo => seo["Page Type"] === 'Product' && seo.id === productContent.id);
    
    // Define a fallback SEO object for products that might not have a specific entry in seoData.
    const fallbackSeo: SeoPageData = {
        "Page Type": "Product", "Page Name": productContent.name, "Full URL": `https://tapeindia.shop/product/${productContent.id}`,
        "Title (≤60 chars)": `${productContent.name} | Tape India`, "Meta Description (≤160 chars)": productContent.shortDescription,
        "H1": productContent.name, "Primary Keywords": productContent.name, "Secondary Keywords": productContent.category,
        summary: productContent.shortDescription, "CTA": "Request a Quote", "Schema Type": "Product", faqs: [],
        "Product Schema (JSON-LD)": "{}", "LocalBusiness Schema (JSON-LD)": "{}", "FAQ Schema (JSON-LD)": "{}", "Combined Schema (JSON-LD)": "{}"
    };

    // Combine implicit industries (from constants/INITIAL_INDUSTRIES_DETAILED) with explicit ones (from constants/PRODUCTS)
    const implicitIndustries = productIndustryMap.get(productContent.id) || [];
    const explicitIndustries = productContent.industries || [];
    const combinedIndustries = Array.from(new Set([...implicitIndustries, ...explicitIndustries]));

    // Combine content and SEO, then derive the guaranteed `image` property.
    const merged = { ...productContent, seo: productSeo || fallbackSeo, industries: combinedIndustries };
    
    return {
        ...merged,
        image: merged.images?.[0]?.trim() || productContent.image || PLACEHOLDER_IMAGE // Use existing image if available
    };
});

interface ProductContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'image'>) => void;
  updateProduct: (id: string, updatedProduct: Omit<Product, 'id' | 'image'>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: FC<ProductProviderProps> = ({ children }) => {
  // Updated key to v21 to force a refresh of the data structure in local storage for users
  // This version bump fixes broken images and ensures industry mappings are fresh.
  const [products, setProducts] = useLocalStorage<Product[]>('tapeindia_products_v21', INITIAL_PRODUCTS);

  useEffect(() => {
    // Basic validation to reset if data is weird
    if (!Array.isArray(products) || (products.length === 0 && INITIAL_PRODUCTS.length > 0)) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, [products, setProducts]);

  // SELF-HEALING EFFECT: Force sync industry mappings
  // This ensures that if we update constants.ts to assign products to industries,
  // the user's LocalStorage data gets updated automatically.
  useEffect(() => {
      setProducts(currentProducts => {
          if (!Array.isArray(currentProducts)) return INITIAL_PRODUCTS;

          let hasChanges = false;
          const updatedProducts = currentProducts.map(p => {
              const implicitIndustries = productIndustryMap.get(p.id) || [];
              const currentIndustries = p.industries || [];
              
              // Create a set of all industries this product SHOULD have
              const targetIndustriesSet = new Set([...currentIndustries, ...implicitIndustries]);
              
              // If the count differs, it means we are missing some tags
              if (targetIndustriesSet.size !== currentIndustries.length) {
                  hasChanges = true;
                  return { ...p, industries: Array.from(targetIndustriesSet) };
              }
              return p;
          });

          return hasChanges ? updatedProducts : currentProducts;
      });
  }, [setProducts]);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'image'>) => {
    const newId = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
    
    const newProduct: Product = {
      ...productData,
      id: newId,
      // Automatically derive the main image from the images array if present
      image: (productData.images && productData.images.length > 0 && productData.images[0] !== '') 
             ? productData.images[0] 
             : PLACEHOLDER_IMAGE
    };
    
    setProducts(prev => {
        const current = Array.isArray(prev) ? prev : [];
        return [newProduct, ...current]; // Add new product to the top
    });
  }, [setProducts]);

  const updateProduct = useCallback((id: string, updatedProductData: Omit<Product, 'id' | 'image'>) => {
    const finalProductData: Product = {
        id,
        ...updatedProductData,
        // Automatically derive the main image from the images array if present
        image: (updatedProductData.images && updatedProductData.images.length > 0 && updatedProductData.images[0] !== '')
               ? updatedProductData.images[0]
               : PLACEHOLDER_IMAGE
    };
    setProducts(prev => (Array.isArray(prev) ? prev.map(p => (p.id === id ? finalProductData : p)) : [finalProductData]));
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => (Array.isArray(prev) ? prev.filter(p => p.id !== id) : []));
  }, [setProducts]);

  const validProducts = Array.isArray(products) ? products : INITIAL_PRODUCTS;

  const value = { products: validProducts, addProduct, updateProduct, deleteProduct };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

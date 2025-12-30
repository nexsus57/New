
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

// Helper to generate default SEO if missing
const generateFallbackSeo = (product: Partial<Product>): SeoPageData => ({
    "Page Type": "Product",
    "Page Name": product.name || "Product",
    "Full URL": `https://tapeindia.shop/product/${product.id}`,
    "Title (≤60 chars)": `${product.name} | Tape India`,
    "Meta Description (≤160 chars)": product.shortDescription || "",
    "H1": product.name || "Product Detail",
    "Primary Keywords": product.name || "",
    "Secondary Keywords": product.category || "",
    summary: product.shortDescription || "",
    "CTA": "Request a Quote",
    "Schema Type": "Product",
    faqs: [],
    "Product Schema (JSON-LD)": "{}",
    "LocalBusiness Schema (JSON-LD)": "{}",
    "FAQ Schema (JSON-LD)": "{}",
    "Combined Schema (JSON-LD)": "{}"
});

// 2. Create the authoritative, combined product list.
const INITIAL_PRODUCTS: Product[] = CONTENT_PRODUCTS.map(productContent => {
    const productSeo = seoData.find(seo => seo["Page Type"] === 'Product' && seo.id === productContent.id);
    
    // Combine implicit industries (from constants/INITIAL_INDUSTRIES_DETAILED) with explicit ones (from constants/PRODUCTS)
    const implicitIndustries = productIndustryMap.get(productContent.id) || [];
    const explicitIndustries = productContent.industries || [];
    const combinedIndustries = Array.from(new Set([...implicitIndustries, ...explicitIndustries]));

    // Combine content and SEO, then derive the guaranteed `image` property.
    // Ensure SEO is never undefined
    const merged = { 
        ...productContent, 
        seo: productSeo || generateFallbackSeo(productContent), 
        industries: combinedIndustries 
    };
    
    return {
        ...merged,
        image: merged.images?.[0]?.trim() || productContent.image || PLACEHOLDER_IMAGE 
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
  // We keep the versioned key, but the useEffect below ensures data freshness
  const [products, setProducts] = useLocalStorage<Product[]>('tapeindia_products_v22', INITIAL_PRODUCTS); // Bumped version to v22 to force refresh if needed, though merge logic handles it.

  // --- SMART MERGE & HYDRATION FIX ---
  useEffect(() => {
      setProducts(currentProducts => {
          const stored = Array.isArray(currentProducts) ? currentProducts : [];
          
          // Map of deployed products for quick lookup
          const deploymentMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
          
          // Start with the fresh deployment data (Authoritative source)
          const mergedList = [...INITIAL_PRODUCTS];

          // Add products from storage ONLY if they don't exist in deployment data (User/Admin created)
          // AND sanitize them to ensure they have required fields (like SEO)
          stored.forEach(p => {
              if (!deploymentMap.has(p.id)) {
                  // Sanitize stored product
                  const sanitizedProduct = {
                      ...p,
                      seo: p.seo || generateFallbackSeo(p),
                      image: p.image || PLACEHOLDER_IMAGE,
                      features: p.features || [],
                      uses: p.uses || [],
                      industries: p.industries || []
                  };
                  mergedList.push(sanitizedProduct);
              }
          });

          // Check if anything actually changed to prevent infinite re-renders
          if (JSON.stringify(mergedList) !== JSON.stringify(stored)) {
              return mergedList;
          }
          
          return stored;
      });
  }, [setProducts]);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'image'>) => {
    const newId = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
    
    const newProduct: Product = {
      ...productData,
      id: newId,
      image: (productData.images && productData.images.length > 0 && productData.images[0] !== '') 
             ? productData.images[0] 
             : PLACEHOLDER_IMAGE,
      seo: productData.seo || generateFallbackSeo({ ...productData, id: newId })
    };
    
    setProducts(prev => {
        const current = Array.isArray(prev) ? prev : [];
        return [newProduct, ...current]; 
    });
  }, [setProducts]);

  const updateProduct = useCallback((id: string, updatedProductData: Omit<Product, 'id' | 'image'>) => {
    setProducts(prev => {
        const current = Array.isArray(prev) ? prev : [];
        return current.map(p => {
            if (p.id === id) {
                return {
                    id,
                    ...updatedProductData,
                    image: (updatedProductData.images && updatedProductData.images.length > 0 && updatedProductData.images[0] !== '')
                           ? updatedProductData.images[0]
                           : PLACEHOLDER_IMAGE,
                    seo: updatedProductData.seo || p.seo || generateFallbackSeo({ ...updatedProductData, id })
                };
            }
            return p;
        });
    });
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => (Array.isArray(prev) ? prev.filter(p => p.id !== id) : []));
  }, [setProducts]);

  // Fail-safe: ensure we never render with empty data if initialization failed
  const validProducts = (Array.isArray(products) && products.length > 0) ? products : INITIAL_PRODUCTS;

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

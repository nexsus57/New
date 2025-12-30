
'use client';

import React, { useState, useEffect, useRef, useMemo, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { create, insertMultiple, search as oramaSearch } from '@orama/orama';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Product } from '../types';

interface SearchResult extends Product {
  source?: 'fuse' | 'orama';
}

const MAX_RESULTS = 8;
const MAX_RECENT_SEARCHES = 5;

// Global reference for Orama DB to persist across re-renders without full rebuilds if unnecessary
let oramaDb: any = null;
let lastProductCount = 0;

const SearchBar = ({ onResultClick }: { onResultClick?: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- 1. INITIALIZATION: Build Indexes ---

  // Fuse.js Instance (Instant, Client-side, Fuzzy)
  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'id', weight: 0.3 },
        { name: 'category', weight: 0.2 },
        { name: 'tags', weight: 0.2 }, 
        { name: 'industries', weight: 0.1 },
        { name: 'shortDescription', weight: 0.05 }
      ],
      threshold: 0.3, // 0.0 = perfect match, 0.3 allows for typos
      ignoreLocation: true,
      includeScore: true,
    });
  }, [products]);

  // Orama Instance (Async, Client-side, Semantic/Intent)
  useEffect(() => {
    const initOrama = async () => {
      // Avoid rebuilding if product count hasn't changed (simple cache check)
      if (oramaDb && products.length === lastProductCount) return;
      
      const db = await create({
        schema: {
          id: 'string',
          name: 'string',
          description: 'string',
          category: 'string',
          industries: 'string[]',
        },
      });

      const records = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.shortDescription || '',
        category: p.category,
        industries: p.industries || [],
      }));

      // Fix: Cast insertMultiple to any to bypass strict type inference issues where TS expects never[]
      await (insertMultiple as any)(db, records);
      oramaDb = db;
      lastProductCount = products.length;
    };

    initOrama();
  }, [products]);

  // Load Recent Searches from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tapeindia_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // --- 2. HYBRID SEARCH LOGIC ---

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    let combinedResults: SearchResult[] = [];
    const seenIds = new Set<string>();

    // A. PRIMARY: Fuse.js (Fast, Typo-tolerant)
    // Always runs first. Ideal for "Kapton tape", "3M", "Floor marking".
    const fuseResult = fuse.search(q);
    const fuseMatches = fuseResult.map(res => {
      seenIds.add(res.item.id);
      return { ...res.item, source: 'fuse' as const };
    });

    combinedResults = [...fuseMatches];

    // B. SECONDARY: Orama (Intent/Description based)
    // TRIGGER CONDITIONS:
    // 1. Fuse returned very few results (< 3)
    // 2. OR Query is long/descriptive (>= 4 words) implies a problem statement ("tape that withstands high heat")
    const isDescriptive = q.split(' ').length >= 4;
    const needsMoreResults = fuseMatches.length < 3;

    if ((needsMoreResults || isDescriptive) && oramaDb) {
      try {
        const oramaResult = await oramaSearch(oramaDb, {
          term: q,
          limit: 10, // Fetch extra to fill gaps
          threshold: 0, // Orama handles stemming and BM25
        });

        if (oramaResult.count > 0) {
          // Map Orama IDs back to full Product objects
          const oramaMatches = oramaResult.hits
            .map(hit => products.find(p => p.id === hit.document.id))
            .filter((p): p is Product => !!p && !seenIds.has(p.id)) // Deduplicate
            .map(p => ({ ...p, source: 'orama' as const }));
          
          combinedResults = [...combinedResults, ...oramaMatches];
        }
      } catch (e) {
        console.warn("Orama search failed silently", e);
      }
    }

    // C. RANKING & LIMITING
    setResults(combinedResults.slice(0, MAX_RESULTS));
  };

  // Debounce Input
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 100); // Fast debounce
    return () => clearTimeout(timer);
  }, [query, fuse]);

  // --- 3. UX HANDLERS ---

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem('tapeindia_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelection = (product: Product) => {
    saveRecentSearch(query || product.name);
    setQuery('');
    setResults([]);
    setIsFocused(false);
    router.push(`/product/${product.id}`);
    onResultClick?.();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelection(results[activeIndex]);
      } else if (query) {
        // Fallback: Go to listing page with query
        saveRecentSearch(query);
        setIsFocused(false);
        router.push(`/products?q=${encodeURIComponent(query)}`);
        onResultClick?.();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleAddToQuote = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product.id);
    
    // Quick visual feedback
    const btn = e.currentTarget as HTMLButtonElement;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
    btn.classList.remove('text-brand-accent', 'border-gray-200', 'hover:border-brand-accent');
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');
        btn.classList.add('text-brand-accent', 'border-gray-200', 'hover:border-brand-accent');
    }, 1500);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Popular Products (Fallback when no query)
  const popularProductsList = useMemo(() => {
    if (!settings.popularProductIds) return [];
    return products
      .filter(p => settings.popularProductIds.includes(p.id))
      .slice(0, 3);
  }, [products, settings.popularProductIds]);

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="relative group">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-brand-accent transition-colors"></i>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tape, SKU, or application..."
          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all duration-300 shadow-sm bg-gray-50 focus:bg-white"
          autoComplete="off"
          aria-label="Search products"
        />
      </div>

      {/* DROPDOWN RESULTS */}
      {isFocused && (
        <div className="absolute top-full mt-2 w-full md:w-[120%] md:-left-[10%] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
          
          {/* STATE 1: NO QUERY - Show Recent & Popular */}
          {query.trim().length === 0 && (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Searches</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => handleRecentSearchClick(term)}
                        className="px-3 py-1 bg-gray-100 hover:bg-brand-gray text-gray-600 text-xs rounded-full transition-colors flex items-center"
                      >
                        <i className="fas fa-history mr-1.5 text-gray-400"></i>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Products</h4>
                <ul className="space-y-2">
                  {popularProductsList.map(product => (
                    <li key={product.id}>
                        <Link 
                            href={`/product/${product.id}`}
                            onClick={() => { setIsFocused(false); onResultClick?.(); }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group transition-colors"
                        >
                            <img src={product.image} alt={product.name} className="w-8 h-8 object-contain rounded bg-white border border-gray-100" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-brand-blue-dark line-clamp-1">{product.name}</span>
                        </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STATE 2: HAS QUERY & RESULTS */}
          {query.trim().length > 0 && results.length > 0 && (
            <ul className="divide-y divide-gray-50">
              {results.map((product, index) => (
                <li 
                    key={product.id} 
                    className={`${index === activeIndex ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <div
                    onClick={() => handleSelection(product)}
                    className="flex items-center p-3 cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded border border-gray-200 p-0.5 mr-3 overflow-hidden">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-contain"
                            loading="lazy"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0 mr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-brand-accent transition-colors">
                            {product.name}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 gap-2">
                         <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 truncate max-w-[120px]">
                            {product.category.replace(/-/g, ' ')}
                         </span>
                         {/* Show a relevant industry tag if available */}
                         {product.industries?.[0] && (
                             <span className="hidden sm:inline-block text-gray-400 truncate border-l border-gray-300 pl-2">
                                {product.industries[0].replace(/-industry/g, '').replace(/-/g, ' ')}
                             </span>
                         )}
                      </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={(e) => handleAddToQuote(e, product)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-brand-accent hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-200 shadow-sm z-10"
                        title="Add to Quote"
                        aria-label="Add to quote"
                    >
                        <i className="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </li>
              ))}
              
              <li className="bg-gray-50 p-2 text-center">
                 <Link 
                    href={`/products?q=${encodeURIComponent(query)}`}
                    onClick={() => { setIsFocused(false); onResultClick?.(); }}
                    className="text-xs font-bold text-brand-accent hover:underline uppercase tracking-wider block w-full"
                 >
                    View All Results
                 </Link>
              </li>
            </ul>
          )}

          {/* STATE 3: NO RESULTS */}
          {query.trim().length > 0 && results.length === 0 && (
            <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3 text-gray-400">
                    <i className="fas fa-search-minus text-xl"></i>
                </div>
                <p className="text-sm font-medium text-gray-900">No products found</p>
                <p className="text-xs text-gray-500 mt-1">Try generic terms like "tape", "safety", or "insulation".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

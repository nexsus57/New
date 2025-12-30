
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useState, FC, Suspense } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { INITIAL_INDUSTRIES_DETAILED } from '../../constants';
import ProductCard from '../../components/ProductCard';
import AnimatedSection from '../../components/AnimatedSection';
import CanonicalTag from '../../components/CanonicalTag';
import { seoData } from '../../data/seoData';
import type { SeoPageData } from '../../types';

interface FilterButtonProps {
    label: string;
    isActive: boolean;
    to: string;
}

const FilterButton: FC<FilterButtonProps> = ({ label, isActive, to }) => {
    return (
        <Link
            href={to}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap border ${
                isActive 
                ? 'bg-brand-accent text-white border-brand-accent shadow' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
            }`}
        >
            {label}
        </Link>
    );
}

function ProductsListContent() {
    const searchParams = useSearchParams();
    const { products } = useProducts();
    const { categories } = useCategories();

    const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);
    
    const { 
      filteredProducts, 
      pageContent, 
      pageH1,
    } = useMemo(() => {
        // Fix: Use optional chaining to handle null searchParams
        const industryId = searchParams?.get('industry');
        const categoryId = searchParams?.get('category');
        const searchQuery = searchParams?.get('q');
        
        let prods = products;
        let pageData: Partial<SeoPageData> | undefined;

        if (industryId) {
            const industryDetail = INITIAL_INDUSTRIES_DETAILED.find(i => i.id === industryId);
            
            if (industryDetail) {
                prods = products.filter(p => 
                    industryDetail.products.includes(p.id) || 
                    p.industries?.includes(industryId)
                );
                
                pageData = {
                    H1: industryDetail.name,
                    summary: industryDetail.description,
                };
            }
        } else if (categoryId) {
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                prods = products.filter(p => p.category === categoryId);
                pageData = seoData.find(p => p.id === categoryId || p["Page Name"] === category.name);
            }
        } else if (searchQuery) {
             const q = searchQuery.toLowerCase();
             prods = products.filter(p => 
                 p.name.toLowerCase().includes(q) || 
                 p.shortDescription.toLowerCase().includes(q)
             );
             pageData = {
                 H1: `Search Results: "${searchQuery}"`,
                 summary: `Showing results for "${searchQuery}"`,
             };
        }

        if (!pageData) {
            pageData = seoData.find(p => p["Page Name"] === "All Products List");
        }

        const h1 = pageData?.H1 || 'All Products';
        const content = pageData?.summary || '';
        
        return {
            filteredProducts: prods,
            pageContent: content,
            pageH1: h1,
        };
    }, [searchParams, products, categories]);

    // Fix: Use optional chaining here as well
    const activeCategory = searchParams?.get('category');
    const activeIndustry = searchParams?.get('industry');

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="bg-brand-blue-deep text-white py-12 md:py-16">
                <div className="container mx-auto px-5 lg:px-8 text-center">
                    <AnimatedSection>
                        <h1 className="font-extrabold mb-4 text-white">{pageH1}</h1>
                        {pageContent && <p className="text-blue-100 max-w-3xl mx-auto text-lg">{pageContent}</p>}
                    </AnimatedSection>
                </div>
            </div>

            <div className="container mx-auto px-5 lg:px-8 py-8">
                {/* Filters */}
                <AnimatedSection className="mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Categories Filter */}
                        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                            <div className="flex gap-2">
                                <FilterButton 
                                    label="All Products" 
                                    isActive={!activeCategory && !activeIndustry} 
                                    to="/products" 
                                />
                                {categories.map(cat => (
                                    <FilterButton 
                                        key={cat.id} 
                                        label={cat.name} 
                                        isActive={activeCategory === cat.id} 
                                        to={`/products?category=${cat.id}`} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Products Grid */}
                <AnimatedSection delay="delay-100">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    categoryName={categoryMap.get(product.category) || ''} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-bold text-gray-700">No products found.</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
                            <Link href="/products" className="mt-4 inline-block text-brand-accent font-semibold hover:underline">
                                View All Products
                            </Link>
                        </div>
                    )}
                </AnimatedSection>
            </div>
        </main>
    );
}

export default function ProductsListPage() {
    return (
        <>
            <CanonicalTag />
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <ProductsListContent />
            </Suspense>
        </>
    );
}

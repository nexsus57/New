
'use client';

import { useMemo, useState, type FC, useEffect, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '../../../context/ProductContext';
import { useCategories } from '../../../context/CategoryContext';
import { INDUSTRIES } from '../../../constants';
import ProductCard from '../../../components/ProductCard';
import CanonicalTag from '../../../components/CanonicalTag';
import { ColorOption } from '../../../types';
import { seoData } from '../../../data/seoData';
import FaqAccordion from '../../../components/FaqAccordion';
import NotFound from '../../not-found';

interface ColorSwatchProps {
    name: string;
    colors: string[];
}

const ColorSwatch: FC<ColorSwatchProps> = ({ name, colors }) => {
    let swatchClasses = "w-6 h-6 rounded-full border border-gray-300 flex-shrink-0 shadow-inner";
    let swatchStyle: CSSProperties = {};

    if (colors[0] === 'transparent') {
        swatchClasses += " bg-white";
        swatchStyle = {
             backgroundImage: `url("data:image/svg+xml,%3csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='5' height='5' x='0' y='0' fill='rgb(229, 231, 235)'/%3e%3crect width='5' height='5' x='5' y='5' fill='rgb(229, 231, 235)'/%3e%3c/svg%3e")`,
        }
    } else if (colors.length > 1) {
        swatchStyle = { background: `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)` };
    } else {
        swatchStyle = { backgroundColor: colors[0] };
    }

    return (
        <div className="flex items-center gap-2">
            <div
                className={swatchClasses}
                style={swatchStyle}
                title={name}
            ></div>
            <span className="text-gray-600 text-sm">{name}</span>
        </div>
    );
};


export default function ProductPage() {
    const params = useParams();
    // Safely handle params type (string, string[], or undefined)
    const productId = Array.isArray(params?.productId) ? params?.productId[0] : params?.productId;
    
    const { products } = useProducts();
    
    // Robust ID matching
    const product = useMemo(() => {
        if (!productId) return undefined;
        const targetId = productId.toLowerCase().trim();
        return products.find(p => p.id.toLowerCase() === targetId);
    }, [products, productId]);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, [productId]);

    const { categories } = useCategories();
    const category = useMemo(() => categories.find(c => c.id === product?.category), [categories, product]);
    
    const relatedIndustries = useMemo(() => {
        if (!product?.industries) return [];
        return INDUSTRIES.filter(ind => product.industries?.includes(ind.id));
    }, [product]);
    
    // --- SMART RELATED PRODUCTS ALGORITHM (Weighted Scoring) ---
    const relatedProducts = useMemo(() => {
      if (!product) return [];
      
      const candidates = products.filter(p => p.id !== product.id);
      
      const scoredCandidates = candidates.map(p => {
          let score = 0;
          
          // 1. Category Match (Base relevance - 10 pts)
          if (p.category === product.category) score += 10;
          
          // 2. Industry Overlap (Context relevance - 5 pts per shared industry)
          const commonIndustries = p.industries?.filter(ind => product.industries?.includes(ind));
          if (commonIndustries && commonIndustries.length > 0) {
              score += (commonIndustries.length * 5);
          }

          // 3. Name/Keyword Similarity (Specific relevance - 2 pts per shared significant word)
          const pTokens = p.name.toLowerCase().split(/[\s-]+/);
          const currentTokens = product.name.toLowerCase().split(/[\s-]+/);
          // Filter only meaningful words > 3 chars
          const commonTokens = pTokens.filter(t => t.length > 3 && currentTokens.includes(t));
          score += (commonTokens.length * 2);

          return { product: p, score };
      });

      // Sort by Score Descending
      scoredCandidates.sort((a, b) => b.score - a.score);

      // Return top 3 highest scored products
      return scoredCandidates.slice(0, 3).map(item => item.product);
    }, [product, products]);

    if (!productId || !product) {
        return <NotFound />;
    }
    
    const productSeoData = product.seo;
    const imageAltText = product.name;
    const h1Text = productSeoData.H1;

    const hasOptions = (product.availableColors && product.availableColors.length > 0) || product.customizable;
    
    return (
        <>
            <CanonicalTag />
            
            <main className="py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-5 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="text-sm font-semibold mb-6" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex items-center flex-wrap">
                            <li className="flex items-center">
                                <Link href="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
                                <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
                            </li>
                            <li className="flex items-center">
                                <Link href="/products" className="text-gray-500 hover:text-brand-blue">Products</Link>
                                <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
                            </li>
                                {category && (
                                <li className="flex items-center">
                                    <Link href={`/products?category=${category.id}`} className="text-gray-500 hover:text-brand-blue">{category.name}</Link>
                                    <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
                                </li>
                            )}
                            <li className="text-brand-blue-dark truncate max-w-[200px]" aria-current="page">{product.name}</li>
                        </ol>
                    </nav>

                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Left Column: Product Image */}
                        <div className="lg:col-span-2">
                             <div className="sticky top-24 self-start">
                                <div 
                                    className="product-detail-image-container relative bg-white border border-gray-200 rounded-lg p-4"
                                >
                                    <img
                                        src={product.image}
                                        alt={imageAltText}
                                        className="rounded-lg"
                                        crossOrigin="anonymous"
                                        onError={(e) => (e.currentTarget.src = "https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png")}
                                        width="300"
                                        height="300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Product Details */}
                        <div className="lg:col-span-3">
                            <h1 className="font-extrabold text-brand-blue-dark mb-3 leading-tight">{h1Text}</h1>
                            
                             <div className="space-y-6 text-slate-700">
                                <div className="prose prose-lg max-w-none text-base leading-relaxed text-slate-600">
                                   <h2 className="text-xl font-bold text-brand-blue-dark border-b border-gray-200 pb-2">Product Description</h2>
                                   <p className="mt-4">{productSeoData.summary}</p>
                                </div>

                                {product.features && product.features.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-blue-dark mb-2">Key Features</h3>
                                        <ul className="list-disc list-outside pl-5 space-y-1 text-base">
                                            {product.features.map((feature, index) => <li key={`feat-${index}`}>{feature}</li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                {product.uses && product.uses.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-blue-dark mb-2">Common Applications</h3>
                                        <ul className="list-disc list-outside pl-5 space-y-1 text-base">
                                            {product.uses.map((use, index) => <li key={`use-${index}`}>{use}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {hasOptions && (
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-blue-dark mb-3">Options & Customization</h3>
                                        <div className="space-y-4">
                                            {product.availableColors && product.availableColors.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-base mb-2 text-gray-800">Available Colors:</h4>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {product.availableColors.map((opt: ColorOption) => <ColorSwatch key={opt.name} {...opt} />)}
                                                    </div>
                                                </div>
                                            )}
                                            {product.customizable && (
                                                <div>
                                                    <h4 className="font-semibold text-base mb-2 text-gray-800">Custom Sizes:</h4>
                                                    <p className="text-base text-gray-700">This product can be slit to custom widths or die-cut. Contact us with your requirements.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {relatedIndustries.length > 0 && (
                                    <div className="hidden lg:block">
                                        <h3 className="text-lg font-bold text-brand-blue-dark mb-3">Relevant Industries</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {relatedIndustries.map(industry => (
                                                <Link key={industry.id} href={`/products?industry=${industry.id}`} className="bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-md hover:bg-brand-accent hover:text-white transition-colors text-sm">
                                                    {industry.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Request Quote Section */}
                                <div className="!mt-10 pt-6 border-t border-gray-200">
                                  <h3 className="text-xl font-bold text-brand-blue-dark">Get a Quote for {product.name}</h3>
                                  <p className="text-gray-600 my-3">
                                      For competitive B2B pricing, custom sizes, and Pan-India delivery, contact our team for a personalized quote.
                                  </p>
                                  <Link
                                      href={`/request-quote?product=${product.id}`}
                                      className="inline-block bg-brand-yellow text-brand-blue-dark font-bold py-3 px-8 rounded-md text-base hover:bg-yellow-400 transition-colors transform hover:scale-105"
                                  >
                                      {productSeoData.CTA}
                                  </Link>
                                </div>
                           </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    {productSeoData.faqs && productSeoData.faqs.length > 0 && (
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mt-8">
                           <h2 className="text-2xl font-bold text-brand-blue-dark mb-6">Frequently Asked Questions</h2>
                           <div className="space-y-4">
                               {productSeoData.faqs.map((faq, index) => (
                                   <FaqAccordion key={index} question={faq.name} answer={faq.acceptedAnswer.text} />
                               ))}
                           </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="py-16 md:py-24 bg-brand-gray">
                    <div className="container mx-auto px-5 lg:px-8">
                        <h2 className="text-3xl font-bold mb-12 text-center text-brand-blue-dark">You Might Also Need</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map(p => (
                               <ProductCard key={p.id} product={p} categoryName={category?.name || ''} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

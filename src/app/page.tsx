
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useSettings } from '../context/SettingsContext';
import { INDUSTRIES } from '../constants';
import ProductCard from '../components/ProductCard';
import IndustryCard from '../components/IndustryCard';
import AnimatedSection from '../components/AnimatedSection';
import { ExperienceIcon, QualityIcon, RangeIcon } from '../components/icons/WhyChooseUsIcons';
import { type Product } from '../types';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';
import { seoData } from '../data/seoData';

export default function HomePage() {
    const { products } = useProducts();
    const { categories } = useCategories();
    const { settings } = useSettings();

    const homeData = useMemo(() => seoData.find(p => p["Page Name"] === "Home"), []);

    const categoryMap = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach(cat => map.set(cat.id, cat.name));
        return map;
    }, [categories]);

    const popularProducts = useMemo(() => {
        const productMap = new Map(products.map(p => [p.id, p]));
        return settings.popularProductIds.map(id => productMap.get(id)).filter((p): p is Product => Boolean(p));
    }, [products, settings.popularProductIds]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://file.garden/aIULwzQ_QkPKQcGw/banner.webp" 
            alt="Tape India Banner"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        <div className="relative container mx-auto px-5 lg:px-8 py-20 md:py-24 text-center">
          <AnimatedSection>
            <h1 className="font-extrabold mb-5 text-white">
              {homeData?.H1 || 'Industrial Tape Manufacturer & Bulk Supplier in India'}
            </h1>
            <p className="text-gray-200 mb-12 max-w-3xl mx-auto">
              {homeData?.summary || "Leading B2B supplier of industrial tapes since 1957."}
            </p>
            <div className="flex justify-center items-center flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="bg-brand-amber text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-lg"
              >
                Explore Products
              </Link>
              <Link 
                href="/request-quote" 
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-brand-blue-deep transition-all duration-300 w-full sm:w-auto text-lg"
              >
                {homeData?.CTA || 'Request a Quote'}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-brand-gray">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="text-center">
                <h2 className="mb-6">Why Partner with Tape India?</h2>
                <p className="text-gray-600 mb-16 max-w-3xl mx-auto">
                    Decades of experience and commitment to excellence.
                </p>
            </AnimatedSection>
            <AnimatedSection className="delay-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-sm text-center border-t-4 border-brand-accent">
                  <ExperienceIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                  <h3 className="mb-3">Decades of Experience</h3>
                  <p className="text-gray-600">Established in 1957.</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm text-center border-t-4 border-brand-accent">
                  <QualityIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                  <h3 className="mb-3">Unmatched Quality</h3>
                  <p className="text-gray-600">Strict quality parameters.</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm text-center border-t-4 border-brand-accent">
                  <RangeIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                  <h3 className="mb-3">200+ Solutions</h3>
                  <p className="text-gray-600">Extensive product range.</p>
                </div>
              </div>
            </AnimatedSection>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-5 lg:px-8">
              <AnimatedSection className="text-center">
                  <h2 className="font-extrabold mb-6">Our Popular Industrial Tapes</h2>
              </AnimatedSection>
              <AnimatedSection className="delay-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {popularProducts.slice(0, 6).map(product => (
                          <ProductCard key={product.id} product={product} categoryName={categoryMap.get(product.category) || ''} />
                      ))}
                  </div>
              </AnimatedSection>
          </div>
      </section>
    </>
  );
}

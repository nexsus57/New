
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useSettings } from '../../context/SettingsContext';
import ProductCard from '../ProductCard';
import CategoryCard from '../CategoryCard';
import IndustryCard from '../IndustryCard';
import TestimonialCard from '../TestimonialCard';
import AnimatedSection from '../AnimatedSection';
import { ExperienceIcon, QualityIcon, RangeIcon } from '../icons/WhyChooseUsIcons';
import { type Product } from '../../types';
import { seoData } from '../../data/seoData';
import { INDUSTRIES } from '../../constants';

export default function HomeView() {
    const { products } = useProducts();
    const { categories } = useCategories();
    const { settings } = useSettings();

    const homeData = useMemo(() => {
        const found = seoData.find(p => p["Page Name"] === "Home");
        return found || {
            H1: 'Industrial Tape Manufacturer & Bulk Supplier in India',
            summary: "Leading B2B supplier of industrial tapes since 1957.",
            CTA: 'Request a Quote'
        };
    }, []);

    const categoryMap = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach(cat => map.set(cat.id, cat.name));
        return map;
    }, [categories]);

    const popularProducts = useMemo(() => {
        const targetIds = settings.popularProductIds?.length > 0 
            ? settings.popularProductIds 
            : products.slice(0, 3).map(p => p.id);

        const productMap = new Map(products.map(p => [p.id, p]));
        return targetIds
            .map(id => productMap.get(id))
            .filter((p): p is Product => Boolean(p));
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
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative container mx-auto px-5 lg:px-8 py-24 md:py-32 text-center">
          <AnimatedSection>
            <h1 className="font-extrabold mb-6 text-white text-4xl md:text-5xl leading-tight">
              {homeData.H1}
            </h1>
            <p className="text-gray-200 mb-10 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              {homeData.summary}
            </p>
            <div className="flex justify-center items-center flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="bg-brand-amber text-brand-blue-dark font-bold py-3.5 px-8 rounded-lg hover:bg-amber-500 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-lg shadow-lg"
              >
                Explore Products
              </Link>
              <Link 
                href="/request-quote" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold py-3.5 px-8 rounded-lg hover:bg-white hover:text-brand-blue-deep transition-all duration-300 w-full sm:w-auto text-lg shadow-lg"
              >
                {homeData.CTA}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="text-center mb-12">
                <h2 className="font-extrabold text-brand-blue-dark mb-4">Browse by Category</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Find the perfect adhesive solution tailored to your specific application needs.
                </p>
            </AnimatedSection>
            <AnimatedSection delay="delay-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 6).map(cat => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/products" className="inline-flex items-center text-brand-accent font-bold text-lg hover:text-brand-accent-dark hover:underline transition-colors group">
                        View All Categories 
                        <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                    </Link>
                </div>
            </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-brand-gray border-y border-gray-200">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="text-center">
                <h2 className="mb-6 font-extrabold text-brand-blue-dark">Why Partner with Tape India?</h2>
                <p className="text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
                    With over 65 years of expertise, we deliver reliability and innovation to industries across India.
                </p>
            </AnimatedSection>
            <AnimatedSection delay="delay-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border-b-4 border-brand-accent hover:-translate-y-2 transition-transform duration-300">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ExperienceIcon className="h-10 w-10 text-brand-accent" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-800">Decades of Experience</h3>
                  <p className="text-gray-600">Established in 1957, serving generations of industrial needs.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border-b-4 border-brand-accent hover:-translate-y-2 transition-transform duration-300">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <QualityIcon className="h-10 w-10 text-brand-accent" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-800">Unmatched Quality</h3>
                  <p className="text-gray-600">Rigorous quality control ensures consistent, superior performance.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border-b-4 border-brand-accent hover:-translate-y-2 transition-transform duration-300">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RangeIcon className="h-10 w-10 text-brand-accent" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-800">200+ Solutions</h3>
                  <p className="text-gray-600">An extensive product portfolio for every industrial requirement.</p>
                </div>
              </div>
            </AnimatedSection>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="text-center mb-12">
                <h2 className="font-extrabold text-brand-blue-dark mb-4">Industries We Serve</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Providing specialized adhesive technologies for diverse industrial sectors.
                </p>
            </AnimatedSection>
            <AnimatedSection delay="delay-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {INDUSTRIES.slice(0, 3).map(ind => (
                        <IndustryCard key={ind.id} industry={ind} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/industries" className="inline-flex items-center text-brand-accent font-bold text-lg hover:text-brand-accent-dark hover:underline transition-colors group">
                        Explore All Industries 
                        <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                    </Link>
                </div>
            </AnimatedSection>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 bg-brand-gray">
          <div className="container mx-auto px-5 lg:px-8">
              <AnimatedSection className="text-center mb-12">
                  <h2 className="font-extrabold mb-4 text-brand-blue-dark">Our Popular Industrial Tapes</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                      Discover our most sought-after adhesive products trusted by professionals.
                  </p>
              </AnimatedSection>
              <AnimatedSection delay="delay-200">
                  {popularProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {popularProducts.slice(0, 6).map(product => (
                              <ProductCard key={product.id} product={product} categoryName={categoryMap.get(product.category) || ''} />
                          ))}
                      </div>
                  ) : (
                      <div className="text-center text-gray-500 py-10">
                          Loading products...
                      </div>
                  )}
                  <div className="text-center mt-12">
                    <Link href="/products" className="bg-brand-blue-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue transition-colors shadow-md inline-block">
                        View Full Catalog
                    </Link>
                  </div>
              </AnimatedSection>
          </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-brand-blue-deep text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="container mx-auto px-5 lg:px-8 relative z-10">
              <AnimatedSection className="text-center mb-16">
                  <h2 className="font-extrabold text-white mb-4">Trusted by Industry Leaders</h2>
                  <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                      See what our clients have to say about our commitment to quality and service.
                  </p>
              </AnimatedSection>
              <AnimatedSection delay="delay-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {settings.testimonials.map((t, i) => (
                          <div key={i} className="h-full">
                              <TestimonialCard {...t} />
                          </div>
                      ))}
                  </div>
              </AnimatedSection>
          </div>
      </section>
    </>
  );
}

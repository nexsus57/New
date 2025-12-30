'use client';

import React from 'react';
import Link from 'next/link';
import { useIndustry } from '../../context/IndustryContext';
import AnimatedSection from '../../components/AnimatedSection';
import CanonicalTag from '../../components/CanonicalTag';
import IndustryCard from '../../components/IndustryCard';

export default function IndustriesPage() {
  const { industries } = useIndustry();

  return (
    <>
      <CanonicalTag />
      
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Header */}
        <header className="bg-brand-blue-deep text-white py-16 md:py-24">
          <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="text-center">
              <h1 className="font-extrabold text-white mb-6">
                Industries We Serve
              </h1>
              <p className="text-blue-100 max-w-3xl mx-auto text-lg md:text-xl">
                We provide engineered adhesive solutions for diverse industrial sectors. Explore our specialized product ranges designed to meet the unique challenges of your industry.
              </p>
            </AnimatedSection>
          </div>
        </header>

        <div className="container mx-auto px-5 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
               <AnimatedSection key={industry.id} delay={index % 2 === 0 ? "delay-0" : "delay-100"} className="h-full">
                  <IndustryCard industry={{
                      ...industry,
                      // Mapping back to the simple Industry type expected by IndustryCard
                      subtitle: industry.description.split('.')[0] + '.', 
                      icon: industry.id === 'packaging-industry' ? 'BoxIcon' : 
                            industry.id === 'hvac-industry' ? 'WindIcon' :
                            industry.id === 'electronic-industry' ? 'CpuIcon' :
                            industry.id === 'print-labels-signage-industry' ? 'LayersIcon' :
                            industry.id === 'reflective-safety-industry' ? 'SunIcon' : 'SparklesIcon',
                      gradientClasses: industry.id === 'packaging-industry' ? 'from-amber-500 via-orange-600 to-red-700' :
                                       industry.id === 'hvac-industry' ? 'from-cyan-500 via-cyan-600 to-blue-700' :
                                       industry.id === 'print-labels-signage-industry' ? 'from-slate-500 via-slate-600 to-slate-700' :
                                       industry.id === 'electronic-industry' ? 'from-blue-600 via-blue-700 to-indigo-800' :
                                       industry.id === 'reflective-safety-industry' ? 'from-yellow-400 via-yellow-500 to-orange-500' :
                                       'from-green-500 via-green-600 to-teal-700'
                  }} />
               </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="bg-brand-gray py-20">
          <div className="container mx-auto px-5 lg:px-8 text-center">
             <AnimatedSection>
                <h2 className="mb-6">Need a Custom Solution?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                  If your industry isn't listed or you have specific requirements, our technical team can help you find or develop the right adhesive tape.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <Link 
                     href="/contact" 
                     className="bg-brand-blue-deep text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-dark transition-all"
                   >
                     Contact Experts
                   </Link>
                   <Link 
                     href="/request-quote" 
                     className="bg-brand-yellow text-brand-blue-dark font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-all"
                   >
                     Request Bulk Quote
                   </Link>
                </div>
             </AnimatedSection>
          </div>
        </section>
      </main>
    </>
  );
}
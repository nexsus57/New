'use client';

import Link from 'next/link';
import AnimatedSection from '../../components/AnimatedSection';
import { QualityIcon, TeamIcon, InnovationIcon, IntegrityIcon } from '../../components/icons/WhyChooseUsIcons';
import CanonicalTag from '../../components/CanonicalTag';
import { seoData } from '../../data/seoData';
import { useMemo } from 'react';

export default function AboutPage() {
  const aboutData = useMemo(() => seoData.find(p => p["Page Name"] === "About Us"), []);

  return (
    <>
      <CanonicalTag />
      
      {/* Hero Section */}
      <header className="bg-brand-blue-deep text-white">
        <div className="container mx-auto px-5 lg:px-8 py-20 md:py-24 text-center">
            <AnimatedSection>
                <h1 className="font-extrabold mb-4 text-white">
                  {aboutData?.H1 || 'About Sha Kundanmal Misrimal'}
                </h1>
                <p className="text-gray-200 max-w-4xl mx-auto">
                    For over 65 years, Tape India has been more than just a manufacturer; we are the foundational B2B partner for India’s leading industries, delivering reliability you can trust.
                </p>
            </AnimatedSection>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 lg:px-8">
            
            {/* Our Story */}
            <AnimatedSection className="max-w-4xl mx-auto mb-20 lg:mb-24">
                <h2 className="mb-8 text-center">
                    {aboutData?.H2_1 || "Our Journey: From Local Supplier to National Manufacturer"}
                </h2>
                <div className="text-gray-700 space-y-6">
                  <p>
                      Our journey began in 1957 when Sha Kundanmal Misrimal was founded in Chennai with a clear vision: to supply high-quality adhesive materials to local businesses. Fueled by a commitment to excellence and customer satisfaction, we quickly grew from a small proprietorship into a trusted name in the industrial supply sector.
                  </p>
                  <p>
                      Through decades of technological evolution and changing market demands, we have consistently invested in advanced manufacturing, rigorous quality control, and a diverse product portfolio. Today, Tape India stands as a testament to that legacy—a modern, dynamic company with a national footprint, still guided by the core principles of quality and reliability that our founders instilled.
                  </p>
                   <p>
                      While known as Tape India, we manufacture a wide variety of products comparable to leading brands like Wonder Tape, ensuring premium quality and performance. As part of our commitment to providing comprehensive solutions, we also source and supply premium materials from world-renowned brands like 3M, ensuring our clients have access to the best industrial tapes and adhesives available, all with Pan-India distribution.
                  </p>
                </div>
            </AnimatedSection>

            {/* Mission and Vision Section */}
            <AnimatedSection className="mb-20 lg:mb-24">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-brand-gray p-10 md:p-16 rounded-lg">
                    <div className="text-center lg:text-left">
                        <h3 className="mb-4 flex items-center justify-center lg:justify-start">
                          <i className="fas fa-bullseye text-brand-accent mr-3"></i>
                          Our Mission
                        </h3>
                        <p>To empower Indian industries with superior adhesive solutions that enhance operational efficiency, ensure product integrity, and drive innovation.</p>
                    </div>
                     <div className="text-center lg:text-left">
                        <h3 className="mb-4 flex items-center justify-center lg:justify-start">
                           <i className="fas fa-eye text-brand-accent mr-3"></i>
                           Our Vision
                        </h3>
                        <p>To be India’s most trusted and pioneering partner in engineered adhesion, setting the benchmark for quality, reliability, and customer-centric solutions.</p>
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Our Core Values Section */}
            <AnimatedSection>
                <h2 className="mb-16 text-center">{aboutData?.H2_2 || "Our Core Values"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-brand-accent">
                        <QualityIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                        <h3 className="mb-3">Uncompromising Quality</h3>
                        <p className="text-gray-600">Our name is synonymous with reliability. Every product undergoes rigorous testing to meet the highest performance standards.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-brand-accent">
                        <TeamIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                        <h3 className="mb-3">Customer Partnership</h3>
                        <p className="text-gray-600">We succeed when our clients succeed. We work collaboratively to understand your unique challenges and find the perfect solution.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-brand-accent">
                        <InnovationIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                        <h3 className="mb-3">Continuous Innovation</h3>
                        <p className="text-gray-600">We constantly explore new materials and technologies to bring you cutting-edge adhesive solutions that drive progress.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-brand-accent">
                        <IntegrityIcon className="h-12 w-12 mx-auto text-brand-accent mb-5" />
                        <h3 className="mb-3">Integrity and Trust</h3>
                        <p className="text-gray-600">Our business is built on a foundation of honesty and transparency. We build lasting relationships based on trust.</p>
                    </div>
                </div>
            </AnimatedSection>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-brand-gray py-16 md:py-24">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="max-w-3xl mx-auto text-center">
                <h2 className="mb-6">Partner with an Industry Leader</h2>
                <p className="text-gray-600 mb-10">
                    Ready to experience the Tape India difference? Contact our team today to discuss your project requirements, request a sample, or get a personalized quote.
                </p>
                <Link 
                    href="/request-quote" 
                    className="inline-block bg-brand-amber text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                >
                    {aboutData?.CTA || 'Request a Bulk Quote'}
                </Link>
            </AnimatedSection>
        </div>
      </section>
    </>
  );
}
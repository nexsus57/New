
'use client';

import Link from 'next/link';
import AnimatedSection from '../../components/AnimatedSection';
import { QualityIcon, TeamIcon, InnovationIcon, IntegrityIcon } from '../../components/icons/WhyChooseUsIcons';
import TestimonialCard from '../../components/TestimonialCard';
import { useSettings } from '../../context/SettingsContext';
import CanonicalTag from '../../components/CanonicalTag';
import { seoData } from '../../data/seoData';
import { useMemo } from 'react';

export default function AboutPage() {
  const { settings } = useSettings();
  const aboutData = useMemo(() => seoData.find(p => p["Page Name"] === "About Us"), []);

  return (
    <>
      <CanonicalTag />
      
      {/* Hero Section */}
      <header className="bg-brand-blue-deep text-white relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-5 lg:px-8 py-24 md:py-32 text-center relative z-10">
            <AnimatedSection>
                <h1 className="font-extrabold mb-6 text-white text-4xl md:text-5xl">
                  {aboutData?.H1 || 'About Sha Kundanmal Misrimal'}
                </h1>
                <p className="text-gray-100 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed font-light">
                    For over 65 years, Tape India has been more than just a manufacturer; we are the foundational B2B partner for India’s leading industries, delivering reliability you can trust.
                </p>
            </AnimatedSection>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="bg-white py-20">
        <div className="container mx-auto px-5 lg:px-8">
            
            {/* Our Story */}
            <AnimatedSection className="max-w-4xl mx-auto mb-24">
                <h2 className="mb-8 text-center text-3xl md:text-4xl text-brand-blue-dark font-bold">
                    {aboutData?.H2_1 || "Our Journey: From Local Supplier to National Manufacturer"}
                </h2>
                <div className="text-gray-700 space-y-6 text-lg leading-relaxed text-justify md:text-left">
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
            <AnimatedSection className="mb-24">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-gray-50 p-10 md:p-16 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center lg:text-left">
                        <h3 className="mb-4 flex items-center justify-center lg:justify-start text-2xl font-bold text-brand-blue-dark">
                          <i className="fas fa-bullseye text-brand-accent mr-3 bg-blue-100 p-2 rounded-full w-10 h-10 flex items-center justify-center"></i>
                          Our Mission
                        </h3>
                        <p className="text-gray-700 text-lg">To empower Indian industries with superior adhesive solutions that enhance operational efficiency, ensure product integrity, and drive innovation.</p>
                    </div>
                     <div className="text-center lg:text-left">
                        <h3 className="mb-4 flex items-center justify-center lg:justify-start text-2xl font-bold text-brand-blue-dark">
                           <i className="fas fa-eye text-brand-accent mr-3 bg-blue-100 p-2 rounded-full w-10 h-10 flex items-center justify-center"></i>
                           Our Vision
                        </h3>
                        <p className="text-gray-700 text-lg">To be India’s most trusted and pioneering partner in engineered adhesion, setting the benchmark for quality, reliability, and customer-centric solutions.</p>
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Our Core Values Section */}
            <AnimatedSection>
                <h2 className="mb-16 text-center text-3xl font-bold text-brand-blue-dark">{aboutData?.H2_2 || "Our Core Values"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 border-t-4 border-brand-accent group">
                        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                            <QualityIcon className="h-14 w-14 mx-auto text-brand-accent" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">Uncompromising Quality</h3>
                        <p className="text-gray-600">Our name is synonymous with reliability. Every product undergoes rigorous testing to meet the highest performance standards.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 border-t-4 border-brand-accent group">
                        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                            <TeamIcon className="h-14 w-14 mx-auto text-brand-accent" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">Customer Partnership</h3>
                        <p className="text-gray-600">We succeed when our clients succeed. We work collaboratively to understand your unique challenges and find the perfect solution.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 border-t-4 border-brand-accent group">
                        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                            <InnovationIcon className="h-14 w-14 mx-auto text-brand-accent" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">Continuous Innovation</h3>
                        <p className="text-gray-600">We constantly explore new materials and technologies to bring you cutting-edge adhesive solutions that drive progress.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 border-t-4 border-brand-accent group">
                        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                            <IntegrityIcon className="h-14 w-14 mx-auto text-brand-accent" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">Integrity and Trust</h3>
                        <p className="text-gray-600">Our business is built on a foundation of honesty and transparency. We build lasting relationships based on trust.</p>
                    </div>
                </div>
            </AnimatedSection>
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-5 lg:px-8">
              <AnimatedSection className="text-center mb-16">
                  <h2 className="font-extrabold text-brand-blue-dark mb-4">Client Success Stories</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                      Hear from the businesses that rely on our adhesive solutions daily.
                  </p>
              </AnimatedSection>
              <AnimatedSection delay="delay-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {settings.testimonials.map((t, i) => (
                          <div key={i} className="h-full transform hover:-translate-y-2 transition-transform duration-300">
                              <TestimonialCard {...t} />
                          </div>
                      ))}
                  </div>
              </AnimatedSection>
          </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue-dark py-20 text-white">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection className="max-w-4xl mx-auto text-center">
                <h2 className="mb-6 text-white text-3xl font-bold">Partner with an Industry Leader</h2>
                <p className="text-blue-200 mb-10 text-xl font-light">
                    Ready to experience the Tape India difference? Contact our team today to discuss your project requirements, request a sample, or get a personalized quote.
                </p>
                <Link 
                    href="/request-quote" 
                    className="inline-block bg-brand-yellow text-brand-blue-dark font-bold py-4 px-10 rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                >
                    {aboutData?.CTA || 'Request a Bulk Quote'}
                </Link>
            </AnimatedSection>
        </div>
      </section>
    </>
  );
}

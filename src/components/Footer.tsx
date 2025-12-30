
'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { INDUSTRIES, NAV_LINKS } from '../constants';
import { useCategories } from '../context/CategoryContext';
import CombinedContactColumn from './CombinedContactColumn';

// Helper component for a single accordion item
function AccordionColumn({
  title,
  sectionId,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  sectionId: string;
  children?: ReactNode;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="border-t border-white/10 md:border-none">
      {/* Desktop Title */}
      <h3 className="hidden md:block text-xl font-semibold text-white mb-6 border-b-2 border-brand-yellow pb-2 inline-block">
        {title}
      </h3>
      {/* Mobile Accordion Button */}
      <button
        onClick={() => onToggle(sectionId)}
        className="w-full flex justify-between items-center py-4 text-lg font-semibold text-white md:hidden"
        aria-expanded={isOpen}
        aria-controls={`footer-section-${sectionId}`}
      >
        <span>{title}</span>
        <i className={`fas fa-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {/* Content */}
      <div
        id={`footer-section-${sectionId}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out md:!max-h-full md:!overflow-visible md:block ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="pb-4 pt-1 md:pb-0 md:pt-0">
          <ul className="space-y-4">
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
}


export default function Footer() {
  const { categories } = useCategories();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (sectionId: string) => {
    setOpenAccordion(prev => (prev === sectionId ? null : sectionId));
  };

  return (
    <footer id="contact" className="bg-brand-blue text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
          {/* Column 1: Combined Enquiry and Contact */}
          <div className="pb-6 md:pb-0 md:col-span-2 lg:col-span-1">
            <CombinedContactColumn />
          </div>

          {/* Column 2: Quick Links */}
          <AccordionColumn title="Quick Links" sectionId="quick-links" isOpen={openAccordion === 'quick-links'} onToggle={toggleAccordion}>
            {NAV_LINKS.filter(l => !l.isButton).map(link => (
              <li key={link.name}>
                <Link href={link.path} className="text-gray-300 hover:text-white transition-colors inline-block py-1">
                  {link.name}
                </Link>
              </li>
            ))}
          </AccordionColumn>

          {/* Column 3: Product Categories */}
          <AccordionColumn title="Categories" sectionId="categories" isOpen={openAccordion === 'categories'} onToggle={toggleAccordion}>
            {categories.slice(0, 7).map(category => (
              <li key={category.id}>
                <Link href={`/products?category=${category.id}`} className="text-gray-300 hover:text-white transition-colors inline-block py-1">
                  {category.name}
                </Link>
              </li>
            ))}
             <li>
              <Link href="/products" className="text-gray-300 font-semibold hover:text-white transition-colors inline-block py-1">
                View All...
              </Link>
            </li>
          </AccordionColumn>

          {/* Column 4: Industries */}
          <AccordionColumn title="Industries" sectionId="industries" isOpen={openAccordion === 'industries'} onToggle={toggleAccordion}>
            {INDUSTRIES.slice(0, 6).map(industry => (
              <li key={industry.id}>
                <Link href={`/products?industry=${industry.id}`} className="text-gray-300 hover:text-white transition-colors inline-block py-1">
                  {industry.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/industries" className="text-gray-300 font-semibold hover:text-white transition-colors inline-block py-1">
                View All...
              </Link>
            </li>
          </AccordionColumn>
          
        </div>
      </div>
      <div className="bg-brand-blue-dark py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400 md:flex justify-between items-center">
          <div className="mb-2 md:mb-0 space-x-4">
            <span>&copy; {new Date().getFullYear()} Sha Kundanmal Misrimal. All Rights Reserved.</span>
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
          <div className="space-x-4">
            <Link href="/admin/seo-content-hub" className="text-gray-500 hover:text-gray-300 transition-colors">SEO Hub</Link>
            <Link href="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

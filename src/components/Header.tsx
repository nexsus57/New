
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, INDUSTRIES } from '../constants';
import SearchBar from './SearchBar';
import { useCategories } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { ICONS_MAP, SparklesIcon } from './icons/CategoryIcons';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { categories } = useCategories();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
      // Close menus on route change
      setIsMenuOpen(false);
      setIsMegaMenuOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const navItems = NAV_LINKS.filter(l => !l.isButton);
  const ctaItem = NAV_LINKS.find(l => l.isButton);

  const getLinkClass = (path: string, isMegaMenu: boolean = false) => {
      const isActive = pathname === path || (path !== '/' && pathname?.startsWith(path));
      const activeState = isActive || isMegaMenu;
      return `text-base font-semibold transition-colors duration-200 flex items-center ${activeState ? 'text-brand-accent' : 'text-gray-700 hover:text-brand-accent'}`;
  };

  return (
    <>
      <header className={`bg-white sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0 z-50" aria-label="Tape India Home">
              <img src="https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png" alt="Tape India Logo" className="h-14 w-auto" width="56" height="56" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 h-full">
              {navItems.map((link) => {
                  if (link.name === 'Products') {
                      return (
                          <div 
                            key={link.name} 
                            className="relative h-full flex items-center"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                              <Link 
                                href={link.path}
                                className={getLinkClass(link.path, isMegaMenuOpen)}
                              >
                                {link.name}
                                <i className={`fas fa-chevron-down ml-1 text-xs transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}></i>
                              </Link>

                              {/* MEGA MENU */}
                              <div 
                                className={`absolute top-full left-1/2 transform -translate-x-1/2 w-[90vw] max-w-6xl bg-white shadow-2xl rounded-b-xl border-t-4 border-brand-accent transition-all duration-300 origin-top ${isMegaMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                                style={{ marginTop: '0px' }}
                              >
                                  <div className="flex p-8 gap-8">
                                      {/* Categories Column */}
                                      <div className="w-2/3 pr-8 border-r border-gray-100">
                                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">By Category</h3>
                                          <div className="grid grid-cols-2 gap-4">
                                              {categories.slice(0, 8).map(cat => {
                                                  const Icon = ICONS_MAP[cat.icon] || SparklesIcon;
                                                  return (
                                                      <Link key={cat.id} href={`/products?category=${cat.id}`} className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                                                          <div className="mt-1 mr-3 text-brand-accent group-hover:text-brand-blue-dark transition-colors">
                                                              <Icon className="w-5 h-5" />
                                                          </div>
                                                          <div>
                                                              <span className="block font-semibold text-gray-800 group-hover:text-brand-accent">{cat.name}</span>
                                                              <span className="text-xs text-gray-500 line-clamp-1">{cat.subtitle}</span>
                                                          </div>
                                                      </Link>
                                                  );
                                              })}
                                          </div>
                                          <Link href="/products" className="inline-block mt-4 text-sm font-bold text-brand-accent hover:underline">
                                              View All Categories &rarr;
                                          </Link>
                                      </div>

                                      {/* Industries Column */}
                                      <div className="w-1/3">
                                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">By Industry</h3>
                                          <ul className="space-y-2">
                                              {INDUSTRIES.slice(0, 6).map(ind => (
                                                  <li key={ind.id}>
                                                      <Link href={`/products?industry=${ind.id}`} className="block text-gray-700 hover:text-brand-accent hover:translate-x-1 transition-all text-sm font-medium py-1">
                                                          {ind.name}
                                                      </Link>
                                                  </li>
                                              ))}
                                          </ul>
                                          <Link href="/industries" className="inline-block mt-4 text-sm font-bold text-brand-accent hover:underline">
                                              View All Industries &rarr;
                                          </Link>
                                      </div>
                                  </div>
                                  <div className="bg-gray-50 px-8 py-4 rounded-b-xl flex justify-between items-center">
                                      <p className="text-sm text-gray-600">Need help finding a tape?</p>
                                      <Link href="/contact" className="text-sm font-bold text-brand-blue-dark hover:text-brand-accent">Contact our Experts &rarr;</Link>
                                  </div>
                              </div>
                          </div>
                      );
                  }
                  const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
                  return (
                    <Link 
                        key={link.name}
                        href={link.path}
                        className={`text-base font-semibold transition-colors duration-200 text-gray-700 hover:text-brand-accent ${isActive ? 'text-brand-accent' : ''}`}
                    >
                    {link.name}
                    </Link>
                  );
              })}
            </nav>
            
            <div className="hidden lg:flex items-center gap-4">
                <SearchBar />
                
                <Link href="/request-quote" className="relative p-2 text-gray-600 hover:text-brand-accent transition-colors" aria-label="View Quote Basket">
                    <i className="fas fa-file-invoice text-xl"></i>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-brand-amber text-brand-blue-dark text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {ctaItem && (
                  <Link
                    href={ctaItem.path}
                    className="bg-brand-yellow text-brand-blue-dark font-bold py-2.5 px-6 rounded-md text-base hover:bg-yellow-400 transition-colors transform hover:scale-105 whitespace-nowrap"
                  >
                    {ctaItem.name}
                  </Link>
                )}
            </div>

            <div className="lg:hidden flex items-center gap-4">
               <Link href="/request-quote" className="relative p-2 text-gray-600" aria-label="View Quote Basket">
                    <i className="fas fa-file-invoice text-xl"></i>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-brand-amber text-brand-blue-dark text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                            {cartCount}
                        </span>
                    )}
                </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-brand-accent focus:outline-none p-2"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Mobile Menu Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-40 shadow-xl transition-transform duration-300 ease-in-out lg:hidden transform ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
             <Link href="/" className="flex-shrink-0" aria-label="Tape India Home" onClick={() => setIsMenuOpen(false)}>
                <img src="https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png" alt="Tape India Logo" className="h-12 w-auto" loading="eager" />
             </Link>
             <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-brand-accent focus:outline-none"
                aria-label="Close menu"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
          </div>
          
          <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
            {navItems.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md text-lg font-semibold transition-colors text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-brand-accent' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
            {ctaItem && (
               <div className="px-2 pt-4">
                 <Link 
                    href={ctaItem.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-brand-yellow text-brand-blue-dark font-bold py-3 px-4 rounded-md text-lg hover:bg-yellow-400 transition-colors"
                  >
                   {ctaItem.name}
                  </Link>
               </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

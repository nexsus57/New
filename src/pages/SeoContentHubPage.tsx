import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../data/seoData';
import AnimatedSection from '../components/AnimatedSection';
import CanonicalTag from '../components/CanonicalTag';
import SeoAccordionCard from '../components/SeoAccordionCard';

export default function SeoContentHubPage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const pageTypes = useMemo(() => ['All', ...Array.from(new Set(seoData.map(p => p['Page Type'])))], []);

    const filteredData = useMemo(() => {
        return seoData.filter(page => {
            const matchesFilter = activeFilter === 'All' || page['Page Type'] === activeFilter;
            const matchesSearch = searchTerm === '' || page['Page Name'].toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [searchTerm, activeFilter]);

    const handleToggleAccordion = (url: string) => {
        setOpenAccordion(prev => prev === url ? null : url);
    };

    return (
        <>
            <Helmet>
                <title>SEO Content Hub | Tape India</title>
                <meta name="description" content="A centralized hub for viewing optimized B2B SEO content for Tape India's web pages." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <CanonicalTag />
            
            <header className="bg-brand-blue-dark text-white">
                <div className="container mx-auto px-5 lg:px-8 py-16 text-center">
                    <AnimatedSection>
                        <h1 className="font-extrabold text-white mb-4">SEO Content Hub</h1>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            An internal resource for reviewing the optimized B2B SEO content strategy for Tape India.
                        </p>
                    </AnimatedSection>
                </div>
            </header>

            <main className="bg-brand-gray py-12 md:py-16">
                <div className="container mx-auto px-5 lg:px-8">
                    <div className="sticky top-[79px] bg-brand-gray z-20 py-4 mb-8">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="search"
                                    placeholder="Search by Page Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-shadow"
                                />
                            </div>
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {pageTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveFilter(type)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 border ${
                                            activeFilter === type
                                                ? 'bg-brand-accent text-white border-brand-accent shadow'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredData.length > 0 ? (
                            filteredData.map((page) => (
                                <SeoAccordionCard
                                    key={page['Full URL']}
                                    pageData={page}
                                    isOpen={openAccordion === page['Full URL']}
                                    onToggle={handleToggleAccordion}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500 text-lg">No matching pages found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

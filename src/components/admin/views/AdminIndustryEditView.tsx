'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIndustry } from '../../../context/IndustryContext';
import { useProducts } from '../../../context/ProductContext';
import type { IndustryDetail } from '../../../types';

export default function AdminIndustryEditView() {
    const params = useParams();
    const industryId = params?.industryId as string;
    const router = useRouter();
    const { industries, updateIndustry } = useIndustry();
    const { products } = useProducts();

    const [industry, setIndustry] = useState<IndustryDetail | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (industryId) {
            const existingIndustry = industries.find(p => p.id === industryId);
            if (existingIndustry) {
                setIndustry(existingIndustry);
            } else {
                router.push('/admin/industries');
            }
        }
    }, [industryId, industries, router]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!industry) return;
        const { name, value } = e.target;
        
        if (name.startsWith('seo.')) {
            const seoKey = name.split('.')[1] as 'title' | 'description';
            setIndustry(prev => {
                if (!prev) return null;
                const currentSeo = prev.seo || { title: '', description: '' };
                return { 
                    ...prev, 
                    seo: { 
                        ...currentSeo, 
                        [seoKey]: value 
                    } 
                };
            });
        } else {
            setIndustry(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    const handleProductSelection = (productId: string) => {
        if (!industry) return;
        setIndustry(prev => {
            if (!prev) return null;
            const newProducts = prev.products.includes(productId)
                ? prev.products.filter(id => id !== productId)
                : [...prev.products, productId];
            return { ...prev, products: newProducts };
        });
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (industry) {
            updateIndustry(industry.id, industry);
            alert(`Industry "${industry.name}" updated successfully!`);
            router.push('/admin/industries');
        }
    };
    
    if (!industry) {
        return <div>Loading industry...</div>;
    }

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h1 className="text-3xl font-bold text-admin-text mb-6">Edit Industry: {industry.name}</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 bg-admin-card p-6 rounded-lg shadow-md space-y-6">
                        <section>
                            <label htmlFor="name" className="block text-sm font-medium text-admin-text-light mb-1">Industry Name</label>
                            <input type="text" id="name" name="name" value={industry.name} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" required />
                        </section>
                        <section>
                            <label htmlFor="image" className="block text-sm font-medium text-admin-text-light mb-1">Banner Image URL</label>
                            <input type="text" id="image" name="image" value={industry.image || ''} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" placeholder="https://example.com/banner.png" />
                        </section>
                        <section>
                            <label htmlFor="description" className="block text-sm font-medium text-admin-text-light mb-1">Description</label>
                            <textarea id="description" name="description" value={industry.description} onChange={handleInputChange} rows={5} className="w-full p-2 border border-admin-border rounded-md" required></textarea>
                        </section>
                        
                        {/* SEO Section */}
                         <div className="border-t border-admin-border pt-6">
                             <h3 className="text-lg font-semibold text-admin-text mb-4">SEO Metadata</h3>
                             <div className="space-y-4">
                                <div>
                                    <label htmlFor="seo.title" className="block text-sm font-medium text-admin-text-light mb-1">SEO Title</label>
                                    <input type="text" id="seo.title" name="seo.title" value={industry.seo?.title || ''} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md"/>
                                </div>
                                 <div>
                                    <label htmlFor="seo.description" className="block text-sm font-medium text-admin-text-light mb-1">SEO Description</label>
                                    <textarea id="seo.description" name="seo.description" value={industry.seo?.description || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-admin-border rounded-md"/>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Sidebar for product assignment */}
                    <div className="bg-admin-card p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">Assigned Products</h3>
                         <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="w-full p-2 mb-4 border border-admin-border rounded-md"
                        />
                        <div className="max-h-96 overflow-y-auto border border-admin-border rounded-md space-y-1 p-2 hide-scrollbar">
                           {filteredProducts.map(product => (
                                <label key={product.id} className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50">
                                    <input
                                        type="checkbox"
                                        checked={industry.products.includes(product.id)}
                                        onChange={() => handleProductSelection(product.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-admin-accent focus:ring-admin-accent"
                                    />
                                    <span className="ml-3 text-sm font-medium text-admin-text">{product.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end space-x-4 mt-6">
                    <Link href="/admin/industries" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">Cancel</Link>
                    <button type="submit" className="bg-admin-accent text-white font-bold py-2 px-4 rounded-md hover:bg-admin-accent-hover transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
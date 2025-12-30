'use client';

import { useState, type FormEvent, ChangeEvent } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useProducts } from '../../../context/ProductContext';
import { Settings } from '../../../types';

export default function AdminSettingsView() {
    const { settings, setSettings } = useSettings();
    const { products } = useProducts();
    const [formData, setFormData] = useState<Settings>(settings);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');
        
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [key]: value
            }
        }));
    };
    
    const handlePopularProductChange = (productId: string) => {
        setFormData(prev => {
            const newPopularIds = prev.popularProductIds.includes(productId)
                ? prev.popularProductIds.filter(id => id !== productId)
                : [...prev.popularProductIds, productId];
            return { ...prev, popularProductIds: newPopularIds };
        });
    };
    
    const handleTestimonialChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newTestimonials = [...formData.testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [name]: value };
        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    const addTestimonial = () => {
        setFormData(prev => ({
            ...prev,
            testimonials: [...prev.testimonials, { quote: '', author: '', company: '' }]
        }));
    };
    
    const removeTestimonial = (index: number) => {
        setFormData(prev => ({
            ...prev,
            testimonials: prev.testimonials.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSettings(formData);
        alert('Settings saved successfully!');
    };

    const handleFactoryReset = () => {
        if(window.confirm("⚠️ DANGER: This will delete ALL your changes (new products, edits, settings) and restore the website to its original state. Are you sure?")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-admin-text mb-6">Site Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* GTM Settings */}
                <section className="bg-admin-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Google Tag Manager</h2>
                     <div>
                        <label htmlFor="gtm.head" className="block text-sm font-medium text-admin-text-light mb-1">GTM Head Script</label>
                        <textarea
                            id="gtm.head"
                            name="gtm.head"
                            value={formData.gtm.head}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full p-2 border border-admin-border rounded-md font-mono text-xs focus:ring-admin-accent focus:border-admin-accent"
                            placeholder="<script>...</script>"
                        />
                    </div>
                     <div className="mt-4">
                        <label htmlFor="gtm.body" className="block text-sm font-medium text-admin-text-light mb-1">GTM Body Noscript</label>
                        <textarea
                            id="gtm.body"
                            name="gtm.body"
                            value={formData.gtm.body}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full p-2 border border-admin-border rounded-md font-mono text-xs focus:ring-admin-accent focus:border-admin-accent"
                             placeholder="<noscript>...</noscript>"
                        />
                    </div>
                </section>
                
                {/* Contact Settings */}
                <section className="bg-admin-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="contact.phone1" className="block text-sm font-medium text-admin-text-light mb-1">Phone Number 1</label>
                            <input type="text" id="contact.phone1" name="contact.phone1" value={formData.contact.phone1} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="contact.phone2" className="block text-sm font-medium text-admin-text-light mb-1">Phone Number 2</label>
                            <input type="text" id="contact.phone2" name="contact.phone2" value={formData.contact.phone2} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="contact.email" className="block text-sm font-medium text-admin-text-light mb-1">Email Address</label>
                            <input type="email" id="contact.email" name="contact.email" value={formData.contact.email} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="contact.address" className="block text-sm font-medium text-admin-text-light mb-1">Address</label>
                            <textarea id="contact.address" name="contact.address" value={formData.contact.address} onChange={handleInputChange} rows={4} className="w-full p-2 border border-admin-border rounded-md" />
                        </div>
                    </div>
                </section>
                
                 {/* Popular Products */}
                <section className="bg-admin-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Homepage Popular Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto hide-scrollbar p-1">
                        {products.map(p => (
                            <label key={p.id} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.popularProductIds.includes(p.id)}
                                    onChange={() => handlePopularProductChange(p.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-admin-accent focus:ring-admin-accent"
                                />
                                <span className="ml-3 text-sm font-medium text-admin-text">{p.name}</span>
                            </label>
                        ))}
                    </div>
                </section>
                
                {/* Testimonials */}
                <section className="bg-admin-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Testimonials</h2>
                    <div className="space-y-6">
                        {formData.testimonials.map((testimonial, index) => (
                            <div key={index} className="border border-admin-border p-4 rounded-md relative">
                                <button type="button" onClick={() => removeTestimonial(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold">&times;</button>
                                <div>
                                    <label className="block text-sm font-medium text-admin-text-light mb-1">Quote</label>
                                    <textarea name="quote" value={testimonial.quote} onChange={(e) => handleTestimonialChange(index, e)} rows={3} className="w-full p-2 border border-admin-border rounded-md"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                     <div>
                                        <label className="block text-sm font-medium text-admin-text-light mb-1">Author</label>
                                        <input type="text" name="author" value={testimonial.author} onChange={(e) => handleTestimonialChange(index, e)} className="w-full p-2 border border-admin-border rounded-md"/>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-admin-text-light mb-1">Company</label>
                                        <input type="text" name="company" value={testimonial.company} onChange={(e) => handleTestimonialChange(index, e)} className="w-full p-2 border border-admin-border rounded-md"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addTestimonial} className="mt-4 text-sm text-admin-accent hover:underline">+ Add Testimonial</button>
                </section>

                <div className="flex justify-between pt-8 border-t border-gray-200">
                    <button 
                        type="button" 
                        onClick={handleFactoryReset}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm px-4 py-2 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Reset All Data (Factory Reset)
                    </button>

                    <button type="submit" className="bg-admin-accent text-white font-bold py-3 px-6 rounded-md hover:bg-admin-accent-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
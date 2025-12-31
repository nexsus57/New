
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import AnimatedSection from '../../components/AnimatedSection';
import CanonicalTag from '../../components/CanonicalTag';

function RequestQuoteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { products } = useProducts();
    const { cart, removeFromCart, clearCart, addToCart } = useCart();
    
    // Handle adding product from URL query param (e.g. from Product Detail page)
    useEffect(() => {
        if (!searchParams) return;

        const productId = searchParams.get('product');
        if (productId) {
            addToCart(productId);
            
            // Construct new URL without the product param to clean it up
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('product');
            
            const currentPath = pathname || '/request-quote';
            router.replace(`${currentPath}?${newParams.toString()}`);
        }
    }, [searchParams, addToCart, router, pathname]);

    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/thank-you.html` : '';

    const cartProducts = useMemo(() => {
        return cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                ...item,
                details: product
            };
        }).filter(item => item.details);
    }, [cart, products]);

    // Generate a structured string of items for the hidden form field
    const orderSummary = useMemo(() => {
        if (cartProducts.length === 0) return 'No items selected';
        return cartProducts.map((item, index) => 
            `${index + 1}. ${item.details?.name} -- Qty: ${item.quantity}`
        ).join('\n');
    }, [cartProducts]);

    const formFields = [
        { name: 'name', label: 'Full Name', type: 'text', required: true, autoComplete: 'name' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, autoComplete: 'email' },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, autoComplete: 'tel' },
        { name: 'company', label: 'Company Name', type: 'text', required: false, autoComplete: 'organization' },
    ];

    return (
        <main className="bg-brand-gray py-16 md:py-24">
            <div className="container mx-auto px-5 lg:px-8">
                <AnimatedSection>
                    <div className="text-center mb-12">
                        <h1 className="font-extrabold">Request a Quote</h1>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Review your selected items and submit your details. We offer bulk pricing for industrial orders.
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Cart Summary */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <AnimatedSection className="delay-100">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-brand-blue-dark">Your Basket ({cart.length})</h2>
                                    {cart.length > 0 && (
                                        <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Clear All</button>
                                    )}
                                </div>
                                
                                {cartProducts.length > 0 ? (
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {cartProducts.map((item) => (
                                            <div key={item.productId} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                                <img 
                                                    src={item.details?.image} 
                                                    alt={item.details?.name} 
                                                    className="w-16 h-16 object-cover rounded bg-gray-50 flex-shrink-0"
                                                />
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{item.details?.name}</h3>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                            <Link href={`/product/${item.productId}`} className="text-xs text-brand-accent hover:underline">View</Link>
                                                            <button onClick={() => removeFromCart(item.productId)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">Your quote basket is empty.</p>
                                        <Link href="/products" className="text-brand-accent font-bold hover:underline">Browse Products</Link>
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                            <AnimatedSection className="delay-200">
                            <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg">
                                    <form action="https://formsubmit.co/tapeindiain@yahoo.com" method="POST">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {formFields.map(field => (
                                            <div key={field.name}>
                                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field.label}{field.required && <span className="text-red-500">*</span>}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    id={field.name}
                                                    name={field.name}
                                                    autoComplete={field.autoComplete}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                                                    required={field.required}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* FormSubmit settings */}
                                    <input type="hidden" name="_next" value={redirectUrl} />
                                    <input type="hidden" name="_honey" style={{ display: 'none' }} />
                                    <input type="hidden" name="_subject" value={`New Quote Request (${cart.length} items)`} />
                                    
                                    {/* HIDDEN: This sends the list of items to email without cluttering the message box */}
                                    <input type="hidden" name="ORDER_SUMMARY" value={orderSummary} />

                                    <div className="mt-6">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes / Specifications
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition font-sans text-sm"
                                            placeholder="Please specify any custom sizes, specific brands, or urgent delivery requirements."
                                        ></textarea>
                                    </div>

                                    <div className="mt-8 text-center">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto bg-brand-yellow text-brand-blue-dark font-bold py-3 px-12 rounded-lg text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
                                        >
                                            Submit Request
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function RequestQuotePage() {
    return (
        <>
            <CanonicalTag />
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <RequestQuoteContent />
            </Suspense>
        </>
    );
}

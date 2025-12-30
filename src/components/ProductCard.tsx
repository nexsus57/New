
'use client';

import Link from 'next/link';
import { type FC, type MouseEvent } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  categoryName: string;
}

const ProductCard: FC<ProductCardProps> = ({ product, categoryName }) => {
  const { addToCart } = useCart();

  const handleAddToQuote = (e: MouseEvent<HTMLButtonElement>) => {
    // Stop propagation so we don't trigger the card click (though z-index handles most of this)
    e.stopPropagation(); 
    addToCart(product.id);
    alert(`${product.name} added to quote basket!`);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden transform hover:-translate-y-1.5 product-card">
      
      {/* 1. Primary Overlay Link - Makes the whole card clickable */}
      <Link 
        href={`/product/${product.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${product.name}`}
      />

      {/* 2. Content Container - Pointer events pass through to link by default, but we control z-indexes */}
      <div className="flex flex-col h-full pointer-events-none"> 
        
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gray-50 p-4 aspect-[4/3] flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width="300"
            height="300"
            onError={(e) => (e.currentTarget.src = "https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png")}
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white/90 text-brand-blue-dark text-xs font-bold px-2 py-1 rounded shadow-sm backdrop-blur-sm">
                  View Details
              </span>
          </div>
        </div>

        {/* Text Section */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">
            {categoryName}
          </p>
          <h3 className="text-lg font-bold text-brand-blue-dark mb-3 leading-snug group-hover:text-brand-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
            {product.shortDescription}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3 relative z-10">
              <span className="text-sm font-bold text-brand-accent group-hover:text-brand-accent-dark flex items-center">
                  View Product
              </span>
              
              {/* 3. Action Button - Must have pointer-events-auto and higher Z-index */}
              <button
                  onClick={handleAddToQuote}
                  className="bg-brand-gray hover:bg-brand-yellow text-brand-blue-dark w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm pointer-events-auto cursor-pointer"
                  title="Add to Quote"
                  aria-label={`Add ${product.name} to quote`}
              >
                  <i className="fas fa-plus text-xs"></i>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

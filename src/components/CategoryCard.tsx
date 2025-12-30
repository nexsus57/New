
'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { Category } from '../types';
import { ICONS_MAP, SparklesIcon } from './icons/CategoryIcons';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  const Icon = ICONS_MAP[category.icon] || SparklesIcon;

  return (
    <Link 
      href={`/products?category=${category.id}`} 
      className="group block bg-white rounded-xl shadow-md hover:shadow-lg hover:shadow-brand-accent/20 transition-all duration-300 ease-in-out border border-gray-100/50 transform hover:-translate-y-1.5 h-full"
      aria-label={`Browse ${category.name}`}
    >
      <div className="flex flex-col items-center text-center justify-center p-8 h-full">
        <div className="bg-blue-100 p-4 rounded-full mb-5 transition-all duration-300 group-hover:bg-brand-accent group-hover:scale-110">
          <Icon className="h-10 w-10 text-brand-accent transition-colors duration-300 group-hover:text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-brand-blue-dark mb-2">
          {category.name}
        </h3>
        
        <p className="text-base text-gray-600 leading-relaxed">
          {category.subtitle}
        </p>

        <div className="mt-6 h-5">
            <span className="font-semibold text-brand-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              View Products
              <i className="fas fa-arrow-right ml-2 transition-transform duration-300 transform group-hover:translate-x-1"></i>
            </span>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;

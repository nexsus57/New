
'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { Industry } from '../types';
import { INDUSTRY_ICONS_MAP } from './icons/IndustryIcons';

interface IndustryCardProps {
  industry: Industry;
}

const IndustryCard: FC<IndustryCardProps> = ({ industry }) => {
  const Icon = INDUSTRY_ICONS_MAP[industry.icon] || (() => null);

  return (
    <Link 
      href={`/products?industry=${industry.id}`} 
      className={`group block h-full overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 bg-gradient-to-br ${industry.gradientClasses}`}
      aria-label={`View products for ${industry.name}`}
    >
      <div className="p-6 sm:p-8 flex flex-col items-center text-center text-white h-full justify-center min-h-[15rem] sm:min-h-[14rem]">
        <div className="mb-4">
            <Icon className="w-14 h-14 transition-transform duration-500 group-hover:scale-110" />
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            {industry.name}
          </h3>
          <p className="mt-1 text-white/80 font-medium text-sm sm:text-base">
            {industry.subtitle}
          </p>
        </div>

        <div className="mt-4 h-5 w-full flex items-center justify-center"> {/* Fixed height to prevent layout shifts */}
          <span className="font-semibold text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            View Products
            <i className="fas fa-arrow-right ml-2 transition-transform duration-300 transform group-hover:translate-x-1"></i>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default IndustryCard;

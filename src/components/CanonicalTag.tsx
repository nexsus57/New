
'use client';

import { Helmet } from 'react-helmet-async';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface CanonicalTagProps {
    /**
     * If true, query parameters will be stripped from the canonical URL.
     * This is useful for product pages where query params are often for tracking.
     */
    stripQuery?: boolean;
}

const CanonicalTagContent = ({ stripQuery = false }: CanonicalTagProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Guard: if pathname is null, we can't generate a canonical URL.
  if (!pathname) return null;

  let path = pathname;
  
  // Reconstruct path with query if needed
  if (!stripQuery) {
      // Fix: optional chaining for searchParams
      const queryString = searchParams?.toString();
      if (queryString) {
          path += `?${queryString}`;
      }
  }
  
  // Ensure homepage path is just "/"
  if (path === '//') {
      path = '/';
  }

  // Handle trailing slashes for paths other than the root
  if (path !== '/' && path.endsWith('/') && !path.includes('?')) {
    path = path.slice(0, -1);
  }

  const canonicalUrl = `https://tapeindia.shop${path}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

const CanonicalTag = (props: CanonicalTagProps) => {
  return (
    <Suspense fallback={null}>
      <CanonicalTagContent {...props} />
    </Suspense>
  );
};

export default CanonicalTag;

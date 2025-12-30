
'use client';

import { Helmet } from 'react-helmet-async';
import { usePathname, useSearchParams } from 'next/navigation';

interface CanonicalTagProps {
    /**
     * If true, query parameters will be stripped from the canonical URL.
     * This is useful for product pages where query params are often for tracking.
     */
    stripQuery?: boolean;
}

const CanonicalTag = ({ stripQuery = false }: CanonicalTagProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
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

export default CanonicalTag;

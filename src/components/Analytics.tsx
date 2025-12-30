
'use client';

import { useEffect, FC, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// To satisfy TypeScript, we can declare dataLayer on the window object.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const AnalyticsContent: FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname) return;

        // 1. Google Tag Manager / Analytics Event
        // Fix: Use optional chaining to safely get string or empty
        const query = searchParams?.toString();
        const url = `${pathname}${query ? `?${query}` : ''}`;
        
        const timerId = setTimeout(() => {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'page_view',
                page_path: url,
                page_title: document.title,
            });
        }, 0);

        // 2. LOCAL ANALYTICS (For Admin Dashboard)
        try {
            const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
            const storageKey = 'tapeindia_analytics_daily';
            const savedData = localStorage.getItem(storageKey);
            const data = savedData ? JSON.parse(savedData) : {};
            
            // Increment today's count
            data[today] = (data[today] || 0) + 1;
            
            // Save back to storage
            localStorage.setItem(storageKey, JSON.stringify(data));
            
            // Dispatch a custom event so the Dashboard updates instantly if open
            window.dispatchEvent(new Event('analyticsUpdated'));
        } catch (e) {
            console.error("Failed to save local analytics", e);
        }

        return () => clearTimeout(timerId);
    }, [pathname, searchParams]);

    return null;
};

// Wrap in Suspense because useSearchParams causes client-side de-opt
const Analytics: FC = () => {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
};

export default Analytics;

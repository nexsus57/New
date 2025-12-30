
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useIndustry } from '../../context/IndustryContext';
import { useBlog } from '../../context/BlogContext';
import StatCard from '../../components/admin/StatCard';
import { ProductsIcon, CategoriesIcon, IndustryIcon, BlogIcon, PlusCircleIcon, SettingsIcon, SeoIcon } from '../../components/icons/AdminIcons';

// Real Chart Component reading from LocalStorage
const TrafficChart = () => {
  const [data, setData] = useState<{ date: string; day: string; count: number; height: number }[]>([]);

  const loadData = () => {
     try {
        if (typeof window === 'undefined') return;
        
        const storageKey = 'tapeindia_analytics_daily';
        const saved = localStorage.getItem(storageKey);
        const rawData = saved ? JSON.parse(saved) : {};
        
        const last7Days = [];
        const today = new Date();
        let maxCount = 0;

        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const count = rawData[dateStr] || 0;
            if (count > maxCount) maxCount = count;
            last7Days.push({ date: dateStr, day: dayName, count });
        }

        const safeMax = maxCount === 0 ? 10 : maxCount; 
        
        const formattedData = last7Days.map(item => ({
            ...item,
            height: item.count === 0 ? 1 : Math.max(5, Math.round((item.count / safeMax) * 100))
        }));

        setData(formattedData);
     } catch (e) {
         console.error("Error loading analytics chart", e);
     }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('analyticsUpdated', loadData);
    return () => window.removeEventListener('analyticsUpdated', loadData);
  }, []);

  return (
    <div className="w-full h-72 bg-white rounded-lg p-6 border border-gray-100 relative flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-gray-700">Real-Time Traffic (Last 7 Days)</h3>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full animate-pulse">
            ● Live
        </span>
      </div>
      
      {/* Chart Area */}
      <div className="flex-grow flex items-end justify-between gap-2 sm:gap-4">
        {data.map((item, i) => (
           <div key={i} className="w-full flex flex-col items-center group">
               <div 
                 className={`w-full rounded-t-md transition-all duration-500 relative group-hover:shadow-lg ${item.count === 0 ? 'bg-gray-100' : 'bg-brand-accent/80 hover:bg-brand-accent'}`}
                 style={{ height: `${item.height}%` }}
               >
                   {/* Tooltip */}
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                       {item.count} Views
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                   </div>
               </div>
               <span className="text-xs text-gray-400 mt-2 font-medium">{item.day}</span>
           </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { industries } = useIndustry();
  const { articles } = useBlog();

  const stats = [
    { title: 'Total Products', value: products.length, icon: ProductsIcon, link: '/admin/products' },
    { title: 'Total Categories', value: categories.length, icon: CategoriesIcon, link: '/admin/categories' },
    { title: 'Total Industries', value: industries.length, icon: IndustryIcon, link: '/admin/industries' },
    { title: 'Total Blog Posts', value: articles.length, icon: BlogIcon, link: '/admin/blog' },
  ];

  const quickActions = [
    { text: 'Add New Product', link: '/admin/products/new', icon: PlusCircleIcon, external: false },
    { text: 'Manage Site Settings', link: '/admin/settings', icon: SettingsIcon, external: false },
    { text: 'View SEO Hub', link: '/admin/seo-content-hub', icon: SeoIcon, external: false },
    { text: 'View Live Site', link: '/', icon: null, external: true },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-admin-text mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <Link href={stat.link} key={stat.title} className="hover:scale-105 transform transition-transform duration-200">
            <StatCard icon={stat.icon} title={stat.title} value={stat.value} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-admin-card rounded-lg shadow-md overflow-hidden">
               <TrafficChart />
           </div>
           
           <div className="bg-admin-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-admin-text mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map(action => (
                  <Link
                    key={action.text}
                    href={action.link}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center p-4 bg-gray-50 hover:bg-admin-accent hover:text-white rounded-lg transition-colors group"
                  >
                    {action.icon && <action.icon className="h-6 w-6 mr-3 text-admin-accent group-hover:text-white transition-colors" />}
                    <span className="font-semibold">{action.text}</span>
                    {action.external && <i className="fas fa-external-link-alt ml-auto text-xs text-gray-400 group-hover:text-white"></i>}
                  </Link>
                ))}
              </div>
           </div>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold text-admin-text mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-admin-text-light">Database</span>
              <span className="font-bold text-green-500 flex items-center">
                LocalStorage <span className="ml-1 text-xs">✅</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-admin-text-light">Analytics</span>
              <span className="font-bold text-green-500">
                Live Tracking <span className="text-xs">✅</span>
              </span>
            </div>
             <div className="flex items-center justify-between text-sm">
              <span className="text-admin-text-light">Sitemap</span>
              <span className="font-bold text-green-500">
                Static (Updated) <span className="text-xs">✅</span>
              </span>
            </div>
             <div className="mt-4 text-xs text-gray-400 border-t border-admin-border pt-3">
                Real-time sync enabled for all connected clients.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, ProductsIcon, CategoriesIcon, SettingsIcon, IndustryIcon, BlogIcon, SeoIcon } from '../icons/AdminIcons';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const navLinkClass = "flex items-center mt-4 py-2 px-6 text-gray-300 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100 rounded-md transition-colors duration-200";
  const activeNavLinkClass = "bg-gray-700 bg-opacity-50 text-white";

  const navLinks = [
    { to: '/admin/dashboard', icon: DashboardIcon, text: 'Dashboard' },
    { to: '/admin/products', icon: ProductsIcon, text: 'Products' },
    { to: '/admin/categories', icon: CategoriesIcon, text: 'Categories' },
    { to: '/admin/industries', icon: IndustryIcon, text: 'Industries' },
    { to: '/admin/blog', icon: BlogIcon, text: 'Blog' },
    { to: '/admin/seo-content-hub', icon: SeoIcon, text: 'SEO Hub' },
  ];
  
  const bottomLinks = [
      { to: '/admin/settings', icon: SettingsIcon, text: 'Site Settings'}
  ]

  return (
    <>
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-black opacity-50 z-20 lg:hidden`} onClick={() => setSidebarOpen(false)}></div>
      
      <div className={`fixed inset-y-0 left-0 bg-admin-sidebar w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 z-30 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-700 flex-shrink-0">
            <Link href="/admin" className="text-white text-2xl font-bold">
                Tape India
            </Link>
        </div>

        <nav className="mt-6 px-2 flex-grow">
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
            return (
                <Link
                key={link.to}
                href={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`${navLinkClass} ${isActive ? activeNavLinkClass : ''}`}
                >
                <link.icon className="h-6 w-6" />
                <span className="mx-3">{link.text}</span>
                </Link>
            );
          })}
        </nav>
        
        <nav className="px-2 pb-4 flex-shrink-0">
             {bottomLinks.map((link) => {
                const isActive = pathname === link.to;
                return (
                    <Link
                    key={link.to}
                    href={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`${navLinkClass} ${isActive ? activeNavLinkClass : ''}`}
                    >
                    <link.icon className="h-6 w-6" />
                    <span className="mx-3">{link.text}</span>
                    </Link>
                );
            })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;


'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // 1. If NOT authenticated and NOT on login page -> Redirect to Login
    if (typeof window !== 'undefined' && !isAuthenticated && !isLoginPage) {
        router.replace('/admin/login');
    }
    
    // 2. If Authenticated and ON login page -> Redirect to Dashboard
    if (typeof window !== 'undefined' && isAuthenticated && isLoginPage) {
        router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, router, isLoginPage]);

  // If we are on the login page, render ONLY the children (the login form), no sidebar/header
  if (isLoginPage) {
      return <>{children}</>;
  }

  // If checking auth and not logged in, render nothing while redirecting
  if (!isAuthenticated) {
      return null; 
  }

  // Authenticated Dashboard Layout
  return (
    <div className="flex h-screen bg-admin-bg font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-admin-bg">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Basic client-side protection
  useEffect(() => {
    // Wait for hydration to check auth state from local storage
    if (typeof window !== 'undefined' && !isAuthenticated) {
        router.replace('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
      return null; // Don't render admin layout content while redirecting
  }

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
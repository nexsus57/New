
'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-admin-card border-b border-admin-border">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-admin-text-light focus:outline-none lg:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative flex items-center justify-center h-8 w-8 rounded-full bg-admin-accent text-white shadow focus:outline-none">
            <i className="fas fa-user"></i>
          </button>
          
          <div onClick={() => setDropdownOpen(false)} className={`fixed inset-0 h-full w-full z-10 ${dropdownOpen ? '' : 'hidden'}`}></div>

          <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20 ${dropdownOpen ? 'block' : 'hidden'}`}>
            <Link href="/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-admin-accent hover:text-white">View Site</Link>
            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-admin-accent hover:text-white">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

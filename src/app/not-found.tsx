'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center font-sans p-4">
       <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-6xl font-extrabold text-brand-accent">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 max-w-sm mx-auto">
            Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link
            href="/"
            className="mt-8 inline-block bg-brand-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-accent-dark transition-all duration-300 transform hover:scale-105"
        >
            Go Back to Home
        </Link>
       </div>
    </div>
  );
}
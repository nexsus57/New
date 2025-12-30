
'use client';

import Link from 'next/link';
import { ALL_BLOG_ARTICLES } from '@/data/seoData';
import { PlusCircleIcon } from '@/components/icons/AdminIcons';

export default function AdminBlogListView() {
  const articles = ALL_BLOG_ARTICLES;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-admin-text">Blog Posts</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-admin-accent text-white font-bold py-2 px-4 rounded-md hover:bg-admin-accent-hover transition-colors duration-300 flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add New Post
        </Link>
      </div>

      <div className="bg-admin-card shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="border-b-2 border-admin-border bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Author</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Published Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-admin-border hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm">
                    <p className="text-admin-text font-semibold whitespace-no-wrap">{article.title}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="text-admin-text-light whitespace-no-wrap">{article.category}</p>
                  </td>
                   <td className="px-5 py-4 text-sm">
                    <p className="text-admin-text-light whitespace-no-wrap">{article.author}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="text-admin-text-light whitespace-no-wrap">{new Date(article.datePublished).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Link href={`/admin/blog/edit/${article.id}`} className="text-admin-accent hover:text-admin-accent-hover font-semibold">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                        No articles found. <Link href="/admin/blog/new" className="text-admin-accent hover:underline">Add one now!</Link>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import AdminBlogEditView from '@/components/admin/views/AdminBlogEditView';
import { ALL_BLOG_ARTICLES } from '@/data/seoData';

// CRITICAL: Even admin pages need static params in export mode
export async function generateStaticParams() {
  return ALL_BLOG_ARTICLES.map((article) => ({
    slug: article.id,
  }));
}

export default function EditBlogPostPage() {
  return <AdminBlogEditView />;
}

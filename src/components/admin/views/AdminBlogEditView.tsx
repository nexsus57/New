'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBlog } from '../../../context/BlogContext';
import type { BlogArticle } from '../../../types';

type EditableArticle = Omit<BlogArticle, 'id'> & { id?: string };

const today = new Date().toISOString().split('T')[0];

const AdminBlogEditView = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const router = useRouter();
    const { articles, addArticle, updateArticle } = useBlog();
    const isEditing = Boolean(slug);

    const [article, setArticle] = useState<EditableArticle>({
        title: '',
        summary: '',
        content: '<h2>Start writing your article here...</h2><p>You can use <strong>HTML tags</strong> to format your content.</p>',
        category: 'Industry Guides',
        tags: [],
        readTime: 3,
        image: '',
        author: 'Tape India Experts',
        datePublished: today,
        dateModified: today,
        seo: {
            "Page Type": "Blog Post",
            "Page Name": "",
            "Full URL": "",
            "Title (≤60 chars)": "",
            "Meta Description (≤160 chars)": "",
            H1: "",
            "Primary Keywords": "",
            "Secondary Keywords": "",
            "FAQ Schema (JSON-LD)": "{}",
            "Product Schema (JSON-LD)": null,
            "LocalBusiness Schema (JSON-LD)": "{}",
            "Combined Schema (JSON-LD)": "{}",
            CTA: "Read More",
            "Schema Type": "Article",
            summary: "",
            faqs: [],
        },
    });

    useEffect(() => {
        if (isEditing && slug) {
            const existingArticle = articles.find(a => a.id === slug);
            if (existingArticle) {
                setArticle({
                    ...existingArticle,
                    tags: existingArticle.tags || []
                });
            } else {
                alert('Article not found!');
                router.push('/admin/blog');
            }
        }
    }, [slug, articles, isEditing, router]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setArticle(prev => ({ ...prev, tags }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        const finalArticleData = {
            ...article,
            readTime: Number(article.readTime) || 3, // Ensure readTime is a number
            dateModified: new Date().toISOString().split('T')[0],
        };

        if (isEditing && finalArticleData.id) {
            updateArticle(finalArticleData.id, finalArticleData as BlogArticle);
            alert('Article updated successfully!');
        } else {
            const { id, ...articleToAdd } = finalArticleData;
            addArticle(articleToAdd);
            alert('Article created successfully!');
        }
        
        router.push('/admin/blog');
    };

    const pageTitle = isEditing ? 'Edit Article' : 'Add New Article';
    const allCategories: string[] = Array.from(new Set(articles.map(a => a.category)));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-admin-text">{pageTitle}</h1>
              {isEditing && article.id && (
                <a href={`/blog/${article.id}`} target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                    View Post <i className="fas fa-external-link-alt ml-2"></i>
                </a>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Details */}
                <div className="bg-admin-card p-6 rounded-lg shadow-md space-y-6">
                    <section>
                        <label htmlFor="title" className="block text-sm font-medium text-admin-text-light mb-1">Title</label>
                        <input type="text" id="title" name="title" value={article.title} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md focus:ring-admin-accent focus:border-admin-accent" required/>
                    </section>
                    
                    <section>
                        <label htmlFor="image" className="block text-sm font-medium text-admin-text-light mb-1">Featured Image URL</label>
                        <input type="url" id="image" name="image" value={article.image} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md focus:ring-admin-accent focus:border-admin-accent" placeholder="https://example.com/image.webp" required/>
                    </section>

                    <section>
                        <label htmlFor="summary" className="block text-sm font-medium text-admin-text-light mb-1">Summary (Short Description for cards)</label>
                        <textarea id="summary" name="summary" value={article.summary} onChange={handleInputChange} rows={3} className="w-full p-2 border border-admin-border rounded-md focus:ring-admin-accent focus:border-admin-accent" required></textarea>
                    </section>
                </div>

                {/* Content Editor & Preview */}
                <div className="bg-admin-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Content Editor</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <section>
                            <label htmlFor="content" className="block text-sm font-medium text-admin-text-light mb-1">Full Content (HTML allowed)</label>
                            <textarea id="content" name="content" value={article.content} onChange={handleInputChange} rows={20} className="w-full h-full p-3 border border-admin-border rounded-md focus:ring-admin-accent focus:border-admin-accent font-mono text-sm resize-y" required></textarea>
                        </section>
                        <section>
                             <label className="block text-sm font-medium text-admin-text-light mb-1">Live Preview</label>
                             <div 
                                className="w-full h-full p-4 border border-admin-border rounded-md bg-white overflow-y-auto prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                             />
                        </section>
                    </div>
                </div>

                {/* Metadata */}
                <div className="bg-admin-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-admin-text mb-4">Metadata & Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <section>
                            <label htmlFor="category" className="block text-sm font-medium text-admin-text-light mb-1">Category</label>
                            <input type="text" id="category" name="category" list="category-suggestions" value={article.category} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" required />
                            <datalist id="category-suggestions">
                                {allCategories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </section>
                        <section>
                            <label htmlFor="tags" className="block text-sm font-medium text-admin-text-light mb-1">Tags (comma-separated)</label>
                            <input type="text" id="tags" name="tags" value={article.tags?.join(', ') || ''} onChange={handleTagsChange} className="w-full p-2 border border-admin-border rounded-md" />
                        </section>
                        <section>
                            <label htmlFor="author" className="block text-sm font-medium text-admin-text-light mb-1">Author</label>
                            <input type="text" id="author" name="author" value={article.author} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" required />
                        </section>
                        <section>
                            <label htmlFor="readTime" className="block text-sm font-medium text-admin-text-light mb-1">Read Time (minutes)</label>
                            <input type="number" id="readTime" name="readTime" value={article.readTime} onChange={handleInputChange} min="1" className="w-full p-2 border border-admin-border rounded-md" required />
                        </section>
                        <section>
                            <label htmlFor="datePublished" className="block text-sm font-medium text-admin-text-light mb-1">Published Date</label>
                            <input type="date" id="datePublished" name="datePublished" value={article.datePublished} onChange={handleInputChange} className="w-full p-2 border border-admin-border rounded-md" required />
                        </section>
                    </div>
                </div>

                 <div className="flex justify-end space-x-4 mt-6">
                    <Link href="/admin/blog" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">Cancel</Link>
                    <button type="submit" className="bg-admin-accent text-white font-bold py-2 px-4 rounded-md hover:bg-admin-accent-hover transition-colors">
                        {isEditing ? 'Save Changes' : 'Publish Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminBlogEditView;

'use client';

import Link from 'next/link';
import { useBlog } from '../../context/BlogContext';
import NotFound from '../../app/not-found';
import BlogCard from '../../components/BlogCard';
import CanonicalTag from '../../components/CanonicalTag';
import AnimatedSection from '../../components/AnimatedSection';
import { useSeoEnhancedContent } from '../../hooks/useSeoEnhancedContent';

interface BlogPostViewProps {
    slug: string;
}

export default function BlogPostView({ slug }: BlogPostViewProps) {
    const { articles } = useBlog();
    
    const article = articles.find(a => a.id === slug);
    const { enhancedContent } = useSeoEnhancedContent(article);

    if (!article) {
        return <NotFound />;
    }
    
    const relatedArticles = articles
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 3);
        
    const currentUrl = `https://tapeindia.shop/blog/${article.id}`;

    return (
        <>
            <CanonicalTag />
            
            <main className="bg-white">
                <header className="relative py-24 md:py-32">
                    <div className="absolute inset-0">
                         <img src={article.image} alt={`Featured image for ${article.title}`} className="w-full h-full object-cover" aria-hidden="true" />
                         <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                     <div className="relative container mx-auto px-5 lg:px-8 text-center text-white">
                        <p className="font-bold text-brand-yellow uppercase tracking-widest mb-4">{article.category}</p>
                        <h1 className="font-extrabold text-white !text-3xl md:!text-5xl max-w-4xl mx-auto">{article.title}</h1>
                        <div className="mt-8 flex items-center justify-center space-x-6 text-slate-300">
                            <span>By {article.author}</span>
                            <span className="h-1 w-1 bg-slate-400 rounded-full"></span>
                            <span>{new Date(article.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="h-1 w-1 bg-slate-400 rounded-full"></span>
                            <span>{article.readTime} min read</span>
                        </div>
                    </div>
                </header>
                
                <div className="py-16 md:py-24">
                    <div className="container mx-auto px-5 lg:px-8">
                        <article className="prose prose-lg lg:prose-xl max-w-4xl mx-auto">
                           <div 
                             dangerouslySetInnerHTML={{ __html: enhancedContent }} 
                             className="prose-headings:text-brand-blue-dark prose-a:text-brand-accent hover:prose-a:text-brand-accent-dark prose-strong:text-brand-blue-dark"
                           />
                        </article>
                        
                        <div className="max-w-4xl mx-auto mt-12 border-t pt-8">
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                {article.tags && article.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="font-bold mr-2">Tags:</span>
                                        {article.tags.map(tag => (
                                            <span key={tag} className="bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold">Share:</span>
                                    <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-slate-500 hover:text-[#1DA1F2] transition-colors text-2xl"><i className="fab fa-twitter"></i></a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-slate-500 hover:text-[#1877F2] transition-colors text-2xl"><i className="fab fa-facebook"></i></a>
                                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.summary)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="text-slate-500 hover:text-[#0A66C2] transition-colors text-2xl"><i className="fab fa-linkedin"></i></a>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>

                {relatedArticles.length > 0 && (
                    <section className="py-16 md:py-24 bg-brand-gray">
                        <div className="container mx-auto px-5 lg:px-8">
                             <AnimatedSection>
                                <h2 className="text-3xl font-bold mb-12 text-center text-brand-blue-dark">Related Articles</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {relatedArticles.map(related => (
                                        <BlogCard key={related.id} article={related} />
                                    ))}
                                </div>
                            </AnimatedSection>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}

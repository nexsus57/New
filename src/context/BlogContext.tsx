import { createContext, useContext, ReactNode, useCallback, FC, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { BlogArticle, SeoPageData } from '../types';
import { ALL_BLOG_ARTICLES as INITIAL_ARTICLES } from '../data/seoData';

interface BlogContextType {
  articles: BlogArticle[];
  addArticle: (articleData: Omit<BlogArticle, 'id' | 'seo'>) => void;
  updateArticle: (id: string, updatedArticleData: BlogArticle) => void;
  deleteArticle: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
    children: ReactNode;
}

export const BlogProvider: FC<BlogProviderProps> = ({ children }) => {
  const [storedArticles, setArticles] = useLocalStorage<BlogArticle[]>('tapeindia_blog_v7', INITIAL_ARTICLES);

  useEffect(() => {
    // Data validation: If blog data is corrupted, empty, or not an array, reset to initial data.
    if (!Array.isArray(storedArticles) || (storedArticles.length === 0 && INITIAL_ARTICLES.length > 0)) {
      setArticles(INITIAL_ARTICLES);
    }
  }, [storedArticles, setArticles]);

  const articles = useMemo(() => {
    const validArticles = Array.isArray(storedArticles) ? storedArticles : INITIAL_ARTICLES;
    // Always return a new sorted array to prevent state mutation and ensure consistent order.
    return [...validArticles].sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  }, [storedArticles]);

  const addArticle = useCallback((articleData: Omit<BlogArticle, 'id' | 'seo'>) => {
    const newSlug = `${articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

    const newSeo: SeoPageData = {
        "Page Type": "Blog Post",
        "Page Name": articleData.title,
        "Full URL": `https://tapeindia.shop/blog/${newSlug}`,
        "Title (≤60 chars)": `${articleData.title} | Tape India Blog`,
        "Meta Description (≤160 chars)": articleData.summary,
        "H1": articleData.title,
        "Primary Keywords": articleData.tags?.join(', ') || articleData.title,
        "Secondary Keywords": articleData.category,
        summary: articleData.summary,
        "CTA": "Read More",
        "Schema Type": "Article",
        faqs: [],
        "Product Schema (JSON-LD)": null,
        "LocalBusiness Schema (JSON-LD)": "{}",
        "FAQ Schema (JSON-LD)": "{}",
        "Combined Schema (JSON-LD)": "{}",
        id: newSlug,
    };
    
    const newArticle: BlogArticle = {
      ...articleData,
      id: newSlug,
      seo: newSeo,
    };

    setArticles(prev => (Array.isArray(prev) ? [newArticle, ...prev] : [newArticle]));
  }, [setArticles]);

  const updateArticle = useCallback((id: string, updatedArticleData: BlogArticle) => {
    setArticles(prev => (Array.isArray(prev) ? prev.map(a => (a.id === id ? updatedArticleData : a)) : [updatedArticleData]));
  }, [setArticles]);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => (Array.isArray(prev) ? prev.filter(a => a.id !== id) : []));
  }, [setArticles]);

  const value = { articles, addArticle, updateArticle, deleteArticle };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

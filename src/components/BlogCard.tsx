
'use client';

import Link from 'next/link';
import { type FC, useState, useEffect } from 'react';
import { BlogArticle } from '../types';

interface BlogCardProps {
  article: BlogArticle;
}

const BlogCard: FC<BlogCardProps> = ({ article }) => {
    const articleUrl = `/blog/${article.id}`;
    const [isImageBroken, setIsImageBroken] = useState(false);

    useEffect(() => {
        setIsImageBroken(false);
    }, [article.id]);

    const showPlaceholder = !article.image || isImageBroken;

    return (
        <article className="group bg-white rounded-xl shadow-md hover:shadow-lg hover:shadow-brand-accent/20 transition-all duration-300 flex flex-col overflow-hidden border border-slate-200/50 h-full transform hover:-translate-y-1.5">
            <Link href={articleUrl} className="block bg-slate-100">
                <div className="w-full h-48 flex items-center justify-center overflow-hidden p-2">
                    {showPlaceholder ? (
                         <div className="w-full h-full flex items-center justify-center text-center p-4">
                            <h3 className="font-bold text-slate-700 text-lg leading-tight group-hover:scale-105 transition-transform duration-300">
                                {article.title}
                            </h3>
                        </div>
                    ) : (
                        <img
                            src={article.image}
                            alt={`Featured image for article titled: ${article.title}`}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            loading="lazy"
                            onError={() => setIsImageBroken(true)}
                            width="400"
                            height="192"
                        />
                    )}
                </div>
            </Link>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-brand-accent uppercase tracking-wider">
                        {article.category}
                    </p>
                    <div className="text-sm text-slate-500 flex items-center">
                        <i className="far fa-clock mr-1.5"></i>
                        <span>{article.readTime} min read</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-brand-blue-dark mb-3 leading-snug">
                    <Link href={articleUrl} className="hover:text-brand-accent transition-colors duration-200">
                        {article.title}
                    </Link>
                </h2>
                <p className="text-slate-600 text-base leading-relaxed flex-grow line-clamp-3">
                    {article.summary}
                </p>
                <div className="mt-6">
                    <Link href={articleUrl} className="font-bold text-brand-accent hover:text-brand-accent-dark transition-colors group-hover:translate-x-1 inline-block duration-300">
                        Read More &rarr;
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;

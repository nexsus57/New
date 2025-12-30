import { useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { BlogArticle } from '../types';

/**
 * An expert SEO automation hook.
 * Takes a blog article and automatically generates:
 * 1. A valid Article Schema (JSON-LD).
 * 2. The article content with inline internal product links.
 */
export const useSeoEnhancedContent = (article: BlogArticle | undefined) => {
    const { products } = useProducts();

    // Memoize the content processing to run only when the article or products change.
    const enhancedContent = useMemo(() => {
        if (!article?.content) return '';

        let content = article.content;

        // Create a map of lowercase product names to their URL slugs.
        const productLinkMap = new Map(
            products.map(p => [p.name.toLowerCase(), `/product/${p.id}`])
        );

        // Sort product names by length, descending. This is crucial to match
        // longer names first (e.g., "Green Polyester Tape" before "Polyester Tape").
        // FIX: The sort callback parameters 'a' and 'b' are strings from productLinkMap.keys(). Access '.length' directly.
        const sortedProductNames = [...productLinkMap.keys()].sort((a, b) => b.length - a.length);

        // This regex splits the content by HTML tags, keeping the tags in the resulting array.
        // This allows us to apply replacements only to the text content, not the HTML itself.
        const parts = content.split(/(<[^>]+>)/g);

        const newParts = parts.map(part => {
            // If the part is an HTML tag, leave it unchanged.
            if (part.startsWith('<') && part.endsWith('>')) {
                return part;
            }

            // If it's a text node, perform replacements.
            let textPart = part;
            sortedProductNames.forEach(productName => {
                const productUrl = productLinkMap.get(productName);
                // Use a regex with word boundaries (\b) for case-insensitive replacement.
                const regex = new RegExp(`\\b(${productName})\\b`, 'gi');
                textPart = textPart.replace(regex, (match) => 
                    `<a href="${productUrl}" class="text-brand-accent hover:underline font-semibold">${match}</a>`
                );
            });
            return textPart;
        });

        return newParts.join('');

    }, [article, products]);

    // Memoize the schema generation.
    const articleSchema = useMemo(() => {
        if (!article) return null;

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': article.title,
            'description': article.summary.substring(0, 160), // Ensure it's ~160 chars
            'author': {
                '@type': 'Person',
                'name': 'Aagum'
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'Tape India',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://tapeindia.shop/logo.png'
                }
            },
            'datePublished': article.datePublished,
            'dateModified': article.dateModified,
            'image': [
                 article.image || 'https://tapeindia.shop/images/default-blog.webp'
            ],
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': `https://tapeindia.shop/blog/${article.id}`
            }
        };

        return JSON.stringify(schema, null, 2);
    }, [article]);

    return { enhancedContent, articleSchema };
};

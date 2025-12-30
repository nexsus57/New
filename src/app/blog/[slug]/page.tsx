
import { Metadata } from 'next';
import { ALL_BLOG_ARTICLES } from '../../../data/seoData';
import BlogPostView from '../../../components/views/BlogPostView';
import NotFound from '../../not-found';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = ALL_BLOG_ARTICLES.find(a => a.id === params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.seo?.["Title (≤60 chars)"] || article.title,
    description: article.seo?.["Meta Description (≤160 chars)"] || article.summary,
    openGraph: {
      title: article.seo?.["Title (≤60 chars)"] || article.title,
      description: article.seo?.["Meta Description (≤160 chars)"] || article.summary,
      url: `https://tapeindia.shop/blog/${article.id}`,
      images: article.image ? [{ url: article.image }] : [],
      type: 'article',
      publishedTime: article.datePublished,
      authors: [article.author],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const article = ALL_BLOG_ARTICLES.find(a => a.id === params.slug);

  if (!article) {
    return <NotFound />;
  }

  // Explicitly construct Article Schema JSON-LD for server rendering
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.summary,
    'author': {
        '@type': 'Person',
        'name': article.author
    },
    'publisher': {
        '@type': 'Organization',
        'name': 'Tape India',
        'logo': {
            '@type': 'ImageObject',
            'url': 'https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png'
        }
    },
    'datePublished': article.datePublished,
    'dateModified': article.dateModified,
    'image': [article.image],
    'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://tapeindia.shop/blog/${article.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostView slug={params.slug} />
    </>
  );
}

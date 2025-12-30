
import { Metadata } from 'next';
import { PRODUCTS } from '../../../constants';
import { seoData } from '../../../data/seoData';
import ProductDetailView from '../../../components/views/ProductDetailView';
import NotFound from '../../not-found';

type Props = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = params.productId;
  
  // 1. Try to find explicit SEO data first
  let seoItem = seoData.find(p => p.id === id && p["Page Type"] === "Product");
  
  // 2. If not found in SEO data, find in PRODUCTS constant
  const productContent = PRODUCTS.find(p => p.id === id);

  if (!seoItem && !productContent) {
    return {
      title: 'Product Not Found | Tape India',
      description: 'The requested product could not be found.',
    };
  }

  // 3. Fallback logic: If SEO data is missing, generate it from product content
  if (!seoItem && productContent) {
      seoItem = {
        "Page Type": "Product",
        "Page Name": productContent.name,
        "Full URL": `https://tapeindia.shop/product/${productContent.id}`,
        "Title (≤60 chars)": `${productContent.name} | Tape India`,
        "Meta Description (≤160 chars)": productContent.shortDescription || `Buy ${productContent.name} from Tape India.`,
        "H1": productContent.name,
        "Primary Keywords": productContent.name,
        "Secondary Keywords": productContent.category,
        summary: productContent.shortDescription,
        "CTA": "Request a Quote",
        "Schema Type": "Product",
        faqs: [],
        "Product Schema (JSON-LD)": "{}",
        "LocalBusiness Schema (JSON-LD)": "{}",
        "FAQ Schema (JSON-LD)": "{}",
        "Combined Schema (JSON-LD)": "{}"
      };
  }

  return {
    title: seoItem?.["Title (≤60 chars)"],
    description: seoItem?.["Meta Description (≤160 chars)"],
    openGraph: {
      title: seoItem?.["Title (≤60 chars)"],
      description: seoItem?.["Meta Description (≤160 chars)"],
      url: seoItem?.["Full URL"],
      images: productContent?.image ? [{ url: productContent.image }] : [],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const id = params.productId;
  const productContent = PRODUCTS.find(p => p.id === id);
  const seoItem = seoData.find(p => p.id === id && p["Page Type"] === "Product");

  if (!productContent && !seoItem) {
      return <NotFound />;
  }

  // Determine Schema source
  const jsonLdString = seoItem?.["Combined Schema (JSON-LD)"];
  let jsonLd = null;
  if (jsonLdString && jsonLdString !== "{}" && jsonLdString !== "null") {
      try {
          jsonLd = JSON.parse(jsonLdString);
      } catch (e) {
          // ignore parsing error
      }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailView productId={id} />
    </>
  );
}

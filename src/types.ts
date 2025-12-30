

// --- SEO TYPE DEFINITIONS (MOVED HERE TO BREAK CIRCULAR DEPENDENCY) ---
export interface FaqItem {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
        "@type": "Answer";
        text: string;
    };
}

export interface SeoPageData {
    "Page Type": "Homepage" | "Product" | "Category List" | "Industry List" | "Static" | "Blog Post" | "Blog List";
    "Page Name": string;
    "Full URL": string;
    "Title (≤60 chars)": string;
    "Meta Description (≤160 chars)": string;
    "H1": string;
    "H2_1"?: string;
    "H2_2"?: string;
    "H2_3"?: string;
    "H2_4"?: string;
    "H2_5"?: string;
    "H3"?: string;
    "H4"?: string;
    "H5"?: string;
    "Primary Keywords": string;
    "Secondary Keywords": string;
    summary: string;
    "CTA": string;
    "Schema Type": "WebSite" | "Product" | "CollectionPage" | "AboutPage" | "ContactPage" | "Article" | "FAQPage";
    faqs: FaqItem[];
    "Product Schema (JSON-LD)": string | null;
    "LocalBusiness Schema (JSON-LD)": string;
    "FAQ Schema (JSON-LD)": string;
    "Combined Schema (JSON-LD)": string;
    "id"?: string; // for products, categories, blogs
    "image"?: string;
}


export interface ColorOption {
    name: string;
    colors: string[]; // hex codes or 'transparent'
}

export interface Product {
  id: string;
  name:string;
  image: string; // Guaranteed primary image URL
  shortDescription: string;
  description?: string;
  features: string[];
  benefits?: string[];
  uses: string[];
  category: string;
  industries?: string[];
  // New optional fields for detailed view
  minOrderQty?: string;
  brand?: string;
  color?: string;
  images?: string[];
  highlights?: string[];
  availableColors?: ColorOption[];
  customizable?: boolean;
  seo: SeoPageData;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description?: string;
  image?: string;
  seo?: {
    title: string;
    description: string;
    h1?: string;
  };
}

export interface Industry {
  id:string;
  name: string;
  subtitle: string;
  icon: string;
  gradientClasses: string;
  highlight?: boolean;
}

export interface IndustryDetail {
  id: string;
  name: string;
  description: string;
  products: string[];
  image?: string;
  seo?: {
    title: string;
    description: string;
  };
}

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

export interface NavLinkData {
  name: string;
  path: string;
  isButton?: boolean;
}

export interface Settings {
    gtm: {
        head: string;
        body: string;
    };
    contact: {
        address: string;
        phone1: string;
        phone2: string;
        email: string;
    };
    socialLinks?: {
        facebook?: string;
        linkedin?: string;
        instagram?: string;
    };
    popularProductIds: string[];
    testimonials: Testimonial[];
}

export interface BlogArticle {
  id: string; // This will act as the slug
  title: string;
  summary: string;
  content: string; // The full HTML content of the blog post
  category: string;
  tags?: string[];
  readTime: number; // in minutes
  image: string;
  author: string;
  datePublished: string;
  dateModified: string;
  seo: SeoPageData;
}
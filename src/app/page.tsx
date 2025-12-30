
import { Metadata } from 'next';
import { seoData } from '../data/seoData';
import HomeView from '../components/views/HomeView';

export const metadata: Metadata = {
  title: seoData.find(p => p["Page Name"] === "Home")?.["Title (≤60 chars)"] || "Tape India - Industrial Adhesive Tapes Manufacturer",
  description: seoData.find(p => p["Page Name"] === "Home")?.["Meta Description (≤160 chars)"] || "Leading manufacturer and supplier of over 200 industrial adhesive tapes. Serving industries from automotive to packaging since 1957.",
  openGraph: {
    title: seoData.find(p => p["Page Name"] === "Home")?.["Title (≤60 chars)"] || "Tape India",
    description: seoData.find(p => p["Page Name"] === "Home")?.["Meta Description (≤160 chars)"] || "Leading Manufacturer of Industrial Tapes",
    type: 'website',
  },
};

export default function HomePage() {
  const homeData = seoData.find(p => p["Page Name"] === "Home");
  
  let jsonLd = null;
  if (homeData?.["Combined Schema (JSON-LD)"]) {
      try {
          jsonLd = JSON.parse(homeData["Combined Schema (JSON-LD)"]);
      } catch (e) {
          // ignore error
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
      <HomeView />
    </>
  );
}

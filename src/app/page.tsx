
import { Metadata } from 'next';
import { seoData } from '../data/seoData';
import HomeView from '../components/views/HomeView';

export const metadata: Metadata = {
  title: seoData.find(p => p["Page Name"] === "Home")?.["Title (≤60 chars)"] || "Tape India",
  description: seoData.find(p => p["Page Name"] === "Home")?.["Meta Description (≤160 chars)"] || "Leading Manufacturer of Industrial Tapes",
  openGraph: {
    title: seoData.find(p => p["Page Name"] === "Home")?.["Title (≤60 chars)"] || "Tape India",
    description: seoData.find(p => p["Page Name"] === "Home")?.["Meta Description (≤160 chars)"] || "Leading Manufacturer of Industrial Tapes",
    type: 'website',
  },
};

export default function HomePage() {
  const homeData = seoData.find(p => p["Page Name"] === "Home");
  const jsonLd = homeData?.["Combined Schema (JSON-LD)"] 
    ? JSON.parse(homeData["Combined Schema (JSON-LD)"]) 
    : null;

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

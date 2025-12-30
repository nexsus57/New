'use client';

import Link from 'next/link';
import AnimatedSection from '../../components/AnimatedSection';
import type { ReactNode } from 'react';
import CanonicalTag from '../../components/CanonicalTag';
import { useSettings } from '../../context/SettingsContext';
import { seoData } from '../../data/seoData';
import { useMemo } from 'react';

const Section = ({ title, children }: { title: string, children?: ReactNode }) => (
    <div className="mb-8">
        <h3 className="mb-3 text-2xl font-bold">{title}</h3>
        <div className="space-y-4 text-gray-700">{children}</div>
    </div>
);

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();
  const privacyData = useMemo(() => seoData.find(p => p["Page Name"] === "Privacy Policy"), []);
  
  return (
    <>
      <CanonicalTag />
      
      <main className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 lg:px-8">
            <AnimatedSection>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-center font-extrabold mb-4">{privacyData?.H1 || 'Privacy Policy'}</h1>
                    <p className="text-center text-gray-500 mb-12"><strong>Effective Date:</strong> August 4, 2025</p>

                    <Section title="Introduction">
                        <p>Welcome to TAPE INDIA. We respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
                    </Section>

                    <Section title="Information We Collect">
                        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Usage Data:</strong> Information automatically collected when you access the Site, such as your IP address, browser type, operating system, the pages you have viewed, and the dates/times of your visits. This is collected through tracking technologies.</li>
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, company name, email address, and telephone number, that you voluntarily give to us when you use a contact or quote request form on our site.</li>
                        </ul>
                    </Section>
                    
                    <Section title="How We Use Your Information">
                        <p>Having accurate information permits us to provide you with a smooth and efficient experience. Specifically, we may use information collected about you via the Site to:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Respond to your requests and inquiries for quotes.</li>
                            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                            <li>Deliver targeted advertising (advertisements) to you.</li>
                        </ul>
                    </Section>
                    
                    <Section title="Tracking Technologies and Cookies">
                        <p>We use cookies and other tracking technologies like Google Tag Manager to help customize the Site and improve your experience. A "cookie" is a small piece of data stored on your computer.</p>
                        <p>Specifically, we use these tools to implement services like <strong>Google Analytics</strong> to understand our website traffic and <strong>Google Ads</strong> for advertising and remarketing purposes. These services use cookies to help us analyze user activity and to serve relevant ads to you on other websites. By using our Site, you consent to the use of these cookies.</p>
                    </Section>
                    
                    <Section title="Changes to This Privacy Policy">
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                    </Section>
                    
                    <Section title="Contact Us">
                        <p>If you have questions or comments about this Privacy Policy, please contact us:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>By email: <a href={`mailto:${settings.contact.email}`} className="text-brand-accent hover:underline">{settings.contact.email}</a></li>
                            <li>By visiting our <Link href="/contact" className="text-brand-accent hover:underline">Contact Us page</Link>.</li>
                        </ul>
                    </Section>

                    <div className="mt-12 text-center">
                         <Link href="/" className="font-semibold text-brand-accent hover:text-brand-accent-dark transition-colors text-lg group">
                            &larr; Back to Home
                         </Link>
                    </div>

                </div>
            </AnimatedSection>
        </div>
      </main>
    </>
  );
}
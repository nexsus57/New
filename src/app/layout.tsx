
import React from 'react';
import { Inter, Poppins } from 'next/font/google';
import '../index.css'; 
import { Providers } from '../components/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavBar from '../components/BottomNavBar';
import WhatsAppButton from '../components/WhatsAppButton';
import Analytics from '../components/Analytics';
import OrganizationSchema from '../components/OrganizationSchema';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '600', '700', '800'], 
  subsets: ['latin'], 
  variable: '--font-poppins' 
});

export const metadata = {
  title: 'Tape India - Industrial Adhesive Tapes',
  description: 'Leading manufacturer and supplier of over 200 industrial adhesive tapes. Serving industries from automotive to packaging since 1957.',
  icons: {
    icon: 'https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className="font-sans bg-white text-slate-800 antialiased leading-relaxed flex flex-col min-h-screen">
        <Providers>
          <Analytics />
          <OrganizationSchema />
          <Header />
          <main className="flex-grow pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNavBar />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}

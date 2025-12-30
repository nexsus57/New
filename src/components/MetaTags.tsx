
'use client';

import { Helmet } from 'react-helmet-async';
import type { SeoPageData } from '../types';
import { FC } from 'react';

interface MetaTagsProps {
    pageData: Partial<SeoPageData>;
}

const MetaTags: FC<MetaTagsProps> = ({ pageData }) => {
    if (!pageData) return null;

    const title = pageData["Title (≤60 chars)"] || 'Tape India - Industrial Adhesive Tapes';
    const description = pageData["Meta Description (≤160 chars)"] || 'Leading manufacturer and supplier of over 200 industrial adhesive tapes.';
    const schemaString = pageData["Combined Schema (JSON-LD)"];
    
    // Safely parse schema if it exists, otherwise null
    let schemaJson = null;
    if (schemaString && schemaString !== "{}" && schemaString !== "null") {
        try {
            schemaJson = JSON.parse(schemaString);
        } catch (e) {
            console.warn('Invalid JSON-LD schema for page:', title);
        }
    }

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {schemaJson && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaJson)}
                </script>
            )}
        </Helmet>
    );
};

export default MetaTags;

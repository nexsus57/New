
'use client';

import { useSettings } from '../context/SettingsContext';

const OrganizationSchema = () => {
    const { settings } = useSettings();
    const { contact, socialLinks, testimonials } = settings;

    // Simple parsing of address string
    const addressParts = contact.address.split(',\n');
    const streetAddress = addressParts.length > 1 ? `${addressParts[0]}, ${addressParts[1]}` : contact.address;
    const locality = addressParts.length > 2 ? addressParts[2].split(' – ')[0] : 'Chennai';
    const postalCode = contact.address.match(/\d{6}/)?.[0] || '600079';

    const reviewSchema = testimonials.map(testimonial => ({
        "@type": "Review",
        "reviewBody": testimonial.quote,
        "author": {
            "@type": "Person",
            "name": testimonial.author
        },
        "itemReviewed": {
            "@type": "Organization",
            "name": "Tape India"
        }
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Tape India",
        "url": "https://tapeindia.shop",
        "logo": "https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": `+91-${contact.phone1.replace(/[^0-9]/g, '')}`,
            "contactType": "customer service",
            "email": contact.email
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": streetAddress,
          "addressLocality": locality,
          "postalCode": postalCode,
          "addressCountry": "IN"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Monday",
                "opens": "10:30",
                "closes": "19:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "10:15",
                "closes": "19:30"
            }
        ],
        "sameAs": [
            socialLinks?.facebook,
            socialLinks?.linkedin,
            socialLinks?.instagram,
        ].filter(Boolean),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "37"
        },
        "review": reviewSchema
    };
    
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default OrganizationSchema;

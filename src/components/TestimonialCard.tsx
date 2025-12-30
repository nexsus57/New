
import type { FC } from 'react';

interface TestimonialCardProps {
    quote: string;
    author: string;
    company: string;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ quote, author, company }) => {
    return (
        <figure className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center h-full border-t-4 border-brand-yellow">
            <i className="fas fa-quote-left text-3xl text-brand-yellow mb-4"></i>
            <blockquote className="text-gray-600 italic leading-relaxed flex-grow text-base">
                "{quote}"
            </blockquote>
            <figcaption className="mt-6">
                <p className="font-bold text-brand-blue-dark text-lg">{author}</p>
                <cite className="text-sm text-gray-500 not-italic">
                    <span>{company}</span>
                </cite>
            </figcaption>
        </figure>
    );
}

export default TestimonialCard;

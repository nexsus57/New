
import type { FC, ReactNode } from 'react';
// FIX: Import SeoPageData from its source definition in `types.ts` instead of `data/seoData.ts`
import type { SeoPageData } from '../types';

interface SeoAccordionCardProps {
    pageData: SeoPageData;
    isOpen: boolean;
    onToggle: (url: string) => void;
}

// FIX: Use ReactNode type from react import
const DetailRow: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
    <div className="py-3 px-4 grid grid-cols-4 gap-4 items-start odd:bg-gray-50">
        <dt className="text-sm font-semibold text-gray-600 col-span-1">{label}</dt>
        <dd className="text-sm text-gray-900 col-span-3">{children}</dd>
    </div>
);

const SeoAccordionCard: FC<SeoAccordionCardProps> = ({ pageData, isOpen, onToggle }) => {
    const {
        "Page Name": pageName,
        "Page Type": pageType,
        "Full URL": fullUrl,
        "Title (≤60 chars)": metaTitle,
        "Meta Description (≤160 chars)": metaDesc,
        "H1": h1, "H2_1": h2_1, "H2_2": h2_2, "H2_3": h2_3, "H2_4": h2_4, "H2_5": h2_5, "H3": h3, "H4": h4, "H5": h5,
        "Combined Schema (JSON-LD)": schema,
        summary,
        faqs
    } = pageData;

    let prettySchema = "Invalid Schema";
    if (schema) {
        try {
            prettySchema = JSON.stringify(JSON.parse(schema), null, 2);
        } catch (e) {
            prettySchema = "Error parsing schema JSON";
        }
    } else {
        prettySchema = "No Schema defined";
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200/80 overflow-hidden">
            <button
                onClick={() => onToggle(fullUrl)}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`content-${pageName}`}
            >
                <div>
                    <h3 className="text-lg font-bold text-brand-blue-dark">{pageName}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white bg-slate-500 px-2 py-0.5 rounded-full">{pageType}</span>
                </div>
                <i className={`fas fa-chevron-down text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div
                id={`content-${pageName}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[3000px]' : 'max-h-0'}`}
            >
                <div className="border-t border-gray-200">
                    <dl>
                        <DetailRow label="URL"><a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{fullUrl}</a></DetailRow>
                        <DetailRow label="Meta Title">{metaTitle}</DetailRow>
                        <DetailRow label="Meta Desc">{metaDesc}</DetailRow>
                        <DetailRow label="H1">{h1}</DetailRow>
                        <DetailRow label="H2s">
                            <ul className="list-disc list-inside">
                                {h2_1 && <li>{h2_1}</li>}
                                {h2_2 && <li>{h2_2}</li>}
                                {h2_3 && <li>{h2_3}</li>}
                                {h2_4 && <li>{h2_4}</li>}
                                {h2_5 && <li>{h2_5}</li>}
                            </ul>
                        </DetailRow>
                        <DetailRow label="H3">{h3}</DetailRow>
                        <DetailRow label="H4">{h4}</DetailRow>
                        <DetailRow label="H5">{h5}</DetailRow>
                        <DetailRow label="Summary">
                            <p className="italic text-base">
                               {summary}
                            </p>
                        </DetailRow>
                         <DetailRow label="FAQs">
                            <div className="space-y-2">
                                {faqs && faqs.length > 0 ? faqs.map((faq, index) => (
                                    <div key={index}>
                                        <p className="font-semibold">{faq.name}</p>
                                        <p className="pl-2">- {faq.acceptedAnswer.text}</p>
                                    </div>
                                )) : <p className="text-gray-400">No FAQs</p>}
                            </div>
                        </DetailRow>
                        <DetailRow label="JSON-LD Schema">
                            <pre className="bg-gray-800 text-white p-4 rounded-md text-xs overflow-x-auto">
                                <code>{prettySchema}</code>
                            </pre>
                        </DetailRow>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default SeoAccordionCard;

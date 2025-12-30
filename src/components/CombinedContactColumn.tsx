
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function CombinedContactColumn() {
    const { settings } = useSettings();
    const { contact } = settings;
    const [redirectUrl, setRedirectUrl] = useState('');

    useEffect(() => {
        // Formsubmit requires an absolute URL for the redirect.
        if (typeof window !== 'undefined') {
            setRedirectUrl(`${window.location.origin}/thank-you.html`);
        }
    }, []);

    return (
        <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b-2 border-brand-yellow pb-2 inline-block">
                Quick Enquiry
            </h4>
            
            <form action="https://formsubmit.co/tapeindiain@yahoo.com" method="POST" className="space-y-4 mb-8">
                {/* FormSubmit settings */}
                <input type="hidden" name="_next" value={redirectUrl} />
                <input type="hidden" name="_honey" style={{ display: 'none' }} />
                <input type="hidden" name="_subject" value="New Quick Enquiry from Website Footer!" />

                <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    required
                    className="w-full bg-brand-blue-dark p-3 text-white border border-white/20 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition"
                    aria-label="Name"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="E-mail*"
                    required
                    className="w-full bg-brand-blue-dark p-3 text-white border border-white/20 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition"
                    aria-label="E-mail"
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number*"
                    required
                    className="w-full bg-brand-blue-dark p-3 text-white border border-white/20 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition"
                    aria-label="Phone Number"
                />
                <button
                    type="submit"
                    className="w-full bg-brand-yellow text-brand-blue-dark font-bold py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors"
                >
                    Submit
                </button>
            </form>
            
            <div className="space-y-6 mt-8 border-t border-white/10 pt-8">
                <div className="flex items-start">
                    <i className="fas fa-map-marker-alt text-brand-yellow w-5 text-center mt-1 mr-4 flex-shrink-0"></i>
                    <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: contact.address.replace(/\n/g, '<br />') }}/>
                </div>
                <div className="flex items-start">
                    <i className="fas fa-phone-alt text-brand-yellow w-5 text-center mt-1 mr-4 flex-shrink-0"></i>
                    <div>
                        <a href={`tel:${contact.phone1}`} className="text-gray-300 hover:text-white transition-colors">{contact.phone1}</a>
                        {contact.phone2 && (
                            <>
                                , <a href={`tel:${contact.phone2}`} className="text-gray-300 hover:text-white transition-colors">{contact.phone2}</a>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-start">
                    <i className="fas fa-envelope text-brand-yellow w-5 text-center mt-1 mr-4 flex-shrink-0"></i>
                    <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-white transition-colors">{contact.email}</a>
                </div>
            </div>
        </div>
    );
}
import { FC, useEffect, useRef } from 'react';
import { useSearchModal } from '../context/SearchModalContext';
import SearchBar from './SearchBar';

const SearchModal: FC = () => {
    const { isSearchModalOpen, closeSearchModal } = useSearchModal();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSearchModalOpen) {
            document.body.style.overflow = 'hidden';
            // Focus the input inside SearchBar when modal opens
            setTimeout(() => {
                const input = modalRef.current?.querySelector('input[type="search"]');
                if (input instanceof HTMLInputElement) {
                    input.focus();
                }
            }, 100); // Timeout to allow transition
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSearchModalOpen]);

    if (!isSearchModalOpen) {
        return null;
    }

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center p-4 animate-fade-in"
            onClick={closeSearchModal}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-xl bg-transparent mt-8 animate-slide-down"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <SearchBar onResultClick={closeSearchModal} />
                    <button
                        onClick={closeSearchModal}
                        className="absolute -top-1 -right-1 text-white/70 bg-black/20 hover:text-white text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                        aria-label="Close search"
                        style={{ transform: 'translate(50%, -50%)' }}
                    >
                        &times;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;

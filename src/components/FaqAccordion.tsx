import { useState, type FC } from 'react';

interface FaqAccordionProps {
  question: string;
  answer: string;
}

// FIX: Use FC type from react import
const FaqAccordion: FC<FaqAccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h4 className="text-lg font-semibold text-gray-800">{question}</h4>
        <i className={`fas fa-chevron-down text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="pt-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;
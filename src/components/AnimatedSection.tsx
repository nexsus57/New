
'use client';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { type ReactNode, type FC, useState, useEffect } from 'react';

interface AnimatedSectionProps {
  children?: ReactNode;
  className?: string;
  delay?: string;
}

const AnimatedSection: FC<AnimatedSectionProps> = ({ children, className = '', delay = 'delay-0' }) => {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  
  // Always initialize as visible to prevent hydration locking content in hidden state
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  return (
    <div
      ref={ref}
      // Removed opacity-0 entirely from the 'false' state to ensure content is always clickable/visible
      // Animation is now just a subtle slide-up effect
      className={`${className} transition-all duration-700 ease-out ${delay} ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0' 
      }`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

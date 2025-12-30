
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

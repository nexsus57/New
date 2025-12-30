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
  
  // FIX: Initialize to TRUE. Content should be visible by default.
  // The animation will still run if we handle the classes correctly, 
  // but this prevents the "white screen" issue if JS lags.
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  return (
    <div
      ref={ref}
      // We remove 'opacity-0' from the base classes.
      // We only apply the translate effect.
      className={`${className} transition-all duration-700 ease-out ${delay} ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0' 
      }`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
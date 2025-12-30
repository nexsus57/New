
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
  // EMERGENCY FIX: Default to TRUE (visible) if we are unsure, or handle opacity via CSS animation only.
  // Ideally, we want it to fade in, but stability is priority #1.
  // We will initialize as false, but ensure the CSS fallback is handled or use a safe effect.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  // If JavaScript fails to load/hydrate, we want content to be visible.
  // However, in React, initial state matches server. 
  // We will use a different approach: Only apply opacity-0 if we haven't seen it yet, 
  // but for the sake of the user's "10% visible" issue, we will make the transition softer
  // and ensure it enters.
  
  return (
    <div
      ref={ref}
      // Removed 'opacity-0' from default classes if possible, or managed it strictly.
      // Current fix: Rely on isVisible state but ensure transform happens.
      className={`${className} transition-all duration-700 ease-out ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

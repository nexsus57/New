
import { useState, useEffect, useRef, RefObject } from 'react';

interface ObserverOptions extends IntersectionObserverInit {
    triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends Element>(
  options: ObserverOptions
): [RefObject<T>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce) {
          observer.unobserve(element);
        }
      } else {
        if (!options.triggerOnce) {
          setIsIntersecting(false);
        }
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, options.threshold, options.root, options.rootMargin, options.triggerOnce]);

  return [ref, isIntersecting];
};
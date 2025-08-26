import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationConfig {
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  onScrollProgress?: (progress: number) => void;
}

export function useScrollAnimation(config?: ScrollAnimationConfig) {
  const scrollProgress = useRef(0);
  const isScrolling = useRef(false);

  const handleScroll = useCallback(() => {
    if (!isScrolling.current) {
      isScrolling.current = true;
      config?.onScrollStart?.();
    }
  }, [config]);

  const handleScrollEnd = useCallback(() => {
    isScrolling.current = false;
    config?.onScrollEnd?.();
  }, [config]);

  useEffect(() => {
    // Throttled scroll handler for better performance
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;

    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }

      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Set new timeout for scroll end detection
      scrollTimeout = setTimeout(() => {
        handleScrollEnd();
      }, 150); // 150ms delay to detect scroll end
    };

    // Add scroll listener
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll, handleScrollEnd]);

  return {
    scrollProgress: scrollProgress.current,
    isScrolling: isScrolling.current,
  };
}



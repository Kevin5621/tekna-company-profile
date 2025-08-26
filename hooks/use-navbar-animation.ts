import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export function useNavbarAnimation(config?: {
  onFloatingStart?: () => void;
  onFloatingEnd?: () => void;
}) {
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const themeSwitcherRef = useRef<HTMLDivElement>(null);
  
  const isFloating = useRef(false);
  const animationTween = useRef<gsap.core.Tween | null>(null);

  const animateToFloating = useCallback(() => {
    if (!navbarRef.current || !logoRef.current || !navRef.current || !themeSwitcherRef.current) return;

    // Kill any existing animation
    if (animationTween.current) {
      animationTween.current.kill();
    }

    const navbar = navbarRef.current;
    
    const viewportWidth = window.innerWidth;
    const targetWidth = Math.min(1200, viewportWidth * 0.9);
    const targetX = (viewportWidth - targetWidth) / 2;

    // Use fromTo for explicit control over start and end states
    animationTween.current = gsap.fromTo(navbar, 
      {
        // FROM - current state (explicit)
        height: "5rem", // 80px
        width: "100%",
        x: 0,
        y: 0,
        paddingLeft: "0",
        paddingRight: "0",
        marginTop: "0",
        borderRadius: "0",
        scale: 1,
        immediateRender: false
      },
      {
        // TO - target floating state
        height: "4rem", // 64px - only 16px difference, not drastic
        width: `${targetWidth}px`, // Fixed pixel width instead of percentage
        x: targetX, // Explicit x positioning for centering
        y: "1rem", // Move down slightly
        paddingLeft: "2rem",
        paddingRight: "2rem",
        marginTop: "0", // Keep margin consistent
        borderRadius: "2rem",
        scale: 1, // No scaling to prevent shrinking effect
        
        // Visual styling
        backgroundColor: "rgba(var(--background), 0.9)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(var(--border), 0.1)",
        
        // Animation settings
        duration: 0.6, // Slightly longer for smoother feel
        ease: "power2.out", // Natural easing
        
      }
    );

    // Animate content elements with subtle effects (no scaling)
    gsap.to([logoRef.current, navRef.current, themeSwitcherRef.current], {
      y: 0, // Keep in place
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.05 // Slight stagger for polish
    });

  }, []);

  const animateToNormal = useCallback(() => {
    if (!navbarRef.current || !logoRef.current || !navRef.current || !themeSwitcherRef.current) return;

    // Kill any existing animation
    if (animationTween.current) {
      animationTween.current.kill();
    }

    const navbar = navbarRef.current;
    const currentRect = navbar.getBoundingClientRect();

    // Use fromTo for explicit control
    animationTween.current = gsap.fromTo(navbar,
      {
        // FROM - current floating state
        height: "4rem",
        width: `${currentRect.width}px`,
        x: currentRect.x - navbar.offsetLeft, // Current transform x
        y: "1rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        borderRadius: "2rem",
        scale: 1,
        immediateRender: false
      },
      {
        // TO - normal state
        height: "5rem", // Back to 80px
        width: "100%",
        x: 0, // Reset transform
        y: 0, // Reset transform
        paddingLeft: "0",
        paddingRight: "0",
        marginTop: "0",
        borderRadius: "0",
        scale: 1, // No scaling
        
        // Visual styling back to normal
        backgroundColor: "rgba(var(--background), 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "none",
        borderBottom: "1px solid rgba(var(--border), 0.2)",
        
        // Animation settings
        duration: 0.6,
        ease: "power2.out",
      }
    );

    // Animate content elements back
    gsap.to([logoRef.current, navRef.current, themeSwitcherRef.current], {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.05
    });

  }, []);

  useEffect(() => {
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shouldFloat = scrollY > 10;

          if (shouldFloat && !isFloating.current) {
            isFloating.current = true;
            animateToFloating();
            config?.onFloatingStart?.();
          } else if (!shouldFloat && isFloating.current) {
            isFloating.current = false;
            animateToNormal();
            config?.onFloatingEnd?.();
          }

          ticking = false;
        });
        ticking = true;
      }

      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Set new timeout for scroll end detection
      scrollTimeout = setTimeout(() => {
        // Optional: handle scroll end
      }, 100);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTween.current) {
        animationTween.current.kill();
      }
      clearTimeout(scrollTimeout);
    };
  }, [animateToFloating, animateToNormal, config]);

  return {
    navbarRef,
    logoRef,
    navRef,
    themeSwitcherRef,
    isFloating: isFloating.current,
  };
}
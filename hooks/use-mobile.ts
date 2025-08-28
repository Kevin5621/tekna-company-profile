import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isClient, setIsClient] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsClient(true);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mql.addEventListener("change", onChange);
    
    // Set the initial value
    setIsMobile(mql.matches);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return false during SSR to avoid hydration mismatch
  if (!isClient) {
    return false;
  }

  return isMobile;
}

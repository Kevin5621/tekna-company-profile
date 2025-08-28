"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function MainContent({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <main
      className={`flex-1 relative z-20 ${isMobile ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {children}
    </main>
  );
}

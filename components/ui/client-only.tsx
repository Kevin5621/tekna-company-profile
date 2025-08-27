"use client";

import React, { useEffect, useState, useMemo } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientOnly = React.memo(function ClientOnly({ 
  children, 
  fallback = null 
}: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize fallback untuk mencegah re-render yang tidak perlu
  const memoizedFallback = useMemo(() => fallback, [fallback]);

  if (!isClient) {
    return <>{memoizedFallback}</>;
  }

  return <>{children}</>;
});

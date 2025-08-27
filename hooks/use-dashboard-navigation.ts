import { useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseDashboardNavigationOptions {
  preloadRoutes?: boolean;
  cacheTimeout?: number;
}

export function useDashboardNavigation(options: UseDashboardNavigationOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { preloadRoutes = true, cacheTimeout = 30000 } = options;
  const preloadedRoutes = useRef<Set<string>>(new Set());
  const cache = useRef<Map<string, { data: any; timestamp: number }>>(new Map());

  // Preload dashboard routes untuk navigasi yang lebih cepat
  const preloadRoute = useCallback((href: string) => {
    if (preloadedRoutes.current.has(href)) return;
    
    try {
      // Preload route dengan router.prefetch
      router.prefetch(href);
      preloadedRoutes.current.add(href);
    } catch (error) {
      console.warn(`Failed to preload route: ${href}`, error);
    }
  }, [router, preloadRoutes]);

  // Navigate dengan optimasi
  const navigateTo = useCallback((href: string, options?: { replace?: boolean; scroll?: boolean }) => {
    // Clear cache untuk route yang akan diakses
    if (cache.current.has(href)) {
      cache.current.delete(href);
    }
    
    // Navigate
    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  }, [router]);

  // Cache data untuk route tertentu
  const cacheData = useCallback((key: string, data: any) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // Get cached data
  const getCachedData = useCallback((key: string) => {
    const cached = cache.current.get(key);
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > cacheTimeout) {
      cache.current.delete(key);
      return null;
    }
    
    return cached.data;
  }, [cacheTimeout]);

  // Clear expired cache entries
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of cache.current.entries()) {
      if (now - value.timestamp > cacheTimeout) {
        cache.current.delete(key);
      }
    }
  }, [cacheTimeout]);

  // Preload common dashboard routes
  useEffect(() => {
    if (!preloadRoutes) return;

    const commonRoutes = [
      '/dashboard/projects',
      '/dashboard/blog',
      '/dashboard/partners',
      '/dashboard/career',
      '/dashboard/settings',
      '/dashboard/admin'
    ];

    // Preload routes secara bertahap untuk menghindari blocking
    const preloadSequentially = async () => {
      for (const route of commonRoutes) {
        if (!preloadedRoutes.current.has(route)) {
          preloadRoute(route);
          // Delay kecil antara preload untuk menghindari blocking
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };

    preloadSequentially();
  }, [preloadRoutes, preloadRoute]);

  // Cleanup expired cache entries periodically
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [clearExpiredCache]);

  return {
    navigateTo,
    preloadRoute,
    cacheData,
    getCachedData,
    clearExpiredCache,
    currentPath: pathname,
    isPreloaded: (href: string) => preloadedRoutes.current.has(href)
  };
}

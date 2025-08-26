'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BlogBreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

export function BlogBreadcrumbs({ customItems, className = '' }: BlogBreadcrumbsProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    // Build breadcrumbs based on path segments
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      const isLast = i === segments.length - 1;
      
      let label = segments[i];
      
      // Customize labels for known paths
      switch (segments[i]) {
        case 'blog':
          label = 'Blog';
          break;
        case 'search':
          label = 'Search';
          break;
        case 'category':
          label = 'Categories';
          break;
        default:
          // Capitalize and replace hyphens with spaces
          label = segments[i]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      }
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1 text-sm ${className}`}>
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" aria-hidden="true" />
          )}
          
          {item.isActive ? (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
            >
              {index === 0 && (
                <Home className="h-4 w-4 inline mr-1" aria-hidden="true" />
              )}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

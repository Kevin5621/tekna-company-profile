'use client';

import { Clock, Eye, Calendar, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatReadingTime, getReadingTimeCategory } from '@/lib/utils/reading-time';

interface BlogMetaProps {
  publishedAt: string;
  authorName?: string | null;
  viewCount?: number | null;
  content?: string;
  category?: {
    name: string;
    color: string;
    slug: string;
  } | null;
  isFeatured?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  showReadingTime?: boolean;
  showViewCount?: boolean;
  showCategory?: boolean;
}

export function BlogMeta({
  publishedAt,
  authorName,
  viewCount,
  content,
  category,
  isFeatured = false,
  className = '',
  layout = 'horizontal',
  showReadingTime = true,
  showViewCount = true,
  showCategory = true,
}: BlogMetaProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const readingTime = content && showReadingTime ? formatReadingTime(content) : null;
  const readingCategory = content ? getReadingTimeCategory(content) : null;

  const getReadingTimeBadgeVariant = () => {
    switch (readingCategory) {
      case 'quick': return 'default';
      case 'medium': return 'secondary';
      case 'long': return 'outline';
      default: return 'secondary';
    }
  };

  const metaItems = [
    {
      icon: Calendar,
      label: 'Published date',
      value: formatDate(publishedAt),
      show: true,
    },
    {
      icon: User,
      label: 'Author',
      value: authorName || 'Admin',
      show: !!authorName,
    },
    {
      icon: Clock,
      label: 'Reading time',
      value: readingTime,
      show: showReadingTime && !!readingTime,
      badge: true,
      variant: getReadingTimeBadgeVariant(),
    },
    {
      icon: Eye,
      label: 'View count',
      value: viewCount ? `${viewCount.toLocaleString()} views` : null,
      show: showViewCount && !!viewCount,
    },
  ];

  const containerClass = layout === 'vertical' 
    ? 'flex flex-col space-y-3' 
    : 'flex flex-wrap items-center gap-4';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Category Badge */}
      {showCategory && category && (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Badge
            variant="secondary"
            className="text-white border-0 font-medium"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </Badge>
        </div>
      )}

      {/* Featured Badge */}
      {isFeatured && (
        <Badge variant="default" className="gap-1">
          <span className="text-xs">✨</span>
          Featured
        </Badge>
      )}

      {/* Meta Items */}
      {metaItems
        .filter(item => item.show && item.value)
        .map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.badge ? (
              <Badge 
                variant={item.variant as 'default' | 'secondary' | 'outline'} 
                className="text-xs px-2 py-1"
              >
                {item.value}
              </Badge>
            ) : (
              <span>{item.value}</span>
            )}
            <span className="sr-only">{item.label}:</span>
          </div>
        ))}
    </div>
  );
}

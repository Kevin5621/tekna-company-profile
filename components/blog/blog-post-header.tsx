'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/blog/share-button';
import { IconCalendar, IconEye } from '@tabler/icons-react';

interface BlogPostHeaderProps {
  post: {
    title: string;
    excerpt?: string | null;
    author_name?: string | null;
    published_at: string;
    view_count?: number | null;
    category?: {
      name: string;
      slug: string;
      color: string;
    } | null;
    slug: string;
  };
  className?: string;
}

export function BlogPostHeader({ post, className = '' }: BlogPostHeaderProps) {
  const getAuthorInitials = (authorName: string) => {
    if (!authorName) return 'AD';
    const names = authorName.trim().split(' ');
    const firstInitial = names[0] ? names[0].charAt(0) : '';
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${post.slug}`;
    }
    return `/blog/${post.slug}`;
  };

  return (
    <header className={`mb-12 lg:mb-16 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-6">
            <Badge 
              variant="secondary" 
              className="text-sm px-4 py-1.5 rounded-full"
              style={{ backgroundColor: post.category.color, color: 'white' }}
            >
              {post.category.name}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getAuthorInitials(post.author_name || '')}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-semibold text-foreground text-base">
                {post.author_name || 'Admin'}
              </p>
              <p className="text-muted-foreground">
                Content Writer
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconCalendar className="h-5 w-5" />
              <time dateTime={post.published_at} className="font-medium">
                {formatDate(post.published_at)}
              </time>
            </div>
            
            {post.view_count && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconEye className="h-5 w-5" />
                <span className="font-medium">{post.view_count.toLocaleString()} views</span>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* Share Button */}
          <ShareButton 
            url={getCurrentUrl()}
            title={post.title}
            description={post.excerpt || ''}
            variant="outline"
            size="sm"
            className="gap-2 px-4"
          />
        </div>
      </div>
    </header>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { CompactShareButton } from "@/components/blog/share-button";
import Link from "next/link";
import { IconCalendar, IconEye, IconStar } from "@tabler/icons-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  published_at: string;
  view_count: number | null;
  is_featured: boolean;
  category_id: string | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
}

interface BlogCardProps {
  post: BlogPost;
  showShareButton?: boolean;
  className?: string;
}

export function BlogCard({
  post,
  showShareButton = true,
  className = "",
}: BlogCardProps) {
  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${post.slug}`;
    }
    return `/blog/${post.slug}`;
  };

  return (
    <article className={`flex flex-col ${className}`}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2">
          <CardHeader className="p-0 relative">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <ImageWithFallback
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>

            {/* Enhanced Feature Badge with better contrast */}
            {post.is_featured && (
              <div className="absolute top-4 left-4">
                <Badge variant="default" className="gap-1 shadow-lg">
                  <IconStar className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">Featured article:</span>
                  <span>Featured</span>
                </Badge>
              </div>
            )}

            {/* Enhanced Category Badge with better styling */}
            {post.categories && (
              <div className="absolute top-4 right-4">
                <Badge
                  variant="secondary"
                  className="text-white border-0 shadow-lg font-medium"
                  style={{ backgroundColor: post.categories.color }}
                >
                  {post.categories.name}
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            <CardTitle className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
              {post.title}
            </CardTitle>
            {post.excerpt && (
              <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </CardContent>

          <CardFooter className="p-6 pt-0 mt-auto">
            <div className="w-full space-y-4">
              {/* Enhanced Author Info with better spacing */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-muted">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                    {getAuthorInitials(post.author_name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {post.author_name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Content Writer
                  </p>
                </div>
              </div>

              {/* Enhanced Meta Info with better visual hierarchy */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-1">
                  <IconCalendar className="h-3 w-3" aria-hidden="true" />
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                </div>

                <div className="flex items-center gap-3">
                  {post.view_count && (
                    <div className="flex items-center gap-1">
                      <IconEye className="h-3 w-3" aria-hidden="true" />
                      <span>{post.view_count.toLocaleString()} views</span>
                    </div>
                  )}

                  {/* Share Button - positioned inside the card */}
                  {showShareButton && (
                    <CompactShareButton url={getCurrentUrl()} />
                  )}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </article>
  );
}

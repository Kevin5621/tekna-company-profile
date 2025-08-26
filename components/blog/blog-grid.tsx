'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogFilters } from '@/components/blog/blog-filters';
import { Pagination, PaginationInfo } from '@/components/blog/pagination';
import { BlogCard } from '@/components/blog/blog-card';
import { IconSearch, IconX } from '@tabler/icons-react';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
}

interface BlogGridProps {
  readonly initialPosts: BlogPost[];
  readonly initialCategories: Category[];
  readonly initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  readonly initialFilters?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sortBy?: 'newest' | 'oldest' | 'popular';
  };
}

export function BlogGrid({ 
  initialPosts, 
  initialCategories, 
  initialPagination,
  initialFilters = {}
}: BlogGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<Category[]>(initialCategories);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    featured: initialFilters.featured || false,
    sortBy: initialFilters.sortBy || 'newest' as const,
  });
  const [lastFetchKey, setLastFetchKey] = useState('');

  const fetchPosts = useCallback(async (newFilters = filters, page = 1) => {
    // Create a unique key for this fetch request
    const fetchKey = `${newFilters.search}-${newFilters.category}-${newFilters.featured}-${newFilters.sortBy}-${page}`;
    
    // Prevent duplicate requests
    if (fetchKey === lastFetchKey && !isLoading) {
      return;
    }
    
    setLastFetchKey(fetchKey);
    setIsLoading(true);
    
    try {
      // Import the server action dynamically
      const { getPaginatedBlogPosts } = await import('@/app/actions/blog');
      
      const result = await getPaginatedBlogPosts({
        page,
        limit: pagination.limit,
        search: newFilters.search,
        category: newFilters.category,
        featured: newFilters.featured,
      });
      
      // Transform the data to match our BlogPost interface
      const transformedPosts = result.data.map(post => {
        // Fix: categories is already an object, not an array
        const categoryData = post.categories && typeof post.categories === 'object' && !Array.isArray(post.categories)
          ? post.categories as { id: string; name: string; slug: string; color: string }
          : null;
        
        return {
          ...post,
          categories: categoryData,
        };
      });
      
      setPosts(transformedPosts);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit, lastFetchKey, isLoading]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchPosts(newFilters, 1);
  }, [fetchPosts]);

  const handlePageChange = useCallback((page: number) => {
    fetchPosts(filters, page);
  }, [fetchPosts, filters]);

  // Initial fetch
  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchPosts(filters, 1);
    }
  }, [fetchPosts, filters, initialPosts.length]);

  return (
    <section className="space-y-8">
      {/* Enhanced Blog Filters */}
      <BlogFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        isLoading={isLoading}
      />

      {/* Enhanced Results Info */}
      <div className="flex items-center justify-between">
        <PaginationInfo
          currentPage={pagination.page}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
        
      </div>

      {/* Enhanced Loading State */}
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading blog articles">
          {Array.from({ length: pagination.limit }).map((_, index) => (
            <div key={`skeleton-${index}`} className="flex flex-col">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="p-6 pt-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-label="Blog articles">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                  <IconSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No articles found</h3>
                  <p className="text-muted-foreground">
                    {filters.search || filters.category || filters.featured
                      ? "Try adjusting your filters to see more results."
                      : "No articles have been published yet. Please check back later!"
                    }
                  </p>
                </div>
                {(filters.search || filters.category || filters.featured) && (
                  <Button
                    variant="outline"
                    onClick={() => handleFilterChange({
                      search: '',
                      category: '',
                      featured: false,
                      sortBy: 'newest',
                    })}
                    className="gap-2"
                  >
                    <IconX className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Enhanced Pagination with better accessibility */}
      {pagination.totalPages > 1 && (
        <nav className="flex justify-center mt-12" aria-label="Blog pagination">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </nav>
      )}
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { IconSearch, IconX, IconFilter } from '@tabler/icons-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

type SortOption = 'newest' | 'oldest' | 'popular';

interface BlogFiltersProps {
  readonly categories: Category[];
  onFilterChange: (filters: {
    search: string;
    category: string;
    featured: boolean;
    sortBy: SortOption;
  }) => void;
  readonly initialFilters?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sortBy?: SortOption;
  };
  readonly isLoading?: boolean;
}

export function BlogFilters({ 
  categories, 
  onFilterChange, 
  initialFilters = {},
  isLoading = false 
}: BlogFiltersProps) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || 'all',
    featured: initialFilters.featured || false,
    sortBy: initialFilters.sortBy || 'newest' as const,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Remove auto-trigger useEffect - search will only work with explicit actions

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
    // Auto-trigger for category changes
    onFilterChange({
      ...filters,
      category: value === 'all' ? '' : value
    });
  };

  const handleSortChange = (value: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
    // Auto-trigger for sort changes
    onFilterChange({
      ...filters,
      sortBy: value
    });
  };

  const handleFeaturedToggle = () => {
    const newFeatured = !filters.featured;
    setFilters(prev => ({ ...prev, featured: newFeatured }));
    // Auto-trigger for featured changes
    onFilterChange({
      ...filters,
      featured: newFeatured
    });
  };

  const handleSearch = () => {
    onFilterChange({
      ...filters,
      category: filters.category === 'all' ? '' : filters.category
    });
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      category: 'all',
      featured: false,
      sortBy: 'newest' as const,
    };
    setFilters(newFilters);
    onFilterChange({
      ...newFilters,
      category: ''
    });
  };

  const hasActiveFilters = filters.search || (filters.category !== 'all') || filters.featured;

  return (
    <Card className="mb-8 shadow-sm border-2 border-muted/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enhanced Search Bar with better accessibility */}
          <div className="relative">
            <label htmlFor="blog-search" className="sr-only">
              Search articles by title, content, or keywords
            </label>
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="blog-search"
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="pl-10 pr-24 h-11 text-base focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              aria-describedby={filters.search ? "search-description" : undefined}
            />
            
            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isLoading || !filters.search.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3 text-sm"
              size="sm"
            >
              Search
            </Button>
            
            {filters.search && (
              <>
                <button
                  onClick={() => {
                    handleSearchChange('');
                    // Auto-clear search results
                    onFilterChange({
                      ...filters,
                      search: '',
                      category: filters.category === 'all' ? '' : filters.category
                    });
                  }}
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  disabled={isLoading}
                  aria-label="Clear search"
                >
                  <IconX className="h-4 w-4" />
                </button>
                <div id="search-description" className="sr-only">
                  Search results are being filtered by: {filters.search}
                </div>
              </>
            )}
          </div>

          {/* Enhanced Filter Toggle with better visual feedback */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              disabled={isLoading}
              aria-expanded={isExpanded}
              aria-controls="advanced-filters"
            >
              <IconFilter className="h-4 w-4" aria-hidden="true" />
              {isExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground">
                  {[filters.category !== 'all' ? 1 : 0, filters.featured].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={isLoading}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>

          {/* Enhanced Advanced Filters with proper accessibility */}
          {isExpanded && (
            <div className="space-y-6 pt-6 border-t border-muted/50" id="advanced-filters">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Enhanced Category Filter */}
                <div className="space-y-2">
                  <label htmlFor="category-select" className="text-sm font-medium text-foreground">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={handleCategoryChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger 
                      id="category-select"
                      className="h-10 focus:ring-2 focus:ring-primary"
                      aria-label="Select article category"
                    >
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                              aria-hidden="true"
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Sort Filter */}
                <div className="space-y-2">
                  <label htmlFor="sort-select" className="text-sm font-medium text-foreground">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={handleSortChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger 
                      id="sort-select"
                      className="h-10 focus:ring-2 focus:ring-primary"
                      aria-label="Select sort order"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Featured Toggle */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Content Type</span>
                  <Button
                    variant={filters.featured ? "default" : "outline"}
                    size="sm"
                    onClick={handleFeaturedToggle}
                    disabled={isLoading}
                    className="w-full justify-start h-10 transition-all duration-200"
                    aria-pressed={filters.featured}
                    aria-label={filters.featured ? "Show all articles" : "Show only featured articles"}
                  >
                    {filters.featured ? '★ Featured Only' : '☆ All Articles'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-muted/50">
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  Category: {categories.find(c => c.id === filters.category)?.name}
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
                    disabled={isLoading}
                    aria-label="Remove category filter"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  Featured Articles
                  <button
                    onClick={handleFeaturedToggle}
                    className="hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
                    disabled={isLoading}
                    aria-label="Remove featured filter"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

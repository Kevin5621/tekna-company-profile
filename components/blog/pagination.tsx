'use client';

import { Button } from '@/components/ui/button';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconDots,
  IconChevronsLeft,
  IconChevronsRight 
} from '@tabler/icons-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false,
  showFirstLast = true,
  maxVisiblePages = 5 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    // Add ellipsis and first page if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis-start');
      }
    }
    
    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  return (
    <nav className="flex items-center justify-center space-x-1" role="navigation" aria-label="Pagination">
      {/* First Page Button */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(1)}
          disabled={isLoading}
          aria-label="Go to first page"
          className="hidden sm:flex"
        >
          <IconChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Go to previous page"
      >
        <IconChevronLeft className="h-4 w-4" />
        <span className="hidden sm:ml-2 sm:inline">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <div key={`ellipsis-${index}`} className="px-3 py-2">
                <IconDots className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageClick(pageNum)}
              disabled={isLoading}
              aria-label={isCurrentPage ? `Current page ${pageNum}` : `Go to page ${pageNum}`}
              aria-current={isCurrentPage ? "page" : undefined}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Go to next page"
      >
        <span className="hidden sm:mr-2 sm:inline">Next</span>
        <IconChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page Button */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(totalPages)}
          disabled={isLoading}
          aria-label="Go to last page"
          className="hidden sm:flex"
        >
          <IconChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

interface PaginationInfoProps {
  readonly currentPage: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
}

export function PaginationInfo({ 
  currentPage, 
  totalItems, 
  itemsPerPage 
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No articles found
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {totalItems.toLocaleString()} articles
    </p>
  );
}

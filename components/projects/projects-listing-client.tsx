"use client";

import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Grid,
  List,
  Filter,
  Calendar,
  Star,
} from "lucide-react";
import { ClientPublicService } from "@/lib/services/client-public.service";

interface Project {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
}

interface ProjectsListingClientProps {
  initialProjects: Project[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "featured";

// Extracted components for better performance and linting compliance
const ProjectCard = ({ project }: { readonly project: Project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="h-full"
  >
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {project.featured_image_url && (
        <div className="relative overflow-hidden aspect-video">
          <Image
            src={project.featured_image_url}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {project.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-primary-foreground">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/projects/${project.slug}`}>
              {project.name}
            </Link>
          </CardTitle>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(project.created_at).toLocaleDateString()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">
          {project.short_description || project.description}
        </CardDescription>

        <div className="flex gap-2">
          <Button asChild className="w-full">
            <Link href={`/projects/${project.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ProjectListItem = ({ project }: { readonly project: Project }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {project.featured_image_url && (
            <div className="flex-shrink-0 w-24 h-24 relative overflow-hidden rounded-lg">
              <Image
                src={project.featured_image_url}
                alt={project.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold hover:text-primary transition-colors">
                <Link href={`/projects/${project.slug}`}>
                  {project.name}
                </Link>
              </h3>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {project.is_featured && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.short_description || project.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(project.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/projects/${project.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingSkeleton = ({ viewMode }: { readonly viewMode: ViewMode }) => (
  <div className="space-y-6">
    {viewMode === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={`grid-skeleton-${i}`} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={`list-skeleton-${i}`}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

interface PaginationProps {
  pagination: {
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const ProjectPagination = ({ 
  pagination, 
  currentPage, 
  loading, 
  onPageChange 
}: Readonly<PaginationProps>) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrev || loading}
      >
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let page = i + 1;
          if (pagination.totalPages > 5) {
            if (currentPage > 3) {
              page = currentPage - 2 + i;
            }
            if (page > pagination.totalPages) {
              page = pagination.totalPages - 4 + i;
            }
          }
          
          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
            >
              {page}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNext || loading}
      >
        Next
      </Button>
    </div>
  );
};

export function ProjectsListingClient({
  initialProjects,
  initialPagination,
}: Readonly<ProjectsListingClientProps>) {
  const [projects, setProjects] = useState(initialProjects);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const handleSearch = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await ClientPublicService.getAllProjects({
        page: currentPage,
        limit: 12,
        search: searchQuery.trim() || undefined,
        featured: showFeaturedOnly || undefined,
      });

      setProjects(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error searching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, showFeaturedOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "" || currentPage !== 1 || showFeaturedOnly) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, showFeaturedOnly, handleSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleFeaturedFilterChange = (showFeatured: boolean) => {
    setShowFeaturedOnly(showFeatured);
    setCurrentPage(1);
  };

  // Sort projects client-side for immediate feedback
  const sortedProjects = useMemo(() => {
    const sorted = [...projects];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "featured":
      default:
        return sorted.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return a.sort_order - b.sort_order;
        });
    }
  }, [projects, sortBy]);

  // Helper functions for render logic
  const getResultsText = () => {
    if (loading) return "Loading...";
    const projectText = pagination.total !== 1 ? "projects" : "project";
    return `${pagination.total} ${projectText} found`;
  };

  const renderProjects = () => {
    if (loading) {
      return <LoadingSkeleton viewMode={viewMode} />;
    }

    if (sortedProjects.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No projects match "${searchQuery}". Try adjusting your search terms.`
              : "No projects are available at the moment."}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      );
    }

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sortedProjects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our portfolio of innovative projects, from web applications to IoT solutions.
          Each project represents our commitment to excellence and cutting-edge technology.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-muted/50 rounded-lg">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap lg:flex-nowrap">
          <Select value={showFeaturedOnly.toString()} onValueChange={(value) => handleFeaturedFilterChange(value === "true")}>
            <SelectTrigger className="w-full lg:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">All Projects</SelectItem>
              <SelectItem value="true">Featured Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: SortBy) => handleSortChange(value)}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Latest First</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className="rounded-l-none border-l"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {getResultsText()}
          {showFeaturedOnly && " (featured only)"}
        </div>
      </div>

      {/* Projects Display */}
      {renderProjects()}

      {/* Pagination */}
      {sortedProjects.length > 0 && (
        <ProjectPagination 
          pagination={pagination}
          currentPage={currentPage}
          loading={loading}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
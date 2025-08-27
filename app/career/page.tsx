"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BackgroundPaths } from "@/components/ui/shadcn-io/background-paths";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Grid3x3,
  List,
  X,
  Filter,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  CareerService,
  CareerPosition,
  CareerCategory,
  CareerLocation,
  CareerType,
  CareerLevel,
  CareerSearchParams,
} from "@/lib/services/career";
import { cn } from "@/lib/utils";

export default function CareerPage() {
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [featuredPositions, setFeaturedPositions] = useState<CareerPosition[]>(
    []
  );
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [locations, setLocations] = useState<CareerLocation[]>([]);
  const [types, setTypes] = useState<CareerType[]>([]);
  const [levels, setLevels] = useState<CareerLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<CareerSearchParams>({
    page: 1,
    limit: 12,
    sort: "newest",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const careerService = useMemo(() => new CareerService(), []);

  // Debug: Log current filter state
  useEffect(() => {
    console.log("Current search params state:", searchParams);
    console.log("Current filter state:", {
      search: searchParams.filters?.search,
      category: searchParams.filters?.category,
      location: searchParams.filters?.location,
      type: searchParams.filters?.type,
      level: searchParams.filters?.level,
      remote: searchParams.filters?.remote,
    });
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update search params when debounced query changes
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        search: debouncedSearchQuery || undefined,
      },
      page: 1,
    }));
  }, [debouncedSearchQuery]);

  const loadInitialData = useCallback(async () => {
    try {
      const [
        categoriesData,
        locationsData,
        typesData,
        levelsData,
        featuredData,
      ] = await Promise.all([
        careerService.getPublicCategories(),
        careerService.getPublicLocations(),
        careerService.getPublicTypes(),
        careerService.getPublicLevels(),
        careerService.getFeaturedPositions(6),
      ]);

      setCategories(categoriesData);
      setLocations(locationsData);
      setTypes(typesData);
      setLevels(levelsData);
      setFeaturedPositions(featuredData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, [careerService]);

  const loadPositions = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading positions with params:", searchParams);
      console.log("Active filters:", {
        search: searchParams.filters?.search,
        category: searchParams.filters?.category,
        location: searchParams.filters?.location,
        type: searchParams.filters?.type,
        level: searchParams.filters?.level,
        remote: searchParams.filters?.remote,
      });

      const result = await careerService.getPublicPositions(searchParams);
      console.log("Positions result:", result);
      console.log("Positions data:", result.positions);

      if (result.positions.length > 0) {
        console.log("First position sample:", {
          id: result.positions[0].id,
          title: result.positions[0].title,
          category: result.positions[0].category,
          location: result.positions[0].location,
          type: result.positions[0].type,
          level: result.positions[0].level,
        });
      }

      setPositions(result.positions);
      setTotalCount(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error loading positions:", error);
    } finally {
      setLoading(false);
    }
  }, [careerService, searchParams]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const handleSearch = (search: string) => {
    setSearchQuery(search);
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log(`Filter changed: ${key} = ${value}`);

    // Don't process 'all' values
    if (value === "all") {
      setSearchParams((prev) => {
        const newParams = {
          ...prev,
          filters: {
            ...prev.filters,
            [key]: undefined,
          },
          page: 1,
        };
        console.log("New search params (cleared filter):", newParams);
        return newParams;
      });
      return;
    }

    setSearchParams((prev) => {
      const newParams = {
        ...prev,
        filters: {
          ...prev.filters,
          [key]: value,
        },
        page: 1,
      };
      console.log("New search params (set filter):", newParams);
      return newParams;
    });
  };

  const handleSortChange = (sort: string) => {
    setSearchParams((prev) => ({
      ...prev,
      sort: sort as
        | "newest"
        | "oldest"
        | "title"
        | "salary_high"
        | "salary_low"
        | "deadline",
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchParams({
      page: 1,
      limit: 12,
      sort: "newest",
    });
  };

  const hasActiveFilters = () => {
    return !!(
      searchQuery ||
      searchParams.filters?.category ||
      searchParams.filters?.location ||
      searchParams.filters?.type ||
      searchParams.filters?.level ||
      searchParams.filters?.remote
    );
  };

  const formatSalary = (min?: number, max?: number, currency = "IDR") => {
    if (!min && !max) return "Salary not disclosed";

    const format = (amount: number) => {
      if (currency === "IDR") {
        return `Rp ${(amount / 1000000).toFixed(0)}M`;
      }
      return `$${(amount / 1000).toFixed(0)}K`;
    };

    if (min && max) {
      return `${format(min)} - ${format(max)}`;
    }
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Paths */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <BackgroundPaths />

        <div className="relative z-10 container mx-auto px-4 py-12 md:px-6 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent mb-6">
              Find Your Dream Career
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Join our innovative team and shape the future of technology.
              Discover opportunities that match your passion and skills.
            </p>

            {/* Enhanced Search Section */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-4xl mx-auto border border-primary-foreground/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5" />
                  <Input
                    placeholder="Search jobs, skills, or companies..."
                    className="pl-12 pr-4 h-12 bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30 focus:ring-2 focus:ring-primary-foreground/50"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8"
                  onClick={() =>
                    document
                      .getElementById("jobs-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <Building2 className="w-4 h-4" />
                <span>{totalCount} Open Positions</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span>{categories.length} Departments</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>{locations.length} Locations</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>{featuredPositions.length} Featured Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Positions */}
      <section id="jobs-section" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                All Positions
              </h2>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Browse all available opportunities and find your perfect match
              </p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="xl:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "w-full transition-all duration-200",
                  showFilters
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Filters Sidebar */}
            <div
              className={cn(
                "xl:w-80 space-y-6 transition-all duration-300",
                showFilters ? "block" : "hidden xl:block"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={searchParams.filters?.category || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "transition-all duration-200",
                        searchParams.filters?.category &&
                          searchParams.filters.category !== "all"
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location
                  </label>
                  <Select
                    value={searchParams.filters?.location || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("location", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "transition-all duration-200",
                        searchParams.filters?.location &&
                          searchParams.filters.location !== "all"
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.slug}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Job Type
                  </label>
                  <Select
                    value={searchParams.filters?.type || "all"}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "transition-all duration-200",
                        searchParams.filters?.type &&
                          searchParams.filters.type !== "all"
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.slug}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Experience Level
                  </label>
                  <Select
                    value={searchParams.filters?.level || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("level", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "transition-all duration-200",
                        searchParams.filters?.level &&
                          searchParams.filters.level !== "all"
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level.id} value={level.slug}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Remote Work
                  </label>
                  <Select
                    value={searchParams.filters?.remote ? "true" : "all"}
                    onValueChange={(value) =>
                      handleFilterChange("remote", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "transition-all duration-200",
                        searchParams.filters?.remote === true ||
                          String(searchParams.filters?.remote) === "true"
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <SelectValue placeholder="All Work Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Work Types</SelectItem>
                      <SelectItem value="true">Remote Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main role="main" aria-label="Career positions" className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <p className="text-muted-foreground">
                    {totalCount} positions found
                    {hasActiveFilters() && (
                      <span className="ml-2 text-sm text-primary">
                        (filtered results)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Select
                    value={searchParams.sort || "newest"}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-40 transition-all duration-200",
                        searchParams.sort && searchParams.sort !== "newest"
                          ? "border-primary ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">By Title</SelectItem>
                      <SelectItem value="salary_high">
                        Salary: High to Low
                      </SelectItem>
                      <SelectItem value="salary_low">
                        Salary: Low to High
                      </SelectItem>
                      <SelectItem value="deadline">By Deadline</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "rounded-none border-r transition-all duration-200",
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "rounded-none transition-all duration-200",
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Position Cards */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                    {hasActiveFilters()
                      ? "Applying filters..."
                      : "Loading positions..."}
                  </p>
                </div>
              ) : positions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        No positions found
                      </h3>
                      <p className="text-muted-foreground">
                        {hasActiveFilters()
                          ? "Try adjusting your filters to see more results."
                          : "No positions have been published yet. Please check back later!"}
                      </p>
                    </div>
                    {hasActiveFilters() && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      viewMode === "grid"
                        ? "grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                        : "space-y-4"
                    )}
                    aria-label="Career positions"
                  >
                    {positions.map((position) => (
                      <Card
                        key={position.id}
                        className="group hover:shadow-xl transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {position.featured && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary gap-1 px-2 py-1"
                                  >
                                    <Star className="h-3 w-3" />
                                    <span className="text-xs">Featured</span>
                                  </Badge>
                                )}
                                {position.urgent && (
                                  <Badge
                                    variant="destructive"
                                    className="gap-1 px-2 py-1"
                                  >
                                    <span className="text-xs">Urgent</span>
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="group-hover:text-primary transition-colors text-lg leading-tight line-clamp-2">
                                {position.title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                {position.category && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs text-primary-foreground border-0 px-2 py-1"
                                    style={{
                                      backgroundColor:
                                        position.category.color ||
                                        "hsl(var(--primary))",
                                    }}
                                  >
                                    {position.category.name}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="text-xs">
                                    {position.location?.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-xs">
                                    {position.type?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                            {position.summary}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm">
                              <span className="font-medium text-primary">
                                {formatSalary(
                                  position.salary_min,
                                  position.salary_max,
                                  position.salary_currency
                                )}
                              </span>
                              <span className="text-muted-foreground ml-1 text-xs">
                                /{position.salary_type}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              {position.level?.name}
                            </Badge>
                          </div>

                          {position.skills && position.skills.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {position.skills
                                  .slice(0, 3)
                                  .map((skillItem) => (
                                    <Badge
                                      key={skillItem.id}
                                      variant={
                                        skillItem.level === "required"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={cn(
                                        "text-xs px-2 py-1",
                                        skillItem.level === "required" &&
                                          "bg-primary hover:bg-primary/90"
                                      )}
                                    >
                                      {skillItem.skill?.name}
                                      {skillItem.level === "required" && " *"}
                                    </Badge>
                                  ))}
                                {position.skills.length > 3 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-2 py-1"
                                  >
                                    +{position.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {position.views_count} views •{" "}
                              {position.applications_count} applications
                            </div>
                            <Link href={`/career/${position.slug}`}>
                              <Button
                                variant="outline"
                                className="group-hover:bg-primary group-hover:text-primary-foreground text-xs px-3 py-2"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav
                      className="flex items-center justify-center mt-12"
                      aria-label="Pagination"
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          disabled={searchParams.page === 1}
                          onClick={() =>
                            handlePageChange((searchParams.page || 1) - 1)
                          }
                          aria-label="Previous page"
                        >
                          Previous
                        </Button>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={
                                  searchParams.page === page
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handlePageChange(page)}
                                aria-label={`Page ${page}`}
                                aria-current={
                                  searchParams.page === page
                                    ? "page"
                                    : undefined
                                }
                              >
                                {page}
                              </Button>
                            );
                          }
                        )}

                        <Button
                          variant="outline"
                          disabled={searchParams.page === totalPages}
                          onClick={() =>
                            handlePageChange((searchParams.page || 1) + 1)
                          }
                          aria-label="Next page"
                        >
                          Next
                        </Button>
                      </div>
                    </nav>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { IconSearch, IconX, IconCalendar } from "@tabler/icons-react";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  published_at: string;
  categories: {
    name: string;
    slug: string;
  } | null;
}

export function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Import the server action dynamically
      const { searchBlogPosts } = await import("@/app/actions/blog");

      const searchResults = await searchBlogPosts(searchQuery.trim());
      // Transform the results to match our interface
      const transformedResults = searchResults.map((result) => ({
        ...result,
        categories: result.categories?.[0] || null,
      }));
      setResults(transformedResults);
    } catch (error) {
      console.error("Error searching posts:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Debounced search
    const timer = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Enhanced Search Input with better accessibility */}
      <div className="relative mb-8">
        <label htmlFor="search-input" className="sr-only">
          Search articles by title, content, or keywords
        </label>
        <IconSearch
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="search-input"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            handleInputChange(value);
          }}
          className="pl-12 pr-12 h-14 text-lg focus:ring-2 focus:ring-primary shadow-lg border-2"
          aria-describedby={query ? "search-status" : "search-help"}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm p-1"
            aria-label="Clear search"
          >
            <IconX className="h-5 w-5" />
          </button>
        )}

        {!query && !hasSearched && (
          <div id="search-help" className="sr-only">
            Type to search through articles by title, content, or keywords
          </div>
        )}

        {query && (
          <div id="search-status" className="sr-only">
            {(() => {
              if (isLoading) return `Searching for ${query}...`;
              if (hasSearched)
                return `Found ${results.length} results for ${query}`;
              return `Type to search for ${query}`;
            })()}
          </div>
        )}
      </div>

      {/* Enhanced Loading State */}
      {isLoading && (
        <output className="text-center py-12 block" aria-live="polite">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground text-lg">Searching articles...</p>
        </output>
      )}

      {/* Enhanced Results Section */}
      {!isLoading && hasSearched && (
        <section className="space-y-6" aria-label="Search results">
          {results.length > 0 ? (
            <>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <p className="text-sm font-medium text-foreground">
                  Found {results.length} article
                  {results.length !== 1 ? "s" : ""} for{" "}
                  <em>&quot;{query}&quot;</em>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="gap-2"
                >
                  <IconX className="h-3 w-3" />
                  Clear
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {results.map((result) => (
                  <article key={result.id}>
                    <Link href={`/blog/${result.slug}`} className="block group">
                      <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Enhanced Thumbnail */}
                            {result.featured_image_url && (
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-muted">
                                  <Image
                                    src={result.featured_image_url}
                                    alt={result.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Enhanced Content */}
                            <div className="flex-1 min-w-0 space-y-3">
                              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                {result.title}
                              </h3>
                              {result.excerpt && (
                                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                  {result.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-muted/50">
                                <time
                                  dateTime={result.published_at}
                                  className="flex items-center gap-1"
                                >
                                  <IconCalendar
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  {formatDate(result.published_at)}
                                </time>
                                {result.categories && (
                                  <>
                                    <span>•</span>
                                    <span className="font-medium">
                                      {result.categories.name}
                                    </span>
                                  </>
                                )}
                                {result.author_name && (
                                  <>
                                    <span>•</span>
                                    <span>{result.author_name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <Card className="border-2 border-dashed border-muted">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                  <IconSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No articles found</h3>
                  <p className="text-muted-foreground">
                    We couldn&apos;t find any articles matching{" "}
                    <strong>&quot;{query}&quot;</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try different keywords or browse all articles.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button variant="outline" onClick={clearSearch}>
                    Clear Search
                  </Button>
                  <Button asChild>
                    <Link href="/blog">Browse All Articles</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Enhanced Quick Search Actions */}
      {!hasSearched && !query && (
        <section className="space-y-6">
          <Card className="shadow-sm border-2 border-muted/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <IconSearch className="h-5 w-5 text-primary" />
                Quick Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-center">
                Search through our articles by title, content, or keywords. Try
                one of these popular topics:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Technology",
                  "Web Development",
                  "AI & Machine Learning",
                  "Innovation",
                  "Design Systems",
                  "User Experience",
                ].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(term);
                      handleSearch(term);
                    }}
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    {term}
                  </Button>
                ))}
              </div>

              {/* Search Tips */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm text-foreground">
                  Search Tips:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use specific keywords for better results</li>
                  <li>• Try different variations of your search terms</li>
                  <li>• Search for author names or article categories</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

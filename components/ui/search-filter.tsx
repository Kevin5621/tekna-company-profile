"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
  }[];
  showClearButton?: boolean;
  className?: string;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search...",
  filters = [],
  showClearButton = true,
  className = "",
}: SearchFilterProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
    onSearchSubmit?.(localSearchQuery);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    onSearchChange("");
  };

  const hasActiveFilters = filters.some(
    (filter) => filter.value && filter.value !== "all"
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
        {showClearButton && localSearchQuery && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearSearch}
          >
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <IconFilter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {filters.filter((f) => f.value && f.value !== "all").length}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  filters.forEach((filter) => filter.onChange("all"));
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>

          {isExpanded && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <Label htmlFor={filter.key} className="text-sm font-medium">
                    {filter.label}
                  </Label>
                  <Select value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Select ${filter.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact search for mobile
export function CompactSearch({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  className = "",
}: Pick<
  SearchFilterProps,
  "searchQuery" | "onSearchChange" | "placeholder" | "className"
>) {
  return (
    <div className={`relative ${className}`}>
      <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}

// Advanced search with multiple fields
export function AdvancedSearch({
  searchFields,
  onSearch,
  className = "",
}: {
  searchFields: {
    key: string;
    label: string;
    placeholder?: string;
    type?: "text" | "select";
    options?: { value: string; label: string }[];
  }[];
  onSearch: (values: Record<string, string>) => void;
  className?: string;
}) {
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

  const handleSearch = () => {
    onSearch(searchValues);
  };

  const handleClear = () => {
    setSearchValues({});
    onSearch({});
  };

  const updateSearchValue = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {searchFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>

            {field.type === "select" && field.options ? (
              <Select
                value={searchValues[field.key] || ""}
                onValueChange={(value) => updateSearchValue(field.key, value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      field.placeholder || `Select ${field.label.toLowerCase()}`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.key}
                type="text"
                placeholder={
                  field.placeholder || `Search ${field.label.toLowerCase()}`
                }
                value={searchValues[field.key] || ""}
                onChange={(e) => updateSearchValue(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1 sm:flex-none">
          <IconSearch className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={handleClear}>
          <IconX className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
}

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton components untuk dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Breadcrumb skeleton */}
    <div className="flex items-center space-x-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
    </div>

    {/* Header skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats cards skeleton */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>

    {/* Chart skeleton */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>

    {/* Additional stats skeleton */}
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>

    {/* Recent posts and quick actions skeleton */}
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-6 py-6">
      <DashboardSkeleton />
    </div>
  );
}

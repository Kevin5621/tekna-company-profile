import React from "react";

export function SkeletonAnalytics() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="animate-pulse bg-card/50 rounded-lg p-4">
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="h-10 bg-muted rounded mb-2" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
      <div className="animate-pulse bg-card/50 rounded-lg p-4">
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="h-10 bg-muted rounded mb-2" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
      <div className="animate-pulse bg-card/50 rounded-lg p-4">
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="h-10 bg-muted rounded mb-2" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

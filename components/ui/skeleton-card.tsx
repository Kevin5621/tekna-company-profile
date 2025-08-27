import React from "react";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-card/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-6" />
      </div>
      <div className="h-10 bg-muted rounded mb-2" />
      <div className="h-3 bg-muted rounded w-5/6" />
    </div>
  );
}

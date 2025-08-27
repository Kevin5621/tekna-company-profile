import React from "react";

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center justify-between bg-card/50 rounded-lg p-4">
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="ml-4 w-20 h-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

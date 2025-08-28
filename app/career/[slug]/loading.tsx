import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CareerDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header Skeleton */}
      <div className="lg:hidden bg-card border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="h-6 flex-1 mx-4" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-8 md:px-6 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Button Skeleton - Desktop Only */}
            <div className="hidden lg:block mb-6">
              <Skeleton className="w-32 h-10 rounded" />
            </div>

            <div className="text-center lg:text-left">
              {/* Badges Skeleton */}
              <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start mb-4">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
              </div>

              {/* Title Skeleton */}
              <Skeleton className="h-12 w-full max-w-2xl mx-auto lg:mx-0 mb-4" />

              {/* Salary Skeleton */}
              <Skeleton className="h-8 w-48 mx-auto lg:mx-0 mb-6" />

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-8 lg:py-12 bg-gradient-to-b from-background to-muted/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Position Details Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-card rounded-lg border shadow-sm">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            ))}
          </div>

          {/* Job Description Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Requirements Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>

          {/* Benefits Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Skills Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Apply Button Skeleton */}
          <div className="text-center py-8">
            <Skeleton className="h-14 w-64 mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}

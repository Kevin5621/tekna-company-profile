export default function CareerLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-primary-foreground/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 bg-primary-foreground/20 rounded-lg mb-8 animate-pulse"></div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-10 bg-primary-foreground/20 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-primary-foreground/20 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg border p-6 animate-pulse"
              >
                <div className="h-4 w-16 bg-muted rounded mb-4"></div>
                <div className="h-6 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-5/6 bg-muted rounded"></div>
                </div>
                <div className="h-8 w-full bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

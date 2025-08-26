import { PublicLayout } from '@/components/layout/public-layout';
import { BlogSearch } from '@/components/blog/blog-search';

export default async function SearchPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Enhanced Header Section with better visual hierarchy */}
        <header className="text-center mb-16 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Search Articles
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Find articles on topics that interest you. Search by title, content, keywords, or browse by categories and authors.
            </p>
          </div>
          
          {/* Enhanced visual indicator */}
          <div className="flex items-center justify-center gap-2 pt-6 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Real-time search powered by intelligent indexing</span>
          </div>
        </header>

        {/* Enhanced Search Component with better context */}
        <main role="main" aria-label="Article search">
          <BlogSearch />
        </main>
      </div>
    </PublicLayout>
  );
}

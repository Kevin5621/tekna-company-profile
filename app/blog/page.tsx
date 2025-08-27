import { PublicService } from "@/lib/services/public.service";
import { PublicLayout } from "@/components/layout/public-layout";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Metadata } from "next";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    featured?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Blog | Tekna - Insights & Latest News",
  description:
    "Explore our articles about technology, design, and innovation that shape the future of digital experiences.",
  keywords:
    "blog, technology, innovation, web development, AI, machine learning, digital solutions",
  openGraph: {
    title: "Blog | Tekna",
    description:
      "Explore our articles about technology, design, and innovation that shape the future of digital experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Tekna",
    description:
      "Explore our articles about technology, design, and innovation that shape the future of digital experiences.",
  },
};

async function getBlogData(params: {
  page?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  try {
    const [postsResult, categories] = await Promise.all([
      PublicService.getPaginatedPublishedPosts(params),
      PublicService.getActiveCategories(),
    ]);

    return {
      posts: postsResult.data,
      pagination: postsResult.pagination,
      categories,
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      categories: [],
    };
  }
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const search = resolvedSearchParams.search || "";
  const category = resolvedSearchParams.category || "";
  const featured = resolvedSearchParams.featured === "true";

  const { posts, pagination, categories } = await getBlogData({
    page,
    search,
    category,
    featured,
  });

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Enhanced Header Section with better visual hierarchy */}
        <header className="text-center mb-16 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Insights & Latest News
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Explore our articles about technology, design, and innovation that
              shape the future of digital experiences.
            </p>
          </div>

          {/* Stats Display */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{pagination.total} Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>{categories.length} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Weekly Updates</span>
            </div>
          </div>
        </header>

        {/* Enhanced Blog Grid with better accessibility */}
        <main role="main" aria-label="Blog articles">
          <BlogGrid
            initialPosts={posts.map((post) => ({
              ...post,
              categories:
                post.categories &&
                typeof post.categories === "object" &&
                !Array.isArray(post.categories)
                  ? post.categories
                  : null,
            }))}
            initialCategories={categories}
            initialPagination={pagination}
            initialFilters={{
              search,
              category,
              featured,
              sortBy: "newest",
            }}
          />
        </main>
      </div>
    </PublicLayout>
  );
}

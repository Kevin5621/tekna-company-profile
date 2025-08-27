import { PublicService } from "@/lib/services/public.service";
import { PublicLayout } from "@/components/layout/public-layout";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

async function getCategoryData(
  categorySlug: string,
  params: {
    page?: number;
    search?: string;
  }
) {
  try {
    const [categories, postsResult] = await Promise.all([
      PublicService.getActiveCategories(),
      PublicService.getPaginatedPublishedPosts({
        ...params,
        category: categorySlug,
      }),
    ]);

    const category = categories.find((c) => c.slug === categorySlug);

    return {
      category,
      posts: postsResult.data,
      pagination: postsResult.pagination,
      allCategories: categories,
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return {
      category: null,
      posts: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      allCategories: [],
    };
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const { category } = await getCategoryData(resolvedParams.slug, {});

  if (!category) {
    return {
      title: "Category Not Found | Tekna",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.name} Articles | Tekna Blog`,
    description:
      category.description ||
      `Explore articles in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} Articles`,
      description:
        category.description ||
        `Explore articles in the ${category.name} category.`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const search = resolvedSearchParams.search || "";

  const { category, posts, pagination, allCategories } = await getCategoryData(
    resolvedParams.slug,
    {
      page,
      search,
    }
  );

  if (!category) {
    notFound();
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Enhanced Header Section with better visual hierarchy */}
        <header className="text-center mb-16 space-y-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="text-white border-0 text-xl px-6 py-3 shadow-lg"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {category.name} Articles
            </h1>

            {category.description && (
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          {/* Enhanced stats with better visual design */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              ></div>
              <span className="text-sm font-medium">
                {pagination.total} article{pagination.total !== 1 ? "s" : ""} in
                this category
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
              <div
                className="w-3 h-3 bg-primary rounded-full"
                aria-hidden="true"
              ></div>
              <span className="text-sm font-medium">
                {allCategories.length} total categories
              </span>
            </div>
          </div>
        </header>

        {/* Enhanced Blog Grid with better accessibility */}
        <main role="main" aria-label={`${category.name} articles`}>
          <BlogGrid
            initialPosts={posts.map((post) => ({
              ...post,
              categories: post.categories?.[0] || null,
            }))}
            initialCategories={allCategories}
            initialPagination={pagination}
            initialFilters={{
              search,
              category: category.slug,
              featured: false,
              sortBy: "newest",
            }}
          />
        </main>
      </div>
    </PublicLayout>
  );
}

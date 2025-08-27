"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { useRealtimeCategories } from "@/lib/hooks/use-realtime-simple";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface CategoriesPageClientProps {
  readonly initialCategories: Category[];
}

export function CategoriesPageClient({
  initialCategories,
}: CategoriesPageClientProps) {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: apiPayload, isLoading: loading } = useSWR("/api/categories", fetcher, {
    fallbackData: { success: true, data: initialCategories },
    revalidateOnFocus: true,
  });
  const categories = (apiPayload?.data as Category[]) || initialCategories;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useRealtimeCategories(() => {
    globalMutate("/api/categories");
  });

  const handleDelete = async (categoryId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      // optimistic
      const optimistic = categories.filter((c) => c.id !== categoryId);
      globalMutate("/api/categories", { success: true, data: optimistic }, false);

      await ClientDashboardService.deleteCategory(categoryId);
      await globalMutate("/api/categories");

      toast({
        title: "Category Deleted!",
        description: "Category has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
      await globalMutate("/api/categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (categoryId: string) => {
    router.push(`/dashboard/categories/edit/${categoryId}`);
  };

  const handleAddNew = () => {
    router.push("/dashboard/categories/new");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const actions = (
    <Button onClick={handleAddNew}>
      <IconPlus className="h-4 w-4 mr-2" />
      Add Category
    </Button>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[
        { label: "Categories", href: "/dashboard/categories" },
        { label: "Category List", isCurrentPage: true },
      ]}
      title="Categories"
      description="Manage categories for blog articles"
      actions={actions}
    >
      {/* Categories Grid */}
      {loading ? (
        <SkeletonList rows={6} />
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">
              No categories created yet
            </p>
            <Button onClick={handleAddNew}>
              <IconPlus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="flex flex-col">
              <CardHeader className="flex-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  {category.color && (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>Slug: /{category.slug}</span>
                    <span>•</span>
                    <span>Order: {category.sort_order}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant={category.is_active ? "default" : "secondary"}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(category.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category.id)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconEdit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconTrash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPageTemplate>
  );
}

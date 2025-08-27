"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/category-form";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import Link from "next/link";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [initialData, setInitialData] = useState<{
    name: string;
    slug: string;
    description: string;
    color: string;
    is_active: boolean;
    sort_order: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const category = await ClientDashboardService.getCategoryById(
          categoryId
        );
        setInitialData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          color: category.color || "#3B82F6",
          is_active: category.is_active ?? true,
          sort_order: category.sort_order || 0,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat data kategori"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Memuat data kategori...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Link
              href="/dashboard/categories"
              className="text-primary hover:underline"
            >
              ← Kembali ke Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Kategori", href: "/dashboard/categories" },
          {
            label: "Edit Kategori",
            href: `/dashboard/categories/edit/${categoryId}`,
          },
          { label: "Form Edit", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton
          href="/dashboard/categories"
          label="Kembali ke Categories"
        />
      </div>

      {initialData && (
        <CategoryForm categoryId={categoryId} initialData={initialData} />
      )}
    </div>
  );
}

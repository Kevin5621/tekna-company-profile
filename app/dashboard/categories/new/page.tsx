import { CategoryForm } from "@/components/category-form";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Categories", href: "/dashboard/categories" },
          { label: "Add New Category", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton
          href="/dashboard/categories"
          label="Back to Categories"
        />
      </div>

      <CategoryForm />
    </div>
  );
}

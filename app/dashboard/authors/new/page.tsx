import { AuthorForm } from "@/components/author-form";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

export default function NewAuthorPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Authors", href: "/dashboard/authors" },
          { label: "Add New Author", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/authors" label="Back to Authors" />
      </div>

      <AuthorForm />
    </div>
  );
}

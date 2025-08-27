import { PostForm } from "@/components/post-form";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Blog", href: "/dashboard/blog" },
          { label: "Tambah Artikel Baru", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/blog" label="Kembali ke Blog" />
      </div>

      <PostForm />
    </div>
  );
}
